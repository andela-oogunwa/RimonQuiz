'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;
var ipc = require('electron').ipcMain;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        frame: false,
        height: 450,
        resizable: false,
        width:   350 });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
});

