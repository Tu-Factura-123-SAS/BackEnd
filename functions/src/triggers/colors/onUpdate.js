/**
 * @developer Katherin Ortiz
 * @see {@link https://github.com/Katherin-Ortiz}
 * @version 0.0.1
 * @date 2023-12-28
 * @description Este archivo contiene una función que se ejecuta al
 * actualizar la sucursal en Firestore.
 * La función realiza acciones dependiendo de
 * si se han actualizado o no los colores de la sucursal.
 * @env production Firebase Functions
 * @module functions/triggers/colors/onUpdate
 * @language JavaScript
 * @testing_framework jest
 */

/* eslint-disable require-jsdoc */

/**
 * Construye y retorna un objeto que representa los colores y tema de la sucursal.
 *
 * @param {Object} document - Datos completos de la branchOffice.
 * @return {Object} Representación estructurada de colores.
 */

const {mergeInFirestore} = require("../../database/firestore");

function createColorsObject(document) {
  return {colors: {...document.colors}};
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
    const {uid} = context.params;
    const documentAfter = change.after.exists ? change.after.data() : null;
    const documentBefore = change.before.exists ? change.before.data() : null;

    if (documentAfter.colors != documentBefore.colors) {
      const colorsData = createColorsObject(documentAfter);
      await mergeInFirestore(`rolesRun/${uid}`, {v0: {...colorsData}});
    }
    return null;
  } catch (error) {
    console.error("Nos hemos topado con un error:", error);
    throw error;
  }
};
