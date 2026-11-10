import { getCollection, type CollectionEntry } from 'astro:content';
import { resolveImage, type Pic } from './images';

export type Project = CollectionEntry<'projects'>;

// Leading number in the file name ("1.macha.md" -> 1), or undefined
function orderOf(p: Project) {
  const m = p.filePath?.split('/').pop()?.match(/^(\d+)\./);
  return m ? Number(m[1]) : undefined;
}

// When a project "happened" for sorting: its date, else when it ended (ongoing ones count as now)
function sortTime(p: Project) {
  const { date, start, end } = p.data;
  return (date ?? end ?? (start ? new Date() : new Date(0))).getTime();
}

// Numbered files first (lowest number first), then the rest newest first.
function byOrderThenDate(a: Project, b: Project) {
  const oa = orderOf(a) ?? Infinity;
  const ob = orderOf(b) ?? Infinity;
  if (oa !== ob) return oa < ob ? -1 : 1;
  return sortTime(b) - sortTime(a);
}

// `image` front matter resolved to files, as a list (empty if unset)
export function imageList(p: Project): Pic[] {
  const { image } = p.data;
  return image === undefined ? [] : [image].flat().map((name) => resolveImage(name, p.filePath!));
}

// Folders whose projects are shown inline on another page and get no page of their own
const INLINE_ONLY = ['deda'];

// Folder under src/content/projects: "notable/gfr-website" -> "notable", "macha" -> "." (top level)
export function folderOf(p: Project) {
  const i = p.id.lastIndexOf('/');
  return i < 0 ? '.' : p.id.slice(0, i);
}

// File name without folder: "deda/ensus1-arcgis" -> "ensus1-arcgis". The URL slug, and the anchor id on the DEDA page.
export function slugOf(p: Project) {
  return p.id.split('/').pop()!;
}

export function isPage(p: Project) {
  return !INLINE_ONLY.includes(folderOf(p));
}

// Props for <Card> from a project: <Card {...cardProps(p)}>{p.data.summary}</Card>
export function cardProps(p: Project) {
  const [cover] = imageList(p);
  return { title: p.data.title, href: projectHref(p), image: cover, tags: p.data.stack, modal: p.data.modal };
}

export function projectHref(p: Project) {
  return `/projects/${slugOf(p)}/`;
}

export type List = string | string[];
const toList = (v?: List) => (v === undefined ? [] : [v].flat().flatMap((s) => s.split(',')).map((s) => s.trim()).filter(Boolean));

// Resolves projects for the ProjectCards / Projects components. Every option takes one value, a comma-separated
// string, or an array, and the sources combine:
//   folder:  folders under src/content/projects ("notable", "deda"; "." is the top level)
//   ids:     individual projects by file name ("macha")
//   exclude: folders or file names to leave out
// The result is the folders (in the order given) followed by the ids, without duplicates. With neither
// folder nor ids it is every project that has a page. Within a folder: numbered files first (1.x.md, 2.y.md), then newest first.
export async function listProjects(opts: { folder?: List; ids?: List; exclude?: List } = {}): Promise<Project[]> {
  const everything = (await getCollection('projects')).sort(byOrderThenDate);
  const folders = toList(opts.folder);
  const ids = toList(opts.ids);
  const exclude = toList(opts.exclude);

  const picked: Project[] = [];
  if (folders.length === 0 && ids.length === 0) picked.push(...everything.filter(isPage));
  for (const f of folders) picked.push(...everything.filter((p) => folderOf(p) === f));
  for (const id of ids) picked.push(...everything.filter((p) => slugOf(p) === id));

  return [...new Set(picked)].filter((p) => !exclude.includes(slugOf(p)) && !exclude.includes(folderOf(p)));
}

const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-US', { timeZone: 'UTC', ...o });

export function formatDate(d: Date) {
  return fmt(d, { month: 'short', day: 'numeric', year: 'numeric' });
}

// "Nov 13 – Nov 26, 2023" | "Jan 1, 2023 – Feb 2, 2024" | "Jan 1, 2023 – present" | the year
export function projectDates({ start, end, date, year }: { start?: Date; end?: Date; date?: Date; year?: string }) {
  if (!start) return year ?? (date ? formatDate(date) : '');
  if (!end) return `${formatDate(start)} – present`;
  if (start.getUTCFullYear() === end.getUTCFullYear()) {
    return `${fmt(start, { month: 'short', day: 'numeric' })} – ${formatDate(end)}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}
