var _ = require('underscore')
  , LinkedList = require('node-linkedlist')
  , Revenues = require('../object/Revenues')
  , Extract = require('../object/Extract')
  , Saldo = require('../object/Saldo')
  , Transaction = require('../object/Transaction')
  , PaymentReference = require('../object/PaymentReference');

var Parser = function() {
  this.content = '' +
  ':20:STARTUMSE' +
  ':25:10050000/6013216264' +
  ':28C:00000/001' +
  ':60F:C150115EUR276,02' +
  ':61:1501160116DR14,99N037NONREF' +
  ':86:006?00SONSTIGER EINZUG?109208?20EC 65421206 150115184614IC5?3' +
  '030050000?311107713?32SATURN SAGT DANKE 65421206?34011' +
  ':61:1501160116DR50,00N004NONREF//100000155234' +
  ':86:006?00GELDAUTOMAT?103342?2016.01/15.52UHR 650 897642?30100500' +
  '00?32GA NR00003342 BLZ10050000 5?34003' +
  ':62F:C150116EUR211,03' +
  '-' +
  ':20:STARTUMSE' +
  ':25:10050000/6013216264' +
  ':28C:00000/001' +
  ':60F:C150116EUR211,03' +
  ':61:1501190119DR20,00N033NONREF' +
  ':86:177?00ONLINE-UEBERWEISUNG?109310?20SVWZ+Kreditkarte?21DATUM 1' +
  '7.01.2015, 22.42 UHR?221.TAN 258749?30BELADEBEXXX?31DE83100500006' +
  '603197900?32Sparkasse Berlin?34997' +
  ':61:1501190119DR9,70N037NONREF' +
  ':86:006?00SONSTIGER EINZUG?109252?20EC 55501776 150115092026IC5?3' +
  '010090000?317109860012?32BIRKEN-APOTHEKE?34011' +
  ':61:1501190119CR130,00N062NONREF' +
  ':86:166?00GUTSCHRIFT?109223?20EREF+0000000006563893201501?2115020' +
  '00000901?22SVWZ+6563893.2 BEITR-RUECKZ?23AHLG. RENTE 71259559.0 1' +
  '30,?2400?25ABWA+Debeka Krankenversiche?26rungsverein a. G.?30MALA' +
  'DE51KOB?31DE82570501200000071555?32Debeka Kranken-Versicherung?33' +
  '-Verein a.G' +
  ':62F:C150119EUR311,33' +
  '-';
  this.path = './';
  this.file = '';
};

Parser.prototype.setContent = function(content) {
  content = content || '';
  this.content = content;
  return this;
};

Parser.prototype.hasContent = function() {
  return (this.content !== "");
};

Parser.prototype.setFilePath = function(path) {
  /**
   * todo
   * 1. Split path and file
   * 2. Write path
   * 3. Write filename
   */
  return this;
};

Parser.prototype.loadContent = function(path) {
  path = (typeof path === 'string') ? path : null;

  if (path !== null) {
    this.path = path.substring(0, path.lastIndexOf("/"));
    this.file = path.substring(path.lastIndexOf("/"));
  }

  if (this.content === '' && this.path !== '' && this.file !== '') {
    /**
     * todo
     * 1. Check existence of file.
     * 2. If not return with error message.
     * 3. Load file contact into property this.contact.
     * 3. If no content available in file return with error message.
     */
  }

  return this;
};

Parser.prototype.execute = function(callback) {
  var mt940Extracts = this.content.split(/-/)
    , revenues = Revenues.instance();

  if (Array.isArray(mt940Extracts) && mt940Extracts.length > 0) {

    var index = 0
      , extractText = ''
      , extractSnippets = LinkedList.Create();

    for(;index < mt940Extracts.length; index++) {
      extractText = mt940Extracts[index];

      if (extractText.length == 0) {
        callback(null, revenues);
      } else {

        extractSnippets = extractText.split(/(:86:.*|:[0-9CcFfMm]{2,3}:.*|:61:.*)/);
        if (extractSnippets.length > 0) {
          var extract = Extract.instance()
            , snippet = '';

          var transaction = null;
          for(var i= 1; i < extractSnippets.length; i++) {
            snippet = extractSnippets[i];
            var type = snippet.match(/(:[2-9CFcf]{2,3}:)/ig);

            switch(type) {
              case ':25:':
                // [^:25:](.*)
                var number = snippet.match(/[^:25:](.*)/)
                  , numberBuffer = number.split(/\//);
                revenues.setBankCode(numberBuffer[0]);
                revenues.setAccountNumber(numberBuffer[1]);
                number = null;
                numberBuffer = null;
                break;
              case ':28C:':
              case ':28c:':
                // [^:28Cc:](.*)
                var extractLine = snippet.match(/[^:28Cc:]([a-zA-Z0-9/].*)/)
                  , extractNumber = extractLine.split(/\//);
                extract.setNumber(extractNumber[0]).setSheetNumber(extractNumber[1]);
                extractLine = null;
                extractNumber = null;
                break;
              case ':60F:':
              case ':60f:':
                // [^:60Ff:](.*)
                extract.setStartSaldo(
                  Saldo.instance()
                    .setSaldo(
                      snippet.match(/[^:60FfMm:](.*)/),
                      Saldo.TYPE_SALDO_END
                    ));
                break;
              case ':61:':
                transaction = Transaction.instance();
                transaction.setRevenueInformation(snippet);
                break;
              case ':86:':
                var reference = PaymentReference.instance()
                  , information = snippet.match(/[^:86](.*)/gi);
                reference.setMultiPurposeInformation(information);

                transaction.setReference(reference);
                extract.addTransaction(transaction, function() {});
                break;
              case ':62F:':
              case ':62f:':
                // [^:62Ff:](.*)
                extract.setEndSaldo(
                  Saldo.instance().setSaldo(
                    snippet.match(/[^:62Ff:](.*)/),
                    Saldo.TYPE_SALDO_END
                  ));
                break;
            }
          }


          revenues.addExtract(extract, function(err, revenues) {});
        }
      }
    }
  }

  callback(null, revenues);
};



Parser.instance = function() {
  return new Parser();
};

module.exports = Parser;