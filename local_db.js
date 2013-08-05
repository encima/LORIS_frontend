var mysql = require('mysql');
var config = require('./config');

var connection = mysql.createConnection({
  host     : config.mysql_host,
  user     : config.mysql_user,
  password : config.mysql_pwd,
  database : config.mysql_db,
});

var connect = function(db) {
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
