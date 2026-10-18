/**
 * What happens at a character level for a leveling build: spells learned
 * (leveling-spells.json), the talent point of that level (the build's point
 * order) and what comes in the next levels. Pure, shared by the level view's
 * client script and the unit tests.
 */
import { levelForPoint } from './talents';

export interface PlanSpells {
  level: number;
  spells: string[];
  ranks: { spell: string; rank: number }[];
}

export interface PlanBuild {
  /** One talent id per point, in spending order. */
  order: readonly string[];
  /** Points the build reaches at its level without Talented; later ones need Talented. */
  basePoints: number;
}

export interface PlanPoint {
  /** 1-based point number. */
  point: number;
  talent: string;
  /** Rank in that talent after this point. */
  rank: number;
  /** Only with Talented 5/5 (beyond the build's level without it). */
  extra: boolean;
}

export interface LevelStep {
  level: number;
  spells: string[];
  ranks: { spell: string; rank: number }[];
  point?: PlanPoint;
}

export const MIN_LEVEL = 1;
export const MAX_PLAN_LEVEL = 30;

/** Clamps anything (URL parameters included) to a valid level, or undefined. */
export function parseLevel(value: string | null | undefined): number | undefined {
  const level = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(level)) return undefined;
  return Math.min(MAX_PLAN_LEVEL, Math.max(MIN_LEVEL, level));
}

/** The talent point that arrives exactly at `level`, if any. */
export function pointAtLevel(build: PlanBuild, level: number, talented: boolean): PlanPoint | undefined {
  const point = level - levelForPoint(1, talented ? 5 : 0) + 1;
  if (point < 1 || point > build.order.length) return undefined;
  const extra = point > build.basePoints;
  if (extra && !talented) return undefined;
  const talent = build.order[point - 1]!;
  const rank = build.order.slice(0, point).filter((id) => id === talent).length;
  return { point, talent, rank, extra };
}

/** One level: its spells and its talent point. */
export function levelStep(build: PlanBuild, spells: readonly PlanSpells[], level: number, talented: boolean): LevelStep {
  const row = spells.find((s) => s.level === level);
  const point = pointAtLevel(build, level, talented);
  return { level, spells: row?.spells ?? [], ranks: row?.ranks ?? [], ...(point ? { point } : {}) };
}

/** The chosen level and the next `ahead` levels (never past the plan's last level). */
export function levelPlan(build: PlanBuild, spells: readonly PlanSpells[], level: number, talented: boolean, ahead = 2): LevelStep[] {
  const steps: LevelStep[] = [];
  for (let l = level; l <= Math.min(MAX_PLAN_LEVEL, level + ahead); l++) steps.push(levelStep(build, spells, l, talented));
  return steps;
}
