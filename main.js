'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;
var ipc = require('ipc');

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        frame: false,
        height: 700,
        resizable: false,
        width:   1100 });

    mainWindow.loadUrl('file://' + __dirname + '/app/index.html');
});