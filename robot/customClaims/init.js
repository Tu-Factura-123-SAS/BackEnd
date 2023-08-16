"use strcit";


const initClaims = async (
  currentUserIdAuth,
  entityX,
  entityData,
  customClaims,
) => {
  const {
    dbFS,
    // timeStampFirestoreX,
    // users,
    // incrementFireStoreX,
    addArray,
  } = require("../../admin");

  const {
    code,
  } = require("../../admin/responses");
  const {
    sleep,
  } = require("../../admin/utils");


  const {
    getOneDocument, mergeInFirestore,
  } = require("../../database/firestore");

  const entityDataX = entityData;


  try {
    entityDataX["customClaims"] = customClaims;

    entityDataX["listEntitiesX"] = [];


    const isValid = (entity)=>{
      if (
        entityX === entity ||
        currentUserIdAuth === entity
      ) {
        return true;
      } else {
        return false;
      }
    };

    Object.keys(entityDataX.entitiesAuth)
      .forEach(async (entity, dataIndex, dataInArray) => {
        const entityPart = entity.split("_");


        const collectionRef = dbFS
          .collection("entities").doc(entityPart[0]).collection("roles");

        // console.log(entityDataX.entitiesAuth);

        const documents = await collectionRef.where(`${entityX}.enabled`, "==", true).get();


        documents.forEach(async (doc) => {
          entityDataX["colectionsDataByRol"] = await getOneDocument(`/rolesList/${doc.id}`);
          entityDataX["ignoreCustomClaim"] = entityDataX.colectionsDataByRol.data.ignoreCustomClaim || false;


          // https://github.com/JovannyCO/FacturaDIAN-Hosting/issues/136
          if (doc.id === "developer") {
            entityDataX["customClaims"][doc.id] = true;
          } else if (entityDataX.ignoreCustomClaim === true) {
            // No hacer nada; ignoreCustomClaim en el rol indicado.
            if (entityPart[0] === entityX) {
              if (isValid(entityPart[0])) {
                entityDataX["customClaims"][`${entityPart[0]}_${doc.id}`] = true;
              }
            }
          } else {
            if (isValid(entityPart[0])) entityDataX["customClaims"][`${entityPart[0]}_${doc.id}`] = true;
          }


          // https://github.com/JovannyCO/FacturaDIAN-Hosting/issues/137
          (entityDataX["listEntitiesX"]).push(entityPart[0]);

          if (isValid(entityPart[0])) entityDataX["customClaims"][`${entityPart[0]}`] = true;
          // }

          const routeCollectionsAuthGet = `/entities/${entityPart[0]}/collectionsAuthGet/${entityX}`;
          const routeCollectionsAuthGetAll = `/entities/${entityPart[0]}/collectionsAuthGetAll/${entityX}`;
          const routeCollectionsAuthSet = `/entities/${entityPart[0]}/collectionsAuthSet/${entityX}`;
          const routeCollectionsAuthSubGet = `/entities/${entityPart[0]}/collectionsAuthSubGet/${entityX}`;
          const routeCollectionsAuthSubSet = `/entities/${entityPart[0]}/collectionsAuthSubSet/${entityX}`;

          // aplicar array con nombre de subColección
          entityDataX["collectionsAuthGet"] = entityDataX.colectionsDataByRol.data.collectionsAuthGet;
          entityDataX["collectionsAuthGetAll"] = entityDataX.colectionsDataByRol.data.collectionsAuthGetAll;
          entityDataX["collectionsAuthSet"] = entityDataX.colectionsDataByRol.data.collectionsAuthSet;
          entityDataX["collectionsAuthSubGet"] = entityDataX.colectionsDataByRol.data.collectionsAuthSubGet;
          entityDataX["collectionsAuthSubSet"] = entityDataX.colectionsDataByRol.data.collectionsAuthSubSet;

          if (
            entityDataX.collectionsAuthGet !== undefined) {
            // no hacer nada, pasar de largo.
            // Por alguna extraña razón, al negarlo se pierde el event pool.
            entityDataX.collectionsAuthGet.forEach((collectionName) => {
              mergeInFirestore(
                routeCollectionsAuthGet,
                {
                  [collectionName]: addArray(`${entityPart[0]}_${doc.id}`),
                });
            });
          }

          if (
            entityDataX.collectionsAuthGetAll !== undefined) {
            // no hacer nada, pasar de largo.
            // Por alguna extraña razón, al negarlo se pierde el event pool.
            entityDataX.collectionsAuthGetAll.forEach((collectionName) => {
              mergeInFirestore(
                routeCollectionsAuthGetAll,
                {
                  [collectionName]: addArray(`${entityPart[0]}_${doc.id}`),
                });
            });
          }

          if (
            entityDataX.collectionsAuthSet !== undefined) {
            // no hacer nada, pasar de largo.
            // Por alguna extraña razón, al negarlo se pierde el event pool.
            entityDataX.collectionsAuthSet.forEach((collectionName) => {
              mergeInFirestore(
                routeCollectionsAuthSet,
                {
                  [collectionName]: addArray(`${entityPart[0]}_${doc.id}`),
                });
            });
          }

          if (
            entityDataX.collectionsAuthSubGet !== undefined) {
            // no hacer nada, pasar de largo.
            // Por alguna extraña razón, al negarlo se pierde el event pool.
            entityDataX.collectionsAuthSubGet.forEach((collectionName) => {
              mergeInFirestore(
                routeCollectionsAuthSubGet,
                {
                  [collectionName]: addArray(`${entityPart[0]}_${doc.id}`),
                });
            });
          }

          if (
            entityDataX.collectionsAuthSubSet !== undefined) {
            // no hacer nada, pasar de largo.
            // Por alguna extraña razón, al negarlo se pierde el event pool.
            entityDataX.collectionsAuthSubSet.forEach((collectionName) => {
              mergeInFirestore(
                routeCollectionsAuthSubSet,
                {
                  [collectionName]: addArray(`${entityPart[0]}_${doc.id}`),
                });
            });
          }
        });


        // HARDCODE: Se requiere fx: traer los valores actuales de principal.
        // https://github.com/JovannyCO/FacturaDIAN-Hosting/issues/171
        // entityDataX["entitiesAuth"][entity] = entityDataX.entitiesAuth[entity];
        if (dataIndex === (dataInArray.length) - 1) {
          await sleep(600);


          // https://github.com/JovannyCO/FacturaDIAN-Hosting/issues/137
          entityDataX["listEntities"] = (entityDataX["listEntitiesX"]).filter((item, index)=>{
            return (entityDataX["listEntitiesX"]).indexOf(item) === index;
          });
        }
        return null;
      });


    return {
      response: code.created,
    };
  } catch (error) {
    return {
      response: code.badRequest,
      error: error,
    };
  }
};


module.exports = {
  initClaims,
};
