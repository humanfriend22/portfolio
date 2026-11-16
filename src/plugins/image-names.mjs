// Sätteri mdast plugin: `![alt](mentor1)` finds mentor1.* next to the file, in its images/ folder, or in src/content/images/,
// then rewrites the URL to a relative path so Astro optimizes it like any local image.
// `![alt](mentor1?bottom=25&left=10)` also cuts those percentages off first (top/bottom/left/right).
// Images on consecutive lines (no blank line between) become one row: same height, widths follow each image's shape, no cropping.
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

const SIZE = `
import sharp from 'sharp';
const { width, height } = await sharp(process.argv[1]).metadata();
console.log(width / height);
`;
const ratios = new Map();
const ratio = (file) => {
  if (!ratios.has(file)) ratios.set(file, Number(execFileSync(process.execPath, ['--input-type=module', '-e', SIZE, file], { encoding: 'utf8' })));
  return ratios.get(file);
};

// Absolute path of the (cropped) file a markdown image name points at, or undefined for URLs and unknown names
function localFile(url, ctx) {
  if (!url || /^([a-z]+:|\/|\.\.)/i.test(url) || !ctx.fileURL) return;
  const [name, query = ''] = url.split('?');
  const file = fileURLToPath(ctx.fileURL);
  const root = process.cwd();
  const hit = imageCandidates(name, dirname(relative(root, file))).find((c) => /\.\w+$/.test(c) && existsSync(`${root}/${c}`));
  if (!hit) return;
  return crop(root, `${root}/${hit}`, new URLSearchParams(query));
}

const relUrl = (out, ctx) => {
  const rel = relative(dirname(fileURLToPath(ctx.fileURL)), out);
  return rel.startsWith('.') ? rel : `./${rel}`;
};

export const imageNames = {
  name: 'image-names',
  image(node, ctx) {
    const out = localFile(node.url, ctx);
    if (!out) return;
    ctx.setProperty(node, 'url', relUrl(out, ctx));
  },
  // two or more images in one paragraph: a row whose images all share a height (each grows in proportion to its aspect ratio)
  paragraph(node, ctx) {
    const images = node.children.filter((c) => c.type === 'image');
    const onlyImages = node.children.every((c) => c.type === 'image' || c.type === 'break' || (c.type === 'text' && !c.value.trim()));
    if (images.length < 2 || !onlyImages) return;
    const files = images.map((img) => localFile(img.url, ctx));
    if (files.some((f) => !f)) return;
    const sized = images.map((img, i) => ({ ...img, url: relUrl(files[i], ctx), data: { hProperties: { style: `--ar:${ratio(files[i]).toFixed(4)}` } } }));
    ctx.replaceNode(node, { type: 'layout', data: { hName: 'div', hProperties: { className: ['image-row'] } }, children: sized });
  },
};
