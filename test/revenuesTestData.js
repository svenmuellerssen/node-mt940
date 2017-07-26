var revenues = {
  contractReferenceNumber: 'STARTUMSE',
  bankCode: '10050000',
  accountNumber: '6013216264',
  extracts: [
    {line: '00000/001', saldoStartLine: 'C150115EUR276,02', saldoEndLine: 'C150116EUR211,03', transactions: [
      {line: '1501160116DR14,99N037NONREF', paymentReferenceLine: '006?00SONSTIGER EINZUG?109208?20EC 65421206 150115184614IC5?3030050000?311107713?32SATURN SAGT DANKE 65421206?34011'},
      {line: '1501160116DR50,00N004NONREF//100000155234', paymentReferenceLine: '006?00GELDAUTOMAT?103342?2016.01/15.52UHR 650 897642?3010050000?32GA NR00003342 BLZ10050000 5?34003'},
    ]},
    {line: '00000/001', saldoStartLine: 'C150116EUR211,03', saldoEndLine: 'C150119EUR311,33', transactions: [
      {line: '1501190119DR20,00N033NONREF', paymentReferenceLine: '177?00 ONLINE-UEBERWEISUNG?10 9310?20 SVWZ+Kreditkarte?21 DATUM 17.01.2015, 22.42 UHR?22 1.TAN 258749?30 BELADEBEXXX?31 DE83100500006603197900?32 Sparkasse Berlin?34997'},
      {line: '1501190119DR9,70N037NONREF', paymentReferenceLine: '006?00SONSTIGER EINZUG?109252?20EC 55501776 150115092026IC5?3010090000?317109860012?32BIRKEN-APOTHEKE?34011'},
      {line: '1501190119CR130,00N062NONREF', paymentReferenceLine: '166?00GUTSCHRIFT?109223?20EREF+0000000006563893201501?211502000000901?22SVWZ+6563893.2 BEITR-RUECKZ?23AHLG. RENTE 71259559.0 130,?2400?25ABWA+Debeka Krankenversiche?26rungsverein a. G.?30MALADE51KOB?31DE82570501200000071555?32Debeka Kranken-Versicherung?33-Verein a.G'},
    ]},
    {line: '00000/001', saldoStartLine: 'C150119EUR311,33', saldoEndLine: 'C150121EUR266,13', transactions: [
      {line: '1501210121DR45,20NDDTNONREF', paymentReferenceLine: '105?00FOLGELASTSCHRIFT?109248?20EREF+Zahlbeleg 330062395704?21MREF+DE00020110020000000000?220000005856155?23CRED+DE93ZZZ00000078611?24SVWZ+Rech.Nr. 9807814449 12?250115 Vertragskonto 56167513?2611?30PBNKDEFFXXX?31DE78100100100154819102?32Telekom Deutschland GmbH?34992'},
    ]},
    {line: '00000/001', saldoStartLine: 'C150121EUR266,13', saldoEndLine: 'C150126EUR251,13', transactions: [
      {line: '1501260126DR15,00N037NONREF', paymentReferenceLine: '006?00SONSTIGER EINZUG?109266?20EC 67023479 230115134930IC5?3030040000?31132378100?32C&A BERLIN-M�RKISCHES ZENTR?34011'},
    ]},
    {line: '00000/001', saldoStartLine: 'C150126EUR251,13', saldoEndLine: 'C150128EUR163,79', transactions: [
      {line: '1501280128DR33,40N033NONREF', paymentReferenceLine: '177?00ONLINE-UEBERWEISUNG?109310?20EREF+Dr Hoelter?21KREF+P20150127211305?22SVWZ+Dr Hoelter 66946 Muell?23er 27.01.2015?24DATUM 27.01.2015, 22.13 UHR?251.TAN 660078?26ABWA+Mueller Sven?30NOLADE21STS?31DE40241510051000010155?32Dr. Joachim Hoelter GmbH?34997'},
      {line: '1501280128DR53,94N012NONREF', paymentReferenceLine: '116?00DAUERAUFTRAG?107000?20SVWZ+1275468420001?30PBNKDEFFXXX?31DE85370100500123456503?32GEZ?34997'},
    ]},
    {line: '00000/001', saldoStartLine: 'C150128EUR163,79', saldoEndLine: 'C150130EUR1354,57', transactions: [
      {line: '1501300130DR17,90N011NONREF', paymentReferenceLine: '005?00LASTSCHRIFT?109266?20ELV94091552 29.01 16.47 ME5?3050040000?31582510445?32IKEA 394 BERLIN?34019'},
      {line: '1501300130DR48,93N011NONREF', paymentReferenceLine: '005?00LASTSCHRIFT?109266?20ELV94091526 29.01 17.40 ME5?3050040000?31582510445?32IKEA 394 BERLIN?34019'},
      {line: '1501300130CR1257,61N062NONREF', paymentReferenceLine: '166?00GUTSCHRIFT?109249?20SVWZ+01/2015?30DEUTDEDBBER?31DE69100700240328362900?325stein GmbH'},
    ]},
    {line: '00000/001', saldoStartLine: 'C150130EUR1354,57', saldoEndLine: 'C150202EUR1272,27', transactions: [
      {line: '1502010202DR2,00N024NONREF', paymentReferenceLine: '809?00ENTGELTABSCHLUSS?106666?20Entgeltabrechnung?21siehe Anlage?3010050000'},
      {line: '1502020202CR200,00N070NONREF', paymentReferenceLine: '097?00SEPA UEBERTRAG HABEN?109310?20SVWZ+Ausgleich?30BELADEBEXXX?31DE03100500006013216337?32Mueller, Sven'},
      {line: '1502020202DR60,00N033NONREF', paymentReferenceLine: '177?00ONLINE-UEBERWEISUNG?109310?20SVWZ+Comics?21DATUM 31.01.2015, 21.50 UHR?221.TAN 232620?30BELADEBEXXX?31DE96100500006016676690?32Silke Duerrhauer?34997'},
      {line: '1502020202DR61,67NDDTNONREF', paymentReferenceLine: '105?00FOLGELASTSCHRIFT?109300?20EREF+0400486943?21MREF+0001-200000151468?22CRED+DE75BVG00000050320?23SVWZ+/RFB/A0002165756/0001,?24 02.02.1561,67Abo Rate Zeit?25karteKonto bei uns 2165756?26ABWA+Berliner Verkehrsbetri?27ebe?30BELADEBEXXX?31DE02100500000990004716?32Berliner Verkehrsbetriebe B?33VG -A�R-?34992'},
      {line: '1502020202DR8,37NDDTNONREF', paymentReferenceLine: '105?00FOLGELASTSCHRIFT?109248?20EREF+257150201R000501KV3010?2121726?22MREF+MDEM131619540451?23CRED+DE95ZZZ00000012130?24SVWZ+KV301021726 02/15 - 02?25/15 8,37?30WELADEDDXXX?31DE86300500000000411165?32DKV DEUTSCHE KRANKENVERS.AG?33 40198 DUESSELDORF?34992'},
      {line: '1502020202DR35,00NDDTNONREF', paymentReferenceLine: '105?00FOLGELASTSCHRIFT?109248?20EREF+S/836548649387/6045026?2125856?22MREF+M002000001067932?23CRED+DE70ZZZ00000119765?24SVWZ+S/836548649387/6045026?2525856 Alt-Wittenau 22 Strom?26 Abschlag?30HELADEFFXXX?31DE93500500000090085135?32VATTENFALL EUROPE SALES?34992'},
      {line: '1502020202DR26,74NDDTNONREF', paymentReferenceLine: '105?00FOLGELASTSCHRIFT?109248?20EREF+130150201R000302SV4871?2126965?22MREF+MDEM131653062638?23CRED+DE05ZZZ00000012101?24SVWZ+UP487126965.9 02/15 -?2503/15 26,74?30WELADEDDXXX?31DE21300500000001418516?32ERGO VERSICHERUNG AG 40198?33DUESSELDORF?34992'},
      {line: '1502020202DR66,66NDDTNONREF', paymentReferenceLine: '105?00FOLGELASTSCHRIFT?109248?20EREF+370150201R000301GR4313?2156548?22MREF+MDEM131554034020?23CRED+DE75ZZZ00000012102?24SVWZ+R431356548.9 02/15 - 0?253/15 66,66?30WELADEDDXXX?31DE85300500000071016513?32ERGO LEBENSVERSICHERUNG AG?3340198 DUESSELDORF?34992'},
      {line: '1502020202DR11,68NDDTNONREF', paymentReferenceLine: '105?00FOLGELASTSCHRIFT?109248?20EREF+DEZY182015012101501300?210073891?22MREF+18MREF000000000316493?23CRED+DE16ZZZ00000028684?24SVWZ+Versicherungsnr. 40033?253548 Beitrag Zusatzversiche?26rung?30COBADEFF370?31DE22370400440610060600?32Envivas Krankenversicherung?34992'},
      {line: '1502020202DR10,18N037NONREF//003200776535', paymentReferenceLine: '006?00SONSTIGER EINZUG?109244?20EC 54277225 310115161100IC5?3010020890?31601839580?32709 UMSAETZE?34011'},
    ]}
  ]
};

module.exports = revenues;