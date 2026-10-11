import { describe, expect, it } from 'vitest';
import {
  decodeHtml,
  extractSection,
  filterItems,
  htmlToLines,
  parseDiscourseTopic,
  parseFeed,
  parseWagoBuilds,
} from '../src/lib/watch';

const RSS = `<?xml version="1.0"?><rss><channel>
<item><title>WoW Forever Beta Development Notes &#8211; Updated October 8</title><link>https://us.forums.blizzard.com/en/wow/t/x/2360696/5</link><pubDate>Wed, 08 Oct 2026 22:10:00 +0000</pubDate></item>
<item><title><![CDATA[Midnight 12.1.5 Content Update]]></title><link>https://example.com/a</link><pubDate>Thu, 09 Oct 2026 10:00:00 +0000</pubDate></item>
<item><title>WoW Forever: old post</title><link>https://example.com/old</link><pubDate>Mon, 01 Sep 2026 10:00:00 +0000</pubDate></item>
</channel></rss>`;

const ATOM = `<feed><entry><title>Patch 1.60.1</title><link rel="alternate" href="https://wiki.example/Patch?a=1&amp;b=2"/><updated>2026-10-10T05:00:00Z</updated></entry></feed>`;

describe('parseFeed', () => {
  it('reads RSS items with decoded titles and dates', () => {
    const items = parseFeed(RSS);
    expect(items).toHaveLength(3);
    expect(items[0]!.title).toBe('WoW Forever Beta Development Notes – Updated October 8');
    expect(items[1]!.title).toBe('Midnight 12.1.5 Content Update');
    expect(items[0]!.date?.toISOString()).toBe('2026-10-08T22:10:00.000Z');
  });

  it('reads Atom entries', () => {
    expect(parseFeed(ATOM)).toEqual([
      { title: 'Patch 1.60.1', link: 'https://wiki.example/Patch?a=1&b=2', date: new Date('2026-10-10T05:00:00Z') },
    ]);
  });

  it('filters by date and title pattern', () => {
    const recent = filterItems(parseFeed(RSS), new Date('2026-10-04T00:00:00Z'), 'Forever');
    expect(recent.map((i) => i.link)).toEqual(['https://us.forums.blizzard.com/en/wow/t/x/2360696/5']);
  });
});

describe('dev notes extraction', () => {
  const cooked =
    '<h3>Change Log</h3><ul><li>Druid<ul><li>Fixed a bug.</li></ul></li><li>Mage<ul><li>Arcane Missiles no longer checks line of sight on each missile.</li><li>Fire<ul><li>Wake of Fire buff duration has been increased to 30 seconds (was 20 seconds).</li></ul></li></ul></li><li>Paladin<ul><li>Reckoning change.</li></ul></li></ul>';

  it('turns forum HTML into lines', () => {
    expect(htmlToLines('<p>One &amp; two</p><ul><li>Three</li></ul>')).toEqual(['One & two', 'Three']);
  });

  it('keeps the Mage section, including spec sub-headings, and stops at the next class', () => {
    expect(extractSection(htmlToLines(cooked), /^Mage$/)).toEqual([
      'Arcane Missiles no longer checks line of sight on each missile.',
      'Fire',
      'Wake of Fire buff duration has been increased to 30 seconds (was 20 seconds).',
    ]);
  });

  it('parses a Discourse topic', () => {
    const json = JSON.stringify({
      title: 'Dev notes',
      post_stream: { posts: [{ post_number: 5, created_at: '2026-10-08T22:00:00Z', updated_at: '2026-10-08T23:00:00Z', cooked }] },
    });
    const topic = parseDiscourseTopic(json, 'https://us.forums.blizzard.com/en/wow/t/2360696');
    expect(topic.posts[0]!.url).toBe('https://us.forums.blizzard.com/en/wow/t/2360696/5');
    expect(topic.posts[0]!.lines).toContain('Mage');
  });
});

describe('parseWagoBuilds', () => {
  it('extracts Forever builds, newest first, without duplicates', () => {
    const html =
      '&quot;created_at&quot;:&quot;2026-10-09 22:49:04&quot;,&quot;major&quot;:60,&quot;config&quot;:{&quot;description&quot;:&quot;WOW-70334patch1.60.1_ForeverBeta&quot;}' +
      '&quot;created_at&quot;:&quot;2026-10-10 05:05:05&quot;,&quot;config&quot;:{&quot;description&quot;:&quot;WOW-70338patch1.60.1_ForeverBeta&quot;}' +
      '&quot;created_at&quot;:&quot;2026-10-10 06:00:00&quot;,&quot;config&quot;:{&quot;description&quot;:&quot;WOW-99999patch12.1.5_Retail&quot;}' +
      '&quot;created_at&quot;:&quot;2026-10-10 05:05:05&quot;,&quot;config&quot;:{&quot;description&quot;:&quot;WOW-70338patch1.60.1_ForeverBeta&quot;}';
    const builds = parseWagoBuilds(html, 'Forever');
    expect(builds.map((b) => b.version)).toEqual(['1.60.1.70338', '1.60.1.70334']);
    expect(builds[0]!.created.toISOString()).toBe('2026-10-10T05:05:05.000Z');
  });
});

describe('decodeHtml', () => {
  it('handles numeric, hex and named entities', () => {
    expect(decodeHtml('&#8211; &#x2014; &amp; &quot;')).toBe('– — & "');
  });
});
