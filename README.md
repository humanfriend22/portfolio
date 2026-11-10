# Portfolio

**iPhone photos (HEIC):** Astro can't read HEIC. `bun run convert` turns every `.heic`/`.tiff` under `src/content` into a `.jpg` next to it and deletes the original; `bun run convert path/to/photo.heic` does one file or folder, `--keep` keeps the originals, `--quality=80` sets JPEG quality. Naming a `.png`/`.webp`/`.avif`/`.gif` file explicitly converts that too.

**Trimming an image:** add a query to the name to cut a percentage off edges, e.g. `image: hydrogensolarcar?bottom=25` or `image: [photo?top=10&left=20, other]`. Edges are `top`, `bottom`, `left`, `right`, in any combination (opposite edges must add up to under 100). Works in front matter, in the `image`/`src` props of `TimelineEntry` and `Media`, and in Markdown images (`![alt](photo?top=10)`). Front matter and components crop through `src/lib/crop-service.ts`; Markdown images through `src/plugins/image-names.mjs`.

**Styling:** page content uses `@tailwindcss/typography` (`prose` on `<main>`, themed with the site colors in `src/styles/base.css`). Parts of components that are not prose (cards, galleries, headers) carry the `not-prose` class; give new ones the same.

**Layouts in plain Markdown** (works in `.md` and `.mdx`, no imports): wrap content in a `:::` block.

```
:::cols{widths="3 2"}
Left column text, **links**, lists...

---

![right column](photo)
:::

:::row
![a](one)
![b](two)
:::
```

`cols` makes columns (a line with `---` starts the next one; `widths` is optional and stacks on mobile). `row` puts everything inside side by side. They are defined in `src/plugins/layouts.mjs`; add more there.

**Hybrid layouts in `.mdx`:** `<Columns widths="3 2">` takes plain Markdown inside, and a line with `---` starts the next column (or put `<Column>` elements inside yourself). In VS Code, type a component name (`Columns`, `TimelineEntry`, `ProjectCards`, ...) and pick the snippet from `.vscode/mdx.code-snippets` to get the tag with its props filled in. The component list auto-imports; `src/components/Cols.astro` was renamed `Columns.astro`.
