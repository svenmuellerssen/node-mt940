var should = require('should')
  , LinkedList = require('node-linkedlist')
  , async = require('async')
  , ring = require('ring')
  , Extract = require('../src/object/Extract')
  , Transaction = require('../src/object/Transaction')
  , PaymentReference = require('../src/object/PaymentReference')
  , Saldo = require('../src/object/Saldo')
  , extractData = {
      number: '00000',
      sheetNumber: '001',
      transactions: [
        {transaction: '1503160316DR495,00N033NONREF', paymentReference: '177?00ONLINE-UEBERWEISUNG?109310?20SVWZ+Flug nach Oxford?21DATUM 13.03.2015, 22.19 UHR?221.TAN 134290?30BELADEBEXXX?31DE83100500006603197900?32Sparkasse Berlin?34997'},
        {transaction: '1503140316DR30,00N004NONREF//100000131632', paymentReference: '006?00GELDAUTOMAT?102393?2014.03/13.16UHR 209 896543?3010050000?32GA NR00002393 BLZ10050000 5?34003'},
        {transaction: '1503160316DR35,53N037NONREF', paymentReference: '006?00SONSTIGER EINZUG?109208?20EC 58069381 140315144115IC5?3020090700?314285905071?32EDEKA ARAS?34011'},
        {transaction: '1503160316DR17,95N037NONREF', paymentReference: '006?00SONSTIGER EINZUG?109252?20EC 55501776 130315153026IC5?3010090000?317109860012?32BIRKEN-APOTHEKE?34011'},
        {transaction: '1503160316DR18,96N037NONREF', paymentReference: '006?00SONSTIGER EINZUG?109266?20EC 65099912 140315150221IC5?3030050000?311699214?32OBI SAGT DANKE?34011'},
        {transaction: '1503160316DR20,00N004NONREF//100000143337', paymentReference: '006?00GELDAUTOMAT?103006?2016.03/14.33UHR 001 897006?3010050000?32GA NR00003006 BLZ10050000 5?34003'},
      ],
      startSaldo: 'C150313EUR1489,44',
      endSaldo: 'C150316EUR872,00'
  };

describe('Test extract object', function() {
  it('Test methods of the extract object', function(done) {
    var extract = Extract.instance();


    extract
      .setNumber(extractData.number)
      .setSheetNumber(extractData.sheetNumber);

    async.auto({
      addTransactions: function(immediateCallback) {
        var transaction = null
          , paymentReference = null;

        async.eachSeries(
          extractData.transactions,
          function(transactionLine, innerEachCallback) {

            transaction = Transaction.instance();
            transaction.parseLine(transactionLine.transaction);

            paymentReference = PaymentReference.instance();
            paymentReference.parseLine(transactionLine.paymentReference);

            transaction.setPaymentReference(paymentReference);

            extract.addTransaction(transaction, innerEachCallback);

          }, function eachSeriesCallback(err) {
          immediateCallback(err, null);
        });
      },
      addStartSaldo: function(immediateCallback) {
        var saldo = Saldo.instance();
        saldo.parseLine(extractData.startSaldo);
        extract.setStartSaldo(saldo);
        immediateCallback(null, null);
      },
      addEndSaldo: function(immediateCallback) {
        var saldo = Saldo.instance();

        saldo.parseLine(extractData.endSaldo);
        extract.setEndSaldo(saldo);

        immediateCallback(null, null);
      }
    }, function(err, result) {
      should(err).be.null();

      should(extract.getNumber()).be.not.null().and.be.a.String().and.be.equal('00000');
      should(extract.getSheetNumber()).be.not.null().and.be.a.String().and.be.equal('001');

      var transactions = extract.getTransactions();
      should(ring.instance(transactions, LinkedList)).be.not.null().and.be.a.Boolean().and.be.equal(true);
      should(transactions.size).be.not.null().and.be.a.Number().and.be.equal(extractData.transactions.length);
      should(ring.instance(transactions.first(), Transaction)).be.not.null().and.be.a.Boolean().and.be.equal(true);

      var startSaldo = extract.getStartSaldo();
      should(ring.instance(startSaldo, Saldo)).be.not.null().and.be.a.Boolean().and.be.equal(true);

      var endSaldo = extract.getEndSaldo();
      should(ring.instance(endSaldo, Saldo)).be.not.null().and.be.a.Boolean().and.be.equal(true);

      done();
    });
  });
});