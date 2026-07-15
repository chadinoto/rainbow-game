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

  // Na hoeveel fouten over de HELE regenboog-ronde ze opnieuw moet beginnen
  // (3 = ze mag er 2 maken; bij de 3e fout begint de regenboog opnieuw)
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
    {
      id: 6,
      name: "Plus tot 100",
      desc: "Optellen tot 100. Zelf intypen.",
    },
    {
      id: 7,
      name: "Zelf typen tot 20",
      desc: "Plus en min tot 20, maar zelf het antwoord intypen.",
    },
    {
      id: 8,
      name: "Min tot 100",
      desc: "Aftrekken tot 100. Zelf intypen.",
    },
    {
      id: 9,
      name: "Plus tot 200",
      desc: "Optellen tot 200. Zelf intypen.",
    },
    {
      id: 10,
      name: "Min tot 200",
      desc: "Aftrekken tot 200. Zelf intypen.",
    },
    {
      id: 11,
      name: "Plus en min tot 200",
      desc: "Optellen en aftrekken tot 200. Zelf intypen.",
    },
  ],

  // Niveaus waar je het antwoord zelf typt (numpad) i.p.v. keuzeknoppen
  NUMPAD_LEVELS: [6, 7, 8, 9, 10, 11],

  // De beloningsdiamant per niveau: hoger niveau = groter (leuk), maar dat verandert
  // NIETS aan de cadeautjes — die tellen het AANTAL diamanten per kleur (10 stuks), geen punten.
  LEVEL_GEM: {
    1: { color: "#5FB6E6", size: 0.80, label: "blauwe" },
    2: { color: "#6FC15E", size: 0.94, label: "groene" },
    3: { color: "#A986DE", size: 1.08, label: "paarse" },
    4: { color: "#EF8FB0", size: 1.20, label: "roze" },
    5: { color: "#F3C233", size: 1.36, shiny: true, label: "gouden" },
    6: { color: "#E23D5A", size: 1.50, shiny: true, label: "rode" },       // Raphael: plus tot 100
    7: { color: "#22B2C9", size: 1.44, shiny: true, label: "turkooizen" }, // Lea: zelf typen tot 20
    8: { color: "#F0812E", size: 1.52, shiny: true, label: "oranje" },     // Raphael: min tot 100
    9: { color: "#7A5BD8", size: 1.54, shiny: true, label: "indigo" },     // Raphael: plus tot 200
    10: { color: "#E0559E", size: 1.56, shiny: true, label: "magenta" },   // Raphael: min tot 200
    11: { color: "#2FA88E", size: 1.60, shiny: true, label: "petrol" },    // Raphael: plus en min tot 200
  },

  // Nederlandse getalwoorden (voor de voorleesstem)
  WORDS: [
    "nul", "één", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht",
    "negen", "tien", "elf", "twaalf", "dertien", "veertien", "vijftien",
    "zestien", "zeventien", "achttien", "negentien", "twintig",
  ],

  // Toegangsdrempel: hash van het wachtwoord (standaard "regenboog").
  // Veranderen? Zie js/auth.js voor de uitleg.
  PASSCODE_HASH: "3626104624189726",

  // De spelers; elk houdt een eigen verzameling bij
  PLAYERS: ["Lea", "Raphael", "Mama", "Papa"],

  // Welke niveaus elke speler ziet. Kinderen krijgen oefeningen op hun maat;
  // ouders (niet in deze lijst) zien alle niveaus.
  PLAYER_LEVELS: {
    Lea: [1, 2, 3, 4, 5, 7],
    Raphael: [6, 8, 9, 10, 11], // plus100, min100, plus200, min200, plus+min200
  },

  // Beginscore die één keer wordt toegepast (per SEED_VERSION): Lea's diamanten
  // worden exact op deze waarden gezet. Verhoog SEED_VERSION om opnieuw te seeden.
  SEED_VERSION: 2,
  SEED: { Lea: { gems: { 1: 10, 2: 10, 3: 10, 4: 0, 5: 0, 6: 0 } } },

  // need = hoeveel diamanten van elke kleur je nodig hebt voor dit cadeautje.
  //   Absoluut: bv. frietjes { 1: 10, 2: 10, 3: 10 } = heb 10 blauwe én 10 groene én 10 paarse.
  //   Dezelfde diamanten tellen voor meerdere cadeautjes (geen verbruik-in-volgorde).
  REWARDS: [
    { name: "Een ijsje gaan eten", art: "icecream", need: { 1: 10 } },        // makkelijkst: 10 blauwe
    { name: "Een lolly", art: "lolly", need: { 2: 10 } },                      // + 10 groene
    { name: "Frietjes gaan eten", art: "fries", need: { 1: 10, 2: 10, 3: 10, 4: 10 } },        // blauw + groen + paars + roze
    { name: "Een cadeautje krijgen", art: "gift", need: { 1: 10, 2: 10, 3: 10, 4: 10, 5: 10 } }, // alle vijf de kleuren
  ],

  // Aparte cadeautjes per speler. Raphael verdient rode diamanten (niveau 6),
  // dus zijn cadeautjes tellen die. Wie niet in de lijst staat, gebruikt REWARDS.
  PLAYER_REWARDS: {
    Raphael: [
      { name: "Een ijsje gaan eten", art: "icecream", need: { 6: 10 } },         // plus tot 100
      { name: "Een lolly", art: "lolly", need: { 8: 10 } },                       // min tot 100
      { name: "Frietjes gaan eten", art: "fries", need: { 6: 10, 8: 10, 9: 10 } }, // rood + oranje + paars
      { name: "Een cadeautje krijgen", art: "gift", need: { 6: 10, 8: 10, 9: 10, 10: 10, 11: 10 } }, // 10 van alles
    ],
  },

  // Kleine, vrolijke complimentjes (nooit competitief, nooit "fout")
  PRAISE: [
    "Goed gedaan!", "Knap hoor!", "Wauw, super!", "Jaaa, gelukt!",
    "Prachtig!", "Heel goed!", "Wat slim!", "Fantastisch!", "Yes, top!",
  ],

  // Zachte hints bij een mis-tik (geen straf, gewoon een duwtje)
  NUDGE: ["Probeer nog eens 💛", "Bijna! Kijk nog eens", "Neem je tijd, het lukt", "Tel maar rustig mee"],
};
