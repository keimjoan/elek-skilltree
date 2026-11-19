/* Platzhalter im Skilltree (noch ohne Inhalt).
   Sobald es eine Datei skills/<id>.js mit derselben id gibt, ersetzt sie den Platzhalter. */
Skills.plan({ id: 'grundgroessen', title: 'Grundgrößen', sub: 'Strom, Spannung, Widerstand' });
Skills.plan({ id: 'knoten', title: 'Knoten & Maschen', sub: 'Kirchhoff, Teiler', requires: ['grundgroessen'] });
Skills.plan({ id: 'efeld', title: 'E-Feld & Kondensator', sub: 'Kapazität, Schaltvorgänge', requires: ['grundgroessen'] });
Skills.plan({ id: 'magnet', title: 'Magnetfeld & Spule', sub: 'Induktion, Magnetkreis', requires: ['grundgroessen'] });
Skills.plan({ id: 'wechselstrom', title: 'Wechselstrom', sub: 'Zeiger, komplexe Zahlen', requires: ['efeld', 'magnet'] });
