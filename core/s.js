
var include = require('./lib/include');
var path    = require('path');
var co      = require('co');
var _       = require('lodash');

// Load libraries
var lib = include(path.resolve(__dirname, './lib'));

// Define the core registry
var S = {

  services: {},
  resources: {},

  runInS: function(){

    var args = Array.prototype.slice.call(arguments);
    var fn   = co.wrap(args.shift());

    return fn.apply(S, args);

  },

  runInCage: function(fn, ctx){

    var _S = _.omit(S, [
      'runInS',
      'runInCage',
      'load',
      'include',
      'config'
    ]);

    return co(fn.bind(ctx, _.extend({}, this, _S)));
  }
};

// Build and export
module.exports = _.extend(S, lib);