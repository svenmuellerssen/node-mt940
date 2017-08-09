var LinkedList = require('node-linkedlist')
  , GVCode = require('./GVCode')
  , _instance = null;

var GVCList = function() {
  this.codes = LinkedList.Create(GVCode);
};

/**
 * Create a new GVCode object with given information.
 * @param code {string}
 * @param text {string}
 * @returns {GVCode}
 */
GVCList.prototype.createCode = function(code, text) {
  var gvCode = GVCode.instance();
  gvCode.setCode(code);
  gvCode.setText(text);
  return gvCode;
};

/**
 * Set a list of GVCodes.
 * @param codes {LinkedList}
 * @param callback {function}
 */
GVCList.prototype.setCodes = function(codes, callback) {
  codes = (Array.isArray(codes) && codes.length > 0) ? codes : [];
  this.codes.setItems(codes, callback);
};

/**
 * Add a GVCode to the list.
 * @param code {GVCode}
 * @param callback {function}
 */
GVCList.prototype.addCode = function(code, callback) {
  code = code || null;
  var me = this;
  if (code === null) callback({error: {message: 'Can not find a GVCode object. No code given.', code: 0}}, null);
  else this.codes.add(code, function(error, list) {
    me.size = list.size;
    callback(error, list);
  });
};

/**
 * Get a code by its specific code number.
 * @param number {string}
 * @returns {GVCode}
 */
GVCList.prototype.getByCodeNumber = function(number) {
  number = (typeof parseInt(number) === 'number') ? parseInt(number) : null;
  if (number === null)
    return GVCode.instance();
  else
    return this.codes.searchBy('Code', number);
};

/**
 *
 * @returns {*}
 */
GVCList.singleton = function() {
  if (_instance === null) _instance = new GVCList();
  return _instance;
};

module.exports = GVCList;