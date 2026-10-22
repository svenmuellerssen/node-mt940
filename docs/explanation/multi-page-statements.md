# Multi-page statements

A long MT940 statement can be split into pages. This page explains how the library treats them. The fields are in
[The statement](../reference/statement.md#balance).

## The balances of a page

Every page has an opening balance and a closing balance. The letter in the tag tells whether the statement goes on:

| Tag | Meaning | `intermediate` |
|---|---|---|
| `:60F:` | The absolute opening balance: the first page. | `false` |
| `:60M:` | The start of an intermediate balance: a page that continues an earlier one. | `true` |
| `:62M:` | The intermediate closing balance: more transactions follow on the next page. | `true` |
| `:62F:` | The closing balance: the last page. | `false` |

A statement of three pages therefore runs `:60F:` ... `:62M:`, then `:60M:` ... `:62M:`, then `:60M:` ... `:62F:`.
The pages are separated by a line that consists only of `-`.

## What the library does with them

- Every page is one **extract** of the result, in the order of the file. The library does not merge pages. If you
  want all transactions of an account, concatenate the `transactions` of the extracts.
- `:62M:` is accepted as closing balance, `:60M:` as opening balance. Both set `intermediate` to `true` in the
  balance. A page that ends with `:62M:` does not need a `:62F:`.
- `formatStatement` writes the balances back with `M` or `F` according to `intermediate`, so a multi-page statement
  stays a multi-page statement after the round trip.

## Combine the transactions of an account

```js
const transactions = statement.extracts.flatMap(extract => extract.transactions);
```

Check `extract.accountNumber` first if the file contains pages of different accounts.
