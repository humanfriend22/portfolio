// Sätteri mdast plugin: `![alt](mentor1)` finds mentor1.* next to the file, in its images/ folder, or in src/content/images/,
// then rewrites the URL to a relative path so Astro optimizes it like any local image.
// `![alt](mentor1?bottom=25&left=10)` also cuts those percentages off first (top/bottom/left/right).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { basename, dirname, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageCandidates } from '../lib/image-paths.mjs';

const CACHE = 'node_modules/.cache/image-crops';

// sharp is async and Sätteri visitors are not, so crop in a child process; results are cached by file name
const CROP = `
import sharp from 'sharp';
const [src, out, t, r, b, l] = process.argv.slice(1);
const { width, height } = await sharp(src).metadata();
const left = Math.round(width * l / 100), top = Math.round(height * t / 100);
await sharp(src).extract({ left, top, width: Math.round(width * (1 - (+l + +r) / 100)), height: Math.round(height * (1 - (+t + +b) / 100)) }).toFile(out);
`;

function crop(root, file, q) {
  const [t, r, b, l] = ['top', 'right', 'bottom', 'left'].map((e) => Number(q.get(e) ?? 0));
  if (![t, r, b, l].every((v) => v >= 0 && v < 100) || t + b >= 100 || l + r >= 100) throw new Error(`${file}: crop percentages must be 0-99`);
  if (!(t || r || b || l)) return file;
  const out = `${root}/${CACHE}/${basename(file, extname(file))}-${t}-${r}-${b}-${l}${extname(file)}`;
  mkdirSync(`${root}/${CACHE}`, { recursive: true });
  if (!existsSync(out) || statSync(out).mtimeMs < statSync(file).mtimeMs) {
    execFileSync(process.execPath, ['--input-type=module', '-e', CROP, file, out, t, r, b, l], { cwd: root });
  }
  return out;
}

export const imageNames = {
  name: 'image-names',
  image(node, ctx) {
    const url = node.url;
    if (!url || /^([a-z]+:|\/|\.\.)/i.test(url) || !ctx.fileURL) return;
    const [name, query = ''] = url.split('?');
    const file = fileURLToPath(ctx.fileURL);
    const root = process.cwd();
    const dir = dirname(relative(root, file));
    const hit = imageCandidates(name, dir).find((c) => /\.\w+$/.test(c) && existsSync(`${root}/${c}`));
    if (!hit) return;
    const rel = relative(dirname(file), crop(root, `${root}/${hit}`, new URLSearchParams(query)));
    ctx.setProperty(node, 'url', rel.startsWith('.') ? rel : `./${rel}`);
  },
};
