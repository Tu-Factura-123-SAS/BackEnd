const {dbFS} = require("../../admin");

/**
 * Función auxiliar que genera una referencia para eliminar ítems de un documento con batch.
 * Utiliza varios parámetros para construir la ruta del documento.
 *
 * @param {string} alliance - La alianza a la que pertenece la vista.
 * @param {string} allianceBranchOffice - La sucursal de la alianza a la que pertenece la vista.
 * @param {string} appCollection - La colección de la aplicación que contiene la vista.
 * @param {string} billerUnderscoreBranchOffice - La oficina de facturación subrayada que contiene la vista.
 * @param {string} view - PARAM: El nombre de la vista que se va a eliminar.
 * @return {Object} - La referencia al documento en Firestore.
 */
function generateDocReference(alliance, allianceBranchOffice, appCollection, billerUnderscoreBranchOffice, view) {
  const [,,, _view] = view.split("/");
  return dbFS.doc(`/entities/${alliance}/branchOffices/${allianceBranchOffice}/${appCollection}/${billerUnderscoreBranchOffice}/views/${_view}`);
}

/**
 * Esta función gestiona las vistas que fueron eliminadas.
 * Para cada vista eliminada, comprueba si existe en la base de datos.
 * Si existe, actualiza su orden y elimina el ítem correspondiente.
 *
 * @param {Array} removedViews - Un array de las vistas que se han eliminado. PARAM
 * @param {string} alliance - La alianza a la que pertenece la vista.
 * @param {string} allianceBranchOffice - La sucursal de la alianza a la que pertenece la vista.
 * @param {string} appCollection - La colección de funciones de la aplicación que contiene la vista.
 * @param {string} billerUnderscoreBranchOffice - Facturador y sucursal que contiene la vista.
 * @param {string} itemId - El identificador del ítem que se va a eliminar.
 * @param {Object} batch - La operación por lotes que se va a realizar.
 * @return {Promise} - Una promesa que se resuelve cuando todas las operaciones de lote se han completado.
 */
async function handleRemovedViews(
  removedViews,
  alliance,
  allianceBranchOffice,
  appCollection,
  billerUnderscoreBranchOffice,
  itemId,
  batch,
) {
  // Para cada vista eliminada, obtenemos una referencia al documento y lo actualizamos.
  const promises = removedViews.map(async (view) => {
    const batchRef = generateDocReference(alliance, allianceBranchOffice, appCollection, billerUnderscoreBranchOffice, view);

    try {
      // Obtenemos el documento de la base de datos.
      const docSnapshot = await batchRef.get();

      // Si el documento existe, lo actualizamos.
      if (docSnapshot.exists) {
        const docData = docSnapshot.data();

        // Actualizamos el orden y eliminamos el ítem correspondiente.
        const updatedOrder = docData.order.filter((id) => id !== itemId);
        delete docData.items[itemId];

        batch.update(batchRef, {"order": updatedOrder, "items": docData.items});
      }
    } catch (error) {
      // Si hay un error al obtener el documento, lo registramos.
      console.error(`Error al obtener el documento en functions/triggers/views/handleRemoved.js: ${error}`);
    }
  });

  // Devolvemos una promesa que se resuelve cuando todas las operaciones de lote se han completado.
  return Promise.all(promises);
}

module.exports = handleRemovedViews;
