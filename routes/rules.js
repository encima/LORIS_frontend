var util = require('util'),
config = require('../../config');

exports.fire = function(req, res){
  res.render('fire', {title: 'Fire Rules'});	
};