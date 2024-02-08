const {emoji} = require("../../admin/standards/emoji");
const {code} = require("../../admin/responses");
const {extensionX} = require("../../admin/extensionToMimeType");
const credential = require("../credentials.json");
const tokenDrive = require("../tokenGoogleWorkSpace.json");
const {getOneDocument} = require("../../database/firestore");
const {mergeInFirestore} = require("../../database/firestore");


module.exports = async (
  // const runDrive = async (
  runData, // run
  // task,
  // test = "",
  // mTenant = "tufactura.com",
  // uid = "SYSTEM",
  // ip = "127.0.0.1",
  ) => {
    const mTenant = "tufactura.com";
    const uid = "SYSTEM";
    const ip = "127.0.0.1";
  // https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/runDrive#rundrive
  const {google} = require("googleapis");
  const {tenant} = require("../../admin/hardCodeTenants");
  const {howOften} = require("../../admin/utils");
  const tenantX = await tenant(mTenant); // HARDCODE debe ser automático el tenant

  // temporal
  const task = {
    extension: runData.extension,
    itemId: runData.itemId,
    payload: runData.payload,
    pathDocumentStateEntity: runData.pathDocumentStateEntity,
  };
  const run = runData.run;

  // INIT Task values of large scope (all functions).

  const taskValues = {};
  taskValues.uid = uid;
  taskValues.ip = ip;
  const {PassThrough} = require("stream");
  const zipPassThrough = new PassThrough();

  if (howOften(task.itemId, "_") === 2) {
    // itemId = ENTITY_TYPE_CONSECUTIVE

    taskValues["itemId"] = task.itemId;
    taskValues["itemIdArray"] = (task.itemId).split("_");
    taskValues["entity"] = taskValues.itemIdArray[0];
    taskValues["type"] = taskValues.itemIdArray[1];
    taskValues["documentNumber"] = taskValues.itemIdArray[2];

    // Store in folder based on document type (HARDCODE: tenant domain presets).
    taskValues["documentId"] = taskValues.type + "_" + taskValues.documentNumber;
    taskValues["parentFolder"] = tenantX.drive.type[taskValues.type];
    taskValues["typeName"] = tenantX.drive.typeName[taskValues.type];
    taskValues["parentFolderRef"] = `/entities/${taskValues.entity}/drive/${taskValues.parentFolder}`;
    taskValues["gDriveRef"] = `/entities/${taskValues.entity}/drive/${taskValues.documentId}`; // Firestore - Google Drive Objects ID
    taskValues["originRef"] = `/entities/${taskValues.entity}/${taskValues.parentFolder}/${taskValues.documentId}`;
    taskValues["auditRef"] = taskValues.originRef;
    // await mergeInFirestore("/entities/CO-901318433/documents/response", {
    //   taskValues: `${JSON.stringify(taskValues)}`,
    // }, true);
  }

  // extension
  if (task.extension) {
    taskValues["extension"] = (task.extension).toLowerCase();
    taskValues["mimeType"] = extensionX[taskValues.extension];
    taskValues["name"] = taskValues.documentNumber + "." + taskValues.extension;
    const {cryptoX} = require("../../robot/cryptoX");


    switch (taskValues.extension) {
    case "pdf":
      if (tenantX.pdfControler === "jsPDF") {
        taskValues["pdf"] = task.payload.split(",")[1];
        taskValues["pdf"] = cryptoX("deco-base64-utf8", taskValues.pdf);
        taskValues["payloadX"] = taskValues.pdf.deco;
      }
      break;


    case "xml": {
      // Se entiende que solo se suben las respuestas válidas de la DIAN.
      // taskValues["payloadX"] = task.payload;

      const payload = await getOneDocument(`/entities/CO-901318433/documents/EB_FE24-57`);
      taskValues["payloadX"] = payload.data.xmlResponseDeco;

      // la colección f_xml_reception recibe y procesa el XML
      await mergeInFirestore(`/ f_xml_reception/${taskValues.itemId}`, {dian: taskValues.payloadX || false});
    }
      break;

    case "zip": {
      // taskValues["payloadX"] = task.payload;
      const payload = await getOneDocument(`/entities/CO-901318433/documents/EB_FE24-57`);
      taskValues["payloadX"] = payload.data.xmlResponseDeco;
      break;
    }

    default:
      return await Promise.reject(new Error(JSON.stringify({response: code.badRequest, callGroup: run, message: `${tenantX.pdfControler} no implementado para el tenent`})));
    }
    // await mergeInFirestore("/entities/CO-901318433/documents/response", {
    //   name: run,
    // }, true);
  }

  switch (run) {
  case "initEntity":
    // https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/runDrive#initentity
    // taskValues["entityDrive"] = await getOneDocument(`/entities/${task}/drive/${task}`);
    // // console.log(taskValues.entityDrive);
    // if (taskValues.entityDrive.response === code.ok) {
    //   return Promise.reject(new Error(JSON.stringify({response: code.badRequest})));
    // } else {
    //   return await authorize(credential, initEntity);
    //   // return Promise.resolve(JSON.stringify({response: code.created}));
    // }
    break;

  case "createFolder":
    // https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/runDrive#createfolder
    // taskValues["getParentFolderId"] = await getOneDocument(taskValues.parentFolderRef);
    // if (taskValues.getParentFolderId.response === code.ok) {
    //   taskValues["parentFolderId"] = taskValues.getParentFolderId.data.id;
    // } else {
    //   return await Promise.reject(new Error(JSON.stringify({response: code.badRequest, callback: run, message: "Entidad no inicializada"})));
    // }

    // // Crear SubFolder
    // taskValues["getItemFolderId"] = await getOneDocument(taskValues.gDriveRef);
    // if (taskValues.getItemFolderId.response === code.ok) {
    //   // return Promise.resolve({response: code.created});

    //   // return await Promise.reject(new Error(JSON.stringify({response: code.badRequest, callback: run, message: "El folder ya existe"})));
    //   // return await Promise.resolve(new Error(JSON.stringify({response: code.created, message: "El folder ya existe"})));
    // } else {
    //   await authorize(credential, createFolder);
    //   // await createPermissions(taskValues.authX);
    // }

    // return Promise.resolve({response: code.created});
    break;

  case "upLoadFile":
    // console.log(taskValues.gDriveRef);
    // taskValues["getParentFolderId"] = await getOneDocument(taskValues.gDriveRef);
    // // console.log(taskValues.getParentFolderId);

    // if (taskValues.getParentFolderId.data.id) {
    //   taskValues["id"] = taskValues.getParentFolderId.data.id;
    // } else {
    //   return await Promise.reject(new Error(JSON.stringify({
    //     response: code.badRequest,
    //     callback: run,
    //     message: "No esta creado el folder " + taskValues.gDriveRef})));
    // }

    // await mergeInFirestore("/entities/CO-901318433/documents/response", {
    //   taskValuesUpdate: `${JSON.stringify(taskValues)}`,
    // }, true);

    // // await authorize(credential, createFile);
    // // await createPermissions(taskValues.authX);
    // return await Promise.resolve({response: code.created});

    break;

  case "processDIAN": {
  // https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/runDrive#processdian
    /* console.log("¶¶§¶¶ espera...");
    await sleep(5000);
    console.log("¶¶§¶¶ espera 5 segundos");
    await sleep(5000);
    console.log("¶¶§¶¶ espera 10 segundos");
    await sleep(5000);
    console.log("¶¶§¶¶ espera 15 segundos");
    await sleep(5000);
    console.log("¶¶§¶¶ espera 20 segundos ¡Acción!"); */


    taskValues["getParentFolderId"] = await getOneDocument(taskValues.gDriveRef);
    await mergeInFirestore("/entities/CO-901318433/documents/response", {dataA: `${JSON.stringify(taskValues.getParentFolderId.data.id)}`}, true);

    if (taskValues.getParentFolderId.data.id) {
      taskValues["id"] = taskValues.getParentFolderId.data.id;
    } else {
      // await mergeInFirestore("/entities/CO-901318433/documents/response", {
      //   stateError: `No esta creado el folder ${taskValues.gDriveRef}`,
      // }, true);

      return await Promise.reject(new Error(JSON.stringify({
        response: code.badRequest,
        callback: run,
        message: "No esta creado el folder " + taskValues.gDriveRef})));
    }

    await authorize(credential, createFile);// AQUI QUEDAMOS
    // await authorize(credential, createPermissions);
    await createPermissions(taskValues.authX);

    taskValues["thisItem"] = await getOneDocument(taskValues.gDriveRef);

    await mergeInFirestore("/entities/CO-901318433/documents/response", {
      taskValuesData: `${JSON.stringify(taskValues.thisItem.data)}`,
    }, true);

    if (
      taskValues.thisItem.data.xmlId && // {true} XML in Drive
      taskValues.thisItem.data.pdfId && // {true} PDF in Drive
      !taskValues.thisItem.data.zipId // {false} ZIP NOT in Drive
    ) {
      // await authorize(credential, createZip);


      await createZip(taskValues.authX);
      mergeInFirestore("/entities/CO-901318433/documents/respons3", {
        zipi: "regresa a func principal",
        // authX: {...taskValues},
        extension: "zip",
      }, true);

      await createFile(
        taskValues.authX,
        taskValues.id,
        taskValues.duplaNameZip,
        extensionX.zip,
        zipPassThrough,
        (taskValues.gDriveRef),
        (taskValues.originRef),
        "zip",
      );

      await authorize(credential, createPermissions);
      await createPermissions(taskValues.authX);

      await sendEmailZip();
    }
    return await Promise.resolve({response: code.created});
  }
    // break;

  default:
    return await Promise.reject(new Error(JSON.stringify({runDrive: code.badRequest, callback: run})));
  }


  /**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
  async function authorize(credentials, callback) {
    /* eslint-disable camelcase */
    const {client_secret, client_id, redirect_uris} = credentials.web;
    await mergeInFirestore("/entities/CO-901318433/documents/response1", {
      credentials: `${JSON.stringify(credentials)}`,
      client_secret: client_secret,
      client_id: client_id,
      redirect_uris: redirect_uris,
    }, true);
    try {
      // return await Promise.reject(new Error(JSON.stringify({oAuth2Client: oAuth2Client})));
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[1]);
      await mergeInFirestore("/entities/CO-901318433/documents/response1", {
        resultAuthoriza: `Paso???`,
      }, true);
      console.log(oAuth2Client);
      oAuth2Client.setCredentials(tokenDrive);
      taskValues["authX"] = oAuth2Client;
      return await callback(oAuth2Client);
    } catch (e) {
      await mergeInFirestore("/entities/CO-901318433/documents/response1", {
        error: `${JSON.stringify(e)}`,
      }, true);
    }
  }


