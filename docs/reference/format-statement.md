# `formatStatement`

```ts
formatStatement(statement: Statement, format: 'mt940' | 'csv'): string
```

Formats a statement as text. The function is synchronous and writes nothing, the caller decides where the text goes
(the class [`MT940`](mt940-class.md) writes it into a file). The `warnings` of the statement have no influence on the
text. Amounts are written from cent with a comma and two decimals, without a thousands separator (`1000,00`).

It throws a [`WriteError`](errors.md#writeerror) if the statement has no extract, if the format is not supported
(`'xml'` is not), or if a value can not be written without changing its meaning (see below).

## Format `'mt940'`

Every extract is written completely and ends with a line that consists only of `-`. Lines end with `\r\n`:

```
:20:<referenceNumber>
:25:<bankCode>/<accountNumber>
:28C:<number>/<sheetNumber>
:60F:<opening balance>
:61:<transaction>
:86:<payment information>
...
:62F:<closing balance>
-
```

| Part | Format |
|---|---|
| Balance | `C` or `D`, the date as `YYMMDD`, the currency, the amount. For example `C150115EUR276,02`. |
| Balance tag | `:60F:` and `:62F:` for an absolute balance, `:60M:` and `:62M:` if `intermediate` is `true`. |
| Transaction (`:61:`) | The value date as `YYMMDD`, the booking date as `MMDD`, the type (`C`, `D`, `RC`, `RD`), `currencyLastChar`, the amount, the booking key and the reference. For example `1501160116DR14,99N037NONREF`. |
| Structured payment information (`:86:`) | The business transaction code with three digits, then the sub fields `?00` (booking text), `?10` (primanota number), `?20` (purpose of payment), `?30` (BIC), `?31` (account number), `?32` (owner name) and `?34` (text key addition). |

Details of the payment information:

- Empty sub fields are left out. Only `?00` is always written, even if it is empty (`:86:006?00`).
- The purpose of payment is written in one sub field `?20`. It is not split into parts of 27 characters and the lines
  are not wrapped.
- An unstructured payment information (`gvc` is `null`) is written as its text only, without sub fields. A `?` in
  the text stays.
- A transaction without any payment information (`gvc` is `null` and the text is empty) is written without a `:86:`
  line.

`WriteError` for values that would be read back differently:

- A `?` in the value of a sub field of a structured payment information (it would start another sub field). The message
  names the field.
- An unstructured text that starts with three digits and a `?` (`123?abc`), because `parseStatement` would read it as
  structured.

What `formatStatement` writes in this format can be read again with `parseStatement` and gives the same extracts. Only
the `warnings` and their line numbers can differ.

## Format `'csv'`

A header and one line for every transaction. Every field is quoted, a `"` in a field is doubled, a line ends with `;`
and `\n`.

| Column | Value |
|---|---|
| `Auftragskonto` | `extract.accountNumber` |
| `Buchungstag` | `transaction.bookingDate` as `DD.MM.YY` |
| `Valutadatum` | `transaction.valueDate` as `DD.MM.YY` |
| `Buchungstext` | `payment.bookingText` |
| `Verwendungszweck` | `payment.text` |
| `Beguenstigter/Zahlungspflichtiger` | `payment.accountOwnerName` |
| `Kontonummer` | `payment.purchaserAccountNumber` |
| `BLZ` | `payment.purchaserBic` |
| `Betrag` | The amount, negative for `debit` and `reverseCredit`. |
| `Waehrung` | The currency of the opening balance. |
| `Info` | Always empty. |

```
"Auftragskonto";"Buchungstag";"Valutadatum";"Buchungstext";"Verwendungszweck";"Beguenstigter/Zahlungspflichtiger";"Kontonummer";"BLZ";"Betrag";"Waehrung";"Info";
"6013216264";"16.01.15";"16.01.15";"SONSTIGER EINZUG";"EC 65421206 150115184614IC5";"SATURN SAGT DANKE 65421206";"1107713";"30050000";"-14,99";"EUR";"";
```
