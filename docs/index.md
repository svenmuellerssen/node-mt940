# node-mt940 documentation

The documentation follows the [Diátaxis](https://diataxis.fr) framework. Pick the kind of page that fits what you
want to do.

## Tutorials: learn by doing

- [Getting started](tutorials/getting-started.md): parse a small MT940 file, look at the result and write it as CSV.

## How-to guides: solve a task

- [Quick start: the common uses at a glance](how-to/quick-start.md)
- [Read and write files](how-to/read-and-write-files.md)
- [Handle warnings and errors](how-to/handle-warnings-and-errors.md)
- [Migrate from 0.1.x](how-to/migrate-from-0.1.md)

## Reference: look something up

- [The statement](reference/statement.md): the data that `parseStatement` returns.
- [`parseStatement`](reference/parse-statement.md): the parser, its rules, warnings and errors.
- [`formatStatement`](reference/format-statement.md): the MT940 and CSV output.
- [The `MT940` class](reference/mt940-class.md): reading and writing files.
- [Errors](reference/errors.md): every error class and when it is thrown.
- [`gvcText`](reference/gvc-text.md): texts of business transaction codes.

## Explanation: understand the design

- [Architecture](explanation/architecture.md): inputs, outputs and the components in between, with diagrams.
- [The data model](explanation/data-model.md): why plain data, cent amounts and ISO dates.
- [Multi-page statements](explanation/multi-page-statements.md): what `:60M:` and `:62M:` mean for the result.
- [ADR 1: The core is the single basis](adr/0001-core-is-the-single-basis.md): why there is one parser.
