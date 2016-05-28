
var dispatcher = require('./dispatcher');
var Promise    = require('bluebird');
var DepGraph   = require('dependency-graph').DepGraph;
var include    = require('../../include');
var semver     = require('semver');
var co         = require('co');
var _          = require('lodash');
//var S          = require('../../../s');

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


var nodeBase = {

  //_visitors: null,
  //_promise:  null,

  //_resolver: ,

  visit: function(S, visitId, service){

    // XXX
    var that = this;
    //if('undefined' !== typeof visitId){
    //  console.log(' ');
    //  console.log('---', visitId, 'is visiting', this.id, 'with', service);
    //}

    // Init visitor reg?
    if(!this._visitors)
      this._visitors = {};


    // Promise resolve fn carrier
    //var boundResolver;
    var resolverFn = function(srvApi){
      //console.log('+++ Resolving', this.id, 'with', srvApi);
      this.resolve(srvApi);
    };

    // Promise singleton
    if(!this._promise)
      this._promise = new Promise(function(resolve, reject){

        // XXX
        //console.log('  - first visit to', that.id, 'is from', visitId);

        //var _resolve = function(result){
        //  console.log('XXX', result);
        //  resolve(result);
        //};

        // Bind resolver
        that._resolver = resolverFn.bind({resolve: resolve, reject: reject});
      });


    // Acknowledge visit?
    if(visitId && !(-1 === this.dependencies.indexOf(visitId))){
      this._visitors[visitId] = service;
    }

    // XXX
    //console.log('---', this.id, 'status:', Object.keys(this._visitors), this.dependencies);

    var xor = _.xor(Object.keys(this._visitors), this.dependencies);

    // XXX
    //console.log('OOO', this.id, xor);

    // Some visit has to be the last...
    //if( _.isEqual(Object.keys(this._visitors), this.dependencies) ){
    if( !xor.length ){

      // Complete arg
      var s = _.assign({}, this._visitors, {log: S.log});

      // XXX
      //console.log('DING', that._resolver);

      var srvInit = co.wrap(this.service.init).bind(this.service, s);

      srvInit().then(function(srvApi){
        // XXX
        //console.log(' ');
        //console.log('>>>', that.id, 'initialized with', srvApi);

        that._resolver(srvApi);

        return srvApi;

      }).catch(function(e){
        console.log('ERROR in graph srv init:', e);
        console.log(e.stack);
      });
    }

    // Always return a promise
    return this._promise;
  }
};



var graph = module.exports = {

  // DEV
  init: function(){

    // XXX
    //console.log('>>> Graph init', this);

    // Pointer
    var S = this;

    var queue = depGraph.overallOrder();

    //var serviceApis = _.reduce(queue, function(apis, nodeId){
    return _.reduce(queue, function(apis, nodeId){

      // Get node
      var node = graph.nodes[nodeId];

      // Visit the node
      apis[nodeId] = node.visit(S).then(function(srvApi){

        // XXX
        //console.log('+++ Finally visit children of', nodeId, srvApi);

        var children = depGraph.dependantsOf(nodeId);

        children.forEach(function(childId, position, _children){

          var child = graph.nodes[childId];

          // XXX
          //console.log('---', nodeId, 'is to visit', childId, 'with', srvApi);

          apis[childId] = child.visit(S, nodeId, srvApi);

        });

        return srvApi;
      });

      return apis;

    }, {});

    //// XXX
    ////console.log('III serviceApis', serviceApis);
    //
    ////var out = Promise.all(serviceApis);
    //
    ////console.log('III', out);
    //
    //return serviceApis;
    //
    //
    //
    //// DEV
    ////return {isServiceApi: true};
    ////return out;
  },

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
    //nodes[srvId] = candidate;
    nodes[srvId] = _.assign({}, nodeBase, {
      id: srvId,
      service: candidate,
      dependencies: (candidate.manifest.dependencies)? Object.keys(candidate.manifest.dependencies) : []
    });

    // Return collection
    return nodes;
  },


  process: function(_graph, node, srvId, nodes){

    // XXX
    //console.log('### process:', srvId);
    //console.log('AAA process:', arguments);


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

    // XXX
    //console.log('###', srvId, node.status.activable);


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

    //return _.assign(service, status);
    //return {culo: true};
  },



  _init: function(){

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

    var visitor = function(api, nodeId){

      // Get node
      var node     = graph.nodes[nodeId];
      var children = depGraph.dependantsOf(nodeId) || [];

      // Visit the node
      api[nodeId] = node.visit.call(api).then(function(srvApi){
        return children.forEach(children, function(childId){

        });
      });

      return api.push();
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