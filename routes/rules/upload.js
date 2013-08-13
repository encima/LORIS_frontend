var config = require('../../config'),
    db = require('../../local_db'),
    fs = require('fs'),
    util = require('util');
// TO DO - Add checking of file contents against other files in dir, do not add.
/*
 * GET home page.
 */

exports.page = function(req, res){
  res.render('upload', { title: config.title });
};
/*
 * POST file.
 */

exports.upload = function(request, response){
  console.log(request);
  console.log('Uploading');
  console.log("file name", request.files.file.name);                                           
  console.log("file path", request.files.file.path);
  console.log("project", request.body.project);
  var file = request.files.file;
  var body = request.body;

  if(file.name.split('.').pop() == 'drl') {
    response.send('Not a rule file!');  
  }
  // db.connect();
  db.connection.query('SELECT MAX(id) AS id FROM rule_uploads;', function(err, rows, field) {
    if(err) throw err;
    var ruleID = rows[0].id + 1;
    var insert = util.format("INSERT INTO rule_uploads VALUES(%d, '%s', '%s', '%s');", ruleID, file.name, file.path, body.project);  
    db.connection.query(insert, function(err, rows, fields) {
      if(err) throw err;
      // db.end();
    });
  });
  
  response.statusCode = 200;
  response.redirect('/rules/upload');
};
