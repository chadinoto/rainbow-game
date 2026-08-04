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
    return this._addSub(20);
  },

  // --- Beginletter: hoort een woordje + ziet het plaatje, kiest de beginletter ---
  // Enkel woorden waarvan de BEGINLETTER zuiver bij de klank past. Bewust NIET:
  //   ijsje (begint met de "ij"-klank, niet "i"), cadeau (klinkt als "k", niet "c").
  // Alle plaatjes bestaan al in art.js (object/treat) → geen nieuwe tekeningen.
  // 50 woorden. De meeste plaatjes worden getekend in art.js (object of treat);
  // enkele hergebruiken bestaande tekeningen (apple, star, fish, …).
  PICTURE_WORDS: [
    { word: "appel",     letter: "A", kind: "object", art: "apple" },
    { word: "aardbei",   letter: "A", kind: "object", art: "aardbei" },
    { word: "boom",      letter: "B", kind: "object", art: "boom" },
    { word: "brood",     letter: "B", kind: "object", art: "brood" },
    { word: "boot",      letter: "B", kind: "object", art: "boot" },
    { word: "bed",       letter: "B", kind: "object", art: "bed" },
    { word: "deur",      letter: "D", kind: "object", art: "deur" },
    { word: "das",       letter: "D", kind: "object", art: "das" },
    { word: "eend",      letter: "E", kind: "object", art: "eend" },
    { word: "emmer",     letter: "E", kind: "object", art: "emmer" },
    { word: "friet",     letter: "F", kind: "treat",  art: "fries" },
    { word: "fiets",     letter: "F", kind: "object", art: "fiets" },
    { word: "fles",      letter: "F", kind: "object", art: "fles" },
    { word: "gras",      letter: "G", kind: "object", art: "gras" },
    { word: "giraf",     letter: "G", kind: "object", art: "giraf" },
    { word: "glas",      letter: "G", kind: "object", art: "glas" },
    { word: "hart",      letter: "H", kind: "object", art: "heart" },
    { word: "huis",      letter: "H", kind: "object", art: "huis" },
    { word: "hond",      letter: "H", kind: "object", art: "hond" },
    { word: "iglo",      letter: "I", kind: "object", art: "iglo" },
    { word: "jas",       letter: "J", kind: "object", art: "jas" },
    { word: "kers",      letter: "K", kind: "object", art: "cherry" },
    { word: "kat",       letter: "K", kind: "object", art: "kat" },
    { word: "koe",       letter: "K", kind: "object", art: "koe" },
    { word: "lolly",     letter: "L", kind: "treat",  art: "lolly" },
    { word: "lamp",      letter: "L", kind: "object", art: "lamp" },
    { word: "maan",      letter: "M", kind: "object", art: "maan" },
    { word: "muis",      letter: "M", kind: "object", art: "muis" },
    { word: "neus",      letter: "N", kind: "object", art: "neus" },
    { word: "oog",       letter: "O", kind: "object", art: "oog" },
    { word: "paraplu",   letter: "P", kind: "object", art: "paraplu" },
    { word: "peer",      letter: "P", kind: "object", art: "peer" },
    { word: "regenboog", letter: "R", kind: "object", art: "regenboog" },
    { word: "raket",     letter: "R", kind: "object", art: "raket" },
    { word: "ring",      letter: "R", kind: "object", art: "ring" },
    { word: "ster",      letter: "S", kind: "object", art: "star" },
    { word: "slang",     letter: "S", kind: "object", art: "slang" },
    { word: "sok",       letter: "S", kind: "object", art: "sok" },
    { word: "taart",     letter: "T", kind: "treat",  art: "cake" },
    { word: "tijger",    letter: "T", kind: "object", art: "tijger" },
    { word: "tomaat",    letter: "T", kind: "object", art: "tomaat" },
    { word: "uil",       letter: "U", kind: "object", art: "uil" },
    { word: "vis",       letter: "V", kind: "object", art: "fish" },
    { word: "vlinder",   letter: "V", kind: "object", art: "vlinder" },
    { word: "vlag",      letter: "V", kind: "object", art: "vlag" },
    { word: "wolk",      letter: "W", kind: "object", art: "wolk" },
    { word: "wortel",    letter: "W", kind: "object", art: "wortel" },
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
