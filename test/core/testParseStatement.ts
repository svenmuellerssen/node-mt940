import should from 'should';
import { parseStatement, ParseError } from '../../src/core';

/**
 * Join the given lines to a MT940 text using the given line ending.
 */
function text(lines: string[], eol: string = '\r\n'): string {
  return lines.join(eol) + eol;
}

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

const header = [
  ':20:STARTUMSE',
  ':25:10050000/6013216264',
  ':28C:00000/001',
  ':60F:C150115EUR276,02'
];

const firstExtract = [
  ...header,
  ':61:1501160116DR14,99N037NONREF',
  ':86:006?00SONSTIGER EINZUG?109208?20EC 65421206 150115184614IC5?3030050000',
  '?311107713?32SATURN SAGT DANKE 65421206?34011',
  ':61:1501160116DR50,00N004NONREF//100000155234',
  ':86:006?00GELDAUTOMAT?103342?2016.01/15.52UHR 650 897642?3010050000?32GA NR00003342 BLZ10050000 5?34003',
  ':62F:C150116EUR211,03',
  '-'
];

const secondExtract = [
  ':20:STARTUMSE',
  ':25:10050000/6013216264',
  ':28C:00000/001',
  ':60F:C150116EUR211,03',
  ':61:1501190119DR2,00N024NONREF',
  ':86:809?00ENTGELTABSCHLUSS?106666?20Entgeltabrechnung?21siehe Anlage?3010050000',
  ':62F:C150119EUR209,03',
  '-'
];

/**
 * Build an extract with the given :61:/:86: lines between the opening and closing balance.
 */
function extractWith(lines: string[]): string {
  return text([...header, ...lines, ':62F:C150116EUR211,03', '-']);
}

