/**
 * Community builds: readers publish a full level 60 build from the talent
 * calculator with one to three content tags, and the calculator page ranks the
 * builds published most often. There is no free text: the label of each build
 * is its tags plus the spec its points give. The Pages Function in
 * functions/api/community-builds.ts stores the votes in D1; both sides use the
 * rules here so they never drift apart.
 */
import type { SpecTree, Talent } from './schemas';
import { MAX_LEVEL, MAX_TALENT_POINTS, TREE_ORDER, parseWowheadBuild, pointsByTree, totalPoints, validateBuild, wowheadBuildUrl, type Points } from './talents';

export const COMMUNITY_TAGS = ['leveling', 'dungeons', 'raid', 'pvp-bg', 'pvp-general', 'farming'] as const;
export type CommunityTag = (typeof COMMUNITY_TAGS)[number];

export const COMMUNITY_MAX_TAGS = 3;
/**
 * Votes are kept per talent tree: a calculator code means another build once
 * talents move, so a tree change starts a new table (and a new list of builds
 * the browser remembers as published). Bump it when talents move or disappear;
 * the old table stays in D1 until someone drops it.
 * 2: the 28 October 2026 tree (Arcane Focus gone, four talents moved).
 */
export const COMMUNITY_TREE = 2;
/** Turnstile action: the server rejects tokens issued for anything else. */
export const COMMUNITY_ACTION = 'community-build';
/** Builds listed per ranking: a short podium, not a wall of builds. */
export const COMMUNITY_LIMIT = 5;
/**
 * A second tree with at least this many points makes the build a hybrid
 * (a third of the 51 points: 17/0/34 is Frost + Arcane, 10/0/41 is Frost).
 */
export const HYBRID_MIN = 17;

export interface CommunitySpec {
  main: SpecTree;
  second: SpecTree | null;
}

/** Main tree (most points) and, for hybrids, the second one. */
export function communitySpec(points: Points, talents: readonly Talent[]): CommunitySpec {
  const byTree = pointsByTree(points, talents);
  const [main, second] = [...TREE_ORDER].sort((a, b) => byTree[b] - byTree[a]);
  return { main: main!, second: byTree[second!] >= HYBRID_MIN ? second! : null };
}

/** The canonical calculator code of a build ("--0503"), the key the votes are grouped by. */
export function communityCode(points: Points, talents: readonly Talent[]): string {
  return wowheadBuildUrl(points, talents).split('/mage/v2')[1] ?? '';
}

export interface CommunitySubmission {
  code: string;
  tags: CommunityTag[];
  spec: CommunitySpec;
}

export type CommunityError = 'invalid' | 'build' | 'tags';

/** Checks a publish request: a valid Mage build with all 51 points and one to three known tags. */
export function parseSubmission(raw: unknown, talents: readonly Talent[]): { ok: true; value: CommunitySubmission } | { ok: false; error: CommunityError } {
  if (typeof raw !== 'object' || raw === null) return { ok: false, error: 'invalid' };
  const { code, tags } = raw as Record<string, unknown>;
  if (typeof code !== 'string' || !/^[0-9-]{1,80}$/.test(code)) return { ok: false, error: 'build' };
  const points = parseWowheadBuild(`v2${code}`, talents);
  if (!points || totalPoints(points) !== MAX_TALENT_POINTS || validateBuild(points, MAX_LEVEL, talents).length > 0) {
    return { ok: false, error: 'build' };
  }
  if (!Array.isArray(tags)) return { ok: false, error: 'tags' };
  const unique = [...new Set(tags)];
  if (unique.length === 0 || unique.length > COMMUNITY_MAX_TAGS || !unique.every((tag) => (COMMUNITY_TAGS as readonly unknown[]).includes(tag))) {
    return { ok: false, error: 'tags' };
  }
  return { ok: true, value: { code: communityCode(points, talents), tags: unique as CommunityTag[], spec: communitySpec(points, talents) } };
}

export interface CommunityQuery {
  tag: CommunityTag | null;
  spec: SpecTree | null;
}

/** Ranking filters from the query string; unknown values mean «all». */
export function parseQuery(params: URLSearchParams): CommunityQuery {
  const tag = params.get('tag');
  const spec = params.get('spec');
  return {
    tag: (COMMUNITY_TAGS as readonly (string | null)[]).includes(tag) ? (tag as CommunityTag) : null,
    spec: (TREE_ORDER as readonly (string | null)[]).includes(spec) ? (spec as SpecTree) : null,
  };
}

export interface CommunityBuild {
  code: string;
  spec: CommunitySpec;
  /** Times it was published (with any tag). */
  total: number;
  /** Times per tag, most voted first. */
  tags: { tag: CommunityTag; votes: number }[];
}

/** One row of the ranking query: the votes of each tag as "tag:votes,tag:votes". */
export interface CommunityRow {
  code: string;
  main: string;
  second: string;
  total: number;
  tags: string;
}

export function rowToBuild(row: CommunityRow): CommunityBuild {
  const tags = row.tags
    .split(',')
    .map((pair) => pair.split(':'))
    .filter(([tag]) => (COMMUNITY_TAGS as readonly (string | undefined)[]).includes(tag))
    .map(([tag, votes]) => ({ tag: tag as CommunityTag, votes: Number(votes) }))
    .sort((a, b) => b.votes - a.votes);
  return {
    code: row.code,
    spec: { main: row.main as SpecTree, second: row.second ? (row.second as SpecTree) : null },
    total: Number(row.total),
    tags,
  };
}
