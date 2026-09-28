/* ============================================================
   check-leeswoorden.mjs — controleert het spel "Woordjes lezen"
   Draaien:  node tools/check-leeswoorden.mjs [letters…]
             bv. node tools/check-leeswoorden.mjs i k m s aa r e

   Controleert:
   1. geen dubbele woorden in READ_WORDS, geen woord met c/q/x/y;
   2. met de gekozen letters: elk doelwoord/zinnetje bestaat enkel uit die
      klanken, en de lengte past bij het niveau (20: ≤ 3, 21: ≥ 4 letters);
   3. elke vraag heeft precies 3 opties, het juiste woord zit erbij,
      en geen twee opties KLINKEN hetzelfde (reis/rijs, lach/lag);
   4. geen enkele optie staat op de blokkeerlijst.

   Aannames:
   - 2000 gegenereerde vragen per letterset volstaan om de toevallige
     keuzes (doelwoord, afleiders) goed te dekken.
   - Een verzonnen afleider (niet in READ_WORDS) is toegestaan, maar we
     tonen hoe vaak dat voorkomt: bestaande woorden hebben de voorkeur.
   ============================================================ */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
globalThis.window = globalThis;
for (const f of ["js/config.js", "js/exercises.js"]) {
  new Function(readFileSync(join(root, f), "utf8"))();
}
const ex = globalThis.RB.exercises;

let fouten = 0;
const meld = (msg) => { console.log(`❌ ${msg}`); fouten++; };

// 1. de woordenlijst zelf
const gezien = new Set();
for (const w of ex.READ_WORDS) {
  if (gezien.has(w)) meld(`"${w}" staat er dubbel in`);
  gezien.add(w);
  if (/[cqxy]/.test(w.replace(/ch/g, "").replace(/ij/g, ""))) meld(`"${w}" bevat c/q/x/y`);
  if (ex.READ_BLOCK.includes(w)) meld(`"${w}" staat op de blokkeerlijst`);
}

// 2–4. vragen genereren voor een paar lettersets
const argLetters = process.argv.slice(2);
const sets = argLetters.length
  ? [argLetters]
  : [
      ex.DEFAULT_LETTERS,                                       // vandaag (28-09-2026)
      ["i", "k", "m", "s", "aa", "r", "e", "v", "ee", "n"],     // een paar weken later
      ex.KLANKEN_KLINKERS.concat(ex.KLANKEN_MEDEKLINKERS),      // alles
    ];

const NAMEN = { 20: "korte woordjes (≤ 3 letters)", 21: "langere woordjes (≥ 4 letters)", 22: "zinnetjes" };
for (const letters of sets) {
  ex.setLetters(letters);
  console.log(`\nLetters: ${letters.join(" ")}`);
  for (const level of [20, 21, 22]) {
    const items = ex.readableItems(letters, level);
    console.log(`  Niveau ${level} — ${NAMEN[level]}: ${items.length}`);
    if (!items.length) continue;
    console.log(`    ${items.length <= 30 ? items.join(", ") : items.slice(0, 30).join(", ") + ", …"}`);
    let pseudo = 0, totaal = 0;
    const voorbeelden = [];
    for (let n = 0; n < 2000; n++) {
      const q = ex.generate(level);
      const woorden = q.answer.split(" ");
      if (!woorden.every((w) => ex.klanken(w).every((k) => letters.includes(k)))) meld(`"${q.answer}" gebruikt een onbekende klank`);
      if (level === 20 && ex.klanken(q.answer).length > 3) meld(`"${q.answer}" is te lang voor niveau 20`);
      if (level === 21 && ex.klanken(q.answer).length < 4) meld(`"${q.answer}" is te kort voor niveau 21`);
      if (q.options.length !== 3) meld(`"${q.answer}": ${q.options.length} opties (${q.options})`);
      if (!q.options.includes(q.answer)) meld(`"${q.answer}" zit niet bij de opties`);
      const key = (o) => o.split(" ").map((w) => ex._soundKey(w)).join(" ");
      if (new Set(q.options.map(key)).size !== q.options.length) meld(`"${q.answer}": opties klinken hetzelfde (${q.options})`);
      for (const o of q.options) {
        for (const w of o.split(" ")) if (ex.READ_BLOCK.includes(w)) meld(`"${w}" staat op de blokkeerlijst`);
        if (o === q.answer) continue;
        for (const w of o.split(" ")) {
          if (woorden.includes(w)) continue;
          totaal++;
          if (!ex.READ_WORDS.includes(w)) pseudo++;
        }
      }
      if (voorbeelden.length < 4 && !voorbeelden.some((v) => v.startsWith(q.answer + " "))) {
        voorbeelden.push(`${q.answer}  →  ${q.options.map((o, i) => `${i + 1}) ${o}`).join("   ")}`);
      }
    }
    console.log(`    verzonnen afleiders: ${Math.round((100 * pseudo) / Math.max(1, totaal))}%`);
    voorbeelden.forEach((v) => console.log("     ", v));
  }
}

console.log(fouten ? `\n${fouten} probleem(en) gevonden.` : "\n✅ Alles in orde.");
process.exit(fouten ? 1 : 0);
