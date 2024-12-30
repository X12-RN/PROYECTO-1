import React, { useState, useRef } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: "system", content: "¡Hola! Soy tu asistente. ¿En qué puedo ayudarte hoy?" },
  ]);
  const inputRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userInput = inputRef.current.value.trim();

    if (!userInput) return;

    // Agregar mensaje del usuario a la conversación
    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    inputRef.current.value = "";

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) throw new Error("Falta la clave API de OpenAI.");

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: newMessages,
          max_tokens: 150,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();
      const assistantMessage = data.choices[0].message;

      // Agregar respuesta del asistente a la conversación
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error al procesar tu solicitud:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "system", content: "Hubo un error al procesar tu solicitud." },
      ]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
        padding: "10px",
        backgroundColor: "#111",
        color: "#FFF",
      }}
    >
      {/* Mensajes */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#222",
          borderRadius: "10px",
          border: "1px solid #333",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              textAlign: msg.role === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: msg.role === "user" ? "#00BFFF" : "#444",
                color: msg.role === "user" ? "#FFF" : "#DDD",
                maxWidth: "80%",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <textarea
          ref={inputRef}
          placeholder="Escribe tu mensaje aquí..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #333",
            backgroundColor: "#222",
            color: "#FFF",
            minHeight: "50px",
            resize: "none",
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#00BFFF",
            color: "#FFF",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Chat;
