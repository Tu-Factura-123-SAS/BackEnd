const {v0} = require("./index.js");

// eslint-disable-next-line require-jsdoc
async function test(domain) {
  const tenant = await v0(domain);
  console.clear(); // Borra los mensajes de la consola
  console.log(tenant);
}

// Obtén el valor de domain desde la línea de comandos de Ubuntu
const domain = process.argv[2];

// Verifica si se proporcionó el valor de domain en la línea de comandos
if (!domain) {
  console.error("Se debe proporcionar el valor de domain como argumento en la línea de comandos.");
  process.exit(1); // Salir con código de error
}

// Llama a la función test con el valor de domain proporcionado
test(domain);
