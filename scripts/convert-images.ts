// bun run convert [files or folders...] [--keep] [--quality=90]
// Converts HEIC/HEIF (iPhone photos) and TIFF to .jpg next to the original, then deletes the original
// unless --keep is given. With no paths it scans src/content. Folders are searched recursively.
import { existsSync, globSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import convertHeic from 'heic-convert';
import sharp from 'sharp';

const args = process.argv.slice(2);
const keep = args.includes('--keep');
const quality = Number(args.find((a) => a.startsWith('--quality='))?.split('=')[1] ?? 90);
const paths = args.filter((a) => !a.startsWith('--'));

const HEIC = ['.heic', '.heif'];
const OTHER = ['.tif', '.tiff', '.png', '.webp', '.avif', '.gif'];
// Only PNG/WebP/AVIF/GIF are converted when named explicitly: scanning a folder skips them, since the site reads them as is
const SCANNED = [...HEIC, '.tif', '.tiff'];

function collect(path: string): string[] {
  if (!existsSync(path)) {
    console.error(`not found: ${path}`);
    process.exit(1);
  }
  if (statSync(path).isDirectory()) return globSync(join(path, '**/*')).filter((f) => SCANNED.includes(extname(f).toLowerCase()));
  return [path];
}

const files = (paths.length ? paths : ['src/content']).flatMap(collect);
if (files.length === 0) {
  console.log('nothing to convert');
  process.exit(0);
}

let done = 0;
for (const file of files) {
  const ext = extname(file).toLowerCase();
  const out = file.slice(0, -ext.length) + '.jpg';
  if (![...HEIC, ...OTHER].includes(ext)) {
    console.log(`skip ${file} (unsupported type)`);
    continue;
  }
  if (existsSync(out)) {
    console.log(`skip ${file} (${out} already exists)`);
    continue;
  }
  if (HEIC.includes(ext)) {
    const jpg = await convertHeic({ buffer: readFileSync(file), format: 'JPEG', quality: quality / 100 });
    // Photos from a phone carry their rotation in metadata, which heic-convert already applies
    writeFileSync(out, Buffer.from(jpg));
  } else {
    await sharp(file).rotate().flatten({ background: '#ffffff' }).jpeg({ quality }).toFile(out);
  }
  if (!keep) unlinkSync(file);
  console.log(`${file} -> ${out}`);
  done++;
}
console.log(`${done} converted${keep ? '' : ', originals removed'}`);
