
var co = require('co');

var runner = module.exports = {

  run: co.wrap(function*(services){

    return services;

    // TODO



    //// Register all services in core registry
    //s.reg('srv', services);
    //
    //// Return promise
    //return new Promise(function(resolve, reject){
    //
    //  // Say hello!
    //  console.log(' ');
    //  s.core.log('info', 'Starting SmallCloud services...');
    //
    //  // Run!
    //  s.runner.call({
    //    services: services,
    //    resolve: resolve,
    //    reject: reject
    //  });
    //
    //});
  })
};