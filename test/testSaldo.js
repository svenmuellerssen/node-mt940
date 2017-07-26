var should = require('should')
  , Saldo = require('../src/object/Saldo')
  , saldoData = {
      creditDebit: Saldo.TYPE_CREDIT,
      bookingDate: '130122',
      currency: 'EUR',
      amount: '70,17',
      line: 'C130406EUR56,34'
  };

describe('Test saldo object', function() {
  it('Test the saldo methods', function(done) {
    var saldo = Saldo.instance();

    // Test single
    saldo
      .setCreditDebit(saldoData.creditDebit)
      .setBookingDate(saldoData.bookingDate)
      .setCurrency(saldoData.currency)
      .setAmount(saldoData.amount);

    should(saldo.getCreditDebit()).be.not.null().and.be.a.Number().and.be.equal(Saldo.TYPE_CREDIT);
    should(saldo.getBookingDate()).be.not.null().and.be.an.Object();
    should(saldo.getBookingDate().getTime()).be.not.null().and.be.a.Number().and.be.equal(1358809200001);
    should(saldo.getCurrency()).be.not.null().and.be.a.String().and.be.equal('EUR');
    should(saldo.getAmount()).be.not.null().and.be.a.String().and.be.equal('70,17');

    saldo.parseLine(saldoData.line);

    should(saldo.getCreditDebit()).be.not.null().and.be.a.Number().and.be.equal(Saldo.TYPE_CREDIT);
    should(saldo.getBookingDate()).be.not.null().and.be.an.Object();
    should(saldo.getBookingDate().getTime()).be.not.null().and.be.a.Number().and.be.equal(1365199200001);
    should(saldo.getCurrency()).be.not.null().and.be.a.String().and.be.equal('EUR');
    should(saldo.getAmount()).be.not.null().and.be.a.String().and.be.equal('56,34');


    done();
  });
});