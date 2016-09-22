var ring = require('ring')
  , Revenues = require('../object/Revenues')
  , AWriter = require('./AWriter');

var WriterSparkasse = function() {
  this.path = null;
  this.filename = null;
  this.start = "\n";
  this.separator = "-\n";
  this.writeAs = 0;
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

WriterSparkasse.prototype.writeAs = function(value) {

};

var writeToFile = function(text, path, callback) {
  var me = this;

  callback(null, me);
};

var Writer = ring.create([WriterSparkasse, AWriter], {});

Writer.instance = function() {
  return new Writer();
};

module.exports = Writer;