var mysql = require('mysql');
var config = require('./config');

var connection;
var mysql_config = {
  host     : config.mysql_host,
  user     : config.mysql_user,
  password : config.mysql_pwd,
  database : config.mysql_db,
};

var intializeConnection = function initializeConnection() {
  // TODO Handle having so many connections open
    function addDisconnectHandler(connection) {
        connection.on("error", function (error) {
            if (error instanceof Error) {
                if (error.code === "PROTOCOL_CONNECTION_LOST") {
                    // console.error(error.stack);
                    console.log("Lost connection. Reconnecting...");

                    initializeConnection(connection.config);
                } else if (error.fatal) {
                    throw error;
                }
            }
        });
    }

    connection = mysql.createConnection(mysql_config);
    console.log("Local db connection initialised");
    // Add handlers.
    addDisconnectHandler(connection);

    connection.connect();
    return connection;
}


module.exports = {
  connection: connection,
  initializeConnection: intializeConnection,
}
