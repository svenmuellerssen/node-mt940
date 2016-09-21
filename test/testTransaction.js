var should = require('should')
  , Transaction = require('../src/object/Transaction')
  , transactionData = {
    _id: 2398,
    _valuta: 1474312158000,
    _bookingDate: 1474312158000,
    _type: Transaction.TYPE_CREDIT_STORNO,
    _lastCharIsoCode: 'R',
    _amount: '342384393758477.34',
    _bookingKey: 'N023',
    _reference: 'NONREF',
    revenueLine: '1104220428DE32,67N033NONREF',
    verwendungszweck: "106?00KARTENZAHLUNG?109248?20SVWZ+2016-06-02T17.52.42 Ka?21rt\n" +
    "e5 2018-12?22ABWA+BIRKEN-APOTHEKE//Berli?23n/DE?30BEVODEBBXXX?31D\n" +
    "E78100900007109860012?32BIRKEN-APOTHEKE?34011"
  };

describe('Test transaction object', function() {
  it('Test add data to a transaction object.', function(done) {
    var transaction = Transaction.instance();

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
    should(transaction.getValuta()).be.not.null().and.be.a.Number().and.be.equal(1474312158000);
    should(transaction.getBookingDate()).be.not.null().and.be.a.Number().and.be.equal(1474312158000);
    should(transaction.getType()).be.not.null().and.be.a.String().and.be.equal(Transaction.TYPE_CREDIT_STORNO);
    should(transaction.getLastCharIsoCode()).be.not.null().and.be.a.String().and.be.equal("R");
    should(transaction.getAmount()).be.not.null().and.be.a.Number().and.be.equal(342384393758477.34);
    should(transaction.getBookingKey()).be.not.null().and.be.a.String().and.be.equal("N023");
    should(transaction.getReference()).be.not.null().and.be.a.String().and.be.equal("NONREF");

    // Set revenue information via the single set method.
    transaction.setRevenueInformation(transactionData.revenueLine);

    should(transaction.getId()).be.not.null().and.be.a.Number().and.be.equal(2398);
    should(transaction.getValuta()).be.not.null().and.be.a.Number().and.be.equal(1303423200001);
    should(transaction.getBookingDate()).be.not.null().and.be.a.Number().and.be.equal(1303941600001);
    should(transaction.getType()).be.not.null().and.be.a.String().and.be.equal(Transaction.TYPE_DEBIT);
    should(transaction.getLastCharIsoCode()).be.not.null().and.be.a.String().and.be.equal("E");
    should(transaction.getAmount()).be.not.null().and.be.a.Number().and.be.equal(32.67);
    should(transaction.getBookingKey()).be.not.null().and.be.a.String().and.be.equal("N033");
    should(transaction.getReference()).be.not.null().and.be.a.String().and.be.equal("NONREF");

    done();
  });
});