/**
 * @file /functions/eCommerce/customerJourney/index.js
 *
 * @description Gestiona las interacciones del usuario en el viaje del cliente.
 *
 * @version 0.0.2
 * @date 07-07-2023
 *
 * @environment production Firebase Functions
 * @project tf-tenant
 *
 * @company TÚ FACTURA 123 S.A.S.
 * @author Jovanny Medina Cifuentes <tufactura123@jovanny.co>
 * @role Software Developer Full stack - Senior
 * @see {@link https://github.com/JovannyCO}
 *
 * @language JavaScript
 * @testing_framework jest
 */

const {v0} = require("../../eCommerce/v0");
const {getOneDocument, mergeInFirestore} = require("../../database/firestore");
const {code} = require("../../admin/responses");

/**
 * Realiza una operación de viaje de cliente para el usuario.
 *
 * @param {string} tenantName - El nombre del tenant.
 * @param {string} uid - La identificación del usuario.
 * @throws {Error} Si no se puede completar el viaje del cliente.
 */
const customerJourney = async (tenantName, uid) => {
  try {
    const tenantTemplate = await v0(tenantName);
    const alliance = tenantTemplate.eCommerce[5];
    const allianceBranchOffice = tenantTemplate.eCommerce[6];
    const landingPageV0app = tenantTemplate.landingPage.split("/")[1];
    const biller = tenantTemplate.eCommerce[2];
    const billerBranchOffice = tenantTemplate.eCommerce[3];

    const refIndividualCustomerJourney = `/entities/${uid}/individualCustomerJourney/${uid}_principal`;
    const dataIndividualCustomerJourney = await getOneDocument(refIndividualCustomerJourney);

    const refCustomersJourneys = `/entities/${alliance}/branchOffices/${allianceBranchOffice}/${landingPageV0app}/${biller}_${billerBranchOffice}/customersJourneys/${uid}`;
    const dataCustomersJourneys = await getOneDocument(refCustomersJourneys);

    if (dataIndividualCustomerJourney.response === code.notFound && dataCustomersJourneys.response === code.notFound) {
      return {response: code.notFound}; // user is new
    } else if (dataIndividualCustomerJourney.response === code.notFound && dataCustomersJourneys.response === code.ok) {
      // timeStampFirestoreX debe estar acá, porque si no, el TTL una hora anterior.
      const {timeStampFirestoreX} = require("../../admin");

      // Copy contents of dataCustomersJourneys into refIndividualCustomerJourney
      dataCustomersJourneys.data["TTL"] = timeStampFirestoreX;
      await mergeInFirestore(refIndividualCustomerJourney, dataCustomersJourneys.data);
    }

    console.log("dataIndividualCustomerJourney: ", dataIndividualCustomerJourney);
    console.log("dataCustomersJourneys: ", dataCustomersJourneys);
  } catch (error) {
    console.error("Error during customer journey processing: ", error.message);
    throw error;
  }
};

module.exports = {
  customerJourney,
};
