const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 950,
    height: 830,
    icon: path.join(__dirname, 'public', 'favicon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL("http://localhost:3000");

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
