// bun run new project <slug> [folder] -> src/content/projects/[folder/]<slug>.md  (folder: notable, current, deda, ...)
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const [kind, slug, arg] = process.argv.slice(2);
const today = new Date().toISOString().slice(0, 10);
const title = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const usage = () => {
  console.error('usage: bun run new project <slug> [folder]');
  process.exit(1);
};

if (!slug || !/^[a-z0-9-]+$/.test(slug)) usage();

let path: string;
let body: string;

if (kind === 'project') {
  path = join('src/content/projects', arg ?? '', `${slug}.md`);
  body = `---
title: '${title(slug)}'
summary: 'One sentence on what it is.'
stack: [Tool, Tool]
year: '${today.slice(0, 4)}'
date: ${today}
# repo: https://github.com/humanfriend22/${slug}
# site: https://example.com
# image: ${slug}   (file name without extension; looked up here, in ./images/, then src/content/images/. A list shows them all, first is the cover)
---

## Overview

Write about the project here.
`;
} else {
  usage();
}

if (existsSync(path!)) {
  console.error(`${path!} already exists`);
  process.exit(1);
}
mkdirSync(dirname(path!), { recursive: true });
writeFileSync(path!, body!);
console.log(`created ${path!}`);
