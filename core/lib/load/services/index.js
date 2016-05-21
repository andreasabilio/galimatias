
var include = require('../../include');
var loader  = require('./loader');
//var runner  = require('./runner');
var co      = require('co');
var _       = require('lodash');


var initSrv = function(service){

  // XXX
  console.log('+++', service.id);

  // TODO: yield
  return this.runInAlowed(service.init);
};

var buildMap = function(services){
  var out = services.reduce(function(srvMap, service){
    srvMap[service.id] = service;
    return srvMap;
  }, {});

  console.log('///', out);

  return out;
};


//  var xxx =_.partial(_.reduce, _, function(srvMap, service){
//
//
//
//  // XXX
//  console.log('xxx', service.id);
//
//  srvMap[service.id] = service;
//
//  return srvMap;
//
//}, {});

// XXX
//console.log('$$$', buildMap);


// var xxx = function(services){
//
//  return _.reduce(services, function(srvMap, service){
//
//
//
//    return services;
//  }, {});
//
//};


module.exports = function(path, doFork){

  // XXX
  console.log('>>> sssss', this);


  // Get service candidates
  var candidates = include({
    path: path,
    depth: 1
  });


  // XXX
  //console.log('>>>', arguments);

  var out = _.reduce(candidates, loader.validate, [])
    .map(loader.process)
    .reduce(loader.queue, [])
    .map(initSrv, this);


  // XXX
  console.log('### load.services out:', out);

  //out.then(buildMap);

  // Load services
  return out;

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