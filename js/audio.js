/* ============================================================
   audio.js — vrolijke geluidjes (Web Audio) + voorleesstem (Web Speech)
   Alles wordt in de browser gemaakt: geen geluidsbestanden nodig.
   ============================================================ */

window.RB = window.RB || {};

RB.audio = {
  ctx: null,
  enabled: true,
  _voice: null,

  // Moet na een klik/tik gebeuren (browserregel), daarom bij de Spelen-knop.
  unlock() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      } catch (e) {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    this._pickVoice();
  },

  setEnabled(on) {
    this.enabled = !!on;
    if (!on && "speechSynthesis" in window) window.speechSynthesis.cancel();
  },

  // ---- kleine toon-helper ----
  _tone(freq, start, dur, type, gainPeak) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + start;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(gainPeak || 0.2, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  },

  // Vrolijk, opgewekt deuntje bij een juist antwoord (klein melodietje)
  correct() {
    if (!this.enabled || !this.ctx) return;
    // E5 - G5 - C6 - (kort) E6 : een blij, stijgend motiefje
    this._tone(659, 0.0, 0.14, "triangle", 0.18);
    this._tone(784, 0.11, 0.14, "triangle", 0.18);
    this._tone(1047, 0.22, 0.16, "triangle", 0.17);
    this._tone(1319, 0.34, 0.26, "sine", 0.16);
  },

  // Kist gaat open
  open() {
    if (!this.enabled || !this.ctx) return;
    this._tone(523, 0.0, 0.12, "sine", 0.14);
    this._tone(784, 0.12, 0.2, "sine", 0.14);
    this._tone(1047, 0.26, 0.3, "triangle", 0.12);
  },

  // Heel zachte, neutrale "bloop" bij een mis-tik. Nooit hard of negatief.
  soft() {
    if (!this.enabled || !this.ctx) return;
    this._tone(300, 0.0, 0.14, "sine", 0.10);
  },

  // Feestmelodie als de ketting compleet is
  fanfare() {
    if (!this.enabled || !this.ctx) return;
    const notes = [523, 587, 659, 784, 880, 1047];
    notes.forEach((f, i) => this._tone(f, i * 0.14, 0.3, "triangle", 0.18));
    this._tone(1568, notes.length * 0.14, 0.6, "sine", 0.16);
  },

  // ---- voorleesstem ----
  // Kiest de mooiste beschikbare Nederlandse stem, met voorkeur voor
  // Vlaams (nl-BE) en voor premium/enhanced/natural varianten.
  _score(v) {
    const lang = (v.lang || "").toLowerCase();
    const name = (v.name || "").toLowerCase();
    if (!lang.startsWith("nl")) return -1;
    let s = 0;
    if (lang === "nl-be") s += 100;        // Vlaams
    else if (lang.startsWith("nl")) s += 60;
    // bekende, natuurlijk klinkende Nederlandse/Vlaamse stemmen
    if (/(ellen|xander|claire|femke|lotte|sara|ilse|colette|flor)/.test(name)) s += 25;
    // hogere-kwaliteit varianten
    if (/(premium|enhanced|neural|natural|siri)/.test(name)) s += 40;
    if (/compact/.test(name)) s -= 15;     // compacte stemmen klinken blikkeriger
    return s;
  },

  _pickVoice() {
    if (!("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || !voices.length) return;
    let best = null,
      bestScore = -1;
    for (const v of voices) {
      const sc = this._score(v);
      if (sc > bestScore) {
        bestScore = sc;
        best = v;
      }
    }
    if (best) this._voice = best;
  },

  speak(text) {
    if (!this.enabled || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      if (!this._voice) this._pickVoice();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = this._voice ? this._voice.lang : "nl-BE";
      if (this._voice) u.voice = this._voice;
      u.rate = 0.95;  // rustig maar vlot
      u.pitch = 1.05; // vriendelijk, niet piepend
      window.speechSynthesis.speak(u);
    } catch (e) {
      /* stem niet beschikbaar — spel werkt gewoon zonder */
    }
  },
};

// Stemmen laden soms met vertraging in
if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => RB.audio._pickVoice();
}
