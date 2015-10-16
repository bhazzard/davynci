var watch = require('watch'),
    request = require('request'),
    fs = require('fs'),
    path = require('path'),
    low = require('lowdb');
var db = low('db.json');

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
    var remoteURL = remote + filePath;
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
          if (!error) {
            console.log(response.headers.etag);
            db('syncdb').push({ etag: response.headers.etag, href: remoteURL});
            console.log(db('syncdb').find({etag: response.headers.etag}));
          } else {
            console.log(error);
          }
        })
      );
  }

  function mkdir(f) {
    var filePath = path.relative(local, f);
    var remoteURL = remote + filePath;
    console.log(remoteURL);
    request({
      method: 'MKCOL',
      uri: remoteURL,
      auth: {
        user: username,
        pass: password
      }
    }, function(error, response, body) {
      if (!error) {
        console.log(response.headers);
      } else {
        console.log(error);
      }
    });
  }

  function del(f) {
    var filePath = path.relative(local, f);
    var remoteURL = remote + filePath;
    console.log(remoteURL);
    request({
      method: 'DELETE',
      url: remoteURL,
      auth: {
        user: username,
        pass: password
      }
    }, function(error, response, body) {
      if (!error) {
        db('syncdb').remove({href: remoteURL});
        console.log(db('syncdb').find({href: remoteURL}));
      } else {
        console.log(error);
      }
    });
  }

};
