
const customMessageDocumentFast = {
  es_unauthorized: "Permisos insuficientes - Ya lo reportamos a TÚ mesa de ayuda.",
};

const customMessageSignIn = {
  "es": "¡Hola! Porque TÚ seguridad es nuestra prioridad, no almacenamos contraseñas. En cambio, te hemos enviado un 'TOKEN' de acceso a {tenant} directamente a TÚ correo electrónico personal {obfuscatedEmail}",
  "es_send": "Enviamos el 'TOKEN' a tu correo electrónico.",
  "es_error": "No tenemos registrado tu usuario.",
};


const customMessageSignUp = {
  "new": "Para garantizar TÚ seguridad, no almacenamos contraseñas. Por ello, te recomendamos cerrar esta pestaña del navegador y acceder a través del enlace que hemos enviado a TÚ dirección de correo electrónico personal.",
  "es_warning": "¡Ya creaste tu nuevo usuario! - Nos hemos dado cuenta de que tu usuario fue creado SIN autorización de facturación.",
  "es_create": "¡Listo, ya tienes tu nuevo usuario creado!",
  "es_error_create": "Error al crear tu usuario - Ya lo reportamos a tu mesa de ayuda.",
  "es_error": "Tu usuario ya existe",
};

const customMessageErrorCatch = {
  "es_error_catch": "Encontramos un error y ya lo comunicamos a tu mesa de ayuda. Vuelve a intentarlo, por favor",
};

const customMessageIsAvailable = {
  "phone_no_available": "Tu número ya está asignado a la identificación {uid} con email {email}",
  "phone_available": "Tu número está disponible ✔️",
  "email_no_available": "Tu email ya está asignado al usuario {uid}",
  "email_available": "Tu email está disponible ✔️",
};


const customMessageIsRegistered = {
  "uid_registered": "Tu usuario tiene registrado el número {phone} y el email {email}",
  "uid_no_registered": "Aún no aparece tu usuario en nuestro sistema.",
};

const customMessageTenant = {
  "error_tenant": "Servicio no imprementado, lo reportamos a tu mesa de ayuda.",
};


module.exports = {
  customMessageTenant,
  customMessageSignIn,
  customMessageSignUp,
  customMessageErrorCatch,
  customMessageIsAvailable,
  customMessageIsRegistered,
  customMessageDocumentFast,
};
