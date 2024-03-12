/* eslint-disable require-jsdoc */
const {code} = require("../../admin/responses");
const {sleep} = require("../../admin/utils");
const {v0} = require("../../eCommerce/v0");
const {auth, users, dbFS} = require("../../admin");
const setOperations = require("../customClaims/setOperations.js");


const getLink = async (
  context,
  goToBiller,
  goToBillerBranchOffice,
) => {
  let originRaw = false;
  let currentUserIdAuth = false;
  let actionCodeSettings = false;
  const rolesRun = {};

 // valida si hay sesión activa
  if (context.auth) {
    originRaw = context.rawRequest.headers.origin;
    originRaw = originRaw.replace("https://", "");
    currentUserIdAuth = context.auth.uid;
    const goToEntity = {};
    let changedToUid = false;

    try {
      goToEntity["customClaims"] = {};

      // Nueva funcionalidad para cambiar el facturador
      // if (context.auth.token && context.auth.token.developer) {
      //   goToEntity["customClaims"]["c"] = {...context.auth.token.c, b: goToBiller, bo: goToBillerBranchOffice};
      // }
      rolesRun["customClaims"] = {};

      goToEntity["customClaims"]["c"] = {...context.auth.token.c, b: goToBiller, bo: goToBillerBranchOffice};
      rolesRun["customClaims"]["c"] = goToEntity["customClaims"]["c"];
      // // OJO: debe ser el dominio de origen del currentBranchOffice.
      const {setCurrentBranchOfficeEcommerce} = require("../../eCommerce/init");
      goToEntity["domain"] = await setCurrentBranchOfficeEcommerce(originRaw, currentUserIdAuth, goToBiller, goToBillerBranchOffice);

      goToEntity["customClaims"][goToBiller] = true;
      goToEntity["customClaims"][currentUserIdAuth] = true;

      // Consulto roles en currentBiller.
      const rolesRef = dbFS
        .collection("entities").doc(goToBiller).collection("roles");

      let roles = await rolesRef
        .where(`${currentUserIdAuth}.enabled`, "==", true)
        .get();

        const entityData = {
          entitiesAuth: {[`CO-300_principal`]: "Usuario Tres", [`CO-1144081081_principal`]: "Test"},
        };

        rolesRun.customClaims = {};
        rolesRun.entitiesAuth = entityData.entitiesAuth;

        // Si no hay roles en la branchOffice, consulto en la principal.
        if (roles.docs.length === 0) {
          const rolesRefAuth = dbFS
          .collection("entities").doc(currentUserIdAuth).collection("roles");
          roles = await rolesRefAuth
            .where(`${currentUserIdAuth}.enabled`, "==", true)
            .get();

          if (roles.docs.length === 0) {
            return Promise.reject(new Error("⚠️ Acceso denegado"));
          } else {
            goToEntity["customClaims"]["branchOffice"] = "principal";
            changedToUid = true;
            goToEntity["customClaims"]["c"] = {...context.auth.token.c, b: currentUserIdAuth, bo: "principal"};
            rolesRun["customClaims"]["c"] = goToEntity["customClaims"]["c"];
          }
        } else {
          goToEntity["customClaims"]["branchOffice"] = goToBillerBranchOffice;
        }

        goToEntity["customClaims"]["landingPage"] = false;
        goToEntity["customClaims"]["domain"] = goToEntity["domain"];
        goToEntity["domain"] = originRaw;
        rolesRun.v0 = await v0(goToEntity["domain"]);
        rolesRun.customClaims.m = [];

        const rolesKeys = Object.keys(roles.docs);

        for (const rol of rolesKeys) {
          if (roles.docs[rol].data()[currentUserIdAuth]["enabled"] === true) {
            rolesRun.customClaims.m.push(roles.docs[rol].id);

            if (roles.docs[rol].id === "developer") {
              goToEntity.customClaims[roles.docs[rol].id] = true;
              rolesRun.customClaims[roles.docs[rol].id] = true;
            } else {
              goToEntity["customClaims"][`${goToBiller}_${roles.docs[rol].id}`] = true;
              const {getOneDocument} = require("../../database/firestore");
              entityData.rolesOperationsRules = await getOneDocument(`/rolesOperationsRules/${roles.docs[rol].id}`);

              if (entityData.rolesOperationsRules.response === code.ok) {
                entityData.ignoreCustomClaim = entityData.rolesOperationsRules.data.ignoreCustomClaim || false;
                await setOperations(entityData, rolesRun);
              }
            }
          }
        }
    } catch (error) {
      return Promise.reject(new Error(error.message));
    }

    goToEntity["domain"] = "https://" + goToEntity["domain"];
    actionCodeSettings = {
      url: goToEntity["domain"],
      handleCodeInApp: true,
      dynamicLinkDomain: "localhost5000.page.link",
    };
    const claims = {...rolesRun["customClaims"], c: goToEntity["customClaims"]["c"], developer: goToEntity["customClaims"]["developer"]};
    await users.setCustomUserClaims(currentUserIdAuth, claims)
      .then(async () => {
        await sleep(666);
        await users.revokeRefreshTokens(currentUserIdAuth);
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
          changedToUid: changedToUid,
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
