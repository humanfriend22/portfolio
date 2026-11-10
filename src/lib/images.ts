// Resolves an image name to a file under src/content. Order: next to the file, its images/ folder, src/content/images/.
// Extensions are optional ("mentor1" finds mentor1.jpg).
import { dirname } from 'node:path/posix';
import { imageCandidates } from './image-paths.mjs';

const files = import.meta.glob<ImageMetadata>('/src/content/**/*.{png,jpg,jpeg,webp,avif,gif,svg}', {
  eager: true,
  import: 'default',
});

// An image plus an optional trim, ready to spread onto <Image {...imgProps(pic)} />.
// width/height are the size after trimming; crop is "left,top,right,bottom" percentages (see lib/crop-service.ts).
export type Pic = { src: ImageMetadata; width: number; height: number; crop?: string };

export const plain = (src: ImageMetadata): Pic => ({ src, width: src.width, height: src.height });

// "mentor1?bottom=25&left=10": remove that percentage from the named edges (top, bottom, left, right; any combination).
// Returns [name, [left, top, right, bottom]].
function parseRef(ref: string): [string, number[]] {
  const [name, query = ''] = ref.split('?');
  const q = new URLSearchParams(query);
  const [l, t, r, b] = ['left', 'top', 'right', 'bottom'].map((edge) => Number(q.get(edge) ?? 0));
  const bad = ![l, t, r, b].every((v) => v >= 0 && v < 100) || l + r >= 100 || t + b >= 100;
  if (bad) throw new Error(`image "${ref}": edges must be percentages from 0 to 99, and opposite edges must add up to less than 100`);
  return [name, [l, t, r, b]];
}

function trimmed(src: ImageMetadata, [l, t, r, b]: number[]): Pic {
  if (!(l || t || r || b)) return plain(src);
  return {
    src,
    width: Math.round(src.width * (1 - (l + r) / 100)),
    height: Math.round(src.height * (1 - (t + b) / 100)),
    crop: [l, t, r, b].join(','),
  };
}

// Props for astro:assets <Image>
export const imgProps = (p: Pic) => ({ src: p.src, width: p.width, height: p.height, crop: p.crop });

// `from` is the project-relative path of the .md file that names the image (entry.filePath).
export function resolveImage(ref: string, from: string): Pic {
  const [name, trim] = parseRef(ref);
  const hit = imageCandidates(name, dirname(from)).find((c) => files[`/${c}`]);
  if (!hit) throw new Error(`${from}: image "${name}" not found (looked next to the file, in ./images/, and in src/content/images/)`);
  return trimmed(files[`/${hit}`], trim);
}

// For components in MDX, which don't know their page: the name may be any unique tail of the path ("davemaino", "images/davemaino")
export function findImage(ref: string): Pic {
  const [name, trim] = parseRef(ref);
  const tail = '/' + name.replace(/^\.\//, '').replace(/\.\w+$/, '');
  const hits = Object.keys(files).filter((k) => k.replace(/\.\w+$/, '').endsWith(tail));
  if (hits.length !== 1) throw new Error(`image "${name}": ${hits.length === 0 ? 'not found under src/content' : `ambiguous, matches ${hits.join(', ')}`}`);
  return trimmed(files[hits[0]], trim);
}
