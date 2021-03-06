'use strict';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var mainWindow = null;
var backgroundWindow = null
var ipc = electron.ipcMain;

ipc.on('close-main-window', function () {
    app.quit();
});

function onClosed() {
	mainWindow = null;
	backgroundWindow = null;
}

function createMainWindow() {
	const win = new BrowserWindow({
      frame: false,
      height: 600,
      resizable: false,
      width:   400
  });

	win.loadURL('file://' + __dirname + '/app/index.html');
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate-with-no-open-windows', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', function() {
    mainWindow = createMainWindow()
});
