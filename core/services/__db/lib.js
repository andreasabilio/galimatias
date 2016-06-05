
var co = require('co');

var _remigrate = co.wrap(function*(db){

  //var SResource;

  // Get existing classes
  var classes = yield db.class.list().then(function(_classes){
    return _classes.map(function(_class){
      return _class.name;
    });
  });


  // Create if missing
  if( -1 === classes.indexOf('SResource'))
    yield db.exec('CREATE CLASS SResource EXTENDS V, ORestricted');


  // Get resource class
  var SResource = yield db.class.get('SResource');


  //yield SResource.property.create([{
  //  name: 'name',
  //  type: 'String'
  //}, {
  //  name: 'description',
  //  type: 'String'
  //}]);



  // Remove resources
  ////var out = yield db.exec('select from OUser where name=:name', {
  //var out = yield db.exec('CREATE CLASS SResource EXTENDS V, ORestricted', {
  //  //params: {
  //  //  name: 'SResource'
  //  //}
  //});
  //
  ////

  // XXX
  //console.log('>>>', SResource);
  //console.log('---', out);


  return db;

});

var lib = module.exports = {
  migrate: function (db) {

    // TODO: migration

    // XXX
    console.log('Created a database called ' + db.name);

    this.list().then(function (dbs) {

      // XXX
      //console.log('There are ' + dbs.length + ' databases on the server.');
      //console.log('>>>', dbs);

      //server.close();

      //return server;
    });

    // TODO: Run dbInit()

    return db;
  },
  dbInit: function(e){

    //XXX
    //console.error('XXXXXX', e);
    //server.close();
    //
    //this.list().then(function (dbs) {
    //
    //  //XXX
    //  //console.log('There are ' + dbs.length + ' databases on the server.');
    //  //console.log('>>>', dbs.map(function(db){
    //  //  return db.name;
    //  //}));
    //
    //  //server.close();
    //
    //  //return server;
    //});

    // Select core database
    var db = this.use({
      name: 'smalldev',
      username: 'admin',
      password: 'admin'
    });


    return _remigrate(db);
  }
};