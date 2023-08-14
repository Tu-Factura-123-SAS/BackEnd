// Función para extraer valores de un XML firmado usando xPath.

const getValuesFromXML = async (
  xmlSigned = "",
  xPathObject = {}, // {RULE: "xPath"}
) => {
  // console.log(xmlSigned);
  // console.log(xPathObject);
  return new Promise((resolve, reject) => {
    const xml2js = require("xml2js");
    const parser = new xml2js.Parser();

    parser.parseString(xmlSigned, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const values = [];
        xPathObject.forEach((xPathItem) => {
          const value = result.xml[xPathItem];
          if (value) {
            values.push(value);
          }
        });
        // console.log(values);
        resolve(values);
      }
    });
  });
};

module.exports = getValuesFromXML;
