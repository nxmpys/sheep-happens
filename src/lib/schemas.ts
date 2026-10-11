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
export const REF_KINDS = ['change', 'milestone', 'ability', 'fact', 'source'] as const;
export type RefKind = (typeof REF_KINDS)[number];
const ref = z.string().regex(/^(change|milestone|ability|fact|source):[a-z0-9]+(?:-[a-z0-9]+)*$/, 'use "kind:id", e.g. "change:ice-lance"');

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
    summary: localized,
    status: z.enum(STATUSES),
    sources: sourceIds,
    updated,
  })
  .strict();
export type Ability = z.infer<typeof abilitySchema>;

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
