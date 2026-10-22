# TODO: Migration nach TypeScript

Stand: 2026-10-22, Branch `feat/typescript-core`

## Ziel
Der Legacy-Code (`src/MT940.js`, `src/parser`, `src/writer`, `src/object`, `src/data`, `index.js`) wird nach TypeScript
migriert und dabei mit den Prinzipien aus `codebase-design` umgebaut (tiefe Module, kleine Interfaces, Seams nur wo
etwas variiert). Der neue Kern `src/core` (`parseStatement`) bleibt ein **unabhängiges** Modul.

## Entscheidungen
| # | Entscheidung | Stand |
|---|---|---|
| E1 | Legacy nutzt den Kern nicht, es gibt keinen Adapter auf dem Kern. Geprüft: weder `src/` noch `test/` noch `index.js` verweisen auf `src/core`, und der Kern importiert nichts aus dem Legacy. | entschieden |
| E2 | Bruch der öffentlichen API ist erlaubt. Die Getter und die `MT940`-Fassade bleiben, Setter und `parseLine` dürfen intern umgebaut werden. | entschieden |
| E9 | Collections: `getExtracts()` und `getTransactions()` liefern `ReadonlyArray<…>` statt einer `LinkedList`. Kein Cursor (`next()`, `hasNext()`), kein `size` (stattdessen `length`), keine `previous()`/`next()`-Verkettung an Extract und Transaction. `getTransactionById` bleibt (`find`). Begründung: Deletion-Test, eine eigene Collection-Klasse wäre ein Durchreicher. | entschieden (User: LinkedList durch etwas Einfacheres ersetzen) |
| E10 | Das Datenmodell ist unveränderlich: Konstruktor mit Datenobjekt statt `setX`/`addX`/`parseLine`, die Getter bleiben. `Transaction.id` und `Extract.getTransactionById` entfallen, denn der Parser hat nie eine ID gesetzt (alle sind 0). `PaymentReference` speichert den GVC immer als Zahl (wie der Kern), der Text kommt aus dem gvc-Modul. | entschieden |
| E11 | XML entfällt. Der alte `writeXML` schreibt eine leere Datei, das README nennt kein Format. Das neue API lehnt `'xml'` mit `WriteError` ab, statt still eine leere Datei zu erzeugen. | entschieden |
| E12 | MT940-Text: `\r\n` als Zeilenende, jeder Extract vollständig (`:20:`, `:25:`, `:28C:`, `:60F:`, `:61:`/`:86:`, `:62F:`, Zeile `-`), `:86:` strukturiert mit `?00`, `?10`, `?20`, `?30`, `?31`, `?32`, `?34`, Text ohne Aufteilung in 27-Zeichen-Teile (`?20` bis `?29`) und ohne Zeilenumbruch bei 65 Zeichen. Der Parser fügt beides wieder zusammen. | entschieden |
| E13 | CSV: Kopfzeile wie im alten Writer (11 Spalten inklusive `Info`), je Transaktion eine Zeile mit der Kontonummer in jeder Zeile, Datum als `TT.MM.JJ` (nicht `toLocaleDateString`), Betrag mit Vorzeichen (Soll und Storno-Haben negativ), Zeilenende `\n`, jedes Feld in `"`, Anführungszeichen im Text verdoppelt. | entschieden |
| E14 | Ein `Revenue` ohne Extract kann nicht geschrieben werden: `WriteError`, wie `parseStatement` bei leerem Inhalt. | entschieden |
| E15 | `:62M:` (Zwischensaldo, es folgen weitere Transaktionen) und `:62F:` (Schlusssaldo) sind beide der Schlusssaldo des Extracts, ebenso `:60M:` und `:60F:` für den Eröffnungssaldo. Begriffe: `:60F:` ist der absolute Anfangssaldo, `:60M:` der Anfang eines Zwischensaldos (Folgeseite), `:62M:` der Zwischensaldo, `:62F:` der Schlusssaldo. Das Modell behält die Unterscheidung: `Saldo` bekommt `intermediate` (optional, Standard `false`) und `isIntermediate()`. Der Parser setzt es für `M`, der Writer schreibt `:60M:`/`:62M:` zurück. Löst E4 für das Legacy-TS, der Kern bleibt unverändert. | entschieden |
| E16 | Das parse-Modul hat keinen Warnings-Kanal (E5 entfällt). Nicht unterstützte Tags werden ignoriert und im README dokumentiert. | entschieden |
| E17 | Das Modell braucht zu jedem `:61:` ein `:86:`. Ein `:61:` ohne `:86:` oder ein `:86:` ohne `:61:` ist ein `ParseError` (der Altcode hat Daten still verworfen oder eine leere Transaktion erzeugt). | entschieden |
| E18 | Eine gemeinsame Klasse `ParseError` in `src/errors/ParseError.ts`. `src/core` re-exportiert sie (Core-Tests unverändert), das parse-Modul importiert sie von dort. `WriteError` bleibt in `src/write`. | entschieden |
| E19 | Fassade: `new MT940({pathToContent?, pathToWrite?, writeAs?})` mit `writeAs: 'mt940' | 'csv'` (Standard `'mt940'`), `parse(): Promise<Revenue>` liest `pathToContent` (UTF-8) und ruft `parseRevenue`, `write(revenue): Promise<void>` formatiert mit `formatRevenue` und schreibt nach `pathToWrite` (`fs.promises`, ersetzt den Inhalt). Die Optionen werden kopiert. Es entfallen: Parser-/Writer-Auswahl und -Konstanten, `gvcData`, `setContent`, `getWriteStatus`, `singleton`. Text parst man direkt mit `parseRevenue`. | entschieden |
| E20 | Fehler: Dateifehler von Node (`ENOENT` usw.), `ParseError` und `WriteError` werden unverändert durchgereicht. Neu ist `ConfigurationError` für einen fehlenden Pfad (bei `parse`/`write`) und ein ungültiges `writeAs` (schon im Konstruktor). Es wird zuerst formatiert und dann geschrieben, ein fehlgeschlagenes `write` legt keine Datei an. | entschieden |
| E21 | Öffentlicher Einstieg `src/index.ts` mit benannten Exporten (`MT940`, `parseRevenue`, `formatRevenue`, `gvcText`, Modellklassen, `ParseError`, `WriteError`, `ConfigurationError`). `require('node-mt940')` liefert damit nicht mehr die Klasse selbst (API-Bruch im Rahmen von E2). `package.json`: `main` und `types` zeigen auf `dist`, `files: ["dist"]`, Skript `build` mit `tsconfig.build.json` (nur `src`, ohne Tests). | entschieden |
| E22 | Die Fassade liegt in `src/facade` (`MT940.ts`), nicht in `src/MT940.ts`, solange das alte `src/MT940.js` besteht (gleicher Name, `require` würde die `.js` finden). | entschieden |
| E23 | **Neuausrichtung (User, nach Rückfrage): Der Kern (`src/core`) ist die einzige Basis.** Es gibt keinen zweiten Parser und kein paralleles Modell. `src/model` und `src/parse` werden gelöscht, Fassade und write arbeiten direkt auf dem `Statement` des Kerns (Cent, ISO-Daten, Warnings). Die Getter-API von `Revenue` entfällt. Ersetzt E1, E6, E10, E17 und E18 und passt E19 bis E22 und E2 an. Hintergrund: Ich hatte E1 („Legacy nutzt den Kern nicht“) als „paralleler Stapel“ gelesen, gemeint war, den Kern als Basis zu nutzen und nichts Neues in Legacy-Struktur anzulegen. | entschieden |
| E7 | Die API ist Promise-basiert (`async`/`await`), es gibt keine Callbacks mehr. Fehler sind Rejections mit getypten `Error`-Klassen (analog zu `ParseError` im Kern), keine `{error: {message, code}}`-Objekte. Reine Funktionen ohne I/O (parse, write, gvc) bleiben synchron und werfen. Nur die Fassade mit Dateizugriff ist asynchron. Die Callback-Tests (`testParseSparkasse.js`, `testMT940.js`) beschreiben die alte Schnittstelle und werden mit Aufgabe 7 und 8 am neuen Interface neu geschrieben. | entschieden |
| E8 | Die Fassade wird über ein Options-Objekt im Konstruktor konfiguriert (Parser, Writer, Pfade, Format). Die verketteten Setter (`setParser`, `setWriter`, `setWriteAs`, `setConfiguration`) und `MT940.singleton` entfallen. Die Fassade ist unveränderlich. | entschieden |
| E3 | Altfehler F1 bis F8 werden behoben (je ein vom User bestätigter Test), F9 bleibt (öffentliche API). | entschieden |
| E4 | `:62M:` als Ersatz für `:62F:` im Kern akzeptieren (README, "Known limitations"). Ändert die Core-Tests `P16` und `P20`. | **offen** |
| E5 | Legacy-Parser: Warnings als `revenue.warnings` anhängen? Gilt nur, falls der Legacy-Parser sie überhaupt bekommt (er nutzt den Kern nicht). | **offen**, vermutlich hinfällig |
| E6 | Verhältnis Legacy-TS zu Kern: Zwei Parser für dasselbe Format bedeuten doppelte Logik. Nach Aufgabe 8 per ADR entscheiden, welcher bleibt. | offen, Aufgabe 9 |

