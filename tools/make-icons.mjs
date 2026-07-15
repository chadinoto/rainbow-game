/* ============================================================
   make-icons.mjs — genereert de app-iconen (PNG) voor "zet op beginscherm".
   Pure JavaScript (geen externe libs): tekent een diamant op een zachte
   achtergrond en schrijft er een geldige PNG van weg.
   Gebruik:  node tools/make-icons.mjs
   Output:   icons/icon-180.png, icon-192.png, icon-512.png
   ============================================================ */

import zlib from "node:zlib";
import fs from "node:fs";
import path from "node:path";

// ---- CRC32 (voor PNG-chunks) ----
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function toPNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type RGBA
  // rest 0 (compressie/filter/interlace)
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

// ---- tekenen ----
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];

function render(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const cx = size / 2, cy = size / 2;
  const rx = size * 0.30, ry = size * 0.37;
  const BG1 = [252, 239, 233], BG2 = [242, 229, 250]; // crème → lila
  const TOP = [240, 120, 174], BASE = [226, 61, 130], DARK = [168, 30, 94]; // diamant
  const SHINE = [255, 255, 255];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = x + 0.5, py = y + 0.5;
      let col = mix(BG1, BG2, (x + y) / (2 * size)); // achtergrond-verloop

      const d = Math.abs(px - cx) / rx + Math.abs(py - cy) / ry; // ruit-afstand
      if (d <= 1.0) {
        col = py < cy ? TOP.slice() : BASE.slice();       // bovenkant lichter
        if (px > cx) col = mix(col, DARK, 0.18);          // rechterkant iets donkerder
        if (d > 0.9) col = DARK.slice();                  // omtrek
        // glans linksboven
        const sx = px - (cx - rx * 0.35), sy = py - (cy - ry * 0.45);
        if (py < cy && sx * sx + sy * sy < (size * 0.06) ** 2) col = mix(col, SHINE, 0.55);
      }

      const i = (y * size + x) * 4;
      rgba[i] = Math.round(col[0]);
      rgba[i + 1] = Math.round(col[1]);
      rgba[i + 2] = Math.round(col[2]);
      rgba[i + 3] = 255; // volledig ondoorzichtig (iOS zet anders zwart achter transparantie)
    }
  }
  return toPNG(size, size, rgba);
}

const outDir = path.join(process.cwd(), "icons");
fs.mkdirSync(outDir, { recursive: true });
for (const size of [180, 192, 512]) {
  const file = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(file, render(size));
  console.log("geschreven:", path.relative(process.cwd(), file));
}
