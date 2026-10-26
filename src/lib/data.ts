/**
 * Loads and validates every structured data file.
 *
 * Parsing happens at import time, so a malformed JSON entry fails `astro build`,
 * `npm run validate` and the unit tests with the same message.
 */
import { z } from 'astro/zod';
import rawAbilities from '../data/abilities.json';
import rawAddons from '../data/addons.json';
import rawBuilds from '../data/builds.json';
import rawChangelog from '../data/changelog.json';
import rawChanges from '../data/changes.json';
import rawFacts from '../data/facts.json';
import rawVersions from '../data/game-versions.json';
import rawMilestones from '../data/milestones.json';
import rawPicks from '../data/profession-picks.json';
import rawProfessions from '../data/professions.json';
import rawRaces from '../data/races.json';
import rawScrolls from '../data/scrolls.json';
import rawSources from '../data/sources.json';
import rawSpellText from '../data/spell-text.json';
import rawTalents from '../data/talents.json';
import rawWatchlist from '../data/watchlist.json';
import rawLevelingSpells from '../data/leveling-spells.json';
import rawNotices from '../data/notices.json';
import rawRacePicks from '../data/race-picks.json';
import rawGlossary from '../data/glossary.json';
import rawTalentText from '../data/talent-text.json';
import rawItems from '../data/items.json';
import rawLibraryBooks from '../data/library-books.json';
import rawClassQuests from '../data/class-quests.json';
import rawLegacy from '../data/legacy.json';
import rawSpecs from '../data/specs.json';
import {
  BUILD_SPECS,
  BUILD_USES,
  abilitySchema,
  addonSchema,
  buildSchema,
  changeSchema,
  changelogSchema,
  classQuestSchema,
  factSchema,
  gameVersionSchema,
  glossarySchema,
  itemSchema,
  legacyFileSchema,
  levelingSpellSchema,
  libraryBookSchema,
  milestoneSchema,
  noticeSchema,
  racePickSchema,
  professionPickSchema,
  professionSchema,
  raceSchema,
  scrollSchema,
  sourceSchema,
  specOverviewSchema,
  spellTextFileSchema,
  talentSchema,
  talentTextFileSchema,
  watchSchema,
  type Ability,
  type Addon,
  type Build,
  type Change,
  type ChangelogEntry,
  type Fact,
  type GameVersion,
  type Milestone,
  type Notice,
  type Profession,
  type ProfessionPick,
  type Race,
  type ScrollBlock,
  type Source,
  type SpellName,
  type Status,
  type Talent,
  type Tree,
  type Watch,
} from './schemas';
import { nameEntry, spellNames } from './spell-names';
import { recommendedConflicts } from './build-roles';
import { routeConflicts } from './build-routes';
import { applySwap, totalPoints, validateBuild, validateOrder } from './talents';
import { validateLegacyBuild } from './legacy';

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
  professions: Profession[];
  picks: ProfessionPick[];
  addons: Addon[];
  scrolls: ScrollBlock[];
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
    professions: parseList('professions.json', professionSchema, raw.professions),
    picks: parseList('profession-picks.json', professionPickSchema, raw.picks),
    addons: parseList('addons.json', addonSchema, raw.addons),
    scrolls: parseList('scrolls.json', scrollSchema, raw.scrolls),
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
    ['professions.json', data.professions],
    ['profession-picks.json', data.picks],
    ['addons.json', data.addons],
    ['scrolls.json', data.scrolls],
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
    ...data.professions.map((p) => ['professions.json', p] as [string, Profession]),
    ...data.picks.map((p) => ['profession-picks.json', p] as [string, ProfessionPick]),
    ...data.scrolls.map((s) => ['scrolls.json', s] as [string, ScrollBlock]),
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
    ...data.professions.map((r) => [`profession:${r.id}`, r] as const),
    ...data.picks.map((r) => [`pick:${r.id}`, r] as const),
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
    if (build.order) {
      for (const problem of validateOrder(build.order, build.points, build.level, data.talents, build.legacyTalented)) {
        problems.push(`builds.json: "${build.id}" order: ${problem}`);
      }
      for (const note of build.orderNotes) {
        if (note.point > build.order.length) problems.push(`builds.json: "${build.id}" has a note for point ${note.point}, beyond its order`);
      }
    }
    // A variant swaps ranks on the final build: same total, a build you can really have.
    for (const variant of build.variants) {
      if (!variant.remove && !variant.add) continue;
      const label = `builds.json: "${build.id}" variant "${variant.name.en}"`;
      for (const [id, ranks] of Object.entries(variant.remove ?? {})) {
        if ((build.points[id] ?? 0) < ranks) problems.push(`${label} removes ${ranks} from "${id}", which has ${build.points[id] ?? 0}`);
      }
      if (totalPoints(variant.remove ?? {}) !== totalPoints(variant.add ?? {})) problems.push(`${label} removes and adds a different number of points`);
      const swapped = applySwap(build.points, variant.remove, variant.add);
      for (const problem of validateBuild(swapped, build.level, data.talents, build.legacyTalented)) problems.push(`${label}: ${problem}`);
    }
    if (build.fromLevel !== undefined && build.fromLevel > build.level) {
      problems.push(`builds.json: "${build.id}" starts at level ${build.fromLevel}, above its level ${build.level}`);
    }
    if (!data.versions.some((v) => v.id === build.gameVersion)) problems.push(`builds.json: "${build.id}" uses unknown gameVersion "${build.gameVersion}"`);
  }
  // One recommended build per use and level; the rest are shown as «viable».
  for (const problem of recommendedConflicts(data.builds)) problems.push(`builds.json: ${problem}`);
  // Each build has its own page, /builds/<first use>/<spec>/.
  for (const problem of routeConflicts(data.builds)) problems.push(`builds.json: ${problem}`);
  for (const race of data.races) {
    for (const dup of duplicates(race.racials.map((r) => r.id))) problems.push(`races.json: "${race.id}" lists racial "${dup}" twice`);
  }

  // Professions: pairs and picks name known primary professions, never twice.
  const professionById = new Map(data.professions.map((p) => [p.id, p]));
  const checkPair = (where: string, ids: string[]) => {
    for (const dup of duplicates(ids)) problems.push(`${where} names "${dup}" twice`);
    for (const id of ids) {
      const profession = professionById.get(id);
      if (!profession) problems.push(`${where} names unknown profession "${id}"`);
      else if (profession.kind === 'secondary') problems.push(`${where} names "${id}", a secondary profession that takes no slot`);
    }
  };
  for (const profession of data.professions) {
    if (profession.pair) {
      checkPair(`professions.json: "${profession.id}" pair`, profession.pair.with);
      if (profession.pair.with.includes(profession.id)) problems.push(`professions.json: "${profession.id}" pairs with itself`);
    }
  }
  for (const pick of data.picks) {
    checkPair(`profession-picks.json: "${pick.id}"`, pick.professions);
    if (pick.alternative) checkPair(`profession-picks.json: "${pick.id}" alternative`, pick.alternative.professions);
  }

  for (const addon of data.addons) {
    if (new Date(`${addon.checked}T00:00:00Z`) > today) problems.push(`addons.json: "${addon.id}" checked date is in the future`);
    for (const shot of addon.screenshots) {
      if (!shot.src.startsWith(`/addons/${addon.id}/`)) problems.push(`addons.json: "${addon.id}" screenshot ${shot.src} is outside /addons/${addon.id}/`);
    }
  }
  return problems;
}

