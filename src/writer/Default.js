var ring = require('ring')
  , Revenues = require('../object/Revenue')
  , AWriter = require('./AWriter');

var WriterDefault = function() {
  this.name = 'WriterDefault';
  this._path = '';
  this._filename = '';
};

/**
 *
 * @param path {string}
 * @returns {WriterDefault}
 */
WriterDefault.prototype.setFilePath = function(path) {
  path = (typeof path === 'string') ? path : null;

  if (path !== null) {
    this._path = path.substring(0, path.lastIndexOf("/"));
    if (this._path === '') this._path = './';
    this._filename = path.substring(path.lastIndexOf("/") +1);
  }

  return this;
};

/**
 *
 * @param revenues {Revenue}
 * @param callback {function}
 */
WriterDefault.prototype.writePlainText = function(revenues, callback) {
  var path = this._path + '/' + this._filename;
  writeToFile("MT940 Default Writer: Nothing to write to path '" + path + "'", path, callback);
};

/**
 *
 * @param revenues {Revenue}
 * @param callback {function}
 */
WriterDefault.prototype.writeXML = function(revenues, callback) {
  var path = this._path + '/' + this._filename;
  writeToFile("MT940 Default Writer: Nothing to write to path '" + path + "'", path, callback);
};

/**
 *
 * @param revenues {Revenue}
 * @param callback {function}
 */
WriterDefault.prototype.writeCSV = function(revenues, callback) {
  var path = this._path + '/' + this._filename;
  writeToFile("MT940 Default Writer: Nothing to write to path '" + path + "'", path, callback);
};

/**
 *
 * @param text {string}
 * @param path {string}
 * @param callback {function}
 */
var writeToFile = function(text, path, callback) {
  var me = this;
  callback(null, me);
};

var Writer = ring.create([WriterDefault, AWriter], {});

Writer.instance = function() {
  return new Writer();
};

module.exports = Writer;