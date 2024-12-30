// Header.jsx
import React from "react";

const Header = ({ currentDay, currentDate, currentTime }) => {
  return (
    <header
      style={{
        backgroundColor: "#1A1A1A", // Fondo oscuro monocromático
        borderRadius: "10px",
        padding: "15px 20px",
        marginBottom: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Sombra sutil
      }}
    >
      <h2
        style={{
          fontSize: "18px",
          margin: "0",
          fontWeight: "bold",
          color: "#E6E6E6", // Texto gris claro
          textAlign: "center",
        }}
      >
        👋 Bienvenido, JUAN
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
          color: "#B3B3B3", // Gris para elementos secundarios
        }}
      >
        <p style={{ fontSize: "14px", margin: "0" }}>{currentDay}</p>
        <p style={{ fontSize: "14px", margin: "0" }}>{currentDate}</p>
        <p style={{ fontSize: "14px", margin: "0" }}>{currentTime}</p>
      </div>
    </header>
  );
};

export default Header;
