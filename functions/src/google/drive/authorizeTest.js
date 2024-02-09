// // const {emoji} = require("../../admin/standards/emoji");
// const credential = require("../credentials.json");
// const tokenDrive = require("../tokenGoogleWorkSpace.json");
// const {mergeInFirestore} = require("../../database/firestore");


// module.exports = async (
//   // const runDrive = async (
//   runData, // run
//   // task,
//   // test = "",
//   // mTenant = "tufactura.com",
//   // uid = "SYSTEM",
//   // ip = "127.0.0.1",
//   ) => {
//     // const mTenant = "tufactura.com";
//     const uid = "SYSTEM";
//     const ip = "127.0.0.1";
//   // https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/runDrive#rundrive
//   const {google} = require("googleapis");

// //   // temporal
// //   const task = {
// //     extension: runData.extension,
// //     itemId: runData.itemId,
// //     payload: runData.payload,
// //     pathDocumentStateEntity: runData.pathDocumentStateEntity,
// //   };
// //   const run = runData.run;

//   // INIT Task values of large scope (all functions).

//   const taskValues = {};
//   taskValues.uid = uid;
//   taskValues.ip = ip;

//   await authorize(credential, createFile);

//   /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
//     async function authorize(credentials, callback) { //
//     /* eslint-disable camelcase */
//     const {client_secret, client_id, redirect_uris} = credentials.web;
//     await mergeInFirestore("/entities/CO-901318433/documents/response1", {
//       credentials: `${JSON.stringify(credentials)}`,
//       client_secret: client_secret,
//       client_id: client_id,
//       redirect_uris: redirect_uris,
//     }, true);

//     const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[1]);
//     oAuth2Client.setCredentials(tokenDrive);
//     await mergeInFirestore("/entities/CO-901318433/documents/response1", {
//       resultAuthoriza: `Paso???`,
//     }, true);

//     taskValues["authX"] = oAuth2Client;
//     return await callback(oAuth2Client);
//   }


//   /**
//   * Create folder by item (document).
//   * https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/runDrive#createfile
//   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//   * @param {string} id or attachmentFolderId.
//   * @param {string} name documentId.
//   * @param {string} mimeType of file.
//   * @param {string} payloadX processed payload.
//   * @param {string} gDriveRef path to firestore Google Drive Objects ID
//   * @param {string} originRef path to firestore origin document.
//   * @param {string} extension of file.
//   */
//   async function createFile(auth,
//     id = taskValues.id,
//     name = taskValues.name,
//     mimeType = taskValues.mimeType,
//     payloadX = taskValues.payloadX,
//     gDriveRef = taskValues.gDriveRef,
//     originRef = taskValues.originRef,
//     extension = taskValues.extension,
//   ) {
//     await mergeInFirestore("/entities/CO-901318433/documents/response1", {
//       // resultAuthoriza: `${result}`,
//       id: id,
//       name: name,
//       mimeType: mimeType,
//       payloadX: payloadX,
//       gDriveRef: gDriveRef,
//       originRef: originRef,
//       extension: extension,
//       // autha: auth,
//     }, true);
//     return new Promise((resolve, reject) => {
//       try {
//         const drive = google.drive({version: "v3", auth});

//         mergeInFirestore("/entities/CO-901318433/documents/response1", {
//           drive: `${JSON.stringify(drive)}`,
//         }, true);

//         const resource = {
//           name: name,
//           parents: [id],
//           mimeType: mimeType,
//         };


//         const media = {
//           body: payloadX,
//           mimeType: mimeType,
//         };

//         drive.files.create({resource: resource, media: media, fields: "id, webViewLink"},
//           async (err, createItem) => {
//             if (err) {
//               console.error(err);
//               return await Promise.reject(new Error(JSON.stringify({response: code.badRequest, code: err.name})));
//             } else {
//               taskValues["fileId"] = createItem.data.id;

//               const {addArray, dbRT, timeStampRealTimeX, incrementRealTimeX} = require("../../admin");
//               const toWrite = dbRT.ref(taskValues.auditRef);


//               await mergeInFirestore(gDriveRef, {
//                 [extension + "Id"]: taskValues.fileId,
//                 audit: addArray(`${taskValues.auditRef}${taskValues.fileId}`),
//               }, true);

//               taskValues["uriX"] = extension.toLowerCase();
//               taskValues[taskValues.uriX + "_download"] = `https://drive.google.com/uc?id=${taskValues.fileId}`;
//               taskValues[taskValues.uriX + "_webViewLink"] = createItem.data.webViewLink;


//               await toWrite.update({
//                 files: incrementRealTimeX(1),
//                 last: [{[name.replace(".", "_")]: taskValues.fileId}],
//                 [taskValues.fileId]: {
//                   parentId: id,
//                   name: name,
//                   itemId: task.itemId,
//                   uid: taskValues.uid,
//                   originRef: originRef,
//                   ip: taskValues.ip.text,
//                   timestamp: timeStampRealTimeX,
//                   extension: extension,
//                   [extension + "Id"]: taskValues.fileId,
//                   link: taskValues[taskValues.uriX + "_webViewLink"],
//                 },
//               });


//               if (extension === "zip") {
//                 await mergeInFirestore(originRef, {
//                   uri: {
//                     [taskValues.uriX]: taskValues[taskValues.uriX + "_download"],
//                   },
//                 }, true);
//               } else {
//                 await mergeInFirestore(originRef, {
//                   uri: {
//                     [taskValues.uriX]: taskValues[taskValues.uriX + "_webViewLink"],
//                   },
//                 }, true);
//               }
//             }
//             return resolve();
//           },
//         );
//       } catch (error) {
//         mergeInFirestore("/entities/CO-901318433/documents/response", {
//           errorCreateFile: `${error}`,
//         }, true);

//         reject(new Error(JSON.stringify(error)));
//       }
//     });
//   }
// };
