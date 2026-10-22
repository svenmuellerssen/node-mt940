# `parseStatement`

```ts
parseStatement(text: string, options?: ParseOptions): Statement
```

Parses the content of an MT940 file. The function is synchronous, does not read files and does not change its input.
The result is described in [The statement](statement.md).

## Options

| Option | Type | Default | Meaning |
|---|---|---|---|
| `strict` | `boolean` | `false` | The first warning throws a `ParseError` instead of being listed in `statement.warnings`. |

## Rules

- The text may use `\r\n`, `\n` or `\r` as line ending.
- Extracts are separated by a line that consists only of `-` (blanks at the end are allowed). A `-` inside of a line does
  not separate extracts. Empty blocks are skipped.
- A line starts a new field if it starts with a tag such as `:61:`. Every other line continues the field before. A
  `:86:` that is wrapped over several lines is joined, without a separator.
- Supported tags: `:20:`, `:25:`, `:28C:`, `:60F:`, `:60M:`, `:61:`, `:86:`, `:62F:`, `:62M:`.
- The reference number of the statement is the `:20:` of the first extract.
- Two-digit years are read as 20YY.
- An amount has at most two decimals. `14,` and `14,5` are valid.
- If an extract has both `:62F:` and `:62M:`, the later one is the closing balance.
- A structured `:86:` starts with a three digit business transaction code and a `?`, for example `006?00...`. Every
  other text is unstructured and taken completely as `payment.text`.

## Warnings

What the parser ignores or guesses is listed in `statement.warnings`, ordered by line:

| Code | Case | What the parser does |
|---|---|---|
| `UNSTRUCTURED_PAYMENT` | A `:86:` without business transaction code. | Keeps the text as `payment.text`, `gvc` is `null`. |
| `TRANSACTION_WITHOUT_PAYMENT` | A `:61:` that no `:86:` follows. | Keeps the transaction with an empty payment information. |
| `PAYMENT_WITHOUT_TRANSACTION` | A `:86:` without a `:61:` before. | Ignores the `:86:`. |
| `ACCOUNT_WITHOUT_BANK_CODE` | A `:25:` without `/`. | Takes the whole value as account number, `bankCode` is empty. |
| `UNSUPPORTED_TAG` | A tag that is not supported, for example `:64:`. | Ignores the tag. |
| `IGNORED_LINE` | A line that belongs to no supported field: before the first tag, or continuing a field other than `:86:`. | Ignores the line. |

With `strict: true` the first warning throws a `ParseError` whose message starts with `Strict mode:` and names the code
and the line. Its `tag` is the tag of the warning.

## Errors

`parseStatement` throws a [`ParseError`](errors.md#parseerror) if:

| Case | `tag` |
|---|---|
| The text contains no extract (empty, only blanks or only `-` lines). | none |
| An extract has no `:25:`. | `'25'` |
| An extract has no `:60F:` or `:60M:`. | `'60F'` |
| An extract has no `:62F:` or `:62M:`. | `'62F'` |
| A balance (`:60F:`, `:60M:`, `:62F:`, `:62M:`) is malformed. | the tag of the line |
| A `:61:` line is malformed. | `'61'` |
| An amount has more than two decimals. | the tag of the line |
| A date is impossible, for example the 30th of February. | the tag of the line |
| `strict` is set and there is a warning. | the tag of the warning |
