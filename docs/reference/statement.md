# The statement

`parseStatement` and `MT940.parse()` return a `Statement`. All values are plain data, nothing in it has behaviour. All
types are exported by the package (`Statement`, `Extract`, `Balance`, `Transaction`, `Payment`, `ParseWarning`,
`WarningCode`, `ParseOptions`, `Direction`, `TransactionType`), they come from `src/core/statement.ts`.

## Statement

| Field | Type | Meaning |
|---|---|---|
| `referenceNumber` | `string` | The reference number (`:20:`) of the first extract. |
| `extracts` | `ReadonlyArray<Extract>` | The extracts of the file, in the order of the file. |
| `warnings` | `ReadonlyArray<ParseWarning>` | Everything that was ignored or guessed while parsing, ordered by line. Empty for a clean statement. |

## Extract

One block of the file. Blocks are separated by a line that consists only of `-`.

| Field | Type | Meaning |
|---|---|---|
| `bankCode` | `string` | The part of the account (`:25:`) before the first `/`. Empty if there is no `/`. |
| `accountNumber` | `string` | The part after the first `/`. Without a `/` the whole account. |
| `number` | `string` | The extract number (`:28C:`), the part before `/`. |
| `sheetNumber` | `string` | The sheet number, the part of `:28C:` after `/`. |
| `openingBalance` | `Balance` | The opening balance (`:60F:` or `:60M:`). |
| `closingBalance` | `Balance` | The closing balance (`:62F:` or `:62M:`). |
| `transactions` | `ReadonlyArray<Transaction>` | The transactions (`:61:` with their `:86:`) in the order of the file. |

## Balance

| Field | Type | Meaning |
|---|---|---|
| `direction` | `'credit' \| 'debit'` | `C` or `D`. |
| `amountCents` | `number` | The amount in cent, always positive. The sign is given by `direction`. |
| `currency` | `string` | Three letters, for example `'EUR'`. |
| `date` | `string` | ISO date, `'2015-01-15'`. |
| `intermediate` | `boolean` | `true` for `:60M:` and `:62M:`, `false` for `:60F:` and `:62F:`. See [Multi-page statements](../explanation/multi-page-statements.md). |

## Transaction

| Field | Type | Meaning |
|---|---|---|
| `valueDate` | `string` | ISO date of the value date. |
| `bookingDate` | `string` | ISO date of the booking date. It has no year in the file and is taken from the value date: a booking in December of a value date in January belongs to the year before, and the other way round. Without a booking date it is the value date. |
| `type` | `'credit' \| 'debit' \| 'reverseCredit' \| 'reverseDebit'` | `C`, `D`, `RC` or `RD`. |
| `amountCents` | `number` | The amount in cent, always positive. The sign is given by `type`. |
| `currencyLastChar` | `string` | The letter after the type in the `:61:` line (the last character of the currency), empty if there is none. |
| `bookingKey` | `string` | The booking key, for example `'N037'`. |
| `reference` | `string` | The rest of the `:61:` line after the booking key, for example `'NONREF'`. |
| `payment` | `Payment` | The payment information (`:86:`). |

`reverseCredit` and `reverseDebit` are reversals (`RC` and `RD`).

## Payment

| Field | Type | Meaning |
|---|---|---|
| `gvc` | `number \| null` | The business transaction code (`006` is `6`). `null` if the text is not structured. |
| `bookingText` | `string` | Sub field `?00`. |
| `primanotaNumber` | `string` | Sub field `?10`. |
| `text` | `string` | The purpose of payment: the sub fields `?20` to `?29` and `?60` to `?63` joined. For an unstructured text the whole text. |
| `purchaserBic` | `string` | Sub field `?30`. |
| `purchaserAccountNumber` | `string` | Sub field `?31`. |
| `accountOwnerName` | `string` | Sub fields `?32` and `?33` joined. |
| `textKeyAddition` | `string` | Sub field `?34`. |

A transaction without `:86:` has an empty payment information: `gvc` is `null` and all texts are empty.

## ParseWarning

| Field | Type | Meaning |
|---|---|---|
| `code` | `WarningCode` | See [Warnings](parse-statement.md#warnings). |
| `message` | `string` | A text for people. |
| `tag` | `string \| undefined` | The MT940 tag the warning belongs to. |
| `line` | `number` | The line of the parsed text, starting with 1. |

## Example

A transaction of the file from the [tutorial](../tutorials/getting-started.md):

```json
{
  "valueDate": "2015-01-16",
  "bookingDate": "2015-01-16",
  "type": "debit",
  "amountCents": 1499,
  "currencyLastChar": "R",
  "bookingKey": "N037",
  "reference": "NONREF",
  "payment": {
    "gvc": 6,
    "bookingText": "SONSTIGER EINZUG",
    "primanotaNumber": "9208",
    "text": "EC 65421206 150115184614IC5",
    "purchaserBic": "30050000",
    "purchaserAccountNumber": "1107713",
    "accountOwnerName": "SATURN SAGT DANKE 65421206",
    "textKeyAddition": "011"
  }
}
```

The reasons for plain data, cent amounts and ISO dates are in [The data model](../explanation/data-model.md).
