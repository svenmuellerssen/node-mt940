# How to migrate from 0.1.x

The new version breaks the API of 0.1.x: it is based on Promises and on plain data. This page shows what to change. The
reasons are in [ADR 1](../adr/0001-core-is-the-single-basis.md).

## Before and after

0.1.x:

```js
var MT940 = require('node-mt940');

var mt940 = MT940.singleton({
  parser: MT940.PARSER_SPARKASSE,
  writer: MT940.WRITER_SPARKASSE,
  pathToContent: 'in.sta',
  pathToWrite: 'out.txt'
});

mt940.parse(function(error, revenue) {
  var transaction = revenue.getExtracts().first().getTransactions().first();
  transaction.getAmount();                                  // '14,99'
  transaction.getPaymentReference().getBookingText();       // 'SONSTIGER EINZUG'
});
```

New:

```js
const { MT940 } = require('node-mt940');

const statement = await new MT940({ pathToContent: 'in.sta' }).parse();

const transaction = statement.extracts[0].transactions[0];
transaction.amountCents;                // 1499
transaction.payment.bookingText;        // 'SONSTIGER EINZUG'
```

## What to change

| 0.1.x | New version |
|---|---|
| `require('node-mt940')` returns the class `MT940` | `const { MT940 } = require('node-mt940')` (named exports, no default export) |
| Callbacks (`parse(callback)`, `write(revenue, callback)`) | Promises (`await mt940.parse()`, `await mt940.write(statement)`) |
| `MT940.singleton(config)`, `setConfiguration`, `setParser`, `setWriter`, `setWriteAs`, `getWriteStatus` | `new MT940(options)`, the options are fixed when you create the object |
| Parser and writer classes (`Default`, `Sparkasse`), `MT940.PARSER_*`, `MT940.WRITER_*` | removed, there is one parser and one writer |
| `parser.setContent(text)` | `parseStatement(text)` |
| Option `writeAs` with a number constant | `writeAs: 'mt940'` or `'csv'` |
| Option `gvcData` | removed, see [`gvcText`](../reference/gvc-text.md) |
| Classes `Revenue`, `Extract`, `Transaction`, `Saldo`, `PaymentReference`, `GVCList`, `GVCode` with getters and setters | plain data, see [The statement](../reference/statement.md) |
| `getExtracts()` returns a linked list (`first()`, `next()`, `size`) | `extracts` is an array |
| `getStartSaldo()`, `getEndSaldo()` | `openingBalance`, `closingBalance` |
| Amounts as strings (`'14,99'`) | amounts in cent (`1499`), the sign comes from `type` and `direction` |
| Dates as `Date` | dates as ISO strings (`'2015-01-16'`) |
| XML writer | removed, it wrote an empty file |
| Errors as objects (`{error: {message, code}}`) | `ParseError`, `WriteError`, `ConfigurationError` and the errors of Node, see [Errors](../reference/errors.md) |

## Behaviour that changed

- The old writer skipped the first extract and the first transaction of every extract and wrote neither `:62F:` nor
  the sub fields `?30` to `?34`.
- All transactions of an extract shared one payment information. Every transaction has its own now.
- A hyphen at the end of a line inside a text no longer separates extracts.
- `:62M:` (a page of a multi-page statement) is read as closing balance, see
  [Multi-page statements](../explanation/multi-page-statements.md).
- The old writer created files that the owner could not write again.
- What the parser ignores or guesses is listed in `statement.warnings`, see
  [Handle warnings and errors](handle-warnings-and-errors.md).
