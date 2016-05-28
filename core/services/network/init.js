
module.exports = function(S){

  //// XXX
  //console.log(' ');
  //console.log(' - Running Network service init');
  ////console.log('    deps', Object.keys(this.manifest.dependencies));
  ////console.log(' - S', S);

  // Log
  S.log('info', 'Starting ' + this.manifest.name + ' service...');


  // Start the http server
  S.http.listen(4242);

  return {
    isServiceApi: true,
    name: this.manifest.name
  };

};