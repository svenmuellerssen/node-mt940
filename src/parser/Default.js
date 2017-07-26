var _ = require('underscore')
  , Revenues = require('../object/Revenue');

var Parser = function() {
  this.content = '';
  this.path = './';
  this.file = '';
};

Parser.prototype.setContent = function(content) {
  content = content || '';
  this.content = content;
  return this;
};

Parser.prototype.hasContent = function() {
  // does nothing.
  return true;
};

Parser.prototype.setFilePath = function(path) {
  // does nothing.
  return this;
};

Parser.prototype.loadContent = function(path) {
  // does nothing.
  return this;
};

Parser.prototype.execute = function(path, callback) {
  var revenues = Revenues.instance();
  console.log('MT940 Default Parser: No parsing of available content.');
  callback(null, revenues);
};



Parser.instance = function() {
  return new Parser();
};

module.exports = Parser;