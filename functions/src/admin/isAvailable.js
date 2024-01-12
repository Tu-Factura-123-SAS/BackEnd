const emailIsAvailable = async (emailIsAvailableX) => {
  const {
    auth,
  } = require(".");

  const {
    sendSnackBar,
    obfuscatedUidX,
    obfuscatedPhoneNumberX,
  } = require("./utils");

  const {
    customMessageErrorCatch,
    customMessageIsAvailable,
  } = require("../admin/customMessages");

  let myError = {};
  try {
    return await auth.getUserByEmail(emailIsAvailableX)
      .then((userRecord) => {
        const messageX = customMessageIsAvailable.email_no_available
          .replace("{phone}", obfuscatedPhoneNumberX(userRecord.phoneNumber))
          .replace("{uid}", obfuscatedUidX(userRecord.uid));
        return sendSnackBar(messageX,
          "isAvailable", "", "warning", false);
      })
      .catch((error) => {
        myError = error;
        return sendSnackBar(customMessageIsAvailable.email_available,
          "isAvailable", "", "info", true);
      });
  } catch (error) {
    myError["catch"] = error;
    return sendSnackBar(customMessageErrorCatch.es_error_catch,
      "error", emailIsAvailableX, myError);
  }
};


const phoneNumberIsAvailable = async (phoneNumberIsAvailableX) => {
  const {
    auth,
  } = require(".");

  const {
    sendSnackBar,
    obfuscatedUidX,
    obfuscatedEmailX,
  } = require("./utils");

  const {
    customMessageErrorCatch,
    customMessageIsAvailable,
  } = require("../admin/customMessages");
  let myError = {};
  try {
    return await auth.getUserByPhoneNumber(phoneNumberIsAvailableX)
      .then((userRecord) => {
        const messageX = customMessageIsAvailable.phone_no_available
          .replace("{email}", obfuscatedEmailX(userRecord.email))
          .replace("{uid}", obfuscatedUidX(userRecord.uid));

        return sendSnackBar(messageX,
          "isAvailable", "", "warning", false);
      })
      .catch((error) => {
        myError = error;
        return sendSnackBar(customMessageIsAvailable.phone_available,
          "isAvailable", "", "info", true);
      });
  } catch (error) {
    myError["catch"] = error;
    return sendSnackBar(customMessageErrorCatch.es_error_catch,
      "error", phoneNumberIsAvailableX, myError);
  }
};


const authUserIdIsRegistered = async (entityX) => {
  const {
    auth,
  } = require(".");

  const {
    sendSnackBar,
    obfuscatedEmailX,
    obfuscatedPhoneNumberX,
  } = require("./utils");

  const {
    customMessageErrorCatch,
    customMessageIsRegistered,
  } = require("../admin/customMessages");
  let myError = {};
  try {
    return await auth.getUser(entityX)
      .then((userRecord)=>{
        const messageX = customMessageIsRegistered.uid_registered
          .replace("{email}", obfuscatedEmailX(userRecord.email))
          .replace("{phone}", obfuscatedPhoneNumberX(userRecord.phoneNumber));

        return sendSnackBar(messageX,
          "isRegistered", "", "info", true);
      })
      .catch((error)=>{
        myError = error;
        return sendSnackBar(customMessageIsRegistered.uid_no_registered,
          "isRegistered", "", "warning", false);
      });
  } catch (error) {
    myError["catch"] = error;
    return sendSnackBar(customMessageErrorCatch.es_error_catch,
      "error", entityX, myError);
  }
};


module.exports = {
  emailIsAvailable,
  phoneNumberIsAvailable,
  authUserIdIsRegistered,
};
