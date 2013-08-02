var config = require('../config'),
    fs = require('fs');
/*
 * POST file.
 */

exports.upload = function(request, response){
  console.log('Uploading');
  console.log("file name", request.files.file.name);                                           
  console.log("file path", request.files.file.path);
  var file = request.files.file;
// Writes file as upload name, uses auto id otherwise
  fs.renameSync(request.files.file.path, config.upload_dir + '/' + request.files.file.name);
  response.statusCode = 200;
  response.end();
};