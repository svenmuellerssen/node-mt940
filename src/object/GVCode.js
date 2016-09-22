var LinkedList = require('node-linkedlist')
  , ring = require('ring');

var GVCode = function() {
  this._code = 0;
  this._text = '';
  this._value = {data: null};
  this._previous = {data: null};
  this._next = {data: null};
};

GVCode.prototype.setCode = function(code) {
  code = (typeof parseInt(code) === 'number') ? parseInt(code) : null;
  if (code !== null) this._code = code;
  return this;
};

GVCode.prototype.getCode = function() {
  return this._code;
};

GVCode.prototype.setText = function(text) {
  text = (typeof text === 'string') ? text : null;
  if (text !== null) this._text = text;
  return this;
};

GVCode.prototype.getText = function() {
  return this._text;
};
/**
 *
 * @param value
 */
GVCode.prototype.toValues = function() {
  return {
    code: this._code,
    text: this._text
  };
};

/**
 * Set a specific object to be the previous object in a chain.
 *
 * @param previousNode {ListNode}
 * @returns {ListNode}
 */
GVCode.prototype.setPrevious = function(previousNode) {
  this._previous.data = previousNode;
  return this;
};

/**
 * Get the previous object.
 *
 * @returns {ListNode}
 */
GVCode.prototype.previous = function() {
  return this._previous.data;
};

/**
 * Set a specific object to be the next in the chain.
 *
 * @param nextNode {ListNode}
 * @returns {ListNode}
 */
GVCode.prototype.setNext = function(nextNode) {
  this._next.data = nextNode;
  return this;
};

/**
 * Get the next object in the chain.
 *
 * @returns {ListNode}
 */
GVCode.prototype.next = function() {
  return this._next.data;
};

/**
 *
 * @returns {boolean}
 */
GVCode.prototype.hasPrevious = function() {
  return (this._previous.data !== null);
};

/**
 *
 * @returns {boolean}
 */
GVCode.prototype.hasNext = function() {
  return (this._next.data !== null);
};

GVCode.Create = function() {
  return new GVCode();
};

module.exports = GVCode;