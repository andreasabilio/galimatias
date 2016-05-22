
var dispatcher = require('./dispatcher');
var Promise    = require('bluebird');
var DepGraph   = require('dependency-graph').DepGraph;
var include    = require('../../include');
var semver     = require('semver');
var co         = require('co');
var _          = require('lodash');

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





var graph = module.exports = {

  validate: function(services, candidate, srvId){

    // XXX
    //console.log('--- valiate:', srvId, candidate);
    //console.log('--- services:', services);

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
    //services.push(_.assign(candidate, {id: srvId}));
    services[srvId] = candidate;

    // Return collection
    return services;
  },



  _process: function(service, srvId, services){

    // XXX
    //console.log('### process:', srvId);
    //console.log('>>> process:', arguments);

    // Default status
    var status = {
      activable: true,  // All services are assumed activable
      active: false     // All services are initially inactive
    };

    // Does service have any dependencies?
    if( !('dependencies' in service.manifest) )
      return _.assign(service, status);

    // Process dependencies
    status.activable = _.every(service.manifest.dependencies, function(version, depId){

      // Get required service
      var dependency = services[depId];
      //var dependency = _.find(services, {id: depId});

      // Is dep installed?
      if( !dependency ) return false;

      // Valid version combination?
      return semver.satisfies(dependency.manifest.version, version);

    }, this);

    // Is service activable?
    if( status.activable ){

      // Have dependencies?
      if(!_.isEmpty(service.manifest.dependencies))
        return _.assign(service, status);

      // Register dep graph nodes
      Object.keys(service.manifest.dependencies)
        .forEach(depGraph.addDependency.bind(depGraph, srvId));

      //depGraph.addDependency(srvId, depId);
    }else if(depGraph.hasNode(srvId)){
      // Remove node and dependants
      depGraph.dependantsOf(srvId).forEach(depGraph.removeNode);
      depGraph.removeNode(srvId);
    }

    // Done
    return _.assign(service, status);
  },

  process: function(_graph, service, srvId, services){

    // XXX
    console.log('### process:', srvId);
    //console.log('### process:', arguments);

    // Default status
    var status = {
      activable: true,  // All services are assumed activable
      active: false     // All services are initially inactive
    };

    _graph.services        = _graph.services || {};
    _graph.services[srvId] = _.assign(service, status);

    var out = {
      services: _graph.services,
      run:      graph.run
    };

    // Does service have any dependencies?
    if( !('dependencies' in service.manifest) )
      return _.assign(service, status);

    // Process dependencies
    status.activable = _.every(service.manifest.dependencies, function(version, depId){

      // Get required service
      var dependency = services[depId];
      //var dependency = _.find(services, {id: depId});

      // Is dep installed?
      if( !dependency ) return false;

      // Valid version combination?
      return semver.satisfies(dependency.manifest.version, version);

    }, this);

    // Is service activable?
    if( status.activable ){

      // Have dependencies?
      if(!_.isEmpty(service.manifest.dependencies))
        return out;

      // Register dep graph nodes
      Object.keys(service.manifest.dependencies)
        .forEach(depGraph.addDependency.bind(depGraph, srvId));

      //depGraph.addDependency(srvId, depId);
    }else if(depGraph.hasNode(srvId)){
      // Remove node and dependants
      depGraph.dependantsOf(srvId).forEach(depGraph.removeNode);
      depGraph.removeNode(srvId);
    }

    // Done
    return out;

    //return _.assign(service, status);
    //return {culo: true};
  },


  // TODO: remove
  queue: function(queue, service){

    // Get init index of service init
    var _index = depGraph.overallOrder().indexOf(service.id);

    // Insert in queue
    queue[_index] = service;

    return queue;
  },



  run: function(){

    // init local api store
    var api = {};

    var services = this.services;
    var rootId   = depGraph.overallOrder().shift();
    var rootSrv  = this.services[rootId];
    var ctx      = {isInitCtx: true};
    var args     = {isInitArgs: true};

    var walker = function(service){

      return co( rootSrv.init.bind(ctx, args) ).then(function(statusCode){

        // XXX
        console.log('___ service init done:', rootId, statusCode);
        return {isServiceApi: true, id: rootId};

      }).then(function(srvApi){

        // XXX
        console.log('___ api:', rootId, srvApi);

        var dependencies = depGraph.dependantsOf(rootId);

        // XXX
        //console.log('___ deps:', depGraph);
        console.log('___ deps:', rootId, rootSrv);
        console.log('___ deps:', rootId, dependencies);


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

    return walker(services[rootId]);
  }
};