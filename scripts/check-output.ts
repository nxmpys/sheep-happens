/**
 * npm run output → checks the built site (dist/) for UX regressions:
 *
 * - internal data refs printed as text ("race:human", "build:frost-…");
 * - a verification label's full sentence repeated in the reading flow
 *   (allowed once per page: the label legend);
 * - Ice Lance described with its old 300% bonus (history notes that say
 *   "until 15 October" / "hasta el 15 de octubre" / "from 300%" are fine);
 * - ES/EN parity: the same pages, the same number of sections (h2) and the
 *   same data components in each pair of MDX files.
 *
 * Run after `npm run build`. Exits with code 1 on any problem.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES, PAGE_IDS, pathFor } from '../src/i18n/routes';
import { t, type UiKey } from '../src/i18n/ui';
import { STATUSES } from '../src/lib/schemas';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const problems: string[] = [];

if (!existsSync(dist)) {
  console.error('✗ dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : name.endsWith('.html') ? [full] : [];
  });
}

/** Visible text: no scripts, styles or attributes. */
function text(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;| | /g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');
}

const sentences = LOCALES.flatMap((locale) => STATUSES.map((s) => t(locale, `status.${s}.desc` as UiKey)));
const rawRef = /\b(?:change|milestone|ability|fact|source|build|race|profession|pick):[a-z0-9]+(?:-[a-z0-9]+)*/;
const iceLance300 = /(Lanza de hielo|Ice Lance)[^.]{0,120}\b300 ?%|300 ?%[^.]{0,80}(Lanza de hielo|Ice Lance)/g;
const history = /hasta el 15 de octubre|until 15 October|del 300 ?% al 200|from 300 ?% to 200|300 ?% hasta|300% until/;

for (const file of walk(dist)) {
  const where = file.slice(dist.length).replaceAll('\\', '/');
  const body = text(readFileSync(file, 'utf8'));
  const ref = rawRef.exec(body);
  if (ref) problems.push(`${where}: internal ref printed as text: "${ref[0]}"`);
  for (const sentence of sentences) {
    const count = body.split(sentence).length - 1;
    if (count > 1) problems.push(`${where}: label sentence repeated ${count}×: "${sentence.slice(0, 50)}…"`);
  }
  for (const match of body.matchAll(iceLance300)) {
    const around = body.slice(Math.max(0, match.index - 40), match.index + match[0].length + 60);
    if (!history.test(around)) problems.push(`${where}: Ice Lance with 300%: "…${match[0].slice(0, 120)}…"`);
  }
}

// ES/EN parity.
const component = /<([A-Z][A-Za-z]+)\b/g;
for (const id of PAGE_IDS) {
  const pages = LOCALES.map((locale) => {
    const html = join(dist, pathFor(id, locale), 'index.html');
    const mdx = join(root, 'src/content/pages', locale, `${id}.mdx`);
    return { locale, html: existsSync(html) ? readFileSync(html, 'utf8') : undefined, mdx: existsSync(mdx) ? readFileSync(mdx, 'utf8') : undefined };
  });
  if (pages.some((p) => !p.html)) {
    problems.push(`${id}: missing in ${pages.filter((p) => !p.html).map((p) => p.locale).join(', ')}`);
    continue;
  }
  const h2 = pages.map((p) => (p.html!.match(/<h2\b/g) ?? []).length);
  if (new Set(h2).size > 1) problems.push(`${id}: different number of sections (h2): ${pages.map((p, i) => `${p.locale} ${h2[i]}`).join(', ')}`);
  const components = pages.map((p) => [...(p.mdx ?? '').matchAll(component)].map((m) => m[1]).filter((name) => name !== 'Status').join(','));
  if (new Set(components).size > 1) problems.push(`${id}: different data components in ES and EN MDX`);
}

if (problems.length > 0) {
  for (const problem of problems) console.error(`✗ ${problem}`);
  console.error(`\n${problems.length} problem(s) in the built site.`);
  process.exit(1);
}
console.log('✓ Built site: no raw refs, no repeated label sentences, no stale Ice Lance figure, ES/EN in parity.');
