/**
 * Spell and talent names to underline as tooltip triggers when they appear as
 * plain text, one small file per language (/es/spell-names.json). The tooltip
 * script loads it on pages with prose; the tooltip text itself stays in
 * spells.json, loaded on the first hover.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { LOCALES, type Locale } from '../../i18n/routes';
import { abilities, changes, glossary, talents } from '../../lib/data';
import { spellIndexFor } from '../../lib/spell-index';
import { SPANISH_NAMES } from '../../lib/spell-names';
import { autoLinkNames, glossaryLinkNames } from '../../lib/spells';

export const getStaticPaths = (() => LOCALES.map((lang) => ({ params: { lang } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const locale = params['lang'] as Locale;
  const spells = autoLinkNames(spellIndexFor(locale), [...abilities, ...changes, ...talents], locale, SPANISH_NAMES);
  const taken = new Set(spells.map(([name]) => name));
  // Longest first, so "talentos decisivos" wins over a shorter overlapping name.
  const list = [...spells, ...glossaryLinkNames(glossary, locale).filter(([name]) => !taken.has(name))].sort((a, b) => b[0].length - a[0].length);
  return new Response(JSON.stringify(list), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
