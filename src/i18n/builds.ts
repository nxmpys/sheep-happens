/**
 * Labels for builds and races, kept apart from ui.ts because only the builds
 * and races pages use them.
 */
import type { Locale } from './routes';
import type { BuildFocus, BuildSpec, BuildUse, Racial } from '../lib/schemas';
import type { BuildGroup } from '../lib/build-routes';

export const USE_LABELS: Record<Locale, Record<BuildUse, string>> = {
  es: { leveling: 'Leveo', dungeons: 'Mazmorras', raid: 'Banda', pvp: 'JcJ' },
  en: { leveling: 'Leveling', dungeons: 'Dungeons', raid: 'Raid', pvp: 'PvP' },
};

/** Content blocks of the builds index, with their level range. */
export const USE_TITLES: Record<Locale, Record<BuildUse, string>> = {
  es: { leveling: 'Leveo 1-60', dungeons: 'Mazmorras 60', raid: 'Banda 60', pvp: 'JcJ 60' },
  en: { leveling: 'Leveling 1-60', dungeons: 'Dungeons 60', raid: 'Raid 60', pvp: 'PvP 60' },
};

/** The three groups of the builds index filters and the menu. */
export const GROUP_LABELS: Record<Locale, Record<BuildGroup, string>> = {
  es: { leveling: 'Leveo', pve: 'PvE', pvp: 'JcJ' },
  en: { leveling: 'Leveling', pve: 'PvE', pvp: 'PvP' },
};

export const FOCUS_LABELS: Record<Locale, Record<BuildFocus, string>> = {
  es: { aoe: 'AoE', 'single-target': 'Un objetivo', battlegrounds: 'Campos de batalla', 'world-pvp': 'JcJ de mundo' },
  en: { aoe: 'AoE', 'single-target': 'Single target', battlegrounds: 'Battlegrounds', 'world-pvp': 'World PvP' },
};

/** One line under each focus heading of a content page: what that focus is for there. */
export const FOCUS_LINES: Record<Locale, Partial<Record<`${BuildUse}/${BuildFocus}`, string>>> = {
  es: {
    'leveling/aoe': 'Subir en solitario reuniendo grupos de enemigos y matándolos con área.',
    'leveling/single-target': 'Subir con misiones, de uno en uno.',
    'dungeons/aoe': 'Limpiar grupos sin quitarle los enemigos al tanque.',
    'dungeons/single-target': 'Mucho daño a un objetivo, para jefes y enemigos peligrosos.',
    'raid/single-target': 'Mucho daño a un objetivo y maná para peleas largas.',
    'pvp/battlegrounds': 'Control y silencio para pelear en grupo.',
    'pvp/world-pvp': 'Pelear y farmear a la vez en el mundo.',
  },
  en: {
    'leveling/aoe': 'Level solo by gathering packs of enemies and killing them with AoE.',
    'leveling/single-target': 'Level with quests, one enemy at a time.',
    'dungeons/aoe': 'Clear packs without pulling enemies off the tank.',
    'dungeons/single-target': 'High single-target damage, for bosses and dangerous enemies.',
    'raid/single-target': 'High single-target damage and mana for long fights.',
    'pvp/battlegrounds': 'Control and silence for group fights.',
    'pvp/world-pvp': 'Fight and farm at the same time in the world.',
  },
};

/** Title of each content page (/builds/<use>/), and the longer one for search results. */
export const CONTENT_PAGES: Record<Locale, Record<BuildUse, { title: string; seoTitle: string }>> = {
  es: {
    leveling: { title: 'Builds de leveo', seoTitle: 'Builds de leveo del Mago, del 1 al 60' },
    dungeons: { title: 'Builds de mazmorras', seoTitle: 'Builds de mazmorras del Mago a nivel 60' },
    raid: { title: 'Builds de banda', seoTitle: 'Builds de banda del Mago a nivel 60' },
    pvp: { title: 'Builds de JcJ', seoTitle: 'Builds de JcJ del Mago a nivel 60' },
  },
  en: {
    leveling: { title: 'Leveling builds', seoTitle: 'Mage leveling builds, from 1 to 60' },
    dungeons: { title: 'Dungeon builds', seoTitle: 'Mage dungeon builds at level 60' },
    raid: { title: 'Raid builds', seoTitle: 'Mage raid builds at level 60' },
    pvp: { title: 'PvP builds', seoTitle: 'Mage PvP builds at level 60' },
  },
};

