import type { Locale } from '../i18n/routes';

interface Named {
  name: string;
  nameEs?: string | undefined;
}

/**
 * Name to show for a spell or talent. Spanish pages use the official Spanish
 * name when Blizzard has published one and keep the English name as a hint,
 * because many players use the English client and search in English.
 */
export function displayName(record: Named, locale: Locale): { primary: string; secondary?: string } {
  if (locale === 'es' && record.nameEs && record.nameEs !== record.name) {
    return { primary: record.nameEs, secondary: record.name };
  }
  return { primary: record.name };
}

/** Plain-text version, e.g. "Lanza de hielo (Ice Lance)". */
export function displayNameText(record: Named, locale: Locale): string {
  const { primary, secondary } = displayName(record, locale);
  return secondary ? `${primary} (${secondary})` : primary;
}

/** Just the localized name. */
export function localName(record: Named, locale: Locale): string {
  return displayName(record, locale).primary;
}
