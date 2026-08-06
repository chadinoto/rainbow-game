/* ============================================================
   check-letterwoorden.mjs — controleert het beginletter-spel
   Draaien:  node tools/check-letterwoorden.mjs

   Controleert drie dingen:
   1. elk woord in PICTURE_WORDS heeft een échte tekening (geen roze
      noodcirkel uit de default-tak van art.js);
   2. de beginletter klopt met de eerste letter van het woord;
   3. geen dubbele woorden.

   Schrijft daarna een preview-pagina met alle tekeningen naast hun
   woord, zodat je in één oogopslag ziet of ze kloppen.
   ============================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
globalThis.window = globalThis;

for (const f of ["js/config.js", "js/art.js", "js/exercises.js"]) {
  new Function(readFileSync(join(root, f), "utf8"))();
}
const { art, exercises } = globalThis.RB;
const words = exercises.PICTURE_WORDS;

// de default-tak van art.object() — als een woord dít teruggeeft, ontbreekt de tekening
const FALLBACK = art.object("bestaat-echt-niet-12345");

let fouten = 0;
const meld = (msg) => { console.log(`❌ ${msg}`); fouten++; };

const gezien = new Map();
for (const w of words) {
  const svg = w.kind === "treat" ? art.treat(w.art) : art.object(w.art);
  if (svg === FALLBACK) meld(`"${w.word}" → tekening "${w.art}" bestaat niet in art.js`);
  if (w.word[0].toUpperCase() !== w.letter) meld(`"${w.word}" staat op letter ${w.letter}`);
  if (gezien.has(w.word)) meld(`"${w.word}" staat er dubbel in`);
  gezien.set(w.word, true);
}

// verwijderde woorden mogen niet terugsluipen
for (const weg of ["giraf", "uil"]) {
  if (gezien.has(weg)) meld(`"${weg}" hoort eruit (beginletter klinkt niet zuiver)`);
}

const perLetter = {};
for (const w of words) perLetter[w.letter] = (perLetter[w.letter] || 0) + 1;

console.log(`\n${words.length} woorden, ${Object.keys(perLetter).length} letters`);
console.log(
  Object.keys(perLetter).sort().map((l) => `${l}:${perLetter[l]}`).join("  ")
);

// --- preview-pagina ---------------------------------------------------------
const cards = words
  .map((w) => {
    const svg = w.kind === "treat" ? art.treat(w.art) : art.object(w.art);
    return `<figure><div class="pic">${svg}</div><figcaption><b>${w.letter}</b> ${w.word}</figcaption></figure>`;
  })
  .join("\n");

const out = join(root, "tools/preview-letterwoorden.html");
writeFileSync(
  out,
  `<!doctype html><meta charset="utf-8"><title>Beginletter-woorden</title>
<style>
  body{font:16px/1.4 system-ui,sans-serif;background:#FFFDF7;color:#4A3550;margin:24px}
  h1{font-size:20px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:14px}
  figure{margin:0;background:#fff;border:1px solid #EEE6F2;border-radius:14px;padding:10px;text-align:center}
  .pic svg{width:64px;height:64px}
  figcaption{margin-top:6px;font-size:14px}
  figcaption b{color:#C2497E}
</style>
<h1>Beginletter-woorden — ${words.length} stuks</h1>
<div class="grid">${cards}</div>`,
  "utf8"
);
console.log(`\nPreview: ${out}`);

console.log(fouten ? `\n${fouten} probleem(en)` : "\nAlles klopt.");
process.exit(fouten ? 1 : 0);
