# MT940
This module parses files with bank account statements in MT940 format.

# Documentation

## Installation

```
  npm install --save node-mt940
```

## Quick start

## How to use

The module contains a default _parser_ and _writer_. Another _parser/writer_ for the bank _Sparkasse_ also exists.

## MT940

[constructor](#constructor-method)

[singleton](#singleton-method) - Get single MT940 object

[setConfiguration](#set-configuration-method) - Set the mt940 configuration

[setParser](#set-parse-method) - Set the parser

[setWriter](#set-writer-method) - Set the writer

[setWriteAs](#set-write-as-method) - Set the format to write transactions.

[parse](#parse-method) - Parse transactions in MT940 format

[write](#write-method) - Write transaction in configured format

[getWriteStatus](#get-write-status-method) - Get the current status of writing

## Parser
[instance](#parser-instance-method) - Get a new parser instance

[setContent](#set-content-method) - Set the content to parse

[hasContent](#has-content-method) - Check if parser has content to parse

[setFilePath](#set-parser-file-path-method) - Set the path to the file with content to parse

[loadContent](#load-content-method) - Load the content of configured file path

[execute](#execute-method) - Execute parsing file or set content

## Writer
[instance](#writer-instance-method) - Get a new writer instance

[setFilePath](#set-writer-file-path-method) - Set path write transaction to file

[writePlainText](#write-plain-text-method) - Write transactions in MT940 plain text format

[writeXML](#write-xml-method) - Write transactions in XML format

[writeCSV](#write-csv-method) - Write transactions in CSV format

## Revenue
[instance](#revenue-instance-method) - Get a new revenue object

[setReferenceNumber](#set-reference-number-method) - Set the reference number

[getReferenceNumber](#get-reference-number-method) - Get the reference number

[setBankCode](#revenue-set-bank-code-method) - Set bank code of account

[getBankCode](#revenue-get-bank-code-method) - Get bank code of account

[setAccountNumber](#revenue-set-account-number-method) - Set the bank account number

[getAccountNumber](#revenue-get-account-number-method) - Get the bank account number

[setExtracts](#set-extracts-method) - Set collection of extracts (single statement block)

[addExtract](#add-extract-method) - Add single extract to extract collection

[getExtracts](#get-extracts-method) - Get collection of extracts

## Extract
[instance](#extract-instance-method) - Get a new extract object

[setBankCode](#extract-set-bank-code-method) - Set bank code of account

[getBankCode](#extract-get-bank-code-method) - Get bank code of account

[setAccountNumber](#extract-set-account-number-method) - Set bank account number

[getAccountNumber](#extract-get-account-number-method) - Get bank account number

[setNumber](#extract-set-number-method) - Set extract number

[getNumber](#extract-get-number-method) - Get extract number

[setSheetNumber](#extract-set-sheet-number-method) - Set sheet number

[getSheetNumber](#extract-get-sheet-number-method) - Get sheet number

[addTransaction](#extract-add-transaction-method) - Add a transaction to the extract

[getTransactionById](#extract-get-transaction-by-id-method) - Get a specific transaction by its id

[getTransactions](#extract-get-transactions-method) - Get collection of added transactions

[setStartSaldo](#extract-set-start-saldo-method) - Set the start saldo

[getStartSaldo](#extract-get-start-saldo-method) - Get the start saldo

[setEndSaldo](#extract-set-end-saldo-method) - Set extract end saldo

[getEndSaldo](#extract-get-end-saldo-method) - Get extract end saldo

[parseLine](#extract-parse-line-method) - Parse a given line of MT940 content

[toCSVString](#extract-to-csv-string-method) - Get extract information in CSV format

[setPrevious](#extract-set-previous-method) - Set the previous extract object

[previous](#extract-previous-method) - Get the previous extract object

[setNext](#extract-set-next-method) - Set the next extract object

[next](#extract-next-method) - Get the next extract object

[hasPrevious](#extract-has-previous-method) - Check if the current extract object has a previous one.

[hasNext](#extract-has-next-method) - Check if the current extract object has a next one.

## Transaction
[instance](#transaction-instance-method) - Get a new transaction object

[setId](#transaction-set-id-method) - Set transaction id

[getId](#transaction-get-id-method) - Get transaction id

[setValuta](#transaction-set-valuta-method) - Set the transaction valuta

[getValuta](#transaction-get-valuta-method) - Get the transaction valuta

[getValutaAsTimestamp](#transaction-get-valuta-as-timestamp-method) - Get transaction valuta as timestamp

[getFormattedValuta](#transaction-get-formatted-valuta-method) - Get formatted transaction valuta

[setBookingDate](#transaction-set-booking-date-method) - Set transaction booking date

[getBookingDate](#transaction-get-booking-date-method) - Get transaction booking date

[getFormattedBookingDate](#transaction-get-formatted-booking-date-method) - Get the formatted booking date

[setType](#transaction-set-type-method) - Set the transaction type

[getType](#transaction-get-type-method) - Get the transaction type

[getTypeString](#transaction-get-type-string-method) - Get the transaction type as string

[setLastCharIsoCode](#transaction-set-last-char-iso-code-method) - Set the char iso code

[getLastCharIsoCode](#transaction-get-last-char-iso-code-method) - Get the char iso code

[setAmount](#transaction-set-amount-method) - Set the transaction amount

[getAmount](#transaction-get-amount-method) - Get the transaction amount

[setBookingKey](#transaction-set-booking-key-method) - Set the transaction booking key

[getBookingKey](#transaction-get-booking-key-method) - Get the transaction booking key

[setReference](#transaction-set-reference-method) - Set transaction reference

[getReference](#transaction-get-reference-method) - Get transaction reference

[setPaymentReference](#transaction-set-payment-reference-method) - Set the transaction payment reference

[getPaymentReference](#transaction-get-payment-reference-method) - Get the transaction payment reference

[parseLine](#transaction-parse-line-method) - Parse a given line of MT940 content

[reset](#transaction-reset-method) - Reset transaction data of the object

[setPrevious](#transaction-set-previous-method) - Set the previous extract object

[previous](#transaction-previous-method) - Get the previous extract object

[setNext](#transaction-set-next-method) - Set the next extract object

[next](#transaction-next-method) - Get the next extract object

[hasPrevious](#transaction-has-previous-method) - Check if the current extract object has a previous one.

[hasNext](#transaction-has-next-method) - Check if the current extract object has a next one.

## Payment reference
[instance](#payment-reference-instance-method) - Get a new payment reference object

[setGVC](#payment-reference-set-gvc-method) - Set the GV code

[getGVC](#payment-reference-get-gvc-method) - Get the GV code

[setBookingText](#payment-reference-set-booking-text-method) - Set the booking text

[getBookingText](#payment-reference-get-booking-text-method) - Get the booking text

[setPrimanotaNumber](#payment-reference-set-primanota-number-method) - Set the primanota number

[getPrimanotaNumber](#payment-reference-get-primanota-number-method) - Get the primanota number

[setText](#payment-reference-set-text-method) - Set text

[addText](#payment-reference-add-text-method) - Add text

[getText](#payment-reference-get-text-method) - Get the whole text

[setPurchaserBIC](#payment-reference-set-purchaser-bic-method) - Set the BIC

[getPurchaserBIC](#payment-reference-get-purchaser-bic-method) - Get the BIC

[setPurchaserAccountNumber](#payment-reference-set-purchaser-account-number-method) - Set the bank account number

[getPurchaserAccountNumber](#payment-reference-get-purchaser-account-number-method) - Get the bank account number

[setAccountOwnerName](#payment-reference-set-account-owner-name-method) - Set the name of the bank account owner

[getAccountOwnerName](#payment-reference-get-account-owner-name-method) - Get the name of the bank account owner

[setTextKeyAddition](#payment-reference-set-text-key-addition-method) - Set the text key addition

[getTextKeyAddition](#payment-reference-get-text-key-addition-method) - Get the text key addition

[parseLine](#payment-reference-parse-line-method) - Parse a given line of MT940 content

[pad](#payment-reference-pad-method) - Pads a string with "0" to given size

## GVCList
[singleton](#gvc-list-singleton-method) - Get an object of the GV code list

[createCode](#gvc-list-create-code-method) - Create a new GV code object

[setCodes](#gvc-list-set-codes-method) - Set a collection of GV codes

[addCode](#gvc-list-add-code-method) - Add a GV code to the collection

[getByCodeNumber](#gvc-list-getByCodeNumber-method) - Get a specific GV code by its code number

## GVCode
[instance](#gv-code-instance-method) - Get a new GV code object

[setCode](#gv-code-set-code-method) - Set the code

[getCode](#gv-code-get-code-method) - Get the code

[setText](#gv-code-set-text-method) - Set GV code text

[getText](#gv-code-get-text-method) - Get the GV code text

[toJSON](#gv-code-to-json-method) - Get GV code information in JSON format

[setPrevious](#gv-code-set-previous-method) - Set the previous GV code object

[previous](#gv-code-previous-method) - Get the previous GV code object

[setNext](#gv-code-set-next-method) - Set the next GV code object

[next](#gv-code-next-method) - Get the next GV code object

[hasPrevious](#gv-code-has-previous-method) - Check if the current GV code object has a previous one.

[hasNext](#gv-code-has-next-method) - Check if the current GV code object has a next one.

## Saldo
[instance](#saldo-instance-method) - Get a new saldo object

[setCreditDebit](#saldo-set-credit-debit-method) - Set saldo type (credit or debit)

[getCreditDebit](#saldo-get-credit-debit-method) - Get saldo type (credit or debit)

[getCreditDebitString](#saldo-get-credit-debit-string-method) - Get saldo type as a string

[setBookingDate](#saldo-set-booking-date-method) - Set saldo booking date

[getBookingDate](#saldo-get-booking-date-method) - Get saldo booking date

[getBookingDateAsTimestamp](#saldo-get-booking-date-as-timestamp-method) - Get saldo booking date as timestamp

[getFormattedBookingDate](#saldo-get-formatted-booking-date-method) - Get saldo formatted booking date

[setCurrency](#saldo-set-currency-method) - Set the saldo currency

[getCurrency](#saldo-get-currency-method) - Get saldo currency

[setAmount](#saldo-set-amount-method) - Set the saldo amount

[getAmount](#saldo-get-amount-method) - Get the saldo amount

[parseLine](#saldo-parse-line-method) - Parse a given line of MT940 content

[pad](#saldo-pad-method) - Pads a string with "0" to given size

# MT940

<a name="constructor-method" />

**constructor(configuration)**

Instantiate a MT940 object.

___Arguments___

* `configuration` (object) - Basic configuration to parse and write bank account transactions in MT940 format.

___Example___

```js
var mt940 = require("node-mt940")({
    parser: MT940.PARSER_DEFAULT,
    writer: MT940.WRITER_DEFAULT,
    pathToContent: '...',
    writeAs: AWriter.WRITE_DEFAULT,
    pathToWrite: '...',
    gvcData: []
});
```

<a name="singleton-method" />

**singleton(configuration)**

Get a single MT940 object.

___Arguments___

* `configuration` (object) - Basic configuration to parse and write bank account transactions in MT940 format.

___Example___

```js
var mt940 = require("node-mt940").singleton({
    parser: MT940.PARSER_DEFAULT,
    writer: MT940.WRITER_DEFAULT,
    pathToContent: '...',
    writeAs: AWriter.WRITE_DEFAULT,
    pathToWrite: '...',
    gvcData: []
});
```

<a name="setConfiguration-method" />

**setConfiguration(configuration)**

Set a configuration.

___Arguments___

* `configuration` (object) - Set basic configuration to parse and write bank account transactions in MT940 format.

___Example___

```js
var mt940 = require("node-mt940").singleton().setConfiguration({
    parser: MT940.PARSER_DEFAULT,
    writer: MT940.WRITER_DEFAULT,
    pathToContent: '...',
    writeAs: AWriter.WRITE_DEFAULT,
    pathToWrite: '...',
    gvcData: []
});
```

<a name="setParser-method" />

**setParser(parser)**

Sets the parser that has to be used on parsing transactions.
The content path from configuration will be set to the parser automatically after instantiating.

___Arguments___

* `parser` (number) - Selected parser number

___Example___

```js
var mt940 = require("node-mt940").singleton({
    writer: MT940.WRITER_DEFAULT,
    pathToContent: '...',
    writeAs: AWriter.WRITE_DEFAULT,
    pathToWrite: '...',
    gvcData: []
});

mt940.setParser(MT940.PARSER_SPARKASSE);
```

<a name="setWriter-method" />

**setWriter(writer)**

Sets the writer that has to be used on writing back bank account transactions.
The target path from configuration will be set to the writer automatically after instantiating.

___Arguments___

* `writer` (number) - Selected writer number

___Example___

```js
var mt940 = require("node-mt940").singleton({
    parser: MT940.PARSER_DEFAULT,
    pathToContent: '...',
    writeAs: AWriter.WRITE_DEFAULT,
    pathToWrite: '...',
    gvcData: []
});

mt940.setWriter(MT940.WRITER_SPARKASSE);
```

<a name="setWriteAs-method" />

**setWriteAs(writeAs)**

Configure the format in which to write bank account transactions.

___Arguments___

* `writeAs` (number) - Selected write format

___Example___

```js
var mt940 = require("node-mt940").singleton({
    parser: MT940.PARSER_DEFAULT,
    writer: MT940.WRITER_DEFAULT,
    pathToContent: '...',
    pathToWrite: '...',
    gvcData: []
});

mt940.setWriteAs(AWriter.WRITE_PLAIN_TEXT);
```

<a name="parse-method" />

**parse(callback)**

Configure the format in which to write bank account transactions.

___Arguments___

* `callback` (function) - Function called when parsing finishes.

___Example___

```js
var mt940 = require("node-mt940").singleton({
    pathToContent: '...',
    pathToWrite: '...',
    gvcData: []
});
mt940
    .setParser(MT940.PARSER_SPARKASSE)
    .setWriter(MT940.WRITER_SPARKASSE)
    .setWriteAs(AWriter.WRITE_PLAIN_TEXT)
    .parse(function(error, revenues) {
        // Get back error and revenue object.
    });
```

<a name="write-method" />

**write(revenues, callback)**

Configure the format in which to write bank account transactions.

___Arguments___

* `revenues` (Revenues) - All parsed transactions as revenue object.
* `callback` (function) - Function called when parsing finishes.

___Example___

```js
var mt940 = require("node-mt940").singleton({
    pathToContent: '...',
    pathToWrite: '...',
    gvcData: []
});
mt940
    .setParser(MT940.PARSER_SPARKASSE)
    .setWriter(MT940.WRITER_SPARKASSE)
    .setWriteAs(AWriter.WRITE_PLAIN_TEXT)
    .write(revenues, function(error, mt940Object) {
        // Do some important stuff.
    });
```

<a name="getWriteStatus-method" />

**getWriteStatus()**

Get the status while writing the transactions into file.
Available status are:

  * `writing`
  * `ready`
  * `error`

Later they will trigger events.

___Arguments___

No arguments.

___Example___


```js
var mt940 = require("node-mt940").singleton({
    pathToContent: '...',
    pathToWrite: '...',
    gvcData: []
});
mt940
    .setParser(MT940.PARSER_SPARKASSE)
    .setWriter(MT940.WRITER_SPARKASSE)
    .setWriteAs(AWriter.WRITE_PLAIN_TEXT)
    .write(revenues, function(error, mt940Object) {
        // Do some important stuff.
    });

    while(mt940.getWriteStatus() === 'writing') {
        console.log('.');
    }
```

# Parser

In the beginning there is a default parser and a parser for the bank "Sparkasse". If there are more parsers in future
and more experience with them there should be a global one implemented that covers all interpretations of the MT940 
standard then this.
All defined lines of the content will be converted into well defined objects like _PaymentReference_ or _Transaction_.

<a name="set-content-method" />

**setContent(content)**

Set the content in MT940 format.

___Arguments___

* `content` (string) - Complete content that is in MT940 format and has to be parsed.

___Example___

```js
var parser = require("<node_modules>/node-mt940/src/parser/<name>.js").instance();

parser.setContent('...');
// ...
// ...
```

<a name="has-content-method" />

**hasContent()**

Check if parser has content to parse.

___Arguments___

No arguments.

___Example___

```js
var parser = require("<node_modules>/node-mt940/src/parser/<name>.js").instance();

parser.setContent('...');
// ...
// ...
parser.hasContent();
// ...
// ...
```

<a name="set-parser-file-path-method" />

**setFilePath(path)**

Set the file path with the MT940 content.

___Arguments___

* `path` (string) - Path to the file with MT940 content.

___Example___

```js
var parser = require("<node_modules>/node-mt940/src/parser/<name>.js").instance();

parser.setFilePath('...');
// ...
// ...
```

<a name="load-content-method" />

**loadContent(path, callback)**

Load the content of configured file path.

___Arguments___

* `path` (string) - Path to the file with MT940 content.
* `callback` (function) - Callback function that provides two object: 
  - `error`: Will be set when an error occured. Default is _null_.
  - `success`: Will be true when loading was successful. Otherwise it is _null_ and an error is set.

___Example___

```js
var parser = require("<node_modules>/node-mt940/src/parser/<name>.js").instance();
parser.loadContent('...', function(error, success) {
    // do some stuff.
});
// ...
// ...
```

<a name="execute-method" />

**execute(path, callback)**

Execute parsing file or set content.

___Arguments___

* `path` (string) - Path to the file with MT940 content.
* `callback` (function) - Callback function that provides two object: 
  - `error`: Will be set when an error occured. Default is _null_.
  - `revenues`: A revenue object with converted content information.

___Example___

```js
var parser = require("<node_modules>/node-mt940/src/parser/<name>.js").instance();
parser.execute('...', function(error, revenues) {
    // do some stuff with the results.
});
// ...
// ...
```

# Writer

<a name="writer-instance-method" />

**instance()**

Get a new writer instance.

___Arguments___

No arguments.

___Example___

```js
var writer = require("<node_modules>/node-mt940/src/writer/<name>.js").instance();
// ...
// ...
```

<a name="set-writer-file-path-method" />

**setFilePath(path)**

Set path to write MT940 statements to file.

___Arguments___

* `path` (string) - Path to the file.

___Example___

```js
var writer = require("<node_modules>/node-mt940/src/writer/<name>.js").instance();
writer.setFilePath('...');
// ...
// ...
```

<a name="write-plain-text-method" />

**writePlainText(revenues, callback)**

Write transactions in MT940 plain text format

___Arguments___

* `revenues` (string) - Path to the file with MT940 content.
* `callback` (function) - Callback function that provides two object: 
  - `error`: Will be set when an error occured. Default is _null_.
  - `writerObj`: A revenue object with converted content information.

___Example___

```js
var parser = require("<node_modules>/node-mt940/src/writer/<name>.js").instance();
writer.setFilePath('...');
writer.writePlainText(revenues, function(error, writerObj) {
    // do some stuff with the results.
});
// ...
// ...
```

<a name="write-xml-method" />

**writeXML(revenues, callback)**

Write transactions in MT940 XML format.

___Arguments___

* `revenues` (string) - Path to the file with MT940 content.
* `callback` (function) - Callback function that provides two object: 
  - `error`: Will be set when an error occured. Default is _null_.
  - `writerObj`: A revenue object with converted content information.

___Example___

```js
var parser = require("<node_modules>/node-mt940/src/writer/<name>.js").instance();
writer.setFilePath('...');
writer.writeXML(revenues, function(error, writerObj) {
    // do some stuff with the results.
});
// ...
// ...
```

<a name="write-csv-method" />

**writeCSV(revenues, callback)**

Write statements in MT940 in CSV format.

___Arguments___

* `revenues` (string) - Path to the file with MT940 content.
* `callback` (function) - Callback function that provides two object: 
  - `error`: Will be set when an error occured. Default is _null_.
  - `writerObj`: A revenue object with converted content information.

___Example___

```js
var parser = require("<node_modules>/node-mt940/src/writer/<name>.js").instance();
writer.setFilePath('...');
writer.writeCSV(revenues, function(error, writerObj) {
    // do some stuff with the results.
});
// ...
// ...
```

# Revenue


<a name="revenue-instance-method" />

**instance()**

Get a new revenue object.

___Arguments___

No arguments.

___Example___

```js
var revenue = require("<node_modules>/node-mt940/src/object/Revenue.js").instance();
// ...
// ...
```

<a name="set-reference-number-method" />

**setReferenceNumber(number)**

Set the revenue reference number.

___Arguments___

* `number` (string) - The reference number.

___Example___

```js
var revenue = require("<node_modules>/node-mt940/src/object/Revenue.js").instance();
revenue.setReferenceNumber('...');
// ...
// ...
```

<a name="get-reference-number-method" />

**getReferenceNumber()**

Get the revenue reference number.

___Arguments___

No arguments.

___Example___

```js
var revenue = require("<node_modules>/node-mt940/src/object/Revenue.js").instance().setReferenceNumber('...')
  , referenceNumber = revenue.getReferenceNumber();
// ...
// ...
```

<a name="revenue-set-bank-code-method" />

**setBankCode(bankCode)**

Set bank code of account.

___Arguments___

* `bankCode` (string) - The code to be set.

___Example___

```js
var revenue = require("<node_modules>/node-mt940/src/object/Revenue.js").instance();
revenue.setBankCode('...');
// ...
// ...
```

<a name="revenue-get-bank-code-method" />

**getBankCode()**

Get bank code of account.

___Arguments___

No arguments.

___Example___

```js
var revenue = require("<node_modules>/node-mt940/src/object/Revenue.js").instance().setBankCode('...')
  , bankCode = revenue.getBankCode();
// ...
// ...
```

<a name="revenue-set-account-number-method" />

**setAccountNumber(accountNumber)**

Set the bank account number.

___Arguments___

* `accountNumber` (string) - The bank account number.

___Example___

```js
var revenue = require("<node_modules>/node-mt940/src/object/Revenue.js").instance();
revenue.setAccountNumber('...');
// ...
// ...
```

<a name="revenue-get-account-number-method" />

**getAccountNumber()**

Get the bank account number.

___Arguments___

No arguments.

___Example___

```js
var revenue = require("<node_modules>/node-mt940/src/object/Revenue.js").instance().setAccountNumber('...')
  , bankAccountNumber = revenue.getAccountNumber();
// ...
// ...
```

<a name="set-extracts-method" />

**setExtracts(extractList)**

Set collection of extracts (single statement block).

___Arguments___

* `extractList` (LinkedList) - A list with all parsed MT940 statement objects.

___Example___

```js
var LinkedList = require('node-linkedlist')
  , revenue = require("<node_modules>/node-mt940/src/object/Revenue.js").instance()
  , extract = require("<node_modules>/node-mt940/src/object/Extract.js").instance()
  , statements = LinkedList.Create(extract);

// do some stuff here ...
// ...
revenue.setExtracts(statements);
// ...
// ...
```

<a name="add-extract-method" />

**addExtract(extract, callback)**

Add single extract to extract collection.

___Arguments___

* `extractList` (LinkedList) - A list with all parsed MT940 statement objects.
* `callback` (function) - Callback function that provides two object: 
  - `error`: Will be set when an error occured. Default is _null_.
  - `extractList`: The linked list with all available statements added to it.

___Example___

```js
var LinkedList = require('node-linkedlist')
  , revenue = require("<node_modules>/node-mt940/src/object/Revenue.js").instance()
  , extract = require("<node_modules>/node-mt940/src/object/Extract.js").instance();

// do some stuff here ...
// ...
revenue.addExtract(extract, function(error, statementList) {
    // do some other stuff here with the list.
});

// ...
// ...
```

<a name="get-extracts-method" />

**getExtracts()**

Get collection of extracts.

___Arguments___

No arguments.

___Example___

```js
var LinkedList = require('node-linkedlist')
  , revenue = require("<node_modules>/node-mt940/src/object/Revenue.js").instance()
  , extract = require("<node_modules>/node-mt940/src/object/Extract.js").instance();

// do some stuff here ...
// ...

revenue.addExtract(extract, function(error, statementList) {
    // do some other stuff here with the list.
});
// Linked list of statements.
var statementList = revenue.getExtracts();
// ...
// ...
```

# Extract

<a name="extract-instance-method" />

**instance()**

Get a new extract object.

___Arguments___

No arguments.

___Return___

- `Extract` - The extract object.

<a name="extract-set-bank-code-method" />

**setBankCode(bankCode)**

Set bank code of account.

___Arguments___

* `bankCode` (string) - The code of the bank account.

___Return___

- `Extract` - The extract object.

<a name="extract-get-bank-code-method" />

**getBankCode()**

Get bank code of account.

___Arguments___

No argument.

___Return___

- `string` - The account code.

<a name="extract-set-account-number-method" />

**setAccountNumber(accountNumber)**

Set bank account number.

___Arguments___

* `accountNumber` (string) - The number of the bank account.

___Return___

- `Extract` - The extract object.

<a name="extract-get-account-number-method" />

**getAccountNumber()**

Get bank account number.

___Arguments___

No argument.

___Return___

- `string` - The number of the bank account.

<a name="extract-set-number-method" />

**setNumber(number)**

Set extract number.

___Arguments___

* `number` (string) - The number of the statement.

___Return___

- `Extract` - The extract object.

<a name="extract-get-number-method" />

**getNumber()**

Get extract number.

___Arguments___

No argument.

___Return___

- `string` - The number of the extract.

<a name="extract-set-sheet-number-method" />

**setSheetNumber(number)**

Set sheet number.

___Arguments___

* `number` (string) - The sheet number where the statement is located.

___Return___

- `Extract` - The extract object.

<a name="extract-get-sheet-number-method" />

**getSheetNumber()**

Get sheet number.

___Arguments___

No argument.

___Return___

- `string` - The sheet number of the extract.

<a name="extract-add-transaction-method" />

**addTransaction(transaction, callback)**

Add a transaction to the extract.

___Arguments___

* `transaction` (Transaction) - A transaction object with information about one transaction in the statement.
* `callback` (function) - The function get two parameters:
  - error: Will be set if an error occurs. If not the parameter is _null_.
  - list: A reference to the transaction list where the transaction was added.
  
___Return___

- `Extract` - The extract object.

<a name="extract-get-transaction-by-id-method" />

**getTransactionById(id, callback)**

Get a specific transaction by its id.

___Arguments___

* `id` (number) - The transaction id. 
* `callback` (function) - The function get two parameters:
  - error: Will be set if an error occurs. If not the parameter is _null_.
  - transaction: A reference to the transaction with given id. 

___Return___

- `Transaction` - The transaction object.

<a name="extract-get-transactions-method" />

**getTransactions()**

Get list of all extract transactions.

___Arguments___

No argument.

___Return___

- `LinkedList` - The transaction list.

<a name="extract-set-start-saldo-method" />

**setStartSaldo(saldo)**

Set the start saldo.

___Arguments___

* `saldo` (Saldo) - The transaction start saldo object.

___Return___

- `Extract` - The extract object.

<a name="extract-get-start-saldo-method" />

**getStartSaldo()**

Get the start saldo.

___Arguments___

No argument.

___Return___

- `Saldo` - The saldo object with amount before transactions calculated.

<a name="extract-set-end-saldo-method" />

**setEndSaldo(saldo)**

Set extract end saldo.

___Arguments___

* `saldo` (Saldo) - The transaction end saldo object.

___Return___

- `Extract` - The extract object.

<a name="extract-get-end-saldo-method" />

**getEndSaldo()**

Get extract end saldo.

___Arguments___

No argument.

___Return___

- `Saldo` - The saldo object with amount after transactions calculated.

<a name="extract-parse-line-method" />

**parseLine(line)**

Parse a given line of MT940 content.

___Arguments___

* `line` (string) - The string that has to be padded.

___Return___

- `Extract` - The extract object itself.

<a name="extract-to-csv-string-method" />

**toCSVString()**

Get extract information in CSV format.

___Arguments___

No arguments.

___Return___

- `string` - The extract information formatted with CSV format.

<a name="transaction-set-previous-method" />

**setPrevious(previousNode)**

Set the previous extract object.

___Arguments___

* `previousNode` (Extract) - A extract object as previous node.

___Return___

- `Extract` - The previous object reference of the linked list.

<a name="extract-previous-method" />

**previous()**

Get the previous extract object.

___Arguments___

No arguments.

___Return___

- `Extract` - The previous object reference of the linked list.

<a name="extract-set-next-method" />

**setNext(nextNode)**

Set the next extract object.

___Arguments___

* `nextNode` (Extract) - A extract object as next node.

___Return___

- `Extract` - The previous object reference of the linked list.

<a name="extract-next-method" />

**next()**

Get the next extract object.

___Arguments___

No arguments.

___Return___

- `Extract` - The next object reference of the linked list.

<a name="extract-has-previous-method" />

**hasPrevious()**

Check if the current extract object has a previous one.

___Arguments___

No arguments.

___Return___

- `boolean`

<a name="extract-has-next-method" />

**hasNext()**

Check if the current extract object has a next one.

___Arguments___

No arguments.

___Return___

- `boolean`

# Transaction

<a name="transaction-instance-method" />

**instance()**

Get a new transaction object.

___Arguments___

No arguments.

___Return___

- `Transaction` - The transaction object.

<a name="transaction-set-id-method" />

**setId(id)**

Set transaction id.

___Arguments___

* `id` (number) - The transaction id.

___Return___

- `Transaction` - The transaction object itself.

<a name="transaction-get-id-method" />

**getId()**

Get transaction id.

___Arguments___

No arguments.

___Return___

- `number` - The transaction id.

<a name="transaction-set-valuta-method" />

**setValuta(dateTime)**

Set transaction valuta date.

___Arguments___

* `dateTime` (number) - The transaction valuta date.

___Return___

- `Transaction` - The transaction object itself.

<a name="transaction-get-valuta-method" />

**getValuta()**

Get the transaction valuta.

___Arguments___

No arguments.

___Return___

- `Date` - The transaction valuta date. If assigned date was not valid the method returns _null_.

<a name="transaction-get-valuta-as-timestamp-method" />

**getValutaAsTimestamp()**

Get transaction valuta as timestamp.

___Arguments___

No arguments.

___Return___

- `number` - The valuta date converted into timestamp.

<a name="transaction-get-formatted-valuta-method" />

**getFormattedValuta()**

Get formatted transaction valuta.

___Arguments___

No arguments.

___Return___

- `string` - The formatted valuta date. The date format is: "mmdd".

<a name="transaction-set-booking-date-method" />

**setBookingDate(dateTime)**

Set transaction booking date.

___Arguments___

* `dateTime` (number) - The transaction booking date.

___Return___

- `Transaction` - The transaction object itself.

<a name="transaction-get-booking-date-method" />

**getBookingDate()**

Get transaction booking date.

___Arguments___

No arguments.

___Return___

- `Date` - The transaction booking date. If assigned date was not valid the method returns _null_.

<a name="transaction-get-formatted-booking-date-method" />

**getFormattedBookingDate()**

Get the formatted booking date.

___Arguments___

No arguments.

___Return___

- `string` - The formatted date. The format is: "YYmmdd".

<a name="transaction-set-type-method" />

**setType(type)**

Set the transaction type.

___Arguments___

* `type` (string) - The transaction type.

___Return___

- `Transaction` - The transaction object itself.

<a name="transaction-get-type-method" />

**getType()**

Get the transaction type. The possible four types are:

- 'C' (_Transaction.TYPE_CREDIT_)
- 'D' (_Transaction.TYPE_DEBIT_)
- 'RC' (_Transaction.TYPE_CREDIT_STORNO_)
- 'RD' (_Transaction.TYPE_DEBIT_STORNO_)

___Arguments___

No arguments.

___Return___

- `string` - The transaction type.

<a name="transaction-get-type-string-method" />

**getTypeString()** (_deprecated_)

Get the transaction type as string. The possible four types are:

- 'C' (_Transaction.TYPE_CREDIT_)
- 'D' (_Transaction.TYPE_DEBIT_)
- 'RC' (_Transaction.TYPE_CREDIT_STORNO_)
- 'RD' (_Transaction.TYPE_DEBIT_STORNO_)

___Arguments___

No arguments.

___Return___

- `string` - The transaction type as string.

<a name="transaction-set-last-char-iso-code-method" />

**setLastCharIsoCode(char)**

Set the last char of the transaction iso code.

___Arguments___

* `char` (string) - The last iso code char.

___Return___

- `Transaction` - The transaction object itself.

<a name="transaction-get-last-char-iso-code-method" />

**getLastCharIsoCode()**

Get the last char of the iso code.

___Arguments___

No arguments.

___Return___

- `string` - The last char of the transaction iso code.

<a name="transaction-set-amount-method" />

**setAmount(amount)**

Set the transaction amount.

___Arguments___

* `amount` (number) - The transaction amount. Mostly it will be a float type.

___Return___

- `Transaction` - The transaction object itself.

<a name="transaction-get-amount-method" />

**getAmount()**

Get the transaction amount.

___Arguments___

No arguments.

___Return___

- `number` - The amount of the transaction.

<a name="transaction-set-booking-key-method" />

**setBookingKey(key)**

Set the transaction booking key.

___Arguments___

* `key` (string) - The transaction booking key.

___Return___

- `Transaction` - The transaction object itself.

<a name="transaction-get-booking-key-method" />

**getBookingKey()**

Get the transaction booking key.

___Arguments___

No arguments.

___Return___

- `string` - The transaction booking key.

<a name="transaction-set-reference-method" />

**setReference(reference)**

Set transaction reference.

___Arguments___

* `reference` (string) - The transaction reference.

___Return___

- `Transaction` - The transaction object itself.

<a name="transaction-get-reference-method" />

**getReference()**

Get transaction reference.

___Arguments___

No arguments.

___Return___

- `string` - The transaction reference.

<a name="transaction-set-payment-reference-method" />

**setPaymentReference(paymentReference)**

Set the transaction payment reference.

___Arguments___

* `paymentReference` (PaymentReference) - An object of type _PaymentReference_.

___Return___

- `Transaction` - The transaction object itself.

<a name="transaction-get-payment-reference-method" />

**getPaymentReference()**

Get the transaction payment reference.

___Arguments___

No arguments.

___Return___

- `PaymentReference` - The transaction payment reference object.

<a name="transaction-parse-line-method" />

**parseLine(line)**

Parse a given line of MT940 content.

___Arguments___

* `line` (string) - The string that has to be padded.

___Return___

- `Transaction` - The transaction object itself.

<a name="transaction-reset-method" />

**reset()**

Reset transaction data of the object.

___Arguments___

No arguments.

___Return___

- `Transaction` - The transaction object itself.

<a name="transaction-set-previous-method" />

**setPrevious(previousNode)**

Set the previous transaction object.

___Arguments___

* `previousNode` (Transaction) - A transaction object as previous node.

___Return___

- `Transaction` - The previous object reference of the linked list.

<a name="transaction-previous-method" />

**previous()**

Get the previous transaction object.

___Arguments___

No arguments.

___Return___

- `Transaction` - The previous object reference of the linked list.

<a name="transaction-set-next-method" />

**setNext(nextNode)**

Set the next extract object.

___Arguments___

* `nextNode` (Transaction) - A transaction object as next node.

___Return___

- `Transaction` - The previous object reference of the linked list.

<a name="transaction-next-method" />

**next()**

Get the next transaction object.

___Arguments___

No arguments.

___Return___

- `Transaction` - The next object reference of the linked list.

<a name="transaction-has-previous-method" />

**hasPrevious()**

Check if the current transaction object has a previous one.

___Arguments___

No arguments.

___Return___

- `boolean`

<a name="transaction-has-next-method" />

**hasNext()**

Check if the current transaction object has a next one.

___Arguments___

No arguments.

___Return___

- `boolean`

# Payment reference

<a name="payment-reference-instance-method" />

**instance()**

Get a new payment reference object.

___Arguments___

No arguments.

___Return___

- `PaymentReference` - The payment reference object.

<a name="payment-reference-set-gvc-method" />

**setGVC(gvc, check)**

Set the GV code.

___Arguments___

* `gvc` (string) - The GC code.
* `check` (boolean) - If set to _true_ it checks the GV code in internal list of GV codes. If the check fails the GV code is not set. Default is _false_. 

___Return___

- `PaymentReference` - The payment reference object itself.

<a name="payment-reference-get-gvc-method" />

**getGVC()**

Get the GV code.

___Arguments___

No arguments.

___Return___

- `string` - The GVC of the payment reference.

<a name="payment-reference-set-booking-text-method" />

**setBookingText(text)**

Set the booking text.

___Arguments___

* `text` (string) - The booking text.

___Return___

- `PaymentReference` - The payment reference object itself.

<a name="payment-reference-get-booking-text-method" />

**getBookingText()**

Get the booking text.

___Arguments___

No arguments.

___Return___

- `string` - The payment reference booking text.

<a name="payment-reference-set-primanota-number-method" />

**setPrimanotaNumber(number)**

Set the primanota number.

___Arguments___

* `number` (string) - The primanota number.

___Return___

- `PaymentReference` - The payment reference object itself.

<a name="payment-reference-get-primanota-number-method" />

**getPrimanotaNumber()**

Get the primanota number.

___Arguments___

No arguments.

___Return___

- `string` - The primanota number.

<a name="payment-reference-set-text-method" />

**setText(text)**

Set whole payment reference text.

___Arguments___

* `text` (string) - The whole text.

___Return___

- `PaymentReference` - The payment reference object itself.

<a name="payment-reference-add-text-method" />

**addText(text)**

Add text.

___Arguments___

* `text` (string) - Part of the whole text.

___Return___

- `PaymentReference` - The payment reference object itself.

<a name="payment-reference-get-text-method" />

**getText()**

Get the whole payment reference text.

___Arguments___

No arguments.

___Return___

- `string` - The payment reference text.

<a name="payment-reference-set-purchaser-bic-method" />

**setPurchaserBIC(bic)**

Set the BIC information.

___Arguments___

* `bic` (string) - The BIC information.

___Return___

- `PaymentReference` - The payment reference object itself.

<a name="payment-reference-get-purchaser-bic-method" />

**getPurchaserBIC()**

Get the BIC information.

___Arguments___

No arguments.

___Return___

- `string` - The BIC information of the bank account.

<a name="payment-reference-set-purchaser-account-number-method" />

**setPurchaserAccountNumber(accountNumber)**

Set the bank account number.

___Arguments___

* `accountNumber` (string) - The number of the bank account.

___Return___

- `PaymentReference` - The payment reference object itself.

<a name="payment-reference-get-purchaser-account-number-method" />

**getPurchaserAccountNumber()**

Get the bank account number.

___Arguments___

No arguments.

___Return___

- `string` - The number of the bank account.

<a name="payment-reference-set-account-owner-name-method" />

**setAccountOwnerName(name)**

Set the name of the bank account owner.

___Arguments___

* `name` (string) - The name of the bank account owner.

___Return___

- `PaymentReference` - The payment reference object itself.

<a name="payment-reference-get-account-owner-name-method" />

**getAccountOwnerName()**

Get the name of the bank account owner.

___Arguments___

No arguments.

___Return___

- `string` - The name of the bank account owner who get or send the amount.

<a name="payment-reference-set-text-key-addition-method" />

**setTextKeyAddition(keyAddition)**

Set the text key addition.

___Arguments___

* `keyAddition` (string) - The key addition.

___Return___

- `PaymentReference` - The payment reference object itself.

<a name="payment-reference-get-text-key-addition-method" />

**getTextKeyAddition()**

Get the text key addition.

___Arguments___

No arguments.

___Return___

- `string` - The key addition.

<a name="payment-reference-parse-line-method" />

**parseLine(line)**

Parse a given line of MT940 content.

___Arguments___

* `line` (string) - The string that has to be padded.

___Return___

- `PaymentReference` - The payment reference object itself.

<a name="payment-reference-pad-method" />

**pad(string, size)**

Pads a string with "0" to given size.

___Arguments___

* `string` (string) - The string that has to be padded.
* `size` (number) - Number of characters.

___Example___

```js
var paymentReference = require("<node_modules>/node-mt940/src/object/PaymentReference.js").instance();

// do some stuff here ...
// ...
var name = 'Hello';
name = paymentReference.pad(name, 8);
// Name should be now '000Hello'

```

___Return___

- `string` - The padded string.

# GVCList

<a name="gvc-list-singleton-method" />

**singleton()**

Get an object of the GVCList.

___Arguments___

No arguments.

___Return___

- `GVCList`

<a name="gvc-list-create-code-method" />

**createCode(code, text)**

Create a new GV code object.

___Arguments___

* `code` (string) - A specific code.
* `text` (string) - The code text.

___Return___

- `GVCode`

<a name="gvc-list-set-codes-method" />

**setCodes(codes, callback)**

Set a collection of GV codes.

___Arguments___

* `codes` (string) - A linked list of GVCodes.
* `callback` (function) - The callback function that gets the list of GVCodes or an error.

___Return___

- `void`

<a name="gvc-list-add-code-method" />

**addCode(code, callback)**

Add a GVCode to the list.

___Arguments___

* `code` (string) - A specific code.
* `callback` (function) - The callback function that gets the list of GVCodes or an error.

___Return___

- `void`

<a name="gvc-list-getByCodeNumber-method" />

**getByCodeNumber(number)**

Get a specific GVCode object by its code.

___Arguments___

* `number` (string) - A specific code.

___Return___

- `GVCode`

# GVCode

<a name="gv-code-instance-method" />

**instance()**

Get a new GV code object.

___Arguments___

No arguments.

___Return___

- `GVCode` - A new object instance.

<a name="gv-code-set-code-method" />

**setCode(code)**

Set the code itself.

___Arguments___

* `code` (string) - The code information of the GVC.

___Return___

- `GVCode` - The object reference.

<a name="gv-code-get-code-method" />

**getCode()**

Get the code.

___Arguments___

No arguments.

___Return___

- `string` - The GVCode information (the code itself).

<a name="gv-code-set-text-method" />

**setText(text)**

Set GV code text.

___Arguments___

* `text` (string) - The text of the GVC.

___Return___

- `GVCode` - The object reference.

<a name="gv-code-get-text-method" />

**getText()**

Get the GV code text.

___Arguments___

No arguments.

___Return___

- `string` - The GVCode text information.

<a name="gv-code-to-json-method" />

**toJSON()**

Get GV code information in JSON format.

___Arguments___

No arguments.

___Return___

- `object` - The GVCode information converted to a literal object.

<a name="gv-code-set-previous-method" />

**setPrevious(previousNode)**

Set the previous GV code object.

___Arguments___

* `previousNode` (GVCode) - A GVCode object as previous node.

___Return___

- `GVCode` - The previous object reference of the linked list.

<a name="gv-code-previous-method" />

**previous()**

Get the previous GV code object.

___Arguments___

No arguments.

___Return___

- `GVCode` - The previous object reference of the linked list.

<a name="gv-code-set-next-method" />

**setNext(nextNode)**

Set the next GV code object.

___Arguments___

* `nextNode` (GVCode) - A GVCode object as next node.

___Return___

- `GVCode` - The previous object reference of the linked list.

<a name="gv-code-next-method" />

**next()**

Get the next GV code object.

___Arguments___

No arguments.

___Return___

- `GVCode` - The next object reference of the linked list.

<a name="gv-code-has-previous-method" />

**hasPrevious()**

Check if the current GV code object has a previous one.

___Arguments___

No arguments.

___Return___

- `boolean`

<a name="gv-code-has-next-method" />

**hasNext()**

Check if the current GV code object has a next one.

___Arguments___

No arguments.

___Return___

- `boolean`

# Saldo

<a name="saldo-instance-method" />

**instance()**

Get a new saldo object.

___Arguments___

No arguments.

___Return___

- `Saldo` - The saldo object.

<a name="saldo-set-credit-debit-method" />

**setCreditDebit(value)**

Set the saldo type (credit or debit). Available types are: 
- ___Saldo.TYPE_CREDIT___ 
- ___Saldo.TYPE_DEBIT___

___Arguments___

* `value` (number) - The saldo type (credit or debit).

___Return___

- `Saldo` - The saldo object.

<a name="saldo-get-credit-debit-method" />

**getCreditDebit()**

Get saldo type (credit or debit). The mapping for the types is: 1 => "**Credit**'", 2 => "**Debit**"

___Arguments___

No arguments.

___Return___

- `number` - The internal type number for the saldo type.

<a name="saldo-get-credit-debit-string-method" />

**getCreditDebitString()**

Get saldo type as a string. The possible standard types are "C" for credit and "D" for debit.

___Arguments___

No arguments.

___Return___

- `string` - The saldo type.

<a name="saldo-set-booking-date-method" />

**setBookingDate(bookingDate)**

Set saldo booking date. The incoming date format is "YYmmdd". This is parsed and converted into a 
JavaScript date object.

___Arguments___

* `bookingDate` (string) - The saldo booking date.

___Return___

- `Saldo` - The saldo object.

<a name="saldo-get-booking-date-method" />

**getBookingDate()**

Get saldo booking date.

___Arguments___

No arguments.

___Return___

- `Date` - The JavaScript Date object.

<a name="saldo-get-booking-date-as-timestamp-method" />

**getBookingDateAsTimestamp()**

Get saldo booking date as timestamp

___Arguments___

No arguments.

___Return___

- `number` - The saldo booking date converted to timestamp.

<a name="saldo-get-formatted-booking-date-method" />

**getFormattedBookingDate()**

Get saldo formatted booking date

___Arguments___

No arguments.

___Return___

- `string` - The formatted date of the saldo booking. Format is "YYmmdd". So as value like '130213'.

<a name="saldo-set-currency-method" />

**setCurrency(currency)**

Set the saldo currency

___Arguments___

* `currency` (string) - The saldo currency.

___Return___

- `Saldo` - The saldo object.

<a name="saldo-get-currency-method" />

**getCurrency()**

Get saldo currency

___Arguments___

No arguments.

___Return___

- `string` - The currency of the current saldo.

<a name="saldo-set-amount-method" />

**setAmount(amount)**

Set the saldo amount.

___Arguments___

* `amount` (number) - The amount of the saldo line.

___Return___

- `Saldo` - The saldo object.

<a name="saldo-get-amount-method" />

**getAmount()**

Get the saldo amount.

___Arguments___

No arguments.

___Return___

- `number` - The saldo amount. This could also be a float number.

<a name="saldo-parse-line-method" />

**parseLine(line)**

Parse a given line of MT940 content.

___Arguments___

* `line` (string) - The string that has to be padded.

___Return___

- `Saldo` - The saldo object itself.

<a name="saldo-pad-method" />

**pad(string, size)**

Pads a string with "0" to given size.

___Arguments___

* `string` (string) - The string that has to be padded.
* `size` (number) - Number of characters.

___Example___

```js
var saldo = require("<node_modules>/node-mt940/src/object/Saldo.js").instance();

// do some stuff here ...
// ...
var name = 'Hello';
name = saldo.pad(name, 8);
// Name should be now '000Hello'

```

___Return___

- `string` - The padded string.