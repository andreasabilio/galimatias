
module.exports = function*(S){

  //// XXX
  //console.log(' ');
  //console.log(' - Running Store service init');
  ////console.log('    deps', Object.keys(this.manifest.dependencies));
  //console.log(' - S.db', S.db);

  // Log
  S.log('info', 'Starting ' + this.manifest.name + ' service...');

  return {
    isServiceApi: true,
    name: this.manifest.name
  };

};