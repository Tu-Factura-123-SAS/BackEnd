/* eslint-disable camelcase */
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


const getCude = async (
  documentX,
) => {
  const {
    cryptoX,
  } = require("../cryptoX");


  if (!documentX.response === code.ok) {
    return {
      response: code.badRequest,
    };
  }
  // let pathReference = " ¶¶_pathReference";

  let hash = " ¶¶_hash";

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
  const Software_PIN = "75315"; // Pin del software registrado en el catalogo del participante, el cual no esta expresado en el XML.
  let TipoAmbiente = "2"; // Número de identificación del ambiente utilizado por el contribuyente para emitir la factura.


  let nitBiller = " ¶¶_nitBiller/";
  let cudeError = true;

  try {
    const document = documentX.data;

    if (document.cbc_ID != undefined) {
      NumFac = document.cbc_ID.trim();
      hash = cryptoX("codeDoc", NumFac + "N");
      hash = hash.hash;
      // console.info(hash);
    } else {
      (NumFac = " ¶¶_NumFac/");
    }

    document.cbc_IssueDate != undefined ?
      FecFac = document.cbc_IssueDate.trim() :
      FecFac = " ¶¶_cbc_IssueDate/";

    document.cbc_IssueTime != undefined ?
      HorFac = document.cbc_IssueTime.trim() :
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
      (ValTot = amountDian(document.totals.cbc_PayableAmount, "Total")) :
      (ValTot = " ¶¶_ValTot/");

    if (document.billing.biller != undefined) {
      nitBiller = document.billing.biller;
      const nit = document.billing.biller.split("-");
      nit[1] != undefined ?
        NitFE = nit[1] :
        (NitFE = " ¶¶_NitFE/");
    } else {
      (NitFE = " ¶¶_NitFE/");
    }

    if (document.billing.buyer != undefined) {
      // ADVERENCIA: El nombre y rol correcto es buyer, no client.
      const nit = document.billing.buyer.split("-");
      nit[1] != undefined ?
        NumAdq = nit[1] :
        (NumAdq = " ¶¶_NumAdq/");
    } else {
      (NumAdq = " ¶¶_NumAdq/");
    }

    //  https://github.com/JovannyCO/FacturaDIAN-Hosting/issues/180
    const profileExecution = await getOneDocument(`/entities/${nitBiller}`);
    profileExecution.data.cbc_ProfileExecutionID != undefined ?
      TipoAmbiente = profileExecution.data.cbc_ProfileExecutionID:
      TipoAmbiente = " ¶¶_cbc_ProfileExecutionID/";

    const cude =
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
      Software_PIN +
      TipoAmbiente;

    const cudeValues = {
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
      n_Software_PIN: Software_PIN,
      o_TipoAmbiente: TipoAmbiente,
    };

    if (cude.includes("¶")) {
      cudeError = cudeValues;
    } else {
      cudeError = false;
    }


    const sha384 = crypto
      .createHash("sha384")
      .update(cude)
      .digest("hex");


    return {
      response: code.ok,
      cudeValues: cudeValues,
      cudeError: cudeError,
      sha384: sha384,
      text: cude,
      hash: hash,
    };
  } catch (error) {
    return {
      response: code.badRequest,
      cudeError: cudeError,
      documentX: documentX,
    };
  }
};


const {
  mergeInFirestore,
} = require("../../database/firestore");
const setCude = async (documentPath) => {
  const badRequest = {response: code.badRequest};
  let document = badRequest;
  let cude = badRequest;
  let cudeMerge = badRequest;

  documentPath != undefined ?
    document = await getOneDocument(documentPath) :
    document = badRequest;

  document.response === code.ok ?
    cude = await getCude(document) :
    cude = badRequest;


  cude.response === code.ok ?
    cudeMerge = await mergeInFirestore(documentPath, {
      cbc_CustomizationID: document.data.document.operationType,
      // cudetext: cude.text,
      cudeSha384: cude.sha384,
      cudeError: cude.cudeError,
    }) :
    cudeMerge = false;


  cudeMerge != false ?
    cudeMerge = {response: code.created} :
    cudeMerge = {
      response: code.badRequest,
      documentPath: documentPath,
    };


  return cudeMerge;
};

module.exports = {
  getCude,
  setCude,
};
