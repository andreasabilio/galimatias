
var include = require('../../include');
var loader  = require('./loader');
var co      = require('co');
var _       = require('lodash');


var initSrv = co.wrap(function*(service){

  // Grab S
  var S = this;

  // XXX
  //console.log('+++', service.id, service.manifest.name);

  // Run service init
  var exitCode = yield S.runInCage(service.init, _.omit(service, 'init'));

  var logMsg = [
    'Service',
    service.manifest.name,
    'has been started. ',
    exitCode
  ].join(' ');

  S.log('debug', logMsg);

  delete service.init;

  service.api = service.api || {isApi: true};


  return _.pick(service, ['manifest', 'api', 'id']);
});

var buildMap = function(srvMap, service){

  srvMap[service.id] = service;

  return srvMap;


  //// XXX
  //console.log('   SRV:', service);
  ////console.log('MAPPER:', arguments);
  //
  //var service.then(function(srv){
  //  //console.log('///', srv);
  //  return srv;
  //});


  //// XXX
  ////console.log(' ID:', _service.id);
  //
  //srvMap.test = {};
  //
  //srvMap.test.xxx = 'yyy';
  //
  //srvMap.test[_service.id] = _service;
  //
  //// XXX
  //console.log('--- srvMap:', srvMap);
  ////console.log('||| service:', _service);
  //
  //return srvMap;


  //return service.then(function(srv){
  //  console.log('%%%', srvMap);
  //  srvMap[srv.id] = srv;
  //  return srv;
  //});
};


module.exports = function*(path, doFork){

  // XXX
  //console.log('>>> sssss', this);


  // Get service candidates
  var candidates = include({
    path: path,
    depth: 1
  });


  var services = yield _.reduce(candidates, loader.validate, [])
    .map(loader.process)
    .reduce(loader.queue, [])
    .map(initSrv, this);


  // XXX
  //console.log('### load.services out:', services);

  //out;

  // Load services
  return services.reduce(buildMap, {});

  // XXX
  //console.log('*** Services:', services);
  //
  //return runner.run(services);


  // DEV
  //var _services = include({
  //  path: path,
  //  depth: 1
  //});
  //
  //return _.forEach(_services, function(service){
  //  //service.init();
  //});

};