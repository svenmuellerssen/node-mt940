var should = require('should')
  , async = require('async')
  , LinkedList = require('node-linkedlist')
  , ring = require('ring')
  , Revenue = require('../src/object/Revenue')
  , Extract = require('../src/object/Extract')
  , Transaction = require('../src/object/Transaction')
  , PaymentReference = require('../src/object/PaymentReference')
  , Saldo = require('../src/object/Saldo')
  , RevenueData = require('./revenuesTestData');

describe('Test revenues', function() {
  it('Test the revenue object methods', function(done) {
    var revenue = Revenue.instance()
      , extract = null
      , transaction = null
      , paymentReference = null
      , saldoStart = null
      , saldoEnd = null;

    revenue.setReferenceNumber(RevenueData.contractReferenceNumber)
      .setBankCode(RevenueData.bankCode)
      .setAccountNumber(RevenueData.accountNumber);

    RevenueData.extracts = RevenueData.extracts.forEach(function(extractData) {
      extract = Extract.instance();
      extract.parseLine(extractData.line);

      // Create saldos.
      saldoStart = Saldo.instance();
      saldoEnd = Saldo.instance();
      saldoStart.parseLine(extractData.saldoStartLine);
      saldoEnd.parseLine(extractData.saldoEndLine);

      extract
        .setStartSaldo(saldoStart)
        .setEndSaldo(saldoEnd);

      // Create transactions with payment references.
      extractData.transactions.forEach(function(transactionData) {
        transaction = Transaction.instance();
        paymentReference = PaymentReference.instance();

        transaction
          .parseLine(transactionData.line)
          .setPaymentReference(paymentReference.parseLine(transactionData.paymentReferenceLine));

        extract.addTransaction(transaction);
      });

      revenue.addExtract(extract);
    });

    should(revenue.getReferenceNumber()).be.not.null().and.be.a.String().and.be.equal('STARTUMSE');
    should(revenue.getBankCode()).be.not.null().and.be.a.String().and.be.equal('10050000');
    should(revenue.getAccountNumber()).be.not.null().and.be.a.String().and.be.equal('6013216264');

    var extracts = revenue.getExtracts();
    should(ring.instance(extracts, LinkedList)).be.not.null().and.be.a.Boolean().and.be.true();

    extract = extracts.first();
    should(ring.instance(extract, Extract)).be.not.null().and.be.a.Boolean().and.be.true();

    should(extract.getNumber()).be.not.null().and.be.a.String().and.be.equal('00000');
    should(extract.getSheetNumber()).be.not.null().and.be.a.String().and.be.equal('001');

    saldoStart = extract.getStartSaldo();
    should(ring.instance(saldoStart, Saldo)).be.not.null().and.be.a.Boolean().and.be.true();
    should(saldoStart.getCreditDebit()).be.not.null().and.be.a.Number().and.be.equal(Saldo.TYPE_CREDIT);
    should(ring.instance(saldoStart.getBookingDate(), Date)).be.not.null().and.be.a.Boolean().and.be.true();
    should(saldoStart.getBookingDateAsTimestamp()).be.not.null().and.be.a.Number().and.be.equal(1421276400001);
    should(saldoStart.getCurrency()).be.not.null().and.be.a.String().and.be.equal('EUR');
    should(saldoStart.getAmount()).be.not.null().and.be.a.String().and.be.equal('276,02');

    saldoEnd = extract.getEndSaldo();
    should(ring.instance(saldoEnd, Saldo)).be.not.null().and.be.a.Boolean().and.be.true();
    should(saldoEnd.getCreditDebit()).be.not.null().and.be.a.Number().and.be.equal(Saldo.TYPE_CREDIT);
    should(ring.instance(saldoEnd.getBookingDate(), Date)).be.not.null().and.be.a.Boolean().and.be.true();
    should(saldoEnd.getBookingDateAsTimestamp()).be.not.null().and.be.a.Number().and.be.equal(1421362800001);
    should(saldoEnd.getCurrency()).be.not.null().and.be.a.String().and.be.equal('EUR');
    should(saldoEnd.getAmount()).be.not.null().and.be.a.String().and.be.equal('211,03');


    var transactions = extract.getTransactions();
    should(ring.instance(transactions, LinkedList)).be.not.null().and.be.a.Boolean().and.be.true();

    transaction = transactions.first();
    should(ring.instance(transaction, Transaction)).be.not.null().and.be.a.Boolean().and.be.true();
    should(ring.instance(transaction.getValuta(), Date)).be.not.null().and.be.a.Boolean().and.be.true();
    should(transaction.getValuta().getTime()).be.not.null().and.be.a.Number().and.be.equal(1421362800001);
    should(ring.instance(transaction.getBookingDate(), Date)).be.not.null().and.be.a.Boolean().and.be.true();
    should(transaction.getBookingDate().getTime()).be.not.null().and.be.a.Number().and.be.equal(1421362800001);
    should(transaction.getType()).be.not.null().and.be.a.String().and.be.equal(Transaction.TYPE_DEBIT);
    should(transaction.getLastCharIsoCode()).be.not.null().and.be.a.String().and.be.equal('R');
    should(transaction.getAmount()).be.not.null().and.be.a.String().and.be.equal('14,99');
    should(transaction.getBookingKey()).be.not.null().and.be.a.String().and.be.equal('N037');
    should(transaction.getReference()).be.not.null().and.be.a.String().and.be.equal('NONREF');

    paymentReference = transaction.getPaymentReference();
    should(ring.instance(paymentReference, PaymentReference)).be.not.null().and.be.a.Boolean().and.be.true();
    /**
     *   this._gvc = null;
     this._bookingText = '';
     this._primanotaNumber = 0;
     this._text = '';
     this._bicPurchaser = '';
     this._accountNumberPurchaser = '';
     this._accountOwnerName = '';
     this._textKeyAddition = '';
     */
    should(paymentReference.getGVC()).be.not.null().and.be.a.String().and.be.equal('006');
    should(paymentReference.getBookingText()).be.not.null().and.be.a.String().and.be.equal('SONSTIGER EINZUG');
    should(paymentReference.getPrimanotaNumber()).be.not.null().and.be.a.Number().and.be.equal(9208);
    should(paymentReference.getText()).be.not.null().and.be.a.String().and.be.equal('EC 65421206 150115184614IC5');
    should(paymentReference.getPurchaserBIC()).be.not.null().and.be.a.String().and.be.equal('30050000');
    should(paymentReference.getPurchaserAccountNumber()).be.not.null().and.be.a.String().and.be.equal('1107713');
    should(paymentReference.getAccountOwnerName()).be.not.null().and.be.a.String().and.be.equal('SATURN SAGT DANKE 65421206');
    should(paymentReference.getTextKeyAddition()).be.not.null().and.be.a.String().and.be.equal('011');
    done();
  });
});