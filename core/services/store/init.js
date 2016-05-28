
module.exports = function(){

  // XXX
  console.log(' ');
  console.log('    Running Store service init');

  return {
    isServiceApi: true,
    name: this.manifest.name
  };

};