describe('Test parseStatement', function() {

  it('P1: the reference number (:20:) is set at the statement.', function() {
    const statement = parseStatement(text(firstExtract));

    should(statement.referenceNumber).be.equal('STARTUMSE');
  });

  it('P2: the account (:25:) is split into bank code and account number.', function() {
    const extract = parseStatement(text(firstExtract)).extracts[0];

    should(extract.bankCode).be.equal('10050000');
    should(extract.accountNumber).be.equal('6013216264');
  });

  it('P3: the extract number and sheet number (:28C:) are set.', function() {
    const extract = parseStatement(text(firstExtract)).extracts[0];

    should(extract.number).be.equal('00000');
    should(extract.sheetNumber).be.equal('001');
  });

  it('P4: opening balance (:60F:) and closing balance (:62F:) are set.', function() {
    const extract = parseStatement(text(firstExtract)).extracts[0];

    should(extract.openingBalance).eql({direction: 'credit', amountCents: 27602, currency: 'EUR', date: '2015-01-15', intermediate: false});
    should(extract.closingBalance).eql({direction: 'credit', amountCents: 21103, currency: 'EUR', date: '2015-01-16', intermediate: false});
  });

  it('P5: transactions (:61:) are parsed in their order.', function() {
    const transactions = parseStatement(text(firstExtract)).extracts[0].transactions;

    should(transactions.length).be.equal(2);

    should(transactions[0].valueDate).be.equal('2015-01-16');
    should(transactions[0].bookingDate).be.equal('2015-01-16');
    should(transactions[0].type).be.equal('debit');
    should(transactions[0].amountCents).be.equal(1499);
    should(transactions[0].currencyLastChar).be.equal('R');
    should(transactions[0].bookingKey).be.equal('N037');
    should(transactions[0].reference).be.equal('NONREF');

    should(transactions[1].amountCents).be.equal(5000);
    should(transactions[1].bookingKey).be.equal('N004');
    should(transactions[1].reference).be.equal('NONREF//100000155234');
  });

  it('P6: every transaction gets its own payment information (:86:).', function() {
    const transactions = parseStatement(text(firstExtract)).extracts[0].transactions;

    should(transactions[0].payment.gvc).be.equal(6);
    should(transactions[0].payment.bookingText).be.equal('SONSTIGER EINZUG');
    should(transactions[1].payment.gvc).be.equal(6);
    should(transactions[1].payment.bookingText).be.equal('GELDAUTOMAT');
  });

  it('P7: a payment information (:86:) wrapped over several lines is joined.', function() {
    const payment = parseStatement(text(firstExtract)).extracts[0].transactions[0].payment;

    should(payment.purchaserBic).be.equal('30050000');
    should(payment.purchaserAccountNumber).be.equal('1107713');
    should(payment.accountOwnerName).be.equal('SATURN SAGT DANKE 65421206');
    should(payment.textKeyAddition).be.equal('011');
  });

  it('P8: several extracts separated by "-" are parsed in their order.', function() {
    const statement = parseStatement(text([...firstExtract, ...secondExtract]));

    should(statement.extracts.length).be.equal(2);
    should(statement.extracts[0].openingBalance.amountCents).be.equal(27602);
    should(statement.extracts[0].transactions.length).be.equal(2);
    should(statement.extracts[1].openingBalance.amountCents).be.equal(21103);
    should(statement.extracts[1].closingBalance.amountCents).be.equal(20903);
    should(statement.extracts[1].transactions.length).be.equal(1);
    should(statement.extracts[1].transactions[0].payment.bookingText).be.equal('ENTGELTABSCHLUSS');
  });

  it('P9: credits and reversals get their transaction type.', function() {
    const payment = ':86:166?00GUTSCHRIFT?109223?20SVWZ+Test?30DEUTDEDBBER';
    const transactions = parseStatement(extractWith([
      ':61:1501190119CR130,00N062NONREF', payment,
      ':61:1501190119RCR5,00N062NONREF', payment,
      ':61:1501190119RDR5,00N062NONREF', payment
    ])).extracts[0].transactions;

    should(transactions.map(t => t.type)).eql(['credit', 'reverseCredit', 'reverseDebit']);
    should(transactions.map(t => t.amountCents)).eql([13000, 500, 500]);
  });

  it('P10: windows (CRLF) and unix (LF) line endings give the same result.', function() {
    const windows = parseStatement(text(firstExtract, '\r\n'))
      , unix = parseStatement(text(firstExtract, '\n'));

    should(unix).eql(windows);
    should(windows.extracts[0].transactions.length).be.equal(2);
  });

  it('P11: a hyphen inside of the text does not separate extracts.', function() {
    const statement = parseStatement(extractWith([
      ':61:1501190119DR20,00N033NONREF',
      ':86:177?00ONLINE-UEBERWEISUNG?109310?20SVWZ+Kreditkarte BERLIN-',
      '?21 DATUM 17.01.2015, 22:42 UHR?30BELADEBEXXX'
    ]));

    should(statement.extracts.length).be.equal(1);
    const payment = statement.extracts[0].transactions[0].payment;
    should(payment.bookingText).be.equal('ONLINE-UEBERWEISUNG');
    should(payment.text).be.equal('SVWZ+Kreditkarte BERLIN- DATUM 17.01.2015, 22:42 UHR');
    should(payment.purchaserBic).be.equal('BELADEBEXXX');
  });

  it('P12: unsupported tags are ignored.', function() {
    const statement = parseStatement(text([
      ...header,
      ':61:1501160116DR14,99N037NONREF',
      ':86:006?00SONSTIGER EINZUG?109208?20EC 65421206?3030050000',
      ':65:C150116EUR999,99',
      ':62F:C150116EUR211,03',
      ':64:C150116EUR211,03',
      '-'
    ]));

    should(statement.extracts[0].closingBalance.amountCents).be.equal(21103);
    should(statement.extracts[0].transactions.length).be.equal(1);
  });

  it('P13: empty content ends in a ParseError.', function() {
    ['', '  \r\n\r\n', '-\r\n'].forEach(function(content) {
      const error = failure(() => parseStatement(content));

      should(error instanceof ParseError).be.true();
      should(error.message).be.a.String().and.not.be.empty();
    });
  });

  it('P14: a defective line ends in a ParseError that names the tag.', function() {
    const brokenTransaction = failure(() => parseStatement(extractWith([':61:garbage'])))
      , brokenBalance = failure(() => parseStatement(text([...header.slice(0, 3), ':60F:X', ':62F:C150116EUR211,03', '-'])));

    should(brokenTransaction instanceof ParseError).be.true();
    should(brokenTransaction.tag).be.equal('61');
    should(brokenBalance instanceof ParseError).be.true();
    should(brokenBalance.tag).be.equal('60F');
  });

  describe('balances and dates', function() {
    const transaction = ':61:1501160116DR14,99N037NONREF'
      , payment = ':86:006?00GELDAUTOMAT?103342?3010050000';

    /** A transaction (:61:) with the given line, between the opening and the closing balance. */
    function transactionAt(line: string) {
      return parseStatement(extractWith([line, payment])).extracts[0].transactions[0];
    }

    it('C1: the balances :60M: and :62M: are intermediate, :60F: and :62F: are not.', function() {
      const absolute = parseStatement(text(firstExtract)).extracts[0]
        , intermediate = parseStatement(text([
          ...header.slice(0, 3), ':60M:D150115EUR276,02', transaction, payment, ':62M:C150116EUR211,03', '-'
        ])).extracts[0];

      should(absolute.openingBalance.intermediate).be.false();
      should(absolute.closingBalance.intermediate).be.false();
      should(intermediate.openingBalance.intermediate).be.true();
      should(intermediate.openingBalance.direction).be.equal('debit');
      should(intermediate.closingBalance.intermediate).be.true();
    });

    it('C2: an extract that ends with :62M: has this balance as closing balance.', function() {
      const statement = parseStatement(text([...header, transaction, payment, ':62M:C150116EUR211,03', '-']));

      should(statement.extracts[0].closingBalance)
        .eql({direction: 'credit', amountCents: 21103, currency: 'EUR', date: '2015-01-16', intermediate: true});
      should(statement.warnings).eql([]);
    });

    it('C3: unsupported tags are reported, :62M: is not one of them.', function() {
      const statement = parseStatement(text([...header, transaction, payment, ':62M:C150116EUR211,03', ':64:C150116EUR211,03', '-']));

      should(summary(statement.warnings)).eql([{code: 'UNSUPPORTED_TAG', tag: '64', line: 8}]);
    });

    it('C4: a transaction (:61:) without booking date books at the day of its valuta.', function() {
      const booked = transactionAt(':61:150116DR14,99N037NONREF');

      should(booked.valueDate).be.equal('2015-01-16');
      should(booked.bookingDate).be.equal('2015-01-16');
      should(booked.amountCents).be.equal(1499);
    });

    it('C5: the booking date is set independent of the day of the valuta.', function() {
      // The valuta is the 31st of January, there is no 31st of February.
      const booked = transactionAt(':61:1501310201CR1,00N000NONREF');

      should(booked.valueDate).be.equal('2015-01-31');
      should(booked.bookingDate).be.equal('2015-02-01');
    });

    it('C6: a booking in december of a valuta in january belongs to the year before.', function() {
      const booked = transactionAt(':61:1501051230CR1,00N000NONREF');

      should(booked.valueDate).be.equal('2015-01-05');
      should(booked.bookingDate).be.equal('2014-12-30');
    });

    it('C7: a booking in january of a valuta in december belongs to the year after.', function() {
      const booked = transactionAt(':61:1412300102CR1,00N000NONREF');

      should(booked.valueDate).be.equal('2014-12-30');
      should(booked.bookingDate).be.equal('2015-01-02');
    });

    it('C8: an impossible date ends in a ParseError that names the tag.', function() {
      const brokenTransaction = failure(() => parseStatement(extractWith([':61:1502300101CR1,00N000NONREF', payment])))
        , brokenBalance = failure(() => parseStatement(text([...header.slice(0, 3), ':60F:C150231EUR1,00', ':62F:C150116EUR211,03', '-'])));

      should(brokenTransaction instanceof ParseError).be.true();
      should(brokenTransaction.tag).be.equal('61');
      should(brokenBalance instanceof ParseError).be.true();
      should(brokenBalance.tag).be.equal('60F');
    });

    it('C9: the reference number of the statement is the one (:20:) of the first extract.', function() {
      const statement = parseStatement(text([
        ...firstExtract,
        ':20:OTHER', ...header.slice(1), transaction, payment, ':62F:C150116EUR211,03', '-'
      ]));

      should(statement.extracts.length).be.equal(2);
      should(statement.referenceNumber).be.equal('STARTUMSE');
    });
  });
});

