import should from 'should';
import * as fs from 'fs';
import * as path from 'path';
import { parseStatement, Statement } from '../../src/core';
import { formatStatement } from '../../src/write';

const fixture = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'sparkasse.txt'), 'utf8');

function text(lines: string[]): string {
  return lines.join('\r\n') + '\r\n';
}

/** What a statement says. The warnings are left out, their line numbers change with the formatting. */
function content(statement: Statement) {
  return {referenceNumber: statement.referenceNumber, extracts: statement.extracts};
}

/** Parse the text, format it as MT940 and parse the result again. */
function roundTrip(source: string) {
  const original = parseStatement(source);
  return {original, again: parseStatement(formatStatement(original, 'mt940'))};
}

describe('Test the round trip parse, format and parse', function() {
  it('RT1: a statement that is formatted as MT940 and parsed again is the same statement.', function() {
    const {original, again} = roundTrip(fixture);

    should(original.extracts.length).be.equal(2);
    should(content(again)).be.eql(content(original));
  });

  it('RT2: intermediate balances (:60M:, :62M:) stay intermediate.', function() {
    const {original, again} = roundTrip(text([
      ':20:STARTUMSE', ':25:10050000/6013216264', ':28C:00001/002', ':60M:C150115EUR276,02',
      ':61:1501160116DR14,99N037NONREF', ':86:006?00GELDAUTOMAT?103342?3010050000',
      ':62M:C150116EUR261,03', '-'
    ]));

    should(original.extracts[0].openingBalance.intermediate).be.true();
    should(original.extracts[0].closingBalance.intermediate).be.true();
    should(content(again)).be.eql(content(original));
  });

  it('RT3: an unstructured payment information (:86:) stays unstructured.', function() {
    const {original, again} = roundTrip(text([
      ':20:STARTUMSE', ':25:10050000/6013216264', ':28C:00000/001', ':60F:C150115EUR276,02',
      ':61:1501160116DR14,99N037NONREF', ':86:Barauszahlung ohne Struktur',
      ':62F:C150116EUR261,03', '-'
    ]));

    const payment = again.extracts[0].transactions[0].payment;
    should(payment.gvc).be.null();
    should(payment.text).be.equal('Barauszahlung ohne Struktur');
    should(content(again)).be.eql(content(original));
  });

  it('RT4: a transaction without payment information (:86:) stays a transaction with an empty payment information.', function() {
    const {original, again} = roundTrip(text([
      ':20:STARTUMSE', ':25:10050000/6013216264', ':28C:00000/001', ':60F:C150115EUR276,02',
      ':61:1501160116DR14,99N037NONREF',
      ':62F:C150116EUR261,03', '-'
    ]));

    const payment = again.extracts[0].transactions[0].payment;
    should(again.extracts[0].transactions.length).be.equal(1);
    should(payment.gvc).be.null();
    should(payment.text).be.equal('');
    should(content(again)).be.eql(content(original));
  });
});
