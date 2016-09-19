var Revenues = require('./../object/Revenues');

var WriterDefault = function() {
  this.path = null;
  this.filename = null;
  this.start = "";
  this.separator = "";
};

WriterDefault.prototype.setFilePath = function(path) {
  // do nothing.
  return this;
};

WriterDefault.prototype.writePlainText = function(revenues, callback) {
  // do nothing.
  callback(null, this);
};

WriterDefault.prototype.writeXML = function(revenues, callback) {
  // do nothing.
  callback(null, this);
};

WriterDefault.prototype.writeCSV = function(revenues, callback) {
  // do nothing.
  callback(null, this);
};

WriterDefault.instance = function() {
  return new WriterDefault();
};

module.exports = WriterDefault;