/**
 * Cases that parse, but lose or guess information. Every one of them has to be reported as warning.
 * The line numbers in the expectations are the (1 based) positions in the lines below.
 */
const closing = ':62F:C150116EUR211,03';
const payment = ':86:006?00GELDAUTOMAT?103342?3010050000';

const warningCases = {
  unstructuredPayment: {
    lines: [...header, ':61:1501160116DR14,99N037NONREF', ':86:Barauszahlung ohne Struktur', closing, '-'],
    expected: [{code: 'UNSTRUCTURED_PAYMENT', tag: '86', line: 6}]
  },
  transactionWithoutPayment: {
    lines: [...header, ':61:1501160116DR14,99N037NONREF', ':61:1501160116DR50,00N004NONREF', payment,
      ':61:1501160116DR7,00N004NONREF', closing, '-'],
    expected: [
      {code: 'TRANSACTION_WITHOUT_PAYMENT', tag: '61', line: 5},
      {code: 'TRANSACTION_WITHOUT_PAYMENT', tag: '61', line: 8}
    ]
  },
  paymentWithoutTransaction: {
    lines: [...header, ':61:1501160116DR14,99N037NONREF', payment, closing, ':86:Hinweis fuer den Kontoinhaber', '-'],
    expected: [{code: 'PAYMENT_WITHOUT_TRANSACTION', tag: '86', line: 8}]
  },
  accountWithoutBankCode: {
    lines: [':20:STARTUMSE', ':25:DE89370400440532013000', ':28C:00000/001', ':60F:C150115EUR276,02',
      ':61:1501160116DR14,99N037NONREF', payment, closing, '-'],
    expected: [{code: 'ACCOUNT_WITHOUT_BANK_CODE', tag: '25', line: 2}]
  },
  unsupportedTags: {
    lines: [...header, ':61:1501160116DR14,99N037NONREF', payment, ':65:C150116EUR999,99', closing,
      ':64:C150116EUR211,03', '-'],
    expected: [
      {code: 'UNSUPPORTED_TAG', tag: '65', line: 7},
      {code: 'UNSUPPORTED_TAG', tag: '64', line: 9}
    ]
  },
  ignoredLines: {
    lines: ['STRAY LINE BEFORE THE FIRST TAG', ...header, ':61:1501160116DR14,99N037NONREF', '/EREF+1234', payment, closing, '-'],
    expected: [
      {code: 'IGNORED_LINE', tag: undefined, line: 1},
      {code: 'IGNORED_LINE', tag: '61', line: 7}
    ]
  }
};

