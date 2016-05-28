
var OrientDB = require('orientjs');

module.exports = function*(S){

  // Log
  S.log('info', 'Starting ' + this.manifest.name + ' service...');

  var server = OrientDB({
    host: 'localhost',
    port: 2424,
    username: 'root',
    password: 'galimatias' // TODO: Read-protect this file!
  });

  var database = server.create({
    name: 'mydb',
    type: 'graph',
    storage: 'plocal'
  }).then(function (db) {

    // TODO: migration

    // XXX
    console.log('Created a database called ' + db.name);

    return server.list().then(function (dbs) {

      // XXX
      //console.log('There are ' + dbs.length + ' databases on the server.');
      //console.log('>>>', dbs);

      //server.close();

      return server;
    });
  }).catch(function(e){

    // XXX
    //console.error('XXXXXX', e);
    //server.close();

    return server.list().then(function (dbs) {

      //XXX
      //console.log('There are ' + dbs.length + ' databases on the server.');
      //console.log('>>>', dbs.map(function(db){
      //  return db.name;
      //}));

      //server.close();

      return server;
    });
  });

  // XXX
  //console.log('DDD', database);

  return database;

  //return {
  //  isServiceApi: true,
  //  name: this.manifest.name
  //};



};