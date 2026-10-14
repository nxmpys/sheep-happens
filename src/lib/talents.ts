/**
 * Talent tree rules: build validation and links to the Wowhead calculator.
 * Pure functions over talents.json, shared by the data checks, the build
 * components and the unit tests.
 */
import type { SpecTree, Talent } from './schemas';

export const TREE_ORDER: readonly SpecTree[] = ['arcane', 'fire', 'frost'];

/** Points needed in a tree before you can spend points in a row (Classic rule: 5 per row). */
export function pointsRequiredForRow(row: number): number {
  return (row - 1) * 5;
}

export const MAX_TALENT_POINTS = 51;
export const MAX_LEVEL = 60;

/**
 * Talent points available at a level: one per level from 10. Each rank of the
 * Legacy perk Talented moves the first point one level earlier (down to level 5
 * at 5/5), so below level 60 you have up to 5 more; the maximum stays at 51.
 */
export function pointsAtLevel(level: number, talented = 0): number {
  return Math.min(MAX_TALENT_POINTS, Math.max(0, level - 9 + talented));
}

/** Talents of a tree in calculator order: top to bottom, left to right. */
export function treeTalents(talents: readonly Talent[], tree: SpecTree): Talent[] {
  return talents.filter((t) => t.tree === tree).sort((a, b) => a.row - b.row || a.col - b.col);
}

export type Points = Readonly<Record<string, number>>;

/** Points spent per tree, e.g. { arcane: 0, fire: 0, frost: 21 }. */
export function pointsByTree(points: Points, talents: readonly Talent[]): Record<SpecTree, number> {
  const totals: Record<SpecTree, number> = { arcane: 0, fire: 0, frost: 0 };
  const byId = new Map(talents.map((t) => [t.id, t]));
  for (const [id, rank] of Object.entries(points)) {
    const talent = byId.get(id);
    if (talent) totals[talent.tree] += rank;
  }
  return totals;
}

export function totalPoints(points: Points): number {
  return Object.values(points).reduce((sum, rank) => sum + rank, 0);
}

/**
 * Checks that a build could be made in game: known talents, ranks within range,
 * enough points in the tree for each row, prerequisites met and no more points
 * than the level gives. Returns human-readable problems (empty when valid).
 */
export function validateBuild(points: Points, level: number, talents: readonly Talent[], talented = 0): string[] {
  const problems: string[] = [];
  const byId = new Map(talents.map((t) => [t.id, t]));
  for (const [id, rank] of Object.entries(points)) {
    const talent = byId.get(id);
    if (!talent) {
      problems.push(`unknown talent "${id}"`);
      continue;
    }
    if (rank < 1 || rank > talent.maxRank) problems.push(`"${id}" has ${rank} points (max ${talent.maxRank})`);
    // Points spent in rows above this one, in the same tree.
    const above = Object.entries(points).reduce((sum, [otherId, otherRank]) => {
      const other = byId.get(otherId);
      return other && other.tree === talent.tree && other.row < talent.row ? sum + otherRank : sum;
    }, 0);
    const needed = pointsRequiredForRow(talent.row);
    if (above < needed) problems.push(`"${id}" (row ${talent.row}) needs ${needed} points above it in ${talent.tree}, has ${above}`);
    if (talent.requires && (points[talent.requires.talent] ?? 0) < talent.requires.points) {
      problems.push(`"${id}" requires ${talent.requires.points} points in "${talent.requires.talent}"`);
    }
  }
  const total = totalPoints(points);
  const available = pointsAtLevel(level, talented);
  if (total > available) {
    problems.push(`${total} points spent, but level ${level}${talented ? ` with Talented ${talented}/5` : ''} gives ${available}`);
  }
  return problems;
}

/** Level at which you get the nth talent point (1-based): 10 for the first, 5 with Talented 5/5. */
export function levelForPoint(point: number, talented = 0): number {
  return point + 9 - talented;
}

/** Adds up the first `count` points of a point order into a build. */
export function pointsFromOrder(order: readonly string[], count = order.length): Record<string, number> {
  const points: Record<string, number> = {};
  for (const id of order.slice(0, count)) points[id] = (points[id] ?? 0) + 1;
  return points;
}

/**
 * Checks a point order against its build: every intermediate step must be a
 * legal build (rows, ranks, prerequisites at the moment the point is spent),
 * the points up to the build's level must be exactly `points`, and the extra
 * points, if any, cannot exceed what Talented 5/5 gives at that level.
 */
