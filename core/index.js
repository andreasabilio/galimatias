
var config  = require('./config');
var include = require('./lib/include');
var path    = require('path');
var co      = require('co');
var _       = require('lodash');
//var S      = require('./s');
//
//Load libraries into S
//_.extend(S, lib);


// Load libraries
var lib    = include(path.resolve(__dirname, './lib'));
var hasRun = false;

var S = _.assign({}, lib);

var core = module.exports = {
  init: co.wrap(function*(_config){

    // Run only once
    if(hasRun)
      throw new Error('ERROR: Init can only be run once');
    else
      hasRun = true;

    // Salute
    console.log('  ');
    S.log('info', 'SmallCloud is starting...');

    // Parse and load config into S
    _.extend(S, _config, config);

    // Load and init core services
    S.services = yield S.load.services.call(S, S.config.paths.core.services, false);



    // XXX
    console.log(' ');
    console.log('----------------------------------------------');
    console.log(' ');
    //console.log('S:', S);
    console.log('Services:', S.services);

    // DEV
    return S;
  })
};