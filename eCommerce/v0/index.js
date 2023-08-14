const {replaceAllWith} = require("../../util/replaceX/all-with");


exports.v0 = async (templateX) => {
  const fullAllianceDomain = templateX
    .toLowerCase();

  const allianceDomain = fullAllianceDomain.replace("tufactura123.", "");
  const guionAllianceDomain = replaceAllWith(fullAllianceDomain, ".", "-");
  const underScoreAllianceDomain = replaceAllWith(fullAllianceDomain, ".", "_");

  const apiKey = "AIzaSyBMu2mmI9-1fKZix2WUgCtcNihnR2qICVo";
  const authDomain = fullAllianceDomain;

  const token = {
    sufix: "UNGUESSABLE", // SHORT
    prefix: `https://${fullAllianceDomain}/token`,
  };

  const databaseURL = [
    "https://tf-tenant-default-rtdb.firebaseio.com/", // 0 Default
    `https://${guionAllianceDomain}.firebaseio.com/`, // 1 US
    `https://${guionAllianceDomain}.europe-west1.firebasedatabase.app/`, // 2 EU
    "https://localhost5000.firebaseio.com/", // 3 Localhost
  ];

  const projectId = "tf-tenant";

  const storageBucket = `tf.${allianceDomain}`;

  const messagingSenderId = "268550538423";
  const appId = "1:268550538423:web:6a837fd6dcbe682f2f3932";
  const measurementId = "G-ZH493YQMP8";

  const url = {
    site: `https://www.${allianceDomain}`,
    cdn: `https://cdn-tf.${allianceDomain}`,
    app: `https://tufactura123.${allianceDomain}`,
    logo: `https://cdn-tf.${allianceDomain}/principal.png`,
  };

  const domainDeveloper = allianceDomain==="localhost:5000" ?
    "Jovanny.CO" :
    allianceDomain;


  const email = {
    "from": `<info@${domainDeveloper}>`,
    "replyTo": `<tuFactura123@${domainDeveloper}>`,
    "path": `email_${underScoreAllianceDomain}`,
    "getLink": `getLink_${underScoreAllianceDomain}`,
  };


  const firebaseConfig = (region = 0) => {
    return {
      "appId": appId,
      "apiKey": apiKey,
      "projectId": projectId,
      "authDomain": authDomain,
      "storageBucket": storageBucket,
      "measurementId": measurementId,
      "databaseURL": databaseURL[region],
      "messagingSenderId": messagingSenderId,
    };
  };


  const appCheck = {
    "debug": false,
    "code": "6Ld4u-ojAAAAAMJz5HM9YS-wsWnaT7FVwa1pKKLD",
  };


  const colors = {
    "primary": "#03a9f4",
    "secondary": "#ffc107",
    "darkPrimary": "#03a9f4",
    "darkSecondary": "#ffc107",
    "dark": false,
  };

  const fieldsToDelete = [
    "appCheck",
    ["setup", "apiKey"],
    ["setup", "appId"],
    ["setup", "measurementId"],
    ["setup", "messagingSenderId"],
    ["setup", "projectId"],
    "eCommerce",
    "token",
    "email",
    "handle",
  ];

  switch (fullAllianceDomain) {
  // Distribuidor TIER 3
  case "tufactura123.jovanny.co":
    return Promise.resolve({
      "eCommerce": [
        "CO-94523690", // 0 Distribuidor
        "CO-94523690", // 1 STAFF
        "CO-94523690", // 2 biller
        "principal", // 3 billerBranchOffice
        "America/Bogota", // 4 Time Zone de la branchOffice actual
        "CO-94523690", // 5 Alianza NIT
        "principal", // 6 Alianza branchOffice
      ],
      "token": token,
      "email": email,
      "appCheck": appCheck,
      "colors": {
        "primary": "#F54021",
        "secondary": "#308446",
        "darkPrimary": "#308446",
        "darkSecondary": "#F54021",
        "dark": true,
      },
      "callToAction": {
        "actionButtons": [
          {
            "class": "primary--text ma-2",
            "icon": "mdi-plus-circle",
            "text": "Compra tú página web informativa",
            "url": "https://checkout.wompi.co/l/O1mp5a",
          },
        ],
        "media": {
          "type": "video",
          "uri": "https://cdn-tf.jovanny.co/hero.mp4",
        },
        "text": "Las buenas ideas son sencillas. Inicia con una página web informativa.",
        "title": "💡Jovanny.CO - Desarrollo de software",
      },
      "comertialName": "Jovanny.CO",
      "brand": "💡Jovanny.CO",
      "url": url,
      "footer": [
        {
          "icon": "mdi-invoice",
          "link": "https://www.jovanny.co/TuFactura",
        },
        {
          "icon": "mdi-github",
          "link": "https://www.jovanny.co/GitHub",
        },
        {
          "icon": "mdi-facebook",
          "link": "https://www.jovanny.co/Facebook",
        },
        {
          "icon": "mdi-twitter",
          "link": "https://www.jovanny.co/Twitter",
        },
        {
          "icon": "mdi-linkedin",
          "link": "https://www.jovanny.co/LinkedIn",
        },
        {
          "icon": "mdi-youtube",
          "link": "https://www.jovanny.co/YouTube",
        },
      ],
      "landingPage": "/tienda/desarrollador-de-software/inicio",
      "customerLandingPage": "/tienda/{{entityX}}/procesando-pago",
      "forced": false,
      "sections": [
        "CallToAction",
        "StoreProducts",
      ],
      "showHero": true,
      "setup": firebaseConfig(2),
      "handle": fieldsToDelete,
    });


    // Distribuidor TIER 2
  case "tufactura123.col.marketing":
    return Promise.resolve({
      "eCommerce": [
        "CO-94523690", // 0 Distribuidor
        "CO-94523690", // 1 STAFF
        "CO-94523690", // 2 biller
        "76001_2", // 3 billerBranchOffice
        "America/Bogota", // Time Zone de la branchOffice actual
        "CO-94523690", // 5 Alianza NIT
        "principal", // 6 Alianza branchOffice
      ],
      "token": token,
      "email": email,
      "appCheck": appCheck,
      "colors": {
        "primary": "#F54021",
        "secondary": "#308446",
        "darkPrimary": "#F54021",
        "darkSecondary": "#308446",
        "dark": false,
      },
      "callToAction": {
        "actionButtons": [
          {
            "class": "primary--text ma-2",
            "icon": "mdi-plus-circle",
            "text": "Comprar",
            "url": "",
          },
        ],
        "media": {
          "type": "video",
          "uri": "https://cdn-tf.col.marketing/hero.mp4",
        },
        "text": "Las buenas ideas son sencillas.",
        "title": "🍊COL.marketing",
      },
      "comertialName": "Jovanny.CO",
      "brand": "🍊COL.marketing",
      "url": url,
      "footer": [
        {
          "icon": "mdi-invoice",
          "link": "https://www.jovanny.co/TuFactura",
        },
        {
          "icon": "mdi-github",
          "link": "https://www.jovanny.co/GitHub",
        },
        {
          "icon": "mdi-facebook",
          "link": "https://www.jovanny.co/Facebook",
        },
        {
          "icon": "mdi-twitter",
          "link": "https://www.jovanny.co/Twitter",
        },
        {
          "icon": "mdi-linkedin",
          "link": "https://www.jovanny.co/LinkedIn",
        },
        {
          "icon": "mdi-youtube",
          "link": "https://www.jovanny.co/YouTube",
        },
      ],
      "landingPage": "/tienda/mercadeo-en-linea/inicio",
      "customerLandingPage": "/tienda/{{entityX}}/procesando-pago",
      "forced": false,
      "sections": [
        "CallToAction",
        "StoreProducts",
      ],
      "showHero": true,
      "setup": firebaseConfig(2),
      "handle": fieldsToDelete,
    });


    // Developer production
  case "tufactura123.developer.jovanny.co":
    return Promise.resolve({
      "eCommerce": [
        "CO-94523690", // 0 Distribuidor
        "CO-94523690", // 1 STAFF
        "CO-901318433", // 2 biller
        "developer", // 3 billerBranchOffice
        "America/Bogota", // Time Zone de la branchOffice actual
        "CO-901318433", // 5 Alianza NIT
        "developer", // 6 Alianza branchOffice
      ],
      "token": token,
      "email": {
        "from": "<developer@jovanny.co>",
        "replyTo": "<sandbox@jovanny.co>",
        "path": "email_localhost5000",
        "getLink": "getLink_localhost5000",
      },
      "appCheck": appCheck,
      "colors": {
        "primary": "#308446",
        "secondary": "#F54021",
        "darkPrimary": "#F54021",
        "darkSecondary": "#308446",
        "dark": true,
      },
      "callToAction": {
        "actionButtons": [
          {
            "class": "primary--text ma-2",
            "icon": "mdi-plus-circle",
            "text": "Comprar",
            "url": "",
          },
        ],
        "media": {
          "type": "video",
          "uri": "https://cdn-tf.developer.jovanny.co/hero.mp4",
        },
        "text": "Un Entorno de Desarrollo 'Amigable'.",
        "title": "Sandbox enterprise",
      },
      "comertialName": "E-Invoice Playground",
      "brand": "Sandbox💡",
      "url": {
        "site": "http://www.jovanny.co",
        "cdn": "https://cdn-tf.developer.jovanny.co",
        "app": "https://tufactura123.developer.jovanny.co",
        "logo": "https://jovanny.co/JovannyCO.png",
      },
      "footer": [
        {
          "icon": "mdi-invoice",
          "link": "https://www.jovanny.co/TuFactura",
        },
        {
          "icon": "mdi-github",
          "link": "https://www.jovanny.co/GitHub",
        },
        {
          "icon": "mdi-facebook",
          "link": "https://www.jovanny.co/Facebook",
        },
        {
          "icon": "mdi-twitter",
          "link": "https://www.jovanny.co/Twitter",
        },
        {
          "icon": "mdi-linkedin",
          "link": "https://www.jovanny.co/LinkedIn",
        },
        {
          "icon": "mdi-youtube",
          "link": "https://www.jovanny.co/YouTube",
        },
      ],
      "landingPage": "/tienda/developer/inicio",
      "customerLandingPage": "/tienda/{{entityX}}/procesando-pago",
      "forced": false,
      "sections": [
        "CallToAction",
        "StoreProducts",
      ],
      "showHero": true,
      "setup": {
        "apiKey": "AIzaSyBMu2mmI9-1fKZix2WUgCtcNihnR2qICVo",
        "authDomain": "tufactura123.developer.jovanny.co",
        "databaseURL": "https://tufactura123-developer-jovanny-co.firebaseio.com/",
        "projectId": "tf-tenant",
        "storageBucket": "tf.developer.jovanny.co",
        "messagingSenderId": "268550538423",
        "appId": "1:268550538423:web:6a837fd6dcbe682f2f3932",
        "measurementId": "G-ZH493YQMP8",
      },
      "handle": fieldsToDelete,
    });

    // Developer localhost
  case "localhost:5000":
    return Promise.resolve({
      "eCommerce": [
        "CO-94523690", // 0 Distribuidor
        "CO-1144081388", // 1 STAFF
        "CO-901318433", // 2 biller
        "localhost", // 3 billerBranchOffice
        "America/Bogota", // Time Zone
        "CO-901318433", // 5 Alianza NIT
        "localhost", // 6 Alianza branchOffice
      ],
      "token": {
        "sufix": "SHORT", // UNGUESSABLE
        "prefix": "https://localhost5000.page.link",
      },
      "email": {
        "from": "<tufactura123@jovanny.co>",
        "replyTo": "<tufactura123@jovanny.co>",
        "path": "email_localhost5000",
        "getLink": "getLink_localhost5000",
      },
      "appCheck": {
        "debug": true,
        "code": "e2b3e90d-eab5-4b54-b235-52adea0395fe",
      },
      "colors": {
        "primary": "#F54021",
        "secondary": "#308446",
        "darkPrimary": "#308446",
        "darkSecondary": "#F54021",
        "dark": false,
      },
      "callToAction": {
        "actionButtons": [
          {
            "class": "primary--text ma-2",
            "icon": "mdi-plus-circle",
            "text": "Comprar",
            "url": "",
          },
        ],
        "media": {
          "type": "video",
          "uri": "https://cdn-tf.developer.jovanny.co/hero.mp4",
        },
        "title": "Sandbox LOCALHOST",
        "text": "Un Entorno de Desarrollo 'Amigable'.",
      },
      "comertialName": "E-Invoice Playground",
      "brand": "Sandbox💡",
      "url": {
        "site": "http://localhost:5000",
        "cdn": "https://cdn-tf.developer.jovanny.co",
        "app": "http://localhost:5000",
        "logo": "https://jovanny.co/JovannyCO.png",
      },
      "footer": [
        {
          "icon": "mdi-invoice",
          "link": "https://www.jovanny.co/TuFactura",
        },
        {
          "icon": "mdi-github",
          "link": "https://www.jovanny.co/GitHub",
        },
        {
          "icon": "mdi-facebook",
          "link": "https://www.jovanny.co/Facebook",
        },
        {
          "icon": "mdi-twitter",
          "link": "https://www.jovanny.co/Twitter",
        },
        {
          "icon": "mdi-linkedin",
          "link": "https://www.jovanny.co/LinkedIn",
        },
      ],
      "landingPage": "/tienda/localhost/inicio",
      "customerLandingPage": "/tienda/{{entityX}}/procesando-pago",
      "forced": false,
      "sections": [
        "CallToAction",
        "StoreProducts",
      ],
      "showHero": true,
      "setup": {
        "apiKey": "AIzaSyBMu2mmI9-1fKZix2WUgCtcNihnR2qICVo",
        "authDomain": "localhost",
        "databaseURL": "https://localhost5000.firebaseio.com/",
        "projectId": "tf-tenant",
        "storageBucket": "tf.developer.jovanny.co",
        "messagingSenderId": "268550538423",
        "appId": "1:268550538423:web:6a837fd6dcbe682f2f3932",
        "measurementId": "G-ZH493YQMP8",
      },
      "handle": fieldsToDelete,
    });

    // Todos los demás dominios
  default:
    if (url.app === "https://tufactura123.tufactura.com") url.app = "https://tufactura.com";

    return Promise.resolve({
      "eCommerce": [
        "CO-94072179", // Distribuidor
        "CO-94072179", // STAFF
        "CO-901318433", // biller
        "principal", // branchOffice
        "America/Bogota", // Time Zone de la branchOffice actual
        "CO-901318433", // 5 Alianza NIT
        "principal", // 5 Alianza branchOffice
      ],
      "token": token,
      "email": email,
      "appCheck": appCheck,
      "colors": colors,
      "callToAction": {
        "actionButtons": [
          {
            "class": "primary--text ma-2",
            "icon": "mdi-plus-circle",
            "text": "Comprar",
            "url": "",
          },
        ],
        "media": {
          "type": "video",
          "uri": "https://cdn-tf.tufactura.com/hero.mp4",
        },
        "text": "Más ágil y sencilla, para iniciar, compra tu paquete de facturación electrónica o inicia sesión.",
        "title": "Tú Factura electrónica",
      },
      "comertialName": "Tú Factura 123 S.A.S.",
      "brand": "Tú Factura 🧾",
      "url": url,
      "footer": [
        {
          "icon": "mdi-facebook",
          "link": "https://web.facebook.com/TuFactura123",
        },
        {
          "icon": "mdi-instagram",
          "link": "https://www.instagram.com/tu_factura/",
        },
        {
          "icon": "mdi-youtube",
          "link": "https://www.youtube.com/channel/UC6UAXZ4Q62Y8eOHAjnK_ydQ",
        },
      ],
      "landingPage": "/tienda/123/inicio",
      "customerLandingPage": "/tienda/{{entityX}}/procesando-pago",
      "forced": false,
      "sections": [
        "CallToAction",
        "StoreProducts",
      ],
      "showHero": true,
      "setup": firebaseConfig(1),
      "handle": fieldsToDelete,
    });
  }
};
