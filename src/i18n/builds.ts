/**
 * Labels for builds and races, kept apart from ui.ts because only the builds,
 * races and duel pages use them.
 */
import type { Locale } from './routes';
import type { BuildSpec, BuildUse, Racial } from '../lib/schemas';

export const USE_LABELS: Record<Locale, Record<BuildUse, string>> = {
  es: { leveling: 'Leveo', aoe: 'Farmeo en área', dungeons: 'Mazmorras', raid: 'Banda', pvp: 'JcJ', duels: 'Duelos' },
  en: { leveling: 'Leveling', aoe: 'AoE farming', dungeons: 'Dungeons', raid: 'Raid', pvp: 'PvP', duels: 'Duels' },
};

export const SPEC_LABELS: Record<Locale, Record<BuildSpec, string>> = {
  es: { arcane: 'Arcano', fire: 'Fuego', frost: 'Escarcha', hybrid: 'Híbrida' },
  en: { arcane: 'Arcane', fire: 'Fire', frost: 'Frost', hybrid: 'Hybrid' },
};

/** What we will publish for a use that has no build yet, and when. */
export const USE_PENDING: Record<Locale, Record<BuildUse, string>> = {
  es: {
    leveling: 'Llegarán con el lanzamiento (4 de noviembre): una build por rama, con el orden de puntos del 10 al 60.',
    aoe: 'Tras el lanzamiento, cuando podamos probar los recorridos de farmeo con los cambios a Cono de frío y Ventisca mejorada.',
    dungeons: 'Cuando haya mazmorras de nivel alto que probar tras el lanzamiento.',
    raid: 'Cuando se abran las primeras bandas de nivel 60.',
    pvp: 'Para campos de batalla y JcJ de mundo a nivel 60, tras el lanzamiento.',
    duels: 'Para duelos a nivel 60, tras el lanzamiento.',
  },
  en: {
    leveling: 'Coming at launch (4 November): one build per tree, with the point order from 10 to 60.',
    aoe: 'After launch, once we can test farming routes with the Cone of Cold and Improved Blizzard changes.',
    dungeons: 'Once there are high-level dungeons to test after launch.',
    raid: 'Once the first level 60 raids open.',
    pvp: 'For battlegrounds and world PvP at level 60, after launch.',
    duels: 'For level 60 duels, after launch.',
  },
};

export const FACTION_LABELS: Record<Locale, Record<'alliance' | 'horde', string>> = {
  es: { alliance: 'Alianza', horde: 'Horda' },
  en: { alliance: 'Alliance', horde: 'Horde' },
};

export const VALUE_LABELS: Record<Locale, Record<Racial['value'], string>> = {
  es: { high: 'Alto', medium: 'Medio', low: 'Bajo', none: 'Nulo' },
  en: { high: 'High', medium: 'Medium', low: 'Low', none: 'None' },
};

const es = {
  'build.level': 'Nivel {level}',
  'build.totalPoints': '{points} puntos',
  'build.legacy': 'Legado: Talented {rank}/5',
  'build.legacyHint': 'El perk de Legado Talented adelanta los puntos de talento: a este nivel tienes {extra} más.',
  'build.points': 'Arcano / Fuego / Escarcha',
  'build.keyTalents': 'Talentos clave',
  'build.wowhead': 'Abrir en la calculadora de Wowhead',
  'build.wowheadHint': 'se abre en otra pestaña',
  'build.copy': 'Copiar enlace',
  'build.guide': 'Guía en profundidad',
  'build.details': 'Talentos, cómo se juega y objetos',
  'build.talents': 'Talentos',
  'build.playstyle': 'Cómo se juega',
  'build.strengths': 'Puntos fuertes',
  'build.weaknesses': 'Puntos débiles',
  'build.items': 'Objetos y consumibles',
  'build.version': 'Hecha para',
  'build.row': 'Fila {row}',
  'build.milestone': 'Talento decisivo',
  'build.unspent': 'Sin puntos',
  'builds.filters': 'Filtrar builds',
  'builds.use': 'Para qué',
  'builds.spec': 'Rama',
  'builds.all': 'Todas',
  'builds.count': 'Mostrando {shown} de {total} builds',
  'builds.reset': 'Quitar filtros',
  'builds.share': 'Copiar enlace con estos filtros',
  'builds.pendingTitle': '{use}: todavía sin build',
  'builds.empty': 'Todavía no hay builds con estos filtros.',
  'race.racials': 'Raciales',
  'race.active': 'Activa',
  'race.passive': 'Pasiva',
  'race.value': 'Valor para el Mago',
  'race.new': 'Nuevo Mago en Forever',
} as const;

export type BuildUiKey = keyof typeof es;

const en: Record<BuildUiKey, string> = {
  'build.level': 'Level {level}',
  'build.totalPoints': '{points} points',
  'build.legacy': 'Legacy: Talented {rank}/5',
  'build.legacyHint': 'The Talented Legacy perk gives talent points earlier: at this level you have {extra} more.',
  'build.points': 'Arcane / Fire / Frost',
  'build.keyTalents': 'Key talents',
  'build.wowhead': 'Open in the Wowhead calculator',
  'build.wowheadHint': 'opens in a new tab',
  'build.copy': 'Copy link',
  'build.guide': 'In-depth guide',
  'build.details': 'Talents, how to play and items',
  'build.talents': 'Talents',
  'build.playstyle': 'How to play',
  'build.strengths': 'Strengths',
  'build.weaknesses': 'Weaknesses',
  'build.items': 'Items and consumables',
  'build.version': 'Made for',
  'build.row': 'Row {row}',
  'build.milestone': 'Milestone talent',
  'build.unspent': 'No points',
  'builds.filters': 'Filter builds',
  'builds.use': 'Use',
  'builds.spec': 'Tree',
  'builds.all': 'All',
  'builds.count': 'Showing {shown} of {total} builds',
  'builds.reset': 'Clear filters',
  'builds.share': 'Copy link with these filters',
  'builds.pendingTitle': '{use}: no build yet',
  'builds.empty': 'No builds match these filters yet.',
  'race.racials': 'Racials',
  'race.active': 'Active',
  'race.passive': 'Passive',
  'race.value': 'Value for a Mage',
  'race.new': 'New Mage in Forever',
};

const DICTIONARIES: Record<Locale, Record<BuildUiKey, string>> = { es, en };

export function tb(locale: Locale, key: BuildUiKey, vars: Record<string, string | number> = {}): string {
  return DICTIONARIES[locale][key].replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}
