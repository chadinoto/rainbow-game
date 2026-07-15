# Diamanten verzamelen 💎

Een lief reken-spelletje voor een 6-jarige die net naar de lagere school gaat.
Ze maakt een **regenboog** af (10 gekleurde edelstenen, in haar eigen kleuren en volgorde,
naar haar tekening) door cijfers te herkennen en plus/min-oefeningen te maken.

**Beloningslus in twee lagen:** elke afgemaakte regenboog levert **1 diamant** op, die in
haar **schatkist** valt. De schatkist groeit blijvend, wat de lange-termijn motivatie geeft
zonder tijd of competitie.

Gebouwd rond **geen faalangst**: geen fout, geen timer, geen score. Een mis-tik geeft
een zacht duwtje en hulp (stipjes om te tellen). De edelsteen valt pas als het juist is,
en wat verzameld is raak je nooit meer kwijt. Elke volle regenboog eindigt met een feestje,
in een zachte, moderne **kawaii**-stijl met eigen illustraties (geen emoji).

## Spelen

Dubbelklik op `index.html` — het opent in de browser, geen server nodig.
Werkt ook op de iPad (zet het bestand online, bv. via GitHub Pages, of open lokaal).

- **▶ Spelen** — start het spel
- **⚙️ Voor mama & papa** — kies het niveau en zet geluid aan/uit
- **🔊** in het spel — het getal nog eens laten voorlezen
- **🏠** — terug naar het startscherm

## Niveaus

1. **Cijfers zoeken** — ze hoort een getal en tikt het juiste cijfer aan (1–10), of telt voorwerpjes
2. **Plus tot 10** — optellen met stipjes als hulp
3. **Plus en min tot 10** — optellen én aftrekken
4. **Plus en min tot 20** — grotere sommen

Voortgang en verzameling worden op het toestel bewaard (browser `localStorage`).

## Techniek

Pure HTML/CSS/JavaScript, geen build-stap, geen externe bibliotheken.
Geluidjes komen van de Web Audio API en de voorleesstem van de Web Speech API,
dus er zijn geen geluidsbestanden nodig.

```
index.html
css/style.css
js/config.js      de 10 diamanten + de 4 niveaus
js/storage.js     voortgang bewaren
js/audio.js       geluidjes + Nederlandse voorleesstem
js/gems.js        diamanten tekenen (SVG) + fonkelen
js/exercises.js   oefeningen maken per niveau
js/main.js        de spellus en de schermen
```
