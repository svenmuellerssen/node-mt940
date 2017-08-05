# MT940
This module parses files with bank account transactions in format MT940.

# Documentation


## Installation

```
  npm install --save node-mt940
```

## MT940

<a name="constructor" />
### constructor(configuration)

Instantiate a MT940 object.

___Argument___

* `configuration` (object) - Basic configuration to parse and write bank account transactions in MT940 format.

__Example__

```javascript
var mt940 = require("neo4jquery")({
    parser: MT940.PARSER_DEFAULT,
    writer: MT940.WRITER_DEFAULT,
    pathToContent: '...',
    writeAs: AWriter.WRITE_DEFAULT,
    pathToWrite: '...',
    gvcData: []
});
```

<a name="singleton" />
### singleton(configuration)

Get a single MT940 object.

___Argument___

* `configuration` (object) - Basic configuration to parse and write bank account transactions in MT940 format.

__Example__

```javascript
var mt940 = require("neo4jquery").singleton({
    parser: MT940.PARSER_DEFAULT,
    writer: MT940.WRITER_DEFAULT,
    pathToContent: '...',
    writeAs: AWriter.WRITE_DEFAULT,
    pathToWrite: '...',
    gvcData: []
});
```

<a name="setConfiguration" />
### setConfiguration(configuration)

Set a configuration.

___Argument___

* `configuration` (object) - Set basic configuration to parse and write bank account transactions in MT940 format.

__Example__

```javascript
var mt940 = require("neo4jquery").singleton().setConfiguration({
    parser: MT940.PARSER_DEFAULT,
    writer: MT940.WRITER_DEFAULT,
    pathToContent: '...',
    writeAs: AWriter.WRITE_DEFAULT,
    pathToWrite: '...',
    gvcData: []
});
```

<a name="setParser" />
### setParser(parser)

Sets the parser that has to be used on parsing transactions.
The content path from configuration will be set to the parser automatically after instantiating.

___Argument___

* `parser` (number) - Selected parser number

__Example__

```javascript
var mt940 = require("neo4jquery").singleton({
    writer: MT940.WRITER_DEFAULT,
    pathToContent: '...',
    writeAs: AWriter.WRITE_DEFAULT,
    pathToWrite: '...',
    gvcData: []
});

mt940.setParser(MT940.PARSER_SPARKASSE);
```

<a name="setWriter" />
### setWriter(writer)

Sets the writer that has to be used on writing back bank account transactions.
The target path from configuration will be set to the writer automatically after instantiating.

___Argument___

* `writer` (number) - Selected writer number

__Example__

```javascript
var mt940 = require("neo4jquery").singleton({
    parser: MT940.PARSER_DEFAULT,
    pathToContent: '...',
    writeAs: AWriter.WRITE_DEFAULT,
    pathToWrite: '...',
    gvcData: []
});

mt940.setWriter(MT940.WRITER_SPARKASSE);
```

<a name="setWriteAs" />
### setWriteAs(writeAs)

Configure the format in which to write bank account transactions.

___Argument___

* `writeAs` (number) - Selected write format

__Example__

```javascript
var mt940 = require("neo4jquery").singleton({
    parser: MT940.PARSER_DEFAULT,
    writer: MT940.WRITER_DEFAULT,
    pathToContent: '...',
    pathToWrite: '...',
    gvcData: []
});

mt940.setWriteAs(AWriter.WRITE_PLAIN_TEXT);
```

<a name="parse" />
### parse(callback)

Configure the format in which to write bank account transactions.

___Argument___

* `callback` (function) - Function called when parsing finishes.

__Example__

```javascript
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

<a name="write" />
### write(revenues, callback)

Configure the format in which to write bank account transactions.

___Argument___

* `revenues` (Revenues) - All parsed transactions as revenue object.
* `callback` (function) - Function called when parsing finishes.

__Example__

```javascript
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

<a name="getWriteStatus" />
### getWriteStatus()

Get the status while writing the transactions into file.
Available status are:

  * `writing`
  * `ready`
  * `error`

Later they will trigger events.

___Argument___


__Example__


```javascript
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
