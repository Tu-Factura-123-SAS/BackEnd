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


    try {
      goToEntity["customClaims"] = {};

      // Nueva funcionalidad para cambiar el facturador
      // if (context.auth.token && context.auth.token.developer) {
      //   goToEntity["customClaims"]["c"] = {...context.auth.token.c, b: goToBiller, bo: goToBillerBranchOffice};
      // }
      rolesRun["customClaims"] = {};


      console.warn("FRONT CLAIMS", JSON.stringify({claiims: context.auth.token.c}));
      goToEntity["customClaims"]["c"] = {...context.auth.token.c, b: goToBiller, bo: goToBillerBranchOffice};
      console.warn("LINK2 :(", JSON.stringify({goToEntity: goToEntity["customClaims"]["c"]}));
      rolesRun["customClaims"]["c"] = goToEntity["customClaims"]["c"];

          // goToEntity["customClaims"]["currentBiller"] = `${goToBiller}_principal`;
          // goToEntity["customClaims"]["c"] = {...context.auth.token.c, b: goToBiller, bo: "principal"};

          // goToEntity["customClaims"]["current"] = {biller: currentUserIdAuth, branchOffice: "principal"};


          // // OJO: debe ser el dominio de origen del currentBranchOffice.
          const {setCurrentBranchOfficeEcommerce} = require("../../eCommerce/init");
          goToEntity["domain"] = await setCurrentBranchOfficeEcommerce(originRaw, currentUserIdAuth, goToBiller, goToBillerBranchOffice);
          console.warn("LINK3", JSON.stringify({goToEntity: goToEntity, currentUserIdAuth: currentUserIdAuth, goToBiller: goToBiller}));

      if (currentUserIdAuth === goToBiller) {
        console.warn("entra a if");
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
            console.warn("PRIMER IF");
            goToEntity["customClaims"]["c"] = {...context.auth.token.c, b: currentUserIdAuth, bo: "principal"};
          }
        } else {
          console.warn("PRIMER IF");
          goToEntity["customClaims"]["c"] = {...context.auth.token.c, b: currentUserIdAuth, bo: goToBillerBranchOffice};
          // se debe validar llamado a rolesruN
        }

        goToEntity["customClaims"]["domain"] = goToEntity["domain"];
        console.warn("RESPONSE ULTIMA", JSON.stringify({goToEntity: goToEntity}));

        goToEntity["customClaims"]["m"] = [];
        myRoles.forEach((myRol) => {
          if (myRol.data()[currentUserIdAuth]["enabled"] === true) {
            if (myRol.id === "developer") {
              goToEntity["customClaims"]["developer"] = true;
            }
            // else {
              // goToEntity["customClaims"][`${currentUserIdAuth}_${myRol.id}`] = true;
              // goToEntity["customClaims"][`${currentUserIdAuth}_${myRol.id}`] = true;
              // goToEntity["customClaims"]["m"].push(myRol.id);
              // goToEntity["customClaims"][myRol.id] = true;
            // }
          }
        });
      } else {
        console.warn("entra a else");
        goToEntity["customClaims"][goToBiller] = true;
        goToEntity["customClaims"][currentUserIdAuth] = true;

        // HARDCODE: Código DUPLICADO - Consulto MIS roles.
        // const myRolesRef = dbFS
        //   .collection("entities").doc(goToBiller).collection("roles");

        // let myRoles = await myRolesRef
        //   .where(`${currentUserIdAuth}.enabled`, "==", true)
        //   // .where(`${currentUserIdAuth}.branchOffices`, "array-contains", goToBillerBranchOffice)
        //   .get();

        // if (myRoles.docs.length === 0) {
        //   myRoles = await myRolesRef
        //     .where(`${currentUserIdAuth}.enabled`, "==", true)
        //     // .where(`${currentUserIdAuth}.branchOffices`, "array-contains", "principal")
        //     .get();

        //   if (myRoles.docs.length === 0) {
        //     return Promise.reject(new Error("⚠️ Acceso denegado"));
        //   } else {
        //     goToEntity["customClaims"]["current"]["branchOffice"] = "principal";
        //     // goToEntity["customClaims"]["currentBiller"] = `${currentUserIdAuth}_principal`;
        //     goToEntity["customClaims"]["current"] = {biller: goToBiller, branchOffice: "principal"};
        //   }
        // } else {
        //   goToEntity["customClaims"]["current"]["branchOffice"] = goToBillerBranchOffice;
        // }


        // goToEntity["customClaims"]["current"]["landingPage"] = false; // validar


        // myRoles.forEach((myRol) => {
        //   if (myRol.data()[currentUserIdAuth]["enabled"] === true) {
        //     if (myRol.id === "developer") {
        //       goToEntity["customClaims"]["developer"] = true;
        //       // goToEntity["customClaims"]["domain"] = goToEntity["domain"];
        //       goToEntity["domain"] = originRaw;
        //     } else {
        //       goToEntity["customClaims"][`${goToBiller}_${myRol.id}`] = true;
        //     // goToEntity["customClaims"][myRol.id] = true;
        //     }
        //   }
        // });


        // console.log(JSON.stringify(goToEntity));

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

          console.warn("RESPONSE ULTIMA ifnal", JSON.stringify({roles: roles.docs.length}));


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

        console.warn("goToEntity domain", JSON.stringify({goToEntity: goToEntity}));

        goToEntity["customClaims"]["landingPage"] = false;
        goToEntity["customClaims"]["domain"] = goToEntity["domain"];
        goToEntity["domain"] = originRaw;
        rolesRun.v0 = await v0(goToEntity["domain"]);
        rolesRun.customClaims.m = [];

        const rolesKeys = Object.keys(roles.docs);

        // roles.forEach(async (rol) => {
        for (const rol of rolesKeys) {
          console.warn("ROLES", JSON.stringify({rolDocs: roles.docs}));
          console.warn("ROLES1", JSON.stringify({rolesKeys: rolesKeys}));
          console.warn("ROLES2", JSON.stringify(roles.docs[rol].data()));

          if (roles.docs[rol].data()[currentUserIdAuth]["enabled"] === true) {
            rolesRun.customClaims.m.push(roles.docs[rol].id);

            if (roles.docs[rol].id === "developer") {
              // goToEntity["customClaims"]["developer"] = true;
              goToEntity.customClaims[roles.docs[rol].id] = true;
              rolesRun.customClaims[roles.docs[rol].id] = true;
            } else {
              goToEntity["customClaims"][`${goToBiller}_${roles.docs[rol].id}`] = true;
              // goToEntity["customClaims"][rol.id] = true;
              const {getOneDocument} = require("../../database/firestore");
              entityData.rolesOperationsRules = await getOneDocument(`/rolesOperationsRules/${roles.docs[rol].id}`);
              console.warn("ignore", JSON.stringify(roles.docs[rol].id));
              console.warn("ignore", JSON.stringify(entityData.rolesOperationsRules));

              if (entityData.rolesOperationsRules.response === code.ok) {
                // ok
                entityData.ignoreCustomClaim = entityData.rolesOperationsRules.data.ignoreCustomClaim || false;
                const operations = await setOperations(entityData, rolesRun);
                console.warn("RESPONSE ULTIMA ifnal", JSON.stringify({operations: operations, rolesRun}));
              }
            }
          }
        }
      }
      // console.log(goToEntity.data.entitiesAuth);
      console.warn("RESPONSE ULTIMA ifnal", JSON.stringify({goToEntity: goToEntity}));


      //  const roles = await getRolesForUser(currentUserIdAuth, newBiller);
      //  configureCustomClaims(goToEntity["customClaims"], roles);
    } catch (error) {
      console.log("EEEERRRROOOORRRR", error.message);
    }

    // for (const rol of roles.docs) {
    //   // rolesRun.customClaims.m.push(doc.id);

    //   entityData.rolesOperationsRules = await getOneDocument(`/rolesOperationsRules/${rol.id}`);
    //   entityData.ignoreCustomClaim = entityData.rolesOperationsRules.data.ignoreCustomClaim || false;

    //   // if (rol.id === "developer") {
    //   //   goToEntity.customClaims[doc.id] = true;
    //   // }

    //   // Aplicamos las operaciones
    //   await setOperations(entityData, rolesRun);
    // }

    // const {setRolesRun} = require("../customClaims/setRolesRun");
    // const tenantV0 = await v0(goToEntity["domain"]);

    // const rolesRun = await setRolesRun(
    //   currentUserIdAuth, // A quien se le asignan los roles.
    //   `${goToBiller}_principal`,
    //   goToEntity["customClaims"].c,
    //   tenantV0,
    // );

    // console.warn("RESPUESTA ROLESRUN", JSON.stringify({rolesRun: rolesRun}));


    goToEntity["domain"] = "https://" + goToEntity["domain"];
    actionCodeSettings = {
      url: goToEntity["domain"],
      handleCodeInApp: true,
      dynamicLinkDomain: "localhost5000.page.link",
      // dynamicLinkDomain: "localhost5000.page.link",
    };
    const claims = {...rolesRun["customClaims"], c: goToEntity["customClaims"]["c"], developer: goToEntity["customClaims"]["developer"]};
    await users.setCustomUserClaims(currentUserIdAuth, claims)
      .then(async () => {
        await sleep(666);
        await users.revokeRefreshTokens(currentUserIdAuth);
        // await sleep(2000);
        console.warn("TERMINA CLAIMS?", JSON.stringify({claims: claims}));
      })
      .catch((error) => {
        console.warn("ERROR CLAIMS?", JSON.stringify({error: error}));

        return Promise.reject(new Error(error.message));
      });


    try {
      let link = "";
      const uid = await users.getUserByUid(currentUserIdAuth);
      console.warn("try 1", JSON.stringify({uid: uid, goToEntity: goToEntity}));

      if (uid) {
        link = await auth.generateSignInWithEmailLink(
          uid.email, actionCodeSettings);
      console.warn("try 2", JSON.stringify({link: link}));

        return Promise.resolve({
          response: code.ok,
          link: link,
        });
      } else {
        return Promise.reject(new Error("⚠️ No se encontró el usuario."));
      }
    } catch (error) {
      console.warn("pasa por catch", JSON.stringify({error: error}));
      return Promise.reject(new Error(error.message));
    }
  } else {
    return Promise.reject(new Error("⚠️ Acceso denegado - No hay una sesión activa."));
  }
};

module.exports = {
  getLink,
};
