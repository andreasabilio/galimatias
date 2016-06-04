
var Router = require('koa-router');


module.exports = function(S){

  // Router shorthand
  var router = new Router({
    prefix: '/' + this.id
  });

  // Register resource api
  router.get('/*', function*(next){

    // XXX
    console.log('rrr', this.path);

    this.body = 'Smallcloud resource(s): ' + this.path.replace('/resource', '');


  });


  // Register routes
  S.http.routes.push(router.routes());


  // Return API
  return {
    isServiceApi: true,
    name: this.manifest.name
  };

};