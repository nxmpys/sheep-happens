/**
 * Editorial rules for MDX pages that the content-collection schema cannot
 * express on its own (cross-file references, coverage, component usage).
 * Pure: takes file contents, returns problems. Used by scripts/validate-content.ts.
 */
import { parse as parseYaml } from 'yaml';
import { LOCALES, PAGE_IDS, type Locale, type PageId } from '../i18n/routes';
import { pageFrontmatter, STATUSES } from './schemas';
import type { Dataset } from './data';

export interface PageFile {
  /** Path relative to src/content/pages, with forward slashes, e.g. "es/guide.mdx". */
  path: string;
  content: string;
}

export interface PageReport {
  errors: string[];
  warnings: string[];
}

/** Components registered in src/components/mdx.ts (kept in sync by a unit test). */
export const MDX_COMPONENTS = [
  'AbilityGrid',
  'BuildCard',
  'BuildExplorer',
  'Callout',
  'ChangeExplorer',
  'ChangelogList',
  'CritCalculator',
  'FactList',
  'MilestoneMap',
  'PageLink',
  'Pending',
  'Priority',
  'QuestionCards',
  'RaceCards',
  'SourceRefs',
  'SourcesTable',
  'SpecCards',
  'Status',
  'StatusLegend',
  'TalentExplorer',
  'WatchList',
] as const;

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function toDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export interface PageRuleOptions {
  /** Social images present in public/og (e.g. "es-guide.png"). Skipped when undefined. */
  ogImages?: ReadonlySet<string>;
}

export function validatePages(
  files: PageFile[],
  data: Dataset,
  today: Date = new Date(),
  options: PageRuleOptions = {},
): PageReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const sourceIds = new Set(data.sources.map((s) => s.id));
  const versionIds = new Set(data.versions.map((v) => v.id));
  const factIds = new Set(data.facts.map((f) => f.id));
  const published = new Map<Locale, Set<PageId>>(LOCALES.map((l) => [l, new Set()]));
  const todayKey = toDay(today);

  for (const file of files) {
    const where = `src/content/pages/${file.path}`;
    const match = FRONTMATTER.exec(file.content);
    if (!match) {
      errors.push(`${where}: missing frontmatter block`);
      continue;
    }
    const [, rawFrontmatter = '', body = ''] = match;
    const parsed = pageFrontmatter.safeParse(parseYaml(rawFrontmatter));
    if (!parsed.success) {
      errors.push(`${where}: invalid frontmatter: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
      continue;
    }
    const fm = parsed.data;

    const [folder, name] = file.path.split('/');
    if (folder !== fm.locale) errors.push(`${where}: locale "${fm.locale}" does not match folder "${folder}"`);
    if (name !== `${fm.pageId}.mdx`) errors.push(`${where}: file name should be ${fm.pageId}.mdx`);

    if (!versionIds.has(fm.gameVersion)) errors.push(`${where}: unknown gameVersion "${fm.gameVersion}"`);
    for (const id of fm.sources) if (!sourceIds.has(id)) errors.push(`${where}: unknown source "${id}"`);
    if (toDay(fm.reviewed) > todayKey) errors.push(`${where}: reviewed date is in the future`);
    if (fm.published > fm.reviewed) errors.push(`${where}: published after reviewed`);
    if (fm.status === 'draft') warnings.push(`${where}: draft (not routed)`);
    else published.get(fm.locale)!.add(fm.pageId);
    if (options.ogImages && fm.status === 'published' && !options.ogImages.has(`${fm.locale}-${fm.pageId}.png`)) {
      errors.push(`${where}: missing social image public/og/${fm.locale}-${fm.pageId}.png (run npm run og)`);
    }

    // Component usage inside the MDX body.
    for (const [, component] of body.matchAll(/<([A-Z][A-Za-z]+)/g)) {
      if (!(MDX_COMPONENTS as readonly string[]).includes(component!)) {
        errors.push(`${where}: unknown component <${component}> (register it in src/components/mdx.ts)`);
      }
    }
    for (const [, status] of body.matchAll(/<(?:Status|Priority)[^>]*\bstatus="([^"]+)"/g)) {
      if (!(STATUSES as readonly string[]).includes(status!)) errors.push(`${where}: unknown status "${status}"`);
    }
    for (const [, target] of body.matchAll(/<PageLink[^>]*\bto="([^"]+)"/g)) {
      if (!(PAGE_IDS as readonly string[]).includes(target!)) errors.push(`${where}: <PageLink to="${target}"> is not a page id`);
    }
    for (const [, list] of body.matchAll(/<FactList[^>]*\bids=\{\[([^\]]*)\]\}/g)) {
      for (const [, id] of list!.matchAll(/'([^']+)'/g)) {
        if (!factIds.has(id!)) errors.push(`${where}: unknown fact "${id}"`);
      }
    }
    for (const [, id] of body.matchAll(/<BuildCard[^>]*\bid="([^"]+)"/g)) {
      if (!data.builds.some((b) => b.id === id)) errors.push(`${where}: unknown build "${id}"`);
    }
    for (const [, list] of body.matchAll(/<SourceRefs[^>]*\bids=\{\[([^\]]*)\]\}/g)) {
      for (const [, id] of list!.matchAll(/'([^']+)'/g)) {
        if (!sourceIds.has(id!)) errors.push(`${where}: unknown source "${id}"`);
      }
    }
    // Case-sensitive on purpose: the Spanish word "todo" ("all") is not a marker.
    if (/\b(?:TODO|FIXME|TBD)\b/.test(body) || /lorem ipsum/i.test(body)) {
      warnings.push(`${where}: contains TODO or placeholder text`);
    }
  }

  // Every routed page must exist in every locale, or navigation would link to a 404.
  for (const locale of LOCALES) {
    for (const id of PAGE_IDS) {
      if (!published.get(locale)!.has(id)) errors.push(`missing published page "${id}" for locale "${locale}"`);
    }
  }

  return { errors, warnings };
}
