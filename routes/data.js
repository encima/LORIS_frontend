var config = require('../config'),
	rds_db = require('../rds_db'),
	util = require('util');

/*
 * GET home page.
 */

exports.page = function(req, res){
  // rds_db.connect();
  var query = 'SELECT * FROM Locations';
  var connection = rds_db.initializeConnection();
  connection.query(query, function (err, rows, fields) {
	if (err) {
		rds_db.end();
		rds_db.connect();
		throw err;
	}
	return res.render('data', { locs: rows, title: config.title, maps_key: config.google_maps_key} );
  });  
};

exports.locations = function(req, res) {
  var loc_id = req.body.id;
  var connection = rds_db.initializeConnection();
  var query = util.format("SELECT s.`Name`, c.`Species_ID`, c.`Obs_ID`, o.`Obs_Date`, o.`Obs_Time`, l.`Lat`, l.`Lng`, o.`Taken_ID`, o.`moonphase` \
	FROM Observations o \
	LEFT OUTER JOIN `Contents_Classifications` c ON o.`Obs_ID` = c.`Obs_ID` \
	LEFT OUTER JOIN `Locations` l on l.`Loc_ID` = o.`Taken_ID` \
	LEFT OUTER JOIN `Species_Classifications` s ON s.`Species_ID` = c.`Species_ID` \
	WHERE l.`Loc_ID` = %s and c.`Obs_ID` IS NOT NULL  ORDER BY s.`Name` DESC;", loc_id);
  connection.query(query, function (err, rows, fields) {
	if (err) {
		rds_db.end();
		rds_db.connect();
		throw err;
	}
	res.status_code = 200;
	res.end(JSON.stringify(rows));
  });  

};
