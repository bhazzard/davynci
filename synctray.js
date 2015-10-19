var Menu = require('menu');
var Tray = require('tray');
var Wizard = require('./wizard');

exports.createTray = function(config) {
  var tray = new Tray(__dirname + '/assets/tray.png');
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Options',
      type: 'normal',
      click: function() {
        Wizard.load(config);
      }
    }
  ]);
  tray.setToolTip('Davynci Sync');
  tray.setContextMenu(contextMenu);
};
