 const {code} = require("../../admin/responses");


const mergeInFirestore = async (
  routeX,
  recordX,
  mergeX = true, // OJO: false Elimina el documento.
) => {
  const {dbFS} = require("../../admin");


  await dbFS
    .doc(routeX).set(recordX,
      {
        merge: mergeX,
      })
    .then(() => {
      return true;
    })
    .catch((error) => {
      return error;
    });
};

const waitAndMergeInFirestore = async (
  routeX,
  recordX,
  mergeX = true, // OJO: false Elimina el documento.
  miliSleep = 500,
) => {
  const {dbFS} = require("../../admin");
  const {sleep} = require("../../admin/utils");


  await sleep(miliSleep);
  await dbFS
    .doc(routeX).set(recordX,
      {
        merge: mergeX,
      })
    .then(() => {
      return true;
    })
    .catch((error) => {
      return error;
    });
};


const getOneDocument = async (documentPath) => {
  const {dbFS} = require("../../admin");

  const theDocument = dbFS.doc(documentPath);
  const oneDocument = await theDocument.get();


  if (!oneDocument.exists) {
    return {
      response: code.notFound,
      documentPath: documentPath,
    };
  } else {
    return {
      response: code.ok,
      data: oneDocument.data(),
    };
  }
};

const getDocuments = async (
  collectionX,
  whereX,
) => {
  const {dbFS} = require("../../admin");

  const getCollectionX = dbFS.getCollection(collectionX);
  const allDocumentX = await getCollectionX.where(whereX, "==", true).get();


  if (allDocumentX.empty) {
    // console.log("No matching documents.");
    return;
  }

  allDocumentX.forEach((doc) => {
    // console.log(doc.id, "=>", doc.data());
  });
};

// Obtiene una colección completa de documentos, ordenada alfabeticamente.
const getOneCollection = async (
  collectionPath,
  allSubCollections = false,
) => {
  const {dbFS} = require("../../admin");

  const getCollectionX = await dbFS.collection(collectionPath).get();


  const collectionX = new Promise((resolve, reject) => {
    const collectionValues = {};

    if (getCollectionX.empty) {
      reject(new Error({
        response: code.badRequest,
        getOneCollection: "No existe la colección." + collectionPath,
      }));
    } else {
      getCollectionX.forEach((doc) => {
        collectionValues[doc.id] = doc.data();
      });
    }

    resolve(collectionValues);
  });

  const jsonX = await collectionX;

  const {sortObject} = require("../../admin/utils");
  const sortedJsonX = sortObject(jsonX);

  if (allSubCollections) {
    return {
      response: code.ok,
      data: sortedJsonX};
  } else {
    return {
      response: code.ok,
      data: sortedJsonX};
  }
};

module.exports = {
  getDocuments,
  getOneDocument,
  getOneCollection,
  mergeInFirestore,
  waitAndMergeInFirestore,
};
