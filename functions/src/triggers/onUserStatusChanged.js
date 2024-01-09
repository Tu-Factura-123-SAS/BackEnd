module.exports = async (change, context) => {
  try {
    const {mergeInFirestore} = require("../database/firestore");
    const {timeStampFirestoreX} = require("../admin");
    const oldStatus = change.before.val();


    // It is likely that the Realtime Database change that triggered
    // this event has already been overwritten by a fast change in
    // online / offline newStatus, so we'll re-read the current data
    // and compare the timestamps.
    const statusSnapshot = await change.after.ref.once("value");
    const newStatus = statusSnapshot.val();

    const oldData = oldStatus;
    const newData = newStatus;


    if (newStatus.path !== oldStatus.path) {
      oldData["offline"] = timeStampFirestoreX;
      oldData["state"] = "offline";
      newData[newStatus.state] = timeStampFirestoreX;
      await mergeInFirestore(oldStatus.path || `/status/${context.domain}`, oldData, false);
      await mergeInFirestore(newStatus.path || `/status/${context.domain}`, newData, false);
    } else {
      newData[newStatus.state] = timeStampFirestoreX;
      await mergeInFirestore(newStatus.path || `/status/${context.domain}`, newData, false);
    }
  } catch (error) {
    return Promise.reject(error);
  }

  return Promise.resolve();
};
