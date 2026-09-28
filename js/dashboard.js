/* ============================================================
   dashboard.js — "Hoe gaat het?" (alleen voor mama & papa)

   Analyse-scherm over de gelogde antwoorden (rainbow_answers):
   hoeveel er geoefend wordt, hoeveel er lukt, hoe lang ze over een
   oefening doen en of dat vlotter wordt in de tijd.

   BELANGRIJK: dit scherm is NIET voor de kinderen. Hier mag wél een
   percentage, een fout en een grafiek staan — het spel zelf blijft
   vrij van score, fouten en tijdsdruk (zie README/faalangst-opzet).

   Bronnen:
   - antwoorden  → RB.cloud.fetchAnswers(player)  (elk antwoord, juist én fout)
   - diamanten/minuten per dag → RB.calendar._reconstruct(...)  zodat de cijfers
     hier exact overeenkomen met wat de kalender in de schatkist toont.

   Meten van tijd — twee verschillende dingen:
   - "oplostijd" = duration_ms van een JUIST antwoord. duration_ms loopt vanaf het
     moment dat de vraag verschijnt, dus bij een juist antwoord is dat precies de
     tijd die de vraag gekost heeft (inclusief eventuele mistikken ervoor).
     Daarom rekenen we tempo altijd op de juiste antwoorden.
   - "geoefende tijd" = som van alle duration_ms (afgetopt op 2 min), net als de
     kalender. Dat telt bij een mistik een klein beetje dubbel, maar het houdt de
     minuten hier gelijk aan die in de schatkist.
   ============================================================ */

window.RB = window.RB || {};

