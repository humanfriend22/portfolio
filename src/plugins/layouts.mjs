// Sätteri mdast plugin: layouts written in plain Markdown, no components.
//
//   :::cols{widths="3 2"}     columns that stack on mobile; a line with --- starts the next column; widths is optional
//   left text
//   ---
//   ![right](photo)
//   :::
//
// In .mdx the same split works inside the component: <Grid widths="3 2"> text --- more text </Grid>
//
// They render the same HTML as <Grid>, so the styles in components.css apply.
const el = (name, className, children, extra = {}) => ({
  type: 'layout',
  data: { hName: name, hProperties: { className, ...extra } },
  children,
});

function splitOnBreaks(nodes) {
  const groups = [[]];
  for (const n of nodes) {
    if (n.type === 'thematicBreak') groups.push([]);
    else groups.at(-1).push(n);
  }
  return groups.filter((g) => g.length > 0);
}

export const layouts = {
  name: 'layouts',
  // <Grid> ... --- ... </Grid>: wrap each part in a cell
  mdxJsxFlowElement(node, ctx) {
    if (node.name !== 'Grid') return;
    if (!node.children.some((c) => c.type === 'thematicBreak')) return;
    const columns = splitOnBreaks(node.children).map((g) => el('div', ['column'], g));
    ctx.replaceNode(node, { ...node, children: columns });
  },
  containerDirective(node, ctx) {
    if (node.name === 'cols') {
      const columns = splitOnBreaks(node.children).map((g) => el('div', ['column'], g));
      const widths = (node.attributes?.widths ?? '').split(/[\s,]+/).filter(Boolean).map(Number).filter((n) => n > 0);
      const count = widths.length || columns.length;
      const tracks = widths.length ? `;--tracks:${widths.map((w) => `minmax(0, ${w}fr)`).join(' ')}` : '';
      ctx.replaceNode(node, el('div', ['layout-grid', 'layout-grid-fixed'], columns, { style: `--cols:${count}${tracks}` }));
    }
  },
};
