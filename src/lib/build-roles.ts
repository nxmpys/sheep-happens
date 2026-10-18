/**
 * Recommended or viable: in each use, one build is the recommended one for its
 * level (`recommendedFor` in builds.json); the others are viable alternatives.
 * We only publish builds that make sense for the content (no Arcane AoE build
 * just to have one), so a use may have builds in a single tree.
 */
import type { Build, BuildUse } from './schemas';

export type BuildRole = 'recommended' | 'viable';

export function buildRole(build: Pick<Build, 'recommendedFor'>, use: BuildUse): BuildRole {
  return build.recommendedFor.includes(use) ? 'recommended' : 'viable';
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
