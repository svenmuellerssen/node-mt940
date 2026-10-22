# Errors

The package exports three error classes. All extend `Error`, set `name` to the class name and work with `instanceof`.
Errors of the file system are not wrapped, `MT940` passes them on.

## `ParseError`

Thrown by [`parseStatement`](parse-statement.md#errors), and by `MT940.parse()` (as rejection).

| Property | Type | Meaning |
|---|---|---|
| `message` | `string` | What is wrong, for example `The extract has no closing balance (:62F:).` |
| `tag` | `string \| undefined` | The MT940 tag the error belongs to (`'25'`, `'60F'`, `'61'`, `'62F'`...). Missing if there is none, for example for empty content. |

In strict mode the message starts with `Strict mode: ` followed by the warning code and its line.

## `WriteError`

Thrown by [`formatStatement`](format-statement.md), and by `MT940.write()` (as rejection). It has only a `message`.

Cases: the statement has no extract, the format is not supported (`xml`), a `?` in a value of a structured payment
information, an unstructured text that starts with three digits and a `?`.

## `ConfigurationError`

Thrown by the constructor of [`MT940`](mt940-class.md#errors) for an unsupported `writeAs`, and by `parse()` and
`write()` (as rejection) if the needed path is missing. It has only a `message`.

## Errors of the file system

`MT940.parse()` and `MT940.write()` are rejected with the error of Node if reading or writing fails. Check the `code`
property, for example `'ENOENT'` (file does not exist) or `'EACCES'` (no permission).
