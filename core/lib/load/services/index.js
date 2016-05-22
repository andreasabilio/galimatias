
var dispatcher = require('./dispatcher');
var include    = require('../../include');
var loader     = require('./loader');
var graph      = require('./graph');
var async      = require('async');
var co         = require('co');
var _          = require('lodash');


//var initSrv = function(service){
//
//  // XXX
//  //console.log('+++', service.id, x);
//  console.log(' ');
//
//  // Run init
//  return dispatcher.run.generator({
//    ctx:  {ctx: true},
//    gen:  service.init,
//    args: _.omit(service, ['init', 'activable', 'active'])
//  })
//    .then(initSrvApi.bind(service))
//    .tap(function(srvApi){
//
//    var logMsg = [
//      'Service',
//      srvApi.manifest.name,
//      'has been started.'
//    ].join(' ');
//
//
//    // Log service initialization
//    S.log('debug', logMsg);
//
//  });
//};
//
//var initSrvApi = function(service){
//
//  // DEV
//  var apiBase = {
//    fetch: function(){},
//    create: function(){},
//    update: function(){},
//    remove: function(){}
//  };
//
//  // Register service api
//  service.api = service.api || apiBase;
//
//  return _.extend({}, service.api, {
//    id:      service.id,
//    name:    service.manifest.name,
//    version: service.manifest.version
//  });
//};


module.exports = function*(path, doFork){

  // Setup
  var candidates        = include({path: path, depth: 1});
  var validServices     = _.reduce(candidates, graph.validate, {});
  var installedServices = _.mapValues(validServices, graph.process);
  var serviceQueue      = _.reduce(installedServices, graph.queue, []);
  var serviceApis       = _.map(serviceQueue, graph.run);

  //// Setup
  //var candidates        = include({path: path, depth: 1});
  //var validServices     = _.reduce(candidates, loader.validate, {});
  //var installedServices = _.mapValues(validServices, loader.process);
  //var serviceQueue      = _.mapValues(installedServices, loader.queue);

  // XXX
  //console.log('*** services:', candidates);
  //console.log('*** valid:', validServices);
  //console.log('*** installed:', installedServices);
  //console.log('QQQ serviceQueue:', serviceQueue);
  //console.log('AAA serviceApis:', serviceApis);


  // Return service apis
  // TODO: possible mismatch k -> v
  return _.zipObject(Object.keys(installedServices), serviceApis);
  //return {};

};