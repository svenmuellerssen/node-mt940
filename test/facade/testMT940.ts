import should from 'should';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { ConfigurationError, MT940 } from '../../src/facade';
import { parseStatement, ParseError, Statement } from '../../src/core';
import { formatStatement, WriteError } from '../../src/write';
import * as api from '../../src';

const fixturePath = path.join(__dirname, '..', 'fixtures', 'sparkasse.txt')
  , fixture = fs.readFileSync(fixturePath, 'utf8');

/**
 * Run the given function and return what it throws (fails the test if nothing is thrown).
 */
function failure(fn: () => unknown): any {
  try {
    fn();
  } catch (error) {
    return error;
  }
  throw new Error('Expected the function to throw, but it returned.');
}

/**
 * Wait for the given promise and return what it is rejected with (fails the test if it is resolved).
 */
async function rejection(promise: Promise<unknown>): Promise<any> {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error('Expected the promise to be rejected, but it was resolved.');
}

/** What a statement says. The warnings are left out, their line numbers change with the formatting. */
function content(statement: Statement) {
  return {referenceNumber: statement.referenceNumber, extracts: statement.extracts};
}

describe('Test MT940', function() {
  let directory: string;

  // The tests write into a temporary directory, never into the working directory.
  before(function() {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'mt940-'));
  });

  after(function() {
    fs.rmSync(directory, {recursive: true, force: true});
  });

  describe('parse', function() {
    it('S1: reads the configured file and returns its statement.', async function() {
      const statement = await new MT940({pathToContent: fixturePath}).parse();

      should(statement.referenceNumber).be.equal('STARTUMSE');
      should(statement.extracts.length).be.equal(2);
      should(statement.warnings).be.eql([]);
    });

    it('S2: a file that does not exist is rejected with the error of the file system.', async function() {
      const error = await rejection(new MT940({pathToContent: path.join(directory, 'does-not-exist.txt')}).parse());

      should(error.code).be.equal('ENOENT');
    });

    it('S3: a file with invalid content is rejected with a ParseError.', async function() {
      const file = path.join(directory, 'invalid.txt');
      fs.writeFileSync(file, 'this is not MT940\r\n');

      const error = await rejection(new MT940({pathToContent: file}).parse());

      should(error instanceof ParseError).be.true();
    });

    it('S4: without a path to the content it is rejected with a ConfigurationError.', async function() {
      const error = await rejection(new MT940().parse());

      should(error instanceof ConfigurationError).be.true();
      should(error.message).be.a.String().and.not.be.empty();
    });

    describe('with warnings', function() {
      // The tag :64: is not supported, the core reports it as warning.
      let file: string;

      before(function() {
        file = path.join(directory, 'warning.txt');
        fs.writeFileSync(file, fixture.replace(':62F:C150116EUR211,03', ':62F:C150116EUR211,03\r\n:64:C150116EUR211,03'));
      });

      it('S15: with strict a file with warnings is rejected with a ParseError.', async function() {
        const error = await rejection(new MT940({pathToContent: file, strict: true}).parse());

        should(error instanceof ParseError).be.true();
        should(error.message).containEql('UNSUPPORTED_TAG');
      });

      it('S16: without strict the same file is read and the statement carries the warning.', async function() {
        const statement = await new MT940({pathToContent: file}).parse();

        should(statement.extracts.length).be.equal(2);
        should(statement.warnings.map(warning => warning.code)).be.eql(['UNSUPPORTED_TAG']);
      });
    });
  });

  describe('write', function() {
    it('S5: writes the statement as MT940 text into the configured file.', async function() {
      const file = path.join(directory, 'written.txt')
        , statement = parseStatement(fixture)
        , result = await new MT940({pathToWrite: file}).write(statement);

      should(result).be.undefined();
      should(fs.readFileSync(file, 'utf8')).be.equal(formatStatement(statement, 'mt940'));
    });

    it('S6: writes the statement as CSV if the option writeAs is "csv".', async function() {
      const file = path.join(directory, 'written.csv')
        , statement = parseStatement(fixture);

      await new MT940({pathToWrite: file, writeAs: 'csv'}).write(statement);

      should(fs.readFileSync(file, 'utf8')).be.equal(formatStatement(statement, 'csv'));
    });

    it('S7: without a path to write it is rejected with a ConfigurationError.', async function() {
      const error = await rejection(new MT940().write(parseStatement(fixture)));

      should(error instanceof ConfigurationError).be.true();
      should(error.message).be.a.String().and.not.be.empty();
    });

    it('S8: a statement without an extract is rejected with a WriteError and creates no file.', async function() {
      const file = path.join(directory, 'empty.txt')
        , error = await rejection(new MT940({pathToWrite: file}).write({referenceNumber: 'STARTUMSE', extracts: [], warnings: []}));

      should(error instanceof WriteError).be.true();
      should(fs.existsSync(file)).be.false();
    });

    it('S9: the file is readable and writable for the owner and a second write replaces its content.', async function() {
      const file = path.join(directory, 'twice.txt')
        , mt940 = new MT940({pathToWrite: file})
        , whole = parseStatement(fixture)
        , small: Statement = {...whole, extracts: [whole.extracts[0]]};

      await mt940.write(whole);
      should(fs.statSync(file).mode & 0o600).be.equal(0o600);

      await mt940.write(small);
      should(fs.readFileSync(file, 'utf8')).be.equal(formatStatement(small, 'mt940'));
    });
  });

  it('S10: a statement that is written into a file and read again is the same statement.', async function() {
    const file = path.join(directory, 'roundtrip.txt')
      , mt940 = new MT940({pathToContent: file, pathToWrite: file})
      , original = parseStatement(fixture);

    await mt940.write(original);

    should(content(await mt940.parse())).be.eql(content(original));
  });

  describe('options', function() {
    it('S11: the options are copied, changing the given object afterwards changes nothing.', async function() {
      const first = path.join(directory, 'options-first.txt')
        , second = path.join(directory, 'options-second.csv')
        , options: {pathToWrite: string, writeAs?: 'mt940' | 'csv'} = {pathToWrite: first}
        , mt940 = new MT940(options)
        , statement = parseStatement(fixture);

      options.pathToWrite = second;
      options.writeAs = 'csv';
      await mt940.write(statement);

      should(fs.readFileSync(first, 'utf8')).be.equal(formatStatement(statement, 'mt940'));
      should(fs.existsSync(second)).be.false();
    });

    it('S12: an invalid format (writeAs) is rejected by the constructor with a ConfigurationError.', function() {
      ['xml', 'pdf', ''].forEach(function(writeAs) {
        const error = failure(() => new MT940({writeAs: writeAs as any}));

        should(error instanceof ConfigurationError).be.true();
        should(error.message).be.a.String().and.not.be.empty();
      });
    });
  });

  describe('the public entry (src/index.ts)', function() {
    it('S13: exports the facade, the functions and the errors, but no model classes.', function() {
      ['MT940', 'parseStatement', 'formatStatement', 'gvcText', 'ParseError', 'WriteError', 'ConfigurationError'].forEach(function(name) {
        should((api as any)[name]).be.a.Function();
      });
      should(api.MT940).be.equal(MT940);

      ['parseRevenue', 'formatRevenue', 'Revenue', 'Saldo', 'Transaction', 'PaymentReference'].forEach(function(name) {
        should((api as any)[name]).be.undefined();
      });
    });
  });

  it('S14: parse and write return a promise and take no callback.', async function() {
    const file = path.join(directory, 'promise.txt')
      , mt940 = new MT940({pathToContent: fixturePath, pathToWrite: file})
      , parsing = mt940.parse()
      , writing = mt940.write(parseStatement(fixture));

    should(parsing instanceof Promise).be.true();
    should(writing instanceof Promise).be.true();
    should(mt940.parse.length).be.equal(0);
    should(mt940.write.length).be.equal(1);

    await Promise.all([parsing, writing]);
  });
});
