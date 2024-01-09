/* eslint-disable no-useless-escape */
/**
 * @module replaceAllWith
 */

/**
 * Reemplaza todas las ocurrencias de una cadena o un conjunto de cadenas en otra cadena.
 *
 * @param {string} text - La cadena de texto original.
 * @param {(string|Array.<string>)} all - El caracter o array de caracteres a reemplazar.
 * @param {string} withChar - El caracter o caracteres con los que se reemplazarán.
 * @throws {TypeError} Si 'text' o 'withChar' no son cadenas de caracteres.
 * @throws {TypeError} Si 'all' no es una cadena de caracteres o un arreglo de cadenas.
 * @return {string} La cadena de texto modificada con los caracteres reemplazados.
 *
 * @example
 * // Para reemplazar tanto '.' como '_' con '-'
 * console.log(replaceAllWith('hello.world_hello', ['.', '_'], '-')); // Resultado: 'hello-world-hello'
 */
exports.replaceAllWith = (text, all, withChar) => {
  if (typeof text !== "string") {
    throw new TypeError("El parámetro 'text' debe ser una cadena de caracteres.");
  }

  if (typeof withChar !== "string") {
    throw new TypeError("El parámetro 'withChar' debe ser una cadena de caracteres.");
  }

  if (typeof all !== "string" && !Array.isArray(all)) {
    throw new TypeError("El parámetro 'all' debe ser una cadena de caracteres o un arreglo de cadenas.");
  }

  if (Array.isArray(all)) {
    all = all.map((item) => item.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
  } else {
    all = [all.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")];
  }

  const regex = new RegExp(all.join("|"), "g");

  return text.replace(regex, withChar);
};
