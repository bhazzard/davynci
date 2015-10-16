var watch = require('watch'),
    request = require('request'),
    fs = require('fs'),
    path = require('path');

exports.sync = function(username, password, local, remote) {
  watch.createMonitor(local, {
      'ignoreDotFiles': true,
      'ignoreNotPermitted': true
    }, function (monitor) {
    monitor.on("created", function (f, stat) {
      if(stat.isFile()) {
        upl(f);
        console.log('file created: ' + f);
      }
      if(stat.isDirectory()) {
        mkdir(f);
        console.log('directory created: ' + f);
      }
    });

    monitor.on("changed", function (f, curr, prev) {
      upl(f);
      console.log('file changed: ' + f);
    });

    monitor.on("removed", function (f, stat) {
      del(f);
      console.log('file removed: ' + f);
    });
  });

  function upl(f, stat) {
    var filePath = path.relative(local, f);
    var remoteURL = path.join(remote, filePath);
    console.log(remoteURL);
    fs.createReadStream(f)
      .pipe(
        request({
          method: 'PUT',
          url: remoteURL,
          auth: {
            user: username,
            pass: password
          }
        }, function(error, response, body) {
          console.log(response.status);
        })
      );
  }

  function mkdir(f) {
    var filePath = path.relative(local, f);
    console.log(remote + filePath);
    request({
      method: 'MKCOL',
      uri: remote + filePath,
      auth: {
        user: username,
        pass: password
      }
    }, function(error, response, body) {
      console.log(response.status);
    });
  }

  function del(f) {
    var filePath = path.relative(local, f);
    console.log(remote + filePath);
    request({
      method: 'DELETE',
      url: remote + filePath,
      auth: {
        user: username,
        pass: password
      }
    }, function(error, response, body) {
      console.log(response.status);
    });
  }

};
