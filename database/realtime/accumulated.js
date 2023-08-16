const accumulatedTenantDbFirestore = (
  currentUserIdAuth, entityX,
  callX, callGroupX,
) => {
  const {
    timeStampFirestoreX,
    incrementFireStoreX,
  } = require("../../admin");


  const {
    dayX,
    hourX,
    yearX,
    monthX,
    weekDayX,
    textMonthX,
    textWeekDayX,
  } = require("../../admin/utils");


  return {
    [callX]: {
      [callX + "Accumulated"]: incrementFireStoreX(1),
      [callX + "Last"]: timeStampFirestoreX,
      [callGroupX]: {
        [callGroupX + "Accumulated"]: incrementFireStoreX(1),
        [callGroupX + "Last"]: timeStampFirestoreX,
        [currentUserIdAuth]: {
          byYear: {
            [yearX]: {
              accumulated: incrementFireStoreX(1),
              byMonth: {
                [monthX]: {
                  month: textMonthX,
                  accumulated: incrementFireStoreX(1),
                  byDay: {
                    [dayX]: {
                      weekDay: weekDayX,
                      textWeekDay: textWeekDayX,
                      accumulated: incrementFireStoreX(1),
                      byHour: {
                        [hourX]: {
                          accumulated: incrementFireStoreX(1),
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        [entityX]: {
          [currentUserIdAuth]: {
            byYear: {
              [yearX]: {
                accumulated: incrementFireStoreX(1),
                byMonth: {
                  [monthX]: {
                    month: textMonthX,
                    accumulated: incrementFireStoreX(1),
                    byDay: {
                      [dayX]: {
                        weekDay: weekDayX,
                        accumulated: incrementFireStoreX(1),
                        byHour: {
                          [hourX]: {
                            accumulated: incrementFireStoreX(1),
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      global: {
        [yearX]: {
          accumulated: incrementFireStoreX(1),
          byMonth: {
            [monthX]: {
              month: textMonthX,
              accumulated: incrementFireStoreX(1),
              byDay: {
                [dayX]: {
                  weekDay: weekDayX,
                  textWeekDay: textWeekDayX,
                  accumulated: incrementFireStoreX(1),
                  byHour: {
                    [hourX]: {
                      accumulated: incrementFireStoreX(1),
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
};


const accumulatedTenantDbRealtime = (
  currentUserIdAuth, entityX,
  callX, callGroupX,
) => {
  const moment = require("moment-timezone");


  const {
    incrementRealTimeX,
    timeStampRealTimeX,

  } = require("../../admin");
  const {FieldValue} = require("firebase-admin/firestore");
  const timeStampRT = FieldValue.serverTimestamp();
  moment.locale("es_CO");
  const nowX = moment(timeStampRT).tz("America/Bogota");
  const weekDayX = nowX.day();
  const dayX = nowX.format("DD");
  const hourX = nowX.format("HH");
  const minuteX = nowX.format("mm");
  const secondsX = nowX.format("ss");
  const monthX = nowX.format("MM");
  const yearX = nowX.format("YYYY");
  const textMonthX = nowX.format("MMMM");
  const textWeekDayX = nowX.format("dddd");
  const WeekX = nowX.format("WW");

  return {
    [yearX]: incrementRealTimeX(1),
    ["semana " + WeekX]: incrementRealTimeX(1),
    [textMonthX]: incrementRealTimeX(1),
    [yearX + "-" + monthX]: incrementRealTimeX(1),
    [textWeekDayX + " " + dayX]: incrementRealTimeX(1),
    [textWeekDayX + " a las " + hourX]: incrementRealTimeX(1),
    [yearX + "-" + monthX + "-" + dayX + " " + hourX]: incrementRealTimeX(1),
    [yearX + "-" + monthX + "-" + dayX + " " + hourX + ":" + minuteX]: incrementRealTimeX(1),
    [yearX + "-" + monthX + "-" + dayX + " " + hourX + ":" + minuteX + ":" + secondsX]: incrementRealTimeX(1),
    [entityX]: {
      [yearX]: incrementRealTimeX(1),
      [yearX + "-" + monthX]: incrementRealTimeX(1),
      [yearX + "-" + monthX]: incrementRealTimeX(1),
      [yearX + "-" + monthX + "-" + dayX]: incrementRealTimeX(1),
      [yearX + "-" + monthX + "-" + dayX + " " + hourX]: incrementRealTimeX(1),
      [yearX + "-" + monthX + "-" + dayX + " " + hourX + ":" + minuteX]: incrementRealTimeX(1),
      [yearX + "-" + monthX + "-" + dayX + " " + hourX + ":" + minuteX + ":" + secondsX]: incrementRealTimeX(1),

    },
    [entityX + "XXX"]: {
      [currentUserIdAuth]: {
        byYear: {
          [yearX]: {
            accumulated: incrementRealTimeX(1),
            byMonth: {
              [monthX]: {
                month: textMonthX,
                accumulated: incrementRealTimeX(1),
                byDay: {
                  [dayX]: {
                    weekDay: weekDayX,
                    accumulated: incrementRealTimeX(1),
                    byHour: {
                      [hourX]: {
                        accumulated: incrementRealTimeX(1),
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    [callX]: {
      [callX + "Accumulated"]: incrementRealTimeX(1),
      [callX + "Last"]: timeStampRealTimeX,
      [callGroupX]: {
        [callGroupX + "Accumulated"]: incrementRealTimeX(1),
        [callGroupX + "Last"]: timeStampRealTimeX,
        [currentUserIdAuth]: {
          [yearX]: {
            accumulated: incrementRealTimeX(1),
            [monthX]: {
              month: textMonthX,
              accumulated: incrementRealTimeX(1),
              [dayX]: {
                weekDay: weekDayX,
                textWeekDay: textWeekDayX,
                accumulated: incrementRealTimeX(1),
                [hourX]: {
                  accumulated: incrementRealTimeX(1),
                },
              },
            },
          },
        },
      },
    },
  };
};


const accumulatedDbRealtime = () => {
  const moment = require("moment-timezone");


  const {
    incrementRealTimeX,

  } = require("../../admin");
  const {FieldValue} = require("firebase-admin/firestore");
  const timeStampRT = FieldValue.serverTimestamp();
  moment.locale("es_CO");
  const nowX = moment(timeStampRT).tz("America/Bogota");
  const hourX = nowX.format("HH");
  const minuteX = nowX.format("mm");
  const secondsX = nowX.format("ss");
  const yearX = nowX.format("YYYY");
  const WeekX = nowX.format("WW");
  const textMonthX = nowX.format("MMMM");
  const textWeekDayX = nowX.format("dddd");

  return {
    "year": {
      [yearX]: incrementRealTimeX(1),
    },
    "month": {
      [textMonthX]: incrementRealTimeX(1),
    },
    "today": {
      [textWeekDayX]: incrementRealTimeX(1),
    },
    "hour": {
      [hourX]: incrementRealTimeX(1),
    },
    "minute": {
      [minuteX]: incrementRealTimeX(1),
    },
    "second": {
      [secondsX]: incrementRealTimeX(1),
    },
    "week": {
      [WeekX]: incrementRealTimeX(1),
    },
  };
};


module.exports = {
  accumulatedDbRealtime,
  accumulatedTenantDbRealtime,
  accumulatedTenantDbFirestore,
};