function summary(warnings: ReadonlyArray<{code: string, tag?: string, line: number}>) {
  return warnings.map(w => ({code: w.code, tag: w.tag, line: w.line}));
}

describe('Test parseStatement warnings', function() {

  it('P15: an unstructured payment information (:86:) is kept as text and reported.', function() {
    const statement = parseStatement(text(warningCases.unstructuredPayment.lines))
      , transaction = statement.extracts[0].transactions[0];

    should(transaction.payment.gvc).be.null();
    should(transaction.payment.text).be.equal('Barauszahlung ohne Struktur');
    should(summary(statement.warnings)).eql(warningCases.unstructuredPayment.expected);
    should(statement.warnings[0].message).be.a.String().and.not.be.empty();
  });

  it('P16: a missing mandatory tag (:25:, :60F:, :62F:) ends in a ParseError.', function() {
    [['25', ':25:'], ['60F', ':60F:'], ['62F', ':62F:']].forEach(function([tag, prefix]) {
      const lines = firstExtract.filter(line => !line.startsWith(prefix))
        , error = failure(() => parseStatement(text(lines)));

      should(error instanceof ParseError).be.true();
      should(error.tag).be.equal(tag);
    });
  });

  it('P17: a transaction (:61:) without payment information (:86:) is kept and reported.', function() {
    const statement = parseStatement(text(warningCases.transactionWithoutPayment.lines))
      , transactions = statement.extracts[0].transactions;

    should(transactions.length).be.equal(3);
    should(transactions[0].payment.bookingText).be.equal('');
    should(transactions[0].payment.gvc).be.null();
    should(transactions[1].payment.bookingText).be.equal('GELDAUTOMAT');
    should(transactions[2].payment.bookingText).be.equal('');
    should(summary(statement.warnings)).eql(warningCases.transactionWithoutPayment.expected);
  });

  it('P18: a payment information (:86:) without a transaction is ignored and reported.', function() {
    const statement = parseStatement(text(warningCases.paymentWithoutTransaction.lines));

    should(statement.extracts[0].transactions.length).be.equal(1);
    should(statement.extracts[0].transactions[0].payment.bookingText).be.equal('GELDAUTOMAT');
    should(summary(statement.warnings)).eql(warningCases.paymentWithoutTransaction.expected);
  });

  it('P19: an account (:25:) without "/" is taken completely as account number and reported.', function() {
    const statement = parseStatement(text(warningCases.accountWithoutBankCode.lines))
      , extract = statement.extracts[0];

    should(extract.bankCode).be.equal('');
    should(extract.accountNumber).be.equal('DE89370400440532013000');
    should(summary(statement.warnings)).eql(warningCases.accountWithoutBankCode.expected);
  });

  it('P20: unsupported tags are ignored and reported.', function() {
    const statement = parseStatement(text(warningCases.unsupportedTags.lines));

    should(statement.extracts[0].closingBalance.amountCents).be.equal(21103);
    should(summary(statement.warnings)).eql(warningCases.unsupportedTags.expected);
  });

  it('P21: lines that belong to no supported field are ignored and reported.', function() {
    const statement = parseStatement(text(warningCases.ignoredLines.lines));

    should(statement.extracts[0].transactions.length).be.equal(1);
    should(summary(statement.warnings)).eql(warningCases.ignoredLines.expected);
  });

  it('P22: a clean statement has no warnings.', function() {
    const statement = parseStatement(text([...firstExtract, ...secondExtract]));

    should(statement.warnings).eql([]);
  });

  it('P23: in strict mode every warning ends in a ParseError.', function() {
    Object.values(warningCases).forEach(function(warningCase) {
      const error = failure(() => parseStatement(text(warningCase.lines), {strict: true}));

      should(error instanceof ParseError).be.true();
      should(error.message).containEql(warningCase.expected[0].code);
      should(error.tag).be.equal(warningCase.expected[0].tag);
    });

    should(parseStatement(text(firstExtract), {strict: true}).warnings).eql([]);
  });
});
