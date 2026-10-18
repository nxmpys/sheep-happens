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
  'level-view',
  'aoe-farming',
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
  'level-view': { id: 'level-view', slug: { es: 'nivelacion/por-nivel', en: 'leveling/by-level' }, parent: 'leveling' },
  'aoe-farming': { id: 'aoe-farming', slug: { es: 'farmeo-aoe', en: 'aoe-farming' }, parent: 'guide' },
  scrolls: { id: 'scrolls', slug: { es: 'pergaminos', en: 'scrolls' }, parent: 'guide' },
  combat: { id: 'combat', slug: { es: 'combate', en: 'combat' }, parent: 'home' },
  gear: { id: 'gear', slug: { es: 'equipo', en: 'gear' }, parent: 'home' },
  tools: { id: 'tools', slug: { es: 'herramientas', en: 'tools' }, parent: 'home' },
  addons: { id: 'addons', slug: { es: 'addons', en: 'addons' }, parent: 'home' },
  sources: { id: 'sources', slug: { es: 'fuentes', en: 'sources' }, parent: 'home' },
  updates: { id: 'updates', slug: { es: 'novedades', en: 'updates' }, parent: 'home' },
};

/** A labelled set of pages inside a menu group, e.g. the three talent trees under Reference. */
export interface NavCluster {
  cluster: 'trees';
  ids: PageId[];
}
export type NavEntry = PageId | NavCluster;

/**
 * One item of the primary navigation. A group with `page` links to that page
 * and opens its submenu from a separate button; a group without one is only a
 * submenu ("Start", "Reference"). An item with `page` and no `items` is a
 * direct link.
 */
export interface NavGroup {
  key: 'start' | 'builds' | 'reference' | 'tools' | 'addons';
  page?: PageId;
  items?: NavEntry[];
}

/**
 * Primary navigation, in display order, following a new player's path: start
 * (class guide, race, tree), builds, then reference pages. Every page appears
 * once. The previous/next links follow the same order (READING_ORDER), so the
 * two can never diverge.
 */
export const PRIMARY_NAV: readonly NavGroup[] = [
  { key: 'start', items: ['guide', 'races', 'talents'] },
  { key: 'builds', page: 'builds', items: ['leveling', 'level-view', 'builds-duel-30'] },
  {
    key: 'reference',
    items: ['changes', { cluster: 'trees', ids: ['talents-arcane', 'talents-fire', 'talents-frost'] }, 'combat', 'aoe-farming', 'scrolls', 'professions', 'gear'],
  },
  // The crit calculator has content of its own, so Tools stays a direct link next to Addons.
  { key: 'tools', page: 'tools' },
  { key: 'addons', page: 'addons' },
];

/** Pages of the primary navigation in menu order, groups first and then their items. */
export function navPages(nav: readonly NavGroup[] = PRIMARY_NAV): PageId[] {
  return nav.flatMap((group) => [
    ...(group.page ? [group.page] : []),
    ...(group.items ?? []).flatMap((entry) => (typeof entry === 'string' ? [entry] : entry.ids)),
  ]);
}

/** The guided reading order used for the previous/next links: the menu, top to bottom. */
export const READING_ORDER: readonly PageId[] = navPages();

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
  const index = READING_ORDER.indexOf(id);
  if (index === -1) return {};
  const prev = READING_ORDER[index - 1];
  const next = READING_ORDER[index + 1];
  return { ...(prev ? { prev } : {}), ...(next ? { next } : {}) };
}
