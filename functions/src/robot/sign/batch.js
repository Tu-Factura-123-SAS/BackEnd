

const signUpBatch = async (data) => {
  const {dbRT} = require("../../admin");
  const {
    code,
  } = require("../../admin/responses");

  try {
    // console.table({data});

    const uploadData = dbRT.instance("sign-up-batch").ref(`/${data}`);

    uploadData.once("value")
      .then((snapshot) => {
        const a = snapshot.exists(); // true
        if (a) {
          //
        }
        /* const b = snapshot.child("name").exists(); // true
        const c = snapshot.child("name/first").exists(); // true
        const d = snapshot.child("name/middle").exists(); // false */
      });

    return {
      response: code.created,
      data: data,
    };
  } catch (error) {
    return {
      response: code.badRequest,
    };
  }
};

module.exports = {
  signUpBatch,
};
