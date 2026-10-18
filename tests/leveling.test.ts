import { describe, expect, it } from 'vitest';
import { builds } from '../src/lib/data';
import { isLevelingBuild, levelingStatus } from '../src/lib/leveling';

const build = (level: number, uses: ('leveling' | 'aoe' | 'pvp')[] = ['leveling'], order: string[] | undefined = ['improved-frostbolt']) => ({
  uses,
  level,
  order,
});

describe('leveling guide coverage', () => {
  it('only counts leveling builds with a point order', () => {
    expect(isLevelingBuild(build(30))).toBe(true);
    expect(isLevelingBuild(build(30, ['pvp']))).toBe(false);
    expect(isLevelingBuild({ uses: ['leveling'], level: 30, order: undefined })).toBe(false);
  });

  it('is a beta covering 1–30 with the shipped builds', () => {
    const status = levelingStatus(builds);
    expect(status.coverage).toBe(30);
    expect(status.complete).toBe(false);
    expect(status.stages.map((s) => s.state)).toEqual(['published', 'next']);
  });

  it('publishes a stage only when every leveling build reaches it', () => {
    const half = levelingStatus([build(60), build(30, ['leveling', 'aoe'])]);
    expect(half.coverage).toBe(30);
    expect(half.complete).toBe(false);
    const full = levelingStatus([build(60), build(60, ['leveling', 'aoe']), build(30, ['pvp'])]);
    expect(full.coverage).toBe(60);
    expect(full.complete).toBe(true);
    expect(full.stages.every((s) => s.state === 'published')).toBe(true);
  });

  it('marks only the first missing stage as next', () => {
    expect(levelingStatus([]).stages.map((s) => s.state)).toEqual(['next', 'planned']);
  });
});
