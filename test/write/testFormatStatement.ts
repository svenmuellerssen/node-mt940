import should from 'should';
import { Balance, Extract, Payment, Statement, Transaction } from '../../src/core';
import { formatStatement, WriteError } from '../../src/write';

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

function balance(amountCents: number, date: string, overrides: Partial<Balance> = {}): Balance {
  return {direction: 'credit', amountCents, currency: 'EUR', date, intermediate: false, ...overrides};
}

function payment(overrides: Partial<Payment> = {}): Payment {
  return {
    gvc: 6,
    bookingText: 'SONSTIGER EINZUG',
    primanotaNumber: '9208',
    text: 'EC 65421206 150115184614IC5',
    purchaserBic: '30050000',
    purchaserAccountNumber: '1107713',
    accountOwnerName: 'SATURN SAGT DANKE 65421206',
    textKeyAddition: '011',
    ...overrides
  };
}

/** A payment information without any content, as the core creates it for a transaction without :86:. */
const nothing: Payment = {
  gvc: null, bookingText: '', primanotaNumber: '', text: '', purchaserBic: '', purchaserAccountNumber: '',
  accountOwnerName: '', textKeyAddition: ''
};

/** A payment information without business transaction code: only the text is known. */
function unstructured(text: string): Payment {
  return {...nothing, text};
}

function transaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    valueDate: '2015-01-16',
    bookingDate: '2015-01-16',
    type: 'debit',
    amountCents: 1499,
    currencyLastChar: 'R',
    bookingKey: 'N037',
    reference: 'NONREF',
    payment: payment(),
    ...overrides
  };
}

function extract(openingBalance: Balance, closingBalance: Balance, transactions: Transaction[]): Extract {
  return {
    bankCode: '10050000',
    accountNumber: '6013216264',
    number: '00000',
    sheetNumber: '001',
    openingBalance,
    closingBalance,
    transactions
  };
}

function statementOf(...extracts: Extract[]): Statement {
  return {referenceNumber: 'STARTUMSE', extracts, warnings: []};
}

/** A statement with one extract that has the given transactions. */
function statementWith(...transactions: Transaction[]): Statement {
  return statementOf(extract(balance(27602, '2015-01-15'), balance(21103, '2015-01-16'), transactions));
}

/** The content of test/fixtures/sparkasse.txt: two extracts with two and one transaction. */
const firstTransaction = transaction()
  , secondTransaction = transaction({
    amountCents: 5000,
    bookingKey: 'N004',
    reference: 'NONREF//100000155234',
    payment: payment({
      bookingText: 'GELDAUTOMAT',
      primanotaNumber: '3342',
      text: '16.01/15.52UHR 650 897642',
      purchaserBic: '10050000',
      purchaserAccountNumber: '',
      accountOwnerName: 'GA NR00003342 BLZ10050000 5',
      textKeyAddition: '003'
    })
  })
  , thirdTransaction = transaction({
    valueDate: '2015-01-19',
    bookingDate: '2015-01-19',
    amountCents: 200,
    bookingKey: 'N024',
    payment: payment({
      gvc: 809,
      bookingText: 'ENTGELTABSCHLUSS',
      primanotaNumber: '6666',
      text: 'Entgeltabrechnung siehe Anlage',
      purchaserBic: '10050000',
      purchaserAccountNumber: '',
      accountOwnerName: '',
      textKeyAddition: ''
    })
  })
  , statement = statementOf(
    extract(balance(27602, '2015-01-15'), balance(21103, '2015-01-16'), [firstTransaction, secondTransaction]),
    extract(balance(21103, '2015-01-16'), balance(20903, '2015-01-19'), [thirdTransaction])
  );

/** The lines of a MT940 text (without the empty text after the last line ending). */
function mt940Lines(source: Statement = statement): string[] {
  const lines = formatStatement(source, 'mt940').split('\r\n');
  lines.pop();
  return lines;
}

/** The lines of a CSV text (without the empty text after the last line ending). */
function csvLines(source: Statement = statement): string[] {
  const lines = formatStatement(source, 'csv').split('\n');
  lines.pop();
  return lines;
}

