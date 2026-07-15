/* ============================================================
   supabase-config.js — verbinding met jouw Supabase-project.
   De anon-key is bedoeld om publiek te zijn; je data is beveiligd
   door de login + de RLS-regel op de tabel rainbow_state.
   ============================================================ */

window.RB = window.RB || {};

RB.SUPABASE = {
  url: "https://tmvttzvmrnlsrnlqjeop.supabase.co",
  anonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtdnR0enZtcm5sc3JubHFqZW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDU4MDAsImV4cCI6MjA3NjE4MTgwMH0.d5LoTW8ne_mT1XigkUgm4ubZudirjYY-wCEID-ZPoKc",
  table: "rainbow_state",
};
