/* ============================================================
   rainbow.js — de echte regenboog die zich per goede oefening vult
   10 kleurbogen in haar eigen kleuren, met kawaii-wolkjes aan de uiteinden.
   Als de regenboog af is, verdient ze een diamant voor de schatkist.
   ============================================================ */

window.RB = window.RB || {};

RB.rainbow = {
  CX: 200,
  CY: 198,
  R0: 180, // buitenste boog (grootste straal)
  STEP: 15,
  SW: 13,

  _r(i) {
    return this.R0 - i * this.STEP;
  },
  _arc(r) {
    return `M ${this.CX - r} ${this.CY} A ${r} ${r} 0 0 1 ${this.CX + r} ${this.CY}`;
  },

  _cloud(x, y) {
    return `
    <g class="rb-cloud">
      <ellipse cx="${x}" cy="${y + 22}" rx="60" ry="9" fill="#000" opacity="0.06"/>
      <ellipse cx="${x}" cy="${y}" rx="66" ry="27" fill="#FFFFFF"/>
      <circle cx="${x - 34}" cy="${y - 5}" r="23" fill="#FFFFFF"/>
      <circle cx="${x}" cy="${y - 17}" r="27" fill="#FFFFFF"/>
      <circle cx="${x + 34}" cy="${y - 5}" r="23" fill="#FFFFFF"/>
      <circle cx="${x - 9}" cy="${y - 6}" r="2.7" fill="#9AA6BE"/>
      <circle cx="${x + 9}" cy="${y - 6}" r="2.7" fill="#9AA6BE"/>
      <circle cx="${x - 17}" cy="${y}" r="3.6" fill="#F7B9C9" opacity="0.65"/>
      <circle cx="${x + 17}" cy="${y}" r="3.6" fill="#F7B9C9" opacity="0.65"/>
      <path d="M${x - 6} ${y - 1} Q${x} ${y + 3} ${x + 6} ${y - 1}"
            stroke="#9AA6BE" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    </g>`;
  },

  svg(collected) {
    const d = RB.config.DIAMONDS;
    let arcs = "";
    for (let i = 0; i < d.length; i++) {
      const r = this._r(i);
      const on = i < collected;
      arcs += `<path class="rb-arc${on ? " on" : ""}" data-index="${i}" d="${this._arc(r)}"
        pathLength="1" fill="none" stroke-linecap="round" stroke-width="${this.SW}"
        stroke="${on ? d[i].color : "#E6E2EA"}"
        ${on ? 'style="stroke-dasharray:1;stroke-dashoffset:0"' : ""}/>`;
    }
    return `<svg viewBox="0 0 400 234" class="rainbow-svg">
      <g>${arcs}</g>
      ${this._cloud(92, 200)}${this._cloud(308, 200)}
    </svg>`;
  },

  render(el, collected) {
    el.innerHTML = this.svg(collected);
  },

  // Kleurt de volgende boog met een "teken"-animatie + fonkeling aan de top
  fill(el, index) {
    const color = RB.config.DIAMONDS[index].color;
    const arc = el.querySelector(`.rb-arc[data-index="${index}"]`);
    if (!arc) return;

    arc.setAttribute("stroke", color);
    arc.classList.add("on");
    arc.style.strokeDasharray = "1";
    arc.style.strokeDashoffset = "1";
    // reflow, dan de boog "tekenen"
    void arc.getBoundingClientRect();
    requestAnimationFrame(() => {
      arc.classList.add("draw");
      arc.style.strokeDashoffset = "0";
    });

    // fonkeling aan de top van deze boog (in % van de svg)
    const r = this._r(index);
    const topX = 50; // CX / 400
    const topY = ((this.CY - r) / 234) * 100;
    for (let k = 0; k < 4; k++) {
      const s = document.createElement("span");
      s.className = "spark";
      s.innerHTML = RB.art.sparkle(k % 2 ? "#FFE08A" : RB.gems._shade(color, 0.4));
      s.style.left = topX + (Math.random() * 16 - 8) + "%";
      s.style.top = topY + (Math.random() * 12 - 6) + "%";
      s.style.setProperty("--dx", Math.random() * 50 - 25 + "px");
      s.style.setProperty("--dy", Math.random() * -40 - 8 + "px");
      el.appendChild(s);
      setTimeout(() => s.remove(), 900);
    }
  },
};
