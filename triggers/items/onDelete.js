const {dbFS} = require("../../admin");
const handleRemovedLandingPages = require("./handleRemoved");

/**
 * Este archivo maneja las operaciones necesarias cuando se elimina un documento en la ruta especificada.
 *
 * @param {Object} snapshot - Representa el estado del documento que fue eliminado.
 * @param {Object} context - Este contiene información útil como los parámetros del evento, los cuales nos dan detalles como la alianza, la sucursal de la alianza, la colección de funciones de la app, la oficina de facturación subrayada y el ID del ítem.
 * @throws {Error} Si algo sale mal, capturamos el error y lo lanzamos para manejarlo más adelante.
 */
module.exports = async (snapshot, context) => {
  try {
    // Desestructuramos los parámetros del contexto para extraer las variables que necesitamos.
    const {alliance,
      allianceBranchOffice,
      appFunctionCollection,
      billerUnderscoreBranchOffice,
      itemId,
    } = context.params;

    // Obtenemos el estado del documento antes de ser eliminado.
    const document = snapshot.exists ? snapshot.data() : null;

    // Creamos una operación por lotes para realizar todas las operaciones de la base de datos juntas.
    const batch = dbFS.batch();

    // Si el documento existía, debemos manejar las landingPages que fueron eliminadas.
    if (snapshot.exists && document) {
      const removedLandingPages = document.landingPages;
      await handleRemovedLandingPages(
        removedLandingPages,
        alliance,
        allianceBranchOffice,
        appFunctionCollection,
        billerUnderscoreBranchOffice,
        itemId,
        batch,
      );
    }

    // Si todo salió bien, hacemos commit y devolvemos null.
    await batch.commit();
    return null;
  } catch (error) {
    // Si algo sale mal, imprimimos el error en la consola y lo lanzamos para manejarlo más adelante.
    console.error("Se ha producido un error:", error);
    throw error;
  }
};
