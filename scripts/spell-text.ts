/**
 * Downloads the in-game tooltip text of every talent, ability and racial the guide
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
import { abilities, changes, races, talents } from '../src/lib/data';
import { fillRankValues, looksEnglish, parseWowheadTooltip, type SpellTextEntry } from '../src/lib/spell-text';

const OUT = new URL('../src/data/spell-text.json', import.meta.url);
const LOCALES = { en: '', es: '?locale=6' } as const;

async function fetchTooltip(id: number, query: string): Promise<{ name: string; icon?: string; tooltip: string }> {
  const res = await fetch(`https://nether.wowhead.com/forever/tooltip/spell/${id}${query}`);
  if (!res.ok) throw new Error(`spell ${id}: HTTP ${res.status}`);
  return (await res.json()) as { name: string; icon?: string; tooltip: string };
}

/**
 * Per-rank values the tooltip shows as 0 ("by 0 sec" for −99 ms), read from
 * the "Trait … Rank N … Value" lines of the spell's Wowhead page (16 Oct 2026).
 * Every 0 in the text gets the same values. Add a spell here when the script reports it as skipped.
 */
const RANK_VALUES: Record<number, string[]> = {
  11070: ['0.1', '0.2', '0.3', '0.4', '0.5'], // Improved Frostbolt: −100 to −500 ms
  11180: ['20', '40', '60', '80', '100'], // Winter's Chill: proc chance
  11189: ['10', '20'], // Frost Warding: negate chance and absorb bonus (21 Oct 2026)
};

/**
 * Spells whose Spanish text on Wowhead still describes the spell before a change
 * (the English one is current): their tooltip shows the English text instead.
 */
const STALE_ES = new Set<number>([
  11189, // Frost Warding: still "reflejar" and no absorb bonus after the 20 Oct 2026 hotfix
]);

const ids = new Set<number>([
  ...talents.map((t) => t.spell),
  ...abilities.flatMap((a) => (a.spell ? [a.spell] : [])),
  ...changes.flatMap((c) => (c.spell ? [c.spell] : [])),
  ...races.flatMap((r) => r.racials.flatMap((racial) => (racial.spell ? [racial.spell] : []))),
]);
const previous = JSON.parse(readFileSync(OUT, 'utf8')) as { spells: Record<string, SpellTextEntry> };
const spells: Record<string, SpellTextEntry> = {};
const failed: number[] = [];

for (const id of [...ids].sort((a, b) => a - b)) {
  try {
    const [en, es] = await Promise.all([fetchTooltip(id, LOCALES.en), fetchTooltip(id, LOCALES.es)]);
    const parsedEn = parseWowheadTooltip(en.tooltip);
    const parsedEs = parseWowheadTooltip(es.tooltip);
    const ranks = RANK_VALUES[id];
    if (ranks) {
      parsedEn.text = fillRankValues(parsedEn.text, ranks);
      parsedEs.text = fillRankValues(parsedEs.text, ranks);
    }
    if (!parsedEn.text || !parsedEs.text) throw new Error(`spell ${id}: no description`);
    // Multi-rank talents whose per-rank value Wowhead leaves at 0 ("by 0 sec", "a 0% chance"):
    // better our own description than a wrong number.
    if (/(?<![\d.])0(%| sec\b)/.test(parsedEn.text)) {
      console.warn(`- spell ${id} (${en.name}): rank values missing on Wowhead; skipped`);
      continue;
    }
    if (STALE_ES.has(id)) parsedEs.text = parsedEn.text;
    const untranslated = parsedEs.text === parsedEn.text || looksEnglish(parsedEs.text);
    spells[id] = {
      // The icon file must also exist in public/icons (check-output fails the build otherwise).
      ...(en.icon ? { icon: en.icon } : {}),
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