## Zielbild (Deletion-Test) (überholt durch E23: es gibt keine eigenen Module `parse` und `Datenmodell`, der Kern ist die Basis)
| Modul | Interface | Anmerkung |
|---|---|---|
| parse | Text rein, `Revenue` oder Fehler raus | Reine Funktion ohne `fs` und `async`. Bündelt `Saldo.parseLine`, `Transaction.parseLine`, `PaymentReference.parseLine` und `parser/Sparkasse.js`. |
| write | `Revenue` und Format (`text`, `csv`, `xml`) rein, String raus | Rein und ohne Datei-I/O. Die Formate sind eine echte Seam. |
| gvc | Lookup-Funktion | Ersetzt `GVCode`, `GVCList` (Singleton mit globalem Zustand) und `data/gvc.js`. |
| Datenmodell | `Revenue`, `Extract`, `Transaction`, `Saldo`, `PaymentReference` mit den dokumentierten Gettern | Ohne Parse-Logik, mit eigener Collection statt `node-linkedlist`. |
| MT940-Fassade | Konfiguration, `parse(): Promise<Revenue>`, `write(revenue): Promise<void>` | Dateizugriff über `fs.promises` liegt hier, `fs` ist der einzige Adapter. Keine Callbacks. |

`parser/Default` und `writer/Default` sind No-ops. Mit nur einem echten Adapter wären sie eine hypothetische Seam und
werden zu Konfigurationswerten der Fassade.

