var should = require('should')
  , Transaction = require('../src/object/Transaction')
  , transactionData = {
    _id: 2398,
    _valuta: 1474312158000,
    _bookingDate: 1474312158000,
    _creditDebit: Transaction.TYPE_CREDIT_STORNO,
    _lastCharIsoCode: 'R',
    _amount: '342384393758477,34',
    _bookingKey: 'N023',
    _reference: 'NONREF'
  };

describe('Test transaction object', function() {
  it('Test add data to a transaction object.', function(done) {
    var transaction = Transaction.instance();
    transaction
      .setId(transactionData._id)
      .setValuta(transactionData._valuta)
      .setBookingDate(transactionData._bookingDate)
      .setType(transactionData._creditDebit)
      .setLastCharIsoCode(transactionData._lastCharIsoCode)
      .setAmount(transactionData._amount)
      .setBookingKey(transactionData._bookingKey)
      .setReference(transactionData._reference);

    should(transaction.getId()).be.not.null().and.be.a.Number().and.be.equal(2398);
    should(transaction.getValuta()).be.not.null().and.be.a.Number().and.be.equal(1474312158000);
    should(transaction.getBookingDate()).be.not.null().and.be.a.Number().and.be.equal(1474312158000);
    should(transaction.getType()).be.not.null().and.be.a.Number().and.be.equal(Transaction.TYPE_CREDIT_STORNO);

    should(transaction.getLastCharIsoCode()).be.not.null().and.be.a.String().and.be.equal("R");
    should(transaction.getAmount()).be.not.null().and.be.a.Number().and.be.equal(342384393758477.34);
    should(transaction.getBookingKey()).be.not.null().and.be.a.String().and.be.equal("N023");
    should(transaction.getReference()).be.not.null().and.be.a.String().and.be.equal("NONREF");

    done();
  });
});