# ELEK Skilltree

Öffnen: `index.html` per Doppelklick im Browser. Kein Server, keine Installation. Der Fortschritt wird im Browser gespeichert (localStorage).

## Neuen Skill hinzufügen

1. Datei `skills/<id>.js` anlegen (am einfachsten `skills/zweipol.js` kopieren).
2. In `index.html` eine Zeile ergänzen: `<script src="skills/<id>.js"></script>`.

Das war's. Hat die `id` einen Platzhalter in `skills/_geplant.js`, ersetzt der Skill ihn im Tree. Sonst erscheint er als neuer Knoten. `requires: ['id', …]` legt fest, unter welchem Knoten er hängt.

## Aufbau einer Skill-Datei

```js
Skills.add({
  id: 'knoten', title: 'Knoten & Maschen', sub: 'Kirchhoff, Teiler',
  requires: ['grundgroessen'],
  figs: { name: () => Circuit.figure(Circuit.net({...}), 'Bildunterschrift') },
  chapters: [{
    id: 'kapitel-1', group: 'Konzept', title: 'Titel',
    body: `<p>Text mit R_i (Index wird automatisch tiefgestellt)</p>{{fig:name}}`,
    steps: [ /* Rechenschritte, Auswahl-Fragen, Kurz-Checks */ ]
  }]
});
```

Schritt-Typen:

- Zahl: `{ q, unit: 'mA', answer: 200, result, after?, figAfter?, hints: [4 Texte] }`
- Auswahl: `{ type: 'choice', q, options: [{ t, ok: true }, { t, why }], result, hints }`

Die vier Hilfestufen sind: Kleiner Stups, Welche Regel?, Ansatz, Ich check gar nichts. Die letzte zeigt die Lösung samt neu gezeichnetem Schaltbild (`figAfter`).

## Schaltbilder

`Circuit.net({ cols, mode })` zeichnet Leiternetzwerke aus Spalten (Quellen `V`/`I`, Widerstände `R`). Modi: `norm` (mit Last und Trennstelle), `term`, `ul` (U_L-Pfeil), `ri` (Quellen aus). Fertige Ersatzschaltungen: `Circuit.theven`, `Circuit.norton`. Das Netzwerk der Klausur SS 2016 ist von Hand gezeichnet (`Circuit.ss16`).
