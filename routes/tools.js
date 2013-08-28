var config = require('../../config'),
    db = require('../local_db'),
    fs = require('fs'),
    util = require('util'),
    mmm = require('mmmagic'),
    Magic = mmm.Magic,
    exif = require('exif2'),
    exiv = require('exiv2');


exports.uploadImage = function(request, response){
  console.log(request);
  console.log('Uploading');
  console.log(request.files);
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

exports.uploadRule = function(request, response){
  console.log(request);
  console.log('Uploading');
  console.log("file name", request.files.file.name);                                           
  console.log("file path", request.files.file.path);
  console.log("project", request.body.project);
  var file = request.files.file;
  var body = request.body;

  if(file.name.split('.').pop() != 'drl') {
    response.send('Not a rule file!');  
  }

  var magic = new Magic();
  magic.detectFile(file.path, function(err, result) {
    if (err) throw err;
    console.log(result);
  });

  var connection = db.initializeConnection();
  connection.query('SELECT MAX(id) AS id FROM rule_uploads;', function(err, rows, field) {
    if(err) throw err;
    var ruleID = rows[0].id + 1;
    var insert = util.format("INSERT INTO rule_uploads VALUES(%d, '%s', '%s', '%s');", ruleID, file.name, file.path, body.project);  
    connection.query(insert, function(err, rows, fields) {
      if(err) throw err;
    });
  });
  
  response.statusCode = 200;
  response.redirect('/rules/upload');
};

exports.deleteRule = function(request, response) {
  var file = request.body.file;
  var connection = db.initializeConnection();
  var del = util.format("DELETE FROM rule_uploads WHERE path='%s';", file);  
  connection.query(del, function(err, rows, fields) {
    if(err) throw err;
    fs.unlinkSync(file);
    response.json('Rule Deleted');
  });
};

exports.readFile = function(req, res) {
  fs.readFile(req.body.path, 'utf8', function(err, data) {
    var lines = data.split(/\r?\n/);
    res.json(lines);
  });
};