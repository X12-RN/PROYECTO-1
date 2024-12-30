import React, { useState, useRef } from "react";

const AssistantForm = () => {
  const [response, setResponse] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userInput = inputRef.current?.value; // Obtener el valor del campo de entrada
    if (!userInput) {
      setResponse("Por favor ingresa un mensaje.");
      return;
    }

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      setResponse("Falta la clave API de OpenAI.");
      return;
    }

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userInput }],
          max_tokens: 150,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching data from OpenAI:", error);
      setResponse("Hubo un error al procesar tu solicitud.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", paddingLeft: "5px", paddingTop: "5px", paddingBottom: "5px" }}>
      <label htmlFor="user-input" style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem", color: "white" }}>
        ¿Qué piensas hoy?
      </label>
      <textarea
        id="user-input"
        ref={inputRef}
        style={{
          width: "100%",
          height: "50px",
          marginBottom: "1rem",
          padding: "0.5rem",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
        placeholder="Escribe aquí..."
      ></textarea>
      <button
        type="submit"
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Consultar
      </button>
      <textarea
        disabled
        style={{
          width: "100%",
          marginTop: "1rem",
          padding: "0.5rem",
          borderRadius: "5px",
          border: "1px solid #ccc",
          minHeight: "100px",
          backgroundColor: "#f9f9f9",
          overflowY: "auto",
        }}
        value={response}
      />
    </form>
  );
};

export default AssistantForm;