/**
 * Elimina los campos especificados en un objeto anidado.
 * @param {Object} obj - Objeto original.
 * @param {Array} fields - Campos a eliminar.
 * @return {Object} - Objeto modificado.
 */
function deepDeleteFields(obj, fields) {
  const newObj = {...obj};

  for (const field of fields) {
    if (Array.isArray(field)) {
      // Si el campo es un array, eliminar el campo en el objeto anidado
      const [first, ...remainingPath] = field;

      if (Object.prototype.hasOwnProperty.call(newObj, first) &&
          typeof newObj[first] === "object" &&
          remainingPath.length > 0) {
        newObj[first] = deepDeleteFields(newObj[first], [remainingPath]);
      } else {
        delete newObj[first];
      }
    } else {
      // Si el campo no es un array, eliminar el campo directamente en el objeto
      delete newObj[field];
    }
  }

  return newObj;
}

module.exports = deepDeleteFields;
