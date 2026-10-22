import should from 'should';
import { gvcText } from '../../src/gvc';

describe('Test gvc', function() {
  it('G1: a known business transaction code returns its text.', function() {
    should(gvcText(6)).be.equal('GELDAUTOMAT');
  });

  it('G2: a known business transaction code without a text returns an empty string.', function() {
    should(gvcText(1)).be.equal('');
  });

  it('G3: an unknown business transaction code returns undefined.', function() {
    should(gvcText(999)).be.undefined();
  });
});
