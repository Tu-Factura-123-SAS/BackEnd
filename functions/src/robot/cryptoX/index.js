
// https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/CryptoX
const cryptoX = (
  hash, // sha256 sha384
  text,
) => {
  const crypto = require("crypto");
  const {code} = require("../../admin/responses");

  const {StringDecoder} = require("string_decoder");
  const decoder = new StringDecoder("utf8");

  switch (hash) {
  case "base64":
    return {
      response: code.ok,
      // hash: Buffer.from(text).toString("base64"),
      hash: Buffer.from(text).toString("base64"),
    };


  case "deco-base64-utf8":
    return {
      response: code.ok,
      deco: decoder.write(Buffer.from(text, "base64")),
    };

  case "codeDoc":
    if (isNaN(text.slice(-1))) {
      return {
        response: code.ok,
        hash: (parseInt((text).split("").reverse().join(""), 36))
          .toString(35),
      };
    } else {
      return {
        response: code.badRequest,
        error: "Debe terminar con DN | CN | EB | PED",
      };
    }


  case "codeNum":
    // Se pasa el entero a base36 y se invierte la cadena
    if (Number.isInteger(text)) {
      return {
        response: code.ok,
        hash: (text).toString(36).split("").reverse().join(""),
      };
    } else {
      return {
        response: code.badRequest,
        hash: "NaN",
      };
    }


  case "decoNum":
    // se invierte la cadena y se parsea de base36
    return {
      response: code.ok,
      deco: parseInt((text).split("").reverse().join(""), 36),
    };


  case "sha384":
    return {
      response: code.ok,
      hash: crypto
        .createHash(hash)
        .update(text)
        .digest("hex"),
    };


  default:
    return {
      response: code.badRequest,
      createHash: hash,
    };
  }
};


module.exports = {
  cryptoX,
};
