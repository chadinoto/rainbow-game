/* ============================================================
   calendar.js — een vrolijke kalender in de schatkist
   Laat per dag zien wat de speler deed: welke diamanten verzameld,
   hoeveel minuten geoefend en of er die dag een cadeautje behaald werd.

   Alle gegevens komen uit de bestaande antwoord-log (rainbow_answers):
   we spelen de antwoorden opnieuw af (in tijdsvolgorde) en leiden zo af
   wanneer een regenboog vol was (→ een diamant) en wanneer een
   cadeautje-drempel gehaald werd. Er is dus geen extra tabel nodig.

   Ontworpen in dezelfde geest als de rest: geen druk, geen rode dagen,
   geen "je speelde niet". Alleen tonen wat er wél gebeurde.
   ============================================================ */

window.RB = window.RB || {};

RB.calendar = {
  _rows: null,        // ruwe antwoord-rijen van de huidige speler
  _byDate: null,      // afgeleide samenvatting per dag (YYYY-MM-DD → {…})
  _player: null,      // voor wie de gegevens geladen zijn
  _year: 0,           // getoonde maand
  _month: 0,

  MONTHS: ["januari","februari","maart","april","mei","juni","juli",
           "augustus","september","oktober","november","december"],
  WEEKDAYS: ["ma","di","wo","do","vr","za","zo"],

  // Een antwoord dat langer dan 2 min duurde tellen we als 2 min:
  // dan blaast "even weglopen" de oefentijd niet op.
  MAX_ANSWER_MS: 120000,
  // Meer dan 12 min stilte = een nieuwe sessie (de vorige regenboog werd verlaten)
  SESSION_GAP_MS: 12 * 60000,

  _pad(n) { return n < 10 ? "0" + n : "" + n; },

  _dayKey(dateLike) {
    const d = new Date(dateLike);
    return d.getFullYear() + "-" + this._pad(d.getMonth() + 1) + "-" + this._pad(d.getDate());
  },

  // --- cadeautjes-logica (zelfde regels als in main.js, maar op een gems-map) ---
  _rewardsFor(name) {
    return (RB.config.PLAYER_REWARDS && RB.config.PLAYER_REWARDS[name]) || RB.config.REWARDS;
  },
  _consumedBefore(rewards, index, c) {
    let s = 0;
    for (let j = 0; j < index; j++) {
      const n = rewards[j].need;
      if (n && n[c]) s += n[c];
    }
    return s;
  },
  _rewardMet(rewards, r, gems) {
    const i = rewards.indexOf(r);
    if (r.need) {
      for (const c of Object.keys(r.need)) {
        const avail = Math.max(0, (gems[c] || 0) - this._consumedBefore(rewards, i, c));
        if (avail < r.need[c]) return false;
      }
    }
    return true;
  },
  _rewardsReached(rewards, gems) {
    let n = 0;
    for (const r of rewards) {
      if (this._rewardMet(rewards, r, gems)) n++;
      else break;
    }
    return n;
  },

  // Speelt de antwoorden opnieuw af en bouwt de samenvatting per dag op.
  _reconstruct(rows, player) {
    const cfg = RB.config;
    const need = cfg.DIAMONDS.length;       // 10 goede = een volle regenboog
    const rewards = this._rewardsFor(player);
    const byDate = {};

    // lopende regenboog (er is er altijd maar één tegelijk in het spel)
    let active = { level: null, collected: 0, wrong: 0 };
    let lastTs = 0;
    const gems = {};      // opgebouwde diamanten per niveau (voor de cadeautjes)
    let reached = 0;      // hoeveel cadeautjes al behaald zijn

    const dayOf = (key) =>
      (byDate[key] || (byDate[key] = { diamonds: [], minutesMs: 0, gifts: [], answers: 0, correct: 0 }));

    for (const r of rows) {
      if (!r || !r.created_at) continue;
      const ts = new Date(r.created_at).getTime();
      const day = dayOf(this._dayKey(r.created_at));
      day.answers++;
      day.minutesMs += Math.min(this.MAX_ANSWER_MS, Math.max(0, r.duration_ms || 0));

      // nieuwe regenboog bij een ander niveau of na een lange pauze
      if (active.level !== r.level || (lastTs && ts - lastTs > this.SESSION_GAP_MS)) {
        active = { level: r.level, collected: 0, wrong: 0 };
      }
      lastTs = ts;

      if (r.is_correct) {
        day.correct++;
        active.collected++;
        if (active.collected >= need) {
          // een volle regenboog → een diamant van dit niveau
          const lg = cfg.LEVEL_GEM[active.level] || { color: "#F3C233" };
          day.diamonds.push({ level: active.level, color: lg.color, shiny: !!lg.shiny });
          gems[active.level] = (gems[active.level] || 0) + 1;
          active.collected = 0;
          active.wrong = 0;
          // net genoeg voor een (of meer) cadeautje(s)?
          const now = this._rewardsReached(rewards, gems);
          while (reached < now) {
            const gift = rewards[reached];
            day.gifts.push({ name: gift.name, art: gift.art });
            reached++;
          }
        }
      } else {
        active.wrong++;
        if (active.wrong >= cfg.MAX_WRONG) { active.collected = 0; active.wrong = 0; } // regenboog opnieuw
      }
    }
    return byDate;
  },

  // Nauwkeurige sessies (start/eind, diamant, cadeautje) overschrijven de reconstructie.
  // Per dag waarvoor er sessies zijn, geldt de sessie-data als de waarheid.
  _applySessions(byDate, sessions) {
    const cfg = RB.config;
    const days = {};
    for (const s of sessions) {
      if (!s || !s.started_at) continue;
      const key = this._dayKey(s.started_at);
      const d = days[key] || (days[key] = { diamonds: [], minutesMs: 0, gifts: [], answers: 0, correct: 0 });
      d.minutesMs += Math.max(0, s.duration_ms || 0);
      d.correct += s.correct || 0;
      d.answers += (s.correct || 0) + (s.wrong || 0);
      if (s.completed) {
        const lg = cfg.LEVEL_GEM[s.level] || { color: "#F3C233" };
        d.diamonds.push({ level: s.level, color: lg.color, shiny: !!lg.shiny });
      }
      if (s.gift_name) d.gifts.push({ name: s.gift_name, art: s.gift_art });
    }
    for (const key of Object.keys(days)) byDate[key] = days[key]; // sessie is leidend voor die dag
  },

  // Opent de kalender in een container voor een speler (haalt data op indien nodig).
  async render(container, player) {
    const today = new Date();
    this._year = today.getFullYear();
    this._month = today.getMonth();

    if (!RB.cloud || !RB.cloud.user) {
      container.innerHTML = `<p class="cal-empty">Log in om je kalender te zien.</p>`;
      return;
    }

    // altijd vers ophalen (klein), maar alleen een "even kijken" tonen als we nog
    // niets van deze speler in beeld hebben — zo flikkert het niet bij heropenen.
    if (this._player !== player || !this._byDate) {
      container.innerHTML = `<p class="cal-empty">Even kijken…</p>`;
      this._byDate = null;
    }
    try {
      this._rows = await RB.cloud.fetchAnswers(player);
      this._byDate = this._reconstruct(this._rows, player);
      // Nauwkeurige sessies (rainbow_sessions) overschrijven de reconstructie per dag.
      // Bestaat die tabel nog niet, dan blijft alleen de (benaderende) reconstructie over.
      try {
        const sessions = await RB.cloud.fetchSessions(player);
        if (sessions && sessions.length) this._applySessions(this._byDate, sessions);
      } catch (e2) { /* tabel nog niet aangemaakt → reconstructie volstaat */ }
      this._player = player;
    } catch (e) {
      if (!this._byDate) {
        container.innerHTML = `<p class="cal-empty">De kalender kan even niet geladen worden.</p>`;
        return;
      }
      // val terug op wat er al stond bij een netwerkhikje
    }
    this._draw(container);
  },

  _monthStats(year, month) {
    let diamonds = 0, minutesMs = 0, gifts = 0, days = 0;
    const prefix = year + "-" + this._pad(month + 1) + "-";
    for (const key of Object.keys(this._byDate)) {
      if (!key.startsWith(prefix)) continue;
      const d = this._byDate[key];
      diamonds += d.diamonds.length;
      minutesMs += d.minutesMs;
      gifts += d.gifts.length;
      if (d.answers > 0) days++;
    }
    return { diamonds, minutes: Math.round(minutesMs / 60000), gifts, days };
  },

  _draw(container) {
    const year = this._year, month = this._month;
    const today = new Date();
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
    const first = new Date(year, month, 1);
    const lead = (first.getDay() + 6) % 7;          // maandag-eerst
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const chev = (d) =>
      `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
            stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
         <path d="${d < 0 ? "M15 5 L8 12 L15 19" : "M9 5 L16 12 L9 19"}"/></svg>`;

    let cells = "";
    for (let i = 0; i < lead; i++) cells += `<div class="cal-cell blank"></div>`;

    for (let day = 1; day <= daysInMonth; day++) {
      const key = year + "-" + this._pad(month + 1) + "-" + this._pad(day);
      const info = this._byDate[key];
      const isToday = isCurrentMonth && day === today.getDate();
      const has = info && info.answers > 0;

      // Compacte cel (kan maar ~40px zijn): dagnummer in de hoek, cadeautje in de
      // andere hoek, en in het midden één diamant met een telling (×N). De minuten
      // staan bewust niet in de cel maar in het detail eronder + de maand-samenvatting,
      // anders overlapt de tekst op smalle schermen.
      let inner = `<span class="cal-daynum">${day}</span>`;
      if (has) {
        if (info.gifts.length) inner += `<span class="cal-gift">${RB.art.treat(info.gifts[0].art)}</span>`;
        const n = info.diamonds.length;
        if (n) {
          const g = info.diamonds[n - 1]; // laatst verdiende kleur als voorbeeld
          inner += `<span class="cal-gems"><span class="cal-gem">${RB.gems.svg(g.color, false)}</span>${
            n > 1 ? `<span class="cal-x">×${n}</span>` : ""
          }</span>`;
        }
      }

      cells += has
        ? `<button class="cal-cell active${isToday ? " today" : ""}" data-date="${key}">${inner}</button>`
        : `<div class="cal-cell${isToday ? " today" : ""}">${inner}</div>`;
    }

    const stats = this._monthStats(year, month);
    let summary;
    if (stats.days === 0) {
      summary = `<p class="cal-summary quiet">Nog niets deze maand — speel een regenboog om diamanten te verzamelen ✨</p>`;
    } else {
      const dPart = `${stats.diamonds} ${stats.diamonds === 1 ? "diamant" : "diamanten"}`;
      const mPart = stats.minutes > 0 ? ` in ${stats.minutes} ${stats.minutes === 1 ? "minuut" : "minuten"} oefenen` : "";
      const gPart = stats.gifts > 0 ? ` · ${stats.gifts} ${stats.gifts === 1 ? "cadeautje" : "cadeautjes"} 🎁` : "";
      summary = `<p class="cal-summary">Deze maand: <b>${dPart}</b>${mPart}${gPart}</p>`;
    }

    container.innerHTML = `
      <div class="cal-head">
        <button class="cal-nav" data-dir="-1" aria-label="Vorige maand">${chev(-1)}</button>
        <div class="cal-month">${this.MONTHS[month]} ${year}</div>
        <button class="cal-nav" data-dir="1" aria-label="Volgende maand" ${isCurrentMonth ? "disabled" : ""}>${chev(1)}</button>
      </div>
      <div class="cal-weekdays">${this.WEEKDAYS.map((w) => `<span>${w}</span>`).join("")}</div>
      <div class="cal-grid">${cells}</div>
      ${summary}
      <div id="cal-detail" class="cal-detail"></div>`;

    // maand vooruit/achteruit
    container.querySelectorAll(".cal-nav").forEach((b) =>
      b.addEventListener("click", () => {
        if (b.disabled) return;
        const dir = Number(b.getAttribute("data-dir"));
        let m = this._month + dir, y = this._year;
        if (m < 0) { m = 11; y--; }
        if (m > 11) { m = 0; y++; }
        this._year = y; this._month = m;
        this._draw(container);
      })
    );

    // tik op een dag → een vrolijk regeltje eronder
    container.querySelectorAll(".cal-cell.active").forEach((c) =>
      c.addEventListener("click", () => this._showDay(container, c.getAttribute("data-date"), c))
    );
  },

  _showDay(container, key, cell) {
    const info = this._byDate[key];
    const box = container.querySelector("#cal-detail");
    if (!info || !box) return;
    container.querySelectorAll(".cal-cell.picked").forEach((c) => c.classList.remove("picked"));
    cell.classList.add("picked");

    const [y, m, d] = key.split("-").map(Number);
    const dateText = `${d} ${this.MONTHS[m - 1]}`;
    const mins = Math.round(info.minutesMs / 60000);

    const gemsHTML = info.diamonds.length
      ? `<div class="cal-detail-gems">${info.diamonds
          .map((g) => `<span class="cal-gem big">${RB.gems.svg(g.color, false)}</span>`).join("")}</div>`
      : "";
    const parts = [];
    if (info.diamonds.length) parts.push(`<b>${info.diamonds.length}</b> ${info.diamonds.length === 1 ? "diamant" : "diamanten"}`);
    if (mins > 0) parts.push(`<b>${mins}</b> ${mins === 1 ? "minuut" : "minuten"} geoefend`);
    if (!parts.length) parts.push("lekker geoefend");

    const giftsHTML = info.gifts.length
      ? `<div class="cal-detail-gifts">${info.gifts
          .map((g) => `<span class="cal-detail-gift"><span class="cal-gift">${RB.art.treat(g.art)}</span>${g.name}</span>`)
          .join("")}</div>`
      : "";

    box.innerHTML = `
      <div class="cal-detail-head">${dateText}</div>
      ${gemsHTML}
      <p class="cal-detail-line">${parts.join(" · ")}</p>
      ${giftsHTML}`;
    box.classList.add("show");
  },
};
