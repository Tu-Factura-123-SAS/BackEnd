const {code} = require("../../admin/responses");
const {sleep} = require("../../admin/utils");


const setRoles = async (
  entityX = " ¶¶entityX",
  customClaims = [],
  branchOfficeId = "principal",
  initEntity = false,
  currentUserIdAuth,
  mTenantRaw,
) => {
  let legalEntity = {};
  let legalEntityBranchOffice = {};
  const authorizedEntities = {};
  const authorizedEntitiesData = {};
  const {tenant} = require("../../admin/hardCodeTenants");
  const tenantX = tenant(mTenantRaw);


  const {getOneDocument} = require("../../database/firestore");


  try {
    legalEntity = await getOneDocument(`/entities/${entityX}`);
    legalEntityBranchOffice = await getOneDocument(`/entities/${entityX}/branchOffices/${branchOfficeId}`);
    // console.log(legalEntity);
    // console.log(legalEntityBranchOffice);

    if (legalEntity.response === code.ok && legalEntityBranchOffice.response === code.ok) {
      legalEntity = legalEntity.data;
      legalEntityBranchOffice = legalEntityBranchOffice.data;
    } else {
      return Promise.resolve({
        response: code.notFound,
        message: `${entityX} ó ${branchOfficeId} NO está en la base de datos.`,
      });
    }
  } catch (error) {
    // console.error(error);
    return Promise.reject(new Error(JSON.stringify({
      response: code.badRequest,
      message: error.message,
    })));
  }


  return new Promise((resolve, reject) => {
    const {dbFS, addArray, timeStampFirestoreX} = require("../../admin");
    const batchClaims = dbFS.batch();


    try {
      if (initEntity === true) {
        // console.log(legalEntityBranchOffice);
        // Inicializamos la entidad, sin F00
        for (let i = 1; i < 5; i++) {
          batchClaims.set(dbFS.doc(`/entities/${entityX}/roles/F0${i}`),
            {
              [entityX]: {
                enabled: false,
                typePerson: legalEntity.typePerson,
                businessName: legalEntity.businessName,
                branchOffices: addArray(branchOfficeId),
                commertialName: legalEntityBranchOffice.commertialName,
              },
            },
            {merge: true},
          );
        }


        for (let i = 10; i < 91; i = i + 10) {
          batchClaims.set(dbFS.doc(`/entities/${entityX}/roles/F${i}`),
            {
              [entityX]: {
                enabled: false,
                typePerson: legalEntity.typePerson,
                businessName: legalEntity.businessName,
                branchOffices: addArray(branchOfficeId),
                commertialName: legalEntityBranchOffice.commertialName,
              },
            },
            {merge: true},
          );
        }


        batchClaims.set(dbFS.doc(`/entities/${entityX}/consecutivesControl/91_principal-0`),
          {
            expire: "",
            prefix: "NC",
            active: true,
            expedition: "",
            startNumber: "1",
            currentNumber: 1,
            endNumber: "100000",
            id: "91_principal-0",
            template: "Crédito",
            branchOffice: "principal",
            typeDocumentNumeration: "91",
            technicalKey: tenantX.alianza.testSet.technicalKey || "technicalKey", // Solo Acticación
            commertialName: legalEntityBranchOffice.commertialName || "legalEntityBranchOffice",
          },
          {merge: true},
        );


        batchClaims.set(dbFS.doc(`/entities/${entityX}/consecutivesControl/92_principal-0`),
          {
            expire: "",
            prefix: "ND",
            active: true,
            expedition: "",
            startNumber: "1",
            currentNumber: 1,
            endNumber: "100000",
            id: "92_principal-0",
            template: "Débito",
            branchOffice: "principal",
            typeDocumentNumeration: "92",
            technicalKey: tenantX.alianza.testSet.technicalKey || "technicalKey", // Solo Acticación
            commertialName: legalEntityBranchOffice.commertialName || "legalEntityBranchOffice",
          },
          {merge: true},
        );


        batchClaims.set(dbFS.doc(`/entities/${entityX}/consecutivesControl/06_principal-0`),
          {
            expire: "",
            active: true,
            prefix: "PED",
            expedition: "",
            startNumber: "1",
            currentNumber: 1,
            template: "Pedido",
            endNumber: "1000000",
            id: "06_principal-0",
            branchOffice: "principal",
            typeDocumentNumeration: "06",
            commertialName: legalEntityBranchOffice.commertialName || "legalEntityBranchOffice",
          },
          {merge: true},
        );


        batchClaims.set(dbFS.doc(`/ a_invoiceAuthorizations/${entityX}`),
          {
            TTL: timeStampFirestoreX,
            [" task"]: {
              uid: entityX,
              tenant: mTenantRaw,
            },
          },
          {merge: false});
      }

      Object.keys(customClaims).forEach((claim) => {
        Object.keys(customClaims[claim]).forEach((role) => {
          // console.log({role}, customClaims[claim][role]);

          (async () => {
            authorizedEntities[customClaims[claim][role]] = {};
            authorizedEntities[customClaims[claim][role]][`${entityX}_${branchOfficeId}`] = `${legalEntityBranchOffice.commertialName}: ${legalEntity.commertialName}`;

            authorizedEntitiesData[customClaims[claim][role]] =
              await getOneDocument(`/entities/${customClaims[claim][role]}`);

            if (authorizedEntitiesData[customClaims[claim][role]].response === code.ok) {
              authorizedEntitiesData[customClaims[claim][role]] = authorizedEntitiesData[customClaims[claim][role]].data;
            } else {
              authorizedEntitiesData[customClaims[claim][role]] = false;
            }
            // console.log({authorizedEntitiesData});

            // console.log(authorizedEntitiesData);
            // console.log(authorizedEntitiesData[customClaims[claim][role]].businessName);
            // console.log(authorizedEntitiesData[customClaims[claim][role]].commertialName);
            // console.log(authorizedEntitiesData[customClaims[claim][role]].typePerson);
            // const businessName = authorizedEntitiesData[customClaims[claim][role]].businessName || "Pendiente...";
            const commertialName = authorizedEntitiesData[customClaims[claim][role]].commertialName || "Pendiente...";
            const typePerson = authorizedEntitiesData[customClaims[claim][role]].typePerson || "Pendiente...";


            // Batch por cada uno de los usuarios a los que se le dan permiso
            batchClaims.set(dbFS.doc(`/entities/${entityX}/roles/${role}`),
              {
                [customClaims[claim][role]]: {
                  enabled: true,
                  typePerson: typePerson,
                  // businessName: businessName,
                  commertialName: commertialName,
                  branchOffices: addArray(branchOfficeId),
                },
              },
              {merge: true},
            );
          })();
        });
      });

      batchClaims.set(dbFS.doc(`/entities/${entityX}/logs/setRoles`),
        {
          [currentUserIdAuth]: {
            tenant: mTenantRaw,
            initEntity: initEntity,
            last: timeStampFirestoreX,
            customClaims: customClaims,
          },
        });

      (async () => {
        let waitSleep = 250;
        Object.keys(authorizedEntities).forEach((authorizedEntity) => {
          // console.log({authorizedEntity}, authorizedEntities[authorizedEntity]);
          // console.log(authorizedEntities[authorizedEntity]);
          batchClaims.set(dbFS.doc(`/entities/${authorizedEntity}`),
            {
              showSplash: true,
              entitiesAuth: authorizedEntities[authorizedEntity],
              // Por defecto landingPage del tenant, pero debe ser el del entity SENA
              // landingPage: {[authorizedEntities[authorizedEntity]]: tenantX.init.landingPage},
            },
            {merge: true},
          );
          waitSleep += 250;
        });


        await sleep(waitSleep); // Espere 250 ms por cada usuario.
        await batchClaims.commit();


        // Object.keys(authorizedEntities).forEach(async (rolesEntity) => {
        //   // console.log({rolesEntity}, {currentUserIdAuth});

        //   // console.log("legalEntity:", sortObject(legalEntity));
        //   // console.log("authorizedEntitiesData:", sortObject(authorizedEntitiesData));


        //   // if (currentUserIdAuth !== " ¶¶_currentUserIdAuth") {
        //   //   users.getUserByUid(currentUserIdAuth)
        //   //     .then(async (currentUserData) => {
        //   //       // console.log({currentUserData});


        //   //       // const {mergeInFirestore} = require("../../database/firestore");
        //   //       // const {generateRandomString} = require("../../admin/utils");
        //   //       // const {emoji} = require("../../admin/emoji");

        //   //       // const linkX = await users.generateSignInWithEmailLink(currentUserData.email, `http://${mTenantRaw}`);

        //   //       // let primaryColor = "#ffc107";
        //   //       // let secondaryColor = "#03a9f4";
        //   //       // if (legalEntity.colors) {
        //   //       //   primaryColor = legalEntity.colors.primary;
        //   //       //   secondaryColor = legalEntity.colors.secondary;
        //   //       // }


        //   //       // let title = "";

        //   //       // if (
        //   //       //   currentUserData.displayName === legalEntity.commertialName ||
        //   //       //   currentUserData.displayName === authorizedEntitiesData[rolesEntity].commertialName
        //   //       // ) {
        //   //       //   title = "¡Tus permisos han cambiado!";
        //   //       // } else {
        //   //       //   title = `¡${currentUserData.displayName} actualizó tus permisos!`;
        //   //       // }

        //   //       // await mergeInFirestore(
        //   //       //   "/e_mail_tufactura_com/" + rolesEntity,
        //   //       //   {
        //   //       //     to: `${authorizedEntitiesData[rolesEntity].commertialName}<${authorizedEntitiesData[rolesEntity].emailDian}>`,
        //   //       //     replyTo: `${currentUserData.displayName}<${currentUserData.email}>`,
        //   //       //     displayName: currentUserData.displayName,
        //   //       //     delivery: {
        //   //       //       state: "RETRY",
        //   //       //     },
        //   //       //     template: {
        //   //       //       name: "signIn",
        //   //       //       data: {
        //   //       //         primaryColor: primaryColor,
        //   //       //         secondaryColor: secondaryColor,
        //   //       //         titleHeader: "SignIn",
        //   //       //         userName: authorizedEntitiesData[rolesEntity].commertialName,
        //   //       //         hash: generateRandomString(5),
        //   //       //         content: {
        //   //       //           title: title,
        //   //       //           text: `Haz clic en el botón ENTRAR y selecciona ${legalEntity.commertialName} en ${emoji.receipt}${mTenantRaw}`,
        //   //       //         },
        //   //       //         button: {
        //   //       //           link: linkX,
        //   //       //           show: true,
        //   //       //           text: "ENTRAR",
        //   //       //         },
        //   //       //         tenant: mTenantRaw,
        //   //       //       },
        //   //       //     },
        //   //       //   },
        //   //       // );
        //   //     });
        //   // }
        // });

        // return null;
        return resolve({response: code.accepted});
      })();


      return resolve({response: code.accepted});
    } catch (error) {
      return reject(new Error({
        response: code.badRequest,
        message: error.message,
      }));
    }
  });
};
module.exports = {
  setRoles,
};
