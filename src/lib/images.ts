// Resolves an image name to a file under src/content. Order: next to the file, its images/ folder, src/content/images/.
// Extensions are optional ("mentor1" finds mentor1.jpg).
import { dirname } from 'node:path/posix';
import { imageCandidates } from './image-paths.mjs';

const files = import.meta.glob<ImageMetadata>('/src/content/**/*.{png,jpg,jpeg,webp,avif,gif,svg}', {
  eager: true,
  import: 'default',
});

// An image plus an optional trim, ready to spread onto <Image {...imgProps(pic)} />
export type Pic = { src: ImageMetadata; width: number; height: number; position: string };

export const plain = (src: ImageMetadata): Pic => ({ src, width: src.width, height: src.height, position: 'center' });

// "mentor1?bottom=25&left=10": remove that percentage from the named edges. Only one edge per axis, so the crop is a plain
// anchored box (removing the bottom keeps the top, and so on). Returns [name, trim].
function parseRef(ref: string): [string, { top: number; bottom: number; left: number; right: number }] {
  const [name, query = ''] = ref.split('?');
  const q = new URLSearchParams(query);
  const trim = { top: 0, bottom: 0, left: 0, right: 0 };
  for (const edge of Object.keys(trim) as (keyof typeof trim)[]) {
    const v = Number(q.get(edge) ?? 0);
    if (!(v >= 0 && v < 100)) throw new Error(`image "${ref}": ${edge} must be a percentage from 0 to 99`);
    trim[edge] = v / 100;
  }
  if ((trim.top && trim.bottom) || (trim.left && trim.right)) throw new Error(`image "${ref}": trim only one of top/bottom and one of left/right`);
  return [name, trim];
}

function trimmed(src: ImageMetadata, trim: ReturnType<typeof parseRef>[1]): Pic {
  // Keep the opposite side: trimming the bottom anchors the crop at the top
  const v = trim.bottom ? 'top' : trim.top ? 'bottom' : '';
  const h = trim.right ? 'left' : trim.left ? 'right' : '';
  return {
    src,
    width: Math.round(src.width * (1 - trim.left - trim.right)),
    height: Math.round(src.height * (1 - trim.top - trim.bottom)),
    position: [v, h].filter(Boolean).join(' ') || 'center',
  };
}

// Props for astro:assets <Image>: crops to the trimmed box when there is one
export const imgProps = (p: Pic) => ({ src: p.src, width: p.width, height: p.height, fit: 'cover' as const, position: p.position });

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
