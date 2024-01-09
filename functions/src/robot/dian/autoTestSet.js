const autoTestSet = async (
  mTenantRaw,
  entityX,
  sandoBox = false,
) => {
  const {dbFS, timeStampFirestoreX, incrementFireStoreX} = require("../../admin");
  const {emoji} = require("../../admin/standards/emoji");
  const {code} = require("../../admin/responses");
  const {getOneDocument} = require("../../database/firestore");
  const {getCude} = require("./cude");
  const {getCufe} = require("./cufe");
  const {nowX, sleep} = require("../../admin/utils");
  const autoDate = nowX.format("YYYY-MM-DD");
  const autoTime = nowX.format("HH:mm:ssZ");


  let billCufe = "";
  const batchLater = dbFS.batch();
  const batchPrevious = dbFS.batch();
  const batchNdNc = dbFS.batch();
  const messageXML = {};

  // Los documentos firmados en test anteriores no se deben enviar de nuevo
  const consecutiveTestSet = await getOneDocument(
    `/multiTenants/${mTenantRaw}/${entityX}/sts_InvoiceAuthorization`,
    "consecutiveTestSet");
  // console.log(consecutiveTestSet);
  let actual = 0;
  consecutiveTestSet.response === code.ok ?
    actual = consecutiveTestSet.data.testSet :
    actual = 1;

  const consecutiveRef = dbFS.doc(
    `/mTenant/${mTenantRaw}/` +
    `${entityX}/sts_InvoiceAuthorization`);

  const messageXMLref = dbFS.doc(
    `/entities/${entityX}/`);

  let runFunction = "";
  sandoBox === true ?
    runFunction = "cadenaSandBox":
    runFunction = "cadenaActivate";


  batchPrevious.set(messageXMLref, {
    messageXML: "🧾",
  }, {
    merge: true,
  });

  batchLater.set(consecutiveRef, {
    testSet: incrementFireStoreX(8),
  }, {
    merge: true,
  });


  try {
    for (let i = actual; i < (actual + 8); i++) {
      messageXML[`SETT ${i}`] = emoji.memo;


      const pathRef = dbFS.doc(`/ b_xml_parse/${entityX}_EB_SETT-${i}`);
      const documentRef = dbFS.doc(`/entities/${entityX}/documents/EB_SETT-${i}`);

      const xmlParse = {
        " task": {
          function: runFunction,
          xmlPath: `/entities/${entityX}/xml/EB_SETT-${i}`,
          templatePath: "/xmlTemplates/01_Standard_Activation",
          tenant: mTenantRaw,
        },
        "biller": `/entities/${entityX}`,
        "branchOffice": `/entities/${entityX}/branchOffices/principal`,
        "buyer": "/entities/CO-222222222222",
        "buyerPhysicalLocation": "/entities/CO-222222222222/branchOffices/principal",
        "buyerRegistrationAddress": "/entities/CO-222222222222/branchOffices/principal",
        "document": `/entities/${entityX}/documents/EB_SETT-${i}`,
        "principal": `/entities/${entityX}/branchOffices/principal`,
        "resolution": `/entities/${entityX}/consecutivesControl/18760000001`,
        "seller": `/entities/${entityX}`,
        "uid": `${entityX}`,
      };


      const documentsTestSet = {
        " b_xml_parse": {
          " task": {
            function: runFunction,
            xmlPath: `/entities/${entityX}/xml/EB_SETT-${i}`,
            templatePath: "/xmlTemplates/01_Standard_Activation",
            tenant: mTenantRaw,
          },
          "biller": `/entities/${entityX}`,
          "branchOffice": `/entities/${entityX}/branchOffices/principal`,
          "buyer": "/entities/CO-222222222222",
          "buyerPhysicalLocation": "/entities/CO-222222222222/branchOffices/principal",
          "buyerRegistrationAddress": "/entities/CO-222222222222/branchOffices/principal",
          "document": `/entities/${entityX}/documents/EB_SETT-${i}`,
          "principal": `/entities/${entityX}/branchOffices/principal`,
          "resolution": `/entities/${entityX}/consecutivesControl/18760000001`,
          "seller": `/entities/${entityX}`,
          "uid": `${entityX}`,
        },
        "Signed": timeStampFirestoreX,
        "billing": {
          "biller": entityX,
          "seller": entityX,
          "costCenter": "1",
          "buyer": "CO-222222222222",
        },
        "branchOffices": ["principal"],
        "cac_PaymentMeans_cbc_ID": "1",
        "cac_PaymentMeans_cbc_Text": "Contado",
        "cbc_DocumentCurrencyCode": "COP",
        "cbc_DueDate": autoDate,
        "cbc_ID": `SETT${i}`,
        "cbc_IndustryClassificationCodeList": " Actividad principal: 0000",
        "cbc_IssueDate": autoDate,
        "cbc_IssueTime": autoTime,
        "cbc_Note": `FACTURA ELECTRÓNICA DE VENTA ${i}`,
        "created": timeStampFirestoreX,

        "document": {
          "documentType": "01",
          "documentTypeName": "Factura Electrónica de Venta",
          "operationType": "10",
          "operationTypeName": "Estándar *",
          "resolution": { // BUG
            "TestSetId": "e6591e43-5b91-4936-9a67-307ae7a2808c",
            "active": true,
            "branchOffice": "principal",
            "commertialName": "Jovanny Medina Cifuentes",
            "currentNumber": `${i}`,
            "endNumber": "5000000",
            "expedition": autoDate,
            "expire": autoDate,
            "id": "18760000001",
            "prefix": "SETT",
            "resolution": "18760000001",
            "resolutionNumber": "18760000001",
            "resolutionText": "Set de pruebas DIAN - Rango desde SETT 1 hasta SETT 5000000 - FACTURA ELECTRÓNICA DE PRUEBA",
            "startNumber": "1",
            "sts_InvoiceAuthorization": 18760000001,
            "technicalKey": "fc8eac422eba16e22ffd8c6f94b3f40a6e38162c",
            "template": "Principal",
            "typeDocumentNumeration": "01",
          },
        },
        "documentId": `EB_SETT-${i}`,
        "exceptionCharges": "EMPTY",
        "exceptionChargesAndDiscounts": "EMPTY",
        "exceptionDiscounts": "EMPTY",
        "exceptionTaxes": "EMPTY",
        "exceptionTaxesTotal": "NOTAXES",
        "exceptionWithholdings": "EMPTY",
        "globalDiscounts": [],
        "measurementTypes": "94 - unidad",
        "paymentMethod": [
          {
            "cac_PaymentMeans_cbc_ID": "1",
            "cac_PaymentMeans_cbc_Text": "Contado",
            "cbc_PaymentDueDate": autoDate,
            "cbc_PaymentMeansCode": "10",
            "paymentAmount": 1000,
            "paymentFormats": "Efectivo",
          },
        ],
        "prefix": "SETT",
        "prefixAndNumeration": `SETT-${i}`,

        "products": [
          {
            "aditionalInfo": "",
            "cbc_ID_schemeID": "0",
            "changeType": "COP",
            "descripcion": `Test ${i}`,
            "discountAmount": 0,
            "itemNumber": "1",
            "measurementType": "94",
            "measurementTypeText": "94 - unidad",
            "productBill": {
              "IVA": "Excluido",
              "barCode": "",
              "branchOffices": ["principal"],
              "cbc_BrandName": "marca",
              "cbc_ModelName": "modelo",
              "changeType": "COP",
              "discountsAndCharges": [],
              "exceptionChargesAndDiscounts": "EMPTY",
              "exceptionTaxes": "NOTAXES",
              "exceptionTaxes_3": "EMPTY",
              "exceptionWithholdings": "EMPTY",
              "groupedListTaxes": [],
              "groupedListWithholdings": [],
              "measurementTypeText": "94 - unidad",
              "measurementType": "94",
              "productCode": `TEST${i}`,
              "productEdit": true,
              "productInfo": "",
              "productName": `Test ${i}`,
              "productPrice": 1000,
              "productPriceIVA": 1000,
              "productReference": "",
              "productType": "999",
              "show": true,
              "standardCode": `TEST${i}`,
              "taxes": [],
              "withholding": [],

            },
            "productCode": `TEST${i}`,
            "productPrice": 1000,
            "productType": "999",
            "productsubTotalUnitaryPrice": 1000,
            "quantityOfProduct": 1,
            "rechargesAmount": 0,
            "standardCode": `TEST${i}`,
            "subtotalTaxableBase": 0,
            "totalDiscountsProduct": 0,
            "totalProductPrice": 0,
            "totalRechargesProduct": 0,
            "totalTaxesPerItems": 0,
          },
        ],
        "quantityItems": "1",
        "state": "Firmado",
        "totals": {
          "Total": 1000,
          "cbc_LineExtensionAmount": 1000, // subTotal
          "cbc_PayableAmount": 1000,
          "cbc_RoundingAmount": 0,
          "cbc_TaxInclusiveAmount": 1000, // subTotal2
          "cbc_TaxableAmount_currencyID": "COP",
          "chargers": 0,
          "discounts": 0,
          "globalChargers": 0,
          "globalDiscounts": 0,
          "groupedListTaxes": [],
          "groupedListWithholdings": [],
          "totalBolsas": 0,
          "totalICA": 0,
          "totalINC": 0,
          "totalIVA": 0,
          "totalTaxableBase": 0,
          // "totalIVA": 0,
          "totalWithholdings": 0,
        },
      };


      const tmpCufe = {
        response: code.ok,
        data: documentsTestSet,
      };
      const withCUFE = await getCufe(tmpCufe);
      if (withCUFE.response === code.ok) {
        billCufe = withCUFE.sha384;
        documentsTestSet["cufeError"] = withCUFE.cufeError;
        documentsTestSet["cufeSha384"] = billCufe;
        documentsTestSet["cufeValues"] = withCUFE.cufeValues;
        // documentsTestSet["uri"] = withCUFE.uri;
        // documentsTestSet["uriShare"] = withCUFE.uriShare;
        // documentsTestSet["uriOk"] = withCUFE.uriOk;

        const tmpCUDE = {
          response: code.ok,
          data: documentsTestSet,
        };

        const withCUDE = await getCude(tmpCUDE);
        if (withCUDE.response === code.ok) {
          documentsTestSet["cudeError"] = withCUDE.cudeError;
          documentsTestSet["cudeSha384"] = withCUDE.sha384;
          documentsTestSet["hash"] = withCUDE.hash;
          documentsTestSet["cudeValues"] = withCUDE.cudeValues;
        }
      } else {
        return {
          response: code.badRequest,
          cufe: withCUFE.cufeValues,
        };
      }


      batchPrevious.set(documentRef, documentsTestSet, {
        merge: false,
      });

      batchLater.set(pathRef, xmlParse, {
        merge: false,
      });


      // return {enEspera: true};

      // Rutina 2 ND
      if (i === actual) {
      // temporal
        /* mergeInFirestore(
          "/testSetTemplate/invoice",
          documentsTestSet, false);
        mergeInFirestore(
          "/testSetTemplate/invoiceUnsignedDocument",
          xmlParse, false); */


        messageXML[`ND ${i}`] = emoji.memo;


        const pathDNref = dbFS.doc(`/ b_xml_parse/${entityX}_DN_ND-${i}`);
        const documentDNref = dbFS.doc(`/entities/${entityX}/documents/DN_ND-${i}`);

        const unsignedDNactivation = {
          " task": {
            function: runFunction,
            xmlPath: `/entities/${entityX}/xml/DN_ND-${i}`,
            templatePath: "/xmlTemplates/92_Standard_Activation",
            tenant: mTenantRaw,
          },

          "biller": `/entities/${entityX}`,
          "branchOffice": `/entities/${entityX}/branchOffices/principal`,
          "buyer": "/entities/CO-222222222222",
          "buyerPhysicalLocation": "/entities/CO-222222222222/branchOffices/principal",
          "buyerRegistrationAddress": "/entities/CO-222222222222/branchOffices/principal",
          "document": `/entities/${entityX}/documents/DN_ND-${i}`,
          "principal": `/entities/${entityX}/branchOffices/principal`,
          "resolution": `/entities/${entityX}/consecutivesControl/92_principal-0`,
          "seller": `/entities/${entityX}`,
          "uid": `${entityX}`,
        };


        const debitNote = {
          " b_xml_parse": {
            " task": {
              function: runFunction,
              xmlPath: `/entities/${entityX}/xml/DN_ND-${i}`,
              templatePath: "/xmlTemplates/92_Standard_Activation",
              tenant: mTenantRaw,
            },

            "biller": `/entities/${entityX}`,
            "branchOffice": `/entities/${entityX}/branchOffices/principal`,
            "buyer": "/entities/CO-222222222222",
            "buyerPhysicalLocation": "/entities/CO-222222222222/branchOffices/principal",
            "buyerRegistrationAddress": "/entities/CO-222222222222/branchOffices/principal",
            "document": `/entities/${entityX}/documents/DN_ND-${i}`,
            "principal": `/entities/${entityX}/branchOffices/principal`,
            "resolution": `/entities/${entityX}/consecutivesControl/92_principal-0`,
            "seller": `/entities/${entityX}`,
            "uid": `${entityX}`,
          },
          "Signed": timeStampFirestoreX,
          "billCufe": billCufe,
          "billEmissionDate": autoDate,
          "billPrefix": `SETT${i}`,
          "billReference": "IV",
          "billing": {
            "biller": entityX,
            "buyer": "CO-222222222222",
            "costCenter": "1",
            "seller": entityX,
          },
          "branchOffices": ["principal"],
          "cac_PaymentMeans_cbc_ID": "1",
          "cac_PaymentMeans_cbc_Text": "Contado",
          "cbc_DocumentCurrencyCode": "COP",
          "cbc_DueDate": autoDate,
          "cbc_ID": `ND${i}`,
          "cbc_IndustryClassificationCodeList": " Actividad principal: 0000",
          "cbc_IssueDate": autoDate,
          "cbc_IssueTime": autoTime,
          "cbc_Note": `FACTURA ELECTRÓNICA DE VENTA ${i}`,
          "created": timeStampFirestoreX,
          "cufeCodification": "CUFE-SHA384",
          "document": {
            "documentType": "92",
            "documentTypeName": "Nota Débito",
            "operationType": "30",
            "operationTypeName": "Nota Débito que referencia una factura electrónica.",
            "resolution": {
              "TestSetId": "e6591e43-5b91-4936-9a67-307ae7a2808c",
              "active": true,
              "branchOffice": "principal",
              "commertialName": "Jovanny Medina Cifuentes",
              "currentNumber": `${i}`,
              "endNumber": "10000",
              "expedition": "",
              "expire": "",
              "id": "92_principal-0",
              "prefix": "ND",
              "resolution": "N/A",
              "startNumber": "1",
              "technicalKey": "fc8eac422eba16e22ffd8c6f94b3f40a6e38162c",
              "template": "Débito",
              "typeDocumentNumeration": "92",
            },
          },
          "documentId": `DN_ND-${i}`,
          "exceptionCharges": "EMPTY",
          "exceptionChargesAndDiscounts": "EMPTY",
          "exceptionDiscounts": "EMPTY",
          "exceptionTaxes": "EMPTY",
          "exceptionTaxesTotal": "NOTAXES",
          "exceptionWithholdings": "EMPTY",
          "globalDiscounts": [],
          "linkedInvoice": {
            "Linked": timeStampFirestoreX,
            "Signed": timeStampFirestoreX,
            "documentId": `EB_SETT-${i}`,
            "documentType": "01",
            "documentTypeName": "Factura Electrónica de Venta",
            "prefixAndNumeration": `SETT-${i}`,
          },
          "measurementTypes": "94 - unidad",
          "paymentMethod": [
            {
              "cac_PaymentMeans_cbc_ID": "1",
              "cac_PaymentMeans_cbc_Text": "Contado",
              "cbc_PaymentDueDate": autoDate,
              "cbc_PaymentMeansCode": "10",
              "paymentAmount": 1000,
              "paymentFormats": "Efectivo",
            },
          ],
          "prefix": "ND",
          "prefixAndNumeration": `ND-${i}`,
          "products": [
            {
              "aditionalInfo": "",
              "cbc_ID_schemeID": "0",
              "changeType": "COP",
              "descripcion": `Test ${i}`,
              "discountAmount": 0,
              "itemNumber": "1",
              "measurementTypeText": "94 - unidad",
              "measurementType": "94",
              "productBill": {
                "IVA": "Excluido",
                "branchOffices": ["principal"],
                "cbc_BrandName": "marca",
                "cbc_ModelName": "modelo",
                "changeType": "COP",
                "discountsAndCharges": [],
                "exceptionChargesAndDiscounts": "EMPTY",
                "exceptionTaxes": "NOTAXES",
                "exceptionTaxes_3": "EMPTY",
                "exceptionWithholdings": "EMPTY",
                "groupedListTaxes": [],
                "groupedListWithholdings": [],
                "measurementType": "94",
                "measurementTypeText": "94 - unidad",
                "productCode": `TEST${i}`,
                "productEdit": true,
                "productName": `Test ${i}`,
                "productPrice": 1000,
                "productPriceIVA": 1000,
                "productType": "999",
                "show": true,
                "standardCode": `TEST${i}`,
                "taxes": [],
                "withholding": [],
              },

              "productCode": `TEST${i}`,
              "productPrice": 1000,
              "productType": "999",
              "productsubTotalUnitaryPrice": 1000,
              "quantityOfProduct": 1,
              "rechargesAmount": 0,
              "standardCode": `TEST${i}`,
              "subtotalTaxableBase": 0,
              "totalDiscountsProduct": 0,
              "totalProductPrice": 0,
              "totalRechargesProduct": 0,
              "totalTaxesPerItems": 0,
            },
          ],
          "quantityItems": "1",
          "state": "Firmado",
          "totals": {
            "Total": 1000,
            "cbc_LineExtensionAmount": 1000, // subTotal
            "cbc_PayableAmount": 1000,
            "cbc_RoundingAmount": 0,
            "cbc_TaxInclusiveAmount": 1000, // subTotal2
            "cbc_TaxableAmount_currencyID": "COP",
            "chargers": 0,
            "discounts": 0,
            "globalChargers": 0,
            "globalDiscounts": 0,
            "groupedListTaxes": [],
            "groupedListWithholdings": [],
            "totalBolsas": 0,
            "totalICA": 0,
            "totalINC": 0,
            "totalIVA": 0,
            "totalTaxableBase": 0,
            // "totalIVA": 0,
            "totalWithholdings": 0,
          },
          "cbc_CustomizationID": "30",
          "conceptNote": "POR CONCEPTO DE GASTOS POR COBRAR",
          "typeNote": "2",


        };


        /* mergeInFirestore(
          "/testSetTemplate/debitNote",
          debitNote, false); */

        const tmpCUDEdebitNote = {
          response: code.ok,
          data: debitNote,
        };

        const debitNoteCUDE = await getCude(tmpCUDEdebitNote);
        if (debitNoteCUDE.response === code.ok) {
          debitNote["cudeError"] = debitNoteCUDE.cudeError;
          debitNote["cudeSha384"] = debitNoteCUDE.sha384;
          debitNote["hash"] = debitNoteCUDE.hash;
          debitNote["cudeValues"] = debitNoteCUDE.cudeValues;
        } else {
          return {
            response: code.badRequest,
            CUDE: debitNoteCUDE,
          };
        }

        // Esc

        batchNdNc.set(documentDNref, debitNote, {
          merge: false,
        });

        batchNdNc.set(pathDNref, unsignedDNactivation, {
          merge: false,
        });
      }
      // Rutina 1 NC
      if (i === (actual + 3)) {
        messageXML[`NC ${i}`] = emoji.memo;


        const pathCNref = dbFS.doc(`/ b_xml_parse/${entityX}_CN_NC-${i}`);
        const documentCNref = dbFS.doc(`/entities/${entityX}/documents/CN_NC-${i}`);

        const unsignedCNactivation = {
          " task": {
            function: runFunction,
            xmlPath: `/entities/${entityX}/xml/CN_NC-${i}`,
            templatePath: "/xmlTemplates/91_Standard_Activation",
            tenant: mTenantRaw,
          },

          "biller": `/entities/${entityX}`,
          "branchOffice": `/entities/${entityX}/branchOffices/principal`,
          "buyer": "entities/CO-222222222222",
          "buyerPhysicalLocation": "entities/CO-222222222222/branchOffices/principal",
          "buyerRegistrationAddress": "entities/CO-222222222222/branchOffices/principal",
          "document": `/entities/${entityX}/documents/CN_NC-${i}`,
          "principal": `/entities/${entityX}/branchOffices/principal`,
          "resolution": `/entities/${entityX}/consecutivesControl/91_principal-0`,
          "seller": `/entities/${entityX}`,
          "uid": `${entityX}`,

        };

        const creditNote = {
          " b_xml_parse": {
            " task": {
              function: runFunction,
              xmlPath: `/entities/${entityX}/xml/CN_NC-${i}`,
              templatePath: "/xmlTemplates/91_Standard_Activation",
              tenant: mTenantRaw,
            },

            "biller": `/entities/${entityX}`,
            "branchOffice": `/entities/${entityX}/branchOffices/principal`,
            "buyer": "entities/CO-222222222222",
            "buyerPhysicalLocation": "entities/CO-222222222222/branchOffices/principal",
            "buyerRegistrationAddress": "entities/CO-222222222222/branchOffices/principal",
            "document": `/entities/${entityX}/documents/CN_NC-${i}`,
            "principal": `/entities/${entityX}/branchOffices/principal`,
            "resolution": `/entities/${entityX}/consecutivesControl/91_principal-0`,
            "seller": `/entities/${entityX}`,
            "uid": `${entityX}`,
          },
          "Signed": timeStampFirestoreX,
          "billCufe": billCufe,
          "billEmissionDate": autoDate,
          "billPrefix": `SETT${i}`,
          "billReference": "IV",
          "billing": {
            "biller": entityX,
            "buyer": "CO-222222222222",
            "costCenter": "1",
            "seller": entityX,
          },
          "branchOffices": ["principal"],
          "cac_PaymentMeans_cbc_ID": "1",
          "cac_PaymentMeans_cbc_Text": "Contado",
          "cbc_DocumentCurrencyCode": "COP",
          "cbc_DueDate": autoDate,
          "cbc_ID": `NC${i}`,
          "cbc_IndustryClassificationCodeList": " Actividad principal: 0000",
          "cbc_IssueDate": autoDate,
          "cbc_IssueTime": autoTime,
          "cbc_Note": `FACTURA ELECTRÓNICA DE VENTA ${i}`,
          "conceptNote": "POR CONCEPTO DE AJUSTE DE PRECIO",
          "created": timeStampFirestoreX,

          "document": {
            "documentType": "91",
            "documentTypeName": "Nota Crédito",
            "operationType": "20",
            "operationTypeName": "Nota Crédito que referencia una factura electrónica *",
            "resolution": {
              "TestSetId": "e6591e43-5b91-4936-9a67-307ae7a2808c",
              "active": true,
              "branchOffice": "principal",
              "commertialName": "Jovanny Medina Cifuentes",
              "currentNumber": `${i}`,
              "endNumber": "10000",
              "expedition": "",
              "expire": "",
              "id": "91_principal-0",
              "prefix": "NC",
              "resolution": "N/A",
              "startNumber": "1",
              "technicalKey": "fc8eac422eba16e22ffd8c6f94b3f40a6e38162c",
              "template": "Crédito",
              "typeDocumentNumeration": "91",
            },
          },

          "documentId": `CN_NC-${i}`,
          "exceptionCharges": "EMPTY",
          "exceptionChargesAndDiscounts": "EMPTY",
          "exceptionDiscounts": "EMPTY",
          "exceptionTaxes": "EMPTY",
          "exceptionTaxesTotal": "NOTAXES",
          "exceptionWithholdings": "EMPTY",
          "globalDiscounts": [],
          "linkedInvoice": {
            "Linked": timeStampFirestoreX,
            "Signed": timeStampFirestoreX,
            "documentId": `EB_SETT-${i}`,
            "documentType": "01",
            "documentTypeName": "Factura Electrónica de Venta",
            "es": `FE SETT-${i}`,
            "prefixAndNumeration": `SETT-${i}`,
          },
          "measurementTypes": "94 - unidad",
          "paymentMethod": [
            {
              "cac_PaymentMeans_cbc_ID": "1",
              "cac_PaymentMeans_cbc_Text": "Contado",
              "cbc_PaymentDueDate": autoDate,
              "cbc_PaymentMeansCode": "10",
              "paymentAmount": 1000,
              "paymentFormats": "Efectivo",
            },
          ],
          "prefix": "NC",
          "prefixAndNumeration": `NC-${i}`,

          "products": [
            {
              "aditionalInfo": "",
              "cbc_ID_schemeID": "0",
              "changeType": "COP",
              "descripcion": `Test ${i}`,
              "discountAmount": 0,
              "itemNumber": "1",
              "measurementType": "94",
              "measurementTypeText": "94 - unidad",

              "productBill": {
                "IVA": "Excluido",
                "branchOffices": ["principal"],
                "cbc_BrandName": "marca",
                "cbc_ModelName": "modelo",
                "changeType": "COP",
                "discountsAndCharges": [],
                "exceptionChargesAndDiscounts": "EMPTY",
                "exceptionTaxes": "NOTAXES",
                "exceptionTaxes_3": "EMPTY",
                "exceptionWithholdings": "EMPTY",
                "groupedListTaxes": [],
                "groupedListWithholdings": [],
                "measurementType": "94",
                "measurementTypeText": "94 - unidad",
                "productCode": `TEST${i}`,
                "productEdit": true,
                "productName": `Test ${i}`,
                "productPrice": 1000,
                "productPriceIVA": 1000,
                "productType": "999",
                "show": true,
                "standardCode": `TEST${i}`,
                "taxes": [],
                "withholding": [],
              },
              "productCode": `TEST${i}`,
              "productPrice": 1000,
              "productType": "999",
              "productsubTotalUnitaryPrice": 1000,
              "quantityOfProduct": 1,
              "rechargesAmount": 0,
              "standardCode": `TEST${i}`,
              "subtotalTaxableBase": 0,
              "totalDiscountsProduct": 0,
              "totalProductPrice": 0,
              "totalRechargesProduct": 0,
              "totalTaxesPerItems": 0,
            },
          ],
          "quantityItems": "1",
          "totals": {
            "Total": 1000,
            "cbc_LineExtensionAmount": 1000, // subTotal
            "cbc_PayableAmount": 1000,
            "cbc_RoundingAmount": 0,
            "cbc_TaxInclusiveAmount": 1000, // subTotal2
            "cbc_TaxableAmount_currencyID": "COP",
            "chargers": 0,
            "discounts": 0,
            "globalChargers": 0,
            "globalDiscounts": 0,
            "groupedListTaxes": [],
            "groupedListWithholdings": [],
            "totalBolsas": 0,
            "totalICA": 0,
            "totalINC": 0,
            "totalIVA": 0,
            "totalTaxableBase": 0,
            // "totalIVA": 0,
            "totalWithholdings": 0,
          },
          "state": "Firmado",
          "cbc_CustomizationID": "20",
          "typeNote": "4",

        };

        /* mergeInFirestore(
          "/testSetTemplate/creditNote",
          creditNote, false); */

        const tmpCUDEcreditNote = {
          response: code.ok,
          data: creditNote,
        };

        const creditNoteCUDE = await getCude(tmpCUDEcreditNote);
        if (creditNoteCUDE.response === code.ok) {
          creditNote["cudeError"] = creditNoteCUDE.cudeError;
          creditNote["cudeSha384"] = creditNoteCUDE.sha384;
          creditNote["hash"] = creditNoteCUDE.hash;
          creditNote["cudeValues"] = creditNoteCUDE.cudeValues;
        } else {
          return {
            response: code.badRequest,
            CUDE: creditNoteCUDE,
          };
        }


        batchNdNc.set(documentCNref, creditNote, {
          merge: false,
        });

        batchNdNc.set(pathCNref, unsignedCNactivation, {
          merge: false,
        });
      }
    }


    batchPrevious.set(messageXMLref, {
      messageXML: messageXML,
    }, {
      merge: true,
    });


    await batchPrevious.commit();
    await batchLater.commit();
    await sleep(20000);
    await batchNdNc.commit();

    return {
      response: code.accepted,
      tenant: mTenantRaw,
    };
  } catch (error) {
    return {
      response: code.badRequest,
      tenant: mTenantRaw,
    };
  }
};

module.exports = {
  autoTestSet,
};
