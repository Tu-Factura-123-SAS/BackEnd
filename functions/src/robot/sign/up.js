/* eslint-disable require-jsdoc */
const {sendSnackBar, missingParameterX, getEmailFromDian, getNITsFromDian} = require("../../admin/utils");
const {customMessageSignUp, customMessageErrorCatch} = require("../../admin/customMessages");
const {dbFS, users} = require("../../admin");
const {setRoles} = require("../customClaims/setRoles");
const deepDeleteFields = require("../../handle/deepDeleteFields");
const {code} = require("../../admin/responses");


const signUp = (async (
  data, ip, originRaw, mTenantRaw, currentUserIdAuth,
  countryX = "170",
  countryNameX = "Colombia",
  entityX, checkDigitX,
  idTypeX, idTypeTextX, typePersonX,
  thisEmailX,
  // phoneCountryX, phoneCodeCountryX, phoneX,
  displayNameX,
  firstNameX, secondNameX, firstLastNameX, secondLastNameX,
  distX = false,
  staffX = false,
  billerX = false,
  billerBranchOfficeX = false,
) => {
  const {timeStampFirestoreX} = require("../../admin");
  // const {tenant} = require("../../admin/hardCodeTenants");
  const {v0} = require("../../eCommerce/v0");
  const tenantV0 = await v0(mTenantRaw);
  const {signIn} = require("./in");
  let entityDataX = {};

  const photoURLX = `${(tenantV0.url.cdn).replace("localhost:5000", "tufactura.com")}/entities/${entityX}/branchOffices/principal_512x512.png`;

  // let customClaims;
  // const authDomain = tenantV0.setup.authDomain;
  const landingPageV0 = tenantV0.landingPage;
  // const customerLandingPageV0 = tenantV0.customerLandingPage;
  const appCollection = landingPageV0.split("/")[1];
  // const landingPageV0alliance = landingPageV0.split("/")[2];
  // const landingPageV0view = landingPageV0.split("/")[3];
  const landingPage = "/actualiza-tu-RUT";
  // const customerLandingPage = interpolateString(customerLandingPageV0, {entityX: entityX});
  const forced = tenantV0.forced;
  const dist = distX ? distX : tenantV0.eCommerce[0];
  const staff = staffX ? staffX : tenantV0.eCommerce[1];
  const biller = billerX ? billerX : tenantV0.eCommerce[2];
  const billerBranchOffice = billerBranchOfficeX ? billerBranchOfficeX : tenantV0.eCommerce[3];
  const tz = tenantV0.eCommerce[4];
  const alliance = tenantV0.eCommerce[5];
  const allianceBranchOffice = tenantV0.eCommerce[6];

  const v0private = deepDeleteFields(tenantV0, tenantV0.handle);

  let responseX = " ¶¶_noResponse";


  // If the user exists, the login link is sent.
  responseX = await signIn(
    ip, data, originRaw,
    entityX, mTenantRaw,
  );


  if (responseX.isError === false) {
    return sendSnackBar(responseX.messageSnackBar,
      "warning", entityX, responseX, data,
      responseX.messageApp);
  }

  // Validate the minimum required fields to create a user.
  if (missingParameterX(entityX)) {
    // logError(entityX);
    return sendSnackBar(customMessageSignUp.es_error_create,
      "error", entityX, entityX, data);
  }
  if (missingParameterX(thisEmailX)) {
    // return logError(thisEmailX);
    return sendSnackBar(customMessageSignUp.es_error_create,
      "error", entityX, thisEmailX, data);
  }
  if (missingParameterX(displayNameX)) {
    // return logError(displayNameX);
    return sendSnackBar(customMessageSignUp.es_error_create,
      "error", entityX, displayNameX, data);
  }


  const entityNumber = entityX.split("-");

  const currentX = {
    d: dist, // 0 Distribuidor.
    s: staff, // 1 STAFF.
    b: entityX, // 2 biller.
    bo: "principal", // 3 biller Branch Office.
    tz: tz, // 4 Time Zone branchOffice.
    a: alliance, // 5 Alianza.
    ab: allianceBranchOffice, // 6 Alianza Branch Office.
    l: [
      landingPage, // 0
      forced, // 1
    ],
  };

  // v0private["c"] = currentX;


  try {
    const userCreated = await users.createUserInAuth({
      uid: entityX,
      disabled: false,
      email: thisEmailX,
      emailVerified: true,
      photoURL: photoURLX,
      displayName: displayNameX,
    })
      .then(() => {
        return true;
      })
      .catch((error) => {
        return sendSnackBar(customMessageSignUp.es_error_create, "error", entityX, error, data);
      });

    // console.log({userCreated});
    if (userCreated === true) {
      const resolutions = false;


      const batch = dbFS.batch();

      let emailDIANarray = false;
      const emailDIAN = getEmailFromDian([entityNumber[1]]);
      if (emailDIAN) emailDIANarray = getNITsFromDian(emailDIAN);

      entityDataX = {
        id: entityX,
        idType: idTypeX,


        // HARDCODE Consumir API/Functions para establecer localización
        country: countryX,
        countryCode: entityNumber[0],
        countryName: countryNameX,
        postalZone: "000000",
        // landingPage: {[`${entityX}_principal`]: tenantV0.landingPage},

        firstName: firstNameX,
        emailDian: thisEmailX,
        emailDianRegistered: emailDIAN || false,
        emailDianRegisteredNITs: emailDIANarray || false,
        typePerson: typePersonX,
        idTypeText: idTypeTextX,
        checkDigit: checkDigitX,
        firstLastName: firstLastNameX,
        secondName: secondNameX.replace(" ¶¶_secondName", ""),
        secondLastName: secondLastNameX.replace(" ¶¶_secondLastName", ""),
        currentBiller: entityX,
        idNumber: entityNumber[1],
        businessName: displayNameX.toUpperCase(),
        commertialName: displayNameX,
        // HARDCODE PreSets del TENANT desde Firestore
        currentBranchOffice: "principal",
        currentLandingPage: false,
        billingResolutions: false,
        colors: {
          primary: "#03a9f4",
          secondary: "#ffc107",
        },


        entitiesAuth: {
          [entityX + "_principal"]: "Principal: " + displayNameX,
        },


        typeRegime: "49",
        typeResponsability: ["R-99-PN"],
        cbc_TaxLevelCode: "R-99-PN",
        typeRegimeText: "No responsables del IVA",
        cac_TaxScheme_cbc_ID: "ZZ",
        cac_TaxScheme_cbc_Name: "No aplica",
        typePersonText: "Persona Natural y asimiladas",


        cbc_ProfileExecutionID: "2", // https://github.com/JovannyCO/FacturaDIAN-Hosting/issues/180


        show: true,
        verify: false,
        process: false,
        complete: false,
      };

      batch.set(dbFS.doc(
        `/entities/${entityX}`),
      entityDataX,
      {merge: true},
      );


      if (thisEmailX.endsWith("@tufactura.com")) {
        // if (thisEmailX.endsWith("@jovanny.co")) {
        batch.set(dbFS.doc(`/entities/${entityX}/roles/developer`),
          {
            [entityX]: {
              enabled: true,
              commertialName: displayNameX,
              typePerson: typePersonX,
              branchOffices: ["principal"],
            },
          });
      }


      batch.set(dbFS.doc(`/entities/${entityX}/logs/signUp`),
        {
          ip: ip.raw,
          tenant: mTenantRaw,
          origin: originRaw,
          signUp: timeStampFirestoreX,
          registeredBy: currentUserIdAuth,
        });

      batch.set(dbFS.doc(`/entities/${entityX}/branchOffices/principal`),
        {
          eCommerceName: entityX,
          commertialName: displayNameX,
          tz: tz,
          logoRoute: false,
        });


      batch.set(dbFS.doc(`/ a_invoiceAuthorizations/${entityX}`),
        {
          TTL: timeStampFirestoreX,
          [" task"]: {
            ip: ip.raw,
            tenant: mTenantRaw,
            uid: currentUserIdAuth,
          },
        });

      // Se establece los valores por defecto en la misma entidad.
      const customerJourneyPayload = {
        customClaims: {c: currentX},
        entitiesAuth: entityDataX.entitiesAuth,
        v0: v0private,
        app: tenantV0.url.app,
        appLanding: landingPage,
      };
      // firestore.rule   /entities/{alliance}/branchOffices/{allianceBranchOffice}/{appCollection}/{biller}_{branchOffice}/{functionCollection}/{entityX}
      const customersJourneys = `/entities/${alliance}/branchOffices/${allianceBranchOffice}/${appCollection}/${biller}_${billerBranchOffice}/customersJourneys/${entityX}`;

      batch.set(dbFS.doc(customersJourneys),
        customerJourneyPayload,
        {merge: true},
      );

      batch.set(dbFS.doc( `/rolesRun/${entityX}`), customerJourneyPayload);

      await batch.commit();


      const responseSetRoles = await setRoles(
        entityX,
        [{"F00": entityX}, {"F30": entityX}, {"F50": entityX}, {"F60": entityX}, {"F70": entityX}],
        "principal",
        true,
        entityX,
        mTenantRaw,
      );

      if (responseSetRoles.response === code.accepted) {
        const {sleep} = require("../../admin/utils");
        await sleep(3000);
        const {setRolesRun} = require("../customClaims/setRolesRun");
        await setRolesRun(
          entityX, // A quien se le asignan los roles.
          entityDataX.entitiesAuth,
          currentX,
          v0private,
        );
        // Since the user already exists, the login link is sent.
        const messageApp = await signIn(
          ip, data, originRaw,
          entityX, mTenantRaw,
        );
        return sendSnackBar(customMessageSignUp.es_create, "success", entityX, resolutions, data, messageApp.messageApp);
      } else {
        return sendSnackBar(customMessageErrorCatch.es_error_catch, "error", entityX, "Plantilla no existe", data);
      }
    }
  } catch (error) {
    return sendSnackBar(customMessageErrorCatch.es_error_catch,
      "error", entityX, error, data);
  }
});


module.exports = {
  signUp,
};
