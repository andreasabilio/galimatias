
module.exports = function*(S){

  // XXX
  console.log('  ');
  console.log('    Running API service init');
  console.log('*** S', S);
  //console.log('*** this:', this);

  return {
    isServiceApi: true,
    name: this.manifest.name
  };

};