var ring = require('ring')
  , linkedList = require('node-linkedlist').Create();

/**
 *
 * @constructor
 */
var TransactionFunction = function() {
  this._id = 0;
  this._valuta = 0;
  this._bookingDate = 0;
  this._type = 0;
  this._lastCharISOCode = '';
  this._amount = 0;
  this._bookingKey = '';
  this._reference = '';
};

/**
 *
 * @param id {number} Id
 * @returns {Transaction}
 */
TransactionFunction.prototype.setId = function(id) {
  id = (typeof parseInt(id) === 'number') ? id : null;

  if (id !== null)
    this._id = id;

  return this;
};

/**
 *
 * @param date {number} Timestamp
 * @returns {Transaction}
 */
TransactionFunction.prototype.setValuta = function(date) {
  date = new Date(date).getTime();
  date = (typeof parseInt(date) === 'number') ? date : null;
  if (date !== null)
    this._valuta = date;

  return this;
};

/**
 *
 * @param date {number} Timestamp
 * @returns {Transaction}
 */
TransactionFunction.prototype.setBookingDate = function(date) {
  date = new Date(date).getTime();
  date = (typeof parseInt(date) === 'number') ? date : null;

  if (date !== null)
    this._bookingDate = date;

  return this;
};

/**
 *
 * @param type {number} Transaction type.
 * @returns {Transaction}
 */
TransactionFunction.prototype.setType = function(type) {
  type = (typeof type === 'string') ? type : null;
  switch(type) {
    case Transaction.TYPE_CREDIT:
    case Transaction.TYPE_DEBIT:
    case Transaction.TYPE_CREDIT_STORNO:
    case Transaction.TYPE_DEBIT_STORNO:
      this.type = type;
      break;
  }
  return this;
};

/**
 *
 * @param char {string} Last character of currency.
 * @returns {Transaction}
 */
TransactionFunction.prototype.setLastCharIsoCode = function(char) {
  char = (typeof char === 'string' && char !== '') ? char : null;

  if (char !== null) {
    this._lastCharISOCode = char;
  }

  return this;
};

/**
 *
 * @param amount {number} Transaction amount.
 * @returns {Transaction}
 */
TransactionFunction.prototype.setAmount = function(amount) {
  amount = (typeof parseFloat(amount) === 'number' && amount !== '') ? parseFloat(amount).toFixed(6) : null;

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
TransactionFunction.prototype.setBookingKey = function(key) {
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
TransactionFunction.prototype.setReference = function(reference) {
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
TransactionFunction.prototype.getId = function() {
  return this._id;
};

/**
 * Get the transaction valuta.
 *
 * @returns {number|*}
 */
TransactionFunction.prototype.getValuta = function() {
  return this._valuta;
};

/**
 * Get the booking date of the transaction.
 *
 * @returns {number|*}
 */
TransactionFunction.prototype.getBookingDate = function() {
  return this._bookingDate;
};

/**
 * Get the transaction type.
 *
 * @returns {*}
 */
TransactionFunction.prototype.getType = function() {
  return this.type;
};

/**
 * Get the last character of the transaction iso _code.
 *
 * @returns {string|*}
 */
TransactionFunction.prototype.getLastCharIsoCode = function() {
  return this._lastCharISOCode;
};

/**
 * Get the amount of the transaction.
 *
 * @returns {Number}
 */
TransactionFunction.prototype.getAmount = function() {
  return parseFloat(this._amount);
};

/**
 * Get the booking key of the transaction.
 *
 * @returns {string|*}
 */
TransactionFunction.prototype.getBookingKey = function() {
  return this._bookingKey;
};

/**
 * Get the transaction reference.
 *
 * @returns {string|*}
 */
TransactionFunction.prototype.getReference = function() {
  return this._reference;
};

/**
 *
 * @param line
 */
TransactionFunction.prototype.setRevenueInformation = function(line) {
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
    if (amount.length > 0) this.setAmount(amount[0].replace(',', '.'));

    // Set the last character of the current iso _code.
    this.setLastCharIsoCode(line.substring(1, amount['index']));

    // Set the official booking key.
    var bookingKey = line.match(/N[0-9]{1,3}/);
    if (bookingKey.length > 0) this.setBookingKey(bookingKey[0]);

    var reference = line.substring(bookingKey['index'] + bookingKey[0].length);
    this.setReference(reference);
  }
  return this;
};

/**
 *
 * @param line
 */
TransactionFunction.prototype.setMultiPurposeInformation = function(line) {
  line = (typeof line === 'string') ? line : null;

  if (line !== null) {
    var type = line.match(/C|D|RD|RC/ig);
    console.log(type);
  }

  return this;
};

var Transaction = ring.create([TransactionFunction, linkedList.node], {});

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