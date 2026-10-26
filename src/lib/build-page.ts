/**
 * Sections of a build page, in order. Every build page uses the same template
 * (BuildPage.astro); the route reads this list for the page index, so the
 * index and the page never diverge. Ids are fixed per locale for stable anchors.
 */
import { tb, type BuildUiKey } from '../i18n/builds';
import type { Locale } from '../i18n/routes';

export const BUILD_SECTIONS = [
  { key: 'pros', label: 'build.page.pros', id: { es: 'pros-y-contras', en: 'pros-and-cons' } },
  { key: 'talents', label: 'build.page.talents', id: { es: 'talentos', en: 'talents' } },
  { key: 'why', label: 'build.page.why', id: { es: 'por-que-estos-puntos', en: 'why-these-points' } },
  { key: 'variants', label: 'build.page.variants', id: { es: 'variantes', en: 'variants' } },
  { key: 'rotation', label: 'build.page.rotation', id: { es: 'rotacion', en: 'rotation' } },
  { key: 'stats', label: 'build.page.stats', id: { es: 'estadisticas-y-equipo', en: 'stats-and-gear' } },
] as const satisfies readonly { key: string; label: BuildUiKey; id: Record<Locale, string> }[];

export type BuildSectionKey = (typeof BUILD_SECTIONS)[number]['key'];

export function buildSections(locale: Locale): { key: BuildSectionKey; id: string; text: string }[] {
  return BUILD_SECTIONS.map((s) => ({ key: s.key, id: s.id[locale], text: tb(locale, s.label) }));
}
