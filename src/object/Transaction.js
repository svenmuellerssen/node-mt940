var ring = require('ring')
  , linkedList = require('node-linkedlist').Create();

var TransactionFunction = function() {
  this._id = 0;
  this._valuta = '';
  this._bookingDate = '';
  this._creditDebit = 0;
  this._lastCharISOCode = '';
  this._amount = 0;
  this._bookingKey = '';
  this._reference = '';
};

TransactionFunction.TYPE_CREDIT = 1;
TransactionFunction.TYPE_DEBIT = 2;
TransactionFunction.TYPE_CREDIT_STORNO = 3;
TransactionFunction.TYPE_DEBIT_STORNO = 4;


TransactionFunction.prototype.setId = function(id) {
  id = (typeof parseInt(id) === 'number') ? id : null;

  if (id !== null)
    this._id = id;

  return this;
};

TransactionFunction.prototype.setValuta = function(date) {
  date = new Date(date);
  console.log(date.getMilliseconds());
  date = (typeof parseInt(date) === 'number') ? date : null;

  if (date !== null)
    this._valuta = date;

  return this;
};

TransactionFunction.prototype.setBookingDate = function(date) {
  date = new Date(date).getUTCMilliseconds();
  date = (typeof parseInt(date) === 'number') ? date : null;

  if (date !== null)
    this._valuta = date;

  return this;
};

TransactionFunction.prototype.setType = function(type) {
  type = (typeof parseInt(type) === 'number') ? type : null;
  switch(type) {
    case TransactionFunction.TYPE_CREDIT:
    case TransactionFunction.TYPE_DEBIT:
    case TransactionFunction.TYPE_CREDIT_STORNO:
    case TransactionFunction.TYPE_DEBIT_STORNO:
      this.type = type;
      break;
  }

  return this;
};

TransactionFunction.prototype.setLastCharIsoCode = function(char) {
  char = (typeof char === 'string' && char !== '') ? char : null;

  if (char !== null) {
    this._lastCharISOCode = char;
  }

  return this;
};

TransactionFunction.prototype.setAmount = function(amount) {
  amount = (typeof parseInt(amount) === 'number' && amount !== '') ? amount : null;

  if (amount !== null) {
    this._bookingKey = amount;
  }

  return this;
};

TransactionFunction.prototype.setBookingKey = function(key) {
  key = (typeof key === 'string' && key !== '') ? key : null;

  if (key !== null) {
    this._bookingKey = key;
  }

  return this;
};

TransactionFunction.prototype.setReference = function(reference) {
  reference = (typeof reference === 'string' && reference !== '') ? reference : null;

  if (reference !== null) {
    this._bookingKey = reference;
  }

  return this;
};

TransactionFunction.prototype.getId = function() {
  return this._id;
};

TransactionFunction.prototype.getValuta = function() {
  return this._valuta;
};

TransactionFunction.prototype.getBookingDate = function() {
  return this._bookingDate;
};

TransactionFunction.prototype.getType = function() {
  return this.type;
};

TransactionFunction.prototype.getLastCharIsoCode = function() {
  return this._lastCharISOCode;
};

TransactionFunction.prototype.getAmount = function() {
  return this._amount;
};

TransactionFunction.prototype.getBookingKey = function() {
  return this._bookingKey;
};

TransactionFunction.prototype.getReference = function() {
  return this._reference;
};

TransactionFunction.prototype.setRevenueInformation = function(line) {
  line = (typeof line === 'string') ? line : null;

  if (line !== null) {

  }
};

TransactionFunction.prototype.setMultiPurposeInformation = function(line) {
  line = (typeof line === 'string') ? line : null;

  if (line !== null) {

  }
};

var Transaction = ring.create([TransactionFunction, linkedList.node], {});

Transaction.instance = function() {
  return new TransactionFunction();
};



module.exports = Transaction;