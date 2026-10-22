# Changelog

All notable changes of this project are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), the versions follow [Semantic Versioning](https://semver.org).
Versions before 1.0.0 have no changelog, see the git history.

## [1.0.0] - Unreleased

Version 1.0.0 replaces the API of 0.1.x. How to change your code: [Migrate from 0.1.x](docs/how-to/migrate-from-0.1.md).

### Breaking changes

- The API is based on Promises instead of callbacks.
- The result is plain data (`Statement`) instead of the classes `Revenue`, `Extract`, `Transaction`, `Saldo` and
  `PaymentReference` with getters and setters. Extracts and transactions are arrays, not linked lists.
- Amounts are whole numbers in cent (`1499`) instead of strings (`'14,99'`), and dates are ISO strings
  (`'2015-01-16'`) instead of `Date` objects.
- `require('node-mt940')` no longer returns the class `MT940`. The package has named exports.
- `MT940` is configured with an options object (`pathToContent`, `pathToWrite`, `writeAs`, `strict`). The singleton, the
  setters, `getWriteStatus` and the parser and writer constants are gone, and there is one parser and one writer
  instead of `Default` and `Sparkasse`.
- Errors are `ParseError`, `WriteError` and `ConfigurationError` instead of objects like `{error: {message, code}}`.
- The XML writer is removed. It wrote an empty file.
- Node.js 18 or newer is required.

### Added

- `parseStatement(text, { strict })`: parses MT940 text. What it ignores or guesses is listed in `statement.warnings`,
  and `strict` turns the first warning into a `ParseError`. This includes the sub fields of a payment information
  (`:86:`) that are not read, such as `?38` with an IBAN (`UNKNOWN_SUBFIELD`).
- `formatStatement(statement, format)`: writes a statement as MT940 or CSV text. MT940 text can be read again with
  `parseStatement`.
- Intermediate balances: `:60M:` and `:62M:` are read, `Balance.intermediate` tells them from `:60F:` and `:62F:`.
  A page that ends with `:62M:` no longer needs a `:62F:`.
- `gvcText(code)`: the text of a business transaction code.
- Type declarations for all of the above.
- Documentation in `docs`: a tutorial, how-to guides, a reference and explanations with diagrams.

### Changed

- The library has no runtime dependencies any more (`ring`, `node-linkedlist`, `async` and `underscore` are removed).
- The license is `LGPL-3.0-or-later`. The file `LICENSE` holds the LGPL v3 text, it held the GPL v3 text before. The GPL
  text is kept as `COPYING`.
- The code and the tests are written in TypeScript. The project uses pnpm.

### Fixed

- The writer skipped the first extract and the first transaction of every extract and wrote neither the closing
  balance (`:62F:`) nor the sub fields `?30` to `?34`.
- The writer wrote the dates of the `:61:` line wrongly, and created files that the owner could not write again.
- All transactions of an extract shared one payment information. Every transaction has its own now.
- A hyphen at the end of a line inside of a text separated extracts.
- A booking date in the next month of a value date on the 31st (for example 31 January and 1 February) was set to the
  wrong month.
- The business transaction code of a payment information was returned as the text `null`.
