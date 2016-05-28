/**
 * SmallCloud Resource Server
 * @type {function(): modules|exports}
 */

var requireAll = require('require-all');
var config     = requireAll('./config');
var core       = require('./core');

core.init(config).then(function(S){

  // DEV
  S.http.use(function*(){
    this.body = 'Hello from SmallCloud HTTP service catchall!';
  });

  // Start the http server
  S.http.listen(4242);

  console.log(' ');

  S.log('info', 'SmallCLoud has started on localhost:4242');

  console.log(' ');

}).catch(function(e){

  console.log('ERROR in index:', e);
  console.log(e.stack);

});