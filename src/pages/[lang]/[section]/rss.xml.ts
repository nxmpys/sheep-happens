/**
 * RSS feed of the changelog, one per language:
 *   /es/novedades/rss.xml  ·  /en/updates/rss.xml
 */
import rss from '@astrojs/rss';
import type { APIRoute, GetStaticPaths } from 'astro';
import { LOCALES, ROUTES, pathFor, type Locale } from '../../../i18n/routes';
import { t, type UiKey } from '../../../i18n/ui';
import { sortedChangelog } from '../../../lib/data';

export const getStaticPaths = (() =>
  LOCALES.map((lang) => ({ params: { lang, section: ROUTES.updates.slug[lang] } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params, site }) => {
  const locale = params['lang'] as Locale;
  const base = import.meta.env.BASE_URL;
  const updates = pathFor('updates', locale, { base });
  const siteUrl = site ?? 'https://sheephappens.app';
  return rss({
    title: t(locale, 'updates.rssTitle'),
    description: t(locale, 'updates.rssDescription'),
    site: siteUrl,
    customData: `<language>${locale === 'es' ? 'es-es' : 'en-gb'}</language>`,
    items: sortedChangelog().map((entry) => ({
      title: entry.title[locale],
      description: entry.body[locale],
      pubDate: new Date(`${entry.date}T12:00:00Z`),
      // Absolute, so @astrojs/rss does not append a trailing slash after the #anchor.
      link: new URL(`${updates}#update-${entry.id}`, siteUrl).href,
      categories: [t(locale, `updates.type.${entry.type}` as UiKey)],
    })),
  });
};
