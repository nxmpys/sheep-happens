import { describe, expect, it } from 'vitest';
import { builds, checkIntegrity, dataset, talents, type Dataset } from '../src/lib/data';
import {
  distributionLabel,
  levelForPoint,
  orderSteps,
  pointsAtLevel,
  pointsByTree,
  pointsFromOrder,
  spentTalents,
  treeTalents,
  validateBuild,
  validateOrder,
  parseWowheadBuild,
  wowheadBuildUrl,
  WOWHEAD_CALC,
} from '../src/lib/talents';

const frost = (points: Record<string, number>) => points;

describe('talent trees', () => {
  it('has the three Forever trees in calculator order', () => {
    expect(treeTalents(talents, 'arcane')).toHaveLength(19);
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
    // 15 October build: Arcane Wrath took the 16-point milestone and Missile Barrage moved to row 1.
    expect(at('arcane-wrath')).toMatchObject({ row: 4, maxRank: 1 });
    expect(at('missile-barrage')).toMatchObject({ row: 1, maxRank: 2 });
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


/** A 26-point Frost build that needs Talented 5/5 at level 30 (the former level 30 duel build). */
const TALENTED_POINTS = {
  'improved-frostbolt': 5,
  'ice-shards': 5,
  permafrost: 3,
  'improved-frost-nova': 2,
  frostbite: 3,
  'ice-lance': 1,
  'ice-block': 1,
  shatter: 3,
  'cold-snap': 1,
  'fingers-of-frost': 2,
};

describe('validateBuild', () => {
  it('accepts every shipped build', () => {
    for (const build of builds) expect(validateBuild(build.points, build.level, talents, build.legacyTalented)).toEqual([]);
  });

  it('counts the Talented points a build declares', () => {
    expect(validateBuild(TALENTED_POINTS, 30, talents).join()).toMatch(/26 points spent, but level 30 gives 21/);
    expect(validateBuild(TALENTED_POINTS, 30, talents, 5)).toEqual([]);
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

describe('point orders', () => {
  const solo = builds.find((b) => b.id === 'frost-leveling-solo')!;

  it('gives each point its level, with and without Talented', () => {
    expect(levelForPoint(1)).toBe(10);
    expect(levelForPoint(21)).toBe(30);
    expect(levelForPoint(1, 5)).toBe(5);
    expect(levelForPoint(26, 5)).toBe(30);
  });

  it('adds up a prefix of the order into a build', () => {
    expect(pointsFromOrder(['improved-frostbolt', 'improved-frostbolt', 'frostbite'])).toEqual({ 'improved-frostbolt': 2, frostbite: 1 });
    expect(pointsFromOrder(['improved-frostbolt', 'frostbite'], 1)).toEqual({ 'improved-frostbolt': 1 });
  });

  it('accepts every shipped order and matches it to the build at its level', () => {
    for (const build of builds.filter((b) => b.order)) {
      expect(validateOrder(build.order!, build.points, build.level, talents, build.legacyTalented)).toEqual([]);
      expect(pointsFromOrder(build.order!, pointsAtLevel(build.level, build.legacyTalented))).toEqual(build.points);
    }
  });

  it('rejects a point spent before its row opens', () => {
    const order = ['ice-lance', ...solo.order!.filter((_, i) => i !== 10)];
    expect(validateOrder(order, solo.points, 30, talents).join()).toMatch(/point 1 \(ice-lance\): .*needs 10 points above it/);
  });

  it('rejects an order that does not reach the build or goes past Talented', () => {
    expect(validateOrder(solo.order!.slice(0, 20), solo.points, 30, talents).join()).toMatch(/order has 20 points, but level 30 gives 21/);
    expect(validateOrder([...solo.order!, 'arctic-reach'], solo.points, 30, talents).join()).toMatch(/even Talented 5\/5 gives 26/);
    const swapped = [...solo.order!];
    [swapped[20], swapped[22]] = [swapped[22]!, swapped[20]!];
    expect(validateOrder(swapped, solo.points, 30, talents).join()).toMatch(/the first 21 points give/);
  });

  it('groups runs and keeps the Talented points apart', () => {
    const steps = orderSteps(solo.order!, talents, 21);
    expect(steps[0]).toMatchObject({ from: 1, to: 5, fromRank: 1, toRank: 5 });
    expect(steps[0]!.talent.id).toBe('improved-frostbolt');
    const fingers = steps.filter((s) => s.talent.id === 'fingers-of-frost');
    expect(fingers.map((s) => [s.from, s.to, s.toRank])).toEqual([
      [21, 21, 1],
      [22, 22, 2],
    ]);
    expect(orderSteps(solo.order!, talents).filter((s) => s.talent.id === 'fingers-of-frost')).toHaveLength(1);
  });

  it('is enforced by the dataset integrity check', () => {
    const data: Dataset = structuredClone(dataset);
    const build = data.builds.find((b) => b.id === 'frost-leveling-solo')!;
    build.order = build.order!.slice(0, 20);
    expect(checkIntegrity(data).join('\n')).toMatch(/"frost-leveling-solo" order: order has 20 points/);
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
  const build = { points: TALENTED_POINTS };

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

describe('parseWowheadBuild', () => {
  it('reads back what wowheadBuildUrl writes', () => {
    for (const points of [{ 'improved-frostbolt': 5, 'ice-shards': 3 }, { 'arcane-focus': 1, 'wake-of-fire': 1, 'improved-frostbolt': 5 }, { 'wake-of-fire': 2 }, {}]) {
      expect(parseWowheadBuild(wowheadBuildUrl(points, talents), talents)).toEqual(points);
    }
  });
  it('accepts the bare code and ignores suffixes', () => {
    expect(parseWowheadBuild('v2--0503', talents)).toEqual({ 'improved-frostbolt': 5, 'ice-shards': 3 });
    expect(parseWowheadBuild(`${WOWHEAD_CALC}/v2--0503_abc`, talents)).toEqual({ 'improved-frostbolt': 5, 'ice-shards': 3 });
  });
  it('rejects other text and impossible ranks', () => {
    expect(parseWowheadBuild('hello', talents)).toBeUndefined();
    expect(parseWowheadBuild(`${WOWHEAD_CALC}/v29`, talents)).toBeUndefined();
  });
});
