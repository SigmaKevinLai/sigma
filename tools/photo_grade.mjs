// Unified cropping and grading for every stock photo listed in tools/photos.json.
// Sources: 1920px+ originals downloaded from Wikimedia Commons (URLs in photos.json).
// Run: NODE_PATH=/tmp/fontwork/node_modules node tools/photo_grade.mjs /path/to/originals
// Output per key, all with one shared grade:
//   assets/photos/<key>-card-{640,1200}.webp   4:3  (cards, inline figures)
//   assets/photos/<key>-wide-{960,1920}.webp   16:9 (page banners, full-bleed sections)
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const sharp = createRequire(path.join(process.env.NODE_PATH || '/tmp/fontwork/node_modules', 'x'))('sharp');

const src = process.argv[2] || '/tmp/sigma-src';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'assets', 'photos');
const photos = JSON.parse(readFileSync(path.join(root, 'tools', 'photos.json'), 'utf8'));
delete photos._note;

const TARGET = 112;   // common mean luminance (0-255)
const SAT = 0.82;     // shared desaturation keeps molten orange but calms mixed colour casts
const CAST = [[0.97, 0.02, 0.01], [0.01, 0.98, 0.01], [0.0, 0.02, 1.0]];  // slight cool aluminium cast
const VARIANTS = { card: [4, 3, [640, 1200]], wide: [16, 9, [960, 1920]] };

for (const f of readdirSync(out)) if (f.endsWith('.webp')) unlinkSync(path.join(out, f));

for (const [key, info] of Object.entries(photos)) {
  const file = path.join(src, info.file);
  const { width, height } = await sharp(file).metadata();
  for (const [variant, [rw, rh, sizes]] of Object.entries(VARIANTS)) {
    const [fx, fy] = info[variant];
    let w = width, h = Math.round(width * rh / rw);
    if (h > height) { h = height; w = Math.round(height * rw / rh); }
    const region = { left: Math.round((width - w) * fx), top: Math.round((height - h) * fy), width: w, height: h };
    const { channels } = await sharp(file).extract(region).stats();
    const lum = 0.2126 * channels[0].mean + 0.7152 * channels[1].mean + 0.0722 * channels[2].mean;
    const gain = Math.min(1.3, Math.max(0.8, TARGET / lum));
    const buf = await sharp(file).extract(region).modulate({ saturation: SAT }).recomb(CAST)
      .linear(gain * 0.95, 255 * 0.025).toBuffer();
    for (const size of sizes) {
      const target = Math.min(size, w);
      await sharp(buf).resize(target, Math.round(target * rh / rw)).webp({ quality: 72, effort: 6 })
        .toFile(path.join(out, `${key}-${variant}-${size}.webp`));
    }
  }
  console.log(key, `${width}x${height}`);
}
