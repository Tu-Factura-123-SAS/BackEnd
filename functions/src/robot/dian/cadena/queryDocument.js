const getDocumentCadena = async (
  entityX, dataX,
  mTenantRaw = "tufactura.com",
) => {
/*
const {
  tenant,
} = require("../../../admin/hardCodeTenants");
*/
  const fetch = require("node-fetch");

  const {
    sendSnackBar,
  } = require("../../../admin/utils");


  let responseX = {
    statusCode: 400,
  };
  // const tenantX = tenant(mTenantRaw);

  const codigoTipoDocumento = "01";
  const nitEmisor = entityX.split("-");
  const prefijo = "FE";
  const idDocumento = "12";

  // "Partnership-Id": tenantX.nit,
  const headers = {
    "Partnership-Id": "890930534",
  };

  const uri = `https://apivp.efacturacadena.com/v1/vp/consulta/documentos?nit_emisor=${nitEmisor[1]}&id_documento=${idDocumento}&codigo_tipo_documento=${codigoTipoDocumento}&prefijo=${prefijo}`;
  // console.info(uri);
  try {
    responseX = await fetch(uri, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .catch((error) => {
        return sendSnackBar(error.message,
          "error", entityX, error, dataX);
      });
  } catch (error) {
    return sendSnackBar(error.message,
      "error", entityX, error, dataX);
  }


  // console.info(responseX);

  return {
    response: responseX,
  };

/*
  if (responseX.statusCode === code.ok) {
    // return responseX.numberingRangelist;
    responseX.numberingRangelist.forEach(async (valueX) => {
      await mergeInFirestore(
        `/entities/${entityX}` +
        `/consecutivesControl/${valueX.resolutionNumber}`,
        {
          active: true,
          template: "Principal",
          prefix: valueX.prefix,
          branchOffice: "principal",
          endNumber: valueX.toNumber,
          typeDocumentNumeration: "01",
          startNumber: valueX.fromNumber,
          expire: valueX.validDateTimeTo,
          technicalKey: valueX.technicalKey,
          currentNumber: valueX.fromNumber, // OJO: Sobre-escribe el número actual.
          expedition: valueX.validDateTimeFrom,
          branchOfficeCommertialName: displayNameX,
          resolutionNumber: valueX.resolutionNumber,
        });


      await mergeInFirestore(`/entities/${entityX}`,
        {
          billingResolutions: {
            [valueX.resolutionNumber]: {
              prefix: valueX.prefix,
              toNumber: valueX.toNumber,
              fromNumber: valueX.fromNumber,
              technicalKey: valueX.technicalKey,
              validDateTimeTo: valueX.validDateTimeTo,
              validDateTimeFrom: valueX.validDateTimeFrom,
            },
          },
        });
    });

    return {
      response: code.created,
    };
  } else {
    await mergeInFirestore(
      `/entities/${entityX}` +
      `/consecutivesControl/${tenantX.alianza.testSet.resolutionNumber}`,
      {
        active: true,
        currentNumber: 1,
        template: "Principal",
        branchOffice: "principal",
        testSetId: " ¶¶_testSetId",
        typeDocumentNumeration: "01",
        prefix: tenantX.alianza.testSet.prefix,
        branchOfficeCommertialName: displayNameX,
        endNumber: tenantX.alianza.testSet.toNumber,
        startNumber: tenantX.alianza.testSet.fromNumber,
        expire: tenantX.alianza.testSet.validDateTimeTo,
        expedition: tenantX.alianza.testSet.validDateTimeFrom,
        resolutionNumber: tenantX.alianza.testSet.resolutionNumber,
      });
    sendSnackBar("Respuesta Cadena",
      "error", entityX, responseX, dataX);
    console.info(responseX); // Temporal
    return {
      response: code.notFound,
    };
  } */
};


module.exports = {
  getDocumentCadena,
};
