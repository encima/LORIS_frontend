var mysql = require('mysql');
var config = require('./config');

var connection = mysql.createConnection({
  host     : config.rds_host,
  user     : config.rds_user,
  password : config.rds_pwd,
  database : config.rds_db,
});

var connect = function() {
  connection.connect(function(err){
    if(!err){
          console.log("You are connected to the database.");
    }
    else{
          throw err;
    }
    })
};

var end = function() {
  connection.end(function(err){
    if(!err){
          console.log("Mysql connection is terminated.")
    }
    else{
          throw err;
    }
  })
};

module.exports = {
  connect: connect,
  connection: connection,
  end: end,
}
