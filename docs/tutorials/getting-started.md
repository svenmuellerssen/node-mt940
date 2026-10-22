# Getting started

In this tutorial you parse a small MT940 file, look at what you get and write it as CSV and as MT940 again. It takes
about ten minutes. You need Node.js 18 or newer.

The examples use JavaScript with `require`. In TypeScript, write `import { parseStatement } from 'node-mt940'` instead.

## 1. Set up a project

```
mkdir mt940-tutorial
cd mt940-tutorial
npm init -y
npm install node-mt940
```

## 2. Create an example file

Save this as `example.sta`. It is a statement of one account with two transactions (a debit of 14,99 EUR and a debit
of 50,00 EUR):

```
:20:STARTUMSE
:25:10050000/6013216264
:28C:00000/001
:60F:C150115EUR276,02
:61:1501160116DR14,99N037NONREF
:86:006?00SONSTIGER EINZUG?109208?20EC 65421206 150115184614IC5?3030050000
?311107713?32SATURN SAGT DANKE 65421206?34011
:61:1501160116DR50,00N004NONREF//100000155234
:86:006?00GELDAUTOMAT?103342?2016.01/15.52UHR 650 897642?3010050000?32GA NR00003342 BLZ10050000 5?34003
:62F:C150116EUR211,03
-
```

The line `-` ends the extract. A file can contain several extracts one after the other.

## 3. Parse it

Save this as `step1.js`:

```js
const { parseStatement, formatStatement } = require('node-mt940');
const fs = require('fs');

const text = fs.readFileSync('example.sta', 'utf8');
const statement = parseStatement(text);

console.log(statement.referenceNumber);

const extract = statement.extracts[0];
console.log(extract.openingBalance.amountCents, extract.closingBalance.amountCents);

for (const transaction of extract.transactions) {
  console.log(transaction.valueDate, transaction.type, transaction.amountCents, transaction.payment.bookingText);
}

console.log(formatStatement(statement, 'csv'));
```

Run it with `node step1.js`. You see:

```
STARTUMSE
27602 21103
2015-01-16 debit 1499 SONSTIGER EINZUG
2015-01-16 debit 5000 GELDAUTOMAT
"Auftragskonto";"Buchungstag";"Valutadatum";"Buchungstext";"Verwendungszweck";"Beguenstigter/Zahlungspflichtiger";"Kontonummer";"BLZ";"Betrag";"Waehrung";"Info";
"6013216264";"16.01.15";"16.01.15";"SONSTIGER EINZUG";"EC 65421206 150115184614IC5";"SATURN SAGT DANKE 65421206";"1107713";"30050000";"-14,99";"EUR";"";
"6013216264";"16.01.15";"16.01.15";"GELDAUTOMAT";"16.01/15.52UHR 650 897642";"GA NR00003342 BLZ10050000 5";"";"10050000";"-50,00";"EUR";"";
```

Look at what happened:

- `parseStatement` returned plain data. The amounts are in **cent** (`27602` is 276,02 EUR) and the dates are ISO
  strings (`2015-01-16`).
- The type `debit` says that money left the account. The amount itself is always positive.
- `formatStatement(statement, 'csv')` turned the same data into CSV text. The debits got a minus sign there.

## 4. Read and write files

`MT940` does the file handling for you. Save this as `step2.js`:

```js
const { MT940 } = require('node-mt940');

async function main() {
  const statement = await new MT940({ pathToContent: 'example.sta' }).parse();

  await new MT940({ pathToWrite: 'example.csv', writeAs: 'csv' }).write(statement);
  await new MT940({ pathToWrite: 'copy.sta' }).write(statement);

  const again = await new MT940({ pathToContent: 'copy.sta' }).parse();
  console.log(again.extracts.length, again.extracts[0].transactions.length);
}

main();
```

Run it with `node step2.js`. It prints:

```
1 2
```

Now you have two new files:

- `example.csv` contains the CSV text from step 3.
- `copy.sta` is the statement as MT940 text again. It has the same extract and the same two transactions, which is
  what the last line proves: you read `copy.sta` and got one extract with two transactions.

## What you learned

- `parseStatement(text)` turns MT940 text into a `Statement` of plain data.
- `formatStatement(statement, format)` turns a `Statement` into MT940 or CSV text.
- `new MT940({...})` reads and writes files with the same two functions and returns Promises.

## Where to go next

- Solve a concrete task: [Read and write files](../how-to/read-and-write-files.md) and
  [Handle warnings and errors](../how-to/handle-warnings-and-errors.md).
- Look up every field of the result: [The statement](../reference/statement.md).
- Understand how the parts fit together: [Architecture](../explanation/architecture.md).
