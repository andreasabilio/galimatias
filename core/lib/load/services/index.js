
var include = require('../../include');
var loader  = require('./loader');
var co      = require('co');
var _       = require('lodash');


var initSrv = co.wrap(function*(service){

  // Grab S
  var S = this;

  // XXX
  //console.log('+++', service.id, service);
  console.log(' ');

  // Run service init
  var exitCode = yield S.runInCage(service.init, _.omit(service, ['init', 'activable', 'active']));

  var logMsg = [
    'Service',
    service.manifest.name,
    'has been started.',
    exitCode
  ].join(' ');

  S.log('debug', logMsg);

  delete service.init;

  // DEV
  var apiBase = {
    fetch: function(){},
    create: function(){},
    update: function(){},
    remove: function(){}
  };

  service.api = service.api || apiBase;

  return _.extend({}, service.api, {
    id: service.id,
    name: service.manifest.name,
    version: service.manifest.version
  });
  //return _.pick(service, ['manifest', 'api', 'id']);
});

var buildMap = function(srvMap, service){
  srvMap[service.id] = service;
  return srvMap;
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