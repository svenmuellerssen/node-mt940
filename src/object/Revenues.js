var _ = require('underscore')
  , LinkedList = require('node-linkedlist')
  , ring = require('ring');

var Revenues = function() {
  this.contractReferenceNumber = '';
  this.bankCode = ''; // Field :25:1
  this.accountNumber = ''; // Field :25:2
  this.extractList = LinkedList.Create();
};

/**
 *
 * @param number
 * @returns {Revenues}
 */
Revenues.prototype.setReferenceNumber = function(number) {
  number = (typeof number === 'string') ? number : null;

  if (number !== null)
    this.contractReferenceNumber = number;
  return this;
};

/**
 *
 * @returns {string|*}
 */
Revenues.prototype.getReferenceNumber = function() {
  return this.contractReferenceNumber;
};

/**
 *
 * @param bankCode
 * @returns {Revenues}
 */
Revenues.prototype.setBankCode = function(bankCode) {
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
Revenues.prototype.getBankCode = function() {
  return this.bankCode;
};

/**
 *
 * @param accountNumber
 * @returns {Revenues}
 */
Revenues.prototype.setAccountNumber = function(accountNumber) {
  accountNumber = (typeof accountNumber === 'string') ? bankCode : null;
  if (accountNumber !== null) {
    this.accountNumber = accountNumber;
  }

  return this;
};

/**
 *
 * @returns {string}
 */
Revenues.prototype.getAccountNumber = function() {
  return this.accountNumber;
};

/**
 *
 * @param extractList {node-linkedlist}
 * @returns {Revenues}
 */
Revenues.prototype.setExtracts = function(extractList) {
  extractList = (ring.instance(extractList, LinkedList)) ? extractList : null;

  if (extractList !== null)
    this.extractList = extractList;

  return this;
};

Revenues.prototype.addExtract = function(extract, callback) {
  callback(null, this);
};
/**
 *
 * @returns {LinkedList}
 */
Revenues.prototype.getExtracts = function() {
  return this.extractList;
};

/**
 *
 * @returns {Revenues}
 */
Revenues.instance = function() {
  return new Revenues();
};