describe('Test formatStatement', function() {
  describe('as MT940 text', function() {
    it('W1: an extract starts with the reference number, the account, the extract number and the opening balance.', function() {
      should(mt940Lines().slice(0, 4)).be.eql([
        ':20:STARTUMSE',
        ':25:10050000/6013216264',
        ':28C:00000/001',
        ':60F:C150115EUR276,02'
      ]);
    });

    it('W2: a transaction (:61:) has the valuta as "YYMMDD", the booking date as "MMDD" and its reference.', function() {
      const lines = mt940Lines().filter(line => line.startsWith(':61:'));

      should(lines[0]).be.equal(':61:1501160116DR14,99N037NONREF');
      should(lines[1]).be.equal(':61:1501160116DR50,00N004NONREF//100000155234');
    });

    it('W2b: credit, reverseCredit and reverseDebit are written as "C", "RC" and "RD".', function() {
      const lines = mt940Lines(statementWith(
        transaction({type: 'credit'}), transaction({type: 'reverseCredit'}), transaction({type: 'reverseDebit'})
      )).filter(line => line.startsWith(':61:'));

      should(lines).be.eql([
        ':61:1501160116CR14,99N037NONREF',
        ':61:1501160116RCR14,99N037NONREF',
        ':61:1501160116RDR14,99N037NONREF'
      ]);
    });

    it('W3: the payment information (:86:) has all of its structured sub fields.', function() {
      const lines = mt940Lines().filter(line => line.startsWith(':86:'));

      should(lines[0]).be.equal(
        ':86:006?00SONSTIGER EINZUG?109208?20EC 65421206 150115184614IC5?3030050000?311107713?32SATURN SAGT DANKE 65421206?34011'
      );
    });

    it('W4: every extract ends with its closing balance and "-", all extracts and transactions are written.', function() {
      const tags = mt940Lines().map(line => line.startsWith(':') ? line.substring(0, line.indexOf(':', 1) + 1) : line);

      should(tags).be.eql([
        ':20:', ':25:', ':28C:', ':60F:', ':61:', ':86:', ':61:', ':86:', ':62F:', '-',
        ':20:', ':25:', ':28C:', ':60F:', ':61:', ':86:', ':62F:', '-'
      ]);
      should(mt940Lines().filter(line => line.startsWith(':62F:'))).be.eql([':62F:C150116EUR211,03', ':62F:C150119EUR209,03']);
    });

    it('W5: every line ends with CRLF.', function() {
      const text = formatStatement(statement, 'mt940');

      should(text.endsWith('\r\n')).be.true();
      should(text.replace(/\r\n/g, '')).not.match(/[\r\n]/);
    });

    it('W15: an intermediate balance is written as :60M: and :62M:, an absolute one as :60F: and :62F:.', function() {
      const lines = mt940Lines(statementOf(extract(
        balance(27602, '2015-01-15', {intermediate: true}), balance(21103, '2015-01-16', {intermediate: true}), [firstTransaction]
      )));

      should(lines.filter(line => /^:6[02][FM]:/.test(line))).be.eql([':60M:C150115EUR276,02', ':62M:C150116EUR211,03']);
      should(mt940Lines().filter(line => /^:6[02][FM]:/.test(line)))
        .be.eql([':60F:C150115EUR276,02', ':62F:C150116EUR211,03', ':60F:C150116EUR211,03', ':62F:C150119EUR209,03']);
    });

    it('W12a: an unstructured payment information (:86:) is written as its text only, a "?" in the text stays.', function() {
      const lines = mt940Lines(statementWith(
        transaction({payment: unstructured('Barauszahlung ohne Struktur')}),
        transaction({payment: unstructured('Warum? Darum')})
      )).filter(line => line.startsWith(':86:'));

      should(lines).be.eql([':86:Barauszahlung ohne Struktur', ':86:Warum? Darum']);
    });

    it('W12b: an unstructured text that would be read as structured ("123?...") ends in a WriteError.', function() {
      const error = failure(() => formatStatement(statementWith(transaction({payment: unstructured('123?abc')})), 'mt940'));

      should(error instanceof WriteError).be.true();
      should(error.message).be.a.String().and.not.be.empty();
    });

    it('W13: empty sub fields are left out, only the booking text (?00) is always written.', function() {
      const lines = mt940Lines().filter(line => line.startsWith(':86:'))
        , emptyLines = mt940Lines(statementWith(transaction({payment: {...nothing, gvc: 6}}))).filter(line => line.startsWith(':86:'));

      should(lines[1]).be.equal(
        ':86:006?00GELDAUTOMAT?103342?2016.01/15.52UHR 650 897642?3010050000?32GA NR00003342 BLZ10050000 5?34003'
      );
      should(lines[2]).be.equal(':86:809?00ENTGELTABSCHLUSS?106666?20Entgeltabrechnung siehe Anlage?3010050000');
      should(emptyLines).be.eql([':86:006?00']);
    });

    it('W14: a "?" in the value of a structured sub field ends in a WriteError that names the field.', function() {
      const fields: Array<[keyof Payment, string]> = [
        ['bookingText', 'booking text'],
        ['primanotaNumber', 'primanota number'],
        ['text', 'purpose of payment'],
        ['purchaserBic', 'purchaser BIC'],
        ['purchaserAccountNumber', 'purchaser account number'],
        ['accountOwnerName', 'account owner name'],
        ['textKeyAddition', 'text key addition']
      ];

      fields.forEach(function([field, label]) {
        const error = failure(() => formatStatement(
          statementWith(transaction({payment: payment({[field]: 'a?b'})})), 'mt940'
        ));

        should(error instanceof WriteError).be.true();
        should(error.message).containEql(label);
      });
    });

    it('W16: a transaction without any payment information is written without a :86: line.', function() {
      const lines = mt940Lines(statementWith(transaction({payment: nothing})))
        , csv = csvLines(statementWith(transaction({payment: nothing})));

      should(lines.filter(line => line.startsWith(':61:'))).be.eql([':61:1501160116DR14,99N037NONREF']);
      should(lines.filter(line => line.startsWith(':86:'))).be.eql([]);
      should(csv[1]).be.equal('"6013216264";"16.01.15";"16.01.15";"";"";"";"";"";"-14,99";"EUR";"";');
    });

    it('W17: amounts in cent are written with a comma and two decimals.', function() {
      const credit = (amountCents: number) => transaction({type: 'credit', amountCents})
        , source = statementOf(extract(balance(5, '2015-01-15'), balance(100000, '2015-01-16'), [credit(5), credit(200), credit(100000)]))
        , lines = mt940Lines(source);

      should(lines.filter(line => line.startsWith(':61:'))).be.eql([
        ':61:1501160116CR0,05N037NONREF', ':61:1501160116CR2,00N037NONREF', ':61:1501160116CR1000,00N037NONREF'
      ]);
      should(lines.filter(line => /^:6[02]F:/.test(line))).be.eql([':60F:C150115EUR0,05', ':62F:C150116EUR1000,00']);
      should(csvLines(source).slice(1).map(line => line.split(';')[8])).be.eql(['"0,05"', '"2,00"', '"1000,00"']);
    });
  });

  describe('as CSV', function() {
    it('W7: the first line is the header.', function() {
      should(csvLines()[0]).be.equal(
        '"Auftragskonto";"Buchungstag";"Valutadatum";"Buchungstext";"Verwendungszweck";'
        + '"Beguenstigter/Zahlungspflichtiger";"Kontonummer";"BLZ";"Betrag";"Waehrung";"Info";'
      );
    });

    it('W8a: every transaction has a line with the account, the dates as "DD.MM.YY" and a negative amount for a debit.', function() {
      should(csvLines().slice(1)).be.eql([
        '"6013216264";"16.01.15";"16.01.15";"SONSTIGER EINZUG";"EC 65421206 150115184614IC5";'
          + '"SATURN SAGT DANKE 65421206";"1107713";"30050000";"-14,99";"EUR";"";',
        '"6013216264";"16.01.15";"16.01.15";"GELDAUTOMAT";"16.01/15.52UHR 650 897642";'
          + '"GA NR00003342 BLZ10050000 5";"";"10050000";"-50,00";"EUR";"";',
        '"6013216264";"19.01.15";"19.01.15";"ENTGELTABSCHLUSS";"Entgeltabrechnung siehe Anlage";'
          + '"";"";"10050000";"-2,00";"EUR";"";'
      ]);
    });

    it('W8b: a credit and a reversed debit are positive, a debit and a reversed credit are negative.', function() {
      const lines = csvLines(statementWith(
        transaction({type: 'credit', amountCents: 10000}),
        transaction({type: 'reverseCredit', amountCents: 500}),
        transaction({type: 'reverseDebit', amountCents: 700}),
        transaction({type: 'debit', amountCents: 1499})
      ));

      should(lines.slice(1).map(line => line.split(';')[8])).be.eql(['"100,00"', '"-5,00"', '"7,00"', '"-14,99"']);
    });

    it('W9: a quotation mark in a text is doubled.', function() {
      const lines = csvLines(statementWith(transaction({payment: payment({text: 'Say "hi"'})})));

      should(lines[1].split(';')[4]).be.equal('"Say ""hi"""');
    });
  });

  describe('with an invalid statement or format', function() {
    it('W6: a statement without an extract ends in a WriteError.', function() {
      const empty = statementOf();

      ['mt940', 'csv'].forEach(function(format) {
        const error = failure(() => formatStatement(empty, format as 'mt940' | 'csv'));

        should(error instanceof WriteError).be.true();
        should(error.message).be.a.String().and.not.be.empty();
      });
    });

    it('W10: the format "xml" is not supported and ends in a WriteError.', function() {
      const error = failure(() => formatStatement(statement, 'xml' as any));

      should(error instanceof WriteError).be.true();
      should(error.message).be.a.String().and.not.be.empty();
    });
  });
});
