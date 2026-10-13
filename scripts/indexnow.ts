/**
 * npm run indexnow                 → notifies IndexNow of every URL in the live sitemap
 * npm run indexnow -- <url> [...]  → notifies only those URLs (e.g. the pages a revision changed)
 *
 * IndexNow tells Bing, Yandex, Seznam, Naver and Yep that pages changed, so they
 * recrawl them without waiting (Bing also feeds DuckDuckGo, Ecosia and Yahoo).
 * Run it after a deploy, never before: the engines fetch the key file from the
 * live site to check that the request comes from the owner.
 *
 * The key is public by design: public/<key>.txt holds it. To rotate it, replace
 * that file and KEY below in the same commit.
 */
import process from 'node:process';

const KEY = '67cf6c7edcb9b1398cae5a4d7a98b1e4';
const site = new URL(process.env.SITE_URL || 'https://sheephappens.app');

async function text(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} → HTTP ${response.status}`);
  return response.text();
}

const locs = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);

async function sitemapUrls(): Promise<string[]> {
  const index = await text(new URL('sitemap-index.xml', site).href);
  const sitemaps = await Promise.all(locs(index).map(text));
  return sitemaps.flatMap(locs);
}

const keyLocation = new URL(`${KEY}.txt`, site).href;
if ((await text(keyLocation)).trim() !== KEY) {
  console.error(`✗ ${keyLocation} does not hold the key. Deploy first, then run this again.`);
  process.exit(1);
}

const args = process.argv.slice(2);
const urlList = args.length > 0 ? args : await sitemapUrls();
const foreign = urlList.filter((url) => new URL(url).host !== site.host);
if (foreign.length > 0) {
  console.error(`✗ Only ${site.host} URLs can be submitted: ${foreign.join(', ')}`);
  process.exit(1);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: site.host, key: KEY, keyLocation, urlList }),
});
// 200: accepted. 202: accepted, key validation pending (normal the first time).
if (response.status === 200 || response.status === 202) {
  console.log(`✓ IndexNow accepted ${urlList.length} URLs (HTTP ${response.status})`);
} else {
  console.error(`✗ IndexNow answered HTTP ${response.status}: ${await response.text()}`);
  process.exit(1);
}
