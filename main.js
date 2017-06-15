'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;
var backgroundWindow = null
var ipc = require('electron').ipcMain;

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
      height: 700,
      resizable: false,
      width:   700
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
