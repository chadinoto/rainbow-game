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
- **⚙️ Voor mama & papa** — zet geluid aan/uit, wis een verzameling, of open **"Hoe gaat het?"**
- **🔊** in het spel — het getal nog eens laten voorlezen
- **🏠** — terug naar het startscherm

## Niveaus

1. **Cijfers zoeken** — ze hoort een getal en tikt het juiste cijfer aan (1–10), of telt voorwerpjes
2. **Plus tot 10** — optellen met stipjes als hulp
3. **Plus en min tot 10** — optellen én aftrekken
4. **Plus en min tot 20** — grotere sommen

### Lezen (Lea leert lezen)

Drie niveaus, alle drie met enkel de klanken die ze al kent:

1. **Korte woordjes** — hoogstens 3 letters, zoals op het letterscherm geteld (`kaas` = k·aa·s)
2. **Langere woordjes** — 4 letters of meer (`kaars`, `kraam`, `kermis`)
3. **Zinnetjes** — korte zinnen (`ik mis kaas`); de afleiders verschillen in één woord

**Lees-challenge** (los van de gewone cadeautjes): 10 korenblauwe diamanten op
*Korte woordjes lezen* = **een zakje chips**. Staat onderaan in de schatkist;
aanpassen in `CHALLENGE` in `js/config.js`.


Eerst kiest ze op een **letterscherm** welke klanken ze al kent (bv. `i k m s aa r e`);
die keuze blijft bewaard per speler en synchroniseert via de cloud. Daarna staat er een
woordje dat ze met díe klanken kan lezen (bv. `kaas`), en leest de stem drie
mogelijkheden voor: *één: kaak, twee: kaas, drie: kaars*. Ze tikt het nummer aan van
het woord dat er staat; met het luidsprekertje op elke kaart hoort ze die opnieuw.

- Afleiders zijn bij voorkeur **bestaande woorden** die één klank verschillen; pas als
  die er niet zijn, een verzonnen woordje met haar klanken (zoals *aap → aam*).
- Opties die hetzelfde klinken (reis/rijs, lach/lag, hond/hont) komen nooit samen.
- Na een mis-tik verschijnt het woord in klanken: `k · aa · r · s`.
- Nieuwe woorden toevoegen: `READ_WORDS` in `js/exercises.js`, daarna
  `node tools/check-leeswoorden.mjs i k m s aa r e` om te controleren.

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
js/calendar.js    kalender in de schatkist (per dag: diamanten, minuten, cadeautjes)
js/dashboard.js   "Hoe gaat het?" — analyse voor de ouders
js/main.js        de spellus en de schermen

tools/check-leeswoorden.mjs   node tools/check-leeswoorden.mjs → controleert woordjes lezen
tools/test-dashboard.mjs      node tools/test-dashboard.mjs  → controleert de cijfers
tools/preview-dashboard.html  het dashboard bekijken met verzonnen data (dubbelklikken)
```

## Hoe gaat het? (alleen voor de ouders)

Achter ⚙️ zit een dashboard over de gelogde antwoorden: hoeveel er geoefend wordt,
hoeveel er lukt, hoe lang een oefening duurt en of dat vlotter wordt. Per kind en per
periode (7 / 30 / 90 dagen of alles), met een vergelijking tussen de eerste en de
tweede helft van die periode — zo zie je vooruitgang zonder dat er ergens een score staat.

Dit scherm is **bewust niet zichtbaar voor de kinderen**: percentages, fouten en tijden
horen niet thuis in een spel dat rond faalangst gebouwd is. De minuten en diamanten
komen uit dezelfde reconstructie als de kalender, zodat beide schermen hetzelfde tonen.
