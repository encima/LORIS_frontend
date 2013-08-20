var util = require('util'),
config = require('../../config');
db = require('../../local_db');

exports.list = function(req, res){
	var connection = db.initializeConnection();
	connection.query("SELECT * FROM rule_uploads;", function(err, rows, fields) {
		if(err) throw err;
		console.log(rows);
		res.render('rules', {title: 'Fire Rules', rules: rows});	
	});
};