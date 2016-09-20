var Saldo = function() {
  this._type = 0;
  this._bookingDate = 0;
  this.currency = '';
  this._amount = 0;
};

Saldo.TYPE_SALDO_START = 1;
Saldo.TYPE_SALDO_END = 2;

Saldo.TYPE_CREDIT = 1;
Saldo.TYPE_DEBIT = 2;

/**
 *
 * @param value
 * @returns {Saldo}
 */
Saldo.prototype.setCreditDebit = function(value) {
  value = (typeof parseInt(value) === 'number') ? value : null;

  if (value !== null)
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
 * @param date
 * @returns {Saldo}
 */
Saldo.prototype.setBookingDate = function(date) {
  date = new Date(date).getUTCMilliseconds();

  if (typeof date === 'number')
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
 * @param currency
 * @returns {Saldo}
 */
Saldo.prototype.setCurrency = function(currency) {
  currency = (typeof currency === 'string') ? currency : null;

  if (currency !== null)
    this.currency = currency;

  return this;
};

/**
 *
 * @returns {string|*}
 */
Saldo.prototype.getCurrency = function() {
  return this.currency;
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
Saldo.prototype.setSaldo = function(line) {
  line = (typeof line === 'string') ? line : null;

  var me = this
    , saldoBuffer = line.match(/([cCdD])([0-9]{1,})([a-zA-Z]{3})([0-9,]{1,})/)
    , creditDebit = (saldoBuffer[0] == 'c' || saldoBuffer[0] == 'C') ? Saldo.TYPE_CREDIT : Saldo.TYPE_DEBIT;

    me.setCreditDebit(creditDebit);
    me.setBookingDate(saldoBuffer[1]);
    me.setCurrency(saldoBuffer[2]);
    me.setAmount(saldoBuffer[3]);

  return this;
};

/**
 *
 * @returns {Saldo}
 */
Saldo.instance = function() {
  return new Saldo();
};

module.exports = Saldo;