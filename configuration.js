var fs = require('fs'),
    path = require('path');
var app = require('app');

var appPath = app.getAppPath(),
    configPath = path.join(appPath, 'user_config.json');

exports.getConfig = function(callback) {
  try {
    fs.readFile(configPath, {encoding: 'utf-8'}, function(err, data){
      if(!err) {
        callback(undefined, data);
      } else {
          callback(err, undefined);
      }
    });
  } catch (e) {
    if (e.code == 'ENOENT') {
      callback(e, undefined);
    }
  }
}

exports.setConfig = function(config, callback) {
  try {
    fs.writeFile(configPath, JSON.stringify(config), function(err) {
      if (err) {
        callback(err);
        return;
      }
      callback();
    });
  } catch (e) {
    callback(e);
  }
}
