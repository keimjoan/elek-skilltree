/* Schaltbilder als SVG – Symbolik wie in der Vorlesung:
   Spannungsquelle = Kreis mit Strich quer zur Leitung + Zählpfeil (von + nach −)
   Stromquelle     = Kreis mit Strich längs zur Leitung + Pfeil
   Texte: "R_i" wird automatisch zu R mit tiefgestelltem i. */
window.Circuit = (function () {
  const RW = 16, RL = 38, RAD = 14;
  const sub = t => String(t).replace(/_([A-Za-z0-9]+)/g, '<tspan baseline-shift="sub" font-size="10">$1</tspan>');
  const tx = (x, y, t, a = 'start', c = '') => `<text x="${x}" y="${y}" text-anchor="${a}" class="${c}">${sub(t)}</text>`;
  const pl = (pts, c = 'wire') => `<polyline class="${c}" points="${pts.map(p => p.join(',')).join(' ')}"/>`;
  const lbl = (n, v) => (n ? (v ? `${n} = ${v}` : n) : '');
  const dot = (x, y) => `<circle class="dot" cx="${x}" cy="${y}" r="3"/>`;
  const term = (x, y) => `<circle class="term" cx="${x}" cy="${y}" r="4"/>`;

  function R(x, y, o = {}) {
    const v = o.o !== 'h', w = v ? RW : RL, h = v ? RL : RW;
    let g = `<rect class="body" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}"/>`;
    if (o.n) g += v ? tx(x + 14, y + 4, lbl(o.n, o.v)) : tx(x, y - 16, lbl(o.n, o.v), 'middle');
    if (o.u) { // Spannungspfeil in Stromrichtung (senkrecht: nach unten, waagerecht: nach rechts)
      g += v ? `<line class="arr" x1="${x - 22}" y1="${y - 12}" x2="${x - 22}" y2="${y + 12}" marker-end="url(#ah)"/>` + tx(x - 28, y + 4, o.u, 'end')
             : `<line class="arr" x1="${x - 14}" y1="${y + 22}" x2="${x + 14}" y2="${y + 22}" marker-end="url(#ah)"/>` + tx(x, y + 38, o.u, 'middle');
    }
    return `<g class="${o.s || ''}">${g}</g>`;
  }
  function V(x, y, o = {}) {
    const v = o.o !== 'h';
    let g = `<circle class="body" cx="${x}" cy="${y}" r="${RAD}"/>`;
    if (v) {
      const d = o.d === 'up' ? -1 : 1;
      g += `<line class="sym" x1="${x - RAD}" y1="${y}" x2="${x + RAD}" y2="${y}"/>`;
      g += `<line class="arr" x1="${x + 22}" y1="${y - 11 * d}" x2="${x + 22}" y2="${y + 11 * d}" marker-end="url(#ah)"/>`;
      if (o.n) g += tx(x + 30, y + 4, lbl(o.n, o.v));
    } else {
      const d = o.d === 'left' ? -1 : 1;
      g += `<line class="sym" x1="${x}" y1="${y - RAD}" x2="${x}" y2="${y + RAD}"/>`;
      g += `<line class="arr" x1="${x - 11 * d}" y1="${y + 24}" x2="${x + 11 * d}" y2="${y + 24}" marker-end="url(#ah)"/>`;
      if (o.n) g += tx(x, y + 42, lbl(o.n, o.v), 'middle');
    }
    return `<g class="${o.s || ''}">${g}</g>`;
  }
  function I(x, y, o = {}) {
    const v = o.o !== 'h';
    let g = `<circle class="body" cx="${x}" cy="${y}" r="${RAD}"/>`;
    if (v) {
      const up = o.d !== 'down';
      g += `<line class="arr" x1="${x}" y1="${up ? y + 9 : y - 9}" x2="${x}" y2="${up ? y - 9 : y + 9}" marker-end="url(#ah)"/>`;
      if (o.n) g += tx(x + 22, y + 4, lbl(o.n, o.v));
    } else {
      const r = o.d !== 'left';
      g += `<line class="arr" x1="${r ? x - 9 : x + 9}" y1="${y}" x2="${r ? x + 9 : x - 9}" y2="${y}" marker-end="url(#ah)"/>`;
      if (o.n) g += tx(x, y + 34, lbl(o.n, o.v), 'middle');
    }
    return `<g class="${o.s || ''}">${g}</g>`;
  }
  // Unterbrechung (Stromquelle "leerlaufen lassen")
  function gap(x, y, o = {}) {
    const v = o.o !== 'h';
    const w = v ? 12 : 44, h = v ? 40 : 12;
    let g = `<rect class="cover" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}"/>`;
    g += v ? term(x, y - 14) + term(x, y + 14) + tx(x + 14, y + 4, o.t || 'offen', 'start', 'mute')
           : term(x - 14, y) + term(x + 14, y) + tx(x, y + 26, o.t || 'offen', 'middle', 'mute');
    return `<g>${g}</g>`;
  }

  function svg(w, h, body, label) {
    return `<svg class="circ" viewBox="0 0 ${w} ${h}" style="--w:${w}px" role="img" aria-label="${label || 'Schaltbild'}">${body}</svg>`;
  }
  function figure(svgStr, cap) {
    const c = cap ? cap.replace(/_([A-Za-z0-9]+)/g, '<sub>$1</sub>') : '';
    return `<figure class="fig">${svgStr}${c ? `<figcaption>${c}</figcaption>` : ''}</figure>`;
  }

  /* ---------- Leiter-Netzwerk aus Spalten ----------
     cols: [{ series:{n,v}, br:[{t:'V'|'I'|'R', n, v, d}], load:true }]
     mode: 'norm' (mit Last und Trennstelle) | 'term' (offene Klemmen)
           | 'ul' (offene Klemmen + U_L) | 'ri' (Quellen aus, offene Klemmen + R_i) */
  function net(o) {
    const mode = o.mode || 'norm', T0 = 50, B0 = 190, W = 120, X0 = 44;
    const plain = mode === 'plain'; // geschlossenes Netzwerk ohne Klemmen
    const cols = o.cols.filter(c => !c.load || mode === 'norm' || plain);
    const hasLoad = !plain && cols.some(c => c.load);
    const xs = [];
    cols.forEach((c, i) => xs.push(i ? xs[i - 1] + W + (c.load && !cols[i - 1].load ? 60 : 0) : X0));
    const last = xs[xs.length - 1];
    const xend = (hasLoad || plain) ? last : last + 56;
    let s = pl([[X0, T0], [xend, T0]]) + pl([[X0, B0], [xend, B0]]);
    let cutX = null;
    cols.forEach((c, i) => {
      const x = xs[i];
      if (hasLoad && c.load && !cols[i - 1].load) cutX = (xs[i - 1] + x) / 2;
      if (c.series) s += R((xs[i - 1] + x) / 2, T0, { o: 'h', n: c.series.n, v: c.series.v, u: c.series.u });
      if (c.br && c.br.length) {
        s += pl([[x, T0], [x, B0]]);
        if (x < xend) s += dot(x, T0) + dot(x, B0);
        const n = c.br.length;
        const openI = mode === 'ri' && c.br.some(e => e.t === 'I');
        c.br.forEach((e, k) => {
          const y = T0 + (B0 - T0) * (k + 1) / (n + 1);
          const st = (c.load && !plain) ? 'load' : (openI && e.t !== 'I' ? 'dim' : '');
          const p = { o: 'v', n: e.n, v: e.v, d: e.d, s: st, u: e.u };
          if (e.t === 'R') s += R(x, y, p);
          else if (e.t === 'V') { if (mode !== 'ri') s += V(x, y, p); }
          else if (e.t === 'I') s += mode === 'ri' ? gap(x, y, { o: 'v' }) : I(x, y, p);
        });
      }
    });
    let wv;
    if (plain) {
      wv = last + 130;
    } else if (hasLoad) {
      s += `<line class="cut" x1="${cutX}" y1="${T0 - 28}" x2="${cutX}" y2="${B0 + 28}"/>`;
      s += term(cutX, T0) + term(cutX, B0);
      s += tx(cutX, T0 - 34, 'Trennstelle', 'middle', 'mute');
      s += tx(cutX - 9, T0 - 8, 'A', 'end', 'accT') + tx(cutX - 9, B0 + 20, 'B', 'end', 'accT');
      wv = last + 120;
    } else {
      s += term(xend, T0) + term(xend, B0);
      s += tx(xend, T0 - 12, 'A', 'middle', 'accT') + tx(xend, B0 + 24, 'B', 'middle', 'accT');
      wv = xend + 70;
      if (mode === 'ul') {
        const ax = xend + 30;
        s += `<line class="cut" x1="${xend}" y1="${T0}" x2="${ax}" y2="${T0}"/><line class="cut" x1="${xend}" y1="${B0}" x2="${ax}" y2="${B0}"/>`;
        s += `<line class="arrA" x1="${ax}" y1="${T0 + 2}" x2="${ax}" y2="${B0 - 2}" marker-end="url(#ahA)"/>` + tx(ax + 8, (T0 + B0) / 2 + 4, 'U_L', 'start', 'accT');
        wv = xend + 80;
      } else if (mode === 'ri') {
        const ax = xend + 30;
        s += `<line class="cut" x1="${xend}" y1="${T0}" x2="${ax}" y2="${T0}"/><line class="cut" x1="${xend}" y1="${B0}" x2="${ax}" y2="${B0}"/>`;
        s += `<line class="arrA" x1="${ax}" y1="${T0 + 2}" x2="${ax}" y2="${B0 - 2}" marker-start="url(#ahA)" marker-end="url(#ahA)"/>` + tx(ax + 8, (T0 + B0) / 2 + 4, 'R_i', 'start', 'accT');
        wv = xend + 80;
      }
    }
    return svg(wv, 250, s + (o.extra || ''), o.label);
  }

  /* ---------- Ersatzschaltungen mit Last ---------- */
  const theven = o => net({ cols: [
    { br: [{ t: 'V', n: 'U_L', v: o.UL, d: 'down' }] },
    { series: { n: 'R_i', v: o.Ri }, br: [] },
    { load: true, br: [{ t: 'R', n: o.ln || 'R_Last', v: o.RL }] }], label: 'Spannungsquellenersatzschaltung' });
  const norton = o => net({ cols: [
    { br: [{ t: 'I', n: 'I_K', v: o.IK, d: 'up' }] },
    { br: [{ t: 'R', n: 'R_i', v: o.Ri }] },
    { load: true, br: [{ t: 'R', n: o.ln || 'R_Last', v: o.RL }] }], label: 'Stromquellenersatzschaltung' });
  const thevenOpen = () => net({ mode: 'term', cols: [
    { br: [{ t: 'V', n: 'U_L', d: 'down' }] }, { series: { n: 'R_i' }, br: [] }] });
  const nortonOpen = () => net({ mode: 'term', cols: [
    { br: [{ t: 'I', n: 'I_K', d: 'up' }] }, { br: [{ t: 'R', n: 'R_i' }] }] });

  /* ---------- Blockbild: Trennstelle ---------- */
  function trenn() {
    let s = `<rect class="zone" x="20" y="24" width="210" height="150" rx="14"/>`;
    s += tx(125, 70, 'aktiver Zweipol', 'middle', 'accT') + tx(125, 92, 'enthält alle Quellen', 'middle', 'mute') + tx(125, 110, '(und beliebig viele R)', 'middle', 'mute');
    s += `<rect class="body" x="350" y="64" width="150" height="70" rx="14"/>`;
    s += tx(425, 96, 'passiver Zweipol', 'middle') + tx(425, 116, 'nur Widerstände', 'middle', 'mute');
    s += pl([[230, 64], [350, 64]]) + pl([[230, 134], [350, 134]]);
    s += `<line class="cut" x1="290" y1="30" x2="290" y2="168"/>` + term(290, 64) + term(290, 134);
    s += tx(290, 20, 'Trennstelle', 'middle', 'mute') + tx(280, 58, 'A', 'end', 'accT') + tx(280, 150, 'B', 'end', 'accT');
    s += `<line class="arr" x1="244" y1="82" x2="244" y2="116" marker-end="url(#ah)"/>` + tx(254, 103, 'U_AB', 'start');
    return svg(520, 190, s, 'Netzwerk mit Trennstelle in aktiven und passiven Zweipol');
  }

  /* ---------- Klausur SS 2016, Aufgabe 1 (TUT 3, Aufgabe 2) ----------
     modes: 'norm' (R_3 als Last) | 'ul' | 'ri' */
  function ss16(mode) {
    mode = mode || 'norm';
    const ri = mode === 'ri', ul = mode === 'ul', open = ri || ul;
    const wc = ri ? 'wire hl' : 'wire', dead = ri ? 'dim' : '';
    let s = '';
    // linker Teil: R1, I_C1, R2, U_q2
    s += `<g class="${dead}">`;
    s += pl([[60, 40], [200, 40], [200, 130]]) + pl([[60, 40], [60, 240], [200, 240]]);
    s += R(60, 140, { o: 'v', n: 'R_1' });
    s += R(200, 85, { o: 'v', n: 'R_2' });
    s += '</g>';
    if (ri) { s += gap(130, 40, { o: 'h' }); }
    else s += I(130, 40, { o: 'h', d: 'right', n: 'I_C1' });
    if (!ri) s += V(130, 240, { o: 'h', d: 'right', n: 'U_q2' });
    // mittlerer/rechter Teil
    s += pl([[200, 130], [340, 130], [420, 130], [420, 240], [340, 240], [200, 240]], wc);
    s += pl([[340, 130], [340, 240]], wc);
    s += R(270, 130, { o: 'h', n: 'R_4', s: ri ? 'hl' : '' });
    s += R(270, 240, { o: 'h', n: 'R_5', s: ri ? 'hl' : '' });
    s += R(420, 185, { o: 'v', n: 'R_6', s: ri ? 'dim' : '' });
    if (!ri) s += V(340, 185, { o: 'v', d: 'down', n: 'U_q3' });
    s += dot(200, 130) + dot(340, 130) + dot(340, 240) + dot(200, 240);
    // Trennstelle bei R_3
    if (!open) {
      s += pl([[200, 130], [200, 240]]) + R(200, 185, { o: 'v', n: 'R_3', s: 'load' });
      s += `<line class="arr" x1="184" y1="160" x2="184" y2="210" marker-end="url(#ahA)" style="stroke:var(--acc)"/>` + tx(176, 188, 'I_3', 'end', 'accT');
    } else {
      s += pl([[200, 130], [200, 155]]) + pl([[200, 240], [200, 215]]) + term(200, 155) + term(200, 215);
      s += tx(188, 159, 'A', 'end', 'accT') + tx(188, 223, 'B', 'end', 'accT');
      if (ul) s += `<line class="arrA" x1="226" y1="157" x2="226" y2="213" marker-end="url(#ahA)"/>` + tx(234, 189, 'U_L', 'start', 'accT');
      if (ri) s += `<line class="arrA" x1="226" y1="157" x2="226" y2="213" marker-start="url(#ahA)" marker-end="url(#ahA)"/>` + tx(234, 189, 'R_i', 'start', 'accT');
    }
    return svg(520, 300, s, 'Netzwerk aus Klausur SS 2016');
  }

  return { net, theven, norton, thevenOpen, nortonOpen, trenn, ss16, figure, svg, R, V, I, tx, pl, dot, term };
})();
