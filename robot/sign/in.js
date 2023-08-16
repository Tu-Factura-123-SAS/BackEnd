/**
 * @file functions/robot/sign/in.js
 *
 * @description Gestiona la generación de enlaces para el inicio de sesión y el envío de correos electrónicos.
 *
 * @version 0.0.6
 * @date 26-06-2023
 * @updated 07-07-2023
 *
 * @environment production Firebase Functions
 * @project tf-tenant
 *
 * @company TÚ FACTURA 123 S.A.S.
 * @author Jovanny Medina Cifuentes <tufactura123@jovanny.co>
 * @role Software Developer Full stack - Senior
 * @see {@link https://github.com/JovannyCO}
 *
 * @language JavaScript
 * @testing_framework jest
 */

// Requerimos las dependencias para personalizar mensajes y enviar notificaciones.
const {customMessageSignIn} = require("../../admin/customMessages");
const {sendSnackBar, obfuscatedEmailX} = require("../../admin/utils");
const {sendTemplateByTriggerFirestore} = require("../sendEmail");
const {users} = require("../../admin");
const {v0} = require("../../eCommerce/v0");
const {setRolesRun} = require("../customClaims/setRolesRun");
const {getOneDocument} = require("../../database/firestore");
// const {setRolesRun} = require("../customClaims/setRolesRun");
// const {getOneDocument} = require("../../database/firestore");


/**
 * Valida el tipo de los datos de entrada.
 *
 * @param {*} input - Datos de entrada.
 * @param {string} type - Tipo esperado de los datos.
 * @throws {Error} Si los datos de entrada no son del tipo esperado.
 */
const validateInput = (input, type) => {
  if (typeof input !== type) {
    throw new Error(`Expected ${type} but received ${typeof input}`);
  }
};

/**
 * Configura y retorna los ajustes del código de acción en función de la configuración de la alianza.
 *
 * @param {Object} tenantTemplate - Configuración de la alianza.
 * @return {Object} Ajustes del código de acción.
 */
const generateActionCodeSettings = (tenantTemplate) => {
  // Validamos que la plantilla de la alianza sea un objeto
  validateInput(tenantTemplate, "object");

  // Obtenemos el dominio y la URL de la alianza
  const domain = tenantTemplate.setup.authDomain;
  const isLocalHost = domain === "localhost";
  const url = isLocalHost ? "http://localhost:5000/actualiza-tu-RUT" : tenantTemplate.url.app + "/actualiza-tu-RUT";

  // Retornamos los ajustes del código de acción
  return {
    url,
    handleCodeInApp: true,
    dynamicLinkDomain: "localhost5000.page.link",
  };
};

/**
 * Genera y retorna el correo electrónico y la respuesta basados en el registro del usuario y el nombre de la alianza.
 *
 * @param {Object} userRecord - Registro del usuario.
 * @param {string} tenantName - Nombre de la alianza.
 * @return {Object} Correo electrónico, nombre a mostrar y respuesta.
 */
const generateEmailAndResponse = (userRecord, tenantName) => {
  // Validamos que el registro del usuario sea un objeto y que el nombre de la alianza sea una cadena
  validateInput(userRecord, "object");
  validateInput(tenantName, "string");

  // Obtenemos el nombre y el correo electrónico del usuario
  const displayName = userRecord.displayName || " ¶¶_displayName";
  const emailAddress = userRecord.email;

  // Obtenemos el correo electrónico ofuscado y generamos la respuesta
  const obfuscatedEmail = obfuscatedEmailX(emailAddress);
  const response = customMessageSignIn.es
    .replace("{obfuscatedEmail}", obfuscatedEmail)
    .replace("{tenant}", tenantName);

  // Retornamos el correo electrónico, el nombre a mostrar y la respuesta
  return {
    emailAddress,
    displayName,
    response,
  };
};

/**
 * Maneja el proceso de envío de un correo electrónico con un enlace para iniciar sesión.
 *
 * @async
 * @param {Object} ip - Dirección IP del cliente.
 * @param {Object} data - Datos enviados por el cliente.
 * @param {string} origin - Origen de la solicitud.
 * @param {string} uid - Identificación del usuario.
 * @param {string} tenantName - Nombre de la alianza.
 * @param {string} biller - Opcional, Identificación de la entidad cuando es diferente a UID.
 * @param {string} branchOfficeId - Opcional, Identificación de la sucursal.
 * @return {Promise<Object>} Resultado del envío del correo electrónico.
 */
const signIn = async (
  ip,
  data,
  origin,
  uid,
  tenantName,
) => {
  // Validamos los datos de entrada
  validateInput(ip, "object");
  validateInput(data, "object");
  validateInput(origin, "string");
  validateInput(uid, "string");
  validateInput(tenantName, "string");


  try {
    // INICIO functions/eCommerce/customerJourney/index.js
    const tenantTemplate = await v0(tenantName);
    // const alliance = tenantTemplate.eCommerce[5];
    // const allianceBranchOffice = tenantTemplate.eCommerce[6];
    // const landingPageV0app = tenantTemplate.landingPage.split("/")[1];
    // const biller = tenantTemplate.eCommerce[2];
    // const billerBranchOffice = tenantTemplate.eCommerce[3];

    const individualCustomerJourneyData = await getOneDocument( `/entities/${uid}/me/journey`);

    // const refCustomersJourneys = `/entities/${alliance}/branchOffices/${allianceBranchOffice}/${landingPageV0app}/${biller}_${billerBranchOffice}/customersJourneys/${uid}`;
    // const dataCustomersJourneys = await getOneDocument(refCustomersJourneys);

    console.log("individualCustomerJourneyData: ", individualCustomerJourneyData);
    // console.log("dataCustomersJourneys: ", dataCustomersJourneys);


    // Ejecutamos setRolesRun antes de generar el enlace de inicio de sesión
    // const responseRolesRun = await setRolesRun(uid, {[`${biller}_${branchOfficeId}`]: "No set biller"});
    const responseRolesRun = await setRolesRun(uid, {[`${uid}_principal`]: "No set biller"});
    console.log("responseRolesRun: ", responseRolesRun);
    // FIN functions/eCommerce/customerJourney/index.js

    // Obtenemos el registro del usuario
    const userRecord = await users.getUserByUid(uid);

    // Si hay un error en el registro del usuario, lanzamos una excepción
    if (userRecord.errorInfo) {
      throw new Error(userRecord.errorInfo.message);
    }


    // Generamos los ajustes y obtenemos el enlace de inicio de sesión
    const actionCodeSettings = generateActionCodeSettings(tenantTemplate);
    const signInLink = await users.generateSignInWithEmailLink(userRecord.email, actionCodeSettings);

    // Preparamos la información del correo y lo enviamos
    const {emailAddress, displayName, response} = generateEmailAndResponse(userRecord, tenantName);
    await sendTemplateByTriggerFirestore(emailAddress, ip, uid, tenantName, displayName, signInLink, tenantTemplate);

    // Retornamos una respuesta de éxito
    return sendSnackBar(customMessageSignIn.es_send, "success", uid, "", data, response);
  } catch (error) {
    // En caso de error, lo registramos y retornamos una respuesta de error
    // console.error("Error en signIn durante el proceso de inicio de sesión: ", error.message);

    const errorDetails = {
      error: error.message,
      data,
      client: {
        ip: ip.raw,
        origin,
      },
    };

    return sendSnackBar(customMessageSignIn.es_error, "error", uid, errorDetails, data);
  }
};

module.exports = {
  signIn,
};
