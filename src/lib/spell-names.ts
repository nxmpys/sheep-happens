/**
 * The spell and talent name dictionary (src/data/spell-names.json): English
 * name → Spanish name, for every spell, talent and system the guide names. It is
 * the only place Spanish names live; data files carry the English name only.
 */
import { z } from 'astro/zod';
import rawNames from '../data/spell-names.json';
import { spellNameSchema, type SpellName } from './schemas';

export const spellNames: SpellName[] = (() => {
  const result = z.array(spellNameSchema).safeParse(rawNames);
  if (!result.success) throw new Error(`Invalid data in src/data/spell-names.json:\n${z.prettifyError(result.error)}`);
  return result.data;
})();

const byEnglish = new Map(spellNames.map((n) => [n.en, n]));

/** Verified Spanish name of an English spell or talent name, if any. */
export function spanishName(english: string): string | undefined {
  return byEnglish.get(english)?.es;
}

/** The dictionary entry of an English name, if any. */
export function nameEntry(english: string): SpellName | undefined {
  return byEnglish.get(english);
}

/** English → Spanish, for code that takes the dictionary as a plain map. */
export const SPANISH_NAMES: Readonly<Record<string, string>> = Object.fromEntries(
  spellNames.flatMap((n) => (n.es ? [[n.en, n.es]] : [])),
);
