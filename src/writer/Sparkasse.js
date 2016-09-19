var ring = require('ring')
  , Revenues = require('./../object/Revenues');

var WriterSparkasse = function() {
  this.path = null;
  this.filename = null;
  this.start = "\n";
  this.separator = "-\n";
};

WriterSparkasse.prototype.writePlainText = function(revenues, callback) {
  revenues = (ring.instance(revenues, Revenues)) ? revenues : null;

  if (revenues === null) {
    callback({error: {message: 'Invalid Revenues object given. No information available to write into file.', code: 0}}, null);
  } else {
    var path = this.path + '/' + this.filename
      , text = ''
      , extract = this.start;

    // todo Glue all needed information to a Revenues format conform text.
    writeToFile(text, path, callback);
  }
};

WriterSparkasse.prototype.writeXML = function(revenues, callback) {
  revenues = (ring.instance(revenues, Revenues)) ? revenues : null;

  if (revenues === null) {
    callback({error: {message: 'Invalid Revenues object given. No information available to write into file.', code: 0}}, null);
  } else {
    var path = this.path + '/' + this.filename
      , text = ''
      , extract = this.start;

    // todo Glue all needed information to a Revenues format conform text.
    writeToFile(text, path, callback);
  }
};

WriterSparkasse.prototype.writeCSV = function(revenues, callback) {
  revenues = (ring.instance(revenues, Revenues)) ? revenues : null;

  if (revenues === null) {
    callback({error: {message: 'Invalid Revenues object given. No information available to write into file.', code: 0}}, null);
  } else {
    var path = this.path + '/' + this.filename
      , text = ''
      , extract = this.start;

    // todo Glue all needed information to a Revenues format conform text.
    writeToFile(text, path, callback);
  }
};

var writeToFile = function(text, path, callback) {
  var me = this;

  callback(null, me);
};

WriterSparkasse.instance = function() {
  return new WriterSparkasse();
};

module.exports = WriterSparkasse;