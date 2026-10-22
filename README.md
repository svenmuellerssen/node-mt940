# node-mt940

Parses files with bank account statements in MT940 format into plain TypeScript objects and writes them again as MT940
or CSV. The API is based on Promises and has no runtime dependencies.

> **Breaking change:** this version has a new API (Promises and plain data) and is not compatible with 0.1.x. See
> [How to migrate from 0.1.x](docs/how-to/migrate-from-0.1.md).

## Installation

```
npm install --save node-mt940
# or
pnpm add node-mt940
```

Needs Node.js 18 or newer (developed and tested with Node.js 20). The package is written in TypeScript and ships its
type declarations.

## Quick start

Parse a text:

```ts
import { parseStatement } from 'node-mt940';

const statement = parseStatement(text);

statement.extracts[0].transactions[0].amountCents;   // 1499 for the file of the tutorial
```

Read a file and write it as CSV:

```ts
import { MT940 } from 'node-mt940';

const mt940 = new MT940({ pathToContent: 'umsatz.sta', pathToWrite: 'umsatz.csv', writeAs: 'csv' });
await mt940.write(await mt940.parse());
```

More uses at a glance: [Quick start guide](docs/how-to/quick-start.md).

## How it works

Text goes in, a `Statement` of plain data comes out, and from there it can become MT940 or CSV text again. The class
`MT940` reads and writes the files, `parseStatement` and `formatStatement` do the work. A diagram of the process, with
input, output and the components, is in [Architecture](docs/explanation/architecture.md).

## Documentation

The documentation is in [`docs`](docs/index.md), organised after [Diátaxis](https://diataxis.fr):

| I want to... | Go to |
|---|---|
| learn the library step by step | [Tutorial: Getting started](docs/tutorials/getting-started.md) |
| see the common uses | [Quick start guide](docs/how-to/quick-start.md) |
| solve a task | [How-to guides](docs/index.md#how-to-guides-solve-a-task) |
| look up a function, a field or an error | [Reference](docs/index.md#reference-look-something-up) |
| understand the design | [Explanation](docs/index.md#explanation-understand-the-design) |
| move from version 0.1.x | [How to migrate from 0.1.x](docs/how-to/migrate-from-0.1.md) |

## Development

```
pnpm install         # once, the project uses pnpm
pnpm test            # mocha, the tests are TypeScript (test/**/*.ts)
pnpm run typecheck   # tsc --noEmit
pnpm run build       # compiles src into dist
```

Run the tests and the type check before you open a pull request. Decisions that change the design are written down as
ADRs: [1, the core is the single basis](docs/adr/0001-core-is-the-single-basis.md) and
[2, the public API](docs/adr/0002-public-api.md).

## License

GNU Lesser General Public License, version 3 or (at your option) any later version (`LGPL-3.0-or-later`). You may
use the library in programs under another license. Changes to the library itself have to stay under the LGPL.

- `LICENSE` is the text of the GNU Lesser General Public License version 3.
- `COPYING` is the text of the GNU General Public License version 3, which the LGPL refers to.
