/**
 * Search engine helpers: page dates and schema.org structured data (JSON-LD).
 * Google uses Article dates, breadcrumbs and the WebSite name in results.
 */
import type { Locale, PageId } from '../i18n/routes';
import { changelog } from './data';

export const SITE_NAME = 'Sheep Happens';

/** Latest date a page changed: its manual review or a changelog entry that lists it. */
export function lastModified(pageId: PageId, reviewed: Date): Date {
  let latest = reviewed;
  for (const entry of changelog) {
    if (!entry.pages.includes(pageId)) continue;
    const date = new Date(`${entry.date}T00:00:00Z`);
    if (date > latest) latest = date;
  }
  return latest;
}

const IN_LANGUAGE: Record<Locale, string> = { es: 'es-ES', en: 'en-GB' };

interface ArticleInput {
  locale: Locale;
  url: string;
  homeUrl: string;
  title: string;
  description: string;
  published: Date;
  modified: Date;
  image: string;
}

/**
 * schema.org WebSite. Google reads the site name ("Sheep Happens" instead of the
 * host's name) from the home page at the root of the domain, so `url` and `@id`
 * always point at the root, also on the language home pages.
 */
export function websiteJsonLd(locale: Locale | 'all', siteUrl: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    name: SITE_NAME,
    alternateName: ['Sheep Happens Mage Guide', 'Guía de Mago Sheep Happens'],
    url: siteUrl,
    description,
    inLanguage: locale === 'all' ? Object.values(IN_LANGUAGE) : IN_LANGUAGE[locale],
  };
}

export function articleJsonLd(input: ArticleInput) {
  const organization = { '@type': 'Organization', name: SITE_NAME, url: input.homeUrl };
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    inLanguage: IN_LANGUAGE[input.locale],
    url: input.url,
    mainEntityOfPage: input.url,
    datePublished: input.published.toISOString().slice(0, 10),
    dateModified: input.modified.toISOString().slice(0, 10),
    image: input.image,
    author: organization,
    publisher: organization,
    isPartOf: { '@id': `${input.homeUrl}#website` },
    about: {
      '@type': 'VideoGame',
      name: 'World of Warcraft: Forever',
      publisher: { '@type': 'Organization', name: 'Blizzard Entertainment' },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
