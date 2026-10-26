import { z } from 'astro/zod';
import { LOCALES, PAGE_IDS } from '../i18n/routes';

/** How much we trust a single claim. See docs/content-sources.md. */
export const STATUSES = ['verified', 'reported', 'classic', 'analysis', 'tested', 'pending'] as const;
export type Status = (typeof STATUSES)[number];

export const TREES = ['baseline', 'arcane', 'fire', 'frost'] as const;
export type Tree = (typeof TREES)[number];

export const CHANGE_KINDS = ['new', 'redesigned', 'renamed', 'moved', 'adjusted', 'prerequisite', 'baseline', 'removed'] as const;
export type ChangeKind = (typeof CHANGE_KINDS)[number];

export const SOURCE_KINDS = ['official', 'press', 'community', 'tool', 'classic-reference'] as const;
export type SourceKind = (typeof SOURCE_KINDS)[number];

export const SCHOOLS = ['arcane', 'fire', 'frost', 'frostfire', 'mixed', 'none'] as const;
export const ROLES = ['damage', 'control', 'defense', 'mana', 'utility'] as const;
export type Role = (typeof ROLES)[number];

export const MILESTONE_POINTS = [11, 16, 21, 31] as const;

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'ids are lowercase kebab-case');
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use YYYY-MM-DD');
const partialDate = z.string().regex(/^\d{4}-\d{2}(?:-\d{2})?$/, 'use YYYY-MM or YYYY-MM-DD');

export const localized = z.object({ es: z.string().min(1), en: z.string().min(1) }).strict();
export type Localized = z.infer<typeof localized>;

const sourceIds = z.array(id).min(1, 'every claim needs at least one source');

/**
 * Date of the last content change to a record. Optional for records that have not
 * changed since the first publication; when present, a changelog entry with the
 * same date must reference the record (see checkIntegrity).
 */
const updated = isoDate.optional();

/** Kinds of records a changelog entry can point at, as "kind:id". */
export const REF_KINDS = ['change', 'milestone', 'ability', 'fact', 'source', 'build', 'race', 'profession', 'pick'] as const;
export type RefKind = (typeof REF_KINDS)[number];
const ref = z
  .string()
  .regex(/^(change|milestone|ability|fact|source|build|race|profession|pick):[a-z0-9]+(?:-[a-z0-9]+)*$/, 'use "kind:id", e.g. "change:ice-lance"');

export const sourceSchema = z
  .object({
    id,
    title: z.string().min(1),
    publisher: z.string().min(1),
    url: z.url(),
    kind: z.enum(SOURCE_KINDS),
    published: partialDate.optional(),
    accessed: isoDate,
    notes: localized.optional(),
  })
  .strict();
export type Source = z.infer<typeof sourceSchema>;

export const noteSchema = z.object({ status: z.enum(STATUSES), text: localized }).strict();
export type Note = z.infer<typeof noteSchema>;

export const changeSchema = z
  .object({
    id,
    /** English name; the Spanish one comes from spell-names.json. */
    name: z.string().min(1),
    formerly: z.string().min(1).optional(),
    tree: z.enum(TREES),
    category: z.enum(['ability', 'talent', 'system']),
    kinds: z.array(z.enum(CHANGE_KINDS)).min(1),
    row: z.number().int().min(1).max(7).optional(),
    previousRow: z.number().int().min(1).max(7).optional(),
    milestone: z.literal(MILESTONE_POINTS).optional(),
    learnLevel: z.number().int().min(1).max(60).optional(),
    /**
     * Wowhead spell id for the in-game tooltip text, only for changes that are not
     * a talent or a base ability (those take it from talents.json or abilities.json).
     */
    spell: z.number().int().positive().optional(),
    summary: localized,
    details: z.array(localized).default([]),
    notes: z.array(noteSchema).default([]),
    status: z.enum(STATUSES),
    sources: sourceIds,
    updated,
  })
  .strict()
  .refine((c) => !c.kinds.includes('moved') || (c.row !== undefined && c.previousRow !== undefined), {
    message: '"moved" changes need both row and previousRow',
  })
  .refine((c) => !c.kinds.includes('renamed') || c.formerly !== undefined, {
    message: '"renamed" changes need formerly',
  });
export type Change = z.infer<typeof changeSchema>;

