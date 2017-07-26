var LinkedList = require('node-linkedlist')
  , ring = require('ring');

var GVCode = function() {
  this._code = 0;
  this._text = '';
  this._previous = {data: null};
  this._next = {data: null};
};

/**
 * Set the gvc code number.
 *
 * @param code {number}
 * @returns {GVCode}
 */
GVCode.prototype.setCode = function(code) {
  code = (typeof parseInt(code) === 'number') ? parseInt(code) : null;
  if (code !== null) this._code = code;
  return this;
};

/**
 * Get the gvc code number.
 *
 * @returns {number|*}
 */
GVCode.prototype.getCode = function() {
  return this._code;
};

/**
 * Set the gvc text.
 *
 * @param text {string}
 * @returns {GVCode}
 */
GVCode.prototype.setText = function(text) {
  text = (typeof text === 'string') ? text : null;
  if (text !== null) this._text = text;
  return this;
};

/**
 * Get the gvc text.
 *
 * @returns {string}
 */
GVCode.prototype.getText = function() {
  return this._text;
};
/**
 * Get the gvc values as json object.
 *
 * @return {object}
 */
GVCode.prototype.toJSON = function() {
  return {
    "code": this._code,
    "text": this._text
  };
};

/**
 * Set a specific object to be the previous object in a chain.
 *
 * @param previousNode {GVCode}
 * @returns {GVCode}
 */
GVCode.prototype.setPrevious = function(previousNode) {
  this._previous.data = previousNode;
  return this;
};

/**
 * Get the previous object.
 *
 * @returns {GVCode}
 */
GVCode.prototype.previous = function() {
  return this._previous.data;
};

/**
 * Set a specific object to be the next in the chain.
 *
 * @param nextNode {GVCode}
 * @returns {GVCode}
 */
GVCode.prototype.setNext = function(nextNode) {
  this._next.data = nextNode;
  return this;
};

/**
 * Get the next object in the chain.
 *
 * @returns {GVCode}
 */
GVCode.prototype.next = function() {
  return this._next.data;
};

/**
 * Check if the gvc object has a previous gvc object node.
 *
 * @returns {boolean}
 */
GVCode.prototype.hasPrevious = function() {
  return (this._previous.data !== null);
};

/**
 * Check if the gvc object has a next gvc object node.
 *
 * @returns {boolean}
 */
GVCode.prototype.hasNext = function() {
  return (this._next.data !== null);
};

/**
 * Get an instance of gvc code object.
 *
 * @returns {GVCode}
 */
GVCode.instance = function() {
  return new GVCode();
};

module.exports = GVCode;