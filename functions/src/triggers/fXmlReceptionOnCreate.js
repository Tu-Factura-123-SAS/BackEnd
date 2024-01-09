

module.exports = async (snap, context) => {
  const {code} = require("../admin/responses");
  const entityAndItemId = context.params.entityAndItemId;
  // const data = snap.data();

  console.log({entityAndItemId});

  try {
    return await Promise.resolve(`{response: ${code.ok}}`);
  } catch (error) {
    return await Promise.reject(new Error(`{response: ${code.badRequest}}`));
  }
};
