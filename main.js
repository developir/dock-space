const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const fs = require("fs");

function createWindow() {
  let win = new BrowserWindow({
    width: 600,
    height: 700,
    icon: path.join(__dirname, 'assets/icons/app.icns'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });
  win.loadFile('app/index.html');

  // Open the DevTools.
  // win.webContents.openDevTools();
}

// Watch for file changes in your project directory
function watchFiles() {
  const watchedDir = __dirname; // Change this to the folder you want to watch

  fs.watch(watchedDir, { recursive: true }, (eventType, filename) => {
    if (filename) {
      console.log(`File changed: ${filename}`);
      app.relaunch(); // Relaunch the app
      app.exit(); // Exit the current instance
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  // watchFiles();

  // set the Dock icon for macOS
  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(__dirname, 'assets/icons/app.icns'));
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
})