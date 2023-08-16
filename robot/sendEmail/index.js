const sendTemplateByTriggerFirestore = async (
  toX,
  ip,
  entityX,
  mTenantRaw,
  displayNameX,
  linkCallToActionX = "https://www.tufactura.com",
  tenantTemplate,
) => {
  const {mergeInFirestore} = require("../../database/firestore");
  try {
    const {generateRandomString, dayX, textWeekDayX} = require("../../admin/utils");
    const {timeStampFirestoreX} = require("../../admin");

    // Quitamos los dos puntos en el nombre de la colección y la marca tf.
    let collectionX = (tenantTemplate.email.path).replace(":", "");
    collectionX = collectionX.replace("tufactura123_", "");

    const logoTenant = (tenantTemplate.url.cdn === "https://cdn-tf.localhost:5000") ?
      "https://cdn-tf.tufactura.com/tf.png":
      `${tenantTemplate.url.cdn}/entities/${tenantTemplate.eCommerce[2]}/branchOffices/${tenantTemplate.eCommerce[3]}_512x512.png`;


    const dataX = {
      TTL: timeStampFirestoreX,
      to: toX,
      from: `${tenantTemplate.brand} ${(tenantTemplate.email.from)}`,
      replyTo: `${tenantTemplate.brand} ${tenantTemplate.email.replyTo}`,
      displayName: displayNameX,
      delivery: {
        state: "PENDING",
        log: {
          ip: ip.raw,
          tenant: mTenantRaw,
        },
      },
      template: {
        name: "signIn",
        data: {
          logoTenant: logoTenant,
          app: tenantTemplate.url.app,
          secondaryColor: tenantTemplate.colors.secondary,
          titleHeader: "SignIn",
          userName: displayNameX,
          hash: textWeekDayX + " " +dayX + " - " + generateRandomString(5),
          content: {
            title: "¡Hola!",
            text: "Haz clic en el botón ENTRAR para ingresar a 🧾Tú Factura 123",
          },
          button: {
            show: true,
            text: "ENTRAR",
            link: linkCallToActionX,
          },
          tenant: tenantTemplate.setup.authDomain,
        },
      },
    };


    return await mergeInFirestore(`/${collectionX}/${entityX}`, dataX, false);
  } catch (error) {
    console.error("🍊", error.mesagge);
    return error;
  }
};

module.exports = {
  // sendEmailByTriggerFirestore,
  sendTemplateByTriggerFirestore,
};
