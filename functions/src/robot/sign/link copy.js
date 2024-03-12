/* eslint-disable require-jsdoc */
const {code} = require("../../admin/responses");
const {sleep} = require("../../admin/utils");
// const {sleep} = require("../../admin/utils");

const {auth, users, dbFS} = require("../../admin");

const getLink = async (
  context,
  goToBiller,
  goToBillerBranchOffice,

  // newBiller,

) => {
  let originRaw = false;
  let currentUserIdAuth = false;
  let actionCodeSettings = false;


  // const actionCodeSettings = {url: "https://tufactura123.col.marketing", handleCodeInApp: true};


  if (context.auth) {
    originRaw = context.rawRequest.headers.origin;
    originRaw = originRaw.replace("https://", "");
    currentUserIdAuth = context.auth.uid;
    const goToEntity = {};


    try {
      goToEntity["customClaims"] = {};

      // Nueva funcionalidad para cambiar el facturador
      if (context.auth.token && context.auth.token.developer) {
        // if (context.auth.customClaims && context.auth.customClaims.developer) {
        goToEntity["customClaims"]["c"] = {...context.auth.token.c, b: goToBiller, bo: goToBillerBranchOffice};
        // goToEntity["customClaims"]["current"] = {biller: goToBiller, branchOffice: goToBillerBranchOffice};
      }

      //  if (currentUserIdAuth === newBiller) {
        //  goToEntity["customClaims"]["current"] = { biller: currentUserIdAuth, branchOffice: "principal" };
        //  } else {
          //  goToEntity["customClaims"]["current"] = { biller: newBiller, branchOffice: "principal" };

          // Actualizar roles según el nuevo facturador
          //  await updateRolesForNewBiller(currentUserIdAuth, newBiller);


          // goToEntity["customClaims"]["currentBiller"] = `${currentUserIdAuth}_principal`;
          goToEntity["customClaims"]["c"] = {...context.auth.token.c, b: currentUserIdAuth, bo: "principal"};

          // goToEntity["customClaims"]["current"] = {biller: currentUserIdAuth, branchOffice: "principal"};
          console.warn("LINK2", JSON.stringify({goToEntity: goToEntity}));


          // // OJO: debe ser el dominio de origen del currentBranchOffice.
          const {setCurrentBranchOfficeEcommerce} = require("../../eCommerce/init");
          goToEntity["domain"] = await setCurrentBranchOfficeEcommerce(originRaw, currentUserIdAuth, goToBiller, goToBillerBranchOffice);
          console.warn("LINK3", JSON.stringify({goToEntity: goToEntity, currentUserIdAuth: currentUserIdAuth, goToBiller: goToBiller}));

      // console.log(await getCustomClaimsFromRoles(currentUserIdAuth, goToBiller, goToBillerBranchOffice));

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
            console.warn("PRIMER IF");

            // goToEntity["customClaims"]["branchOffice"] = "principal";
            // goToEntity["customClaims"]["currentBiller"] = `${currentUserIdAuth}_principal`;
            // goToEntity["customClaims"]["current"] = {biller: currentUserIdAuth, branchOffice: "principal"};
            goToEntity["customClaims"]["c"] = {...context.auth.token.c, b: currentUserIdAuth, bo: "principal"};
          }
        } else {
          console.warn("PRIMER IF");

          // goToEntity["customClaims"]["branchOffice"] = goToBillerBranchOffice;
          // goToEntity["customClaims"]["currentBiller"] = `${currentUserIdAuth}_${goToBillerBranchOffice}`;
          // goToEntity["customClaims"]["current"] = {biller: currentUserIdAuth, branchOffice: goToBillerBranchOffice};
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
              // goToEntity["customClaims"]["developer"] = true;
              // goToEntity["domain"] = originRaw;
            } else {
              // goToEntity["customClaims"][`${currentUserIdAuth}_${myRol.id}`] = true;
              // goToEntity["customClaims"][`${currentUserIdAuth}_${myRol.id}`] = true;
              // goToEntity["customClaims"]["m"].push(myRol.id);
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
      console.warn("RESPONSE ULTIMA ifnal", JSON.stringify({goToEntity: goToEntity}));


      //  const roles = await getRolesForUser(currentUserIdAuth, newBiller);
      //  configureCustomClaims(goToEntity["customClaims"], roles);
    } catch (error) {
      console.log(error.message);
    }

    const {setRolesRun} = require("../customClaims/setRolesRun");

    const rolesRun = await setRolesRun(
      currentUserIdAuth, // A quien se le asignan los roles.
      `${currentUserIdAuth}_principal`,
      goToEntity["customClaims"].c,
    );

    console.warn("RESPUESTA ROLESRUN", JSON.stringify({rolesRun: rolesRun}));


    goToEntity["domain"] = "https://" + goToEntity["domain"];
    actionCodeSettings = {
      url: goToEntity["domain"],
      handleCodeInApp: true,
      dynamicLinkDomain: "localhost5000.page.link",
      // dynamicLinkDomain: "localhost5000.page.link",
    };
    // const claims = goToEntity["customClaims"];
    // await users.setCustomUserClaims(currentUserIdAuth, claims)
    //   .then(async () => {
    //     // await sleep(666);
        await users.revokeRefreshTokens(currentUserIdAuth);
        await sleep(2000);
    //     console.warn("TERMINA CLAIMS?", JSON.stringify({claims: claims}));
    //   })
    //   .catch((error) => {
    //     console.warn("ERROR CLAIMS?", JSON.stringify({error: error}));

    //     return Promise.reject(new Error(error.message));
    //   });


    try {
      let link = "";
      const uid = await users.getUserByUid(currentUserIdAuth);
      console.warn("try 1", JSON.stringify({uid: uid}));

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

// async function updateRolesForNewBiller(currentUserId, newBiller) {
  // try {
    // Lógica para actualizar roles según el nuevo facturador
    // const newBillerRoles = await dbFS.collection("entities").doc(newBiller).collection("roles").get();

    // Actualizar roles del usuario actual con los roles del nuevo facturador
    //  newBillerRoles.forEach((role) => {
      // const roleId = role.id;
      // const roleData = role.data();

      // Lógica para actualizar roles del usuario actual según el nuevo facturador
      // dbFS.collection("entities").doc(currentUserId).collection("roles").doc(roleId).set(roleData);
    // });
    // return Promise.resolve();
  // } catch (error) {
    // return Promise.reject(new Error(`Error al actualizar roles: ${error.message}`));
  // }
// }

// async function getRolesForUser(currentUserId, newBiller) {
  //  try {
    // Lógica para obtener roles del usuario según el nuevo facturador
    // Aquí asumo que los roles del usuario están almacenados en una colección dentro del documento del usuario.
    //  const userRolesSnapshot = await dbFS.collection("entities").doc(currentUserId).collection("roles").get();
    //  const userRoles = {};

    // Construir la estructura de roles del usuario
    //  userRolesSnapshot.forEach((role) => {
    //  const roleId = role.id;
    //  const roleData = role.data();
    //  userRoles[roleId] = roleData;
    //  });

    //  return Promise.resolve(userRoles);
  //  } catch (error) {
  //  return Promise.reject(new Error(`Error al obtener roles del usuario: ${error.message}`));
  //  }
//  }

//  function configureCustomClaims(customClaims, roles) {
//  try {
    // Lógica para configurar customClaims según los roles
    // Aquí asumo que los roles y customClaims tienen una relación directa.
    //  for (const roleId in roles) {
    //  const roleValue = roles[roleId];
    //  customClaims[roleId] = roleValue;
    //  }

    //  return Promise.resolve();
  //  } catch (error) {
  //  return Promise.reject(new Error(`Error al configurar customClaims: ${error.message}`));
  //  }
//  }
module.exports = {
  getLink,
};
