import { describe, expect, it } from 'vitest';
import { builds, checkIntegrity, dataset, talents, type Dataset } from '../src/lib/data';
import {
  distributionLabel,
  pointsAtLevel,
  pointsByTree,
  spentTalents,
  treeTalents,
  validateBuild,
  wowheadBuildUrl,
  WOWHEAD_CALC,
} from '../src/lib/talents';

const frost = (points: Record<string, number>) => points;

describe('talent trees', () => {
  it('has the three Forever trees in calculator order', () => {
    expect(treeTalents(talents, 'arcane')).toHaveLength(18);
    expect(treeTalents(talents, 'fire')).toHaveLength(17);
    expect(treeTalents(talents, 'frost')).toHaveLength(19);
    expect(treeTalents(talents, 'frost').slice(0, 4).map((t) => t.id)).toEqual([
      'frost-warding',
      'improved-frostbolt',
      'elemental-precision',
      'ice-shards',
    ]);
  });

  it('places the official milestone talents where the deep dive says', () => {
    const at = (id: string) => talents.find((t) => t.id === id)!;
    expect(at('ice-lance')).toMatchObject({ row: 3, maxRank: 1 });
    expect(at('ice-block')).toMatchObject({ row: 4, maxRank: 1 });
    expect(at('cold-snap')).toMatchObject({ row: 5, maxRank: 1 });
    expect(at('arcane-blast')).toMatchObject({ row: 3, maxRank: 1 });
    expect(at('missile-barrage')).toMatchObject({ row: 4, maxRank: 1 });
  });

  it('gives one point per level from 10', () => {
    expect(pointsAtLevel(9)).toBe(0);
    expect(pointsAtLevel(30)).toBe(21);
    expect(pointsAtLevel(60)).toBe(51);
  });

  it('adds the Legacy perk Talented before level 60, never above 51', () => {
    expect(pointsAtLevel(5, 5)).toBe(1);
    expect(pointsAtLevel(30, 5)).toBe(26);
    expect(pointsAtLevel(57, 5)).toBe(51);
    expect(pointsAtLevel(60, 5)).toBe(51);
  });
});

describe('validateBuild', () => {
  it('accepts every shipped build', () => {
    for (const build of builds) expect(validateBuild(build.points, build.level, talents, build.legacyTalented)).toEqual([]);
  });

  it('counts the Talented points a build declares', () => {
    const legacy = builds.find((b) => b.id === 'frost-duels-30-legacy')!;
    expect(legacy.legacyTalented).toBe(5);
    expect(validateBuild(legacy.points, 30, talents).join()).toMatch(/26 points spent, but level 30 gives 21/);
    expect(validateBuild(legacy.points, 30, talents, 5)).toEqual([]);
  });

  it('rejects ranks above the maximum', () => {
    expect(validateBuild(frost({ 'improved-frostbolt': 6 }), 60, talents).join()).toMatch(/max 5/);
  });

  it('rejects rows without enough points above them', () => {
    expect(validateBuild(frost({ 'ice-lance': 1 }), 60, talents).join()).toMatch(/needs 10 points above it/);
  });

  it('rejects missing prerequisites', () => {
    const points = frost({ 'improved-frostbolt': 5, 'ice-shards': 5, 'frostbite': 3, 'improved-frost-nova': 2, 'piercing-ice': 3, 'shatter': 3, 'fingers-of-frost': 1 });
    expect(validateBuild(points, 60, talents).join()).toMatch(/requires 1 points in "ice-lance"/);
  });

  it('rejects more points than the level gives', () => {
    expect(validateBuild(frost({ 'improved-frostbolt': 5 }), 12, talents).join()).toMatch(/level 12 gives 3/);
  });

  it('is enforced by the dataset integrity check', () => {
    const data: Dataset = structuredClone(dataset);
    data.builds[0]!.points = { ...data.builds[0]!.points, 'ice-barrier': 1 };
    expect(checkIntegrity(data).join('\n')).toMatch(/ice-barrier/);
  });
});

describe('Wowhead links', () => {
  it('encodes one digit per talent, per tree, without trailing zeros', () => {
    // URLs produced by the calculator itself on 2026-10-13.
    expect(wowheadBuildUrl({ 'improved-frostbolt': 5, 'ice-shards': 3 }, talents)).toBe(`${WOWHEAD_CALC}/v2--0503`);
    expect(wowheadBuildUrl({ 'arcane-focus': 1, 'wake-of-fire': 1, 'improved-frostbolt': 5 }, talents)).toBe(`${WOWHEAD_CALC}/v201-1-05`);
    expect(wowheadBuildUrl({ 'wake-of-fire': 2 }, talents)).toBe(`${WOWHEAD_CALC}/v2-2`);
    expect(wowheadBuildUrl({ 'arcane-focus': 2 }, talents)).toBe(`${WOWHEAD_CALC}/v202`);
  });

  it('falls back to the empty calculator', () => {
    expect(wowheadBuildUrl({}, talents)).toBe(WOWHEAD_CALC);
  });
});

describe('build summaries', () => {
  const build = builds.find((b) => b.id === 'frost-duels-30-legacy')!;

  it('splits points per tree', () => {
    expect(pointsByTree(build.points, talents)).toEqual({ arcane: 0, fire: 0, frost: 26 });
    expect(distributionLabel(build.points, talents)).toBe('0 / 0 / 26');
  });

  it('lists spent talents in calculator order', () => {
    const groups = spentTalents(build.points, talents);
    expect(groups.map((g) => g.tree)).toEqual(['frost']);
    expect(groups[0]!.talents[0]!.talent.id).toBe('improved-frostbolt');
    expect(groups[0]!.talents.at(-1)!.talent.id).toBe('fingers-of-frost');
  });
});
