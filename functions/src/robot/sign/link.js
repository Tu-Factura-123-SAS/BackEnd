/* eslint-disable require-jsdoc */
const {code} = require("../../admin/responses");
const {sleep} = require("../../admin/utils");
// const {sleep} = require("../../admin/utils");


const { auth, users, dbFS } = require("../../admin");

const getLink = async (
  context,
  goToBiller,
  goToBillerBranchOffice,
) => {

  let originRaw = false;
  let currentUserIdAuth = false;
  let actionCodeSettings = false;


  // const actionCodeSettings = {url: "https://tufactura123.col.marketing", handleCodeInApp: true};


  if (context.auth) {
    originRaw = context.rawRequest.headers.origin;
    currentUserIdAuth = context.auth.uid;
    const goToEntity = {};


    try {
      goToEntity["customClaims"] = {};
      // goToEntity["customClaims"]["currentBiller"] = `${currentUserIdAuth}_principal`;
      goToEntity["customClaims"]["current"] = {biller: currentUserIdAuth, branchOffice: "principal"};


      // OJO: debe ser el dominio de origen del currentBranchOffice.
      const {setCurrentBranchOfficeEcommerce} = require("../../eCommerce/init");
      goToEntity["domain"] = await setCurrentBranchOfficeEcommerce(originRaw, currentUserIdAuth, goToBiller, goToBillerBranchOffice);

      // console.log(await getCustomClaimsFromRoles(currentUserIdAuth, goToBiller, goToBillerBranchOffice));

      // Nueva funcionalidad para cambiar el facturador
      if (context.auth.customClaims && context.auth.customClaims.developer) {
        goToEntity["customClaims"]["current"] = {biller: goToBiller, branchOffice: goToBillerBranchOffice};
      }

      if (currentUserIdAuth === goToBiller) {
        goToEntity["customClaims"][currentUserIdAuth] = true;


        // HARDCODE: Código DUPLICADO - Consulto MIS roles.
        const myRolesRef = dbFS
          .collection("entities").doc(currentUserIdAuth).collection("roles");

        let myRoles = await myRolesRef
          .where(`${currentUserIdAuth}.enabled`, "==", true)
          .get();

        if (myRoles.docs.length === 0) {
          myRoles = await myRolesRef
            .where(`${currentUserIdAuth}.enabled`, "==", true) // CO-1144081388.enabled en coleccion entities/user/roles/
            .get();

          if (myRoles.docs.length === 0) {
            return Promise.reject(new Error("⚠️ Acceso denegado"));
          } else {
            // goToEntity["customClaims"]["branchOffice"] = "principal";
            // goToEntity["customClaims"]["currentBiller"] = `${currentUserIdAuth}_principal`;
            goToEntity["customClaims"]["current"] = {biller: currentUserIdAuth, branchOffice: "principal"};
          }
        } else {
          // goToEntity["customClaims"]["branchOffice"] = goToBillerBranchOffice;
          // goToEntity["customClaims"]["currentBiller"] = `${currentUserIdAuth}_${goToBillerBranchOffice}`;
          goToEntity["customClaims"]["current"] = {biller: currentUserIdAuth, branchOffice: goToBillerBranchOffice};
        }


        goToEntity["customClaims"]["domain"] = goToEntity["domain"];


        myRoles.forEach((myRol) => {
          if (myRol.data()[currentUserIdAuth]["enabled"] === true) {
            if (myRol.id === "developer") {
              goToEntity["customClaims"]["developer"] = true;
              // goToEntity["customClaims"]["developer"] = true;
              // goToEntity["domain"] = originRaw;
            } else {
              goToEntity["customClaims"][`${currentUserIdAuth}_${myRol.id}`] = true;
              // goToEntity["customClaims"][myRol.id] = true;
            }
          }
        });
      } else {
        goToEntity["customClaims"][goToBiller] = true;
        goToEntity["customClaims"][currentUserIdAuth] = true;
        // console.log(`currentUserIdAuth: ${currentUserIdAuth} <> goToBiller: ${goToBiller}`);


        // HARDCODE: Código DUPLICADO - Consulto MIS roles.
        const myRolesRef = dbFS
          .collection("entities").doc(currentUserIdAuth).collection("roles");

        let myRoles = await myRolesRef
          .where(`${currentUserIdAuth}.enabled`, "==", true)
          // .where(`${currentUserIdAuth}.branchOffices`, "array-contains", goToBillerBranchOffice)
          .get();

        if (myRoles.docs.length === 0) {
          myRoles = await myRolesRef
            .where(`${currentUserIdAuth}.enabled`, "==", true)
            // .where(`${currentUserIdAuth}.branchOffices`, "array-contains", "principal")
            .get();

          if (myRoles.docs.length === 0) {
            return Promise.reject(new Error("⚠️ Acceso denegado"));
          } else {
            goToEntity["customClaims"]["current"]["branchOffice"] = "principal";
            // goToEntity["customClaims"]["currentBiller"] = `${currentUserIdAuth}_principal`;
            goToEntity["customClaims"]["current"] = {biller: currentUserIdAuth, branchOffice: "principal"};
          }
        } else {
          goToEntity["customClaims"]["current"]["branchOffice"] = goToBillerBranchOffice;
        }


        goToEntity["customClaims"]["current"]["landingPage"] = false;


        myRoles.forEach((myRol) => {
          if (myRol.data()[currentUserIdAuth]["enabled"] === true) {
            if (myRol.id === "developer") {
              goToEntity["customClaims"]["developer"] = true;
              goToEntity["customClaims"]["developer"] = true;
              goToEntity["customClaims"]["domain"] = goToEntity["domain"];
              goToEntity["domain"] = originRaw;
            } else {
              goToEntity["customClaims"][`${currentUserIdAuth}_${myRol.id}`] = true;
            // goToEntity["customClaims"][myRol.id] = true;
            }
          }
        });


        // console.log(JSON.stringify(goToEntity));


        // Consulto roles en currentBiller.
        const rolesRef = dbFS
          .collection("entities").doc(goToBiller).collection("roles");

        let roles = await rolesRef
          .where(`${goToBiller}.enabled`, "==", true)
          // .where(`${goToBiller}.branchOffices`, "array-contains", goToBillerBranchOffice)
          .get();

        // Si no hay roles en la branchOffice, consulto en la principal.
        if (roles.docs.length === 0) {
          roles = await rolesRef
            .where(`${currentUserIdAuth}.enabled`, "==", true)
            // .where(`${currentUserIdAuth}.branchOffices`, "array-contains", "principal")
            .get();

          if (roles.docs.length === 0) {
            return Promise.reject(new Error("⚠️ Acceso denegado"));
          } else {
            goToEntity["customClaims"]["branchOffice"] = "principal";
          }
        } else {
          goToEntity["customClaims"]["branchOffice"] = goToBillerBranchOffice;
        }


        goToEntity["customClaims"]["landingPage"] = false;


        roles.forEach((rol) => {
          if (rol.data()[currentUserIdAuth]["enabled"] === true) {
            if (rol.id === "developer") {
              goToEntity["customClaims"]["developer"] = true;
              goToEntity["customClaims"]["developer"] = true;
              goToEntity["customClaims"]["domain"] = goToEntity["domain"];
              goToEntity["domain"] = originRaw;
            } else {
              goToEntity["customClaims"][`${goToBiller}_${rol.id}`] = true;
              // goToEntity["customClaims"][rol.id] = true;
            }
          }
        });
      }
      // console.log(goToEntity.data.entitiesAuth);
    } catch (error) {
      console.log(error.message);
    }


    actionCodeSettings = {
      url: goToEntity["domain"],
      handleCodeInApp: true,
      dynamicLinkDomain: "localhost5000.page.link",
    };
    const claims = goToEntity["customClaims"];
    await users.setCustomUserClaims(currentUserIdAuth, claims)
      .then(async () => {
        // await sleep(666);
        await users.revokeRefreshTokens(currentUserIdAuth);
        await sleep(666);
      })
      .catch((error) => {
        return Promise.reject(new Error(error.message));
      });


    try {
      let link = "";
      const uid = await users.getUserByUid(currentUserIdAuth);
      if (uid) {
        link = await auth.generateSignInWithEmailLink(
          uid.email, actionCodeSettings);
        return Promise.resolve({
          response: code.ok,
          link: link,
        });
      } else {
        return Promise.reject(new Error("⚠️ No se encontró el usuario."));
      }
    } catch (error) {
      return Promise.reject(new Error(error.message));
    }
  } else {
    return Promise.reject(new Error("⚠️ Acceso denegado - No hay una sesión activa."));
  }
};


module.exports = {
  getLink,
};
