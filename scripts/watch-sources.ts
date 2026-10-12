/**
 * npm run watch                         → report for the last 7 days (printed)
 * npm run watch -- --since 2026-10-01   → report since a date
 * npm run watch -- --out report.md      → also write the report to a file
 *
 * Reads every automatic source in src/data/watchlist.json and prints a Markdown
 * report: new feed items, the Mage section of new or edited beta-notes posts,
 * and new client builds. Manual sources are listed as a checklist.
 * Network errors are reported inside the document; the script never fails on them.
 */
import { writeFileSync } from 'node:fs';
import { watchlist } from '../src/lib/data';
import type { Watch } from '../src/lib/schemas';
import { extractSection, filterItems, parseDiscourseTopic, parseFeed, parseWagoBuilds } from '../src/lib/watch';

const USER_AGENT = 'SheepHappensWatcher/1.0 (+https://sheep-happens.pages.dev; weekly source check)';

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

const since = arg('since') ? new Date(`${arg('since')}T00:00:00Z`) : new Date(Date.now() - 7 * 24 * 3600 * 1000);
const out = arg('out');
const day = (date: Date) => date.toISOString().slice(0, 10);

async function get(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/rss+xml, application/json, text/html;q=0.9, */*;q=0.8' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function section(watch: Watch): Promise<{ lines: string[]; found: number }> {
  const header = `### ${watch.name} (${watch.kind}, ${watch.priority})\n<${watch.url}>\n`;
  try {
    if (watch.type === 'rss') {
      const items = filterItems(parseFeed(await get(watch.endpoint!)), since, watch.match);
      if (items.length === 0) return { lines: [header, '_Sin novedades._\n'], found: 0 };
      return {
        lines: [header, ...items.map((i) => `- [ ] ${i.date ? day(i.date) : '¿?'} · [${i.title}](${i.link})`), ''],
        found: items.length,
      };
    }
    if (watch.type === 'discourse-topic') {
      const topic = parseDiscourseTopic(await get(watch.endpoint!), watch.url);
      const fresh = topic.posts.filter((p) => p.created >= since || p.updated >= since);
      if (fresh.length === 0) return { lines: [header, '_Sin mensajes nuevos ni editados._\n'], found: 0 };
      const pattern = watch.match ? new RegExp(watch.match, 'i') : undefined;
      const lines = [header];
      for (const post of fresh) {
        const isNew = post.created >= since;
        lines.push(`- [ ] **Mensaje #${post.number}** (${isNew ? `nuevo, ${day(post.created)}` : `editado el ${day(post.updated)}`}) · <${post.url}>`);
        // A heading regex (e.g. ^Mage$) extracts that section; any other pattern greps matching lines.
        const relevant = pattern?.source.startsWith('^')
          ? extractSection(post.lines, pattern)
          : post.lines.filter((l) => !pattern || pattern.test(l));
        if (relevant.length === 0) lines.push('  - _Nada sobre el Mago en este mensaje._');
        for (const line of relevant) lines.push(`  - ${line}`);
      }
      lines.push('');
      return { lines, found: fresh.length };
    }
    if (watch.type === 'wago-builds') {
      const builds = parseWagoBuilds(await get(watch.endpoint!), watch.match).filter((b) => b.created >= since);
      if (builds.length === 0) return { lines: [header, '_Sin builds nuevas._\n'], found: 0 };
      return {
        lines: [header, ...builds.map((b) => `- [ ] Build **${b.version}** (${b.product}) · ${day(b.created)}`), ''],
        found: builds.length,
      };
    }
    return { lines: [header, `- [ ] Revisar a mano: ${watch.focus.es}`, ''], found: 0 };
  } catch (error) {
    return { lines: [header, `> ⚠ No se pudo leer (${(error as Error).message}). Revísala a mano.`, ''], found: 0 };
  }
}

const order = { high: 0, normal: 1, low: 2 } as const;
const sorted = [...watchlist].sort((a, b) => order[a.priority] - order[b.priority]);
const results = await Promise.all(sorted.map(section));
const total = results.reduce((sum, r) => sum + r.found, 0);

const report = [
  `# Revisión de fuentes — ${day(new Date())}`,
  '',
  `Novedades desde el **${day(since)}**: ${total}.`,
  '',
  '## Qué hacer',
  '',
  '1. Lee cada novedad y decide si afecta a la guía del Mago (ver `docs/maintenance.md`).',
  '2. Actualiza los datos (`src/data/*.json`) con su `status`, sus `sources` y la fecha en `updated`.',
  '3. Añade una entrada en `src/data/changelog.json` con `refs` a los datos que has cambiado.',
  '4. Revisa `docs/content-roadmap.md`: marca lo resuelto y añade lo nuevo.',
  '5. Ejecuta `npm run check` y publica.',
  '',
  '## Fuentes',
  '',
  ...results.flatMap((r) => r.lines),
].join('\n');

console.log(report);
if (out) {
  writeFileSync(out, `${report}\n`);
  console.error(`\n✓ Report written to ${out} (${total} new items)`);
}
