// Unified grading and cropping for homepage stock photos.
// Sources: originals downloaded from Wikimedia Commons (see tools/home_refresh.py PHOTOS).
// Run: NODE_PATH=/tmp/fontwork/node_modules node tools/photo_grade.mjs /path/to/originals
// Output: assets/photos/<key>-{640,1200}.webp, all 4:3, same tone.
import { createRequire } from 'node:module';
import path from 'node:path';
const sharp = createRequire(path.join(process.env.NODE_PATH || '/tmp/fontwork/node_modules', 'x'))('sharp');
import { fileURLToPath } from 'node:url';

const src = process.argv[2] || '/tmp/photos/hi';
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'photos');
// key: [source file, crop focus as fraction of free space (x, y)]
const PHOTOS = {
  ingots: ['ingots-truck.jpg', 0.5, 0.6],
  recycling: ['cans.jpg', 0.5, 0.45],
  inspection: ['measure-0223.jpg', 0.4, 0.5],
};
const TARGET = 118;          // common mean luminance (0-255)
const SAT = 0.78;            // shared desaturation
// Cool aluminium cast: slightly lift blue, trim red.
const CAST = [[0.96, 0.03, 0.01], [0.01, 0.98, 0.01], [0.0, 0.03, 1.0]];

for (const [key, [file, fx, fy]] of Object.entries(PHOTOS)) {
  const input = sharp(path.join(src, file));
  const { width, height } = await input.metadata();
  let w = width, h = Math.round(width * 3 / 4);
  if (h > height) { h = height; w = Math.round(height * 4 / 3); }
  const left = Math.round((width - w) * fx), top = Math.round((height - h) * fy);
  const cropped = sharp(path.join(src, file)).extract({ left, top, width: w, height: h });
  const { channels } = await cropped.clone().stats();
  const lum = 0.2126 * channels[0].mean + 0.7152 * channels[1].mean + 0.0722 * channels[2].mean;
  const gain = Math.min(1.35, Math.max(0.8, TARGET / lum));
  const graded = cropped.modulate({ saturation: SAT }).recomb(CAST).linear(gain * 0.94, 255 * 0.03);
  const buf = await graded.toBuffer();
  for (const size of [640, 1200]) {
    await sharp(buf).resize(size, Math.round(size * 3 / 4)).webp({ quality: 74, effort: 6 })
      .toFile(path.join(out, `${key}-${size}.webp`));
  }
  console.log(key, `${w}x${h}`, 'gain', gain.toFixed(2));
}