export const SPEC_LABELS: Record<Locale, Record<BuildSpec, string>> = {
  es: { arcane: 'Arcano', fire: 'Fuego', frost: 'Escarcha' },
  en: { arcane: 'Arcane', fire: 'Fire', frost: 'Frost' },
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
  'build.legacy': 'Legado: Talentoso {rank}/5',
  'build.legacyHint': 'La ventaja de Legado Talentoso adelanta los puntos de talento: a este nivel tienes {extra} más.',
  'build.points': 'Arcano / Fuego / Escarcha',
  'build.keyTalents': 'Talentos clave',
  'build.wowhead': 'Ver en Wowhead',
  'build.wowheadHint': 'se abre en otra pestaña',
  'build.calc': 'Abrir en la calculadora',
  'build.copy': 'Copiar enlace',
  'build.guide': 'Guía en profundidad',
  'build.full': 'Ficha completa',
  'build.details': 'Talentos, cómo se juega y objetos',
  'build.detailsOrder': 'Talentos, orden de puntos, cómo se juega y objetos',
  'build.talents': 'Talentos',
  'build.playstyle': 'Cómo se juega',
  'build.items': 'Objetos y consumibles',
  'build.version': 'Hecha para',
  'build.checked': 'Revisada',
  'build.row': 'Fila {row}',
  'build.milestone': 'Talento decisivo',
  'build.levels': 'Niveles {from}–{to}',
  'build.order': 'Orden de puntos',
  'build.orderIntro': 'Un punto por nivel desde el 10: {points} puntos a nivel {level}. Con la ventaja de Legado Talentoso 5/5 empiezas a nivel 5 y llegas a {talented}.',
  'build.orderIntroNoExtra': 'Un punto por nivel desde el 10: {points} puntos a nivel {level}. Con la ventaja de Legado Talentoso 5/5, cada punto llega 5 niveles antes.',
  'build.talentedToggle': 'Tengo Talentoso 5/5',
  'build.talentedHint': 'Ventaja de Legado: niveles con Talentoso y puntos extra. Se recuerda en todas las tablas.',
  'build.orderCaption': 'Orden de puntos de talento: {name}',
  'build.orderLevel': 'Nivel',
  'build.orderWithTalented': 'con Talentoso',
  'build.orderTalent': 'Talento',
  'build.orderExtra': 'Solo con Talentoso',
  'build.orderExtraHeading': 'Puntos extra con Talentoso',
  'build.recommended': 'Recomendada',
  'build.viable': 'Viable',
  'build.roleHint.recommended': '{use}, nivel {level}: la build recomendada',
  'build.roleHint.viable': '{use}, nivel {level}: una alternativa viable, no la recomendada',
  'build.not-recommended': 'No recomendada',
  'build.roleHint.not-recommended': '{use}, nivel {level}: funciona, pero no la recomiendo',
  'build.hybrid': '{spec} con {other}',
  'build.page.talents': 'Talentos',
  'build.page.why': 'Por qué estos talentos',
  'build.page.tips': 'Consejos',
  'build.page.variants': 'Variantes',
  'build.page.rotation': 'Cómo se juega',
  'build.page.rotation.cooldowns': 'Cooldowns y maná',
  'build.page.gear': 'Equipo',
  'build.page.stats': 'Estadísticas, de más a menos importante',
  'build.page.order': 'Orden de puntos',
  'build.page.orderOpen': 'Ver el orden nivel a nivel',
  'build.page.pro': 'A favor',
  'build.page.con': 'En contra',
  'variant.out': 'Quitas',
  'variant.in': 'Pones',
  'index.none': 'Todavía no hay builds de este contenido.',
  'index.filter': 'Filtrar las builds por contenido',
  'index.all': 'Todas',
  'index.pros': 'A favor',
  'index.cons': 'En contra',
  'build.playing': 'Jugando actualmente',
  'variant.final': 'Build final:',
  'build.open': 'Ver la build',
  'content.guides': 'Aprende a jugarlo',
  'spec.strengths': 'Fortalezas',
  'spec.weaknesses': 'Debilidades',
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
  'build.wowhead': 'View on Wowhead',
  'build.wowheadHint': 'opens in a new tab',
  'build.calc': 'Open in the calculator',
  'build.copy': 'Copy link',
  'build.guide': 'In-depth guide',
  'build.full': 'Full build',
  'build.details': 'Talents, how to play and items',
  'build.detailsOrder': 'Talents, point order, how to play and items',
  'build.talents': 'Talents',
  'build.playstyle': 'How to play',
  'build.items': 'Items and consumables',
  'build.version': 'Made for',
  'build.checked': 'Checked',
  'build.row': 'Row {row}',
  'build.milestone': 'Milestone talent',
  'build.levels': 'Levels {from}–{to}',
  'build.order': 'Point order',
  'build.orderIntro': 'One point per level from 10: {points} points at level {level}. With the Talented Legacy perk at 5/5 you start at level 5 and reach {talented}.',
  'build.orderIntroNoExtra': 'One point per level from 10: {points} points at level {level}. With the Talented Legacy perk at 5/5, each point comes 5 levels earlier.',
  'build.talentedToggle': 'I have Talented 5/5',
  'build.talentedHint': 'Legacy perk: levels with Talented and the extra points. Remembered in every table.',
  'build.orderCaption': 'Talent point order: {name}',
  'build.orderLevel': 'Level',
  'build.orderWithTalented': 'with Talented',
  'build.orderTalent': 'Talent',
  'build.orderExtra': 'Talented only',
  'build.orderExtraHeading': 'Extra points with Talented',
  'build.recommended': 'Recommended',
  'build.viable': 'Viable',
  'build.roleHint.recommended': '{use}, level {level}: the recommended build',
  'build.roleHint.viable': '{use}, level {level}: a viable alternative, not the recommended one',
  'build.not-recommended': 'Not recommended',
  'build.roleHint.not-recommended': '{use}, level {level}: it works, but I do not recommend it',
  'build.hybrid': '{spec} with {other}',
  'build.page.talents': 'Talents',
  'build.page.why': 'Why these talents',
  'build.page.tips': 'Tips',
  'build.page.variants': 'Variants',
  'build.page.rotation': 'How to play',
  'build.page.rotation.cooldowns': 'Cooldowns and mana',
  'build.page.gear': 'Gear',
  'build.page.stats': 'Stats, most important first',
  'build.page.order': 'Point order',
  'build.page.orderOpen': 'Show the order level by level',
  'build.page.pro': 'Upside',
  'build.page.con': 'Downside',
  'variant.out': 'Take out',
  'variant.in': 'Put in',
  'index.none': 'No builds for this content yet.',
  'index.filter': 'Filter the builds by content',
  'index.all': 'All',
  'index.pros': 'Upside',
  'index.cons': 'Downside',
  'build.playing': 'Currently playing',
  'variant.final': 'Final build:',
  'build.open': 'Open the build',
  'content.guides': 'Learn to play it',
  'spec.strengths': 'Strengths',
  'spec.weaknesses': 'Weaknesses',
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
