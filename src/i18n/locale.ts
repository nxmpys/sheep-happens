import { DEFAULT_LOCALE, isLocale, pathFor, type Locale, type PageId } from './routes';

interface AstroLike {
  params: Record<string, string | undefined>;
}

/** Locale of the page being rendered, read from the [lang] route parameter. */
export function getLocale(astro: AstroLike): Locale {
  const lang = astro.params['lang'];
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}

/** pathFor() bound to the configured base path. */
export function href(id: PageId, locale: Locale, hash?: string): string {
  return pathFor(id, locale, { base: import.meta.env.BASE_URL, ...(hash ? { hash } : {}) });
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es';
}

/** Picks the text for the current locale from a { es, en } object. */
export function pick<T>(value: Record<Locale, T>, locale: Locale): T {
  return value[locale];
}
