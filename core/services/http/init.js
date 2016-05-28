
var koa       = require('koa');
var path      = require('path');
var koaStatic = require('koa-static');

module.exports = function*(S){

  //// XXX
  //console.log(' ');
  //console.log(' - Running HTTP service init');
  ////console.log('    deps', Object.keys(this.manifest.dependencies));
  ////console.log(' - S', S);

  // Log
  S.log('info', 'Starting ' + this.manifest.name + ' service...');


  // Initialize http server
  var http = koa();

  // Static file serving
  var root = path.resolve(__dirname, '../../../static');
  http.use(koaStatic(root));

  return http;

};