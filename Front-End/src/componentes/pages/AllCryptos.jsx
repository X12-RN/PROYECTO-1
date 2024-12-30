import React, { useEffect, useState, lazy, Suspense, useRef } from "react";
import axios from "axios";

const CryptoCard = lazy(() => import("./CryptoCard")); // Lazy loading para tarjetas individuales

const AllCryptos = () => {
  const [cryptos, setCryptos] = useState([]);
  const [error, setError] = useState(null);
  const [visibleCryptos, setVisibleCryptos] = useState(10); // Controla la cantidad de monedas visibles inicialmente
  const observerRef = useRef(null);

  const fetchCryptoPrices = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5001/criptomonedas/precios");
      setCryptos(response.data.monedas); // Asegúrate de que `monedas` contiene las 44
    } catch (err) {
      setError("Error al obtener los datos");
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

  // Cargar más monedas al hacer scroll
  const handleLoadMore = () => {
    setVisibleCryptos((prev) => prev + 10); // Incrementa el número de monedas visibles en 10
  };

  return (
    <div style={{ padding: "10px", backgroundColor: "#000", color: "#FFF", minHeight: "100vh" }}>
      <h2 style={{ color: "#FFD700", textAlign: "center", marginBottom: "20px" }}>
        Todas las Criptomonedas
      </h2>
      {error ? (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      ) : (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr", // Dos columnas
              gap: "10px",
            }}
          >
            <Suspense fallback={<div>Cargando...</div>}>
              {cryptos.slice(0, visibleCryptos).map((crypto, index) => (
                <CryptoCard key={index} crypto={crypto} getLogoUrl={getLogoUrl} />
              ))}
            </Suspense>
          </div>
          {visibleCryptos < cryptos.length && (
            <button
              onClick={handleLoadMore}
              style={{
                display: "block",
                margin: "20px auto",
                padding: "10px 20px",
                backgroundColor: "#FFD700",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              Cargar más
            </button>
          )}
          <div ref={observerRef} style={{ height: "1px" }}></div>
        </div>
      )}
    </div>
  );
};

export default AllCryptos;
