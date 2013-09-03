exports.page = function(req, res){
  // rds_db.connect();
  var query = 'SELECT * FROM Locations';
  var connection = rds_db.initializeConnection();
  connection.query(query, function (err, rows, fields) {
	if (err) {
		throw err;
	}
	return res.render('occurrence', { occs: rows, title: config.title, maps_key: config.google_maps_key} );
  });  
};