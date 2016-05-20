
var include = require('./lib/include');
var path    = require('path');
var _       = require('lodash');

// Load libraries
var lib = include(path.resolve(__dirname, './lib'));

// XXX
console.log('*** LIB:', lib);

// Define the core registry
var S = {

  services: {},
  resources: {},

  runInS: function(){

    var args = Array.prototype.slice.call(arguments);
    var fn   = args.shift();

    return fn.apply(S, args);

  }
};

// Build and export
module.exports = _.extend(S, lib);