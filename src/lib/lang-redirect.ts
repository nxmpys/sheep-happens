/**
 * Language of the site root (/) for a request: the reader's saved choice
 * (cookie set by the language switch) or, failing that, their browser's
 * Accept-Language. Used by functions/index.ts on Cloudflare Pages. Pure, so it
 * is unit tested.
 *
 * Requests without Accept-Language (search engine crawlers do not send one)
 * get no language: they receive the root page itself, which stays indexable
 * and keeps the WebSite data Google reads the site name from.
 */
import { LOCALES, type Locale } from '../i18n/routes';

export const LANG_COOKIE = 'sh-lang';

function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (LOCALES as readonly string[]).includes(value);
}

/** The saved language in a Cookie header, if any. */
export function savedLocale(cookieHeader: string | null): Locale | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(';')) {
    const [name, value] = part.trim().split('=');
    if (name === LANG_COOKIE && isLocale(value)) return value;
  }
  return undefined;
}

/**
 * Best language for an Accept-Language header ("es-ES,es;q=0.9,en;q=0.8").
 * Readers whose browser asks for neither Spanish nor English get English.
 */
export function negotiateLocale(acceptLanguage: string | null): Locale | undefined {
  if (!acceptLanguage?.trim()) return undefined;
  const ranked = acceptLanguage
    .split(',')
    .map((part, index) => {
      const [tag = '', ...params] = part.trim().split(';');
      const q = params.map((p) => /^\s*q=([\d.]+)\s*$/.exec(p)?.[1]).find(Boolean);
      return { lang: tag.trim().toLowerCase().slice(0, 2), q: q === undefined ? 1 : Number(q), index };
    })
    .filter((entry) => entry.lang && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  return ranked.map((entry) => entry.lang).find(isLocale) ?? 'en';
}

/** Saved choice first, then the browser's languages. */
export function rootLocale(cookieHeader: string | null, acceptLanguage: string | null): Locale | undefined {
  return savedLocale(cookieHeader) ?? negotiateLocale(acceptLanguage);
}
