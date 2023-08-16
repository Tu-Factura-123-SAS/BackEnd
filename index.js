const functions = require("firebase-functions");
const {gb4} = require("./functionConfig");


exports.invoiceAuthorizations = functions.runWith(gb4).firestore
  .document("/ a_invoiceAuthorizations/{entity}")
  .onCreate(require("./triggers/aDianAuthorizationsOnCreate"));

exports.xmlGenerator = functions.runWith(gb4).firestore
  .document("/ b_xml_parse/{dataPath}")
  .onCreate(require("./triggers/bXmlGeneratorOnCreate"));

exports.xmlSign = functions.runWith(gb4).firestore
  .document("/ c_xml_sign/{dataPath}")
  .onCreate(require("./triggers/cXmlSignOnCreate"));

exports.xmlReception = functions.runWith(gb4).firestore
  .document("/ f_xml_reception/{entityAndItemId}")
  .onCreate(require("./triggers/fXmlReceptionOnCreate"));


exports.onWriteItems = functions.firestore
  .document("/entities/{alliance}/branchOffices/{allianceBranchOffice}/{appCollection}/{billerUnderscoreBranchOffice}/items/{itemId}")
  .onWrite(require("./triggers/items/onWrite"));

exports.onDeleteItems = functions.firestore
  .document("/entities/{alliance}/branchOffices/{allianceBranchOffice}/{appCollection}/{billerUnderscoreBranchOffice}/items/{itemId}")
  .onDelete(require("./triggers/items/onDelete"));

exports.onWriteCustomClaims = functions.firestore
  .document("/rolesRun/{uid}")
  .onWrite(require("./triggers/rolesRun/onWrite"));


exports.onUpdateCustomersJourneys = functions.firestore
  .document("/entities/{alliance}/branchOffices/{allianceBranchOffice}/{appCollection}/{billerUnderscoreBranchOffice}/customersJourneys/{uid}")
  .onUpdate(require("./triggers/customersJourneys/onUpdate"));


exports.tf = functions.runWith(gb4).https.onCall(require("./robot"));

// Middleware v0
const {cacheMiddleware, tenantHandler} = require("./middlewares");

exports.v0 = functions.https.onRequest(async (req, res) => {
  // 720 minutes = 12 hours
  await cacheMiddleware(720)(req, res, async () => {
    await tenantHandler(req, res);
  });
});
