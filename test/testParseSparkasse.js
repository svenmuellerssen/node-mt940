var should = require('should')
  , path = require('path')
  , ring = require('ring')
  , SparkasseParser = require('../src/parser/Sparkasse')
  , Revenue = require('../src/object/Revenue')
  , Extract = require('../src/object/Extract')
  , Saldo = require('../src/object/Saldo')
  , Transaction = require('../src/object/Transaction')
  , PaymentReference = require('../src/object/PaymentReference')
  , fixturePath = path.join(__dirname, 'fixtures', 'sparkasse.txt');

/**
 * Join the given lines to a MT940 text with windows line endings (CRLF).
 * @param lines {Array}
 * @returns {string}
 */
function mt940(lines) {
  return lines.join('\r\n') + '\r\n';
}

/**
 * Parse the given content with the Sparkasse parser.
 * @param content {string}
 * @param callback {function}
 */
function parse(content, callback) {
  SparkasseParser.instance().setContent(content).execute(null, callback);
}

var singleExtract = [
  ':20:STARTUMSE',
  ':25:10050000/6013216264',
  ':28C:00000/001',
  ':60F:C150115EUR276,02',
  ':61:1501160116DR14,99N037NONREF',
  ':86:006?00SONSTIGER EINZUG?109208?20EC 65421206 150115184614IC5?3030050000',
  '?311107713?32SATURN SAGT DANKE 65421206?34011',
  ':61:1501160116DR50,00N004NONREF//100000155234',
  ':86:006?00GELDAUTOMAT?103342?2016.01/15.52UHR 650 897642?3010050000?32GA NR00003342 BLZ10050000 5?34003',
  ':62F:C150116EUR211,03',
  '-'
];

describe('Test Sparkasse parser', function() {

  it('Test the reference number (:20:) is set at the revenue object.', function(done) {
    parse(mt940(singleExtract), function(error, revenue) {
      should(error).be.null();
      should(ring.instance(revenue, Revenue)).be.true();
      should(revenue.getReferenceNumber()).be.a.String().and.be.equal('STARTUMSE');

      done();
    });
  });

  it('Test the account (:25:) is split into bank code and account number.', function(done) {
    parse(mt940(singleExtract), function(error, revenue) {
      should(error).be.null();
      var extract = revenue.getExtracts().first();
      should(ring.instance(extract, Extract)).be.true();
      should(extract.getBankCode()).be.a.String().and.be.equal('10050000');
      should(extract.getAccountNumber()).be.a.String().and.be.equal('6013216264');

      done();
    });
  });

  it('Test the extract number and sheet number (:28C:) are set.', function(done) {
    parse(mt940(singleExtract), function(error, revenue) {
      should(error).be.null();
      var extract = revenue.getExtracts().first();
      should(extract.getNumber()).be.a.String().and.be.equal('00000');
      should(extract.getSheetNumber()).be.a.String().and.be.equal('001');

      done();
    });
  });

  it('Test start saldo (:60F:) and end saldo (:62F:) are set.', function(done) {
    parse(mt940(singleExtract), function(error, revenue) {
      should(error).be.null();
      var extract = revenue.getExtracts().first()
        , saldoStart = extract.getStartSaldo()
        , saldoEnd = extract.getEndSaldo();

      should(ring.instance(saldoStart, Saldo)).be.true();
      should(saldoStart.getCreditDebit()).be.equal(Saldo.TYPE_CREDIT);
      should(saldoStart.getCurrency()).be.equal('EUR');
      should(saldoStart.getAmount()).be.equal('276,02');

      should(ring.instance(saldoEnd, Saldo)).be.true();
      should(saldoEnd.getCreditDebit()).be.equal(Saldo.TYPE_CREDIT);
      should(saldoEnd.getCurrency()).be.equal('EUR');
      should(saldoEnd.getAmount()).be.equal('211,03');

      done();
    });
  });

  it('Test transactions (:61:) get their payment reference (:86:).', function(done) {
    parse(mt940(singleExtract), function(error, revenue) {
      should(error).be.null();
      var transactions = revenue.getExtracts().first().getTransactions();
      should(transactions.size).be.equal(2);

      var first = transactions.first()
        , last = transactions.last();

      should(ring.instance(first, Transaction)).be.true();
      should(first.getAmount()).be.equal('14,99');
      should(first.getBookingKey()).be.equal('N037');
      should(ring.instance(first.getPaymentReference(), PaymentReference)).be.true();
      should(first.getPaymentReference().getBookingText()).be.equal('SONSTIGER EINZUG');

      should(ring.instance(last, Transaction)).be.true();
      should(last.getAmount()).be.equal('50,00');
      should(last.getBookingKey()).be.equal('N004');
      should(ring.instance(last.getPaymentReference(), PaymentReference)).be.true();
      should(last.getPaymentReference().getBookingText()).be.equal('GELDAUTOMAT');

      done();
    });
  });

  it('Test a payment reference (:86:) wrapped over several lines is joined.', function(done) {
    parse(mt940(singleExtract), function(error, revenue) {
      should(error).be.null();
      var reference = revenue.getExtracts().first().getTransactions().first().getPaymentReference();

      // The wrapped part '?311107713?32SATURN SAGT DANKE 65421206?34011' is on the second line.
      should(reference.getPurchaserAccountNumber()).be.equal('1107713');
      should(reference.getAccountOwnerName()).be.equal('SATURN SAGT DANKE 65421206');
      should(reference.getTextKeyAddition()).be.equal('011');

      done();
    });
  });

  it('Test several extracts separated by "-" are parsed in their order.', function(done) {
    var secondExtract = [
      ':20:STARTUMSE',
      ':25:10050000/6013216264',
      ':28C:00000/001',
      ':60F:C150116EUR211,03',
      ':61:1501190119DR2,00N024NONREF',
      ':86:809?00ENTGELTABSCHLUSS?106666?20Entgeltabrechnung?21siehe Anlage?3010050000',
      ':62F:C150119EUR209,03',
      '-'
    ];

    parse(mt940(singleExtract.concat(secondExtract)), function(error, revenue) {
      should(error).be.null();
      var extracts = revenue.getExtracts();
      should(extracts.size).be.equal(2);

      var first = extracts.first()
        , last = extracts.last();
      should(first.getStartSaldo().getAmount()).be.equal('276,02');
      should(first.getTransactions().size).be.equal(2);
      should(last.getStartSaldo().getAmount()).be.equal('211,03');
      should(last.getEndSaldo().getAmount()).be.equal('209,03');
      should(last.getTransactions().size).be.equal(1);
      should(last.getTransactions().first().getPaymentReference().getBookingText()).be.equal('ENTGELTABSCHLUSS');

      done();
    });
  });

  it('Test the content is read from the configured file.', function(done) {
    SparkasseParser.instance().setFilePath(fixturePath).execute(null, function(error, revenue) {
      should(error).be.null();
      should(ring.instance(revenue, Revenue)).be.true();
      should(revenue.getReferenceNumber()).be.equal('STARTUMSE');
      should(revenue.getExtracts().size).be.equal(2);

      done();
    });
  });

  it('Test a not existing file ends in an error.', function(done) {
    var missing = path.join(__dirname, 'fixtures', 'does-not-exist.txt');

    SparkasseParser.instance().setFilePath(missing).execute(null, function(error, revenue) {
      should(error).be.not.null();
      should(error.code).be.equal('ENOENT');
      should(revenue).be.null();

      done();
    });
  });
});
