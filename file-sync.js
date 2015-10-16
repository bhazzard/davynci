var watch = require('watch'),
    request = require('request'),
    fs = require('fs'),
    path = require('path'),
    argv = require('yargs').argv;;

var localPath = argv.localPath,
    davUrl = argv.davUrl;

watch.createMonitor(localPath, {
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
  var filePath = path.relative(localPath, f);
  console.log(davUrl + filePath);
  fs.createReadStream(f)
    .pipe(
      request
        .put(davUrl + filePath)
        .on('response', function(response) {
          console.log(response.statusCode);
        })
    );
}

function mkdir(f) {
  var filePath = path.relative(localPath, f);
  console.log(davUrl + filePath);
  request({
    method: 'MKCOL',
    uri: davUrl + filePath
  }).on('response', function(response) {
    console.log(response.statusCode);
  });
}

function del(f) {
  var filePath = path.relative(localPath, f);
  console.log(davUrl + filePath);
  request
    .del(davUrl + filePath)
    .on('response', function(response) {
      console.log(response.statusCode);
    });
}
