/* ============================================================
   auth.js — eenvoudige toegangsdrempel (geen echte beveiliging)
   Houdt toevallige bezoekers tegen. Het wachtwoord staat als hash
   in config (PASSCODE_HASH), dus niet leesbaar in de broncode.
   Na één keer inloggen onthoudt dit toestel het.

   Wachtwoord veranderen? Bereken de hash in de console met:
     RB.auth.hash("jouwnieuwewachtwoord")
   en zet die waarde in js/config.js bij PASSCODE_HASH.
   ============================================================ */

window.RB = window.RB || {};

RB.auth = {
  KEY: "rainbow_unlocked_v1",

  // kleine, snelle hash (cyrb53) — genoeg om het wachtwoord te verbergen
  hash(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString();
  },

  isUnlocked() {
    try {
      return localStorage.getItem(this.KEY) === "1";
    } catch (e) {
      return false;
    }
  },

  unlock() {
    try {
      localStorage.setItem(this.KEY, "1");
    } catch (e) {}
  },

  check(input) {
    return this.hash(String(input).trim()) === String(RB.config.PASSCODE_HASH);
  },
};
