/**
 * @file /functions/src/eCommerce/customerJourney/setLandingPage.js
 *
 * @description Establece los parametros de la landingPage en rolesRun
 *
 * @version 0.0.2
 * @date 02-24-2024
 *
 * @environment production Firebase Functions
 * @project tf-tenant
 *
 * @company TÚ FACTURA 123 S.A.S.
 * @author Katherin Paola Ortiz
 * @role Software Developer Full stack
 *
 * @language JavaScript
 * @testing_framework jest
 */

// const {v0} = require("../../eCommerce/v0");
const {updateInFirestore} = require("../../database/firestore");
// const {code} = require("../../admin/responses");

/**
 * Realiza una operación de viaje de cliente para el usuario.
 *
 * @param {string} uid - La identificación del usuario.
 * @param {string} path - ruta path.
 * @param {string} forced - Indica si la ruta debe ser forzada.
 * @throws {Error} Si no se puede completar el viaje del cliente.
 */
const setLandingPage = async (uid, path = "", forced = false) => {
    console.warn("llega a func", JSON.stringify({uid: uid, path: path, forced: forced}));

    await updateInFirestore(`/rolesRun/${uid}`, {
        // customClaims: {
            "customClaims.c.l": [path, forced],
            "v0.forced": forced,
            "v0.landingPage": path,
        // },
    });
};

module.exports = {
    setLandingPage,
};
