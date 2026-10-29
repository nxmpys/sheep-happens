import { describe, expect, it } from 'vitest';
import { isLevelingBuild, levelingStatus } from '../src/lib/leveling';
import { fixtureBuild } from './fixtures/builds';

const build = (level: number, uses: ('leveling' | 'dungeons' | 'pvp')[] = ['leveling'], order: string[] | undefined = ['improved-frostbolt']) => ({
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

  it('covers 1–60 with a full leveling build', () => {
    const status = levelingStatus([fixtureBuild]);
    expect(status.coverage).toBe(60);
    expect(status.complete).toBe(true);
    expect(status.stages.every((s) => s.state === 'published')).toBe(true);
  });

  it('publishes a stage only when every leveling build reaches it', () => {
    const half = levelingStatus([build(60), build(30, ['leveling', 'dungeons'])]);
    expect(half.coverage).toBe(30);
    expect(half.complete).toBe(false);
    const full = levelingStatus([build(60), build(60, ['leveling', 'dungeons']), build(30, ['pvp'])]);
    expect(full.coverage).toBe(60);
    expect(full.complete).toBe(true);
    expect(full.stages.every((s) => s.state === 'published')).toBe(true);
  });

  it('marks only the first missing stage as next', () => {
    expect(levelingStatus([]).stages.map((s) => s.state)).toEqual(['next', 'planned']);
  });
});
