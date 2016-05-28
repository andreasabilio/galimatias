
var koa = require('koa');

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

  return http;

};