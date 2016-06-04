
module.exports = function(S){

  // Register all routes
  S.http.routes.forEach(function(routes){
    S.http.server.use(routes);
  });

  // DEV: Catch-all
  S.http.server.use(function*(){
    this.body = 'Hello from SmallCloud HTTP service catch-all!';
  });

  // Start the http server
  S.http.server.listen(4242);

  return {
    isServiceApi: true,
    name: this.manifest.name
  };

};