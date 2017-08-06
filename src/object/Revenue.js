var _ = require('underscore')
  , LinkedList = require('node-linkedlist')
  , Extract = require('./Extract')
  , ring = require('ring');

var Revenue = function() {
  this.name = 'Revenue';
  this.contractReferenceNumber = '';
  this.bankCode = ''; // Field :25:1
  this.accountNumber = ''; // Field :25:2
  this.extractList = LinkedList.Create(Extract);
};

/**
 *
 * @param number
 * @returns {Revenue}
 */
Revenue.prototype.setReferenceNumber = function(number) {
  number = (typeof number === 'string') ? number : null;

  if (number !== null)
    this.contractReferenceNumber = number;
  return this;
};

/**
 *
 * @returns {string|*}
 */
Revenue.prototype.getReferenceNumber = function() {
  return this.contractReferenceNumber;
};

/**
 *
 * @param bankCode
 * @returns {Revenue}
 */
Revenue.prototype.setBankCode = function(bankCode) {
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
Revenue.prototype.getBankCode = function() {
  return this.bankCode;
};

/**
 *
 * @param accountNumber
 * @returns {Revenue}
 */
Revenue.prototype.setAccountNumber = function(accountNumber) {
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
Revenue.prototype.getAccountNumber = function() {
  return this.accountNumber;
};

/**
 *
 * @param extractList {LinkedList}
 * @returns {Revenue}
 */
Revenue.prototype.setExtracts = function(extractList) {
  extractList = (ring.instance(extractList, LinkedList)) ? extractList : null;

  if (extractList !== null)
    this.extractList = extractList;

  return this;
};

/**
 *
 * @param extract
 * @param callback
 */
Revenue.prototype.addExtract = function(extract, callback) {
  callback = (callback !== void 0 && callback !== null && typeof callback === 'function') ? callback : function(err, result) {};

  this.extractList.add(extract, callback);
};
/**
 *
 * @returns {LinkedList}
 */
Revenue.prototype.getExtracts = function() {
  return this.extractList;
};

/**
 *
 * @returns {Revenue}
 */
Revenue.instance = function() {
  return new Revenue();
};

module.exports = Revenue;