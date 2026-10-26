/**
 * Recommended, viable or not recommended: in each use, one build is the
 * recommended one for its level (`recommendedFor` in builds.json), builds that
 * work but I advise against are `discouragedFor`, and the rest are viable.
 * We only publish builds that make sense for the content (no Arcane AoE build
 * just to have one), so a use may have builds in a single tree.
 */
import type { Build, BuildUse } from './schemas';

export type BuildRole = 'recommended' | 'viable' | 'not-recommended';

export function buildRole(build: Pick<Build, 'recommendedFor' | 'discouragedFor'>, use: BuildUse): BuildRole {
  if (build.recommendedFor.includes(use)) return 'recommended';
  if (build.discouragedFor.includes(use)) return 'not-recommended';
  return 'viable';
}

/** More than one recommended build for the same use and level. */
export function recommendedConflicts(builds: readonly Build[]): string[] {
  const seen = new Map<string, string>();
  const problems: string[] = [];
  for (const build of builds) {
    for (const use of build.recommendedFor) {
      const key = `${use}@${build.level}`;
      const other = seen.get(key);
      if (other) problems.push(`"${build.id}" and "${other}" are both recommended for ${use} at level ${build.level}`);
      else seen.set(key, build.id);
    }
  }
  return problems;
}
