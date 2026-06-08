/**
 * electron-main.js — Member 3 (UI & Accessibility Lead)
 * Desktop app entry point using Electron.
 * Runs as a native Windows/Mac/Linux app.
 */

const { app, BrowserWindow, clipboard, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 400,
    title: 'HandsFreeAI',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    // Accessibility: start maximized so content is large
    fullscreenable: true,
  });

  // Load the app (dev server or built file)
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'app.html'));
  }

  // Announce app is ready via system TTS (Windows/Mac)
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('app-ready');
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC: write text to system clipboard
ipcMain.handle('clipboard-write', (_, text) => {
  clipboard.writeText(text);
  return true;
});

// IPC: read system clipboard
ipcMain.handle('clipboard-read', () => {
  return clipboard.readText();
});
