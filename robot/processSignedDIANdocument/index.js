// // const {code} = require("../../admin/responses");
// const xpath = require("xpath");
// const {code} = require("../../admin/responses");
// const DOM = require("xmldom").DOMParser;

// const xmlSignedDIAN = async (signedXML) => {
//   let signedDocument = {};
//   return new Promise((resolve, reject) => {
//     const doc = new DOM().parseFromString(signedXML);

//     const nodesSigned = xpath.evaluate(
//       "//*[local-name()='Signature']",
//       doc, null, xpath.XPathResult.ANY_TYPE, null);

//     const nodesSignedArray = [];
//     let node;
//     while ((node = nodesSigned.iterateNext())) {
//       nodesSignedArray.push(node);
//     }


//     // ¿Es un documento correctamente firmado?
//     if (nodesSignedArray.length === 0) {
//       reject( new Error({
//         response: code.badRequest,
//         message: "No se encontró ninguna firma en el XML",
//       }));
//     }
//     if (nodesSignedArray.length > 1) {
//       reject( new Error({
//         response: code.badRequest,
//         message: "Se encontró más de una firma en el XML",
//       }));
//     }
//     if (nodesSignedArray.length === 1) {
//       // obtener el CDATA contenido en Description
//       const nodesDescription = xpath.evaluate(
//         "//*[local-name()='Description']",
//         doc, null, xpath.XPathResult.ANY_TYPE, null);

//       const nodesDescriptionArray = [];
//       let nodeDescription;
//       while ((nodeDescription = nodesDescription.iterateNext())) {
//         nodesDescriptionArray.push(nodeDescription);
//       }

//       // obtenemos los CDATA firmado y AplicationResponse
//       signedDocument = nodesDescriptionArray[0].firstChild.data || false;
//        const applicationResponse = nodesDescriptionArray[1].firstChild.data || false;


//       resolve({
//         response: code.accepted,
//         signedDocument: signedDocument,
//         applicationResponse: applicationResponse,
//       });
//     } else {
//       reject( new Error({
//         response: code.badRequest,
//         message: "XML no válido para este proceso",
//       }) );
//     }
//   });
// };


// module.exports = {
//   xmlSignedDIAN,
// };
