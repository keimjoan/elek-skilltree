/* ELEK Skilltree – Router, Skilltree-Ansicht, Skill-Ansicht, Schritte, Hilfen.
   Neuen Skill anlegen: siehe README.md */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Skill-Registry ---------- */
  const skills = [], planned = [];
  window.Skills = {
    add: s => skills.push(s),
    plan: n => planned.push(n),
    get: id => skills.find(s => s.id === id),
    nodes() {
      const have = new Set(skills.map(s => s.id));
      return planned.filter(p => !have.has(p.id)).map(p => ({ ...p, ready: false }))
        .concat(skills.map(s => ({ id: s.id, title: s.title, sub: s.sub, requires: s.requires || [], ready: true })));
    }
  };

  /* ---------- Fortschritt (localStorage, darf fehlen) ---------- */
  const KEY = 'elek-skilltree-v1';
  const Store = {
    d: {},
    load() { try { this.d = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { this.d = {}; } },
    save() { try { localStorage.setItem(KEY, JSON.stringify(this.d)); } catch (e) { /* ohne Speicher weiter */ } },
    skill(id) {
      // Ändert sich der Aufbau eines Skills (skill.version), wird der alte Fortschritt verworfen
      const o = this.d[id] || (this.d[id] = { ch: {}, st: {} }), sk = window.Skills && Skills.get(id), v = (sk && sk.version) || 1;
      if ((o.v || 1) !== v) { o.v = v; o.ch = {}; o.st = {}; this.save(); }
      return o;
    }
  };
  function chapterDone(skill, ch) {
    const S = Store.skill(skill.id);
    if (!(ch.steps && ch.steps.length)) return !!S.ch[ch.id];
    return ch.steps.every((_, i) => S.st[ch.id + ':' + i]);
  }
  function progress(skill) {
    const n = skill.chapters.length;
    return n ? skill.chapters.filter(c => chapterDone(skill, c)).length / n : 0;
  }

  /* ---------- Text-Helfer ---------- */
  // R_i -> R mit tiefgestelltem i; nur in Text, nie innerhalb von Tags
  function fx(h) {
    return String(h).split(/(<[^>]+>)/).map((p, i) => i % 2 ? p :
      p.replace(/_([A-Za-z0-9äöüÄÖÜ]+)/g, '<sub>$1</sub>').replace(/\^(-?\d+)/g, (m, n) => '<sup>' + n.replace('-', '−') + '</sup>')).join('');
  }
  function rich(h, skill) {
    return fx(h).replace(/\{\{fig:([\w+-]+)\}\}/g, (m, names) =>
      '<div class="figs">' + names.split('+').map(n => (skill.figs && skill.figs[n]) ? skill.figs[n]() : '').join('') + '</div>');
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- Zahlen prüfen ---------- */
  const PREF = { '': 1, m: 1e-3, k: 1e3, M: 1e6, 'µ': 1e-6, 'μ': 1e-6, u: 1e-6, n: 1e-9 };
  function parseUnit(u) {
    u = (u || '').trim().replace(/ohm/i, 'Ω').replace(/^Ω$/, 'Ω');
    const m = u.match(/^([mkMµμun]?)([AVΩCWSJ])$/);
    return m ? { f: PREF[m[1]], base: m[2] } : null;
  }
  function toBase(val, unit) { const p = parseUnit(unit); return p ? { v: val * p.f, base: p.base } : null; }
  function checkNum(input, st) {
    const m = String(input).trim().match(/^([-+−]?\d*[.,]?\d+(?:[eE][-+]?\d+)?)\s*(.*)$/);
    if (!m) return { ok: false, msg: 'Bitte eine Zahl eingeben, z. B. 12,5' };
    const num = parseFloat(m[1].replace(',', '.').replace('−', '-'));
    const want = toBase(st.answer, st.unit);
    let got;
    if (!want) { // freie Einheit (z. B. A/mm², 1/K, Wh): nur die Zahl wird verglichen
      return Math.abs(num - st.answer) <= (st.tol || 0.01) * Math.abs(st.answer) + 1e-12
        ? { ok: true } : { ok: false, msg: `Noch nicht ganz. Achte auf die Einheit ${st.unit}.` };
    }
    got = m[2] ? toBase(num, m[2]) : toBase(num, st.unit);
    if (!got) return { ok: false, msg: 'Einheit nicht erkannt. Erlaubt sind z. B. V, mA, kΩ.' };
    if (got.base !== want.base) return { ok: false, msg: `Hier ist eine Größe in ${want.base} gefragt.` };
    const tol = st.tol || 0.01;
    if (Math.abs(got.v - want.v) <= tol * Math.abs(want.v) + 1e-12) return { ok: true };
    const ratio = got.v / want.v;
    if (Math.abs(Math.log10(Math.abs(ratio))) > 2.9 && Math.abs(Math.log10(Math.abs(ratio))) < 3.1) return { ok: false, msg: 'Fast: Zehnerpotenz bzw. Einheit (m, k) prüfen.' };
    if (ratio < 0 && Math.abs(Math.abs(ratio) - 1) < tol) return { ok: false, msg: 'Betrag stimmt, das Vorzeichen nicht.' };
    return { ok: false, msg: 'Noch nicht ganz. Öffne eine Hilfe, wenn du magst.' };
  }

  /* ---------- Schritt-Komponente (Rechenschritt, Auswahl, Kurz-Check) ---------- */
  const LEVELS = ['Kleiner Stups', 'Welche Regel?', 'Ansatz', 'Ich check gar nichts'];
  function stepCard(skill, ch, st, i, state) {
    const key = ch.id + ':' + i;
    const q = `<div class="q"><b class="n">${i + 1}</b>${rich(st.q, skill)}</div>`;
    const figv = st.fig ? rich(`{{fig:${st.fig}}}`, skill) : '';
    if (st.type === 'info') { // Erklär-Schritt: Text und Bild, dann „Verstanden“
      return `<section class="step info ${state ? 'done' : ''}" data-key="${key}">${q}` +
        (st.text ? `<div class="after">${rich(st.text, skill)}</div>` : '') + figv +
        (state ? '' : '<button class="btn" data-act="ack">Verstanden – weiter</button>') + '</section>';
    }
    if (state) {
      const res = st.result ? `<div class="res ${state === 'seen' ? 'seen' : ''}"><span class="tick">✓</span>${rich(st.result, skill)}</div>` : '';
      return `<section class="step done" data-key="${key}">${q}${figv}${res}` +
        (st.after ? `<div class="after">${rich(st.after, skill)}</div>` : '') +
        (st.figAfter ? rich(`{{fig:${st.figAfter}}}`, skill) : '') + '</section>';
    }
    let input;
    if (st.type === 'choice') {
      input = '<div class="opts">' + st.options.map((o, k) => `<button class="opt" data-o="${k}">${rich(o.t, skill)}</button>`).join('') + '</div>';
    } else {
      input = `<div class="ans"><input type="text" inputmode="decimal" autocomplete="off" aria-label="Ergebnis" placeholder="Ergebnis"><span class="unit">${esc(st.unit)}</span><button class="btn" data-act="check">Prüfen</button></div>`;
    }
    const hints = st.hints || [];
    const pills = hints.map((h, k) => h ? `<button class="pill" data-h="${k}">${LEVELS[k]}</button>` : '').join('');
    return `<section class="step" data-key="${key}">${q}${figv}${input}<div class="fb" role="status"></div>` +
      (pills ? `<div class="help">Hilfe:&nbsp;${pills}</div><div class="hints"></div>` : '') + '</section>';
  }
  function stepsHTML(skill, ch) {
    const S = Store.skill(skill.id);
    let out = '';
    for (let i = 0; i < ch.steps.length; i++) {
      const state = S.st[ch.id + ':' + i];
      out += stepCard(skill, ch, ch.steps[i], i, state);
      if (!state) break;
    }
    if (ch.steps.length && chapterDone(skill, ch) && ch.finish) out += `<div class="finish">${rich(ch.finish, skill)}</div>`;
    return out;
  }

  /* ---------- Skill-Ansicht ---------- */
  let cur = null; // {skill, idx}
  function renderSide(skill, idx) {
    const groups = [];
    skill.chapters.forEach((c, i) => {
      let g = groups.find(x => x.name === c.group);
      if (!g) groups.push(g = { name: c.group, items: [] });
      g.items.push({ c, i });
    });
    return `<a class="back" href="#/">← Skilltree</a><h2>${fx(skill.title)}</h2>` +
      `<div class="prog"><i style="width:${Math.round(progress(skill) * 100)}%"></i></div><div class="chs">` +
      groups.map(g => `<h3>${esc(g.name)}</h3>` + g.items.map(({ c, i }) =>
        `<a class="ch ${i === idx ? 'cur' : ''} ${chapterDone(skill, c) ? 'done' : ''}" href="#/s/${skill.id}/${c.id}"><span class="d"></span><span>${fx(c.title)}</span></a>`).join('')).join('') + '</div>';
  }
  function renderChapter(skill, idx) {
    cur = { skill, idx };
    const ch = skill.chapters[idx], n = skill.chapters.length;
    if (!(ch.steps && ch.steps.length)) { Store.skill(skill.id).ch[ch.id] = 1; Store.save(); }
    const prev = skill.chapters[idx - 1], next = skill.chapters[idx + 1];
    $('#app').innerHTML = `<div class="skill"><nav class="side">${renderSide(skill, idx)}</nav><article id="chap">` +
      `<p class="eyebrow">${esc(ch.group)} · ${idx + 1} von ${n}</p><h1>${fx(ch.title)}</h1>` +
      `<div class="body">${rich(typeof ch.body === 'function' ? ch.body() : ch.body, skill)}</div>` +
      `<div id="steps">${ch.steps ? stepsHTML(skill, ch) : ''}</div>` +
      `<div class="pager">${prev ? `<a href="#/s/${skill.id}/${prev.id}">← ${fx(prev.title)}</a>` : '<span></span>'}` +
      `${next ? `<a class="next" href="#/s/${skill.id}/${next.id}">${fx(next.title)} →</a>` : `<a class="next" href="#/">Zurück zum Skilltree →</a>`}</div>` +
      '</article></div>';
    $('#crumb').textContent = skill.title;
    window.scrollTo(0, 0);
  }
  function refreshSteps() {
    const { skill, idx } = cur, ch = skill.chapters[idx];
    $('#steps').innerHTML = stepsHTML(skill, ch);
    $('.side').innerHTML = renderSide(skill, idx);
    const nxt = $('#steps .step:not(.done)');
    if (nxt) {
      const f = $('input', nxt);
      if (f) f.focus({ preventScroll: true });
      const top = nxt.getBoundingClientRect().top;
      if (top > window.innerHeight * 0.6 || top < 0) nxt.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }
  function setState(sec, state) {
    const { skill, idx } = cur, ch = skill.chapters[idx];
    Store.skill(skill.id).st[sec.dataset.key] = state; Store.save(); refreshSteps();
  }
  function stepOf(sec) {
    const { skill, idx } = cur, ch = skill.chapters[idx];
    return ch.steps[parseInt(sec.dataset.key.split(':')[1], 10)];
  }

  document.addEventListener('click', e => {
    if (!cur) return;
    const sec = e.target.closest('.step');
    if (!sec || sec.classList.contains('done')) return;
    const st = stepOf(sec), fb = $('.fb', sec), skill = cur.skill;
    const pill = e.target.closest('.pill');
    if (pill) {
      const k = +pill.dataset.h, box = $('.hints', sec), ex = $(`.hint[data-h="${k}"]`, box);
      if (ex) { ex.remove(); pill.classList.remove('open'); return; }
      const d = document.createElement('div');
      d.className = 'hint'; d.dataset.h = k;
      let inner = `<span class="lv">${LEVELS[k]}</span>` + rich(st.hints[k], skill);
      if (k === 3) {
        if (st.figAfter) inner += rich(`{{fig:${st.figAfter}}}`, skill);
        inner += '<button class="btn ghost" data-act="seen">Verstanden – weiter</button>';
      }
      d.innerHTML = inner; box.appendChild(d); pill.classList.add('open');
      return;
    }
    if (e.target.closest('[data-act="ack"]')) return setState(sec, 'ok');
    if (e.target.closest('[data-act="seen"]')) return setState(sec, 'seen');
    if (e.target.closest('[data-act="check"]')) return runCheck(sec, st);
    const opt = e.target.closest('.opt');
    if (opt) {
      const o = st.options[+opt.dataset.o];
      if (o.ok) { opt.classList.add('good'); setState(sec, 'ok'); }
      else {
        opt.classList.add('bad');
        fb.className = 'fb bad'; fb.innerHTML = rich(o.why || 'Das passt noch nicht – schau dir die Hilfe an.', skill);
      }
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('.step .ans input')) runCheck(e.target.closest('.step'), stepOf(e.target.closest('.step')));
  });
  function runCheck(sec, st) {
    const fb = $('.fb', sec), r = checkNum($('input', sec).value, st);
    if (r.ok) setState(sec, 'ok');
    else { fb.className = 'fb bad'; fb.textContent = r.msg; }
  }

  /* ---------- Skilltree-Ansicht ---------- */
  function renderTree() {
    cur = null; $('#crumb').textContent = '';
    const nodes = Skills.nodes(), byId = Object.fromEntries(nodes.map(n => [n.id, n]));
    const depth = {};
    const dOf = n => depth[n.id] !== undefined ? depth[n.id] :
      (depth[n.id] = (n.requires || []).filter(r => byId[r]).reduce((m, r) => Math.max(m, dOf(byId[r]) + 1), 0));
    nodes.forEach(dOf);
    const rows = [];
    nodes.forEach(n => (rows[depth[n.id]] = rows[depth[n.id]] || []).push(n));
    const pos = {};
    rows.forEach((row, ri) => {
      if (ri > 0) {
        const key = n => { const ps = (n.requires || []).filter(r => byId[r]).map(r => pos[r]); return ps.length ? ps.reduce((a, b) => a + b, 0) / ps.length : 99; };
        row.sort((a, b) => key(a) - key(b));
      }
      row.forEach((n, i) => pos[n.id] = i);
    });
    const card = n => {
      if (!n.ready) return `<div class="node planned" id="n-${n.id}"><b>${fx(n.title)}</b><small>${fx(n.sub || '')}</small><span class="tag">bald</span></div>`;
      const sk = Skills.get(n.id), p = progress(sk), pct = Math.round(p * 100);
      return `<a class="node ready ${p === 1 ? 'done' : ''}" id="n-${n.id}" href="#/s/${n.id}"><b>${fx(n.title)}</b><small>${fx(n.sub || '')}</small><div class="bar"><i style="width:${pct}%"></i></div></a>`;
    };
    $('#app').innerHTML = `<div class="tree-head"><h1>Skilltree</h1><p>Elektrotechnik, ein Skill nach dem anderen.</p></div>` +
      `<div class="tree" id="tree"><svg class="links"></svg>${rows.map(r => `<div class="row">${r.map(card).join('')}</div>`).join('')}</div>`;
    drawLinks(nodes);
  }
  function drawLinks(nodes) {
    const tree = $('#tree'); if (!tree) return;
    const svg = $('svg.links', tree), tb = tree.getBoundingClientRect();
    let d = '';
    nodes.forEach(n => (n.requires || []).forEach(r => {
      const a = $('#n-' + r), b = $('#n-' + n.id); if (!a || !b) return;
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      const x1 = ra.left + ra.width / 2 - tb.left, y1 = ra.bottom - tb.top, x2 = rb.left + rb.width / 2 - tb.left, y2 = rb.top - tb.top, m = (y1 + y2) / 2;
      d += `<path d="M${x1},${y1} C${x1},${m} ${x2},${m} ${x2},${y2}"/>`;
    }));
    svg.innerHTML = d;
  }
  window.addEventListener('resize', () => { if (!cur && $('#tree')) drawLinks(Skills.nodes()); });

  /* ---------- Router ---------- */
  function route() {
    const m = location.hash.match(/^#\/s\/([\w-]+)(?:\/([\w-]+))?/);
    if (m && Skills.get(m[1])) {
      const sk = Skills.get(m[1]);
      let idx = m[2] ? sk.chapters.findIndex(c => c.id === m[2]) : sk.chapters.findIndex(c => !chapterDone(sk, c));
      if (idx < 0) idx = 0;
      renderChapter(sk, idx);
    } else renderTree();
  }
  window.App = { start() { Store.load(); window.addEventListener('hashchange', route); route(); } };
})();
