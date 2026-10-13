/**
 * Loads and validates every structured data file.
 *
 * Parsing happens at import time, so a malformed JSON entry fails `astro build`,
 * `npm run validate` and the unit tests with the same message.
 */
import { z } from 'astro/zod';
import rawAbilities from '../data/abilities.json';
import rawBuilds from '../data/builds.json';
import rawChangelog from '../data/changelog.json';
import rawChanges from '../data/changes.json';
import rawFacts from '../data/facts.json';
import rawVersions from '../data/game-versions.json';
import rawMilestones from '../data/milestones.json';
import rawRaces from '../data/races.json';
import rawSources from '../data/sources.json';
import rawTalents from '../data/talents.json';
import rawWatchlist from '../data/watchlist.json';
import {
  abilitySchema,
  buildSchema,
  changeSchema,
  changelogSchema,
  factSchema,
  gameVersionSchema,
  milestoneSchema,
  raceSchema,
  sourceSchema,
  talentSchema,
  watchSchema,
  type Ability,
  type Build,
  type Change,
  type ChangelogEntry,
  type Fact,
  type GameVersion,
  type Milestone,
  type Race,
  type Source,
  type Status,
  type Talent,
  type Tree,
  type Watch,
} from './schemas';
import { validateBuild } from './talents';

