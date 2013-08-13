var util = require('util');
var db = require('../../local_db');
var soap = require('soap');
var fs =  require('fs');
var id = 1;

exports.read = function(req, res){
  	// db.connect();
	res.render('read', { title: 'Read File' });
};

exports.insert = function(req, res) {
	// db.connect();
	var query = util.format("SELECT %s(%s) AS id FROM %s;", 'MAX', 'id', 'rules');
	console.log(query);
	db.connection.query(query, function(err, rows, fields) {
		if (err) throw err;
		id = rows[0].id + 1;
		db.connection.query("INSERT INTO rules VALUES(" + id + ", '" + req.body.contents + "');", function(err, rows, fields) {
		  if (err) throw err;

		  console.log('Rule Inserted');
		  // db.end();
		});
	});

	res.result = 'Rule Inserted';
	res.statusCode = 200;
	res.end();
};

exports.readFile = function(req, res) {
	fs.readFile(req.body.path, 'utf8', function(err, data) {
		res.end(JSON.stringify(data));
	});
};
