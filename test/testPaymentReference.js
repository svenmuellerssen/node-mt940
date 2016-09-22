var should = require('should')
  , PaymentReference = require('../src/object/PaymentReference');

describe('Test payment reference', function() {
  it('Test the payment reference object', function(done) {
    var paymentReference = PaymentReference.instance();
    done();
  });
});