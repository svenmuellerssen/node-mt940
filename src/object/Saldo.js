// Saldo start = 60FM
// Saldo end = 62F
var Saldo = function() {
  this._type = 0; // C or D
  this._bookingDate = null; // Date with format: ddmmYY
  this._currency = '';  // Like 'EUR' with 3 characters
  this._amount = 0; // The amount before / after any transaction
};

Saldo.TYPE_CREDIT = 1;
Saldo.TYPE_DEBIT = 2;

/**
 *
 * @param value
 * @returns {Saldo}
 */
Saldo.prototype.setCreditDebit = function(value) {
  value = (typeof parseInt(value) === 'number') ? value : null;

  if (value !== null && (value === Saldo.TYPE_CREDIT || value === Saldo.TYPE_DEBIT))
    this._type = value;

  return this;
};

/**
 *
 * @returns {number|*}
 */
Saldo.prototype.getCreditDebit = function() {
  return this._type;
};

/**
 *
 * @returns {string}
 */
Saldo.prototype.getCreditDebitString = function() {
  return (this._type === Saldo.TYPE_CREDIT) ? 'C' : 'D';
};

/**
 *
 * @param bookingDate
 * @returns {Saldo}
 */
Saldo.prototype.setBookingDate = function(bookingDate) {

  var date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(1);

  // Set the booking date.
  date.setYear(parseInt(bookingDate.substring(0, 2)) + 2000);
  date.setMonth(parseInt(bookingDate.substring(2, 4) -1));
  date.setDate(parseInt(bookingDate.substring(4, 6)));

  if (typeof date.getTime() === 'number')
    this._bookingDate = date;

  return this;
};

/**
 *
 * @returns {number|*}
 */
Saldo.prototype.getBookingDate = function() {
  return this._bookingDate;
};

/**
 *
 * @returns {*}
 */
Saldo.prototype.getBookingDateAsTimestamp = function() {
  if (this._bookingDate !== null)
    return this._bookingDate.getTime();
  return null;
};

/**
 *
 * @returns {string}
 */
Saldo.prototype.getFormattedBookingDate = function() {
  var bookingDate = new Date(this.getBookingDateAsTimestamp());
  return (bookingDate.getFullYear() + '' + this.pad(bookingDate.getMonth() + 1, 2) + '' + this.pad(bookingDate.getDate(), 2)).substr(2);
};
/**
 *
 * @param currency
 * @returns {Saldo}
 */
Saldo.prototype.setCurrency = function(currency) {
  currency = (typeof currency === 'string') ? currency : null;

  if (currency !== null)
    this._currency = currency;

  return this;
};

/**
 *
 * @returns {string|*}
 */
Saldo.prototype.getCurrency = function() {
  return this._currency;
};

/**
 *
 * @param amount
 * @returns {Saldo}
 */
Saldo.prototype.setAmount = function(amount) {
  amount = (typeof parseFloat(amount) === 'number') ? amount : null;
  if (amount !== null)
    this._amount = amount;

  return this;
};

/**
 *
 * @returns {number|*}
 */
Saldo.prototype.getAmount = function() {
  return this._amount;
};

/**
 *
 * @param line
 * @returns {Saldo}
 */
Saldo.prototype.parseLine = function(line) {
  line = (typeof line === 'string') ? line : null;

  var me = this
    , saldoBuffer = line.match(/([cCdD])([0-9]{1,})([a-zA-Z]{3})([0-9,]{1,})/)
    , creditDebit = (saldoBuffer[1] == 'c' || saldoBuffer[1] == 'C') ? Saldo.TYPE_CREDIT : Saldo.TYPE_DEBIT;

  me.setCreditDebit(creditDebit);
  me.setBookingDate(saldoBuffer[2]);
  me.setCurrency(saldoBuffer[3]);
  me.setAmount(saldoBuffer[4]);

  return this;
};

Saldo.prototype.pad = function(string, size) {
	var s = String(string);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
};
/**
 *
 * @returns {Saldo}
 */
Saldo.instance = function() {
  return new Saldo();
};

module.exports = Saldo;