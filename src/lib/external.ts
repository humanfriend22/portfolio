// Outgoing links (http/https) open in a new tab. Spread onto an <a>: <a href={x} {...externalAttrs(x)}>
export const isExternal = (href: string) => /^https?:\/\//i.test(href);

export function externalAttrs(href: string): { target?: string; rel?: string } {
  return isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}
