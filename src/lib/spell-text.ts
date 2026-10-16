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

const ENGLISH_WORDS = /\b(the|and|your|you|of|for|with|by|to|an|is|are|chance|damage|target|enemy)\b/gi;

/** True when a "Spanish" text from Wowhead is still English (new Forever spells are often untranslated). */
export function looksEnglish(text: string): boolean {
  return (text.match(ENGLISH_WORDS) ?? []).length >= 3;
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
