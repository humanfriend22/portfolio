// Prefix a root-relative path with the site's base path; absolute URLs pass through.
export function url(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return import.meta.env.BASE_URL.replace(/\/$/, '') + path;
}

// Path of the current request without the base, e.g. /projects/macha/
export function pathWithoutBase(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base && pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;
}
