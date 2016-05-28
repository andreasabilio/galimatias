
module.exports = function(){

  // XXX
  console.log(' ');
  console.log('    Running Hosted service init');

  return {
    isServiceApi: true,
    name: this.manifest.name
  };

};