export const milestoneSchema = z
  .object({
    id,
    tree: z.enum(['arcane', 'fire', 'frost']),
    points: z.literal(MILESTONE_POINTS),
    name: z.string().min(1).optional(),
    changeId: id.optional(),
    note: localized.optional(),
    status: z.enum(STATUSES),
    sources: sourceIds,
    updated,
  })
  .strict()
  .refine((m) => m.status === 'pending' || m.name !== undefined, {
    message: 'only pending milestones may omit the talent name',
  });
export type Milestone = z.infer<typeof milestoneSchema>;

export const abilitySchema = z
  .object({
    id,
    /** English name; the Spanish one comes from spell-names.json. */
    name: z.string().min(1),
    school: z.enum(SCHOOLS),
    role: z.enum(ROLES),
    level: z.number().int().min(1).max(60).optional(),
    changeIds: z.array(id).default([]),
    /** Wowhead spell id of rank 1, for the in-game tooltip text (src/data/spell-text.json). */
    spell: z.number().int().positive().optional(),
    summary: localized,
    status: z.enum(STATUSES),
    sources: sourceIds,
    updated,
  })
  .strict();
export type Ability = z.infer<typeof abilitySchema>;

/** Where a Spanish spell name comes from. */
export const NAME_SOURCES = ['official', 'client', 'guide'] as const;

/**
 * One entry of the spell and talent name dictionary (src/data/spell-names.json),
 * the only place Spanish names live. `es` is missing while there is no verified
 * Spanish name: pages then use the English one.
 * - official: published by Blizzard in Spanish for Forever.
 * - client: the Forever client in Spanish (Wowhead Forever, locale es).
 * - guide: our translation of a system that is not a spell (e.g. "Wands").
 */
export const spellNameSchema = z
  .object({
    id,
    en: z.string().min(1),
    es: z.string().min(1).optional(),
    source: z.enum(NAME_SOURCES).optional(),
  })
  .strict()
  .refine((n) => (n.es === undefined) === (n.source === undefined), { message: 'a Spanish name needs its source, and only then' });
export type SpellName = z.infer<typeof spellNameSchema>;

const spellText = z
  .object({ name: z.string().min(1), meta: z.array(z.string().min(1)), text: z.string().min(1), lang: z.literal('en').optional() })
  .strict();
/** In-game tooltip text by Wowhead spell id, written by scripts/spell-text.ts. */
export const spellTextFileSchema = z
  .object({
    fetched: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    spells: z.record(
      z.string().regex(/^\d+$/),
      /** `icon`: client icon file name, served from public/icons/<icon>.jpg. */
      z.object({ icon: z.string().regex(/^[a-z0-9_]+$/).optional(), en: spellText, es: spellText }).strict(),
    ),
  })
  .strict();

const talentRankText = z.object({ name: z.string().min(1), ranks: z.array(z.string().min(1)).min(1), lang: z.literal('en').optional() }).strict();

/** Per-rank talent text from the Wowhead Forever calculator data (scripts/talent-text.ts). */
export const talentTextFileSchema = z
  .object({
    fetched: isoDate,
    source: z.url(),
    talents: z.record(id, z.object({ icon: z.string(), en: talentRankText, es: talentRankText }).strict()),
  })
  .strict();
export type TalentText = z.infer<typeof talentTextFileSchema>;

export const factSchema = z
  .object({ id, label: localized, value: localized, status: z.enum(STATUSES), sources: sourceIds, updated })
  .strict();
export type Fact = z.infer<typeof factSchema>;

export const gameVersionSchema = z
  .object({
    id,
    label: localized,
    /** A few words for the compact page header ("Beta oct 2026"). */
    short: localized,
    stage: z.enum(['beta', 'launch', 'patch']),
    since: isoDate,
    notes: localized.optional(),
    /** Planned launch instant in UTC ("2026-11-04T23:00:00Z"); the home page counts down to it. */
    launchAt: z.iso.datetime().optional(),
  })
  .strict();
export type GameVersion = z.infer<typeof gameVersionSchema>;

export const changelogSchema = z
  .object({
    id,
    date: isoDate,
    type: z.enum(['site', 'guide', 'game']),
    title: localized,
    body: localized,
    pages: z.array(z.enum(PAGE_IDS)).default([]),
    sources: z.array(id).default([]),
    /** Data records this entry documents, e.g. ["change:wake-of-fire", "fact:dual-spec"]. */
    refs: z.array(ref).default([]),
    /** Game client build the entry refers to, e.g. "1.60.1.70338". */
    build: z.string().regex(/^\d+\.\d+\.\d+(?:\.\d+)?$/).optional(),
  })
  .strict();
export type ChangelogEntry = z.infer<typeof changelogSchema>;

