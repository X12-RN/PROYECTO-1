import React from "react";
import { useNavigate } from "react-router-dom";

const Canvas = () => {
  const navigate = useNavigate();

  const handleFullScreen = () => {
    navigate("/fullscreen-canvas"); // Navega directamente a la página de FullScreenCanvas
  };

  return (
    <div>
      <div
        style={{
          position: "relative",
        }}
      >
        <div
          onClick={handleFullScreen} // Llama a la función de navegación al hacer clic
          style={{
            width: "100%",
            height: "80px",
            border: "1px solid #D1D5DB",
            borderRadius: "10px",
            backgroundColor: "#FFFFFF",
            cursor: "pointer",
          }}
        >
          {/* Puedes agregar un texto o icono aquí si lo necesitas */}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
