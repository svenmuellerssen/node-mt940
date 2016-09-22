var GVCList = require('./GVCList').singleton();

var PaymentReference = function() {
  this._gvc = null;
  this._bookingText = '';
  this._primanotaNumber = 0;
  this._text = '';

};

PaymentReference.prototype.setGVC = function(gvc, text, check) {
  gvc = (typeof parseInt(gvc) === 'number') ? parseInt(gvc) : null;
  text = (typeof text === 'string') ? text : '';
  check = (check === true);

  if (gvc !== null) {
    if (check) {
      var code = GVCList.getByCodeNumber(gvc);
      if (code !== null)
        this._gvc = code.toValues();
    } else {
      this._gvc = {
        code: gvc,
        text: text
      };
    }
  }

  return this;
};

PaymentReference.prototype.getGVC = function() {
  return this._gvc;
};

PaymentReference.prototype.setBookingText = function(text) {
  text = (typeof text === 'string') ? text : null;
  if (text !== null) this._bookingText = text;
  return this;
};

PaymentReference.prototype.getBookingText = function() {
  return this._bookingText;
};

PaymentReference.prototype.setPrimanotaNumber = function(number) {
  number = (typeof parseInt(number) === 'number') ? parseInt(number) : null;
  if (number !== null) this._primanotaNumber = number;
  return this;
};

PaymentReference.prototype.getPrimanotaNumber = function() {
  return this._primanotaNumber;
};

PaymentReference.prototype.setText = function(text) {
  text = (typeof text === 'string') ? text : null;
  if (text !== null) this._text = text;
  return this;
};

PaymentReference.prototype.getText = function() {
  return this._text;
};

PaymentReference.instance = function() {
  return new PaymentReference();
};

module.exports = PaymentReference;