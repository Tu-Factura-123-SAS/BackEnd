const tenant = (tenantX) => {
  const {code} = require("./responses");


  switch (tenantX) {
  case "localhost:5000":
  case "127.0.0.1:5000":
  case "tufactura123.jovanny.co":
  case "tufactura123.developer.jovanny.co":
  case "tufactura123.col.marketing":
  case "tufactura.com":
    return {
      init: {
        domain: tenantX,
        logo: "https://cdn-tf.tufactura.com/asistente/TF.png",
        landingPage: false,
        profile: "https://cdn-tf.tufactura.com/profile.png",
        callToAction: {
          title: "¡Hola! ¿En qué te puedo ayudar?",
          text: "Soy tu asistente virtual, estoy aquí para ayudarte a crear tu empresa y a facturar electrónicamente.",
        },
      },
      templates: {
        aTextPdf: [
          {
            fieldName: "billerId",
            template: "{{biller.businessName}}, NIT {{biller.idNumber}}",
          },
          {
            fieldName: "billerLocation",
            template: "{{principal.direction}}, {{principal.cbc_CityName}}, {{principal.cbc_CountrySubentity}}, {{principal.postalZone}}",
          },
          {
            fieldName: "billerContactInfo",
            template: "Teléfono: {{branchOffice.telOffice}}, E-Mail: {{branchOffice.email}}",
          },
          {
            fieldName: "buyerLocation",
            template: "{{buyerPhysicalLocation.direction}}, {{buyerPhysicalLocation.cbc_CityName}}, {{buyerPhysicalLocation.cbc_CountrySubentity}}, {{buyerPhysicalLocation.postalZone}}",
          },
          {
            fieldName: "FAD15",
            template: "Moneda: {{document.cbc_DocumentCurrencyCode}}",
          },
          {
            fieldName: "documentType",
            template: "Tipo de factura: {{document.document.documentTypeName}}",
          },
          {
            fieldName: "FAD09",
            template: "Fecha de expedición: {{document.cbc_IssueDate}}",
          },
          {
            fieldName: "FAD11",
            template: "Fecha de vencimiento: {{document.cbc_DueDate}}",
          },
          {
            fieldName: "operationType",
            template: "Tipo de operación: {{document.document.operationTypeName}}",
          },
          {
            fieldName: "paymentDetails",
            template: "Forma de pago: {{document.cac_PaymentMeans_cbc_Text}}",
          },
          {
            fieldName: "FAD16",
            template: "Total de lineas: {{document.quantityItems}}",
          },
          {
            fieldName: "deliveryLocation",
            template: "{{document.delivery.address}}, {{document.delivery.cbc_CityName}}, {{document.delivery.cbc_CountrySubentity}}, {{document.delivery.postalCode}}",
          },

          {
            fieldName: "buyerPhone",
            template: "{{buyer.phonePersonal.phone}}",
          },
          {
            fieldName: "buyerDocumentTypeText",
            template: "{{buyer.idTypeText}}",
          },
          {
            fieldName: "FAK62",
            template: "{{buyer.idNumber}}",
          },
          {
            fieldName: "FAK55",
            template: "{{buyer.emailDian}}",
          },
          {
            fieldName: "FAK20",
            template: "{{buyer.businessName}}",
          },
          {
            fieldName: "FBA05",
            template: "{{mandatary.idNumber}}",
          },
          {
            fieldName: "FAM31",
            template: "{{document.delivery.haulier.businessName}}",
          },
          {
            fieldName: "branchOfficeCommertialName",
            template: "{{branchOffice.commertialName}}",
          },
          {
            fieldName: "branchOfficeCustomMessage",
            template: "{{branchOffice.customMessage}}",
          },
        ],
      },
      response: code.ok,
      nit: 901318433,
      digitCheck: 0,
      rut: "901.318.433-0",
      razonSocial: "TU FACTURA 123 SAS",
      cdn: "https://cdn-tf.tufactura.com", // Sin slash al final
      alianza: {
        razonSocial: "CADENA SA",
        nit: 890930534,

        pin: 75315, // Para ND y NC

        efacturaGetResolutions: "https://apivp.efacturacadena.com/v1/vp/consulta/rango-numeracion?softwareCode=49fab599-4556-4828-a30b-852a910c5bb1&accountCodeVendor=890930534&accountCode=",


        // cbc_ProfileExecutionID = "1"   PRODUCCIÓN
        efacturaAuthorizationURL: "https://apivp.efacturacadena.com/v1/vp/documentos/proceso/alianzas",
        efacturaAuthorizationToken: "0f97e47e-75e7-41e9-8623-2be4bffc8e27",


        // cbc_ProfileExecutionID = "2"  ACTIVACIÓN
        activationSandBoxURL: "https://apivp.efacturacadena.com/staging/vp/documentos/proceso/alianzas", // SANDBOX
        activationURL: "https://apivp.efacturacadena.com/staging/vp-hab/documentos/proceso/alianzas",
        efacturaActivationToken: "f037c5bd-d838-44e2-b1c0-7f872fa01226",


        testSet: {
          resolutionNumber: "18760000001",
          resolutionText: "Set de pruebas DIAN - Rango desde SETT 1 hasta SETT 5000000 - FACTURA ELECTRÓNICA DE PRUEBA",
          prefix: "SETT",
          fromNumber: 1,
          toNumber: 5000000,
          currentNumber: 1,
          validDateTimeFrom: "2019-01-19",
          validDateTimeTo: "2030-01-19",
          technicalKey: "fc8eac422eba16e22ffd8c6f94b3f40a6e38162c",
        },
      },
      pdfControler: "jsPDF",
      drive: {
        entitiesFolderId: "1hDjupFR5Znyq8CoM34kSO17T3VvGq4ct",
        subFolders: ["DIAN", "documents", "contracts", "orders", "sheetsExport", "sheetsImport", "sheetsBatch"],
        type: {
          RUT: "DIAN",
          PED: "orders",
          EB: "documents",
          DN: "documents",
          CN: "documents",
          CNTR: "contracts",
          EXP: "sheetsExport",
          IMP: "sheetsImport",
          BATCH: "sheetsBatch",
        },
        typeName: {
          RUT: "Registro Único Tributario",
          PED: "Pedido",
          EB: "Factura Electrónica de Venta",
          DN: "Nota Débito Electrónica",
          CN: "Nota Crédito Electrónica",
          CNTR: "Contrato",
          EXP: "Exportar en hoja de cálculo",
          IMP: "Importar de hoja de cálculo",
          BATCH: "Procesar lote de hoja de cálculo",
        },
      },
    };


  default:
  {
    return {
      response: code.notImplemented,
    };
  }
  }
};

module.exports = {tenant};
