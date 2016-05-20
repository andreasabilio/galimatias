
var requireAll = require('require-all');
var include    = require('../include');
var semver     = require('semver');
var _          = require('lodash');


// Primate functions
var loader = {

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


    // Add to services collection
    services.push(_.assign(candidate, {id: srvId}));

    // Add to dep graph
    depGraph.addNode(srvId);

    // Return collection
    return services;
  },

  process: function(service, index, services){

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
      var dependency = _.find(services, {id: depId});

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
        .forEach(depGraph.addDependency.bind(depGraph, service.id));

      //depGraph.addDependency(service.id, depId);
    }else if(depGraph.hasNode(service.id)){
      // Remove node and dependants
      depGraph.dependantsOf(service.id).forEach(depGraph.removeNode);
      depGraph.removeNode(service.id);
    }

    // Done
    return _.assign(service, status);
  },

  queue: function(queue, service){

    // Get init index of service init
    var _index = depGraph.overallOrder().indexOf(service.id);

    // Insert in queue
    queue[_index] = service;

    return queue;
  },

  run: function(services){

    // Register all services in core registry
    s.reg('srv', services);

    // Return promise
    return new Promise(function(resolve, reject){

      // Say hello!
      console.log(' ');
      s.core.log('info', 'Starting GO-TA services...');

      // Run!
      s.runner.call({
        services: services,
        resolve: resolve,
        reject: reject
      });

    });

  }
};

module.exports = function(path, doFork){

  // XXX
  //console.log('>>>', arguments);


  //// Get service candidates
  //var candidates = _.assign({}, requireAll(path));
  //
  //
  //// Load services
  //var services =_.reduce(candidates, loader.validate, [])
  //  .map(loader.process)
  //  .reduce(loader.queue, []);

  //loader.run(services).then(function(_services){
  //  console.log(_services);
  //});


  // DEV
  var _services = include({
    path: path,
    depth: 1
  });

  return _.forEach(_services, function(service){
    service.init();
  });

};