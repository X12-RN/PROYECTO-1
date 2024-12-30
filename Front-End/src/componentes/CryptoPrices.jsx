import React, { useEffect, useState, lazy, Suspense, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CryptoCard = lazy(() => import("./pages/CryptoCard")); // Lazy loading para tarjetas individuales

const CryptoPrices = () => {
  const [cryptos, setCryptos] = useState([]);
  const [error, setError] = useState(null);
  const [usdMxnRate, setUsdMxnRate] = useState(17.15); // Default fallback rate
  const navigate = useNavigate();
  const observerRef = useRef(null);

  useEffect(() => {
    // Fetch USD/MXN exchange rate
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        setUsdMxnRate(response.data.rates.MXN);
      } catch (err) {
        console.error('Error fetching exchange rate:', err);
        // Fallback to default rate if API fails
      }
    };

    fetchExchangeRate();
    const rateInterval = setInterval(fetchExchangeRate, 3600000); // Update rate hourly

    return () => clearInterval(rateInterval);
  }, []);

  const fetchCryptoPrices = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5001/criptomonedas/precios");
      if (response.data && response.data.monedas) {
        console.log("Datos recibidos del servidor:", response.data);
        setCryptos(response.data.monedas);
        setError(null); // Clear any previous errors
      } else {
        throw new Error("Formato de respuesta inválido");
      }
    } catch (err) {
      console.error("Error al obtener los datos:", err);
      setError(`Error: ${err.message || "Error al obtener los datos"}`);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchCryptoPrices();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, []);

  const getLogoUrl = (cryptoName) => {
    const cryptoLogos = {
      BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      XRP: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
      AVAX: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
      MATIC: "https://cryptologos.cc/logos/polygon-matic-logo.png",
      DOT: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
      RENDER: "https://cryptologos.cc/logos/render-token-render-logo.png",
      LINK: "https://cryptologos.cc/logos/chainlink-link-logo.png",
      LTC: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
      ATOM: "https://cryptologos.cc/logos/cosmos-atom-logo.png",
      ALGO: "https://cryptologos.cc/logos/algorand-algo-logo.png",
      SAND: "https://cryptologos.cc/logos/the-sandbox-sand-logo.png",
      NEAR: "https://cryptologos.cc/logos/near-protocol-near-logo.png",
      ADA: "https://cryptologos.cc/logos/cardano-ada-logo.png",
      AXS: "https://cryptologos.cc/logos/axie-infinity-axs-logo.png",
      BCH: "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png",
      CHZ: "https://cryptologos.cc/logos/chiliz-chz-logo.png",
      XLM: "https://cryptologos.cc/logos/stellar-xlm-logo.png",
      LDO: "https://cryptologos.cc/logos/lido-dao-ldo-logo.png",
      DYDX: "https://cryptologos.cc/logos/dydx-dydx-logo.png",
      BAL: "https://cryptologos.cc/logos/balancer-bal-logo.png",
      MKR: "https://cryptologos.cc/logos/maker-mkr-logo.png",
      LRC: "https://cryptologos.cc/logos/loopring-lrc-logo.png",
      SNX: "https://cryptologos.cc/logos/synthetix-snx-logo.png",
      TRX: "https://cryptologos.cc/logos/tron-trx-logo.png",
      BAT: "https://cryptologos.cc/logos/basic-attention-token-bat-logo.png",
      ARB: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
      GRT: "https://cryptologos.cc/logos/the-graph-grt-logo.png",
      OMG: "https://cryptologos.cc/logos/omg-omg-logo.png",
      UNI: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
      SUSHI: "https://cryptologos.cc/logos/sushiswap-sushi-logo.png",
      ENJ: "https://cryptologos.cc/logos/enjin-enj-logo.png",
      DOGE: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
      SHIB: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
      GALA: "https://cryptologos.cc/logos/gala-gala-logo.png",
      JTO: "https://www.jito.network/assets/logo.png",
      RAY: "https://cryptologos.cc/logos/raydium-ray-logo.png",
      FIDA: "https://cryptologos.cc/logos/bonfida-fida-logo.png",
      JITOSOL: "https://cryptologos.cc/logos/jito-staked-sol-jitosol-logo.png",
      PNG: "https://cryptologos.cc/logos/pangolin-png-logo.png",
      RDNT: "https://cryptologos.cc/logos/radiant-capital-rdnt-logo.png",
      SOL: "https://cryptologos.cc/logos/solana-sol-logo.png",
      ETH_ARBITRUM: "https://cryptologos.cc/logos/ethereum-eth-logo.png", // Para ETH en Arbitrum
    };
    return cryptoLogos[cryptoName] || "https://via.placeholder.com/50";
  };

  const renderCryptoCard = (crypto) => {
    // Calculate current value based on currency type
    const calculateValue = () => {
      if (!crypto.precio_actual || !crypto.cantidad) return 0;
      
      const valorUSD = crypto.precio_actual * crypto.cantidad;
      // Convert to MXN if needed
      return crypto.divisa === "USD" 
        ? valorUSD * usdMxnRate  // USD to MXN conversion
        : valorUSD; // Already in MXN
    };

    const valorActual = calculateValue();

    return (
      <div
        key={crypto.nombre}
        style={{
          minWidth: "150px",
          backgroundColor: "#111",
          borderRadius: "10px",
          padding: "10px",
          textAlign: "center",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
          color: "#FFD700",
          display: "inline-block",
        }}
      >
        <h3 style={{ fontSize: "16px", margin: "5px 0" }}>{crypto.nombre}</h3>
        <p style={{ fontSize: "12px", color: "#fff", margin: "5px 0" }}>
          Cantidad: {crypto.cantidad}
        </p>
        <img
          src={getLogoUrl(crypto.nombre)}
          alt={`${crypto.nombre} logo`}
          style={{
            width: "50px",
            height: "50px",
            objectFit: "contain",
            marginBottom: "10px",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/50";
          }}
        />
        <p style={{ color: "#0F0", fontSize: "14px", margin: "5px 0" }}>
          {crypto.precio_actual && crypto.precio_actual > 0
            ? `${parseFloat(crypto.precio_actual).toFixed(6)} USD`
            : "No disponible"}
        </p>
        <p style={{ 
          fontSize: "14px", 
          margin: "5px 0", 
          color: "#FFA500", // Deep pink
          fontWeight: "bold",
        }}>
          Valor: {valorActual.toFixed(4)} USD
        </p>
      </div>
    );
  };

  return (
    <div
      ref={observerRef}
      style={{
        overflowX: "scroll",
        display: "flex",
        gap: "10px",
        padding: "10px",
        backgroundColor: "#000",
        borderRadius: "10px",
        whiteSpace: "nowrap",
        scrollbarWidth: "none",
      }}
    >
      {error ? (
        <p style={{ color: "red", width: "100%" }}>{error}</p>
      ) : (
        <>
          {cryptos.slice(0, 10).map(renderCryptoCard)}
          <div
            style={{
              minWidth: "150px",
              backgroundColor: "#222",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "center",
              cursor: "pointer",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
              color: "#FFD700",
              display: "inline-block",
            }}
            onClick={() => navigate("/all-cryptos")}
          >
            <h3 style={{ fontSize: "14px", margin: "5px 0" }}>Ver más monedas</h3>
          </div>
        </>
      )}
    </div>
  );
};

export default CryptoPrices;