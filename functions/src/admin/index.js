
// Import required modules
const {
  getApps,
  initializeApp,
} = require("firebase-admin/app");

const {
  getAuth,
} = require("firebase-admin/auth");

const {
  GeoPoint,
  FieldPath,
  FieldValue,
  getFirestore,
} = require("firebase-admin/firestore");


const {
  getDatabase,
  ServerValue,
} = require("firebase-admin/database");

const {getMessaging} = require("firebase-admin/messaging");
const exception = require("../handle/exception");

// Initialize app
const app = initializeApp();
// console.log("🍊", app.name);

// Initialize Firebase services
const auth = getAuth(app);
const dbFS = getFirestore(app);
if (!getApps().length) dbFS.settings({timestampsInSnapshots: true});
const dbRT = getDatabase(app);
const fcm = getMessaging(app);

// Define utility functions
const addArray = (arrayX) => FieldValue.arrayUnion(arrayX);
const removeArray = (arrayX) => FieldValue.arrayRemove(arrayX);
const timeStampFirestoreX = FieldValue.serverTimestamp();
const incrementFireStoreX = (x) => FieldValue.increment(x);
const fieldPath = (x) => new FieldPath(x);


const timeStampRealTimeX = ServerValue.TIMESTAMP;
const incrementRealTimeX = (x) => ServerValue.increment(x);

process
  .on("unhandledRejection", console.log);

process
  .on("uncaughtException", console.log);


// Define user-related functions
const setCustomUserClaims = async (uid, claims) =>
  await auth.setCustomUserClaims(uid, claims)
    .catch(exception);

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

const deleteField = () => FieldValue.delete();

const updateUserPhoneNumberInAuth = (uid, phoneNumber) =>
  auth.updateUser(uid, {phoneNumber})
    .catch(exception);

const createUserInAuth = async (userRecord) =>
  auth.createUser(userRecord)
    .catch(exception);

const revokeRefreshTokens = (uid) =>
  auth.revokeRefreshTokens(uid)
    .catch(exception);

const getUserByPhoneNumber = (phoneNumber) =>
  auth.getUserByPhoneNumber(phoneNumber)
    .then((userRecord) => {
      return {
        [phoneNumber]: userRecord,
      };
    })
    .catch(exception);

const getUserByEmail = (email) =>
  auth.getUserByEmail(email)
    .then((userRecord) => {
      return {
        [email]: userRecord,
      };
    })
    .catch(exception);

const disableUser = (uid) =>
  auth.updateUser(uid, {disabled: true})
    .catch(exception);

const setPhoto = (uid, url) =>
  auth.updateUser(uid, {photoURL: url})
    .catch(exception);

const getUserByUid = async (uid) =>
  await auth.getUser(uid)
    .catch(exception);

const sendVerificationEmail = (uid) => {
  return auth.generateEmailVerificationLink(uid)
    .then((link) => {
      // Aquí puedes enviar el correo con el link
      return link;
    })
    .catch(exception);
};


const generateSignInWithEmailLink = async (
  email,
  actionCodeSettings,
) => {
  return await auth.generateSignInWithEmailLink(
    email, actionCodeSettings)
    .then((link) => {
      // console.log("🍊", link);
      return link;
    })
    .catch(exception);
};

const users = {
  setPhoto,
  disableUser,
  getUserByUid,
  getUserByEmail,
  createUserInAuth,
  setCustomUserClaims,
  revokeRefreshTokens,
  getUserByPhoneNumber,
  sendVerificationEmail,
  updateUserPhoneNumberInAuth,
  generateSignInWithEmailLink,
};

// Export the required objects and functions
module.exports = {
  fcm,
  auth,
  dbFS,
  dbRT,
  users,
  addArray,
  fieldPath,
  removeArray,
  deleteField,
  getGeopointObject,
  incrementRealTimeX,
  timeStampRealTimeX,
  timeStampFirestoreX,
  incrementFireStoreX,
};


