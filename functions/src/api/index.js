const {code} = require("../admin/responses");

const callApiFunction = async (req, res) =>{
    console.warn("ANTES DE callApiFunction", JSON.stringify({reqParams: req.params}));
    console.warn("ANTES DE callApiFunction", JSON.stringify({reqQuery: req.query}));

    const functionName = req.params["0"].replace("api/", "").replace(/['"/]+/g, "");
    console.warn("ANTES DE documents", JSON.stringify({functionName: functionName}));

    switch (functionName) {
        case "documents": {
            // llamar a archivo y se envia los parametros y el metodo
            const {initDocuments} = require("./documents");
            const params = {
                ...req.params,
                ...req.query,
            };
            const response = await initDocuments(params, req.method);
            console.warn("ANTES DE documents1", JSON.stringify({response: response}));
            return response;
        }
        default: {
            return {code: code.internalServerError, message: "Función no encontrada."};
        }
    }
};

module.exports = {
    callApiFunction,
};