/**
 * Every spell, talent and former talent name in the data must be in the name
 * dictionary (spell-names.json), once, so Spanish pages never fall back silently.
 */
export function checkNames(data: Pick<Dataset, 'abilities' | 'changes' | 'talents' | 'milestones'>, names: readonly SpellName[]): string[] {
  const problems: string[] = [];
  for (const dup of duplicates(names.map((n) => n.en))) problems.push(`spell-names.json: "${dup}" is listed twice`);
  for (const dup of duplicates(names.map((n) => n.id))) problems.push(`spell-names.json: duplicate id "${dup}"`);
  const known = new Set(names.map((n) => n.en));
  const used = [
    ...data.abilities.map((a) => a.name),
    ...data.talents.map((t) => t.name),
    ...data.changes.flatMap((c) => [c.name, ...(c.formerly ? [c.formerly] : [])]),
    ...data.milestones.flatMap((m) => (m.name ? [m.name] : [])),
  ];
  for (const name of new Set(used)) if (!known.has(name)) problems.push(`spell-names.json: no entry for "${name}"`);
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
  professions: rawProfessions,
  picks: rawPicks,
  addons: rawAddons,
  scrolls: rawScrolls,
});

/** One overview per tree for its talent page: strengths, weaknesses and why a content has no build. */
export const specs = parseList('specs.json', specOverviewSchema, rawSpecs);

