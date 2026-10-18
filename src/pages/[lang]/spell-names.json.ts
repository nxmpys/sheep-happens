/**
 * Spell and talent names to underline as tooltip triggers when they appear as
 * plain text, one small file per language (/es/spell-names.json). The tooltip
 * script loads it on pages with prose; the tooltip text itself stays in
 * spells.json, loaded on the first hover.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { LOCALES, type Locale } from '../../i18n/routes';
import { abilities, changes, talents } from '../../lib/data';
import { spellIndexFor } from '../../lib/spell-index';
import { SPANISH_NAMES } from '../../lib/spell-names';
import { autoLinkNames } from '../../lib/spells';

export const getStaticPaths = (() => LOCALES.map((lang) => ({ params: { lang } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const locale = params['lang'] as Locale;
  const list = autoLinkNames(spellIndexFor(locale), [...abilities, ...changes, ...talents], locale, SPANISH_NAMES);
  return new Response(JSON.stringify(list), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
