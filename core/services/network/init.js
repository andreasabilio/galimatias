
module.exports = function(S){

  // XXX
  console.log(' ');
  console.log('    Running Network service init');
  //console.log('    deps', Object.keys(this.manifest.dependencies));
  console.log('    S', S);

  return {
    isServiceApi: true,
    name: this.manifest.name
  };

};