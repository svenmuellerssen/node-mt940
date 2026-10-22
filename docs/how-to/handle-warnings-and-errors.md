# How to handle warnings and errors

The parser reads what it can. What it ignores or guesses is a **warning** in the result, what it can not read is an
**error**. All error classes are listed in the [reference](../reference/errors.md).

## Look at the warnings

```js
const { parseStatement } = require('node-mt940');

const statement = parseStatement(text);

for (const warning of statement.warnings) {
  console.log(warning.code, warning.tag, warning.line, '-', warning.message);
}
```

For a file that has a tag the library does not support (`:64:`) after the closing balance this prints:

```
UNSUPPORTED_TAG 64 11 - The tag ":64:" is not supported, it is ignored.
```

`line` starts with 1 and counts the lines of the text you gave to `parseStatement`. `tag` is missing for a warning that
belongs to no tag. The codes are listed in [`parseStatement`](../reference/parse-statement.md#warnings).

## Decide per code

A warning is not always a problem for you. Ignore the ones you accept and act on the others:

```js
const problems = statement.warnings.filter(warning => warning.code !== 'UNSUPPORTED_TAG');
if (problems.length > 0) {
  throw new Error(`The file has ${problems.length} problems, the first one: ${problems[0].message}`);
}
```

## Treat every warning as an error

Pass `strict: true`. The first warning throws a `ParseError`:

```js
const { ParseError } = require('node-mt940');

try {
  parseStatement(text, { strict: true });
} catch (error) {
  console.log(error instanceof ParseError);   // true
  console.log(error.message);                 // Strict mode: UNSUPPORTED_TAG in line 11: The tag ":64:" is not supported, it is ignored.
  console.log(error.tag);                     // '64'
}
```

With the class `MT940` use the option: `new MT940({ pathToContent: 'umsatz.sta', strict: true })`.

## Catch errors by their class

```js
const { MT940, ParseError, WriteError, ConfigurationError } = require('node-mt940');

try {
  const statement = await new MT940({ pathToContent: 'umsatz.sta' }).parse();
  await new MT940({ pathToWrite: 'umsatz.csv', writeAs: 'csv' }).write(statement);
} catch (error) {
  if (error instanceof ParseError) {
    // the content is not valid MT940, error.tag names the MT940 tag, for example '60F'
  } else if (error instanceof WriteError) {
    // the statement can not be written, for example because it has no extract
  } else if (error instanceof ConfigurationError) {
    // a path or the format is missing or wrong
  } else if (error.code === 'ENOENT') {
    // the file does not exist
  } else {
    throw error;
  }
}
```

Examples of messages you get:

| Case | Error | `message` |
|---|---|---|
| Empty text | `ParseError` | `The content does not contain an extract.` |
| An extract without closing balance | `ParseError`, `tag` `'62F'` | `The extract has no closing balance (:62F:).` |
| `new MT940().parse()` | `ConfigurationError` | `There is no path to the content (pathToContent).` |
| `new MT940({ writeAs: 'xml' })` | `ConfigurationError` | `The format "xml" is not supported, use one of: mt940, csv.` |
| A statement without extract | `WriteError` | `The statement has no extract.` |
| A file that does not exist | error of Node, `code` `'ENOENT'` | the message of Node |

`write()` formats first and writes afterwards. If it rejects with a `WriteError`, no file was created or changed.
