var _ = require('underscore')
  , Revenues = require('./src/Object/Revenues');

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

Parser.prototype.execute = function(callback) {
  var revenues = Revenues.instance();
  callback(null, revenues);
};



Parser.instance = function() {
  return new Parser();
};

module.exports = Parser;