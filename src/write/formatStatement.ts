import { Statement } from '../core';
import { formatCsv } from './formatCsv';
import { formatMt940 } from './formatMt940';
import { WriteError } from './WriteError';

export type Format = 'mt940' | 'csv';

/**
 * Format a statement as text. The text is not written anywhere, that is up to the caller.
 * The warnings of the statement have no influence on the text.
 *
 * @throws WriteError if the statement has no extract, a value can not be written without changing its
 *         meaning, or the format is not supported (e.g. "xml").
 */
export function formatStatement(statement: Statement, format: Format): string {
  if (statement.extracts.length === 0) throw new WriteError('The statement has no extract.');

  switch (format) {
    case 'mt940':
      return formatMt940(statement);
    case 'csv':
      return formatCsv(statement);
    default:
      throw new WriteError(`The format "${format}" is not supported.`);
  }
}
