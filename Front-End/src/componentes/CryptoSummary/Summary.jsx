import React, { useState, useEffect } from "react";
import { FaSyncAlt, FaWallet } from "react-icons/fa";

const Summary = ({ totalUSD, onReload }) => {
  const [displayedTotal, setDisplayedTotal] = useState(0); // Empieza en 0 para efecto inicial
  const [isAnimating, setIsAnimating] = useState(false); // Controla la animación

  const startAnimation = (newTotal) => {
    setIsAnimating(true); // Activa la animación
    let interval = setInterval(() => {
      setDisplayedTotal((prev) => {
        const difference = newTotal - prev;
        if (Math.abs(difference) < 0.1) {
          clearInterval(interval);
          setDisplayedTotal(newTotal); // Sincronizar correctamente
          setIsAnimating(false); // Termina la animación
          return newTotal;
        }
        return prev + difference / 5; // Ajusta la velocidad
      });
    }, 50);
  };

  useEffect(() => {
    // Inicia la animación cuando el componente se monta o el total cambia
    startAnimation(totalUSD);
  }, [totalUSD]);

  const handleRefresh = () => {
    setDisplayedTotal(0); // Resetea el total mostrado a 0
    setIsAnimating(true); // Activa la animación
    onReload(); // Llama a la función para obtener nuevos datos
    setTimeout(() => startAnimation(totalUSD), 500); // Vuelve a iniciar la animación
  };

  return (
    <div
      style={{
        backgroundColor: "#111",
        color: "#FFF",
        padding: "10px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        border: "2px solid #444",
        width: "100%",
        margin: "0 auto",
      }}
    >
      {/* Sección de dinero */}
      <div
        style={{
          marginBottom: "10px",
          fontSize: "20px",
          fontWeight: "bold",
          color: isAnimating ? "#FFD700" : "#32CD32", // Cambia color durante la animación
          transition: "color 0.3s ease", // Transición suave
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FaWallet style={{ marginRight: "5px", fontSize: "1.2em" }} />
        ${displayedTotal.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
        USD
      </div>

      {/* Botón de recarga */}
      <button
        onClick={handleRefresh}
        style={{
          backgroundColor: isAnimating ? "#FFD700" : "#32CD32", // Cambia color durante la animación
          color: "#FFF",
          border: "none",
          borderRadius: "5px",
          padding: "5px 15px",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          transition: "background-color 0.3s ease", // Transición suave
        }}
      >
        <FaSyncAlt style={{ marginRight: "5px", fontSize: "1em" }} />
        Refrescar
      </button>
    </div>
  );
};

export default Summary;
