var config = require('../config'),
    db = require('../local_db'),
    fs = require('fs'),
    util = require('util'),
    mmm = require('mmmagic'),
    Magic = mmm.Magic;
var exif = require('exif2');
// TO DO - Add checking of file contents against other files in dir, do not add.
/*
 * GET home page.
 */

exports.page = function(req, res){
  res.render('upload_image', { title: config.title });
};
/*
 * POST file.
 */

exports.uploadImage = function(request, response){
  console.log(request);
  console.log('Uploading');
  console.log("file name", request.files.file.name);                                           
  console.log("file path", request.files.file.path);
  var file = request.files.file;
  var body = request.body;

  var magic = new Magic(mmm.MAGIC_MIME_TYPE);
  magic.detectFile(file.path, function(err, result) {
    if (err) throw err;
    console.log(result);
    if(result == 'image/jpeg') {
      exif(file.path, function(err, obj){
        if(err) throw err;
        console.log(obj);
      });
    }
  }); 
  
  response.statusCode = 200;
  response.redirect('/image/upload');
};
