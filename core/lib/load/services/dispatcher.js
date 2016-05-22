
var co = require('co');

module.exports = {
  run: {
    controlled: function(target){

      var ctx  = target.ctx;
      var fn   = target.fn;
      var args = target.args;

      return fn.apply(ctx, args);

    },
    generator: function(target){

      var ctx   = target.ctx;
      var gen   = target.gen.bind(ctx);

      // TODO: Maybe run with bluebird - less bloat
      return co(function*(){

        var param = yield target.param;

        return yield gen(param);

      });
    }
  }
};


// bound = db.find.bind.apply(db.find, [null].concat(arguments));