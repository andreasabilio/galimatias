
var fs = require('fs');

// Define defaults
var defaults = {
  recursive: true,
  depth:     null,
  exclude:   null,
  filter:    /^([^\.].*)\.js(on)?$/
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

  // XXX
  console.log(' ');
  console.log('--- including folder:', options.path);
  console.log('--- files:', files);
  console.log('--- index:', -1 !== files.indexOf('index.js'));

  // Detect modules with index
  if( -1 !== files.indexOf('index.js') )
    return require(options.path + '/index.js');


  // Get files in path
  return files.reduce(function(out, file){

      // Get file path
      var filepath = options.path + '/' + file;

      if(fs.statSync(filepath).isDirectory()){

        console.log('>>>', file);
        console.log('>>>', options.depth);
        console.log('--- descend:', null === options.depth || 0 < options.depth);

        if( null === options.depth || 0 < options.depth){
          var name = file.split('.')[0];
          var conf = Object.assign({}, options);
              conf.path  = filepath;
              conf.depth = (options.depth)? options.depth - 1 : null;

          out[name] = include(conf);
        }

      }else{
        var match = file.match(options.filter);
        if(match) out[match[1]] = require(filepath);
      }

      return out;

    }, {});
};