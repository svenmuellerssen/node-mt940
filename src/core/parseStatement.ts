import { ParseError } from './ParseError';
import {
  Balance, Extract, ParseOptions, ParseWarning, Payment, Statement, Transaction, TransactionType, WarningCode
} from './statement';

const TAG_LINE = /^:(\d{2}[A-Za-z]?):(.*)$/;
const BALANCE = /^([CD])(\d{6})([A-Z]{3})(\d+(?:,\d*)?)$/i;
const TRANSACTION = /^(\d{6})(\d{4})?(RC|RD|C|D)([A-Z])?(\d+(?:,\d*)?)(N[A-Za-z0-9]{3})(.*)$/i;

const EMPTY_PAYMENT: Payment = {
  gvc: null,
  bookingText: '',
  primanotaNumber: '',
  text: '',
  purchaserBic: '',
  purchaserAccountNumber: '',
  accountOwnerName: '',
  textKeyAddition: ''
};

interface Line {
  text: string;
  /** Line in the parsed text, starting with 1. */
  number: number;
}

interface Field {
  tag: string;
  value: string;
  line: number;
  continuation: Line[];
}

const SUPPORTED_TAGS = ['20', '25', '28C', '60F', '60M', '61', '86', '62F', '62M'];

/**
 * Parse the content of a MT940 file.
 *
 * Extracts are separated by a line that consists only of "-". A line only starts a new field if it
 * starts with a tag (e.g. ":61:"), every other line continues the field before.
 *
 * Nothing is dropped silently: whatever is ignored or guessed is listed in `warnings`.
 *
 * @throws ParseError if the content has no extract, a mandatory tag (:25:, :60F:/:60M:, :62F:/:62M:) is
 *         missing or a line is malformed. With the option `strict` also for every warning.
 */
export function parseStatement(text: string, options: ParseOptions = {}): Statement {
  const blocks = splitIntoBlocks(text);
  if (blocks.length === 0) throw new ParseError('The content does not contain an extract.');

  const warnings: ParseWarning[] = []
    , parsed = blocks.map(block => parseExtract(block, warnings));

  warnings.sort((a, b) => a.line - b.line);

  if (options.strict && warnings.length > 0) {
    const first = warnings[0];
    throw new ParseError(`Strict mode: ${first.code} in line ${first.line}: ${first.message}`, first.tag);
  }

  return {
    referenceNumber: parsed[0].referenceNumber,
    extracts: parsed.map(p => p.extract),
    warnings
  };
}

function warn(warnings: ParseWarning[], code: WarningCode, message: string, line: number, tag?: string): void {
  warnings.push({code, message, tag, line});
}

function splitIntoBlocks(text: string): Line[][] {
  const blocks: Line[][] = [];
  let current: Line[] = [];

  text.split(/\r\n|\n|\r/).forEach((line, index) => {
    if (line.trimEnd() === '-') {
      blocks.push(current);
      current = [];
    } else {
      current.push({text: line, number: index + 1});
    }
  });
  blocks.push(current);

  return blocks.filter(lines => lines.some(line => line.text.trim() !== ''));
}

function toFields(lines: Line[], warnings: ParseWarning[]): Field[] {
  const fields: Field[] = [];

  lines.forEach(line => {
    const tagLine = TAG_LINE.exec(line.text);
    if (tagLine) {
      fields.push({tag: tagLine[1].toUpperCase(), value: tagLine[2], line: line.number, continuation: []});
    } else if (line.text.trim() !== '') {
      if (fields.length > 0) {
        fields[fields.length - 1].continuation.push(line);
      } else {
        warn(warnings, 'IGNORED_LINE', 'The line is not part of a field, it is ignored.', line.number);
      }
    }
  });

  return fields;
}

