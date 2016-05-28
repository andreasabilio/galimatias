
var Promise    = require('bluebird');
var DepGraph   = require('dependency-graph').DepGraph;
var semver     = require('semver');
var co         = require('co');
var _          = require('lodash');

var depGraph      = new DepGraph();


var nodeBase = {

  visit: function(S, visitId, service){

    // Init visitor reg?
    if(!this._visitors)
      this._visitors = {};


    // Promise resolve fn wrapper
    var resolverFn = function(srvApi){
      this.resolve(srvApi);
      return srvApi;
    };

    // Promise singleton
    if(!this._promise){

      var handler = function(resolve, reject){
        // Bind resolver
        this._resolver = resolverFn.bind({resolve: resolve, reject: reject});
      };

      // Store promise for return
      this._promise = new Promise(handler.bind(this));
    }


    // Acknowledge visit?
    if(visitId && !(-1 === this.dependencies.indexOf(visitId))){
      this._visitors[visitId] = service;
    }

    // Get missing deps
    var missing = _.xor(Object.keys(this._visitors), this.dependencies);

    // Some visit has to be the last...
    if( !missing.length ){

      // Complete arg
      var s = _.assign({}, this._visitors, {log: S.log});

      var srvInit = co.wrap(this.service.init).bind(this.service, s);

      srvInit().then(this._resolver).catch(function(e){
        console.log('ERROR in graph srv init:', e);
        console.log(e.stack);
      });
    }

    // Always return a promise
    return this._promise;
  }
};



var graph = module.exports = {

  // Internal node map
  nodes: {},

  validate: function(nodes, candidate, srvId){

    // Service must have a manifest file
    if( !('manifest' in candidate) )
      return nodes;

    // Service must have a init function
    if( !('init' in candidate) || !_.isFunction(candidate.init) )
      return nodes;

    // Service must declare a valid version in manifest
    if( !('version' in candidate.manifest) )
      return nodes;

    // Declared version must be valid
    if( _.isNull(semver.valid(candidate.manifest.version)) )
      return nodes;

    // Add to dep graph
    depGraph.addNode(srvId);

    // Add to services map
    nodes[srvId] = _.assign({}, nodeBase, {
      id: srvId,
      service: candidate,
      dependencies: (candidate.manifest.dependencies)? Object.keys(candidate.manifest.dependencies) : []
    });

    // Return collection
    return nodes;
  },


  process: function(_graph, node, srvId, nodes){


    // Register in graph store
    graph.nodes[srvId] = node;

    // Update service
    node.status = {
      activable: true,  // All services are assumed activable
      active: false     // All services are initially inactive
    };

    // Does service have any dependencies?
    if( !('dependencies' in node) || _.isEmpty(node.dependencies) )
      return graph;

    // Process dependencies
    node.status.activable = _.every(node.service.manifest.dependencies, function(version, depId){

      // Get required service
      var dependency = nodes[depId];

      // Is dep installed?
      if( !dependency ) return false;

      // Valid version combination?
      return semver.satisfies(dependency.service.manifest.version, version);

    });


    // Is service activable?
    if( node.status.activable ){

      // Register in graph store
      graph.nodes[srvId] = node;

      // Obtain dependencies ids
      var deps = Object.keys(node.service.manifest.dependencies);

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
  },


  init: function(){

    // Pointer
    var S = this;

    var queue = depGraph.overallOrder();

    //var serviceApis = _.reduce(queue, function(apis, nodeId){
    return _.reduce(queue, function(apis, nodeId){

      // Get node
      var node = graph.nodes[nodeId];

      // Visit the node
      apis[nodeId] = node.visit(S).then(function(srvApi){

        var children = depGraph.dependantsOf(nodeId);

        children.forEach(function(childId, position, _children){

          var child = graph.nodes[childId];

          apis[childId] = child.visit(S, nodeId, srvApi);

        });

        return srvApi;
      });

      return apis;

    }, {});
  }
};