
// const xml2js = require("xml2js");
/*
const {
  parseString,
} = require("xml2js");


const {
  writeInRealtime,
} = require("../../database/realtime");

const {
  tmp,
} = require("../xmlTF/CO-94523690_CALI-335");
*/
/*
const xmlToJson = async () => {
  let responseX = "no-data";


  const parser = new xml2js.Parser();
  parser.parseString(tmp, function(err, result) {
    // return result;
    writeInRealtime(
      result,
      "xml/CO-94523690_EB_CALI-1",
      "CO-94523690",
      "metadata");
    responseX = result;
    console.log("Done");
  });


  return responseX;
};
*/

const xmlToJson = () => {
  const responseX = "no-data";
  /*
  parseString(tmp, {trim: true}, function(err, result) {
    writeInRealtime(
      result,
      "xml/CO-94523690_EB_CALI-1",
      "CO-94523690",
      "metadata");

    responseX = result;
  });
*/
  return responseX;
};

module.exports = {xmlToJson};
