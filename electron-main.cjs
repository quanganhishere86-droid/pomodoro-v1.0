const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');

let server;

function createWindow(port) {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true // Safe to turn on now that we use HTTP
    }
  });

  win.loadURL(`http://localhost:${port}`);
}

app.whenReady().then(() => {
  const expressApp = express();
  
  // Serve the static files from the dist folder
  expressApp.use(express.static(path.join(__dirname, 'dist')));
  
  // Catch-all route to serve index.html for any other requests (SPA support)
  expressApp.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
  
  // Start the server on a random free port
  server = expressApp.listen(0, '127.0.0.1', () => {
    const port = server.address().port;
    createWindow(port);
  });
});

app.on('window-all-closed', () => {
  if (server) {
    server.close();
  }
  if (process.platform !== 'darwin') app.quit();
});
