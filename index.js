

var requireAll = require('require-all');
var config     = requireAll('./config');
var core       = require('./core');


core.init(config);