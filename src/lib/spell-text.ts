/**
 * In-game tooltip text of a spell (src/data/spell-text.json), as the Forever
 * client shows it, taken from the Wowhead Forever database by
 * scripts/spell-text.ts. Kept free of data imports so it stays testable.
 */
export interface SpellText {
  name: string;
  /** Cost, range, cast time and cooldown as the game prints them ("30 Mana", "1.5 sec cast"). */
  meta: string[];
  /** What the spell does. Paragraphs separated by "\n". */
  text: string;
  /** Set on the Spanish text when the client has no translation yet and shows English. */
  lang?: 'en' | undefined;
}

export interface SpellTextEntry {
  /** Client icon file name (public/icons/<icon>.jpg). */
  icon?: string | undefined;
  en: SpellText;
  es: SpellText;
}

const ENTITIES: Record<string, string> = { '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };

function plain(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;/g, (m) => ENTITIES[m]!);
}

/**
 * Wowhead leaves some values as unresolved formulas ("(18.8 * 1) to (20.8 * 1)")
 * and adds talent-dependent text in brackets ("[Improved Fire Ward: …]").
 * Formulas made only of numbers are worked out; bracketed notes are dropped.
 */
export function tidyDescription(text: string): string {
  return text
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\(\s*\d+(?:\.\d+)?(?:\s*[*/+-]\s*\d+(?:\.\d+)?)+\s*\)/g, (formula) => {
      const value = Function(`"use strict"; return ${formula}`)() as number;
      return Number.isFinite(value) ? String(Math.round(value)) : formula;
    })
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim())
    .filter(Boolean)
    .join('\n');
}

/** Replaces every value shown as 0 ("by 0 sec", "a 0% chance") with every rank's value: "0.1/0.2/0.3 sec". */
export function fillRankValues(text: string, values: readonly string[]): string {
  return text.replace(/(?<![\d.,])0(?=%| sec\b| s\b| seg\b)/g, values.join('/'));
}

const ENGLISH_WORDS = /\b(the|and|your|you|of|for|with|by|to|an|is|are|chance|damage|target|enemy)\b/gi;

/** True when a "Spanish" text from Wowhead is still English (new Forever spells are often untranslated). */
export function looksEnglish(text: string): boolean {
  return (text.match(ENGLISH_WORDS) ?? []).length >= 3;
}

/**
 * Spells the game removed while other tooltips still name them. Frost Blast
 * left the spellbook in the 28 October 2026 build, but Improved Frostbolt,
 * Arctic Reach, Winter's Chill and Missile Barrage still list it. Each phrase
 * is replaced exactly, so a new wording on Wowhead stays visible and the test
 * in tests/spells.test.ts fails instead of producing a broken sentence.
 */
export const REMOVED_SPELLS = ['Frost Blast', 'Explosión de Escarcha'] as const;
const REMOVED_SPELL_PHRASES: [string, string][] = [
  ['your Frostbolt and Frost Blast spells', 'your Frostbolt spell'],
  // Longer lists first: Missile Barrage keeps four other spells, Arctic Reach three.
  ['Frostbolt, Frost Blast, and Frostfire Bolt', 'Frostbolt, and Frostfire Bolt'],
  ['Frostbolt, Frost Blast, Ice Lance, and ', 'Frostbolt, Ice Lance, and '],
  ['Frostbolt, Frost Blast, and ', 'Frostbolt and '],
  ['tus hechizos Descarga de Escarcha y Explosión de Escarcha', 'tu hechizo Descarga de Escarcha'],
  ['Descarga de Escarcha, Explosión de Escarcha, Lanza de hielo y ', 'Descarga de Escarcha, Lanza de hielo y '],
  ['Descarga de Escarcha, Explosión de Escarcha y ', 'Descarga de Escarcha y '],
];

/** The game text without the spells the game removed (see REMOVED_SPELLS). */
export function withoutRemovedSpells(text: string): string {
  return REMOVED_SPELL_PHRASES.reduce((result, [from, to]) => result.replaceAll(from, to), text);
}

/**
 * Game text Wowhead has not caught up with, applied when downloading it. Each
 * phrase is replaced exactly, so nothing changes once Wowhead has the new text.
 * The Spanish Arctic Reach still lacks Ice Lance after the 30 October 2026 hotfix.
 */
const GAME_TEXT_FIXES: [string, string][] = [['Descarga de Escarcha, Explosión de Escarcha y Ventisca, así como', 'Descarga de Escarcha, Explosión de Escarcha, Lanza de hielo y Ventisca, así como']];

export function fixGameText(text: string): string {
  return GAME_TEXT_FIXES.reduce((result, [from, to]) => result.replaceAll(from, to), text);
}

/** Header lines that are not about the spell itself. */
const NOT_META = /^(level|nivel|talent|talento|requires|requiere)\b/i;

export function parseWowheadTooltip(html: string): Omit<SpellText, 'name'> {
  const [header = '', ...rest] = html.split(/<\/table>\s*<table>/);
  const description = /<div class="q">([\s\S]*?)<\/div>/.exec(rest.join(''))?.[1] ?? '';
  const meta = plain(header.replace(/<!--[\s\S]*?-->/g, '').replace(/<a class="whtt-name"[\s\S]*?<\/a>/, '').replace(/<[^>]+>/g, '\n'))
    .split('\n')
    .map((part) => part.replace(/\s+/g, ' ').trim())
    // Cost, range, cast time and cooldown always carry a number, except instant casts.
    .filter((part) => (/\d/.test(part) || /^(instant|instante)$/i.test(part)) && !NOT_META.test(part));
  return { meta: [...new Set(meta)], text: tidyDescription(plain(description)) };
}
