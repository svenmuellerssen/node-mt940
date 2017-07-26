var should = require('should')
  , ring = require('ring')
  , LinkedList = require('node-linkedlist')
  , MT940 = require('../src/MT940')
  , AWriter = require('../src/writer/AWriter')
  , Revenue = require('../src/object/Revenue')
  , Extract = require('../src/object/Extract')
  , Saldo = require('../src/object/Saldo')
  , Transaction = require('../src/object/Transaction')
  , PaymentReference = require('../src/object/PaymentReference')
  , configuration = {
    parser: MT940.PARSER_DEFAULT,
    writer: MT940.WRITER_DEFAULT,
    pathToContent: '20160914-umsMT940.TXT',
    writeAs: AWriter.WRITE_PLAIN_TEXT,
    pathToWrite: './testWriteSparkasse.csv',
    gvcData: require('../src/data/gvc.js')
  }
  , mt940 = MT940.singleton(configuration);

describe('Test MT940', function() {

  it('Test MT940 library with default parser', function(done) {
    mt940.parse(function(error, revenue) {
      should(error).be.null();
      should(ring.instance(revenue, Revenue)).be.not.null().and.be.a.Boolean().and.be.true();
      var extracts = revenue.getExtracts();
      should(ring.instance(extracts, LinkedList)).be.not.null().and.be.a.Boolean().and.be.true();
      should(extracts.size).be.not.null().and.be.a.Number().and.be.equal(0);

      done();
    });
  });

  it('Test MT940 library with default writer (plain text).', function(done) {
    mt940.parse(function(error, revenue) {
      should(error).be.null();
      should(ring.instance(revenue, Revenue)).be.not.null().and.be.a.Boolean().and.be.true();
      var extracts = revenue.getExtracts();
      should(ring.instance(extracts, LinkedList)).be.not.null().and.be.a.Boolean().and.be.true();
      should(extracts.size).be.not.null().and.be.a.Number().and.be.equal(0);

      do {
        mt940.write(revenue, function (err, mt940) {
          should(error).be.null();
          should(ring.instance(mt940, MT940)).be.not.null().and.be.a.Boolean().and.be.true();
          done();
        });

      } while(mt940.getWriteStatus() === 'writing');

    });
  });

  it('Test the library with Sparkasse parser.', function(done) {
    mt940
      .setParser(MT940.PARSER_SPARKASSE)
      .parse(function(error, revenue) {
      should(error).be.null();
      should(ring.instance(revenue, Revenue)).be.not.null().and.be.a.Boolean().and.be.true();

      var extracts = revenue.getExtracts();
      should(ring.instance(extracts, LinkedList)).be.not.null().and.be.a.Boolean().and.be.true();

      var extract = extracts.last();
      should(ring.instance(extract, Extract)).be.not.null().and.be.a.Boolean().and.be.true();
      should(extract.getNumber()).be.not.null().and.be.a.String().and.be.equal('00000');
      should(extract.getSheetNumber()).be.not.null().and.be.a.String().and.be.equal('001');

      // SaldoStart
      var saldo = extract.getStartSaldo();
      should(ring.instance(saldo, Saldo)).be.not.null().and.be.a.Boolean().and.be.true();

      // SaldoEnd
      saldo = extract.getEndSaldo();
      should(ring.instance(saldo, Saldo)).be.not.null().and.be.a.Boolean().and.be.true();

      var transactions = extract.getTransactions();
      should(ring.instance(transactions, LinkedList)).be.not.null().and.be.a.Boolean().and.be.true();

      // Transaction first
      var transaction = transactions.first();
      should(ring.instance(transaction, Transaction)).be.not.null().and.be.a.Boolean().and.be.true();

      // Payment reference of first transaction
      var paymentInformation = transaction.getPaymentReference();
      should(ring.instance(paymentInformation, PaymentReference)).be.not.null().and.be.a.Boolean().and.be.true();

      // Transaction last
      transaction = transactions.last();
      should(ring.instance(transaction, Transaction)).be.not.null().and.be.a.Boolean().and.be.true();

      // Payment reference of last transaction
      paymentInformation = transaction.getPaymentReference();
      should(ring.instance(paymentInformation, PaymentReference)).be.not.null().and.be.a.Boolean().and.be.true();

		    //console.log(mt940);
      done();
    });
  });


  it('Test MT940 library with Sparkasse writer (plain text).', function(done) {
	configuration.parser = MT940.PARSER_SPARKASSE;
	configuration.writer = MT940.WRITER_SPARKASSE;
	configuration.writeAs = AWriter.WRITE_PLAIN_TEXT;
	configuration.pathToWrite = './testWriteSparkasse.txt';

	mt940
		.setConfiguration(configuration)
		.parse(function(error, revenue) {
			should(error).be.null();
			should(ring.instance(revenue, Revenue)).be.not.null().and.be.a.Boolean().and.be.true();
			var extracts = revenue.getExtracts();
			should(ring.instance(extracts, LinkedList)).be.not.null().and.be.a.Boolean().and.be.true();

			mt940.write(revenue, function (err, mt940) {
				should(error).be.null();
				should(ring.instance(mt940, MT940)).be.not.null().and.be.a.Boolean().and.be.true();
				done();
			});
		});
  });

  it('Test MT940 library with Sparkasse writer (CSV into file).', function(done) {
    configuration.parser = MT940.PARSER_SPARKASSE;
    configuration.writer = MT940.WRITER_SPARKASSE;
    configuration.writeAs = AWriter.WRITE_CSV;
	configuration.pathToWrite = './testWriteSparkasse.csv';

    mt940
      .setConfiguration(configuration)
      .parse(function(error, revenue) {
        should(error).be.null();
        should(ring.instance(revenue, Revenue)).be.not.null().and.be.a.Boolean().and.be.true();
        var extracts = revenue.getExtracts();
        should(ring.instance(extracts, LinkedList)).be.not.null().and.be.a.Boolean().and.be.true();

        mt940.write(revenue, function (err, mt940) {
          should(error).be.null();
          should(ring.instance(mt940, MT940)).be.not.null().and.be.a.Boolean().and.be.true();


          done();
        });


		//console.log(revenue.getExtracts());
		//console.log(revenue.getExtracts().first().getTransactions());
      });
  });

  it('Test MT940 library with default writer.', function(done) {

    done();
  });
});