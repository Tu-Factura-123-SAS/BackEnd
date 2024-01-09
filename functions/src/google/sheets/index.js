const {users} = require("../../admin");
const {code} = require("../../admin/responses");
const {getOneDocument} = require("../../database/firestore");
// Función para importar datos de Google Sheets a Firestore

// const {emoji} = require("../../admin/emoji");
// const {code} = require("../../admin/responses");
// const {extensionX} = require("../../admin/extensionToMimeType");
const credential = require("../credentials.json");
const tokenDrive = require("../tokenGoogleWorkSpace.json");
// const {getOneDocument} = require("../../database/firestore");
// const {mergeInFirestore} = require("../../database/firestore");


const runSheet = async (
  run,
  task,
  mTenant = "tufactura.com",
  uid = "SYSTEM",
  ip = "127.0.0.1",
) => {
  const {google} = require("googleapis");
  // const {tenant} = require("../../admin/hardCodeTenants");
  const {getEmailFromDian, getNITsFromDian} = require("../../admin/utils");
  // const tenantX = tenant(mTenant); // HARDCODE debe ser automático el tenant
  // INIT Task values of large scope (all functions).
  const taskValues = {};
  taskValues.uid = uid;
  taskValues.ip = ip;


  taskValues.currentBiller = task.currentBiller || false;
  taskValues.templatePath = task.templatePath || false;
  taskValues.spreadsheetId = task.spreadsheetId || false;

  // console.log(taskValues);
  if (taskValues.currentBiller === false ||
    taskValues.templatePath === false ||
    taskValues.spreadsheetId === false
  ) {
    return Promise.reject(new Error(JSON.stringify({resposne: code.badRequest, message: "No se ha definido taskValues"})));
  }

  const ranges = ["A:ZZ"];
  const spreadsheetId = task.spreadsheetId;

  switch (run) {
  case "import":
  case "export":
  case "batch":
    return await authorize(credential, testLogin);


  default:
    return Promise.reject(new Error(`Error: runSheet() - run: ${run} not found.`));
  }


  /**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
  async function authorize(credentials, callback) {
    // eslint-disable-next-line camelcase
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      // eslint-disable-next-line camelcase
      client_id, client_secret, redirect_uris[3]);
    oAuth2Client.setCredentials(tokenDrive);
    taskValues["authX"] = oAuth2Client;
    return await callback(oAuth2Client);
  }


  /**
 * https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/runDrive#initentity
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
  async function testLogin(auth) {
    const service = google.sheets({version: "v4", auth});


    const result = await service.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: ranges,
    });


    if (task.path) {
      return Promise.reject(new Error("Error: runSheet() - path not found."));
    }

    // let numRows = 0;
    if (result.data.values) {
      const sheetTemplate = await getOneDocument(task.templatePath);


      if (sheetTemplate.response = code.ok) {
        // console.log("DATOS", result.data.values);
        const data = result.data.values;
        // console.log("PLANTILLA", sheetTemplate.data);
        const template = sheetTemplate.data;
        const dataInitEntity = template.dataInitEntity;
        const dataInitEntityBranchOffice = template.dataInitEntityBranchOffice;
        console.log({dataInitEntity});
        const payloadCustomClaims = [];


        for (const tupla of data) {
          try {
          // Datos a interpolar de la plantilla
            const currentEntityImport = tupla[template.indexNitDIAN];
            const currentUID = `${dataInitEntity.countryCode}-${currentEntityImport}`;
            const payloadEntities = dataInitEntity;
            const payloadBranchOffice = dataInitEntityBranchOffice;


            // Sí currentEntityImport es un número
            if (!isNaN(currentEntityImport)) {
              payloadCustomClaims.push({
                "F00": currentUID,
              });
              const dataInTupla = {};

              payloadBranchOffice["path"] = `/entities/${currentUID}/branchOffices/principal`;
              payloadEntities["path"] = `/entities/${currentUID}`;

              payloadEntities["emailDianRegistered"] = getEmailFromDian(currentEntityImport);


              // Sí tiene correo electrónico registrado en la DIAN
              if (payloadEntities["emailDianRegistered"]) {
                const nits = getNITsFromDian(payloadEntities["emailDianRegistered"]);

                if (nits.length > 1) {
                  payloadEntities["emailDianRegisteredNITs"] = nits;
                }
              }


              // Sí tiene UID
              let haveIUD = false;

              try {
                haveIUD = await users.getUserByUid(currentUID) || false;
                if (haveIUD) {
                  // console.log({haveIUD});
                  console.log(currentUID, "Existe UID - No Importar");
                }
              } catch (error) {
                console.log(currentUID, "No Existe UID - Verificar que no exista la entidad en Firestore");

                if (error.errorInfo.code === "auth/user-not-found") {
                  // const currentUIDdata = await getOneDocument(`/entities/${currentUID}`);
                  const currentUIDdata = await getOneDocument(`/entities/${currentUID}`);
                  // En caso de que no existe el UID, consultamos el UID como entidad
                  // Si no existe la entidad, se crea/importa


                  if (currentUIDdata.response === code.notFound) {
                  // No existe en entities, entonces poblamos la tupla

                    tupla.forEach((valueTupla, keyTupla) => {
                      dataInTupla[keyTupla] = valueTupla;
                    });
                  }
                  // Interpolamos el json en plantilla template.keysValuesEntity con los datos en dataInTupla
                  // console.log(template.keysValuesEntity);

                  // Hacemos interpolación (documentFast templatesTenant)
                  const template = template.keysValuesEntity;

                  console.log(template);


                  // const tuplaInterpolada = interpolateString(template.keysValuesEntity, dataInTupla);
                } else {
                  console.log(currentUID, error.errorInfo.code);
                }
              }


              // console.table({dataInTupla});
              // console.table({payloadEntities});
              // console.table({payloadBranchOffice});
            }
          } catch (error) {
            console.log(error.message);
          }
        }
        return Promise.resolve({
          response: code.ok,
          payloadCustomClaims: payloadCustomClaims,
          // data: result.data.values,
        });
        // });
      } else {
        return Promise.reject(new Error(JSON.stringify({resposne: code.badRequest, message: `No se encuentra ${taskValues.templatePath}`})));
      }
    }


    // const drive = google.drive({version: "v3", auth});
    // taskValues["sheets"] = sheets;
    // taskValues["drive"] = drive;
  }
};


module.exports = {runSheet};
