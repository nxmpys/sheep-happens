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
  'build.full': 'Ficha completa',
  'build.details': 'Talentos, cómo se juega y objetos',
  'build.detailsOrder': 'Talentos, orden de puntos, cómo se juega y objetos',
  'build.talents': 'Talentos',
  'build.playstyle': 'Cómo se juega',
  'build.strengths': 'Puntos fuertes',
  'build.weaknesses': 'Puntos débiles',
  'build.items': 'Objetos y consumibles',
  'build.version': 'Hecha para',
  'build.row': 'Fila {row}',
  'build.milestone': 'Talento decisivo',
  'build.unspent': 'Sin puntos',
  'build.levels': 'Niveles {from}–{to}',
  'build.order': 'Orden de puntos',
  'build.orderIntro': 'Un punto por nivel desde el 10: {points} puntos a nivel {level}. Con el perk de Legado Talented 5/5 empiezas a nivel 5 y llegas a {talented}: los últimos puntos de la tabla son solo para ti.',
  'build.orderIntroNoExtra': 'Un punto por nivel desde el 10: {points} puntos a nivel {level}. Con el perk de Legado Talented 5/5, cada punto llega 5 niveles antes.',
  'build.orderCaption': 'Orden de puntos de talento: {name}',
  'build.orderLevel': 'Nivel',
  'build.orderTalented': 'Con Talented',
  'build.orderTalent': 'Talento',
  'build.orderExtra': 'Solo con Talented',
  'build.orderExtraHeading': 'Puntos extra con Talented',
  'picker.label': 'Builds de leveo',
  'picker.goal': 'Objetivo',
  'picker.profile': 'Para quién',
  'picker.pro': 'A favor',
  'picker.con': 'En contra',
  'picker.recommended': 'Recomendada',
  'picker.hint': 'Elige una build para ver sus talentos y su orden de puntos.',
  'leveling.title': 'Estado de la guía',
  'leveling.beta': 'BETA',
  'leveling.covers': 'Cubre los niveles 1 a {level}',
  'leveling.complete': 'Guía completa del 1 al {level}',
  'leveling.stage': 'Niveles {from}–{to}',
  'leveling.stageFinal': 'Guía completa 1–{to}',
  'leveling.state.published': 'Publicada',
  'leveling.state.next': 'Próxima ampliación',
  'leveling.state.planned': 'Prevista',
  'leveling.note': 'Las builds están razonadas a partir de los datos de la beta, las mecánicas oficiales y las guías de la comunidad, pero aún no las hemos probado en el servidor. Las revisaremos al probarlas y tras el lanzamiento del 4 de noviembre.',
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
  'build.full': 'Full build',
  'build.details': 'Talents, how to play and items',
  'build.detailsOrder': 'Talents, point order, how to play and items',
  'build.talents': 'Talents',
  'build.playstyle': 'How to play',
  'build.strengths': 'Strengths',
  'build.weaknesses': 'Weaknesses',
  'build.items': 'Items and consumables',
  'build.version': 'Made for',
  'build.row': 'Row {row}',
  'build.milestone': 'Milestone talent',
  'build.unspent': 'No points',
  'build.levels': 'Levels {from}–{to}',
  'build.order': 'Point order',
  'build.orderIntro': 'One point per level from 10: {points} points at level {level}. With the Talented Legacy perk at 5/5 you start at level 5 and reach {talented}: the last points in the table are yours only.',
  'build.orderIntroNoExtra': 'One point per level from 10: {points} points at level {level}. With the Talented Legacy perk at 5/5, each point comes 5 levels earlier.',
  'build.orderCaption': 'Talent point order: {name}',
  'build.orderLevel': 'Level',
  'build.orderTalented': 'With Talented',
  'build.orderTalent': 'Talent',
  'build.orderExtra': 'Talented only',
  'build.orderExtraHeading': 'Extra points with Talented',
  'picker.label': 'Leveling builds',
  'picker.goal': 'Goal',
  'picker.profile': 'For',
  'picker.pro': 'Pro',
  'picker.con': 'Con',
  'picker.recommended': 'Recommended',
  'picker.hint': 'Pick a build to see its talents and point order.',
  'leveling.title': 'Guide status',
  'leveling.beta': 'BETA',
  'leveling.covers': 'Covers levels 1 to {level}',
  'leveling.complete': 'Complete guide from 1 to {level}',
  'leveling.stage': 'Levels {from}–{to}',
  'leveling.stageFinal': 'Complete guide 1–{to}',
  'leveling.state.published': 'Published',
  'leveling.state.next': 'Next update',
  'leveling.state.planned': 'Planned',
  'leveling.note': 'The builds are reasoned from beta data, official mechanics and community guides, but we have not tested them on the server yet. We will review them once tested and after the 4 November launch.',
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
