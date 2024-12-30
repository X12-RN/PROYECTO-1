import React from "react";
import { FaSyncAlt } from "react-icons/fa"; // Importamos el icono de refresh

const FancyButton = ({ onClick, text }) => {
  return (
    <button
      className="button"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "5.3em",
        height: "5.3em",
        border: "none",
        cursor: "pointer",
        borderRadius: "0.4em",
        background: "rgba(235, 252, 254, 0.8)",
      }}
      onClick={onClick}
    >
      <div
        className="icon-container"
        style={{
          position: "relative",
          width: "3.5em",
          height: "3.1em",
          background: "none",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FaSyncAlt
          className="icon"
          style={{
            fontSize: "1.5em",
            color: "rgb(206, 167, 39)",
            animation: "spin 2s linear infinite",
          }}
        />
      </div>
      <div
        className="text"
        style={{
          position: "absolute",
          top: "-4.5em",
          width: "7.7em",
          height: "2.6em",
          backgroundColor: "#666",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "none",
          borderRadius: "5px",
          textShadow: "0 0 10px rgb(0, 0, 0)",
          opacity: 0,
          transition: "all 0.25s linear",
        }}
      >
        {text}
      </div>
    </button>
  );
};

export default FancyButton;
