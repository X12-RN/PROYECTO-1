import React from "react";
import { Link } from "react-router-dom";
import { FaBitcoin, FaPaintBrush, FaComments, FaHome, FaClipboardList } from "react-icons/fa"; // Importamos íconos

const NavBar = () => {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        maxWidth: "320px",
        backgroundColor: "#111",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "10px 0",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.4)",
        zIndex: 1000,
      }}
    >
      {/* Ícono de Home */}
      <Link to="/" style={{ textDecoration: "none", color: "#FFD700" }}>
        <div style={{ textAlign: "center" }}>
          <FaHome size={24} />
          <p style={{ fontSize: "12px", margin: 0 }}>Inicio</p>
        </div>
      </Link>

      {/* Ícono de BTC */}
      <Link to="/all-cryptos" style={{ textDecoration: "none", color: "#FFD700" }}>
        <div style={{ textAlign: "center" }}>
          <FaBitcoin size={24} />
          <p style={{ fontSize: "12px", margin: 0 }}>Cripto</p>
        </div>
      </Link>

      {/* Ícono de Pizarra */}
      <Link to="/pizarra-admin" style={{ textDecoration: "none", color: "#FFD700" }}>
        <div style={{ textAlign: "center" }}>
          <FaPaintBrush size={24} />
          <p style={{ fontSize: "12px", margin: 0 }}>Admin</p>
        </div>
      </Link>

      {/* Ícono de Chat */}
      <Link to="/chat" style={{ textDecoration: "none", color: "#FFD700" }}>
        <div style={{ textAlign: "center" }}>
          <FaComments size={24} />
          <p style={{ fontSize: "12px", margin: 0 }}>Chat</p>
        </div>
      </Link>
    </nav>
  );
};

export default NavBar;
