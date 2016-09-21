var LinkedList = require('node-linkedlist')
  , Saldo = require('./Saldo')
  , Transaction = require('./Transaction');

var Extract = function() {
  this.number = ''; // Field :28C:1
  this.sheetNumber = 0;  // Field :28C:2
  this.transactions = LinkedList.Create(Transaction);
  this.saldoStart = null;
  this.saldoEnd = null;
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
    this.number = number;
  return this;
};

Extract.prototype.getSheetNumber = function() {
  return this.sheetNumber;
};

Extract.prototype.addTransaction = function(transaction, callback) {
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

Extract.instance = function() {
  return new Extract();
};

module.exports = Extract;