const {users} = require("../../admin");
const {mergeInFirestore} = require("../../database/firestore");
const {v0} = require("../../eCommerce/v0");
const {setRolesRun} = require("../../robot/customClaims/setRolesRun");


module.exports = async (change, context) => {
  const afterData = change.after.data();
  const customerJourneyClaims = afterData.customClaims ? afterData.customClaims.c : false;
  const customerJourneyEntitiesAuth = afterData.entitiesAuth ? afterData.entitiesAuth : false;

  let customerJourneyV0 = customerJourneyClaims.app ? customerJourneyClaims.app : false;
  if (customerJourneyV0) {
    customerJourneyV0 = customerJourneyV0.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im, "$1");
    customerJourneyV0 = await v0(customerJourneyV0);
  } else {
    throw new Error("customerJourneyV0 is false");
  }

  // console.log({customerJourneyClaims, customerJourneyEntitiesAuth, customerJourneyV0});

  // "/entities/{alliance}/branchOffices/{allianceBranchOffice}/{appCollection}/{billerUnderscoreBranchOffice}/customersJourneys/{uid}"
  const {
    // alliance,
    // allianceBranchOffice,
    // appCollection,
    // billerUnderscoreBranchOffice,
    uid,
  } = context.params;

  try {
    // Obtener custom claims del usuario
    const user = await users.getUserByUid(uid);

    const currentCustomClaims = user.customClaims ? user.customClaims.c : false;

    if (!currentCustomClaims && customerJourneyClaims) {
      const resposeRolesRun = await setRolesRun(uid, customerJourneyEntitiesAuth, customerJourneyClaims, customerJourneyV0);
      const customClaims = customerJourneyClaims;
      delete customClaims.app;
      console.log(resposeRolesRun);
    }


    // Comparar los valores de custom claims con los del documento
    if (
      currentCustomClaims &&
      currentCustomClaims.b === customerJourneyClaims.b &&
      currentCustomClaims.bo === customerJourneyClaims.bo
    ) {
      const {timeStampFirestoreX} = require("../../admin");

      const dataCustomerJourney = {
        TTL: timeStampFirestoreX,
        customClaims: {c: customerJourneyClaims},
        app: customerJourneyClaims.app,
      } || {};

      delete dataCustomerJourney.customClaims.c.app;

      // Crear o actualizar el documento en /rolesRun/{uid}
      await mergeInFirestore(`rolesRun/${uid}`, dataCustomerJourney, false);
    }
  } catch (error) {
    console.error("Error en customerJourneyOnUpdate: ", error.message);
    throw error;
  }
};
