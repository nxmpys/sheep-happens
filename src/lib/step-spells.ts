/**
 * The spells a rotation step talks about, in the order they appear, so the build
 * page can show their icons next to the step ("If Fingers of Frost triggers,
 * Ice Lance at once" → Fingers of Frost, Ice Lance). Matching works on
 * normalized text (no accents, lower case), longest names first, so "Improved
 * Frostbolt" wins over "Frostbolt" and each stretch of text counts once.
 */
import { normalize } from './filters';
import type { SpellIndex, SpellTooltip } from './spells';

/** Names that are plain words in a sentence, not the spell (see AMBIGUOUS_NAMES in spells.ts). Blizzard is always the spell in a rotation. */
const SKIP = new Set(['portal', 'teleport', 'teletransporte', 'wands', 'varitas', 'impact', 'impacto', 'perception', 'regeneration', 'hardiness', 'savage']);

const candidates = new WeakMap<SpellIndex, [string, string][]>();

function namesOf(index: SpellIndex): [string, string][] {
  let list = candidates.get(index);
  if (!list) {
    list = [...index.names.entries()]
      .filter(([name, key]) => name.length > 3 && !SKIP.has(name) && !key.startsWith('glossary-') && !key.startsWith('racial-') && index.entries[key]?.icon)
      .sort((a, b) => b[0].length - a[0].length);
    candidates.set(index, list);
  }
  return list;
}

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function stepSpells(index: SpellIndex, text: string, max = 2): SpellTooltip[] {
  let haystack = normalize(text);
  const hits: { at: number; spell: SpellTooltip }[] = [];
  for (const [name, key] of namesOf(index)) {
    const match = new RegExp(`(?<![\\p{L}])${escape(name)}(?![\\p{L}])`, 'u').exec(haystack);
    if (!match) continue;
    haystack = haystack.slice(0, match.index) + ' '.repeat(name.length) + haystack.slice(match.index + name.length);
    if (!hits.some((hit) => hit.spell.key === key)) hits.push({ at: match.index, spell: index.entries[key]! });
  }
  const ordered = hits.sort((a, b) => a.at - b.at).slice(0, max);
  // "If Fingers of Frost triggers, Ice Lance at once": the spell you cast leads,
  // the one in the condition (before the first comma) goes second.
  const clause = normalize(text).search(/[,:]/);
  if (ordered.length > 1 && /^(si|if)\s/i.test(text) && clause > 0 && ordered[0]!.at < clause && ordered[1]!.at > clause) ordered.reverse();
  // "Spend Fingers of Frost on Ice Lance": the spell it is spent on leads.
  else if (ordered.length > 1 && /^(gasta|spend)\s/i.test(text)) ordered.reverse();
  return ordered.map((hit) => hit.spell);
}

/** A step about the wand, which is not a spell: its icon. */
export const WAND_ICON = 'inv_wand_07';
export const mentionsWand = (text: string) => /\b(varita|wand)/i.test(text);