function parseList<T extends z.ZodType>(file: string, schema: T, raw: unknown): z.output<T>[] {
  const result = z.array(schema).safeParse(raw);
  if (!result.success) {
    throw new Error(`Invalid data in src/data/${file}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export interface Dataset {
  sources: Source[];
  changes: Change[];
  milestones: Milestone[];
  abilities: Ability[];
  facts: Fact[];
  versions: GameVersion[];
  changelog: ChangelogEntry[];
  watchlist: Watch[];
  talents: Talent[];
  builds: Build[];
  races: Race[];
}

export function parseDataset(raw: Record<keyof Dataset, unknown>): Dataset {
  return {
    sources: parseList('sources.json', sourceSchema, raw.sources),
    changes: parseList('changes.json', changeSchema, raw.changes),
    milestones: parseList('milestones.json', milestoneSchema, raw.milestones),
    abilities: parseList('abilities.json', abilitySchema, raw.abilities),
    facts: parseList('facts.json', factSchema, raw.facts),
    versions: parseList('game-versions.json', gameVersionSchema, raw.versions),
    changelog: parseList('changelog.json', changelogSchema, raw.changelog),
    watchlist: parseList('watchlist.json', watchSchema, raw.watchlist),
    talents: parseList('talents.json', talentSchema, raw.talents),
    builds: parseList('builds.json', buildSchema, raw.builds),
    races: parseList('races.json', raceSchema, raw.races),
  };
}

function duplicates(ids: string[]): string[] {
  const seen = new Set<string>();
  return ids.filter((value) => (seen.has(value) ? true : (seen.add(value), false)));
}

/**
 * Cross-file rules that a per-file schema cannot express.
 * Returns human-readable problems; an empty array means the dataset is consistent.
 */
export function checkIntegrity(data: Dataset, today: Date = new Date()): string[] {
  const problems: string[] = [];
  const sourceById = new Map(data.sources.map((s) => [s.id, s]));
  const changeIds = new Set(data.changes.map((c) => c.id));

  const lists: [string, { id: string }[]][] = [
    ['sources.json', data.sources],
    ['changes.json', data.changes],
    ['milestones.json', data.milestones],
    ['abilities.json', data.abilities],
    ['facts.json', data.facts],
    ['game-versions.json', data.versions],
    ['changelog.json', data.changelog],
    ['watchlist.json', data.watchlist],
    ['talents.json', data.talents],
    ['builds.json', data.builds],
    ['races.json', data.races],
  ];
  for (const [file, list] of lists) {
    for (const dup of duplicates(list.map((item) => item.id))) problems.push(`${file}: duplicate id "${dup}"`);
  }

  const claims: [string, { id: string; status: Status; sources: string[] }][] = [
    ...data.changes.map((c) => ['changes.json', c] as [string, Change]),
    ...data.milestones.map((m) => ['milestones.json', m] as [string, Milestone]),
    ...data.abilities.map((a) => ['abilities.json', a] as [string, Ability]),
    ...data.facts.map((f) => ['facts.json', f] as [string, Fact]),
    ...data.builds.map((b) => ['builds.json', b] as [string, Build]),
    ...data.races.map((r) => ['races.json', r] as [string, Race]),
  ];
  for (const [file, claim] of claims) {
    const kinds = new Set<string>();
    for (const sourceId of claim.sources) {
      const source = sourceById.get(sourceId);
      if (!source) problems.push(`${file}: "${claim.id}" cites unknown source "${sourceId}"`);
      else kinds.add(source.kind);
    }
    if (claim.status === 'verified' && !kinds.has('official')) {
      problems.push(`${file}: "${claim.id}" is "verified" but cites no official source`);
    }
    if (claim.status === 'classic' && !kinds.has('classic-reference') && !kinds.has('official')) {
      problems.push(`${file}: "${claim.id}" is "classic" but cites no Classic reference`);
    }
    if (claim.status === 'reported' && [...kinds].every((k) => k === 'tool')) {
      problems.push(`${file}: "${claim.id}" is "reported" on calculator data alone`);
    }
  }

  for (const entry of data.changelog) {
    for (const sourceId of entry.sources) {
      if (!sourceById.has(sourceId)) problems.push(`changelog.json: "${entry.id}" cites unknown source "${sourceId}"`);
    }
    if (new Date(`${entry.date}T00:00:00Z`) > today) problems.push(`changelog.json: "${entry.id}" is dated in the future`);
  }

  // The changelog documents data changes: every ref must exist, and every record
  // carrying an `updated` date needs an entry on that date that references it.
  const records = new Map<string, { updated?: string | undefined }>([
    ...data.changes.map((r) => [`change:${r.id}`, r] as const),
    ...data.milestones.map((r) => [`milestone:${r.id}`, r] as const),
    ...data.abilities.map((r) => [`ability:${r.id}`, r] as const),
    ...data.facts.map((r) => [`fact:${r.id}`, r] as const),
    ...data.sources.map((r) => [`source:${r.id}`, {}] as const),
    ...data.builds.map((r) => [`build:${r.id}`, r] as const),
    ...data.races.map((r) => [`race:${r.id}`, r] as const),
  ]);
  const refDates = new Map<string, Set<string>>();
  for (const entry of data.changelog) {
    for (const reference of entry.refs) {
      if (!records.has(reference)) problems.push(`changelog.json: "${entry.id}" references unknown record "${reference}"`);
      refDates.set(reference, (refDates.get(reference) ?? new Set()).add(entry.date));
    }
  }
  for (const [reference, record] of records) {
    if (!record.updated) continue;
    if (new Date(`${record.updated}T00:00:00Z`) > today) problems.push(`${reference} has an "updated" date in the future`);
    if (!refDates.get(reference)?.has(record.updated)) {
      problems.push(`${reference} was updated on ${record.updated} but no changelog entry of that date references it`);
    }
  }
  for (const watch of data.watchlist) {
    if (new Date(`${watch.verified}T00:00:00Z`) > today) problems.push(`watchlist.json: "${watch.id}" verified date is in the future`);
  }

  for (const milestone of data.milestones) {
    if (milestone.changeId && !changeIds.has(milestone.changeId)) {
      problems.push(`milestones.json: "${milestone.id}" links unknown change "${milestone.changeId}"`);
    }
  }
  for (const ability of data.abilities) {
    for (const changeId of ability.changeIds) {
      if (!changeIds.has(changeId)) problems.push(`abilities.json: "${ability.id}" links unknown change "${changeId}"`);
    }
  }
  for (const change of data.changes) {
    if (change.milestone && change.tree !== 'baseline') {
      const slot = data.milestones.find((m) => m.tree === change.tree && m.points === change.milestone);
      if (!slot || slot.changeId !== change.id) {
        problems.push(`changes.json: "${change.id}" claims the ${change.milestone}-point milestone but milestones.json disagrees`);
      }
    }
  }
  for (const version of data.versions) {
    if (new Date(`${version.since}T00:00:00Z`) > today) problems.push(`game-versions.json: "${version.id}" starts in the future`);
  }

  // Talent trees: one talent per cell, prerequisites in the same tree, known change links.
  const talentById = new Map(data.talents.map((t) => [t.id, t]));
  const cells = new Set<string>();
  for (const talent of data.talents) {
    const cell = `${talent.tree}:${talent.row}:${talent.col}`;
    if (cells.has(cell)) problems.push(`talents.json: two talents share ${cell}`);
    cells.add(cell);
    if (talent.changeId && !changeIds.has(talent.changeId)) problems.push(`talents.json: "${talent.id}" links unknown change "${talent.changeId}"`);
    if (talent.requires) {
      const required = talentById.get(talent.requires.talent);
      if (!required) problems.push(`talents.json: "${talent.id}" requires unknown talent "${talent.requires.talent}"`);
      else if (required.tree !== talent.tree || required.row >= talent.row) {
        problems.push(`talents.json: "${talent.id}" requires "${required.id}", which is not above it in the same tree`);
      } else if (talent.requires.points > required.maxRank) {
        problems.push(`talents.json: "${talent.id}" requires more points than "${required.id}" has`);
      }
    }
  }

  // Builds must be possible in game and point at known versions and pages.
  for (const build of data.builds) {
    for (const problem of validateBuild(build.points, build.level, data.talents, build.legacyTalented)) problems.push(`builds.json: "${build.id}": ${problem}`);
    for (const key of build.keyTalents) {
      if (!build.points[key]) problems.push(`builds.json: "${build.id}" highlights "${key}" without points in it`);
    }
    if (!data.versions.some((v) => v.id === build.gameVersion)) problems.push(`builds.json: "${build.id}" uses unknown gameVersion "${build.gameVersion}"`);
  }
  for (const race of data.races) {
    for (const dup of duplicates(race.racials.map((r) => r.id))) problems.push(`races.json: "${race.id}" lists racial "${dup}" twice`);
  }
  return problems;
}

export const dataset: Dataset = parseDataset({
  sources: rawSources,
  changes: rawChanges,
  milestones: rawMilestones,
  abilities: rawAbilities,
  facts: rawFacts,
  versions: rawVersions,
  changelog: rawChangelog,
  watchlist: rawWatchlist,
  talents: rawTalents,
  builds: rawBuilds,
  races: rawRaces,
});

const integrity = checkIntegrity(dataset);
if (integrity.length > 0) {
  throw new Error(`Content integrity problems:\n- ${integrity.join('\n- ')}`);
}

export const { sources, changes, milestones, abilities, facts, versions, changelog, watchlist, talents, builds, races } = dataset;

const sourceIndex = new Map(sources.map((s) => [s.id, s]));
const versionIndex = new Map(versions.map((v) => [v.id, v]));
const factIndex = new Map(facts.map((f) => [f.id, f]));
const changeIndex = new Map(changes.map((c) => [c.id, c]));

function lookup<T>(index: Map<string, T>, kind: string, key: string): T {
  const value = index.get(key);
  if (!value) throw new Error(`Unknown ${kind} "${key}"`);
  return value;
}

export const getSource = (key: string) => lookup(sourceIndex, 'source', key);
export const getVersion = (key: string) => lookup(versionIndex, 'game version', key);
export const getFact = (key: string) => lookup(factIndex, 'fact', key);
export const getChange = (key: string) => lookup(changeIndex, 'change', key);

export const changesForTree = (tree: Tree) => changes.filter((c) => c.tree === tree);
export const milestonesForTree = (tree: Exclude<Tree, 'baseline'>) =>
  milestones.filter((m) => m.tree === tree).sort((a, b) => a.points - b.points);

/** The most recent game version the guide tracks. */
export const currentVersion: GameVersion = [...versions].sort((a, b) => b.since.localeCompare(a.since))[0]!;

/** Changelog entries that document a record, newest first ("change:ice-lance"). */
export const changelogFor = (reference: string) =>
  [...changelog].filter((e) => e.refs.includes(reference)).sort((a, b) => b.date.localeCompare(a.date));

/** Newest first. */
export const sortedChangelog = () => [...changelog].sort((a, b) => b.date.localeCompare(a.date));

const talentIndex = new Map(talents.map((t) => [t.id, t]));
const buildIndex = new Map(builds.map((b) => [b.id, b]));

export const getTalent = (key: string) => lookup(talentIndex, 'talent', key);
export const getBuild = (key: string) => lookup(buildIndex, 'build', key);
