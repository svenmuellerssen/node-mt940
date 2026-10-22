# The data model

This page explains why the result of `parseStatement` looks the way it does. The fields themselves are listed in
[The statement](../reference/statement.md).

## Plain data instead of objects

A `Statement` is made of plain objects and arrays with `readonly` types. There are no classes, getters, setters or
methods. You can print it as JSON, compare two statements with a deep equal, copy it and pass it around without
looking at what an object does with it.

Version 0.1.x had a class for every level, with a getter and a setter for every field and a linked list with a cursor
for the extracts. Reading the same list twice could return different results, and one payment information object was
shared by all transactions of an extract. Plain data can not have these defects.

## Amounts in cent

Amounts are whole numbers in cent (`1499` for 14,99 EUR). Floating point numbers can not represent most decimals
exactly, so sums and comparisons of amounts as `number` with decimals can be off by a fraction. With cent values,
adding, subtracting and comparing is exact. The sign is not part of the number: a balance has a `direction`, a
transaction has a `type`. [Check that a statement adds up](../how-to/quick-start.md#check-that-a-statement-adds-up)
shows how to apply it.

When the text is written again, the cent value is formatted with a comma and two decimals (`14,99`). A value that the
file wrote as `14,` is `1400` and is written as `14,00`.

## ISO dates as strings

Dates are `'YYYY-MM-DD'` strings. MT940 has dates without a time and without a time zone. A `Date` object would add
both, and the same file could then show a different day depending on the time zone of the machine. A string stays what
the file said and still sorts correctly.

The booking date of a transaction has no year in the file (`MMDD`). The parser takes the year from the value date and
corrects it when the two dates are on different sides of New Year, so that `0116` booked for a value date in
December is in January of the next year.

## Texts stay texts

Numbers that identify something are strings, for example the `primanotaNumber` or the `bookingKey`. A number would lose
leading zeros (`0123` would become `123`). Only the business transaction code `gvc` is a number, with `null` for text
that has none.

## Nothing is dropped silently

MT940 files from banks differ in what they contain. The parser does not throw on everything unusual, and it does not
hide it either. A tag that it does not know, a `:86:` without structure, a sub field of `:86:` that it does not read, a
transaction without `:86:`: each is kept or skipped in a defined way and is listed in `statement.warnings` with its
code, the tag and the line. You can ignore the warnings you accept, or turn them into errors with `strict`. See
[Handle warnings and errors](../how-to/handle-warnings-and-errors.md).

Only what makes the result meaningless is an error: no extract, no account, no balances, a malformed line or an
impossible date.
