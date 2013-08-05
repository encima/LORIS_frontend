var mysql = require('mysql');

/*
 * GET home page.
 */

exports.page = function(req, res){
  res.render('data', { locations: null} );
};