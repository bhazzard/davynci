var BrowserWindow = require('browser-window');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

exports.load = function(config) {
  var mainWindow = createWindow();
  sendConfig(mainWindow, config);
  handleClose(mainWindow);
};

function createWindow() {
  var mainWindow = new BrowserWindow({width: 800, height: 600});
  //mainWindow.openDevTools();
  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  return mainWindow;
}

function sendConfig(mainWindow, config) {
  var webContents = mainWindow.webContents;

  if (config) {
    webContents.on('did-finish-load', function() {
      webContents.send('config', config);
    });
  }
}

function handleClose(mainWindow) {
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}
