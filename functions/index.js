/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase  !", {structuredData: true});
// });


const functions = require("firebase-functions");
const gb4 = require("./functionConfig");


exports.invoiceAuthorizations = functions.runWith(gb4).firestore
    .document("/ a_invoiceAuthorizations/{entity}")
    // .onCreate(require("./src/triggers/aDianAuthorizationsOnCreate"));
    .onCreate(require("./src/triggers/aDianAuthorizationsOnCreate"));

exports.xmlGenerator = functions.runWith(gb4).firestore
    .document("/ b_xml_parse/{dataPath}")
    .onCreate(require("./src/triggers/bXmlGeneratorOnCreate"));

exports.xmlSign = functions.runWith(gb4).firestore
    .document("/ c_xml_sign/{dataPath}")
    .onCreate(require("./src/triggers/cXmlSignOnCreate"));

exports.xmlReception = functions.runWith(gb4).firestore
    .document("/ f_xml_reception/{entityAndItemId}")
    .onCreate(require("./src/triggers/fXmlReceptionOnCreate"));

/* eslint-disable max-len */
exports.onWriteItems = functions.firestore
    .document("/entities/{alliance}/branchOffices/{allianceBranchOffice}/{appCollection}/{billerUnderscoreBranchOffice}/items/{itemId}")
    .onWrite(require("./src/triggers/items/onWrite"));

exports.onDeleteItems = functions.firestore
    .document("/entities/{alliance}/branchOffices/{allianceBranchOffice}/{appCollection}/{billerUnderscoreBranchOffice}/items/{itemId}")
    .onDelete(require("./src/triggers/items/onDelete"));

exports.onWriteCustomClaims = functions.firestore
    .document("/rolesRun/{uid}")
    .onWrite(require("./src/triggers/rolesRun/onWrite"));


exports.onUpdateCustomersJourneys = functions.firestore
    .document("/entities/{alliance}/branchOffices/{allianceBranchOffice}/{appCollection}/{billerUnderscoreBranchOffice}/customersJourneys/{uid}")
    .onUpdate(require("./src/triggers/customersJourneys/onUpdate"));

/* eslint-disable max-len */
exports.onUpdateColors = functions.firestore
    .document("/entities/{uid}/branchOffices/{branchOffice}")
    .onUpdate(require("./src/triggers/colors/onUpdate"));


// exports.tf = functions.runWith(gb4).https.onCall(require("./robot"));
exports.tf = functions.runWith(gb4).https.onCall(require("./src/robot"));

// Middleware v0
const {cacheMiddleware, tenantHandler} = require("./src/middlewares");

exports.v0 = functions.https.onRequest(async (req, res) => {
  // 720 minutes = 12 hours
  await cacheMiddleware(720)(req, res, async () => {
    await tenantHandler(req, res);
  });
});
