var app = require('app');
var Configuration = require('./configuration');
var DAVsync = require('./davsync');
var SyncTray = require('./synctray');
var Wizard = require('./wizard');

// Report crashes to our server.
require('crash-reporter').start();

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  Configuration.getConfig(function(err, config) {
    if (!err) {
      config = JSON.parse(config);

      if (config.credentials.username && config.credentials.password
        && config.repositories.local && config.repositories.remote) {
        startSync(config);
      } else {
        Wizard.load(config);
      }
    } else {
      Wizard.load();
    }

    SyncTray.createTray(config);
  });
});

function startSync(config) {
  DAVsync.sync(
    config.credentials.username,
    config.credentials.password,
    config.repositories.local,
    config.repositories.remote
  );
}
