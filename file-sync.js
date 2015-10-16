var watch = require('watch'),
    request = require('request'),
    fs = require('fs'),
    path = require('path');

var localpath = '/Users/brian.hazzard/Desktop/webdav/',
    davPath = 'https://brianecross@gmail.com:WebDavTest123@dav.box.com/dav/';

watch.createMonitor('/Users/brian.hazzard/Desktop/webdav/', {
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
  var filePath = path.relative(localpath, f);
  console.log(davPath + filePath);
  fs.createReadStream(f)
    .pipe(
      request
        .put(davPath + filePath)
        .on('response', function(response) {
          console.log(response.statusCode);
        })
    );
}

function mkdir(f) {
  var filePath = path.relative(localpath, f);
  console.log(davPath + filePath);
  request({
    method: 'MKCOL',
    uri: davPath + filePath
  }).on('response', function(response) {
    console.log(response.statusCode);
  });
}

function del(f) {
  var filePath = path.relative(localpath, f);
  console.log(davPath + filePath);
  request
    .del(davPath + filePath)
    .on('response', function(response) {
      console.log(response.statusCode);
    });
}
