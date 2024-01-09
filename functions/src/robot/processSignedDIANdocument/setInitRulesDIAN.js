"use explicit";
const {code} = require("../../admin/responses");

const setInitRulesDIAN = async () => {
  const {getOneCollection} = require("../../database/firestore");

  const collectionX = await getOneCollection("/xmlComponents");

  if (collectionX.response === code.ok) {
    const collection = collectionX.data;

    const {dbFS} = require("../../admin");
    const batch500 = dbFS.batch();
    const batch1000 = dbFS.batch();
    const batch1500 = dbFS.batch();
    const batch2000 = dbFS.batch();


    const batchLayoutsSpreadsheets = dbFS.batch();
    // const layoutsSpreadsheetsRef = dbFS.doc("/layoutsSpreadsheets/fromXML");
    // const itemTemplate = {};

    let countBatch = 0;

    Object.keys(collection).sort().forEach((xmlComponent) => {
      Object.keys(collection[xmlComponent].xPath).sort().forEach((rule) => {
        if (rule.length > 3) {
          let ruleName;


          // console.log(collectionX.ref);
          if (rule.includes("_")) {
            ruleName = rule.split("_")[1];
          } else {
            ruleName = rule;
          }


          const ruleRef = dbFS.doc(`/xmlRulesDIAN/${ruleName}`);

          const xPath = (collection[xmlComponent].xPath[rule])
            .replace("/", "¶")
            .replace("/", "¶")
            .replace("/#", "[1]")
            .replace(/\//g, "[1]/")
            .replace("¶", "/")
            .replace("¶", "/") ||false;

          let countArray = collection[xmlComponent].array || false;
          const array = collection[xmlComponent].array || false;
          if (xPath.indexOf(countArray) > 1) {
            // console.log(countArray);
            // console.log(countArray.length + 4);
            countArray = `count(${xPath.slice(0, (xPath.indexOf(countArray) + (countArray.length)) - xPath.length)})`;
            // console.log(countArray);
            // console.log(xPath);
          }

          const dataPath = collection[xmlComponent].dataPath[rule] || false;
          // console.log(dataPath);
          const rootPath = collection[xmlComponent].rootPath || false;
          let sheetPath = false;

          if (collection[xmlComponent].sheetPath) {
            if (collection[xmlComponent].sheetPath[rule]) {
              sheetPath = collection[xmlComponent].sheetPath[rule] || false;
              console.log(sheetPath);
            }
          }
          // sheetPath = collection[xmlComponent].sheetPath[rule] || false;

          const ruleValues = {
            array: array,
            xPath: xPath,
            dataPath: dataPath,
            rootPath: rootPath,
            countArray: countArray,
            sheetPath: sheetPath,
          };


          if (countBatch < 500) {
            batch500.set(ruleRef, ruleValues);
          } else if (countBatch < 1000) {
            batch1000.set(ruleRef, ruleValues);
          } else if (countBatch < 1500) {
            batch1500.set(ruleRef, ruleValues);
          } else if (countBatch < 2000) {
            batch2000.set(ruleRef, ruleValues);
          }


          countBatch++;
        }
      });
    });

    // console.log({countBatch});
    await batch2000.commit();
    await batch1500.commit();
    await batch1000.commit();
    await batch500.commit();
    await batchLayoutsSpreadsheets.commit();
  }


  // console.log(collectionX);
  return {
    response: code.created,
  };
};
// Obtener todos los documentos de la coleección "xmlComponents" en la base de datos firestore

module.exports = {
  setInitRulesDIAN,
};
