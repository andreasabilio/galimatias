
var colors = require('colors/safe');
var _      = require('lodash');

var levels = {
  trace:    colors.purple,
  input:    colors.grey,
  verbose:  colors.cyan,
  prompt:   colors.grey,
  debug:    colors.grey,
  info:     colors.cyan,
  data:     colors.grey,
  help:     colors.cyan,
  warn:     colors.yellow,
  error:    colors.red
};

module.exports = function(level, message){

  var color = levels[level];

  console.log('', color(_.padStart(level, 7)), message)
};