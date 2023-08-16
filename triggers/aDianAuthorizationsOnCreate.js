// https://github.com/JovannyCO/FacturaDIAN-Hosting/wiki/Ambiente-DIAN#ℹ️-persistencia-del-trigger-dianauthorizationsonwrite


module.exports = async (snap, context) => {
  const entity = context.params.entity;
  const data = snap.data();
  const tenant = data[" task"].tenant;
  const {getResolutionBackend} = require("../robot/dian/cadena/resolutionsBackend");


  try {
    return await getResolutionBackend(entity, data, tenant);
  } catch (error) {
    return Promise.reject(new Error("dianAuthorizationsOnCreate getResolutionBackend " + JSON.stringify(error)));
  }
};

