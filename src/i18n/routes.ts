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
  'learn',
  'builds',
  'guides',
  'races',
  'professions',
  'legacy',
  'library',
  'pvp',
  'changes',
  'talents',
  'talents-arcane',
  'talents-fire',
  'talents-frost',
  'leveling',
  'aoe-farming',
  'gear',
  'tools',
  'talent-calc',
  'addons',
  'sources',
  'updates',
  'about',
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
  learn: { id: 'learn', slug: { es: 'aprende', en: 'learn' }, parent: 'home' },
  builds: { id: 'builds', slug: { es: 'builds', en: 'builds' }, parent: 'home' },
  guides: { id: 'guides', slug: { es: 'guias', en: 'guides' }, parent: 'home' },
  // Races and professions kept their first slugs when they moved under Guides, so old links still work.
  races: { id: 'races', slug: { es: 'razas', en: 'races' }, parent: 'guides' },
  professions: { id: 'professions', slug: { es: 'profesiones', en: 'professions' }, parent: 'guides' },
  legacy: { id: 'legacy', slug: { es: 'legado', en: 'legacy' }, parent: 'guides' },
  library: { id: 'library', slug: { es: 'biblioteca', en: 'library' }, parent: 'guides' },
  pvp: { id: 'pvp', slug: { es: 'jcj', en: 'pvp' }, parent: 'guides' },
  // The change explorer moved from Learn to Tools (30 Oct 2026) keeping its slug: it is a lookup for people who know Classic.
  changes: { id: 'changes', slug: { es: 'cambios', en: 'changes' }, parent: 'tools' },
  // Talents and the three tree pages moved back from Builds to Learn (30 Oct 2026) keeping their slugs.
  talents: { id: 'talents', slug: { es: 'talentos', en: 'talents' }, parent: 'learn' },
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
  // Leveling became «First steps in Azeroth» under Learn (30 Oct 2026) keeping its slug, so old links still work.
  leveling: { id: 'leveling', slug: { es: 'nivelacion', en: 'leveling' }, parent: 'learn' },
  // AoE farming moved from Builds to Guides (26 Oct 2026) keeping its slug.
  'aoe-farming': { id: 'aoe-farming', slug: { es: 'farmeo-aoe', en: 'aoe-farming' }, parent: 'guides' },
  // Gear moved from Learn to Guides (20 Oct 2026) keeping its slug: leveling and PvE gear plus the class quests; PvP gear lives in the PvP guide.
  gear: { id: 'gear', slug: { es: 'equipo', en: 'gear' }, parent: 'guides' },
  tools: { id: 'tools', slug: { es: 'herramientas', en: 'tools' }, parent: 'home' },
  'talent-calc': { id: 'talent-calc', slug: { es: 'herramientas/calculadora-talentos', en: 'tools/talent-calculator' }, parent: 'tools' },
  // Addons moved under Tools (31 Oct 2026) as the MageProcs page, keeping its slug: it is the top search page.
  addons: { id: 'addons', slug: { es: 'addons', en: 'addons' }, parent: 'tools' },
  sources: { id: 'sources', slug: { es: 'fuentes', en: 'sources' }, parent: 'home' },
  updates: { id: 'updates', slug: { es: 'novedades', en: 'updates' }, parent: 'home' },
  about: { id: 'about', slug: { es: 'sobre-mi', en: 'about' }, parent: 'home' },
};

/**
 * One entry of the primary navigation: a hub page and the pages it leads to.
 * Each hub page lists its `items` as cards (HubCards), the menu shows them in
 * the entry's dropdown (src/lib/nav-menu.ts), and the previous/next links walk
 * hubs and items in this order (READING_ORDER), so the three never diverge.
 */
export interface NavGroup {
  key: 'learn' | 'builds' | 'guides' | 'tools';
  page: PageId;
  items?: PageId[];
  /** Sections of the hub page itself that the dropdown also links to, with their heading id per locale. */
  sections?: NavSection[];
}

export interface NavSection {
  hash: Record<Locale, string>;
  label: Record<Locale, string>;
}

/**
 * Four entries: the path for someone new to the class (the Learn page holds the
 * class and its combat, then the talents and each tree, then the first steps in
 * the world); builds (a tree, its talents and the content it is for); guides,
 * which explain something concrete whatever the build (AoE farming, race,
 * professions, Legacy, gear and class quests, books and scrolls, PvP); and the
 * tools (the change explorer and the MageProcs addon among them).
 */
export const PRIMARY_NAV: readonly NavGroup[] = [
  {
    key: 'learn',
    page: 'learn',
    items: ['talents', 'talents-arcane', 'talents-fire', 'talents-frost', 'leveling'],
    sections: [
      { hash: { es: 'qué-lo-diferencia', en: 'what-sets-it-apart' }, label: { es: 'La clase', en: 'The class' } },
      { hash: { es: 'el-kit-de-todo-mago', en: 'the-toolkit-every-mage-has' }, label: { es: 'Combate', en: 'Combat' } },
      { hash: { es: 'glosario', en: 'glossary' }, label: { es: 'Glosario', en: 'Glossary' } },
    ],
  },
  { key: 'builds', page: 'builds' },
  {
    key: 'guides',
    page: 'guides',
    items: ['aoe-farming', 'races', 'professions', 'legacy', 'gear', 'library', 'pvp'],
  },
  {
    key: 'tools',
    page: 'tools',
    items: ['talent-calc', 'changes', 'addons'],
    sections: [
      { hash: { es: 'multiplicador-de-crítico', en: 'crit-multiplier' }, label: { es: 'Multiplicador de crítico', en: 'Crit multiplier' } },
      { hash: { es: 'golpe-con-hechizos', en: 'spell-hit' }, label: { es: 'Golpe con hechizos', en: 'Spell hit' } },
    ],
  },
];

/** Pages of the primary navigation in menu order, groups first and then their items. */
export function navPages(nav: readonly NavGroup[] = PRIMARY_NAV): PageId[] {
  return nav.flatMap((group) => [group.page, ...(group.items ?? [])]);
}

/** The guided reading order used for the previous/next links: the menu, top to bottom. */
export const READING_ORDER: readonly PageId[] = navPages();

export const FOOTER_NAV: readonly PageId[] = ['changes', 'updates', 'sources', 'tools', 'about'];

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
