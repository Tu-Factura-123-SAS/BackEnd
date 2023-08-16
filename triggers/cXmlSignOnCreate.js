module.exports = async (snap, context) => {
  const dataPath = context.params.dataPath;
  // const {mergeInFirestore} = require("../database/firestore");

  // const {dbFS} = require("../admin");
  // const {code} = require("../admin/responses");
  const {cadenaAPI} = require("../robot/dian/cadena/api");
  const data = snap.data();


  let cadenaMessage = "";
  data["function"] !== undefined ?
    cadenaMessage = `${data["function"]}  document: ${dataPath}`:
    cadenaMessage = `UNDEFINED  document: ${dataPath}`;

  // ACTIVAR SEGURIDAD BLOQUENDO LOCALHOST
  // https://github.com/JovannyCO/FacturaDIAN-Hosting/issues/232
  if (data["tenant"] === "localhost" || data["tenant"] === undefined) {
    // await dbFS.doc(`/ c_xml_sign/${dataPath}`).delete();
    // return await Promise.reject(new Error(`LOCALHOST UNAUTHORIZED cXmlSignOnCreate  function: ${data["function"]}  document: ${dataPath}`));
  }

  let xml = {};
  // const task = ();


  try {
    // eslint-disable-next-line no-unused-vars
    xml = await cadenaAPI(data["tenant"], data["base64"], data["xmlPath"], data["function"]);

    // console.log(xml);
    /* if (
      xml.statusCode === code.ok ||
      xml.errorMessage === "Batch en proceso de validación."
    ) {
      dbFS.doc(`${data[" task"].xmlPath}`, xml, {merge: true});
      await dbFS.doc(`/ c_xml_sign/${dataPath}`).delete();


      return await Promise.resolve();
    } else {
      return await Promise.reject(new Error(`cXmlSignOnCreate  function: ${cadenaMessage}`));
    } */
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(new Error(`TRY FAIL cXmlSignOnCreate  function: ${cadenaMessage} ${error.message}`));
  }
};
