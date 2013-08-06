var config = require('../config'),
    fs = require('fs'),
	xml2js = require('xml2js'),
	async = require('async');

exports.vsensor = function(req, res){

  var i = 0;
  var running = 1;
  var sensors = [];
  
  var files = [];
  // read in files and sfilter out xml files
  fs.readdirSync(config.gsn_vsensor_dir).forEach(function(file) {
  	var ext = file.split('.').pop();
  	if (ext == 'XML' || ext == 'xml') {
  		files.push(config.gsn_vsensor_dir + '/' + file);
  	}
  });
  // create results array of filtered files that contains the contents
  async.map(files, fs.readFile, function(err, results){
  	var parser = new xml2js.Parser();
  	// parse XML to JSON and send back to frontend
  	async.map(results, parser.parseString, function(err, results) {
  		res.end(JSON.stringify(results));  
  	});
  });
};