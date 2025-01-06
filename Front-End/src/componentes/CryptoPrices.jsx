import React, { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getLogoUrl } from "./pages/AllCryptos"; // Import getLogoUrl

const CryptoCard = lazy(() => import("./pages/CryptoCard"));

const CryptoPrices = () => {
  const [cryptos, setCryptos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:5000/criptomonedas/precios");
        
        const sortedCryptos = (response.data.monedas || [])
          .map((crypto) => ({
            ...crypto,
            valorTotal: crypto.precio_actual * crypto.cantidad,
            logo: crypto.logo || getLogoUrl(crypto.simbolo)
          }))
          .sort((a, b) => b.valorTotal - a.valorTotal)
          .slice(0, 10);

        setCryptos(sortedCryptos);
      } catch (err) {
        console.error("Error fetching crypto prices:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoPrices();
    const interval = setInterval(fetchCryptoPrices, 120000);
    return () => clearInterval(interval);
  }, []);

  const handleEdit = (crypto) => {
    // Navigate to edit form or open modal
    navigate(`/edit-crypto/${crypto.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta criptomoneda?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/criptomonedas/monedas/${id}`);
        // Refresh the list
        fetchCryptoPrices();
      } catch (err) {
        console.error("Error deleting crypto:", err);
      }
    }
  };

  return (
    <div style={{ backgroundColor: "#000", padding: "0px", color: "#FFD700" }}>
      <Suspense fallback={<div style={{ textAlign: "center" }}>Cargando...</div>}>
        <div style={{
          display: "flex",
          overflowX: "auto",
          gap: "20px",
          padding: "10px",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none"
        }}>
          {cryptos.map((crypto) => (
            <div key={crypto.id} style={{ flex: "0 0 auto" }}>
              <CryptoCard
                nombre={crypto.nombre}
                simbolo={crypto.simbolo}
                precio_actual={crypto.precio_actual}
                cantidad={crypto.cantidad}
                logo={crypto.logo}
              />
            </div>
          ))}
          
          <div
            onClick={() => navigate("/all-cryptos")}
            style={{
              flex: "0 0 auto",
              width: "150px",
              minWidth: "100px",
              backgroundColor: "#111",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <span>Ver todas las monedas →</span>
          </div>
        </div>

        {/* Nuevo botón de Admin debajo de las crypto cards */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          padding: "20px"
        }}>
          <button
            onClick={() => navigate("/admin-cryptos")}
            style={{
              backgroundColor: "#2196F3",
              color: "white",
              padding: "12px 24px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}
          >
            Admin Criptos
          </button>
        </div>
      </Suspense>
    </div>
  );
};

export default CryptoPrices;
