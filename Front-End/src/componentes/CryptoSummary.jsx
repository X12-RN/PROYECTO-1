import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Summary from "./CryptoSummary/Summary";

const CryptoSummary = () => {
  const [data, setData] = useState({
    cryptos: [],
    totalUSD: 0,
    stats: { stable: 0, alt: 0, meme: 0 }
  });

  const fetchCryptos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/criptomonedas/precios");
      
      if (!response.data?.monedas) return;
      
      const monedas = response.data.monedas;
      const totalUSD = monedas.reduce((sum, crypto) => 
        sum + (crypto.precio_actual * crypto.cantidad || 0), 0);

      const stats = monedas.reduce((acc, crypto) => {
        acc[crypto.tipo] = (acc[crypto.tipo] || 0) + 1;
        return acc;
      }, { stable: 0, alt: 0, meme: 0 });

      setData({ cryptos: monedas, totalUSD, stats });
      
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchCryptos();
    const interval = setInterval(fetchCryptos, 300000);
    return () => clearInterval(interval);
  }, []);

  const summaryProps = useMemo(() => ({
    totalUSD: data.totalUSD,
    stats: data.stats,
    onReload: fetchCryptos
  }), [data.totalUSD, data.stats]);

  return (
    <div style={{ 
      padding: "10px",
      backgroundColor: "#222",
      borderRadius: "10px",
      boxShadow: "0 8px 15px rgba(0, 0, 0, 0.4)"
    }}>
      <Summary {...summaryProps} />
    </div>
  );
};

export default CryptoSummary;
