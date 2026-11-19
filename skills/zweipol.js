/* Skill: Zweipoltheorie
   Quellen: Vorlesung Kapitel 2 (Prof. Mehler), TUT 03/04, Klausur SS 2016 Aufgabe 1.
   Alle Zahlenwerte wurden per Netzwerkrechnung (Knotenanalyse) gegengeprüft. */
(function () {
  const C = Circuit, fig = C.figure;

  /* ---- Netzwerke ---- */
  const EX1 = [
    { br: [{ t: 'V', n: 'U_q', v: '18 V', d: 'down' }] },
    { series: { n: 'R_1', v: '60 Ω' }, br: [{ t: 'R', n: 'R_2', v: '30 Ω' }] },
    { load: true, br: [{ t: 'R', n: 'R_Last', v: '40 Ω' }] }];
  const EX2 = [
    { br: [{ t: 'V', n: 'U_q', v: '20 V', d: 'down' }, { t: 'R', n: 'R_1', v: '100 Ω' }] },
    { br: [{ t: 'R', n: 'R_2', v: '100 Ω' }] },
    { br: [{ t: 'I', n: 'I_q', v: '50 mA', d: 'up' }] },
    { load: true, br: [{ t: 'R', n: 'R_Last', v: '50 Ω' }] }];
  const DEMO = [
    { br: [{ t: 'V', n: 'U_q', d: 'down' }] },
    { series: { n: 'R_1' }, br: [{ t: 'R', n: 'R_2' }] },
    { br: [{ t: 'I', n: 'I_q', d: 'up' }] }];

  const both = (a, b) => a + b;
  const figs = {
    trenn: () => fig(C.trenn(), 'Jedes Netzwerk lässt sich an zwei Klemmen A–B in einen aktiven und einen passiven Teil trennen.'),
    quellen: () => fig(C.thevenOpen(), 'Reale Spannungsquelle') + fig(C.nortonOpen(), 'Reale Stromquelle'),
    ersatz: () => fig(C.theven({}), 'Spannungsquellenersatzschaltung') + fig(C.norton({}), 'Stromquellenersatzschaltung'),
    demo0: () => fig(C.net({ mode: 'term', cols: DEMO }), 'Aktiver Zweipol (Beispiel)'),
    demo1: () => fig(C.net({ mode: 'ri', cols: DEMO }), 'Quellen ausgeschaltet: U_q wird Draht, I_q bleibt offen'),
    demo2: () => fig(C.net({ mode: 'ul', cols: DEMO }), 'Klemmen offen, Quellen bleiben aktiv'),
    e1: () => fig(C.net({ cols: EX1 }), 'Gegebenes Netzwerk mit Trennstelle'),
    e1ri: () => fig(C.net({ mode: 'ri', cols: EX1 }), 'R_i: Quelle kurzgeschlossen, R_Last entfernt'),
    e1ul: () => fig(C.net({ mode: 'ul', cols: EX1 }), 'U_L: Klemmen offen'),
    e1ers: () => fig(C.theven({ UL: '6 V', Ri: '20 Ω', RL: '40 Ω' }), 'Spannungsquellenersatz') + fig(C.norton({ IK: '300 mA', Ri: '20 Ω', RL: '40 Ω' }), 'Stromquellenersatz'),
    e2: () => fig(C.net({ cols: EX2 }), 'Gegebenes Netzwerk mit Trennstelle'),
    e2ri: () => fig(C.net({ mode: 'ri', cols: EX2 }), 'R_i: U_q wird Draht, I_q wird offen'),
    e2ul: () => fig(C.net({ mode: 'ul', cols: EX2 }), 'U_L: Klemmen offen'),
    e2ers: () => fig(C.theven({ UL: '12,5 V', Ri: '50 Ω', RL: '50 Ω' }), 'Spannungsquellenersatz') + fig(C.norton({ IK: '250 mA', Ri: '50 Ω', RL: '50 Ω' }), 'Stromquellenersatz'),
    e3: () => fig(C.ss16('norm'), 'Klausur ELEK SS 2016, Aufgabe 1. R_3 ist der Lastwiderstand.'),
    e3ri: () => fig(C.ss16('ri'), 'R_i: Spannungsquellen Drähte, I_C1 offen. Hell: R_1, R_2, R_6 ohne Beitrag'),
    e3ul: () => fig(C.ss16('ul'), 'U_L: R_3 entfernt, Klemmen offen'),
    e3ers: () => fig(C.theven({ UL: '60 V', Ri: '200 Ω', RL: '100 Ω', ln: 'R_3' }), 'Spannungsquellenersatz') + fig(C.norton({ IK: '300 mA', Ri: '200 Ω', RL: '100 Ω', ln: 'R_3' }), 'Stromquellenersatz')
  };

  /* ---- Kapitel ---- */
  const chapters = [
    {
      id: 'idee', group: 'Konzept', title: 'Die Idee',
      body: `
        <p>Du hast ein Netzwerk mit mehreren Quellen und suchst den Strom durch <b>ein einziges Bauteil</b>. Alle Maschen- und Knotengleichungen aufzustellen wäre viel Arbeit.</p>
        <p>Die Zweipoltheorie spart sie dir: Du <b>trennst</b> das gesuchte Bauteil heraus. Der Rest des Netzwerks verhält sich an den beiden Klemmen A und B wie <b>eine einzige reale Quelle</b>. Mit dieser Ersatzquelle ist der Strom nur noch ein Einmal-Rechnen.</p>
        {{fig:trenn}}
        <ul>
          <li><b>Aktiver Zweipol:</b> enthält alle Quellen.</li>
          <li><b>Passiver Zweipol:</b> enthält nur Widerstände (meist ist es das herausgelöste Bauteil).</li>
          <li>Die einzige Bedingung an die Trennstelle: <b>alle Quellen liegen auf derselben Seite</b>.</li>
        </ul>`,
      steps: [{
        type: 'choice', q: 'Was muss für die Trennstelle gelten?',
        options: [
          { t: 'Alle Quellen müssen im aktiven Zweipol liegen.', ok: true },
          { t: 'Jede Quelle bildet einen eigenen Zweipol.', why: 'Es gibt genau einen aktiven Zweipol, der alle Quellen enthält.' },
          { t: 'Die Trennstelle muss in der Mitte des Netzwerks liegen.', why: 'Wo die Trennstelle liegt, ist egal, solange die Bedingung für die Quellen stimmt.' },
          { t: 'Der passive Zweipol darf auch eine Quelle enthalten.', why: 'Dann wäre er nicht mehr passiv. Quellen gehören alle auf die aktive Seite.' }],
        result: 'Alle Quellen liegen im aktiven Zweipol.',
        hints: [
          'Das Wort „aktiv“ ist der Schlüssel. Was macht einen Zweipol aktiv?',
          'Es geht um die Quellen. Auf welche Seite der Trennstelle müssen sie?',
          'Der passive Zweipol darf nur Widerstände enthalten. Damit bleibt für die Quellen nur ein möglicher Ort.',
          '<p>Von vorn: Ein Zweipol ist ein Teilnetz mit genau zwei Klemmen. Er heißt <b>aktiv</b>, wenn er Quellen enthält, und <b>passiv</b>, wenn er nur Widerstände enthält.</p><p>Wir wollen den aktiven Teil später durch eine einzige Ersatzquelle ersetzen. Das geht nur, wenn wirklich <b>alle</b> Quellen dort liegen. Antwort: „Alle Quellen müssen im aktiven Zweipol liegen.“</p>']
      }]
    },
    {
      id: 'quellen', group: 'Konzept', title: 'Reale Quellen',
      body: `
        <p>Ideale Quellen gibt es nur auf dem Papier. Eine reale Quelle hat einen <b>Innenwiderstand R_i</b> und lässt sich auf zwei gleichwertige Arten zeichnen:</p>
        {{fig:quellen}}
        <p>Zwei Messfälle beschreiben sie vollständig:</p>
        <ul>
          <li><b>Leerlauf</b> (nichts angeschlossen): An den Klemmen liegt die <b>Leerlaufspannung U_L</b>.</li>
          <li><b>Kurzschluss</b> (Klemmen verbunden): Es fließt der <b>Kurzschlussstrom I_K</b>.</li>
        </ul>
        <p>Beide Formen sind austauschbar, mit demselben R_i:</p>
        <div class="formula">I_K = U_L / R_i <span>Kurzschlussstrom</span></div>
        <div class="formula">U_L = I_K · R_i <span>Leerlaufspannung</span></div>
        <p class="note">Du darfst dir die Form frei aussuchen. Beide funktionieren immer.</p>`,
      steps: [{
        q: 'Eine reale Spannungsquelle hat U_L = 12 V und R_i = 4 Ω. Wie groß ist ihr Kurzschlussstrom I_K?',
        unit: 'A', answer: 3, result: 'I_K = 3 A',
        hints: [
          'Beim Kurzschluss bleibt nur noch R_i im Stromkreis übrig.',
          'Ohmsches Gesetz am Innenwiderstand: Die ganze Quellenspannung liegt an R_i.',
          'I_K = U_L / R_i. Setze 12 V und 4 Ω ein.',
          '<p>Kurzschluss heißt: Die Klemmen sind verbunden, der Lastwiderstand ist 0 Ω. Der einzige Widerstand im Kreis ist R_i = 4 Ω.</p><p>An R_i liegt die volle Quellenspannung U_L = 12 V. Also I_K = 12 V / 4 Ω = <b>3 A</b>.</p>']
      }]
    },
    {
      id: 'rezept', group: 'Konzept', title: 'Das Rezept',
      body: `
        <p>Der Ablauf bleibt immer gleich:</p>
        <ol>
          <li><b>Trennstelle festlegen</b> und den aktiven Teil abzeichnen.</li>
          <li><b>Ersatzschaltung wählen:</b> Spannungsquelle (U_L, R_i) oder Stromquelle (I_K, R_i).</li>
          <li><b>R_i bestimmen</b> (bei beiden Formen identisch).</li>
          <li><b>U_L bestimmen</b> (Spannungsform) oder <b>I_K bestimmen</b> (Stromform).</li>
          <li><b>Zusammenschalten:</b> Ersatzquelle plus herausgelöstes Bauteil.</li>
          <li><b>Gesuchten Teilstrom</b> ausrechnen.</li>
        </ol>
        {{fig:ersatz}}
        <div class="formula">I_Last = U_L / (R_i + R_Last) <span>Spannungsquellenersatz</span></div>
        <div class="formula">I_Last = I_K · R_i / (R_i + R_Last) <span>Stromquellenersatz (Stromteiler)</span></div>
        <p>In den Klausuren verlangt Aufgabe a) fast immer die Spannungsform. Aufgabe b) will dann zusätzlich die Stromform mit Zahlenwerten.</p>`,
      steps: [{
        q: 'Eine Ersatzspannungsquelle hat U_L = 10 V und R_i = 20 Ω. Daran hängt R_Last = 30 Ω. Wie groß ist I_Last?',
        unit: 'mA', answer: 200, result: 'I_Last = 200 mA',
        hints: [
          'Nach dem Zusammenschalten ist es ein einfacher Stromkreis mit einer Quelle.',
          'R_i und R_Last liegen in Reihe an der Spannung U_L.',
          'I_Last = U_L / (R_i + R_Last). Setze die drei Werte ein und achte auf die Einheit.',
          '<p>Reihenschaltung: R_i + R_Last = 20 Ω + 30 Ω = 50 Ω.</p><p>Die Spannung U_L = 10 V liegt an dieser Reihenschaltung: I = 10 V / 50 Ω = 0,2 A = <b>200 mA</b>.</p>']
      }]
    },
    {
      id: 'ri', group: 'Konzept', title: 'R_i bestimmen',
      body: `
        <p>Den Innenwiderstand bekommst du, indem du alle Quellen <b>ausschaltest</b> und den Widerstand zwischen A und B betrachtest, so als wäre der passive Teil weggedacht.</p>
        <table class="mini">
          <tr><td><b>Spannungsquelle</b></td><td>→ kurzschließen (durch einen Draht ersetzen)</td></tr>
          <tr><td><b>Stromquelle</b></td><td>→ leerlaufen lassen (offen lassen)</td></tr>
        </table>
        <p>Dann zeichnest du das Netzwerk neu und überlegst, wo der Strom langgehen kann:</p>
        <ul>
          <li>Strom nimmt immer den Weg <b>ohne Widerstand</b>.</li>
          <li>Strom fließt nie in <b>Sackgassen</b>. Ein Widerstand ohne geschlossenen Weg trägt nichts bei.</li>
        </ul>
        {{fig:demo0+demo1}}
        <p>Hier bleibt nach dem Ausschalten nur R_1 parallel zu R_2 übrig, also R_i = R_1 ∥ R_2.</p>`,
      steps: [{
        type: 'choice', q: 'Im aktiven Zweipol steckt eine Stromquelle. Was machst du mit ihr, wenn du R_i bestimmst?',
        options: [
          { t: 'Offen lassen (Unterbrechung).', ok: true },
          { t: 'Kurzschließen (Draht).', why: 'Kurzschließen machst du mit Spannungsquellen. Eine ideale Stromquelle hat unendlichen Innenwiderstand.' },
          { t: 'Durch ihren Innenwiderstand ersetzen, den du nachmessen musst.', why: 'Ideale Quellen haben keinen Innenwiderstand im Schaltbild. Du schaltest sie einfach aus.' },
          { t: 'Unverändert lassen.', why: 'Für R_i müssen alle Quellen ausgeschaltet sein.' }],
        result: 'Stromquelle: offen lassen.',
        hints: [
          'Eine ausgeschaltete Stromquelle liefert keinen Strom mehr. Wie sieht ein Bauteil aus, durch das gar kein Strom fließt?',
          'Merksatz: Spannungsquelle → Draht, Stromquelle → Lücke.',
          'Die Stromquelle gibt ihren Strom vor. Ohne Strom bleibt nur eine Unterbrechung der Leitung übrig.',
          '<p>Beim Ausschalten ersetzt du eine Quelle durch das, was sie „im Ruhezustand“ ist:</p><ul><li>Spannung 0 V → ein Draht (Kurzschluss)</li><li>Strom 0 A → eine Unterbrechung (offen)</li></ul><p>Antwort: Stromquelle offen lassen.</p>']
      }]
    },
    {
      id: 'ul', group: 'Konzept', title: 'U_L bestimmen',
      body: `
        <p>Für die Leerlaufspannung bleiben die Quellen <b>aktiv</b>. Du lässt die Klemmen A und B <b>offen</b>, das herausgelöste Bauteil ist weg.</p>
        {{fig:demo2}}
        <ol>
          <li>Aktiven Zweipol mit allen Bauteilen zeichnen, Klemmen offen.</li>
          <li>Alle Ströme und Spannungen einzeichnen.</li>
          <li><b>Masche</b> durch die Klemmen aufstellen (Umlauf, Summe der Spannungen 0) und nach U_L auflösen.</li>
          <li>Fehlende Spannungen mit U = R · I ausdrücken, fehlende Ströme über <b>Knotensätze</b>.</li>
        </ol>
        <p class="note">Durch die offenen Klemmen fließt kein Strom. Ein Widerstand in einer Sackgasse hat deshalb keinen Spannungsabfall und ändert U_L nicht.</p>`,
      steps: [{
        type: 'choice', q: 'Bei offenen Klemmen liegt ein Widerstand in einer Sackgasse. Wie wirkt er sich auf U_L aus?',
        options: [
          { t: 'Gar nicht: Es fließt kein Strom, also fällt keine Spannung ab.', ok: true },
          { t: 'Er verkleinert U_L, weil er Spannung „schluckt“.', why: 'Spannung fällt nur ab, wenn Strom fließt (U = R · I). In der Sackgasse ist I = 0.' },
          { t: 'Er muss in die Masche mit seinem vollen R · U eingehen.', why: 'Mit I = 0 ist U = R · 0 = 0 V.' },
          { t: 'Er macht aus U_L eine Stromquelle.', why: 'Das ändert nichts an der Art der Ersatzquelle.' }],
        result: 'Sackgassen-Widerstände ändern U_L nicht.',
        hints: [
          'Welche Formel verbindet Spannung, Widerstand und Strom?',
          'Frag dich: Wie groß ist der Strom in einer Sackgasse?',
          'U = R · I mit I = 0 ergibt …',
          '<p>Eine Sackgasse hat keinen geschlossenen Weg, der Strom kann nirgends hin. Also I = 0 A.</p><p>Mit U = R · I = R · 0 = 0 V fällt über diesem Widerstand keine Spannung ab. Er taucht in der Masche zwar auf, liefert aber 0 V und kann weggelassen werden.</p>']
      }]
    },

    /* ---------------- Beispiel 1 ---------------- */
    {
      id: 'bsp1', group: 'Beispiele', title: 'Beispiel 1: Spannungsteiler',
      body: `
        <p>Einfacher Start: Eine Spannungsquelle, zwei Widerstände. Gesucht ist der Strom I_Last durch R_Last.</p>
        <div class="given"><span><span class="t">U_q</span> = 18 V</span><span><span class="t">R_1</span> = 60 Ω</span><span><span class="t">R_2</span> = 30 Ω</span><span><span class="t">R_Last</span> = 40 Ω</span></div>
        {{fig:e1}}`,
      finish: 'Beispiel geschafft. Beide Ersatzschaltungen liefern denselben Strom, das ist deine Kontrolle.',
      steps: [
        {
          type: 'choice', q: 'Wo legst du die Trennstelle?',
          options: [
            { t: 'Bei R_Last. R_Last ist der passive Zweipol, die Quelle liegt im aktiven Teil.', ok: true },
            { t: 'Durch R_1, damit R_1 herausgelöst wird.', why: 'Gesucht ist der Strom durch R_Last, also muss R_Last heraus.' },
            { t: 'Direkt an der Quelle U_q.', why: 'Dann würde die Quelle selbst zerschnitten. Sie soll im aktiven Teil bleiben.' }],
          result: 'Trennstelle bei R_Last.',
          hints: ['Was ist gesucht, und welches Bauteil gehört deshalb auf die passive Seite?', 'Das gesuchte Bauteil kommt heraus, alle Quellen bleiben beieinander.', 'R_Last herauslösen. Die Quelle U_q, R_1 und R_2 bleiben im aktiven Zweipol.',
            '<p>Gesucht ist I_Last, der Strom durch R_Last. Also machen wir R_Last zum passiven Zweipol und trennen direkt davor. Die einzige Quelle U_q bleibt mit R_1 und R_2 im aktiven Zweipol.</p>']
        },
        {
          q: 'Bestimme den Innenwiderstand R_i des aktiven Zweipols.', unit: 'Ω', answer: 20, result: 'R_i = 20 Ω', figAfter: 'e1ri',
          after: 'Die Quelle wird zum Draht, R_1 und R_2 liegen zwischen A und B parallel: R_i = 60 Ω · 30 Ω / 90 Ω = 20 Ω.',
          hints: [
            'Schalte die Quelle aus. Was wird aus einer Spannungsquelle ohne Spannung?',
            'Spannungsquelle → Draht. R_Last ist nicht mehr da (Klemmen offen). Wie liegen R_1 und R_2 jetzt zwischen A und B: in Reihe oder parallel?',
            'Nach dem Kurzschluss führt der Draht die obere Klemmenseite von R_1 direkt an die untere. R_i = R_1 ∥ R_2 = R_1 · R_2 / (R_1 + R_2).',
            '<p>Schritt für Schritt: Die Quelle U_q wird durch einen Draht ersetzt. Von Klemme A aus gibt es nun zwei Wege nach B: durch R_2 direkt, und durch R_1 über den Draht zurück. Das ist eine Parallelschaltung.</p><p>R_i = (60 · 30) / (60 + 30) Ω = 1800 / 90 Ω = <b>20 Ω</b>.</p>']
        },
        {
          q: 'Bestimme die Leerlaufspannung U_L zwischen A und B.', unit: 'V', answer: 6, result: 'U_L = 6 V', figAfter: 'e1ul',
          after: 'Klemmen offen: Es fließt I = 18 V / 90 Ω = 0,2 A durch R_1 und R_2. U_L ist die Spannung an R_2: 30 Ω · 0,2 A = 6 V.',
          hints: [
            'Klemmen offen: Fließt durch die Trennstelle ein Strom? Und welcher Stromkreis bleibt dann übrig?',
            'Es bleibt ein einziger Kreis: U_q → R_1 → R_2. U_L liegt direkt an R_2. Das ist ein Spannungsteiler.',
            'Masche: U_q = U_1 + U_L. Mit I = U_q / (R_1 + R_2) wird U_L = R_2 · I.',
            '<p>Kein Strom durch die offenen Klemmen. Also fließt derselbe Strom durch R_1 und R_2: I = 18 V / (60 Ω + 30 Ω) = 0,2 A.</p><p>U_L ist die Spannung an R_2: U_L = R_2 · I = 30 Ω · 0,2 A = <b>6 V</b>.</p>']
        },
        {
          q: 'Rechne die Spannungsform in die Stromform um: Wie groß ist I_K?', unit: 'mA', answer: 300, result: 'I_K = 300 mA',
          hints: ['Die Umrechnung steht im Rezept.', 'Kurzschlussstrom = Leerlaufspannung geteilt durch Innenwiderstand.', 'I_K = U_L / R_i = 6 V / 20 Ω.', '<p>I_K = U_L / R_i = 6 V / 20 Ω = 0,3 A = <b>300 mA</b>.</p>']
        },
        {
          q: 'Schalte die Ersatzquelle mit R_Last zusammen. Wie groß ist I_Last?', unit: 'mA', answer: 100, result: 'I_Last = 100 mA', figAfter: 'e1ers',
          after: 'Kontrolle über die Stromform: I_Last = I_K · R_i / (R_i + R_Last) = 300 mA · 20 / 60 = 100 mA. Gleiches Ergebnis.',
          hints: ['Nach dem Zusammenschalten ist es ein einfacher Kreis.', 'Spannungsform: R_i und R_Last in Reihe an U_L.', 'I_Last = U_L / (R_i + R_Last) = 6 V / (20 Ω + 40 Ω).',
            '<p>R_i + R_Last = 20 Ω + 40 Ω = 60 Ω. Daran liegt U_L = 6 V.</p><p>I_Last = 6 V / 60 Ω = 0,1 A = <b>100 mA</b>.</p>']
        }
      ]
    },

    /* ---------------- Beispiel 2 ---------------- */
    {
      id: 'bsp2', group: 'Beispiele', title: 'Beispiel 2: Spannungs- und Stromquelle',
      body: `
        <p>Jetzt sind beide Quellenarten im Netzwerk. Gesucht ist wieder der Strom durch R_Last.</p>
        <div class="given"><span><span class="t">U_q</span> = 20 V</span><span><span class="t">I_q</span> = 50 mA</span><span><span class="t">R_1</span> = R_2 = 100 Ω</span><span><span class="t">R_Last</span> = 50 Ω</span></div>
        {{fig:e2}}`,
      finish: 'Geschafft. Die Stromquelle hat sich bei R_i „versteckt“ und bei U_L bemerkbar gemacht. Das ist der typische Klausurmix.',
      steps: [
        {
          q: 'Bestimme R_i. Schalte dazu beide Quellen aus.', unit: 'Ω', answer: 50, result: 'R_i = 50 Ω', figAfter: 'e2ri',
          after: 'U_q wird Draht, I_q wird offen. Zwischen A und B liegen R_1 und R_2 parallel: 100 Ω ∥ 100 Ω = 50 Ω.',
          hints: [
            'Welche Quelle wird zum Draht, welche zur Unterbrechung?',
            'U_q → Draht, I_q → offen. Zeichne danach neu: Zwischen welchen zwei Knoten liegen R_1 und R_2?',
            'Beide Widerstände liegen zwischen A und B, also parallel: R_i = R_1 · R_2 / (R_1 + R_2).',
            '<p>Die Spannungsquelle wird zum Draht. R_1 liegt damit direkt zwischen oberem und unterem Knoten. Die Stromquelle wird entfernt (offen). R_2 liegt ebenfalls zwischen oberem und unterem Knoten.</p><p>R_i = 100 Ω ∥ 100 Ω = <b>50 Ω</b>.</p>']
        },
        {
          q: 'Bestimme U_L. Die Klemmen sind offen, beide Quellen bleiben aktiv.', unit: 'V', answer: 12.5, result: 'U_L = 12,5 V', figAfter: 'e2ul',
          after: 'Knotensatz am oberen Knoten: I_q = I_1 + I_2 mit I_1 = (U_L − U_q) / R_1 und I_2 = U_L / R_2. Aufgelöst: U_L = (I_q + U_q / R_1) / (1/R_1 + 1/R_2) = 0,25 A / 0,02 S = 12,5 V.',
          hints: [
            'Zeichne die Ströme ein. Wo kann der Strom I_q hin, wenn die Klemmen offen sind?',
            'Knotensatz am oberen Knoten A: I_q fließt hinein und verteilt sich auf zwei Wege nach unten, durch U_q mit R_1 und durch R_2.',
            'I_q = I_1 + I_2. Dabei ist I_2 = U_L / R_2 und I_1 = (U_L − U_q) / R_1, denn über der Quelle U_q gehen 20 V ab. Nach U_L auflösen.',
            '<p>Einsetzen: 0,05 A = (U_L − 20 V) / 100 Ω + U_L / 100 Ω.</p><p>Mit 100 Ω multipliziert: 5 V = U_L − 20 V + U_L, also 2 · U_L = 25 V.</p><p>U_L = <b>12,5 V</b>.</p>']
        },
        {
          q: 'Wie groß ist der Kurzschlussstrom I_K der Ersatzquelle?', unit: 'mA', answer: 250, result: 'I_K = 250 mA',
          hints: ['Die Umrechnung aus dem Rezept.', 'I_K = U_L / R_i.', '12,5 V geteilt durch 50 Ω.', '<p>I_K = 12,5 V / 50 Ω = 0,25 A = <b>250 mA</b>.</p>']
        },
        {
          q: 'Wie groß ist der Strom I_Last durch R_Last = 50 Ω?', unit: 'mA', answer: 125, result: 'I_Last = 125 mA', figAfter: 'e2ers',
          after: 'Kontrolle mit der Stromform: 250 mA · 50 / (50 + 50) = 125 mA.',
          hints: ['Zusammenschalten: Ersatzquelle mit R_Last.', 'R_i und R_Last in Reihe an U_L.', 'I_Last = U_L / (R_i + R_Last).', '<p>I_Last = 12,5 V / (50 Ω + 50 Ω) = 12,5 V / 100 Ω = 0,125 A = <b>125 mA</b>.</p>']
        }
      ]
    },

    /* ---------------- Beispiel 3: Altklausur ---------------- */
    {
      id: 'bsp3', group: 'Beispiele', title: 'Beispiel 3: Klausur SS 2016',
      body: `
        <p>Original-Aufgabe: Klausur ELEK SS 2016, Aufgabe 1 (auch TUT 3, Aufgabe 2). Berechne den Strom I_3 mit der Zweipoltheorie. R_3 soll als passiver Zweipol herausgetrennt werden.</p>
        <div class="given"><span><span class="t">I_C1</span> = 100 mA</span><span><span class="t">U_q2</span> = 50 V</span><span><span class="t">U_q3</span> = 40 V</span><span><span class="t">alle R</span> = 100 Ω</span></div>
        {{fig:e3}}
        <p class="note">Hier steckt alles drin: drei Quellen, Sackgassen und ein Widerstand, der parallel zu einer idealen Spannungsquelle liegt.</p>`,
      finish: `<p><b>Kontrolle:</b> Die Musterlösung nennt R_i = 200 Ω, U_L = 60 V, I_3 = 200 mA und I_K = 300 mA. Das stimmt mit deinen Werten überein.</p>
        <p><b>Weiter üben</b> (Altklausuren mit Kurzlösung im Ordner Tutorium/Uebungsaufgaben):</p>
        <ul><li>TUT04 A1, Klausur WS 21/22: R_i = 1 kΩ, U_L = 150 V, I_5 = 75 mA, I_K = 150 mA.</li>
        <li>TUT04 A2, Klausur WS 22/23: R_i = 6 kΩ, I_6 = 410 mA.</li></ul>`,
      steps: [
        {
          type: 'choice', q: 'Bei der Bestimmung von R_i: Welche Widerstände tragen tatsächlich etwas bei?',
          options: [
            { t: 'Nur R_4 und R_5, in Reihe.', ok: true },
            { t: 'R_1, R_2, R_4 und R_5.', why: 'R_1 und R_2 hängen an der offenen Stromquelle I_C1. Das ist eine Sackgasse, dort fließt nichts.' },
            { t: 'R_4, R_5 und R_6.', why: 'R_6 liegt parallel zu U_q3, und U_q3 wird beim Ausschalten zum Draht. R_6 ist damit überbrückt.' },
            { t: 'Alle Widerstände außer R_3.', why: 'Schau noch einmal auf Sackgassen und überbrückte Widerstände.' }],
          result: 'Nur R_4 und R_5 tragen bei.',
          figAfter: 'e3ri',
          after: 'I_C1 offen → R_1, R_2 sind Sackgasse. U_q2 und U_q3 werden Drähte, der Draht von U_q3 überbrückt R_6.',
          hints: [
            'Schalte alle drei Quellen aus und zeichne neu. Frag bei jedem Widerstand: Gibt es hier einen geschlossenen Weg zwischen A und B?',
            'U_q2 und U_q3 → Draht. I_C1 → offen. Suche Sackgassen und Widerstände, die durch einen Draht überbrückt werden.',
            'Hinter der offenen I_C1 hängen R_1 und R_2 ohne Rückweg (Sackgasse). R_6 liegt parallel zum Draht von U_q3 und wird kurzgeschlossen (Strom nimmt den Weg ohne Widerstand).',
            '<p>Nach dem Ausschalten bleibt zwischen A und B ein einziger Pfad übrig: von A über R_4 nach rechts, durch den Draht von U_q3 nach unten, über R_5 zurück nach B.</p><p>R_1 und R_2 sind eine Sackgasse. R_6 wird vom Draht überbrückt. Es zählen nur <b>R_4 und R_5 in Reihe</b>.</p>']
        },
        {
          q: 'Wie groß ist R_i?', unit: 'Ω', answer: 200, result: 'R_i = R_4 + R_5 = 200 Ω',
          hints: ['Zwei Widerstände in einem einzigen Pfad.', 'Reihenschaltung: Widerstände addieren sich.', 'R_i = R_4 + R_5.', '<p>R_i = 100 Ω + 100 Ω = <b>200 Ω</b>.</p>']
        },
        {
          q: 'Bestimme U_L zwischen A und B (R_3 entfernt, Quellen aktiv).', unit: 'V', answer: 60, result: 'U_L = 60 V', figAfter: 'e3ul',
          after: 'Der Strom I_C1 = 100 mA fließt komplett über R_4, durch U_q3 und über R_5 zurück. Masche: U_L = U_4 + U_q3 + U_5 = 10 V + 40 V + 10 V = 60 V. R_6 liegt parallel zur idealen Quelle U_q3 und stört nicht.',
          hints: [
            'Klemmen offen: Welchen Weg nimmt der Strom der Stromquelle I_C1?',
            'Der Strom I_C1 fließt über R_4, durch die Quelle U_q3 und R_5. Die Masche für U_L enthält genau diese Bauteile (Klemme A, R_4, U_q3, R_5, Klemme B).',
            'Masche: −U_L + U_4 + U_q3 + U_5 = 0. Mit U_4 = I_C1 · R_4 und U_5 = I_C1 · R_5. Lass R_1, R_2, R_6 und U_q2 weg, sie sind nicht auf dem Weg A–B.',
            '<p>U_4 = 0,1 A · 100 Ω = 10 V und U_5 = 0,1 A · 100 Ω = 10 V.</p><p>U_L = U_4 + U_q3 + U_5 = 10 V + 40 V + 10 V = <b>60 V</b>.</p><p>R_6 ändert nichts: Die ideale Quelle U_q3 hält ihre 40 V, egal was parallel hängt.</p>']
        },
        {
          q: 'Stromform: Wie groß ist I_K?', unit: 'mA', answer: 300, result: 'I_K = 300 mA',
          hints: ['Umrechnung aus dem Rezept.', 'I_K = U_L / R_i.', '60 V geteilt durch 200 Ω.', '<p>I_K = 60 V / 200 Ω = 0,3 A = <b>300 mA</b>.</p>']
        },
        {
          q: 'Schalte R_3 = 100 Ω wieder an. Wie groß ist I_3?', unit: 'mA', answer: 200, result: 'I_3 = 200 mA', figAfter: 'e3ers',
          after: 'Spannungsform: I_3 = 60 V / (200 Ω + 100 Ω) = 200 mA. Stromform: 300 mA · 200 / 300 = 200 mA. Beide Ersatzschaltungen zeichnest du in der Klausur mit Lastwiderstand.',
          hints: ['Zusammenschalten, danach einfacher Kreis.', 'R_i und R_3 in Reihe an U_L.', 'I_3 = U_L / (R_i + R_3).', '<p>I_3 = 60 V / (200 Ω + 100 Ω) = 60 V / 300 Ω = 0,2 A = <b>200 mA</b>.</p>']
        }
      ]
    }
  ];

  Skills.add({
    id: 'zweipol', title: 'Zweipoltheorie', sub: 'Ersatzquellen, R_i, U_L',
    requires: ['knoten'], figs, chapters
  });
})();
