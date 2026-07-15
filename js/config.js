/* ============================================================
   config.js — vaste instellingen van het spel
   - De 10 diamanten in de kleuren en volgorde van haar tekening
   - De 4 niveaus
   ============================================================ */

window.RB = window.RB || {};

RB.config = {
  // Diamanten, van boven naar beneden zoals op haar tekening.
  // color = hoofdkleur, dark/light worden automatisch berekend (zie gems.js)
  DIAMONDS: [
    { name: "framboos", color: "#E23D82" }, // 1
    { name: "oranje",   color: "#F47A2A" }, // 2
    { name: "geel",     color: "#F6C915" }, // 3
    { name: "groen",    color: "#57B24A" }, // 4
    { name: "petrol",   color: "#2E9E86" }, // 5 (donkergroen)
    { name: "hemel",    color: "#4FA6E0" }, // 6 (helder blauw)
    { name: "blauw",    color: "#2C66B0" }, // 7 (donker blauw)
    { name: "paars",    color: "#8A5CC4" }, // 8
    { name: "roze",     color: "#F291B7" }, // 9 (zacht roze)
    { name: "koraal",   color: "#F0554C" }, // 10 (rood)
  ],

  // Aantal opties bij elke oefening (grote tik-knoppen).
  // 4 zodat "alles afgaan" ook echt 3 foute gokken betekent → regenboog verloren.
  N_OPTIONS: 4,

  // Na hoeveel foute gokken de regenboog opnieuw begint (tegen zomaar gokken)
  MAX_WRONG: 3,

  // De niveaus. id komt overeen met wat in de instellingen gekozen wordt.
  LEVELS: [
    {
      id: 1,
      name: "Cijfers zoeken tot 10",
      desc: "Ze hoort een getal en tikt het juiste cijfer aan (1 tot 10).",
    },
    {
      id: 2,
      name: "Plus tot 10",
      desc: "Optellen met sommen tot 10, met stipjes om te tellen.",
    },
    {
      id: 3,
      name: "Plus en min tot 10",
      desc: "Optellen én aftrekken tot 10.",
    },
    {
      id: 4,
      name: "Cijfers zoeken tot 20",
      desc: "Ze hoort een getal en tikt het juiste cijfer aan (tot 20).",
    },
    {
      id: 5,
      name: "Plus en min tot 20",
      desc: "Grotere sommen, optellen en aftrekken tot 20.",
    },
  ],

  // De beloningsdiamant per niveau: hoe moeilijker, hoe groter, andere kleur en meer glans
  LEVEL_GEM: {
    1: { color: "#5FB6E6", size: 0.80, label: "blauwe" },              // licht blauw, klein
    2: { color: "#6FC15E", size: 0.94, label: "groene" },              // groen
    3: { color: "#A986DE", size: 1.08, label: "paarse" },              // paars
    4: { color: "#EF8FB0", size: 1.20, label: "roze" },                // roze, groter
    5: { color: "#F3C233", size: 1.36, shiny: true, label: "gouden" }, // goud, grootst + extra glans
  },

  // Nederlandse getalwoorden (voor de voorleesstem)
  WORDS: [
    "nul", "een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht",
    "negen", "tien", "elf", "twaalf", "dertien", "veertien", "vijftien",
    "zestien", "zeventien", "achttien", "negentien", "twintig",
  ],

  // Toegangsdrempel: hash van het wachtwoord (standaard "regenboog").
  // Veranderen? Zie js/auth.js voor de uitleg.
  PASSCODE_HASH: "3626104624189726",

  // De spelers; elk houdt een eigen verzameling bij
  PLAYERS: ["Lea", "Mama", "Papa"],

  // Elke diamant is punten waard = zijn niveau (niveau 1 = 1 punt ... niveau 5 = 5 punten).
  // Een cadeautje kan een eis hebben op punten (points) en/of op diamanten per niveau (need).
  //   need: { 1: 10, 2: 10 } = minstens 10 blauwe (niveau 1) én 10 groene (niveau 2).
  // Ze worden in volgorde behaald (frietjes eerst). Pas gerust aan / voeg toe.
  REWARDS: [
    { name: "Frietjes gaan eten", art: "fries", need: { 1: 10, 2: 10 } },
    { name: "Een ijsje gaan eten", art: "icecream", points: 90 },
    { name: "Een cadeautje krijgen", art: "gift", points: 150 },
  ],

  // Kleine, vrolijke complimentjes (nooit competitief, nooit "fout")
  PRAISE: [
    "Goed gedaan!", "Knap hoor!", "Wauw, super!", "Jaaa, gelukt!",
    "Prachtig!", "Heel goed!", "Wat slim!", "Fantastisch!", "Yes, top!",
  ],

  // Zachte hints bij een mis-tik (geen straf, gewoon een duwtje)
  NUDGE: ["Probeer nog eens 💛", "Bijna! Kijk nog eens", "Neem je tijd, het lukt", "Tel maar rustig mee"],
};
