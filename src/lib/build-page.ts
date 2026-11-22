/**
 * Sections of a build page, in order. Every build page uses the same template
 * (BuildPage.astro) and shows only the sections the build has data for; the
 * route reads this same list for the page index, so the index and the page
 * never diverge. Ids are fixed per locale for stable anchors.
 */
import { FOCUS_LABELS, FOCUS_LINES, tb, type BuildUiKey } from '../i18n/builds';
import type { Locale } from '../i18n/routes';
import { buildRole, type BuildRole } from './build-roles';
import { USE_FOCUSES, type Build, type BuildFocus, type BuildUse } from './schemas';

type SectionData = Pick<Build, 'reasons' | 'tips' | 'playstyle' | 'cooldowns' | 'itemIds' | 'items' | 'stats' | 'order' | 'variants'>;

export const BUILD_SECTIONS = [
  { key: 'talents', label: 'build.page.talents', id: { es: 'talentos', en: 'talents' }, shown: () => true },
  { key: 'why', label: 'build.page.why', id: { es: 'por-que-estos-talentos', en: 'why-these-talents' }, shown: (b: SectionData) => b.reasons.length > 0 },
  { key: 'tips', label: 'build.page.tips', id: { es: 'consejos', en: 'tips' }, shown: (b: SectionData) => b.tips.length > 0 },
  {
    key: 'rotation',
    label: 'build.page.rotation',
    id: { es: 'como-se-juega', en: 'how-to-play' },
    shown: (b: SectionData) => b.playstyle.length > 0 || b.cooldowns.length > 0,
  },
  {
    key: 'gear',
    label: 'build.page.gear',
    id: { es: 'equipo', en: 'gear' },
    shown: (b: SectionData) => b.itemIds.length > 0 || b.items.length > 0 || b.stats.length > 0,
  },
  { key: 'order', label: 'build.page.order', id: { es: 'orden-de-puntos', en: 'point-order' }, shown: (b: SectionData) => (b.order?.length ?? 0) > 0 },
  { key: 'variants', label: 'build.page.variants', id: { es: 'variantes', en: 'variants' }, shown: (b: SectionData) => b.variants.length > 0 },
] as const satisfies readonly { key: string; label: BuildUiKey; id: Record<Locale, string>; shown: (b: SectionData) => boolean }[];

export type BuildSectionKey = (typeof BUILD_SECTIONS)[number]['key'];

/** The sections this build shows, in page order: empty ones are left out of the page and its index. */
export function buildSections(locale: Locale, build: SectionData): { key: BuildSectionKey; id: string; text: string }[] {
  return BUILD_SECTIONS.filter((s) => s.shown(build)).map((s) => ({ key: s.key, id: s.id[locale], text: tb(locale, s.label) }));
}

/** Anchor of each focus heading on a content page. */
const FOCUS_IDS: Record<Locale, Record<BuildFocus, string>> = {
  es: { aoe: 'aoe', 'single-target': 'un-objetivo', battlegrounds: 'campos-de-batalla', 'world-pvp': 'jcj-de-mundo' },
  en: { aoe: 'aoe', 'single-target': 'single-target', battlegrounds: 'battlegrounds', 'world-pvp': 'world-pvp' },
};

const ROLE_ORDER: Record<BuildRole, number> = { recommended: 0, viable: 1, 'not-recommended': 2 };

export interface FocusSection<B> {
  focus: BuildFocus;
  id: string;
  text: string;
  line: string | undefined;
  builds: B[];
}

/**
 * A content page (/builds/<use>/), grouped by focus: one section per focus
 * that has builds, in USE_FOCUSES order, recommended build first. The route
 * reads the same list for the page index (an h2 per focus, an h3 per build).
 */
export function focusSections<B extends Pick<Build, 'uses' | 'focus' | 'recommendedFor' | 'discouragedFor'>>(
  use: BuildUse,
  locale: Locale,
  builds: readonly B[],
): FocusSection<B>[] {
  return USE_FOCUSES[use]
    .map((focus) => ({
      focus,
      id: FOCUS_IDS[locale][focus],
      text: FOCUS_LABELS[locale][focus],
      line: FOCUS_LINES[locale][`${use}/${focus}`],
      builds: builds
        .filter((b) => b.uses.includes(use) && b.focus === focus)
        .sort((a, b) => ROLE_ORDER[buildRole(a, use)] - ROLE_ORDER[buildRole(b, use)]),
    }))
    .filter((section) => section.builds.length > 0);
}

/** Anchor of a build's heading on a content page. */
export function buildAnchor(build: Pick<Build, 'slug'>, locale: Locale): string {
  return build.slug[locale];
}
