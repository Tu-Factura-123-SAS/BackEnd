"option explicit";
const deepmerge = require("deepmerge");


/*
    1-10-2021
    by Jovanny Medina Cifuentes
    +573004080808
    info@limeyer.com

    La estructura viene de menos a más.

    setCufeAndJson => Se genera en documentFast
    Paso 1: Genero CUFE. OK
    Paso 2: Genero JSON de acuerdo a la templateXML. OK

    *************************************************
    getXML
    Paso 3: Obtengo XML sin firmar. - Pendientes array.
    Paso 3a: Almaceno XML sin firmar.

    *************************************************

    Paso 4: Firmo XML

    ************************************************

    Paso 5: Almaceno XML firmado en Storage XML. REFACTORIZAR en el Drive.

    Paso 6: comprimo XML + PDF, almaceno ZIP y almaceno URI en Firestore.

*/

// eslint-disable-next-line require-jsdoc


const getXML = async (
  json,
  prettyPrint = false,
) => {
  const {code} = require("../../../admin/responses");
  const {create} = require("xmlbuilder2");


  try {
    // Paso 3: Genero XML sin firmar.
    // const json = await getThisDocument(jsonPath, "json");

    const doc = create(
      {
        version: "1.0",
        encoding: "UTF-8",
      },
      json);

    const xml = doc.end({
      keepNullAttributes: true,
      prettyPrint: prettyPrint,
    });


    return xml;
  } catch (error) {
    return {
      error: error,
      response: code.badRequest,
    };
  }
};


