var should = require('should')
  , async = require('async')
  , GVCList = require('../src/object/GVCList')
  , path = '../src/data/gvc.js';

describe('Test gvc list', function() {
  it('Test the list for gvcs.', function(done) {
    var list = GVCList.singleton()
      , gvcs = require(path)
      , gvc = list.createCode(6, "GELDAUTOMAT");

    async.eachLimit(
      gvcs,
      100,
      function(gvc, innerCallback) {
        list.addCode(list.createCode(gvc.code, gvc.text), innerCallback);
      },
      function eachCallback(error) {
        should(error).be.null();

        should(list.size).be.not.null().and.be.a.Number().and.be.equal(gvcs.length);
        should(list.getByCodeNumber(6).getText()).be.not.null().and.be.an.String().and.be.eql(gvc.getText());

        done();
      });
  });
});