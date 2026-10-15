/**
 * Single source of truth for every public URL.
 *
 * Slugs are localized but stable: they never carry a game version or season,
 * so links shared today keep working after the launch review. Changing a slug
 * here is a breaking change for inbound links; add a redirect if you do it.
 */

export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export const PAGE_IDS = [
  'home',
  'builds',
  'builds-duel-30',
  'races',
  'professions',
  'guide',
  'changes',
  'talents',
  'talents-arcane',
  'talents-fire',
  'talents-frost',
  'leveling',
  'scrolls',
  'combat',
  'gear',
  'tools',
  'addons',
  'sources',
  'updates',
] as const;
export type PageId = (typeof PAGE_IDS)[number];

export type Spec = 'arcane' | 'fire' | 'frost';

export interface RouteDef {
  id: PageId;
  slug: Record<Locale, string>;
  /** Parent page for breadcrumbs. */
  parent?: PageId;
  /** Talent tree this page belongs to, if any. */
  spec?: Spec;
  /**
   * Page tied to a passing event (e.g. the level 30 beta duel tournament).
   * It will be retired: see docs/content-roadmap.md for how to remove it.
   */
  temporary?: true;
}

export const ROUTES: Record<PageId, RouteDef> = {
  home: { id: 'home', slug: { es: '', en: '' } },
  builds: { id: 'builds', slug: { es: 'builds', en: 'builds' }, parent: 'home' },
  'builds-duel-30': {
    id: 'builds-duel-30',
    slug: { es: 'builds/duelos-nivel-30', en: 'builds/duels-level-30' },
    parent: 'builds',
    temporary: true,
  },
  races: { id: 'races', slug: { es: 'razas', en: 'races' }, parent: 'home' },
  professions: { id: 'professions', slug: { es: 'profesiones', en: 'professions' }, parent: 'home' },
  guide: { id: 'guide', slug: { es: 'guia', en: 'guide' }, parent: 'home' },
  changes: { id: 'changes', slug: { es: 'cambios', en: 'changes' }, parent: 'home' },
  talents: { id: 'talents', slug: { es: 'talentos', en: 'talents' }, parent: 'home' },
  'talents-arcane': {
    id: 'talents-arcane',
    slug: { es: 'talentos/arcano', en: 'talents/arcane' },
    parent: 'talents',
    spec: 'arcane',
  },
  'talents-fire': {
    id: 'talents-fire',
    slug: { es: 'talentos/fuego', en: 'talents/fire' },
    parent: 'talents',
    spec: 'fire',
  },
  'talents-frost': {
    id: 'talents-frost',
    slug: { es: 'talentos/escarcha', en: 'talents/frost' },
    parent: 'talents',
    spec: 'frost',
  },
  leveling: { id: 'leveling', slug: { es: 'nivelacion', en: 'leveling' }, parent: 'home' },
  scrolls: { id: 'scrolls', slug: { es: 'pergaminos', en: 'scrolls' }, parent: 'guide' },
  combat: { id: 'combat', slug: { es: 'combate', en: 'combat' }, parent: 'home' },
  gear: { id: 'gear', slug: { es: 'equipo', en: 'gear' }, parent: 'home' },
  tools: { id: 'tools', slug: { es: 'herramientas', en: 'tools' }, parent: 'home' },
  addons: { id: 'addons', slug: { es: 'addons', en: 'addons' }, parent: 'tools' },
  sources: { id: 'sources', slug: { es: 'fuentes', en: 'sources' }, parent: 'home' },
  updates: { id: 'updates', slug: { es: 'novedades', en: 'updates' }, parent: 'home' },
};

/** The guided reading order used for the previous/next links. */
export const LEARNING_PATH: readonly PageId[] = [
  'guide',
  'races',
  'professions',
  'changes',
  'talents',
  'talents-arcane',
  'talents-fire',
  'talents-frost',
  'leveling',
  'combat',
  'gear',
];

export interface NavItem {
  id: PageId;
  children?: PageId[];
}

/**
 * Primary navigation, in display order. What most visitors want (builds,
 * talents, races) comes first; the learning pages sit under the class guide.
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  // The leveling guide is also listed under Builds: that is where players look for a leveling build.
  { id: 'builds', children: ['leveling', 'builds-duel-30'] },
  { id: 'talents', children: ['talents-arcane', 'talents-fire', 'talents-frost'] },
  { id: 'races' },
  { id: 'professions' },
  { id: 'guide', children: ['leveling', 'scrolls', 'combat', 'gear'] },
  { id: 'changes' },
  { id: 'tools', children: ['addons'] },
];

export const FOOTER_NAV: readonly PageId[] = ['sources', 'updates', 'tools'];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

function normalizeBase(base: string): string {
  return base.endsWith('/') ? base : `${base}/`;
}

/**
 * Builds the path of a page, e.g. pathFor('talents-frost', 'es') → "/es/talentos/escarcha/".
 * `hash` is appended without encoding, so pass an already slugified anchor.
 */
export function pathFor(id: PageId, locale: Locale, opts: { base?: string; hash?: string } = {}): string {
  const base = normalizeBase(opts.base ?? '/');
  const slug = ROUTES[id].slug[locale];
  const path = `${base}${locale}/${slug ? `${slug}/` : ''}`;
  return opts.hash ? `${path}#${opts.hash}` : path;
}

/** Finds the page that owns a localized slug, or undefined. */
export function pageIdForSlug(locale: Locale, slug: string): PageId | undefined {
  const clean = slug.replace(/^\/+|\/+$/g, '');
  return PAGE_IDS.find((id) => ROUTES[id].slug[locale] === clean);
}

/** Ancestors from the root down to (and including) the given page. */
export function breadcrumbTrail(id: PageId): PageId[] {
  const trail: PageId[] = [];
  let current: PageId | undefined = id;
  while (current) {
    trail.unshift(current);
    current = ROUTES[current].parent;
  }
  return trail;
}

export function neighbours(id: PageId): { prev?: PageId; next?: PageId } {
  const index = LEARNING_PATH.indexOf(id);
  if (index === -1) return {};
  const prev = LEARNING_PATH[index - 1];
  const next = LEARNING_PATH[index + 1];
  return { ...(prev ? { prev } : {}), ...(next ? { next } : {}) };
}
