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

export function websiteJsonLd(locale: Locale, homeUrl: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${homeUrl}#website`,
    name: SITE_NAME,
    alternateName: locale === 'es' ? 'Guía de Mago para WoW Forever' : 'WoW Forever Mage guide',
    url: homeUrl,
    description,
    inLanguage: IN_LANGUAGE[locale],
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