//   /**
//  * https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/runDrive#initentity
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
//   async function initEntity(auth) {
//     return new Promise((resolve, reject)=>{
//       try {
//         const drive = google.drive({version: "v3", auth});
//         const entityRef = `/entities/${task}/drive/${task}`;


//         // Crear carpeta entity
//         const rootFolderId = tenantX.drive.entitiesFolderId;
//         const subFolders = tenantX.drive.subFolders; // []
//         const entityfileMetadata = {
//           "name": task,
//           "parents": [rootFolderId],
//           "mimeType": extensionX.folder,
//         };

//         drive.files.create({resource: entityfileMetadata, fields: "id"},
//           async (err, folderEntity) => {
//             if (err) {
//               console.error(err);
//             } else {
//               taskValues["folderEntityId"] = folderEntity.data.id;
//               await mergeInFirestore(entityRef, {
//                 entities: true,
//                 breadCrumbs: `/entities/${task}/`,
//                 id: taskValues.folderEntityId,
//               });


//               // Crear subCarpetas
//               subFolders.forEach(async (subFolder) => {
//                 const subFolderMetadata = {
//                   "name": subFolder,
//                   "mimeType": extensionX.folder,
//                   "parents": [taskValues.folderEntityId],
//                 };

//                 drive.files.create({resource: subFolderMetadata, fields: "id"},
//                   async (err, folderEntity) => {
//                     if (err) {
//                       console.error(err);
//                     } else {
//                       await mergeInFirestore(`/entities/${task}/drive/${subFolder}`, {
//                         [task]: true,
//                         id: folderEntity.data.id,
//                         breadCrumbs: `/entities/${task}/${subFolder}/`,
//                       });
//                     }
//                   });
//               });
//             }
//             return resolve();
//           });
//       } catch (error) {
//         return reject(new Error(JSON.stringify(error)));
//       }
//     });
//   }


  /**
  * Create folder by item (document).
  * https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/runDrive#createfile
  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
  * @param {string} id or attachmentFolderId.
  * @param {string} name documentId.
  * @param {string} mimeType of file.
  * @param {string} payloadX processed payload.
  * @param {string} gDriveRef path to firestore Google Drive Objects ID
  * @param {string} originRef path to firestore origin document.
  * @param {string} extension of file.
  */
  async function createFile(auth,
    id = taskValues.id,
    name = taskValues.name,
    mimeType = taskValues.mimeType,
    payloadX = taskValues.payloadX,
    gDriveRef = taskValues.gDriveRef,
    originRef = taskValues.originRef,
    extension = taskValues.extension,
  ) {
    await mergeInFirestore("/entities/CO-901318433/documents/response2", {
      // resultAuthoriza: `${result}`,
      createFileZip: {
        id: id,
        name: name,
        mimeType: mimeType,
        // payloadX: payloadX,
        gDriveRef: gDriveRef,
        originRef: originRef,
        extension: extension,
      },
    }, true);
    return new Promise((resolve, reject) => {
      try {
        const drive = google.drive({version: "v3", auth});

        mergeInFirestore("/entities/CO-901318433/documents/response1", {
          drive: `${JSON.stringify(drive)}`,
        }, true);

        const resource = {
          name: name,
          parents: [id],
          mimeType: mimeType,
        };


        const media = {
          body: payloadX,
          mimeType: mimeType,
        };

        drive.files.create({resource: resource, media: media, fields: "id, webViewLink"},
          async (err, createItem) => {
            if (err) {
              console.error(err);
              return await Promise.reject(new Error(JSON.stringify({response: code.badRequest, code: err.name})));
            } else {
              taskValues["fileId"] = createItem.data.id;

              const {addArray, dbRT, timeStampRealTimeX, incrementRealTimeX} = require("../../admin");
              const toWrite = dbRT.ref(taskValues.auditRef);
              mergeInFirestore("/entities/CO-901318433/documents/response1", {
                taskValues: `${JSON.stringify(taskValues)}`,
              }, true);

              await mergeInFirestore(gDriveRef, {
                [extension + "Id"]: taskValues.fileId,
                audit: addArray(`${taskValues.auditRef}${taskValues.fileId}`),
              }, true);

              taskValues["uriX"] = extension.toLowerCase();
              taskValues[taskValues.uriX + "_download"] = `https://drive.google.com/uc?id=${taskValues.fileId}`;
              taskValues[taskValues.uriX + "_webViewLink"] = createItem.data.webViewLink;

              await toWrite.update({
                files: incrementRealTimeX(1),
                last: [{[name.replace(".", "_")]: taskValues.fileId}],
                [taskValues.fileId]: {
                  parentId: id,
                  name: name,
                  itemId: task.itemId,
                  uid: taskValues.uid,
                  originRef: originRef,
                  // ip: taskValues.ip.text,
                  ip: taskValues.ip,
                  timestamp: timeStampRealTimeX,
                  extension: extension,
                  [extension + "Id"]: taskValues.fileId,
                  link: taskValues[taskValues.uriX + "_webViewLink"],
                },
              });


              if (extension === "zip") {
                await mergeInFirestore(originRef, {
                  uri: {
                    [taskValues.uriX]: taskValues[taskValues.uriX + "_download"],
                  },
                }, true);
              } else {
                await mergeInFirestore(originRef, {
                  uri: {
                    [taskValues.uriX]: taskValues[taskValues.uriX + "_webViewLink"],
                  },
                }, true);
              }
            }
            return resolve();
          },
        );
      } catch (error) {
        mergeInFirestore("/entities/CO-901318433/documents/response2", {
          errorCreateFile: `${error}`,
        }, true);

        reject(new Error(JSON.stringify(error)));
      }
    });
  }


  /**
  * Create folder by item (document).
  * https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/runDrive#createfile
  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
  * @param {string} fileId or attachmentFolderId.
  */
  async function createPermissions(auth,
    fileId = taskValues.fileId,
  ) {
    return new Promise((resolve, reject) => {
      try {
        const drive = google.drive({version: "v3", auth});

        const permission = {
          "type": "anyone",
          "role": "reader",
        };

        drive.permissions.create({resource: permission, fileId: fileId, fields: "id"},
          async (err) => {
            if (err) {
              return reject(new Error(JSON.stringify({response: code.unauthorized, code: err.name})));
            }
            mergeInFirestore("/entities/CO-901318433/documents/response1", {
              createPermissions: "finaliza createPermission",
            }, true);
            return resolve();
          });
      } catch (error) {
        return reject(new Error(JSON.stringify(error)));
      }
    });
  }


  // /**
  // * Create folder (document).
  // * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
  // * @param {string} gDriveRef path Google Drive ref in firestore.
  // * @param {string} originRef path to firestore document.
  // * @param {string} documentId Forlder name.
  // * @param {string} parentFolder name.
  // * @param {string} parentFolderId or attachmentFolderId.
  // */
  // async function createFolder(auth,
  //   // https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/runDrive#createfolder
  //   gDriveRef = taskValues.gDriveRef,
  //   originRef = taskValues.originRef,
  //   documentId = taskValues.documentId,
  //   parentFolder = taskValues.parentFolder,
  //   parentFolderId = taskValues.parentFolderId,
  // ) {
  //   return new Promise((resolve, reject) =>{
  //     try {
  //       const drive = google.drive({version: "v3", auth});


  //       const resource = {
  //         "name": documentId,
  //         "mimeType": extensionX["folder"],
  //         "parents": [parentFolderId],
  //       };

  //       drive.files.create({resource: resource, fields: "id"},
  //         async (err, createItem) => {
  //           if (err) {
  //             console.error(err);
  //             // return await Promise.reject(new Error(JSON.stringify({response: code.badRequest, code: err.name})));
  //           } else {
  //             taskValues["id"] = createItem.data.id;

  //             const toMerge = { // HARDCODE: Debe estar dentro de la estructura del tenant
  //               xmlId: false,
  //               pdfId: false,
  //               zipId: false,
  //               id: taskValues.id,
  //               breadCrumbs: originRef,
  //               [parentFolder]: true,
  //             };

  //             await mergeInFirestore(gDriveRef, toMerge, true);
  //           }
  //         },
  //       );
  //       return resolve();
  //     } catch (error) {
  //       return reject(new Error(JSON.stringify(error)));
  //     }
  //   });
  // }

  /**
  * Create folder by item (document).
  */
  async function sendEmailZip() {
    try {
      taskValues["getItem"] = await getOneDocument(taskValues.originRef);
      taskValues["getBiller"] = await getOneDocument(`entities/${taskValues.entity}`);
      taskValues["getBuyer"] = await getOneDocument(taskValues.getItem.data[" b_xml_parse"].buyer);
      taskValues["getBranchOffice"] = await getOneDocument(taskValues.getItem.data[" b_xml_parse"].branchOffice);

      const namesBuyer = (`${taskValues.getBuyer.data.firstName || ""} ${taskValues.getBuyer.data.secondName || ""}`).trim() || "";

      const templateMailZip = {
        to: `${taskValues.getBuyer.data.commertialName}<${taskValues.getBuyer.data.emailDian}>`,
        replyTo: `${taskValues.getBranchOffice.data.commertialName}<${taskValues.getBranchOffice.data.email}>`,
        template: {
          name: "signedDocument",
          data: {
            fileName: taskValues.duplaNameZip,
            fileUri: taskValues.getItem.data.uriZIP || "fileUri",
            subject: `🧾 ${namesBuyer}, aquí está TÚ ${taskValues.typeName} No. ${taskValues.documentNumber} de ${taskValues.getBranchOffice.data.commertialName}` || "🧾 tufactura.com",
            titleHeader: "signedDocument",
            // zipPassThrough: zipPassThrough,
            userName: taskValues.getBranchOffice.data.commertialName || "userName",
            tenant: "tufactura.com",
            documentName: `${taskValues.typeName} ${taskValues.documentNumber}` || "documentName",
            primaryColor: taskValues.getBiller.data.colors.primary || "primaryColor",
            secondaryColor: taskValues.getBiller.data.colors.secondary || "secondaryColor",
            content: {
              title: `${taskValues.getBiller.data.commertialName} ha emitido TÚ ${taskValues.typeName} No. ${taskValues.documentNumber}` || "content.title",
              text: "Adjuntamos tu archivo .ZIP relacionado." || "content.text",
            },

            button: { // BUG extensión, lo toma como adjunto.
              show: true,
              link: taskValues.getItem.data.uri.zip || "¶¶ button.uriZIP",
              text: `Descargar TÚ ${(taskValues.typeName).toLowerCase()} ${taskValues.documentNumber}.zip` || "¶¶ button.text.uriZIP",
            },
          },
        },
      };


      // HARDCODE: Esta plantilla debe estar en la firestore
      await mergeInFirestore(`/e_mail_tufactura_com/${taskValues.itemId}`, templateMailZip, true);

      // clean
      delete taskValues.getItem;
      delete taskValues.getBiller;
      delete taskValues.getBuyer;
      delete taskValues.getBranchOffice;

      Promise.resolve();
    } catch (error) {
      Promise.reject(new Error(JSON.stringify(error)));
    }
  }


  /**
  * Create folder by item (document).
  * https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/runDrive#createfile
  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
  * @param {string} name documentId.
  * @param {string} payloadX processed payload.
  */
  async function createZip(auth,
    name = taskValues.name,
    payloadX = taskValues.payloadX,
  ) {
    return new Promise((resolve, reject) => {
      try {
        const drive = google.drive({version: "v3", auth});
        mergeInFirestore("/entities/CO-901318433/documents/response2", {
          zip: "llega hasta antes de zip",
        }, true);
        // COMPRIMIR ZIP si la dupla existe

        switch (taskValues.extension) {
        case "pdf":
          taskValues["duplaId"] = taskValues.thisItem.data.xmlId;
          taskValues["duplaName"] = name.replace(taskValues.extension, "xml");
          break;


        case "xml":
          taskValues["duplaId"] = taskValues.thisItem.data.pdfId;
          taskValues["duplaName"] = name.replace(taskValues.extension, "pdf");
          break;


        default:
          console.log(emoji.fire, taskValues.extension);
          resolve();
        }


        taskValues["garbageMergeInFirestore"] = async function() {
          // console.log("¶¶ CREA zipId: true en garbageMergeInFirestore");
          return await mergeInFirestore(taskValues.gDriveRef, {
            zipId: true,
          }, true);
        };


        taskValues["duplaNameZip"] = name.replace(taskValues.extension, "zip");
        mergeInFirestore("/entities/CO-901318433/documents/response2", {
          zip: "llega hasta despues de zip",
          taskValuesduplaId: taskValues.duplaId,
          taskValuesduplaName: taskValues.duplaName,
          taskValuesduplaNameZip: taskValues.duplaNameZip,
        }, true);


        drive.files.get({fileId: taskValues.duplaId, alt: "media"}, {responseType: "stream"},
          async (err, {data}) => {
            if (err) {
              Promise.reject(new Error("The API returned an error: " + err));
            }
            mergeInFirestore("/entities/CO-901318433/documents/response2", {
              err: `${err}`,
              data: `${JSON.stringify(data)}`,
            }, true);
            // const dataUrl = `data:${data.headers["Content-Type"]};base64,${btoa(data.body)}`;
            const buf = [];
            data.on("data", (e) => {
              buf.push(e);
            });

            data.on("end", async () => {
              const duplaBuffer = Buffer.concat(buf);

              const archiver = require("archiver");
              const archive = archiver("zip", {
                zlib: {level: 9}, // Sets the compression level.
              });

              archive.append(payloadX, {name: name});
              archive.append(duplaBuffer, {name: taskValues.duplaName});

              archive.on("error", (err) => {
                throw err;
              });

              archive.pipe(zipPassThrough);
              archive.finalize();

              taskValues["zipState"] = "¶¶ sipOK";

              // taskValues["zipPassThrough"] = zipPassThrough;

              return await Promise.resolve();
            });
            return await Promise.resolve();
          });

        return resolve();
      } catch (error) {
        mergeInFirestore("/entities/CO-901318433/documents/response2", {
          zipError: `${error}`,
        }, true);
        return reject(error);
      }
    });
  }
};

// module.exports = {runDrive};
