import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const checkDates = (data: { date?: Date; start?: Date }, ctx: z.RefinementCtx) => {
  if (!data.date && !data.start) ctx.addIssue({ code: 'custom', path: ['date'], message: 'set `date`, or `start` (and `end`)' });
};

const project = {
  title: z.string(),
  summary: z.string().optional(),
  stack: z.array(z.string()).default([]),
  year: z.string().optional(),
  // When it happened: either a single `date`, or `start` (+ `end`, left out while ongoing)
  date: z.coerce.date().optional(),
  repo: z.string().url().optional(),
  site: z.string().url().optional(),
  course: z.string().optional(),
  start: z.coerce.date().optional(),
  end: z.coerce.date().optional(),
  // An image name, no extension needed ("mentor1"). Looked up next to this file, in its images/ folder, then in src/content/images/. "name?bottom=25" removes 25% from that edge (top, bottom, left or right).
  // One name is the cover. A list is a gallery: the first is the cover, the rest are shown under the write-up.
  image: z.union([z.string(), z.array(z.string())]).optional(),
  modal: z.boolean().default(false),
  // Indent the first line of every paragraph that follows another paragraph (essay style)
  indent: z.boolean().default(false),
};

// Projects: any .md under src/content/projects. The folder it sits in groups it for the ProjectCards / Projects
// components (notable/, current/, deda/, ...); the file name is its URL: /projects/<name>/.
// A leading number sets the order within a folder (1.macha.md, 2.mcsd.md); the rest is sorted newest first.
// Projects in an inline-only folder (see lib/projects.ts) get no page of their own.
const projects = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/projects',
    // "notable/1.gfr-website.md" -> id "notable/gfr-website": drop the order prefix and a trailing /index
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, '').replace(/(^|\/)\d+\./, '$1').replace(/\/index$/, ''),
  }),
  schema: z.object(project).superRefine(checkDates),
});

// Pages: <name>.md(x) is /<name>/. index is the home page. Use .mdx to import components.
const pages = defineCollection({
  // deda/index.mdx -> /deda/
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/pages',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '') || 'index',
  }),
  schema: z.object({ title: z.string(), indent: z.boolean().default(false) }),
});

export const collections = { projects, pages };
