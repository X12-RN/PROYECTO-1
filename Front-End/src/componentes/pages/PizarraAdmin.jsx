import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import { FaTrash } from 'react-icons/fa'; // Import trash icon

const API_URL = "http://127.0.0.1:5000/pizarra/pizarras";

const PizarraAdmin = () => {
  const [pizarras, setPizarras] = useState([]);
  const [selectedPizarras, setSelectedPizarras] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const navigate = useNavigate();

  const fetchPizarras = async () => {
    try {
      const response = await axios.get(API_URL);
      setPizarras(response.data);
    } catch (error) {
      console.error("Error fetching pizarras:", error);
    }
  };

  const savePizarra = async (data) => {
    try {
      const response = await axios.post(API_URL, data);
      fetchPizarras(); // Refresh list after saving
    } catch (error) {
      console.error("Error saving pizarra:", error);
    }
  };

  useEffect(() => {
    fetchPizarras();
  }, []);

  const handleCreatePizarra = async () => {
    try {
      const { value: titulo } = await Swal.fire({
        title: 'Nueva Pizarra',
        input: 'text',
        inputLabel: 'Título de la pizarra',
        inputPlaceholder: 'Ingrese un título...',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Necesitas escribir un título!';
          }
        }
      });

      if (titulo) {
        const response = await axios.post(API_URL, {
          titulo,
          contenido: ''
        });
        const newPizarra = response.data;
        navigate('/fullscreen-canvas', { 
          state: { 
            mode: 'edit',
            pizarraId: newPizarra.id 
          }
        });  // Navigate to FullScreenCanvas with new ID
      }
    } catch (error) {
      console.error('Error creating pizarra:', error);
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo crear la pizarra',
        icon: 'error'
      });
    }
  };

  const handleEditPizarra = (id) => {
    if (!isDeleteMode) {
      navigate("/fullscreen-canvas", { state: { mode: "edit", pizarraId: id } });
    }
  };

  const handleSelectPizarra = (id) => {
    if (isDeleteMode) {
      setSelectedPizarras(prev =>
        prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
      );
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedPizarras.length === 0) {
      Swal.fire({
        title: 'Aviso',
        text: 'Por favor, selecciona al menos una pizarra para eliminar',
        icon: 'warning'
      });
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar ${selectedPizarras.length} pizarra(s)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(
          selectedPizarras.map(id => axios.delete(`${API_URL}/${id}`))
        );
        setPizarras(prev => prev.filter(pizarra => !selectedPizarras.includes(pizarra.id)));
        setSelectedPizarras([]);
        setIsDeleteMode(false);
        
        Swal.fire(
          '¡Eliminado!',
          'Las pizarras seleccionadas han sido eliminadas.',
          'success'
        );
      } catch (error) {
        console.error("Error deleting pizarras:", error);
        Swal.fire(
          'Error',
          'No se pudieron eliminar las pizarras',
          'error'
        );
      }
    }
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    if (isDeleteMode) {
      setSelectedPizarras([]);
    }
  };

  return (
    <div style={{ padding: "10px", backgroundColor: "#000", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#FFD700" }}>Pizarras</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => handleCreatePizarra()}
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
          <button
            onClick={toggleDeleteMode}
            style={{
              padding: "10px 15px",
              backgroundColor: isDeleteMode ? "#ff4444" : "#666",
              color: "#FFF",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" }}>
        {pizarras.map((pizarra) => (
          <div
            key={pizarra.id}
            style={{
              padding: "20px",
              backgroundColor: "#FFF",
              color: "#000",
              borderRadius: "10px",
              textAlign: "center",
              position: "relative",
              cursor: isDeleteMode ? "default" : "pointer",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              border: selectedPizarras.includes(pizarra.id) ? "2px solid #ff4444" : "none",
            }}
            onClick={() => {
              if (isDeleteMode) {
                handleSelectPizarra(pizarra.id);
              } else {
                handleEditPizarra(pizarra.id);
              }
            }}
          >
            {isDeleteMode && (
              <input
                type="checkbox"
                checked={selectedPizarras.includes(pizarra.id)}
                onChange={() => handleSelectPizarra(pizarra.id)}
                style={{ position: "absolute", top: "10px", right: "10px" }}
              />
            )}
            <img
              src={pizarra.contenido}
              alt={`Pizarra ${pizarra.titulo}`}
              style={{
                width: "100%",
                height: "100px",
                objectFit: "cover",
                borderRadius: "5px",
                backgroundColor: "#FFF",
              }}
            />
            <h3>{pizarra.titulo}</h3>
            <p style={{ fontSize: '0.8em', color: '#666' }}>
              Creado: {new Date(pizarra.fecha_creacion).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {isDeleteMode && selectedPizarras.length > 0 && (
        <div style={{
          marginTop: "20px",
          textAlign: "center",
        }}>
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
            Eliminar seleccionadas ({selectedPizarras.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default PizarraAdmin;
