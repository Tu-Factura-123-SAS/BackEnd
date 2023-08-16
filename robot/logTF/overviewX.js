

const overviewX = (
  currentUserIdAuth,
  documentX, debitX, creditX,
  callX, callGroupX, callDescription,
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
    [callGroupX + "Description"]: callDescription,
    [callX + "Last"]: timeStampFirestoreX,
    [callX + "Accumulated"]: incrementFireStoreX(1),
    [callGroupX + "Last"]: timeStampFirestoreX,
    [callGroupX + "Accumulated"]: incrementFireStoreX(1),
    [callGroupX]: {
      byYear: {
        [yearX]: {
          accumulated: incrementFireStoreX(1),
          [documentX]: {
            debit: debitX,
            credit: creditX,
            documents: incrementFireStoreX(1),
          },
          byMonth: {
            [monthX]: {
              month: textMonthX,
              accumulated: incrementFireStoreX(1),
              [documentX]: {
                debit: debitX,
                credit: creditX,
                documents: incrementFireStoreX(1),
              },
              byDay: {
                [dayX]: {
                  weekDay: weekDayX,
                  textWeekDay: textWeekDayX,
                  accumulated: incrementFireStoreX(1),
                  [documentX]: {
                    debit: debitX,
                    credit: creditX,
                    documents: incrementFireStoreX(1),
                  },
                  byHour: {
                    [hourX]: {
                      accumulated: incrementFireStoreX(1),
                      [documentX]: {
                        debit: debitX,
                        credit: creditX,
                        documents: incrementFireStoreX(1),
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
  };
};

module.exports = {
  overviewX,
};
