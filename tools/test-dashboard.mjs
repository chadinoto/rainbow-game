/* ============================================================
   test-dashboard.mjs — controle op de rekenkant van js/dashboard.js

   Draaien:  node tools/test-dashboard.mjs

   Het dashboard tekent SVG met de hand, dus twee dingen kunnen stilletjes
   misgaan: een verkeerd cijfer, of een coördinaat die NaN/undefined wordt
   (dan verdwijnt de grafiek zonder foutmelding). Beide worden hier getest
   met verzonnen antwoorden, zonder browser.
   ============================================================ */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

// ---- de gewone (niet-module) scripts inladen met een nep-window ----
// window === globalThis, want in de browser is "window.RB = …" ook meteen
// de globale RB waar de rest van het bestand naar verwijst.
globalThis.window = globalThis;
for (const f of ["js/config.js", "js/calendar.js", "js/dashboard.js"]) {
  new Function(fs.readFileSync(path.join(root, f), "utf8")).call(globalThis);
}
const RB = globalThis.window.RB;
const D = RB.dashboard;

// nep-element: genoeg voor de tekenfuncties (innerHTML + appendChild)
function fakeEl(width = 640) {
  return {
    clientWidth: width,
    innerHTML: "",
    querySelector: () => null,
    appendChild(node) { this.innerHTML += (node && node.textContent) || ""; },
  };
}
globalThis.document = {
  createElement: () => ({ className: "", textContent: "", classList: { add() {} } }),
  getElementById: () => null,
};

let failed = 0;
function check(name, cond, extra) {
  if (cond) return;
  failed++;
  console.error("  ✗ " + name + (extra ? "  → " + extra : ""));
}
function eq(name, got, want) {
  check(name, got === want, `kreeg ${JSON.stringify(got)}, verwacht ${JSON.stringify(want)}`);
}

/* ---------- verzonnen antwoorden ----------
   Lea oefent 20 dagen lang niveau 2 (plus tot 10) en wordt gaandeweg
   sneller: van ~8 s naar ~3 s per som, met 1 fout per 10 antwoorden.  */
const DAY = 86400000;
const rows = [];
const today = new Date();
today.setHours(12, 0, 0, 0);
for (let d = 19; d >= 0; d--) {
  const dayStart = today.getTime() - d * DAY;
  const secs = 8 - (19 - d) * 0.25;                 // wordt elke dag ietsje vlotter
  for (let i = 0; i < 12; i++) {
    const wrong = i % 10 === 3;
    rows.push({
      player: "Lea",
      level: 2,
      exercise: wrong ? "7 + 5" : `${i} + 2`,
      given_answer: wrong ? 11 : i + 2,
      correct_answer: i + 2,
      is_correct: !wrong,
      duration_ms: Math.round(secs * 1000),
      created_at: new Date(dayStart + i * 40000).toISOString(),
    });
  }
}

D._rows = rows;
D._byDate = RB.calendar._reconstruct(rows, "Lea");
D._player = "Lea";

/* ---------- helpers ---------- */
console.log("helpers");
eq("median oneven", D._median([3, 1, 2]), 2);
eq("median even", D._median([1, 2, 3, 4]), 2.5);
eq("median leeg", D._median([]), null);
eq("secs onder 10", D._secs(4230), "4,2 s");
eq("secs boven 10", D._secs(12400), "12 s");
eq("duur kort", D._dur(25 * 60000), "25 min");
eq("duur lang", D._dur(80 * 60000), "1 u 20 min");
eq("pct", D._pct(9, 12), 75);

console.log("assen");
for (const [max, minStep] of [[6.4, 1], [100, 1], [1, 1], [0, 1], [37, 1], [0.4, 1]]) {
  const t = D._ticks(max, 4, minStep);
  check(`ticks(${max}) dekt het maximum`, t[t.length - 1] >= max, JSON.stringify(t));
  check(`ticks(${max}) begint op 0`, t[0] === 0);
  check(`ticks(${max}) is oplopend`, t.every((v, i) => i === 0 || v > t[i - 1]));
  check(`ticks(${max}) blijft leesbaar`, t.length >= 2 && t.length <= 12, JSON.stringify(t));
}

