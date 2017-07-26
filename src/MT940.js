var Revenues = require('./object/Revenue')
  , _instance = null
  , AWriter = require('./writer/AWriter');


var MT940 = function(configuration) {
  this._configuration = null;
  this._parser = null;
  this._writer = null;
  this._writeAs = 1;
  this._pathToWrite = '';
  this._pathToContent = '';

  this.setConfiguration(configuration);
};

MT940.PARSER_DEFAULT = 0;
MT940.PARSER_SPARKASSE = 1;

MT940.WRITER_DEFAULT = 0;
MT940.WRITER_SPARKASSE = 1;

/**
 *
 * @returns {string}
 */
MT940.prototype.getWriteStatus = function() {
  if (this._writer !== null) return this._writer.getStatus();
  return '';
};

/**
 *
 * @param parser
 * @returns {MT940}
 */
MT940.prototype.setParser = function(parser) {
  switch (parser) {
    case MT940.PARSER_DEFAULT:
      this._parser = require('./parser/Default').instance();
      break;
    case MT940.PARSER_SPARKASSE:
      this._parser = require('./parser/Sparkasse').instance();
      break;
    default:
      this._parser = null;
      break;
  }

  if (this._parser !== null) this._parser.setFilePath(this._pathToContent);

  return this;
};

/**
 *
 * @param writer
 * @returns {MT940}
 */
MT940.prototype.setWriter = function(writer) {
  switch (writer) {
    case MT940.WRITER_DEFAULT:
      this._writer = require('./writer/Default').instance();
      break;
    case MT940.WRITER_SPARKASSE:
      this._writer = require('./writer/Sparkasse').instance();
      break;
  }

  if (this._writer !== null) this._writer.setFilePath(this._pathToWrite);
  return this;
};

/**
 *
 * @param writeAs
 * @returns {MT940}
 */
MT940.prototype.setWriteAs = function(writeAs) {
  switch(writeAs) {
    case AWriter.WRITE_PLAIN_TEXT:
    case AWriter.WRITE_XML:
    case AWriter.WRITE_CSV:
      this._writeAs = writeAs;
      break;
  }

  return this;
};

/**
 *
 * @param callback
 */
MT940.prototype.parse = function(callback) {
  this._parser.execute(null, callback);
};

/**
 *
 * @param revenues
 * @param callback
 */
MT940.prototype.write = function(revenues, callback) {
  var me = this
	  , writerCallback = function(err, writerObj) {
    callback(err, me);
  };

  switch(this._writeAs) {
    case AWriter.WRITE_PLAIN_TEXT:
      this._writer.writePlainText(revenues, writerCallback);
      break;
    case AWriter.WRITE_XML:
      this._writer.writeXML(revenues, writerCallback);
      break;
    case AWriter.WRITE_CSV:
      this._writer.writeCSV(revenues, writerCallback);
      break;
  }
};

/**
 *
 * @param configuration
 * @returns {MT940}
 */
MT940.prototype.setConfiguration = function(configuration) {
	this._configuration = configuration || {
      parser: MT940.PARSER_DEFAULT,
      writer: MT940.WRITER_DEFAULT,
      pathToContent: '',
      writeAs: AWriter.WRITE_PLAIN_TEXT,
      pathToWrite: '',
      gvcData: []
    };

  this.setParser(this._configuration.parser);
  this._pathToContent = this._configuration.pathToContent;
  this._parser.setFilePath(this._pathToContent);

  this.setWriter(this._configuration.writer);
  this._pathToWrite = this._configuration.pathToWrite;
  this._writer.setFilePath(this._configuration.pathToWrite);
  this.setWriteAs(this._configuration.writeAs);

  return this;
};

/**
 *
 * @param configuration
 * @returns {*}
 */
MT940.singleton = function(configuration) {
  if (_instance === null) _instance = new MT940(configuration);
  return _instance;
};

module.exports = MT940;