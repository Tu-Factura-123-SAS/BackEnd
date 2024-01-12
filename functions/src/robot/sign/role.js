

const haveRole = async (
  myAuth,
  roleId,
  inTheEntity,
) => {
  const {code} = require("../../admin/responses");
  const {getOneDocument} = require("../../database/firestore");

  try {
    const roleOuth = await getOneDocument(
      "entities/" + inTheEntity +
      "/roles/" + roleId);

    let haveRoleX = false;

    if (myAuth != " ¶¶_currentUserIdAuth") {
      haveRoleX = roleOuth.data[myAuth].enabled;
    }

    if (roleOuth.response === code.ok) {
      return {
        response: code.ok,
        haveRole: haveRoleX,
        [roleId]: haveRoleX,
      };
    } else {
      return {
        response: code.noContent,
        haveRole: haveRoleX,
        [roleId]: haveRoleX,
      };
    }
  } catch (error) {
    return {
      response: code.notFound,
      haveRole: false,
      [roleId]: false,
    };
  }
};


module.exports = {haveRole};
