/**
 * npm run links            → checks every internal link and #anchor in dist/
 * npm run links -- --external → also requests every external URL (slow, needs network)
 *
 * Run after `npm run build`. Exits with code 1 if an internal link or anchor is broken.
 * Absolute links to this site (canonical, hreflang, RSS items) count as internal.
 * External failures are reported as warnings: some sites block automated requests.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectLinks, collectIds, collectFeedLinks, resolveInternal } from '../src/lib/links';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
const site = new URL(process.env.SITE_URL || 'https://sheephappens.app');
const checkExternal = process.argv.includes('--external');

if (!existsSync(dist)) {
  console.error('✗ dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

function walk(dir: string, suffix: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full, suffix) : name.endsWith(suffix) ? [full] : [];
  });
}

const pages = walk(dist, '.html');
const feeds = walk(dist, 'rss.xml');
const idsByFile = new Map<string, Set<string>>();
const htmlByFile = new Map<string, string>();
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  htmlByFile.set(file, html);
  idsByFile.set(file, collectIds(html));
}

const errors: string[] = [];
const external = new Map<string, string[]>();
let checked = 0;

function check(link: string, from: string) {
  if (/^(mailto:|tel:|javascript:|data:)/.test(link)) return;
  if (/^https?:\/\//.test(link)) {
    const url = new URL(link);
    if (url.origin !== site.origin) {
      if (!link.startsWith('http://localhost')) external.set(link, [...(external.get(link) ?? []), from]);
      return;
    }
    link = url.pathname + url.search + url.hash;
  }
  checked++;
  const target = resolveInternal(link, from, base);
  if (!target) return;
  const candidates = target.path.endsWith('/')
    ? [join(dist, target.path, 'index.html')]
    : [join(dist, target.path), join(dist, target.path, 'index.html')];
  const found = candidates.find((c) => existsSync(c) && statSync(c).isFile());
  if (!found) {
    errors.push(`${from}: broken link ${link}`);
    return;
  }
  if (target.hash && found.endsWith('.html') && !idsByFile.get(found)?.has(target.hash)) {
    errors.push(`${from}: missing anchor #${target.hash} in ${link}`);
  }
}

const distPath = (file: string) => '/' + relative(dist, file).replaceAll('\\', '/');
for (const file of pages) {
  for (const link of collectLinks(htmlByFile.get(file)!)) check(link, distPath(file));
}
for (const file of feeds) {
  for (const link of collectFeedLinks(readFileSync(file, 'utf8'))) check(link, distPath(file));
}

console.log(`Checked ${checked} internal links across ${pages.length} pages and ${feeds.length} feeds.`);

if (checkExternal) {
  console.log(`Checking ${external.size} external URLs…`);
  for (const [url, referrers] of external) {
    try {
      const response = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15_000) });
      if (!response.ok) console.warn(`⚠ ${response.status} ${url} (from ${referrers[0]})`);
    } catch (error) {
      console.warn(`⚠ unreachable ${url} (${(error as Error).message})`);
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`✗ ${error}`);
  console.error(`\n${errors.length} broken internal link(s).`);
  process.exit(1);
}
console.log('✓ No broken internal links or anchors.');
