# MT940
This module parses files with bank account transactions in format MT940.

# Documentation

## Installation

```
  npm install --save node-mt940
```

## MT940

[constructor](#constructor-method) - --

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

___Argument___

* `configuration` (object) - Basic configuration to parse and write bank account transactions in MT940 format.

__Example__

```js
var mt940 = require("neo4jquery")({
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

___Argument___

* `configuration` (object) - Basic configuration to parse and write bank account transactions in MT940 format.

__Example__

```js
var mt940 = require("neo4jquery").singleton({
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

___Argument___

* `configuration` (object) - Set basic configuration to parse and write bank account transactions in MT940 format.

__Example__

```js
var mt940 = require("neo4jquery").singleton().setConfiguration({
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

___Argument___

* `parser` (number) - Selected parser number

__Example__

```js
var mt940 = require("neo4jquery").singleton({
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

___Argument___

* `writer` (number) - Selected writer number

__Example__

```js
var mt940 = require("neo4jquery").singleton({
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

___Argument___

* `writeAs` (number) - Selected write format

__Example__

```js
var mt940 = require("neo4jquery").singleton({
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

___Argument___

* `callback` (function) - Function called when parsing finishes.

__Example__

```js
var mt940 = require("neo4jquery").singleton({
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

___Argument___

* `revenues` (Revenues) - All parsed transactions as revenue object.
* `callback` (function) - Function called when parsing finishes.

__Example__

```js
var mt940 = require("neo4jquery").singleton({
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

___Argument___


__Example__


```js
var mt940 = require("neo4jquery").singleton({
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

# Writer

# Revenue

# Extract

# Transaction

# Payment reference

# GVCList

# GVCode

# Saldo
