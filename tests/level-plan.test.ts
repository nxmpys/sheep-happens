import { describe, expect, it } from 'vitest';
import { getBuild, levelingSpells } from '../src/lib/data';
import { levelPlan, parseLevel, pointAtLevel } from '../src/lib/level-plan';
import { pointsAtLevel } from '../src/lib/talents';

const solo = getBuild('frost-leveling-solo');
const build = { order: solo.order!, basePoints: pointsAtLevel(solo.level, solo.legacyTalented) };

describe('level plan', () => {
  it('reads levels from the URL and clamps them', () => {
    expect(parseLevel('24')).toBe(24);
    expect(parseLevel('99')).toBe(30);
    expect(parseLevel('0')).toBe(1);
    expect(parseLevel('x')).toBeUndefined();
  });

  it('gives the first talent point at 10, or at 5 with Talented', () => {
    expect(pointAtLevel(build, 9, false)).toBeUndefined();
    expect(pointAtLevel(build, 10, false)).toMatchObject({ point: 1, talent: 'improved-frostbolt', rank: 1, extra: false });
    expect(pointAtLevel(build, 5, true)).toMatchObject({ point: 1, talent: 'improved-frostbolt' });
    expect(pointAtLevel(build, 14, false)).toMatchObject({ point: 5, rank: 5 });
  });

  it('moves each point 5 levels earlier with Talented', () => {
    expect(pointAtLevel(build, 30, false)).toMatchObject({ point: 21, extra: false });
    expect(pointAtLevel(build, 30, true)).toMatchObject({ point: 26, extra: false, talent: 'ice-shards' });
  });

  it('lists the spells of the level and of the next two', () => {
    const plan = levelPlan(build, levelingSpells, 24, false);
    expect(plan.map((s) => s.level)).toEqual([24, 25, 26]);
    expect(plan[0]!.spells).toEqual(['Counterspell', 'Frost Blast']);
    expect(plan[2]!.ranks).toEqual([{ spell: 'Frostbolt', rank: 5 }]);
    expect(levelPlan(build, levelingSpells, 30, false)).toHaveLength(1);
  });
});
