
var config = require('./config');
var co     = require('co');
var _      = require('lodash');
var S      = require('./s');

// Load libraries into S
//_.extend(S, lib);

var core = module.exports = {
  init: co.wrap(function*(_config){

    // XXX
    //console.log('>>> Running init');

    console.log('  ');
    S.log('info', 'SmallCloud is starting...');

    // Parse and load config into S
    _.extend(S, _config, config);



    // Load and initialize core services
    S.services.core = yield S.runInS(S.load.services, S.config.paths.core.services, false);



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