import React, { useState, useEffect } from "react";
import axios from "axios";
import Summary from "./CryptoSummary/Summary";

const CryptoSummary = () => {
  const [cryptos, setCryptos] = useState([]);
  const [totalUSD, setTotalUSD] = useState(0); // Total acumulado en USD
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ stable: 0, alt: 0, meme: 0 });

  const fetchCryptos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5001/criptomonedas/precios");
      const monedas = response.data.monedas || [];
      setCryptos(monedas);

      const totalUSDValue = monedas.reduce((sum, crypto) => {
        if (!crypto.precio_actual || !crypto.cantidad) {
          console.warn(`Datos inválidos para ${crypto.nombre}`);
          return sum;
        }
        return sum + crypto.precio_actual * crypto.cantidad;
      }, 0);

      const stats = monedas.reduce(
        (acc, crypto) => {
          if (crypto.tipo === "stable") acc.stable++;
          else if (crypto.tipo === "alt") acc.alt++;
          else if (crypto.tipo === "meme") acc.meme++;
          return acc;
        },
        { stable: 0, alt: 0, meme: 0 }
      );

      console.log("Total USD calculado:", totalUSDValue);
      setTotalUSD(totalUSDValue);
      setStats(stats);
    } catch (error) {
      console.error("Error al obtener los datos de criptomonedas:", error);
      setError("Error al obtener los datos de criptomonedas.");
    }
  };

  useEffect(() => {
    fetchCryptos();
    const interval = setInterval(fetchCryptos, 600000); // Actualización cada 10 minutos

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, []);

  if (error) {
    return <div style={{ color: "red", textAlign: "center", marginTop: "20px" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "10px", backgroundColor: "#222", borderRadius: "10px", boxShadow: "0 8px 15px rgba(0, 0, 0, 0.4)", color: "#FFF" }}>
      <Summary totalUSD={totalUSD} onReload={fetchCryptos} stats={stats} />
    </div>
  );
};

export default CryptoSummary;
