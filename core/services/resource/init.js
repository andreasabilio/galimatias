
module.exports = function(S){

  //// XXX
  //console.log(' ');
  //console.log(' - Running Resource service init');
  ////console.log('    deps', Object.keys(this.manifest.dependencies));
  ////console.log(' - S', S);

  // Log
  S.log('info', 'Starting ' + this.manifest.name + ' service...');

  return {
    isServiceApi: true,
    name: this.manifest.name,
    getApi: function(router){

      router.get('/cosa', function*(next){
        this.body = 'El termino cosa es el 42 de smallcloud'
      });

      return router;

    }
  };

};