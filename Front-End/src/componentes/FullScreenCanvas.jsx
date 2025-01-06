import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

const FullScreenCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("black");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [titulo, setTitulo] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, pizarraId } = location.state || {};

  useEffect(() => {
    if (mode === "edit" && pizarraId) {
      const fetchPizarra = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:5000/pizarra/pizarras/${pizarraId}`);
          setTitulo(response.data.titulo);
          const ctx = canvasRef.current.getContext("2d");
          const image = new Image();
          image.src = response.data.contenido; // Base64 string
          image.onload = () => ctx.drawImage(image, 0, 0);
        } catch (error) {
          console.error("Error fetching pizarra:", error);
        }
      };

      fetchPizarra();
    }
  }, [mode, pizarraId]);

  const startDrawing = (e) => {
    if (isReadOnly) return;
    setIsDrawing(true);
    draw(e);
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleMode = () => {
    setIsReadOnly(!isReadOnly);
    setMenuVisible(false);
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    
    try {
        const response = await fetch(`http://localhost:5000/pizarra/pizarras/${pizarraId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                titulo: titulo || 'Sin título', // Add default title
                contenido: imageData
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Replace alert with SweetAlert2
        await Swal.fire({
            title: 'Éxito!',
            text: 'Pizarra guardada exitosamente',
            icon: 'success',
            confirmButtonText: 'Ok'
        });
        
    } catch (error) {
        console.error('Error saving:', error);
        await Swal.fire({
            title: 'Error!',
            text: 'Error al guardar la pizarra: ' + error.message,
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
};

  const handleClose = () => {
    navigate("/pizarra-admin");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f4f4f9",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#FFFFFF",
            cursor: isReadOnly ? "not-allowed" : "crosshair",
          }}
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseMove={draw}
        ></canvas>

        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#000",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#FFF",
              fontSize: "24px",
              cursor: "pointer",
            }}
            onClick={toggleMenu}
          >
            •••
          </div>

          {menuVisible && (
            <div
              style={{
                position: "absolute",
                bottom: "70px",
                right: "0",
                backgroundColor: "#FFF",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                borderRadius: "10px",
                overflow: "hidden",
                width: "160px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    marginBottom: "8px",
                  }}
                >
                  {["black", "gray", "red", "blue"].map((colorOption) => (
                    <div
                      key={colorOption}
                      onClick={() => setColor(colorOption)}
                      style={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: colorOption,
                        borderRadius: "50%",
                        cursor: "pointer",
                        border: color === colorOption ? "3px solid #000" : "none",
                      }}
                    ></div>
                  ))}
                </div>

                <div
                  onClick={clearCanvas}
                  style={{
                    padding: "8px",
                    backgroundColor: "#EF4444",
                    color: "#FFF",
                    borderRadius: "5px",
                    textAlign: "center",
                    cursor: "pointer",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  Limpiar
                </div>

                <div
                  onClick={toggleMode}
                  style={{
                    padding: "8px",
                    backgroundColor: isReadOnly ? "#000" : "#444",
                    color: "#FFF",
                    borderRadius: "5px",
                    textAlign: "center",
                    cursor: "pointer",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  {isReadOnly ? "Modo editor" : "Modo lector"}
                </div>

                <div
                  onClick={handleSave}
                  style={{
                    padding: "8px",
                    backgroundColor: "#32CD32",
                    color: "#FFF",
                    borderRadius: "5px",
                    textAlign: "center",
                    cursor: "pointer",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  Guardar
                </div>

                <div
                  onClick={handleClose}
                  style={{
                    padding: "8px",
                    border: "1px solid #000",
                    borderRadius: "5px",
                    textAlign: "center",
                    cursor: "pointer",
                    color: "#000",
                    fontSize: "14px",
                  }}
                >
                  Cerrar
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullScreenCanvas;
