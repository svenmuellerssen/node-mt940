var should = require('should')
  , ring = require('ring')
  , Transaction = require('../src/object/Transaction')
  , PaymentReference = require('../src/object/PaymentReference')
  , transactionData = {
    _id: 2398,
    _valuta: 1474312158000,
    _bookingDate: 1474312158000,
    _type: Transaction.TYPE_CREDIT_STORNO,
    _lastCharIsoCode: 'R',
    _amount: '342384393758477,34',
    _bookingKey: 'N023',
    _reference: 'NONREF',
    revenueLine: '1104220428DE32,67N033NONREF',
    paymentReferenceLine: '005?00LASTSCHRIFT?109244?20030218495257280181210005800?21ELV65338650 03.02 18.49 ME5?3030050000?3171000517?32ROSSMANN VIELEN DANK?34019'
  };

describe('Test transaction object', function() {
  it('Test add data to a transaction object.', function(done) {
    var transaction = Transaction.instance()
      , paymentReference = PaymentReference.instance();

    // Set single revenue information via set methods.
    transaction
      .setId(transactionData._id)
      .setValuta(transactionData._valuta)
      .setBookingDate(transactionData._bookingDate)
      .setType(transactionData._type)
      .setLastCharIsoCode(transactionData._lastCharIsoCode)
      .setAmount(transactionData._amount)
      .setBookingKey(transactionData._bookingKey)
      .setReference(transactionData._reference);

    should(transaction.getId()).be.not.null().and.be.a.Number().and.be.equal(2398);
    should(ring.instance(transaction.getValuta(), Date)).be.not.null().and.be.a.Boolean().and.be.true();
    should(transaction.getValuta().getTime()).be.not.null().and.be.a.Number().and.be.equal(1474312158000);
    should(ring.instance(transaction.getBookingDate(), Date)).be.not.null().and.be.a.Boolean().and.be.true();
    should(transaction.getBookingDate().getTime()).be.not.null().and.be.a.Number().and.be.equal(1474312158000);
    should(transaction.getType()).be.not.null().and.be.a.String().and.be.equal(Transaction.TYPE_CREDIT_STORNO);
    should(transaction.getLastCharIsoCode()).be.not.null().and.be.a.String().and.be.equal("R");
    should(transaction.getAmount()).be.not.null().and.be.a.String().and.be.equal('342384393758477,34');
    should(transaction.getBookingKey()).be.not.null().and.be.a.String().and.be.equal("N023");
    should(transaction.getReference()).be.not.null().and.be.a.String().and.be.equal("NONREF");

    // Set revenue information via the single set method.
    transaction.parseLine(transactionData.revenueLine);

    should(transaction.getId()).be.not.null().and.be.a.Number().and.be.equal(2398);
    should(ring.instance(transaction.getValuta(), Date)).be.not.null().and.be.a.Boolean().and.be.true();
    should(transaction.getValuta().getTime()).be.not.null().and.be.a.Number().and.be.equal(1303423200001);
    should(ring.instance(transaction.getBookingDate(), Date)).be.not.null().and.be.a.Boolean().and.be.true();
    should(transaction.getBookingDate().getTime()).be.not.null().and.be.a.Number().and.be.equal(1303941600001);
    should(transaction.getType()).be.not.null().and.be.a.String().and.be.equal(Transaction.TYPE_DEBIT);
    should(transaction.getLastCharIsoCode()).be.not.null().and.be.a.String().and.be.equal("E");
    should(transaction.getAmount()).be.not.null().and.be.a.String().and.be.equal('32,67');
    should(transaction.getBookingKey()).be.not.null().and.be.a.String().and.be.equal("N033");
    should(transaction.getReference()).be.not.null().and.be.a.String().and.be.equal("NONREF");


    paymentReference.parseLine(transactionData.paymentReferenceLine);
    transaction.setPaymentReference(paymentReference);
    should(ring.instance(transaction.getPaymentReference(), PaymentReference)).be.not.null().and.be.a.Boolean().and.be.true();
    done();
  });
});