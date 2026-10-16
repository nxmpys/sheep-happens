import { z } from 'astro/zod';
import { LOCALES, PAGE_IDS } from '../i18n/routes';

/** How much we trust a single claim. See docs/content-sources.md. */
export const STATUSES = ['verified', 'reported', 'classic', 'analysis', 'tested', 'pending'] as const;
export type Status = (typeof STATUSES)[number];

export const TREES = ['baseline', 'arcane', 'fire', 'frost'] as const;
export type Tree = (typeof TREES)[number];

export const CHANGE_KINDS = ['new', 'redesigned', 'renamed', 'moved', 'adjusted', 'prerequisite', 'baseline'] as const;
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
    name: z.string().min(1),
    /** Official Spanish name, only once Blizzard publishes it. */
    nameEs: z.string().min(1).optional(),
    formerly: z.string().min(1).optional(),
    /** Official Spanish name of the former talent. */
    formerlyEs: z.string().min(1).optional(),
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
    nameEs: z.string().min(1).optional(),
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
    name: z.string().min(1),
    /** Official Spanish name, only once Blizzard publishes it. */
    nameEs: z.string().min(1).optional(),
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

const spellText = z
  .object({ name: z.string().min(1), meta: z.array(z.string().min(1)), text: z.string().min(1), lang: z.literal('en').optional() })
  .strict();
/** In-game tooltip text by Wowhead spell id, written by scripts/spell-text.ts. */
export const spellTextFileSchema = z
  .object({
    fetched: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    spells: z.record(z.string().regex(/^\d+$/), z.object({ en: spellText, es: spellText }).strict()),
  })
  .strict();

export const factSchema = z
  .object({ id, label: localized, value: localized, status: z.enum(STATUSES), sources: sourceIds, updated })
  .strict();
export type Fact = z.infer<typeof factSchema>;

export const gameVersionSchema = z
  .object({
    id,
    label: localized,
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
    name: z.string().min(1),
    /** Official Spanish name, only once Blizzard publishes it. */
    nameEs: z.string().min(1).optional(),
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

/** What a build is for. Language-neutral ids, also used in the builds page URL. */
export const BUILD_USES = ['leveling', 'aoe', 'dungeons', 'raid', 'pvp', 'duels'] as const;
export type BuildUse = (typeof BUILD_USES)[number];
export const BUILD_SPECS = ['arcane', 'fire', 'frost', 'hybrid'] as const;
export type BuildSpec = (typeof BUILD_SPECS)[number];

export const buildSchema = z
  .object({
    id,
    name: localized,
    uses: z.array(z.enum(BUILD_USES)).min(1),
    spec: z.enum(BUILD_SPECS),
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
    /** Items or consumables that matter for this build, if any. */
    items: z.array(localized).default([]),
    /** Page with the in-depth explanation, if there is one. */
    page: z.enum(PAGE_IDS).optional(),
    status: z.enum(STATUSES),
    /** Game version the build was made for (game-versions.json). */
    gameVersion: id,
    sources: sourceIds,
    updated,
  })
  .strict()
  .refine((b) => b.orderNotes.length === 0 || b.order !== undefined, { message: 'orderNotes need an order' });
export type Build = z.infer<typeof buildSchema>;

export const racialSchema = z
  .object({
    id,
    name: z.string().min(1),
    nameEs: z.string().min(1).optional(),
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

/** Our rating of how much something helps a Mage (racials use the same scale). */
export const RATINGS = ['high', 'medium', 'low', 'none'] as const;
export type Rating = (typeof RATINGS)[number];
const rating = z.enum(RATINGS);

/** Two primary professions per character; every secondary one can be learned. */
export const PROFESSION_KINDS = ['crafting', 'gathering', 'secondary'] as const;
/** What a profession mostly gives a Mage: combat power, gold or convenience. */
export const PROFESSION_EDGES = ['combat', 'economy', 'utility'] as const;

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
  })
  .strict();
export type PageFrontmatter = z.infer<typeof pageFrontmatter>;
