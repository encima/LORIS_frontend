var util = require('util');
var db = require('../local_db');
var id = 1;

exports.read = function(req, res){
  res.render('read', { title: 'Read File' });
};

exports.insert = function(req, res) {
	var connection = db.initializeConnection();
	var query = util.format("SELECT %s(%s) AS id FROM %s;", 'MAX', 'id', 'rules');
	console.log(query);
	connection.query(query, function(err, rows, fields) {
		if (err) throw err;
		id = rows[0].id + 1;
		connection.query("INSERT INTO rules VALUES(" + id + ", '" + req.body.contents + "');", function(err, rows, fields) {
		  if (err) throw err;

		  console.log('Rule Inserted');
		});
	});

	res.result = 'Rule Inserted';
	res.statusCode = 200;
	res.end();
};
