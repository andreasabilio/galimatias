
var config  = require('./config');
var include = require('./lib/include');
var path    = require('path');
var co      = require('co');
var _       = require('lodash');


// Setup
var hasRun = false;
var lib    = include(path.resolve(__dirname, './lib'));
var S      = _.assign({}, lib);

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
    console.log('  ');

    // Parse and load config into S
    _.extend(S, _config, config);



    // Load and initialize core services
    S.services.core = yield S.runInS(S.load.services, S.config.paths.core.services, false);

    // XXX
    console.log(' ');
    console.log('----------------------------------------------');
    console.log(' ');
    console.log('S:', S);
    //console.log('Services:', S.services);

    // DEV
    return S;
  })
};