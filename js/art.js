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

      /* ===== extra plaatjes voor het beginletter-spel (woord → letter) ===== */
      case "aardbei":
        return s(`
          <path d="M24 44 C13 40 8 30 10 22 C12 16 20 15 24 18 C28 15 36 16 38 22 C40 30 35 40 24 44 Z" fill="#F0554C"/>
          <path d="M24 18 C21 13 17 12 14 13 C17 15 19 16 24 18 Z" fill="#7FB77E"/>
          <path d="M24 18 C27 13 31 12 34 13 C31 15 29 16 24 18 Z" fill="#7FB77E"/>
          <g fill="#F6C915"><circle cx="18" cy="26" r="1.2"/><circle cx="26" cy="27" r="1.2"/><circle cx="22" cy="33" r="1.2"/><circle cx="30" cy="31" r="1.2"/><circle cx="15" cy="31" r="1.2"/></g>`);
      case "boom":
        return s(`
          <rect x="21" y="28" width="6" height="14" rx="2" fill="#9A6B3F"/>
          <circle cx="24" cy="19" r="13" fill="#7FB77E"/><circle cx="15" cy="24" r="8" fill="#86C07A"/><circle cx="33" cy="24" r="8" fill="#86C07A"/>`);
      case "brood":
        return s(`
          <path d="M8 25 Q8 16 17 16 L31 16 Q40 16 40 25 L40 36 Q40 38 38 38 L10 38 Q8 38 8 36 Z" fill="#E0A860" stroke="#B9834A" stroke-width="1.2"/>
          <path d="M13 16 Q13 12 17 12 Q17 16 13 16 M21 16 Q21 12 25 12 Q25 16 21 16 M29 16 Q29 12 33 12 Q33 16 29 16" fill="#EAB877"/>
          <path d="M15 26 H33 M15 31 H33" stroke="#C88E4E" stroke-width="1" opacity="0.6"/>`);
      case "boot":
        return s(`
          <rect x="23" y="10" width="2.4" height="20" fill="#8A6234"/>
          <path d="M25.4 12 L36 28 L25.4 28 Z" fill="#F0554C" stroke="#C93B34" stroke-width="1"/>
          <path d="M22.6 12 L14 28 L22.6 28 Z" fill="#EAF0F5" stroke="#C6D2DC" stroke-width="1"/>
          <path d="M8 30 L40 30 L35 40 Q34 42 32 42 L16 42 Q14 42 13 40 Z" fill="#4FA6E0" stroke="#3B84BE" stroke-width="1"/>`);
      case "bed":
        return s(`
          <rect x="5" y="17" width="4" height="21" rx="1" fill="#9A6B3F"/>
          <rect x="39" y="26" width="4" height="12" rx="1" fill="#9A6B3F"/>
          <rect x="6" y="26" width="36" height="10" rx="2" fill="#7FB2F0"/>
          <rect x="9" y="21" width="11" height="9" rx="2" fill="#fff" stroke="#D6DCE2" stroke-width="1"/>
          <path d="M6 30 H42" stroke="#5E90CE" stroke-width="1" opacity="0.5"/>`);
      case "boek":
        return s(`
          <path d="M8 12 C12 9 19 9 23 12 L23 38 C19 35 12 35 8 38 Z" fill="#7FB2F0"/>
          <path d="M40 12 C36 9 29 9 25 12 L25 38 C29 35 36 35 40 38 Z" fill="#5E90CE"/>
          <rect x="22.6" y="10.5" width="2.8" height="28" rx="1.2" fill="#3E6EA8"/>
          <path d="M11 17 C14 15.4 18 15.4 20 16.6 M11 22 C14 20.4 18 20.4 20 21.6" stroke="#fff" stroke-width="1.2" opacity="0.55" fill="none" stroke-linecap="round"/>
          <path d="M28 16.6 C30 15.4 34 15.4 37 17 M28 21.6 C30 20.4 34 20.4 37 22" stroke="#fff" stroke-width="1.2" opacity="0.4" fill="none" stroke-linecap="round"/>`);
      case "deur":
        return s(`
          <rect x="14" y="7" width="20" height="35" rx="2" fill="#B9834A" stroke="#8A6234" stroke-width="1.6"/>
          <rect x="17" y="11" width="14" height="11" rx="1.5" fill="#A9743E"/><rect x="17" y="25" width="14" height="13" rx="1.5" fill="#A9743E"/>
          <circle cx="30" cy="26" r="1.8" fill="#F6C915"/>`);
      case "das":
        return s(`
          <path d="M22 8 L26 8 L28 12 L24 16 L20 12 Z" fill="#4FA6E0"/>
          <path d="M21 16 L27 16 L30 36 L24 42 L18 36 Z" fill="#4FA6E0" stroke="#3B84BE" stroke-width="0.8"/>
          <path d="M22 20 L26 20 M22 26 L26 26" stroke="#3B84BE" stroke-width="1" opacity="0.6"/>`);
      case "doos":
        return s(`
          <path d="M24 12 L42 19 L24 26 L6 19 Z" fill="#E8C79A"/>
          <path d="M6 19 L24 26 L24 42 L6 35 Z" fill="#D8B37F"/>
          <path d="M42 19 L42 35 L24 42 L24 26 Z" fill="#C79E6A"/>
          <path d="M24 12 L24 26" stroke="#D8B37F" stroke-width="1" opacity="0.7"/>`);
      case "eend":
        return s(`
          <ellipse cx="26" cy="31" rx="14" ry="9" fill="#F8D64A"/>
          <circle cx="15" cy="21" r="8" fill="#F8D64A"/>
          <path d="M7 21 L14 19 L14 24 Z" fill="#F0812E"/>
          <circle cx="13" cy="19" r="1.5" fill="#3E2A18"/>
          <path d="M33 27 Q41 23 39 31 Q35 31 33 29 Z" fill="#EFC63A"/>`);
      case "emmer":
        return s(`
          <path d="M13 17 L35 17 L32 40 Q32 42 30 42 L18 42 Q16 42 16 40 Z" fill="#4FA6E0"/>
          <rect x="11" y="14" width="26" height="4" rx="2" fill="#3B84BE"/>
          <path d="M15 16 Q24 5 33 16" stroke="#3B84BE" stroke-width="2.4" fill="none"/>`);
      case "fles":
        return s(`
          <path d="M20 8 L28 8 L28 15 Q34 18 34 26 L34 40 Q34 42 32 42 L16 42 Q14 42 14 40 L14 26 Q14 18 20 15 Z" fill="#66C7C0" stroke="#3AA79F" stroke-width="1.2"/>
          <rect x="20" y="5" width="8" height="4" rx="1.5" fill="#3AA79F"/>
          <rect x="16" y="30" width="16" height="9" rx="2" fill="#fff" opacity="0.5"/>`);
      case "fiets":
        return s(`
          <circle cx="13" cy="32" r="8" fill="none" stroke="#3E4A57" stroke-width="2.4"/>
          <circle cx="35" cy="32" r="8" fill="none" stroke="#3E4A57" stroke-width="2.4"/>
          <path d="M13 32 L22 32 L28 20 L35 32 M22 32 L28 20" stroke="#F0554C" stroke-width="2.2" fill="none" stroke-linecap="round"/>
          <path d="M25 20 L31 20 M20 20 L18 18" stroke="#3E4A57" stroke-width="2" fill="none" stroke-linecap="round"/>
          <circle cx="13" cy="32" r="1.6" fill="#3E4A57"/><circle cx="35" cy="32" r="1.6" fill="#3E4A57"/>`);
      case "gras":
        return s(`
          <g fill="#6BBB57">
            <path d="M8 42 C8 30 6 24 5 20 C11 24 12 34 12 42 Z"/>
            <path d="M16 42 C16 28 15 22 14 18 C20 24 21 34 20 42 Z"/>
            <path d="M24 42 C24 30 24 22 24 17 C28 24 28 34 28 42 Z"/>
            <path d="M32 42 C32 28 33 22 34 18 C38 26 37 34 36 42 Z"/>
            <path d="M40 42 C40 30 41 24 42 21 C44 28 44 35 43 42 Z"/>
          </g>`);
      case "giraf":
        return s(`
          <path d="M19 42 L19 22 Q19 14 26 12 L31 12 Q26 16 27 22 L27 42 Z" fill="#F3C34E"/>
          <circle cx="29" cy="11" r="5" fill="#F3C34E"/>
          <path d="M26 6 L27 10 M32 6 L31 10" stroke="#F3C34E" stroke-width="2.2" stroke-linecap="round"/>
          <circle cx="26.5" cy="5" r="1.6" fill="#8A6234"/><circle cx="31.5" cy="5" r="1.6" fill="#8A6234"/>
          <circle cx="29" cy="11" r="1" fill="#3E2A18"/>
          <g fill="#D89A3A"><circle cx="22" cy="26" r="2.3"/><circle cx="24" cy="34" r="2.3"/><circle cx="22" cy="40" r="1.8"/></g>`);
      case "glas":
        return s(`
          <path d="M15 12 L33 12 L30 40 Q30 42 28 42 L20 42 Q18 42 18 40 Z" fill="#DDF1FB" stroke="#8FCBE6" stroke-width="1.2"/>
          <path d="M16.5 25 L31.5 25 L30 40 Q30 42 28 42 L20 42 Q18 42 18 40 Z" fill="#7FC7EC" opacity="0.85"/>`);
      case "huis":
        return s(`
          <rect x="12" y="24" width="24" height="18" fill="#F8D64A"/>
          <path d="M9 25 L24 12 L39 25 Z" fill="#F0554C"/>
          <rect x="21" y="32" width="7" height="10" fill="#9A6B3F"/>
          <rect x="15" y="28" width="5" height="5" fill="#7FB2F0"/>`);
      case "hond":
        return s(`
          <circle cx="24" cy="26" r="12" fill="#C79A6B"/>
          <ellipse cx="11" cy="24" rx="5" ry="9" fill="#A97C4E"/><ellipse cx="37" cy="24" rx="5" ry="9" fill="#A97C4E"/>
          <circle cx="19" cy="24" r="2" fill="#3E2A18"/><circle cx="29" cy="24" r="2" fill="#3E2A18"/>
          <ellipse cx="24" cy="31" rx="4" ry="3" fill="#7A5433"/><ellipse cx="24" cy="30" rx="2" ry="1.3" fill="#2A1B10"/>
          <path d="M24 33 L24 36" stroke="#7A5433" stroke-width="1.4"/>`);
      case "hoed":
        return s(`
          <ellipse cx="24" cy="32" rx="18" ry="5.5" fill="#C98A4B"/>
          <path d="M13 32 C13 19 17 12 24 12 C31 12 35 19 35 32 Z" fill="#E0A868"/>
          <rect x="13" y="26" width="22" height="5" rx="2" fill="#8A5A2B"/>
          <ellipse cx="19" cy="20" rx="2.4" ry="4" fill="#fff" opacity="0.28"/>`);
      case "hamer":
        // Kop rechts + gebogen klauw links, anders wordt het een vlakke "T".
        return s(`
          <rect x="21" y="15" width="6" height="27" rx="2.4" fill="#C98A4B"/>
          <rect x="21" y="15" width="2.2" height="27" fill="#fff" opacity="0.22"/>
          <path d="M24 8 L34 8 C35.7 8 37 9.3 37 11 L37 16 C37 17.7 35.7 19 34 19 L24 19 Z" fill="#98A2AE"/>
          <path d="M24 8 L24 19 L20 19 C15 19 11.4 16.2 10.2 12.4 C9.7 10.8 11.4 9.6 12.6 10.7 C14.8 12.7 17.6 13.8 20.6 13.8 L20.6 8 Z" fill="#98A2AE"/>
          <rect x="33.4" y="8" width="3.6" height="11" rx="1.6" fill="#828C99"/>`);
      case "iglo":
        return s(`
          <path d="M8 34 A16 12 0 0 1 40 34 Z" fill="#EAF4FA" stroke="#B9D6E6" stroke-width="1.4"/>
          <path d="M8 34 H40" stroke="#B9D6E6" stroke-width="1.4"/>
          <path d="M20 34 L20 27 A6 5 0 0 1 28 27 L28 34 Z" fill="#CFE6F2" stroke="#B9D6E6" stroke-width="1.2"/>
          <path d="M16 22 V30 M24 18 V24 M32 22 V30" stroke="#CADFEC" stroke-width="1.2"/>`);
      case "jas":
        return s(`
          <path d="M18 10 L30 10 L38 16 L34 22 L32 20 L32 42 L16 42 L16 20 L14 22 L10 16 Z" fill="#4FA6E0" stroke="#3B84BE" stroke-width="1.2" stroke-linejoin="round"/>
          <path d="M24 10 L24 42" stroke="#3B84BE" stroke-width="1.2"/>
          <circle cx="24" cy="26" r="1.3" fill="#fff"/><circle cx="24" cy="32" r="1.3" fill="#fff"/>`);
      case "kat":
        return s(`
          <path d="M12 15 L17 24 L12 24 Z" fill="#F6B27A"/><path d="M36 15 L31 24 L36 24 Z" fill="#F6B27A"/>
          <circle cx="24" cy="28" r="12" fill="#F6B27A"/>
          <circle cx="19" cy="26" r="2" fill="#3E2A18"/><circle cx="29" cy="26" r="2" fill="#3E2A18"/>
          <path d="M24 30 L22 33 L26 33 Z" fill="#E07A5F"/>
          <path d="M10 29 L18 30 M10 32 L18 32 M38 29 L30 30 M38 32 L30 32" stroke="#D6A374" stroke-width="0.8"/>`);
      case "koe":
        return s(`
          <circle cx="24" cy="26" r="12" fill="#F2ECE4"/>
          <path d="M12 18 Q6 12 8 20 Q12 22 14 20 Z" fill="#C9B79E"/><path d="M36 18 Q42 12 40 20 Q36 22 34 20 Z" fill="#C9B79E"/>
          <path d="M15 20 Q19 16 23 19 Q20 23 15 20 Z" fill="#C6B49B"/>
          <circle cx="19" cy="23" r="2" fill="#3E2A18"/><circle cx="29" cy="23" r="2" fill="#3E2A18"/>
          <ellipse cx="24" cy="32" rx="8" ry="6" fill="#F4B8C4"/>
          <ellipse cx="21" cy="32" rx="1.5" ry="2" fill="#D98298"/><ellipse cx="27" cy="32" rx="1.5" ry="2" fill="#D98298"/>`);
      case "kam":
        return s(`
          <rect x="7" y="13" width="34" height="9" rx="3" fill="#8FA0D8"/>
          <g fill="#8FA0D8">
            <rect x="10" y="21" width="2.8" height="13" rx="1.4"/><rect x="15" y="21" width="2.8" height="13" rx="1.4"/>
            <rect x="20" y="21" width="2.8" height="13" rx="1.4"/><rect x="25" y="21" width="2.8" height="13" rx="1.4"/>
            <rect x="30" y="21" width="2.8" height="13" rx="1.4"/><rect x="35" y="21" width="2.8" height="13" rx="1.4"/>
          </g>
          <rect x="9" y="15" width="30" height="2.4" rx="1.2" fill="#fff" opacity="0.3"/>`);
      case "kaars":
        return s(`
          <rect x="18" y="20" width="12" height="22" rx="2.5" fill="#F7E2C8"/>
          <rect x="18" y="20" width="4.5" height="22" rx="2.2" fill="#fff" opacity="0.45"/>
          <rect x="23.2" y="15" width="1.6" height="6" fill="#7A5A3A"/>
          <path d="M24 5 C27.5 9.5 28.6 12.6 28.6 15 C28.6 17.9 26.5 19.8 24 19.8 C21.5 19.8 19.4 17.9 19.4 15 C19.4 12.6 20.5 9.5 24 5 Z" fill="#FFC94D"/>
          <path d="M24 10 C26 12.6 26.4 14.2 26.4 15.4 C26.4 16.9 25.3 17.8 24 17.8 C22.7 17.8 21.6 16.9 21.6 15.4 C21.6 14.2 22 12.6 24 10 Z" fill="#FFF0A8"/>`);
      case "lamp":
        return s(`
          <circle cx="24" cy="20" r="12" fill="#FFE08A"/>
          <path d="M18 30 Q24 34 30 30 L30 34 Q24 37 18 34 Z" fill="#C9CDD4"/>
          <rect x="20" y="34" width="8" height="4" rx="1" fill="#9AA0A8"/>
          <path d="M20 18 Q24 14 28 18" stroke="#E0A93B" stroke-width="1.6" fill="none"/>`);
      case "lepel":
        // Eén vlakke kom met één highlight. Twee tinten in de kom maakte er
        // een handspiegel van — verwarrend als je op het wóórd moet letten.
        return s(`
          <path d="M22.4 22 L25.6 22 C25.6 30 26 34 26 39.6 C26 42 22 42 22 39.6 C22 34 22.4 30 22.4 22 Z" fill="#C9CDD4"/>
          <ellipse cx="24" cy="15" rx="7.6" ry="9.8" fill="#D8DDE4"/>
          <ellipse cx="21" cy="12" rx="2.6" ry="4" fill="#fff" opacity="0.55"/>`);
      case "maan":
        // Een sikkel = buitenboog linksom + binnenboog die er weer in bijt.
        // Let op de vlaggen: liepen ze allebei langs dezelfde kant (zoals eerst),
        // dan tekent het pad zichzelf terug en omsluit het níéts — dan bleef de
        // maan onzichtbaar. De tips liggen daarom bewust niet recht tegenover
        // elkaar, zodat geen van beide bogen een ontaarde halve cirkel wordt.
        return s(`
          <path d="M31.2 8.6 A17 17 0 1 0 31.2 39.4 A16 16 0 0 1 31.2 8.6 Z" fill="#FBD34E"/>
          <circle cx="16" cy="20" r="2.2" fill="#EFBE3A"/>
          <circle cx="13" cy="29" r="1.6" fill="#EFBE3A"/>`);
      case "muis":
        return s(`
          <circle cx="22" cy="28" r="12" fill="#B7BEC8"/>
          <circle cx="14" cy="18" r="6" fill="#B7BEC8"/><circle cx="30" cy="18" r="6" fill="#B7BEC8"/>
          <circle cx="14" cy="18" r="3" fill="#F1C6D2"/><circle cx="30" cy="18" r="3" fill="#F1C6D2"/>
          <circle cx="19" cy="27" r="1.6" fill="#3E4A57"/><circle cx="26" cy="27" r="1.6" fill="#3E4A57"/>
          <circle cx="22.5" cy="31" r="1.5" fill="#F1889E"/>
          <path d="M34 32 Q42 34 40 40" stroke="#B7BEC8" stroke-width="2.4" fill="none" stroke-linecap="round"/>`);
      case "mes":
        return s(`
          <path d="M14 30 C20 23 30 15 38 11 C39.6 10.2 40.6 11.6 39.8 13 C35.4 21 26.6 29 20 33 Z" fill="#D8DDE4"/>
          <path d="M14 30 C20 23 30 15 38 11" stroke="#AEB6C0" stroke-width="1.1" fill="none"/>
          <path d="M14 30 L20 33 L15.4 37.4 C14.2 38.5 12.4 38.2 11.4 36.9 L10.3 35.4 C9.4 34.2 9.8 32.5 11 31.7 Z" fill="#8A5A2B"/>`);
      case "neus":
        return s(`
          <path d="M24 8 C20 8 18 18 16 28 C15 34 18 38 24 38 C30 38 33 34 32 28 C30 18 28 8 24 8 Z" fill="#F6B79E"/>
          <ellipse cx="20" cy="32" rx="2" ry="1.6" fill="#C97F63"/><ellipse cx="28" cy="32" rx="2" ry="1.6" fill="#C97F63"/>`);
      case "nest":
        return s(`
          <path d="M7 26 C7 21.5 14 18 24 18 C34 18 41 21.5 41 26 C41 33 34 38 24 38 C14 38 7 33 7 26 Z" fill="#C9A97C"/>
          <path d="M11 26 C11 22.5 17 20 24 20 C31 20 37 22.5 37 26 C37 31 31 35 24 35 C17 35 11 31 11 26 Z" fill="#A88656"/>
          <path d="M7 24 C13 22 19 27 25 24 C31 21 37 26 41 24" stroke="#B8946A" stroke-width="1.4" fill="none" opacity="0.7"/>
          <g fill="#FFF6E0" stroke="#E4D6B8" stroke-width="0.8">
            <ellipse cx="19" cy="26" rx="4.2" ry="5.2"/><ellipse cx="28" cy="25" rx="4.2" ry="5.2"/>
          </g>`);
      case "oog":
        return s(`
          <path d="M8 24 Q24 10 40 24 Q24 38 8 24 Z" fill="#fff" stroke="#3E4A57" stroke-width="1.6"/>
          <circle cx="24" cy="24" r="7" fill="#5B8AC4"/><circle cx="24" cy="24" r="3" fill="#2A2A2A"/>
          <circle cx="26" cy="22" r="1.4" fill="#fff"/>`);
      case "paraplu":
        return s(`
          <path d="M7 26 Q24 6 41 26 Z" fill="#F0554C" stroke="#C93B34" stroke-width="1"/>
          <path d="M7 26 Q11 22 15 26 Q19 22 24 26 Q29 22 33 26 Q37 22 41 26" fill="none" stroke="#C93B34" stroke-width="1"/>
          <path d="M24 26 L24 40 Q24 44 20 42" stroke="#8A6234" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
      case "peer":
        return s(`
          <path d="M24 14 C21 14 19 17 20 21 C15 24 13 30 15 35 C17 41 31 41 33 35 C35 30 33 24 28 21 C29 17 27 14 24 14 Z" fill="#A7C957"/>
          <path d="M24 14 C24 10 26 8 29 8" stroke="#6E4B2A" stroke-width="2" fill="none" stroke-linecap="round"/>
          <ellipse cx="20" cy="30" rx="2.4" ry="3.4" fill="#fff" opacity="0.3"/>`);
      case "pen":
        return s(`
          <g transform="rotate(45 24 24)">
            <rect x="21" y="9" width="6" height="25" rx="2" fill="#4FA6E0"/>
            <rect x="21" y="13" width="6" height="3" fill="#3B84BE"/>
            <path d="M21 34 L27 34 L24 40 Z" fill="#F6C915"/>
            <path d="M23 38 L25 38 L24 41 Z" fill="#3E4A57"/>
          </g>`);
      case "potlood":
        return s(`
          <g transform="rotate(-35 24 24)">
            <rect x="20" y="7" width="8" height="5" rx="1.6" fill="#F0889E"/>
            <rect x="20" y="11" width="8" height="2.6" fill="#C9C9D2"/>
            <rect x="20" y="13" width="8" height="21" fill="#F5C242"/>
            <rect x="24" y="13" width="4" height="21" fill="#E0A92E" opacity="0.5"/>
            <path d="M20 34 L28 34 L24 42 Z" fill="#E8CBA0"/>
            <path d="M22.3 38.6 L25.7 38.6 L24 42 Z" fill="#4A4A55"/>
          </g>`);
      case "regenboog":
        return s(`
          <path d="M5 40 A19 19 0 0 1 43 40" fill="none" stroke="#E23D82" stroke-width="4"/>
          <path d="M9 40 A15 15 0 0 1 39 40" fill="none" stroke="#F6C915" stroke-width="4"/>
          <path d="M13 40 A11 11 0 0 1 35 40" fill="none" stroke="#57B24A" stroke-width="4"/>
          <path d="M17 40 A7 7 0 0 1 31 40" fill="none" stroke="#4FA6E0" stroke-width="4"/>`);
      case "raket":
        return s(`
          <path d="M24 6 C30 12 32 22 32 30 L16 30 C16 22 18 12 24 6 Z" fill="#E8EDF2" stroke="#B4BCC6" stroke-width="1.2"/>
          <circle cx="24" cy="18" r="3.5" fill="#7FB2F0"/>
          <path d="M16 30 L10 38 L16 34 Z" fill="#F0554C"/><path d="M32 30 L38 38 L32 34 Z" fill="#F0554C"/>
          <path d="M20 34 L24 44 L28 34 Z" fill="#F0812E"/>`);
      case "ring":
        return s(`
          <circle cx="24" cy="29" r="11" fill="none" stroke="#F6C915" stroke-width="4"/>
          <path d="M18 19 L24 8 L30 19 Z" fill="#7FD0F0" stroke="#4FA6E0" stroke-width="1"/>`);
      case "raam":
        return s(`
          <rect x="8" y="8" width="32" height="32" rx="3" fill="#9FD3EE"/>
          <path d="M12.5 20.5 L20 13" stroke="#fff" stroke-width="2.6" opacity="0.5" stroke-linecap="round"/>
          <path d="M28.5 36.5 L36 29" stroke="#fff" stroke-width="2.6" opacity="0.4" stroke-linecap="round"/>
          <path d="M24 8 L24 40 M8 24 L40 24" stroke="#C98A4B" stroke-width="3.4"/>
          <rect x="8" y="8" width="32" height="32" rx="3" fill="none" stroke="#C98A4B" stroke-width="4"/>`);
      case "slang":
        return s(`
          <path d="M9 34 Q18 22 24 30 Q30 38 38 26 Q42 20 37 15" fill="none" stroke="#6BBB57" stroke-width="6" stroke-linecap="round"/>
          <circle cx="37" cy="14" r="4.5" fill="#6BBB57"/>
          <circle cx="38.5" cy="13" r="1" fill="#2A2A2A"/>
          <path d="M40 15 L44 15" stroke="#F0554C" stroke-width="1.4"/>`);
      case "sok":
        return s(`
          <path d="M18 8 L26 8 L26 28 L36 34 Q40 37 37 41 L30 41 Q26 41 24 38 L18 32 Z" fill="#F291B7" stroke="#D96FA0" stroke-width="1"/>
          <rect x="18" y="8" width="8" height="6" fill="#4FA6E0"/>`);
      case "sleutel":
        return s(`
          <circle cx="15" cy="24" r="9" fill="#F5C242"/>
          <circle cx="15" cy="24" r="4" fill="#FFF6E0"/>
          <rect x="22" y="21" width="20" height="6" rx="2" fill="#F5C242"/>
          <rect x="31" y="27" width="3.6" height="6.5" rx="1.4" fill="#F5C242"/>
          <rect x="37.5" y="27" width="3.6" height="5" rx="1.4" fill="#F5C242"/>
          <path d="M9 20 C10.5 17.5 13 16.5 15 16.5" stroke="#fff" stroke-width="1.6" opacity="0.45" fill="none" stroke-linecap="round"/>`);
      case "tent":
        return s(`
          <path d="M24 8 L42 40 L6 40 Z" fill="#F0812E" stroke="#C96A20" stroke-width="1.2" stroke-linejoin="round"/>
          <path d="M24 8 L24 40" stroke="#C96A20" stroke-width="1.2"/>
          <path d="M20 40 L24 26 L28 40 Z" fill="#8A4A16"/>`);
      case "tijger":
        return s(`
          <path d="M13 16 L17 22 L12 22 Z" fill="#F0912E"/><path d="M35 16 L31 22 L36 22 Z" fill="#F0912E"/>
          <circle cx="24" cy="26" r="12" fill="#F0912E"/>
          <ellipse cx="24" cy="30" rx="9" ry="7" fill="#FBE3C4"/>
          <circle cx="19" cy="24" r="2" fill="#3E2A18"/><circle cx="29" cy="24" r="2" fill="#3E2A18"/>
          <path d="M24 28 L22 31 L26 31 Z" fill="#7A4A2A"/>
          <path d="M16 15 L18 21 M24 14 L24 19 M32 15 L30 21 M12 26 L16 27 M36 26 L32 27" stroke="#3E2A18" stroke-width="1.6" stroke-linecap="round"/>`);
      case "tomaat":
        return s(`
          <circle cx="24" cy="28" r="14" fill="#F0554C"/>
          <path d="M24 14 L20 10 M24 14 L28 10 M24 14 L24 8 M24 14 L18 12 M24 14 L30 12" stroke="#6BBB57" stroke-width="2" stroke-linecap="round"/>
          <ellipse cx="18" cy="24" rx="3" ry="4" fill="#fff" opacity="0.3"/>`);
      case "tuin":
        return s(`
          <rect x="4" y="35" width="40" height="7" rx="2.5" fill="#8ECB7A"/>
          <g fill="#EFDCBA">
            <path d="M8.8 19 L10.6 22.5 L10.6 38 L7 38 L7 22.5 Z"/>
            <path d="M15.8 19 L17.6 22.5 L17.6 38 L14 38 L14 22.5 Z"/>
            <path d="M22.8 19 L24.6 22.5 L24.6 38 L21 38 L21 22.5 Z"/>
            <rect x="5" y="25" width="21" height="3.2" rx="1.4"/><rect x="5" y="31" width="21" height="3.2" rx="1.4"/>
          </g>
          <path d="M35 38 L35 25" stroke="#57A84A" stroke-width="2.2" stroke-linecap="round"/>
          <g fill="#F49CC4">
            <circle cx="35" cy="17" r="3.4"/><circle cx="39.2" cy="20" r="3.4"/>
            <circle cx="37.6" cy="25" r="3.4"/><circle cx="32.4" cy="25" r="3.4"/><circle cx="30.8" cy="20" r="3.4"/>
          </g>
          <circle cx="35" cy="21" r="2.8" fill="#FFD166"/>`);
      case "uil":
        return s(`
          <ellipse cx="24" cy="27" rx="13" ry="15" fill="#B9834A"/>
          <path d="M12 15 L18 21 M36 15 L30 21" stroke="#B9834A" stroke-width="4" stroke-linecap="round"/>
          <circle cx="18" cy="23" r="6" fill="#fff"/><circle cx="30" cy="23" r="6" fill="#fff"/>
          <circle cx="18" cy="23" r="2.6" fill="#2A2A2A"/><circle cx="30" cy="23" r="2.6" fill="#2A2A2A"/>
          <path d="M24 27 L21 31 L27 31 Z" fill="#F0812E"/>
          <path d="M16 40 L20 35 M32 40 L28 35" stroke="#8A6234" stroke-width="2" stroke-linecap="round"/>`);
      case "vlag":
        return s(`
          <rect x="12" y="8" width="2.6" height="34" rx="1" fill="#8A6234"/>
          <path d="M14.6 9 L36 9 L36 24 L14.6 24 Z" fill="#F0554C"/>
          <path d="M14.6 9 Q26 13 36 9 L36 12 Q26 16 14.6 12 Z" fill="#fff" opacity="0.25"/>`);
      case "vork":
        return s(`
          <g fill="#C9CDD4">
            <rect x="17" y="6" width="2.8" height="12" rx="1.4"/>
            <rect x="22.6" y="6" width="2.8" height="12" rx="1.4"/>
            <rect x="28.2" y="6" width="2.8" height="12" rx="1.4"/>
            <path d="M15 16 L33 16 L33 20 C33 23.2 30.4 25.6 27.2 25.6 L20.8 25.6 C17.6 25.6 15 23.2 15 20 Z"/>
            <rect x="22.2" y="24" width="3.6" height="18" rx="1.8"/>
          </g>
          <rect x="17" y="17" width="14" height="2" fill="#fff" opacity="0.35"/>`);
      case "verf":
        return s(`
          <path d="M13 19 L35 19 L33 40 C32.9 41.2 31.9 42 30.7 42 L17.3 42 C16.1 42 15.1 41.2 15 40 Z" fill="#9FD3E8"/>
          <ellipse cx="24" cy="19" rx="11" ry="3.4" fill="#6FB8D8"/>
          <path d="M15.7 27 C19 25.6 29 28.4 32.3 27 L31 39.7 C30.9 40.7 30.2 41 29.4 41 L18.6 41 C17.8 41 17.1 40.7 17 39.7 Z" fill="#F0648A"/>
          <g transform="rotate(18 28 12)">
            <rect x="26.4" y="2" width="3.2" height="13" rx="1.6" fill="#C98A4B"/>
            <rect x="25.6" y="14" width="4.8" height="3.4" rx="1" fill="#C2C7D0"/>
            <path d="M25.8 17 L30.2 17 L29.2 23 L26.8 23 Z" fill="#F0648A"/>
          </g>`);
      case "vlinder":
        return s(`
          <path d="M24 24 C16 12 6 14 8 24 C6 34 16 36 24 24 Z" fill="#F291B7"/>
          <path d="M24 24 C32 12 42 14 40 24 C42 34 32 36 24 24 Z" fill="#F49CC4"/>
          <ellipse cx="24" cy="24" rx="2" ry="9" fill="#6C43A6"/>
          <path d="M24 16 L20 10 M24 16 L28 10" stroke="#6C43A6" stroke-width="1.6" stroke-linecap="round"/>`);
      case "wolk":
        return s(`
          <g fill="#CFE6F2">
            <circle cx="17" cy="28" r="9"/><circle cx="28" cy="24" r="11"/><circle cx="36" cy="30" r="8"/>
            <rect x="15" y="30" width="24" height="8" rx="4"/>
          </g>`);
      case "wortel":
        return s(`
          <path d="M18 18 L30 18 L26 42 Q24 45 22 42 Z" fill="#F0812E" stroke="#C96A20" stroke-width="1"/>
          <path d="M20 24 L28 24 M21 30 L27 30" stroke="#C96A20" stroke-width="1"/>
          <path d="M18 18 C14 10 18 8 20 12 C22 6 26 8 24 14 C28 10 30 14 26 18 Z" fill="#6BBB57"/>`);
      case "worm":
        return s(`
          <path d="M9 34 C9 26 18 26 18 32 C18 38 28 38 28 29 C28 21 37 21 37 27" fill="none" stroke="#F2A6B8" stroke-width="8" stroke-linecap="round"/>
          <circle cx="35.4" cy="25.4" r="1.3" fill="#5A4048"/>
          <circle cx="38.6" cy="25.4" r="1.3" fill="#5A4048"/>
          <path d="M34.6 29.4 C35.8 30.4 38.2 30.4 39.4 29.4" stroke="#D98298" stroke-width="1.2" fill="none" stroke-linecap="round"/>`);
      case "zon":
        return s(`
          <circle cx="24" cy="24" r="10" fill="#FBC02D"/>
          <g stroke="#FBC02D" stroke-width="3" stroke-linecap="round">
            <path d="M24 6 V11 M24 37 V42 M6 24 H11 M37 24 H42 M11 11 L14.5 14.5 M37 37 L33.5 33.5 M37 11 L33.5 14.5 M11 37 L14.5 33.5"/>
          </g>`);
      case "zee":
        return s(`
          <rect x="6" y="20" width="36" height="22" rx="3" fill="#4FA6E0"/>
          <path d="M6 25 Q12 21 18 25 T30 25 T42 25" stroke="#fff" stroke-width="1.6" fill="none" opacity="0.7"/>
          <path d="M6 32 Q12 28 18 32 T30 32 T42 32" stroke="#fff" stroke-width="1.6" fill="none" opacity="0.6"/>
          <path d="M6 39 Q12 35 18 39 T30 39 T42 39" stroke="#fff" stroke-width="1.6" fill="none" opacity="0.5"/>`);
      case "zebra":
        return s(`
          <ellipse cx="24" cy="27" rx="11" ry="13" fill="#F4F4F4" stroke="#3E4A57" stroke-width="1"/>
          <path d="M14 14 L18 8 L20 14 Z" fill="#F4F4F4" stroke="#3E4A57" stroke-width="1"/>
          <path d="M34 14 L30 8 L28 14 Z" fill="#F4F4F4" stroke="#3E4A57" stroke-width="1"/>
          <path d="M17 22 H31 M18 27 H30 M20 33 H28 M24 14 V20" stroke="#2A2A2A" stroke-width="2"/>
          <circle cx="20" cy="24" r="1.6" fill="#2A2A2A"/><circle cx="28" cy="24" r="1.6" fill="#2A2A2A"/>
          <ellipse cx="24" cy="38" rx="4" ry="3" fill="#DFDFDF"/>`);

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
  // maal-teken: een plus, 45° gedraaid
  _times(x, y, s, color) {
    return `<g transform="rotate(45 ${x} ${y})">${this._plus(x, y, s, color)}</g>`;
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
    // getal-tegel (voor de tot-100/200 niveaus)
    const numTile = (x, num) =>
      `<rect x="${x}" y="12" width="32" height="28" rx="6" fill="#EAF0F5" stroke="#5B6B7A" stroke-width="2"/>
       <text x="${x + 16}" y="31" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
             font-size="12.5" font-weight="800" fill="#3E4A57">${num}</text>`;
    if (id === 6) return wrap(this._plus(16, 26, 9, green) + numTile(40, "100"));   // plus tot 100
    if (id === 8) return wrap(this._minus(16, 26, 9, coral) + numTile(40, "100"));  // min tot 100
    if (id === 9) return wrap(this._plus(16, 26, 9, green) + numTile(40, "200"));   // plus tot 200
    if (id === 10) return wrap(this._minus(16, 26, 9, coral) + numTile(40, "200")); // min tot 200
    if (id === 11) return wrap(this._plus(12, 26, 7, green) + this._minus(27, 26, 7, coral) + numTile(40, "200")); // plus+min tot 200
    if (id === 12) return wrap(this._times(18, 26, 11, "#2F4C9E") + numTile(40, "12")); // maaltafels tot 12
    if (id === 13)
      // deeltafels: deelteken (:) + 12
      return wrap(
        `<circle cx="18" cy="19" r="4" fill="#79B33C"/><circle cx="18" cy="33" r="4" fill="#79B33C"/>` +
          numTile(40, "12")
      );
    if (id === 14) return wrap(this._plus(16, 26, 9, green) + numTile(40, "12"));   // plus tot 12
    if (id === 15) return wrap(this._minus(16, 26, 9, coral) + numTile(40, "12"));  // min tot 12
    if (id === 16) return wrap(this._plus(16, 26, 9, green) + numTile(40, "15"));   // plus tot 15
    if (id === 17) return wrap(this._minus(16, 26, 9, coral) + numTile(40, "15"));  // min tot 15
    if (id === 19) {
      // een lettertegel + een plaatje (appel): beginletter herkennen
      const g =
        `<rect x="8" y="10" width="26" height="32" rx="7" fill="#FFE1D2" stroke="#FF8A5B" stroke-width="2.2"/>
         <text x="21" y="35" text-anchor="middle" font-family="ui-rounded, system-ui, sans-serif"
               font-size="22" font-weight="800" fill="#EF6A2E">A</text>
         <circle cx="57" cy="31" r="12" fill="#F45B69"/>
         <ellipse cx="52" cy="28" rx="2.6" ry="3.6" fill="#fff" opacity="0.4"/>
         <path d="M57 19 C57 14 60 12 63 12" stroke="#6E4B2A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
         <path d="M63 13 C67 11 69 14 68 17 C64 18 63 15 63 13 Z" fill="#7FB77E"/>`;
      return wrap(g);
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
      case "shrimp":
        // stokjes + torpedogarnaal (tempura)
        return s(`
          <g transform="rotate(-30 24 24)">
            <rect x="1" y="13" width="46" height="3.4" rx="1.7" fill="#CFA470"/>
            <rect x="1" y="20" width="46" height="3.4" rx="1.7" fill="#B98A52"/>
          </g>
          <path d="M13 33 Q15 20 28 20 Q40 20 41 27 Q42 35 30 36 Q19 37 13 33 Z"
                fill="#E9A54D" stroke="#C57F2E" stroke-width="1.6" stroke-linejoin="round"/>
          <circle cx="22" cy="26" r="2" fill="#F8CC85"/>
          <circle cx="29" cy="24" r="1.8" fill="#F8CC85"/>
          <circle cx="35" cy="29" r="1.7" fill="#F8CC85"/>
          <path d="M13 33 L5 27 L8 33 L4 39 L12 37 Z" fill="#F0554C" stroke="#C93B34" stroke-width="1.2" stroke-linejoin="round"/>`);
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
