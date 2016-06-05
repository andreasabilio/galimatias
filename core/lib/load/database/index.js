
var OrientDB = require('orientjs');

module.exports = function(config){

  var server = OrientDB({
    host: 'localhost',
    port: 2424,
    username: 'root',
    password: 'galimatias' // TODO: Read-protect this file!
  });

  var database = server.use({
    name: 'smalldev',
    username: 'admin',
    password: 'admin'
  });

  return {
    dbConn: server,
    db:     database
  }
};