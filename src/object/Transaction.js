var ring = require('ring')
  , PaymentReference = require('./PaymentReference');

/**
 *
 * @constructor
 */
var Transaction = function() {
  this.name = "Transaction";
  this._previous = {data: null};
  this._next = {data: null};
  this._id = 0;

  this._valuta = null;
  this._bookingDate = 0;
  this._type = '';
  this._lastCharISOCode = '';
  this._amount = '';
  this._bookingKey = '';
  this._reference = '';
  this._paymentReference = null;
};

Transaction.TYPE_CREDIT = 'C';
Transaction.TYPE_DEBIT = 'D';
Transaction.TYPE_CREDIT_STORNO = 'RC';
Transaction.TYPE_DEBIT_STORNO = 'RD';

/**
 *
 * @param id {number}
 * @returns Transaction
 */
Transaction.prototype.setId = function(id) {
  id = (typeof parseInt(id) === 'number') ? id : null;

  if (id !== null)
    this._id = id;

  return this;
};

/**
 * Get the id of the single transaction.
 * @returns {number}
 */
Transaction.prototype.getId = function() {
  return this._id;
};

/**
 * Set the transaction valuta.
 * @param dateTime {number}
 * @returns Transaction
 */
Transaction.prototype.setValuta = function(dateTime) {
    var date = new Date(dateTime);
    date = (typeof date.getTime() === 'number') ? date : null;
    if (date !== null)
        this._valuta = date;

    return this;
};

/**
 * Get the transaction valuta.
 * @returns {Date|0}
 */
Transaction.prototype.getValuta = function() {
  return this._valuta;
};

/**
 * Get the transaction valuta. The valuta is converted into a timestamp.
 * @returns {number}
 */
Transaction.prototype.getValutaAsTimestamp = function() {
  return this._valuta.getTime();
};

/**
 * Get the transaction valuta as formatted date. The format is "mmdd".
 * @returns {string}
 */
Transaction.prototype.getFormattedValuta = function() {
  var valuta = new Date(this.getValutaAsTimestamp());
  return valuta.getMonth() + valuta.getDay();
};

/**
 * Set the booking date of the transaction.
 * @param dateTime {number}
 * @returns Transaction
 */
Transaction.prototype.setBookingDate = function(dateTime) {
    var date = new Date(dateTime);
    date = (typeof date.getTime() === 'number') ? date : null;
    if (date !== null)
        this._bookingDate = date;

    return this;
};

/**
 * Get the booking date of the transaction.
 * @returns {Date|null}
 */
Transaction.prototype.getBookingDate = function() {
  return this._bookingDate;
};

/**
 * Get transaction booking date. The date is a formatted string with format "YYmmdd".
 * @returns {string}
 */
Transaction.prototype.getFormattedBookingDate = function() {
  var bookingDate = new Date(this.getBookingDate());
  return bookingDate.getYear() + bookingDate.getMonth() + bookingDate.getDay();
};

/**
 * Set the transaction type.
 * Available types are "C", "D", "RC" and "RD".
 * @param type {number}
 * @returns Transaction
 */
Transaction.prototype.setType = function(type) {
    type = (typeof type === 'string') ? type : null;
    switch(type) {
        case Transaction.TYPE_CREDIT:
        case Transaction.TYPE_DEBIT:
        case Transaction.TYPE_CREDIT_STORNO:
        case Transaction.TYPE_DEBIT_STORNO:
            this._type = type;
            break;
    }
    return this;
};

/**
 * Get the transaction type.
 * @returns {string}
 */
Transaction.prototype.getType = function() {
  return this._type;
};

/**
 * Get the transaction type.
 * @deprecated
 * @returns {string}
 */
Transaction.prototype.getTypeString = function() {
  switch(this._type) {
    case Transaction.TYPE_CREDIT:
      return 'C';
      break;
    case Transaction.TYPE_DEBIT:
      return 'D';
      break;
    case Transaction.TYPE_CREDIT_STORNO:
      return 'RC';
      break;
    case Transaction.TYPE_DEBIT_STORNO:
      return 'RD';
      break;
  }
};

/**
 * Set the last character of the iso code.
 * @param char {string}
 * @returns Transaction
 */
Transaction.prototype.setLastCharIsoCode = function(char) {
    char = (typeof char === 'string' && char !== '') ? char : null;

    if (char !== null) {
        this._lastCharISOCode = char;
    }

    return this;
};

/**
 * Get the last character of the iso code.
 * @returns {string}
 */
Transaction.prototype.getLastCharIsoCode = function() {
  return this._lastCharISOCode;
};

/**
 * Set the transaction amount.
 * @param amount {string}
 * @returns Transaction
 */
Transaction.prototype.setAmount = function(amount) {
    amount = (typeof parseFloat(amount) === 'number' && amount !== '') ? amount : null;

    if (amount !== null) {
        this._amount = amount;
    }

    return this;
};

