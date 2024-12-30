import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PizarraAdmin = () => {
  const [pizarras, setPizarras] = useState([]);
  const [selectedPizarras, setSelectedPizarras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPizarras = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/pizarra/pizarras");
        setPizarras(response.data);
      } catch (error) {
        console.error("Error fetching pizarras:", error);
      }
    };

    fetchPizarras();
  }, []);

  const handleCreatePizarra = () => {
    navigate("/fullscreen-canvas", { state: { mode: "create" } });
  };

  const handleEditPizarra = (id) => {
    navigate("/fullscreen-canvas", { state: { mode: "edit", pizarraId: id } });
  };

  const handleSelectPizarra = (id) => {
    setSelectedPizarras((prev) =>
      prev.includes(id) ? prev.filter((pizarraId) => pizarraId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedPizarras.map((id) => axios.delete(`http://127.0.0.1:5001/pizarra/pizarras/${id}`))
      );
      setPizarras((prev) => prev.filter((pizarra) => !selectedPizarras.includes(pizarra.id)));
      setSelectedPizarras([]);
    } catch (error) {
      console.error("Error deleting pizarras:", error);
    }
  };

  return (
    <div style={{ padding: "10px", backgroundColor: "#000", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#FFD700" }}>Pizarras</h2>
        <button
          onClick={handleCreatePizarra}
          style={{
            padding: "10px 20px",
            backgroundColor: "#32CD32",
            color: "#FFF",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Crear Pizarra
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" }}>
        {pizarras.map((pizarra) => (
          <div
            key={pizarra.id}
            style={{
              padding: "20px",
              backgroundColor: "#FFF", // Fondo blanco
              color: "#000", // Texto negro
              borderRadius: "10px",
              textAlign: "center",
              position: "relative",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <input
              type="checkbox"
              style={{ position: "absolute", top: "10px", right: "10px" }}
              onChange={(e) => {
                e.stopPropagation();
                handleSelectPizarra(pizarra.id);
              }}
              checked={selectedPizarras.includes(pizarra.id)}
            />
            <img
              src={pizarra.contenido}
              alt={`Pizarra ${pizarra.titulo}`}
              style={{
                width: "100%",
                height: "100px",
                objectFit: "cover",
                borderRadius: "5px",
                backgroundColor: "#FFF", // Fondo blanco para la imagen
              }}
            />
            <h3>{pizarra.titulo}</h3>
          </div>
        ))}
      </div>
      {selectedPizarras.length > 0 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={handleDeleteSelected}
            style={{
              padding: "10px 20px",
              backgroundColor: "#EF4444",
              color: "#FFF",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Eliminar seleccionadas
          </button>
        </div>
      )}
    </div>
  );
};

export default PizarraAdmin;
