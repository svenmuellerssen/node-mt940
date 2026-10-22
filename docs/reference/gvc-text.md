# `gvcText`

```ts
gvcText(code: number): string | undefined
```

Returns the text of a business transaction code (Geschaeftsvorfallcode), the `gvc` of a
[payment information](statement.md#payment).

| Case | Result |
|---|---|
| A known code with a text, for example `6` | The text, `'GELDAUTOMAT'`. |
| A known code without a text, for example `1` | An empty string. |
| An unknown code, for example `999` | `undefined`. |

The list is incomplete: for most codes it has no text yet. It is not used by `parseStatement` or `formatStatement`, you
call it yourself. `gvc` is `null` for an unstructured payment information, so check that before you call it.
