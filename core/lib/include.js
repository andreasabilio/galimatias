
var fs = require('fs');

// Define defaults
var defaults = {
  recursive: true,
  depth:     null,
  exclude:   null,
  filter:    /^([^\.].*)\.js(on)?$/
};

var walker = function(out, file){

  // Get file path
  var filepath = this.path + '/' + file;

  if(fs.statSync(filepath).isDirectory()){

    if( null === this.depth || 0 < this.depth){
      var name = file.split('.')[0];
      var conf = Object.assign({}, this);
          conf.path  = filepath;
          conf.depth = (this.depth)? this.depth - 1 : null;

      out[name] = include(conf);
    }

  }else{
    var match = file.match(this.filter);
    if(match)
      out[match[1]] = require(filepath);
  }

  return out;
};


var include = module.exports = function(_options){

  // Parse options
  var options;
  if( 'string' === typeof _options ){
    options      = Object.assign({}, defaults);
    options.path = _options;
  }else{
    options = Object.assign({}, defaults, _options);
  }

  // Get the files in the path
  var files = fs.readdirSync(options.path);

  // Detect modules with index
  if( -1 !== files.indexOf('index.js') )
    return require(options.path + '/index.js');


  // Get files in path
  return files.reduce(walker.bind(options), {});
};