function parseExtract(lines: Line[], warnings: ParseWarning[]): {referenceNumber: string, extract: Extract} {
  let referenceNumber = ''
    , account: {bankCode: string, accountNumber: string} | null = null
    , number = ''
    , sheetNumber = ''
    , openingBalance: Balance | null = null
    , closingBalance: Balance | null = null
    , pendingTransactionLine: number | null = null;
  const transactions: Transaction[] = [];

  // A transaction (:61:) that is not followed by payment information (:86:) is kept, but reported.
  const closePendingTransaction = () => {
    if (pendingTransactionLine !== null) {
      warn(warnings, 'TRANSACTION_WITHOUT_PAYMENT', 'The transaction has no payment information (:86:).', pendingTransactionLine, '61');
      pendingTransactionLine = null;
    }
  };

  for (const field of toFields(lines, warnings)) {
    if (field.tag !== '86') closePendingTransaction();

    if (!SUPPORTED_TAGS.includes(field.tag)) {
      warn(warnings, 'UNSUPPORTED_TAG', `The tag ":${field.tag}:" is not supported, it is ignored.`, field.line, field.tag);
      continue;
    }
    if (field.tag !== '86') {
      field.continuation.forEach(line =>
        warn(warnings, 'IGNORED_LINE', `The line continues ":${field.tag}:", but is ignored.`, line.number, field.tag));
    }

    switch (field.tag) {
      case '20':
        referenceNumber = field.value.trim();
        break;
      case '25': {
        const [first, second] = splitAtSlash(field.value);
        if (second === '') {
          warn(warnings, 'ACCOUNT_WITHOUT_BANK_CODE', 'The account has no "/", it is taken completely as account number.', field.line, '25');
        }
        account = {bankCode: second === '' ? '' : first, accountNumber: second === '' ? first : second};
        break;
      }
      case '28C':
        [number, sheetNumber] = splitAtSlash(field.value);
        break;
      case '60F':
      case '60M':
        openingBalance = parseBalance(field.tag, field.value);
        break;
      case '61':
        transactions.push(parseTransaction(field.value));
        pendingTransactionLine = field.line;
        break;
      case '86': {
        const raw = field.value + field.continuation.map(line => line.text).join('');
        if (pendingTransactionLine === null) {
          warn(warnings, 'PAYMENT_WITHOUT_TRANSACTION', 'The payment information has no transaction (:61:) before, it is ignored.', field.line, '86');
          break;
        }
        const {payment, ignored} = parsePayment(raw)
          , last = transactions.length - 1;
        // The line of a sub field on a continuation line is not known, so all are reported at the :86: tag.
        ignored.forEach(subField =>
          warn(warnings, 'UNKNOWN_SUBFIELD', `The sub field "?${subField}" of the payment information is not supported, it is ignored.`, field.line, '86'));
        if (payment.gvc === null) {
          warn(warnings, 'UNSTRUCTURED_PAYMENT', 'The payment information is not structured, it is taken completely as text.', field.line, '86');
        }
        transactions[last] = {...transactions[last], payment};
        pendingTransactionLine = null;
        break;
      }
      case '62F':
      case '62M':
        closingBalance = parseBalance(field.tag, field.value);
        break;
    }
  }
  closePendingTransaction();

  if (account === null) throw new ParseError('The extract has no account (:25:).', '25');
  if (openingBalance === null) throw new ParseError('The extract has no opening balance (:60F:).', '60F');
  if (closingBalance === null) throw new ParseError('The extract has no closing balance (:62F:).', '62F');

  return {
    referenceNumber,
    extract: {...account, number, sheetNumber, openingBalance, closingBalance, transactions}
  };
}

function splitAtSlash(value: string): [string, string] {
  const trimmed = value.trim()
    , index = trimmed.indexOf('/');
  return index === -1 ? [trimmed, ''] : [trimmed.substring(0, index), trimmed.substring(index + 1)];
}

