/**
 * @developer Jovanny Medina Cifuentes
 * @contact github@jovanny.co  573004080808
 * @see {@link https://github.com/JovannyCO}
 * @version 0.0.1
 * @date 2023-06-24
 * @description Este archivo contiene una función que se ejecuta al
 * escribir ítems en Firestore. La función realiza acciones dependiendo de
 * si se han agregado o eliminado vistas en páginas de destino.
 * @env production Firebase Functions
 * @module functions/triggers/items/onWrite
 * @language JavaScript
 * @testing_framework jest
 */

// Importaciones necesarias
const {dbFS, addArray} = require("../../admin");
const handleRemovedLandingPages = require("./handleRemoved");

/**
 * Construye y retorna un objeto que representa una página de destino.
 *
 * @param {string} itemId - Identificador único del ítem.
 * @param {Object} document - Datos completos del ítem.
 * @param {string} landingPage - URL de la página de destino.
 * @return {Object} Representación estructurada de una página de destino.
 */
function createLandingPagesObject(itemId, document, landingPage) {
  return {
    order: addArray(itemId),
    items: {[itemId]: document},
    param: landingPage,
  };
}

/**
 * Procesa y almacena las páginas de destino agregadas.
 *
 * @param {Object} document - Documento con información del ítem.
 * @param {string} alliance - Identificador de la alianza.
 * @param {string} allianceBranchOffice - Identificador de la sucursal de la alianza.
 * @param {string} appCollection - Nombre de la colección en la aplicación.
 * @param {string} billerUnderscoreBranchOffice - Identificador de la oficina de facturación.
 * @param {string} itemId - Identificador único del ítem.
 * @param {Object} batch - Instancia para operaciones por lotes.
 */
async function processAddedLandingPages(document,
  alliance,
  allianceBranchOffice,
  appCollection,
  billerUnderscoreBranchOffice,
  itemId,
  batch,
) {
  document.landingPages.forEach((landingPage) => {
    const [, , , view] = landingPage.split("/");
    const path = `/entities/${alliance}/branchOffices/${allianceBranchOffice}/${appCollection}/${billerUnderscoreBranchOffice}/views/${view}`;

    const batchRef = dbFS.doc(path);
    const landingPagesObject = createLandingPagesObject(itemId, document, landingPage);

    batch.set(batchRef, landingPagesObject, {merge: true});
  });

  await batch.commit();
}

/**
 * Función para manejar escritura de documentos en Firestore.
 *
 * @param {Object} change - Representa el cambio realizado en un documento, incluyendo el estado anterior y posterior.
 * @param {Object} context - Información contextual, como parámetros de eventos.
 * @throws {Error} Propaga errores para manejo superior.
 */
module.exports = async (change, context) => {
  try {
    const {
      alliance,
      allianceBranchOffice,
      appCollection,
      billerUnderscoreBranchOffice,
      itemId,
    } = context.params;

    const documentAfter = change.after.exists ? change.after.data() : null;
    const documentBefore = change.before.exists ? change.before.data() : null;

    const batch = dbFS.batch();

    if (documentBefore && documentAfter) {
      const removedLandingPages = documentBefore.landingPages.filter(
        (item) => !documentAfter.landingPages.includes(item),
      );

      // Procesamos las páginas que han sido eliminadas.
      await handleRemovedLandingPages(
        removedLandingPages,
        alliance,
        allianceBranchOffice,
        appCollection,
        billerUnderscoreBranchOffice,
        itemId,
        batch,
      );
    }

    if (documentAfter) {
      // Manejamos las páginas que han sido agregadas.
      await processAddedLandingPages(
        documentAfter,
        alliance,
        allianceBranchOffice,
        appCollection,
        billerUnderscoreBranchOffice,
        itemId,
        batch,
      );
    }

    return null;
  } catch (error) {
    console.error("Nos hemos topado con un error:", error);
    throw error;
  }
};
