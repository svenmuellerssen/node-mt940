var should = require('should')
  , GVCode = require('../src/object/GVCode')
  , gvcData = {
    code: 6,
    text: "GELDAUTOMAT"
  };

describe('Test gvc', function() {
  it('Test gvc completely', function(done) {
    var gvc = GVCode.instance();
    gvc.setCode(gvcData.code);
    gvc.setText(gvcData.text);

    should(gvc.getCode()).be.not.null().and.be.a.Number().and.be.equal(6);
    should(gvc.getText()).be.not.null().and.be.a.String().and.be.equal("GELDAUTOMAT");

    done();
  });
});