// Nueva inicialización de Firebase initializeApp() nueva versión

const {initializeApp, applicationDefault} = require("firebase-admin/app");

initializeApp({
  credential: applicationDefault(),
  projectId: "tf-tenant",
});
