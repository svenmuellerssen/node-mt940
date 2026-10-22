import { Balance, Payment, Statement, Transaction, TransactionType } from '../core';
import { formatAmount } from './amount';
import { WriteError } from './WriteError';

const EOL = '\r\n';

const TYPE_CODES: {[type in TransactionType]: string} = {credit: 'C', debit: 'D', reverseCredit: 'RC', reverseDebit: 'RD'};

/** Format a statement as MT940 text: every extract is complete and ends with a line that consists only of "-". */
export function formatMt940(statement: Statement): string {
  const lines: string[] = [];

  for (const extract of statement.extracts) {
    lines.push(
      `:20:${statement.referenceNumber}`,
      `:25:${extract.bankCode}/${extract.accountNumber}`,
      `:28C:${extract.number}/${extract.sheetNumber}`,
      `:60${kind(extract.openingBalance)}:${balance(extract.openingBalance)}`
    );
    for (const transaction of extract.transactions) {
      lines.push(`:61:${transactionLine(transaction)}`);
      if (!isEmpty(transaction.payment)) lines.push(`:86:${paymentLine(transaction.payment)}`);
    }
    lines.push(`:62${kind(extract.closingBalance)}:${balance(extract.closingBalance)}`, '-');
  }

  return lines.join(EOL) + EOL;
}

/** "M" for an intermediate balance, "F" for an absolute one. */
function kind(value: Balance): 'M' | 'F' {
  return value.intermediate ? 'M' : 'F';
}

function balance(value: Balance): string {
  return (value.direction === 'credit' ? 'C' : 'D') + shortDate(value.date) + value.currency + formatAmount(value.amountCents);
}

/** An ISO date (YYYY-MM-DD) as "YYMMDD". */
function shortDate(isoDate: string): string {
  return isoDate.substring(2, 4) + isoDate.substring(5, 7) + isoDate.substring(8, 10);
}

/** The booking date has no year ("MMDD"), the year is taken from the valuta when the line is read. */
function transactionLine(transaction: Transaction): string {
  return shortDate(transaction.valueDate)
    + transaction.bookingDate.substring(5, 7) + transaction.bookingDate.substring(8, 10)
    + TYPE_CODES[transaction.type]
    + transaction.currencyLastChar
    + formatAmount(transaction.amountCents)
    + transaction.bookingKey
    + transaction.reference;
}

/** The core creates such a payment information for a transaction (:61:) without payment information (:86:). */
function isEmpty(payment: Payment): boolean {
  return payment.gvc === null && payment.text === '';
}

/** The sub fields of a structured payment information (:86:). Only the booking text is written even if it is empty. */
const SUB_FIELDS: Array<{code: string, label: string, value: (payment: Payment) => string, always?: boolean}> = [
  {code: '00', label: 'booking text', value: payment => payment.bookingText, always: true},
  {code: '10', label: 'primanota number', value: payment => payment.primanotaNumber},
  {code: '20', label: 'purpose of payment', value: payment => payment.text},
  {code: '30', label: 'purchaser BIC', value: payment => payment.purchaserBic},
  {code: '31', label: 'purchaser account number', value: payment => payment.purchaserAccountNumber},
  {code: '32', label: 'account owner name', value: payment => payment.accountOwnerName},
  {code: '34', label: 'text key addition', value: payment => payment.textKeyAddition}
];

/**
 * A payment information without business transaction code is written as its text only. A structured one
 * starts with the code, followed by its sub fields ("?00..."). A "?" in a value would start another sub field.
 */
function paymentLine(payment: Payment): string {
  if (payment.gvc === null) {
    if (/^\d{3}\?/.test(payment.text)) {
      throw new WriteError(`The text "${payment.text}" of the unstructured payment information would be read as structured.`);
    }
    return payment.text;
  }

  return String(payment.gvc).padStart(3, '0') + SUB_FIELDS
    .filter(field => field.always || field.value(payment) !== '')
    .map(field => {
      const value = field.value(payment);
      if (value.includes('?')) throw new WriteError(`The ${field.label} "${value}" contains a "?", that separates the sub fields.`);
      return `?${field.code}${value}`;
    })
    .join('');
}
