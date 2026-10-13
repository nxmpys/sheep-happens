/**
 * Tooltip data for every spell and talent the guide documents, one file per
 * language (/es/spells.json, /en/spells.json). Pages load it on the first
 * hover or focus on a spell name, so it does not weigh on page load.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { LOCALES, type Locale } from '../../i18n/routes';
import { spellIndexFor } from '../../lib/spell-index';

export const getStaticPaths = (() => LOCALES.map((lang) => ({ params: { lang } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const { entries } = spellIndexFor(params['lang'] as Locale);
  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
