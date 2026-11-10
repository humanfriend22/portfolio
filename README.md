# Portfolio

Astro site. Migrated from Hugo (`../hugo`).

```sh
bun install
bun dev       # localhost:4321
bun build     # ./dist
```

## Adding content

```sh
bun run new project my-project [folder]  # new project, front matter pre-filled (folder: notable, current, deda)
bun run new devlog my-project [name]  # dated devlog entry on that project
```

Edit the generated file. Images go next to the Markdown file, in an `images/` folder beside it, or in `src/content/images/`, and are referenced by file name without the extension (`image: mentor1`, `![alt](mentor1)`). They are looked up in that order; two files with the same name but different extensions are ambiguous, so give them different names. Push to `main` to deploy.

## Content reference

| Path | What |
| :-- | :-- |
| `src/content/projects/[folder/]<name>.md` | A project. The file name is its URL (`/projects/<name>/`). The folder decides where it is listed: `notable/` (home + projects page), `current/` ("Currently working on"), `deda/` (inline on `/deda/`, no page of its own), top level = "More projects". Front matter: `title`, `summary`, `stack`, `date`, `year`, `repo`, `site`, `image` (an image name, or a list: first is the cover, all are shown on the project page), `modal`. A leading number in the file name sets the order within a folder (`1.gfr-website.md`, `2.macha.md`); the number is not part of the URL. Everything else is sorted newest first by `date`. |
| `src/content/devlog/<slug>/<yyyy-mm-dd-name>.md` | Devlog entry (`title`, `date`), shown on that project's page and in "Latest devlog". |
| `src/content/pages/<name>.md` | A page at `/<name>/`. `index` is the home page, `deda` and `projects` are the DEDA and projects pages. Use `.mdx` (with `import` lines for components from `src/components`) when a page needs components; plain `.md` otherwise. |
| `src/data/site.ts` | Site title, header menu. |
| `src/data/tags.ts` | Icon category per `stack` tag. |

Move a file between folders to change where it shows. Components pick projects with any mix of `folder` (`.` is the top level), `ids` (file names) and `exclude` (folders or file names). Each takes one value, `"a, b"`, or `{['a', 'b']}`, and they combine without duplicates:

```mdx
<ProjectCards folder="notable, current" ids="macha" exclude="minecraft-ec2" title="Highlights" />
```

The folders that get no page are listed in `INLINE_ONLY` in `src/lib/projects.ts`.

Components replacing the Hugo shortcodes live in `src/components` (`ProjectCards`, `Projects`, `LatestDevlog`, `Cols`/`Column`, `Timeline`/`TimelineEntry`, `Accordion`, `Media`, ...). Import them at the top of an `.mdx` file.

Theme variables are in `src/styles/theme.css`. Code blocks use Shiki (`github-dark`).

The site is served from the root (`/`), so use root-relative paths for links (`/projects/macha/`). `url()` in `src/lib/url.ts` is a no-op at the root; it only matters if you later set `base` in `astro.config.mjs`, and Markdown links would then need a prefix too.

**Components in `.mdx`:** every file in `src/components/` (except the internal ones listed in `astro.config.ts`) can be used in any `.mdx` file without an import: `<Cols>`, `<Timeline>`, `<ProjectCards folder="notable" />`. A new component file is picked up on the next dev-server start.

**Trimming an image:** add a query to the name to cut a percentage off an edge, e.g. `image: hydrogensolarcar?bottom=25` or `image: [photo?top=10&left=20, other]`. Edges are `top`, `bottom`, `left`, `right`; use at most one per axis. The crop happens at build time, so the output file is smaller too. It works in front matter, in the `image`/`src` props of `TimelineEntry` and `Media`, and in Markdown images (`![alt](converter-test?top=10)`). Markdown images may trim both sides of an axis; the crop there is exact.
