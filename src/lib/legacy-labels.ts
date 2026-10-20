import type { Locale } from '../i18n/routes';
import type { LegacyPerk, LegacyTree } from './schemas';

/** Tree names as the Spanish and English clients show them. */
export const LEGACY_TREE_LABELS: Record<Locale, Record<LegacyTree, string>> = {
  es: { professions: 'Profesiones', adventure: 'Aventura', resourcefulness: 'Ingenio' },
  en: { professions: 'Professions', adventure: 'Adventure', resourcefulness: 'Resourcefulness' },
};

export const MAGE_VALUE_LABELS: Record<Locale, Record<LegacyPerk['mage'], string>> = {
  es: { high: 'Muy útil', medium: 'Útil a veces', low: 'Poco útil' },
  en: { high: 'Very useful', medium: 'Sometimes useful', low: 'Little use' },
};
