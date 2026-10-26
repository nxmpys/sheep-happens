/**
 * URLs of the build pages:
 *
 * - one page per content that has builds: /es/builds/leveo/, /en/builds/leveling/;
 * - one page per build, under its first use: /es/builds/leveo/pirofrio-en-solitario/.
 *
 * A build that covers several contents has one canonical URL, from the first
 * of its `uses`; the other content pages list it and link there. Plain
 * functions with no data imports, so astro.config.mjs can use them for the sitemap.
 */
import type { Locale } from '../i18n/routes';
import type { Build, BuildSpec, BuildUse } from './schemas';

export const USE_SLUGS: Record<Locale, Record<BuildUse, string>> = {
  es: { leveling: 'leveo', pvp: 'jcj', dungeons: 'mazmorras', raid: 'banda' },
  en: { leveling: 'leveling', pvp: 'pvp', dungeons: 'dungeons', raid: 'raid' },
};

type Routable = Pick<Build, 'uses' | 'slug'>;

function normalizeBase(base = '/'): string {
  return base.replace(/\/?$/, '/');
}

/** The content that gives the build its URL. */
export function canonicalUse(build: Pick<Build, 'uses'>): BuildUse {
  return build.uses[0]!;
}

/** e.g. contentPath('leveling', 'es') → "/es/builds/leveo/". */
export function contentPath(use: BuildUse, locale: Locale, opts: { base?: string } = {}): string {
  return `${normalizeBase(opts.base)}${locale}/builds/${USE_SLUGS[locale][use]}/`;
}

/** e.g. buildPath(build, 'es') → "/es/builds/leveo/pirofrio-en-solitario/". */
export function buildPath(build: Routable, locale: Locale, opts: { base?: string; hash?: string } = {}): string {
  const path = `${contentPath(canonicalUse(build), locale, opts)}${build.slug[locale]}/`;
  return opts.hash ? `${path}#${opts.hash}` : path;
}

/** Contents with at least one build: only those get a page. */
export function usedContents(builds: readonly Pick<Build, 'uses'>[]): BuildUse[] {
  return [...new Set(builds.flatMap((b) => b.uses))];
}

/** Builds that would share a URL (same first use and slug, in either locale). */
export function routeConflicts(builds: readonly (Routable & { id: string })[]): string[] {
  const problems: string[] = [];
  for (const locale of ['es', 'en'] as const) {
    const seen = new Map<string, string>();
    for (const build of builds) {
      const key = buildPath(build, locale);
      const other = seen.get(key);
      if (other) problems.push(`"${build.id}" and "${other}" would share the URL ${key}: change the first use or the slug`);
      else seen.set(key, build.id);
    }
  }
  return problems;
}

/** Icon of a build: Frostfire for Frost builds that also take Fire, otherwise its tree. */
export function buildIcon(build: Pick<Build, 'spec' | 'hybridWith'>): BuildSpec | 'frostfire' {
  const pair = new Set([build.spec, build.hybridWith]);
  return pair.has('frost') && pair.has('fire') ? 'frostfire' : build.spec;
}
