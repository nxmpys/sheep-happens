/**
 * Legacy tree rules: a perk needs `tier` points already spent in its tree and,
 * if it has `requires`, at least one rank in that perk; a character spends at
 * most `cap` points. Pure functions over legacy.json, shared by the data checks,
 * the components and the unit tests.
 */
import type { LegacyBuild, LegacyPerk, LegacyTree } from './schemas';

export type LegacyPoints = Record<string, number>;

/** Ranks per perk once every step of a build is bought. */
export function legacyPoints(build: LegacyBuild): LegacyPoints {
  const points: LegacyPoints = {};
  for (const [perk, ranks] of build.steps) points[perk] = (points[perk] ?? 0) + ranks;
  return points;
}

export function spentInTree(points: LegacyPoints, perks: readonly LegacyPerk[], tree: LegacyTree): number {
  return perks.filter((perk) => perk.tree === tree).reduce((sum, perk) => sum + (points[perk.id] ?? 0), 0);
}

/**
 * Replays a build point by point, in its purchase order, and returns the rules
 * it breaks (empty when the game would allow it).
 */
export function validateLegacyBuild(build: LegacyBuild, perks: readonly LegacyPerk[], cap: number): string[] {
  const problems: string[] = [];
  const byId = new Map(perks.map((perk) => [perk.id, perk]));
  const points: LegacyPoints = {};
  let total = 0;
  for (const [id, ranks] of build.steps) {
    const perk = byId.get(id);
    if (!perk) {
      problems.push(`"${build.id}" buys unknown perk "${id}"`);
      continue;
    }
    for (let i = 0; i < ranks; i++) {
      if (spentInTree(points, perks, perk.tree) < perk.tier) problems.push(`"${build.id}": "${id}" needs ${perk.tier} points in ${perk.tree} first`);
      if (perk.requires && !(points[perk.requires] ?? 0)) problems.push(`"${build.id}": "${id}" needs a rank in "${perk.requires}" first`);
      points[id] = (points[id] ?? 0) + 1;
      total++;
      if (points[id]! > perk.ranks) problems.push(`"${build.id}": "${id}" has ${points[id]} ranks (max ${perk.ranks})`);
    }
  }
  if (total > cap) problems.push(`"${build.id}" spends ${total} points (cap ${cap})`);
  return [...new Set(problems)];
}