function parseBalance(tag: string, value: string): Balance {
  const match = BALANCE.exec(value.trim());
  if (!match) throw new ParseError(`Invalid balance ":${tag}:${value}".`, tag);

  return {
    direction: match[1].toUpperCase() === 'C' ? 'credit' : 'debit',
    amountCents: parseAmount(tag, match[4]),
    currency: match[3].toUpperCase(),
    date: toIsoDate(tag, 2000 + Number(match[2].substring(0, 2)), Number(match[2].substring(2, 4)), Number(match[2].substring(4, 6))),
    intermediate: tag.endsWith('M')
  };
}

function parseTransaction(value: string): Transaction {
  const match = TRANSACTION.exec(value.trim());
  if (!match) throw new ParseError(`Invalid transaction ":61:${value}".`, '61');

  const year = 2000 + Number(match[1].substring(0, 2))
    , valueMonth = Number(match[1].substring(2, 4))
    , valueDay = Number(match[1].substring(4, 6))
    , types: {[mark: string]: TransactionType} = {C: 'credit', D: 'debit', RC: 'reverseCredit', RD: 'reverseDebit'};

  let bookingDate = toIsoDate('61', year, valueMonth, valueDay);
  if (match[2] !== undefined) {
    const bookingMonth = Number(match[2].substring(0, 2))
      , bookingDay = Number(match[2].substring(2, 4))
      // The booking date has no year: a booking in december of a value in january belongs to the year before.
      , bookingYear = bookingMonth - valueMonth > 6 ? year - 1 : (valueMonth - bookingMonth > 6 ? year + 1 : year);
    bookingDate = toIsoDate('61', bookingYear, bookingMonth, bookingDay);
  }

  return {
    valueDate: toIsoDate('61', year, valueMonth, valueDay),
    bookingDate,
    type: types[match[3].toUpperCase()],
    amountCents: parseAmount('61', match[5]),
    currencyLastChar: (match[4] || '').toUpperCase(),
    bookingKey: match[6].toUpperCase(),
    reference: match[7],
    payment: EMPTY_PAYMENT
  };
}

/**
 * Parse the text of a payment information (:86:). Besides the payment it returns the sub fields that are not read
 * (without the "?"): a text without a two digit code, or a code that is not supported.
 */
function parsePayment(raw: string): {payment: Payment, ignored: string[]} {
  const header = /^(\d{3})\?/.exec(raw);
  if (!header) return {payment: {...EMPTY_PAYMENT, text: raw}, ignored: []};

  const payment = {...EMPTY_PAYMENT, gvc: Number(header[1])}
    , ignored: string[] = []
    , subFields = raw.substring(3).split('?');

  subFields.forEach(subField => {
    // The part before the first "?", an empty part ("??") and the part after a "?" at the end have no content.
    if (subField === '') return;

    const match = /^(\d{2})([\s\S]*)$/.exec(subField);
    if (!match) {
      ignored.push(subField);
      return;
    }

    const code = Number(match[1]), value = match[2];
    if (code === 0) payment.bookingText = value;
    else if (code === 10) payment.primanotaNumber = value;
    else if ((code >= 20 && code <= 29) || (code >= 60 && code <= 63)) payment.text += value;
    else if (code === 30) payment.purchaserBic = value;
    else if (code === 31) payment.purchaserAccountNumber = value;
    else if (code === 32 || code === 33) payment.accountOwnerName += value;
    else if (code === 34) payment.textKeyAddition = value;
    else ignored.push(subField);
  });

  return {payment, ignored};
}

/** Convert an amount like "276,02" or "14," into minor units. */
function parseAmount(tag: string, amount: string): number {
  const [whole, fraction = ''] = amount.split(',');
  if (fraction.length > 2) throw new ParseError(`Invalid amount "${amount}".`, tag);
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}

function toIsoDate(tag: string, year: number, month: number, day: number): string {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new ParseError(`Invalid date ${year}-${month}-${day}.`, tag);
  }
  return date.toISOString().substring(0, 10);
}
