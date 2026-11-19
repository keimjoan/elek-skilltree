/* Skill: Knoten & Maschen (Kirchhoff, Reihen- und Parallelschaltung, Teiler)
   Quellen: Vorlesung Kapitel 2 (Prof. Mehler), TUT 02 (Aufgabe 4 als Beispiel 1).
   Alle Zahlenwerte wurden per Netzwerkrechnung gegengeprüft. */
(function () {
  const C = Circuit, fig = C.figure, net = C.net;
  const arrow = (x, y1, y2, name, lx, ly, a) =>
    `<line class="arr" x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" marker-end="url(#ah)"/>` + C.tx(lx, ly, name, a || 'middle');

  const B1 = [
    { br: [{ t: 'V', n: 'U_0', v: '10 V', d: 'down' }] },
    { series: { n: 'R_1', v: '38 Ω' }, br: [{ t: 'R', n: 'R_2', v: '20 Ω' }] },
    { br: [{ t: 'R', n: 'R_3', v: '30 Ω' }] }];
  const B2 = [
    { br: [{ t: 'V', n: 'U_1', v: '12 V', d: 'down' }, { t: 'R', n: 'R_1', v: '10 Ω' }] },
    { br: [{ t: 'R', n: 'R_3', v: '30 Ω' }] },
    { br: [{ t: 'V', n: 'U_2', v: '6 V', d: 'down' }, { t: 'R', n: 'R_2', v: '20 Ω' }] }];
  const B3 = [
    { br: [{ t: 'V', n: 'U_0', v: '24 V', d: 'down' }] },
    { series: { n: 'R_1', v: '10 Ω' }, br: [{ t: 'R', n: 'R_2', v: '30 Ω' }] },
    { series: { n: 'R_3', v: '10 Ω' }, br: [{ t: 'R', n: 'R_4', v: '20 Ω' }] }];

  const figs = {
    netz: () => fig(net({ mode: 'plain', cols: [
      { br: [{ t: 'V', n: 'U_q', d: 'down' }] },
      { series: { n: 'R_1' }, br: [{ t: 'R', n: 'R_2' }] },
      { br: [{ t: 'R', n: 'R_3' }] }],
      extra: C.tx(172, 42, 'K_1', 'start', 'accT') + C.tx(172, 210, 'K_2', 'start', 'accT') +
        C.tx(126, 124, 'M_1 ↻', 'middle', 'accT') + C.tx(224, 124, 'M_2 ↻', 'middle', 'accT') }),
      'Zwei Knoten (K_1, K_2), drei Zweige, zwei unabhängige Maschen (M_1, M_2)'),
    knoten: () => {
      let s = '<circle class="dot" cx="220" cy="110" r="5"/>';
      s += `<line class="arr" x1="70" y1="50" x2="212" y2="106" marker-end="url(#ah)"/>` + C.tx(66, 42, 'I_1 = 5 A', 'end');
      s += `<line class="arr" x1="70" y1="170" x2="212" y2="114" marker-end="url(#ah)"/>` + C.tx(66, 190, 'I_2 = 1 A', 'end');
      s += `<line class="arr" x1="228" y1="106" x2="370" y2="50" marker-end="url(#ah)"/>` + C.tx(374, 42, 'I_3 = 2 A');
      s += `<line class="arr" x1="228" y1="114" x2="370" y2="170" marker-end="url(#ah)"/>` + C.tx(374, 190, 'I_x = ?');
      return fig(C.svg(470, 220, s, 'Knoten mit vier Strömen'), 'Zwei Ströme fließen in den Knoten hinein, zwei heraus.');
    },
    masche: () => fig(net({ mode: 'plain', cols: [
      { br: [{ t: 'V', n: 'U_0', d: 'down' }] },
      { series: { n: 'R_1', u: 'U_1' }, br: [{ t: 'R', n: 'R_2', u: 'U_2' }, { t: 'R', n: 'R_3', u: 'U_3' }] }],
      extra: C.tx(112, 164, '↻', 'middle', 'accT') }),
      'Eine Masche, im Uhrzeigersinn durchlaufen. Die Pfeile der Verbraucher zeigen in Stromrichtung.'),
    reihe: () => fig(net({ mode: 'plain', cols: [
      { br: [{ t: 'V', n: 'U', v: '12 V', d: 'down' }] },
      { series: { n: 'R_1', v: '5 Ω' }, br: [{ t: 'R', n: 'R_2', v: '10 Ω' }, { t: 'R', n: 'R_3', v: '15 Ω' }] }] }),
      'Reihenschaltung: durch alle Widerstände fließt derselbe Strom.'),
    par: () => fig(net({ mode: 'plain', cols: [
      { br: [{ t: 'V', n: 'U', v: '12 V', d: 'down' }] },
      { br: [{ t: 'R', n: 'R_1', v: '5 Ω' }] },
      { br: [{ t: 'R', n: 'R_2', v: '10 Ω' }] },
      { br: [{ t: 'R', n: 'R_3', v: '15 Ω' }] }] }),
      'Parallelschaltung: an allen Widerständen liegt dieselbe Spannung.'),
    teiler: () => fig(net({ mode: 'plain', cols: [
      { br: [{ t: 'I', n: 'I', v: '6 A', d: 'up' }] },
      { br: [{ t: 'R', n: 'R_1', v: '20 Ω' }] },
      { br: [{ t: 'R', n: 'R_2', v: '30 Ω' }] }],
      extra: arrow(142, 98, 140, 'I_1', 142, 90) + arrow(262, 98, 140, 'I_2', 262, 90) }),
      'Der Gesamtstrom teilt sich auf R_1 und R_2 auf.'),
    b1: () => fig(net({ mode: 'plain', cols: B1 }), 'Gegebenes Netzwerk (TUT 02, Aufgabe 4)'),
    b1red: () => fig(net({ mode: 'plain', cols: [
      { br: [{ t: 'V', n: 'U_0', v: '10 V', d: 'down' }] },
      { series: { n: 'R_1', v: '38 Ω' }, br: [{ t: 'R', n: 'R_23', v: '12 Ω' }] }] }), 'Vereinfacht: R_2 ∥ R_3 = R_23 ersetzt die Parallelschaltung'),
    b2: () => fig(net({ mode: 'plain', cols: B2,
      extra: arrow(26, 172, 134, 'I_1', 26, 126) + arrow(146, 98, 140, 'I_3', 146, 90) + arrow(266, 172, 134, 'I_2', 266, 126) }),
      'Zwei Quellen speisen R_3. Zählpfeile: I_1 und I_2 nach oben, I_3 nach unten.'),
    b3: () => fig(net({ mode: 'plain', cols: B3 }), 'Kettenschaltung aus Reihen- und Parallelteilen'),
    b3red: () => fig(net({ mode: 'plain', cols: [
      { br: [{ t: 'V', n: 'U_0', v: '24 V', d: 'down' }] },
      { series: { n: 'R_1', v: '10 Ω' }, br: [{ t: 'R', n: 'R_2‖34', v: '15 Ω' }] }] }), 'Vereinfacht: R_2 ∥ (R_3 + R_4) = 15 Ω')
  };

  const chapters = [
    {
      id: 'netz', group: 'Konzept', title: 'Netzwerke: Knoten, Zweige, Maschen',
      body: `
        <p>Sobald der Strom abbiegen kann, hast du ein <b>Netzwerk</b>. Drei Begriffe beschreiben es:</p>
        <ul>
          <li><b>Knoten:</b> ein Punkt, an dem mindestens drei Leitungen zusammenkommen.</li>
          <li><b>Zweig:</b> die Verbindung zwischen zwei Knoten. Durch alle Bauteile eines Zweigs fließt derselbe Strom.</li>
          <li><b>Masche:</b> ein geschlossener Umlauf durch das Netzwerk.</li>
        </ul>
        {{fig:netz}}
        <p>Die klassischen Bauteile sind <b>Spannungsquelle</b>, <b>Stromquelle</b> und <b>Widerstand</b>. Mit Zählpfeilen legst du fest, in welche Richtung du Spannungen und Ströme positiv zählst.</p>
        <p class="note">Beim Einzeichnen eines Zählpfeils musst du nicht die „richtige“ Richtung erraten. Kommt am Ende ein negativer Wert heraus, fließt der Strom einfach entgegen deinem Pfeil.</p>`,
      steps: [{
        type: 'choice', q: 'Wie viele Zweige hat das Netzwerk im Bild? Die Quelle U_q und R_1 bilden zusammen einen Zweig.',
        options: [
          { t: '3', ok: true },
          { t: '2', why: 'Zähle die Verbindungen zwischen den beiden Knoten K_1 und K_2: Es gibt mehr als zwei.' },
          { t: '4', why: 'Quelle und R_1 liegen in Reihe und gehören zu einem einzigen Zweig.' },
          { t: '5', why: 'So viele Bauteile hat das Netzwerk, aber Zweige zählen nur Verbindungen zwischen Knoten.' }],
        result: '3 Zweige: (U_q und R_1), R_2 und R_3.',
        hints: ['Die beiden Knoten sind K_1 und K_2. Wie viele Wege führen von K_2 nach K_1?', 'Zweige sind Verbindungen zwischen den Knoten. Bauteile in Reihe zählen als ein Zweig.', 'Weg 1: U_q und R_1 in Reihe. Weg 2: R_2. Weg 3: R_3.', '<p>Zwischen den Knoten K_1 (oben) und K_2 (unten) gibt es drei Wege: den linken mit U_q und R_1 in Reihe, den mittleren mit R_2 und den rechten mit R_3.</p><p>Es sind also <b>3 Zweige</b>. Das Netzwerk hat außerdem 2 unabhängige Maschen.</p>']
      }]
    },
    {
      id: 'knotensatz', group: 'Konzept', title: 'Knotenpunktsatz',
      body: `
        <p>Ladung geht nicht verloren. Was in einen Knoten hineinfließt, muss auch wieder heraus.</p>
        <div class="formula">Σ I = 0 <span>Summe aller Ströme an einem Knoten</span></div>
        <p>Die Festlegung, die du dir merken solltest: <b>zufließende Ströme positiv, abfließende negativ</b>. Gleichwertig: Summe der Zuflüsse = Summe der Abflüsse.</p>
        {{fig:knoten}}
        <p>Für das Bild gilt: I_1 + I_2 − I_3 − I_x = 0.</p>`,
      steps: [
        {
          q: 'Berechne I_x aus dem Knotenpunktsatz (I_1 = 5 A, I_2 = 1 A, I_3 = 2 A).', unit: 'A', answer: 4, result: 'I_x = 4 A',
          hints: ['Was reinfließt, fließt auch wieder raus. Wie viel fließt insgesamt hinein?', 'Knotensatz: 0 = Σ Zuflüsse − Σ Abflüsse.', '0 = I_1 + I_2 − I_3 − I_x. Löse nach I_x auf.', '<p>Hinein fließen 5 A + 1 A = 6 A. Heraus gehen I_3 = 2 A und I_x.</p><p>6 A = 2 A + I_x, also I_x = <b>4 A</b>.</p>']
        },
        {
          type: 'choice', q: 'Angenommen, du bekommst I_x = −4 A heraus. Was bedeutet das?',
          options: [
            { t: 'Der Strom fließt tatsächlich entgegen dem eingezeichneten Zählpfeil, in den Knoten hinein.', ok: true },
            { t: 'Du hast dich verrechnet, negative Ströme gibt es nicht.', why: 'Negative Werte sind normal. Sie sagen nur, dass der Zählpfeil gegen die wirkliche Richtung zeigt.' },
            { t: 'Der Strom ist null.', why: '−4 A ist ein Strom von 4 A, nur in Gegenrichtung.' }],
          result: 'Negatives Vorzeichen: Strom fließt entgegen dem Zählpfeil.',
          hints: ['Wofür ist der Zählpfeil da?', 'Der Zählpfeil legt nur fest, in welche Richtung du positiv rechnest.', 'Das Vorzeichen vergleicht die echte Richtung mit dem Zählpfeil.', '<p>Der Zählpfeil ist nur eine Vereinbarung. Positiv bedeutet: Der Strom fließt in Pfeilrichtung. Negativ bedeutet: Er fließt dagegen.</p><p>I_x = −4 A heißt also: 4 A fließen in den Knoten hinein statt heraus.</p>']
        }
      ]
    },
    {
      id: 'maschensatz', group: 'Konzept', title: 'Maschensatz',
      body: `
        <p>Läufst du einmal rundherum durch eine Masche, kommst du auf demselben Potential an, bei dem du gestartet bist. Die Spannungen auf dem Weg gleichen sich also aus.</p>
        <div class="formula">Σ U = 0 <span>Summe aller Spannungen in einer geschlossenen Masche</span></div>
        <p>Vorzeichenregel: Du wählst eine <b>Umlaufrichtung</b>. Spannungen, deren Zählpfeil mit dem Umlauf zeigt, zählen <b>positiv</b>, die gegen den Umlauf zeigen <b>negativ</b>.</p>
        {{fig:masche}}
        <p>Im Bild läufst du im Uhrzeigersinn. Links geht der Weg nach oben, gegen den Pfeil von U_0, daher −U_0. Die drei Widerstände haben Pfeile in Umlaufrichtung, daher +.</p>`,
      steps: [
        {
          type: 'choice', q: 'Welche Maschengleichung gehört zum Bild (Umlauf im Uhrzeigersinn)?',
          options: [
            { t: '−U_0 + U_1 + U_2 + U_3 = 0', ok: true },
            { t: 'U_0 + U_1 + U_2 + U_3 = 0', why: 'Der Pfeil von U_0 zeigt nach unten, der Umlauf geht links nach oben. Das ist gegen den Pfeil, also −U_0.' },
            { t: 'U_0 + U_1 − U_2 − U_3 = 0', why: 'Die Pfeile von U_1, U_2 und U_3 zeigen alle in Umlaufrichtung, sie müssen also dasselbe Vorzeichen haben.' },
            { t: 'U_0 = U_1 + U_2 · U_3', why: 'Spannungen in der Masche werden addiert, nicht multipliziert.' }],
          result: '−U_0 + U_1 + U_2 + U_3 = 0',
          hints: ['Pro Bauteil: Zeigt der Spannungspfeil mit oder gegen deine Laufrichtung?', 'Mit dem Umlauf: plus. Gegen den Umlauf: minus.', 'U_0 zeigt nach unten, du läufst dort nach oben (gegen den Pfeil). Die Widerstandspfeile zeigen in deine Laufrichtung.', '<p>Starte links unten und laufe im Uhrzeigersinn.</p><ul><li>Quelle: Du gehst nach oben, der Pfeil von U_0 zeigt nach unten: <b>−U_0</b>.</li><li>R_1: Pfeil nach rechts, Laufrichtung nach rechts: <b>+U_1</b>.</li><li>R_2 und R_3: Pfeile nach unten, Laufrichtung nach unten: <b>+U_2, +U_3</b>.</li></ul><p>Zusammen: −U_0 + U_1 + U_2 + U_3 = 0.</p>']
        },
        {
          q: 'Es ist U_0 = 12 V, U_1 = 3 V und U_2 = 5 V. Berechne U_3.', unit: 'V', answer: 4, result: 'U_3 = 12 V − 3 V − 5 V = 4 V',
          hints: ['Stelle die Gleichung nach der unbekannten Spannung um.', 'U_3 = U_0 − U_1 − U_2.', 'U_3 = 12 V − 3 V − 5 V.', '<p>Aus −U_0 + U_1 + U_2 + U_3 = 0 folgt U_3 = U_0 − U_1 − U_2 = 12 V − 3 V − 5 V = <b>4 V</b>.</p>']
        }
      ]
    },
    {
      id: 'reihe', group: 'Konzept', title: 'Reihenschaltung und Spannungsteiler',
      body: `
        <p>In einer Reihenschaltung fließt durch alle Widerstände <b>derselbe Strom</b>. Der Maschensatz liefert U = U_1 + U_2 + ... und damit:</p>
        <div class="formula">R_ges = R_1 + R_2 + ... = Σ R_i <span>Widerstände addieren sich</span></div>
        <div class="formula">U_1 / U_2 = R_1 / R_2 <span>Spannungsteilerregel</span></div>
        <div class="formula">U_i = U_ges · R_i / R_ges</div>
        <p>Am größeren Widerstand fällt die größere Spannung ab.</p>
        {{fig:reihe}}`,
      steps: [
        {
          q: 'Wie groß ist R_ges der drei Widerstände (5 Ω, 10 Ω, 15 Ω) in Reihe?', unit: 'Ω', answer: 30, result: 'R_ges = 5 Ω + 10 Ω + 15 Ω = 30 Ω',
          hints: ['Der Strom muss nacheinander durch alle drei.', 'In Reihe addieren sich die Widerstände.', 'R_ges = R_1 + R_2 + R_3.', '<p>R_ges = 5 Ω + 10 Ω + 15 Ω = <b>30 Ω</b>.</p>']
        },
        {
          q: 'Die Reihenschaltung liegt an 12 V. Wie groß ist die Spannung U_3 an R_3 = 15 Ω?', unit: 'V', answer: 6, result: 'U_3 = 12 V · 15 / 30 = 6 V',
          hints: ['Wie teilt sich die Gesamtspannung auf die drei Widerstände auf?', 'Spannungsteiler: U_3 / U_ges = R_3 / R_ges.', 'U_3 = U_ges · R_3 / R_ges = 12 V · 15 Ω / 30 Ω.', '<p>Der Strom ist überall gleich: I = 12 V / 30 Ω = 0,4 A.</p><p>U_3 = R_3 · I = 15 Ω · 0,4 A = <b>6 V</b>. Gleiches Ergebnis über den Teiler: 12 V · 15/30 = 6 V.</p>']
        },
        {
          type: 'choice', q: 'An welchem Widerstand fällt die größte Spannung ab?',
          options: [
            { t: 'Am größten Widerstand (hier R_3).', ok: true },
            { t: 'Am kleinsten Widerstand (hier R_1).', why: 'In Reihe ist der Strom überall gleich. Mit U = R · I fällt am größten R die größte Spannung ab.' },
            { t: 'Überall gleich viel.', why: 'Gleich ist der Strom, nicht die Spannung.' }],
          result: 'Größtes R, größte Spannung.',
          hints: ['Was ist in der Reihenschaltung überall gleich?', 'Der Strom. Welche Formel verbindet Spannung, Strom und R?', 'U = R · I mit gleichem I: Was passiert, wenn R größer wird?', '<p>In Reihe ist I überall gleich. Mit U = R · I wächst die Spannung mit R. Der Widerstand R_3 = 15 Ω ist am größten und bekommt daher die größte Spannung.</p>']
        }
      ]
    },
    {
      id: 'parallel', group: 'Konzept', title: 'Parallelschaltung und Stromteiler',
      body: `
        <p>In einer Parallelschaltung liegt an allen Widerständen <b>dieselbe Spannung</b>. Der Knotensatz liefert I = I_1 + I_2 + ... und damit:</p>
        <div class="formula">1 / R_ges = 1 / R_1 + 1 / R_2 + ... <span>Leitwerte addieren sich</span></div>
        <div class="formula">R_1 ∥ R_2 = R_1 · R_2 / (R_1 + R_2) <span>nur für zwei Widerstände</span></div>
        <div class="formula">I_1 = I · R_2 / (R_1 + R_2) <span>Stromteiler</span></div>
        <ul>
          <li>Der Gesamtwiderstand ist <b>immer kleiner als der kleinste Einzelwiderstand</b>.</li>
          <li>Durch den kleineren Widerstand fließt der größere Strom.</li>
          <li>Merksatz Stromteiler: Ein Teilstrom verhält sich zum Gesamtstrom wie der <b>nicht von ihm durchflossene</b> Widerstand geteilt durch die Summe beider.</li>
          <li>Achtung: „Produkt durch Summe“ gilt nur für <b>zwei</b> Widerstände.</li>
        </ul>
        {{fig:par}}
        {{fig:teiler}}`,
      steps: [
        {
          q: 'Wie groß ist R_ges der drei Widerstände (5 Ω, 10 Ω, 15 Ω) in Parallelschaltung?', unit: 'Ω', answer: 2.727, result: 'R_ges = 30/11 Ω ≈ 2,73 Ω',
          hints: ['Bei drei Widerständen hilft „Produkt durch Summe“ nicht. Was addiert sich bei Parallelschaltung?', 'Die Leitwerte: 1/R_ges = 1/R_1 + 1/R_2 + 1/R_3.', '1/R_ges = 1/5 + 1/10 + 1/15 in Ω^-1. Hauptnenner 30.', '<p>1/R_ges = 1/5 + 1/10 + 1/15 = 6/30 + 3/30 + 2/30 = 11/30 Ω^-1.</p><p>R_ges = 30/11 Ω ≈ <b>2,73 Ω</b>. Das ist kleiner als der kleinste Einzelwiderstand (5 Ω).</p>']
        },
        {
          q: 'Der Strom I = 6 A teilt sich auf R_1 = 20 Ω und R_2 = 30 Ω auf. Wie groß ist I_1 durch R_1?', unit: 'A', answer: 3.6, result: 'I_1 = 6 A · 30 / 50 = 3,6 A',
          hints: ['Durch welchen Widerstand fließt mehr Strom, durch den größeren oder den kleineren?', 'Stromteiler: I_1 = I · R_2 / (R_1 + R_2). Im Zähler steht der andere Widerstand.', 'I_1 = 6 A · 30 Ω / (20 Ω + 30 Ω).', '<p>Im Zähler steht der Widerstand, den I_1 <b>nicht</b> durchfließt: R_2.</p><p>I_1 = 6 A · 30 / 50 = <b>3,6 A</b>. Rest: I_2 = 2,4 A. Probe: 3,6 A + 2,4 A = 6 A.</p>']
        }
      ]
    },

    /* ---------------- Beispiele ---------------- */
    {
      id: 'bsp1', group: 'Beispiele', title: 'Beispiel 1: Spannungs- und Stromteiler',
      body: `
        <p>Aufgabe aus TUT 02 (Aufgabe 4). Berechne die Spannungen über den drei Widerständen, die Ströme durch die Widerstände und den Gesamtstrom.</p>
        <div class="given"><span><span class="t">U_0</span> = 10 V</span><span><span class="t">R_1</span> = 38 Ω</span><span><span class="t">R_2</span> = 20 Ω</span><span><span class="t">R_3</span> = 30 Ω</span></div>
        {{fig:b1}}`,
      finish: '<p><b>Kontrolle:</b> Die Aufgabe nennt I_3 = 0,08 A, das stimmt mit deinem Ergebnis. Laut Kurzlösung: U_1 = 7,6 V, U_2 = U_3 = 2,4 V, I_ges = 0,20 A und I_2 = 0,12 A.</p>',
      steps: [
        {
          q: 'R_2 und R_3 liegen parallel. Wie groß ist ihr gemeinsamer Widerstand R_23?', unit: 'Ω', answer: 12, result: 'R_23 = 20 · 30 / 50 Ω = 12 Ω', figAfter: 'b1red',
          hints: ['Wie sind R_2 und R_3 zueinander geschaltet?', 'Zwei Widerstände parallel: Produkt durch Summe.', 'R_23 = R_2 · R_3 / (R_2 + R_3).', '<p>R_2 und R_3 hängen an denselben beiden Knoten, sind also parallel.</p><p>R_23 = 20 Ω · 30 Ω / (20 Ω + 30 Ω) = 600 / 50 Ω = <b>12 Ω</b>.</p>']
        },
        {
          q: 'Wie groß ist der Gesamtwiderstand R_ges, den die Quelle sieht?', unit: 'Ω', answer: 50, result: 'R_ges = R_1 + R_23 = 50 Ω',
          hints: ['Nach dem Zusammenfassen ist es eine einfache Reihenschaltung.', 'R_1 liegt in Reihe mit R_23.', 'R_ges = R_1 + R_23.', '<p>R_ges = 38 Ω + 12 Ω = <b>50 Ω</b>.</p>']
        },
        {
          q: 'Wie groß ist der Gesamtstrom I_ges?', unit: 'mA', answer: 200, result: 'I_ges = 10 V / 50 Ω = 200 mA',
          hints: ['Die Quelle speist den Gesamtwiderstand.', 'Ohmsches Gesetz mit U_0 und R_ges.', 'I_ges = U_0 / R_ges.', '<p>I_ges = 10 V / 50 Ω = 0,2 A = <b>200 mA</b>. Dieser Strom fließt durch R_1.</p>']
        },
        {
          q: 'Wie groß ist die Spannung U_1 an R_1?', unit: 'V', answer: 7.6, result: 'U_1 = 7,6 V',
          hints: ['Durch R_1 fließt der Gesamtstrom.', 'U = R · I an R_1.', 'U_1 = 38 Ω · 0,2 A.', '<p>U_1 = R_1 · I_ges = 38 Ω · 0,2 A = <b>7,6 V</b>.</p>']
        },
        {
          q: 'Wie groß ist die Spannung U_2 an R_2? (Sie ist gleich U_3.)', unit: 'V', answer: 2.4, result: 'U_2 = U_3 = 2,4 V',
          after: 'Über den Maschensatz: U_2 = U_0 − U_1 = 10 V − 7,6 V = 2,4 V. Über den Spannungsteiler: 10 V · 12/50 = 2,4 V.',
          hints: ['Was bleibt von den 10 V für den Parallelteil übrig?', 'Maschensatz: −U_0 + U_1 + U_2 = 0.', 'U_2 = U_0 − U_1 = 10 V − 7,6 V.', '<p>Masche über Quelle, R_1 und R_2: −U_0 + U_1 + U_2 = 0.</p><p>U_2 = 10 V − 7,6 V = <b>2,4 V</b>. Dieselbe Spannung liegt an R_3, weil R_2 und R_3 parallel sind.</p>']
        },
        {
          q: 'Wie groß ist der Strom I_2 durch R_2?', unit: 'mA', answer: 120, result: 'I_2 = 2,4 V / 20 Ω = 120 mA',
          after: 'Für R_3: I_3 = 2,4 V / 30 Ω = 80 mA. Probe mit dem Knotensatz: 120 mA + 80 mA = 200 mA = I_ges.',
          hints: ['Spannung und Widerstand von R_2 sind bekannt.', 'Ohmsches Gesetz an R_2.', 'I_2 = U_2 / R_2.', '<p>I_2 = 2,4 V / 20 Ω = 0,12 A = <b>120 mA</b>.</p><p>Probe: I_3 = 2,4 V / 30 Ω = 80 mA, und 120 mA + 80 mA = 200 mA = I_ges. ✓</p>']
        }
      ]
    },
    {
      id: 'bsp2', group: 'Beispiele', title: 'Beispiel 2: Zwei Quellen (Kirchhoff)',
      body: `
        <p>Zwei Batterien speisen gemeinsam R_3. Hier hilft keine Teilerregel. Du brauchst Knoten- und Maschensatz zusammen.</p>
        <div class="given"><span><span class="t">U_1</span> = 12 V</span><span><span class="t">U_2</span> = 6 V</span><span><span class="t">R_1</span> = 10 Ω</span><span><span class="t">R_2</span> = 20 Ω</span><span><span class="t">R_3</span> = 30 Ω</span></div>
        {{fig:b2}}
        <p>Gesucht sind die drei Ströme.</p>`,
      finish: 'Geschafft. Das negative Vorzeichen bei I_2 ist keine Panne: Die schwächere Quelle wird von der stärkeren geladen.',
      steps: [
        {
          type: 'choice', q: 'Welche Knotengleichung gilt am oberen Knoten (Zählpfeile wie im Bild)?',
          options: [
            { t: 'I_1 + I_2 = I_3', ok: true },
            { t: 'I_1 = I_2 + I_3', why: 'I_1 und I_2 zeigen beide nach oben in den Knoten hinein, I_3 zeigt nach unten heraus. Hineinfließendes ist positiv.' },
            { t: 'I_3 = I_1 − I_2', why: 'Beide Quellenströme fließen in den Knoten hinein, also stehen sie beide auf derselben Seite.' }],
          result: 'I_1 + I_2 = I_3',
          hints: ['Wo zeigen die Pfeile hin, in den Knoten oder aus ihm heraus?', 'Zuflüsse zählen positiv, Abflüsse negativ.', 'I_1 und I_2 kommen von unten nach oben an, I_3 geht nach unten weg.', '<p>Zufluss am oberen Knoten: I_1 und I_2. Abfluss: I_3.</p><p>0 = I_1 + I_2 − I_3, also <b>I_1 + I_2 = I_3</b>.</p>']
        },
        {
          type: 'choice', q: 'Welche Maschengleichungen passen? (Beide Maschen im Uhrzeigersinn.)',
          options: [
            { t: 'U_1 = I_1 · R_1 + I_3 · R_3 und U_2 = I_2 · R_2 + I_3 · R_3', ok: true },
            { t: 'U_1 = I_1 · R_1 − I_3 · R_3 und U_2 = I_2 · R_2 − I_3 · R_3', why: 'Der Spannungsabfall an R_3 steht in beiden Maschen mit demselben Vorzeichen wie der an R_1 bzw. R_2.' },
            { t: 'U_1 + U_2 = I_1 · R_1 + I_2 · R_2', why: 'R_3 darf nicht fehlen, durch ihn fließt der Strom I_3.' }],
          result: 'Links: U_1 = I_1 R_1 + I_3 R_3. Rechts: U_2 = I_2 R_2 + I_3 R_3.',
          hints: ['Pro Masche: Welche Bauteile liegen darin?', 'Linke Masche: U_1, R_1, R_3. Rechte Masche: U_2, R_2, R_3.', 'In jeder Masche treibt die Quelle den Strom durch ihren eigenen Widerstand und durch R_3.', '<p>Linke Masche: Quelle U_1 treibt I_1 durch R_1 und I_3 fließt durch R_3. Also U_1 = I_1 · R_1 + I_3 · R_3.</p><p>Rechte Masche analog: U_2 = I_2 · R_2 + I_3 · R_3.</p>']
        },
        {
          q: 'Löse das Gleichungssystem. Wie groß ist I_3?', unit: 'mA', answer: 272.7, result: 'I_3 = 3/11 A ≈ 272,7 mA',
          after: 'Einsetzen: I_1 = (U_1 − I_3 R_3) / R_1 und I_2 = (U_2 − I_3 R_3) / R_2 in I_1 + I_2 = I_3 ergibt I_3 · (1 + R_3/R_1 + R_3/R_2) = U_1/R_1 + U_2/R_2, also I_3 = 1,5 A / 5,5.',
          hints: ['Du hast drei Gleichungen für drei Unbekannte. Eliminiere I_1 und I_2.', 'Stelle die beiden Maschengleichungen nach I_1 und I_2 um und setze sie in den Knotensatz ein.', 'I_1 = (12 V − 30 Ω · I_3) / 10 Ω und I_2 = (6 V − 30 Ω · I_3) / 20 Ω. Dann I_1 + I_2 = I_3.', '<p>I_1 = 1,2 A − 3 · I_3 und I_2 = 0,3 A − 1,5 · I_3.</p><p>Knotensatz: 1,5 A − 4,5 · I_3 = I_3, also 1,5 A = 5,5 · I_3.</p><p>I_3 = 1,5 A / 5,5 = 0,2727 A = <b>272,7 mA</b>.</p>']
        },
        {
          q: 'Wie groß ist I_1 (aus der linken Maschengleichung)?', unit: 'mA', answer: 381.8, result: 'I_1 = 21/55 A ≈ 381,8 mA',
          hints: ['Setze I_3 in die linke Maschengleichung ein.', 'I_1 = (U_1 − I_3 · R_3) / R_1.', 'U_1 = 12 V, I_3 · R_3 = 0,2727 A · 30 Ω ≈ 8,18 V.', '<p>I_3 · R_3 = 0,2727 A · 30 Ω = 8,18 V.</p><p>I_1 = (12 V − 8,18 V) / 10 Ω = <b>381,8 mA</b>.</p>']
        },
        {
          q: 'Wie groß ist I_2 (mit Vorzeichen)?', unit: 'mA', answer: -109.1, result: 'I_2 = −6/55 A ≈ −109,1 mA',
          after: 'Negativ heißt: I_2 fließt entgegen dem Zählpfeil, also in die Batterie U_2 hinein. Probe mit dem Knotensatz: 381,8 mA − 109,1 mA = 272,7 mA = I_3.',
          hints: ['Rechte Maschengleichung, nach I_2 umgestellt.', 'I_2 = (U_2 − I_3 · R_3) / R_2.', 'U_2 = 6 V, aber am R_3 liegen 8,18 V.', '<p>I_2 = (6 V − 8,18 V) / 20 Ω = −2,18 V / 20 Ω = <b>−109,1 mA</b>.</p><p>Am Knoten liegen 8,18 V, mehr als die 6 V der Quelle U_2. Die stärkere Quelle U_1 treibt deshalb Strom rückwärts durch U_2.</p>']
        },
        {
          q: 'Energiesatz als Gegenprobe: Welche Leistung liefern die beiden Quellen zusammen (U_1 · I_1 + U_2 · I_2)?', unit: 'W', answer: 3.927, result: 'P_Quellen = 4,582 W − 0,655 W ≈ 3,93 W',
          after: 'Die Widerstände setzen um: 1,458 W + 0,238 W + 2,231 W ≈ 3,93 W. Gleich: Die Summe aller Leistungen ist null.',
          hints: ['Leistung einer Quelle ist Spannung mal Strom. Achte aufs Vorzeichen von I_2.', 'P_1 = U_1 · I_1 und P_2 = U_2 · I_2 mit I_2 negativ.', 'P_1 = 12 V · 0,3818 A, P_2 = 6 V · (−0,1091 A).', '<p>P_1 = 12 V · 0,3818 A = 4,582 W.</p><p>P_2 = 6 V · (−0,1091 A) = −0,655 W (die Quelle U_2 nimmt Leistung auf).</p><p>Summe: <b>3,93 W</b>.</p>']
        }
      ]
    },
    {
      id: 'bsp3', group: 'Beispiele', title: 'Beispiel 3: Kettenschaltung',
      body: `
        <p>Ein Netzwerk aus Reihen- und Parallelteilen. Du fasst von hinten nach vorn zusammen und gehst dann wieder zurück.</p>
        <div class="given"><span><span class="t">U_0</span> = 24 V</span><span><span class="t">R_1</span> = 10 Ω</span><span><span class="t">R_2</span> = 30 Ω</span><span><span class="t">R_3</span> = 10 Ω</span><span><span class="t">R_4</span> = 20 Ω</span></div>
        {{fig:b3}}
        <p>Gesucht: Die Spannung U_4 an R_4.</p>`,
      finish: 'Merkregel: Erst alles zu einem Gesamtwiderstand zusammenfassen, dann mit Strom- und Spannungsteilern oder dem Maschensatz zurückrechnen.',
      steps: [
        {
          q: 'Fasse R_3 und R_4 zusammen. Wie groß ist R_34?', unit: 'Ω', answer: 30, result: 'R_34 = R_3 + R_4 = 30 Ω',
          hints: ['Beginne bei dem Teil, der am weitesten von der Quelle entfernt ist.', 'R_3 und R_4 liegen hintereinander im selben Zweig.', 'Reihenschaltung: addieren.', '<p>R_3 und R_4 sind in Reihe (derselbe Strom). R_34 = 10 Ω + 20 Ω = <b>30 Ω</b>.</p>']
        },
        {
          q: 'R_2 liegt parallel zu R_34. Wie groß ist R_2 ∥ R_34?', unit: 'Ω', answer: 15, result: 'R_2 ∥ R_34 = 30 · 30 / 60 Ω = 15 Ω',
          hints: ['Welche beiden Zweige hängen an demselben Knotenpaar?', 'Zwei parallele Widerstände: Produkt durch Summe.', '30 Ω ∥ 30 Ω. Zwei gleich große Widerstände wirken wie einer halber Größe.', '<p>R_2 ∥ R_34 = 30 Ω · 30 Ω / (30 Ω + 30 Ω) = <b>15 Ω</b>. Zwei gleiche Widerstände ergeben die Hälfte.</p>']
        },
        {
          q: 'Wie groß ist der Gesamtwiderstand R_ges?', unit: 'Ω', answer: 25, result: 'R_ges = R_1 + 15 Ω = 25 Ω', figAfter: 'b3red',
          hints: ['R_1 liegt vor dem Parallelteil.', 'R_1 und der Parallelteil sind in Reihe.', 'R_ges = R_1 + (R_2 ∥ R_34).', '<p>R_ges = 10 Ω + 15 Ω = <b>25 Ω</b>.</p>']
        },
        {
          q: 'Wie groß ist die Spannung U_Par am Parallelteil (R_2 und R_34)?', unit: 'V', answer: 14.4, result: 'U_Par = 24 V · 15 / 25 = 14,4 V',
          after: 'Strom: I_ges = 24 V / 25 Ω = 0,96 A. U_1 = 9,6 V, Rest für den Parallelteil: 24 V − 9,6 V = 14,4 V.',
          hints: ['Wie teilt sich U_0 auf R_1 und den Parallelteil auf?', 'Spannungsteiler: U_Par / U_0 = 15 Ω / R_ges.', 'U_Par = 24 V · 15 Ω / 25 Ω.', '<p>Spannungsteiler mit R_1 = 10 Ω und 15 Ω: U_Par = 24 V · 15/25 = <b>14,4 V</b>.</p>']
        },
        {
          q: 'Wie groß ist U_4 an R_4? Die Spannung U_Par teilt sich auf R_3 und R_4 auf.', unit: 'V', answer: 9.6, result: 'U_4 = 14,4 V · 20 / 30 = 9,6 V',
          after: 'Probe: Strom durch R_3 und R_4: 14,4 V / 30 Ω = 0,48 A. U_4 = 20 Ω · 0,48 A = 9,6 V. ✓',
          hints: ['R_3 und R_4 sind in Reihe an U_Par.', 'Spannungsteiler: U_4 = U_Par · R_4 / (R_3 + R_4).', 'U_4 = 14,4 V · 20 Ω / 30 Ω.', '<p>I = U_Par / R_34 = 14,4 V / 30 Ω = 0,48 A.</p><p>U_4 = R_4 · I = 20 Ω · 0,48 A = <b>9,6 V</b>.</p><p>Weiter üben: TUT 02, Aufgabe 5 (Zusammenfassen von Widerständen) mit den Kontrollwerten R_ges = 7,61 Ω, I_1 = 1,20 A, I_2 = 1,43 A.</p>']
        }
      ]
    }
  ];

  Skills.add({ id: 'knoten', title: 'Knoten & Maschen', sub: 'Kirchhoff, Teiler', requires: ['grundgroessen'], figs, chapters });
})();
