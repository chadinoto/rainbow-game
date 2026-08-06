/* ============================================================
   cloud.js — inloggen + opslaan/laden via Supabase
   - login met e-mail + wachtwoord (sessie blijft bewaard op het toestel)
   - laadt en bewaart de hele speeltoestand als één rij (per account)
   Werkt offline: zonder internet blijft de lokale kopie gelden.
   ============================================================ */

window.RB = window.RB || {};

RB.cloud = {
  client: null,
  user: null,

  init() {
    try {
      if (window.supabase && RB.SUPABASE && RB.SUPABASE.url) {
        this.client = window.supabase.createClient(RB.SUPABASE.url, RB.SUPABASE.anonKey, {
          auth: { persistSession: true, autoRefreshToken: true },
        });
      }
    } catch (e) {
      this.client = null;
    }
    return this.client;
  },

  available() {
    return !!this.client;
  },

  async currentUser() {
    if (!this.client) return null;
    try {
      const { data } = await this.client.auth.getSession();
      this.user = (data && data.session && data.session.user) || null;
    } catch (e) {
      this.user = null;
    }
    return this.user;
  },

  async signIn(email, password) {
    if (!this.client) return { ok: false, error: "geen verbinding" };
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    this.user = data.user;
    return { ok: true };
  },

  async signOut() {
    if (this.client) {
      try {
        await this.client.auth.signOut();
      } catch (e) {}
    }
    this.user = null;
  },

  // haalt de opgeslagen toestand op (of null als er nog niets is)
  async load() {
    if (!this.client || !this.user) return null;
    const { data, error } = await this.client
      .from(RB.SUPABASE.table)
      .select("data")
      .eq("user_id", this.user.id)
      .maybeSingle();
    if (error) throw error;
    return data ? data.data : null;
  },

  // --- wachtrij: nooit meer een antwoord verliezen -----------------------
  // Wegschrijven kan mislukken: even geen wifi, of de login is verlopen terwijl
  // de iPad dagen op dezelfde pagina bleef staan. Vroeger werd die fout stil
  // ingeslikt en was het antwoord voorgoed weg — een halve oefenmiddag kon zo
  // uit de kalender verdwijnen. Nu parkeren we de rij op het toestel en
  // proberen we het later gewoon opnieuw.
  QUEUE_KEY: "rainbow_pending_answers_v1",
  MAX_QUEUE: 3000,
  _flushing: false,

  _queue() {
    try {
      const q = JSON.parse(localStorage.getItem(this.QUEUE_KEY));
      return Array.isArray(q) ? q : [];
    } catch (e) {
      return [];
    }
  },
  _setQueue(rows) {
    try {
      localStorage.setItem(this.QUEUE_KEY, JSON.stringify(rows.slice(-this.MAX_QUEUE)));
    } catch (e) {} // localStorage vol → dan houdt het gewoon op, het spel gaat door
  },
  // hoeveel antwoorden wachten er nog op een verbinding?
  pendingCount() {
    return this._queue().length;
  },

  // Logt één antwoord (ook een fout) voor de statistieken.
  // Lukt het niet, dan gaat de rij in de wachtrij in plaats van de prullenbak.
  async logAnswer(row) {
    if (!this.client || !this.user) return;
    const full = { user_id: this.user.id, ...row };
    try {
      const { error } = await this.client.from("rainbow_answers").insert(full);
      if (error) throw error;
    } catch (e) {
      const q = this._queue();
      q.push(full);
      this._setQueue(q);
      throw e;
    }
  },

  // Probeert de geparkeerde antwoorden alsnog weg te schrijven.
  // Wordt aangeroepen bij het opstarten, bij terugkeer uit de achtergrond en
  // zodra het toestel weer online is.
  async flushPending() {
    if (!this.client || !this.user || this._flushing) return 0;
    const all = this._queue();
    const mine = all.filter((r) => r && r.user_id === this.user.id);
    if (!mine.length) return 0;

    this._flushing = true;
    let sent = 0;
    try {
      for (let i = 0; i < mine.length; i += 200) {
        const batch = mine.slice(i, i + 200);
        const { error } = await this.client.from("rainbow_answers").insert(batch);
        if (error) break; // nog steeds geen verbinding: de rest blijft staan
        sent += batch.length;
      }
    } catch (e) {
      // stil: de rijen blijven bewaard voor een volgende poging
    } finally {
      // Alleen wat écht verstuurd is mag weg. We lezen de wachtrij opnieuw:
      // tijdens het versturen kan er een nieuw antwoord bij gekomen zijn, en
      // dat mag niet sneuvelen omdat we met een oude kopie zouden overschrijven.
      const done = new Map();
      for (const r of mine.slice(0, sent)) {
        const k = JSON.stringify(r);
        done.set(k, (done.get(k) || 0) + 1);
      }
      const keep = [];
      for (const r of this._queue()) {
        const n = done.get(JSON.stringify(r)) || 0;
        if (n > 0) done.set(JSON.stringify(r), n - 1);
        else keep.push(r);
      }
      this._setQueue(keep);
      this._flushing = false;
    }
    return sent;
  },

  // Vernieuwt de login (die na uren in de achtergrond verlopen kan zijn) en
  // stuurt daarna alsnog op wat er nog klaarstond.
  async refresh() {
    await this.currentUser();
    if (this.user) await this.flushPending();
    return this.user;
  },

  // Haalt rijen op in pagina's.
  // Supabase geeft nooit meer dan zijn eigen server-limiet terug (standaard 1000
  // rijen), óók niet als je .limit(5000) vraagt — zonder foutmelding. Bij een
  // oplopende sortering vielen daardoor stilzwijgend de NIEUWSTE dagen weg zodra
  // een speler over die grens ging: de kalender bevroor dan halverwege een dag.
  // We blijven doorvragen tot er niets meer terugkomt, ongeacht de serverlimiet.
  async _fetchAll(makeQuery, page = 1000, hardMax = 50000) {
    const rows = [];
    while (rows.length < hardMax) {
      const { data, error } = await makeQuery().range(rows.length, rows.length + page - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      rows.push(...data);
    }
    return rows;
  },

  // Haalt alle gelogde antwoorden van één speler op (voor de kalender)
  async fetchAnswers(player) {
    if (!this.client || !this.user) return [];
    return this._fetchAll(() =>
      this.client
        .from("rainbow_answers")
        .select("player, level, is_correct, duration_ms, created_at, exercise, given_answer, correct_answer")
        .eq("user_id", this.user.id)
        .eq("player", player)
        .order("created_at", { ascending: true })
    );
  },

  // Registreert één oefensessie (start/eind/duur, goed/fout, diamant, cadeautje)
  async logSession(row) {
    if (!this.client || !this.user) return;
    const { error } = await this.client.from("rainbow_sessions").insert({ user_id: this.user.id, ...row });
    if (error) throw error;
  },

  // Haalt de sessies van één speler op (nauwkeurige bron voor de kalender)
  async fetchSessions(player) {
    if (!this.client || !this.user) return [];
    return this._fetchAll(() =>
      this.client
        .from("rainbow_sessions")
        .select("player, level, started_at, ended_at, duration_ms, correct, wrong, completed, gift_name, gift_art")
        .eq("user_id", this.user.id)
        .eq("player", player)
        .order("started_at", { ascending: true })
    );
  },

  // bewaart de hele toestand (upsert op user_id)
  async save(state) {
    if (!this.client || !this.user) return;
    const { error } = await this.client
      .from(RB.SUPABASE.table)
      .upsert({ user_id: this.user.id, data: state, updated_at: new Date().toISOString() });
    if (error) throw error;
  },
};
