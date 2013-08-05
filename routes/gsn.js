var config = require('../config'),
    fs = require('fs'),
	xml2js = require('xml2js');

exports.vsensor = function(req, res){
	// var files = fs.readdirSync(config.gsn_vsensor_dir, function(err, result) {
	// 	console.log('done');
	// });
	var sensors = fs.readdirSync(config.gsn_vsensor_dir);
	res.end(extractXML(sensors));
	// return res.send(JSON.stringify(sensors));
 // return res.send(JSON.stringify(sensors));
	
};

function extractXML(files) {
	//change to be synchronous and wait for array!
		var sensors = [];
		var running = 0;
		for(var i in files) {
			var running = 1;
		  var ext = files[i].split('.').pop();
		  if(ext == 'xml' || ext == 'XML') {
		  	console.log(files[i]);
			var parser = new xml2js.Parser();
		  	fs.readFile(config.gsn_vsensor_dir + '/' + files[i], function(err, data) {
		  	    parser.parseString(data, function (err, result) {
		  	        for(i in result) {
		  	        	console.log(i)
		  	        	if (typeof result[i] == 'object') {
		  	        		console.log('')
		  	        	}
		  	        }
		  	        sensors.push(result);	  	        
		  	    });
		  	});
		  }
		}
		while(running == 1) {}
		return JSON.stringify(sensors);
};