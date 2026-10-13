/**
 * The spell index for each locale, built once per build from the shipped data.
 * Kept apart from spells.ts so that module stays free of data imports (and testable).
 */
import type { Locale } from '../i18n/routes';
import { abilities, changes, milestones, talents } from './data';
import { buildSpellIndex, type SpellIndex } from './spells';

const cache = new Map<Locale, SpellIndex>();

export function spellIndexFor(locale: Locale): SpellIndex {
  let index = cache.get(locale);
  if (!index) {
    index = buildSpellIndex({ abilities, changes, talents, milestones }, locale);
    cache.set(locale, index);
  }
  return index;
}
