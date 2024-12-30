import React from "react";

const CryptoCard = ({ crypto, getLogoUrl }) => {
  // Calcular inversión dinámica basada en el precio actual
  const dynamicInvestment = crypto.precio_actual ? (crypto.precio_actual * crypto.cantidad) : 0;

  return (
    <div
      style={{
        backgroundColor: "#111",
        borderRadius: "10px",
        padding: "10px",
        textAlign: "center",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
        color: "#FFD700",
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
      {/* Precio Actual */}
      <p style={{ color: "#0F0", fontSize: "16px", margin: "5px 0", fontWeight: "bold" }}>
  {crypto.precio_actual && crypto.precio_actual > 0
    ? `${crypto.precio_actual.toFixed(4)} USD`
    : "Precio no disponible"}
</p>

      {/* Inversión Dinámica */}
      <p style={{ fontSize: "14px", margin: "5px 0", color: "#FFA500", fontWeight: "bold" }}>
        Inversión: {dynamicInvestment.toFixed(4)} USD
      </p>
    </div>
  );
};

export default CryptoCard;
