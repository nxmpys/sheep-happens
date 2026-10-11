/**
 * Parsers for the weekly source watcher (scripts/watch-sources.ts).
 * Pure functions over fetched text, so they can be unit-tested with fixtures.
 */

export interface FeedItem {
  title: string;
  link: string;
  date: Date | undefined;
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

export function decodeHtml(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (match, name: string) => ENTITIES[name.toLowerCase()] ?? match);
}

function tag(block: string, name: string): string | undefined {
  const match = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i').exec(block);
  return match ? decodeHtml(match[1]!).trim() : undefined;
}

function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** RSS 2.0 and Atom. */
export function parseFeed(xml: string): FeedItem[] {
  const rss = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((m) => m[0]);
  if (rss.length > 0) {
    return rss.map((item) => ({
      title: tag(item, 'title') ?? '',
      link: tag(item, 'link') ?? '',
      date: parseDate(tag(item, 'pubDate') ?? tag(item, 'dc:date')),
    }));
  }
  return [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((m) => {
    const entry = m[0];
    const href = /<link[^>]*href="([^"]+)"/i.exec(entry)?.[1] ?? '';
    return {
      title: tag(entry, 'title') ?? '',
      link: decodeHtml(href),
      date: parseDate(tag(entry, 'updated') ?? tag(entry, 'published')),
    };
  });
}

export function filterItems(items: FeedItem[], since: Date, match?: string): FeedItem[] {
  const pattern = match ? new RegExp(match, 'i') : undefined;
  return items.filter((item) => (!item.date || item.date >= since) && (!pattern || pattern.test(item.title)));
}

/** Turns forum HTML into plain lines (one per paragraph or list item). */
export function htmlToLines(html: string): string[] {
  const text = html
    .replace(/<li[^>]*>/gi, '\n')
    .replace(/<(?:p|br|h\d|ul|ol|div|tr)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '');
  return decodeHtml(text)
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/**
 * Section headings used in Blizzard's beta notes. A section ends at the next
 * of these (spec names such as Arcane/Fire/Frost are sub-headings and do not end it).
 */
export const NOTE_HEADINGS = [
  'Classes', 'Druid', 'Hunter', 'Mage', 'Paladin', 'Priest', 'Rogue', 'Shaman', 'Warlock', 'Warrior',
  'Items', 'Dungeons', 'Raids', 'Quests', 'Professions', 'Creatures', 'Creatures and NPCs', 'PvP',
  'User Interface', 'Bug Fixes', 'Legacy', 'Legacy System', 'Zones', 'Achievements', 'Races', 'General',
  'Talents', 'Systems', 'Art', 'Audio', 'World', 'Known Issues', 'Change Log', 'CHANGE LOG',
  'New to this build - Known Issues',
];

/** Lines of the section whose heading matches `heading` (e.g. /^Mage$/). */
export function extractSection(lines: string[], heading: RegExp): string[] {
  const out: string[] = [];
  let inside = false;
  for (const line of lines) {
    if (heading.test(line)) {
      inside = true;
      continue;
    }
    if (inside && NOTE_HEADINGS.includes(line)) inside = false;
    if (inside) out.push(line);
  }
  return out;
}

export interface TopicPost {
  number: number;
  created: Date;
  updated: Date;
  url: string;
  lines: string[];
}

interface DiscourseTopic {
  title?: string;
  slug?: string;
  id?: number;
  post_stream?: { posts?: { post_number: number; created_at: string; updated_at: string; cooked: string }[] };
}

export function parseDiscourseTopic(json: string, topicUrl: string): { title: string; posts: TopicPost[] } {
  const data = JSON.parse(json) as DiscourseTopic;
  const posts = (data.post_stream?.posts ?? []).map((post) => ({
    number: post.post_number,
    created: new Date(post.created_at),
    updated: new Date(post.updated_at),
    url: `${topicUrl.replace(/\/$/, '')}/${post.post_number}`,
    lines: htmlToLines(post.cooked),
  }));
  return { title: data.title ?? topicUrl, posts };
}

export interface Build {
  build: number;
  version: string;
  product: string;
  created: Date;
}

/** Client builds listed on wago.tools/builds (the page embeds JSON in HTML attributes). */
export function parseWagoBuilds(html: string, productMatch?: string): Build[] {
  const text = decodeHtml(html);
  const pattern = /"created_at":"([\d\- :T.Z]+)"(?:(?!"created_at")[\s\S]){0,1200}?"description":"WOW-(\d+)patch([\d.]+)_(\w+)"/g;
  const product = productMatch ? new RegExp(productMatch, 'i') : undefined;
  const seen = new Set<number>();
  const builds: Build[] = [];
  for (const match of text.matchAll(pattern)) {
    const build = Number(match[2]);
    if (seen.has(build) || (product && !product.test(match[4]!))) continue;
    seen.add(build);
    builds.push({
      build,
      version: `${match[3]}.${build}`,
      product: match[4]!,
      created: new Date(`${match[1]!.replace(' ', 'T')}${match[1]!.endsWith('Z') ? '' : 'Z'}`),
    });
  }
  return builds.sort((a, b) => b.build - a.build);
}
