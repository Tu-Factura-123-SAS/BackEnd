/**
 * Establece las operaciones y las guarda en el objeto rolesRun
 *
 * @param {Object} entityDataX - El objeto que contiene las operaciones.
 * @param {Object} rolesRun - El objeto que contiene los roles.
 * @return {Object} - El objeto rolesRun actualizado.
 */
async function setOperations(entityDataX, rolesRun) {
  // Obtengo las operaciones del objeto rolesOperationsRules.data.
  const operations = Object.keys(entityDataX.rolesOperationsRules.data);

  operations.forEach((operation) => {
    const operationLetter = operation.charAt(0); // Primera letra de la operación
    entityDataX["operations"] = entityDataX.rolesOperationsRules.data[operation]; // Asigno la operación actual

    // Si la operación existe, itero a través de las colecciones.
    if (entityDataX.operations !== undefined) {
      entityDataX.operations.forEach((collectionName) => {
        // Me aseguro de que la estructura necesaria exista en rolesRun["customClaims"]["o"].
        if (rolesRun["customClaims"]["o"] === undefined) rolesRun["customClaims"]["o"] = {};
        if (rolesRun["customClaims"]["o"][operationLetter] === undefined) {
          rolesRun["customClaims"]["o"][operationLetter] = {};
        }

        // Establezco el nombre de la colección en la operación correspondiente.
        rolesRun["customClaims"]["o"][operationLetter][collectionName] = true;
      });
    }
  });

  return rolesRun;
}

module.exports = setOperations;
