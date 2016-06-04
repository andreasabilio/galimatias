
var Router = require('koa-router');


module.exports = function*(S){

  // Router shorthand
  var router = new Router({
    prefix: '/' + this.id
  });

  // Register schema api
  router.get('/*', function*(next){

    this.body = 'Smallcloud schema for: ' + this.path.replace('/schema', '');

  });


  // Register routes
  S.http.routes.push(router.routes());


  return {
    isServiceApi: true,
    name: this.manifest.name
  };

};