/** Best races per situation and faction (races page and «Elige» hub). */
export const racePicks = parseList('race-picks.json', racePickSchema, rawRacePicks);

/** Per-rank talent text for the talent calculator (scripts/talent-text.ts). */
export const talentText = (() => {
  const result = talentTextFileSchema.safeParse(rawTalentText);
  if (!result.success) throw new Error(`Invalid data in src/data/talent-text.json:
${z.prettifyError(result.error)}`);
  return result.data;
})();

/** Glossary terms, in headword order per language at render time. */
export const glossary = parseList('glossary.json', glossarySchema, rawGlossary);

/** Temporary banners; see noticeSchema. */
export const notices = parseList('notices.json', noticeSchema, rawNotices);

/** Notices still worth shipping: not ended at `now` (build time). */
export const liveNotices = (now: Date = new Date(), list: readonly Notice[] = notices) => list.filter((n) => Date.parse(n.end) > now.getTime());

/** Game items quoted on the guide pages (ItemCard). */
export const items = parseList('items.json', itemSchema, rawItems);

/** Books for the librarians, in catalogue order (library page). */
export const libraryBooks = parseList('library-books.json', libraryBookSchema, rawLibraryBooks);

/** Mage class quest chains, by level (class quests page). */
export const classQuests = parseList('class-quests.json', classQuestSchema, rawClassQuests).sort((a, b) => a.level - b.level);

/** The Legacy tree and our builds per situation (legacy page). */
export const legacy = (() => {
  const result = legacyFileSchema.safeParse(rawLegacy);
  if (!result.success) throw new Error(`Invalid data in src/data/legacy.json:
${z.prettifyError(result.error)}`);
  return result.data;
})();

/** Spells learned while leveling, by level (leveling page table and level view). */
export const levelingSpells = parseList('leveling-spells.json', levelingSpellSchema, rawLevelingSpells).sort((a, b) => a.level - b.level);

