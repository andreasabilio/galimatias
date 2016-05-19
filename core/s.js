
var S = module.exports = {

  services: {},
  resources: {},

  runInS: function(){

    var args = Array.prototype.slice.call(arguments);
    var fn   = args.shift();

    return fn.apply(S, args);

  }
};