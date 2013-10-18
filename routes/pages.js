var config = require('../config'),
    db = require('../local_db'),
    fs = require('fs'),
    async = require('async'),
    util = require('util'),
    mmm = require('mmmagic'),
    Magic = mmm.Magic;

exports.uploadRule = function(req, res){
  res.render('upload_rule', { title: config.title });
};

exports.uploadImage = function(req, res){
  res.render('upload_image', { title: config.title });
};

exports.uploadLoc = function(req, res) {
  res.render('upload_location', { title: config.title });	
}

exports.upload = function(req, res) {
	res.render('upload', { title: config.title });	
}

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

exports.locations = function(req, res) {
	var connection = db.initializeConnection();
	connection.query("SELECT * FROM location;", function(err, rows, fields) {
		if(err) throw err;
		res.render('locations', {title: config.title, locations: rows, maps_key: config.google_maps_key});
	});
};

exports.occurrences = function(req, res) {
	var connection = db.initializeConnection();
	var query = "SELECT * \
					FROM occurrence o \
					LEFT JOIN location l \
					ON o.locationid=l.id \
					LEFT JOIN  identification i \
					ON o.eventid = i.id \
					LEFT JOIN (SELECT eventid, GROUP_CONCAT(identifier) AS identifiers FROM imageset GROUP BY eventid) ic \
					ON o.eventid = ic.eventid";
	if(req.query.id != undefined) {
		query += " WHERE o.eventid = " + req.query.id + ";";
	}else{
		query += " LIMIT 1;";
	}
	console.log(query);
	connection.query(query , function(err, rows, fields) {
    	if(err) throw err;
    	console.log(rows);
		res.render('occurrences', {title: config.title, occs: rows, maps_key: config.google_maps_key});  
	});
};

exports.create = function(req, res) {
	fs.readFile('./views/dwc_creator.html', function (err, html) {
	    if (err) {
	        throw err; 
	    }       
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(html);  
        res.end();  
	});
};