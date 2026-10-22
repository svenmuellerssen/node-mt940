# 2. The public API: Promises, an options object and named exports

Date: 2026-10-22

Status: accepted

## Context

[ADR 1](0001-core-is-the-single-basis.md) decided that the core and its `Statement` are the basis of the library.
What was still open is how a caller uses it. The API of 0.1.x answered this differently:

- Everything was asynchronous with callbacks, even the parsing of a text.
- One shared object was configured with setters, or with a configuration object and number constants that chose a
  parser and a writer (`MT940.singleton(...)`, `setParser`, `setWriteAs`).
- `require('node-mt940')` returned the class `MT940`. Parsing a text without a file needed the parser classes.
- There was an XML writer. It wrote an empty file.
- Errors were objects such as `{error: {message, code}}`.
- The writer wrote what it was given, also text that could not be read back.

## Decision

### 1. Promises for files, plain functions for the rest

Everything that touches the file system returns a Promise (`MT940.parse()`, `MT940.write(statement)`). Everything else
is a synchronous function that takes and returns values: `parseStatement(text)` and
`formatStatement(statement, format)`.

- Considered: keep the callbacks. Rejected, they nest, and errors travel through an argument next to errors that
  are thrown.
- Considered: callbacks and Promises together. Rejected, it doubles the surface and the tests for no new capability.
  A caller who needs a callback can use `util.callbackify`.
- Considered: make the pure functions asynchronous too. Rejected, there is nothing to wait for, and a caller with a text
  in memory should not need `await`.

### 2. An options object, fixed at construction

`new MT940({ pathToContent, pathToWrite, writeAs, strict })`. The options are copied, `parse()` takes no argument and
`write(statement)` takes only the statement. There is no singleton and there are no setters.

- Considered: keep the setters and the singleton. Rejected, a shared mutable object lets one part of a program change
  what another part reads or writes.
- Considered: pass the path to each call (`parse(path)`). Rejected, it spreads the configuration over the calls and
  hides the format of the written file. Creating a second object for a second file is cheap.
- A missing path or an unknown `writeAs` is a `ConfigurationError`. An unknown format is found in the constructor, a
  missing path when the method needs it, because both paths are optional.

### 3. Named exports, no default export

The package exports `MT940`, `parseStatement`, `formatStatement`, `gvcText`, the three error classes and the types of
the statement. `require('node-mt940')` no longer returns the class.

- Considered: keep the old shape with `export = MT940`. Rejected, the functions are useful without any file, and a
  single exported class would hide them.

### 4. Two formats: `'mt940'` and `'csv'`

`formatStatement` and the option `writeAs` accept these two. `'xml'` is a `WriteError` (in the constructor of `MT940`
a `ConfigurationError`). The old XML writer wrote an empty file and there is no description of the format, so there is
nothing to keep. A real XML format can be added later as a new value of `Format`, without breaking anyone.

### 5. The writer refuses what it can not write without changing the meaning

`formatStatement` throws a `WriteError` for a statement without extract, for a `?` inside the value of a sub field of a
structured payment information, and for an unstructured text that starts with three digits and a `?`.

- A `?` separates the sub fields of `:86:`. A value that contains one would be read back as two fields, and a text
  like `123?abc` would be read as structured.
- Considered: escape or remove the `?`, or write the text as it is. Rejected, the first changes the data, the second
  writes a file that does not read back to the same statement. This follows the rule that nothing is changed
  silently, see [The data model](../explanation/data-model.md).
- Text that was read with `parseStatement` can not trigger this: a `?` in a structured value always starts a new sub
  field when it is read. Only a statement that was built or changed by hand can. An unstructured text may contain a
  `?`.

### 6. The layout of the written text is fixed and kept simple

For MT940: lines end with `\r\n`, every extract is complete and ends with a `-` line, empty sub fields are left out
(only `?00` is always written), the booking date is written as `MMDD`. For CSV: the columns of the old Sparkasse
writer, every field quoted, `DD.MM.YY` dates, a negative amount for a debit and a reversed credit. The details are in
the [reference](../reference/format-statement.md).

- Considered: split the purpose of payment into sub fields of 27 characters and wrap lines at 65 characters, as some
  banks expect. Not done for now. The text is read back correctly by `parseStatement`, which joins the parts.

### 7. Errors are classes, errors of Node pass through

`ParseError` (with the property `tag`), `WriteError` and `ConfigurationError` extend `Error`. `MT940` does not wrap the
errors of the file system, so callers can check `error.code` (`'ENOENT'`). The option `strict` is passed on to the
parser: with it, the first warning rejects `parse()` with a `ParseError`.

- Considered: wrap the errors of the file system in an own class. Rejected, it would hide the `code` that callers
  already know.
- Considered: return a result object instead of throwing. Rejected, it does not fit `async` functions and makes the
  success path longer.

## Consequences

- The surface is small: one class with two methods, two functions, one lookup function, three error classes and the
  types. Parser and writer are tested without files, `MT940` against a real temporary directory.
- The API breaks. [How to migrate from 0.1.x](../how-to/migrate-from-0.1.md) lists what to change, and the
  [changelog](../../CHANGELOG.md) names it as breaking.
- There is no callback API and no way to change the options of an existing `MT940` object. Callers create a new object.
- Files are read and written as UTF-8 only. An option for the encoding is planned, it concerns only `MT940`.
- The written MT940 text is meant to be read by this library. A recipient that insists on lines of at most 65
  characters or on a `?20` of 27 characters would need the splitting that was not done (point 6).
- XML is not available until someone describes the format and asks for it.
