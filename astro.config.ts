// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import AutoImport from 'astro-auto-import';
import { readdirSync } from 'node:fs';
import { satteri } from '@astrojs/markdown-satteri';
import { externalLinks } from './src/plugins/external-links.mjs';
import { imageNames } from './src/plugins/image-names.mjs';

// Components usable in any .mdx page without an import: every file in src/components except the ones the site uses internally.
const INTERNAL = ['Footer', 'Gallery', 'Header', 'ProjectCard', 'ProjectHead', 'ProjectSection', 'Tag'];
const components = readdirSync('./src/components')
  .filter((f) => f.endsWith('.astro'))
  .map((f) => f.replace('.astro', ''))
  .filter((name) => !INTERNAL.includes(name));

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'ignore',
  integrations: [
    AutoImport({ imports: components.map((name) => ({ [`./src/components/${name}.astro`]: [['default', name]] })) }),
    mdx(),
  ],
  markdown: {
    shikiConfig: { theme: 'github-dark' },
    processor: satteri({ mdastPlugins: [imageNames], hastPlugins: [externalLinks] }),
  },
});
