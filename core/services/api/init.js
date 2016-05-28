
module.exports = function*(S){

  // XXX
  console.log('  ');
  console.log('    Running API service init');
  //console.log('    deps', Object.keys(this.manifest.dependencies));
  //console.log('    S', S);
  //console.log('*** this:', this);

  return {
    isServiceApi: true,
    name: this.manifest.name
  };

};