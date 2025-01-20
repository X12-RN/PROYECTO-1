const { app, BrowserWindow, session, ipcMain } = require('electron');
const path = require('path');

// Deshabilitar aceleración hardware
app.disableHardwareAcceleration();

// Añadir el manejador para cerrar la aplicación
ipcMain.on('quit-app', () => {
  app.quit();
});

function createWindow() {
  const win = new BrowserWindow({
    width: 320,
    height: 480,
    fullscreen: true,
    kiosk: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
      devTools: process.env.NODE_ENV !== 'production'
    }
  });

  // Set secure CSP headers
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
          "style-src 'self' 'unsafe-inline'; " +
          "img-src 'self' data: https: http: blob:; " +
          "font-src 'self' data: https:; " +
          "connect-src 'self' http://127.0.0.1:5000 ws://localhost:* http://localhost:*;"
        ]
      }
    });
  });

  // Cambiar a loadFile en producción
  if (process.env.NODE_ENV === 'production') {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    win.loadURL('http://localhost:5173');
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});