
var dispatcher = require('./dispatcher');
var Promise    = require('bluebird');
var DepGraph   = require('dependency-graph').DepGraph;
var include    = require('../../include');
var semver     = require('semver');
var co         = require('co');
var _          = require('lodash');
var S          = require('../../../s');

var depGraph      = new DepGraph();
//var srvCollection = {};



var initSrvApi = function(service){

  // DEV
  var apiBase = {
    fetch: function(){},
    create: function(){},
    update: function(){},
    remove: function(){}
  };

  // Register service api
  service.api = service.api || apiBase;

  return _.extend({}, service.api, {
    id:      service.id,
    name:    service.manifest.name,
    version: service.manifest.version
  });
};



var __walker = function(service){

  //return {isApi: true, id: service.id};

  // XXX
  console.log('+++ run:', service);
  //console.log(' ');

  // TODO: verify whether run init (active)

  // Run init
  return dispatcher.run.generator({
    ctx:  _.omit(service, ['init', 'activable', 'active']),
    gen:  service.init,
    args: {isInitS: true}
  })
    .then(initSrvApi.bind(service))
    .tap(function(srvApi){

      var logMsg = [
        'Service',
        srvApi.manifest.name,
        'has been started.'
      ].join(' ');


      // Log service initialization
      S.log('debug', logMsg);

    });
};


var Node = {

  _visitors:    [],
  dependencies: null,
  id:           null,

  visit: function(visitId){

    // Acknowledge visit?
    if(visitId)
      this._visitors.push(visitId);

    // Some visit has to be the last...
    if( _.isEqual(this._visitors, this.dependencies) )
      this.service.init();
  }
};



var graph = module.exports = {

  services: {},

  validate: function(services, candidate, srvId){

    // Service must have a manifest file
    if( !('manifest' in candidate) )
      return services;

    // Service must have a init function
    if( !('init' in candidate) || !_.isFunction(candidate.init) )
      return services;

    // Service must declare a valid version in manifest
    if( !('version' in candidate.manifest) )
      return services;

    // Declared version must be valid
    if( _.isNull(semver.valid(candidate.manifest.version)) )
      return services;

    // Add to dep graph
    depGraph.addNode(srvId);

    // Assign id
    candidate.id = srvId;

    // Add to services map
    services[srvId] = candidate;

    // Return collection
    return services;
  },


  process: function(_graph, service, srvId, services){

    // XXX
    console.log('### process:', srvId);
    //console.log('AAA process:', arguments);


    // Register in graph store
    graph.services[srvId] = service;

    // Update service
    service.status = {
      activable: true,  // All services are assumed activable
      active: false     // All services are initially inactive
    };

    // Does service have any dependencies?
    if( !('dependencies' in service.manifest) )
      return graph;

    // Process dependencies
    service.status.activable = _.every(service.manifest.dependencies, function(version, depId){

      // Get required service
      var dependency = services[depId];
      //var dependency = _.find(services, {id: depId});

      // Is dep installed?
      if( !dependency ) return false;

      // Valid version combination?
      return semver.satisfies(dependency.manifest.version, version);

    }, this);

    // XXX
    //console.log('###', srvId, service.status.activable);


    // Is service activable?
    if( service.status.activable ){

      // Register in graph store
      graph.services[srvId] = service;

      // Obtain dependencies ids
      var deps = Object.keys(service.manifest.dependencies);

      // Have dependencies?
      if( _.isEmpty(deps) )
        return graph;


      // Register dep graph nodes
      deps.forEach(depGraph.addDependency.bind(depGraph, srvId));

    }else if(depGraph.hasNode(srvId)){

      // Remove node and dependants
      depGraph.dependantsOf(srvId).forEach(depGraph.removeNode);
      depGraph.removeNode(srvId);
    }

    // Done
    return graph;

    //return _.assign(service, status);
    //return {culo: true};
  },



  init: function(){

    // init local api store
    var api     = {};
    var counter = 0;
    var queue   = depGraph.overallOrder();

    var services = graph.services;
    var rootId   = queue[counter];
    var rootSrv  = services[rootId];
    //var ctx      = {isInitCtx: true, shared: true};
    //var args     = {isInitArgs: true, shared: true};

    // XXX
    //console.log('___ services', graph.services);
    console.log('___ rootId', queue);

    var visitor = function(out, service){


    };

    var out = _.reduce(queue, visitor, {});

    var walker = function(service, args){


      var ctx  = {isInitCtx: true, shared: true};
          args = args || {};

      console.log(' ');

      //return co( rootSrv.init.bind(ctx, args) ).then(function(statusCode){
      return co(function*(){

        // DEV
        //var _args = yield Promise.all(args);

        return rootSrv.init.call(ctx, args);

      }).then(function(statusCode){

        // XXX
        console.log(' ');
        console.log('___ service init done:', rootId, statusCode);
        return {isServiceApi: true, id: rootId};

      }).then(function(srvApi){

        // XXX
        console.log('___ api:', rootId, srvApi);

        var dependencies = depGraph.dependantsOf(rootId);

        // XXX
        //console.log('___ deps:', depGraph);
        console.log('___ srv:', rootId, rootSrv);
        console.log('___ deps:', rootId, dependencies);

        // DEV
        //Promise.all().then(function(){
        //  return api;
        //});
        //dependencies.forEach(function(childId){
        //
        //});


        // Register api
        api[rootId] = srvApi;

        return api;
      });
    };

    // XXX
    //console.log('___ run:', this);
    //console.log('___ run:', rootSrv);
    //console.log('___ run:', rootId);

    //return this.api;

    return walker(services[rootId], S);
  }
};