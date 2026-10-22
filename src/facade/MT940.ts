import { promises as fs } from 'fs';
import { parseStatement, Statement } from '../core';
import { Format, formatStatement } from '../write';
import { ConfigurationError } from './ConfigurationError';

export interface MT940Options {
  /** The file to read in `parse()`. */
  readonly pathToContent?: string;
  /** The file to write in `write()`. An existing file is replaced. */
  readonly pathToWrite?: string;
  /** The format of the written file, default is 'mt940'. */
  readonly writeAs?: Format;
  /** Turn the first warning of the parser into a ParseError, see `parseStatement`. */
  readonly strict?: boolean;
}

const FORMATS: ReadonlyArray<string> = ['mt940', 'csv'];

/**
 * Reads MT940 files and writes statements into files. The files are read and written as UTF-8.
 *
 * Errors of the file system, ParseError and WriteError are passed on unchanged.
 */
export class MT940 {
  private readonly options: MT940Options;

  /** @throws ConfigurationError if `writeAs` is not a supported format. */
  constructor(options: MT940Options = {}) {
    if (options.writeAs !== undefined && !FORMATS.includes(options.writeAs)) {
      throw new ConfigurationError(`The format "${options.writeAs}" is not supported, use one of: ${FORMATS.join(', ')}.`);
    }
    this.options = {...options};
  }

  /** @throws ConfigurationError (rejected) if there is no `pathToContent`. */
  async parse(): Promise<Statement> {
    const file = this.options.pathToContent;
    if (!file) throw new ConfigurationError('There is no path to the content (pathToContent).');

    return parseStatement(await fs.readFile(file, 'utf8'), {strict: this.options.strict === true});
  }

  /** @throws ConfigurationError (rejected) if there is no `pathToWrite`. */
  async write(statement: Statement): Promise<void> {
    const file = this.options.pathToWrite;
    if (!file) throw new ConfigurationError('There is no path to write (pathToWrite).');

    // The statement is formatted first, so a statement that can not be written does not touch the file.
    await fs.writeFile(file, formatStatement(statement, this.options.writeAs ?? 'mt940'));
  }
}
