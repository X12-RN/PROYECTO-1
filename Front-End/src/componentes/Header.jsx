import React from "react";
const { ipcRenderer } = window.require("electron");

const Header = ({ currentTime, currentDate, currentDay }) => {
  return (
    <div className="flex h-[80px] mb-3 rounded-lg shadow-lg bg-[#222222] p-2 gap-5">
      <div className="flex flex-col w-[85%] h-full">
        {/* Parte superior */}
        <div className="flex justify-between items-center h-1/2">
          {/* Saludo */}
          <div className="flex items-center text-[#FFFFFF]">
            <span className="font-medium">Bienvenido, </span>
            <span className="text-[#FFD700] ml-1 font-bold">Adrian</span>
          </div>

          {/* Hora */}
          <div className="text-[#FFFFFF] font-medium text-sm">
            <span>{currentTime}</span>
          </div>
        </div>

        {/* Parte inferior - Fecha y Día */}
        <div className="flex justify-between items-center h-1/2 gap-2">
          <div className="text-[#FFFFFF] text-sm">
            <span className="text-[#FFFFFF]">{currentDate}</span>
          </div>
          <div className="text-[#FFFFFF] text-sm font-bold">
            <span className="text-[#FFFFFF]">{currentDay}</span>
          </div>
        </div>
      </div>

      {/* Botón verde en la parte derecha */}
      <div className="w-[15%] h-full flex items-center justify-center">
        <button
          onClick={() => ipcRenderer.send("quit-app")}
          className="w-full h-full bg-[#00FF00] hover:bg-[#00CC00] transition-colors duration-200 rounded-lg flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-black"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Header;