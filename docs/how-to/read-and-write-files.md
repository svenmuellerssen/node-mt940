# How to read and write files

All examples use the class `MT940`. Its options and errors are listed in the
[reference](../reference/mt940-class.md). The examples are JavaScript, in TypeScript use `import` instead of `require`.

## Read a file

```js
const { MT940 } = require('node-mt940');

const statement = await new MT940({ pathToContent: 'umsatz.sta' }).parse();
```

`parse()` returns a Promise of a [`Statement`](../reference/statement.md).

## Convert a file to CSV

```js
const { MT940 } = require('node-mt940');

const statement = await new MT940({ pathToContent: 'umsatz.sta' }).parse();
await new MT940({ pathToWrite: 'umsatz.csv', writeAs: 'csv' }).write(statement);
```

An existing `umsatz.csv` is replaced. You can use one object for both steps, because the options are independent:

```js
const mt940 = new MT940({ pathToContent: 'umsatz.sta', pathToWrite: 'umsatz.csv', writeAs: 'csv' });
await mt940.write(await mt940.parse());
```

## Write a statement as MT940

`'mt940'` is the default format:

```js
await new MT940({ pathToWrite: 'out.sta' }).write(statement);
```

The text can be read again with `parse()` and gives the same extracts.

## Stop at the first warning

Without `strict` the parser reads everything it can and lists what it ignored or guessed in `statement.warnings`.
With `strict: true` the first warning rejects `parse()` with a `ParseError`:

```js
const statement = await new MT940({ pathToContent: 'umsatz.sta', strict: true }).parse();
```

See [Handle warnings and errors](handle-warnings-and-errors.md) for what to do with the warnings.

## Parse text that is not in a file

If you already have the text (a download, a database column), use the function instead of the class. No file is
involved, and the call is synchronous:

```js
const { parseStatement } = require('node-mt940');

const statement = parseStatement(text);
```

## Format a statement without writing a file

```js
const { formatStatement } = require('node-mt940');

const csv = formatStatement(statement, 'csv');   // or 'mt940'
```

## Limits

- Files are read and written as UTF-8. Files in another encoding (for example ISO-8859-1) are not supported yet, umlauts
  in them would be read wrongly. Convert such a file first.
- There is no XML format. `formatStatement(statement, 'xml')` and `writeAs: 'xml'` are errors.
