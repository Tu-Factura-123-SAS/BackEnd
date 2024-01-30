const {code} = require("../../../admin/responses");
const {emoji} = require("../../../admin/standards/emoji");
const {cryptoX} = require("../../cryptoX");

const cadenaAPI = async (
  mTenantRaw = "tufactura.com", // dominio
  xml, // En base64 sin comillas dobles
  pathOutXML, // Donde se almacena la respuesta
  modeAPI,
) => {
  if (xml === undefined) {
    return await Promise.reject(new Error(`cadenaAPI SIN XML ${pathOutXML}`));
  }

  // await mergeInFirestore(pathDocumentSign, {
  //   stateResponse: "entra a funcion",
  //   resultado: {mTenantRaw: mTenantRaw, xml: xml, pathOutXML: pathOutXML, modeAPI: modeAPI},
  // }, true);


  const fetch = require("node-fetch");
  const {tenant} = require("../../../admin/hardCodeTenants");
  const {mergeInFirestore} = require("../../../database/firestore");
  const tenantX = tenant(mTenantRaw);
  const {timeStampFirestoreX} = require("../../../admin");

  let uri = "";
  let token = "";
  let responseX = {};
  let pathDocumentSign = "";
  let typeSign;

  try {
    switch (modeAPI) {
    case "cadenaSandBox":
      uri = tenantX.alianza.activationSandBoxURL; // SandBox
      token = tenantX.alianza.efacturaActivationToken;
      break;


    case "cadenaActivate":
      uri = tenantX.alianza.activationURL; // Activation
      token = tenantX.alianza.efacturaActivationToken;
      break;


    case "cadenaSign":
      uri = tenantX.alianza.efacturaAuthorizationURL; // Producción
      token = tenantX.alianza.efacturaAuthorizationToken;
      break;
    default:
      return await Promise.reject(new Error(`cadenaAPI modeAPI ${modeAPI}  path: ${pathOutXML}`));
    }


    let docDelelete = pathOutXML.split("/");
    const pathDocumentStateEntity = `/entities/${docDelelete[2]}`;
    pathDocumentSign = `/entities/${docDelelete[2]}/documents/${docDelelete[4]}`;
    const itemId = `${docDelelete[2]}_${docDelelete[4]}`;

    let documentState = (docDelelete[4]).split("_");
    typeSign = documentState[0];

    docDelelete = `/ b_xml_parse/${docDelelete[2]}_${docDelelete[4]}`;

    documentState = documentState[1];
    documentState = documentState.replace("-", " ");
    const xmlSign = {};


    await mergeInFirestore(pathDocumentSign, {
      state: "DIAN",
    }, true);


    const headers = {
      "Content-Type": "text/plain",
      "efacturaAuthorizationToken": token,
    };
    const rootResponse = {};
    responseX = await fetch(uri, {
      method: "POST",
      headers: headers,
      body: `"${xml}"`,
    })
      .then((response) => response.json())
      .catch(async (error) => {
        await mergeInFirestore(pathDocumentSign, {
          stateError: `cadenaAPI fetch  ${error.name} ${error.message}`,
        }, true);

        return Promise.reject(new Error(`cadenaAPI fetch  ${error.name} ${error.message}`));
      });

    await mergeInFirestore(pathDocumentSign, {
      stateError: `cadenaAPI fetch ${JSON.stringify(responseX)}`,
    }, true);

    // responseX["signedDate"] = timeStampFirestoreX;

    let xmlResponse;
    responseX.document !== undefined ?
      xmlResponse = cryptoX("deco-base64-utf8", responseX.document):
      xmlResponse = "NO XML";

    switch (responseX.statusCode) {
    case 200:

      // responseX["signed"] = true;
      xmlSign["200"] = xmlResponse;

      if (xmlSign["200"]["response"] === code.ok) {
        responseX["xmlSigned"] = xmlSign["200"]["deco"];


        await mergeInFirestore(pathDocumentStateEntity, {
          notifications: {
            entity: {[documentState]: emoji.check}},
        }, true);


        responseX["api"] = modeAPI;
        rootResponse["Signed"] = timeStampFirestoreX;
        rootResponse["state"] = "Firmado";
      } else {
        responseX["xmlSigned"] = xmlSign["200"];
      }

      break;


    case 409:
      xmlSign["409"] = xmlResponse;

      if (xmlSign["409"]["response"] === code.ok) {
        responseX["xmlSigned"] = xmlSign["409"]["deco"];
        await mergeInFirestore(
          pathDocumentStateEntity, {
            notifications: {
              entity: {[documentState]: emoji.check + emoji.question}},
          }, true);


        responseX["api"] = modeAPI;
        rootResponse["Signed"] = timeStampFirestoreX;
        rootResponse["state"] = "Firmado";
      } else {
        await mergeInFirestore(
          pathDocumentStateEntity, {
            notifications: {
              entity: {[documentState]: emoji.stop}},
          }, true);
        responseX["xmlSigned"] = xmlSign["409"];
      }
      break;
    default:
      await mergeInFirestore(
        pathDocumentStateEntity, {
          notifications: {
            entity: {[documentState]: emoji.stop}},
        }, true);
      rootResponse["state"] = `Error ${responseX.statusCode}`;
    }

    // En caso de que exista XML, se genera la siguiente tarea en f_xml_reception.
    // Error aqui
    if (xmlResponse !== "NO XML") {
      let uuid = false;

      responseX.uuid === undefined ?
        uuid = false:
        uuid = responseX.uuid;


      if (uuid) {
        // const {runDrive} = require("../../../google/drive");
        await mergeInFirestore(pathDocumentSign, {
          itemId: itemId,
          xmlResponseDeco: xmlResponse.deco,
          pathDocumentStateEntity: pathDocumentStateEntity,
        }, true);
        // await runDrive("processDIAN", {
        //   "extension": "xml",
        //   "itemId": itemId,
        //   "payload": xmlResponse.deco,
        // },
        // pathDocumentStateEntity,
        // );
      }
    }


    delete responseX.document;
    delete responseX.xmlSigned;

    const log = {
      "state": rootResponse.state,
      "Signed": rootResponse.Signed,
      "  dianResponse": {
        [typeSign]: responseX,
      },
    };


    await mergeInFirestore(pathDocumentSign, {
      stepDIAN: `antes`,
    }, true);
    await mergeInFirestore(pathDocumentSign, log, true);

    await mergeInFirestore(pathDocumentSign, {
      stepDIAN: `despues`,
    }, true);

    return Promise.resolve(`{response: ${code.accepted}}`);
  } catch (error) {
    const log = {
      "state": `${emoji.cross} ${responseX.statusCode || "Error"}`,
      "  dianResponse": {
        [typeSign]: responseX,
      },
    };
    await mergeInFirestore(pathDocumentSign, log, true);
    return Promise.reject(new Error(`{response: ${code.badRequest}}`));
  }
};


module.exports = {cadenaAPI};
