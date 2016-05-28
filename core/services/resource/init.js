
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

      router.get('/resource/*', function*(next){

        // XXX
        console.log('rrr', this.path);

        this.body = 'Smallcloud resource(s): ' + this.path.replace('/resource', '');


      });

      router.get('/schema/*', function*(next){

        // XXX
        console.log('sss', this.path);

        this.body = 'Smallcloud schema for: ' + this.path.replace('/schema', '');


      });

      return router;

    }
  };

};