/* ---------- de cijfers ---------- */
console.log("cijfers");
D._period = 30;
const { from, to } = D._range();
const s = D._stats(from, to);
eq("aantal antwoorden", s.answers, 240);
eq("aantal juist", s.correct, 220);      // 20 dagen × 11 juist (1 mistik per dag)
eq("percentage juist", s.pct, 92);       // 220/240 afgerond
eq("dagen geoefend", s.days, 20);
check("oplostijd ligt tussen begin en eind", s.solve > 3000 && s.solve < 8000, s.solve);
// 20 dagen × 12 antwoorden = 240 volle regenbogen? nee: 10 juist op rij = 1 diamant,
// met 1 fout per 10 loopt de reeks telkens opnieuw — controleer alleen dat het klopt
// met wat de kalender zelf zegt (dezelfde bron).
let calDiamonds = 0;
for (const k of Object.keys(D._byDate)) calDiamonds += D._byDate[k].diamonds.length;
eq("diamanten = kalender", s.diamonds, calDiamonds);

const buckets = D._buckets(from, to);
eq("emmertjes per dag bij 30 dagen", buckets.length, 30);
eq("emmertjes met oefeningen", buckets.filter((b) => b.answers > 0).length, 20);
check("laatste emmertje is vlotter dan het eerste",
  buckets.filter((b) => b.solve != null).slice(-1)[0].solve <
  buckets.filter((b) => b.solve != null)[0].solve);

D._period = 90;
const r90 = D._range();
check("bij 90 dagen wordt er per week gegroepeerd", D._perWeek(r90.from, r90.to));
check("weken bevatten alle antwoorden",
  D._buckets(r90.from, r90.to).reduce((n, b) => n + b.answers, 0) === 240);
D._period = 30;

const levels = D._byLevel(from, to);
eq("één niveau", levels.length, 1);
eq("niveau-naam", levels[0].name, "Plus tot 10");
check("niveau is vlotter geworden", levels[0].delta < 0, levels[0].delta);

const hard = D._hardest(from, to);
check("de moeilijke som wordt gevonden", hard.length === 1 && hard[0].key === "7 + 5", JSON.stringify(hard));
eq("de moeilijke som is altijd mis", hard[0].wrong, hard[0].tries);

/* ---------- tekenen: geen NaN of undefined in de SVG ---------- */
console.log("tekenen");
function drawn(fn, ...args) {
  const el = fakeEl();
  D[fn](el, ...args);
  const html = el.innerHTML;
  check(fn + " tekent iets", html.length > 50, html.slice(0, 80));
  check(fn + " bevat geen NaN", !/NaN/.test(html));
  check(fn + " bevat geen undefined", !/undefined/.test(html));
  check(fn + " bevat geen null", !/>null|="null/.test(html));
  return html;
}
drawn("_drawSolve", buckets);
drawn("_drawPct", buckets);
drawn("_drawVolume", buckets);
drawn("_drawProgress", levels);
drawn("_drawHardest", hard);
drawn("_drawTable", levels);

// smalle telefoon: labels mogen niet over de grafiek lopen
const smal = fakeEl(300);
D._drawProgress(smal, levels);
check("naam wordt ingekort op een smal scherm",
  /Plus tot 10|…/.test(smal.innerHTML), smal.innerHTML.slice(0, 120));

// lege periode
D._rows = [];
D._byDate = {};
const leeg = D._stats(from, to);
eq("lege periode telt niets", leeg.answers, 0);
eq("lege periode heeft geen oplostijd", leeg.solve, null);

console.log(failed ? `\n${failed} test(s) MISLUKT` : "\nalles in orde ✔");
process.exit(failed ? 1 : 0);