RB.dashboard = {
  // ---- instellingen ----
  MAX_ANSWER_MS: 120000,   // een antwoord telt voor maximaal 2 min (even weglopen)
  MIN_LEVEL_ROWS: 6,       // minder juiste antwoorden → te weinig om iets over te zeggen
  MIN_SPLIT_ROWS: 12,      // minder → geen "eerste helft vs. tweede helft"-vergelijking
  MIN_EX_TRIES: 3,         // een som moet minstens 3× gemaakt zijn voor de moeilijk-lijst
  DAY_MS: 86400000,

  PERIODS: [
    { id: 7,  label: "7 dagen" },
    { id: 30, label: "30 dagen" },
    { id: 90, label: "3 maanden" },
    { id: 0,  label: "Alles" },
  ],

  // Datakleuren (gevalideerd tegen de lichte kaart-achtergrond):
  // één blauwe tint doet al het "hoeveel"-werk, een lichtere stap van dezelfde
  // kleur staat voor "eerder", en een warme schaal voor "hoe moeilijk".
  COL: {
    blue: "#2C66B0",
    blueSoft: "#7FA6D2",
    grid: "#E7E2E9",
    hard: ["#E8A08A", "#DE7551", "#C64A24"],
  },

  MONTHS_SHORT: ["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"],

  // ---- toestand ----
  _cache: {},      // speler → opgehaalde antwoordrijen
  _rows: [],       // rijen van de getoonde speler (oplopend in tijd)
  _byDate: null,   // dag → {diamonds, minutesMs, gifts, answers, correct} (van de kalender)
  _player: null,
  _period: 30,
  _container: null,
  _resizeWired: false,

  /* ============================================================
     kleine helpers
     ============================================================ */
  _pad(n) { return n < 10 ? "0" + n : "" + n; },

  _dayKey(dateLike) {
    const d = new Date(dateLike);
    return d.getFullYear() + "-" + this._pad(d.getMonth() + 1) + "-" + this._pad(d.getDate());
  },

  _esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
    );
  },

  _median(values) {
    if (!values.length) return null;
    const a = values.slice().sort((x, y) => x - y);
    const m = a.length >> 1;
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  },

  _levelName(level) {
    const lv = RB.config.LEVELS.find((l) => l.id === Number(level));
    return lv ? lv.name : "Oefening " + level;
  },

  // 4,2 s / 12 s — komma als decimaalteken (Nederlands)
  _secs(ms) {
    if (ms == null) return "—";
    const s = ms / 1000;
    return (s < 10 ? s.toFixed(1).replace(".", ",") : Math.round(s)) + " s";
  },

  // 25 min / 1 u 20 min
  _dur(ms) {
    const min = Math.round((ms || 0) / 60000);
    if (min < 60) return min + " min";
    return Math.floor(min / 60) + " u " + this._pad(min % 60) + " min";
  },

  _pct(part, whole) {
    if (!whole) return null;
    return Math.round((part / whole) * 100);
  },

  _dateLabel(ts) {
    const d = new Date(ts);
    return d.getDate() + " " + this.MONTHS_SHORT[d.getMonth()];
  },

  /* ============================================================
     ophalen + periode bepalen
     ============================================================ */
  async _load(player, force) {
    if (!force && this._cache[player]) {
      this._rows = this._cache[player];
    } else {
      const rows = await RB.cloud.fetchAnswers(player);
      this._cache[player] = rows;
      this._rows = rows;
    }
    // dezelfde reconstructie als de kalender → identieke diamanten/minuten per dag
    this._byDate = RB.calendar._reconstruct(this._rows, player);
    this._player = player;
  },

  // Begin en eind van de gekozen periode (hele dagen, lokale tijd)
  _range() {
    const to = new Date();
    to.setHours(23, 59, 59, 999);
    let from = new Date();
    if (this._period > 0) {
      from.setDate(from.getDate() - (this._period - 1));
    } else if (this._rows.length) {
      from = new Date(this._rows[0].created_at);
    }
    from.setHours(0, 0, 0, 0);
    return { from: from.getTime(), to: to.getTime() };
  },

  _rowsBetween(from, to) {
    return this._rows.filter((r) => {
      if (!r || !r.created_at) return false;
      const t = new Date(r.created_at).getTime();
      return t >= from && t <= to;
    });
  },

  /* ============================================================
     cijfers berekenen
     ============================================================ */
  // Alles wat in de bovenste tegels staat, voor één periode
  _stats(from, to) {
    const rows = this._rowsBetween(from, to);
    const correct = rows.filter((r) => r.is_correct);
    const solveTimes = correct.map((r) => Math.min(this.MAX_ANSWER_MS, Math.max(0, r.duration_ms || 0)));

    // minuten, diamanten en cadeautjes komen uit de kalender-reconstructie.
    // Dag per dag met setDate(): bij zomer-/wintertijd is een dag geen 24 uur,
    // dus optellen met 86400000 zou een dag kunnen overslaan of dubbel tellen.
    let minutesMs = 0, diamonds = 0, gifts = 0, days = 0;
    const cur = new Date(from);
    while (cur.getTime() <= to) {
      const d = this._byDate[this._dayKey(cur)];
      if (d && d.answers) {
        minutesMs += d.minutesMs;
        diamonds += d.diamonds.length;
        gifts += d.gifts.length;
        days++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    return {
      answers: rows.length,
      correct: correct.length,
      pct: this._pct(correct.length, rows.length),
      solve: this._median(solveTimes),
      minutesMs,
      diamonds,
      gifts,
      days,
      perDay: days ? rows.length / days : 0,
    };
  },

  // Vanaf ~5 weken worden de puntjes per dag te dicht op elkaar → dan per week.
  _perWeek(from, to) {
    return Math.round((to - from) / this.DAY_MS) + 1 > 35;
  },

  // Emmertjes over de tijdlijn: per dag bij een korte periode, per week bij een lange.
  _buckets(from, to) {
    const perWeek = this._perWeek(from, to);
    const list = [];

    let start = new Date(from);
    start.setHours(0, 0, 0, 0);
    if (perWeek) start.setDate(start.getDate() - ((start.getDay() + 6) % 7)); // naar maandag

    while (start.getTime() <= to) {
      const end = new Date(start);
      end.setDate(end.getDate() + (perWeek ? 7 : 1));
      list.push({ from: start.getTime(), to: end.getTime() - 1, rows: [] });
      start = end;
    }

    for (const r of this._rowsBetween(from, to)) {
      const t = new Date(r.created_at).getTime();
      // emmertjes zijn even breed, dus de index is gewoon te rekenen
      const i = list.findIndex((b) => t >= b.from && t <= b.to);
      if (i >= 0) list[i].rows.push(r);
    }

    return list.map((b) => {
      const ok = b.rows.filter((r) => r.is_correct);
      return {
        from: b.from,
        label: (perWeek ? "week van " : "") + this._dateLabel(b.from),
        answers: b.rows.length,
        correct: ok.length,
        pct: this._pct(ok.length, b.rows.length),
        solve: this._median(ok.map((r) => Math.min(this.MAX_ANSWER_MS, r.duration_ms || 0))),
      };
    });
  },

  // Per oefening (niveau): hoeveel, hoe goed, hoe vlot, en of het vlotter wordt.
  // "eerder" en "nu" = de eerste en de tweede helft van de juiste antwoorden in
  // deze periode — zo vergelijken we altijd evenveel oefeningen met elkaar.
  _byLevel(from, to) {
    const groups = {};
    for (const r of this._rowsBetween(from, to)) {
      const key = Number(r.level);
      (groups[key] || (groups[key] = [])).push(r);
    }

    const out = [];
    for (const key of Object.keys(groups)) {
      const rows = groups[key].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      const ok = rows.filter((r) => r.is_correct);
      const times = ok.map((r) => Math.min(this.MAX_ANSWER_MS, Math.max(0, r.duration_ms || 0)));
      const item = {
        level: Number(key),
        name: this._levelName(key),
        answers: rows.length,
        correct: ok.length,
        pct: this._pct(ok.length, rows.length),
        solve: this._median(times),
        before: null,
        after: null,
        delta: null,
      };
      if (times.length >= this.MIN_SPLIT_ROWS) {
        const half = Math.floor(times.length / 2);
        item.before = this._median(times.slice(0, half));
        item.after = this._median(times.slice(times.length - half));
        item.delta = item.after - item.before;
      }
      out.push(item);
    }
    return out.sort((a, b) => b.answers - a.answers);
  },

  // Losse sommen waar het vaakst op mis wordt getikt (minstens een paar keer gemaakt)
  _hardest(from, to) {
    const map = {};
    for (const r of this._rowsBetween(from, to)) {
      const key = r.exercise || "";
      if (!key) continue;
      const e = map[key] || (map[key] = { key, level: Number(r.level), tries: 0, wrong: 0, times: [] });
      e.tries++;
      if (!r.is_correct) e.wrong++;
      else e.times.push(Math.min(this.MAX_ANSWER_MS, Math.max(0, r.duration_ms || 0)));
    }
    return Object.values(map)
      .filter((e) => e.tries >= this.MIN_EX_TRIES && e.wrong > 0)
      .map((e) => ({ ...e, ratio: e.wrong / e.tries, solve: this._median(e.times) }))
      .sort((a, b) => b.ratio - a.ratio || b.tries - a.tries)
      .slice(0, 8);
  },

  /* ============================================================
     tekenen — het scherm
     ============================================================ */
  async render(container, player) {
    this._container = container;
    this._wireResize();

    if (!RB.cloud || !RB.cloud.user) {
      container.innerHTML = `<p class="dash-empty">Log in om de voortgang te bekijken.</p>`;
      return;
    }
    container.innerHTML = `<p class="dash-empty">Even rekenen…</p>`;
    try {
      await this._load(player, true);
    } catch (e) {
      container.innerHTML = `<p class="dash-empty">De gegevens kunnen even niet geladen worden.</p>`;
      return;
    }
    this._draw();
  },

  // van speler wisselen (gebruikt de cache, dus geen wachttijd)
  async _switchPlayer(name) {
    this._container.querySelectorAll(".dash-chip").forEach((b) =>
      b.classList.toggle("selected", b.getAttribute("data-player") === name)
    );
    try {
      await this._load(name, false);
    } catch (e) {
      return;
    }
    this._draw();
  },

  _draw() {
    const c = this._container;
    if (!c) return;
    const { from, to } = this._range();
    const stats = this._stats(from, to);

    // vorige even lange periode, om "meer/minder dan daarvoor" te kunnen tonen
    let prev = null;
    if (this._period > 0) {
      const start = new Date(from);
      start.setDate(start.getDate() - this._period); // met setDate, want een dag is
      const p = this._stats(start.getTime(), from - 1); // bij tijdswissel geen 24 uur
      if (p.answers > 0) prev = p;
    }

    const per = this._perWeek(from, to) ? "week" : "dag";
    c.innerHTML = `
      ${this._filtersHTML()}
      ${stats.answers === 0 ? this._emptyHTML() : `
        ${this._tilesHTML(stats, prev)}
        <div class="dash-charts">
          ${this._card("chart-solve", "Hoe vlot gaat een oefening?",
             `Middelste oplostijd van een juist antwoord, per ${per} — lager is vlotter.`)}
          ${this._card("chart-pct", "Hoeveel lukt er?",
             `Aandeel juiste antwoorden per ${per}.`)}
          ${this._card("chart-volume", "Hoeveel is er geoefend?",
             `Aantal gemaakte oefeningen per ${per}.`)}
          ${this._card("chart-progress", "Wordt het vlotter per oefening?",
             "De eerste helft van deze periode naast de tweede helft.")}
          ${this._card("chart-hard", "Waar gaat het nog moeilijk?",
             "Sommen waar het vaakst nog een mistik op komt.")}
          ${this._card("table-levels", "Alles op een rij", "")}
        </div>`}
    `;

    this._wireFilters();
    if (stats.answers === 0) return;

    const buckets = this._buckets(from, to);
    const levels = this._byLevel(from, to);

    this._drawSolve(c.querySelector("#chart-solve"), buckets);
    this._drawPct(c.querySelector("#chart-pct"), buckets);
    this._drawVolume(c.querySelector("#chart-volume"), buckets);
    this._drawProgress(c.querySelector("#chart-progress"), levels);
    this._drawHardest(c.querySelector("#chart-hard"), this._hardest(from, to));
    this._drawTable(c.querySelector("#table-levels"), levels);
  },

  _card(id, title, sub) {
    return `<section class="dash-panel">
      <h3 class="dash-panel-title">${title}</h3>
      ${sub ? `<p class="dash-panel-sub">${sub}</p>` : ""}
      <div class="dash-panel-body" id="${id}"></div>
    </section>`;
  },

  _emptyHTML() {
    return `<p class="dash-empty">Nog geen oefeningen in deze periode. Kies een langere periode of een andere speler.</p>`;
  },

  /* ---------- filters (speler + periode), één rij boven alles ---------- */
  _filtersHTML() {
    const players = RB.config.PLAYERS.filter((n) => RB.config.PLAYER_LEVELS[n]) // enkel de kinderen
      .concat(RB.config.PLAYERS.filter((n) => !RB.config.PLAYER_LEVELS[n]));
    const chips = players
      .map(
        (n) =>
          `<button class="dash-chip${n === this._player ? " selected" : ""}" data-player="${this._esc(n)}">${this._esc(n)}</button>`
      )
      .join("");
    const periods = this.PERIODS.map(
      (p) =>
        `<button class="dash-seg${p.id === this._period ? " selected" : ""}" data-period="${p.id}">${p.label}</button>`
    ).join("");
    return `<div class="dash-filters">
      <div class="dash-filter-group">${chips}</div>
      <div class="dash-filter-group segs">${periods}</div>
    </div>`;
  },

  _wireFilters() {
    const c = this._container;
    c.querySelectorAll(".dash-chip").forEach((b) =>
      b.addEventListener("click", () => this._switchPlayer(b.getAttribute("data-player")))
    );
    c.querySelectorAll(".dash-seg").forEach((b) =>
      b.addEventListener("click", () => {
        this._period = Number(b.getAttribute("data-period"));
        this._draw();
      })
    );
  },

  /* ---------- de tegels bovenaan ---------- */
  // delta: goodUp = of "meer" beter is. Nooit alleen kleur: er staat altijd een pijl bij.
  _delta(now, before, goodUp, fmt) {
    if (before == null || now == null || !before) return "";
    const diff = now - before;
    if (!diff) return `<span class="tile-delta same">gelijk aan de vorige periode</span>`;
    const better = goodUp ? diff > 0 : diff < 0;
    const arrow = diff > 0 ? "▲" : "▼";
    // pijl = richting, kleur = of dat goed nieuws is; nooit kleur alleen
    return `<span class="tile-delta ${better ? "better" : "worse"}">${arrow} ${fmt(Math.abs(diff))} ${
      diff > 0 ? "meer" : "minder"
    } dan de vorige periode</span>`;
  },

  _tilesHTML(s, prev) {
    const tile = (label, value, sub, delta) => `
      <div class="dash-tile">
        <span class="tile-label">${label}</span>
        <span class="tile-value">${value}</span>
        <span class="tile-sub">${sub || ""}</span>
        ${delta || ""}
      </div>`;

    const pctFmt = (v) => Math.round(v) + "%";
    const nFmt = (v) => Math.round(v) + "";
    const secFmt = (v) => this._secs(v);

    return `<div class="dash-tiles">
      ${tile("Oefeningen gemaakt", s.answers, `${s.days} ${s.days === 1 ? "dag" : "dagen"} geoefend`,
             prev ? this._delta(s.answers, prev.answers, true, nFmt) : "")}
      ${tile("Juist getikt", s.pct == null ? "—" : s.pct + "%", `${s.correct} van ${s.answers} antwoorden`,
             prev ? this._delta(s.pct, prev.pct, true, pctFmt) : "")}
      ${tile("Tijd per oefening", this._secs(s.solve), "middelste oplostijd",
             prev ? this._delta(s.solve, prev.solve, false, secFmt) : "")}
      ${tile("Geoefend", this._dur(s.minutesMs), `± ${Math.round(s.perDay)} oefeningen per speeldag`, "")}
      ${tile("Diamanten", s.diamonds,
             s.gifts ? `en ${s.gifts} ${s.gifts === 1 ? "cadeautje" : "cadeautjes"}` : "volle regenbogen", "")}
    </div>`;
  },

  /* ============================================================
     grafiekjes — met de hand getekende SVG, geen bibliotheken
     ============================================================ */
  _geom(el, height) {
    const W = Math.max(260, el.clientWidth || 320);
    return { W, H: height, padL: 42, padR: 16, padT: 12, padB: 28 };
  },

  // Nette y-waarden (0 / 5 / 10 …) voor de assen.
  // minStep=1 bij tellingen, anders krijg je halve oefeningen op de as.
  // De laatste tik ligt altijd op of boven het maximum, zodat geen enkel punt
  // boven de grafiek uitsteekt.
  _ticks(max, count, minStep) {
    const raw = (max || 1) / count;
    const mag = Math.pow(10, Math.floor(Math.log10(raw || 1)));
    let step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) || mag * 10;
    step = Math.max(step, minStep || 0);
    const ticks = [];
    for (let v = 0; ticks.length < 12; v += step) {
      ticks.push(v);
      if (v >= max - 1e-9) break;
    }
    if (ticks.length < 2) ticks.push(step); // een as met alleen een nul is geen as
    return ticks;
  },

  // Gedeelde tekening voor een lijn- of kolomgrafiek over de tijdlijn.
  // points = [{i, v, label, tip}] met i = index van het emmertje.
  _plot(el, opts) {
    const g = this._geom(el, opts.height || 190);
    const { W, H, padL, padR, padT, padB } = g;
    const n = Math.max(1, opts.n);
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;
    const ticks = this._ticks(opts.max || 1, 4, opts.minStep || 1);
    const yMax = ticks[ticks.length - 1] || 1;
    const x = (i) => padL + (n === 1 ? innerW / 2 : (innerW * i) / (n - 1));
    const xBand = (i) => padL + (innerW * (i + 0.5)) / n;
    const y = (v) => padT + innerH - (v / yMax) * innerH;

    // ---- assen ----
    let svg = "";
    for (const t of ticks) {
      svg += `<line x1="${padL}" x2="${W - padR}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}"
              stroke="${this.COL.grid}" stroke-width="1"/>`;
      svg += `<text class="ax" x="${padL - 8}" y="${(y(t) + 4).toFixed(1)}" text-anchor="end">${opts.yTick(t)}</text>`;
    }

    // ---- x-labels: begin, eind en een paar ertussen ----
    const every = Math.max(1, Math.ceil(n / 5));
    for (let i = 0; i < n; i += every) {
      const px = opts.band ? xBand(i) : x(i);
      svg += `<text class="ax" x="${px.toFixed(1)}" y="${H - 8}" text-anchor="middle">${this._esc(
        opts.xLabel(i)
      )}</text>`;
    }

    svg += opts.draw({ x, xBand, y, innerW, innerH, padL, padT, W, H, padR, padB, n });

    el.innerHTML = `<div class="chart-wrap">
        <svg class="chart" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"
             aria-label="${this._esc(opts.aria || "")}">${svg}</svg>
        <div class="chart-tip" hidden></div>
      </div>`;

    this._wireHover(el, { ...g, n, x: opts.band ? xBand : x, tips: opts.tips });
    return g;
  },

  // Eén hover-laag voor alle tijdlijn-grafieken: het dichtstbijzijnde emmertje wint,
  // dus je hoeft niet precies op een puntje te mikken.
  _wireHover(el, cfg) {
    const wrap = el.querySelector(".chart-wrap");
    const svg = el.querySelector("svg.chart");
    const tip = el.querySelector(".chart-tip");
    if (!wrap || !svg || !tip || !cfg.tips) return;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("class", "crosshair");
    line.setAttribute("y1", cfg.padT);
    line.setAttribute("y2", cfg.H - cfg.padB);
    line.setAttribute("visibility", "hidden");
    svg.appendChild(line);

    const show = (clientX) => {
      const box = svg.getBoundingClientRect();
      const scale = cfg.W / box.width;
      const px = (clientX - box.left) * scale;
      let best = 0, bestD = Infinity;
      for (let i = 0; i < cfg.n; i++) {
        const d = Math.abs(cfg.x(i) - px);
        if (d < bestD) { bestD = d; best = i; }
      }
      const info = cfg.tips[best];
      if (!info) return;
      line.setAttribute("x1", cfg.x(best));
      line.setAttribute("x2", cfg.x(best));
      line.setAttribute("visibility", "visible");
      tip.textContent = "";
      const head = document.createElement("b");
      head.textContent = info.value;
      const sub = document.createElement("span");
      sub.textContent = info.label;
      tip.appendChild(head);
      tip.appendChild(sub);
      tip.hidden = false;
      const left = (cfg.x(best) / cfg.W) * box.width;
      tip.style.left = Math.max(4, Math.min(box.width - 4, left)) + "px";
    };
    const hide = () => { tip.hidden = true; line.setAttribute("visibility", "hidden"); };

    wrap.addEventListener("pointermove", (e) => show(e.clientX));
    wrap.addEventListener("pointerleave", hide);
    wrap.addEventListener("pointerdown", (e) => show(e.clientX));
  },

  // Lijn met puntjes; emmertjes zonder oefeningen krijgen geen punt (geen nul-dip)
  _linePath(pts) {
    let d = "", pen = false;
    for (const p of pts) {
      d += (pen ? " L" : " M") + p.px.toFixed(1) + " " + p.py.toFixed(1);
      pen = true;
    }
    return d.trim();
  },

  _drawSolve(el, buckets) {
    if (!el) return;
    const vals = buckets.filter((b) => b.solve != null);
    if (vals.length < 2) return this._tooLittle(el);
    const max = Math.max(...vals.map((b) => b.solve)) / 1000;

    this._plot(el, {
      n: buckets.length,
      max,
      aria: "Middelste oplostijd per periode",
      yTick: (t) => Math.round(t) + "s",
      xLabel: (i) => this._dateLabel(buckets[i].from),
      tips: buckets.map((b) => ({
        value: b.solve == null ? "geen oefeningen" : this._secs(b.solve),
        label: b.label,
      })),
      draw: ({ x, y }) => {
        const pts = buckets
          .map((b, i) => (b.solve == null ? null : { px: x(i), py: y(b.solve / 1000), b }))
          .filter(Boolean);
        let s = `<path d="${this._linePath(pts)}" fill="none" stroke="${this.COL.blue}"
                   stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
        for (const p of pts) {
          s += `<circle cx="${p.px.toFixed(1)}" cy="${p.py.toFixed(1)}" r="4"
                 fill="${this.COL.blue}" stroke="#fff" stroke-width="2"/>`;
        }
        // alleen het laatste punt krijgt een cijfer erbij (labels werken omdat ze schaars zijn)
        const last = pts[pts.length - 1];
        s += `<text class="pt-label" x="${(last.px - 8).toFixed(1)}" y="${(last.py - 12).toFixed(1)}"
                text-anchor="end">${this._secs(last.b.solve)}</text>`;
        return s;
      },
    });
    this._trendNote(el, buckets.map((b) => b.solve), {
      goodUp: false, noise: 200, up: "trager", down: "vlotter", fmt: (d) => this._secs(d),
    });
  },

  _drawPct(el, buckets) {
    if (!el) return;
    const vals = buckets.filter((b) => b.pct != null);
    if (vals.length < 2) return this._tooLittle(el);

    this._plot(el, {
      n: buckets.length,
      max: 100,
      aria: "Aandeel juiste antwoorden per periode",
      yTick: (t) => Math.round(t) + "%",
      xLabel: (i) => this._dateLabel(buckets[i].from),
      tips: buckets.map((b) => ({
        value: b.pct == null ? "geen oefeningen" : b.pct + "% juist",
        label: b.label + (b.answers ? ` · ${b.correct}/${b.answers}` : ""),
      })),
      draw: ({ x, y }) => {
        const pts = buckets
          .map((b, i) => (b.pct == null ? null : { px: x(i), py: y(b.pct), b }))
          .filter(Boolean);
        let s = `<path d="${this._linePath(pts)}" fill="none" stroke="${this.COL.blue}"
                   stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
        for (const p of pts) {
          s += `<circle cx="${p.px.toFixed(1)}" cy="${p.py.toFixed(1)}" r="4"
                 fill="${this.COL.blue}" stroke="#fff" stroke-width="2"/>`;
        }
        const last = pts[pts.length - 1];
        s += `<text class="pt-label" x="${(last.px - 8).toFixed(1)}" y="${(last.py - 12).toFixed(1)}"
                text-anchor="end">${last.b.pct}%</text>`;
        return s;
      },
    });
    this._trendNote(el, buckets.map((b) => b.pct), {
      goodUp: true, noise: 1, up: "meer juist", down: "minder juist",
      fmt: (d) => Math.round(d) + "%",
    });
  },

  _drawVolume(el, buckets) {
    if (!el) return;
    const max = Math.max(...buckets.map((b) => b.answers), 1);

    this._plot(el, {
      n: buckets.length,
      max,
      band: true,
      height: 160,
      aria: "Aantal gemaakte oefeningen per periode",
      yTick: (t) => Math.round(t),
      xLabel: (i) => this._dateLabel(buckets[i].from),
      tips: buckets.map((b) => ({
        value: b.answers + (b.answers === 1 ? " oefening" : " oefeningen"),
        label: b.label,
      })),
      draw: ({ xBand, y, innerW, padT, innerH, n }) => {
        // maximaal 24 px dik, met 2 px lucht tussen de kolommen;
        // bovenkant afgerond (4 px), onderkant vierkant op de nullijn
        const w = Math.max(3, Math.min(24, innerW / n - 2));
        const base = padT + innerH;
        let s = "";
        for (let i = 0; i < n; i++) {
          const b = buckets[i];
          if (!b.answers) continue;
          const top = y(b.answers);
          const h = Math.max(2, base - top);
          const r = Math.min(4, w / 2, h);
          const left = xBand(i) - w / 2;
          const d = [
            "M" + left.toFixed(1) + " " + base.toFixed(1),
            "V" + (top + r).toFixed(1),
            "a" + r + " " + r + " 0 0 1 " + r + " " + -r,
            "h" + (w - 2 * r).toFixed(1),
            "a" + r + " " + r + " 0 0 1 " + r + " " + r,
            "V" + base.toFixed(1),
            "z",
          ].join(" ");
          s += `<path d="${d}" fill="${this.COL.blue}"/>`;
        }
        return s;
      },
    });
  },

  // Korte zin onder een lijngrafiek: is het beter geworden binnen deze periode?
  // (eerste helft vs. tweede helft van de emmertjes met gegevens — robuuster dan
  //  het eerste en het laatste punt vergelijken)
  // De pijl wijst mee met het cijfer (omhoog = groter), de kleur zegt of dat
  // goed nieuws is; het woord erbij maakt het los van de kleur leesbaar.
  _trendNote(el, series, opts) {
    const vals = series.filter((v) => v != null);
    if (vals.length < 4) return;
    const half = Math.floor(vals.length / 2);
    const a = this._median(vals.slice(0, half));
    const b = this._median(vals.slice(vals.length - half));
    const diff = b - a;
    const p = document.createElement("p");
    p.className = "chart-note";
    if (!diff || Math.abs(diff) < opts.noise) {
      p.textContent = "Ongeveer gelijk gebleven binnen deze periode.";
      p.classList.add("same");
    } else {
      const better = opts.goodUp ? diff > 0 : diff < 0;
      p.classList.add(better ? "better" : "worse");
      p.textContent =
        (diff > 0 ? "▲ " : "▼ ") +
        opts.fmt(Math.abs(diff)) +
        " " +
        (diff > 0 ? opts.up : opts.down) +
        " in de tweede helft van deze periode dan in de eerste.";
    }
    el.appendChild(p);
  },

  /* ---------- vooruitgang per oefening (eerder → nu) ---------- */
  _drawProgress(el, levels) {
    if (!el) return;
    const rows = levels.filter((l) => l.before != null && l.after != null);
    if (!rows.length) {
      el.innerHTML = `<p class="chart-note same">Nog te weinig oefeningen om per oefening te vergelijken — vanaf ${this.MIN_SPLIT_ROWS} juiste antwoorden verschijnt het hier.</p>`;
      return;
    }

    const W = Math.max(260, el.clientWidth || 320);
    const labelW = Math.min(150, Math.max(88, Math.round(W * 0.32)));
    const deltaW = 64;
    const rowH = 34;
    const padR = 10;
    const trackW = Math.max(60, W - labelW - deltaW - padR - 10);
    const max = Math.max(...rows.map((l) => Math.max(l.before, l.after))) / 1000;
    const H = rows.length * rowH + 10;
    const x = (sec) => labelW - 10 + (trackW * sec) / (max * 1.05);
    // een naam die niet past wordt ingekort (de volledige naam blijft in de tabel
    // eronder en in de tooltip staan) — nooit laten overlopen over de grafiek
    const fit = (s) => {
      const maxChars = Math.floor((labelW - 12) / 6.4);
      return s.length > maxChars ? s.slice(0, maxChars - 1) + "…" : s;
    };

    let svg = "";
    rows.forEach((l, i) => {
      const cy = i * rowH + rowH / 2 + 4;
      const x1 = x(l.before / 1000), x2 = x(l.after / 1000);
      svg += `<text class="row-label" x="0" y="${cy + 4}">${this._esc(fit(l.name))}
                <title>${this._esc(l.name)}</title></text>`;
      svg += `<line x1="${labelW - 10}" x2="${labelW - 10 + trackW}" y1="${cy}" y2="${cy}"
               stroke="${this.COL.grid}" stroke-width="1"/>`;
      svg += `<line x1="${x1.toFixed(1)}" x2="${x2.toFixed(1)}" y1="${cy}" y2="${cy}"
               stroke="${this.COL.blueSoft}" stroke-width="2" stroke-linecap="round"/>`;
      // de losse tijden staan niet in de tabel eronder, dus ze hangen hier aan de bolletjes
      svg += `<circle cx="${x1.toFixed(1)}" cy="${cy}" r="5" fill="${this.COL.blueSoft}" stroke="#fff" stroke-width="2">
                <title>eerste helft: ${this._secs(l.before)}</title></circle>`;
      svg += `<circle cx="${x2.toFixed(1)}" cy="${cy}" r="5" fill="${this.COL.blue}" stroke="#fff" stroke-width="2">
                <title>tweede helft: ${this._secs(l.after)}</title></circle>`;
      const cls = l.delta === 0 ? "same" : l.delta < 0 ? "better" : "worse";
      const txt = l.delta === 0 ? "gelijk" : (l.delta < 0 ? "−" : "+") + this._secs(Math.abs(l.delta));
      svg += `<text class="row-delta ${cls}" x="${W - padR}" y="${cy + 4}"
               text-anchor="end">${txt}</text>`;
    });

    el.innerHTML = `
      <div class="chart-legend">
        <span><i class="key soft"></i>eerste helft</span>
        <span><i class="key"></i>tweede helft</span>
        <span class="legend-hint">(oplostijd; naar links = vlotter)</span>
      </div>
      <svg class="chart" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"
           aria-label="Oplostijd per oefening, eerste helft naast tweede helft">${svg}</svg>`;
  },

  /* ---------- waar gaat het moeilijk ---------- */
  _drawHardest(el, items) {
    if (!el) return;
    if (!items.length) {
      el.innerHTML = `<p class="chart-note better">Geen sommen die er echt uitspringen — het gaat overal vlot. 🎉</p>`;
      return;
    }
    const step = (ratio) => (ratio >= 0.5 ? this.COL.hard[2] : ratio >= 0.3 ? this.COL.hard[1] : this.COL.hard[0]);

    el.innerHTML = `<div class="hard-list">${items
      .map((e) => {
        const pct = Math.round(e.ratio * 100);
        return `<div class="hard-row">
          <span class="hard-name">${this._esc(e.key)}</span>
          <span class="hard-track"><span class="hard-fill" style="width:${pct}%;background:${step(e.ratio)}"></span></span>
          <span class="hard-val">${pct}%</span>
          <span class="hard-sub">${e.wrong} van ${e.tries} mis${
            e.solve != null ? " · " + this._secs(e.solve) : ""
          } · ${this._esc(this._levelName(e.level))}</span>
        </div>`;
      })
      .join("")}</div>`;
  },

  /* ---------- de tabel (alles ook zonder grafiek leesbaar) ---------- */
  _drawTable(el, levels) {
    if (!el) return;
    const body = levels
      .map((l) => {
        const d =
          l.delta == null
            ? `<span class="t-quiet">—</span>`
            : `<span class="${l.delta < 0 ? "better" : "worse"}">${l.delta < 0 ? "▼ " : "▲ "}${this._secs(
                Math.abs(l.delta)
              )}</span>`;
        return `<tr>
          <td>${this._esc(l.name)}</td>
          <td class="num">${l.answers}</td>
          <td class="num">${l.pct == null ? "—" : l.pct + "%"}</td>
          <td class="num">${this._secs(l.solve)}</td>
          <td class="num">${d}</td>
        </tr>`;
      })
      .join("");
    el.innerHTML = `<div class="dash-table-wrap">
      <table class="dash-table">
        <thead><tr>
          <th>Oefening</th><th class="num">Aantal</th><th class="num">Juist</th>
          <th class="num">Tijd</th><th class="num">Verschil</th>
        </tr></thead>
        <tbody>${body}</tbody>
      </table>
      <p class="dash-table-foot">"Tijd" = middelste oplostijd. "Verschil" = tweede helft van de periode
        vergeleken met de eerste helft (▼ = vlotter).</p>
    </div>`;
  },

  _tooLittle(el) {
    el.innerHTML = `<p class="chart-note same">Nog te weinig gegevens om een lijn te tekenen. Kies een langere periode.</p>`;
  },

  /* ---------- opnieuw tekenen als het venster van maat verandert ---------- */
  _wireResize() {
    if (this._resizeWired) return;
    this._resizeWired = true;
    let t = null;
    window.addEventListener("resize", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const screen = document.getElementById("dashboard-screen");
        if (screen && screen.classList.contains("active") && this._rows.length) this._draw();
      }, 220);
    });
  },
};
