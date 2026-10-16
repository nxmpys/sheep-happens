/**
 * Downloads the in-game tooltip text of every talent and ability the guide
 * documents (by its Wowhead spell id) from the Wowhead Forever database, in
 * English and Spanish, into src/data/spell-text.json. The hover tooltips show
 * this text: what the spell does in the game client, not our notes.
 *
 *   npm run spells:text
 *
 * Run it after a new build or when a talent or ability gets a spell id.
 * It never edits other data files.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { abilities, talents } from '../src/lib/data';
import { looksEnglish, parseWowheadTooltip, type SpellTextEntry } from '../src/lib/spell-text';

const OUT = new URL('../src/data/spell-text.json', import.meta.url);
const LOCALES = { en: '', es: '?locale=6' } as const;

async function fetchTooltip(id: number, query: string): Promise<{ name: string; tooltip: string }> {
  const res = await fetch(`https://nether.wowhead.com/forever/tooltip/spell/${id}${query}`);
  if (!res.ok) throw new Error(`spell ${id}: HTTP ${res.status}`);
  return (await res.json()) as { name: string; tooltip: string };
}

const ids = new Set<number>([...talents.map((t) => t.spell), ...abilities.flatMap((a) => (a.spell ? [a.spell] : []))]);
const previous = JSON.parse(readFileSync(OUT, 'utf8')) as { spells: Record<string, SpellTextEntry> };
const spells: Record<string, SpellTextEntry> = {};
const failed: number[] = [];

for (const id of [...ids].sort((a, b) => a - b)) {
  try {
    const [en, es] = await Promise.all([fetchTooltip(id, LOCALES.en), fetchTooltip(id, LOCALES.es)]);
    const parsedEn = parseWowheadTooltip(en.tooltip);
    const parsedEs = parseWowheadTooltip(es.tooltip);
    if (!parsedEn.text || !parsedEs.text) throw new Error(`spell ${id}: no description`);
    // Multi-rank talents whose per-rank value Wowhead leaves at 0 ("by 0 sec", "a 0% chance"):
    // better our own description than a wrong number.
    if (/(?<![\d.])0(%| sec\b)/.test(parsedEn.text)) {
      console.warn(`- spell ${id} (${en.name}): rank values missing on Wowhead; skipped`);
      continue;
    }
    const untranslated = parsedEs.text === parsedEn.text || looksEnglish(parsedEs.text);
    spells[id] = {
      en: { name: en.name, ...parsedEn },
      es: { name: es.name, ...parsedEs, ...(untranslated ? { lang: 'en' as const } : {}) },
    };
  } catch (error) {
    console.warn(`! ${(error as Error).message}; keeping the previous text`);
    failed.push(id);
    if (previous.spells[id]) spells[id] = previous.spells[id];
  }
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(OUT, `${JSON.stringify({ fetched: today, spells }, null, 2)}\n`);
console.log(`✓ ${Object.keys(spells).length} spells written to src/data/spell-text.json${failed.length ? ` (${failed.length} failed)` : ''}`);
if (failed.length) process.exitCode = 1;
