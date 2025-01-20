import React, { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";

const CryptoCard = lazy(() => import("./CryptoCard"));

export const getLogoUrl = (cryptoName) => {
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
    SNX: "https://cryptologos.cc/logos/synthetix-network-token-snx-logo.png",
    TRX: "https://cryptologos.cc/logos/tron-trx-logo.png",
    BAT: "https://cryptologos.cc/logos/basic-attention-token-bat-logo.png",
    ARB: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
    GRT: "https://cryptologos.cc/logos/the-graph-grt-logo.png",
    OMG: "https://cryptologos.cc/logos/omg-network-omg-logo.png",
    UNI: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
    SUSHI: "https://cryptologos.cc/logos/sushiswap-sushi-logo.png",
    ENJ: "https://cryptologos.cc/logos/enjin-coin-enj-logo.png",
    DOGE: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
    SHIB: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
    SOL: "https://cryptologos.cc/logos/solana-sol-logo.png",
    RAY: "https://cryptologos.cc/logos/raydium-ray-logo.png",
    FIDA: "https://cryptologos.cc/logos/bonfida-fida-logo.png",
    JITOSOL: "https://cryptologos.cc/logos/jito-staked-sol-jitosol-logo.png",
    PNG: "https://cryptologos.cc/logos/pangolin-png-logo.png",
    RDNT: "https://cryptologos.cc/logos/radiant-rdnt-logo.png",
    ETH_ARBITRUM: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  };

  return cryptoLogos[cryptoName] || "";
};

const AllCryptos = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCryptos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:5000/criptomonedas/precios");
      const newCryptos = response.data.monedas || [];
      setCryptos(newCryptos);
    } catch (error) {
      console.error("Error fetching cryptos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptos();
    const interval = setInterval(fetchCryptos, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="all-cryptos-container" style={{ padding: "10px" }}>
      <div className="crypto-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <Suspense fallback={<div>Cargando...</div>}>
          {cryptos.map((crypto) => (
            <CryptoCard
              key={crypto.id}
              nombre={crypto.nombre}
              cantidad={crypto.cantidad}
              precio_actual={crypto.precio_actual}
              simbolo={crypto.simbolo}
              logo={crypto.logo || getLogoUrl(crypto.simbolo)}
            />
          ))}
        </Suspense>
      </div>
    </div>
  );
};

export default AllCryptos;
