const {code} = require("../../admin/responses");
const rut = require("../../data/rut.json");


// Función para obtener el texto de un array de objetos.


const getTextFromArray = async (template, data) => {
  // return new Promise((resolve, reject) => {
  // const {interpolateManyStrings} = require("../../admin/utils");
  // console.table({template});
  // console.log("DATA", data);

  for (const tupla of data) {
    console .log("¶ INICIO: const tupla of data");
    const templateEmpty = template.keysValues;


    // Interpolación de la plantilla
    // const documentPath = false;

    const templateEmptyKeys = Object.keys(templateEmpty);

    for (const templateEmptyKey of templateEmptyKeys) {
      console .log("§ INICIO: const templateEmptyKey", templateEmpty[templateEmptyKey]);

      // console.log(templateEmpty[templateEmptyKey]);

      const templateRegex = /\{\{(.*?)\}\}/g;
      if (typeof templateEmpty[templateEmptyKey] === "string") {
        const matches = (templateEmpty[templateEmptyKey]).match(templateRegex);


        if (matches) {
          // Fase 1: completar values.
          console.log({matches});
          for (const match of matches) {
            const keyMatch = match.replace(/\{|\}/g, "");
            // eslint-disable-next-line no-undef
            const valueMatch = dataInTupla[keyMatch];
            // console.log("KEY", keyMatch, "VALUE", valueMatch);


            if (typeof templateEmpty[templateEmptyKey] === "string") {
              // console.log(`▲ ${templateEmptyKey}: ${templateEmpty[templateEmptyKey]}`);
              // console.log(templateEmpty[templateEmptyKey].replace(match, valueMatch));
              templateEmpty[templateEmptyKey] = templateEmpty[templateEmptyKey].replace(match, valueMatch);
              console.log(`▲▲▲▲ ${templateEmptyKey}: ${templateEmpty[templateEmptyKey]}`);
            }
          }
        }
      }
      // return null;
    }
    // } catch (error) {
    //   console.log(error);
    // }
    console.log(rut[tupla[0]] || "Sin buzón de facturación registrado en la DIAN");
    console .log("¶¶ FIN: const tupla of data");
  }
  return Promise.resolve({
    response: code.ok,
  });
  // });
};


module.exports = {
  getTextFromArray,
};
