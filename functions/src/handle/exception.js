/**
 * Maneja las excepciones y lanza una excepción con información detallada.
 *
 * @param {Error} exception - La excepción original capturada.
 * @throws {Error} Lanza un nuevo error con un mensaje detallado.
 */
function exception(exception) {
  // Verifica que se proporcionó un objeto de error
  if (!(exception instanceof Error)) {
    throw new TypeError("Se esperaba un objeto de Error como argumento");
  }

  // Analiza la pila de llamadas de la excepción
  let stackList = exception.stack.split("\n").slice(1);

  // Filtra las líneas de la pila que provienen de archivos en node_modules
  stackList = stackList.filter((line) => !line.includes("node_modules"));

  // Si la pila de llamadas está vacía después de filtrar, devuelve el mensaje de error original
  if (stackList.length === 0) {
    throw exception;
  }

  // Encuentra la segunda línea en la pila de llamadas, que debería ser la función
  // desde la que se invocó `exception`
  const invokingFunction = stackList[1].trim().split(" ")[1];

  // Extrae la información del archivo y la línea de la pila de llamadas
  const callerLine = stackList[0].match(/(\w+\.js):\d+:\d+/);

  let errorMessage = exception.message;
  if (callerLine) {
    const [, file, line] = callerLine[0].split(":");
    const fileName = file;
    const lineNumber = line;

    // Combinar la creación de errorMessage y la adición de exception.code
    errorMessage = `⚠️ ${fileName} ~ ${lineNumber} ~ ${invokingFunction}: ${errorMessage} ${exception.code ? ` code: ${exception.code}` : ""}`;
  }
  console.error(errorMessage);
  throw new Error(errorMessage);
}

// Exporta la función para que pueda ser usada en otros módulos
module.exports = exception;