export const SPECS = ['arcane', 'fire', 'frost'] as const;
export type SpecTree = (typeof SPECS)[number];

/**
 * One talent of the Forever talent trees (positions, ranks and prerequisites).
 * The layout comes from the Wowhead calculator (data mined from the beta client),
 * so it is structural data, not a claim: effects and values live in changes.json.
 */
export const talentSchema = z
  .object({
    id,
    /** English name; the Spanish one comes from spell-names.json. */
    name: z.string().min(1),
    tree: z.enum(SPECS),
    /** 1–7, top to bottom. Row n needs 5 × (n − 1) points spent in the tree. */
    row: z.number().int().min(1).max(7),
    /** 1–4, left to right. */
    col: z.number().int().min(1).max(4),
    maxRank: z.number().int().min(1).max(5),
    requires: z.object({ talent: id, points: z.number().int().min(1).max(5) }).strict().optional(),
    /** Change record that documents what Forever changed in this talent. */
    changeId: id.optional(),
    /** Wowhead spell id, used for links to the talent's database page. */
    spell: z.number().int().positive(),
  })
  .strict();
export type Talent = z.infer<typeof talentSchema>;

/**
 * The content a build is for, in the order of the builds index: leveling 1–60,
 * then level 60 PvP, dungeons and raid. Language-neutral ids; the localized URL
 * slugs live in src/lib/build-routes.ts.
 */
export const BUILD_USES = ['leveling', 'pvp', 'dungeons', 'raid'] as const;
export type BuildUse = (typeof BUILD_USES)[number];
export const BUILD_SPECS = ['arcane', 'fire', 'frost'] as const;
export type BuildSpec = (typeof BUILD_SPECS)[number];

export const buildSchema = z
  .object({
    id,
    name: localized,
    /** Last URL segment per locale: /builds/<first use>/<slug>/. */
    slug: z.object({ es: id, en: id }).strict(),
    /** Contents it covers; the first one gives the build its URL (/builds/<use>/<slug>/). */
    uses: z.array(z.enum(BUILD_USES)).min(1),
    /**
     * Uses (from `uses`) for which this is the recommended build at its `level`.
     * At most one recommended build per use and level.
     */
    recommendedFor: z.array(z.enum(BUILD_USES)).default([]),
    /** Uses (from `uses`) where it works but I advise against it. Any other use shows it as «viable». */
    discouragedFor: z.array(z.enum(BUILD_USES)).default([]),
    /** Tree with the most points: the build's spec in the index and its colour. */
    spec: z.enum(BUILD_SPECS),
    /** Second tree for hybrid builds (e.g. Frost with Fire for Frostfire Bolt). */
    hybridWith: z.enum(BUILD_SPECS).optional(),
    /** One line for the builds index. */
    tagline: localized,
    /** Client icon file name (public/icons/<icon>.jpg) for the builds index card. Defaults to the first key talent's icon. */
    icon: z.string().optional(),
    /** Character level the build is made for; points available = level − 9 (+ Talented). */
    level: z.number().int().min(10).max(60),
    /**
     * Ranks of the Legacy perk Talented (Adventure tree) the build assumes. Each rank
     * moves the first class talent point one level earlier, so it adds points before
     * level 60 (the maximum stays at 51).
     */
    legacyTalented: z.number().int().min(0).max(5).default(0),
    /** Talent id → rank. Validated against talents.json (ranks, rows, prerequisites). */
    points: z.record(id, z.number().int().min(1).max(5)),
    /**
     * Leveling builds: talent points in the order you spend them, one talent id per
     * point. Point n arrives at level 9 + n (4 + n with Talented 5/5). The first
     * points up to the build's level must add up to `points`; the rest, up to five,
     * are the extra points of players with Talented. To extend a build to a higher
     * level, raise `level`, append points here and update `points`.
     */
    order: z.array(id).max(51).optional(),
    /** Why key points of `order` go where they go, by point number (1 = first point). */
    orderNotes: z
      .array(z.object({ point: z.number().int().min(1).max(51), text: localized }).strict())
      .default([]),
    /** First level the build is meant for (e.g. 22 for an AoE build). Defaults to 1. */
    fromLevel: z.number().int().min(1).max(60).optional(),
    /** Main goal in a few words, shown on the build picker. */
    goal: localized.optional(),
    /** Who should pick it, shown on the build picker. */
    profile: localized.optional(),
    /** Its main upside and downside in a few words, for the build picker. */
    upside: localized.optional(),
    downside: localized.optional(),
    /** Talents to highlight on the card (must have points). */
    keyTalents: z.array(id).max(5).default([]),
    /** One or two sentences: what the build does and when to pick it. */
    summary: localized,
    /** How to play it, as short steps. */
    playstyle: z.array(localized).min(1),
    strengths: z.array(localized).default([]),
    weaknesses: z.array(localized).default([]),
    /** Items, enchantments or consumables that matter for this build, if any. */
    items: z.array(localized).default([]),
    /**
     * Talent variants: a few points moved for another situation. `remove` and
     * `add` (talent id → ranks) describe the swap on the final build, so the page
     * can show it with icons and open it in the calculator; both must add up to
     * the same number of points and leave a valid build (checked in data.ts).
     */
    variants: z
      .array(
        z
          .object({
            name: localized,
            text: localized,
            remove: z.record(id, z.number().int().min(1).max(5)).optional(),
            add: z.record(id, z.number().int().min(1).max(5)).optional(),
          })
          .strict(),
      )
      .default([]),
    /** Stat priority and gear advice, most important first. Empty until there is real data. */
    stats: z.array(localized).default([]),
    /** Page with the in-depth explanation, if there is one. */
    page: z.enum(PAGE_IDS).optional(),
    status: z.enum(STATUSES),
    /** Game version the build was made for (game-versions.json). */
    gameVersion: id,
    sources: sourceIds,
    updated,
  })
  .strict()
  .refine((b) => b.orderNotes.length === 0 || b.order !== undefined, { message: 'orderNotes need an order' })
  .refine((b) => b.recommendedFor.every((use) => b.uses.includes(use)), { message: 'recommendedFor must list uses from `uses`' })
  .refine((b) => b.discouragedFor.every((use) => b.uses.includes(use) && !b.recommendedFor.includes(use)), {
    message: 'discouragedFor must list uses from `uses` that are not in recommendedFor',
  })
  .refine((b) => b.hybridWith !== b.spec, { message: 'hybridWith must be another tree' });
