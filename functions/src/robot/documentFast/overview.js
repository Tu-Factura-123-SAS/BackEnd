// const {code} = require("../../admin/responses");

// const setOverview = async (
//   data,
// //   documentX, // Documento actual
// //   tenantX = "tufactura.com", // Tenant actual
// ) => {
//   // const {getInterpolated} = require("../admin/utils");}

//   try{


//   const {overviewX} = require("../../../robot/logTF/overviewX");

//     await mergeInFirestore("/entities/CO-901318433/documents/response7", {
//       // data: data,
//       first: "/entities/" + data.entity + "/overview/global",
//       second: "/entities/" + data.entity + "/overview/" + "CO-1144081081",
//     }, true);

//     await mergeInFirestore(
//       "/entities/" + data.entity +
//         "/overview/global",
//       overviewX(
//         "CO-1144081081",
//         data.document, data.debit, data.credit,
//         data.call, data.callGroup, data.callDescription,
//       ))
//       .catch(console.error);
//     // eslint-disable-next-line no-case-declarations

//     await mergeInFirestore(
//       "/entities/" + data.entity +
//         "/overview/" + "CO-1144081081",
//       overviewX(
//         "CO-1144081081",
//         data.document, data.debit, data.credit,
//         data.call, data.callGroup, data.callDescription,
//       ))
//       .catch(console.error);
// } catch (error) {
//       reject(new Error(`{
//         response: ${code.badRequest},
//         error: ${error.message}
//       }`));
//     }
//   });
// };

// module.exports = {setOverview};
