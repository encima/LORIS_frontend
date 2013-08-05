var config = require('../config'),
    fs = require('fs');

exports.vsensor = function(req, res){
	var files = fs.readdirSync(config.gsn_vsensor_dir);
	for(var i in files) {
	  console.log(files[i]);
	  var ext = f.name.split('.').pop();
	  console.log(ext);
	  return res.send('Done!');
	}
}