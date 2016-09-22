var LinkedList = require('node-linkedlist')
  , GVCode = require('./GVCode')
  , _instance = null;

var GVCList = function() {
  this.codes = LinkedList.Create(GVCode);
};

GVCList.prototype.createCode = function(code, text) {
  var gvCode = GVCode.Create();
  gvCode.setCode(code);
  gvCode.setText(text);
  return gvCode;
};

GVCList.prototype.setCodes = function(codes, callback) {
  codes = (Array.isArray(codes) && codes.length > 0) ? codes : [];
  this.codes.setItems(codes, callback);
};

GVCList.prototype.addCode = function(code, callback) {
  code = code || null;
  var me = this;
  if (code === null) callback({error: {message: '', code: 0}}, null);
  else this.codes.add(code, function(error, list) {
    me.size = list.size;
    callback(error, list);
  });
};

GVCList.prototype.getByCodeNumber = function(number) {
  number = (typeof parseInt(number) === 'number') ? parseInt(number) : null;
  if (number === null)
    return GVCode.instance();
  else
    return this.codes.searchBy('Code', number);
};

GVCList.singleton = function() {
  if (_instance === null) _instance = new GVCList();
  return _instance;
};

module.exports = GVCList;