var should = require('should')
  , PaymentReference = require('../src/object/PaymentReference')
  , paymentReferenceData = {
    gvCode: '105',
    primanota: 9248,
    bookingText: 'FOLGELASTSCHRIFT',
    text: 'EREF+S/836548649387/604502625856 MREF+M002000001067932 CRED+DE70ZZZ00000119765 SVWZ+S/836548649387/604502625856 Alt-Wittenau 22 Strom Abschlag',
    bic: 'WELADEDDXXX',
    accountNumber: 'DE85300500000071016513',
    accountOwnerName: 'ERGO LEBENSVERSICHERUNG AG 40198 DUESSELDORF',
    textKeyAddition: '992',
    completeReferenceLine: '005?00LASTSCHRIFT?109244?20030218495257280181210005800?21ELV65338650 03.02 18.49 ME5?3030050000?3171000517?32ROSSMANN VIELEN DANK?34019'
  };

describe('Test payment reference', function() {
  it('Test the payment reference object', function(done) {
    var paymentReference = PaymentReference.instance();
    // Test single methods to set payment reference data.
    paymentReference
      .setGVC(paymentReferenceData.gvCode)
      .setBookingText(paymentReferenceData.bookingText)
      .setText(paymentReferenceData.text)
      .setPrimanotaNumber(paymentReferenceData.primanota)
      .setPurchaserBIC(paymentReferenceData.bic)
      .setPurchaserAccountNumber(paymentReferenceData.accountNumber)
      .setAccountOwnerName(paymentReferenceData.accountOwnerName)
      .setTextKeyAddition(paymentReferenceData.textKeyAddition);

    should(paymentReference.getGVC()).be.not.null().and.be.an.String().and.be.eql(paymentReferenceData.gvCode);
    should(paymentReference.getPrimanotaNumber()).be.not.null().and.be.a.Number().and.be.equal(9248);
    should(paymentReference.getBookingText()).be.not.null().and.be.a.String().and.be.equal(paymentReferenceData.bookingText);
    should(paymentReference.getText()).be.not.null().and.be.a.String().and.be.equal(paymentReferenceData.text);
    should(paymentReference.getPurchaserBIC()).be.not.null().and.be.a.String().and.be.equal(paymentReferenceData.bic);
    should(paymentReference.getPurchaserAccountNumber()).be.not.null().and.be.a.String().and.be.equal(paymentReferenceData.accountNumber);
    should(paymentReference.getAccountOwnerName()).be.not.null().and.be.a.String().and.be.equal(paymentReferenceData.accountOwnerName);
    should(paymentReference.getTextKeyAddition()).be.not.null().and.be.a.String().and.be.equal(paymentReferenceData.textKeyAddition);

    // Set payment reference data via single method.
    paymentReference
      .parseLine(paymentReferenceData.completeReferenceLine);

    should(paymentReference.getGVC()).be.not.null().and.be.an.String().and.be.eql('005');
    should(paymentReference.getPrimanotaNumber()).be.not.null().and.be.a.Number().and.be.equal(9244);
    should(paymentReference.getBookingText()).be.not.null().and.be.a.String().and.be.equal('LASTSCHRIFT');
    should(paymentReference.getText()).be.not.null().and.be.a.String().and.be.equal('030218495257280181210005800ELV65338650 03.02 18.49 ME5');
    should(paymentReference.getPurchaserBIC()).be.not.null().and.be.a.String().and.be.equal('30050000');
    should(paymentReference.getPurchaserAccountNumber()).be.not.null().and.be.a.String().and.be.equal('71000517');
    should(paymentReference.getAccountOwnerName()).be.not.null().and.be.a.String().and.be.equal('ROSSMANN VIELEN DANK');
    should(paymentReference.getTextKeyAddition()).be.not.null().and.be.a.String().and.be.equal('019');
    done();
  });
});