// Importar módulos necesarios
const {code} = require("../admin/responses");
const {getOneDocument, mergeInFirestore} = require("../database/firestore");
const {v0} = require("./v0");

/**
 * Ejecuta una función y guarda su resultado en caché.
 *
 * @param {string} fx - Función a ejecutar.
 * @param {string} parameters - Parámetros para la función y la caché.
 * @return {Promise<object>} Objeto con el resultado de la función.
 */
const runZcache = async (fx, parameters) => {
  const paramsX = parameters.split("|");
  const tenantX = paramsX[0];

  let currentCache = {};
  let template = {};

  switch (fx) {
  case "signUp":
    // await runZcache("signUp", `${currentPrivateV0.setup.authDomain}|${targetEntity}|principal|${targetEntity}`);
    /*
      Ejemplo de entrada:
{
"call":"run",
"callGroup":"cache",
"fx":"signUp",
"parameters": "tufactura.com|CO-13|principal|ALIAS"
}
      */
    // Obtener la plantilla para signUp
    template = await getOneDocument(`/zcacheTemplate/${fx}`);

    if (template.response === code.ok) {
      // Preparar dataX para interpolación
      const dataX = {};
      const aliasX = paramsX[3] === "ALIAS" ? paramsX[1] : paramsX[3] || paramsX[1];
      dataX["uidX"] = paramsX[1];
      dataX["uidBranchOfficeX"] = paramsX[2];
      const tenantV0 = await v0(tenantX);
      dataX["eCommerce2"] = tenantV0.eCommerce[2];
      dataX["eCommerce3"] = tenantV0.eCommerce[3];

      // Interpolar campos.
      const {interpolateString} = require("../admin/utils");
      const queryViews = interpolateString(template.data.queries.queryViews.collection, dataX);
      // const queryPersonalizedTemplates = interpolateString(template.data.queries.queryPersonalizedTemplates.collection, dataX);
      template.data.queries.queryViews.collection = queryViews;
      // template.data.queries.queryPersonalizedTemplates.collection = queryPersonalizedTemplates;

      // Ruta para el paquete de caché
      const bundlePath = `/zcache/${tenantX}_${aliasX}`;

      // Establecer TTL para que expire en menos de 72 horas
      const {timeStampFirestoreX} = require("../admin");
      template.data["TTL"] = timeStampFirestoreX;

      // Combinar y guardar en Firestore
      await mergeInFirestore(bundlePath, template.data, false);
      return Promise.resolve({response: code.created});
    }

    return Promise.resolve({response: template.response});

  case "{uidX}_templates": {
    // await runZcache("{uidX}_templates", `${currentPrivateV0.setup.authDomain}|${targetEntity}|principal|${targetEntity}`);
    // Obtener la plantilla para signUp
    template = await getOneDocument(`/zcacheTemplate/${fx}`);

    if (template.response === code.ok) {
      const dataX = {};
      dataX["uidX"] = paramsX[0];

      // Interpolar campos.
      const {interpolateString} = require("../admin/utils");
      const queryPersonalizedTemplates = interpolateString(template.data.queries.queryPersonalizedTemplates.collection, dataX);
      console.warn("dentro DE SETROLESRUN", JSON.stringify({queryPersonalizedTemplates: queryPersonalizedTemplates, dataX: dataX, parameters: parameters}));

      template.data.queries.queryPersonalizedTemplates.collection = queryPersonalizedTemplates;

      // Ruta para el paquete de caché
      const bundlePath = `/zcache/${dataX.uidX}_templates`;

      // Establecer TTL para que expire en menos de 72 horas
      const {timeStampFirestoreX} = require("../admin");
      template.data["TTL"] = timeStampFirestoreX;

      // Combinar y guardar en Firestore
      await mergeInFirestore(bundlePath, template.data, false);
      return Promise.resolve({response: code.created});
    }
    return Promise.resolve({response: template.response});
  }
  case "exist":
    /*
      Ejemplo de entrada:
{
"call":"run",
"callGroup":"cache",
"fx":"signUp",
"parameters": "tufactura.com|CO-13|principal"
}
      */
    // Verificar si el caché existe
    currentCache = await getOneDocument(`/zcache/${parameters}`);
    if (currentCache.response === code.ok) {
      return Promise.resolve({response: code.ok});
    } else {
      return Promise.resolve({response: code.noContent});
    }

  default:
    // Función no válida
    return Promise.resolve({response: code.badRequest});
  }
};

// Exportar la función runZcache
module.exports = {
  runZcache,
};
