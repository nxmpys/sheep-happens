/**
 * npm run og
 *
 * Generates the social preview images (1200×630 PNG) for every page and locale
 * in public/og/, plus public/favicon.ico and public/apple-touch-icon.png (both
 * from public/favicon.svg). Run it after changing a page title or the favicon
 * and commit the results: the build does not regenerate them.
 *
 * Fonts: Georgia and Segoe UI from the system (Windows by default). Point
 * OG_FONT_DIR at another folder with georgiab.ttf, segoeui.ttf and seguisb.ttf
 * on other systems. The site name uses Cinzel Decorative, like the header, and
 * the home card's speech bubble Permanent Marker, like the about page; both
 * live in scripts/og-assets as TTF (resvg cannot read the site's woff2), next
 * to the Polymorph sheep the home card shows.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { parse as parseYaml } from 'yaml';
import { ICONS } from '../src/components/ui/icons';
import { LOCALES, ROUTES, type Locale, type PageId } from '../src/i18n/routes';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = join(root, 'public', 'og');
const fontDir = process.env.OG_FONT_DIR ?? 'C:\\Windows\\Fonts';
const assets = join(root, 'scripts', 'og-assets');
const fontFiles = [
  ...['georgiab.ttf', 'segoeui.ttf', 'seguisb.ttf'].map((f) => join(fontDir, f)),
  join(assets, 'cinzel-decorative-700.ttf'),
  join(assets, 'permanent-marker-400.ttf'),
];
const sheepPng = `data:image/png;base64,${readFileSync(join(assets, 'polymorph-sheep.png')).toString('base64')}`;
for (const file of fontFiles) {
  if (!existsSync(file)) {
    console.error(`✗ Font not found: ${file}. Set OG_FONT_DIR to a folder with Georgia Bold and Segoe UI.`);
    process.exit(1);
  }
}

const ACCENT = { arcane: '#cfa6ff', fire: '#ffa266', frost: '#86d3ff', default: '#a98bff' } as const;
const KICKER: Record<Locale, string> = { es: 'GUÍA DE MAGO · WOW: FOREVER', en: 'MAGE GUIDE · WOW: FOREVER' };
const FOOTER: Record<Locale, string> = { es: 'Información con fuentes y estado de verificación', en: 'Sourced information with verification status' };
const HOST = 'sheephappens.app';

function escapeXml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);
}

/** Greedy word wrap using an average glyph width for Georgia Bold. */
function wrap(text: string, fontSize: number, maxWidth: number): string[] {
  const perChar = fontSize * 0.56;
  const maxChars = Math.floor(maxWidth / perChar);
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

const SHEEP = `
  <g fill="#a98bff"><rect x="12.2" y="26" width="2.8" height="8" rx="1.4"/><rect x="23.6" y="26" width="2.8" height="8" rx="1.4"/></g>
  <g fill="#ecebf4"><circle cx="12" cy="19" r="6.4"/><circle cx="19" cy="14.5" r="6.4"/><circle cx="26" cy="19" r="6.4"/><circle cx="15.5" cy="24" r="5.8"/><circle cx="22.5" cy="24" r="5.8"/></g>
  <g fill="#a98bff"><ellipse cx="31.5" cy="20.5" rx="4.6" ry="5.6"/><ellipse cx="28.6" cy="15.6" rx="2.6" ry="1.3" transform="rotate(-25 28.6 15.6)"/></g>
  <circle fill="#0e0d16" cx="32.9" cy="19.4" r="1"/>
  <path fill="#e5c97f" d="M7 1.5l1.3 4.2L12.5 7 8.3 8.3 7 12.5 5.7 8.3 1.5 7l4.2-1.3z"/>`;

function sigil(name: keyof typeof ICONS, color: string): string {
  const paths = ICONS[name].map((d) => `<path d="${d}"/>`).join('');
  return `<g transform="translate(860 150) scale(13)" fill="none" stroke="${color}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.22">${paths}</g>`;
}

function card(locale: Locale, pageId: PageId, title: string): string {
  const spec = ROUTES[pageId].spec;
  const accent = spec ? ACCENT[spec] : ACCENT.default;
  const fontSize = title.length > 40 ? 60 : 66;
  const lines = wrap(title, fontSize, 900).slice(0, 3);
  const lineHeight = Math.round(fontSize * 1.14);
  // First baseline sits below the kicker; three lines still end above the footer rule.
  const startY = 290;
  const titleSvg = lines
    .map((l, i) => `<text x="80" y="${startY + i * lineHeight}" font-family="Georgia" font-weight="700" font-size="${fontSize}" fill="#ecebf4">${escapeXml(l)}</text>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="80%" cy="10%" r="70%">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#0e0d16" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0e0d16"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  ${sigil(spec ?? 'arcane', accent)}
  <rect x="0" y="0" width="12" height="630" fill="${accent}"/>
  <g transform="translate(76 52) scale(1.7)">${SHEEP}</g>
  <text x="156" y="100" font-family="Cinzel Decorative" font-weight="700" font-size="34" fill="#ecebf4">Sheep Happens</text>
  <text x="80" y="200" font-family="Segoe UI" font-weight="600" font-size="24" letter-spacing="3" fill="${accent}">${escapeXml(KICKER[locale])}</text>
  ${titleSvg}
  <rect x="80" y="520" width="1040" height="1" fill="#2f2b45"/>
  <text x="80" y="570" font-family="Segoe UI" font-size="26" fill="#b6b1cb">${escapeXml(FOOTER[locale])}</text>
  <text x="1120" y="570" text-anchor="end" font-family="Segoe UI" font-weight="600" font-size="26" fill="#ecebf4">${HOST}</text>
</svg>`;
}

const HOME: Record<Locale, { tagline: string; chips: string[]; cta: string; bleat: string }> = {
  es: {
    tagline: 'La guía del Mago para WoW: Forever',
    chips: ['Leveo 1-60', 'Calculadora de talentos', 'Cambios vs Classic'],
    cta: 'Entra y lanza tu primera Polimorfia',
    bleat: '¡Beee!',
  },
  en: {
    tagline: 'The Mage guide for WoW: Forever',
    chips: ['Leveling 1-60', 'Talent calculator', 'Changes from Classic'],
    cta: 'Come in and cast your first Polymorph',
    bleat: 'Baaa!',
  },
};

/** A four-point sparkle centred on (x, y). */
function star(x: number, y: number, r: number, color: string, opacity = 1): string {
  const k = r * 0.28;
  return `<path fill="${color}" opacity="${opacity}" d="M${x} ${y - r}L${x + k} ${y - k}L${x + r} ${y}L${x + k} ${y + k}L${x} ${y + r}L${x - k} ${y + k}L${x - r} ${y}L${x - k} ${y - k}Z"/>`;
}

/**
 * The home card, the one people see when they share the site: the name big in
 * the header's typeface, what the guide offers, and the Polymorph sheep in an
 * arcane circle saying hello, to make people want to come in.
 */
function homeCard(locale: Locale): string {
  const t = HOME[locale];
  let chipX = 80;
  const chips = t.chips
    .map((label) => {
      const w = Math.round(label.length * 11 + 40);
      const g = `<rect x="${chipX}" y="368" width="${w}" height="46" rx="23" fill="#1d1a2c" stroke="#3b3552"/><text x="${chipX + w / 2}" y="398" text-anchor="middle" font-family="Segoe UI" font-weight="600" font-size="21" fill="#ecebf4">${escapeXml(label)}</text>`;
      chipX += w + 14;
      return g;
    })
    .join('');
  const ctaW = Math.round(t.cta.length * 12.6 + 100);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="78%" cy="52%" r="48%">
      <stop offset="0" stop-color="#8a4dff" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#0e0d16" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="dusk" cx="0%" cy="0%" r="80%">
      <stop offset="0" stop-color="#2a1f42" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#0e0d16" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10"/></filter>
  </defs>
  <rect width="1200" height="630" fill="#0e0d16"/>
  <rect width="1200" height="630" fill="url(#dusk)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="12" height="630" fill="#a98bff"/>

  <g transform="translate(935 330)" fill="none" stroke="#cfa6ff">
    <circle r="200" stroke-opacity="0.18" stroke-width="2"/>
    <circle r="170" stroke-opacity="0.45" stroke-width="3" stroke-dasharray="4 14" stroke-linecap="round"/>
    <circle r="140" stroke-opacity="0.3" stroke-width="2"/>
    <path d="M0-170L147 85L-147 85Z M0 170L-147-85L147-85Z" stroke-opacity="0.22" stroke-width="2"/>
  </g>
  <ellipse cx="935" cy="470" rx="120" ry="22" fill="#cfa6ff" opacity="0.35" filter="url(#soft)"/>
  <image href="${sheepPng}" x="850" y="190" width="170" height="291"/>
  ${star(830, 205, 18, '#e5c97f')}
  ${star(1070, 250, 13, '#ffffff', 0.9)}
  ${star(1045, 430, 10, '#cfa6ff')}
  ${star(812, 420, 8, '#ffffff', 0.8)}
  <g transform="translate(1030 150) rotate(-6)">
    <rect x="-8" y="-40" width="140" height="58" rx="18" fill="#ffffff"/>
    <path d="M14 14l-10 22 28-20z" fill="#ffffff"/>
    <text x="62" y="2" text-anchor="middle" font-family="Permanent Marker" font-size="30" fill="#140f22">${escapeXml(t.bleat)}</text>
  </g>

  <g transform="translate(76 70) scale(1.5)">${SHEEP}</g>
  <text x="80" y="200" font-family="Segoe UI" font-weight="600" font-size="24" letter-spacing="3" fill="#a98bff">${escapeXml(KICKER[locale])}</text>
  <text x="76" y="300" font-family="Cinzel Decorative" font-weight="700" font-size="92" fill="#ecebf4">Sheep Happens</text>
  <text x="80" y="346" font-family="Georgia" font-weight="700" font-size="32" fill="#cfa6ff">${escapeXml(t.tagline)}</text>
  ${chips}
  <rect x="80" y="470" width="${ctaW}" height="66" rx="33" fill="#a98bff"/>
  <text x="${80 + 34}" y="513" font-family="Segoe UI" font-weight="600" font-size="26" fill="#120f1f">${escapeXml(t.cta)}  →</text>
  <text x="1120" y="590" text-anchor="end" font-family="Segoe UI" font-weight="600" font-size="24" fill="#b6b1cb">${HOST}</text>
</svg>`;
}

function render(svg: string, width: number): Buffer {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Georgia' },
  });
  return resvg.render().asPng();
}

mkdirSync(outDir, { recursive: true });
let count = 0;
for (const locale of LOCALES) {
  const dir = join(root, 'src', 'content', 'pages', locale);
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.mdx'))) {
    const frontmatter = parseYaml(readFileSync(join(dir, file), 'utf8').split(/^---\s*$/m)[1] ?? '') as {
      pageId: PageId;
      title: string;
      seoTitle?: string;
    };
    const svg = frontmatter.pageId === 'home' ? homeCard(locale) : card(locale, frontmatter.pageId, frontmatter.seoTitle ?? frontmatter.title);
    writeFileSync(join(outDir, `${locale}-${frontmatter.pageId}.png`), render(svg, 1200));
    count++;
  }
}

/** Packs PNG images into an .ico file (PNG entries, supported everywhere since Windows Vista). */
function ico(pngs: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ size, data }, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size % 256, entry);
    header.writeUInt8(size % 256, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.data)]);
}

// public/favicon.svg is the source of the raster icons. Google wants square
// multiples of 48 px, so favicon.ico carries 48 px besides 16 and 32.
const favicon = readFileSync(join(root, 'public', 'favicon.svg'), 'utf8');
writeFileSync(join(root, 'public', 'favicon.ico'), ico([16, 32, 48].map((size) => ({ size, data: render(favicon, size) }))));
// The touch icon must be opaque and full-bleed: iOS rounds the corners itself.
const touch = favicon.replace(/(<svg[^>]*>)/, '$1<rect width="48" height="48" fill="#0e0d16"/>');
writeFileSync(join(root, 'public', 'apple-touch-icon.png'), render(touch, 180));
console.log(`✓ ${count} social images in public/og/, plus public/favicon.ico and public/apple-touch-icon.png`);
