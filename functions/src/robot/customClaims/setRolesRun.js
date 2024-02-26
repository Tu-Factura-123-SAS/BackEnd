const {runZcache} = require("../../eCommerce/zCache");
const {dbFS} = require("../../admin");
const {getOneDocument, mergeInFirestore} = require("../../database/firestore");
const setOperations = require("./setOperations.js");
const {code} = require("../../admin/responses");

const setRolesRun = async (
  targetEntity,
  currentEntitiesAuth = {[`${targetEntity}_principal`]: "No set biller"},
  currentCustomClaims = false,
  currentPrivateV0 = false,
) => {
  // const batch = dbFS.batch();
  // // Se establece los valores por defecto en la misma entidad.
  // // firestore.rule   /entities/{alliance}/branchOffices/{allianceBranchOffice}/{appCollection}/{biller}_{branchOffice}/{functionCollection}/{entityX}
  // batch.set(dbFS.doc(`/entities/${alliance}/branchOffices/${allianceBranchOffice}/${landingPageV0app}/${biller}_${billerBranchOffice}/customersJourneys/${entityX}`), currentX);
  // batch.set(dbFS.doc(`/entities/${alliance}/branchOffices/${allianceBranchOffice}/${landingPageV0app}/${entityX}_principal/individualCustomerJourney/${entityX}`), currentX);
  // Creamos la autenticación inicial de la entidad y configuración de roles
  const initialEntityAuth = {[`${targetEntity}_principal`]: "initial"};
  const entityData = {
    entitiesAuth: Object.assign(initialEntityAuth, currentEntitiesAuth),
  };

  const rolesRun = {};

  // Si hay un objeto privado, lo procesamos
  if (currentPrivateV0) {
    rolesRun.v0 = currentPrivateV0;
    await runZcache("signUp", `${currentPrivateV0.setup.authDomain}|${targetEntity}|principal|${targetEntity}`);
    const resulta = await runZcache("{uidX}_templates", `${targetEntity}|`);
    console.warn("ANTES DE SETROLESRUN", JSON.stringify({resulta: resulta, targetEntity: targetEntity}));
  }

  try {
    // Creamos los objetos de las reclamaciones personalizadas y la autenticación de las entidades
    rolesRun.customClaims = {};
    rolesRun.entitiesAuth = entityData.entitiesAuth;

    const entitiesAuthKeys = Object.keys(entityData.entitiesAuth);

    // Procesamos cada entidad
    for (const entity of entitiesAuthKeys) {
      const entityPart = entity.split("_");

      // Configuramos las reclamaciones personalizadas
      if (currentCustomClaims !== false) {
        rolesRun.customClaims.c = currentCustomClaims;
      } else {
        const customClaimsFromCurrentBranchOffice = await getOneDocument(
          `/entities/${entityPart[0]}/branchOffices/${entityPart[1]}/landingPages/${targetEntity}`,
        );
        rolesRun.customClaims.c = customClaimsFromCurrentBranchOffice.data;
      }

      // Obtenemos los roles de la entidad actual
      const collectionRef = dbFS.collection("entities").doc(entityPart[0]).collection("roles");
      const documents = await collectionRef.where(`${targetEntity}.enabled`, "==", true).get();

      rolesRun.customClaims.m = rolesRun.customClaims.m || [];

      // Iteramos cada documento
      for (const doc of documents.docs) {
        rolesRun.customClaims.m.push(doc.id);

        entityData.rolesOperationsRules = await getOneDocument(`/rolesOperationsRules/${doc.id}`);
        entityData.ignoreCustomClaim = entityData.rolesOperationsRules.data.ignoreCustomClaim || false;

        if (doc.id === "developer") {
          rolesRun.customClaims[doc.id] = true;
        }

        // Aplicamos las operaciones
        await setOperations(entityData, rolesRun);
      }

      // Actualizamos la base de datos con los roles
      await mergeInFirestore(`/rolesRun/${entityPart[0]}`, rolesRun, false);
    }

    // Devolvemos el resultado de la operación
    return {
      response: code.created,
    };
  } catch (error) {
    // Si ocurre un error, lo devolvemos
    return {
      response: code.badRequest,
      error,
    };
  }
};

// Exportamos la función
module.exports = {
  setRolesRun,
};
