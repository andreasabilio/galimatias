
module.exports = function(){

  // XXX
  console.log(' ');
  console.log('    Running Network service init');

  return {
    isServiceApi: true,
    name: this.manifest.name
  };

};