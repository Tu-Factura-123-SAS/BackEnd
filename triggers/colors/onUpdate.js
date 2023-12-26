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

/**
 * Construye y retorna un objeto que representa una página de destino.
 *
 * @param {Object} document - Datos completos de la branchoffice.
 * @return {Object} Representación estructurada de colores.
 */

function createLandingPagesObject(document) {
  return { ...document.colors };
};

/**
 * Función para manejar escritura de documentos en Firestore.
 *
 * @param {Object} change - Representa el cambio realizado en un documento, incluyendo el estado anterior y posterior.
 * @param {Object} context - Información contextual, como parámetros de eventos.
 * @throws {Error} Propaga errores para manejo superior.
 */
module.exports = async (change, context) => {
  try {

    const { uid, branchOffice } = context.params;
    const documentAfter = change.after.exists ? change.after.data() : null;
    const documentBefore = change.before.exists ? change.before.data() : null;

    if (documentAfter.colors != documentBefore.colors) {
      const colorsData = createLandingPagesObject(documentAfter);
      await mergeInFirestore(`entities/${uid}/branchOffices/${branchOffice}`, { colors: colorsData }, false);
    }
    return null;
  } catch (error) {
    console.error("Nos hemos topado con un error:", error);
    throw error;
  }
};
