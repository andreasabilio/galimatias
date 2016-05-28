/**
 * SmallCloud Resource Server
 * @type {function(): modules|exports}
 */

var requireAll = require('require-all');
var config     = requireAll('./config');
var core       = require('./core');


core.init(config).then(function(S){
  console.log(' ');
  console.log('______________________________________________');
  console.log(' ');
  S.log('info', 'SmallCLoud has started');
  console.log(' ');
}).catch(function(e){
  console.log('ERROR in index:', e);
  console.log(e.stack);
});