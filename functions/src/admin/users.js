const {
  getAuth,
} = require("firebase-admin/auth");

const {
  GeoPoint,
} = require("firebase-admin/firestore");
const exception = require("../handle/exception.js");

const app = require("./index.js").app; // Import app from index.js
const auth = getAuth(app);

const validateInput = (input, type) => {
  if (typeof input !== type) {
    throw new Error(`Invalid input: expected ${type}, received ${typeof input}`);
  }
};

// Helper function to handle errors
const handleAuthErrors = (error) => {
  console.log(`Error Code: ${error.code}`);
  console.log(`Error Message: ${error.message}`);
  console.log(`Error Stack: ${error.stack}`);

  switch (error.code) {
  case "auth/user-not-found":
    console.error("No se encontró al usuario.");
    return {};
  case "auth/invalid-phone-number":
    console.error("Número de teléfono inválido.");
    return {};
  case "auth/internal-error":
    console.error("Error interno.");
    return {};
  default:
    console.error("Un error desconocido ha ocurrido.");
    return {};
  }
};

// Define user-related functions
const setCustomUserClaims = async (uid, claims) =>
  await auth.setCustomUserClaims(uid, claims)
    .catch(handleAuthErrors);

const getGeopointObject = (geopoint) => {
  if (geopoint.latitude === "" &&
    geopoint.longitude === "") {
    return geopoint;
  }

  return new GeoPoint(
    geopoint.latitude,
    geopoint.longitude,
  );
};

const updateUserPhoneNumberInAuth = (uid, phoneNumber) => {
  validateInput(uid, "string");
  validateInput(phoneNumber, "string");
  return auth.updateUser(uid, {phoneNumber}).catch(handleAuthErrors);
};

const createUserInAuth = (userRecord) => auth.createUser(userRecord).catch(handleAuthErrors);

const revokeRefreshTokens = (uid) => auth.revokeRefreshTokens(uid).catch(handleAuthErrors);

const getUserByPhoneNumber = (phoneNumber) =>
  auth.getUserByPhoneNumber(phoneNumber)
    .then((userRecord) => {
      return {
        [phoneNumber]: userRecord,
      };
    })
    .catch(handleAuthErrors);

const getUserByEmail = (email) =>
  auth.getUserByEmail(email)
    .then((userRecord) => {
      return {
        [email]: userRecord,
      };
    })
    .catch(handleAuthErrors);

const disableUser = (uid) => auth.updateUser(uid, {disabled: true}).catch(handleAuthErrors);

const setPhoto = (uid, url) => auth.updateUser(uid, {photoURL: url}).catch(handleAuthErrors);

const getUserByUid = (uid) => auth.getUser(uid).catch(handleAuthErrors);

const generateSignInWithEmailLink = (
  email,
  urlRedirect = "https://tufactura.com",
  dynamicLinkDomain = "localhost5000.page.link",
) => {
  const actionCodeSettings = {
    url: `${urlRedirect}`,
    handleCodeInApp: true,
    dynamicLinkDomain: dynamicLinkDomain,
  };

  return auth.generateSignInWithEmailLink(
    email, actionCodeSettings).catch(handleAuthErrors);
};

const sendVerificationEmail = (uid) => {
  return auth.generateEmailVerificationLink(uid)
    .then((link) => {
      // Aquí puedes enviar el correo con el link
      return link;
    })
    .catch(exception);
};

const sendPasswordResetEmail = (email) => {
  return auth.generatePasswordResetLink(email)
    .then((link) => {
      // Aquí puedes enviar el correo con el link
    })
    .catch(handleAuthErrors);
};

const updateUserEmailInAuth = (uid, email) => {
  validateInput(uid, "string");
  validateInput(email, "string");
  return auth.updateUser(uid, {email}).catch(handleAuthErrors);
};

const listAllUsers = (nextPageToken) => {
  return auth.listUsers(1000, nextPageToken)
    .then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {
        console.log("user", userRecord.toJSON());
      });

      if (listUsersResult.pageToken) {
        // List next batch of users.
        listAllUsers(listUsersResult.pageToken);
      }
    })
    .catch(handleAuthErrors);
};


module.exports = {
  setPhoto,
  disableUser,
  getUserByUid,
  listAllUsers,
  getUserByEmail,
  createUserInAuth,
  getGeopointObject,
  setCustomUserClaims,
  revokeRefreshTokens,
  getUserByPhoneNumber,
  updateUserEmailInAuth,
  sendVerificationEmail,
  sendPasswordResetEmail,
  generateSignInWithEmailLink,
  updateUserPhoneNumberInAuth,
};
