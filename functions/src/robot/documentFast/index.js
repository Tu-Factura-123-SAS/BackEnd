/* eslint-disable no-case-declarations */

const documentFast = async (
  currentUser,
  document,
  task = false,
) => {
  const {code} = require("../../admin/responses");
  const values = {};
  values["currentUser"] = currentUser;
  values["document"] = document;
  values["task"] = task;


  // Sin usuario NO autorizado
  if (values["currentUser"] === "anonymous@localhost" ||
  values["currentUser"] === undefined ||
  values["currentUser"] === "anonymous@us-central1-tu-factura123.cloudfunctions.net"
  ) {
    // TEMPORAL, se abre hueco de seguridad mientras DEVELOPMENT.
    const {customMessageDocumentFast} = require("../../admin/customMessages");
    // console.error(customMessageDocumentFast.es_unauthorized);
    values["currentUser"] = "UNAUTHORIZED";
    return await Promise.reject(new Error(customMessageDocumentFast.es_unauthorized));
  }

  // Cuando no hay tarea se establece en falso (task)
  if (values["task"] === " ¶¶_task") {
    values["task"] = false;
  }


  try {
    const {getTextPdf} = require("./aTextPdf");
    const aTextPdf = await getTextPdf("aTextPdf", document);
    if (aTextPdf.response === code.ok) values["document"]["aTextPdf"] = aTextPdf.values.aTextPdf;

    const {runDrive} = require("../../google/drive");

    await runDrive("createFolder",
      {"itemId": `${values["document"].billing.biller}_${values["document"].documentId}`});

    const {dbFS, timeStampFirestoreX} = require("../../admin");
    values["document"]["created"] = timeStampFirestoreX;

    const batch = dbFS.batch();

    switch (values["document"].document.documentType) { // agregar documento soporte
    case "02": // FACTURA ELECTRÓNICA DE EXPORTACIÓN
    case "01": // FACTURA ELECTRÓNICA DE VENTA
      const {getCufe} = require("../dian/cufe");

      const tmpCufe = {
        response: code.ok,
        data: values["document"],
      };

      const withCUFE = await getCufe(tmpCufe);

      if (withCUFE.response === code.ok) {
        const documentRef = dbFS.doc(`/entities/${values["document"].billing.biller}/documents/${values["document"].documentId}`);


        values["document"]["cufeError"] = withCUFE.cufeError;
        values["document"]["cufeSha384"] = withCUFE.sha384;
        values["document"]["cufeValues"] = withCUFE.cufeValues;
        values["document"]["uri"] = {};
        values["document"].uri["xml"] = false;
        values["document"].uri["pdf"] = false;
        values["document"].uri["zip"] = false;

        batch.set(documentRef, values["document"]);
      } else {
        return await Promise.reject(new Error("documentFast getCufe:" + JSON.stringify(withCUFE)));
      }
      break;

    case "91": // NOTA CRÉDITO
    case "92": // NOTA DÉBITO
      const {getCude} = require("../dian/cude");

      const tmpCude = {
        response: code.ok,
        data: values["document"],
      };

      const withCUDE = await getCude(tmpCude);

      if (withCUDE.response === code.ok) {
        const documentRef = dbFS.doc(`/entities/${values["document"].billing.biller}/documents/${values["document"].documentId}`);


        values["document"]["cudeError"] = withCUDE.cudeError;
        values["document"]["cudeSha384"] = withCUDE.sha384;
        values["document"]["hash"] = withCUDE.hash;
        values["document"]["cudeValues"] = withCUDE.cudeValues;

        batch.set(documentRef, values["document"]);
      } else {
        return await Promise.reject(new Error("documentFast getCude:" + JSON.stringify(withCUFE)));
      }
      break;


    default:
      return await Promise.reject(new Error("documentFast documentType:" + JSON.stringify(values["document"].document.documentType)));
    }


    if (values["task"] !== false) {
      values["document"]["state"] = "Generando XML";

      const taskRef = dbFS.doc(`/ b_xml_parse/${values["document"].billing.biller}_${values["document"].documentId}`);
      batch.set(taskRef, values.task);
    }

    await batch.commit();
    return await Promise.resolve({
      response: code.accepted,
    });
  } catch (error) {
    return await Promise.reject(new Error(`{documentFast: ${error.message}}`));
  }
};

module.exports = {documentFast};
