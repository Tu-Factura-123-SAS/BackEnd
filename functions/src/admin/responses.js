
const code = {
  // Respuestas informativas (100–199)
  continue: 100,
  switchingProtocols: 101,
  earlyHints: 103,

  // Respuestas satisfactorias (200–299)
  ok: 200,
  created: 201,
  accepted: 202,
  nonAuthoritativeInformation: 203,
  noContent: 204,
  resetContent: 205,
  partialContent: 206,


  // Redirecciones (300–399)
  multipleChoices: 300,
  movedPermanently: 301,
  found: 302,
  seeOther: 303,
  notModified: 304,
  temporaryRedirect: 307,
  permanentRedirect: 308,


  // Errores de los clientes (400–499)
  badRequest: 400,
  unauthorized: 401,
  paymentRequired: 402,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  notAcceptable: 406,
  proxyAuthenticationRequired: 407,
  requestTimeout: 408,
  conflict: 409,
  gone: 410,
  lengthRequired: 411,
  preconditionFailed: 412,
  payloadTooLarge: 413,
  uriTooLong: 414,
  tooManyRequests: 429,


  // Errores de los servidores (500–599)
  internalServerError: 500,
  notImplemented: 501,
  badGateway: 502,
  serviceUnavailable: 503,
  gatewayTimeout: 504,
  httpVersionNotSupported: 405,
  variantAlsoNegotiates: 506,
  insufficientStorage: 507,
  loopDetected: 508,
  unassigned: 509,
  notExtended: 510,
  networkAuthenticationRequired: 511,
};

module.exports = {code};
