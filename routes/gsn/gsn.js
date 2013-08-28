var config = require('../../config'),
    fs = require('fs'),
	xml2js = require('xml2js'),
	async = require('async');

exports.vsensor = function(req, res){
  
  var i = 0;
  var sensors = [];
  var files = [];

  // read in files and sfilter out xml files
  fs.readdirSync(config.gsn_vsensor_dir).forEach(function(file) {
  	var ext = file.split('.').pop();
  	if (ext == 'XML' || ext == 'xml') {
  		files.push(config.gsn_vsensor_dir + '/' + file);
  		sensors.push(file);
  	}
  });
  res.render('vsensor', {'title' : config.title, 'sensors': sensors});  
};

exports.vsensor_load = function(req, res) {
	//FIX, send back file contents!
	var file = config.gsn_vsensor_dir + '/' + req.body.file;
	fs.readFile(file, function(err, result) {
		var parser = new xml2js.Parser();
		parser.parseString(result, function(err, result) {
      // console.log(typeof result);
      // var lines = result.toString().split(/\r?\n/);
			res.end(JSON.stringify(result));
		});
	});
}

exports.read_all_vsensors = function(req, res) {
  var i = 0;
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
}