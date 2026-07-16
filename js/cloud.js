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

  // Logt één antwoord (ook een fout) voor de statistieken
  async logAnswer(row) {
    if (!this.client || !this.user) return;
    const { error } = await this.client.from("rainbow_answers").insert({ user_id: this.user.id, ...row });
    if (error) throw error;
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
