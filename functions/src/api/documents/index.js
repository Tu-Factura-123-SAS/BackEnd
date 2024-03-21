const {code} = require("../../admin/responses");

const initDocuments = async (params, method) => {
    console.warn("initDocuments", JSON.stringify({params: params, method: method}));
    let response = {};
    switch (method) {
        case "GET": {
            // llamar a archivo y se envia los parametros y el metodo
            console.warn("get antes", JSON.stringify({response: response}));
            response = await getDocument(params);
            console.warn("get desp", JSON.stringify({response: response}));
            return response;
        }
        case "POST": {
            // h
                }
            break;

        default: {
            return {response: code.internalServerError, message: "Método no encontrado."};
        }
    }
};

const getDocument = async (params) => {
    let res = {};
    try {
        if (params.biller === undefined || params.biller == "") {
            res = {
                response: code.badRequest,
                getOneCollection: "El id del biller no es valido.",
            };
            return res;
        }

        if (params.document === undefined || params.document == "") {
            res = {
                response: code.badRequest,
                getOneCollection: "El id del documento no es valido.",
            };
            return res;
        }

        const id = `entities/${params.biller}/documents/${params.document}`;
        const {getOneDocument} = require("../../database/firestore");

        const documentData = await getOneDocument(`${id}`);
        if (documentData.response === code.ok) {
            const documentDataX = documentData.data;
            res = {
                response: code.ok,
                message: "llega al final",
                data: documentDataX,
            };
        } else {
            return {response: code.notFound, message: "No existe documento"};
        }
        return res;
    } catch (error) {
        console.warn("pasa por catch");
        res = {response: code.badRequest, message: error.message};
    }
};

module.exports = {
    initDocuments,
    getDocument,
};
