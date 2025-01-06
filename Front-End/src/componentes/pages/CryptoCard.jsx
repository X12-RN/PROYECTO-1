import React from "react";
import PropTypes from "prop-types";

const CryptoCard = ({
  nombre,
  cantidad = 0, // Default value to prevent undefined
  precio_actual = 0, // Default value to prevent undefined
  logo,
  simbolo,
  style = {}
}) => {
  return (
    <div style={{
      backgroundColor: "#1a1a1a",
      borderRadius: "10px",
      padding: "10px",
      textAlign: "center",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
      color: "#FFD700",
      width: "100%",
      maxWidth: "300px",
      display: "flex",
      flexDirection: "column",
      gap: "5px",
      ...style
    }}>
      {/* Nombre de la cripto */}
      <h3 style={{ 
        fontSize: "16px",
        margin: "0",
        color: "#FFD700",
        fontWeight: "bold"
      }}>
        {nombre}
      </h3>

      {/* Cantidad de monedas */}
      <div style={{ 
        backgroundColor: "#2a2a2a",
        padding: "4px",
        borderRadius: "5px"
      }}>
        <p style={{ 
          fontSize: "12px",
          color: "#fff", 
          margin: "0"
        }}>
          Cantidad: <span style={{color: "#4CAF50"}}>{Number(cantidad).toFixed(8)}</span>
        </p>
      </div>

      {/* Logo */}
      <img
        src={logo}
        alt={`Logo de ${nombre}`}
        style={{
          width: "40px",
          height: "40px",
          margin: "5px auto",
          display: "block",
          objectFit: "contain"
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/50";
        }}
      />

      {/* Precio actual */}
      <div style={{
        backgroundColor: "#2a2a2a",
        padding: "4px",
        borderRadius: "5px"
      }}>
        <p style={{ 
          fontSize: "14px",
          margin: "0",
          color: "#fff"
        }}>
          Precio: <span style={{color: "#00ff00"}}>${Number(precio_actual).toFixed(2)}</span>
        </p>
      </div>

      {/* Valor total */}
      <div style={{
        backgroundColor: "#2a2a2a",
        padding: "4px",
        borderRadius: "5px"
      }}>
        <p style={{ 
          fontSize: "14px",
          margin: "0",
          color: "#fff"
        }}>
          Total: <span style={{color: "#FFA500"}}>${(Number(precio_actual) * Number(cantidad)).toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};

CryptoCard.propTypes = {
  nombre: PropTypes.string.isRequired,
  cantidad: PropTypes.number,
  precio_actual: PropTypes.number,
  logo: PropTypes.string.isRequired,
  simbolo: PropTypes.string.isRequired,
  style: PropTypes.object
};

export default CryptoCard;