const integrity = [
  ...checkIntegrity(dataset),
  ...checkNames(dataset, spellNames),
  ...racePicks.flatMap((pick) =>
    (['alliance', 'horde'] as const).flatMap((faction) =>
      pick[faction]
        .filter((id) => dataset.races.find((r) => r.id === id)?.faction !== faction)
        .map((id) => `race-picks.json: "${pick.id}" lists "${id}" under ${faction}, but it is not a race of that faction`),
    ),
  ),
  ...levelingSpells.flatMap((row) =>
    [...row.spells, ...row.ranks.map((r) => r.spell)]
      .filter((name) => !nameEntry(name))
      .map((name) => `leveling-spells.json: level ${row.level} names "${name}", which is not in spell-names.json`),
  ),
];
// Items, library books and class quests: unique ids, known sources and rewards.
{
  const sourceIds = new Set(dataset.sources.map((source) => source.id));
  const itemIds = new Set(items.map((item) => item.id));
  for (const [file, list] of [
    ['items.json', items],
    ['library-books.json', libraryBooks],
    ['class-quests.json', classQuests],
  ] as const) {
    for (const dup of duplicates(list.map((entry) => entry.id))) integrity.push(`${file}: duplicate id "${dup}"`);
  }
  for (const dup of duplicates(items.map((item) => String(item.wowhead)))) integrity.push(`items.json: two items share Wowhead id ${dup}`);
  for (const record of [...libraryBooks, ...classQuests]) {
    for (const source of record.sources) {
      if (!sourceIds.has(source)) integrity.push(`"${record.id}" cites unknown source "${source}"`);
    }
  }
  const perkIds = new Set(legacy.perks.map((perk) => perk.id));
  for (const dup of duplicates(legacy.perks.map((perk) => perk.id))) integrity.push(`legacy.json: duplicate perk "${dup}"`);
  for (const perk of legacy.perks) {
    if (perk.requires && !perkIds.has(perk.requires)) integrity.push(`legacy.json: "${perk.id}" requires unknown perk "${perk.requires}"`);
  }
  for (const build of legacy.builds) integrity.push(...validateLegacyBuild(build, legacy.perks, legacy.cap).map((p) => `legacy.json: ${p}`));
  for (const spec of BUILD_SPECS) {
    const overview = specs.find((s) => s.id === spec);
    if (!overview) {
      integrity.push(`specs.json: no overview for "${spec}"`);
      continue;
    }
    for (const use of BUILD_USES) {
      const has = dataset.builds.some((b) => b.spec === spec && b.uses.includes(use));
      if (!has && !overview.noBuild[use]) integrity.push(`specs.json: "${spec}" has no ${use} build and no reason in noBuild.${use}`);
      if (has && overview.noBuild[use]) integrity.push(`specs.json: "${spec}" explains why there is no ${use} build, but there is one`);
    }
  }
  for (const quest of classQuests) {
    for (const reward of quest.rewards) {
      if (!itemIds.has(reward)) integrity.push(`class-quests.json: "${quest.id}" rewards "${reward}", which is not in items.json`);
    }
    if (quest.rewards.length === 0 && !quest.rewardText) integrity.push(`class-quests.json: "${quest.id}" has no reward`);
  }
}

if (integrity.length > 0) {
  throw new Error(`Content integrity problems:\n- ${integrity.join('\n- ')}`);
}

export const { sources, changes, milestones, abilities, facts, versions, changelog, watchlist, talents, builds, races, professions, picks, addons, scrolls } =
  dataset;

const sourceIndex = new Map(sources.map((s) => [s.id, s]));
const versionIndex = new Map(versions.map((v) => [v.id, v]));
const factIndex = new Map(facts.map((f) => [f.id, f]));
const changeIndex = new Map(changes.map((c) => [c.id, c]));

function lookup<T>(index: Map<string, T>, kind: string, key: string): T {
  const value = index.get(key);
  if (!value) throw new Error(`Unknown ${kind} "${key}"`);
  return value;
}

/** In-game tooltip text by Wowhead spell id (scripts/spell-text.ts). */
export const spellText = (() => {
  const result = spellTextFileSchema.safeParse(rawSpellText);
  if (!result.success) throw new Error(`Invalid data in src/data/spell-text.json:\n${z.prettifyError(result.error)}`);
  return result.data.spells;
})();

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

const professionIndex = new Map(professions.map((p) => [p.id, p]));

export const getProfession = (key: string) => lookup(professionIndex, 'profession', key);

const addonIndex = new Map(addons.map((a) => [a.id, a]));

export const getAddon = (key: string) => lookup(addonIndex, 'addon', key);

const itemIndex = new Map(items.map((item) => [item.id, item]));

export const getItem = (key: string) => lookup(itemIndex, 'item', key);

/** Blocks of one part of the scrolls page, in file order. */
export const scrollsByPart = (part: ScrollBlock['part']) => scrolls.filter((s) => s.part === part);
