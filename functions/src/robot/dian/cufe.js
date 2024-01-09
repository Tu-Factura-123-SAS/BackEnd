const crypto = require("crypto");

const {
  code,
} = require("../../admin/responses");

const {
  getOneDocument,
} = require("../../database/firestore");

const {
  amountDian,
} = require("../../admin/utils");


const getCufe = async (
  documentX,
) => {
  /* const {
    cryptoX,
  } = require("../cryptoX"); */


  if (!documentX.response === code.ok) {
    return {response: code.badRequest};
  }

  // const uri = [];

  let NumFac = " ¶¶_NumFac"; // Número de factura.(prefijo concatenado con el número de la factura) sin espacios.
  let FecFac = " ¶¶_cbc_IssueDate"; // Fecha de factura.
  let HorFac = " ¶¶_cbc_IssueTime"; // Hora de la factura incluyendo GMT.
  let ValFac = " ¶¶_ValFac"; // Valor de la Factura sin Impuestos, con punto decimal, con decimales a dos (2) dígitos, sin separadores de miles, ni símbolo pesos.
  const CodImp1 = "01"; // 01 Este valor es fijo.
  let ValImp1 = " ¶¶_ValImp1"; // Valor impuesto 01 - IVA, con punto decimal, con decimales a dos (2) dígitos, sin separadores de miles, ni símbolo pesos. Si no esta referenciado el impuesto 01 – IVA este valor se representa con 0.00
  const CodImp2 = "04"; // 04 Este valor es fijo.
  let ValImp2 = "0.00"; // Valor impuesto 04 - Impuesto Nacional al Consumo, con punto decimal, con decimales a dos (2) dígitos, sin separadores de miles, ni símbolo pesos. Si no esta referenciado el impuesto 04- INC este valor se representa con 0.00
  const CodImp3 = "03"; // 03 Este valor es fijo.
  let ValImp3 = " ¶¶_ValImp3"; // Valor impuesto 03 - ICA, con punto decimal, con decimales a dos (2) dígitos, sin separadores de miles, ni símbolo pesos. Si no esta referenciado el impuesto 03 - ICA este valor se representa con 0.00
  let ValTot = " ¶¶_ValTot"; // Valor Total, con punto decimal, con decimales a dos (2) dígitos, sin separadores de miles, ni símbolo pesos.
  let NitFE = " ¶¶_NitFE"; // NIT del Facturador Electrónico sin puntos ni guiones, sin digito de verificación.
  let NumAdq = " ¶¶_NumAdq"; // Número de identificación del adquirente sin puntos ni guiones, sin digito de verificación.
  let ClTec = " ¶¶_ClTec";
  let TipoAmbiente = "2"; // Número de identificación del ambiente utilizado por el contribuyente para emitir la factura.


  let nitBiller = " ¶¶_nitBiller/";
  let cufeError = true;

  try {
    const document = documentX.data;

    if (document.cbc_ID != undefined) {
      NumFac = document.cbc_ID.trim();
    } else {
      (NumFac = " ¶¶_NumFac/");
    }

    document.cbc_IssueDate != undefined ?
      FecFac = document.cbc_IssueDate.trim():
      FecFac = " ¶¶_cbc_IssueDate/";

    document.cbc_IssueTime != undefined ?
      HorFac = document.cbc_IssueTime.trim():
      HorFac = " ¶¶_cbc_IssueTime/";

    document.totals.grossTotalAmount!= undefined ?
      (ValFac = amountDian(document.totals.grossTotalAmount, "grossTotalAmount")) :
      (ValFac = " ¶¶_ValFac/");

    document.totals.totalIVA != undefined ?
      (ValImp1 = amountDian(document.totals.totalIVA, "totalIVA")) :
      (ValImp1 = " ¶¶_ValImp1/");

    document.totals.totalINC != undefined ?
      (ValImp2 = amountDian(document.totals.totalINC, "totalINC")) :
      (ValImp2 = "0.00");

    document.totals.totalICA != undefined ?
      (ValImp3 = amountDian(document.totals.totalICA, "totalICA")) :
      (ValImp3 = "0.00");

    document.totals.cbc_PayableAmount != undefined ?
      (ValTot = amountDian(document.totals.cbc_PayableAmount, "cbc_PayableAmount")) :
      (ValTot = " ¶¶_ValTot/");

    if (document.billing.biller != undefined) {
      nitBiller = document.billing.biller;
      const nit = document.billing.biller.split("-");
      nit[1] != undefined ?
        NitFE = nit[1] :
        (NitFE = " ¶¶_NitFE/");
      // uri["facturador"] =[];
      // uri["facturador"] = document.billing.biller;
    } else {
      (NitFE = " ¶¶_NitFE/");
    }

    if (document.billing.buyer != undefined) {
      // ADVERENCIA: El nombre y rol correcto es buyer, no client.
      const nit = document.billing.buyer.split("-");
      nit[1] != undefined ?
        NumAdq = nit[1] :
        (NumAdq = " ¶¶_NumAdq/");
      // uri["adquiriente"] = [];
      // uri["adquirienteCountry"] = [];
      // uri["adquirienteCountry"] = nit[0];
      // uri["adquiriente"] = cryptoX("codeNum", Number(NumAdq));
    } else {
      (NumAdq = " ¶¶_NumAdq/");
    }


    const technicalKey = await getOneDocument(`/entities/${nitBiller}/consecutivesControl/${document.document.resolution.sts_InvoiceAuthorization}`);
    technicalKey.data.technicalKey != undefined ?
      ClTec = technicalKey.data.technicalKey:
      ClTec = " ¶¶_technicalKey/";

    //  https://github.com/JovannyCO/FacturaDIAN-Hosting/issues/180
    const entorno = await getOneDocument(`/entities/${nitBiller}`);
    entorno.data.cbc_ProfileExecutionID != undefined ?
      TipoAmbiente = entorno.data.cbc_ProfileExecutionID:
      TipoAmbiente = " ¶¶_cbc_ProfileExecutionID/";


    const cufe =
    NumFac +
    FecFac +
    HorFac +
    ValFac +
    CodImp1 +
    ValImp1 +
    CodImp2 +
    ValImp2 +
    CodImp3 +
    ValImp3 +
    ValTot +
    NitFE +
    NumAdq +
    ClTec +
    TipoAmbiente;

    const cufeValues = {
      a_NumFac: NumFac,
      b_FecFac: FecFac,
      c_HorFac: HorFac,
      d_ValFac: ValFac,
      e_CodImp1: CodImp1,
      f_ValImp1: ValImp1,
      g_CodImp2: CodImp2,
      h_ValImp2: ValImp2,
      i_CodImp3: CodImp3,
      j_ValImp3: ValImp3,
      k_ValTot: ValTot,
      l_NitFE: NitFE,
      m_NumAdq: NumAdq,
      n_ClTec: ClTec,
      o_TipoAmbiente: TipoAmbiente,
    };

    if (cufe.includes("¶")) {
      cufeError = cufeValues;
    } else {
      cufeError = false;
    }


    if (document.documentId != undefined) {
      /* uri["uri"] = `/entities/${
        uri["facturador"]}/documents/${
        uri["adquiriente"]["hash"]}${uri["adquirienteCountry"]}/${
        document.documentId}.pdf`; */
      // uri["uriDrive"] = `https://cdn-tf.tufactura.com${uri["uri"]}`;
      // uri["uriOk"] = encodeURI(uri["uriDrive"]);
      // console.info(uri);
    } else {
      (NumFac = " ¶¶_NumFac/");
    }


    const sha384 = crypto
      .createHash("sha384")
      .update(cufe)
      .digest("hex");


    return {
      response: code.ok,
      cufeError: cufeError,
      sha384: sha384,
      cufeValues: cufeValues,
      // uri: uri["uri"],
      // uriShare: uri["uriDrive"],
      // uriOk: uri["uriOk"],
      nitBiller: nitBiller,
    };
  } catch (error) {
    return {
      response: code.badRequest,
      cufeError: cufeError,
      documentX: documentX,
    };
  }
};


