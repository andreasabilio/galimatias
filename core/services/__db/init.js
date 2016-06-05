
var OrientDB = require('orientjs');



module.exports = function*(S){

  // Log
  //S.log('info', 'Starting ' + this.manifest.name + ' service...');

  //var server = OrientDB({
  //  host: 'localhost',
  //  port: 2424,
  //  username: 'root',
  //  password: 'galimatias' // TODO: Read-protect this file!
  //});
  //
  //// Migrate?
  //var database = yield server.create({
  //  name: 'smalldev',
  //  type: 'graph',
  //  storage: 'plocal'
  //}).then(this.lib.migrate.bind(server))
  //  .catch(this.lib.dbInit.bind(server));

  // XXX
  //console.log('DDD', database);

  return {};
};