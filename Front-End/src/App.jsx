import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import CryptoPrices from "./componentes/CryptoPrices";
import AllCryptos from "./componentes/pages/AllCryptos";
import CryptoSummary from "./componentes/CryptoSummary";
import FullScreenCanvas from "./componentes/FullScreenCanvas";
import Chat from "./componentes/pages/Chat";
import NavBar from "./componentes/NavBar";
import PizarraAdmin from "./componentes/pages/PizarraAdmin";
import Header from "./componentes/Header"; // Importa el nuevo Header
import AdminCryptos from "./componentes/pages/AdminCryptos";
const { ipcRenderer } = window.require('electron');

const App = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const location = useLocation();

  useEffect(() => {
    const updateDateTime = () => {
      const date = new Date();
      const days = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
      setCurrentDay(days[date.getDay()]);
      setCurrentDate(date.toLocaleDateString("es-ES"));
      setCurrentTime(
        date.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "320px",
        height: "auto",
        backgroundColor: "#000",
        color: "#FFF",
        overflow: "hidden",
        paddingBottom: location.pathname === "/fullscreen-canvas" ? "0" : "60px",
        paddingTop: "10px",
        paddingLeft: "10px",
        paddingRight: "10px",
        marginBottom: "30px",
      }}
    >

      {location.pathname !== "/fullscreen-canvas" &&
        location.pathname !== "/pizarra-admin" &&
        location.pathname !== "/all-cryptos" &&
        location.pathname !== "/chat" && (
          <Header
            currentDay={currentDay}
            currentDate={currentDate}
            currentTime={currentTime}
          />
        )}

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100% - 50px)",
          overflow: "hidden",
          backgroundColor: "#000",
          borderRadius: "10px",
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <CryptoSummary />
                <div
                  style={{
                    flex: "0 0 auto",
                    overflowX: "scroll",
                    overflowY: "hidden",
                    padding: "10px",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <CryptoPrices />
                </div>
              </div>
            }
          />
          <Route path="/all-cryptos" element={<AllCryptos />} />
          <Route path="/fullscreen-canvas" element={<FullScreenCanvas />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/pizarra-admin" element={<PizarraAdmin />} />
          <Route path="/admin-cryptos" element={<AdminCryptos />} />
        </Routes>
      </main>

      {location.pathname !== "/fullscreen-canvas" && <NavBar />}
    </div>
  );
};

export default App;
