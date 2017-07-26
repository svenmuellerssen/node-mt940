var fs = require('fs')
  , ring = require('ring')
  , Revenues = require('../object/Revenue')
  , AWriter = require('./AWriter')
  , eventEmitter = require('events').EventEmitter;

var WriterSparkasse = function() {
  this.name = 'WriterSparkasse';
  this.path = null;
  this.filename = null;
  this._writeableStream = null;
};

WriterSparkasse.prototype.setFilePath = function(path) {
  path = (typeof path === 'string') ? path : null;


  if (path !== null) {
    this.path = path.substring(0, path.lastIndexOf("/"));
    if (this.path === '') this.path = './';
    this.filename = path.substring(path.lastIndexOf("/") +1);
  }

  return this;
};

/**
 * Writes all revenues into file in MT940 format.
 *
 * @param revenues
 * @param callback
 */
WriterSparkasse.prototype.writePlainText = function(revenues, callback) {
  revenues = (ring.instance(revenues, Revenues)) ? revenues : null;

  if (revenues === null) {
    callback({error: {message: 'Invalid Revenue object given. No information available to write into file.', code: 0}}, null);
  } else {
    var me = this
      , path = this.path + '/' + this.filename
      , text = ''
      , extracts = revenues.getExtracts();

    if (extracts.size == 0) {
      callback({error: {message: '', code: 0}}, null);
    } else {
      me._status = AWriter.STATUS_WRITING;
      var extract = null
        , transactions = null
        , transaction = null
        , saldo = null;

      do {
	      extract =  extracts.next();
        // Start extract
        text += ':20:' + revenues.getReferenceNumber() + '\n';
        text += ':25:' + extract.getBankCode() + '/' + extract.getAccountNumber() + '\n';
        text += ':28C:' + extract.getNumber() + '/' + extract.getSheetNumber() + '\n';
        // Start saldo
        saldo = extract.getStartSaldo();
        text += ':60F:' + saldo.getCreditDebitString() + saldo.getFormattedBookingDate() + saldo.getCurrency() + saldo.getAmount() + '\n';
        // Start transaction
        transactions = extract.getTransactions();

	      while(transactions.hasNext()) {
		      transaction = transactions.next();
		      text += ':61:' + transaction.getFormattedValuta() + transaction.getFormattedBookingDate() + transaction.getTypeString();
		      if (transaction.getLastCharIsoCode() !== '') text += transaction.getLastCharIsoCode();
		      text += transaction.getAmount() + transaction.getBookingKey() + transaction.getReference() + '\n';

		      // Start payment reference
		      var paymentReference = transaction.getPaymentReference();

		      text += ':86:' + paymentReference.getGVC() + '?00' + paymentReference.getBookingText() + '?10' + paymentReference.getPrimanotaNumber() +
		       '?20' + paymentReference.getText() + '\n';
	      }





        text += '\n\n';
      } while(extracts.hasNext());
    }

    // todo Glue all needed information to a Revenue format conform text.
    writeToFile(text, path, function(err, writer) {
      me._status = AWriter.STATUS_READY;
      callback(err, writer);
    });
  }
};

WriterSparkasse.prototype.writeXML = function(revenues, callback) {
  revenues = (ring.instance(revenues, Revenues)) ? revenues : null;

  if (revenues === null) {
    callback({error: {message: 'Invalid Revenue object given. No information available to write into file.', code: 0}}, null);
  } else {
    var me = this
      , path = this.path + '/' + this.filename
      , text = '';

    me._status = AWriter.STATUS_WRITING;
    // todo Glue all needed information to a Revenue format conform text.
    writeToFile(text, path, function(err, writer) {
      me._status = AWriter.STATUS_READY;
      callback(err, writer);
    });
  }
};

/**
 *
 * @param revenue
 * @param callback
 */
WriterSparkasse.prototype.writeCSV = function(revenue, callback) {
  revenue = (ring.instance(revenue, Revenues)) ? revenue : null;

  if (revenue === null) {
    callback({error: {message: 'Invalid Revenue object given. No information available to write into file.', code: 0}}, null);
  } else {
    /**
     * @todo Glue all needed information to a Revenue format conform text.
     */
    var me = this
      , path = this.path + '/' + this.filename
      , text = '"Auftragskonto";"Buchungstag";"Valutadatum";"Buchungstext";"Verwendungszweck";"Beguenstigter/Zahlungspflichtiger";"Kontonummer";"BLZ";"Betrag";"Waehrung";"Info";\n'
      , extracts = revenue.getExtracts();

    if (extracts.size == 0) {
      callback({error: {message: '', code: 0}}, null);
    } else {
      me._status = AWriter.STATUS_WRITING;
      var extract = null;

      while(extracts.hasNext()) {
        extract = extracts.next();
        text += extract.toCSVString();
      }

      writeToFile(text, path, function(err, writer) {
        if (err) callback({}, null);
        else {
          me._status = AWriter.STATUS_READY;
          callback(err, writer);
        }
      });
    }

  }
};

/**
 *
 * @param text
 * @param path
 * @param callback
 */
var writeToFile = function(text, path, callback) {
  var me = this;

  fs.stat(path, function(err, stats) {
    if (err) {

    }

      var stream = me._writeableStream = fs.createWriteStream(path, {mode: 0x666});

      stream.on('finish', function() {
        callback(null, me);
      });

      stream.write(text);
      stream.end();

  });
};

var Writer = ring.create([WriterSparkasse, eventEmitter, AWriter], {});

Writer.instance = function() {
  return new Writer();
};

module.exports = Writer;