export type Build = z.infer<typeof buildSchema>;

/**
 * Overview of one tree for its talent page (specs.json): what it does well and
 * badly, and, for each content without a build in that tree, why there is none.
 */
export const specOverviewSchema = z
  .object({
    id: z.enum(BUILD_SPECS),
    strengths: z.array(localized).min(1),
    weaknesses: z.array(localized).min(1),
    /** Why the tree has no build for a content. Required for every use without one (checked in data.ts). */
    noBuild: z.partialRecord(z.enum(BUILD_USES), localized).default({}),
    updated,
  })
  .strict();
export type SpecOverview = z.infer<typeof specOverviewSchema>;

export const racialSchema = z
  .object({
    id,
    name: z.string().min(1),
    nameEs: z.string().min(1).optional(),
    /** Wowhead Forever spell id: in-game tooltip text and icon (spell-text.json). */
    spell: z.number().int().positive(),
    kind: z.enum(['active', 'passive']),
    effect: localized,
    /** How much it helps a Mage: our analysis, shown as a rating. */
    value: z.enum(['high', 'medium', 'low', 'none']),
    why: localized,
  })
  .strict();
export type Racial = z.infer<typeof racialSchema>;

export const raceSchema = z
  .object({
    id,
    name: localized,
    faction: z.enum(['alliance', 'horde']),
    /** First time this race can be a Mage. */
    newForMage: z.boolean().default(false),
    access: localized.optional(),
    racials: z.array(racialSchema).min(1),
    /** Reliability of the racial data (effects and values). */
    status: z.enum(STATUSES),
    sources: sourceIds,
    updated,
  })
  .strict();
export type Race = z.infer<typeof raceSchema>;

/**
 * Our race recommendation for one situation (src/data/race-picks.json): the
 * best races per faction and, for each race, why. Shown on the races page and
 * on the «Elige» hub. It is analysis, like the racial values.
 */
export const racePickSchema = z
  .object({
    id,
    situation: localized,
    alliance: z.array(id).min(1),
    horde: z.array(id).min(1),
    /** One reason per listed race, so one race's racials never mix with another's. */
    why: z.record(id, localized),
    /** A line under a faction's races, such as a close runner-up. */
    note: z.object({ alliance: localized.optional(), horde: localized.optional() }).strict().optional(),
  })
  .strict()
  .refine((p) => [...p.alliance, ...p.horde].every((race) => p.why[race]), { message: 'every listed race needs a reason in `why`' })
  .refine((p) => Object.keys(p.why).every((race) => [...p.alliance, ...p.horde].includes(race)), {
    message: '`why` lists a race the pick does not',
  });