const {
  mergeInFirestore,
} = require("../../database/firestore");


const setCufe = async (documentPath) => {
  const badRequest = {response: code.badRequest};
  let document = badRequest;
  let cufe = badRequest;
  let cufeMerge = badRequest;

  documentPath != undefined ?
    document = await getOneDocument(documentPath):
    document = badRequest;

  document.response === code.ok ?
    cufe = await getCufe(document):
    cufe = badRequest;

  let cufeX;

  cufe.cufeError ?
    cufeX = cufe.cufeValues :
    cufeX = cufe.sha384;


  cufe.response === code.ok ?
    cufeMerge = await mergeInFirestore(documentPath, {
      cbc_CustomizationID: document.data.document.operationType,
      cufeValues: cufe.cufeValues,
      cufeSha384: cufeX,
      cufeError: cufe.cufeError,
      // uri: cufe.uri,
      // uriShare: cufe.uriShare,
      // uriOk: cufe.uriOk,
    }):
    cufeMerge = false;

  if (!cufe.cufeError) {
    // console.log(`${cufe.nitBiller}_${document.data.documentId}`);

    await mergeInFirestore(
      `/entities/${cufe.nitBiller}`, {
        notifications: {
          entity: {[(document.data.prefixAndNumeration).replace("-", " ")]: "📤"},
        }}, true);
  }


  cufeMerge != false ?
    cufeMerge = {response: code.created}:
    cufeMerge = {
      response: code.badRequest,
      documentPath: documentPath,
    };


  return cufeMerge;
};

module.exports = {
  getCufe,
  setCufe,
};
