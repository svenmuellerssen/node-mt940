var GVCList = require('./GVCList').singleton();

var PaymentReference = function() {
  this._gvc = null;
  this._bookingText = '';
  this._primanotaNumber = 0;
  this._text = '';
  this._bicPurchaser = '';
  this._accountNumberPurchaser = '';
  this._accountOwnerName = '';
  this._textKeyAddition = '';
};

/**
 * Set GV code. With parameter "check" set to "true" the code will be checked against a GVC list.
 * @param gvc {string}
 * @param check {boolean}
 * @returns PaymentReference
 */
PaymentReference.prototype.setGVC = function(gvc, check) {
  gvc = (typeof parseInt(gvc) === 'number') ? gvc : null;
  check = (check === true);

  if (gvc !== null) {
    if (check) {
      var code = GVCList.getByCodeNumber(gvc);
      if (code !== null) {
        var codeValue = code.toJSON();
        this._gvc = codeValue.code;
        //this._bookingText = codeValue.text;
      }

    } else {
      this._gvc = gvc;
    }
  }

  return this;
};

/**
 * Get GV code.
 * @returns {string}
 */
PaymentReference.prototype.getGVC = function() {
  return this.pad(this._gvc, 3);
};

/**
 * Set booking text.
 * @param text {string}
 * @returns PaymentReference
 */
PaymentReference.prototype.setBookingText = function(text) {
  text = (typeof text === 'string') ? text : null;
  if (text !== null) this._bookingText = text;
  return this;
};

/**
 * Get booking text.
 * @returns {string}
 */
PaymentReference.prototype.getBookingText = function() {
  return this._bookingText;
};

/**
 * Set primanota number.
 * @param number {number}
 * @returns PaymentReference
 */
PaymentReference.prototype.setPrimanotaNumber = function(number) {
  number = (typeof parseInt(number) === 'number') ? parseInt(number) : null;
  if (number !== null) this._primanotaNumber = number;
  return this;
};

/**
 * Get primanota number.
 * @returns {number}
 */
PaymentReference.prototype.getPrimanotaNumber = function() {
  return this._primanotaNumber;
};

/**
 * Set text.
 * @param text {string}
 * @returns PaymentReference
 */
PaymentReference.prototype.setText = function(text) {
  text = (typeof text === 'string') ? text : null;
  if (text !== null) this._text = text;
  return this;
};

/**
 * Add text part.
 * @param text {string}
 * @returns PaymentReference
 */
PaymentReference.prototype.addText = function(text) {
  text = (typeof text === 'string') ? text : null;
  if (text !== null) this._text += text;
  return this;
};

/**
 * Get text.
 * @returns {string}
 */
PaymentReference.prototype.getText = function() {
  return this._text;
};

/**
 * Set BIC.
 * @param bic {string}
 * @returns PaymentReference
 */
PaymentReference.prototype.setPurchaserBIC = function(bic) {
  bic = (typeof bic === 'string') ? bic : null;
  if (bic !== null) this._bicPurchaser = bic;
  return this;
};

/**
 * Get BIC.
 * @returns {string}
 */
PaymentReference.prototype.getPurchaserBIC = function() {
  return this._bicPurchaser;
};

/**
 * Set number of the bank account.
 * @param accountNumber {string}
 * @returns PaymentReference
 */
PaymentReference.prototype.setPurchaserAccountNumber = function(accountNumber) {
  accountNumber = (typeof accountNumber === 'string') ? accountNumber : null;
  if (accountNumber !== null) this._accountNumberPurchaser = accountNumber;
  return this;
};

/**
 * Get number of the bank account.
 * @returns {string}
 */
PaymentReference.prototype.getPurchaserAccountNumber = function() {
  return this._accountNumberPurchaser;
};

/**
 * Set name of bank account owner.
 * @param name {string}
 * @returns PaymentReference
 */
PaymentReference.prototype.setAccountOwnerName = function(name) {
  name = (typeof name === 'string') ? name : null;
  if (name !== null) this._accountOwnerName = name;
  return this;
};

/**
 * Get name of bank account owner.
 * @returns {string}
 */
PaymentReference.prototype.getAccountOwnerName = function() {
  return this._accountOwnerName;
};

/**
 * Set text key addition.
 * @param keyAddition {string}
 * @returns PaymentReference
 */
PaymentReference.prototype.setTextKeyAddition = function(keyAddition) {
  keyAddition = (typeof keyAddition === 'string') ? keyAddition : null;
  if (keyAddition !== null) this._textKeyAddition = keyAddition;
  return this;
};

/**
 * Get text key addition.
 * @returns {string}
 */
PaymentReference.prototype.getTextKeyAddition = function() {
  return this._textKeyAddition;
};

/**
 * Parse a line of MT940 content.
 * @param line {string}
 * @returns PaymentReference
 */
PaymentReference.prototype.parseLine = function(line) {
  line = (typeof line === 'string') ? line : null;

  if (line !== null) {
    var me = this;
    var gvc = line.substring(0, 3);
    this.setGVC(gvc, true);

    var bookingText = line.match(/\?0[0-9]{1}(.*)\?1[0-9]{1}/);
    if (bookingText[1] !== void 0)
      this.setBookingText(bookingText[1]);
    else
      this.setBookingText(bookingText[0].replace(/[\?0-9]/g, ''));

    var primanotaNumber = line.match(/\?1[0-9]{1}(.*)\?20/);
    if (primanotaNumber[1] !== void 0)
      this.setPrimanotaNumber(primanotaNumber[1]);
    else
      this.setPrimanotaNumber(primanotaNumber[0].replace(/\?1[0-9]{1}|\?20/g, ''));

    var text = line.match(/\?2[0-9]{1}(.*)\?30/g);

    if (text[1] !== void 0)
      this.setText(text[1]);
    else
      this.setText(text[0].replace(/(\?2[0-9]{1})|\?30/g, ''));

    var account = line.match(/\?30(.*)/g);
    var accountParts = account[0].split(/\?/g);
    if (Array.isArray(accountParts) && accountParts.length > 0) {
      var type = ''
        , value = ''
        , name = '';

      accountParts.forEach(function(part) {
        type = part.substring(0, 2);
        value = part.substring(2);
        switch(type) {
          case '30':
            me.setPurchaserBIC(value);
            break;
          case '31':
            me.setPurchaserAccountNumber(value);
            break;
          case '32':
          case '33':
            name = name + value;
            break;
          case '34':
            me.setTextKeyAddition(value);
            break;
        }
      });

      if (name !== '')
        me.setAccountOwnerName(name);
    }
  }

  return this;
};

/**
 * Pad the string to given length.
 * @param string {string}
 * @param size {number}
 * @returns {string}
 */
PaymentReference.prototype.pad = function(string, size) {
	var s = String(string);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
};

/**
 * Get new payment reference object.
 * @returns PaymentReference
 */
PaymentReference.instance = function() {
  return new PaymentReference();
};

module.exports = PaymentReference;