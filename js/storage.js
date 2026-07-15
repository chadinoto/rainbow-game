/* ============================================================
   storage.js — voortgang bewaren in de browser (localStorage)
   Geen server, geen login. Alles blijft op dit toestel bewaard.
   ============================================================ */

window.RB = window.RB || {};

RB.storage = {
  KEY: "rainbow_diamonds_v1",

  _player() {
    return {
      level: 1,        // huidig niveau (1..4)
      collected: 0,    // gekleurde edelstenen in de huidige regenboog (0..10)
      gems: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }, // verdiende diamanten per niveau (schatkist)
      seenRewards: 0, // hoeveel cadeautje-drempels al gevierd zijn
    };
  },

  _default() {
    return {
      version: 2,
      seedVersion: 0,         // welke eenmalige seed al is toegepast
      soundOn: true,          // geluid + stem aan/uit (globaal)
      currentPlayer: "Lea",   // wie er nu speelt
      players: {              // aparte resultaten per speler
        Lea: this._player(),
        Raphael: this._player(),
        Mama: this._player(),
        Papa: this._player(),
      },
    };
  },

  // Zet ruwe (lokale of cloud-)gegevens om naar een geldige, volledige toestand
  normalize(data) {
    const state = this._default();
    if (!data || typeof data !== "object") return state;
    if (typeof data.soundOn === "boolean") state.soundOn = data.soundOn;
    if (typeof data.seedVersion === "number") state.seedVersion = data.seedVersion;

    const fold = (target, src) => {
      if (typeof src.level === "number") target.level = src.level;
      if (typeof src.collected === "number") target.collected = src.collected;
      if (src.gems && typeof src.gems === "object") {
        for (const k of [1, 2, 3, 4, 5, 6]) target.gems[k] = src.gems[k] || 0;
      }
      if (typeof src.seenRewards === "number") target.seenRewards = src.seenRewards;
      // oude telling (treasure/necklaces) → tel bij niveau 1
      const legacy = (src.treasure || 0) + (src.necklaces || 0);
      if (legacy) target.gems[1] += legacy;
    };

    if (data.players) {
      for (const name of Object.keys(state.players)) {
        if (data.players[name]) fold(state.players[name], data.players[name]);
      }
      if (data.currentPlayer && state.players[data.currentPlayer]) {
        state.currentPlayer = data.currentPlayer;
      }
    } else if (typeof data.level === "number" || typeof data.treasure === "number" || data.necklaces) {
      fold(state.players.Lea, data); // oude platte structuur → onder Lea
    }
    return state;
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return this.normalize(raw ? JSON.parse(raw) : null);
    } catch (e) {
      return this._default();
    }
  },

  save(state) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(state));
    } catch (e) {
      /* opslag vol of geblokkeerd — spel werkt gewoon door, alleen niet bewaard */
    }
  },
};
