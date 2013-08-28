var config = require('../config'),
    db = require('../local_db'),
    fs = require('fs'),
    util = require('util'),
    mmm = require('mmmagic'),
    Magic = mmm.Magic;

exports.uploadRule = function(req, res){
  res.render('upload_rule', { title: config.title });
};

exports.uploadImage = function(req, res){
  res.render('upload_image', { title: config.title });
};

exports.readFile = function(req, res){
	res.render('read', { title: 'Read File' });
};

exports.listRules = function(req, res){
	var connection = db.initializeConnection();
	connection.query("SELECT * FROM rule_uploads;", function(err, rows, fields) {
		if(err) throw err;
		console.log(rows);
		res.render('rules', {title: 'Fire Rules', rules: rows});	
	});
};