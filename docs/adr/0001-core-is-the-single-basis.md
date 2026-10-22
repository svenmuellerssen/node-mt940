# 1. The core is the single basis of the library

Date: 2026-10-22

Status: accepted

## Context

Version 0.1.x was written in JavaScript: callbacks, a linked list with an internal cursor, a class with setters and
getters for every field, and a parser and a writer that were configured by number constants.

A new TypeScript module, the core (`src/core`, `parseStatement`), was built first. It returns plain data
(amounts in cent, ISO dates), lists everything it ignores or guesses as warnings and can turn warnings into errors
(strict mode).

To migrate the old code, a second stack was built next to the core: a data model with the old getters, its own parser
(`parseRevenue`), a writer and a Promise based facade. The result was two TypeScript parsers for the same format:

- the regular expressions for the tag lines, the balances and the `:61:` line were copied,
- the rules for dates, sub fields of `:86:` and extracts had to be kept in two places,
- the behaviour had already diverged (the core refused `:62M:`, the second parser read it).

## Decision

The core is the single basis. There is one parser (`parseStatement`) and the result is the plain `Statement` of the
core. The writer (`formatStatement`) and the facade (`MT940`) work on this `Statement`. The second stack (model and
`parseRevenue`) was removed before it was merged.

Considered options:

1. **Keep both parsers** and document the differences. Rejected: double maintenance and diverging behaviour.
2. **Keep the old model as a view on the core** (an adapter that builds `Revenue` objects from a `Statement`). Rejected:
   it keeps the setters, getters and the linked list alive for no gain, and the old API had defects that the new data
   structure does not have (for example one shared payment information per extract).
3. **The core only.** Chosen.

## Consequences

- The API breaks (see [How to migrate from 0.1.x](../how-to/migrate-from-0.1.md)): Promises instead of callbacks,
  plain data instead of classes, amounts in cent, ISO dates, named exports, no XML writer. The version has to be
  raised to 1.0.0 when it is released.
- The core reads `:62M:` as closing balance and keeps the difference between intermediate (`:60M:`, `:62M:`) and
  absolute (`:60F:`, `:62F:`) balances in `Balance.intermediate`.
- All old JavaScript code, its tests and the runtime dependencies (`ring`, `node-linkedlist`, `async`, `underscore`)
  are removed. The library has no runtime dependencies.
- The text of a statement can be written again (`formatStatement`) and is read back to the same extracts. This is
  covered by the round trip tests.
- Open points that are not part of this decision: an option for the encoding of files (files are UTF-8 now) and
  texts for the business transaction codes (`gvcText` knows only one).
