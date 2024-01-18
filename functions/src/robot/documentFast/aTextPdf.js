const {code} = require("../../admin/responses");

const getTextPdf = async (
  templatesX,
  documentX, // Documento actual
  tenantX = "tufactura.com", // Tenant actual
) => {
  // const {getInterpolated} = require("../admin/utils");
  const {tenant} = require("../../admin/hardCodeTenants");
  let templatesTenant = tenant(tenantX);
  let template = "";
  const keyValuepathList = {};
  templatesTenant = templatesTenant.templates[templatesX];

  const newTemplates = {};
  newTemplates[templatesX] = {};

  const values = {};
  values["document"] = documentX;

  if (!templatesTenant) {
    return {
      response: code.badRequest,
      message: "No se encontró la plantilla " + templatesX,
    };
  } else {
    Object.keys(templatesTenant).forEach((keyTemplate) => {
      template = templatesTenant[keyTemplate].template;

      const templateRegex = /\{\{(.*?)\}\}/g;
      const matches = template.match(templateRegex);

      if (matches) {
        // Fase 1: completar values.
        matches.forEach((match) => {
          // Obtener en nombre del origen del campo.
          const originData = (match.replace(/\{|\}/g, "")).split(".")[0];

          // Sí el origen del campo existe en values.document, se deja pasar.
          if (!values[originData]) {
            // Consultar en la firestore sino existe.
            // console.log("¶ Consultar", originData, values["document"][" b_xml_parse"][originData]);
            values[originData] = values["document"][" b_xml_parse"][originData];
            // console.log("originData", originData, values["document"][" b_xml_parse"][originData]);
            keyValuepathList[values["document"][" b_xml_parse"][originData]] = values["document"][" b_xml_parse"][originData];
          }
        });
      }
    });

    // Almacenamos los datos por cada path único.
    const {getDataFromManyPaths} = require("../dian/xml");
    const dataManyPath = await getDataFromManyPaths(keyValuepathList);
    // console.log(dataManyPath);

    // Cargamos en cada values lo que está en dataManyPath
    Object.keys(values).forEach((keyPath)=>{
      // Hacemos control con el primer caracter
      if (values[keyPath] != undefined) {
        const firstChr = values[keyPath][0];
        // Si contiene el path, lo reemplazamos por la data.
        if (firstChr === "/" && keyPath !== "document") {
          values[keyPath] = dataManyPath[values[keyPath]];
        }
      }
    });

    // Hacemos interpolación
    Object.keys(templatesTenant).forEach((keyTemplate) => {
      newTemplates[templatesX][templatesTenant[keyTemplate].fieldName] = {};
      const fieldName = templatesTenant[keyTemplate].fieldName;


      template = templatesTenant[keyTemplate].template;


      const templateRegex = /\{\{(.*?)\}\}/g;
      const matches = template.match(templateRegex);

      if (matches) {
        const key = {};
        let value = false;


        // Fase 2: aplicar values.
        for (const match of matches) {
        //   const originData = (match.replace(/\{|\}/g, "")).split(".")[0];
          key[fieldName] = "values." + match.replace(/\{\{|\}\}/g, "");

          try {
            value = eval(key[fieldName]);
          } catch (error) {
            // console.log(error.message);
            // Hacer nada, porque Katherin en el pdf lo asume por undefined y muestra en blanco o no muestra tabla.
          }

          // console..log(fieldName, key[fieldName], match, {template}, eval(key[fieldName]) || "§§");
          newTemplates[templatesX][fieldName] = template.replace(match, value);

          // Se actualiza el template para la siguiente iteración.
          template = template.replace(match, value);
        }
      }
    });
  }


  return new Promise((resolve, reject) => {
    try {
      resolve({
        response: code.ok,
        values: newTemplates,
      });
    } catch (error) {
      reject(new Error(`{
        response: ${code.badRequest},
        error: ${error.message}
      }`));
    }
  });
};

module.exports = {getTextPdf};
