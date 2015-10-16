var fs = require('fs'),
    path = require('path');
var app = require('app');

var appPath = app.getAppPath(),
    configPath = path.join(appPath, 'user_config.json');

exports.getConfig = function(callback) {
  fs.readFile(configPath, {encoding: 'utf-8'}, function(err, data){
    if(!err) {
      callback(undefined, data);
    } else {
        callback(err, undefined);
    }
  });
}
