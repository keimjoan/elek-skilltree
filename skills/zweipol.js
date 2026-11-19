/* Skill: Zweipoltheorie (Version 2: kleinschrittig, mit allen Zwischenschaltbildern)
   Quellen: Vorlesung Kapitel 2 (Prof. Mehler), TUT 03/04, Klausur SS 2016 Aufgabe 1.
   Alle Zahlenwerte wurden per Netzwerkrechnung (Knotenanalyse) gegengeprüft. */
(function () {
  const C = Circuit, fig = C.figure, net = C.net;
  const cur = (x1, y1, x2, y2, lab, lx, ly, a) =>
    `<line class="arrA" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#ahA)"/>` + (lab ? C.tx(lx, ly, lab, a || 'start', 'accT') : '');

  /* ---- Netzwerke ---- */
  const EX1 = [
    { br: [{ t: 'V', n: 'U_q', v: '18 V', d: 'down' }] },
    { series: { n: 'R_1', v: '60 Ω' }, br: [{ t: 'R', n: 'R_2', v: '30 Ω' }] },
    { load: true, br: [{ t: 'R', n: 'R_Last', v: '40 Ω' }] }];
  const EX1U = [
    { br: [{ t: 'V', n: 'U_q', d: 'down' }] },
    { series: { n: 'R_1', v: '60 Ω', u: 'U_1' }, br: [{ t: 'R', n: 'R_2', v: '30 Ω', u: 'U_2' }] }];
  const EX2 = [
    { br: [{ t: 'R', n: 'R_1', v: '100 Ω' }, { t: 'V', n: 'U_q', v: '20 V', d: 'down' }] },
    { br: [{ t: 'R', n: 'R_2', v: '100 Ω' }] },
    { br: [{ t: 'I', n: 'I_q', v: '50 mA', d: 'up' }] },
    { load: true, br: [{ t: 'R', n: 'R_Last', v: '50 Ω' }] }];
  const EX2U = [EX2[0], EX2[1], { br: [{ t: 'I', n: 'I_q', d: 'up' }] }]; // ohne Wert, sonst stößt das Label an den U_L-Pfeil
  const DEMO = [
    { br: [{ t: 'V', n: 'U_q', v: '12 V', d: 'down' }] },
    { series: { n: 'R_1', v: '20 Ω' }, br: [{ t: 'R', n: 'R_2', v: '60 Ω' }] },
    { br: [{ t: 'I', n: 'I_q', v: '50 mA', d: 'up' }] }];

  const figs = {
    /* --- Konzept --- */
    trenn: () => fig(C.trenn(), 'Jedes Netzwerk lässt sich an zwei Klemmen A–B in einen aktiven und einen passiven Teil trennen.'),
    quellen: () => fig(C.thevenOpen(), 'Reale Spannungsquelle: U_L mit R_i in Reihe') + fig(C.nortonOpen(), 'Reale Stromquelle: I_K parallel zu R_i'),
    kennlinie: () => {
      let s = C.pl([[60, 210], [390, 210]]) + C.pl([[60, 210], [60, 24]]);
      s += `<line class="arr" x1="380" y1="210" x2="392" y2="210" marker-end="url(#ah)"/><line class="arr" x1="60" y1="34" x2="60" y2="22" marker-end="url(#ah)"/>`;
      s += C.tx(398, 214, 'U') + C.tx(66, 24, 'I');
      s += `<line class="wire" x1="60" y1="60" x2="300" y2="210" style="stroke-width:2.4"/>`;
      s += C.tx(52, 64, 'I_K', 'end') + C.tx(300, 228, 'U_L', 'middle') + C.tx(70, 48, 'Quellenkennlinie');
      s += `<line class="cut" x1="60" y1="210" x2="300" y2="60"/>` + C.tx(250, 90, 'Lastgerade', 'start', 'accT');
      s += `<line class="cut" x1="180" y1="135" x2="180" y2="210"/><line class="cut" x1="60" y1="135" x2="180" y2="135"/>`;
      s += '<circle class="dot" cx="180" cy="135" r="5" style="fill:var(--acc)"/>' + C.tx(190, 128, 'Arbeitspunkt', 'start', 'accT');
      s += C.tx(180, 228, 'U_Last', 'middle') + C.tx(52, 139, 'I_Last', 'end');
      return fig(C.svg(430, 250, s, 'Quellenkennlinie mit Arbeitspunkt'), 'Die Kennlinie läuft von I_K (Kurzschluss) nach U_L (Leerlauf). Eine Last legt den Arbeitspunkt fest.');
    },
    richtung: () => fig(C.theven({}), 'Spannungsquellenersatz: U_L zeigt von A nach B, I_Last fließt außen von A nach B') +
      fig(C.norton({}), 'Stromquellenersatz: I_K zeigt zu A, damit außen derselbe Strom von A nach B fließt'),
    ersatz: () => fig(C.theven({ noCur: true }), 'Spannungsquellenersatzschaltung') + fig(C.norton({ noCur: true }), 'Stromquellenersatzschaltung'),
    demo0: () => fig(net({ mode: 'term', cols: DEMO }), 'Aktiver Zweipol (Beispiel)'),
    demo1: () => fig(net({ mode: 'ri', cols: DEMO }), 'Quellen aus: U_q wird Draht, I_q bleibt offen'),
    uldemo: () => fig(net({ mode: 'ul', cols: [{ br: [{ t: 'I', n: 'I_q', v: '20 mA', d: 'up' }] }, { br: [{ t: 'R', n: 'R', v: '150 Ω' }] }],
      extra: cur(164, 62, 164, 92, 'I', 172, 82) }), 'Offene Klemmen: Der Strom I_q hat nur einen Weg, durch R'),

    /* --- Beispiel 1 --- */
    e1: () => fig(net({ cols: EX1 }), 'Gegebenes Netzwerk. Trennstelle vor R_Last, Klemmen A (oben) und B (unten)'),
    e1term: () => fig(net({ mode: 'term', cols: EX1 }), 'Der aktive Zweipol allein: U_q, R_1, R_2 und zwei offene Klemmen'),
    e1ri0: () => fig(net({ mode: 'ri', cols: EX1 }), 'Quelle durch Draht ersetzt, R_Last weg: Zwischen A und B liegen R_1 und R_2 (R_i gesucht)'),
    e1ul: () => fig(net({ mode: 'ul', cols: EX1U, extra: cur(44, 98, 44, 66, 'I', 36, 84, 'end') + cur(130, 50, 158, 50) + cur(164, 62, 164, 92) + cur(140, 190, 92, 190) }),
      'Offene Klemmen: Ein einziger Kreis. Der Strom I fließt im Uhrzeigersinn, U_L = U_2'),
    e1u: () => fig(C.theven({ UL: '6 V', Ri: '20 Ω', RL: '40 Ω' }), 'Spannungsquellenersatz mit angeschlossener Last'),
    e1i: () => fig(C.norton({ IK: '300 mA', Ri: '20 Ω', RL: '40 Ω' }), 'Stromquellenersatz mit angeschlossener Last'),

    /* --- Beispiel 2 --- */
    e2: () => fig(net({ cols: EX2 }), 'Gegebenes Netzwerk. Trennstelle vor R_Last'),
    e2term: () => fig(net({ mode: 'term', cols: EX2 }), 'Der aktive Zweipol allein: U_q mit R_1, R_2 und I_q'),
    e2ri0: () => fig(net({ mode: 'ri', cols: EX2 }), 'U_q wird Draht, I_q wird offen: R_1 und R_2 liegen zwischen A und B'),
    e2ul: () => fig(net({ mode: 'ul', cols: EX2U, extra: cur(44, 74, 44, 54, 'I_1', 38, 68, 'end') + cur(164, 62, 164, 92, 'I_2', 172, 82) + cur(284, 98, 284, 62) }),
      'Offene Klemmen: I_q (nach oben) und I_1 laufen in den oberen Knoten, I_2 fließt durch R_2 nach unten'),
    e2u: () => fig(C.theven({ UL: '12,5 V', Ri: '50 Ω', RL: '50 Ω' }), 'Spannungsquellenersatz mit angeschlossener Last'),
    e2i: () => fig(C.norton({ IK: '250 mA', Ri: '50 Ω', RL: '50 Ω' }), 'Stromquellenersatz mit angeschlossener Last'),

    /* --- Beispiel 3 (Klausur SS 2016) --- */
    e3: () => fig(C.ss16('norm'), 'Klausur ELEK SS 2016, Aufgabe 1. R_3 wird herausgetrennt'),
    e3open: () => fig(C.ss16('open'), 'Der aktive Zweipol allein: R_3 weg, Klemmen A und B offen'),
    e3ri0: () => fig(C.ss16('ri0'), 'Quellen ausgeschaltet: U_q2 und U_q3 sind Drähte, I_C1 ist offen'),
    e3ri: () => fig(C.ss16('ri'), 'Blau: der einzige Strompfad zwischen A und B (R_4 und R_5). Hell: Sackgassen R_1, R_2 und der überbrückte R_6'),
    e3ul: () => fig(C.ss16('ul'), 'Offene Klemmen: I_C1 = 100 mA fließt im Kreis R_2, R_4, Block U_q3/R_6, R_5, U_q2, R_1'),
    e3u: () => fig(C.theven({ UL: '60 V', Ri: '200 Ω', RL: '100 Ω', ln: 'R_3', il: 'I_3', un: 'U_3' }), 'Spannungsquellenersatz mit R_3'),
    e3i: () => fig(C.norton({ IK: '300 mA', Ri: '200 Ω', RL: '100 Ω', ln: 'R_3', il: 'I_3', un: 'U_3' }), 'Stromquellenersatz mit R_3')
  };

  const chapters = [
    /* ================= KONZEPT ================= */
    {
      id: 'idee', group: 'Konzept', title: 'Die Idee',
      body: `
        <p>Du hast ein Netzwerk mit mehreren Quellen und suchst den Strom durch <b>ein einziges Bauteil</b>. Alle Maschen- und Knotengleichungen aufzustellen wäre viel Arbeit.</p>
        <p>Die Zweipoltheorie spart sie dir: Du <b>trennst</b> das gesuchte Bauteil heraus. Der Rest des Netzwerks verhält sich an den beiden Klemmen A und B wie <b>eine einzige reale Quelle</b>. Mit dieser Ersatzquelle ist der Strom nur noch eine kurze Rechnung.</p>
        {{fig:trenn}}
        <ul>
          <li><b>Aktiver Zweipol:</b> enthält alle Quellen.</li>
          <li><b>Passiver Zweipol:</b> enthält nur Widerstände (meist ist es das herausgelöste Bauteil).</li>
          <li>Die einzige Bedingung an die Trennstelle: <b>alle Quellen liegen auf derselben Seite</b>.</li>
        </ul>
        <h2>Warum darf man das?</h2>
        <p>Alle Bauteile im aktiven Teil sind Quellen und lineare Widerstände. Von außen betrachtet sinkt die Klemmenspannung deshalb <b>linear</b> mit dem Strom, den du entnimmst. Eine Gerade ist durch zwei Zahlen festgelegt. Genau diese zwei Zahlen sind <b>U_L</b> (Leerlaufspannung) und <b>R_i</b> (Innenwiderstand). Mehr musst du über das Innere nicht wissen, solange nur die Last interessiert.</p>`,
      steps: [
        {
          type: 'choice', q: 'Was muss für die Trennstelle gelten?',
          options: [
            { t: 'Alle Quellen müssen im aktiven Zweipol liegen.', ok: true },
            { t: 'Jede Quelle bildet einen eigenen Zweipol.', why: 'Es gibt genau einen aktiven Zweipol, der alle Quellen enthält.' },
            { t: 'Die Trennstelle muss in der Mitte des Netzwerks liegen.', why: 'Wo die Trennstelle liegt, ist egal, solange die Bedingung für die Quellen stimmt.' },
            { t: 'Der passive Zweipol darf auch eine Quelle enthalten.', why: 'Dann wäre er nicht mehr passiv. Quellen gehören alle auf die aktive Seite.' }],
          result: 'Alle Quellen liegen im aktiven Zweipol.', after: 'Nur dann lässt sich der gesamte aktive Teil durch eine einzige Ersatzquelle ersetzen.',
          hints: [
            'Das Wort „aktiv“ ist der Schlüssel. Was macht einen Zweipol aktiv?',
            'Es geht um die Quellen. Auf welche Seite der Trennstelle müssen sie?',
            'Der passive Zweipol darf nur Widerstände enthalten. Damit bleibt für die Quellen nur ein möglicher Ort.',
            '<p>Von vorn: Ein Zweipol ist ein Teilnetz mit genau zwei Klemmen. Er heißt <b>aktiv</b>, wenn er Quellen enthält, und <b>passiv</b>, wenn er nur Widerstände enthält.</p><p>Wir wollen den aktiven Teil später durch eine einzige Ersatzquelle ersetzen. Das geht nur, wenn wirklich <b>alle</b> Quellen dort liegen. Antwort: „Alle Quellen müssen im aktiven Zweipol liegen.“</p>']
        },
        {
          type: 'choice', q: 'Der aktive Zweipol enthält eine Spannungsquelle und eine Stromquelle. Lässt er sich trotzdem durch eine einzige Ersatzquelle ersetzen?',
          options: [
            { t: 'Ja. Es zählt nur, wie sich der Zweipol an den Klemmen verhält, nicht, welche Quellen drinstecken.', ok: true },
            { t: 'Nein, gemischte Quellen brauchen zwei Ersatzquellen.', why: 'Das Verhalten an den Klemmen bleibt eine Gerade (U linear in I). Eine Ersatzquelle reicht immer.' },
            { t: 'Nur wenn alle Quellen vom gleichen Typ sind.', why: 'Der Typ der inneren Quellen spielt keine Rolle.' }],
          result: 'Gemischte Quellen sind kein Problem: eine Ersatzquelle genügt.', after: 'Von außen zählt nur der lineare Zusammenhang zwischen U und I an den Klemmen A–B.',
          hints: ['Denk an die Gerade U(I) an den Klemmen.', 'Von außen sieht man nur U und I an A–B, nicht das Innenleben.', 'Eine Gerade bleibt eine Gerade, egal welche linearen Bauteile dahinter stecken.',
            '<p>Spannungs- und Stromquellen plus Widerstände ergeben an den Klemmen immer einen linearen Zusammenhang zwischen U und I. Der ist durch U_L und R_i vollständig beschrieben. Also genügt <b>eine</b> Ersatzquelle.</p>']
        }
      ]
    },
    {
      id: 'quellen', group: 'Konzept', title: 'Reale Quellen',
      body: `
        <p>Ideale Quellen gibt es nur auf dem Papier. Eine reale Quelle hat einen <b>Innenwiderstand R_i</b> und lässt sich auf zwei gleichwertige Arten zeichnen:</p>
        {{fig:quellen}}
        <p>Zwei Messfälle beschreiben sie vollständig:</p>
        <ul>
          <li><b>Leerlauf</b> (nichts angeschlossen, I = 0): An den Klemmen liegt die <b>Leerlaufspannung U_L</b>.</li>
          <li><b>Kurzschluss</b> (Klemmen verbunden, U = 0): Es fließt der <b>Kurzschlussstrom I_K</b>.</li>
        </ul>
        {{fig:kennlinie}}
        <p>Verbindest du die beiden Punkte, erhältst du die <b>Quellenkennlinie</b>. Aus den beiden Eckpunkten folgt der Innenwiderstand: R_i = U_L / I_K. Schließt du eine Last an, liegt der Betriebspunkt dort, wo die Lastgerade die Kennlinie schneidet (Arbeitspunkt). Das ist der Strom, den wir suchen.</p>
        <p>Beide Formen sind austauschbar, mit demselben R_i:</p>
        <div class="formula">I_K = U_L / R_i <span>Kurzschlussstrom</span></div>
        <div class="formula">U_L = I_K · R_i <span>Leerlaufspannung</span></div>
        <p class="note">Du darfst dir die Form frei aussuchen. Beide funktionieren immer, und beide liefern denselben Strom durch die Last.</p>`,
      steps: [
        {
          q: 'Eine reale Spannungsquelle hat U_L = 12 V und R_i = 4 Ω. Wie groß ist ihr Kurzschlussstrom I_K?',
          unit: 'A', answer: 3, result: 'I_K = 3 A', after: '<b>Warum?</b> Beim Kurzschluss fällt die ganze Quellenspannung an R_i ab, also I_K = U_L / R_i.',
          hints: [
            'Beim Kurzschluss bleibt nur noch R_i im Stromkreis übrig.',
            'Ohmsches Gesetz am Innenwiderstand: Die ganze Quellenspannung liegt an R_i.',
            'I_K = U_L / R_i. Setze 12 V und 4 Ω ein.',
            '<p>Kurzschluss heißt: Die Klemmen sind verbunden, der Lastwiderstand ist 0 Ω. Der einzige Widerstand im Kreis ist R_i = 4 Ω.</p><p>An R_i liegt die volle Quellenspannung U_L = 12 V. Also I_K = 12 V / 4 Ω = <b>3 A</b>.</p>']
        },
        {
          type: 'choice', q: 'Warum ist R_i bei Spannungs- und Stromform dieselbe Zahl?',
          options: [
            { t: 'Beide Formen müssen dieselbe Kennlinie haben, und aus ihren Eckpunkten folgt R_i = U_L / I_K.', ok: true },
            { t: 'Das ist Zufall und gilt nur bei einfachen Schaltungen.', why: 'Es gilt immer. Beide Formen beschreiben dieselbe Quelle, also dieselbe Kennlinie.' },
            { t: 'Weil I_K und U_L gleich groß sind.', why: 'U_L und I_K haben verschiedene Einheiten. Gleich ist nur ihr Quotient R_i.' }],
          result: 'Gleiche Kennlinie, gleiches R_i = U_L / I_K.', after: 'Beide Formen beschreiben dieselbe Quelle, also dieselbe Gerade U(I).',
          hints: ['Beide Formen sollen dieselbe Quelle beschreiben.', 'Dieselbe Quelle heißt: dieselbe Kennlinie U(I) an den Klemmen.', 'Die Kennlinie ist eine Gerade durch die Punkte (U_L | 0) und (0 | I_K). Was folgt daraus für R_i?', '<p>Die Spannungsform und die Stromform sind nur zwei Zeichnungen derselben Quelle. Ihre Kennlinie ist identisch. Aus ihren Eckpunkten ergibt sich R_i = U_L / I_K, also ist der Innenwiderstand bei beiden gleich.</p>']
        },
        {
          q: 'Eine Ersatzstromquelle hat I_K = 2 A und R_i = 5 Ω. Wie groß ist die Leerlaufspannung der gleichwertigen Spannungsquelle?',
          unit: 'V', answer: 10, result: 'U_L = I_K · R_i = 10 V', after: '<b>Warum?</b> Im Leerlauf fließt der ganze Strom I_K durch R_i und erzeugt dort die Spannung R_i · I_K.',
          hints: ['Im Leerlauf fließt der ganze Strom I_K durch R_i.', 'U_L = I_K · R_i.', 'U_L = 2 A · 5 Ω.', '<p>Leerlauf: Die Klemmen sind offen, also muss der Quellenstrom I_K komplett durch R_i. Dort fällt U = R_i · I_K = 5 Ω · 2 A = <b>10 V</b> ab. Das ist U_L.</p>']
        }
      ]
    },
    {
      id: 'richtung', group: 'Konzept', title: 'Richtungen von Strom und Spannung',
      body: `
        <p>Bei der Zweipoltheorie passieren die meisten Vorzeichenfehler. Mit diesen Regeln behältst du den Überblick.</p>
        {{fig:richtung}}
        <h2>Spannungsquellenersatz</h2>
        <ul>
          <li>Der Pfeil von <b>U_L</b> zeigt von <b>A nach B</b> (Plus an A). Die Quelle drückt also den Strom aus der Klemme A heraus.</li>
          <li>Der Strom <b>I_Last</b> fließt außen von A durch die Last nach B (technische Stromrichtung: von + nach −).</li>
          <li>An der Last zeigen Spannungspfeil und Strompfeil in dieselbe Richtung (Verbraucher: positive Leistung).</li>
        </ul>
        <h2>Stromquellenersatz</h2>
        <ul>
          <li>Der Pfeil von <b>I_K</b> zeigt zu <b>A</b>. Dann fließt der Strom außen wieder von A nach B, genau wie bei der Spannungsform. Beide Formen müssen außen dasselbe tun.</li>
          <li>Der Strom teilt sich: Ein Teil fließt in R_i (I_i), der Rest durch die Last (I_Last). Es gilt I_K = I_i + I_Last.</li>
        </ul>
        <h2>Zählpfeile und Vorzeichen</h2>
        <p>Zählpfeile darfst du frei wählen. Kommt ein <b>negativer</b> Wert heraus, fließt der Strom bzw. liegt die Spannung in Wirklichkeit andersherum. Das ist kein Fehler, solange du den Pfeil nicht im Nachhinein änderst. Positiv bedeutet für U_L: A liegt auf höherem Potential als B.</p>
        <p class="note">Beim Umrechnen gehört zusammen: U_L-Pfeil von A nach B und I_K-Pfeil zu A. Wenn du einen der beiden umdrehst, musst du das Vorzeichen in U_L = I_K · R_i mitnehmen.</p>`,
      steps: [
        {
          type: 'choice', q: 'Die Ersatzspannungsquelle hat ihren U_L-Pfeil von A nach B. In welche Richtung fließt der Strom I_Last durch die Last?',
          options: [
            { t: 'Von A durch die Last nach B.', ok: true },
            { t: 'Von B durch die Last nach A.', why: 'Die Quelle hat ihr Plus an A und treibt den Strom von dort in den äußeren Kreis (technische Stromrichtung: von + nach −).' },
            { t: 'Das hängt von R_Last ab.', why: 'Die Richtung wird nur vom Vorzeichen von U_L bestimmt. R_Last ändert nur die Größe des Stroms.' }],
          result: 'I_Last fließt von A durch die Last nach B.', after: 'Technische Stromrichtung: aus dem Pluspol heraus, durch den Verbraucher, zum Minuspol zurück.',
          hints: ['Wo sitzt bei U_L das Plus?', 'Der Strom verlässt die Quelle am Pluspol und läuft von + nach −.', 'Plus ist bei A. Der äußere Kreis führt von A zu B.', '<p>Der Pfeil von U_L zeigt von A nach B, also liegt das Plus an A. In der technischen Stromrichtung fließt der Strom aus dem Pluspol heraus, durch den äußeren Kreis (die Last) und am Minuspol B wieder hinein.</p><p>Antwort: von A durch die Last nach B.</p>']
        },
        {
          type: 'choice', q: 'In welche Richtung zeigt der Pfeil von I_K der Ersatzstromquelle, damit sie dasselbe tut wie die Spannungsform?',
          options: [
            { t: 'Zur Klemme A (nach oben).', ok: true },
            { t: 'Zur Klemme B (nach unten).', why: 'Dann würde außen der Strom von B nach A fließen, also genau umgekehrt wie bei der Spannungsform.' },
            { t: 'Die Richtung ist egal.', why: 'Sie legt fest, in welche Richtung der Strom außen fließt, und die muss mit der Spannungsform übereinstimmen.' }],
          result: 'I_K zeigt zu A.', after: 'Nur so fließt außen derselbe Strom von A nach B wie bei der Spannungsform.',
          hints: ['Beide Ersatzschaltungen müssen außen denselben Strom liefern.', 'Außen fließt der Strom von A nach B. Woher muss die Stromquelle ihn dann liefern?', 'Die Stromquelle schiebt Strom in Pfeilrichtung. Wohin muss sie ihn schieben, damit er an A herauskommt?', '<p>Außen fließt der Strom von A durch die Last nach B. Die Stromquelle muss ihn also an A in den Außenkreis schieben. Ihr Pfeil zeigt deshalb nach oben, zu A.</p><p>Im Kurzschluss (A und B verbunden) fließt I_K ebenfalls von A nach B, durch den Kurzschluss.</p>']
        },
        {
          type: 'choice', q: 'Du erhältst U_L = −8 V (Pfeil von A nach B). Was bedeutet das?',
          options: [
            { t: 'B liegt auf höherem Potential als A. Der Strom I_Last fließt in Wirklichkeit von B durch die Last nach A.', ok: true },
            { t: 'Die Rechnung ist falsch, U_L kann nicht negativ sein.', why: 'Negative Spannungen sind normal. Der Pfeil zeigt dann nur gegen die tatsächliche Richtung.' },
            { t: 'Die Last bekommt keine Spannung.', why: 'Der Betrag 8 V ist da, nur das Plus sitzt an B statt an A.' }],
          result: 'Negatives Vorzeichen: A–B-Richtung ist umgekehrt, Plus an B.', after: 'Der Zählpfeil ist nur eine Vereinbarung. Das Vorzeichen sagt, ob die Wirklichkeit mit ihm übereinstimmt.',
          hints: ['Wofür steht das Vorzeichen bei einem Zählpfeil?', 'Positiv heißt: in Pfeilrichtung, negativ heißt: dagegen.', 'U_L = φ_A − φ_B ist negativ, wenn φ_B größer ist.', '<p>Der Zählpfeil legt fest, in welcher Richtung du positiv zählst. Ein negatives Ergebnis heißt: Es ist in Wirklichkeit umgekehrt. Hier liegt das Plus an B. Der Strom fließt dann durch die Last von B nach A. Seine Größe berechnest du ganz normal, das Vorzeichen bleibt einfach mit.</p>']
        }
      ]
    },
    {
      id: 'rezept', group: 'Konzept', title: 'Das Rezept',
      body: `
        <p>Der Ablauf bleibt immer gleich. Zu jedem Schritt gehört ein Grund, damit du nicht nur abarbeitest:</p>
        <table class="mini">
          <tr><th>Schritt</th><th>Warum</th></tr>
          <tr><td><b>1. Trennstelle</b> festlegen</td><td>Das gesuchte Bauteil kommt heraus. Alle Quellen bleiben im aktiven Teil.</td></tr>
          <tr><td><b>2. Ersatzschaltung</b> wählen</td><td>Spannungs- oder Stromform. Beide führen zum selben Ergebnis, nimm die mit der leichteren Rechnung.</td></tr>
          <tr><td><b>3. R_i</b> bestimmen</td><td>Hängt nur von den Widerständen ab (Quellen aus) und ist bei beiden Formen gleich. Das ist der einfachste Teil.</td></tr>
          <tr><td><b>4. U_L</b> (oder I_K) bestimmen</td><td>Das Maß für die „Stärke“ der Ersatzquelle. Die Quellen bleiben dafür eingeschaltet.</td></tr>
          <tr><td><b>5. Zusammenschalten</b></td><td>Ersatzquelle plus herausgelöstes Bauteil ergeben einen einfachen Kreis.</td></tr>
          <tr><td><b>6. Teilstrom</b> ausrechnen</td><td>Das ist die gesuchte Größe.</td></tr>
        </table>
        {{fig:ersatz}}
        <div class="formula">I_Last = U_L / (R_i + R_Last) <span>Spannungsquellenersatz</span></div>
        <div class="formula">I_Last = I_K · R_i / (R_i + R_Last) <span>Stromquellenersatz (Stromteiler)</span></div>
        <h2>Spannungs- oder Stromform?</h2>
        <ul>
          <li><b>Spannungsform</b>, wenn U_L leicht zu finden ist: Klemmen offen, dann reicht oft eine Masche oder ein Spannungsteiler.</li>
          <li><b>Stromform</b>, wenn I_K leicht zu finden ist: Klemmen kurzgeschlossen vereinfachen das Netz oft stark.</li>
          <li>In den Klausuren verlangt Aufgabe a) fast immer die Spannungsform. Aufgabe b) will dann zusätzlich die Stromform mit Zahlenwerten. Die Umrechnung I_K = U_L / R_i reicht dafür.</li>
        </ul>`,
      steps: [
        {
          type: 'choice', q: 'Warum bestimmt man R_i oft zuerst?',
          options: [
            { t: 'R_i hängt nur von den Widerständen ab und ist bei beiden Ersatzformen gleich. Es gilt also in jedem Fall.', ok: true },
            { t: 'Weil man damit die Quellen berechnet.', why: 'Die Quellenwerte stecken in U_L bzw. I_K, nicht in R_i.' },
            { t: 'Weil man U_L nur mit R_i berechnen kann.', why: 'U_L kommt aus Maschen- oder Knotensatz. R_i braucht man erst beim Zusammenschalten.' }],
          result: 'R_i ist für beide Formen gleich und leicht zu finden.', after: 'Mit ausgeschalteten Quellen bleibt ein reines Widerstandsnetz übrig.',
          hints: ['Welche Bauteile bestimmen R_i, und welche nicht?', 'Quellen werden dafür ausgeschaltet.', 'Wenn die Quellen aus sind, bleiben nur Widerstände. Wie schwer ist die Rechnung dann?', '<p>Für R_i schaltest du alle Quellen aus, es bleibt ein reines Widerstandsnetz. Die Rechnung ist einfach und unabhängig davon, ob du später Spannungs- oder Stromform nimmst. Deshalb ist es ein guter Einstieg.</p>']
        },
        {
          q: 'Eine Ersatzspannungsquelle hat U_L = 10 V und R_i = 20 Ω. Daran hängt R_Last = 30 Ω. Wie groß ist I_Last?',
          unit: 'mA', answer: 200, result: 'I_Last = 200 mA', after: '<b>Warum?</b> Mit der Ersatzquelle ist es nur noch ein Reihenkreis aus R_i und R_Last an U_L.',
          hints: [
            'Nach dem Zusammenschalten ist es ein einfacher Stromkreis mit einer Quelle.',
            'R_i und R_Last liegen in Reihe an der Spannung U_L.',
            'I_Last = U_L / (R_i + R_Last). Setze die drei Werte ein und achte auf die Einheit.',
            '<p>Reihenschaltung: R_i + R_Last = 20 Ω + 30 Ω = 50 Ω.</p><p>Die Spannung U_L = 10 V liegt an dieser Reihenschaltung: I = 10 V / 50 Ω = 0,2 A = <b>200 mA</b>.</p>']
        }
      ]
    },
    {
      id: 'ri', group: 'Konzept', title: 'R_i bestimmen',
      body: `
        <p>R_i ist der Widerstand, den du von den Klemmen A–B aus „siehst“, wenn die Quellen nichts mehr antreiben. Deshalb schaltest du sie aus. Eine Quelle auszuschalten heißt, ihren Wert auf null zu setzen:</p>
        <table class="mini">
          <tr><th>Quelle</th><th>Wert null bedeutet</th><th>Du zeichnest</th></tr>
          <tr><td><b>Spannungsquelle</b></td><td>0 V bei jedem Strom</td><td>einen <b>Draht</b> (Kurzschluss)</td></tr>
          <tr><td><b>Stromquelle</b></td><td>0 A bei jeder Spannung</td><td>eine <b>Lücke</b> (offen)</td></tr>
        </table>
        <p class="note"><b>Eselsbrücke aus der Vorlesung: „Denkt euch den Kreis weg!“</b> Die Spannungsquelle hat einen Strich <i>längs</i> der Leitung. Nimmst du den Kreis weg, bleibt ein <b>Draht</b>. Die Stromquelle hat einen Strich <i>quer</i> zur Leitung. Nimmst du den Kreis weg, bleibt eine <b>Lücke</b>.</p>
        <p>Dann zeichnest du das Netzwerk neu, wobei das herausgelöste Bauteil fehlt (die Klemmen A und B bleiben offen), und überlegst, wo der Strom langgehen kann:</p>
        <ul>
          <li>Strom nimmt immer den Weg <b>ohne Widerstand</b>. Ein Widerstand, der durch einen Draht überbrückt wird, trägt nichts bei.</li>
          <li>Strom fließt nie in <b>Sackgassen</b>. Ein Widerstand ohne geschlossenen Weg trägt nichts bei.</li>
        </ul>
        {{fig:demo0+demo1}}
        <p>Hier wird U_q zum Draht und I_q zur Lücke. Zwischen A und B liegen danach R_1 und R_2 parallel (R_1 über den Draht der Quelle). Also R_i = R_1 ∥ R_2.</p>`,
      steps: [
        {
          type: 'choice', q: 'Im aktiven Zweipol steckt eine Stromquelle. Was machst du mit ihr, wenn du R_i bestimmst?',
          options: [
            { t: 'Offen lassen (Unterbrechung).', ok: true },
            { t: 'Kurzschließen (Draht).', why: 'Kurzschließen machst du mit Spannungsquellen. Eine Stromquelle mit 0 A lässt keinen Strom durch: eine Unterbrechung.' },
            { t: 'Durch einen Widerstand ersetzen.', why: 'Ideale Quellen haben keinen Innenwiderstand im Schaltbild. Du schaltest sie einfach aus.' },
            { t: 'Unverändert lassen.', why: 'Für R_i müssen alle Quellen ausgeschaltet sein.' }],
          result: 'Stromquelle: offen lassen.', after: '<b>Warum?</b> Eine Stromquelle mit 0 A lässt keinen Strom durch. Das ist eine Unterbrechung.',
          hints: ['Eine ausgeschaltete Stromquelle liefert keinen Strom mehr. Wie sieht ein Bauteil aus, durch das gar kein Strom fließt?', 'Merksatz: Spannungsquelle → Draht, Stromquelle → Lücke.', 'Die Stromquelle gibt ihren Strom vor. Ohne Strom bleibt nur eine Unterbrechung der Leitung übrig.',
            '<p>Beim Ausschalten ersetzt du eine Quelle durch das, was sie „im Ruhezustand“ ist:</p><ul><li>Spannung 0 V → ein Draht (Kurzschluss)</li><li>Strom 0 A → eine Unterbrechung (offen)</li></ul><p>Antwort: Stromquelle offen lassen.</p>']
        },
        {
          type: 'choice', q: 'Und was passiert mit einer Spannungsquelle beim Bestimmen von R_i?',
          options: [
            { t: 'Sie wird durch einen Draht ersetzt.', ok: true },
            { t: 'Sie wird entfernt, die Leitung bleibt offen.', why: 'Dann wäre der Weg durch die Quelle unterbrochen. Eine 0-V-Quelle lässt aber Strom ungehindert durch.' },
            { t: 'Sie wird durch ihren halben Wert ersetzt.', why: 'Ausschalten heißt Wert null.' }],
          result: 'Spannungsquelle: Draht.', after: '<b>Warum?</b> Eine Spannungsquelle mit 0 V hat bei jedem Strom 0 V Spannung, genau wie ein Draht.',
          hints: ['Welche Spannung fällt über einer ausgeschalteten Spannungsquelle ab?', 'Null Volt, egal wie viel Strom fließt.', 'Welches Bauteil hat 0 V bei beliebigem Strom?', '<p>Eine Spannungsquelle mit 0 V verhält sich wie ein Stück Draht: Der Strom kann hindurchfließen, und es fällt keine Spannung ab. Du zeichnest also einen Draht an die Stelle der Quelle.</p>']
        },
        {
          q: 'Beispielnetz (Bild oben): R_1 = 20 Ω, R_2 = 60 Ω. Bestimme R_i. U_q wird zum Draht, I_q zur Lücke.',
          unit: 'Ω', answer: 15, result: 'R_i = 20 Ω ∥ 60 Ω = 15 Ω', after: '<b>Warum parallel?</b> Von A führen zwei Wege nach B: durch R_2 direkt und durch R_1 über den Draht der Spannungsquelle.',
          hints: [
            'Zeichne das Netz mit Draht und Lücke neu. Zwischen welchen Punkten liegen R_1 und R_2?',
            'Beide Widerstände liegen zwischen A und B, R_1 über den Draht der Quelle. Also parallel.',
            'R_i = R_1 · R_2 / (R_1 + R_2) = 20 Ω · 60 Ω / 80 Ω.',
            '<p>Nach dem Ausschalten führen von A zwei Wege nach B: durch R_2 direkt und durch R_1 über den Draht der ehemaligen Spannungsquelle. Das ist eine Parallelschaltung.</p><p>R_i = (20 · 60) / (20 + 60) Ω = 1200 / 80 Ω = <b>15 Ω</b>.</p>']
        },
        {
          type: 'choice', q: 'Ein Widerstand liegt in einem Zweig, der hinter einer offenen Stromquelle endet. Trägt er zu R_i bei?',
          options: [
            { t: 'Nein, das ist eine Sackgasse. Es kann kein Strom fließen.', ok: true },
            { t: 'Ja, er liegt ja im Netzwerk.', why: 'Zu R_i zählt nur, was einen geschlossenen Strompfad zwischen A und B bildet.' },
            { t: 'Ja, aber nur zur Hälfte.', why: 'Entweder ein Widerstand liegt im Strompfad oder nicht.' }],
          result: 'Sackgassen-Widerstände zählen nicht.', after: 'Ohne geschlossenen Weg fließt kein Strom, also gibt es keinen Beitrag zu R_i.',
          hints: ['Fließt dort Strom?', 'Ohne geschlossenen Weg gibt es keinen Strom.', 'Wenn kein Strom fließt, wird der Widerstand nie „wirksam“.', '<p>Die offene Stromquelle unterbricht den Zweig. Der Widerstand dahinter hat keinen geschlossenen Weg zu A oder B. Es kann kein Strom fließen, also trägt er nichts bei und wird beim Bestimmen von R_i weggelassen.</p>']
        }
      ]
    },
    {
      id: 'ul', group: 'Konzept', title: 'U_L bestimmen',
      body: `
        <p>Für die Leerlaufspannung bleiben die Quellen <b>aktiv</b> (sie treiben ja den Strom). Du lässt die Klemmen A und B <b>offen</b>, das herausgelöste Bauteil ist weg.</p>
        {{fig:uldemo}}
        <p>Weil die Klemmen offen sind, fließt außen <b>kein Strom</b>. Dadurch wird alles übersichtlicher: Der Strom läuft nur durch das Innere des aktiven Zweipols.</p>
        <ol>
          <li>Aktiven Zweipol mit allen Bauteilen zeichnen, Klemmen offen.</li>
          <li>Überlegen, wohin die Ströme fließen (Stromquellen geben ihren Strom vor, Sackgassen führen keinen Strom). Ströme und Spannungen einzeichnen, Spannungspfeile an Widerständen in Stromrichtung.</li>
          <li><b>Masche</b> durch die Klemmen aufstellen (Summe der Spannungen = 0) und nach U_L auflösen.</li>
          <li>Fehlende Spannungen mit U = R · I ausdrücken, fehlende Ströme über <b>Knotensätze</b>.</li>
        </ol>
        <p class="note">Die Spannung U_L ist die Spannung zwischen A und B. Sie taucht deshalb nur in Maschen auf, die über die offenen Klemmen laufen. Bauteile, die nicht auf einem Weg von A nach B liegen, brauchst du dafür nicht.</p>`,
      steps: [
        {
          type: 'choice', q: 'Bei offenen Klemmen liegt ein Widerstand in einer Sackgasse. Wie wirkt er sich auf U_L aus?',
          options: [
            { t: 'Gar nicht: Es fließt kein Strom, also fällt keine Spannung ab.', ok: true },
            { t: 'Er verkleinert U_L, weil er Spannung „schluckt“.', why: 'Spannung fällt nur ab, wenn Strom fließt (U = R · I). In der Sackgasse ist I = 0.' },
            { t: 'Er muss in die Masche mit seinem vollen R · U eingehen.', why: 'Mit I = 0 ist U = R · 0 = 0 V.' },
            { t: 'Er macht aus U_L eine Stromquelle.', why: 'Das ändert nichts an der Art der Ersatzquelle.' }],
          result: 'Sackgassen-Widerstände ändern U_L nicht.', after: 'Mit I = 0 ist U = R · I = 0 V, der Widerstand liefert nichts zur Masche.',
          hints: ['Welche Formel verbindet Spannung, Widerstand und Strom?', 'Frag dich: Wie groß ist der Strom in einer Sackgasse?', 'U = R · I mit I = 0 ergibt …',
            '<p>Eine Sackgasse hat keinen geschlossenen Weg, der Strom kann nirgends hin. Also I = 0 A.</p><p>Mit U = R · I = R · 0 = 0 V fällt über diesem Widerstand keine Spannung ab. Er taucht in der Masche zwar auf, liefert aber 0 V und kann weggelassen werden.</p>']
        },
        {
          q: 'Im Bild treibt die Stromquelle I_q = 20 mA nach oben. Die Klemmen sind offen, R = 150 Ω ist der einzige Weg für den Strom. Wie groß ist U_L (Pfeil von A nach B)?',
          unit: 'V', answer: 3, result: 'U_L = R · I_q = 3 V', after: '<b>Warum?</b> Die Stromquelle prägt den Strom ein, der Widerstand macht daraus die Spannung U = R · I. Positiv: A liegt höher als B.',
          hints: [
            'Wo muss der Strom der Stromquelle hin, wenn die Klemmen offen sind?',
            'Er fließt komplett durch R, von A nach B. Spannung an R: U = R · I.',
            'Die Spannung am Widerstand ist zugleich U_L, denn R liegt direkt zwischen A und B. Rechne 150 Ω · 20 mA.',
            '<p>Die offenen Klemmen nehmen keinen Strom auf. Der Strom 20 mA fließt von der Stromquelle in den Knoten A und von dort durch R nach B (Pfeile im Bild).</p><p>U_L = R · I_q = 150 Ω · 0,02 A = <b>3 V</b>. Positiv, weil der Strom von A nach B fließt, also liegt A höher als B.</p>']
        }
      ]
    },

    /* ================= BEISPIEL 1 ================= */
    {
      id: 'bsp1', group: 'Beispiele', title: 'Beispiel 1: Spannungsteiler',
      body: `
        <p>Einfacher Start: Eine Spannungsquelle, zwei Widerstände. Gesucht ist der Strom I_Last durch R_Last. Wir gehen jeden Schritt des Rezepts einzeln durch und zeichnen jede Zwischenschaltung.</p>
        <div class="given"><span><span class="t">U_q</span> = 18 V</span><span><span class="t">R_1</span> = 60 Ω</span><span><span class="t">R_2</span> = 30 Ω</span><span><span class="t">R_Last</span> = 40 Ω</span></div>`,
      finish: 'Beispiel geschafft. Beide Ersatzschaltungen liefern denselben Strom durch R_Last, das ist deine Kontrolle. Beachte: Im Inneren sind sie nicht gleich (Spannungsform: I_Last fließt auch durch R_i, Stromform: nur ein Teil).',
      steps: [
        {
          type: 'info', q: 'Schritt 1: Trennstelle festlegen', fig: 'e1',
          text: '<p>Gesucht ist der Strom durch R_Last. Also wird <b>R_Last herausgetrennt</b>: Es ist der passive Zweipol (nur ein Widerstand). Die Klemmen heißen A (oben) und B (unten).</p><p>Alles links davon, also U_q, R_1 und R_2, ist der aktive Zweipol, denn dort liegt die einzige Quelle.</p><p><b>Richtung:</b> Der Strom I_Last soll außen von A durch R_Last nach B fließen (technische Stromrichtung, vom Pluspol der Quelle zum Minuspol).</p>'
        },
        {
          type: 'choice', q: 'Schritt 2: Welche Ersatzschaltung nimmst du?',
          options: [
            { t: 'Beide gehen. Ich nehme die Spannungsform, weil U_L hier einfach ist (offene Klemmen ergeben einen einzigen Kreis).', ok: true },
            { t: 'Nur die Spannungsform, denn im Netz steckt nur eine Spannungsquelle.', why: 'Die Form hängt nicht davon ab, welche Quellen im Netz stecken. Beide Formen funktionieren immer.' },
            { t: 'Nur die Stromform, denn die ist allgemeiner.', why: 'Beide sind gleichwertig. Die Stromform wäre hier sogar umständlicher: Für I_K müsste man erst die Klemmen kurzschließen.' }],
          result: 'Spannungsform gewählt (U_L ist hier leicht zu finden).', after: 'Beide Formen liefern denselben Strom. Wir wählen die mit der leichteren Rechnung.',
          hints: ['Müssen die Quellen im Netz zur Ersatzform passen?', 'Nein: Beide Formen sind gleichwertig. Es geht nur um den Rechenaufwand.', 'Wo wäre die Rechnung einfacher: mit offenen oder mit kurzgeschlossenen Klemmen?', '<p>Beide Ersatzformen funktionieren immer. Du suchst die mit dem geringeren Aufwand. Bei offenen Klemmen bleibt hier nur ein einfacher Kreis aus U_q, R_1 und R_2, in dem man U_L fast ablesen kann. Also die Spannungsform. Die Stromform rechnen wir später als Gegenprobe.</p>']
        },
        {
          type: 'info', q: 'Der aktive Zweipol allein', fig: 'e1term',
          text: '<p>Wir zeichnen den aktiven Zweipol ohne R_Last. Die Klemmen A und B sind <b>offen</b>. Dieses Teilnetz muss durch zwei Zahlen ersetzt werden: <b>R_i</b> (Schritt 3) und <b>U_L</b> (Schritt 4).</p>'
        },
        {
          type: 'choice', q: 'Schritt 3: Was machst du bei R_i mit der Spannungsquelle U_q?',
          options: [
            { t: 'Durch einen Draht ersetzen (kurzschließen).', ok: true },
            { t: 'Offen lassen.', why: 'Offen lassen ist für Stromquellen. Eine 0-V-Spannungsquelle lässt Strom ungehindert durch.' },
            { t: 'Gar nichts, sie bleibt eingeschaltet.', why: 'Für R_i müssen alle Quellen ausgeschaltet sein, sonst treibt sie Ströme an.' }],
          result: 'U_q → Draht.', after: 'Eine ausgeschaltete Spannungsquelle hat 0 V. Das ist ein Draht (Eselsbrücke: Kreis wegdenken, der Strich bleibt).',
          hints: ['Spannung null: Welches Bauteil hat 0 V bei beliebigem Strom?', 'Spannungsquelle → Draht, Stromquelle → Lücke.', 'Hier gibt es nur eine Spannungsquelle. Was folgt daraus?', '<p>Eine ausgeschaltete Spannungsquelle liefert 0 V. Das tut ein Draht: Der Strom fließt hindurch, es fällt nichts ab. Also: U_q wird durch einen Draht ersetzt.</p>']
        },
        {
          q: 'Bestimme R_i zwischen A und B.', unit: 'Ω', answer: 20, result: 'R_i = R_1 ∥ R_2 = 20 Ω', fig: 'e1ri0',
          after: '<b>Warum parallel?</b> Von Klemme A führen zwei Wege nach B: direkt durch R_2, und durch R_1 über den Draht der ehemaligen Quelle. R_1 · R_2 / (R_1 + R_2) = 60 · 30 / 90 Ω = 20 Ω.',
          hints: [
            'Im Bild siehst du das Netz ohne Quelle (Draht) und ohne R_Last. Wie sind R_1 und R_2 zueinander geschaltet?',
            'Beide Widerstände hängen an denselben zwei Knoten, also parallel.',
            'R_i = R_1 · R_2 / (R_1 + R_2) = 60 Ω · 30 Ω / 90 Ω.',
            '<p>Von A aus gibt es zwei Wege nach B: durch R_2 direkt nach unten, und durch R_1 nach links, durch den Draht der Quelle nach unten und zurück nach B. Beide Wege enden an denselben zwei Punkten: eine Parallelschaltung.</p><p>R_i = 1800 / 90 Ω = <b>20 Ω</b>.</p>']
        },
        {
          type: 'info', q: 'Schritt 4: U_L bestimmen: Strom und Spannung bei offenen Klemmen', fig: 'e1ul',
          text: '<p>Jetzt bleibt die Quelle <b>eingeschaltet</b>, die Klemmen sind offen. Durch die offenen Klemmen fließt kein Strom. Es bleibt ein einziger Kreis: U_q → R_1 → R_2.</p><p><b>Stromrichtung:</b> Der Strom verlässt den Pluspol (oben) der Quelle, läuft über R_1 nach rechts, durch R_2 nach unten und unten zurück zum Minuspol. Das ist der Uhrzeigersinn. Derselbe Strom I fließt durch beide Widerstände.</p><p><b>Spannungsrichtung:</b> An den Widerständen zeigen die Spannungspfeile U_1 und U_2 in Stromrichtung (Verbraucher). U_L ist die Spannung zwischen A und B und liegt direkt an R_2: U_L = U_2.</p>'
        },
        {
          type: 'choice', q: 'Welche Maschengleichung gehört zum Umlauf im Uhrzeigersinn (Quelle, R_1, R_2)?',
          options: [
            { t: '−U_q + U_1 + U_2 = 0', ok: true },
            { t: 'U_q + U_1 + U_2 = 0', why: 'Links läufst du im Uhrzeigersinn nach oben, der Pfeil von U_q zeigt nach unten. Gegen den Pfeil: −U_q.' },
            { t: 'U_q = U_1 − U_2', why: 'Die Pfeile von U_1 und U_2 zeigen beide in Umlaufrichtung, also +.' }],
          result: '−U_q + U_1 + U_2 = 0, mit U_2 = U_L', after: '<b>Warum −U_q?</b> Du läufst links nach oben, der Pfeil von U_q zeigt nach unten (gegen den Umlauf). U_1 und U_2 zeigen in Stromrichtung, also mit dem Umlauf.',
          hints: ['Pro Bauteil: Zeigt der Spannungspfeil mit oder gegen die Laufrichtung?', 'Mit dem Umlauf: plus. Dagegen: minus.', 'U_q zeigt nach unten, du läufst nach oben. U_1 und U_2 zeigen in Stromrichtung, die ist wie der Umlauf.', '<p>Im Uhrzeigersinn läufst du links nach oben. Der Pfeil von U_q zeigt aber nach unten. Das ist gegen den Umlauf: −U_q. U_1 (nach rechts) und U_2 (nach unten) zeigen mit dem Umlauf: +U_1, +U_2.</p>']
        },
        {
          q: 'Wie groß ist der Strom I im Kreis?', unit: 'mA', answer: 200, result: 'I = U_q / (R_1 + R_2) = 200 mA', after: '<b>Warum Reihenschaltung?</b> Bei offenen Klemmen gibt es nur diesen einen Kreis, derselbe Strom fließt durch beide Widerstände.',
          hints: ['Die Widerstände liegen in Reihe an U_q.', 'I = U_q / (R_1 + R_2).', 'I = 18 V / (60 Ω + 30 Ω).', '<p>Reihenschaltung: R_1 + R_2 = 90 Ω. I = 18 V / 90 Ω = 0,2 A = <b>200 mA</b>.</p>']
        },
        {
          q: 'Bestimme U_L (Pfeil von A nach B).', unit: 'V', answer: 6, result: 'U_L = U_2 = 6 V', fig: 'e1ul',
          after: '<b>Vorzeichen:</b> U_L ist positiv, also liegt A auf höherem Potential als B. Das passt: A ist über R_1 mit dem Pluspol der Quelle verbunden. Probe: U_1 = 60 Ω · 0,2 A = 12 V und U_1 + U_2 = 18 V = U_q ✓.',
          hints: ['U_L liegt direkt an R_2. Welche Spannung fällt dort ab?', 'U_2 = R_2 · I oder Spannungsteiler.', 'U_L = R_2 · I = 30 Ω · 0,2 A.', '<p>U_L = U_2 = R_2 · I = 30 Ω · 0,2 A = <b>6 V</b>.</p><p>Kontrolle über den Spannungsteiler: U_L = 18 V · 30 / 90 = 6 V.</p>']
        },
        {
          type: 'info', q: 'Schritt 5: Spannungsquellenersatzschaltung zeichnen', fig: 'e1u',
          text: '<p>Jetzt zeichnest du die Ersatzquelle mit angeschlossener Last: <b>U_L = 6 V</b> (Pfeil von A nach B, Plus an A) in Reihe mit <b>R_i = 20 Ω</b>, dann die Trennstelle, dann <b>R_Last = 40 Ω</b>.</p><p><b>Richtung:</b> Der Strom I_Last verlässt die Quelle am Pluspol (A), fließt durch R_i und R_Last und kommt bei B zurück. An R_Last zeigt der Spannungspfeil U_Last in dieselbe Richtung wie der Strom.</p><p>Maschengleichung: −U_L + I_Last · R_i + I_Last · R_Last = 0.</p>'
        },
        {
          q: 'Schritt 6: Berechne den gesuchten Strom I_Last.', unit: 'mA', answer: 100, result: 'I_Last = U_L / (R_i + R_Last) = 100 mA', after: '<b>Warum?</b> Die Ersatzquelle treibt den Strom durch R_i und R_Last in Reihe. Richtung: von A durch R_Last nach B.',
          hints: ['Nach dem Zusammenschalten ist es ein einfacher Kreis.', 'R_i und R_Last in Reihe an U_L.', 'I_Last = U_L / (R_i + R_Last) = 6 V / (20 Ω + 40 Ω).', '<p>R_i + R_Last = 20 Ω + 40 Ω = 60 Ω. Daran liegt U_L = 6 V.</p><p>I_Last = 6 V / 60 Ω = 0,1 A = <b>100 mA</b>.</p>']
        },
        {
          q: 'Wie groß ist die Spannung U_Last an R_Last?', unit: 'V', answer: 4, result: 'U_Last = I_Last · R_Last = 4 V',
          after: 'Sie ist kleiner als U_L = 6 V: Die fehlenden 2 V fallen an R_i ab (0,1 A · 20 Ω). So „bricht die Klemmenspannung unter Last ein“. Im Leerlauf (kein Strom) wären es die vollen 6 V.',
          hints: ['Strom und Widerstand der Last sind bekannt.', 'U = R · I an der Last.', 'U_Last = 40 Ω · 0,1 A.', '<p>U_Last = R_Last · I_Last = 40 Ω · 0,1 A = <b>4 V</b>.</p>']
        },
        {
          type: 'info', q: 'Gegenprobe (Teil b): Stromquellenersatzschaltung', fig: 'e1i',
          text: '<p>Dieselbe Quelle als Stromquelle: <b>I_K</b> parallel zu <b>R_i = 20 Ω</b>, dahinter die Last. Der Pfeil von I_K zeigt <b>zur Klemme A</b>, damit außen der Strom wieder von A durch die Last nach B fließt (wie bei der Spannungsform).</p><p>Hier teilt sich der Strom: Ein Teil I_i fließt in R_i zurück, der Rest I_Last durch die Last. Es gilt I_K = I_i + I_Last.</p>'
        },
        {
          q: 'Rechne die Spannungsform um: Wie groß ist I_K?', unit: 'mA', answer: 300, result: 'I_K = U_L / R_i = 300 mA', after: '<b>Warum?</b> Beim Kurzschluss von A und B liegt die ganze Spannung U_L an R_i. Der Pfeil von I_K zeigt zu A.',
          hints: ['Die Umrechnung steht im Rezept.', 'Kurzschlussstrom = Leerlaufspannung geteilt durch Innenwiderstand.', 'I_K = 6 V / 20 Ω.', '<p>I_K = U_L / R_i = 6 V / 20 Ω = 0,3 A = <b>300 mA</b>.</p>']
        },
        {
          q: 'Berechne I_Last mit dem Stromteiler.', unit: 'mA', answer: 100, result: 'I_Last = I_K · R_i / (R_i + R_Last) = 100 mA', fig: 'e1i',
          after: 'Derselbe Wert wie in der Spannungsform ✓. In R_i fließen hier I_i = 300 mA − 100 mA = 200 mA. Die beiden Ersatzschaltungen sind nur von außen (an A–B) gleichwertig, im Inneren unterscheiden sie sich.',
          hints: ['Der Strom I_K teilt sich auf R_i und R_Last auf.', 'Stromteiler: I_Last = I_K · R_i / (R_i + R_Last). Im Zähler steht der Widerstand, den I_Last nicht durchfließt.', 'I_Last = 300 mA · 20 Ω / (20 Ω + 40 Ω).', '<p>I_Last = 300 mA · 20 / 60 = <b>100 mA</b>.</p><p>Probe: I_i = 200 mA, und 200 mA + 100 mA = 300 mA = I_K ✓.</p>']
        }
      ]
    },

    /* ================= BEISPIEL 2 ================= */
    {
      id: 'bsp2', group: 'Beispiele', title: 'Beispiel 2: Spannungs- und Stromquelle',
      body: `
        <p>Jetzt sind beide Quellenarten im Netzwerk. Gesucht ist wieder der Strom durch R_Last. Wieder gehen wir Schritt für Schritt vor.</p>
        <div class="given"><span><span class="t">U_q</span> = 20 V</span><span><span class="t">I_q</span> = 50 mA</span><span><span class="t">R_1</span> = R_2 = 100 Ω</span><span><span class="t">R_Last</span> = 50 Ω</span></div>`,
      finish: 'Geschafft. Die Stromquelle hat sich bei R_i „versteckt“ (offen) und bei U_L bemerkbar gemacht. Das ist der typische Klausurmix.',
      steps: [
        {
          type: 'info', q: 'Schritt 1: Trennstelle festlegen', fig: 'e2',
          text: '<p>Gesucht ist der Strom durch R_Last. R_Last wird <b>herausgetrennt</b> und ist der passive Zweipol. Alles andere ist der aktive Zweipol, und <b>beide Quellen</b> (U_q und I_q) bleiben darin.</p><p><b>Richtung:</b> I_Last fließt außen von A durch R_Last nach B.</p>'
        },
        {
          type: 'choice', q: 'Schritt 2: Welche Ersatzschaltung nimmst du?',
          options: [
            { t: 'Beide gehen. Ich nehme die Spannungsform: U_L folgt aus einem Knotensatz bei offenen Klemmen.', ok: true },
            { t: 'Die Stromform, weil im Netz eine Stromquelle steckt.', why: 'Welche Quellen im Netz stecken, bestimmt die Ersatzform nicht.' },
            { t: 'Keine, bei gemischten Quellen funktioniert die Zweipoltheorie nicht.', why: 'Doch: Auch gemischte Quellen ergeben an A–B eine Gerade U(I).' }],
          result: 'Spannungsform gewählt.', after: 'Beide Formen gehen immer. U_L folgt aus einem Knotensatz, die Stromform rechnen wir als Gegenprobe.',
          hints: ['Müssen die Quellen im Netz zur Ersatzform passen?', 'Nein, beide Formen sind immer möglich.', 'Entscheidend ist, ob U_L oder I_K leichter zu finden ist. Beides ist machbar, die Klausur verlangt meist die Spannungsform.', '<p>Beide Ersatzformen funktionieren immer, auch bei gemischten Quellen. Wir wählen die Spannungsform. U_L bekommen wir aus einem Knotensatz bei offenen Klemmen. Die Stromform rechnen wir später als Gegenprobe.</p>']
        },
        {
          type: 'info', q: 'Der aktive Zweipol allein', fig: 'e2term',
          text: '<p>Wir zeichnen den aktiven Zweipol ohne R_Last. Er enthält U_q mit R_1 in einem Zweig, R_2 im zweiten Zweig und I_q im dritten. Klemmen A und B sind offen.</p>'
        },
        {
          type: 'choice', q: 'Schritt 3: Wie schaltest du die Quellen für R_i aus?',
          options: [
            { t: 'U_q durch einen Draht ersetzen, I_q offen lassen.', ok: true },
            { t: 'Beide durch Drähte ersetzen.', why: 'Eine Stromquelle mit 0 A lässt keinen Strom durch. Sie ist eine Lücke, kein Draht.' },
            { t: 'Beide offen lassen.', why: 'Eine Spannungsquelle mit 0 V lässt Strom ungehindert durch. Sie ist ein Draht.' },
            { t: 'U_q offen lassen, I_q durch einen Draht ersetzen.', why: 'Genau vertauscht: Spannungsquelle wird Draht, Stromquelle wird Lücke.' }],
          result: 'U_q → Draht, I_q → offen.', after: 'Spannungsquelle mit 0 V ist ein Draht, Stromquelle mit 0 A ist eine Lücke.',
          hints: ['Welche Quelle ist 0 V, welche 0 A?', 'Spannungsquelle → Draht, Stromquelle → Lücke.', 'U_q ist eine Spannungsquelle, I_q eine Stromquelle.', '<p>Ausschalten heißt Wert null. Eine Spannungsquelle mit 0 V ist ein <b>Draht</b>, eine Stromquelle mit 0 A ist eine <b>Lücke</b>. Also: U_q → Draht, I_q → offen.</p>']
        },
        {
          q: 'Bestimme R_i.', unit: 'Ω', answer: 50, result: 'R_i = R_1 ∥ R_2 = 50 Ω', fig: 'e2ri0',
          after: '<b>Warum parallel?</b> Der Draht an der Stelle von U_q verbindet das untere Ende von R_1 direkt mit dem unteren Knoten B. R_1 und R_2 hängen so beide zwischen A und B. Die offene Stromquelle trägt nichts bei.',
          hints: [
            'Im Bild: Draht statt U_q, Lücke statt I_q. Zwischen welchen Knoten A und B liegen R_1 und R_2?',
            'Beide zwischen oberem und unterem Knoten, also parallel.',
            'R_i = R_1 · R_2 / (R_1 + R_2).',
            '<p>R_1 hängt (über den Draht der ehemaligen Quelle) zwischen A und B, R_2 ebenfalls. Parallelschaltung zweier gleicher Widerstände: die Hälfte.</p><p>R_i = 100 Ω ∥ 100 Ω = <b>50 Ω</b>.</p>']
        },
        {
          type: 'info', q: 'Schritt 4: U_L bestimmen: Wohin fließt welcher Strom?', fig: 'e2ul',
          text: '<p>Quellen sind <b>eingeschaltet</b>, die Klemmen offen. Durch die Klemmen fließt nichts. Überlege, wo die Ströme herkommen:</p><ul><li>Die <b>Stromquelle</b> schiebt 50 mA nach oben in den oberen Knoten A. Das ist fest vorgegeben.</li><li>Die <b>Spannungsquelle</b> U_q (Minus an B, Plus oben) kann zusätzlich einen Strom I_1 durch sich und R_1 nach oben in den Knoten drücken. Wir zählen I_1 positiv, wenn er nach oben fließt.</li><li>Alles, was in den Knoten hineinfließt, muss durch <b>R_2</b> nach unten wieder heraus: I_2.</li></ul><p>U_L liegt direkt an R_2 (R_2 hängt zwischen A und B): U_L = R_2 · I_2.</p>'
        },
        {
          type: 'choice', q: 'Welche Knotengleichung gilt am oberen Knoten (Zählpfeile wie im Bild)?',
          options: [
            { t: 'I_q + I_1 = I_2', ok: true },
            { t: 'I_q = I_1 + I_2', why: 'I_1 zeigt nach oben in den Knoten hinein, nicht heraus. Er steht auf der Zufluss-Seite.' },
            { t: 'I_q + I_2 = I_1', why: 'I_2 fließt nach unten aus dem Knoten heraus, steht also auf der Abfluss-Seite.' }],
          result: 'I_q + I_1 = I_2', after: '<b>Warum?</b> I_q und I_1 zeigen in den Knoten hinein, I_2 heraus. Zuflüsse = Abflüsse.',
          hints: ['Welche Pfeile zeigen in den Knoten hinein, welche heraus?', 'Zuflüsse: Pfeile nach oben. Abfluss: Pfeil nach unten.', 'I_q und I_1 zeigen hinein, I_2 zeigt heraus.', '<p>Zufluss am Knoten: I_q (nach oben) und I_1 (nach oben). Abfluss: I_2 (nach unten). Summe der Zuflüsse = Summe der Abflüsse: <b>I_q + I_1 = I_2</b>.</p>']
        },
        {
          type: 'choice', q: 'Wie hängt I_1 mit den Spannungen zusammen? (Der Zweig besteht unten aus U_q, Minus an B, darüber R_1 zum Knoten A, der auf U_L liegt.)',
          options: [
            { t: 'I_1 = (U_q − U_L) / R_1', ok: true },
            { t: 'I_1 = (U_q + U_L) / R_1', why: 'Die Spannungen wirken gegeneinander: U_q drückt nach oben, U_L liegt oben am Knoten an. An R_1 fällt die Differenz ab.' },
            { t: 'I_1 = U_q / R_1', why: 'Das gälte nur, wenn der Knoten auf 0 V läge. Hier liegt er auf U_L.' }],
          result: 'I_1 = (U_q − U_L) / R_1', after: '<b>Warum?</b> An R_1 fällt die Differenz der Potentiale ab: Die Quelle hebt von 0 auf U_q, der Knoten liegt bei U_L. Ist U_q größer, fließt I_1 nach oben.',
          hints: ['Welche Spannung fällt an R_1 ab?', 'Das Minus der Quelle liegt auf 0 V (B), ihr Plus also auf U_q. Das obere Ende von R_1 ist der Knoten A auf U_L.', 'Spannung an R_1 = Differenz der beiden Potentiale = U_q − U_L.', '<p>Der Zweig besteht unten aus der Quelle U_q (Minus an B, also 0 V) und darüber aus R_1. Die Quelle hebt das Potential am oberen Quellenende auf U_q. Der Knoten A am oberen Ende von R_1 liegt aber bei U_L. Die Differenz U_q − U_L fällt an R_1 ab und treibt den Strom I_1 nach oben: I_1 = (U_q − U_L) / R_1.</p>']
        },
        {
          q: 'Löse nach U_L auf. (I_2 = U_L / R_2, R_1 = R_2.)', unit: 'V', answer: 12.5, result: 'U_L = 12,5 V',
          after: 'Allgemein: U_L = (I_q + U_q / R_1) / (1/R_1 + 1/R_2) = 0,25 A / 0,02 S = 12,5 V. <b>Vorzeichen:</b> U_L ist positiv, also liegt A über B.',
          hints: [
            'Setze I_1 und I_2 in die Knotengleichung ein.',
            'I_q + (U_q − U_L)/R_1 = U_L/R_2. Mit R_1 = R_2 = 100 Ω kannst du mit 100 Ω durchmultiplizieren.',
            '5 V + 20 V − U_L = U_L, denn I_q · 100 Ω = 5 V.',
            '<p>0,05 A + (20 V − U_L) / 100 Ω = U_L / 100 Ω. Mit 100 Ω multipliziert: 5 V + 20 V − U_L = U_L.</p><p>25 V = 2 · U_L, also U_L = <b>12,5 V</b>.</p>']
        },
        {
          q: 'Wie groß ist I_1, und in welche Richtung fließt er? Gib den Betrag mit Vorzeichen für „nach oben“ an.', unit: 'mA', answer: 75, result: 'I_1 = (20 V − 12,5 V) / 100 Ω = +75 mA (nach oben)',
          after: 'Positiv: Die Spannungsquelle treibt tatsächlich Strom nach oben in den Knoten (U_q = 20 V ist größer als U_L = 12,5 V). Probe mit dem Knotensatz: I_2 = 12,5 V / 100 Ω = 125 mA = 50 mA + 75 mA ✓.',
          hints: ['I_1 = (U_q − U_L) / R_1.', 'Setze die Werte ein.', '(20 V − 12,5 V) / 100 Ω.', '<p>I_1 = 7,5 V / 100 Ω = 0,075 A = <b>+75 mA</b>. Positiv heißt: nach oben, wie eingezeichnet.</p>']
        },
        {
          type: 'info', q: 'Schritt 5: Spannungsquellenersatzschaltung zeichnen', fig: 'e2u',
          text: '<p>Ersatzquelle: <b>U_L = 12,5 V</b> (Pfeil von A nach B, Plus an A) in Reihe mit <b>R_i = 50 Ω</b>, dann die Trennstelle, dann <b>R_Last = 50 Ω</b>.</p><p><b>Richtung:</b> U_L ist positiv, also liegt das Plus an A. Der Strom I_Last fließt deshalb von A durch R_Last nach B, und U_Last zeigt an der Last in Stromrichtung.</p>'
        },
        {
          q: 'Schritt 6: Berechne den gesuchten Strom I_Last.', unit: 'mA', answer: 125, result: 'I_Last = U_L / (R_i + R_Last) = 125 mA', after: '<b>Warum?</b> Die Ersatzquelle treibt den Strom durch R_i und R_Last in Reihe. Richtung: von A durch R_Last nach B.',
          hints: ['Zusammenschalten: Ersatzquelle mit R_Last.', 'R_i und R_Last in Reihe an U_L.', 'I_Last = U_L / (R_i + R_Last).', '<p>I_Last = 12,5 V / (50 Ω + 50 Ω) = 12,5 V / 100 Ω = 0,125 A = <b>125 mA</b>.</p>']
        },
        {
          q: 'Wie groß ist die Spannung U_Last an R_Last?', unit: 'V', answer: 6.25, result: 'U_Last = 50 Ω · 0,125 A = 6,25 V',
          after: 'Die Hälfte von U_L: Weil R_Last = R_i, teilt sich die Spannung gleichmäßig auf (Spannungsteiler). Das ist der Anpassungsfall.',
          hints: ['Strom und Widerstand der Last sind bekannt.', 'U = R · I.', '50 Ω · 0,125 A.', '<p>U_Last = R_Last · I_Last = 50 Ω · 0,125 A = <b>6,25 V</b>.</p>']
        },
        {
          type: 'info', q: 'Gegenprobe (Teil b): Stromquellenersatzschaltung', fig: 'e2i',
          text: '<p>Dieselbe Quelle als Stromquelle: <b>I_K</b> parallel zu <b>R_i = 50 Ω</b>. Der Pfeil von I_K zeigt zu A, damit außen der Strom von A durch die Last nach B fließt.</p>'
        },
        {
          q: 'Wie groß ist I_K?', unit: 'mA', answer: 250, result: 'I_K = U_L / R_i = 250 mA', after: '<b>Warum?</b> Beim Kurzschluss von A und B liegt die ganze Spannung U_L an R_i. Der Pfeil von I_K zeigt zu A.',
          hints: ['Die Umrechnung aus dem Rezept.', 'I_K = U_L / R_i.', '12,5 V geteilt durch 50 Ω.', '<p>I_K = 12,5 V / 50 Ω = 0,25 A = <b>250 mA</b>.</p>']
        },
        {
          q: 'Berechne I_Last mit dem Stromteiler.', unit: 'mA', answer: 125, result: 'I_Last = 250 mA · 50 / 100 = 125 mA', fig: 'e2i',
          after: 'Gleiches Ergebnis wie in der Spannungsform ✓. In R_i fließen ebenfalls 125 mA (R_i = R_Last, der Strom teilt sich hälftig).',
          hints: ['Der Strom I_K teilt sich auf R_i und R_Last auf.', 'Stromteiler: I_Last = I_K · R_i / (R_i + R_Last).', '250 mA · 50 Ω / 100 Ω.', '<p>I_Last = 250 mA · 50 / (50 + 50) = <b>125 mA</b>.</p>']
        }
      ]
    },

    /* ================= BEISPIEL 3: Klausur ================= */
    {
      id: 'bsp3', group: 'Beispiele', title: 'Beispiel 3: Klausur SS 2016',
      body: `
        <p>Original-Aufgabe: Klausur ELEK SS 2016, Aufgabe 1 (auch TUT 3, Aufgabe 2). Berechne den Strom I_3 mit der Zweipoltheorie und einer Spannungsquellenersatzschaltung. R_3 soll als passiver Zweipol herausgetrennt werden. Zeichne außerdem die Stromquellenersatzschaltung mit den Parametern.</p>
        <div class="given"><span><span class="t">I_C1</span> = 100 mA</span><span><span class="t">U_q2</span> = 50 V</span><span><span class="t">U_q3</span> = 40 V</span><span><span class="t">alle R</span> = 100 Ω</span></div>
        <p class="note">Hier steckt alles drin: drei Quellen, Sackgassen und ein Widerstand, der parallel zu einer idealen Spannungsquelle liegt.</p>`,
      finish: `<p><b>Kontrolle:</b> Die Musterlösung nennt R_i = 200 Ω, U_L = 60 V, I_3 = 200 mA und I_K = 300 mA. Das stimmt mit deinen Werten überein.</p>
        <p><b>Weiter üben</b> (Altklausuren mit Kurzlösung im Ordner Tutorium/Uebungsaufgaben):</p>
        <ul><li>TUT04 A1, Klausur WS 21/22: R_i = 1 kΩ, U_L = 150 V, I_5 = 75 mA, I_K = 150 mA.</li>
        <li>TUT04 A2, Klausur WS 22/23: R_i = 6 kΩ, I_6 = 410 mA.</li></ul>`,
      steps: [
        {
          type: 'info', q: 'Schritt 1: Trennstelle festlegen', fig: 'e3',
          text: '<p>Die Aufgabe verlangt: R_3 als passiven Zweipol heraustrennen. Die Klemmen sind die beiden Enden von R_3: <b>A</b> oben, <b>B</b> unten. Alle drei Quellen (I_C1, U_q2, U_q3) liegen im Rest, dem aktiven Zweipol.</p><p><b>Richtung:</b> Der gesuchte Strom I_3 ist im Bild von A nach B (nach unten) eingezeichnet.</p>'
        },
        {
          type: 'choice', q: 'Schritt 2: Warum passt hier die Spannungsform gut?',
          options: [
            { t: 'Bei offenen Klemmen ist der Strom der Stromquelle I_C1 bekannt. Eine einzige Masche durch R_4, U_q3 und R_5 liefert U_L.', ok: true },
            { t: 'Weil nur Spannungsquellen im Netz sind.', why: 'Es steckt eine Stromquelle (I_C1) drin. Die Ersatzform hängt nicht von den Quellen im Netz ab.' },
            { t: 'Die Stromform ginge hier gar nicht.', why: 'Sie geht auch, ist hier aber aufwendiger. Die Aufgabe verlangt zudem die Spannungsform.' }],
          result: 'Spannungsform: U_L folgt aus einer einzigen Masche.', after: 'Die Stromquelle I_C1 gibt den Strom im Netz vor, damit sind U_4 und U_5 sofort bekannt.',
          hints: ['Warum fragt die Aufgabe wohl nach der Spannungsform?', 'Bei offenen Klemmen fließt außen kein Strom. Was bleibt im Netz an Strömen?', 'Die Stromquelle I_C1 gibt ihren Strom vor, damit ist ein Strom im Netz bereits bekannt.', '<p>Beide Ersatzformen sind möglich. Die Spannungsform ist hier günstig, weil die Stromquelle I_C1 ihren Strom vorgibt: Bei offenen Klemmen kennst du den Strom in R_4 und R_5 sofort und brauchst nur eine Masche für U_L.</p>']
        },
        {
          type: 'info', q: 'Der aktive Zweipol allein', fig: 'e3open',
          text: '<p>Wir zeichnen den aktiven Zweipol ohne R_3. Die Klemmen A und B sind offen. Alle Quellen bleiben im Netz. Das Netz hat Sackgassen und einen Widerstand (R_6) parallel zu einer Spannungsquelle. Beides schauen wir uns gleich an.</p>'
        },
        {
          type: 'choice', q: 'Schritt 3: Wie schaltest du die drei Quellen für R_i aus?',
          options: [
            { t: 'U_q2 und U_q3 durch Drähte ersetzen, I_C1 offen lassen.', ok: true },
            { t: 'Alle drei durch Drähte ersetzen.', why: 'I_C1 ist eine Stromquelle. Mit 0 A lässt sie keinen Strom durch, ist also eine Lücke.' },
            { t: 'Alle drei offen lassen.', why: 'U_q2 und U_q3 sind Spannungsquellen. Mit 0 V sind sie Drähte.' },
            { t: 'I_C1 durch einen Draht ersetzen, U_q2 und U_q3 offen lassen.', why: 'Genau vertauscht.' }],
          result: 'U_q2, U_q3 → Drähte, I_C1 → offen.', after: 'Spannungsquellen mit 0 V sind Drähte, die Stromquelle mit 0 A ist eine Lücke.',
          hints: ['Welche Quellen sind Spannungsquellen, welche ist eine Stromquelle?', 'Spannungsquelle → Draht, Stromquelle → Lücke.', 'U_q2 und U_q3 sind Spannungsquellen, I_C1 ist die Stromquelle.', '<p>U_q2 und U_q3 sind Spannungsquellen: mit 0 V werden sie zu Drähten. I_C1 ist eine Stromquelle: mit 0 A wird sie zu einer Lücke.</p>']
        },
        {
          type: 'choice', q: 'Welche Widerstände tragen jetzt zu R_i zwischen A und B bei? (Zeichne den Strompfad: Strom meidet Sackgassen und überbrückte Widerstände.)',
          fig: 'e3ri0',
          options: [
            { t: 'Nur R_4 und R_5, in Reihe.', ok: true },
            { t: 'R_1, R_2, R_4 und R_5.', why: 'R_1 und R_2 hängen an der offenen Stromquelle I_C1. Das ist eine Sackgasse, dort fließt nichts.' },
            { t: 'R_4, R_5 und R_6.', why: 'R_6 liegt parallel zu U_q3, und U_q3 ist jetzt ein Draht. R_6 ist damit kurzgeschlossen (Strom nimmt den Weg ohne Widerstand).' },
            { t: 'Alle Widerstände außer R_3.', why: 'Schau noch einmal auf Sackgassen und überbrückte Widerstände.' }],
          result: 'Nur R_4 und R_5 tragen bei.',
          figAfter: 'e3ri',
          after: 'I_C1 offen → R_1 und R_2 sind eine Sackgasse. U_q2 und U_q3 werden Drähte, der Draht von U_q3 überbrückt R_6.',
          hints: [
            'Frage bei jedem Widerstand: Gibt es hier einen geschlossenen Weg zwischen A und B?',
            'Suche Sackgassen und Widerstände, die durch einen Draht überbrückt werden.',
            'Hinter der offenen I_C1 hängen R_1 und R_2 ohne Rückweg (Sackgasse). R_6 liegt parallel zum Draht von U_q3 und wird kurzgeschlossen.',
            '<p>Nach dem Ausschalten bleibt zwischen A und B ein einziger Pfad übrig: von A über R_4 nach rechts, durch den Draht von U_q3 nach unten, über R_5 zurück nach B.</p><p>R_1 und R_2 sind eine Sackgasse. R_6 wird vom Draht überbrückt. Es zählen nur <b>R_4 und R_5 in Reihe</b>.</p>']
        },
        {
          q: 'Wie groß ist R_i?', unit: 'Ω', answer: 200, result: 'R_i = R_4 + R_5 = 200 Ω', after: '<b>Warum in Reihe?</b> Auf dem einzigen Strompfad von A nach B liegen R_4 und R_5 hintereinander.',
          hints: ['Zwei Widerstände in einem einzigen Pfad.', 'Reihenschaltung: Widerstände addieren sich.', 'R_i = R_4 + R_5.', '<p>R_i = 100 Ω + 100 Ω = <b>200 Ω</b>.</p>']
        },
        {
          type: 'info', q: 'Schritt 4: U_L bestimmen: Wohin fließt der Strom?', fig: 'e3ul',
          text: '<p>Jetzt bleiben alle Quellen <b>eingeschaltet</b>, R_3 fehlt, die Klemmen sind offen.</p><p><b>Stromquelle:</b> I_C1 erzwingt 100 mA, egal was sonst passiert. Durch die offenen Klemmen kann nichts abfließen. Der Strom muss also einen geschlossenen Kreis finden: von I_C1 durch R_2 nach unten bis zum Knoten bei A, durch R_4 nach rechts, durch den Block aus U_q3 und R_6, durch R_5 nach links, durch U_q2 und R_1 zurück zu I_C1. In diesem Kreis fließen überall <b>100 mA</b>.</p><p><b>Wichtig:</b> Wie sich der Strom im Block U_q3 ∥ R_6 genau aufteilt, ist egal, denn U_q3 hält seine 40 V. Und U_q2 ändert nichts am Strom, weil die Stromquelle ihn vorgibt.</p><p><b>Spannungen:</b> An R_4 und R_5 zeigen die Pfeile U_4 und U_5 in Stromrichtung. U_L liegt zwischen A und B (Pfeil von A nach B). Für U_L brauchen wir nur den Weg von A nach B über R_4, U_q3 und R_5.</p>'
        },
        {
          type: 'choice', q: 'Welche Maschengleichung liefert U_L? (Umlauf: von A über R_4, U_q3 und R_5 nach B und über U_L zurück nach A.)',
          options: [
            { t: '−U_L + U_4 + U_q3 + U_5 = 0', ok: true },
            { t: 'U_L + U_4 + U_q3 + U_5 = 0', why: 'Der Pfeil von U_L zeigt von A nach B (nach unten), der Rückweg im Umlauf geht aber von B nach A (nach oben). Das ist gegen den Pfeil: −U_L.' },
            { t: '−U_L + U_4 + U_q3 + U_5 + U_q2 + U_1 + U_2 = 0', why: 'U_q2, R_1 und R_2 liegen nicht auf dem Weg von A nach B. Sie gehören nicht in diese Masche.' },
            { t: '−U_L + U_4 + U_5 = 0', why: 'Die Quelle U_q3 liegt auf dem Weg und darf nicht fehlen. Ihr Pfeil zeigt nach unten, mit dem Umlauf, also +U_q3.' }],
          result: '−U_L + U_4 + U_q3 + U_5 = 0', after: 'Eine Masche über die Klemmen: Es zählen nur Bauteile auf dem Weg von A nach B.',
          hints: [
            'Welche Bauteile liegen auf dem Weg von A nach B? Welche nicht?',
            'Auf dem Weg: R_4, die Quelle U_q3 und R_5. Alle Pfeile dort zeigen in Umlaufrichtung. Der Pfeil von U_L zeigt dagegen.',
            'In Umlaufrichtung: +U_4, +U_q3, +U_5. Gegen die Umlaufrichtung: −U_L. Die Summe ist 0.',
            '<p>Wir laufen von A nach rechts über R_4 (Pfeil U_4 nach rechts, mit dem Umlauf: +), dann durch U_q3 nach unten (Pfeil nach unten, mit dem Umlauf: +), dann durch R_5 nach links (Pfeil U_5 nach links, mit dem Umlauf: +) zu B. Von B zurück nach A geht der Umlauf aufwärts, der Pfeil von U_L zeigt aber abwärts: −U_L.</p><p>R_6 liegt parallel zu U_q3 und ändert deren Spannung nicht. U_q2, R_1, R_2 liegen nicht auf dem Weg A–B.</p>']
        },
        {
          q: 'Wie groß ist U_4 an R_4?', unit: 'V', answer: 10, result: 'U_4 = I_C1 · R_4 = 10 V', after: '<b>Warum I_C1?</b> Die Stromquelle prägt ihren Strom in diesen Kreis ein. U_4 zeigt in Stromrichtung.',
          hints: ['Durch R_4 fließt der Strom der Stromquelle.', 'U = R · I.', '100 Ω · 100 mA.', '<p>Durch R_4 fließen 100 mA (Stromquelle). U_4 = 100 Ω · 0,1 A = <b>10 V</b>. Ebenso U_5 = 10 V.</p>']
        },
        {
          q: 'Bestimme U_L.', unit: 'V', answer: 60, result: 'U_L = U_4 + U_q3 + U_5 = 60 V',
          after: '10 V + 40 V + 10 V = 60 V. <b>Vorzeichen:</b> U_L ist positiv, also liegt A auf höherem Potential als B. Entlang des Weges von A nach B fällt das Potential nacheinander um 10 V (R_4), 40 V (U_q3) und 10 V (R_5).',
          hints: ['Löse die Maschengleichung nach U_L auf.', 'U_L = U_4 + U_q3 + U_5.', '10 V + 40 V + 10 V.', '<p>Aus −U_L + U_4 + U_q3 + U_5 = 0 folgt U_L = U_4 + U_q3 + U_5 = 10 V + 40 V + 10 V = <b>60 V</b>.</p>']
        },
        {
          type: 'info', q: 'Schritt 5: Spannungsquellenersatzschaltung zeichnen', fig: 'e3u',
          text: '<p>Ersatzquelle: <b>U_L = 60 V</b> (Pfeil von A nach B, Plus an A) in Reihe mit <b>R_i = 200 Ω</b>, dahinter die Trennstelle und <b>R_3 = 100 Ω</b>.</p><p><b>Richtung:</b> U_L ist positiv. Der Strom I_3 fließt von A durch R_3 nach B, also nach unten, wie in der Aufgabe eingezeichnet. U_3 zeigt in dieselbe Richtung wie I_3.</p>'
        },
        {
          q: 'Schritt 6: Berechne den gesuchten Strom I_3.', unit: 'mA', answer: 200, result: 'I_3 = U_L / (R_i + R_3) = 200 mA', after: '<b>Warum?</b> Ersatzquelle plus R_3 ergeben einen Reihenkreis. Richtung: von A durch R_3 nach B.',
          hints: ['Zusammenschalten: einfacher Kreis.', 'R_i und R_3 in Reihe an U_L.', 'I_3 = U_L / (R_i + R_3).', '<p>I_3 = 60 V / (200 Ω + 100 Ω) = 60 V / 300 Ω = 0,2 A = <b>200 mA</b>.</p>']
        },
        {
          q: 'Wie groß ist die Spannung U_3 an R_3?', unit: 'V', answer: 20, result: 'U_3 = R_3 · I_3 = 20 V',
          after: 'Von den 60 V der Ersatzquelle fallen 40 V an R_i ab (200 Ω · 0,2 A) und 20 V an R_3.',
          hints: ['Strom und Widerstand sind bekannt.', 'U = R · I.', '100 Ω · 0,2 A.', '<p>U_3 = 100 Ω · 0,2 A = <b>20 V</b>.</p>']
        },
        {
          type: 'info', q: 'Teil b): Stromquellenersatzschaltung (Gegenprobe)', fig: 'e3i',
          text: '<p>Die Aufgabe will auch die Stromform mit Parametern. Es gilt I_K = U_L / R_i, und der Pfeil von I_K zeigt zu A (Strom fließt außen von A nach B). R_i = 200 Ω bleibt gleich.</p>'
        },
        {
          q: 'Wie groß ist I_K?', unit: 'mA', answer: 300, result: 'I_K = U_L / R_i = 300 mA', after: '<b>Warum?</b> Beim Kurzschluss von A und B liegt die ganze Spannung U_L an R_i. Der Pfeil von I_K zeigt zu A.',
          hints: ['Umrechnung aus dem Rezept.', 'I_K = U_L / R_i.', '60 V geteilt durch 200 Ω.', '<p>I_K = 60 V / 200 Ω = 0,3 A = <b>300 mA</b>.</p>']
        },
        {
          q: 'Gegenprobe mit dem Stromteiler: Wie groß ist I_3?', unit: 'mA', answer: 200, result: 'I_3 = I_K · R_i / (R_i + R_3) = 200 mA', fig: 'e3i',
          after: 'Gleiches Ergebnis ✓. Parameter der Stromquellenersatzschaltung: I_K = 300 mA, R_i = 200 Ω (und R_3 = 100 Ω als Last).',
          hints: ['I_K teilt sich auf R_i und R_3 auf.', 'I_3 = I_K · R_i / (R_i + R_3).', '300 mA · 200 Ω / 300 Ω.', '<p>I_3 = 300 mA · 200 / 300 = <b>200 mA</b>. Probe: In R_i fließen 100 mA, 100 mA + 200 mA = 300 mA ✓.</p>']
        }
      ]
    }
  ];

  Skills.add({
    id: 'zweipol', title: 'Zweipoltheorie', sub: 'Ersatzquellen, R_i, U_L',
    requires: ['knoten'], version: 2, figs, chapters
  });
})();
