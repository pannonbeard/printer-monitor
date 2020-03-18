const { app, BrowserWindow, ipcMain } = require('electron');

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 800, height: 600, transparent: false,
    webPreferences: { // <--- (1) Additional preferences
      nodeIntegration: false,
      preload: __dirname + '/preload.js' // <--- (2) Preload script
  }});
win.loadURL('http://localhost:3000'); // <--- (3) Loading react
  
// win.webContents.openDevTools();

win.on('closed', () => {  
    win = null
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
});

const printers = []

ipcMain.on('something-sent', (event, args) => {
  console.log("sent", args)
})

ipcMain.on('get-printers', (event, args) => {
  event.returnValue = printers
})

ipcMain.on('add-printer', (event, args) => {
  printers.push(args)
})