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

  this._valuta = 0;
  this._bookingDate = 0;
  this._type = '';
  this._lastCharISOCode = '';
  this._amount = '';
  this._bookingKey = '';
  this._reference = '';
  this._paymentReference = null;
};

/**
 *
 * @param id {number} Id
 * @returns {Transaction}
 */
Transaction.prototype.setId = function(id) {
  id = (typeof parseInt(id) === 'number') ? id : null;

  if (id !== null)
    this._id = id;

  return this;
};

/**
 *
 * @param dateTime {number} Timestamp
 * @returns {Transaction}
 */
Transaction.prototype.setValuta = function(dateTime) {
  var date = new Date(dateTime);
  date = (typeof date.getTime() === 'number') ? date : null;
  if (date !== null)
    this._valuta = date;

  return this;
};

/**
 *
 * @param dateTime {number} Timestamp
 * @returns {Transaction}
 */
Transaction.prototype.setBookingDate = function(dateTime) {
  var date = new Date(dateTime);
  date = (typeof date.getTime() === 'number') ? date : null;
  if (date !== null)
    this._bookingDate = date;

  return this;
};

/**
 *
 * @param type {number} Transaction type.
 * @returns {Transaction}
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
 *
 * @param char {string} Last character of currency.
 * @returns {Transaction}
 */
Transaction.prototype.setLastCharIsoCode = function(char) {
  char = (typeof char === 'string' && char !== '') ? char : null;

  if (char !== null) {
    this._lastCharISOCode = char;
  }

  return this;
};

/**
 *
 * @param amount {string} Transaction amount.
 * @returns {Transaction}
 */
Transaction.prototype.setAmount = function(amount) {
  amount = (typeof parseFloat(amount) === 'number' && amount !== '') ? amount : null;

  if (amount !== null) {
    this._amount = amount;
  }

  return this;
};

/**
 *
 * @param key {string} Official booking key.
 * @returns {Transaction}
 */
Transaction.prototype.setBookingKey = function(key) {
  key = (typeof key === 'string' && key !== '') ? key : null;

  if (key !== null) {
    this._bookingKey = key;
  }

  return this;
};

/**
 *
 * @param reference {string} Transaction reference.
 * @returns {Transaction}
 */
Transaction.prototype.setReference = function(reference) {
  reference = (typeof reference === 'string' && reference !== '') ? reference : null;

  if (reference !== null) {
    this._reference = reference;
  }

  return this;
};

/**
 * Get the id of the single transaction.
 *
 * @returns {number|*}
 */
Transaction.prototype.getId = function() {
  return this._id;
};

/**
 * Get the transaction valuta.
 *
 * @returns {number|*}
 */
Transaction.prototype.getValuta = function() {
  return this._valuta;
};

/**
 * Get the transaction valuta.
 *
 * @returns {number|*}
 */
Transaction.prototype.getValutaAsTimestamp = function() {
  return this._valuta.getTime();
};

/**
 *
 * @returns {number}
 */
Transaction.prototype.getFormattedValuta = function() {
  var valuta = new Date(this.getValutaAsTimestamp());
  return valuta.getMonth() + valuta.getDay();
};

/**
 * Get the booking date of the transaction.
 *
 * @returns {number|*}
 */
Transaction.prototype.getBookingDate = function() {
  return this._bookingDate;
};

Transaction.prototype.getFormattedBookingDate = function() {
  var bookingDate = new Date(this.getBookingDate());
  return bookingDate.getYear() + bookingDate.getMonth() + bookingDate.getDay();
};
/**
 * Get the transaction type.
 *
 * @returns {*}
 */
Transaction.prototype.getType = function() {
  return this._type;
};

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
 * Get the last character of the transaction iso _code.
 *
 * @returns {string|*}
 */
Transaction.prototype.getLastCharIsoCode = function() {
  return this._lastCharISOCode;
};

/**
 * Get the amount of the transaction.
 *
 * @returns {Number}
 */
Transaction.prototype.getAmount = function() {
  return this._amount;
};

/**
 * Get the booking key of the transaction.
 *
 * @returns {string|*}
 */
Transaction.prototype.getBookingKey = function() {
  return this._bookingKey;
};

/**
 * Get the transaction reference.
 *
 * @returns {string|*}
 */
Transaction.prototype.getReference = function() {
  return this._reference;
};

/**
 *
 * @param paymentReference {PaymentReference}
 * @returns {Transaction}
 */
Transaction.prototype.setPaymentReference = function(paymentReference) {
  paymentReference = paymentReference || null;

  if (paymentReference !== null && ring.instance(paymentReference, PaymentReference) === true) {
    this._paymentReference = paymentReference;
  }

  return this;
};

/**
 *
 * @returns {null|PaymentReference}
 */
Transaction.prototype.getPaymentReference = function() {
  return this._paymentReference;
};
/**
 *
 * @param line
 * @returns {Transaction}
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

Transaction.prototype.reset = function() {
  this._valuta = 0;
  this._bookingDate = 0;
  this._type = 0;
  this._lastCharISOCode = '';
  this._amount = 0;
  this._bookingKey = '';
  this._reference = '';
  this._paymentReference = null;
};
/**
 * Set a specific object to be the previous object in a chain.
 *
 * @param previousNode {ListNode}
 * @returns {ListNode}
 */
Transaction.prototype.setPrevious = function(previousNode) {
  this._previous.data = previousNode;
  return this;
};

/**
 * Get the previous object.
 *
 * @returns {ListNode}
 */
Transaction.prototype.previous = function() {
  return this._previous.data;
};

/**
 * Set a specific object to be the next in the chain.
 *
 * @param nextNode {ListNode}
 * @returns {ListNode}
 */
Transaction.prototype.setNext = function(nextNode) {
  this._next.data = nextNode;
  return this;
};

/**
 * Get the next object in the chain.
 *
 * @returns {ListNode}
 */
Transaction.prototype.next = function() {
  return this._next.data;
};


/**
 *
 * @returns {boolean}
 */
Transaction.prototype.hasPrevious = function() {
  return (this._previous.data !== null);
};


/**
 *
 * @returns {boolean}
 */
Transaction.prototype.hasNext = function() {
  return (this._next.data !== null);
};

Transaction.TYPE_CREDIT = 'C';
Transaction.TYPE_DEBIT = 'D';
Transaction.TYPE_CREDIT_STORNO = 'RC';
Transaction.TYPE_DEBIT_STORNO = 'RD';


/**
 *
 */
Transaction.instance = function() {
  return new Transaction();
};


module.exports = Transaction;