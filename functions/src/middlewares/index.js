const mcache = require("memory-cache");
const {v0} = require("../eCommerce/v0");

const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    try {
      const key = "__cloud_function__" + (req.originalUrl || req.url);
      const cachedBody = mcache.get(key);
      if (cachedBody) {
        res.status(200).send(JSON.parse(cachedBody));
        return;
      } else {
        res.originalSend = res.send;
        res.send = (body) => {
          mcache.put(key, body, duration * 60 * 1000);
          res.originalSend(body);
        };
        next();
      }
    } catch (error) {
      console.error("Cache error:", error);
      res.status(500).send("Internal Server Error");
    }
  };
};

const tenantHandler = async (req, res) => {
  try {
    const tenantId = req.params["0"].replace("v0/", "").replace(/['"]+/g, "");
    const tenant = await v0(tenantId);
    const {runZcache} = require("../eCommerce/zCache");

    const aliasX = tenant.landingPage.split("/")[2];
    const paramsX = `${tenant.setup.authDomain}|${tenant.eCommerce[2]}|${tenant.eCommerce[3]}|${aliasX}`;
    await runZcache("signUp", paramsX);

    res.status(200).send({tenant});
  } catch (error) {
    console.error(req.params, "TenantHandler error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  cacheMiddleware,
  tenantHandler,
};
