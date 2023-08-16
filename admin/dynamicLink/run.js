const createShortDynamicLink = require("./index");

// Aquí puedes reemplazar 'miDominio' y 'miEnlace' por tus valores reales
createShortDynamicLink("localhost5000.page.link", "https://tufactura.com/tienda/123/inicio")
  .then((data) => {
    console.log("Enlace corto generado:", data.shortLink);
    console.log("Enlace de previsualización:", data.previewLink);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
