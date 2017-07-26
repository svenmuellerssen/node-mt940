var LinkedList = require('node-linkedlist')
  , ring = require('ring')
  , Saldo = require('./Saldo')
  , Transaction = require('./Transaction');

var Extract = function() {
  this.name = "Extract";
  this._previous = {data: null};
  this._next = {data: null};

  this.bankCode = ''; // Field :25:1
  this.accountNumber = ''; // Field :25:2
  this.number = ''; // Field :28C:1
  this.sheetNumber = 0;  // Field :28C:2
  this.transactions = LinkedList.Create(Transaction);
  this.saldoStart = null; // Field :60FM
  this.saldoEnd = null;   // Field :62F
};
/**
 *
 * @param bankCode
 * @returns {Revenue}
 */
Extract.prototype.setBankCode = function(bankCode) {
  bankCode = (typeof bankCode === 'string') ? bankCode : null;
  if (bankCode !== null) {
    this.bankCode = bankCode;
  }

  return this;
};

/**
 *
 * @returns {string}
 */
Extract.prototype.getBankCode = function() {
  return this.bankCode;
};

/**
 *
 * @param accountNumber
 * @returns {Revenue}
 */
Extract.prototype.setAccountNumber = function(accountNumber) {
  accountNumber = (typeof accountNumber === 'string') ? accountNumber : null;
  if (accountNumber !== null) {
    this.accountNumber = accountNumber;
  }

  return this;
};

/**
 *
 * @returns {string}
 */
Extract.prototype.getAccountNumber = function() {
  return this.accountNumber;
};
Extract.prototype.setNumber = function(number) {
  number = (typeof number === 'string') ? number : null;
  if (number !== null)
    this.number = number;
  return this;
};

Extract.prototype.getNumber = function() {
  return this.number;
};

Extract.prototype.setSheetNumber = function(number) {
  number = (typeof number === 'string') ? number : null;
  if (number !== null)
    this.sheetNumber = number;
  return this;
};

Extract.prototype.getSheetNumber = function() {
  return this.sheetNumber;
};

Extract.prototype.addTransaction = function(transaction, callback) {

  callback = (callback !== void 0 && callback !== null && typeof callback === 'function') ? callback : function(err, result) {};

  if (ring.instance(transaction, Transaction) === true) {
    this.transactions.add(transaction, callback);
  }

  return this;
};

/**
 *
 * @param id
 * @param callback
 * @returns {*}
 */
Extract.prototype.getTransactionById = function(id, callback) {
  var transaction = this.transactions.searchByProperty('getId', id);
  callback(null, transaction);
  return transaction;
};

Extract.prototype.getTransactions = function() {
  return this.transactions;
};

Extract.prototype.setStartSaldo = function(saldo) {
  if (ring.instance(saldo, Saldo) === true) {
    this.saldoStart = saldo;
  }
  return this;
};

Extract.prototype.getStartSaldo = function() {
  return this.saldoStart;
};

Extract.prototype.setEndSaldo = function(saldo) {
  if (ring.instance(saldo, Saldo) === true) {
    this.saldoEnd = saldo;
  }
  return this;
};

Extract.prototype.getEndSaldo = function() {
  return this.saldoEnd;
};

Extract.prototype.parseLine = function(line) {
  line = (typeof line === 'string' && line !== '') ? line : null;

  if (line === null)
    return this;

  var lines = line.split('\/');
  this.number = lines[0];
  this.sheetNumber = lines[1];

  return this;
};

Extract.prototype.toCSVString = function() {
  var me = this
    , csv = '';
  csv += '"' + me.getAccountNumber() +'"; ';

  var transactions = me.getTransactions()
    , transaction = null
    , paymentReference = null;

  if (transactions.size == 0)
    return '';
  else {
    while(transactions.hasNext()) {
      transaction = transactions.next();
      paymentReference = transaction.getPaymentReference();
      csv += '"' + transaction.getBookingDate().toLocaleDateString() + '";"' + transaction.getValuta().toLocaleDateString() + '";';
      csv += '"' + paymentReference.getBookingText() + '";"' + paymentReference.getText() + '";"' + paymentReference.getAccountOwnerName() + '";';
      csv += '"' + paymentReference.getPurchaserAccountNumber() + '";"' + paymentReference.getPurchaserBIC() + '";';
      csv += '"' + transaction.getAmount() + '";"' + me.getStartSaldo().getCurrency() + '";\n';

    }

    return csv;
  }
};
/**
 * Set a specific object to be the previous object in a chain.
 *
 * @param previousNode {ListNode}
 * @returns {ListNode}
 */
Extract.prototype.setPrevious = function(previousNode) {
  this._previous.data = previousNode;
  return this;
};

/**
 * Get the previous object.
 *
 * @returns {ListNode}
 */
Extract.prototype.previous = function() {
  return this._previous.data;
};

/**
 * Set a specific object to be the next in the chain.
 *
 * @param nextNode {ListNode}
 * @returns {ListNode}
 */
Extract.prototype.setNext = function(nextNode) {
  this._next.data = nextNode;
  return this;
};

/**
 * Get the next object in the chain.
 *
 * @returns {ListNode}
 */
Extract.prototype.next = function() {
  return this._next.data;
};


/**
 *
 * @returns {boolean}
 */
Extract.prototype.hasPrevious = function() {
  return (this._previous.data !== null);
};


/**
 *
 * @returns {boolean}
 */
Extract.prototype.hasNext = function() {
  return (this._next.data !== null);
};

Extract.instance = function() {
  return new Extract();
};

module.exports = Extract;