/**
 * Get the transaction amount.
 * @returns {number}
 */
Transaction.prototype.getAmount = function() {
  return this._amount;
};

/**
 * Set the transaction booking key.
 * @param key {string}
 * @returns Transaction
 */
Transaction.prototype.setBookingKey = function(key) {
    key = (typeof key === 'string' && key !== '') ? key : null;

    if (key !== null) {
        this._bookingKey = key;
    }

    return this;
};

/**
 * Get the transaction booking key.
 * @returns {string}
 */
Transaction.prototype.getBookingKey = function() {
  return this._bookingKey;
};

/**
 * Set the transaction reference.
 * @param reference {string}
 * @returns Transaction
 */
Transaction.prototype.setReference = function(reference) {
    reference = (typeof reference === 'string' && reference !== '') ? reference : null;

    if (reference !== null) {
        this._reference = reference;
    }

    return this;
};

/**
 * Get the transaction reference.
 * @returns {string}
 */
Transaction.prototype.getReference = function() {
  return this._reference;
};

/**
 * Set the payment reference.
 * @param paymentReference PaymentReference
 * @returns Transaction
 */
Transaction.prototype.setPaymentReference = function(paymentReference) {
  paymentReference = paymentReference || null;

  if (paymentReference !== null && ring.instance(paymentReference, PaymentReference) === true) {
    this._paymentReference = paymentReference;
  }

  return this;
};

/**
 * Get the payment reference object.
 * @returns PaymentReference|null
 */
Transaction.prototype.getPaymentReference = function() {
  return this._paymentReference;
};

/**
 * Parse a line of a MT940 formatted text.
 * @param line {string}
 * @returns Transaction
 */
Transaction.prototype.parseLine = function(line) {
  // todo Implement regex the line and request methods
  // todo Format amount to german!!
  line = (typeof line === 'string') ? line : null;

  if (line !== null) {
    // Prepare date for valuta and booking date.
    var date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(1);

    // Set the valuta date.
    date.setYear(parseInt(line.substring(0, 2)) + 2000);
    date.setMonth(parseInt(line.substring(2, 4) -1));
    date.setDate(parseInt(line.substring(4, 6)));
    this.setValuta(date.getTime());

    // Set the booking date.
    date.setMonth(parseInt(line.substring(6, 8) -1));
    date.setDate(parseInt(line.substring(8, 10)));
    this.setBookingDate(date.getTime());

    // Check transaction type.
    var type = line.match(/C|D|RD|RC/ig);
    if (type.length > 0) this.setType(type[0]);

    line = line.substring(10);

    // Set the transaction amount.
    var amount = line.match(/[0-9,\.]{1,}/);
    if (amount.length > 0) this.setAmount(amount[0]);

    // Set the last character of the current iso code.
    this.setLastCharIsoCode(line.substring(1, amount['index']));

    // Set the official booking key.
    var bookingKey = line.match(/N[a-zA-Z0-9]{1,3}/);
    if (bookingKey.length > 0) this.setBookingKey(bookingKey[0]);

    var reference = line.substring(bookingKey['index'] + bookingKey[0].length);
    this.setReference(reference);
  }
  return this;
};

/**
 * Reset the properties of the transaction object.
 * @returns Transaction
 */
Transaction.prototype.reset = function() {
  this._valuta = 0;
  this._bookingDate = 0;
  this._type = 0;
  this._lastCharISOCode = '';
  this._amount = 0;
  this._bookingKey = '';
  this._reference = '';
  this._paymentReference = null;
  return this;
};

/**
 * Set a transaction to be the previous object in a chain.
 * @param previousNode Transaction
 * @returns Transaction
 */
Transaction.prototype.setPrevious = function(previousNode) {
  this._previous.data = previousNode;
  return this;
};

/**
 * Get the previous transaction..
 *
 * @returns Transaction
 */
Transaction.prototype.previous = function() {
  return this._previous.data;
};

/**
 * Set a transaction to be the next one in the chain.
 *
 * @param nextNode Transaction
 * @returns Transaction
 */
Transaction.prototype.setNext = function(nextNode) {
  this._next.data = nextNode;
  return this;
};

/**
 * Get the next transaction in the chain.
 *
 * @returns Transaction
 */
Transaction.prototype.next = function() {
  return this._next.data;
};

/**
 * Check if there is a previous transaction in the list.
 * @returns {boolean}
 */
Transaction.prototype.hasPrevious = function() {
  return (this._previous.data !== null);
};

/**
 * Check if there is a next transaction object in the list.
 * @returns {boolean}
 */
Transaction.prototype.hasNext = function() {
  return (this._next.data !== null);
};

/**
 * Get a new transaction object.
 * @returns Transaction
 */
Transaction.instance = function() {
  return new Transaction();
};

module.exports = Transaction;