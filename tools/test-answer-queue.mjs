/* ============================================================
   test-answer-queue.mjs — controleert de wachtrij in js/cloud.js
   Draaien:  node tools/test-answer-queue.mjs

   Waarom: een antwoord van Lea mag NOOIT verloren gaan als de wifi
   even wegvalt of de login verlopen is. Deze test bootst dat na met
   een nep-Supabase en een nep-localStorage, zonder de echte database
   aan te raken.
   ============================================================ */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// --- nep-omgeving: localStorage + window, zodat cloud.js kan laden ---------
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
globalThis.window = globalThis;

// cloud.js is een klassiek script (geen module) → gewoon uitvoeren
new Function(readFileSync(join(root, "js/cloud.js"), "utf8"))();
const cloud = globalThis.RB.cloud;

// --- nep-Supabase: we kunnen het net aan- en uitzetten ---------------------
let online = true;
const inserted = [];
cloud.client = {
  from: () => ({
    insert: async (rows) => {
      if (!online) return { error: { message: "offline" } };
      inserted.push(...(Array.isArray(rows) ? rows : [rows]));
      return { error: null };
    },
  }),
};
cloud.user = { id: "lea-account" };

let failures = 0;
const check = (naam, ok) => {
  console.log(`${ok ? "✅" : "❌"} ${naam}`);
  if (!ok) failures++;
};

const answer = (n) => ({ player: "Lea", level: 3, is_correct: true, created_at: `2026-08-05T12:0${n}:00.000Z` });

// 1) online: gaat meteen door, niets blijft hangen
await cloud.logAnswer(answer(0));
check("online → antwoord direct verstuurd", inserted.length === 1 && cloud.pendingCount() === 0);

// 2) offline: de fout komt naar boven, maar het antwoord wordt geparkeerd
online = false;
for (const n of [1, 2, 3]) {
  await cloud.logAnswer(answer(n)).catch(() => {});
}
check("offline → 3 antwoorden geparkeerd, niets verstuurd", cloud.pendingCount() === 3 && inserted.length === 1);

// 3) flush terwijl het net nog plat ligt: niets mag verdwijnen
await cloud.flushPending();
check("flush zonder verbinding → wachtrij blijft intact", cloud.pendingCount() === 3);

// 4) weer online: alles alsnog verstuurd, wachtrij leeg
online = true;
const sent = await cloud.flushPending();
check("weer online → alle 3 alsnog verstuurd", sent === 3 && inserted.length === 4 && cloud.pendingCount() === 0);

// 5) een rij van een ánder account blijft staan (wordt niet op Lea geboekt)
store.set(cloud.QUEUE_KEY, JSON.stringify([{ ...answer(9), user_id: "ander-account" }]));
await cloud.flushPending();
check("rij van ander account → blijft wachten, niet meeverstuurd", cloud.pendingCount() === 1 && inserted.length === 4);

// 6) de race: een antwoord dat sneuvelt tijdens een lopende flush blijft bewaard
store.set(cloud.QUEUE_KEY, JSON.stringify([]));
inserted.length = 0;
for (const n of [1, 2]) await cloud.logAnswer(answer(n)).catch(() => {}); // 2 in de rij (nog offline? nee)
online = false;
for (const n of [4, 5]) await cloud.logAnswer(answer(n)).catch(() => {});
online = true;
let laat = null;
cloud.client = {
  from: () => ({
    insert: async (rows) => {
      // midden in het versturen komt er een nieuw, mislukt antwoord bij
      if (!laat) {
        laat = { user_id: cloud.user.id, ...answer(6) };
        const q = JSON.parse(localStorage.getItem(cloud.QUEUE_KEY));
        q.push(laat);
        localStorage.setItem(cloud.QUEUE_KEY, JSON.stringify(q));
      }
      inserted.push(...(Array.isArray(rows) ? rows : [rows]));
      return { error: null };
    },
  }),
};
await cloud.flushPending();
check("nieuw antwoord tijdens flush → blijft in de wachtrij staan", cloud.pendingCount() === 1);

console.log(failures ? `\n${failures} test(s) gezakt` : "\nAlles goed — geen antwoord van Lea gaat meer verloren.");
process.exit(failures ? 1 : 0);
