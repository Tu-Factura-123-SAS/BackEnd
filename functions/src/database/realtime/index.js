

const writeInRealtime = async (
  jsonX = " ¶¶_json",
  tagNameX = " ¶¶_tagName",
  groups = " ¶¶_groups",
  root = " ¶¶_rootRealtime",
) => {
  const {
    dbRT,
    incrementRealTimeX,
    timeStampRealTimeX,
  } = require("../../admin");


  const toWrite = dbRT.ref(root + "/" + groups);

  if (tagNameX.includes("lastContext")) {
    return await toWrite.set({
      user: jsonX.user,
      lastIp: jsonX.byIp,
      byLast: jsonX.byLast,
      lastData: jsonX.data,
      lastCall: jsonX.byCall,
      lastHeader: jsonX.header,
      last: timeStampRealTimeX,
      lastEntity: jsonX.byEntity,
      lastResponse: jsonX.response,
      attempts: incrementRealTimeX(1),
    })
      .then(() => {
        return true;
      })
      .catch((error)=>{
        return error;
      });
  } else {
    return await toWrite.set({
      [tagNameX]: jsonX,
      last: timeStampRealTimeX,
      attempts: incrementRealTimeX(1),
    })
      .then(() => {
        return true;
      })
      .catch((error)=>{
        return error;
      });
  }
};

module.exports = {
  writeInRealtime,
};
