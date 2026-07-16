/* ============================================================
   sync-test.mjs — test of de cloud-sync geen data meer overschrijft.

   Scenario (de echte bug):
     1. Mama's laptop logt in.  Cloud heeft dan al Raphael = 7 rode diamanten.
     2. Terwijl de laptop openstaat, speelt Raphael verder op zijn iPad:
        de cloud gaat naar 20 rode diamanten.
     3. Mama's laptop bewaart daarna iets (bv. van speler wisselen).
        -> OUDE code: schreef blind haar hele (verouderde) stand weg
           => Raphael's 20 rode diamanten waren wég.
        -> NIEUWE code: haalt eerst de cloud op en voegt samen (max)
           => 20 blijft staan.

   We draaien de ECHTE app (index.html) in headless Chrome, met enkel
   RB.cloud gestubd naar een nep-cloud in het geheugen.

   Aannames:
   - Chrome staat op het standaard macOS-pad (zie CHROME).
   - De sync-logica hangt aan RB.cloud.load/save; de rest van de app is echt.
   ============================================================ */

import { readFileSync, writeFileSync, rmSync, mkdtempSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// --- de nep-cloud + het scenario, geïnjecteerd vlak vóór js/main.js ---
const STUB = `
<script>
(() => {
  const P = () => ({ level: 1, collected: 0, seenRewards: 0,
    gems: Object.fromEntries(Array.from({length:17},(_,i)=>[i+1,0])) });

  // Wat er in de cloud staat op het moment dat mama inlogt: Raphael heeft 7 rode.
  const cloud = { players: { Lea: P(), Raphael: P(), Mama: P(), Papa: P() },
                  currentPlayer: "Lea", soundOn: true, seedVersion: 2 };
  cloud.players.Raphael.gems[6] = 7;
  cloud.players.Lea.gems[1] = 10;

  window.__calls = [];
  window.__cloud = cloud;

  RB.cloud.init = () => ({});
  RB.cloud.available = () => true;
  RB.cloud.currentUser = async () => (RB.cloud.user = { id: "test-user" });
  RB.cloud.load = async () => { window.__calls.push("load"); return JSON.parse(JSON.stringify(window.__cloud)); };
  RB.cloud.save = async (s) => { window.__calls.push("save"); window.__cloud = JSON.parse(JSON.stringify(s)); };
  RB.cloud.logAnswer = async () => {};
  RB.cloud.signOut = async () => {};
})();
</script>
`;

// Mama's laptop heeft een VEROUDERDE lokale stand: Raphael staat er op 0.
const STALE_LOCAL = `
<script>
(() => {
  const P = () => ({ level: 1, collected: 0, seenRewards: 0,
    gems: Object.fromEntries(Array.from({length:17},(_,i)=>[i+1,0])) });
  const stale = { version: 2, seedVersion: 2, soundOn: true, currentPlayer: "Lea",
    players: { Lea: P(), Raphael: P(), Mama: P(), Papa: P() } };
  stale.players.Lea.gems[1] = 10;   // Raphael: 0 -> dit is de verouderde stand
  localStorage.setItem("rainbow_diamonds_v1", JSON.stringify(stale));
})();
</script>
`;

const RESULT = `
<script>
(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const red = () => window.__cloud.players.Raphael.gems[6];
  const out = [];
  try {
    await sleep(500); // enterApp: inloggen + samenvoegen
    out.push(["na inloggen: rode diamanten van Raphael in de cloud", red(), 7]);

    // Raphael speelt intussen verder op zijn eigen iPad -> cloud gaat naar 20
    window.__cloud.players.Raphael.gems[6] = 20;
    window.__calls.length = 0;

    // Mama's laptop bewaart iets (van speler wisselen naar Mama = de 3e chip)
    const chips = document.querySelectorAll("#player-row .player-chip");
    if (chips.length !== 4) throw new Error("spelerknoppen niet gevonden: " + chips.length);
    chips[2].click();
    await sleep(2600); // debounce (1200ms) + load/save

    out.push(["mama bewaart -> Raphael's 20 rode blijven staan", red(), 20]);
    out.push(["er wordt eerst opgehaald, dan pas geschreven", window.__calls.slice(0, 2).join(","), "load,save"]);
    out.push(["Lea's blauwe diamanten blijven bewaard", window.__cloud.players.Lea.gems[1], 10]);
  } catch (e) {
    out.push(["test zelf stukgelopen", String(e && e.message), "geen fout"]);
  }
  const lines = out.map(([n, got, want]) =>
    (String(got) === String(want) ? "OK   " : "FOUT ") + n + " -> " + got + " (verwacht " + want + ")");
  const fail = out.some(([, got, want]) => String(got) !== String(want));
  document.title = "RESULTAAT " + (fail ? "GEZAKT" : "GESLAAGD") + "\\n" + lines.join("\\n");
})();
</script>
`;

const html = readFileSync(join(ROOT, "index.html"), "utf8")
  .replace('<script src="js/config.js"></script>', STALE_LOCAL + '<script src="js/config.js"></script>')
  .replace('<script src="js/main.js"></script>', STUB + '<script src="js/main.js"></script>' + RESULT);

const testFile = join(ROOT, "__sync-test.html");
writeFileSync(testFile, html);
const profile = mkdtempSync(join(tmpdir(), "rb-sync-"));

try {
  const dom = execFileSync(CHROME, [
    "--headless", "--disable-gpu", "--no-sandbox", "--no-first-run",
    "--disable-component-update", "--disable-background-networking",
    "--virtual-time-budget=12000",
    `--user-data-dir=${profile}`, "--dump-dom", `file://${testFile}`,
  ], { encoding: "utf8", maxBuffer: 40 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });

  const title = (dom.match(/<title>([\s\S]*?)<\/title>/) || [, "(geen resultaat gevonden)"])[1]
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  console.log(title);
  process.exit(title.startsWith("RESULTAAT GESLAAGD") ? 0 : 1);
} finally {
  rmSync(testFile, { force: true });
  rmSync(profile, { recursive: true, force: true });
}
