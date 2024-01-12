// Se importa la función 'isDeepStrictEqual' del módulo 'util' para realizar una comparación
// profunda y estricta entre dos objetos. Este método verifica si dos objetos son iguales, teniendo
// en cuenta propiedades, métodos y valores.
const {isDeepStrictEqual} = require("util");

// Fusionar datos en Firestore.
const {mergeInFirestore} = require("../../database/firestore");

const CLAIMS_FIELD = "customClaims";

// Exportamos una función asíncrona que recibe dos parámetros: 'change' y 'context'.
// 'change' representa el cambio de datos en el documento y 'context' proporciona información
// sobre el contexto en el que se desencadenó la función.
module.exports = async (change, context) => {
  // 'users' proporciona métodos para interactuar con los usuarios, y 'timeStampFirestoreX' es una marca de tiempo.
  const {users, timeStampFirestoreX} = require("../../admin");

  // ID del usuario.
  const uid = context.params.uid;

  // Se intenta obtener los datos del usuario a través de su ID con el método 'getUserByUid'.
  // Si ocurre una excepción (el usuario no existe), se muestra un mensaje de error en la consola y
  // se retorna null.
  try {
    await users.getUserByUid(uid);
  } catch (e) {
    console.error(`Unable to sync claims for user '${uid}', error:`, e.message);
    return null;
  }

  // Si no existen datos después del cambio o si no existen reclamaciones personalizadas ('customClaims'),
  // se establecen las reclamaciones personalizadas del usuario a null y se retorna el resultado.
  if (!change.after.exists || (CLAIMS_FIELD && !change.after.get(CLAIMS_FIELD))) {
    return users.setCustomUserClaims(uid, null);
  }

  // Obtenemos los datos antes y después del cambio. Si no existen, se inicializan como objetos vacíos.
  const beforeData = (CLAIMS_FIELD ? change.before.get(CLAIMS_FIELD) : change.before.data()) || {};
  const data = (CLAIMS_FIELD ? change.after.get(CLAIMS_FIELD) : change.after.data()) || {};

  // Se elimina la propiedad '_synced' de 'beforeData' y 'data', si existe.
  ["_synced"].forEach((prop) => {
    delete beforeData[prop];
    delete data[prop];
  });

  // Si los datos antes y después del cambio son idénticos (según 'isDeepStrictEqual'), no se hace nada
  // y se retorna null.
  if (isDeepStrictEqual(beforeData, data)) {
    return null;
  }

  // Si 'data' no es un objeto, no se hace nada y se retorna null.
  if (typeof data !== "object") {
    return null;
  }

  // Se establecen los customs claims del usuario utilizando los datos después del cambio.
  await users.setCustomUserClaims(uid, data);

  // Finalmente, se fusiona en Firestore "_synced".
  return await mergeInFirestore(`rolesRun/${uid}`, {[CLAIMS_FIELD]: {"_synced": timeStampFirestoreX}}, true);
};
