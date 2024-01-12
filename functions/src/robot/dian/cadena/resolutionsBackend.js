// import fetch from "node-fetch";
const fetch = require("node-fetch"); // HARDCODE está en workspace y debe ser un módulo

const getResolutionBackend = async (
  entityX, dataX,
  mTenantRaw = "tufactura.com",
) => {
  const {dbFS} = require("../../../admin");
  const {tenant} = require("../../../admin/hardCodeTenants");
  // const {sendSnackBar} = require("../../../admin/utils");
  const {code} = require("../../../admin/responses");
  const tenantX = tenant(mTenantRaw);
  const entityNumber = entityX.split("-");
  const accountCode = entityNumber[1];
  const uri = `${tenantX.alianza.efacturaGetResolutions}${accountCode}`;

  let responseX = {statusCode: 400};
  let technicalKey = "";

  try {
    responseX = await fetch(uri, {
      method: "GET",
    })
      .then((response) => response.json())
      .catch(async (error) => {
        // throw new Error(`resolutionsBackend: ${entityX}  error: ${JSON.stringify(error)}`);
        return await Promise.reject(new Error(`resolutionsBackend: ${entityX}  error: ${JSON.stringify(error)}`));
      });
  } catch (error) {
    return await Promise.reject(new Error(`resolutionsBackend: ${entityX}  error: ${JSON.stringify(error)}`));
  }

  const resolutionsRef = dbFS.doc(`/ a_invoiceAuthorizations/${entityX}`);

  if (responseX.statusCode === code.ok) {
    // consulto las resoluciones en base de datos.
    const oldResolutions = await dbFS
      .collection("entities").doc(entityX)
      .collection("consecutivesControl")
      .where("sts_InvoiceAuthorization", "!=", true).get();

    // solo se almacenan los id en true
    const oldResolutionsX = {};
    oldResolutions.forEach((resolution) => {
      oldResolutionsX[resolution.id] = true;
    });

    const batchProduction = dbFS.batch();
    // const testSetRef = dbFS.doc(`/entities/${entityX}/consecutivesControl/${tenantX.alianza.testSet.resolutionNumber}`);

    batchProduction.delete(resolutionsRef);


    (responseX.numberingRangelist).map((valueX) => {
      valueX.technicalKey !== undefined ?
        technicalKey = valueX.technicalKey :
        // eslint-disable-next-line max-len
        technicalKey = `ERROR de la DIAN: Tú resolución ${valueX.resolutionNumber} NO TIENE clave técnica - En la página de la DIAN, Debes crear UN NUEVO PREFIJO [en Usuario Registrado] (esperar 30 minutos a veces más) y asociarlo en Participantes/Asociar prefijos [en Facturando Electrónicamente].  - Clic en cerrar para continuar.`;

      let valuesResolution = {};


      if (oldResolutionsX[valueX.resolutionNumber] === true) {
        // La resolución existe
        valuesResolution = {
          active: true,
          prefix: valueX.prefix,
          technicalKey: technicalKey,
          id: valueX.resolutionNumber,
          endNumber: `${valueX.toNumber}`,
          expire: valueX.validDateTimeTo,
          startNumber: `${valueX.fromNumber}`,
          expedition: valueX.validDateTimeFrom,
          sts_InvoiceAuthorization: valueX.resolutionNumber,
          resolutionText: `Número de autorización ${valueX.resolutionNumber} - Rango desde ${valueX.prefix} ${valueX.fromNumber} hasta ${valueX.prefix} ${valueX.toNumber} - Vigencia ${valueX.validDateTimeTo}`,
        };
      } else {
        // La resolución NO existe, se establecen los valores predeterminados.
        valuesResolution = {
          active: true,
          resolutionText: `Número de autorización ${valueX.resolutionNumber} - Rango desde ${valueX.prefix} ${valueX.fromNumber} hasta ${valueX.prefix} ${valueX.toNumber} - Vigencia ${valueX.validDateTimeTo}`,
          prefix: valueX.prefix,
          technicalKey: technicalKey,
          id: valueX.resolutionNumber,
          template: "Principal", // PDF
          branchOffice: "principal",
          typeDocumentNumeration: "01",
          endNumber: `${valueX.toNumber}`,
          expire: valueX.validDateTimeTo,
          startNumber: `${valueX.fromNumber}`,
          expedition: valueX.validDateTimeFrom,
          sts_InvoiceAuthorization: valueX.resolutionNumber,
        };
      }


      batchProduction.set(
        dbFS.doc(
          `/entities/${entityX}/consecutivesControl/${valueX.resolutionNumber}`),
        valuesResolution, {merge: true});
    });

    batchProduction.update(dbFS.doc(`/entities/${entityX}`), {
      cbc_ProfileExecutionID: "1",
      messageXML: {},
    });


    // batchProduction.delete(testSetRef);


    batchProduction.set(dbFS.doc(`/entities/${entityX}/logs/ a_invoiceAuthorizations`), {
      call: dataX,
      response: responseX,
      [" state"]: "Production",
    });

    batchProduction.commit();
    return await Promise.resolve();
  } else {
    // Modo set de pruebas
    const batchTestSet = dbFS.batch();
    const testSetRef = dbFS.doc(`/entities/${entityX}/consecutivesControl/${tenantX.alianza.testSet.resolutionNumber}`);
    batchTestSet.set(testSetRef,
      {
        active: false,
        // currentNumber: 1,
        template: "Principal", // PDF
        branchOffice: "principal",
        // TestSetId: " ¶¶_TestSetId",
        typeDocumentNumeration: "01",
        prefix: tenantX.alianza.testSet.prefix,
        endNumber: `${tenantX.alianza.testSet.toNumber}`,
        expire: tenantX.alianza.testSet.validDateTimeTo,
        startNumber: `${tenantX.alianza.testSet.fromNumber}`,
        expedition: tenantX.alianza.testSet.validDateTimeFrom,
        technicalKey: tenantX.alianza.testSet.technicalKey,
        resolutionNumber: tenantX.alianza.testSet.resolutionNumber,
        resolutionText: tenantX.alianza.testSet.resolutionText,
        sts_InvoiceAuthorization: tenantX.alianza.testSet.resolutionNumber,
        id: tenantX.alianza.testSet.resolutionNumber,
      }, {merge: true});


    batchTestSet.set(dbFS.doc(`/entities/${entityX}/logs/ a_invoiceAuthorizations`), {
      call: dataX,
      response: responseX,
      [" state"]: "Test Set",

    });

    batchTestSet.delete(resolutionsRef);
    batchTestSet.commit();


    return await Promise.reject(new Error(`resolutionsBackend: ${entityX}  technicalKey: ${technicalKey}`));
  }
};


module.exports = {
  getResolutionBackend,
};