export function validateOrder(
  order: readonly string[],
  points: Points,
  level: number,
  talents: readonly Talent[],
  talented = 0,
): string[] {
  const problems: string[] = [];
  for (let n = 1; n <= order.length; n++) {
    for (const problem of validateBuild(pointsFromOrder(order, n), MAX_LEVEL, talents)) {
      problems.push(`point ${n} (${order[n - 1]}): ${problem}`);
    }
    if (problems.length > 0) return problems;
  }
  const base = pointsAtLevel(level, talented);
  if (order.length < base) problems.push(`order has ${order.length} points, but level ${level} gives ${base}`);
  const max = pointsAtLevel(level, 5);
  if (order.length > max) problems.push(`order has ${order.length} points, but even Talented 5/5 gives ${max} at level ${level}`);
  const reached = pointsFromOrder(order, base);
  const ids = new Set([...Object.keys(reached), ...Object.keys(points)]);
  for (const id of ids) {
    if ((reached[id] ?? 0) !== (points[id] ?? 0)) {
      problems.push(`the first ${base} points give "${id}" ${reached[id] ?? 0} points, but the build has ${points[id] ?? 0}`);
    }
  }
  return problems;
}

/** A run of consecutive points in the same talent, e.g. Improved Frostbolt 1 → 5 at points 1–5. */
export interface OrderStep {
  talent: Talent;
  /** First and last point of the run (1-based). */
  from: number;
  to: number;
  /** Rank after the first and after the last point of the run. */
  fromRank: number;
  toRank: number;
}

/**
 * Groups a point order into runs, so a table can show "levels 10–14: Improved
 * Frostbolt 5/5". A run never crosses `splitAfter` (a point number), so the
 * points of the build's level and the extra Talented points stay apart.
 */
export function orderSteps(order: readonly string[], talents: readonly Talent[], splitAfter = order.length): OrderStep[] {
  const byId = new Map(talents.map((t) => [t.id, t]));
  const ranks: Record<string, number> = {};
  const steps: OrderStep[] = [];
  order.forEach((id, index) => {
    const talent = byId.get(id);
    if (!talent) throw new Error(`Unknown talent "${id}" in a point order`);
    const rank = (ranks[id] = (ranks[id] ?? 0) + 1);
    const last = steps.at(-1);
    if (last && last.talent.id === id && index !== splitAfter) {
      last.to = index + 1;
      last.toRank = rank;
    } else {
      steps.push({ talent, from: index + 1, to: index + 1, fromRank: rank, toRank: rank });
    }
  });
  return steps;
}

export const WOWHEAD_CALC = 'https://www.wowhead.com/forever/talent-calc/mage';

/**
 * Link to the build in the Wowhead Forever calculator. Format (checked by hand
 * on 2026-10-13): "v2", then one digit string per tree in calculator order,
 * Arcane-Fire-Frost joined by "-", each without trailing zeros and with empty
 * trailing trees dropped: Arcane Focus 1 + Wake of Fire 1 + Improved Frostbolt 5
 * is ".../mage/v201-1-05"; Frost alone is ".../mage/v2--0503".
 */
export function wowheadBuildUrl(points: Points, talents: readonly Talent[]): string {
  const segments = TREE_ORDER.map((tree) =>
    treeTalents(talents, tree)
      .map((t) => String(points[t.id] ?? 0))
      .join('')
      .replace(/0+$/, ''),
  );
  if (segments.every((s) => s === '')) return WOWHEAD_CALC;
  return `${WOWHEAD_CALC}/v2${segments.join('-').replace(/-+$/, '')}`;
}

/** "0 / 0 / 21" in Arcane / Fire / Frost order. */
export function distributionLabel(points: Points, talents: readonly Talent[]): string {
  const totals = pointsByTree(points, talents);
  return TREE_ORDER.map((tree) => totals[tree]).join(' / ');
}

/** Talents with points, grouped by tree and sorted in calculator order. */
export function spentTalents(points: Points, talents: readonly Talent[]): { tree: SpecTree; talents: { talent: Talent; rank: number }[] }[] {
  return TREE_ORDER.map((tree) => ({
    tree,
    talents: treeTalents(talents, tree)
      .filter((t) => (points[t.id] ?? 0) > 0)
      .map((talent) => ({ talent, rank: points[talent.id]! })),
  })).filter((group) => group.talents.length > 0);
}
