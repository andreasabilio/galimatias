
//var dispatcher = require('./dispatcher');
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
  var candidates    = include({path: path, depth: 1});
  var validServices = _.reduce(candidates, graph.validate, {});

  //
  var serviceGraph = _.reduce(validServices, graph.process, {});
  var serviceApis  = yield serviceGraph.init.call(this);



  // Return service apis
  return serviceApis;
};