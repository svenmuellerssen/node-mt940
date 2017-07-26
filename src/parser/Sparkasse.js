var fs = require('fs')
  , _ = require('underscore')
  , LinkedList = require('node-linkedlist')
  , async = require('async')
  , Revenues = require('../object/Revenue')
  , Extract = require('../object/Extract')
  , Saldo = require('../object/Saldo')
  , Transaction = require('../object/Transaction')
  , PaymentReference = require('../object/PaymentReference');

var Parser = function() {
  this.content = '';
  this.path = './';
  this.filename = '';
};

/**
 *
 * @param content
 * @returns {Parser}
 */
Parser.prototype.setContent = function(content) {
  content = content || '';
  this.content = content;
  return this;
};

/**
 *
 * @returns {boolean}
 */
Parser.prototype.hasContent = function() {
  return (this.content !== "");
};

/**
 *
 * @param path
 * @returns {Parser}
 */
Parser.prototype.setFilePath = function(path) {
  path = (typeof path === 'string') ? path : null;

  if (path !== null) {
    this.path = path.substring(0, path.lastIndexOf("/"));
    if (this.path === '') this.path = './';
    this.filename = path.substring(path.lastIndexOf("/") +1);
  }

  return this;
};

/**
 *
 * @param path
 * @param callback
 * @returns {Parser}
 */
Parser.prototype.loadContent = function(path, callback) {
  var me = this;
  this.setFilePath(path);

  if (this.path === '' || this.filename === '') {
    callback({error: {message: 'Load content error: The path and/or filename is not available.', code: 0}}, null);
  } else if (this.content !== '') {
    callback(null, true);
  } else {
    fs.readFile(me.path + '/' + me.filename, 'utf-8', function(error, content) {
      if (error) callback(error, null);
      else {
        me.content = content;
        callback(null, true);
      }
    });
  }

  return this;
};

/**
 *
 * @param path
 * @param callback
 */
Parser.prototype.execute = function(path, callback) {
  var me = this;
  async.auto({
    /**
     *
     * @param immediateCallback
     */
    loadContent: function(immediateCallback) {
      if (!me.hasContent()) {
        me.loadContent(path, immediateCallback);
      } else {
        immediateCallback(null, true);
      }
    },
    /**
     *
     * @param resultObj
     * @param immediateCallback
     */
    parseContent: ['loadContent', function(resultObj, immediateCallback) {
      if (resultObj.loadContent === true) {
        var mt940Extracts = me.content.split(/-\r\n|-\n|-\r|-$/)
          , revenues = Revenues.instance();

        if (!Array.isArray(mt940Extracts) || mt940Extracts.length === 0) {
          immediateCallback({error: {messge: 'Parse error: Content can not be split into single extracts.', code: 0}}, null);
        } else {

          var index = 0
            , extractText = ''
            , extractSnippets = null
            //, extractSnippets = LinkedList.Create()
            ;

          mt940Extracts = _.filter(mt940Extracts, function(extract) {
            return !(extract === '');
          });

          for(;index < mt940Extracts.length; index++) {
            extractText = mt940Extracts[index];

            extractSnippets = extractText.match(/(:[0-9CcFfMm]{2,3}:)|(.*)\r\n/g);
            extractSnippets = _.filter(extractSnippets, function(snippet) {
              return (snippet.replace(/\r\n/gi,'') !== '');
            });

            //console.log(extractSnippets);
            if (extractSnippets.length === 0) {
              immediateCallback({error: {messge: 'Parse error: Got no extract lines.', code: 0}}, null);
            } else {
              var extract = Extract.instance()
                , snippet = '';

              var transaction = null
                , reference = null
                , line = '';

              for(var i=0, valueIndex=1; i < extractSnippets.length; i+=2, valueIndex+=2) {
                snippet = extractSnippets[i];
                snippet = snippet.replace(/\r\n/gi,'');

                if (snippet == '') {
                  i++;
                  valueIndex++;
                  snippet = extractSnippets[i];
                  snippet = snippet.replace(/\r\n/gi,'');
                }

                var type = snippet.match(/(:86:)|(:[0-9CFMcfm]{2,3}:)|(:61:)/ig);

                line = extractSnippets[valueIndex];
                line = line.replace(/\r\n/gi, '');

                switch(type[0]) {
                  case ':20:':
                    revenues.setReferenceNumber(line);
                    break;
                  case ':25:':
                    // [^:25:](.*)
                    var numberBuffer = line.split(/\//);
                    extract.setBankCode(numberBuffer[0]);
                    extract.setAccountNumber(numberBuffer[1]);
                    numberBuffer = null;
                    break;
                  case ':28C:':
                  case ':28c:':
                    // [^:28Cc:](.*)
                    var extractNumber = line.split(/\//);
                    extract.setNumber(extractNumber[0]).setSheetNumber(extractNumber[1]);
                    extractNumber = null;
                    break;
                  case ':60F:':
                  case ':60f:':
                  case ':60M:':
                  case ':60m:':
                    // [^:60FfMm:](.*)
                    extract.setStartSaldo(
                      Saldo.instance()
                        .parseLine(line)
                    );
                    break;
                  case ':61:':
                    transaction = Transaction.instance();
                    transaction.parseLine(line);
                    break;
                  case ':86:':
                    if (reference === null)
                      reference = PaymentReference.instance();

                    var text = '';
                    do {
                      valueIndex += 1;
                      line = line.replace(/\r\n/gi, '');
                      text += line;

                      line = extractSnippets[valueIndex];
                      //console.log(valueIndex);

                    } while (line.indexOf(":") == -1);
                    //console.log(JSON.stringify(text));
                    // Set reference information
                    reference.parseLine(text);

                    // Balance the loop counter.
                    i = valueIndex-2;
                    valueIndex -= 1;

                    if (!transaction) transaction = Transaction.instance();

                    //console.log(reference);
                    transaction.setPaymentReference(reference);
                    extract.addTransaction(transaction, function() {});
                    break;
                  case ':62F:':
                  case ':62f:':
                    // [^:62Ff:](.*)
                    extract.setEndSaldo(
                      Saldo.instance()
                        .parseLine(line)
                    );
                    break;
                }
              }

              revenues.addExtract(extract, function(err, revenues) {});
            }
          }
          // Response the parsed revenue.
          immediateCallback(null, revenues);
        }

      } else {
        immediateCallback({error: {message: 'Parsing error: No content available', code: 0}}, null);
      }
    }]
  }, function(error, results) {
    if (error) callback(error, null);
    else callback(null, results.parseContent);
  });

};



Parser.instance = function() {
  return new Parser();
};

module.exports = Parser;