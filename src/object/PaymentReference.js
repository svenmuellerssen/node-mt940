var GVCList = require('./GVCList').singleton();

var PaymentReference = function() {
  this._gvc = null;
  this._bookingText = '';
  this._primanotaNumber = 0;
  this._text = '';

};

PaymentReference.prototype.setGVC = function(gvc) {
  var code = GVCList.getByCodeNumber(gvc);
  if (code !== null) this._gvc = code;
  return this;
};

PaymentReference.prototype.getGVC = function() {
  return this._gvc;
};

PaymentReference.prototype.setBookingText = function(text) {
  return this;
};

PaymentReference.prototype.getBookingText = function() {
  return this._bookingText;
};

PaymentReference.prototype.setPrimanotaNumber = function(number) {
  return this;
};

PaymentReference.prototype.getPrimanotaNumber = function() {
  return this._primanotaNumber;
};

PaymentReference.prototype.setText = function(text) {
  return this;
};

PaymentReference.prototype.getText = function() {
  return this._text;
};

PaymentReference.instance = function() {
  return new PaymentReference();
};