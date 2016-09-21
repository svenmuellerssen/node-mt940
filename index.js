var Revenues = require('./src/object/Revenues');

var MT940 = function(configuration) {
  this.parser = null;
  this.writer = null;
  this.writeAs = 1;

  this.parseConfiguration(configuration);
};

MT940.PARSER_NONE = 0;
MT940.PARSER_SPARKASSE = 1;

MT940.WRITER_NONE = 0;
MT940.WRITER_SPARKASSE = 1;

MT940.WRITE_PLAIN_TEXT = 1;
MT940.WRITE_CSV = 2;
MT940.WRITE_XML = 3;

MT940.prototype.setParser = function(parser) {
  switch (parser) {
    case MT940.PARSER_NONE:
      this.parser = require('./src/parser/Default').instance();
      break;
    case MT940.PARSER_SPARKASSE:
      this.parser = require('./src/parser/Sparkasse').instance();
      break;
  }
};

MT940.prototype.setWriter = function(writer) {
  switch (writer) {
    case MT940.PARSER_NONE:
      this.writer = require('./src/writer/Default').instance();
      break;
    case MT940.PARSER_SPARKASSE:
      this.writer = require('./src/writer/Sparkasse').instance();
      break;
  }
};

MT940.prototype.writeAs = function(writeAs) {
  switch(writeAs) {
    case MT940.WRITE_PLAIN_TEXT:
    case MT940.WRITE_XML:
    case MT940.WRITE_CSV:
      this.writeAs = writeAs;
      break;
  }

  return this;
};

MT940.prototype.parse = function(callback) {
  if (this.parser.hasContent())
    this.parser.execute(callback);
  else
    callback(null, Revenues.instance());
};

MT940.prototype.write = function(revenues, callback) {
  switch(this.writeAs) {
    case MT940.WRITE_PLAIN_TEXT:
      this.writer.writePlainText(revenues, callback);
      break;
    case MT940.WRITE_XML:
      this.writer.writeXML(revenues, callback);
      break;
    case MT940.WRITE_CSV:
      this.writer.writeCSV(revenues, callback);
      break;
  }
};

MT940.prototype.parseConfiguration = function(configuration) {
  configuration = configuration || {
      parser: MT940.PARSER_NONE,
      writer: MT940.WRITER_NONE,
      pathToContent: '',
      writeAs: MT940.WRITE_PLAIN_TEXT,
      gvcData: []
    };

  this.setParser(configuration.parser);
  this.setWriter(configuration.writer);
  this.parser.setFilePath(configuration.path);
  this.writer.writeAs(configuration.writeAs);
};

module.exports = MT940;