/* eslint-disable require-jsdoc */

const {dbFS} = require("../admin");
const {code} = require("../admin/responses");
const {getOneDocument, mergeInFirestore} = require("../database/firestore");
const {tenant} = require("../admin/hardCodeTenants");

const getInitBranchOffice = async (
  currentBranchOfficeData,
  mTenantRaw = "tufactura.com",
) => {
  return new Promise((resolve, reject) => {
    try {
      if (currentBranchOfficeData.eCommerce) {
        resolve(currentBranchOfficeData.eCommerce);
      } else {
        // En caso de que la sucursal no tenga eCommerce, se toma el init del dominio
        const tenantX = tenant(mTenantRaw);
        tenantX["commertialName"] = currentBranchOfficeData["commertialName"] || currentBranchOfficeData["businessName"];
        resolve(tenantX.init);
      }
    } catch (error) {
      reject(error);
    }
  });
};


async function setCurrentBranchOfficeEcommerce(
  originRaw,
  currentUser,
  billerId,
  branchOffice,
) {
  const mergeInentity = {};

  const currentBranchOfficeData = await getOneDocument(`/entities/${billerId}/branchOffices/${branchOffice}`);

  if (currentBranchOfficeData.response === code.ok) {
    const currentBranchOfficeDataX = currentBranchOfficeData.data;

    // Traemos la plantilla de la landing page, si no existe, se crea una por defecto.

    const landingPage = await getInitBranchOffice(
      currentBranchOfficeDataX,
      originRaw,
      );

    mergeInentity["current"] = landingPage;
    // mergeInentity["currentLandingPage"] = landingPage;
    // mergeInentity["currentBiller"] = billerId;
    // mergeInentity["currentBranchOffice"] = branchOffice;

    await mergeInFirestore(`/entities/${currentUser}`, mergeInentity, true);

    return Promise.resolve(landingPage.domain || "https://tufactura.com");
  } else {
    // Acá llega en caso de que no existan permisos en el billerId al que pretende acceder el usuario.
    if (currentUser === billerId) {
      // Si el usuario actual es el mismo que el billerId, se rechaza el acceso; para no crear bucles infinitos.
      return Promise.reject(new Error("⚠️ Acceso denegado"));
    } else {
      // Se entrega el url del currentUserIdAuth con sucursal principal (para que no se pierda la sesión del usuario actual)
      console.log("⚠️ Se entrega el url del currentUserIdAuth con sucursal principal (para que no se pierda la sesión del usuario actual)");
      return Promise.resolve(await setCurrentBranchOfficeEcommerce(originRaw, currentUser, currentUser, "principal"));
    }
  }
}


async function getCustomClaimsFromRoles(
  myCurrentUID,
  goToBiller, // billerX
  goToBillerBranchOffice, // branchOfficeX
  rol = "F00", // F00 Adquirente
) {
  const responseCustomClaims = {};
  const billerX = goToBiller;
  const branchOfficeX = goToBiller;
  // let defaultRolF00 = false;


  // Si el usuario actual es el mismo que el goToBiller, se establecen valores por defecto; luego se actualizan.
  if (myCurrentUID === billerX) {
    // Se consultan roles del usuario actual.
    const myRol = await getOneDocument(`/entities/${billerX}/roles/${rol}/${branchOfficeX}/${myCurrentUID}`);
    if (myRol.response === code.notFound) {
      // defaultRolF00 = {
      //   enabled: true,
      //   commertialName: "commertialName",
      //   typePerson: "typePersonX",
      //   branchOffices: ["principal"],
      // };
      console.log("notFound", {myRol});
    } else {
      console.log("Found", {myRol});
    }


    const myRolesRef = dbFS.collection("entities").doc(billerX).collection("roles");
    const myRoles = await myRolesRef
      .where(`${myCurrentUID}.enabled`, "==", true)
      .get();


    myRoles.forEach((doc) => {
      console.log(doc.id, "=>", doc.data()[billerX]["branchOffices"]);
    });

    // Si el usuario actual no tiene roles, se crean los valores por defecto y se escriben en la Firestore.
    if (myRoles.docs.length === 0) {

      // return Promise.resolve(false);
    } else {
      // responseCustomClaims["currentBiller"] = `${billerX}_${goToBillerBranchOffice}`;
      responseCustomClaims["current"] = {biller: billerX, branchOffice: goToBillerBranchOffice};
    }

    responseCustomClaims[billerX] = true;
    // responseCustomClaims["currentBiller"] = `${billerX}_principal`;
    responseCustomClaims["current"] = {biller: billerX, branchOffice: "principal"};


    // Por defecto goToBillerBranchOffice es principal, pero si es diferente, se actualiza.
    if (goToBillerBranchOffice !== "principal") {
      // responseCustomClaims["currentBiller"] = `${billerX}_${goToBillerBranchOffice}`;
      responseCustomClaims["current"] = {biller: billerX, branchOffice: goToBillerBranchOffice};
    }


    return Promise.resolve(responseCustomClaims);
  } else {
    // Si el usuario actual es diferente al goToBiller, se establecen valores.
    responseCustomClaims[billerX] = true;
    responseCustomClaims[goToBiller] = true;
    // responseCustomClaims["currentBiller"] = `${goToBiller}_${goToBillerBranchOffice}`;
    responseCustomClaims["current"] = {biller: billerX, branchOffice: goToBillerBranchOffice};
  }
}
module.exports = {
  getInitBranchOffice,
  getCustomClaimsFromRoles,
  setCurrentBranchOfficeEcommerce,
};
