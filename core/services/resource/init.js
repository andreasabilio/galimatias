
module.exports = function(){

  // XXX
  console.log(' ');
  console.log('    Running Resource service init');

  return {
    isServiceApi: true,
    name: this.manifest.name
  };

};