/**
 * Labels for the professions page, kept apart from ui.ts because only that page
 * uses them. Ratings reuse the racial value labels (Alto, Medio, Bajo, Nulo).
 */
import type { Locale } from './routes';
import type { Profession } from '../lib/schemas';

export const KIND_LABELS: Record<Locale, Record<Profession['kind'], string>> = {
  es: { crafting: 'Fabricación', gathering: 'Recolección', secondary: 'Secundaria' },
  en: { crafting: 'Crafting', gathering: 'Gathering', secondary: 'Secondary' },
};

export const EDGE_LABELS: Record<Locale, Record<Profession['edge'], string>> = {
  es: { combat: 'Ventaja de combate', economy: 'Sobre todo economía', utility: 'Comodidad y leveo' },
  en: { combat: 'Combat edge', economy: 'Mostly economy', utility: 'Convenience and leveling' },
};

export const PRIORITY_LABELS: Record<Locale, Record<NonNullable<Profession['priority']>, string>> = {
  es: { high: 'Alta', medium: 'Media', low: 'Baja' },
  en: { high: 'High', medium: 'Medium', low: 'Low' },
};

const es = {
  'rating.pve': 'PvE',
  'rating.pvp': 'JcJ',
  'rating.leveling': 'Leveo',
  'rating.economy': 'Economía',
  'rating.overall': 'General',
  'table.caption': 'Comparativa de las profesiones principales para un Mago',
  'table.profession': 'Profesión',
  'table.benefit': 'Beneficio principal',
  'table.limitation': 'Principal limitación',
  'pick.why': 'Por qué',
  'pick.advantage': 'Ventaja principal',
  'pick.sacrifice': 'Lo que sacrificas',
  'pick.profile': 'Para quién',
  'pick.alternative': 'Alternativa',
  'pick.pair': 'Profesiones recomendadas',
  'detail.summary': 'En resumen',
  'detail.pros': 'Ventajas',
  'detail.cons': 'Inconvenientes',
  'detail.pvePvp': 'PvE y JcJ',
  'detail.pve': 'PvE',
  'detail.pvp': 'JcJ',
  'detail.levelingEconomy': 'Leveo y economía',
  'detail.pair': 'Mejor combinación',
  'detail.verdict': 'Veredicto',
  'detail.items': 'Objetos que lo respaldan (datos del cliente)',
  'detail.priority': 'Prioridad',
  'detail.wowhead': 'ver en Wowhead, se abre en otra pestaña',
} as const;

export type ProfessionUiKey = keyof typeof es;

const en: Record<ProfessionUiKey, string> = {
  'rating.pve': 'PvE',
  'rating.pvp': 'PvP',
  'rating.leveling': 'Leveling',
  'rating.economy': 'Economy',
  'rating.overall': 'Overall',
  'table.caption': 'Comparison of the primary professions for a Mage',
  'table.profession': 'Profession',
  'table.benefit': 'Main benefit',
  'table.limitation': 'Main limitation',
  'pick.why': 'Why',
  'pick.advantage': 'Main advantage',
  'pick.sacrifice': 'What you give up',
  'pick.profile': 'Who it suits',
  'pick.alternative': 'Alternative',
  'pick.pair': 'Recommended professions',
  'detail.summary': 'In short',
  'detail.pros': 'Advantages',
  'detail.cons': 'Drawbacks',
  'detail.pvePvp': 'PvE and PvP',
  'detail.pve': 'PvE',
  'detail.pvp': 'PvP',
  'detail.levelingEconomy': 'Leveling and economy',
  'detail.pair': 'Best combination',
  'detail.verdict': 'Verdict',
  'detail.items': 'Items behind this (client data)',
  'detail.priority': 'Priority',
  'detail.wowhead': 'view on Wowhead, opens in a new tab',
};

const DICTIONARIES: Record<Locale, Record<ProfessionUiKey, string>> = { es, en };

export function tp(locale: Locale, key: ProfessionUiKey): string {
  return DICTIONARIES[locale][key];
}
