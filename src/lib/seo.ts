/**
 * Search engine helpers: page dates and schema.org structured data (JSON-LD).
 * Google uses Article dates, breadcrumbs and the WebSite name in results.
 */
import type { Locale, PageId } from '../i18n/routes';
import { dataset } from './data';
import { latestDate, shownDataDates } from './page-dates';
import type { Addon } from './schemas';

export const SITE_NAME = 'Sheep Happens';

/**
 * Latest date a page changed, shown as its "Reviewed" date: its manual review,
 * a changelog entry that lists it, or the last update of any record it shows
 * (read from the data components in its MDX `body`). `extra` adds dates of data
 * a layout shows outside the MDX (the home status card).
 */
export function lastModified(pageId: PageId, reviewed: Date, body = '', extra: readonly string[] = []): Date {
  const listed = dataset.changelog.filter((entry) => entry.pages.includes(pageId)).map((entry) => entry.date);
  const layout = pageId === 'home' ? HOME_FACTS.flatMap((id) => dataset.facts.find((f) => f.id === id)?.updated ?? []) : [];
  return latestDate(reviewed, [...listed, ...shownDataDates(body, dataset), ...layout, ...extra]);
}

/** Facts the home page status card shows (HomeLayout.astro). */
export const HOME_FACTS = ['launch', 'beta'] as const;

const IN_LANGUAGE: Record<Locale, string> = { es: 'es-ES', en: 'en-GB' };

interface ArticleInput {
  locale: Locale;
  url: string;
  /** Root of the site (`https://sheephappens.app/`), where the WebSite node lives. */
  siteUrl: string;
  title: string;
  description: string;
  published: Date;
  modified: Date;
  image: string;
}

/**
 * The site as publisher and author. Same `@id` on every page so Google merges
 * the nodes; the logo (≥ 112 px, square) is the touch icon.
 */
function organization(siteUrl: string) {
  return {
    '@type': 'Organization',
    '@id': `${siteUrl}#organization`,
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}apple-touch-icon.png`,
  };
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
    publisher: organization(siteUrl),
  };
}

export function articleJsonLd(input: ArticleInput) {
  const publisher = organization(input.siteUrl);
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
    author: publisher,
    publisher,
    isPartOf: { '@id': `${input.siteUrl}#website` },
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

/**
 * schema.org SoftwareApplication for an addon on the addons page. No ratings or
 * download counts: only what addons.json states. The download page is linked
 * only once it is public.
 */
export function addonJsonLd(
  addon: Addon,
  locale: Locale,
  urls: { pageUrl: string; siteUrl: string; asset: (path: string) => string },
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: addon.name,
    description: addon.summary[locale],
    applicationCategory: 'GameApplication',
    applicationSubCategory: 'World of Warcraft addon',
    softwareVersion: addon.version,
    inLanguage: addon.languages.map((l) => IN_LANGUAGE[l]),
    isAccessibleForFree: true,
    image: urls.asset(addon.icon),
    screenshot: addon.screenshots.map((shot) => urls.asset(shot.src)),
    url: urls.pageUrl,
    ...(addon.listing === 'live' ? { downloadUrl: addon.url } : {}),
    ...(addon.origin === 'own' ? { author: { '@id': `${urls.siteUrl}#organization` } } : { author: { '@type': 'Person', name: addon.author } }),
    about: { '@type': 'VideoGame', name: 'World of Warcraft: Forever' },
  };
}