## Aufgaben nach Priorität
Regeln:
- **In `.js`-Dateien wird nichts mehr geändert**, außer sie werden gelöscht. Alle Fixes und Umbauten entstehen in neuen `.ts`-Modulen.
- Tests nach TDD. Vorstellen, einzeln vom User bestätigen lassen, anlegen, erst dann Produktivcode.
- Tests entstehen am Interface des neuen Moduls (replace, don't layer). Characterization-Tests für alten Code, der ohnehin ersetzt wird, schreiben wir nicht.
- Commits ohne `Co-Authored-By`. Unit-Tests flacher Module werden erst gelöscht, wenn Tests am neuen Interface existieren.

- [x] **1. Tests hermetisch machen.** Erledigt. Ursache von `EACCES` war F7 (`mode: 0x666` legt Dateien so an, dass der Besitzer sie nicht lesen oder überschreiben darf). `test/testMT940.js` schreibt in ein Temp-Verzeichnis (`before`/`after`).
- [x] **2. Abhängigkeiten ablösen (ohne `.js` anzufassen).** Erledigt, soweit es ohne Port geht: E9 ist entschieden und umgesetzt (`ReadonlyArray` im Datenmodell, keine `node-linkedlist` mehr in `src/model`). Das Entfernen aus `package.json` bleibt Teil von Aufgabe 9. `ring`, `node-linkedlist`, `async` und `underscore` verschwinden nicht in einem eigenen Schritt, sondern mit dem TS-Port des jeweiligen Moduls (`ring.instance` wird `instanceof`, `async.auto` wird `async`/`await`, `underscore` wird `Array`-Methoden). Übrig bleibt die Entscheidung E9 (Collections) und am Ende das Entfernen aus `package.json` (Aufgabe 9).
- [x] **3. Spezifikation der Ausgabe festlegen.** Erledigt: Tests W1 bis W10 in `test/write/testFormatRevenue.ts`, umgesetzt in `src/write` (`formatRevenue(revenue, 'mt940' | 'csv'): string`, `WriteError`). Intern getrennt in `formatMt940` und `formatCsv`, nicht exportiert. Zwei Mutationen (Buchungsdatum nicht auf `MMDD` gekürzt, Soll nicht negativ) werden von den Tests gefunden. Offen: W11 (Round-Trip, nach Aufgabe 7) und die unten genannten ungetesteten Fälle.
- [x] **4. Altfehler beheben, jeweils im neuen TS-Modul.** Erledigt: F1 bis F3 (M4, R17 bis R19), F4 und F11 (W2, W4), F5, F7 (S9, Standardrechte von `fs.writeFile`), F12 (M5, gvc), F13 (W7 bis W9). F6, F8 und F10 entfallen durch den Umbau. F9 bleibt bewusst (öffentliche API).
- [x] **5. gvc-Modul (Blatt).** Erledigt: `src/gvc` (`gvcText(code)`), Tests G1 bis G3 in `test/gvc/testGvc.ts`. Die Daten in `src/gvc/gvcData.ts` stammen aus `src/data/gvc.js` (44 Codes, nur Code 6 hat einen Text). Das ist ein Platzhalter-Bestand, die Texte fehlen.
- [x] **6. Datenmodell nach TS.** Erledigt: `src/model` (`Saldo`, `Transaction`, `PaymentReference`, `Extract`, `Revenue`), unveränderlich mit Konstruktor und Datenobjekt (E10), Collections als `ReadonlyArray` (E9). Tests M1 bis M7 in `test/model`, Testdaten in `test/model/modelData.ts`. Abweichungen zum Altcode: `primanotaNumber` ist ein String (der Altcode hat per `parseInt` führende Nullen verloren), `Revenue.bankCode` und `Revenue.accountNumber` entfallen (der Parser hat sie nie gesetzt), `getValutaAsTimestamp` und `getTypeString` entfallen. T1 und T2 sind als M4 umgezogen und aus `test/testTransaction.js` entfernt.
- [x] **7. parse-Modul.** Erledigt: `parseRevenue(text): Revenue` in `src/parse` (intern `parseRevenue.ts` und `fieldParsers.ts`, exportiert wird nur `parseRevenue`). Tests R1 bis R22 in `test/parse/testParseRevenue.ts`, dazu M8 (`Saldo.isIntermediate`) und W15 (Writer schreibt `:60M:`/`:62M:`). `ParseError` liegt jetzt in `src/errors` und wird vom Kern re-exportiert. Fünf Mutationen am Parser werden von den Tests gefunden (Jahreskorrektur, Zwischensaldo, `:61:` ohne `:86:`, Folgezeilen, Bindestrich am Zeilenende). Nachgezogen: R23 bis R25 und die Round-Trip-Tests W11, W11b, W11c in `test/roundTrip/testRoundTrip.ts` (gemeinsame Hilfe `test/helpers/plain.ts`).
- [x] **8. MT940-Fassade.** Erledigt: `MT940` in `src/facade` (`new MT940({pathToContent, pathToWrite, writeAs})`, `parse(): Promise<Revenue>`, `write(revenue): Promise<void>`), `ConfigurationError`, öffentlicher Einstieg `src/index.ts` mit benannten Exporten. `package.json`: `main` und `types` zeigen auf `dist`, `files`, Skripte `build` und `prepublishOnly`, dazu `tsconfig.build.json`. Tests S1 bis S14 in `test/facade/testMT940.ts`, acht Mutationen werden gefunden. Build geprüft: `npm run build`, dann `require('./dist')` und `parse()` mit dem Fixture. Das Skip-Platzhalter-Test T7 ist durch S9 ersetzt und entfernt.
## Neuausrichtung: Kern als einzige Basis (E23)
Die Aufgaben 5 bis 8 oben sind als paralleler Stapel gebaut worden und werden hier in den Kern überführt. Vorher wird der jetzige Stand per WIP-Commit gesichert (er ist größtenteils untracked, ein Löschen wäre endgültig). Tests nach TDD wie bisher.

- [x] **N0. WIP-Commit des jetzigen Stands.** Erledigt: Commit `25311ef` (ohne `Co-Authored-By`), `src/model`, `src/parse` und ihre Tests sind als Vorlage in der Historie.
- [x] **N1. Kern erweitern.** Erledigt: `Balance.intermediate`, `:62M:` wird als Schlusssaldo gelesen, Tests C1 bis C9 in `test/core/testParseStatement.ts`, P4, P12 und P20 angepasst (`:62M:` ist kein unterstützter-Tag-Fall mehr, `:65:` ersetzt es). Acht Mutationen werden gefunden. Der README-Abschnitt "Known limitations" zu `:62M:` ist entfernt. Nicht übernommen: R22 (der Kern behält "behalten und melden", strict wirft), damit entfällt E17.
- [x] **N2. write auf dem Statement.** Erledigt: `formatStatement(statement, 'mt940' | 'csv')` in `src/write` (intern `formatMt940`, `formatCsv`, `amount`), Tests W1 bis W17 in `test/write/testFormatStatement.ts`. `formatRevenue` und sein alter Test sind entfernt. Neu gegenüber dem Stapel: W2b (Typcodes), W16 (Transaktion ohne Zahlungsinformation ohne `:86:`), W17 (Cent-Beträge).
- [x] **N3. Round-Trip auf dem Kern.** Erledigt: RT1 bis RT4 in `test/roundTrip/testRoundTrip.ts` (Fixture, Zwischensalden, unstrukturiertes `:86:`, Transaktion ohne `:86:`).
- [x] **N4. Fassade auf dem Statement.** Erledigt: `MT940.parse(): Promise<Statement>` und `write(statement)`, neue Option `strict`, Tests S1 bis S16 in `test/facade/testMT940.ts`. `ParseError` zieht in N6 zurück nach `src/core` (Housekeeping, User informiert).
- [x] **N5. Öffentlicher Einstieg und Build.** Erledigt: `src/index.ts` exportiert `MT940`, `MT940Options`, `ConfigurationError`, `parseStatement`, `ParseError`, die Typen des Kerns, `formatStatement`, `Format`, `WriteError` und `gvcText`. Build geprüft (`npm run build`, `require('./dist')`, `parse()` mit dem Fixture).
- [x] **N6. Doppelten Stapel entfernt.** Erledigt: `src/model`, `src/parse`, `src/errors`, `test/model`, `test/parse` und `test/helpers` sind gelöscht (37 Testfälle, ihr Gegenstück steht im Kern: P1 bis P23 und C1 bis C9, R22 entfällt bewusst). `ParseError` liegt wieder in `src/core/ParseError.ts`. `src/gvc` bleibt. Der alte Stand ist im WIP-Commit `25311ef` wiederherstellbar. Typecheck sauber, Build und `require('./dist')` geprüft.
- [x] **N7 = Aufgabe 9 (angepasst).** Erledigt, bis auf die Befunde des `docu-check` (siehe unten): alle alten `.js`-Dateien und ihre Tests gelöscht (`src/MT940.js`, `src/parser`, `src/writer`, `src/object`, `src/data`, `index.js`, `test/*.js`), `ring`, `node-linkedlist`, `async` und `underscore` aus `package.json` und `package-lock.json` entfernt (die Bibliothek hat keine Laufzeit-Abhängigkeiten), `.mocharc.json` und `tsconfig.json` auf TypeScript reduziert, README neu geschrieben (neue API, Migrationstabelle von 0.1.x), ADR `docs/adr/0001-core-is-the-single-basis.md`. `docu-check --full`: alle 19 geprüften Aussagen der README stimmen mit dem Code überein, die Quick-Start-Snippets kompilieren.

- [x] **9. Aufräumen.** Siehe N7.

Optional vor 7 und 8: "Design it twice" für das Interface von parse und write (parallele Sub-Agents).

## Dokumentation (Diátaxis) und Befunde des docu-check
Die Doku liegt in `docs/` (Index `docs/index.md`), die README ist Überblick mit Links: Tutorial (`tutorials/getting-started.md`), How-to (`quick-start.md`, `read-and-write-files.md`, `handle-warnings-and-errors.md`, `migrate-from-0.1.md`), Reference (`statement.md`, `parse-statement.md`, `format-statement.md`, `mt940-class.md`, `errors.md`, `gvc-text.md`), Explanation (`architecture.md` mit drei Mermaid-Diagrammen, `data-model.md`, `multi-page-statements.md`) und die ADR. Alle Codebeispiele und Aussagen wurden gegen den Build ausgeführt, die 73 Links und Anker sind geprüft, die Mermaid-Diagramme parsen mit dem echten Parser (die grafische Darstellung ist nicht angesehen).

Behoben: `.gitignore` (alter Writer-Eintrag), Zahlen im README (jetzt in `docs/reference/gvc-text.md` ohne Zahl), `engines` (`>=18`, nur mit Node 20 getestet, Entscheidung des Entwicklers), "Contributing"-Hinweis in der README, "Version 1.0"-Formulierung (jetzt "this version").

Alle Befunde sind erledigt:
- ~~**Lizenz:**~~ LGPL v3 gewollt (User): `LICENSE` enthält den LGPL-Text (von gnu.org), der alte GPL-Text liegt als `COPYING`, `package.json` sagt `LGPL-3.0-or-later`.
- ~~**Version und Changelog:**~~ `package.json` steht auf 1.0.0, `CHANGELOG.md` ist angelegt und wird mitgeliefert.
- ~~**ADR 0002**~~ zur öffentlichen API: `docs/adr/0002-public-api.md`.

Offen: das Datum von `[1.0.0] - Unreleased` im Changelog bei der Veröffentlichung eintragen.

## Fund beim Schreiben von ADR 2 (erledigt)
- **Parser verwarf Text still:** Teilfelder von `:86:` ohne zweistelligen Code (`?00Warum? Darum`) und mit nicht gelesenem Code (`?11`, `?35`, `?38` mit IBAN, `?64`) verschwanden ohne Warnung. Jetzt meldet `parseStatement` jedes verworfene Teilfeld als `UNKNOWN_SUBFIELD` (Tag `86`, Zeile des `:86:`-Tags). Tests U1 bis U6 in `test/core/testParseStatement.ts`, Doku in `docs/reference/parse-statement.md` und `docs/explanation/data-model.md`, Eintrag im Changelog.

## Später (nicht Teil der Migration)
- **Encoding-Option für Lesen und Schreiben.** Die Fassade liest und schreibt heute fest als UTF-8 (wie der Altcode). Banken liefern MT940-Dateien teils in ISO-8859-1 oder Windows-1252, Umlaute (`ä`, `ö`, `ü`, `ß`) werden dann falsch gelesen. Idee: Option `encoding` im Konstruktor von `MT940` (Standard `'utf8'`, außerdem z. B. `'latin1'`, `'windows-1252'`).
  - Lesen: `latin1` kann Node direkt, `windows-1252` über `TextDecoder('windows-1252')`.
  - Schreiben: für `windows-1252` braucht es voraussichtlich eine Bibliothek (z. B. `iconv-lite`) oder eine eigene Tabelle. Zeichen, die das Ziel-Encoding nicht kennt, müssen als Fehler gemeldet werden, nicht still ersetzt.
  - Optional: BOM erkennen, bei ungültigem UTF-8 mit klarer Meldung scheitern statt `�` zu liefern.
  - Tests: Datei mit `ä` in ISO-8859-1 lesen, Round-Trip schreiben und lesen, ungültiges Zeichen beim Schreiben.
  - Betrifft nur die Fassade (`src/facade`), `parseRevenue` und `formatRevenue` arbeiten weiter mit Text.

## Altfehler-Katalog (Entscheidung E3)
Verifiziert durch Ausführen mit der Eingabe `:61:1501160116DR14,99N037NONREF` (Valuta und Buchung 16.01.2015):

| # | Fehler | Beleg | Empfehlung |
|---|---|---|---|
| F1 | `Transaction.getFormattedValuta()` liefert eine Zahl: `getMonth() + getDay()` ergibt `5` statt eines Datumsstrings (`getDay()` ist zudem der Wochentag). | Ausgabe: `5` | beheben |
| F2 | `Transaction.getFormattedBookingDate()` liefert `getYear() + getMonth() + getDay()` als Zahl: `120` statt `150116`. | Ausgabe: `120` | beheben |
| F3 | `Transaction.parseLine` setzt das Buchungsdatum mit `setMonth` auf einem Datumsobjekt, das noch den Valuta-Tag trägt. Valuta 31.01. und Buchung 01.02. ergibt Buchung 01.03. | Ausgabe: Buchung `2015-02-28T23:00:00.001Z`, also 01.03. lokal | beheben |
| F4 | Sparkasse-Writer (`:61:`-Zeile) baut mit F1 und F2 ein ungültiges MT940. | Folge aus F1 und F2 | beheben |
| F5 | `writer/Sparkasse.js:39` schreibt `revenues = ...` ohne `var` (implizite Global) und prüft danach `revenue`. | gelesen, nicht ausgeführt | beheben |
| F6 | `writeToFile` nutzt `this` auf Modulebene. Sloppy ist es das globale Objekt, unter `strict` `undefined`. Der Callback bekommt damit nicht den Writer. | gelesen, nicht ausgeführt | entfällt mit E7 (kein Callback, kein `this`) |
| F7 | `fs.createWriteStream(path, {mode: 0x666})` ist hex statt octal (`0o666`). Die Dateirechte sind falsch. | `writer/Sparkasse.js:179` | beheben |
| F8 | Fehlerobjekte des Parsers enthalten den Tippfehler `messge`, der CSV-Writer ruft den Callback mit `{}`. | gelesen | entfällt mit E7 (getypte `Error`-Klassen statt Fehlerobjekten) |
| F11 | Die Writer überspringen jeweils das erste Element: `extracts.next()` springt beim ersten Aufruf auf das zweite, ebenso `transactions.hasNext()/next()`. Für das Fixture (2 Extracts) schreibt der Plain-Text-Writer nur `:20:`, `:25:`, `:28C:` und `:60F:` des zweiten Extracts, keine `:61:`, `:86:` oder `:62F:`. Der CSV-Writer überspringt ebenfalls den ersten Extract. | ausgeführt (Ausgabe: `":20:STARTUMSE\n:25:10050000/6013216264\n:28C:00000/001\n:60F:C150116EUR211,03\n\n\n"`) | entfällt als Fehlerklasse mit E9, die erwartete Ausgabe wird in Aufgabe 3 und 8 getestet |
| F12 | `PaymentReference.getGVC()` liefert den String `"null"`, auch für `006`. Der Parser ruft `setGVC(gvc, true)`, das nur bekannte Codes aus dem Singleton `GVCList` übernimmt. Die Liste ist leer, solange niemand `addCode` aufruft (`gvcData` aus der Konfiguration wird nie gelesen, nur `testGVCList` füllt sie). | ausgeführt (`getGVC()` → `"null"`) | beheben im gvc-Modul und `PaymentReference.ts` |
| F13 | Der CSV-Writer (`Extract.toCSVString`) schreibt die Kontonummer nur in die erste Zeile eines Extracts, formatiert Daten mit `toLocaleDateString` (abhängig vom System), schreibt den Betrag ohne Vorzeichen, hat in den Zeilen keine `Info`-Spalte (die Kopfzeile hat sie) und überspringt wegen des Cursors die erste Transaktion (F11). | gelesen, nicht ausgeführt | wird mit E13 behoben |
| F10 | Neu gefunden bei T7: `node-linkedlist` iteriert mit einem internen Cursor (`next()`, `hasNext()`). Nach dem ersten Schreiben ist er am Ende, derselbe `Revenue` lässt sich nicht noch einmal schreiben (`TypeError: Cannot read properties of null (reading 'getBankCode')`). | ausgeführt | entfällt mit Aufgabe 2 und 6 (eigene Collection ohne Cursor, mit Test) |
| F9 | Beträge sind Strings mit Komma (`'276,02'`) und Daten sind lokale `Date`-Objekte. | Teil der öffentlichen API | **bewahren** wegen E2 |

## Zusatzregeln im write-Modul (erledigt, Tests W12a, W12b, W13, W14 in `test/write/testFormatRevenue.ts`)
- Das `?` in der Ausgabe ist ein Trennzeichen, das der Writer selbst schreibt. Ein `?` **im Wert** ist ein eigener Fall.
- Unstrukturiertes `:86:` (GVC `null`): nur der Text wird geschrieben, ein `?` im Text bleibt erhalten. Beginnt der Text mit `\d{3}?`, wirft der Writer `WriteError`.
- Strukturiertes `:86:`: leere Teilfelder entfallen, nur `?00` (Buchungstext) wird immer geschrieben, damit die Zeile strukturiert erkennbar bleibt.
- Ein `?` im Wert eines strukturierten Teilfelds wirft `WriteError` mit dem Namen des Felds.

## Hinweise für den Writer (erledigt in Aufgabe 3)
`getFormattedValuta()` und `getFormattedBookingDate()` liefern beide `YYMMDD` (T1, T2). Die `:61:`-Zeile braucht für das
Buchungsdatum nur `MMDD`. Der Writer muss `getFormattedBookingDate().substring(2)` verwenden, sonst entsteht
`:61:150116150116DR…` statt `:61:1501160116DR…`. Das gehört in den Test T4.

## Bekannter Teststand
Erwartet: 80 grün, 0 rot, 0 pending (nur noch TypeScript-Tests: Kern, write, Round-Trip, Fassade, gvc).
