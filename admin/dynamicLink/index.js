const fetch = require("node-fetch");

const createShortDynamicLink = async (domainUriPrefix, link) => {
  const apiKey = "AIzaSyBMu2mmI9-1fKZix2WUgCtcNihnR2qICVo"; // Asegúrate de reemplazar esto con tu API key real
  const endpoint = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`;

  const payload = {
    "dynamicLinkInfo": {
      "domainUriPrefix": domainUriPrefix,
      "link": link,
      "suffix": {
        "option": "UNGUESSABLE",
      },
    },
  };

  // console.log("payload:", payload);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear el enlace dinámico corto:", error);
    throw error;
  }
};

module.exports = createShortDynamicLink;
