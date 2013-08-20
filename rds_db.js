var mysql = require('mysql');
var config = require('./config');

var connection;
var rds_config = {
  host     : config.rds_host,
  user     : config.rds_user,
  password : config.rds_pwd,
  database : config.rds_db,
};

var intializeConnection = function initializeConnection() {
    function addDisconnectHandler(connection) {
        connection.on("error", function (error) {
            if (error instanceof Error) {
                if (error.code === "PROTOCOL_CONNECTION_LOST") {
                    // console.error(error.stack);
                    console.log("Lost connection. Reconnecting...");

                    initializeConnection();
                } else if (error.fatal) {
                    throw error;
                }
            }
        });
    }

    connection = mysql.createConnection(rds_config);
    console.log("Remote db connection initialised");
    // Add handlers.
    addDisconnectHandler(connection);

    connection.connect();
    return connection;
}


module.exports = {
  connection: connection,
  initializeConnection: intializeConnection,
}
