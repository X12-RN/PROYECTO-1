// src/componentes/pages/AdminCryptos.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminCryptos = () => {
  const [cryptos, setCryptos] = useState([]);

  const fetchCryptos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/criptomonedas/precios");
      setCryptos(response.data.monedas || []);
    } catch (error) {
      console.error("Error fetching cryptos:", error);
      Swal.fire("Error", "No se pudieron cargar las criptomonedas", "error");
    }
  };

  useEffect(() => {
    fetchCryptos();
    // Ocultar el header
    const header = document.querySelector('header');
    if (header) {
      header.style.display = 'none';
    }
    // Mostrar el header cuando el componente se desmonte
    return () => {
      if (header) {
        header.style.display = '';
      }
    };
  }, []);

  const handleEdit = async (id, nombre, cantidadActual) => {
    try {
      const { value: newQuantity } = await Swal.fire({
        title: `Editar cantidad de ${nombre}`,
        input: "text",
        inputLabel: "Nueva cantidad",
        inputValue: cantidadActual.toString(),
        showCancelButton: true,
        confirmButtonText: "Actualizar",
        cancelButtonText: "Cancelar",
        inputAttributes: {
          step: "any"
        },
        preConfirm: (value) => {
          const parsedValue = parseFloat(value);
          if (!value || isNaN(parsedValue) || parsedValue < 0) {
            Swal.showValidationMessage("Por favor, ingrese un número válido mayor o igual a 0");
            return false;
          }
          if (!/^\d*\.?\d+$/.test(value)) {
            Swal.showValidationMessage("El formato debe ser un número decimal válido");
            return false;
          }
          return parsedValue;
        }
      });
  
      if (newQuantity !== false && newQuantity !== undefined) {
        console.log('Sending update request:', {
          id,
          cantidad: newQuantity
        });
  
        const response = await axios.put(
          `http://127.0.0.1:5000/criptomonedas/monedas/${id}`,
          {
            cantidad: newQuantity
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        if (response.status === 200) {
          await fetchCryptos();
          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'La cantidad ha sido actualizada correctamente'
          });
        }
      }
    } catch (error) {
      console.error("Error updating crypto:", error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la cantidad. Por favor, intente nuevamente.'
      });
    }
  };

  const handleAdd = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Agregar Nueva Criptomoneda",
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%;">
          <input id="swal-crypto-name" 
                 class="swal2-input" 
                 placeholder="Nombre Completo (ej: Yearn Finance)" 
                 style="width: 90%; text-align: center; font-size: 14px;" />
          <input id="swal-crypto-symbol" 
                 class="swal2-input" 
                 placeholder="Símbolo (ej: YFI)" 
                 style="width: 90%; text-align: center; font-size: 14px;" />
          <input id="swal-crypto-quantity" 
                 class="swal2-input" 
                 type="number" 
                 step="0.0001" 
                 placeholder="Cantidad" 
                 style="width: 90%; text-align: center; font-size: 14px;" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nombre = document.getElementById("swal-crypto-name").value;
        const simbolo = document.getElementById("swal-crypto-symbol").value;
        const cantidad = document.getElementById("swal-crypto-quantity").value;
        
        if (!nombre || !simbolo || !cantidad) {
          Swal.showValidationMessage("Por favor complete todos los campos");
          return false;
        }
        return { 
          nombre: nombre.trim().toUpperCase(), 
          simbolo: simbolo.trim().toUpperCase(),
          cantidad: parseFloat(cantidad)
        };
      }
    });

    if (formValues) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/criptomonedas/monedas", 
          formValues
        );
        
        if (response.status === 201) {
          await fetchCryptos();
          Swal.fire("¡Éxito!", "Criptomoneda agregada correctamente", "success");
        }
      } catch (error) {
        console.error("Error adding crypto:", error);
        Swal.fire("Error", `No se pudo agregar la criptomoneda. ${error.response?.data?.error || ''}`, "error");
      }
    }
};

  const handleDelete = async (id, nombre) => {
    const result = await Swal.fire({
      title: "¿Eliminar criptomoneda?",
      text: `¿Estás seguro de eliminar ${nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://127.0.0.1:5000/criptomonedas/monedas/${id}`);
        await fetchCryptos();
        Swal.fire("Eliminada", "La criptomoneda ha sido eliminada", "success");
      } catch (error) {
        console.error("Error deleting crypto:", error);
        Swal.fire("Error", "No se pudo eliminar la criptomoneda", "error");
      }
    }
  };

  return (
    <div style={{ 
      padding: "10px",
      backgroundColor: "#000",
      minHeight: "100vh",
      color: "#FFD700"
    }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Administración de Criptomonedas
      </h1>

      {/* BOTON PAR AGREGAR CRIPTOS */}
      <div style={{ 
        display: "flex",
        justifyContent: "center",
        marginBottom: "30px"
      }}>
        <button
          onClick={handleAdd}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          Agregar Nueva Cripto
        </button>
      </div>

      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "10px",
        backgroundColor: "#111",
        borderRadius: "10px"
      }}>
        {cryptos.map((crypto) => (
          <div
            key={crypto.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "10px",
              border: "1px solid #333",
            }}
          >
            {/* SECCIÓN DE ARRIBA */}
            <div style={{ display: "flex", flexDirection: "row" }}>
              {/* Segmento 1: Logo */}
              <div style={{
                flex: "0 0 60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                padding: "0",
                marginRight: "10px"
              }}>
                <img
                  src={crypto.logo}
                  alt={crypto.nombre}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%"
                  }}
                />
              </div>

              {/* Segmento 2: Nombre y Cantidad */}
              <div style={{
                flex: "1",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div style={{
                  color: "#FFF",
                  borderRadius: "5px",
                  padding: "0",
                  textAlign: "center",
                  marginBottom: "5px"
                }}>
                  <div style={{ fontWeight: "bold", fontSize: "16px" }}>{crypto.nombre}</div>
                </div>
                <div style={{
                  color: "#FFF",
                  borderRadius: "5px",
                  padding: "0",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "14px" }}>Cantidad: {crypto.cantidad}</div>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE ABAJO */}
            <div style={{
              borderRadius: "10px",
              padding: "0",
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              gap: "10px"
            }}>
              <button
                onClick={() => handleEdit(crypto.id, crypto.nombre, crypto.cantidad)}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "#FFF",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  flex: "1"
                }}
              >
                EDITAR
              </button>
              <button
                onClick={() => handleDelete(crypto.id, crypto.nombre)}
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  flex: "1"
                }}
              >
                ELIMINAR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCryptos;