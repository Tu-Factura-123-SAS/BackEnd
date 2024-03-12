/* eslint-disable max-len */
// const functions = require("firebase-functions");

const {replaceAllWith} = require("../util/replaceX/all-with");
const {mergeInFirestore} = require("../database/firestore");

module.exports = async (data, context) => {
  // Now, requests with an invalid App Check token are not rejected.
  //
  // context.app will be undefined if the request:
  //   1) Does not include an App Check token
  //   2) Includes an invalid App Check token
  // console.log(context.app);

  if (context.app == undefined) {
    // You can inspect the raw request header to check whether an App
    // Check token was provided in the request. If you're not ready to
    // fully enable App Check yet, you could log these conditions instead
    // of throwing errors.
    const rawToken = context.rawRequest.header["X-Firebase-AppCheck"];
    console.log(rawToken);
    if (rawToken == undefined) {
      return Promise.reject(new ("Failed-precondition: The function must be called from an App Check verified app."));
    } else {
      return Promise.reject(new ("Unauthenticated: Provided App Check token failed to validate."));
    }
  }


  const {code} = require("../admin/responses");
  const {now} = require("moment");

  const delay = {};
  delay["_ini"] = now();

  let debitX = 0.00;
  let creditX = 0.00;
  let currentUserIdAuth = " ¶¶_currentUserIdAuth";

  const hostnameRaw = context.rawRequest.hostname;
  let currentUserRaw = "anonymous@" + hostnameRaw;
  const originRaw = context.rawRequest.headers.origin;
  // En localhost genera error Unhandled error TypeError: Cannot read property 'replace' of undefined
  let mTenantRaw = originRaw.replace("https://", "");
  mTenantRaw = mTenantRaw.replace("http://", "");
  const headersRaw = context.rawRequest.headers;
  // let ip["raw"] = "127.0.0.1";
  const ip = {};
  ip["raw"] = "127.0.0.1";
  ip["text"] = "localhost";

  let responseRobot = {
    response: code.ok,
  };

  // eslint-disable-next-line require-jsdoc
  function dataX(x) {
    if (data[x]) {
      return data[x];
    } else {
      return " ¶¶_" + x;
    }
  }


  if (hostnameRaw != "localhost") {
    ip["raw"] = context.rawRequest.ip;
    ip["text"] = context.rawRequest.ip
      .replace(/\./g, "_")
      .replace(/:/g, "_");
    responseRobot["ip"] = ip;
  }


  if (data.debit) {
    const {incrementFireStoreX} = require("../admin");

    debitX = incrementFireStoreX(data.debit);
  }


  if (data.credit) {
    const {incrementFireStoreX} = require("../admin");

    creditX = incrementFireStoreX(data.credit);
  }


  try {
    if (context.auth) {
      const {auth} = require("../admin");

      currentUserIdAuth = context.auth.uid;
      responseRobot["uid"] = currentUserIdAuth;
      currentUserRaw = await auth.getUser(currentUserIdAuth)
        .then((userRecord) => {
          return JSON.parse(JSON.stringify(userRecord));
        })
        .catch(console.error);
    }


    switch (dataX("call")) {
      /*
      https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/#?
      {
      "call": "filter",
      "callGroup": "objectInArray",
      "array": [],
      "key": "cityName",
      "value": "andres"
      }
      */
    case "filter":
      if (dataX("callGroup") === "objectInArray") {
        const {filterObjectInArray} = require("../admin/utils");
        const responseArray = filterObjectInArray(
          dataX("array"),
          dataX("key"),
          dataX("value"),
        );

        responseRobot["filterObjectInArray"] = {
          response: code.ok,
          objectInArrayCount: responseArray.length,
          objectInArray: responseArray,
        };
      }


      /*
  https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/filter#?
{
  "call": "filter",
  "callGroup": "keysInObject",
  "object": {},
  "value": "dian@Jovanny.CO"
}
  */
      if (dataX("callGroup") === "keysInObject") {
        const {filterKeysInObject} = require("../admin/utils");
        const responseArray = filterKeysInObject(
          dataX("object"),
          dataX("value"),
        );

        responseRobot["filterKeysInObject"] = {
          response: code.ok,
          objectInArrayCount: responseArray.length,
          objectInArray: responseArray,
        };
      }


      break;
    case "runSheet":
      /*
  https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/runSheet#?
{
  "call": "runSheet",
  "callGroup": "import",
"task": {
    "currentBiller": "CO-94523690",
    "templatePath": "/spreadsheetsTemplates/importarPersonasNaturalesDeColombia",
    "spreadsheetId": "1mOEGx1lapbDjEzjzbnZJG8PAFjzWzi--VEjcCakNH0I"
  }
}
  */
      if (dataX("callGroup") !== " ¶¶_callGroup") {
        const {runSheet} = require("../google/sheets");
        responseRobot["runSheet"] = await runSheet(
          dataX("callGroup"),
          dataX("task"),
          "tufactura.com",
          currentUserIdAuth,
          ip,
        );
      }
      // delete data.task;
      if (data.task.payload) {
        data.task.payload = (data.task.payload).length + " bytes"|| 0 + " bytes";
        responseRobot["payload"] = data.task;
      }
      break;
    case "runDrive":
      /*
https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/runDrive#rundrive
{
"call": "runDrive",
"callGroup": "initEntity",
"task": "CO-94523690"
}
*/
      if (dataX("callGroup") !== " ¶¶_callGroup") {
        const {runDrive} = require("../google/drive");
        responseRobot["runDrive"] = await runDrive(
          dataX("callGroup"),
          dataX("task"),
          "tufactura.com",
          currentUserIdAuth,
          ip,
        );
      }
      // delete data.task;
      if (data.task.payload) {
        data.task.payload = (data.task.payload).length + " bytes"|| 0 + " bytes";
        responseRobot["payload"] = data.task;
      }
      break;
    case "document":
      /* documentFast:
      {"call":"document",
      "callGroup":"fast",
      "document": {},
      "task":{}}
        */
      if (dataX("callGroup") === "fast") {
        const {documentFast} = require("./documentFast");

        responseRobot["documentFast"] = await documentFast(
          currentUserRaw,
          dataX("document"),
          dataX("task"), // bolean
        );
      }
      break;
    case "crypto":
      // https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/CryptoX
      // eslint-disable-next-line no-case-declarations
      const {cryptoX} = require("./cryptoX");

      responseRobot["cryptoX"] = cryptoX(
        dataX("callGroup"),
        dataX("text"));
      break;
    case "haveRole": {
        // eslint-dis able-next-line no-case-declarations
        /* haveRole:
      {"call":"haveRole",
      "callGroup":"F70",
      "entity":"CO-94523690"} */
      const {haveRole} = require("./sign/role");

      responseRobot["haveRole"] = await haveRole(
        currentUserIdAuth,
        dataX("callGroup"),
        dataX("entity"));
      }
      break;
    case "run":
      if (dataX("callGroup") === "cache") {
        const {runZcache} = require("../eCommerce/zCache");
        // ver marametros en la función runZcache
        responseRobot["runZcache"] = await runZcache(
          dataX("fx"),
          dataX("parameters"),
        );
      }
      break;
    case "set":
      /*
{
"call":"set",
"callGroup":"v0",
"domain": "localhost5000"
}
*/
      if (dataX("callGroup") === "v0") {
        const {v0} = require("../eCommerce/v0");
        const deepDeleteFields = require("../handle/deepDeleteFields");

        const v0data = await v0(dataX("domain"));
        const v0clean = deepDeleteFields(v0data, v0data.handle);
        const v0handle = JSON.stringify(v0data.handle);
        delete v0data.handle;
        const v0run = {
          ...v0data,
          v0clean: v0clean,
          v0handle: v0handle,
        };


        const {dbFS} = require("../admin");
        const v0ref = dbFS.doc( `/v0/${replaceAllWith(dataX("domain"), [":", "."], "_")}`);

        const batch = dbFS.batch();

        batch.set(v0ref, v0run);

        await batch.commit();


        responseRobot["v0"] = {
          response: code.ok,
        };
      }
      /*
{
"call":"set",
"callGroup":"rolesRun",
"entity": "CO-94523690"
}
*/
      if (dataX("callGroup") === "rolesRun") {
        const {setRolesRun} = require("./customClaims/setRolesRun");
        responseRobot["setRolesRun"] = {
          "response": code.ok,
          "rolesRun": await setRolesRun(
            dataX("entityX"),
          ),
        };
      }
      /*
{
"call":"set",
"callGroup":"photo",
"url":"https://tufactura.com/perfil.webp"
} */
      if (dataX("callGroup") === "photo") {
        const {users} = require("../admin");
        users.setPhoto(currentUserIdAuth, dataX("url"));
        responseRobot["setPhoto"] = {"response": code.ok};
      }

      /*
{
"call":"set",
"callGroup":"roles",
"entity": "CO-1143873040",
"branchOfficeId": "principal",
"initEntity": false,
"customClaims":
  [
    {"F30": "CO-94523690"},
    {"F00": "CO-94523690"}
  ]
}
 */
      if (dataX("callGroup") === "roles") {
        const {setRoles} = require("./customClaims/setRoles");
        responseRobot["setRoles"] = await setRoles(
          dataX("entity"),
          dataX("customClaims"),
          dataX("branchOfficeId"),
          dataX("initEntity"),
          currentUserIdAuth,
          mTenantRaw,
        );
      }


      /*
{"call":"set",
"callGroup":"initRulesDIAN"} */
      if (dataX("callGroup") === "initRulesDIAN") {
        const {setInitRulesDIAN} = require("./processSignedDIANdocument/setInitRulesDIAN");
        responseRobot["setInitRulesDIAN"] = await setInitRulesDIAN();
      }

      /*
        claims:
{
"call":"set",
"callGroup":"merge",
"path":"/test/CO-94523690",
"json": {
"dato1": true,
"dato2": 2,
"datp3": "tres"
}
}

{"call":"set",
"callGroup":"merge",
"path":"/queues/CO-94523690",
"json": {
    "state": "PENDING",
    "collection": "delivered",
    "data": { "message": "Hello from the future!" },
    "deliverTime": "admin.firestore.FieldValue.serverTimestamp()"
    }
}


*/
      if (dataX("callGroup") === "merge") {
        const {mergeInFirestore} = require("../database/firestore");

        mergeInFirestore(
          dataX("path"),
          dataX("json"),
        );
        responseRobot["merge"] = {response: code.accepted};
      }


      if (dataX("callGroup") === "currentBiller") {
        try {
          const {claims} = require("./customClaims");


          responseRobot["claimsCurrentBiller"] = await claims(
            currentUserIdAuth, // HACK: Es el usuario actual
            currentUserIdAuth,
            originRaw,
            dataX("json"),
            dataX("currentBiller"),
          );

          // responseRobot["claims"] = await claims(
          //   currentUserIdAuth, // dataX("entity"),
          //   currentUserIdAuth,
          //   originRaw,
          //   false,
          //   dataX("currentBiller"),
          // );
          // console.log(responseRobot["claimsCurrentBiller"]);
          // await sleep(1000);
        } catch (error) {
          responseRobot["setCurrentBiller"] = {response: code.notFound, error};
        }
        // const {mergeInFirestore} = require("../database/firestore");
        // // const {sleep} = require("../admin/utils");


        // // await sleep(2000);

        // await mergeInFirestore(
        //   dataX("path"),
        //   dataX("json"),
        // );
        // responseRobot["setCurrentBiller"] = {response: code.accepted};
      }


      /*
        claims:
{
"call":"set",
"callGroup":"claims",
"entity":"CO-94523690",
"currentBiller":"CO-94523690"
} */
      if (dataX("callGroup") === "claims") {
        const {claims} = require("./customClaims");

        responseRobot["claims"] = await claims(
          dataX("entity"),
          currentUserIdAuth,
          originRaw,
          false,
          dataX("currentBiller"),
        );
      }


      /*
setTemplateXML:

    TestArrayLevel2
    TestArrayLevel3
    TestData
    TestHardCode

{"call":"set",
"callGroup":"setTemplateXML",
"templatePath":"/xmlTemplates/01_Standard_SandBox",
"unSignedPath": "/ b_xml_parse/CO-94523690_EB_SETT-1236"} */
      if (dataX("callGroup") === "setTemplateXML") {
        const {setTemplateXML} = require("./dian/xml");

        responseRobot["setTemplateXML"] = await setTemplateXML(
          dataX("templatePath"),
          dataX("unSignedPath"));
      } /* RESPONSE:


setCufe:
{"call":"set",
"callGroup":"cufe",
"documentPath": "/entities/CO-94523690/documents/EB_SETT-1"} */
      if (dataX("callGroup") === "cufe") {
        const {setCufe} = require("./dian/cufe");

        responseRobot["setCufe"] = await setCufe(
          dataX("documentPath"));
      } /* RESPONSE:{
        "response":200,
        "setCufe":{"response":201},
        "delay":665}


setCude:
{"call":"set",
"callGroup":"cude",
"documentPath": "/entities/CO-94523690/documents/EB_SETT-1"} */
      if (dataX("callGroup") === "cude") {
        const {setCude} = require("./dian/cude");

        responseRobot["setCude"] = await setCude(
          dataX("documentPath"));
      } /* RESPONSE:{
  "response":200,
  "setCude":{"response":201},
  "delay":665} */


/* {
  "call":"set",
  "callGroup":"landingPage",
  "path":"/documentos",
  "forced": false
}
*/

      if (dataX("callGroup") === "landingPage") {
        const {setLandingPage} = require("../eCommerce/customerJourney/setLandingPage");
        const forced = dataX("forced") === true ? dataX("forced") : false;
        responseRobot["setLandingPage"] = await setLandingPage(dataX("uid"), dataX("path"), forced);
        // uid, path = "", forced = false
      }
      break;
    case "get":
      /*
{
"call":"get",
"callGroup":"textPdf",
"templates":"aTextPdf",
"document":{" b_xml_parse":{" task":{"function":"cadenaSandBox","templatePath":"/xmlTemplates/01_Standard_SandBox","tenant":"tufactura.com","xmlPath":"/entities/CO-1144081388/xml/EB_SETT-4001"},"biller":"/entities/CO-1144081388","branchOffice":"/entities/CO-1144081388/branchOffices/principal","buyer":"/entities/CO-94523690","buyerPhysicalLocation":"/entities/CO-94523690/branchOffices/principal","buyerRegistrationAddress":"/entities/CO-94523690/branchOffices/principal","documents":"/entities/CO-1144081388/documents/EB_SETT-4001","principal":"/entities/CO-1144081388/branchOffices/principal","resolution":"/entities/CO-1144081388/consecutivesControl/18760000001","seller":"/entities/CO-94523690","uid":"CO-94523690"},"aTextPdf":{"DigitalSignature":"blablabla","billerContactInfo":"3235110890, katherin.ortiz@jovanny.co","billerId":"Katherin Ortiz, 1.144.081.388","billerLocation":"Calle 1C # 76A 25, CALI, Valle del Cauca, 760001","buyerLocation":"Calle 1C # 76A 25, CALI, Valle del Cauca, 760001","currencyCode":"Moneda: COP","documentType":"Tipo de factura: Factura de venta","dueDateAndTime":"2022-08-13 T08:57:48","issueDateAndTime":"2022-08-13 T08:57:48","operationType":"Estándar","paymentDetails":"Forma de pago: Contado  Método de pago: Efectivo","productInfo":"SIN NADA (001)"},"billing":{"biller":"CO-1144081388","buyer":"CO-94523690","costCenter":"1","seller":"CO-94523690"},"branchOffices":["principal"],"cac_PaymentMeans_cbc_ID":"1","cac_PaymentMeans_cbc_Text":"Contado","cbc_DocumentCurrencyCode":"COP","cbc_DueDate":"2022-08-19","cbc_ID":"SETT4001","cbc_IndustryClassificationCodeList":" Actividad principal: 0000","cbc_IssueDate":"2022-08-19","cbc_IssueTime":"12:28:19-05:00","cbc_Note":"FACTURA ELECTRÓNICA DE VENTA","created":{"nanoseconds":650000000,"seconds":1660930148},"cufeError":false,"cufeSha384":"d257e70796776013ad67e3c3046c1eb16a4000e83837fa16be8d4394fba7ecac4c59cde2f5f903ef9e745c8f07ccd4d8","document":{"documentType":"01","documentTypeName":"Factura Electrónica de Venta","operationType":"10","operationTypeName":"Estándar *","resolution":{"TestSetId":"3d8c962d-23fd-4d8e-a511-4b79549eeed1","active":true,"branchOffice":"principal","commertialName":"Katherin Ortiz","currentNumber":4001,"endNumber":"5000000","expedition":"2019-01-19","expire":"2030-01-19","id":"18760000001","prefix":"SETT","resolution":"18760000001","resolutionNumber":"18760000001","startNumber":"1","sts_InvoiceAuthorization":"18760000001","technicalKey":"fc8eac422eba16e22ffd8c6f94b3f40a6e38162c","template":"Principal","typeDocumentNumeration":"01"}},"documentId":"EB_SETT-4001","exceptionCharges":"EMPTY","exceptionChargesAndDiscounts":"EMPTY","exceptionDiscounts":"EMPTY","exceptionTaxes":"EMPTY","exceptionTaxesTotal":"NOTAXES","exceptionWithholdings":"EMPTY","globalDiscounts":[],"measurementTypes":"94 - unidad","paymentMethod":[{"cac_PaymentMeans_cbc_ID":"1","cac_PaymentMeans_cbc_Text":"Contado","cbc_PaymentDueDate":"2022-08-19","cbc_PaymentMeansCode":"10","paymentAmount":300,"paymentFormats":"Efectivo"}],"prefix":"SETT","prefixAndNumeration":"SETT-4001","products":[{"aditionalInfo":"","cbc_ID_schemeID":"0","changeType":"COP","descripcion":"SIN NADA","discountAmount":0,"itemNumber":"1","measurementType":"94","measurementTypeText":"94 - unidad","productBill":{"IVA":"Excluido","branchOffices":["principal"],"changeType":"COP","discountsAndCharges":[],"exceptionBrandName":"EMPTY","exceptionChargesAndDiscounts":"EMPTY","exceptionModelName":"EMPTY","exceptionTaxes":"NOTAXES","exceptionTaxes_3":"EMPTY","exceptionWithholdings":"EMPTY","groupedListTaxes":[],"groupedListWithholdings":[],"measurementType":"94","measurementTypeText":"94 - unidad","productCode":"001","productEdit":true,"productName":"SIN NADA","productPrice":"100","productPriceIVA":"100","productType":"999","show":true,"standardCode":"001","taxes":[],"withholding":[]},"productCode":"001","productPrice":100,"productType":"999","productsubTotalUnitaryPrice":100,"quantityOfProduct":1,"rechargesAmount":0,"standardCode":"001","subtotalTaxableBase":0,"totalDiscountsProduct":0,"totalProductPrice":100,"totalRechargesProduct":0,"totalTaxesPerItems":0},{"aditionalInfo":"","cbc_ID_schemeID":"0","changeType":"COP","descripcion":"SIN NADA","discountAmount":0,"itemNumber":"2","measurementType":"94","measurementTypeText":"94 - unidad","productBill":{"IVA":"Excluido","branchOffices":["principal"],"changeType":"COP","discountsAndCharges":[],"exceptionBrandName":"EMPTY","exceptionChargesAndDiscounts":"EMPTY","exceptionModelName":"EMPTY","exceptionTaxes":"NOTAXES","exceptionTaxes_3":"EMPTY","exceptionWithholdings":"EMPTY","groupedListTaxes":[],"groupedListWithholdings":[],"measurementType":"94","measurementTypeText":"94 - unidad","productCode":"001","productEdit":true,"productName":"SIN NADA","productPrice":"100","productPriceIVA":"100","productType":"999","show":true,"standardCode":"001","taxes":[],"withholding":[]},"productCode":"001","productPrice":100,"productType":"999","productsubTotalUnitaryPrice":100,"quantityOfProduct":1,"rechargesAmount":0,"standardCode":"001","subtotalTaxableBase":0,"totalDiscountsProduct":0,"totalProductPrice":100,"totalRechargesProduct":0,"totalTaxesPerItems":0},{"aditionalInfo":"","cbc_ID_schemeID":"0","changeType":"COP","descripcion":"SIN NADA","discountAmount":0,"itemNumber":"3","measurementType":"94","measurementTypeText":"94 - unidad","productBill":{"IVA":"Excluido","branchOffices":["principal"],"changeType":"COP","discountsAndCharges":[],"exceptionBrandName":"EMPTY","exceptionChargesAndDiscounts":"EMPTY","exceptionModelName":"EMPTY","exceptionTaxes":"NOTAXES","exceptionTaxes_3":"EMPTY","exceptionWithholdings":"EMPTY","groupedListTaxes":[],"groupedListWithholdings":[],"measurementType":"94","measurementTypeText":"94 - unidad","productCode":"001","productEdit":true,"productName":"SIN NADA","productPrice":"100","productPriceIVA":"100","productType":"999","show":true,"standardCode":"001","taxes":[],"withholding":[]},"productCode":"001","productPrice":100,"productType":"999","productsubTotalUnitaryPrice":100,"quantityOfProduct":1,"rechargesAmount":0,"standardCode":"001","subtotalTaxableBase":0,"totalDiscountsProduct":0,"totalProductPrice":100,"totalRechargesProduct":0,"totalTaxesPerItems":0}],"quantityItems":"3","state":"DIAN","totals":{"Total":300,"cbc_LineExtensionAmount":300,"cbc_PayableAmount":300,"cbc_RoundingAmount":0,"cbc_TaxInclusiveAmount":300,"cbc_TaxableAmount_currencyID":"COP","chargers":0,"discounts":0,"globalChargers":0,"globalDiscounts":0,"groupedListTaxes":[],"groupedListWithholdings":[],"totalBolsas":0,"totalICA":0,"totalINC":0,"totalIVA":0,"totalTaxableBase":0,"totalIVA":0,"totalWithholdings":0},"uri":{"pdf":"https://drive.google.com/file/d/1iMo4iYHrB9dPLkTDqDzH4teWrmn-ODzK/view?usp=drivesdk","xml":false,"zip":false}}
} */
      if (dataX("callGroup") === "textPdf") {
        // console.log(JSON.parse(dataX("template").dataX("data")));
        const {getTextPdf} = require("./documentFast/aTextPdf");

        responseRobot["getTextPdf"] = await getTextPdf(
          dataX("templates"),
          dataX("document"),
          mTenantRaw,
        );
      }


// test

      /*
{
"call":"get",
"callGroup":"runDriveTest",
"extension":"cadena de texto con {{RULE}}",
"data": {"RULE": "xPath"}
} */

if (dataX("callGroup") === "runDriveTest") {
  // console.log(JSON.parse(dataX("template").dataX("data")));
  // return await Promise.reject(new Error(dataX("run")));
  const {runDrive} = require("../google/drive");

  responseRobot["runDrive"] = await runDrive({
    run: dataX("run"),
    extension: dataX("extension"),
    itemId: dataX("itemId"),
    payload: dataX("payload"),
    pathDocumentStateEntity: dataX("pathDocumentStateEntity"),
  },
  );
}

      /*
{
"call":"get",
"callGroup":"interpolateString",
"template":"cadena de texto con {{RULE}}",
"data": {"RULE": "xPath"}
} */
      if (dataX("callGroup") === "interpolateString") {
        // console.log(JSON.parse(dataX("template").dataX("data")));

        const {interpolateString} = require("../admin/utils");
        responseRobot["getInterpolated"] = interpolateString(
          dataX("template"),
          dataX("data"),
        );
      }
      /*
{"call":"get",
"callGroup":"valuesFromXML",
"xmlSigned":"<XML>",
"xPathObject": {RULE: "xPath"}} */
      if (dataX("callGroup") === "valuesFromXML") {
        const getValuesFromXML = require("./processSignedDIANdocument/getValuesFromXML");
        responseRobot["getValuesFromXML"] = await getValuesFromXML(
          dataX("xmlSigned"),
          dataX("xPathObject"));
      }
      /*
{"call":"get",
"callGroup":"oneCollection",
"collectionPath": "/xmlComponents"} */
      if (dataX("callGroup") === "oneCollection") {
        const {getOneCollection} = require("../database/firestore");

        responseRobot["getOneCollection"] = await getOneCollection(
          dataX("collectionPath"));
      }
      /*
{"call":"get",
"callGroup":"xmlSignedDIAN",
"signedPath": "/ f_xml_reception/CO-1144081388_EB_SETT-2156"} */
      if (dataX("callGroup") === "xmlSignedDIAN") {
        const {xmlSignedDIAN} = require("./processSignedDIANdocument");
        const {getOneDocument} = require("../database/firestore");

        const singXML = await getOneDocument(dataX("signedPath"));

        if (singXML.response === code.ok) {
          // console.log(singXML.data.dian);

          responseRobot["getXMLSignedDIAN"] = await xmlSignedDIAN(
            singXML.data.dian);
        } else {
          responseRobot["xmlSignedDIAN"] = {response: code.notFound};
        }
      }

      /* componentJSON:
{"call":"get",
"callGroup":"componentJSON",
"componentPath":"/xmlComponents/01",
"documentPath":"/ b_xml_parse/CO-94523690_EB_SETT-1"} */
      if (dataX("callGroup") === "componentJSON") {
        const {componentJSON} = require("../robot/dian/xml");
        responseRobot["componentJSON"] = await componentJSON(
          dataX("componentPath"),
          dataX("documentPath"),
          0, 0, true); // Default 0, 0, true
      }

      /*
        getLink:
{
"call":"get",
"callGroup":"link",
"goToBiller": "CO-94523690",
"goToBillerBranchOffice": "principal"
} */
      if (dataX("callGroup") === "link") {
        const {getLink} = require("./sign/link");

        responseRobot["getLink"] = await getLink(
          context,
          dataX("goToBiller"),
          dataX("goToBillerBranchOffice"),
        );
      } /*

    /*
getOneDocument:
{"call":"get",
"callGroup":"XML",
"jsonPath":"/entities/CO-1144081388/xml/EB_SETT-1972"} */
      if (dataX("callGroup") === "XML") {
        const {getXML} = require("../robot/dian/xml");
        const {getThisDocument} = require("../admin/utils");

        const jsonValues = await getThisDocument(dataX("jsonPath"), "XML.jsonValues");
        responseRobot["XML"] = await getXML(
          jsonValues.json,
          true,
        );
      } /*


getOneDocument:
{
"call":"get",
"callGroup":"oneDocument",
"documentPath":"entities/CO-1144081388"
} */
      if (dataX("callGroup") === "oneDocument") {
        const {getOneDocument} = require("../database/firestore");

        responseRobot["getOneDocument"] = await getOneDocument(dataX("documentPath"));
      }


      /* in:
          {"call":"get",
          "callGroup":"cufe",
          "documentPath":"/entities/CO-94523690/documents/EB_SETT-1"} */
      if (dataX("callGroup") === "cufe") {
        const {getOneDocument} = require("../database/firestore");

        // "entities/{countryAndUid}/documents/{typeAndDocumentId}"
        const document = await getOneDocument(dataX("documentPath"));
        const {getCufe} = require("./dian/cufe");

        // console.info(document);
        responseRobot["getCufe"] = await getCufe(document);
      } /* RESPONSE:{
        "response":200,
        "getCufe":{
          "response":200,
          "cufeError":true,
          "sha384":"e41a9791f166a88715ba42dc34dde538d0cc810f8e0054017643928cb5bac0354b533f746535e1158ebe59d3348291be",
          "text":"SETT12021-10-0107:19:53-05:004201680.6701798319.33040.00030.005000000.009452369094523690 ¶¶_technicalKey/2"},
        "delay":470}
      */

      /* in:
          {"call":"get",
          "callGroup":"cude",
          "documentPath":"/entities/CO-94523690/documents/EB_SETT-1"} */
      if (dataX("callGroup") === "cude") {
        const {getOneDocument} = require("../database/firestore");

        // "entities/{countryAndUid}/documents/{typeAndDocumentId}"
        const document = await getOneDocument(dataX("documentPath"));
        const {getCude} = require("./dian/cude");

        // console.info(document);
        responseRobot["getCude"] = await getCude(document);
      } /* RESPONSE:{
        "response":200,
        "getCude":{
          "response":200,
          "cudeError":true,
          "sha384":"e41a9791f166a88715ba42dc34dde538d0cc810f8e0054017643928cb5bac0354b533f746535e1158ebe59d3348291be",
          "text":"SETT12021-10-0107:19:53-05:004201680.6701798319.33040.00030.005000000.009452369094523690 ¶¶_technicalKey/2"},
        "delay":470}
      */
      break;
    case "cadena":


      /* getPayloadActivate: {"call":"cadena",
          "callGroup":"getPayloadActivate",
          "documentPath":"/ b_xml_parse/CO-94523690_EB_SETT-2",
          "SetTestID": "06cb88ad-0c70-4a28-81f3-89f899693a36"} */
      /* if (dataX("callGroup") === "getPayloadActivate") {
                responseRobot = await getPayloadActivate(
                  "tufactura.com",
                  currentUserRaw,
                  dataX("documentPath"),
                  dataX("SetTestID"),
                );
              } */


      /* electronicBillActivate:
  {"call" : "cadena",
  "callGroup" : "activate",
  "entity" : "CO-94523690"
} */
      if (dataX("callGroup") === "activate") {
        const {autoTestSet} = require("./dian/autoTestSet");

        responseRobot["autoTestSet"] = await autoTestSet(
          "tufactura.com", // HARDCODE
          dataX("entity"),
        );
      }


      //       /*
      // {"call" : "cadena",
      // "callGroup" : "activate",
      // "base64":  "xml en base64",
      // "path" : "/entities/CO-1144081388/xml/EB_SETT-40",
      // "modeAPI" : "cadenaSandBox || cadenaActivate || cadenaSign"}
      //    */
      //       // console.log(originRaw);
      //       if (dataX("callGroup") === "activate") {
      //         const {cadenaAPI} = require("./dian/cadena/api");

      //         responseRobot["cadenaAPI"] = await cadenaAPI(
      //           "tufactura.com", // HARDCODE
      //           dataX("base64"),
      //           dataX("path"),
      //           dataX("modeAPI"),
      //         );
      //       }

      //       if (dataX("callGroup") === "sign") {
      //         const {cadenaSign} = require("./dian/cadena/api");

      //         responseRobot["electronicBillSign"] = await cadenaSign(
      //           "tufactura.com",
      //           dataX("templatePath"),
      //           dataX("unSignedPath"),
      //         );
      //       }


      /* getDocumentCadena:
{
"call":"cadena",
"callGroup":"getDocument",
"entity":"CO-1143873040"
}
 */
      if (dataX("callGroup") === "getDocument") {
        const {getDocumentCadena} = require("./dian/cadena/queryDocument");
        responseRobot = getDocumentCadena(dataX("entity"), data);
        responseRobot["ip"] = ip;
      }


      /* getResolutionCadena:
{"call":"cadena",
"callGroup":"getResolutions",
"entity":"CO-900430684"} */
      if (dataX("callGroup") === "getResolutions") {
        const {haveRole} = require("./sign/role");

        const isAccountant = await haveRole(currentUserIdAuth, "F60", dataX("entity"));

        if (isAccountant.F60) {
          const {timeStampFirestoreX} = require("../admin");
          const {mergeInFirestore} = require("../database/firestore");

          await mergeInFirestore(
            `/ a_invoiceAuthorizations/${dataX("entity")}`,
            {
              TTL: timeStampFirestoreX,
              [" task"]: {
                tenant: mTenantRaw,
                uid: currentUserIdAuth,
                function: "getResolutionBackend",
                ip: ip.raw,
                // state: "RETRY",
              },
            }
            , true);
          responseRobot["getResolutions"] = {response: code.accepted};
        } else {
          const {sendSnackBar} = require("../admin/utils");

          responseRobot = sendSnackBar("[Error F60] " + currentUserRaw.displayName +
                  ", no tienes autorización con este facturador.",
          "error",
          dataX("entity"), isAccountant, data);
        }
      }
      break;
    case "sign":
      /* in:

{
"call":"sign",
"callGroup":"in",
"entity":"CO-94523690"
}
 */
      if (dataX("callGroup") === "in") {
        const {signIn} = require("./sign/in");
        responseRobot = await signIn(
          ip, data, originRaw,
          dataX("entity"),
          mTenantRaw,
        );
        responseRobot["ip"] = ip;
      } /* RESPONSE: {"exists":true,
      "messageApp":"Se ha enviado la ruta de acceso
      al correo li*****@gm*****.com
      El acceso estará disponible por 60 minutos.",
      "sendEmailByTriggerFirestore":{}}


up:

{
"call":"sign", "callGroup":"up", "idType":"13", "country": "170", "typePerson":"2", "secondName": "", "checkDigit": "0", "firstName": "Jovanny", "firstLastName": "Medina","countryName": "Colombia", "secondLastName": "Cifuentes", "idTypeText":"Cédula de ciudadanía", "displayName": "Jovanny Medina Cifuentes",
"entity":"CO-94523690",
"thisEmail":"info@Jovanny.CO"
}


{"call":"sign",
"callGroup":"up",
"country": "170",
"countryName": "Colombia",
"entity":"CO-1143873040",
"checkDigit": "0",
"idType":"13",
"idTypeText":"Cédula de ciudadanía",
"typePerson":"2",
"thisEmail":"Mawers.Bravo@tuFactura.com",
"displayName": "Mawers Stivens Patiño Bravo",
"firstName": "Mawers",
"secondName": "Stivens",
"firstLastName": "Patiño",
"secondLastName": "Bravo"} */
      if (dataX("callGroup") === "up") {
        await mergeInFirestore("/entities/CO-901318433/documents/response", {
          data: data,
          delay: delay,
        }, true);

        const {signUp} = require("./sign/up");
        responseRobot = await signUp(
          data, ip, originRaw, mTenantRaw, currentUserIdAuth,
          dataX("country"), dataX("countryName"),
          dataX("entity"), dataX("checkDigit"),
          dataX("idType"), dataX("idTypeText"), dataX("typePerson"),
          dataX("thisEmail"),
          // dataX("phoneCountry"), dataX("phoneCodeCountry"), dataX("phone"),
          dataX("displayName"),
          dataX("firstName"), dataX("secondName"), dataX("firstLastName"), dataX("secondLastName"),
        );
      }
      break;
    case "isRegistered":
      /* INPUT:
{
"call":"isRegistered",
"callGroup":"authUserId",
"entity":"CO-94523690"
}
          */
      if (dataX("callGroup") === "authUserId") {
        const {authUserIdIsRegistered} = require("../admin/isAvailable");

        responseRobot = await authUserIdIsRegistered(dataX("entity"));
      } /* RESPONSE: {"isError":false,
      "messageSnackBar":"Tu usuario tiene registrado el número 300 *** **08 y el email in*****@vi*****.net",
      "colorSnackBar":"info",
      "isRegistered":true}*/

      break;
    case "isAvailable":
      /* mail:
{
"call":"isAvailable",
"callGroup":"mail",
"thisEmail":"limeyer@gmail.com"
}
       */
      if (dataX("callGroup") === "mail") {
        const {emailIsAvailable} = require("../admin/isAvailable");
        // const {users} = require("../admin");

        // const validateEmail = await users.sendVerificationEmail(dataX("thisEmail"));
        // console.log(validateEmail);

        responseRobot = await emailIsAvailable(dataX("thisEmail"));
      } /* RESPONSE: {"isError":false,
      "messageSnackBar":"Tu email ya está asignado al usuario 945******90 con teléfono 300 *** **08",
      "colorSnackBar":"warning",
      "isAvailable":false}


phoneNumber: {"call":"isAvailable",
"callGroup":"phoneNumber",
"phoneNumber":"+573004080808"} */
      if (dataX("callGroup") === "phoneNumber") {
        const {phoneNumberIsAvailable} = require("../admin/isAvailable");

        responseRobot = await phoneNumberIsAvailable(dataX("phoneNumber"));
      } /* RESPONSE: {"isError":false,
      "messageSnackBar":"Tu número ya está asignado a la identificación 945******90 con email li*****@gm*****.com",
      "colorSnackBar":"warning",
      "isAvailable":false} */

      break;
    case "overview": {
      // eslint-disable-next-line no-case-declarations
      const {overviewX} = require("./logTF/overviewX");
      const {mergeInFirestore} = require("../database/firestore");

      /* overview: {"credit":0.00,
          "debit":111.33,
          "document":"EB",
          "call":"overview",
          "entity":"CO-94523690",
          "callGroup":"documentsSigned",
          "callDescription": "Documentos firmados electrónicamente por la DIAN"} */
      await mergeInFirestore(
        "/entities/" + dataX("entity") +
          "/overview/global",
        overviewX(
          currentUserIdAuth,
          dataX("document"), debitX, creditX,
          dataX("call"), dataX("callGroup"), dataX("callDescription"),
        ))
        .catch(console.error);
      // eslint-disable-next-line no-case-declarations

      await mergeInFirestore(
        "/entities/" + dataX("entity") +
          "/overview/" + currentUserIdAuth,
        overviewX(
          currentUserIdAuth,
          dataX("document"), debitX, creditX,
          dataX("call"), dataX("callGroup"), dataX("callDescription"),
        ))
        .catch(console.error);
      responseRobot = {
        response: code.ok,
      };
    }
      break;
    case "testXML":
      // eslint-disable-next-line no-case-declarations
      const {responseXML} = require("./xmlTF/developerResponse");

      responseRobot = {
        XML: responseXML(
          dataX("document"),
          currentUserIdAuth, dataX("entity"),
          dataX("call"), dataX("callGroup"),
          originRaw, mTenantRaw, hostnameRaw,
        ),
      };
      break;
    case "frontEnd":
      /* {"call": "frontEnd",
    "callGroup": "error",
    "name": "/qwerty",
    "error":"ejemplo error"} */
      if (dataX("callGroup") === "error") {
        const {sendSnackBar} = require("../admin/utils");

        responseRobot = await sendSnackBar(dataX("name"),
          "error", currentUserIdAuth + "/" + dataX("entity"), dataX("error"), data);
      }
      break;
      /*
    case "converter":
      if (dataX("callGroup") === "xml2json") {
        return xmlToJson();
      }

      break;
     */

    default:
      break;
    }

    if (data >= 12 && data <= 1e8 || data >= 1e9 && data <= 2e9) {
      const {signUpBatch} = require("./sign/batch");

      responseRobot["signUpBatch"] = await signUpBatch(data);
    }

    delay["_end"] = now();
    delay["lag"] = delay._end - delay._ini;
    responseRobot["delay"] = {tf: delay.lag};

    const {timeStampRealTimeX, accumulatedDbRealtime} = require("../database/realtime/accumulated");

    const logX = {
      data: data,
      header: headersRaw,
      user: currentUserRaw,
      response: responseRobot,
      last: timeStampRealTimeX,
      byLast: accumulatedDbRealtime(),
      byIp: {
        [ip["text"]]: accumulatedDbRealtime(),
      },
      byEntity: {
        [dataX("entity")]: accumulatedDbRealtime(),
      },
      byCall: {
        [dataX("call") + "§" + dataX("callGroup")]: accumulatedDbRealtime(),
      },
    };


    const {writeInRealtime} = require("../database/realtime");

    await writeInRealtime(accumulatedDbRealtime(), "byLast",
      "byUID/" + currentUserIdAuth + "/ip/" + (ip["raw"]).replace(/\./g, "_"),
      "user");

    /* await writeInRealtime(accumulatedDbRealtime(), "byLast",
      "byUID/" + currentUserIdAuth + "/call/" + dataX("call") + "§" + dataX("callGroup"),
      "user");


    await writeInRealtime(accumulatedDbRealtime(), "byLast",
      "byUID/" + currentUserIdAuth + "/entity/" + dataX("entity"),
      "user");


    await writeInRealtime(accumulatedDbRealtime(), "byLast",
      "byCall/" + dataX("call") + "§" + dataX("callGroup") + "/" + currentUserIdAuth,
      "user");

    await writeInRealtime(accumulatedDbRealtime(), "byLast",
      "byIp/" + (ip["raw"]).replace(/\./g, "_") + "/" + currentUserIdAuth,
      "user"); */

    await writeInRealtime(logX, "lastContext",
      "byUID/" + currentUserIdAuth + "/lastContext/",
      "user");


    delay["_end2"] = now();
    delay["log"] = delay._end2 - delay._end;
    responseRobot["delay"]["log"] = delay.log;
    responseRobot["delay"]["full"] = (delay.log + delay.lag);

    return responseRobot;
  } catch (error) {
    const {sendSnackBar} = require("../admin/utils");

    return sendSnackBar(error.message, "error",
      dataX("entity"), error, data);
  }
};
