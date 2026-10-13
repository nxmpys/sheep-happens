/** Small HTML helpers for the link checker (scripts/check-links.ts). */

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/** Every href/src value in the document (anchors, stylesheets, scripts, images). */
export function collectLinks(html: string): string[] {
  return [...html.matchAll(/\s(?:href|src)="([^"]*)"/g)].map((m) => decodeEntities(m[1]!)).filter(Boolean);
}

/** Every <link> of an RSS feed: the channel and each item. */
export function collectFeedLinks(xml: string): string[] {
  return [...xml.matchAll(/<link>([^<]+)<\/link>/g)].map((m) => decodeEntities(m[1]!.trim()));
}

export function collectIds(html: string): Set<string> {
  return new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => decodeEntities(m[1]!)));
}

export interface InternalTarget {
  /** Path inside the build output, starting with "/" and without the base. */
  path: string;
  hash: string | undefined;
}

/**
 * Resolves a link found on page `from` (a path inside dist, e.g. "/es/guia/index.html").
 * Returns undefined for links that point outside the site base.
 */
export function resolveInternal(link: string, from: string, base = '/'): InternalTarget | undefined {
  const url = new URL(link, `https://site.invalid${base}${from.replace(/^\//, '')}`);
  if (url.origin !== 'https://site.invalid' || !url.pathname.startsWith(base)) return undefined;
  const path = '/' + decodeURIComponent(url.pathname.slice(base.length));
  const hash = url.hash ? decodeURIComponent(url.hash.slice(1)) : undefined;
  return { path, hash };
}
