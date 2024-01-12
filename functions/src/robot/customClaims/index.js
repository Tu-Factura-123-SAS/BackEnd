"use strcit";


const claims = async (
  entityX,
  currentUserIdAuth = " ¶¶currentUserIdAuth",
  originRaw = "http://localhost:8080",
  json = false,
  currentBillerAuth = " ¶¶_currentBiller", // WARNING: si es el facturador actual de entityX, actualizar permisos.
) => {
  const {
    dbFS,
    timeStampFirestoreX,
    users,
    incrementFireStoreX,
    addArray,
  } = require("../../admin");

  // En caso de que json tenga valores, se pasan a payload y se completa con metadata.
  const jsonReload = {};
  jsonReload.reload = true;
  let payload = {};
  payload.currentBillerWait = false;

  if (json) {
    payload = json;
    // payload["currentBiller"] = json.currentBillerWait;
    payload["currentBranchOffice"] = json.currentBranchOfficeWait;
    // payload["metadata"] = {};
    // payload["metadata"] = {
    //   claims: timeStampFirestoreX,
    //   // claimsCount: incrementFireStoreX(1),
    //   claimsCountBiller: incrementFireStoreX(1),
    // };
  }


  const {
    code,
  } = require("../../admin/responses");
  const {
    sleep,
  } = require("../../admin/utils");


  const {
    getOneDocument, mergeInFirestore, waitAndMergeInFirestore,
  } = require("../../database/firestore");
  // Se traslada timeStampFirestoreX para que no usue valor
  // "pegado" en el entorno.


  let thirdParty = {};
  let linkX = false;
  // const colectionByRolValues = {};


  // console.log({entityX});
  // console.log({currentUserIdAuth});
  // console.log({payload.currentBillerWait});
  const isValid = (entity)=>{
    if (
      entityX === entity ||
      currentUserIdAuth === entity ||
      payload.currentBillerWait === entity
    ) {
      return true;
    } else {
      return false;
    }
  };

  try {
    thirdParty = await getOneDocument(`/entities/${entityX}`);
    thirdParty["customClaims"] = {};
    // thirdParty["customClaims"]["currentBiller"] = `${payload.currentBillerWait || entityX}_${payload.currentBranchOfficeWait || "principal"}`;
    thirdParty["customClaims"]["current"] = {
      biller: payload.currentBillerWait || entityX,
      branchOffice: payload.currentBranchOfficeWait|| "principal",
    };
    thirdParty["entitiesAuth"] = {};
    thirdParty["currentUserIdAuth"] = {};
    thirdParty["listEntitiesX"] = [];

    const updateClaims = (biller) => {
      if (currentBillerAuth === " ¶¶_currentBiller") {
        return false;
      } else if (biller === thirdParty.data.currentBiller) {
        jsonReload["entityX"] = entityX;
        jsonReload["currentUserIdAuth"] = currentUserIdAuth;
        jsonReload["originRaw"] = originRaw;
        jsonReload["json"] = {
          currentBillerWait: payload.currentBillerWait,
          currentBranchOfficeWait: payload.currentBranchOfficeWait,
          currentBiller: payload.currentBillerWait,
          currentBranchOffice: payload.currentBranchOfficeWait,
        };
        return true;
      } else {
        return false;
      }
    };


    Object.keys(thirdParty.data.entitiesAuth)
      .forEach(async (entity, dataIndex, dataInArray) => {
        const entityPart = entity.split("_");


        const collectionRef = dbFS
          .collection("entities").doc(entityPart[0]).collection("roles");


        const documents = await collectionRef.where(`${entityX}.enabled`, "==", true).get();


        documents.forEach(async (doc) => {
          thirdParty["SubColectionByRol"] = await getOneDocument(`/rolesList/${doc.id}`);
          thirdParty["ignoreCustomClaim"] = thirdParty.SubColectionByRol.data.ignoreCustomClaim || false;


          // https://github.com/JovannyCO/FacturaDIAN-Hosting/issues/136
          if (doc.id === "developer") {
            thirdParty["customClaims"][doc.id] = true;
          } else if (thirdParty.ignoreCustomClaim === true) {
            // No hacer nada; ignoreCustomClaim en el rol indicado.
            if (entityPart[0] === entityX) {
              if (isValid(entityPart[0])) {
                thirdParty["customClaims"][`${entityPart[0]}_${doc.id}`] = true;
                // thirdParty["customClaims"]["currentBiller"] = `${payload.currentBillerWait}_${payload.currentBranchOfficeWait}`;
                thirdParty["customClaims"]["current"] = {biller: payload.currentBillerWait, branchOffice: payload.currentBranchOfficeWait};
              }
            }
          } else {
            if (isValid(entityPart[0])) thirdParty["customClaims"][`${entityPart[0]}_${doc.id}`] = true;
          }


          // https://github.com/JovannyCO/FacturaDIAN-Hosting/issues/137
          (thirdParty["listEntitiesX"]).push(entityPart[0]);

          // if (`${entityPart[0]}` === entityX) {
          // El customClaims entity SIN ROLE. OJO: Castiga payload de 1000 bytes.
          if (isValid(entityPart[0])) thirdParty["customClaims"][`${entityPart[0]}`] = true;
          // }

          const routeSubCollectionsAuth = `/entities/${entityPart[0]}/subCollectionsAuth/${entityX}`;

          // aplicar array con nombre de subColección
          thirdParty["SubColectionByRol"] = thirdParty.SubColectionByRol.data.subCollectionsAuth;

          if (
            thirdParty.SubColectionByRol !== undefined) {
            // no hacer nada, pasar de largo.
            // Por alguna extraña razón, al negarlo se pierde el event pool.
            thirdParty.SubColectionByRol.forEach((subCollectionName) => {
              mergeInFirestore(
                routeSubCollectionsAuth,
                {
                  [subCollectionName]: addArray(`${entityPart[0]}_${doc.id}`),
                });
            });
          } /* else {
          } */
        });
        // HARDCODE: Se requiere fx: traer los valores actuales de principal.
        // https://github.com/JovannyCO/FacturaDIAN-Hosting/issues/171
        thirdParty["entitiesAuth"][entity] = thirdParty.data.entitiesAuth[entity];
        if (dataIndex === (dataInArray.length) - 1) {
          await sleep(600);


          // https://github.com/JovannyCO/FacturaDIAN-Hosting/issues/137
          thirdParty["listEntities"] = (thirdParty["listEntitiesX"]).filter((item, index)=>{
            return (thirdParty["listEntitiesX"]).indexOf(item) === index;
          });

          // console.log("customClaims", thirdParty["customClaims"]);

          if (updateClaims(currentBillerAuth)) {
            // console.log("ENTRA", updateClaims(currentBillerAuth));
            // console.log("ENTRA", currentBillerAuth);


            if (payload.currentBillerWait === false) {
              const linkReload = await claims(
                jsonReload.entityX, // HACK: Es el usuario actual
                jsonReload.currentUserIdAuth,
                jsonReload.originRaw,
                true, // Para que tenga un valor
              );
              // await users.setCustomUserClaims(entityX, thirdParty["customClaims"]);
              // await users.revokeRefreshTokens(entityX);
              jsonReload.linkReload = linkReload.link || false;
            }
          }

          if (payload.currentBillerWait !== false) {
            await users.setCustomUserClaims(entityX, thirdParty["customClaims"])
              .then(
                await sleep(1000),
              );
          }


          // await mergeInFirestore(
          //   `/rolesRun/${entityX}`,
          //   {
          //     entitiesAuth: thirdParty["entitiesAuth"],
          //     customClaims: thirdParty["customClaims"],
          //   },
          //   true, // NO MERGE
          // );
        }
        return null;
      });

    if (updateClaims(currentBillerAuth)) {
      // console.log("customClaims", thirdParty["customClaims"]);
      // console.log("ENTRA", currentBillerAuth);
      // Con JSON en falso, se envía el link y no refresca pantalla.
      if (payload.currentBillerWait === false) {
        await mergeInFirestore(
          `entities/${entityX}`,
          {
            metadata: {
              claims: timeStampFirestoreX,
              claimsCount: incrementFireStoreX(1),
            },
          });
      }
    }


    if (payload.currentBillerWait !== false) {
      // console.log("ENTRA", {payload});


      await users.getUserByUid(entityX)
        .then(async (currentUserData) => {
          await users.revokeRefreshTokens(entityX);

          linkX = await users.generateSignInWithEmailLink(currentUserData.email, originRaw);
          return null;
        });


      waitAndMergeInFirestore(
        `entities/${entityX}`,
        payload,
        true,
        1000);
    }


    return {
      response: code.created,
      link: linkX,
      reload: jsonReload.reload,
    };
  } catch (error) {
    return {
      response: code.badRequest,
      error: error,
    };
  }
};


module.exports = {
  claims,
};
