/**
 * npm run changelog            → regenerates CHANGELOG.md from src/data/changelog.json
 * npm run changelog -- --check → fails if CHANGELOG.md is out of date (used by `npm run check`)
 *
 * changelog.json is the single source; the website, the RSS feeds and this file
 * are all generated from it.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { abilities, changes, facts, milestones, sortedChangelog, sources } from '../src/lib/data';
import { localName } from '../src/lib/names';

const target = fileURLToPath(new URL('../CHANGELOG.md', import.meta.url));
const TYPE = { site: 'Web', guide: 'Guía', game: 'Juego' } as const;

function label(reference: string): string {
  const [kind, id] = reference.split(':');
  const find = <T extends { id: string }>(list: T[]) => list.find((r) => r.id === id);
  switch (kind) {
    case 'change': {
      const c = find(changes);
      return c ? localName(c, 'es') : reference;
    }
    case 'milestone': {
      const m = find(milestones);
      return m?.name ? localName({ name: m.name, nameEs: m.nameEs }, 'es') : reference;
    }
    case 'ability': {
      const a = find(abilities);
      return a ? localName(a, 'es') : reference;
    }
    case 'fact':
      return find(facts)?.label.es ?? reference;
    case 'source':
      return find(sources)?.title ?? reference;
    default:
      return reference;
  }
}

const lines = [
  '# Historial de cambios',
  '',
  '<!-- Generado con `npm run changelog` a partir de src/data/changelog.json. No lo edites a mano. -->',
  '',
  'Cambios de la web (**Web**), del contenido de la guía (**Guía**) y anuncios de Blizzard que afectan al Mago (**Juego**).',
  '',
];
let currentDate = '';
for (const entry of sortedChangelog()) {
  if (entry.date !== currentDate) {
    currentDate = entry.date;
    lines.push(`## ${entry.date}`, '');
  }
  lines.push(`### [${TYPE[entry.type]}] ${entry.title.es}${entry.build ? ` (build ${entry.build})` : ''}`, '', entry.body.es, '');
  if (entry.refs.length > 0) lines.push(`- **Datos afectados:** ${entry.refs.map(label).join(', ')}`);
  if (entry.sources.length > 0) {
    const cited = entry.sources.map((id) => sources.find((s) => s.id === id)).filter(Boolean);
    lines.push(`- **Fuentes:** ${cited.map((s) => `[${s!.title}](${s!.url}) (${s!.publisher})`).join(', ')}`);
  }
  if (entry.refs.length > 0 || entry.sources.length > 0) lines.push('');
}
const output = `${lines.join('\n').trimEnd()}\n`;

if (process.argv.includes('--check')) {
  const existing = existsSync(target) ? readFileSync(target, 'utf8').replace(/\r\n/g, '\n') : '';
  if (existing !== output) {
    console.error('✗ CHANGELOG.md is out of date. Run `npm run changelog` and commit the result.');
    process.exit(1);
  }
  console.log('✓ CHANGELOG.md is up to date.');
} else {
  writeFileSync(target, output);
  console.log('✓ CHANGELOG.md regenerated.');
}
