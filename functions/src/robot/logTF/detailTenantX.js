

const detailTenantX = (
  data, headersRaw,
  callX, callGroupX,
  ip, originRaw, hostnameRaw,
  currentUserIdAuth, entityX, currentEmailRaw,
) => {
  const {
    timeStampFirestoreX,
    incrementFireStoreX,
  } = require("../../admin");

  return {
    log: {
      _last: {
        timeStamp: timeStampFirestoreX,
        ip: ip["raw"],
        hostname: hostnameRaw,
        origin: originRaw,
        email: currentEmailRaw,
        data: data,
        headers: headersRaw,
      },
      byIP: {
        [ip["raw"]]: {
          last: timeStampFirestoreX,
          accumulated: incrementFireStoreX(1),
        },
      },
      byHostname: {
        [hostnameRaw]: {
          last: timeStampFirestoreX,
          accumulated: incrementFireStoreX(1),
        },
      },
      byUser: {
        [currentUserIdAuth]: {
          last: timeStampFirestoreX,
          accumulated: incrementFireStoreX(1),
        },
        byOrigin: {
          [originRaw]: {
            last: timeStampFirestoreX,
            accumulated: incrementFireStoreX(1),
          },
        },
        byCall: {
          [callX]: {
            last: timeStampFirestoreX,
            accumulated: incrementFireStoreX(1),
            [callGroupX]: {
              last: timeStampFirestoreX,
              accumulated: incrementFireStoreX(1),
            },
          },
        },
        byEntity: {
          [entityX]: {
            accumulated: incrementFireStoreX(1),
            [currentUserIdAuth]: {
              last: {
                timestamp: timeStampFirestoreX,
                data: data,
                headers: headersRaw,
                accumulated: incrementFireStoreX(1),
              },
              [ip["raw"]]: incrementFireStoreX(1),
              [hostnameRaw]: incrementFireStoreX(1),
              [originRaw]: incrementFireStoreX(1),
              [currentEmailRaw]: incrementFireStoreX(1),
            },
          },
        },
      },
    },
  };
};

module.exports = {
  detailTenantX,
};
