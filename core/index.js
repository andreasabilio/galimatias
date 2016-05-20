
var requireAll = require('require-all');
var config     = require('./config');
var path       = require('path');
var lib        = requireAll(path.resolve(__dirname, './lib'));
var _          = require('lodash');
var S          = require('./s');

// Load libraries into S
_.extend(S, lib);

module.exports = {
  init: function(_config){

    // XXX
    //console.log('>>> Running init');

    console.log('  ');
    S.log('info', 'SmallCloud is starting...');

    // Parse and load config into S
    _.extend(S, _config, config);

    // Load and initialize core services
    S.services.core = S.runInS(S.load.services, S.config.paths.core.services, false);

    // XXX
    //console.log('S:', S);
    console.log('S:', S.services.core);

    var test = S.include({
      path: path.resolve(__dirname, '../level0'),
      depth: 2
    });

    console.log(' ');
    console.log('TEST:', test);
  }
};