export type RacePick = z.infer<typeof racePickSchema>;

/** Our rating of how much something helps a Mage (racials use the same scale). */
export const RATINGS = ['high', 'medium', 'low', 'none'] as const;
export type Rating = (typeof RATINGS)[number];
const rating = z.enum(RATINGS);

/** Two primary professions per character; every secondary one can be learned. */
export const PROFESSION_KINDS = ['crafting', 'gathering', 'secondary'] as const;
/** What a profession mostly gives a Mage: combat power, gold or convenience. */
export const PROFESSION_EDGES = ['combat', 'economy', 'utility'] as const;

/** How useful a profession's camp object is to a Mage (camp buffs table). */
export const CAMP_VALUES = ['yes', 'leveling', 'utility', 'no'] as const;
export type CampValue = (typeof CAMP_VALUES)[number];

/**
 * The profession's first camp object (skill 20) and what it gives when you sit
 * at the campfire. `sameAs` is the class buff it does not stack with.
 */
const campSchema = z
  .object({ object: z.string().min(1), buff: localized, sameAs: localized.optional(), mage: z.enum(CAMP_VALUES) })
  .strict();

export const professionSchema = z
  .object({
    id,
    name: localized,
    kind: z.enum(PROFESSION_KINDS),
    edge: z.enum(PROFESSION_EDGES),
    /** Primary professions: our rating per activity, with the reasons in the text fields. */
    ratings: z
      .object({ pve: rating, pvp: rating, leveling: rating, economy: rating, overall: rating })
      .strict()
      .optional(),
    /** Secondary professions: how much to invest in it compared with other activities. */
    priority: z.enum(['high', 'medium', 'low']).optional(),
    /** Main benefit and main limitation, one line each (comparison table). */
    benefit: localized,
    limitation: localized,
    /** One or two sentences: what it gives a Mage. */
    summary: localized,
    pros: z.array(localized).default([]),
    cons: z.array(localized).default([]),
    pve: localized,
    pvp: localized,
    /** Leveling and gold, when relevant. */
    levelingEconomy: localized.optional(),
    /** Best second primary profession and why. */
    pair: z.object({ with: z.array(id).min(1).max(2), why: localized }).strict().optional(),
    verdict: localized,
    /** Items that back the analysis, with their Wowhead Forever id (names stay in English). */
    items: z
      .array(z.object({ name: z.string().min(1), wowhead: z.number().int().positive(), note: localized }).strict())
      .default([]),
    /** Reliability of the facts (effects, items); the ratings are always our analysis. */
    camp: campSchema.optional(),
    status: z.enum(STATUSES),
    sources: sourceIds,
    updated,
  })
  .strict()
  .refine((p) => (p.kind === 'secondary') === (p.priority !== undefined), {
    message: 'secondary professions need a priority, and only they have one',
  })
  .refine((p) => p.kind === 'secondary' || (p.ratings !== undefined && p.pair !== undefined && p.pros.length > 0 && p.cons.length > 0), {
    message: 'primary professions need ratings, pros, cons and a pair',
  })
  .refine((p) => p.kind !== 'secondary' || (p.ratings === undefined && p.pair === undefined), {
    message: 'secondary professions do not take a primary slot: no ratings or pair',
  });
export type Profession = z.infer<typeof professionSchema>;

/** A recommended pair of primary professions for one goal (overall, PvP, gold…). */
export const professionPickSchema = z
  .object({
    id,
    goal: localized,
    professions: z.array(id).min(1).max(2),
    why: localized,
    advantage: localized,
    sacrifice: localized,
    /** The kind of player it suits. */
    profile: localized,
    /** A reasonable alternative and the situation that justifies it. */
    alternative: z.object({ professions: z.array(id).min(1).max(2), when: localized }).strict().optional(),
    status: z.enum(STATUSES),
    sources: sourceIds,
    updated,
  })
  .strict();
export type ProfessionPick = z.infer<typeof professionPickSchema>;

/** Our own tools are told apart from third-party addons everywhere they appear. */
export const ADDON_ORIGINS = ['own', 'third-party'] as const;
export const ADDON_RELEASES = ['alpha', 'beta', 'release'] as const;
/** Whether the download page can be opened by anyone (a new CurseForge project waits for approval). */
export const ADDON_LISTINGS = ['live', 'pending'] as const;

