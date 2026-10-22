# The `MT940` class

```ts
new MT940(options?: MT940Options)
```

Reads a file into a [`Statement`](statement.md) and writes a statement into a file. It is the only part of the
library that touches the file system. Files are read and written as UTF-8.

## Options

| Option | Type | Default | Meaning |
|---|---|---|---|
| `pathToContent` | `string` | none | The file that `parse()` reads. |
| `pathToWrite` | `string` | none | The file that `write()` writes. An existing file is replaced. |
| `writeAs` | `'mt940' \| 'csv'` | `'mt940'` | The format of the written file, see [`formatStatement`](format-statement.md). |
| `strict` | `boolean` | `false` | The option `strict` of [`parseStatement`](parse-statement.md#options). |

The options are copied. Changing the object you passed afterwards changes nothing, and there are no setters. Both
paths are optional, each method needs only its own.

## Methods

### `parse(): Promise<Statement>`

Reads `pathToContent` and parses it with `parseStatement`. Takes no argument.

### `write(statement: Statement): Promise<void>`

Formats the statement with `formatStatement` (`writeAs`) and writes the text into `pathToWrite`. The statement is
formatted first: if it can not be written, no file is created or changed. The Promise resolves with `undefined`.

## Errors

| Where | Error | Case |
|---|---|---|
| Constructor | `ConfigurationError` | `writeAs` is not `'mt940'` or `'csv'`. |
| `parse()` | `ConfigurationError` (rejected) | There is no `pathToContent`. |
| `write()` | `ConfigurationError` (rejected) | There is no `pathToWrite`. |
| `parse()` | `ParseError` (rejected) | The content is not valid, or `strict` is set and there is a warning. |
| `write()` | `WriteError` (rejected) | The statement can not be written. |
| `parse()`, `write()` | error of Node (rejected) | The file system fails, for example `ENOENT` for a missing file. |

See [Errors](errors.md).
