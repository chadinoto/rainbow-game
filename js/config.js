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
      name: "Plus en min tot 100",
      desc: "Grote sommen, optellen en aftrekken tot 100.",
    },
  ],

  // De beloningsdiamant per niveau: hoe moeilijker, hoe groter, andere kleur en meer glans
  LEVEL_GEM: {
    1: { color: "#5FB6E6", size: 0.80, label: "blauwe" },              // licht blauw, klein
    2: { color: "#6FC15E", size: 0.94, label: "groene" },              // groen
    3: { color: "#A986DE", size: 1.08, label: "paarse" },              // paars
    4: { color: "#EF8FB0", size: 1.20, label: "roze" },                // roze, groter
    5: { color: "#F3C233", size: 1.36, shiny: true, label: "gouden" }, // goud
    6: { color: "#E23D5A", size: 1.50, shiny: true, label: "rode" },   // rood, voor Raphael (tot 100)
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
    Lea: [1, 2, 3, 4, 5],
    Raphael: [6],
  },

  // Beginscore die één keer wordt toegepast (per SEED_VERSION): Lea wordt opgewaardeerd
  // tot minstens deze waarden (nooit minder). Verhoog SEED_VERSION om opnieuw te seeden.
  SEED_VERSION: 1,
  SEED: { Lea: { gems: { 1: 10, 2: 10, 3: 10, 4: 0, 5: 0 } } },

  // Elke diamant is punten waard = zijn niveau (niveau 1 = 1 punt ... niveau 5 = 5 punten).
  // need = wat DIT cadeautje extra kost aan diamanten per niveau.
  //   Diamanten vullen de cadeautjes in volgorde: zit een kleur in twee cadeautjes,
  //   dan gaat ze eerst naar het eerste in de rij, de rest telt voor het volgende.
  //   Bv. ijsje kost 10 blauwe; frietjes kost daarna nóg 10 blauwe (dus 20 in totaal).
  REWARDS: [
    { name: "Een ijsje gaan eten", art: "icecream", need: { 1: 10 } },        // makkelijkst: 10 blauwe
    { name: "Een lolly", art: "lolly", need: { 2: 10 } },                      // + 10 groene
    { name: "Frietjes gaan eten", art: "fries", need: { 1: 10, 2: 10, 3: 10, 4: 10 } },        // blauw + groen + paars + roze
    { name: "Een cadeautje krijgen", art: "gift", need: { 1: 10, 2: 10, 3: 10, 4: 10, 5: 10 } }, // alle vijf de kleuren
  ],
  // (verbruik-in-volgorde blijft gelden: elke kleur telt eerst voor het eerste cadeautje in de rij)

  // Kleine, vrolijke complimentjes (nooit competitief, nooit "fout")
  PRAISE: [
    "Goed gedaan!", "Knap hoor!", "Wauw, super!", "Jaaa, gelukt!",
    "Prachtig!", "Heel goed!", "Wat slim!", "Fantastisch!", "Yes, top!",
  ],

  // Zachte hints bij een mis-tik (geen straf, gewoon een duwtje)
  NUDGE: ["Probeer nog eens 💛", "Bijna! Kijk nog eens", "Neem je tijd, het lukt", "Tel maar rustig mee"],
};
