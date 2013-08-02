
/*
 * GET home page.
 */

exports.read = function(req, res){
  res.render('read', { title: 'Read File' });
};