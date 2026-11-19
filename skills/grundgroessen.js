/* Skill: Grundgrößen
   Quellen: Vorlesung Kapitel 1 und Kapitel 2 (Prof. Mehler), TUT 01 (Aufgabe "Lass es glühen", Bird Strike).
   Alle Zahlenwerte wurden nachgerechnet. */
(function () {
  const C = Circuit, fig = C.figure;

  const figs = {
    strom: () => {
      let s = C.pl([[60, 50], [300, 50]]) + C.pl([[60, 110], [300, 110]]);
      s += C.tx(60, 36, '+ Pol (hohes Potential)') + C.tx(60, 130, '− Pol (niedriges Potential)');
      s += `<line class="arrA" x1="130" y1="80" x2="230" y2="80" marker-end="url(#ahA)"/>` + C.tx(240, 84, 'I (technische Stromrichtung)', 'start', 'accT');
      return fig(C.svg(420, 150, s, 'Technische Stromrichtung'), 'Der Strom fließt in der Modellvorstellung von Plus nach Minus.');
    },
    zaehler: () => fig(C.net({ mode: 'plain', cols: [
      { br: [{ t: 'V', n: 'U_0', v: '12 V', d: 'down' }] },
      { series: { n: 'R_1' }, br: [{ t: 'R', n: 'R_2' }] }] }), 'Einfacher Stromkreis: Quelle und Verbraucher'),
    glueh: () => fig(C.net({ mode: 'plain', cols: [
      { br: [{ t: 'V', n: 'U_1', v: '230 V', d: 'down' }] },
      { series: { n: 'R', v: '?' }, br: [] }] }), 'Kupferleiter an 230 V')
  };

  const chapters = [
    {
      id: 'ladung', group: 'Konzept', title: 'Ladung',
      body: `
        <p>Ladung ist die Ursache von allem. Elektrotechnik beschreibt, was passiert, wenn <b>Ladungsträger</b> da sind und sich bewegen.</p>
        <ul>
          <li>Es gibt zwei Arten, <b>positiv</b> und <b>negativ</b>. Gleichnamige Ladungen stoßen sich ab, ungleichnamige ziehen sich an.</li>
          <li>Die kleinste Ladung ist die <b>Elementarladung</b>: e = 1,602 · 10^-19 As. Ein Elektron trägt −e, ein Proton +e.</li>
          <li>Jede Ladung ist ein ganzzahliges Vielfaches davon.</li>
        </ul>
        <div class="formula">Q = n · e <span>Einheit: 1 C = 1 As (Coulomb)</span></div>
        <p>Für 1 C braucht man etwa 6,25 · 10^18 Elektronen. Ein Körper ist <b>geladen</b>, wenn er mehr oder weniger Ladungsträger hat, als er im neutralen Zustand hätte.</p>
        <h2>Wer leitet, wer nicht?</h2>
        <ul>
          <li><b>Leiter</b> (Metalle): Die äußeren Elektronen sind frei beweglich (Elektronengas). Bei Kupfer etwa ein freies Elektron je Atom.</li>
          <li><b>Nichtleiter</b> (Luft, Glas, Kunststoff): keine beweglichen Ladungsträger. Sie lassen sich aber aufladen, etwa durch Reibung.</li>
          <li><b>Halbleiter</b> (Silizium, Germanium): leiten erst bei höherer Temperatur oder nach Dotierung.</li>
          <li><b>Elektrolyte</b> (leitende Flüssigkeiten): Hier wandern Ionen, es gibt also Materietransport.</li>
        </ul>`,
      steps: [
        {
          q: 'Wie groß ist die Gesamtladung von 10^13 Elektronen? Gib den Betrag an.', unit: 'µC', answer: 1.602, result: '|Q| = 1,602 µC',
          hints: ['Jedes Elektron trägt dieselbe kleine Ladung. Wie kommst du von einem Elektron auf viele?', 'Q = n · e mit der Elementarladung e = 1,602 · 10^-19 As.', 'Q = 10^13 · 1,602 · 10^-19 As. Potenzen addieren: 13 − 19 = −6.', '<p>Die Zahl der Elektronen n = 10^13 mal die Ladung eines Elektrons:</p><p>Q = 10^13 · 1,602 · 10^-19 As = 1,602 · 10^-6 As = <b>1,602 µC</b>.</p><p>Das Vorzeichen ist negativ, aber hier ist der Betrag gefragt.</p>']
        },
        {
          type: 'choice', q: 'Wann ist ein Körper elektrisch geladen?',
          options: [
            { t: 'Wenn er mehr oder weniger Ladungsträger besitzt, als für den neutralen Zustand nötig.', ok: true },
            { t: 'Wenn er aus Metall besteht.', why: 'Metalle leiten, sind aber nicht automatisch geladen.' },
            { t: 'Wenn in ihm ein Strom fließt.', why: 'Ein geladener Körper kann auch ruhen, zum Beispiel ein geriebener Plastikstab. Ladung und Strom sind verschieden.' },
            { t: 'Wenn er sich erwärmt.', why: 'Erwärmung hat mit der Ladung nichts zu tun.' }],
          result: 'Geladen = Überschuss oder Mangel an Ladungsträgern.',
          hints: ['Denk an den geriebenen Plastikstab. Was hat sich dabei am Stab geändert?', 'Es geht um die Anzahl der Ladungsträger im Vergleich zum neutralen Zustand.', 'Neutral heißt: gleich viele positive und negative Ladungen. Geladen heißt: nicht mehr gleich viele.', '<p>Ein neutraler Körper hat gleich viele positive und negative Ladungen. Beim Reiben wandern Elektronen von einem Körper zum anderen. Der eine hat dann Elektronen im Überschuss (negativ), der andere im Mangel (positiv).</p><p>Antwort: Er hat mehr oder weniger Ladungsträger als im neutralen Zustand.</p>']
        }
      ]
    },
    {
      id: 'strom', group: 'Konzept', title: 'Stromstärke und Stromdichte',
      body: `
        <p>Bewegen sich Ladungsträger, bewegt sich Ladung. Die <b>Stromstärke</b> sagt, wie viel Ladung pro Zeit an einer Stelle vorbeikommt.</p>
        <div class="formula">I = Q / t <span>Einheit: 1 A = 1 As / 1 s (Ampere)</span></div>
        <div class="formula">J = I / A <span>Stromdichte in A/m²</span></div>
        <p>Die <b>Stromdichte</b> J sagt, wie viel Strom pro Leiterquerschnitt fließt. Bei gleichem Strom ist sie im dünnen Draht größer als im dicken.</p>
        {{fig:strom}}
        <h2>Zwei wichtige Festlegungen</h2>
        <ul>
          <li><b>Technische Stromrichtung:</b> Man rechnet immer, als würden positive Ladungen fließen, also von + nach −. Elektronen laufen tatsächlich in die Gegenrichtung.</li>
          <li><b>Langsam, aber sofort:</b> Die Elektronen driften in Kupfer nur mit etwa 0,1 bis 10 mm/s. Das Feld, das sie antreibt, breitet sich aber mit Lichtgeschwindigkeit aus. Darum leuchtet die Lampe sofort.</li>
        </ul>`,
      steps: [
        {
          q: 'In einem Leiter fließt in 4 s die Ladung 2 C an einer Stelle vorbei. Wie groß ist die Stromstärke?', unit: 'mA', answer: 500, result: 'I = 0,5 A = 500 mA',
          hints: ['Wie viel Ladung kommt pro Sekunde vorbei?', 'Stromstärke ist Ladung durch Zeit.', 'I = Q / t mit Q = 2 C und t = 4 s. 1 C = 1 As.', '<p>I = Q / t = 2 As / 4 s = 0,5 A = <b>500 mA</b>.</p>']
        },
        {
          q: 'Durch einen Draht mit dem Querschnitt 0,5 mm² fließen 2 A. Wie groß ist die Stromdichte in A/mm²?', unit: 'A/mm²', answer: 4, result: 'J = 4 A/mm²',
          hints: ['Strom pro Fläche.', 'J = I / A. Du darfst direkt in mm² rechnen.', 'J = 2 A / 0,5 mm².', '<p>J = I / A = 2 A / 0,5 mm² = <b>4 A/mm²</b>.</p><p>In SI-Einheiten wären das 4 · 10^6 A/m².</p>']
        }
      ]
    },
    {
      id: 'spannung', group: 'Konzept', title: 'Spannung und Potential',
      body: `
        <p>Warum fließt überhaupt ein Strom? Weil es einen <b>Potentialunterschied</b> gibt.</p>
        <p>Ein Skifahrer kann nur abfahren, wenn oben mehr Höhenenergie vorhanden ist als unten. Steht er auf einem Plateau, passiert nichts. Genauso brauchen Ladungsträger einen Unterschied im <b>elektrischen Potential</b> φ, um in Bewegung zu kommen.</p>
        <div class="formula">U_ab = φ_a − φ_b <span>Einheit: 1 V (Volt)</span></div>
        <ul>
          <li>Der Pluspol hat das hohe, der Minuspol das niedrige Potential.</li>
          <li>Ladungen fließen (in der technischen Stromrichtung) immer von hohem zu niedrigem Potential.</li>
          <li><b>Spannung ist eine Potentialdifferenz</b> und der Antrieb des Stromflusses.</li>
          <li>Das Potential wird am Verbraucher abgebaut, nicht im Kabel.</li>
        </ul>
        <p class="note">Spannungen haben ein Vorzeichen: U_ab = −U_ba. Der Zählpfeil legt fest, welches Potential von welchem abgezogen wird.</p>`,
      steps: [
        {
          q: 'Punkt a liegt auf 9 V, Punkt b auf 4 V (jeweils gegen Masse). Wie groß ist U_ab?', unit: 'V', answer: 5, result: 'U_ab = 9 V − 4 V = 5 V',
          hints: ['Spannung ist eine Differenz. Von welchem Potential ziehst du welches ab?', 'U_ab = φ_a − φ_b. Der erste Buchstabe steht vorn.', 'U_ab = 9 V − 4 V.', '<p>U_ab = φ_a − φ_b = 9 V − 4 V = <b>5 V</b>.</p>']
        },
        {
          q: 'Wie groß ist dann U_ba?', unit: 'V', answer: -5, result: 'U_ba = φ_b − φ_a = −5 V',
          hints: ['Dieselben Punkte, nur die Reihenfolge ist vertauscht.', 'U_ba = φ_b − φ_a. Das Vorzeichen dreht sich.', 'U_ba = 4 V − 9 V.', '<p>U_ba = φ_b − φ_a = 4 V − 9 V = <b>−5 V</b>.</p><p>Merke: U_ba = −U_ab.</p>']
        }
      ]
    },
    {
      id: 'widerstand', group: 'Konzept', title: 'Widerstand und Ohmsches Gesetz',
      body: `
        <p>Der <b>Widerstand</b> R sagt, wie viel Spannung nötig ist, um einen bestimmten Strom durchzutreiben.</p>
        <div class="formula">R = U / I <span>Einheit: 1 Ω = 1 V / 1 A</span></div>
        <div class="formula">U = R · I</div>
        <div class="formula">I = U / R</div>
        <ul>
          <li><b>Strom konstant</b> (kann nicht abbiegen): größeres R bedeutet, dass mehr Spannung abfällt.</li>
          <li><b>Spannung konstant</b> (parallel oder einziger Verbraucher): größeres R bedeutet, dass weniger Strom fließt.</li>
        </ul>
        <p>Jeder Verbraucher ist ein Widerstand und auch jedes Kabel. Widerstände wandeln Energie in Wärme um.</p>
        <h2>Leitwert und Bemessung</h2>
        <div class="formula">G = 1 / R <span>Leitwert, Einheit: 1 S (Siemens)</span></div>
        <div class="formula">R = ρ · l / A = l / (γ · A) <span>l Länge, A Querschnitt, ρ spezifischer Widerstand, γ = 1/ρ Leitfähigkeit</span></div>
        <p>Länger bedeutet mehr Widerstand, dicker bedeutet weniger Widerstand.</p>`,
      steps: [
        {
          q: 'An einem Widerstand liegen 12 V und es fließen 40 mA. Wie groß ist R?', unit: 'Ω', answer: 300, result: 'R = 12 V / 0,04 A = 300 Ω',
          hints: ['Spannung, Strom, Widerstand: Welche Formel verbindet die drei?', 'R = U / I. Achte auf die Einheit des Stroms.', '40 mA = 0,04 A. Dann R = 12 V / 0,04 A.', '<p>40 mA = 0,04 A.</p><p>R = U / I = 12 V / 0,04 A = <b>300 Ω</b>.</p>']
        },
        {
          q: 'Eine Kupferleitung ist 100 m lang und hat den Querschnitt 1,5 mm². Die Leitfähigkeit von Kupfer ist γ = 56 m/(Ω·mm²). Wie groß ist der Widerstand?', unit: 'Ω', answer: 1.19, result: 'R = 100 / (56 · 1,5) Ω ≈ 1,19 Ω',
          hints: ['Welche Größen gehen in den Widerstand eines Drahtes ein?', 'Bemessungsgleichung: R = l / (γ · A).', 'Setze l = 100 m, γ = 56 m/(Ω·mm²) und A = 1,5 mm² ein. Die Einheiten m und mm² kürzen sich passend.', '<p>R = l / (γ · A) = 100 m / (56 m/(Ω·mm²) · 1,5 mm²)</p><p>= 100 / 84 Ω ≈ <b>1,19 Ω</b>.</p>']
        }
      ]
    },
    {
      id: 'leistung', group: 'Konzept', title: 'Leistung und Energie',
      body: `
        <p>Elektrische <b>Leistung</b> ist umgesetzte Energie pro Zeit.</p>
        <div class="formula">P = U · I = I² · R = U² / R <span>Einheit: 1 W = 1 VA</span></div>
        <div class="formula">W = P · t <span>Einheit: 1 Ws = 1 J, in der Praxis kWh</span></div>
        <p>Die zweite und dritte Form folgen aus dem Ohmschen Gesetz. Welche du nimmst, hängt davon ab, was gegeben ist.</p>
        <h2>Vorzeichen: Energiesatz</h2>
        <ul>
          <li><b>Verbraucher:</b> U und I zeigen in dieselbe Richtung, die Leistung ist positiv.</li>
          <li><b>Quelle:</b> U und I zeigen verschieden, die Leistung ist negativ.</li>
          <li>In einem abgeschlossenen System ist die Summe aller vorzeichenbehafteten Leistungen null: Was die Quellen liefern, nehmen die Verbraucher auf.</li>
        </ul>`,
      steps: [
        {
          q: 'Ein Widerstand von 100 Ω liegt an 20 V. Welche Leistung setzt er um?', unit: 'W', answer: 4, result: 'P = U² / R = 4 W',
          hints: ['Du kennst Spannung und Widerstand. Welche Leistungsformel nutzt genau diese beiden?', 'P = U² / R.', 'P = (20 V)² / 100 Ω.', '<p>P = U² / R = 400 V² / 100 Ω = <b>4 W</b>.</p><p>Probe: I = 20 V / 100 Ω = 0,2 A und P = U · I = 20 V · 0,2 A = 4 W.</p>']
        },
        {
          q: 'Wie viel Energie wird in 30 Minuten umgesetzt? Gib die Antwort in kJ an.', unit: 'kJ', answer: 7.2, result: 'W = 4 W · 1800 s = 7,2 kJ',
          hints: ['Energie ist Leistung mal Zeit. Rechne die Zeit in Sekunden.', 'W = P · t mit t = 30 min = 1800 s.', 'W = 4 W · 1800 s = 7200 Ws = 7200 J.', '<p>t = 30 min = 1800 s.</p><p>W = P · t = 4 W · 1800 s = 7200 Ws = 7200 J = <b>7,2 kJ</b>.</p>']
        }
      ]
    },
    {
      id: 'temperatur', group: 'Konzept', title: 'Widerstand und Temperatur',
      body: `
        <p>Der Widerstand ist keine feste Zahl. Er hängt von Temperatur, Magnetfeld, mechanischer Spannung und Licht ab. Am wichtigsten ist die <b>Temperatur</b>.</p>
        <div class="formula">R = R_20 · (1 + α_20 · Δϑ) <span>linear, bis etwa 200 °C</span></div>
        <div class="formula">R = R_20 · (1 + α_20 · Δϑ + β_20 · Δϑ^2) <span>quadratisch, ab etwa 200 °C oder bei hoher Genauigkeit</span></div>
        <p>R_20 ist der Widerstand bei 20 °C, Δϑ = ϑ − 20 °C die Abweichung davon, α_20 und β_20 sind Materialkonstanten.</p>
        <ul>
          <li><b>PTC</b> (Kaltleiter): Der Widerstand steigt mit der Temperatur. Typisch für Metalle und Glühlampen.</li>
          <li><b>NTC</b> (Heißleiter): Der Widerstand sinkt mit der Temperatur.</li>
        </ul>`,
      steps: [
        {
          q: 'Ein Kupferdraht hat bei 20 °C den Widerstand 100 Ω, α_20 = 0,0039 1/K. Wie groß ist R bei 70 °C (linear)?', unit: 'Ω', answer: 119.5, result: 'R = 100 Ω · (1 + 0,0039 · 50) = 119,5 Ω',
          hints: ['Wie weit weicht 70 °C von 20 °C ab?', 'Lineare Näherung: R = R_20 · (1 + α_20 · Δϑ) mit Δϑ = 70 − 20.', 'Δϑ = 50 K. R = 100 Ω · (1 + 0,0039 · 50).', '<p>Δϑ = 70 °C − 20 °C = 50 K.</p><p>R = 100 Ω · (1 + 0,0039 /K · 50 K) = 100 Ω · 1,195 = <b>119,5 Ω</b>.</p>']
        },
        {
          type: 'choice', q: 'Ein Bauteil hat bei steigender Temperatur einen kleineren Widerstand. Was ist es?',
          options: [
            { t: 'Ein NTC (Heißleiter).', ok: true },
            { t: 'Ein PTC (Kaltleiter).', why: 'Beim PTC steigt der Widerstand mit der Temperatur.' },
            { t: 'Ein idealer Widerstand.', why: 'Ein idealer Widerstand ist temperaturunabhängig.' }],
          result: 'Sinkender Widerstand bei Wärme: NTC.',
          hints: ['NTC steht für Negative Temperature Coefficient.', 'Negativ heißt: Der Temperaturkoeffizient ist kleiner als null.', 'α < 0 bedeutet, dass R bei Erwärmung kleiner wird.', '<p>NTC = Negative Temperature Coefficient: Der Temperaturbeiwert ist negativ, der Widerstand sinkt bei Erwärmung. Man nennt ihn auch Heißleiter, weil er bei Hitze besser leitet.</p><p>PTC ist das Gegenteil (Kaltleiter).</p>']
        }
      ]
    },

    /* ---------------- Beispiele ---------------- */
    {
      id: 'bsp1', group: 'Beispiele', title: 'Beispiel 1: Lass es glühen',
      body: `
        <p>Aufgabe aus TUT 01. Ein Kupferleiter wird um 42 K erwärmt, sein Widerstand steigt dabei auf das 1,42-Fache. Vor der Erwärmung gilt I_1 = 23 mA und U_1 = 230 V.</p>
        <p>a) Wie groß ist die Spannung U_2 nach der Erwärmung, wenn der Strom konstant bleibt?<br>b) Wie lautet der Temperaturbeiwert α_20, wenn die Starttemperatur 20 °C war?</p>
        {{fig:glueh}}`,
      finish: '<p><b>Kontrolle:</b> Die Kurzlösung nennt U_2 = 326,6 V und α_20 = 0,01 1/K.</p>',
      steps: [
        {
          q: 'Wie groß ist der Widerstand R_1 vor der Erwärmung?', unit: 'kΩ', answer: 10, result: 'R_1 = 230 V / 23 mA = 10 kΩ',
          hints: ['Du kennst Spannung und Strom vor der Erwärmung.', 'Ohmsches Gesetz: R = U / I.', 'R_1 = 230 V / 0,023 A.', '<p>R_1 = U_1 / I_1 = 230 V / 0,023 A = 10 000 Ω = <b>10 kΩ</b>.</p>']
        },
        {
          q: 'Bestimme U_2 bei unverändertem Strom.', unit: 'V', answer: 326.6, result: 'U_2 = 326,6 V',
          after: 'R_2 = 1,42 · R_1 = 14,2 kΩ. Bei gleichem Strom steigt die Spannung im gleichen Verhältnis: U_2 = 1,42 · 230 V.',
          hints: ['Der Strom bleibt gleich, der Widerstand wächst. Was passiert mit der Spannung?', 'U = R · I. Bei konstantem I ist U proportional zu R.', 'U_2 = U_1 · 1,42 oder U_2 = R_2 · I_1 mit R_2 = 1,42 · R_1.', '<p>R_2 = 1,42 · 10 kΩ = 14,2 kΩ.</p><p>U_2 = R_2 · I_1 = 14 200 Ω · 0,023 A = <b>326,6 V</b>.</p>']
        },
        {
          q: 'Bestimme den Temperaturbeiwert α_20 in 1/K.', unit: '1/K', answer: 0.01, result: 'α_20 = 0,01 1/K',
          after: 'Aus R_2 = R_1 · (1 + α_20 · Δϑ) und R_2 / R_1 = 1,42 folgt 0,42 = α_20 · 42 K.',
          hints: ['Welche Formel beschreibt den Widerstand bei anderer Temperatur?', 'R = R_20 · (1 + α_20 · Δϑ). Das Verhältnis R / R_20 ist hier bekannt.', '1,42 = 1 + α_20 · 42 K. Löse nach α_20 auf.', '<p>1,42 = 1 + α_20 · 42 K</p><p>0,42 = α_20 · 42 K, also α_20 = 0,42 / 42 K = <b>0,01 1/K</b>.</p>']
        }
      ]
    },
    {
      id: 'bsp2', group: 'Beispiele', title: 'Beispiel 2: Wasserkocher',
      body: `
        <p>Ein Wasserkocher ist an 230 V angeschlossen und nimmt die Leistung 2,3 kW auf. Betrachte ihn als ohmschen Widerstand.</p>
        <div class="given"><span><span class="t">U</span> = 230 V</span><span><span class="t">P</span> = 2,3 kW</span></div>`,
      finish: 'Die Leistung wächst mit dem Quadrat der Spannung. Halbe Spannung bedeutet ein Viertel der Leistung.',
      steps: [
        {
          q: 'Welcher Strom fließt?', unit: 'A', answer: 10, result: 'I = P / U = 10 A',
          hints: ['Welche Leistungsformel enthält Spannung und Strom?', 'P = U · I, umgestellt nach I.', 'I = 2300 W / 230 V.', '<p>P = U · I, also I = P / U = 2300 W / 230 V = <b>10 A</b>.</p>']
        },
        {
          q: 'Wie groß ist der Widerstand des Heizelements?', unit: 'Ω', answer: 23, result: 'R = U / I = 23 Ω',
          hints: ['Jetzt kennst du Spannung und Strom.', 'Ohmsches Gesetz: R = U / I.', 'R = 230 V / 10 A.', '<p>R = U / I = 230 V / 10 A = <b>23 Ω</b>.</p>']
        },
        {
          q: 'Welche Energie nimmt der Kocher in 3 Minuten auf? Gib sie in Wh an.', unit: 'Wh', answer: 115, result: 'W = 2300 W · 3/60 h = 115 Wh',
          hints: ['Energie ist Leistung mal Zeit. Für Wh rechnest du die Zeit in Stunden.', 'W = P · t mit t = 3 min = 0,05 h.', 'W = 2300 W · 0,05 h.', '<p>t = 3 min = 3/60 h = 0,05 h.</p><p>W = P · t = 2300 W · 0,05 h = <b>115 Wh</b>.</p>']
        },
        {
          q: 'Der Kocher hängt (bei gleichem R) an nur 115 V. Welche Leistung nimmt er auf?', unit: 'W', answer: 575, result: 'P = U² / R = 575 W',
          hints: ['Der Widerstand bleibt gleich, die Spannung halbiert sich.', 'P = U² / R.', 'P = (115 V)² / 23 Ω.', '<p>P = U² / R = 13 225 V² / 23 Ω = <b>575 W</b>.</p><p>Das ist ein Viertel von 2300 W: Die Spannung geht quadratisch ein.</p>']
        }
      ]
    },
    {
      id: 'bsp3', group: 'Beispiele', title: 'Beispiel 3: Bird Strike',
      body: `
        <p>Warm-up aus TUT 01: Vögel sitzen auf Hochspannungsleitungen. Diese Fragen kannst du jetzt mit dem Potentialbegriff beantworten.</p>`,
      finish: 'Merksatz: Strom braucht einen Potentialunterschied entlang des Weges.',
      steps: [
        {
          type: 'choice', q: 'a) Warum kann ein Vogel gefahrlos auf einem einzelnen Leiter einer Hochspannungsleitung sitzen?',
          options: [
            { t: 'Seine Füße berühren Punkte mit praktisch gleichem Potential. Es gibt keine Spannung, also fließt kaum Strom durch ihn.', ok: true },
            { t: 'Vogelfedern sind perfekte Isolatoren.', why: 'Die Füße haben direkten Kontakt mit dem Draht. Entscheidend ist die fehlende Potentialdifferenz.' },
            { t: 'Hochspannung ist nur gefährlich, wenn man sie sieht.', why: 'Die Gefährlichkeit hängt nicht davon ab, ob man sie sieht.' }],
          result: 'Gleiches Potential an beiden Füßen: keine Spannung, kein Strom.',
          hints: ['Wann fließt überhaupt Strom? Denk an den Skifahrer.', 'Strom braucht einen Potentialunterschied. Wie groß ist er zwischen den beiden Füßen?', 'Der Abstand der Füße auf dem Draht ist klein, der Drahtwiderstand dazwischen winzig, also fällt dort fast keine Spannung ab.', '<p>Strom fließt nur bei einem Potentialunterschied. Beide Füße stehen praktisch auf dem gleichen Potential, die Spannung dazwischen ist fast 0 V. Ohne Spannung fließt kein nennenswerter Strom durch den Vogel.</p>']
        },
        {
          type: 'choice', q: 'b) Was sollte der Vogel auf keinen Fall tun?',
          options: [
            { t: 'Zwei Leiter mit unterschiedlichem Potential gleichzeitig berühren.', ok: true },
            { t: 'Auf dem Leiter sitzen bleiben.', why: 'Das ist ungefährlich, siehe Teil a.' },
            { t: 'Mit den Füßen den gleichen Draht greifen.', why: 'Auch das ist ungefährlich: gleiches Potential.' }],
          result: 'Gefährlich: Kontakt zu zwei Punkten mit Potentialunterschied.',
          hints: ['Was braucht es, damit der Strom durch den Vogel fließt?', 'Ein Potentialunterschied zwischen zwei Körperstellen.', 'Zum Beispiel mit einem Flügel einen anderen Leiter oder den Mast berühren.', '<p>Gefährlich wird es, sobald der Vogel zwei Punkte mit verschiedenem Potential verbindet, etwa zwei Leiterseile oder Seil und Mast. Dann liegt die volle Spannung über seinem Körper und es fließt Strom.</p>']
        },
        {
          type: 'choice', q: 'c) Wofür sind die geriffelten Säulen zwischen Mast und Kabel?',
          options: [
            { t: 'Isolatoren: Sie verhindern, dass Strom vom Leiter zum Mast fließt.', ok: true },
            { t: 'Gewichte, damit das Kabel nicht schwingt.', why: 'Die Riffelung dient der elektrischen Isolation, nicht der Mechanik.' },
            { t: 'Sie leiten den Strom besser zum Mast.', why: 'Das Gegenteil ist gewollt: Sie trennen Leiter und Mast.' }],
          result: 'Isolatoren zwischen Leiter und Mast.',
          hints: ['Das Kabel führt Hochspannung, der Mast ist geerdet. Was soll dazwischen passieren?', 'Es soll kein Strom zwischen beiden fließen. Welches Bauteil sorgt dafür?', 'Die Rillen verlängern den Weg über die Oberfläche, auf dem ein Strom kriechen könnte.', '<p>Das Kabel liegt auf hohem Potential, der Mast auf Erdpotential. Dazwischen sitzt ein <b>Isolator</b>. Die Rillen verlängern den Kriechweg an der Oberfläche, damit auch bei Regen oder Schmutz kein Strom zum Mast überschlägt.</p>']
        }
      ]
    }
  ];

  Skills.add({ id: 'grundgroessen', title: 'Grundgrößen', sub: 'Strom, Spannung, Widerstand', requires: [], figs, chapters });
})();
