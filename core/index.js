
var config = require('./config');
var loader = require('./lib/load/services');
var co     = require('co');
var _      = require('lodash');
var S      = require('smallcloud');

// Load libraries into S
//_.extend(S, lib);

var core = module.exports = {
  init: co.wrap(function*(_config){

    // XXX
    //console.log('>>> Running init');

    console.log('  ');
    //console.log('S:', S);
    S.log('info', 'SmallCloud is starting...');

    // Parse and load config into S
    _.extend(S, _config, config);

    S.load = {
      services: loader
    };

    S.services.core = yield loader(S.config.paths.core.services, false);



    // XXX
    console.log(' ');
    console.log('----------------------------------------------');
    console.log(' ');
    //console.log('S:', S);
    console.log('Core Services:', S.services.core);

    // DEV
    return S;
  })
};