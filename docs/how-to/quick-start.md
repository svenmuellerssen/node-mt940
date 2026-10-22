# Quick start: the common uses at a glance

Short recipes for what you can do with node-mt940. Every recipe links to the page with the details. If you have never
used the library, the [tutorial](../tutorials/getting-started.md) is the better start.

The examples are JavaScript. In TypeScript use `import { ... } from 'node-mt940'` instead of `require`. Needs Node.js 18
or newer.

```
npm install --save node-mt940    # or: pnpm add node-mt940
```

## Parse MT940 text

```js
const { parseStatement } = require('node-mt940');

const statement = parseStatement(text);
statement.extracts[0].transactions[0].amountCents;   // 1499
```

More: [`parseStatement`](../reference/parse-statement.md), [The statement](../reference/statement.md).

## Read an MT940 file

```js
const { MT940 } = require('node-mt940');

const statement = await new MT940({ pathToContent: 'umsatz.sta' }).parse();
```

More: [Read and write files](read-and-write-files.md).

## Convert a file to CSV

```js
const mt940 = new MT940({ pathToContent: 'umsatz.sta', pathToWrite: 'umsatz.csv', writeAs: 'csv' });
await mt940.write(await mt940.parse());
```

More: [`formatStatement`](../reference/format-statement.md) for the columns.

## Get CSV or MT940 as text

```js
const { formatStatement } = require('node-mt940');

const csv = formatStatement(statement, 'csv');
const mt940 = formatStatement(statement, 'mt940');
```

## Write a statement as MT940 file

```js
await new MT940({ pathToWrite: 'out.sta' }).write(statement);
```

## Check what the parser ignored

```js
const statement = parseStatement(text);
statement.warnings;                       // [] for a clean statement

parseStatement(text, { strict: true });   // throws a ParseError at the first warning
```

More: [Handle warnings and errors](handle-warnings-and-errors.md).

## Check that a statement adds up

Amounts are positive cent values, the sign comes from `direction` and `type`:

```js
const signed = (transaction) =>
  transaction.type === 'debit' || transaction.type === 'reverseCredit' ? -transaction.amountCents : transaction.amountCents;
const balance = (b) => (b.direction === 'credit' ? b.amountCents : -b.amountCents);

const extract = statement.extracts[0];
const total = extract.transactions.reduce((sum, transaction) => sum + signed(transaction), 0);

balance(extract.openingBalance) + total === balance(extract.closingBalance);   // true for the example file
```

## Look up the text of a business transaction code

```js
const { gvcText } = require('node-mt940');

gvcText(statement.extracts[0].transactions[0].payment.gvc);   // 'GELDAUTOMAT'
```

`gvc` is `null` for an unstructured payment information, so check for that first. More:
[`gvcText`](../reference/gvc-text.md).

## Use the types (TypeScript)

```ts
import { parseStatement, Statement, Transaction } from 'node-mt940';

const statement: Statement = parseStatement(text);
const first: Transaction = statement.extracts[0].transactions[0];
```

All types are listed in [The statement](../reference/statement.md).

## Handle errors

```js
const { ParseError, WriteError, ConfigurationError } = require('node-mt940');
```

`ParseError` (with the property `tag`), `WriteError` and `ConfigurationError` are thrown by the parser, the writer and
the `MT940` class. Errors of the file system (for example `ENOENT`) are passed on. See
[Errors](../reference/errors.md).
