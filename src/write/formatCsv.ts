import { Extract, Statement, Transaction } from '../core';
import { formatAmount } from './amount';

const HEADER = [
  'Auftragskonto', 'Buchungstag', 'Valutadatum', 'Buchungstext', 'Verwendungszweck',
  'Beguenstigter/Zahlungspflichtiger', 'Kontonummer', 'BLZ', 'Betrag', 'Waehrung', 'Info'
];

/** Format a statement as CSV: a header and a line for every transaction. */
export function formatCsv(statement: Statement): string {
  const lines = [row(HEADER)];

  for (const extract of statement.extracts) {
    for (const transaction of extract.transactions) {
      lines.push(row(fields(extract, transaction)));
    }
  }

  return lines.join('\n') + '\n';
}

function fields(extract: Extract, transaction: Transaction): string[] {
  const payment = transaction.payment;

  return [
    extract.accountNumber,
    date(transaction.bookingDate),
    date(transaction.valueDate),
    payment.bookingText,
    payment.text,
    payment.accountOwnerName,
    payment.purchaserAccountNumber,
    payment.purchaserBic,
    signedAmount(transaction),
    extract.openingBalance.currency,
    ''
  ];
}

/** Every field is quoted, a quotation mark in a field is doubled. The line ends with a semicolon. */
function row(values: string[]): string {
  return values.map(value => `"${value.replace(/"/g, '""')}"`).join(';') + ';';
}

/** A debit and a reversed credit reduce the balance. */
function signedAmount(transaction: Transaction): string {
  const negative = transaction.type === 'debit' || transaction.type === 'reverseCredit';
  return (negative ? '-' : '') + formatAmount(transaction.amountCents);
}

/** An ISO date (YYYY-MM-DD) as "DD.MM.YY". */
function date(isoDate: string): string {
  return `${isoDate.substring(8, 10)}.${isoDate.substring(5, 7)}.${isoDate.substring(2, 4)}`;
}
