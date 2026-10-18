/**
 * Which talent trees have a build for each use, derived from builds.json. The goal
 * is at least one level 60 build per use and tree (Arcane, Fire, Frost), so
 * players can stay in their favourite tree; one of them is the recommended build
 * for the use, the rest are «viable». Shared by the builds page (BuildCoverage)
 * and `npm run validate`, which warns about the gaps.
 */
import { BUILD_USES, SPECS, type Build, type BuildUse, type SpecTree } from './schemas';
import { MAX_LEVEL } from './talents';

/**
 * - ready: at least one build at the target level.
 * - partial: only builds below it (the level 30 beta builds).
 * - pending: no build in this tree yet.
 */
export type CoverageState = 'ready' | 'partial' | 'pending';

export interface CoverageCell {
  tree: SpecTree;
  state: CoverageState;
  /** Builds at the target level when ready, otherwise the ones below it; recommended first. */
  builds: Build[];
}

export interface UseCoverage {
  use: BuildUse;
  cells: CoverageCell[];
  /** Hybrid builds for this use: shown, but they count for no tree. */
  hybrids: Build[];
}

export type BuildRole = 'recommended' | 'viable';

export function buildRole(build: Pick<Build, 'recommendedFor'>, use: BuildUse): BuildRole {
  return build.recommendedFor.includes(use) ? 'recommended' : 'viable';
}

function byRole(use: BuildUse) {
  return (a: Build, b: Build) => b.level - a.level || Number(b.recommendedFor.includes(use)) - Number(a.recommendedFor.includes(use));
}

export function buildCoverage(builds: readonly Build[], level: number = MAX_LEVEL): UseCoverage[] {
  return BUILD_USES.map((use) => {
    const forUse = builds.filter((b) => b.uses.includes(use));
    const cells = SPECS.map((tree): CoverageCell => {
      const inTree = forUse.filter((b) => b.spec === tree);
      const ready = inTree.filter((b) => b.level >= level);
      if (ready.length > 0) return { tree, state: 'ready', builds: ready.sort(byRole(use)) };
      return { tree, state: inTree.length > 0 ? 'partial' : 'pending', builds: inTree.sort(byRole(use)) };
    });
    return { use, cells, hybrids: forUse.filter((b) => b.spec === 'hybrid').sort(byRole(use)) };
  });
}

/** Use × tree combinations without a build at the target level. */
export function coverageGaps(builds: readonly Build[], level: number = MAX_LEVEL): { use: BuildUse; trees: SpecTree[] }[] {
  return buildCoverage(builds, level)
    .map(({ use, cells }) => ({ use, trees: cells.filter((c) => c.state !== 'ready').map((c) => c.tree) }))
    .filter((gap) => gap.trees.length > 0);
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
