// const {setCufe} = require("../robot/dian/cufe");
const {code} = require("../admin/responses");
const {emoji} = require("../admin/standards/emoji");


module.exports = async (snap, context) => {
  const {dbFS} = require("../admin");
  const batch = dbFS.batch();

  const {setTemplateXML} = require("../robot/dian/xml");

  const dataPath = context.params.dataPath;
  const data = snap.data();

  let logRef = dataPath.split("_");
  const documentLog = (logRef[2]).replace("-", " ");
  logRef = dbFS.doc(`/entities/${logRef[0]}`);
  const taskRef = dbFS.doc(`/ c_xml_sign/${dataPath}`);
  const deleteRef = dbFS.doc(`/ b_xml_parse/${dataPath}`);

  const process = {};
  process["xml"] = {};


  try {
    process["xml"] = await setTemplateXML(
      data[" task"]["templatePath"], // Plantilla XML
      `/ b_xml_parse/${dataPath}`,
    );

    if (process.xml.response === code.created) {
      batch.set(taskRef, {
        base64: process.xml.base64,
        b_xml_parse: `/ b_xml_parse/${dataPath}`,
        function: data[" task"]["function"],
        xmlPath: data[" task"]["xmlPath"],
        templatePath: data[" task"]["templatePath"],
        tenant: data[" task"]["tenant"],
      });

      batch.set(logRef, {
        notifications: {
          entity: {[documentLog]: emoji.outbox},
        },
      }, {
        merge: true,
      });
      const {haveRole} = require("../robot/sign/role");
      const isDeveloper = haveRole(
        data.uid, // Developer
        "developer",
        data.uid, // Developer
      );

      // Elimina la tarea cualquier usuario que no sea Developer
      if (isDeveloper.haveRole === false) {
        batch.delete(deleteRef);
      }


      await batch.commit();


      return await Promise.resolve();
    } else {
      dbFS.doc(`/ c_xml_sign/${dataPath}`, {
        notifications: {
          entity: {[documentLog]: emoji.cross},
        },
      }, {
        merge: true,
      });
      return await Promise.reject(new Error(`xmlGeneratorOnCreate ${dataPath}  XML ${process.xml.response}`));
    }
  } catch (error) {
    return await Promise.reject(new Error(`xmlGeneratorOnCreate ${dataPath}  Error: ${error.name} ${error.message}`));
  }
};
