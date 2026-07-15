/* ============================================================
   art.js — eigen vector-illustraties (SVG). Geen emoji.
   Iconen, telvoorwerpen, sterretjes en het diamant-mascotje.
   Alles in een rustige, moderne, zachte stijl.
   ============================================================ */

window.RB = window.RB || {};

RB.art = {
  _id: 0,
  uid() {
    this._id += 1;
    return "a" + this._id;
  },

  /* ---------- lijn-iconen (24x24, currentColor) ---------- */
  icon(name) {
    const wrap = (inner) =>
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" class="ic">${inner}</svg>`;
    switch (name) {
      case "home":
        return wrap(
          `<path d="M4 12 L12 5 L20 12"/><path d="M6 11 V19 H18 V11"/><path d="M10 19 V15 H14 V19"/>`
        );
      case "sound":
        return wrap(
          `<path d="M4 9.5 V14.5 H7.5 L12 18 V6 L7.5 9.5 Z" fill="currentColor" stroke="none"/>
           <path d="M15 9 Q17.5 12 15 15"/><path d="M17.5 7 Q21.5 12 17.5 17"/>`
        );
      case "settings":
        return wrap(
          `<line x1="4" y1="8.5" x2="20" y2="8.5"/><circle cx="10" cy="8.5" r="2.4" fill="var(--card)"/>
           <line x1="4" y1="15.5" x2="20" y2="15.5"/><circle cx="15" cy="15.5" r="2.4" fill="var(--card)"/>`
        );
      case "check":
        return wrap(`<path d="M5 13 L10 18 L19 6"/>`);
      case "info":
        return wrap(`<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.6" r="0.7" fill="currentColor"/>`);
      case "play":
        return `<svg viewBox="0 0 24 24" class="ic"><path d="M7 5 L19 12 L7 19 Z" fill="currentColor"/></svg>`;
      case "backspace":
        return wrap(`<path d="M9 5 L21 5 L21 19 L9 19 L3 12 Z"/><line x1="12.5" y1="9.5" x2="17.5" y2="14.5"/><line x1="17.5" y1="9.5" x2="12.5" y2="14.5"/>`);
      default:
        return "";
    }
  },

  /* ---------- kleine sterretjes / fonkeling ---------- */
  sparkle(color) {
    const c = color || "#FFD36A";
    return `<svg viewBox="0 0 24 24" class="spk"><path d="M12 2 C12.8 8 16 11.2 22 12 C16 12.8 12.8 16 12 22
            C11.2 16 8 12.8 2 12 C8 11.2 11.2 8 12 2 Z" fill="${c}"/></svg>`;
  },

  /* ---------- telvoorwerpen (flat, zacht) ---------- */
  object(name) {
    const s = (inner) => `<svg viewBox="0 0 48 48" class="obj">${inner}</svg>`;
    switch (name) {
      case "apple":
        return s(`
          <path d="M24 14 C20 10 12 11 11 19 C10 27 15 39 20 40 C22 41 22 39 24 39
                   C26 39 26 41 28 40 C33 39 38 27 37 19 C36 11 28 10 24 14 Z" fill="#F45B69"/>
          <path d="M24 14 C22 12 20 11.5 18 12" stroke="#C13B4B" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M24 14 C24 9 27 6 31 6" stroke="#6E4B2A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          <path d="M31 7 C36 5 39 8 38 12 C33 13 31 10 31 7 Z" fill="#7FB77E"/>
          <ellipse cx="18" cy="22" rx="3" ry="4.5" fill="#fff" opacity="0.35"/>`);
      case "flower":
        return s(`
          <g fill="#F49CC4">
            <circle cx="24" cy="12" r="7"/><circle cx="36" cy="20" r="7"/>
            <circle cx="31" cy="34" r="7"/><circle cx="17" cy="34" r="7"/><circle cx="12" cy="20" r="7"/>
          </g><circle cx="24" cy="24" r="7.5" fill="#FFD166"/>
          <circle cx="24" cy="24" r="3.4" fill="#F0A93B"/>`);
      case "star":
        return s(`<path d="M24 5 L29.5 18 L43 19.5 L33 28.5 L36 42 L24 34.5 L12 42 L15 28.5 L5 19.5 L18.5 18 Z"
                     fill="#FFC94D" stroke="#F0AE2E" stroke-width="1.5" stroke-linejoin="round"/>`);
      case "balloon":
        return s(`
          <path d="M24 6 C16 6 12 12 12 18 C12 25 18 30 24 30 C30 30 36 25 36 18 C36 12 32 6 24 6 Z" fill="#7FB2F0"/>
          <path d="M22 30 L26 30 L24 33 Z" fill="#5E90CE"/>
          <path d="M24 33 C24 37 27 39 24 43" stroke="#B0A8C0" stroke-width="1.6" fill="none" stroke-linecap="round"/>
          <ellipse cx="19" cy="15" rx="3" ry="5" fill="#fff" opacity="0.4"/>`);
      case "fish":
        return s(`
          <path d="M8 24 C12 15 24 13 33 18 C36 15 40 14 42 14 C41 18 41 20 42 22
                   C41 26 41 27 42 31 C40 31 36 30 33 27 C24 33 12 31 8 24 Z" fill="#66C7C0"/>
          <circle cx="16" cy="22" r="2.2" fill="#2C4A48"/>
          <path d="M22 20 Q26 24 22 28" stroke="#3AA79F" stroke-width="1.6" fill="none"/>`);
      case "heart":
        return s(`<path d="M24 40 C10 30 6 22 8 16 C10 10 18 9 24 16 C30 9 38 10 40 16
                     C42 22 38 30 24 40 Z" fill="#F58BA8"/>
                  <ellipse cx="17" cy="18" rx="3" ry="4" fill="#fff" opacity="0.35"/>`);
      case "leaf":
        return s(`<path d="M12 36 C8 20 20 8 38 8 C38 26 26 40 12 36 Z" fill="#86C07A"/>
                  <path d="M14 34 C22 26 30 18 36 12" stroke="#5E9E54" stroke-width="2" fill="none" stroke-linecap="round"/>`);
      case "cherry":
        return s(`
          <path d="M14 16 C22 12 30 14 36 20" stroke="#7A9E4B" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          <circle cx="15" cy="33" r="8" fill="#E15566"/><circle cx="33" cy="30" r="8" fill="#E15566"/>
          <ellipse cx="12" cy="31" rx="2.4" ry="3.4" fill="#fff" opacity="0.35"/>
          <ellipse cx="30" cy="28" rx="2.4" ry="3.4" fill="#fff" opacity="0.35"/>`);
      default:
        return s(`<circle cx="24" cy="24" r="14" fill="#F49CC4"/>`);
    }
  },

  OBJECTS: ["apple", "flower", "star", "balloon", "fish", "heart", "leaf", "cherry"],

  /* ---------- luister-badge (voor 'welk getal hoor je?') ---------- */
  listenBadge() {
    return `<div class="listen-badge">
              <span class="ring"></span><span class="ring r2"></span>
              <span class="badge-core">${this.icon("sound")}</span>
            </div>`;
  },

  /* ---------- het kawaii diamant-mascotje ---------- */
  // Ronde, zachte edelsteen (afgeronde hoeken) met een groot schattig gezichtje.
  mascot(mood) {
    const id = this.uid();
    const happy = mood === "happy";
    const mouth = happy
      ? `<path d="M60 92 Q70 106 80 92" stroke="#5B4A66" stroke-width="3.4" fill="#F7A9C4" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<path d="M62 94 Q70 101 78 94" stroke="#5B4A66" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
    return `
    <svg viewBox="0 0 140 168" class="mascot">
      <defs>
        <linearGradient id="mg${id}" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stop-color="#FCDCEE"/>
          <stop offset="0.5" stop-color="#D6C3F5"/>
          <stop offset="1" stop-color="#B6DBF7"/>
        </linearGradient>
        <radialGradient id="mh${id}" cx="0.35" cy="0.28" r="0.7">
          <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.9"/>
          <stop offset="0.6" stop-color="#FFFFFF" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- fonkelingen -->
      <g class="mascot-spark" style="transform-origin:112px 30px">${this.sparkle("#FFE08A")}</g>
      <g style="opacity:0.7"><g transform="translate(6 54) scale(0.5)">${this.sparkle("#CDE7FF")}</g></g>
      <!-- lichaam: afgeronde edelsteen (ruit met zachte hoeken) -->
      <g transform="rotate(45 70 84)">
        <rect x="33" y="47" width="74" height="74" rx="26"
              fill="url(#mg${id})" stroke="#BBA3E4" stroke-width="3.5"/>
        <rect x="33" y="47" width="74" height="74" rx="26" fill="url(#mh${id})"/>
      </g>
      <!-- subtiele facetlijnen -->
      <g stroke="#C6B4EC" stroke-width="2" opacity="0.55" stroke-linecap="round" fill="none">
        <path d="M70 40 L70 128"/>
        <path d="M34 84 Q70 74 106 84"/>
      </g>
      <!-- gezichtje -->
      <g>
        <ellipse cx="55" cy="80" rx="6.4" ry="7.4" fill="#5B4A66"/>
        <ellipse cx="85" cy="80" rx="6.4" ry="7.4" fill="#5B4A66"/>
        <circle cx="57.4" cy="77.4" r="2.3" fill="#fff"/>
        <circle cx="87.4" cy="77.4" r="2.3" fill="#fff"/>
        <circle cx="53" cy="76" r="1.1" fill="#fff"/>
        <circle cx="83" cy="76" r="1.1" fill="#fff"/>
        <circle cx="44" cy="90" r="6" fill="#F7A9C4" opacity="0.72"/>
        <circle cx="96" cy="90" r="6" fill="#F7A9C4" opacity="0.72"/>
        ${mouth}
      </g>
    </svg>`;
  },

  /* ---------- kawaii schatkist in lagen ----------
     zodat de diamanten ECHT in de kist liggen:
     achterwand → diamanten → voorwand → deksel (klapt open)          */

  // achterwand + donkere binnenkant (achter de diamanten)
  chestBack() {
    return `
    <svg viewBox="0 0 120 108" class="chest">
      <ellipse cx="60" cy="103" rx="46" ry="6" fill="#000" opacity="0.10"/>
      <rect x="15" y="30" width="90" height="15" rx="7" fill="#B87C41" stroke="#A66C33" stroke-width="2.5"/>
      <rect x="20" y="36" width="80" height="26" rx="6" fill="#6E4A2C"/>
      <rect x="20" y="36" width="80" height="10" rx="4" fill="#4E3218"/>
    </svg>`;
  },

  // voorwand + gezichtje + slot (vóór de diamanten, zodat ze erin lijken te liggen)
  chestFront() {
    return `
    <svg viewBox="0 0 120 108" class="chest">
      <path d="M18 58 L102 58 L98 96 Q97 100 92 100 L28 100 Q23 100 22 96 Z"
            fill="#C98A4B" stroke="#A66C33" stroke-width="3" stroke-linejoin="round"/>
      <rect x="14" y="54" width="92" height="10" rx="5" fill="#E1A85F" stroke="#A66C33" stroke-width="2.5"/>
      <circle cx="49" cy="80" r="3.4" fill="#5B4636"/>
      <circle cx="71" cy="80" r="3.4" fill="#5B4636"/>
      <circle cx="42" cy="85" r="3.6" fill="#E79A6B" opacity="0.6"/>
      <circle cx="78" cy="85" r="3.6" fill="#E79A6B" opacity="0.6"/>
      <path d="M55 85 Q60 90 65 85" stroke="#5B4636" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <rect x="54" y="62" width="12" height="38" rx="3" fill="#F2C14E" stroke="#B8811F" stroke-width="1.6"/>
      <rect x="51" y="66" width="18" height="14" rx="3" fill="#F2C14E" stroke="#B8811F" stroke-width="1.6"/>
      <circle cx="60" cy="73" r="2.4" fill="#7A5320"/>
    </svg>`;
  },

  // het deksel (scharnier onderaan; draait open met CSS rotateX)
  chestLid() {
    return `
    <svg viewBox="0 0 120 108" class="chest">
      <path d="M20 56 L20 34 Q20 20 34 20 L86 20 Q100 20 100 34 L100 56 Z"
            fill="#D89A55" stroke="#A66C33" stroke-width="3" stroke-linejoin="round"/>
      <rect x="16" y="50" width="88" height="9" rx="4.5" fill="#F2C14E" stroke="#D89A2E" stroke-width="2"/>
      <rect x="54" y="46" width="12" height="12" rx="3" fill="#F2C14E" stroke="#B8811F" stroke-width="2"/>
    </svg>`;
  },

  // volledig gesloten kist als klein pictogram (startknop)
  chestClosed() {
    return `
    <svg viewBox="0 0 120 108" class="chest">
      <ellipse cx="60" cy="103" rx="44" ry="6" fill="#000" opacity="0.10"/>
      <path d="M18 58 L102 58 L98 96 Q97 100 92 100 L28 100 Q23 100 22 96 Z"
            fill="#C98A4B" stroke="#A66C33" stroke-width="3" stroke-linejoin="round"/>
      <rect x="14" y="54" width="92" height="10" rx="5" fill="#E1A85F" stroke="#A66C33" stroke-width="2.5"/>
      <path d="M20 56 L20 34 Q20 20 34 20 L86 20 Q100 20 100 34 L100 56 Z"
            fill="#D89A55" stroke="#A66C33" stroke-width="3" stroke-linejoin="round"/>
      <rect x="16" y="50" width="88" height="9" rx="4.5" fill="#F2C14E" stroke="#D89A2E" stroke-width="2"/>
      <rect x="54" y="46" width="12" height="13" rx="3" fill="#F2C14E" stroke="#B8811F" stroke-width="2"/>
      <circle cx="60" cy="53" r="2.2" fill="#7A5320"/>
    </svg>`;
  },

  /* ---------- speler-avatars (Lea / Mama / Papa) ---------- */
  avatar(name) {
    const eye = "#4A3F55";
    const face = (hair, o) => {
      o = o || {};
      const skin = o.skin || "#F6C9A8";
      const cheeks =
        o.cheeks === false
          ? ""
          : `<circle cx="19" cy="39" r="4" fill="#F2A0B4" opacity="0.6"/>
             <circle cx="45" cy="39" r="4" fill="#F2A0B4" opacity="0.6"/>`;
      return `
      <svg viewBox="0 0 64 64" class="avatar-svg">
        <circle cx="32" cy="34" r="23" fill="${skin}"/>
        ${hair}
        <circle cx="24" cy="33" r="3" fill="${eye}"/>
        <circle cx="40" cy="33" r="3" fill="${eye}"/>
        ${cheeks}
        <path d="M27 41 Q32 46 37 41" stroke="${eye}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        ${o.extra || ""}
      </svg>`;
    };
    if (name === "Lea")
      // gewone huidskleur, lang paars haar, kleine wangetjes zoals de anderen
      return face(
        `<path d="M5 60 Q4 7 32 7 Q60 7 59 60 L59 30 Q55 15 32 15 Q9 15 5 30 Z" fill="#8A5CC4"/>`
      );
    if (name === "Mama")
      // zwart lang haar, iets bruinere huid
      return face(
        `<path d="M6 48 Q5 7 32 7 Q59 7 58 48 L58 28 Q54 15 32 15 Q10 15 6 28 Z" fill="#2B2B33"/>`,
        { skin: "#DCA878" }
      );
    if (name === "Raphael")
      // bruin kort haar (jongen van 7)
      return face(
        `<path d="M9 27 Q12 8 32 8 Q52 8 55 27 Q47 16 32 16 Q17 16 9 27 Z" fill="#7A5230"/>`
      );
    // Papa: donkerbruin kort haar + stoppelbaardje
    return face(
      `<path d="M10 27 Q13 9 32 9 Q51 9 54 27 Q47 17 32 17 Q17 17 10 27 Z" fill="#4A3320"/>`,
      { extra: `<path d="M13 41 Q32 57 51 41 Q47 54 32 55 Q17 54 13 41 Z" fill="#3A2A18" opacity="0.22"/>` }
    );
  },

  /* ---------- plus / min tekens ---------- */
  _plus(x, y, s, color) {
    return `<rect x="${x - s}" y="${y - 3.6}" width="${2 * s}" height="7.2" rx="3.6" fill="${color}"/>
            <rect x="${x - 3.6}" y="${y - s}" width="7.2" height="${2 * s}" rx="3.6" fill="${color}"/>`;
  },
  _minus(x, y, s, color) {
    return `<rect x="${x - s}" y="${y - 3.6}" width="${2 * s}" height="7.2" rx="3.6" fill="${color}"/>`;
  },

  /* ---------- tekeningetje per niveau (voor wie nog niet leest) ---------- */
  levelPic(id) {
    const green = "#57B24A", coral = "#F0554C", gold = "#F6B93B";
    const wrap = (inner) => `<svg viewBox="0 0 78 52" class="lvl-pic">${inner}</svg>`;

    if (id === 1) {
      // drie genummerde tegeltjes: cijfers herkennen
      const tiles = [["1", "#E23D82", "#FBD7E6"], ["2", "#4FA6E0", "#D9ECFB"], ["3", "#57B24A", "#DDF0D8"]];
      let g = "";
      tiles.forEach((t, i) => {
        const x = 8 + i * 21;
        g += `<rect x="${x}" y="10" width="18" height="32" rx="6" fill="${t[2]}" stroke="${t[1]}" stroke-width="2"/>
              <text x="${x + 9}" y="35" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
                    font-size="21" font-weight="800" fill="${t[1]}">${t[0]}</text>`;
      });
      return wrap(g);
    }
    if (id === 2) {
      // plus met wat stipjes: optellen
      return wrap(
        `<circle cx="14" cy="18" r="4" fill="${coral}"/><circle cx="14" cy="30" r="4" fill="${coral}"/>` +
          this._plus(39, 26, 13, green) +
          `<circle cx="64" cy="16" r="4" fill="#4FA6E0"/><circle cx="64" cy="26" r="4" fill="#4FA6E0"/><circle cx="64" cy="36" r="4" fill="#4FA6E0"/>`
      );
    }
    if (id === 3) {
      // plus én min: optellen en aftrekken
      return wrap(this._plus(26, 26, 12, green) + this._minus(54, 26, 12, coral));
    }
    if (id === 4) {
      // cijfers zoeken tot 20: twee bredere tegels met grotere getallen
      const tiles = [["15", "#4FA6E0", "#D9ECFB"], ["20", "#E23D82", "#FBD7E6"]];
      let g = "";
      tiles.forEach((t, i) => {
        const x = 12 + i * 30;
        g += `<rect x="${x}" y="10" width="26" height="32" rx="6" fill="${t[2]}" stroke="${t[1]}" stroke-width="2"/>
              <text x="${x + 13}" y="34" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
                    font-size="18" font-weight="800" fill="${t[1]}">${t[0]}</text>`;
      });
      return wrap(g);
    }
    if (id === 6) {
      // plus én min tot 100
      return wrap(
        this._plus(15, 22, 8, green) +
          this._minus(31, 22, 8, coral) +
          `<rect x="44" y="12" width="28" height="28" rx="6" fill="#FBD7DE" stroke="#E23D5A" stroke-width="2"/>
           <text x="58" y="31" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
                 font-size="13" font-weight="800" fill="#E23D5A">100</text>`
      );
    }
    // niveau 5: plus én min + oplopende sterren (grotere getallen)
    let stars = "";
    for (let i = 0; i < 3; i++) {
      const k = 0.26 + i * 0.05;
      stars += `<g transform="translate(${54 + i * 8} ${34 - i * 8})"><g transform="scale(${k}) translate(-12 -12)">
                <path d="M12 2 C12.8 8 16 11.2 22 12 C16 12.8 12.8 16 12 22 C11.2 16 8 12.8 2 12 C8 11.2 11.2 8 12 2 Z" fill="${gold}"/></g></g>`;
    }
    return wrap(this._plus(20, 28, 10, green) + this._minus(40, 28, 10, coral) + stars);
  },

  /* ---------- cadeautjes (frietjes / ijsje / cadeau) ---------- */
  treat(name) {
    const s = (inner) => `<svg viewBox="0 0 48 48" class="treat">${inner}</svg>`;
    switch (name) {
      case "fries":
        return s(`
          <rect x="14" y="9" width="4.5" height="22" rx="2.2" fill="#F6C915"/>
          <rect x="19.5" y="6" width="4.5" height="25" rx="2.2" fill="#F8D64A"/>
          <rect x="25" y="8" width="4.5" height="23" rx="2.2" fill="#F6C915"/>
          <rect x="30.5" y="11" width="4.5" height="20" rx="2.2" fill="#F8D64A"/>
          <path d="M11 22 L37 22 L34 44 Q34 46 32 46 L16 46 Q14 46 14 44 Z" fill="#F0554C"/>
          <rect x="11" y="22" width="26" height="7" fill="#fff" opacity="0.9"/>
          <rect x="18" y="31" width="3" height="12" fill="#fff" opacity="0.45"/>
          <rect x="26" y="31" width="3" height="12" fill="#fff" opacity="0.45"/>`);
      case "icecream":
        return s(`
          <path d="M15 25 L33 25 L24 46 Z" fill="#E0A860"/>
          <path d="M18 29 L30 29 M20 33 L28 33" stroke="#B9834A" stroke-width="1.4" stroke-linecap="round"/>
          <circle cx="19" cy="20" r="8" fill="#F291B7"/>
          <circle cx="29" cy="20" r="8" fill="#FBE0A6"/>
          <circle cx="24" cy="13" r="8" fill="#9AD0C2"/>
          <circle cx="24" cy="6" r="2.6" fill="#F0554C"/>`);
      case "gift":
        return s(`
          <rect x="8" y="21" width="32" height="21" rx="3" fill="#8A5CC4"/>
          <rect x="8" y="21" width="32" height="7" rx="3" fill="#7A4EB0"/>
          <rect x="21" y="21" width="6" height="21" fill="#F6C915"/>
          <rect x="8" y="23" width="32" height="5" fill="#F6C915"/>
          <path d="M24 21 Q15 11 11 17 Q15 23 24 21 Z" fill="#F6C915"/>
          <path d="M24 21 Q33 11 37 17 Q33 23 24 21 Z" fill="#F6C915"/>
          <circle cx="24" cy="20" r="3" fill="#F0AE2E"/>`);
      case "lolly":
        return s(`
          <rect x="22.5" y="22" width="3" height="23" rx="1.5" fill="#E4DCEC"/>
          <circle cx="24" cy="17" r="13" fill="#FBD3E4"/>
          <path d="M35 17 A11 11 0 1 1 14 13 A8 8 0 1 0 30 20 A5 5 0 1 1 20 17 A2.4 2.4 0 1 0 26 17"
                fill="none" stroke="#F0568F" stroke-width="3.2" stroke-linecap="round"/>
          <circle cx="19" cy="12" r="2.4" fill="#fff" opacity="0.6"/>`);
      case "cake":
        return s(`
          <path d="M10 26 L38 26 L38 42 Q38 44 36 44 L12 44 Q10 44 10 42 Z" fill="#F291B7"/>
          <path d="M10 30 Q17 36 24 30 Q31 36 38 30 L38 27 L10 27 Z" fill="#fff" opacity="0.9"/>
          <rect x="22.5" y="10" width="3" height="10" rx="1.5" fill="#F6C915"/>
          <circle cx="24" cy="8" r="2.4" fill="#F0554C"/>`);
      default:
        return s(`<circle cx="24" cy="24" r="14" fill="#8A5CC4"/>`);
    }
  },

  /* ---------- zachte achtergrond-blobs ---------- */
  blobs() {
    return `
      <span class="blob b1"></span>
      <span class="blob b2"></span>
      <span class="blob b3"></span>`;
  },
};
