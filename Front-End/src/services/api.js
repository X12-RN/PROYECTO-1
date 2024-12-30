import axios from "axios";

// Configurar la instancia de Axios
const api = axios.create({
  baseURL: "http://127.0.0.1:5000", // Cambia si usas otra URL del servidor
  timeout: 5000, // Tiempo límite en milisegundos
});

export const getCryptos = async () => {
  try {
    const response = await api.get("/criptomonedas/precios");
    return response.data; // Devuelve la lista de criptos
  } catch (error) {
    console.error("Error fetching cryptos:", error);
    throw error;
  }
};

export const calculateGain = async (cryptoData) => {
  try {
    const response = await api.post("/calculate", cryptoData);
    return response.data; // Devuelve la ganancia calculada
  } catch (error) {
    console.error("Error calculating gain:", error);
    throw error;
  }
};