/**
 * An addon recommended for Mages (src/data/addons.json). Facts that change with each
 * release (version, status, links, captures, features, limits) live here; the page
 * prose explains them. Every claim must match the addon's own documentation or code.
 */
export const addonSchema = z
  .object({
    id,
    name: z.string().min(1),
    origin: z.enum(ADDON_ORIGINS),
    author: z.string().min(1),
    /** Two or three sentences: what it does and for whom (structured data). */
    summary: localized,
    /** Official download page (the only place it is distributed). */
    url: z.url(),
    host: z.string().min(1),
    listing: z.enum(ADDON_LISTINGS),
    /** Addon version as published, e.g. "1.60.1". */
    version: z.string().regex(/^\d+(?:\.\d+)*(?:-\d+)?$/),
    release: z.enum(ADDON_RELEASES),
    /** Game client the release targets: version and interface number from the .toc. */
    game: z.object({ version: z.string().regex(/^\d+\.\d+\.\d+$/), interface: z.number().int().positive() }).strict(),
    languages: z.array(z.enum(['en', 'es'])).min(1),
    /** Square icon under public/, e.g. "/addons/mageprocs/icon.webp". */
    icon: z.string().regex(/^\/[\w/.-]+\.(?:webp|png)$/),
    /** The addon's own published images (in-game captures, framed or not), never mock-ups. */
    screenshots: z
      .array(
        z
          .object({
            src: z.string().regex(/^\/[\w/.-]+\.(?:webp|png|jpg)$/),
            width: z.number().int().positive(),
            height: z.number().int().positive(),
            alt: localized,
            caption: localized,
          })
          .strict(),
      )
      .default([]),
    /** Proc alerts, for proc trackers. */
    procs: z
      .array(
        z
          .object({
            name: localized,
            spec: z.enum(SPECS),
            what: localized,
            /** Enabled on a fresh install. */
            on: z.boolean(),
          })
          .strict(),
      )
      .default([]),
    /** Slash commands, as typed in the chat. */
    commands: z.array(z.object({ command: z.string().regex(/^\//), what: localized }).strict()).default([]),
    install: z.array(localized).min(1),
    limitations: z.array(localized).default([]),
    /** Last date the record was checked against the addon's code and page. */
    checked: isoDate,
  })
  .strict();
export type Addon = z.infer<typeof addonSchema>;

export const WATCH_TYPES = ['rss', 'discourse-topic', 'wago-builds', 'manual'] as const;

/**
 * A source we check on a schedule (see docs/maintenance.md). Unlike sources.json,
 * which lists what the guide cites, this lists where new information appears.
 */
export const watchSchema = z
  .object({
    id,
    name: z.string().min(1),
    publisher: z.string().min(1),
    /** Page a person opens. */
    url: z.url(),
    kind: z.enum(SOURCE_KINDS),
    lang: z.enum(['en', 'es']),
    /** How the watcher reads it. "manual" means a person checks it. */
    type: z.enum(WATCH_TYPES),
    /** Machine-readable endpoint (RSS URL, Discourse topic JSON, builds page). */
    endpoint: z.url().optional(),
    /** Case-insensitive regex applied to item titles (rss) or section names (discourse-topic). */
    match: z.string().min(1).optional(),
    priority: z.enum(['high', 'normal', 'low']),
    focus: localized,
    /** Last date someone confirmed that the URL and endpoint work. */
    verified: isoDate,
    notes: localized.optional(),
  })
  .strict()
  .refine((w) => w.type === 'manual' || w.endpoint !== undefined, { message: 'automatic watches need an endpoint' });
export type Watch = z.infer<typeof watchSchema>;

/** Blocks of the scrolls page (Comprehension), in the order the page shows them. */
export const SCROLL_PARTS = ['flow', 'yes', 'no', 'tier', 'tip', 'unknown'] as const;
export const SCROLL_ICONS = ['scroll', 'stop', 'cast', 'reward', 'move', 'mage', 'level', 'skill', 'sheep', 'bag', 'library'] as const;

/**
 * One claim on the scrolls page (src/data/scrolls.json): a step of the flow, a
 * yes/no card, a skill tier, a tip or an open question. Unknowns are always pending.
 */
export const scrollSchema = z
  .object({
    id,
    part: z.enum(SCROLL_PARTS),
    icon: z.enum(SCROLL_ICONS).optional(),
    title: localized,
    text: localized,
    /** Skill tiers only: what the untranslated scroll asks for and when it stops giving points. */
    tier: z
      .object({
        itemLevel: z.number().int().min(1).max(60),
        requires: z.number().int().min(1),
        greyAt: z.number().int().min(1),
      })
      .strict()
      .refine((t) => t.greyAt > t.requires, { message: 'greyAt must be above requires' })
      .optional(),
    status: z.enum(STATUSES),
    sources: sourceIds,
  })
  .strict()
  .refine((s) => (s.part === 'tier') === (s.tier !== undefined), { message: 'only tier blocks (and all of them) carry tier data' })
  .refine((s) => s.part !== 'unknown' || s.status === 'pending', { message: 'unknown blocks must be pending' });
export type ScrollBlock = z.infer<typeof scrollSchema>;
export type ScrollPart = (typeof SCROLL_PARTS)[number];

/**
 * Spells a Mage learns at a level while leveling (src/data/leveling-spells.json):
 * new spells and new ranks of spells you already have, by English name. The
 * leveling page's table and the level view read it.
 */
export const levelingSpellSchema = z
  .object({
    level: z.number().int().min(1).max(60),
    spells: z.array(z.string().min(1)),
    ranks: z.array(z.object({ spell: z.string().min(1), rank: z.number().int().min(2) }).strict()).default([]),
    use: localized,
  })
  .strict();
export type LevelingSpells = z.infer<typeof levelingSpellSchema>;

/**
 * A temporary banner (src/data/notices.json), e.g. an event this week. It is
 * left out of the build once `end` has passed, and hidden in the browser
 * outside start–end, because the static site may not be rebuilt in time.
 * Times carry their offset ("2026-10-19T00:00:00+02:00" is midnight in Madrid).
 */
export const noticeSchema = z
  .object({
    id,
    start: z.iso.datetime({ offset: true }),
    end: z.iso.datetime({ offset: true }),
    variant: z.enum(['info', 'tip', 'warning']),
    title: localized,
    /** Text before the link, the link and the text after it. */
    before: localized,
    link: z.object({ page: z.enum(PAGE_IDS), label: localized }).strict(),
    after: localized,
    /** Instants worth showing in the reader's own time zone, e.g. when each region opens. */
    times: z.array(z.object({ label: localized, at: z.iso.datetime() }).strict()).optional(),
  })
  .strict()
  .refine((n) => Date.parse(n.start) < Date.parse(n.end), { message: 'a notice must start before it ends' });
export type Notice = z.infer<typeof noticeSchema>;

/**
 * A glossary term (glossary.json): shown in the Glossary section of the Learn
 * page and as a tooltip where the term appears in the guide text. `terms` are
 * the spellings to underline, per language, the first one being the headword.
 */
export const glossarySchema = z
  .object({
    id,
    terms: z.object({ es: z.array(z.string().min(2)).min(1), en: z.array(z.string().min(2)).min(1) }).strict(),
    definition: localized,
  })
  .strict();
export type GlossaryTerm = z.infer<typeof glossarySchema>;

/**
 * A game item quoted on a page (items.json), shown as a card that mimics the
 * in-game tooltip. Names and stats come from the Forever client through the
 * Wowhead database; `wowhead` is its item id there.
 */
export const ITEM_QUALITIES = ['common', 'uncommon', 'rare', 'epic'] as const;
export const itemSchema = z
  .object({
    id,
    wowhead: z.number().int().positive(),
    name: localized,
    /** Client icon file name, served from public/icons/<icon>.jpg. */
    icon: z.string().regex(/^[a-z0-9_]+$/),
    quality: z.enum(ITEM_QUALITIES),
    /** Slot and type, e.g. «Manos · Tela». */
    slot: localized,
    /** White lines: armor, damage, primary stats. */
    stats: z.array(localized).default([]),
    /** Green «Equip:» and «Use:» lines. */
    effects: z.array(localized).default([]),
    /** Level, rank or reputation needed to use or buy it. */
    requires: localized.optional(),
    faction: z.enum(['alliance', 'horde']).optional(),
  })
  .strict();
export type Item = z.infer<typeof itemSchema>;

/** A book for the librarians (library-books.json). */
export const libraryBookSchema = z
  .object({
    id,
    wowhead: z.number().int().positive(),
    name: localized,
    zone: localized,
    place: localized,
    /** Zone map coordinates, e.g. "65.4, 70.1"; absent when the book is inside a building with no useful point. */
    coords: z.string().regex(/^\d{1,2}(\.\d)?, \d{1,2}(\.\d)?$/).optional(),
    how: localized,
    /** Who can reach it without raiding an enemy town. */
    faction: z.enum(['both', 'alliance', 'horde']),
    /** Rough danger of the trip for a Mage: the level band where it stops being a risk. */
    band: z.enum(['1-20', '20-40', '40-60']),
    status: z.enum(STATUSES),
    sources: z.array(id).min(1),
  })
  .strict();
export type LibraryBook = z.infer<typeof libraryBookSchema>;

/** One Mage class quest chain (class-quests.json). */
export const classQuestSchema = z
  .object({
    id,
    /** Level to pick up the chain. */
    level: z.number().int().min(1).max(60),
    /** Level of its hardest objectives, when higher than `level`. */
    hard: z.number().int().min(1).max(60).optional(),
    title: localized,
    /** Who runs it: a faction, some races, or everyone. */
    who: localized,
    start: localized,
    steps: z.array(localized).min(1),
    /** Item ids from items.json the chain lets you choose from. */
    rewards: z.array(id).default([]),
    /** Non-item reward (a spell rank), in words. */
    rewardText: localized.optional(),
    /** Is it worth the trip for a Mage? Our analysis. */
    verdict: localized,
    /** Wowhead quest ids of the chain, in order. */
    quests: z.array(z.number().int().positive()).min(1),
    status: z.enum(STATUSES),
    sources: z.array(id).min(1),
  })
  .strict();
export type ClassQuest = z.infer<typeof classQuestSchema>;

/**
 * The Legacy tree (legacy.json): account-wide perks bought with Legacy points.
 * `tier` is the number of points that must be spent in the same tree first;
 * `requires` a perk that needs at least one rank. Data from the Forever client
 * through Wowhead (texts) and the Wowhead Legacy calculator (structure).
 */
export const LEGACY_TREES = ['professions', 'adventure', 'resourcefulness'] as const;
export type LegacyTree = (typeof LEGACY_TREES)[number];
export const legacyPerkSchema = z
  .object({
    id,
    spell: z.number().int().positive(),
    tree: z.enum(LEGACY_TREES),
    tier: z.union([z.literal(0), z.literal(5), z.literal(10)]),
    ranks: z.number().int().min(1).max(5),
    name: localized,
    icon: z.string().regex(/^[a-z0-9_]+$/),
    effect: localized,
    requires: id.optional(),
    /** How much it helps a Mage: our analysis. */
    mage: z.enum(['high', 'medium', 'low']),
    note: localized,
  })
  .strict();
export type LegacyPerk = z.infer<typeof legacyPerkSchema>;
export const legacyBuildSchema = z
  .object({
    id,
    name: localized,
    situation: localized,
    /** Purchase order as points come in: [perk id, ranks]. */
    steps: z.array(z.tuple([id, z.number().int().min(1).max(5)])).min(1),
    why: z.array(localized).min(1),
  })
  .strict();
export type LegacyBuild = z.infer<typeof legacyBuildSchema>;
export const legacyFileSchema = z
  .object({
    /** Points a character can spend at launch. */
    cap: z.number().int().positive(),
    /** Points the account can earn at launch. */
    earnable: z.number().int().positive(),
    perks: z.array(legacyPerkSchema).min(1),
    builds: z.array(legacyBuildSchema),
  })
  .strict();

/** Frontmatter for every MDX page (validated by the content collection). */
export const pageFrontmatter = z
  .object({
    pageId: z.enum(PAGE_IDS),
    locale: z.enum(LOCALES),
    title: z.string().min(3).max(70),
    /** Optional <title> for search results (≤ 60 chars before the site name). Defaults to title. */
    seoTitle: z.string().min(10).max(60).optional(),
    /** Used for <meta name="description">; keep it within what search engines show. */
    description: z.string().min(50).max(170),
    gameVersion: id,
    published: z.coerce.date(),
    /** Set by hand only after a real content review — never automatically. */
    reviewed: z.coerce.date(),
    reviewedBy: z.string().min(1),
    status: z.enum(['draft', 'published']),
    verification: z.enum(STATUSES),
    summary: z.array(z.string().min(1)).max(5).optional(),
    sources: z.array(id).default([]),
    tags: z.array(z.string()).default([]),
    /**
     * Groups for a long page index: each starts at the heading whose id is
     * `start` and runs to the next group. Shown as collapsible blocks.
     */
    tocGroups: z.array(z.object({ title: z.string().min(1), start: z.string().min(1) }).strict()).optional(),
    /** Full-width page without the side index, for tools that need room (the talent calculator). */
    wide: z.boolean().optional(),
  })
  .strict();
export type PageFrontmatter = z.infer<typeof pageFrontmatter>;
