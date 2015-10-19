var Menu = require('menu');
var Tray = require('tray');
var Wizard = require('./wizard');
var ipc = require('ipc');

var configuration = false;
exports.createTray = function(config) {
  configuration = config;

  var tray = new Tray(__dirname + '/assets/tray.png');
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Options',
      type: 'normal',
      click: function() {
        Wizard.load(configuration);
      }
    }
  ]);
  tray.setToolTip('Davynci Sync');
  tray.setContextMenu(contextMenu);
};

ipc.on('config.changed', function(event, config) {
  configuration = config;
});