const componentJSONbackend = async (
  componentPath,
  documentPath,
  dataByItem = {},
  dataBytemplate = {},
  arrayOne = 0,
  arrayTwo = 0,
  arrayThree = 0,
  get = false,
) => {
  const {getThisDocument} = require("../../../admin/utils");
  const {code} = require("../../../admin/responses");

  const jsonData = {};
  let nodeArray = false;
  // let subNodeArray = false;
  // let infraNodeArray = false;
  jsonData["losses"] = 0;
  jsonData["errores"] = {};
  const parts = [];
  const logX = [];
  let pathException = false;
  let valueException = false;

  logX["rule"] = [];
  logX["xPath"] = [];
  logX["dataPath"] = [];
  logX["value"] = [];
  logX["type"] = [];
  logX["out"] = [];
  try {
    // Inicializamos el payload
    let mergeJSON = {};


    // OJO: HARDCODE --> AUTOMATIZAR
    // https://github.com/JovannyCO/FacturaDIAN-CloudFunctions/issues/74
    const tenant = {
      DV: "0",
      UBL21: true,
      ID: "901318433",
      TechKey: "fc8eac422eba16e22ffd8c6f94b3f40a6e38162c",
      Software_PIN: "75315",
    };


    // Se cambia el componente XML o nodo en caso de exception
    // let component = await getThisDocument(componentPath, "component");
    let component = dataBytemplate;

    // const rootsData = await getThisDocument(documentPath, "rootsData");

    const xmlPath = {};

    const tmpRoot = documentPath.split("/")[2].split("_");
    // tmpRoot = (tmpRoot[2]).split("_");


    const route = `/entities/${tmpRoot[0]}/xml/${tmpRoot[1]}_${tmpRoot[2]}`;


    let data = false;
    xmlPath["node"] = (componentPath.split("/")[2]).split("_")[0];

    if (component.rootPath) {
      // console.table({component});
      component.rootPath != "tenant" ?
        // eslint-disable-next-line no-unused-vars
        data = dataByItem[component.rootPath] :
        // eslint-disable-next-line no-unused-vars
        data = tenant;


      // INICIO exception
      pathException = component.exception || false;
      if (component.exception) {
        const exceptionText = `data['${component.exception
          .replace(/\[/g, "'§[")
          .replace(/\]/g, "]['")
          .replace(/§/g, "]")
          .replace(/\./g, "']['")
          .replace("arrayOne", arrayOne)
          .replace("arrayTwo", arrayTwo)
          .replace("arrayThree", arrayThree)}']`;

        // console.info(component.exception, exceptionText, valueException);

        valueException = eval(exceptionText) || false;

        // console.info("¶ 159 ¶", component.exception, exceptionText, valueException);
      }

      if (pathException && valueException) {
        if (valueException === "EMPTY") {
          return Promise.resolve({response: code.noContent});
        }
        xmlPath["data"] = (componentPath.split("/")[2]).split("_")[1] || "";
        xmlPath["template"] = (componentPath.split("/")[2]).split("_")[2] || "";
        xmlPath["exception"] = valueException;
        xmlPath["newComponentPath"] = `${xmlPath.node}_${xmlPath.data}_${xmlPath.template}_${xmlPath.exception}`;
        if (xmlPath.newComponentPath.endsWith("___")) xmlPath.newComponentPath = xmlPath.newComponentPath.slice(0, -3);
        if (xmlPath.newComponentPath.endsWith("__")) xmlPath.newComponentPath = xmlPath.newComponentPath.slice(0, -2);
        if (xmlPath.newComponentPath.endsWith("_")) xmlPath.newComponentPath = xmlPath.newComponentPath.slice(0, -1);


        xmlPath["newComponentPath"] = `/${componentPath.split("/")[1]}/${xmlPath.newComponentPath}`;

        // console.info("EXCEPTION", xmlPath.newComponentPath);
        component = await getThisDocument(xmlPath.newComponentPath, "component");
        //        xmlPath["node"] = ((xmlPath.newComponentPath).split("/")[2]).split("_")[0];
      }
      // console.info("ORIGINAL", componentPath);
      // console.table({xmlPath});
      // FIN exception


      Object.keys(component.xPath).sort().forEach((key, keyIndex) => {
        logX["xPath"][keyIndex] = (component.xPath[key]);
        logX["rule"][keyIndex] = key;
        parts["base"] = component.dataPath[key];
        // console.table(parts["base"]);
        // console.table(key);
        nodeArray = {};
        // subNodeArray = {};
        // infraNodeArray = {};

        nodeArray["arrayX"] = [component.array];


        if (parts["base"].includes("§")) {
          if (component.array === undefined) console.log("🔥 Se requiere declarar array: ", componentPath, parts.part);
          /*
            Esta es la manera de encontrar los array en el dataPath y
            obtener el nombre del nodo, para luego procesarlo.

            Se detecta el nombre del array y se remplaza el nombre del nodo
            por el índice actual del array.
          */

          parts["part"] = parts["base"].split("§");
          parts["baseOk"] = "";
          parts["arrayName"] = {};

          // console.log(parts["base"], component.array);
          // nodeArray[component.array] = {};


          if (parts.part[5]) {
            /* console.log("▲▲▲▲▲", parts.part[5]);
            console.log("▲▲▲▲▲", parts.part);
            console.log("▲▲▲▲▲", component.array);
            console.log("▲", `(data.${parts.part[0]}).length`);
            console.log("▲", eval(`(data.${parts.part[0]}).length`));
            console.log("▲▲▲", `(data.${parts.part[0]}[${arrayOne}].${parts.part[2]}).length`);
            console.log("▲▲▲", eval(`(data.${parts.part[0]}[${arrayOne}].${parts.part[2]}).length`));
            console.log("▲▲▲▲▲", `(data.${parts.part[0]}[${arrayOne}].${parts.part[2]}[${arrayTwo}].${parts.part[4]}).length`);
            console.log("▲▲▲▲▲", eval(`(data.${parts.part[0]}[${arrayOne}].${parts.part[2]}[${arrayTwo}].${parts.part[4]}).length`)); */

            nodeArray[parts.part[5]] = {};
            if (parts.part[5] === component.array) {
              nodeArray[parts.part[5]][component.array] = true;
            } else {
              nodeArray[parts.part[5]][component.array] = false;
            }

            nodeArray[component.array]["quantityItemsDataPathArrayThree"] = `(data.${parts.part[0]}[${arrayOne}].${parts.part[2]}[${arrayTwo}].${parts.part[4]}).length`;
            nodeArray["quantityItemsArrayThree"] = eval(nodeArray[component.array].quantityItemsDataPathArrayThree);
            nodeArray[component.array]["arrayOne"] = arrayOne;
            nodeArray[component.array]["arrayTwo"] = arrayTwo;
            nodeArray[component.array]["arrayThree"] = arrayThree;
            nodeArray["current"] = arrayThree;
          } else if (parts.part[3]) {
            nodeArray[parts.part[3]] = {};
            if (parts.part[3] === component.array) {
              nodeArray[parts.part[3]][component.array] = true;
            } else {
              nodeArray[parts.part[3]][component.array] = false;
            }

            nodeArray[component.array]["quantityItemsDataPathArrayTwo"] = `(data.${parts.part[0]}[${arrayOne}].${parts.part[2]}).length`;
            nodeArray["quantityItemsArrayTwo"] = eval(nodeArray[component.array].quantityItemsDataPathArrayTwo);
            // console.log("¶¶¶¶¶", nodeArray["quantityItemsArrayTwo"], nodeArray[component.array]["quantityItemsDataPathArrayTwo"], eval(`typeof(data.${parts.part[0]}[${arrayOne}].${parts.part[2]})`));
            nodeArray[component.array]["arrayOne"] = arrayOne;
            nodeArray[component.array]["arrayTwo"] = arrayTwo;
            nodeArray[component.array]["arrayThree"] = arrayThree;
            nodeArray["current"] = arrayTwo;
          } else if (parts.part[1]) {
            nodeArray[parts.part[1]] = {};
            if (parts.part[1] === component.array) {
              nodeArray[parts.part[1]][component.array] = true;
            } else {
              nodeArray[parts.part[1]][component.array] = false;
            }

            // console.log(`(data.${parts.part[0]}).length` || "ZZZZ", eval(`(data.${parts.part[0]}).length`) || "XXXX", eval(`data.${parts.part[0]}.quantityItems`), "▲ arrayOne", arrayOne, "▲▲ arrayTwo", arrayTwo, "▲▲▲ arrayThree", arrayThree);
            // console.log(component.array, {component});
            nodeArray[component.array]["quantityItemsDataPath"] = `(data.${parts.part[0]}).length`;
            nodeArray[component.array]["quantityItems"] = eval(nodeArray[component.array].quantityItemsDataPath) || 0;
            nodeArray[component.array]["arrayOne"] = arrayOne;
            nodeArray[component.array]["arrayTwo"] = arrayTwo;
            nodeArray[component.array]["arrayThree"] = arrayThree;
            nodeArray["current"] = arrayOne;
          }


          Object.keys(parts["part"]).sort().forEach((x, y) => {
            if (x % 2) {
              // console.table(x + " impar");
              parts["arrayName"][y] = parts["part"][y - 1];
              parts[key] = {};
              parts[key][y] = {
                position: y,
                name: parts["part"][y],
                arrayPath: parts["part"][y - 1],
              };
              switch (y) {
              case 1:
                parts["baseOk"] = parts["baseOk"] + `${arrayOne}.`;
                break;


              case 3:
                parts["baseOk"] = parts["baseOk"] + `${arrayTwo}.`;
                break;


              case 5:
                parts["baseOk"] = parts["baseOk"] + `${arrayThree}.`;
                break;
              default:
                break;
              }


              // console.table(nodeArray);
              // nodeArray["arrayOne"]["currentItem"] = parts.baseOk + "quantityItems";
            } else {
              // console.table(x + " par");
              parts["baseOk"] = parts["baseOk"] + `${parts["part"][x]}.`;
              // console.table(parts["baseOk"]);
            }
          });
        } else {
          parts["baseOk"] = parts["base"];
        }

        // console.log("¶====¶", parts.baseOk);

        // console.table(parts);
        // console.table(parts["baseOk"]);
        if (parts["baseOk"][parts["baseOk"].length - 1] === ".") {
          parts["baseOk"] = parts["baseOk"].slice(0, -1);
        }
        // console.table(parts["baseOk"]);
        parts["baseOk"] = parts["baseOk"].split(".");
        // console.table(parts["baseOk"]);

        let nodoValues = "";
        parts["baseOk"].forEach((nodo) => {
          if (isNaN(nodo)) {
            nodoValues = nodoValues += `["${nodo}"]`;
          } else {
            nodoValues = nodoValues += `[${nodo}]`;
          }
        });

        try {
          jsonData["lastDataPath"] = nodoValues;
          jsonData["errorCatch"] = key;

          logX["dataPath"][keyIndex] = nodoValues;
          nodoValues = eval(`data${nodoValues}`);
          // console.table(nodoValues);
          logX["value"][keyIndex] = nodoValues;
          logX["type"][keyIndex] = typeof (nodoValues);
          if (typeof (nodoValues) === "number") {
            nodoValues = nodoValues.toFixed(2);
          }
          logX["out"][keyIndex] = nodoValues;
        } catch (error) {
          jsonData["errores"]["eval"] = error;
        }
        // console.table(nodoValues);

        if (nodoValues === undefined) {
          nodoValues = ` ¶¶_${key} - ${component.dataPath[key]}`;
          const tmpTemplate = componentPath.split("/");

          jsonData["losses"] = jsonData["losses"] + 1;
          jsonData["error"] = {
            [key + " " + tmpTemplate[2]]: {
              data: component.rootPath,
              xPath: component.xPath[key],
              dataPath: component.dataPath[key],
            },
          };
          jsonData["errores"] = deepmerge(jsonData["errores"], jsonData["error"]);
        }


        let jsonTemporalTrue = {};
        jsonTemporalTrue = ((component.xPath[key]).replace("/", "{\"")).replace(/\//g, "\": {\"");
        jsonTemporalTrue = jsonTemporalTrue + `": "${nodoValues}"`;
        const close = jsonTemporalTrue.split("{").length - 1;
        const keyClose = "}";
        // console.log({nodoValues}); // OPORTUNIDAD: Devolver momo error este valor.
        jsonTemporalTrue = JSON.parse(jsonTemporalTrue + keyClose.repeat(close));


        mergeJSON = deepmerge(mergeJSON, jsonTemporalTrue);
      });
    } else {
      Object.keys(component.xPath).sort().forEach((key) => {
        // A partir del xPath se crea el JSON (como texto) y se asigna el valor del dataPath.
        let jsonTemporalFalse = {};

        jsonTemporalFalse = ((component.xPath[key]).replace("/", "{\"")).replace(/\//g, "\": {\"");
        jsonTemporalFalse = jsonTemporalFalse + `": "${component.dataPath[key]}"`;
        const close = jsonTemporalFalse.split("{").length - 1;
        const keyClose = "}";
        jsonTemporalFalse = JSON.parse(jsonTemporalFalse + keyClose.repeat(close));
        // console.log(">>>>> ", jsonTemporalFalse);

        mergeJSON = deepmerge(mergeJSON, jsonTemporalFalse);
      });
    }

    /* mergeJSON viene listo para deepmerge en el root como nodo único.
    Se debe modificar en caso de:

    ¿El contenido del nodo se repite en el XML? OK
      En este caso, simplemente se reasigna el contenido del nodo como array.

      ¿Se repite algún nodo hijo en el XML?
        Este desafío se ejecuta de manera recursiva.

    */


    // console.log(jsonData.errores);
    if (Object.keys((jsonData["errores"])).length != 0) {
      const {timeStampFirestoreX, incrementFireStoreX} = require("../../../admin");
      const {mergeInFirestore} = require("../../../database/firestore");
      // console.log(`/entities/${tmpRoot[0]}/xml/${tmpRoot[1]}_${tmpRoot[2]}_lostData`);


      await mergeInFirestore(
        `/exceptions/${tmpRoot[0]}/componentJSONbackend/${tmpRoot[1]}_${tmpRoot[2]}`,
        {
          TTL: timeStampFirestoreX,
          losses: incrementFireStoreX(jsonData.losses),
          lostData: jsonData.errores,
        }, true,
      );
    }


    // AQUÍ: Convertir nodos en arrays

    // El nodo padre se itera desde afuera.
    // Para el nodo hijo, se verifica primero si contiene nodo nieto
    // En caso de contener nodo nieto, primero se extraen todos los nietos
    let innerJSON = {};
    if (component.arrayGrandChildNode && component.arrayGrandChildNode !== true) {
      let quantityItemsArrayThree = 0;
      const {getThisDocument} = require("../../../admin/utils");

      const dataBytemplateArrayThree = await getThisDocument(component.arrayGrandChildNode, "dataBytemplateArrayThree");
      const keysArrayThree = Object.keys(dataBytemplateArrayThree.dataPath);

      if (dataBytemplateArrayThree.dataPath[keysArrayThree[0]]) {
        // Consultamos cuantos arrays se deben iterar. // Por este motivo, no se permiten múltiples niveles en el ARRAY 3
        // console.log(dataBytemplateArrayThree.dataPath[keysArrayThree[0]]);

        const partArrayThree = (dataBytemplateArrayThree.dataPath[keysArrayThree[0]]).split("§");
        // console.log( `(data.${partArrayThree[0]}[${arrayOne}].${partArrayThree[2]}[${arrayTwo}].${partArrayThree[4]}).length`);
        quantityItemsArrayThree = eval(`(data.${partArrayThree[0]}[${arrayOne}].${partArrayThree[2]}[${arrayTwo}].${partArrayThree[4]}).length`) || 0;


        let counterArrayGrandChildNode = 0;
        while (quantityItemsArrayThree > counterArrayGrandChildNode) {
          const jsonChildNode = await componentJSONbackend(
            component.arrayGrandChildNode, // documentPath
            documentPath,
            dataByItem,
            dataBytemplateArrayThree,
            arrayOne,
            arrayTwo,
            counterArrayGrandChildNode,
            false);
          // console.info("▲▲ quantityItemsArrayThree", quantityItemsArrayThree, "▲▲ current", counterArrayGrandChildNode);
          // console.log(JSON.stringify(jsonChildNode.json));
          innerJSON = deepmerge(innerJSON, jsonChildNode.json);
          // console.log({innerJSON});
          counterArrayGrandChildNode++;
        }
      }
    }


    const arrayComponent = component.array;
    const iteraNode = new Promise((resolve)=>{
      Object.keys(mergeJSON).forEach((root) => {
        Object.keys(mergeJSON[root]).forEach((node) => {
          Object.keys(mergeJSON[root][node]).forEach((childNode) => {
            if (arrayComponent === childNode) {
              // console.table(nodeArray);

              const childNodeContent = mergeJSON[root][node][childNode];
              if (childNodeContent.length) {
                mergeJSON[root][node][childNode].push(childNodeContent);
              } else {
                // console.log("A innerJSON", JSON.stringify(innerJSON));
                // console.log("B mergeJSON", JSON.stringify(mergeJSON));
                mergeJSON = deepmerge(mergeJSON, innerJSON);
                const childNodeContent2 = mergeJSON[root][node][childNode];


                // Ejecutamos los otros arraysTwo antes de concatenar


                mergeJSON[root][node][childNode] = [childNodeContent2];
                // console.log("C mergeJSON", JSON.stringify(mergeJSON));
              }

              resolve(childNode);
            }


            Object.keys(mergeJSON[root][node][childNode]).forEach((grandChildNode) => {
              // console.log(grandChildNodeContent);

              // if (arrayComponent === grandChildNode) return resolve(grandChildNode);
              if (arrayComponent === grandChildNode) {
                const grandChildNodeContent = mergeJSON[root][node][childNode][grandChildNode];
                if (grandChildNodeContent.length) {
                  mergeJSON[root][node][childNode][grandChildNode].push(grandChildNodeContent);
                } else {
                  mergeJSON[root][node][childNode][grandChildNode] = [grandChildNodeContent];
                }


                resolve(grandChildNode);
              }


              /* Object.keys(mergeJSON[root][node][childNode][grandChildNode]).forEach((subGrandChildNode) => {
                const subGrandChildNodeContent = mergeJSON[root][node][childNode][grandChildNode][subGrandChildNode];
                if (arrayComponent === subGrandChildNode) return resolve(subGrandChildNodeContent);
                // if (arrayComponent === subGrandChildNode) mergeJSON[root][node][childNode][grandChildNode][subGrandChildNode] = [subGrandChildNodeContent];
              }); */
            });
          });
        });
      });
      resolve(false);
    });

    // RUN
    let callArrayThree = false;
    if (component.arrayGrandChildNode) callArrayThree = await iteraNode;


    if (component.arrayChildNode) {
      // console.info("▲▲ quantityItemsArrayTwo", nodeArray.quantityItemsArrayTwo, "▲ arrayOne", arrayOne, "▲▲ arrayTwo", arrayTwo, , "▲▲▲ arrayThree", arrayThree));
      if (nodeArray.quantityItemsArrayTwo > 1 && arrayTwo === 0) {
        let counterArrayChildNode = 1;
        while (nodeArray.quantityItemsArrayTwo > counterArrayChildNode) {
          // console.info("▲▲ quantityItemsArrayTwo", nodeArray.quantityItemsArrayTwo, "▲▲ current", nodeArray.current);
          const jsonChildNode = await componentJSONbackend(
            componentPath,
            documentPath,
            dataByItem,
            dataBytemplate,
            arrayOne,
            counterArrayChildNode,
            arrayThree,
            false);

          // console.log("AA innerJSON", JSON.stringify(jsonChildNode.json));
          // console.log("BB mergeJSON", JSON.stringify(mergeJSON));
          mergeJSON = deepmerge(mergeJSON, jsonChildNode.json);
          // console.log("CC mergeJSON", JSON.stringify(mergeJSON));
          // console.info("innerJSON ▲▲", JSON.stringify(jsonChildNode.json[root][node][childNode]));
          // INI: ejecutar arrayGrandChildNode
          // FIN: ejecutar arrayGrandChildNode
          // innerJSON[root][node][childNode].push(jsonChildNode.json[root][node][childNode]);
          // console.info("▲▲ innerJSON ▲▲", JSON.stringify(innerJSON));


          counterArrayChildNode++;
        }
      }
    }


    // if (callArrayThree) console.info(callArrayThree);
    // console.log(`${componentPath} ¶`, JSON.stringify(mergeJSON));
    if (get) {
      return Promise.resolve({
        response: code.ok,
        route: route,
        patron: xmlPath.node,
        json: JSON.stringify(mergeJSON),
        error: jsonData["errores"],
        nodeArray: nodeArray || false,
        callArrayThree: callArrayThree,
        // subNodeArray: subNodeArray || false,
        // infraNodeArray: infraNodeArray || false,

      });
    } else {
      return Promise.resolve({
        response: code.ok,
        route: route,
        patron: xmlPath.node,
        json: mergeJSON,
        error: jsonData["errores"],
        nodeArray: nodeArray || false,
        callArrayThree: callArrayThree,
        // subNodeArray: subNodeArray || false,
        // infraNodeArray: infraNodeArray || false,
      });
    }
  } catch (error) {
    console.error(error.message);
    if (error) {
      jsonData["errorCatch"] = error.name + ": " + error.message;
    }
    return Promise.reject(new Error(JSON.stringify({
      response: code.badRequest,
      pathException: pathException,
      componentPath: componentPath,
      array: `[${arrayOne}, ${arrayTwo}, ${arrayThree}]`,
      lastDataPath: jsonData["lastDataPath"],
      errores: jsonData["errores"],
      error: jsonData["errorCatch"],
    })));
  }
};

// eslint-disable-next-line require-jsdoc
async function getDataFromManyPaths(onlyPaths) {
  const {getThisDocument} = require("../../../admin/utils");
  const valuesData = {};
  let dataKeys = Object.keys(onlyPaths).sort();

  dataKeys = dataKeys.filter((key) => {
    return key != "undefined";
  });

  for (const dataKey of dataKeys) {
    valuesData[dataKey] = await getThisDocument(onlyPaths[dataKey], `valuesData.${dataKey}`);
  }

  return Promise.resolve(valuesData);
}


const setTemplateXML = async (
  templatePath,
  documentData,
) => {
  const {code} = require("../../../admin/responses");
  const response = {response: code.badRequest};
  const {getThisDocument, getItemIdValues} = require("../../../admin/utils");

  const {dbFS} = require("../../../admin");
  const batch = dbFS.batch();
  const {cryptoX} = require("../../cryptoX");

  const json = {};
  let dataByItem = {};
  let xmlNode = {};
  const xmlArrays = {};
  // let xmlArrays2 = {};
  // const currentArray = {}; // currentArray["document"] = [0,0]
  const itemValues = getItemIdValues(documentData.split("/")[2]);
  dataByItem.temporalOrigin = await getThisDocument(itemValues.originRef, "dataByItem.temporalOrigin");
  // eslint-disable-next-line no-unused-vars
  const dataOrigin = dataByItem.temporalOrigin;
  // INIT only paths
  const onlyPaths = dataByItem.temporalOrigin[" b_xml_parse"];
  delete onlyPaths[" task"];
  delete onlyPaths.uid;

  dataByItem = await getDataFromManyPaths(onlyPaths);
  // console.table(Object.keys(dataByItem));
  // console.info(onlyPaths);
  // END only paths

  let tmpRoot = documentData.split("/");
  tmpRoot = (tmpRoot[2]).split("_");

  json["json"] = `/entities/${tmpRoot[0]}/xml/${tmpRoot[1]}_${tmpRoot[2]}`;


  const jsonError = dbFS.
    doc(`/entities/${tmpRoot[0]}/xml/${tmpRoot[1]}_${tmpRoot[2]}_lostData`);

  try {
    batch.delete(jsonError);
    await batch.commit();

    // console.log(templatePath);
    const templates = await getThisDocument(templatePath, "getThisDocument.templates");

    const dataBytemplate = await getDataFromManyPaths(templates);

    const components = Object.keys(templates).sort();
    // console.info(templates);


    // ESCRITURA ÚNICA - obtener JSON, luego ordenarlo
    let jsonBase = {};
    const jsonFusion = {};
    let route = "";
    let innerXmlNodeRoot = {};

    // FOR OF conserva el orden, pero es muy lento.
    for (const component of components) {
      let arrayOne = 0;
      /* console.log(currentArray[dataBytemplate[component]]);
      if (currentArray[dataBytemplate[component]]) {
        currentArray[dataBytemplate[component].rootPath] = {};
        currentArray[dataBytemplate[component].rootPath] = {arrayOne: 0, arrayTwo: 0, arrayThree: 0};
      } */
      // console.info(dataByItem[dataBytemplate[component].rootPath]);
      // console.info(dataByItem.document);

      // Determinar longitud del array para controlar el buche
      const keysArrayOne = Object.keys(dataBytemplate[component].dataPath);
      let partArrayOne = false;
      let quantityItemsArrayOne = 1;
      // console.log(dataBytemplate[component].dataPath[keysArrayOne[0]]);
      if (dataBytemplate[component].arrayNode) {
        partArrayOne = (dataBytemplate[component].dataPath[keysArrayOne[0]].split("§")) || false;
        quantityItemsArrayOne = eval(`(dataOrigin.${partArrayOne[0]}).length`) || 1;
      }


      // console.log("isObjectWhitData", (Object.keys(dataBytemplate[component].arrayNode)).length || false);
      // const isObjectWhitData = (Object.keys(dataBytemplate[component].arrayNode)).length || false;


      if (
        partArrayOne &&
        dataBytemplate[component].arrayNode &&
        dataBytemplate[component].arrayNode !== true
      ) {
        // Es un nodo que se repite CON nodos hijo.
        const arrayDataBytemplate = await getDataFromManyPaths(dataBytemplate[component].arrayNode);
        let innerArrayNode = {};


        while (quantityItemsArrayOne > arrayOne) {
          innerXmlNodeRoot = await componentJSONbackend(
            templates[component], // Path plantilla XML actual
            documentData, // Path a documento/item actual
            dataByItem, // Todos los datos de los documentos, para minimizar lecturas
            dataBytemplate[component], // Plantilla XML
            arrayOne, // Primer array
            0, // Segundo array
            0, // tercer array
          );

          if (innerXmlNodeRoot.response === code.ok) {
            const arrayComponents = Object.keys(dataBytemplate[component].arrayNode).sort();
            for (const arrayComponent of arrayComponents) {
            // console.log(arrayComponent);

              const newExtraArray = await componentJSONbackend(
                dataBytemplate[component].arrayNode[arrayComponent], // templates[arrayComponent], Path plantilla XML actual
                documentData, // Path a documento/item actual
                dataByItem, // Todos los datos de los documentos, para minimizar lecturas
                arrayDataBytemplate[arrayComponent], // Plantilla XML
                arrayOne, // Primer array
                0, // Segundo array
                0, // tercer array
              );

              // console.log(dataBytemplate[component].arrayNode);
              // console.log({keysArrayOne});
              // console.log({partArrayOne});
              // console.log({quantityItemsArrayOne});
              // console.log("B ⏭️⏭️⏭️ newExtraArray ¶", JSON.stringify(newExtraArray.json));
              // innerXmlNodeRoot = deepmerge(innerXmlNodeRoot, newExtraArray);
              if (newExtraArray.response === code.ok) {
              //
              /*  */


                /* (arrayOne === 0) ?
                innerArrayNode = deepmerge(innerArrayNode, newExtraArray) : */
                innerXmlNodeRoot.json = deepmerge(innerXmlNodeRoot.json, newExtraArray.json);
              } /* else {
              console.error("Error", templates[component], documentData);
            } */
            // }
            }

            Object.keys(innerXmlNodeRoot.json).forEach((root) => {
              Object.keys(innerXmlNodeRoot.json[root]).forEach((node) => {
                const nodeContent = innerXmlNodeRoot.json[root][node];
                // Se convierte en array los valores a nivel de nodo.
                if (innerXmlNodeRoot.json[root][node].length) {
                  innerXmlNodeRoot.json[root][node].push(nodeContent);
                } else {
                  innerXmlNodeRoot.json[root][node] = [nodeContent];
                }
              });
            });
            // console.log("C ➕ innerXmlNodeRoot ¶", arrayOne, JSON.stringify(innerXmlNodeRoot.json));


            (arrayOne === 0) ?
              innerArrayNode = deepmerge(innerArrayNode, innerXmlNodeRoot) :
              innerArrayNode.json = deepmerge(innerArrayNode.json, innerXmlNodeRoot.json);
          } else if (innerXmlNodeRoot.response === code.noContent) {
            // No hacer nada
            // console.table({innerXmlNodeRoot});
          }


          // console.log("A ✔️ innerXmlNodeRoot", arrayOne, JSON.stringify(innerXmlNodeRoot.json));


          arrayOne++;
        }
        // console.log("E innerXmlNodeRoot ¶", JSON.stringify(innerXmlNodeRoot.json));
        // console.log("F xmlNode ¶", JSON.stringify(xmlNode.json));

        xmlNode = innerArrayNode;
        // console.log("G xmlNode ¶", JSON.stringify(xmlNode.json));
      } else if (dataBytemplate[component].arrayNode === true) {
        // console.info("arrayNode", typeof(dataBytemplate[component].arrayNode), " Value: ", dataBytemplate[component].arrayNode);
        // Es un nodo que se repite, pero no tiene nodos hijo.
        let arrayOneLevel2 = 0;
        let innerArrayNode = {};


        // Paso 1: extraer los valores para CADA arrayOneLevel2
        while (quantityItemsArrayOne > arrayOneLevel2) {
          const newArrayNode = await componentJSONbackend(
            templates[component], // Path plantilla XML actual
            documentData, // Path a documento/item actual
            dataByItem, // Todos los datos de los documentos, para minimizar lecturas
            dataBytemplate[component], // Plantilla XML
            arrayOneLevel2, // Primer array
            0, // Segundo array
            0, // tercer array
          );
          if (newArrayNode.response === code.ok) {
            Object.keys(newArrayNode.json).forEach((root) => {
              Object.keys(newArrayNode.json[root]).forEach((node) => {
                const nodeContent = newArrayNode.json[root][node];
                // Se convierte en array los valores a nivel de nodo.
                if (newArrayNode.json[root][node].length) {
                  newArrayNode.json[root][node].push(nodeContent);
                } else {
                  newArrayNode.json[root][node] = [nodeContent];
                }
              });
            });


            (arrayOneLevel2 === 0) ?
              innerArrayNode = deepmerge(innerArrayNode, newArrayNode) :
              innerArrayNode.json = deepmerge(innerArrayNode.json, newArrayNode.json);

            // console.log("CCC innerArrayNode ¶", JSON.stringify(innerArrayNode.json));
          } /* else {
            console.error("Error", templates[component], documentData);
          } */


          arrayOneLevel2++;
        }


        xmlNode = innerArrayNode;
        // console.log("DDDD xmlNode ¶", JSON.stringify(xmlNode.json));


        // console.log("E innerXmlNodeRoot ¶", JSON.stringify(innerXmlNodeRoot));
      } else {
        // Es un nodo DIRECTO que no se repite
        xmlNode = await componentJSONbackend(
          templates[component], // Path plantilla XML actual
          documentData, // Path a documento/item actual
          dataByItem, // Todos los datos de los documentos, para minimizar lecturas
          dataBytemplate[component], // Plantilla XML
          0, // Primer array
          0, // Segundo array
          0, // tercer array
        );
      }


      if (xmlNode.response === code.ok) {
        // console.info(xmlNode.response, xmlNode.patron);
        if (jsonFusion[xmlNode.patron] === undefined) {
          jsonFusion[xmlNode.patron] = {};
        }

        jsonFusion[xmlNode.patron] = await deepmerge(jsonFusion[xmlNode.patron], xmlNode.json);
        route = xmlNode.route;


        if (xmlNode.nodeArray[xmlNode.nodeArray.arrayX]) {
          // console.table(xmlNode.nodeArray[xmlNode.nodeArray.arrayX]);
          // xmlArrays = {};
          xmlArrays[xmlNode.nodeArray.arrayX] = {};
          xmlArrays[xmlNode.nodeArray.arrayX] = xmlNode.nodeArray[xmlNode.nodeArray.arrayX];
          // xmlArrays[xmlNode.nodeArray.arrayX]["templatesComponent"] = templates[component];
          // xmlArrays[xmlNode.nodeArray.arrayX]["documentData"] = documentData;
          // xmlArrays[xmlNode.nodeArray.arrayX]["dataByItem"] = dataByItem;
          //           xmlArrays[xmlNode.nodeArray.arrayX]["dataBytemplateComponent"] = dataBytemplate[component];
          // console.table(xmlArrays);
        }


        //
      } else if (xmlNode.response === code.noContent) {
        // No hace nada porque el nodo es EMPTY
      } else {
        new Error("ERROR", templates[component]);
      }
    }


    const nodes = Object.keys(jsonFusion).sort();


    // console.table(jsonFusion);


    for (const node of nodes) {
    // console.log("§§§ jsonBase, jsonFusion[node]", node);
      jsonBase = await deepmerge(jsonBase, jsonFusion[node]);
    }


    // console.table(xmlArrays);


    // console.info(jsonBase);

    const xml = await getXML(jsonBase, true);
    // base64
    const base64 = cryptoX("base64", xml);


    // INICIO PARA BORRAR DESPUÉS DE QUE FIRME CORRECTAMENTE
    const {
      mergeInFirestore,
    } = require("../../../database/firestore");


    // console.log(base64);

    await mergeInFirestore(route, {
      signed: false,
      unSigned: xml,
      unSignedLength: xml.length,
      json: JSON.stringify(jsonBase),
      jsonLength: (JSON.stringify(jsonBase)).length,
      base64: base64.hash,
      base64Length: base64.hash.length,
    }, false);


    // console.log(xml);
    // console.log(jsonBase)

    // FIN  PARA BORRAR DESPUÉS DE QUE FIRME CORRECTAMENTE

    return Promise.resolve({
      response: code.created,
      base64: base64.hash,
    });
    /* return {
      response: code.created,
      base64: base64.hash,
    }; */
  } catch (error) {
    // console.log("NAME" + error.name, "MSJ" + error.message);
    return Promise.reject(new Error(JSON.stringify({
      error: JSON.parse(error.message),
      response: response,
      warnings: {
        componentPath: templatePath,
        documentData: documentData,
      },
    })));
  }
};

module.exports = {
  getXML,
  // upLoadXML,
  setTemplateXML,
  // cufeJsonXML,
  // componentJSON,
  // setCufeAndJson,
  componentJSONbackend,
  getDataFromManyPaths,
};
