/**
 * Coverage of the leveling guide. The guide grows in stages on the same page
 * (levels 1–30 first, then 31–60), so the BETA notice and the stage list are
 * derived from the leveling builds instead of being written by hand: extending
 * every build's `level` and `order` to 60 is what marks the guide complete.
 */
import type { Build } from './schemas';

export interface LevelingStage {
  from: number;
  to: number;
}

/** The planned stages, in publication order. */
export const LEVELING_STAGES: readonly LevelingStage[] = [
  { from: 1, to: 30 },
  { from: 31, to: 60 },
];

export type StageState = 'published' | 'next' | 'planned';

export interface LevelingStatus {
  /** Highest level that every leveling build covers (0 when there is none). */
  coverage: number;
  /** All stages published: the guide is no longer a beta. */
  complete: boolean;
  stages: (LevelingStage & { state: StageState })[];
}

type LevelingBuild = Pick<Build, 'uses' | 'level' | 'order'>;

/** Builds that belong to the leveling guide: leveling use and a point order. */
export function isLevelingBuild(build: LevelingBuild): boolean {
  return build.uses.includes('leveling') && build.order !== undefined;
}

/**
 * A stage counts as published only when every leveling build reaches its last
 * level, so a half-extended guide never claims a range it does not cover.
 */
export function levelingStatus(builds: readonly LevelingBuild[]): LevelingStatus {
  const leveling = builds.filter(isLevelingBuild);
  const coverage = leveling.length > 0 ? Math.min(...leveling.map((b) => b.level)) : 0;
  let nextAssigned = false;
  const stages = LEVELING_STAGES.map((stage) => {
    if (coverage >= stage.to) return { ...stage, state: 'published' as const };
    if (!nextAssigned) {
      nextAssigned = true;
      return { ...stage, state: 'next' as const };
    }
    return { ...stage, state: 'planned' as const };
  });
  return { coverage, complete: stages.every((s) => s.state === 'published'), stages };
}
