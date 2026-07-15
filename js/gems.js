/* ============================================================
   gems.js — de diamanten tekenen (SVG met verlopen) en de rail vullen
   Een diamant is een edelsteen-vorm (geen bol), zoals haar instructie.
   De rail is een ketting: de diamanten hangen aan een fijn draadje.
   ============================================================ */

window.RB = window.RB || {};

RB.gems = {
  _uid: 0,

  // --- kleur donkerder/lichter maken voor de facetten ---
  _shade(hex, percent) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255,
      g = (n >> 8) & 255,
      b = n & 255;
    const t = percent < 0 ? 0 : 255;
    const p = Math.abs(percent);
    r = Math.round((t - r) * p) + r;
    g = Math.round((t - g) * p) + g;
    b = Math.round((t - b) * p) + b;
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  /* Bouwt de SVG van één diamant, met verloop voor een premium glans.
     empty = nog niet verzameld (zacht contour) */
  svg(color, empty) {
    this._uid += 1;
    const id = "g" + this._uid;
    const light = this._shade(color, 0.42);
    const dark = this._shade(color, -0.26);
    const deep = this._shade(color, -0.42);
    const line = this._shade(color, -0.5);

    if (empty) {
      // rustig, lichtgrijs contour dat verklapt welke kleur nog komt
      const ghost = this._shade(color, 0.72);
      return `
      <svg viewBox="0 0 100 108" class="gem-svg">
        <polygon points="30,10 70,10 90,40 50,100 10,40"
                 fill="${ghost}" stroke="${this._shade(color, 0.5)}"
                 stroke-width="2.4" stroke-linejoin="round" stroke-dasharray="4 4"/>
      </svg>`;
    }

    return `
    <svg viewBox="0 0 100 108" class="gem-svg">
      <defs>
        <linearGradient id="${id}c" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stop-color="${light}"/>
          <stop offset="1" stop-color="${color}"/>
        </linearGradient>
        <linearGradient id="${id}p" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="${color}"/>
          <stop offset="1" stop-color="${deep}"/>
        </linearGradient>
      </defs>
      <!-- paviljoen (onderkant) -->
      <polygon points="10,40 90,40 50,100" fill="url(#${id}p)"/>
      <polygon points="50,40 90,40 50,100" fill="${dark}" opacity="0.35"/>
      <!-- kroon (bovenkant) -->
      <polygon points="30,10 70,10 90,40 10,40" fill="url(#${id}c)"/>
      <polygon points="70,10 90,40 50,40" fill="${dark}" opacity="0.28"/>
      <polygon points="30,10 50,40 10,40" fill="${light}" opacity="0.55"/>
      <!-- omtrek + facetlijnen -->
      <polygon points="30,10 70,10 90,40 50,100 10,40"
               fill="none" stroke="${line}" stroke-width="2.4" stroke-linejoin="round"/>
      <g stroke="${line}" stroke-width="1.3" opacity="0.6" stroke-linecap="round">
        <line x1="10" y1="40" x2="90" y2="40"/>
        <line x1="30" y1="10" x2="50" y2="40"/>
        <line x1="70" y1="10" x2="50" y2="40"/>
        <line x1="50" y1="40" x2="50" y2="100"/>
      </g>
      <!-- glans -->
      <polygon points="36,15 45,15 40,37" fill="#ffffff" opacity="0.6"/>
    </svg>`;
  },

  // Vult de verticale rail (ketting) met alle 10 diamanten
  renderRail(el, collectedCount) {
    const d = RB.config.DIAMONDS;
    el.innerHTML =
      `<span class="rail-thread"></span>` +
      d
        .map((gem, i) => {
          const has = i < collectedCount;
          return `<div class="gem-slot ${has ? "filled" : "empty"}" data-index="${i}">
                    ${this.svg(gem.color, !has)}
                  </div>`;
        })
        .join("");
  },

  // Laat de zojuist verdiende diamant fonkelend "invallen"
  sparkle(el, index) {
    const slot = el.querySelector(`.gem-slot[data-index="${index}"]`);
    if (!slot) return;
    slot.classList.remove("empty");
    slot.classList.add("filled");
    slot.innerHTML = this.svg(RB.config.DIAMONDS[index].color, false);
    slot.classList.remove("pop");
    void slot.offsetWidth; // reflow zodat de animatie opnieuw start
    slot.classList.add("pop");

    // een paar vector-sterretjes rond de diamant
    for (let k = 0; k < 5; k++) {
      const s = document.createElement("span");
      s.className = "spark";
      s.innerHTML = RB.art.sparkle(k % 2 ? "#FFE08A" : RB.gems._shade(RB.config.DIAMONDS[index].color, 0.4));
      s.style.setProperty("--dx", Math.random() * 60 - 30 + "px");
      s.style.setProperty("--dy", Math.random() * -50 - 10 + "px");
      s.style.left = 30 + Math.random() * 40 + "%";
      s.style.top = 25 + Math.random() * 40 + "%";
      slot.appendChild(s);
      setTimeout(() => s.remove(), 900);
    }
  },

  // Rij diamanten voor het feestscherm
  renderRow(el) {
    el.innerHTML = RB.config.DIAMONDS.map(
      (gem, i) =>
        `<div class="celebrate-gem" style="animation-delay:${i * 0.07}s">${this.svg(
          gem.color,
          false
        )}</div>`
    ).join("");
  },

  // Kleine diamantjes voor de verzameling op het startscherm
  mini(color) {
    return `<span class="mini-gem">${this.svg(color, false)}</span>`;
  },
};
