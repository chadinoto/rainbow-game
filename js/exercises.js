/* ============================================================
   exercises.js — oefeningen maken per niveau
   Niveau 1: cijfers zoeken tot 10 (hoort een getal, tikt het cijfer aan)
   Niveau 2: plus tot 10
   Niveau 3: plus en min tot 10
   Niveau 4: cijfers zoeken tot 20
   Niveau 5: plus en min tot 20
   ============================================================ */

window.RB = window.RB || {};

RB.exercises = {
  _rndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  _shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  // Bouwt de antwoordknoppen: juiste antwoord + buurgetallen, door elkaar
  _options(answer, min, max) {
    const n = RB.config.N_OPTIONS;
    const set = new Set([answer]);
    let guard = 0;
    while (set.size < n && guard < 100) {
      guard++;
      let cand = answer + this._rndInt(-3, 3);
      if (cand < min) cand = min + (min - cand); // spiegel binnen bereik
      if (cand > max) cand = max - (cand - max);
      if (cand >= min && cand <= max) set.add(cand);
    }
    // als het nog niet vol is (klein bereik), vul rustig aan
    let f = min;
    while (set.size < n && f <= max) {
      set.add(f);
      f++;
    }
    return this._shuffle(Array.from(set));
  },

  _word(n) {
    return RB.config.WORDS[n] || String(n);
  },

  // Geeft een oefening-object terug voor het gevraagde niveau
  generate(level) {
    if (level === 1) return this._recognize(10);
    if (level === 2) return this._add(10);
    if (level === 3) return this._addSub(10);
    if (level === 4) return this._recognize(20);
    if (level === 5) return this._addSub(20);
    if (level === 6) return this._numpad(this._add(100));    // Raphael: plus tot 100
    if (level === 7) return this._numpad(this._addSub(20));  // Lea: plus/min tot 20, zelf typen
    if (level === 8) return this._numpad(this._sub(100));    // Raphael: min tot 100
    if (level === 9) return this._numpad(this._add(200));    // Raphael: plus tot 200
    if (level === 10) return this._numpad(this._sub(200));   // Raphael: min tot 200
    if (level === 11) return this._numpad(this._addSub(200)); // Raphael: plus en min tot 200
    if (level === 12) return this._numpad(this._multiply(12)); // Raphael: maaltafels tot 12
    if (level === 13) return this._numpad(this._divide(12));   // Raphael: deeltafels tot 12
    if (level === 14) return this._add(12);                    // Lea: plus tot 12
    if (level === 15) return this._sub(12);                    // Lea: min tot 12
    if (level === 16) return this._add(15);                    // Lea: plus tot 15
    if (level === 17) return this._sub(15);                    // Lea: min tot 15
    if (level === 19) return this._beginLetter();              // Lea: beginletter (woord → letter)
    if (level === 20 || level === 21) return this._readWord(level); // Lea: woordjes lezen (kort / lang)
    if (level === 22) return this._readSentence();                    // Lea: zinnetjes lezen
    return this._addSub(20);
  },

  // ============================================================
  // --- Woordjes lezen: ze LEEST een woord en kiest welke van de drie
  //     voorgelezen woorden er staat ---
  // Enkel met de klanken die ze al kent (gekozen op het letterscherm).
  // ============================================================

  // Alle klanken die op het letterscherm staan, in de volgorde van de tegeltjes
  KLANKEN_KLINKERS: ["a", "e", "i", "o", "u", "aa", "ee", "oo", "uu", "ie", "oe", "eu", "ui", "ei", "ij", "ou", "au"],
  KLANKEN_MEDEKLINKERS: ["b", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "z", "ch", "ng", "nk"],

  // Wat Lea op 28-09-2026 kende — wordt voorgeselecteerd zolang er niets gekozen is
  DEFAULT_LETTERS: ["i", "k", "m", "s", "aa", "r", "e"],

  // De drie lees-niveaus. "Letters" tellen zoals op het letterscherm: "aa" is één
  // tegeltje, dus kaas = k·aa·s = 3 letters.
  //   20: hoogstens 3 letters (ik, mes, kaas)
  //   21: 4 letters of meer   (kerk, kraam, kaars, kermis)
  //   22: korte zinnetjes     (ik mis kaas)
  READ_LEVELS: {
    20: { min: 1, max: 3, unit: "woordjes" },
    21: { min: 4, max: 99, unit: "woordjes" },
    22: { sentences: true, unit: "zinnetjes" },
  },

  // Korte zinnetjes, alles in kleine letters en zonder leesteken (zo leert ze lezen).
  // Zelfde regels als bij de woorden: geen open lettergrepen (ga, zo, mama), behalve
  // de, het en een — die leren ze op school als eerste "vaste" woordjes.
  // Een zinnetje verschijnt pas als ze ALLE klanken erin kent.
  READ_SENTENCES: [
    // al te lezen met i k m s aa r e
    "ik mis kaas", "ik maak kaas", "kaas is raar", "ik mis kers", "ik mis kermis", "ik maak kaars",
    // met meer letters
    "ik mis mijn kat", "ik zie een aap", "ik zie de maan", "de maan is geel", "de kaas is geel",
    "ik heb een vis", "de vis is nat", "de kat is dik", "de kip is wit", "ik ben ziek", "ik ben moe",
    "de zon is heet", "de boom is groot", "ik zit op de bank", "de pen is rood", "de hond is lief",
    "het huis is groot", "ik eet kaas", "ik eet een peer", "ik loop naar huis", "de muis is klein",
    "de vaas is vol", "het raam is dicht", "de deur is dicht", "ik lees een boek", "de koe is groot",
    "mijn jas is rood", "de bal is rood", "de bus is geel", "ik zie een ster", "ik bak een taart",
    "de roos is rood", "de soep is heet", "de boot is groot", "ik drink melk", "mijn neus is koud",
    "het is nacht", "het ijs is koud", "de trein is lang", "ik fiets naar school", "de wolk is wit",
    "ik zing een lied", "de sok is nat", "het bed is warm", "ik zie een kip", "mijn buik is vol",
    "het gras is groen", "ik heb een fiets", "ik eet soep", "de pan is heet", "de lamp is aan",
    "de zak is vol", "de aap eet een peer", "de kraan is dicht", "de vos is rood", "ik zit in de tuin",
    "de beer is groot", "ik heb een hond", "de melk is koud", "het ei is wit", "de geit is lief",
    "ik ben blij", "de kaars is aan", "ik zie een vis", "de kers is rood", "ik eet een kers",
  ],

  // Bestaande, kindvriendelijke woorden. Bewust (bijna) enkel één lettergreep:
  //   - geen open lettergrepen (ma-ken: daar klinkt de "a" als "aa" → verwarrend)
  //   - geen stomme e / schwa (emmer, kikker)
  //   - geen aai/ooi/oei/eeuw/ieuw (die leert ze later als eigen klank)
  //   - geen namen, geen c/q/x/y
  // Uitzondering: "kermis" (beide lettergrepen gesloten, klinkt zoals geschreven).
  READ_WORDS: [
    // a
    "bad", "bak", "bal", "bank", "dak", "das", "dam", "gat", "gas", "hak", "ham", "hand", "hart", "jas",
    "kam", "kat", "kast", "lam", "lamp", "land", "mat", "mand", "man", "map", "nat", "pak", "pan", "pad",
    "pap", "rat", "ram", "rand", "sap", "tak", "tas", "van", "wat", "zak", "zand", "stad", "stal",
    "slang", "bang", "lang", "tang", "vang", "hang", "klap", "trap", "grap", "gras", "glas", "tram",
    "kras", "vlag", "dans", "kans", "arm", "warm", "park", "kalf", "half", "want", "plank", "klank", "smal",
    // aa
    "aap", "baan", "baas", "haan", "haar", "haas", "jaar", "kaas", "maan", "raam", "taart", "paard", "maar",
    "naar", "laat", "zaag", "zaad", "draak", "kraan", "graag", "staart", "vaas", "kaart", "laars", "straat",
    "schaap", "slaap", "haak", "taak", "zaal", "paal", "raar", "kaak", "maak", "raak", "kraam", "kraak",
    "smaak", "aas", "kaars", "waar", "daar", "maand", "praat", "gaat", "staat", "klaar", "baard", "zaak",
    // e
    "bed", "pen", "mes", "rek", "rem", "net", "pet", "bek", "les", "fles", "vest", "hek", "nek", "tent",
    "bel", "weg", "heks", "kerk", "merk", "berg", "verf", "ster", "spek", "stem", "wesp", "nest", "zes",
    "elf", "gek", "kers", "vet", "hert", "snel", "spel", "zwem", "kermis", "wek", "en",
    // ee
    "been", "beer", "peer", "zee", "twee", "veer", "meer", "deeg", "leeg", "veel", "steen", "teen", "eend",
    "zeep", "meel", "keel", "weet", "geel", "speer", "neef", "week", "reep", "zeef", "heet", "beet", "mee",
    // i
    "vis", "pit", "kip", "lip", "dik", "wit", "zit", "mis", "ik", "is", "pil", "ring", "ding", "kist", "lift",
    "pink", "vink", "wind", "kind", "stil", "bril", "tik", "mik", "rits", "schip", "prik", "klik", "drink",
    "zin", "win", "film", "wip", "strik", "krik", "lid", "slim", "kring", "in", "wil",
    // o
    "bos", "pot", "rok", "sok", "top", "hok", "kom", "mond", "hond", "pop", "zon", "kop", "klok", "stok",
    "rots", "vos", "tol", "bol", "os", "wolk", "wolf", "mol", "tong", "bot", "dop", "slot", "pomp", "stop",
    "trom", "vork", "worm", "storm", "som", "kok", "hop", "stof", "jong", "om", "op", "vonk",
    // oo
    "boom", "boot", "boon", "roos", "rook", "oog", "oor", "hoop", "noot", "poot", "room", "droom", "doos",
    "loop", "rood", "brood", "boos", "oom", "zoon", "kool", "school", "knoop", "sloot", "groot", "kroon",
    // u
    "bus", "kus", "put", "hut", "mus", "dus", "pup", "tulp", "stuk", "druk", "bult", "mug", "rug", "jurk",
    "kurk", "brug", "dun", "punt", "hulp", "rups", "zus", "nul", "krul",
    // uu
    "muur", "vuur", "uur", "zuur", "duur", "stuur",
    // ie
    "vier", "dier", "mier", "kies", "lief", "niet", "ziek", "tien", "fiets", "knie", "drie", "wiel",
    "brief", "dief", "lied", "kiem", "hiel", "riem", "zie", "bier",
    // oe
    "boek", "koe", "hoed", "voet", "snoep", "koek", "boer", "poes", "stoel", "schoen", "moe", "roep",
    "soep", "bloem", "hoek", "doek", "zoek", "groen", "koel", "broek", "moet", "goed", "zoen",
    // eu
    "deur", "neus", "reus", "keus", "geur", "kleur", "deuk", "leuk", "reuk",
    // ui
    "huis", "muis", "buik", "duim", "tuin", "luis", "kuil", "ruit", "fluit", "uil", "sluis", "kruis",
    "duif", "ui", "kuif", "ruik",
    // ei / ij
    "ijs", "rijst", "pijl", "dijk", "lijm", "mijn", "prijs", "tijd", "lijn", "bij", "pijp", "klei", "ei",
    "geit", "reis", "trein", "plein", "wei", "zeil", "dweil", "kei", "wijk", "pijn", "vijf", "blij",
    "krijt", "fijn", "rijk", "wij",
    // ou / au
    "hout", "zout", "goud", "koud", "oud", "kou", "saus", "pauw", "klauw", "dauw", "blauw",
    // ch
    "lach", "licht", "nacht", "acht", "echt", "zacht", "vlecht", "pech", "bocht", "lucht", "zucht",
    "slecht", "kuch",
  ],

  // Nooit voorlezen, ook niet als verzonnen afleider
  READ_BLOCK: ["kut", "lul", "pik", "pis", "kak", "seks", "sex", "hoer", "tiet", "reet", "aars", "kont", "pies", "ruk"],

  _MULTI: ["aa", "ee", "oo", "uu", "ie", "oe", "eu", "ui", "ei", "ij", "ou", "au", "ch", "ng", "nk"],
  _VOWELS: new Set(["a", "e", "i", "o", "u", "aa", "ee", "oo", "uu", "ie", "oe", "eu", "ui", "ei", "ij", "ou", "au"]),

  letters: null,       // de gekozen klanken (Set), gezet door main.js vóór het spel start
  _recentRead: [],     // laatste doelwoorden, zodat hetzelfde woord niet meteen terugkomt

  setLetters(arr) {
    this.letters = new Set(arr && arr.length ? arr : this.DEFAULT_LETTERS);
  },

  // Splitst een woord in klanken: "kaars" → ["k","aa","r","s"] (langste klank eerst)
  klanken(word) {
    const out = [];
    let i = 0;
    while (i < word.length) {
      const two = word.slice(i, i + 2);
      if (this._MULTI.includes(two)) { out.push(two); i += 2; }
      else { out.push(word[i]); i += 1; }
    }
    return out;
  },

  // Hoe het woord KLINKT: ei=ij, au=ou, g=ch, v=f, z=s, eind-d=t, eind-b=p.
  // Twee opties met dezelfde klank kunnen niet allebei in één vraag (reis/rijs, lach/lag).
  _soundKey(word) {
    const map = { ei: "ij", au: "ou", g: "ch", v: "f", z: "s" };
    const k = this.klanken(word).map((x) => map[x] || x);
    const last = k.length - 1;
    if (k[last] === "d") k[last] = "t";
    if (k[last] === "b") k[last] = "p";
    return k.join("|");
  },

  // Welke woorden kan ze lezen met de gekozen klanken? (level = 20/21 → ook op lengte)
  readableWords(letters, level) {
    const set = letters instanceof Set ? letters : new Set(letters || []);
    const lv = this.READ_LEVELS[level] || { min: 1, max: 99 };
    return this.READ_WORDS.filter((w) => {
      const kl = this.klanken(w);
      return kl.length >= lv.min && kl.length <= lv.max && kl.every((k) => set.has(k));
    });
  },

  readableSentences(letters) {
    const set = letters instanceof Set ? letters : new Set(letters || []);
    return this.READ_SENTENCES.filter((z) => z.split(" ").every((w) => this.klanken(w).every((k) => set.has(k))));
  },

  // Woorden of zinnetjes, afhankelijk van het lees-niveau (voor het letterscherm)
  readableItems(letters, level) {
    return this.READ_LEVELS[level] && this.READ_LEVELS[level].sentences
      ? this.readableSentences(letters)
      : this.readableWords(letters, level);
  },

  // Verschillen twee klank-rijen precies één klank? (vervangen, toevoegen of weglaten)
  _oneApart(a, b) {
    if (a.length === b.length) {
      let diff = 0;
      for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
      return diff === 1;
    }
    if (Math.abs(a.length - b.length) !== 1) return false;
    const [long, short] = a.length > b.length ? [a, b] : [b, a];
    for (let i = 0; i < long.length; i++) {
      const cut = long.slice(0, i).concat(long.slice(i + 1));
      if (cut.join("|") === short.join("|")) return true;
    }
    return false;
  },

  // Verzonnen afleider: één klank vervangen door een andere GEKENDE klank
  // (klinker ↔ klinker; medeklinker ↔ medeklinker, maar enkel tussen klinkers of
  // aan de rand van het woord, zodat het uitspreekbaar blijft: geen "sraam").
  _pseudoNeighbors(kl, pool) {
    const out = [];
    for (let i = 0; i < kl.length; i++) {
      const isV = this._VOWELS.has(kl[i]);
      if (!isV) {
        const prevOk = i === 0 || this._VOWELS.has(kl[i - 1]);
        const nextOk = i === kl.length - 1 || this._VOWELS.has(kl[i + 1]);
        if (!prevOk || !nextOk) continue;
      }
      for (const rep of pool) {
        if (rep === kl[i] || this._VOWELS.has(rep) !== isV) continue;
        if (i === 0 && (rep === "ng" || rep === "nk")) continue; // "ngaam" bestaat niet
        const w = kl.slice(0, i).concat(rep, kl.slice(i + 1)).join("");
        out.push(w);
      }
    }
    return out;
  },

  // Kiest een item dat niet net nog aan de beurt was (als er genoeg keuze is)
  _pickFresh(items) {
    const fresh = items.filter((w) => !this._recentRead.includes(w));
    const pickFrom = fresh.length ? fresh : items;
    const target = pickFrom[this._rndInt(0, pickFrom.length - 1)];
    this._recentRead.push(target);
    if (this._recentRead.length > Math.min(6, Math.floor(items.length / 2))) this._recentRead.shift();
    return target;
  },

  // Afleiders voor één woord, beste eerst. `used` = klank-sleutels die al bezet zijn.
  //   1) bestaande woorden die één klank verschillen — eerst even lang (kaas/kaak),
  //      dan één klank meer of minder (kaas/kaars)
  //   2) verzonnen woordje met gekende klanken (zoals aap → aam)
  //   3) noodgeval (heel weinig letters gekozen): met alle klanken
  _wordDistractors(target, n, used) {
    const kl = this.klanken(target);
    const out = [];
    const take = (list) => {
      for (const w of this._shuffle(list)) {
        if (out.length >= n) return;
        const key = this._soundKey(w);
        if (this.READ_BLOCK.includes(w) || used.has(key)) continue;
        used.add(key);
        out.push(w);
      }
    };
    const real = this.READ_WORDS.filter((w) => w !== target && this._oneApart(kl, this.klanken(w)));
    take(real.filter((w) => this.klanken(w).length === kl.length));
    take(real.filter((w) => this.klanken(w).length !== kl.length));
    take(this._pseudoNeighbors(kl, Array.from(this.letters)));
    take(this._pseudoNeighbors(kl, this.KLANKEN_KLINKERS.concat(this.KLANKEN_MEDEKLINKERS)));
    return out;
  },

  // Het oefening-object voor woord én zin (zelfde kaarten, zelfde voorlezen)
  _readExercise(type, target, options, helpHTML, helpText) {
    const nums = ["één", "twee", "drie", "vier"];
    const q = type === "leeszin" ? "Welk zinnetje staat er?" : "Welk woord staat er?";
    // Voorlezen als losse zinnetjes, zodat main.js elke kaart kan laten oplichten
    const parts = [q].concat(options.map((w, i) => `${nums[i]}: ${w}.`));
    return {
      type: type,
      text: `lezen ${target}`,
      instruction: q,
      speakText: parts.join(" "),
      speakParts: parts,
      mainHTML: `<div class="read-word${type === "leeszin" ? " sentence" : ""}">${target}</div>`,
      options: options,
      answer: target,
      help: null,
      helpHTML: helpHTML,
      helpText: helpText,
      repeatText: parts.join(" "),
    };
  },

  _readWord(level) {
    if (!this.letters) this.setLetters(null);
    let words = this.readableWords(this.letters, level);
    if (!words.length) words = this.readableWords(this.letters); // vangnet: dan maar alle lengtes
    const target = this._pickFresh(words);
    const distractors = this._wordDistractors(target, 2, new Set([this._soundKey(target)]));
    const kl = this.klanken(target);
    return this._readExercise(
      "leeswoord",
      target,
      this._shuffle([target].concat(distractors)),
      `<div class="read-split">${kl.map((k) => `<span class="read-klank">${k}</span>`).join("")}</div>`,
      "Lees klank per klank, en zeg ze dan snel na elkaar."
    );
  },

  // Zinnetje: de twee afleiders verschillen telkens in één woord (ik mis kaas → ik mis kaak),
  // liefst op een andere plek in de zin, zodat ze élk woord echt moet lezen.
  _readSentence() {
    if (!this.letters) this.setLetters(null);
    const target = this._pickFresh(this.readableSentences(this.letters));
    const words = target.split(" ");
    const sentKey = (ws) => ws.map((w) => this._soundKey(w)).join(" ");
    const usedSent = new Set([sentKey(words)]);
    const distractors = [];
    const positions = this._shuffle(words.map((_, i) => i).filter((i) => this.klanken(words[i]).length >= 2));
    for (let round = 0; round < 2 && distractors.length < 2; round++) {
      for (const i of positions) {
        if (distractors.length >= 2) break;
        const cands = this._wordDistractors(words[i], 4, new Set([this._soundKey(words[i])]));
        for (const c of cands) {
          const ws = words.slice();
          ws[i] = c;
          if (usedSent.has(sentKey(ws))) continue;
          usedSent.add(sentKey(ws));
          distractors.push(ws.join(" "));
          break;
        }
      }
    }
    return this._readExercise(
      "leeszin",
      target,
      this._shuffle([target].concat(distractors)),
      `<div class="read-split">${words.map((w) => `<span class="read-klank">${w}</span>`).join("")}</div>`,
      "Lees woord per woord, rustig na elkaar."
    );
  },

  // --- Beginletter: hoort een woordje + ziet het plaatje, kiest de beginletter ---
  // Enkel woorden waarvan de BEGINLETTER zuiver bij de klank past. Bewust NIET:
  //   ijsje  (begint met de "ij"-klank, niet "i")
  //   cadeau (klinkt als "k", niet "c")
  //   giraf  (klinkt als "zj", niet als de gewone g)
  //   uil    (begint met de "ui"-klank, niet met een losse "u")
  // Die laatste twee stonden er eerst wel in en zijn eruit gehaald: zo leert ze
  // een uitzondering aan in plaats van de regel. Daardoor komt de letter U nu
  // niet meer voor — pure U-woorden zijn in het Nederlands nauwelijks te vinden
  // (bijna alles begint met ui-, uu- of eu-).
  //
  // 68 woorden. Alle plaatjes staan in art.js (object of treat); enkele
  // hergebruiken een bestaande tekening (apple, star, fish, leaf, flower, …).
  PICTURE_WORDS: [
    { word: "appel",     letter: "A", kind: "object", art: "apple" },
    { word: "aardbei",   letter: "A", kind: "object", art: "aardbei" },
    { word: "boom",      letter: "B", kind: "object", art: "boom" },
    { word: "brood",     letter: "B", kind: "object", art: "brood" },
    { word: "boot",      letter: "B", kind: "object", art: "boot" },
    { word: "bed",       letter: "B", kind: "object", art: "bed" },
    { word: "blad",      letter: "B", kind: "object", art: "leaf" },
    { word: "bloem",     letter: "B", kind: "object", art: "flower" },
    { word: "boek",      letter: "B", kind: "object", art: "boek" },
    { word: "deur",      letter: "D", kind: "object", art: "deur" },
    { word: "das",       letter: "D", kind: "object", art: "das" },
    { word: "doos",      letter: "D", kind: "object", art: "doos" },
    { word: "eend",      letter: "E", kind: "object", art: "eend" },
    { word: "emmer",     letter: "E", kind: "object", art: "emmer" },
    { word: "friet",     letter: "F", kind: "treat",  art: "fries" },
    { word: "fiets",     letter: "F", kind: "object", art: "fiets" },
    { word: "fles",      letter: "F", kind: "object", art: "fles" },
    { word: "gras",      letter: "G", kind: "object", art: "gras" },
    { word: "glas",      letter: "G", kind: "object", art: "glas" },
    { word: "hart",      letter: "H", kind: "object", art: "heart" },
    { word: "huis",      letter: "H", kind: "object", art: "huis" },
    { word: "hond",      letter: "H", kind: "object", art: "hond" },
    { word: "hoed",      letter: "H", kind: "object", art: "hoed" },
    { word: "hamer",     letter: "H", kind: "object", art: "hamer" },
    { word: "iglo",      letter: "I", kind: "object", art: "iglo" },
    { word: "jas",       letter: "J", kind: "object", art: "jas" },
    { word: "kers",      letter: "K", kind: "object", art: "cherry" },
    { word: "kat",       letter: "K", kind: "object", art: "kat" },
    { word: "koe",       letter: "K", kind: "object", art: "koe" },
    { word: "kam",       letter: "K", kind: "object", art: "kam" },
    { word: "kaars",     letter: "K", kind: "object", art: "kaars" },
    { word: "lolly",     letter: "L", kind: "treat",  art: "lolly" },
    { word: "lamp",      letter: "L", kind: "object", art: "lamp" },
    { word: "lepel",     letter: "L", kind: "object", art: "lepel" },
    { word: "maan",      letter: "M", kind: "object", art: "maan" },
    { word: "muis",      letter: "M", kind: "object", art: "muis" },
    { word: "mes",       letter: "M", kind: "object", art: "mes" },
    { word: "neus",      letter: "N", kind: "object", art: "neus" },
    { word: "nest",      letter: "N", kind: "object", art: "nest" },
    { word: "oog",       letter: "O", kind: "object", art: "oog" },
    { word: "paraplu",   letter: "P", kind: "object", art: "paraplu" },
    { word: "peer",      letter: "P", kind: "object", art: "peer" },
    { word: "pen",       letter: "P", kind: "object", art: "pen" },
    { word: "potlood",   letter: "P", kind: "object", art: "potlood" },
    { word: "regenboog", letter: "R", kind: "object", art: "regenboog" },
    { word: "raket",     letter: "R", kind: "object", art: "raket" },
    { word: "ring",      letter: "R", kind: "object", art: "ring" },
    { word: "raam",      letter: "R", kind: "object", art: "raam" },
    { word: "ster",      letter: "S", kind: "object", art: "star" },
    { word: "slang",     letter: "S", kind: "object", art: "slang" },
    { word: "sok",       letter: "S", kind: "object", art: "sok" },
    { word: "sleutel",   letter: "S", kind: "object", art: "sleutel" },
    { word: "taart",     letter: "T", kind: "treat",  art: "cake" },
    { word: "tijger",    letter: "T", kind: "object", art: "tijger" },
    { word: "tomaat",    letter: "T", kind: "object", art: "tomaat" },
    { word: "tent",      letter: "T", kind: "object", art: "tent" },
    { word: "tuin",      letter: "T", kind: "object", art: "tuin" },
    { word: "vis",       letter: "V", kind: "object", art: "fish" },
    { word: "vlinder",   letter: "V", kind: "object", art: "vlinder" },
    { word: "vlag",      letter: "V", kind: "object", art: "vlag" },
    { word: "vork",      letter: "V", kind: "object", art: "vork" },
    { word: "verf",      letter: "V", kind: "object", art: "verf" },
    { word: "wolk",      letter: "W", kind: "object", art: "wolk" },
    { word: "wortel",    letter: "W", kind: "object", art: "wortel" },
    { word: "worm",      letter: "W", kind: "object", art: "worm" },
    { word: "zon",       letter: "Z", kind: "object", art: "zon" },
    { word: "zee",       letter: "Z", kind: "object", art: "zee" },
    { word: "zebra",     letter: "Z", kind: "object", art: "zebra" },
  ],

  _pictureHTML(w) {
    return w.kind === "treat" ? RB.art.treat(w.art) : RB.art.object(w.art);
  },

  _beginLetter() {
    const target = this.PICTURE_WORDS[this._rndInt(0, this.PICTURE_WORDS.length - 1)];
    const letter = target.letter;

    // keuzeknoppen = letters: de juiste + willekeurige andere hoofdletters
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const set = new Set([letter]);
    let guard = 0;
    while (set.size < RB.config.N_OPTIONS && guard < 200) {
      guard++;
      set.add(alphabet[this._rndInt(0, 25)]);
    }
    const options = this._shuffle(Array.from(set));

    // Gewoon het woordje laten horen (dat spreekt de stem netjes uit);
    // de komma geeft een korte pauze zodat het woord duidelijk los staat.
    const spoken = "Met welke letter begint het woordje, " + target.word + "?";
    return {
      type: "beginletter",
      text: `beginletter ${target.word}`,
      instruction: "Met welke letter begint dit woordje?",
      speakText: spoken,
      mainHTML: `<div class="begin-pic">${this._pictureHTML(target)}</div>`,
      options: options,
      answer: letter,
      help: null,
      helpText: "Zeg het woord nog eens. Welke letter hoor je vooraan?",
      repeatText: spoken,
    };
  },

  // --- Deeltafels (delen, altijd een gehele uitkomst) ---
  _divide(maxFactor) {
    const b = this._rndInt(1, maxFactor);      // deler
    const answer = this._rndInt(1, maxFactor); // uitkomst
    const a = b * answer;                      // deeltal
    return {
      type: "div",
      text: `${a} : ${b}`,
      instruction: "Hoeveel is het?",
      speakText: `${this._word(a)} gedeeld door ${this._word(b)}`,
      mainHTML: `<span class="num">${a}</span><span class="op">:</span><span class="num">${b}</span><span class="op">=</span><span class="qmark">?</span>`,
      options: this._options(answer, 0, maxFactor),
      answer: answer,
      help: null,
      helpText: "Denk rustig aan de maaltafel.",
      repeatText: `${this._word(a)} gedeeld door ${this._word(b)}`,
    };
  },

  // --- Maaltafels (vermenigvuldigen) ---
  _multiply(maxFactor) {
    const a = this._rndInt(1, maxFactor);
    const b = this._rndInt(1, maxFactor);
    const answer = a * b;
    return {
      type: "mul",
      text: `${a} x ${b}`,
      instruction: "Hoeveel is het?",
      speakText: `${this._word(a)} maal ${this._word(b)}`,
      mainHTML: `<span class="num">${a}</span><span class="op">×</span><span class="num">${b}</span><span class="op">=</span><span class="qmark">?</span>`,
      options: this._options(answer, 0, maxFactor * maxFactor),
      answer: answer,
      help: null,
      helpText: "Denk rustig aan de maaltafel.",
      repeatText: `${this._word(a)} maal ${this._word(b)}`,
    };
  },

  // markeert een oefening als "zelf typen" (numpad i.p.v. keuzeknoppen)
  _numpad(ex) {
    ex.input = "numpad";
    return ex;
  },

  // Kiest een getal, maar bij een bereik >10 vaker boven de 10 (moeilijker)
  _pickBiasedHigh(min, max) {
    if (max > 10 && Math.random() < 0.65) return this._rndInt(11, max);
    return this._rndInt(min, Math.min(10, max));
  },

  // --- Cijfer herkennen (of tellen) tot maxN ---
  _recognize(maxN) {
    // tot 20: minder tellen (kan maar tot 10), zodat de getallen 11-20 vaker komen
    const useCount = Math.random() < (maxN > 10 ? 0.2 : 0.4);

    if (useCount) {
      // tellen houden we behapbaar (max 10 voorwerpjes)
      const target = this._rndInt(1, Math.min(maxN, 10));
      const names = RB.art.OBJECTS;
      const name = names[this._rndInt(0, names.length - 1)];
      const objs = Array.from({ length: target }, () => RB.art.object(name)).join("");
      return {
        type: "count",
        text: `tel ${target}`,
        instruction: "Hoeveel zie je?",
        speakText: "Hoeveel zie je?",
        mainHTML: `<div class="count-objects">${objs}</div>`,
        options: this._options(target, 1, maxN),
        answer: target,
        help: null,
        helpText: "Tel maar met je vinger, één voor één.",
      };
    }

    const target = this._pickBiasedHigh(1, maxN);
    return {
      type: "recognize",
      text: `getal ${target}`,
      instruction: "Welk getal hoor je?",
      speakText: "Zoek het getal " + this._word(target) + ".",
      mainHTML: RB.art.listenBadge(),
      options: this._options(target, 1, maxN),
      answer: target,
      help: null,
      helpText: "Luister nog eens en zoek dat cijfer.",
      repeatText: "Zoek het getal " + this._word(target) + ".",
    };
  },

  // --- Getal horen en zelf typen, tot maxN (bv. tellen tot 200) ---
  _recognizeType(maxN) {
    const target = this._rndInt(1, maxN);
    return {
      type: "recognize-type",
      text: `getal ${target}`,
      instruction: "Welk getal hoor je? Typ het in.",
      speakText: "Welk getal is dit? " + this._word(target) + ".",
      mainHTML: RB.art.listenBadge(),
      options: [],
      answer: target,
      input: "numpad",
      help: null,
      helpText: "Luister nog eens en typ het getal.",
      repeatText: "Het getal is " + this._word(target) + ".",
    };
  },

  // --- Optellen ---
  _add(maxTotal) {
    // tot 20: vaker een som die boven de 10 uitkomt
    const answer = this._pickBiasedHigh(2, maxTotal);
    const a = this._rndInt(1, answer - 1);
    const b = answer - a;
    const smallEnough = maxTotal <= 20; // stipjes-hulp enkel bij kleine getallen
    return {
      type: "add",
      text: `${a} + ${b}`,
      instruction: "Hoeveel is het samen?",
      speakText: `${this._word(a)} plus ${this._word(b)}`,
      mainHTML: `<span class="num">${a}</span><span class="op">+</span><span class="num">${b}</span><span class="op">=</span><span class="qmark">?</span>`,
      options: this._options(answer, 0, maxTotal),
      answer: answer,
      help: smallEnough ? { a, b, op: "+" } : null,
      helpText: smallEnough ? "Tel de stipjes allemaal samen." : "Reken maar rustig uit.",
      repeatText: `${this._word(a)} plus ${this._word(b)}`,
    };
  },

  // --- Aftrekken ---
  _sub(maxTotal) {
    // tot 20: vaker een begingetal boven de 10
    const a = this._pickBiasedHigh(2, maxTotal);
    const b = this._rndInt(1, a);
    const answer = a - b;
    const smallEnough = maxTotal <= 20;
    return {
      type: "sub",
      text: `${a} - ${b}`,
      instruction: "Hoeveel blijven er over?",
      speakText: `${this._word(a)}, min ${this._word(b)}`,
      mainHTML: `<span class="num">${a}</span><span class="op">−</span><span class="num">${b}</span><span class="op">=</span><span class="qmark">?</span>`,
      options: this._options(answer, 0, maxTotal),
      answer: answer,
      help: smallEnough ? { a, b, op: "-" } : null,
      helpText: smallEnough ? "Er gaan er een paar weg. Tel wat er overblijft." : "Reken maar rustig uit.",
      repeatText: `${this._word(a)}, min ${this._word(b)}`,
    };
  },

  // --- Optellen én aftrekken ---
  _addSub(maxTotal) {
    return Math.random() < 0.5 ? this._add(maxTotal) : this._sub(maxTotal);
  },

  // Bouwt de visuele hulp (stipjes) voor plus/min
  helpHTML(help) {
    if (!help) return "";
    if (help.op === "+") {
      const dotsA = '<span class="dot">●</span>'.repeat(help.a);
      const dotsB = '<span class="dot dot-b">●</span>'.repeat(help.b);
      return `<div class="dots">${dotsA}<span class="plus-gap">+</span>${dotsB}</div>`;
    }
    // aftrekken: eerst a stipjes, waarvan b doorstreept
    let dots = "";
    for (let i = 0; i < help.a; i++) {
      dots += `<span class="dot ${i >= help.a - help.b ? "gone" : ""}">●</span>`;
    }
    return `<div class="dots">${dots}</div>`;
  },
};
