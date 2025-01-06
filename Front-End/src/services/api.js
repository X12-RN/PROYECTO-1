import axios from "axios";
import io from "socket.io-client";

const API_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

let retryCount = 0;
const MAX_RETRIES = 3;

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 429) {
      console.log('Rate limit exceeded, using cached data...');
      return Promise.resolve(error.response);
    }

    if ((error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') && retryCount < MAX_RETRIES) {
      retryCount++;
      const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
      
      console.log(`Reintentando conexión (${retryCount}/${MAX_RETRIES}) en ${backoffDelay/1000}s...`);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          retryCount = 0; // Reset counter on successful retry
          resolve(api.request(error.config));
        }, backoffDelay);
      });
    }
    
    if (retryCount >= MAX_RETRIES) {
      console.log('Máximo número de intentos alcanzado. Por favor, verifique que el servidor esté funcionando.');
    }
    
    return Promise.reject(error);
  }
);

export const socket = io(API_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000
});

// Socket event handlers
socket.on("connect", () => {
  console.log("Socket.IO conectado");
});

socket.on("connect_error", () => {
  console.log("Error de conexión con el servidor. Verificando estado...");
});

socket.on("disconnect", () => {
  console.log("Desconectado del servidor. Intentando reconexión...");
});

export const sendQuery = async (query, model, internetAccess) => {
  try {
    const response = await api.post("/query", { query, model, internetAccess });
    return response.data; // Devuelve la respuesta del backend
  } catch (error) {
    console.error("Error sending query:", error);
    throw error;
  }
};

export const getCryptos = async () => {
  try {
    const response = await api.get("/criptomonedas/precios");
    return response.data; // Devuelve la lista de criptos
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      console.log('Servidor no disponible. Por favor, inicie el servidor Flask.');
    }
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
