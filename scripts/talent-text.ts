/**
 * Downloads the per-rank text of every Mage talent from the Wowhead Forever
 * talent calculator data (the same file its calculator loads), in English and
 * Spanish, into src/data/talent-text.json. The talent calculator page shows
 * this text for the rank you have and the next one.
 *
 *   npm run talents:text
 *
 * Talents are matched to talents.json by spell id (the first rank's spell).
 * Run it after a new build, and on launch day to replace the beta values.
 * It never edits other data files.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { talents } from '../src/lib/data';
import { fixGameText, looksEnglish } from '../src/lib/spell-text';

const OUT = new URL('../src/data/talent-text.json', import.meta.url);
const PAGES = { en: 'https://www.wowhead.com/forever/talent-calc/mage', es: 'https://www.wowhead.com/forever/es/talent-calc/mage' } as const;
const MARKER = 'WH.setPageData("wow.talentCalcClassic.classicplus.data",';

interface WowheadTalent {
  row: number;
  col: number;
  icon: string;
  name: string;
  ranks: number[];
  descriptions: Record<string, string>;
}

/** The calculator page links its data file, whose URL carries a version hash. */
async function dataUrl(page: string): Promise<string> {
  const html = await (await fetch(page, { headers: { 'user-agent': 'Mozilla/5.0 (sheephappens.app talent text)' } })).text();
  const match = /https:\/\/nether\.wowhead\.com\/forever\/(?:[a-z]{2}\/)?data\/talents-classic\?[^"' ]+/.exec(html);
  if (!match) throw new Error(`no talent data link on ${page}`);
  return match[0].replace(/&amp;/g, '&');
}

/** Reads the JSON object passed to setPageData, matching braces (strings may contain them). */
function extract(js: string): { talents: Record<string, Record<string, WowheadTalent>> } {
  const start = js.indexOf(MARKER);
  if (start < 0) throw new Error('talent data marker not found');
  let i = js.indexOf('{', start);
  const from = i;
  let depth = 0;
  let inString = false;
  for (; i < js.length; i++) {
    const c = js[i];
    if (inString) {
      if (c === '\\') i++;
      else if (c === '"') inString = false;
    } else if (c === '"') inString = true;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) break;
  }
  return JSON.parse(js.slice(from, i + 1));
}

/** Wowhead keeps level-scaling hints in comments ("<!--ppl20:24:110:150-->101"); keep only the text. */
function plain(text: string): string {
  return text
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function load(locale: keyof typeof PAGES): Promise<Map<number, WowheadTalent>> {
  const url = await dataUrl(PAGES[locale]);
  const data = extract(await (await fetch(url)).text());
  const bySpell = new Map<number, WowheadTalent>();
  for (const tree of Object.values(data.talents)) {
    for (const talent of Object.values(tree)) if (talent.ranks[0]) bySpell.set(talent.ranks[0], talent);
  }
  return bySpell;
}

const [en, es] = await Promise.all([load('en'), load('es')]);
const out: Record<string, unknown> = {};
const missing: string[] = [];

for (const talent of talents) {
  const a = en.get(talent.spell);
  const b = es.get(talent.spell);
  if (!a || !b) {
    missing.push(talent.id);
    continue;
  }
  const ranks = (t: WowheadTalent) =>
    Array.from({ length: talent.maxRank }, (_, n) => fixGameText(plain(t.descriptions[String(n + 1)] ?? t.descriptions['1'] ?? '')));
  const esRanks = ranks(b);
  if (a.row + 1 !== talent.row || a.col + 1 !== talent.col) {
    console.warn(`- ${talent.id}: Wowhead has it at row ${a.row + 1}, col ${a.col + 1} (talents.json: ${talent.row}, ${talent.col})`);
  }
  out[talent.id] = {
    icon: a.icon,
    en: { name: a.name, ranks: ranks(a) },
    es: { name: b.name, ranks: esRanks, ...(esRanks.some(looksEnglish) ? { lang: 'en' } : {}) },
  };
}

const previous = JSON.parse(readFileSync(OUT, { encoding: 'utf8', flag: 'a+' }) || '{"talents":{}}') as { talents: Record<string, unknown> };
for (const id of missing) {
  console.warn(`! ${id}: not in the Wowhead data; keeping the previous text`);
  if (previous.talents[id]) out[id] = previous.talents[id];
}
const today = new Date().toISOString().slice(0, 10);
writeFileSync(OUT, `${JSON.stringify({ fetched: today, source: PAGES.en, talents: out }, null, 2)}\n`);
console.log(`✓ ${Object.keys(out).length} of ${talents.length} talents written to src/data/talent-text.json`);
if (missing.length) process.exitCode = 1;
