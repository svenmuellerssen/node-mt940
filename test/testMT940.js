var MT940 = require('../src/MT940')
  , configuration = {
    parser: MT940.PARSER_SPARKASSE,
    writer: MT940.WRITER_SPARKASSE,
    pathToContent: '',
    writeAs: MT940.WRITE_PLAIN_TEXT,
    gvcData: require('../src/data/gvc.js')
  }
  , mt940 = MT940.singleton(configuration);

describe('Test MT940', function() {
  it('Test the library.', function(done) {
    done();
  });
});