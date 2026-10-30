import type { Locale } from '../i18n/routes';
import { spanishName } from './spell-names';

interface Named {
  /** English name, as in the data files. */
  name: string;
}

/**
 * Name to show for a spell or talent. Spanish pages use the verified Spanish
 * name from the dictionary (spell-names.json) and keep the English name as a
 * hint, because many players use the English client and search in English.
 * Without a verified Spanish name, the English one is used.
 */
export function displayName(record: Named, locale: Locale): { primary: string; secondary?: string } {
  const es = locale === 'es' ? spanishName(record.name) : undefined;
  if (es && es !== record.name) return { primary: es, secondary: record.name };
  return { primary: record.name };
}

/** Just the localized name. */
export function localName(record: Named, locale: Locale): string {
  return displayName(record, locale).primary;
}

/** Localized form of any English spell name, e.g. a former talent name. */
export function localSpellName(english: string, locale: Locale): string {
  return localName({ name: english }, locale);
}
