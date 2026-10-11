/**
 * npm run og
 *
 * Generates the social preview images (1200×630 PNG) for every page and locale
 * in public/og/, plus public/apple-touch-icon.png. Run it after changing a page
 * title and commit the results: the build does not regenerate them.
 *
 * Fonts: Georgia and Segoe UI from the system (Windows by default). Point
 * OG_FONT_DIR at another folder with georgiab.ttf, segoeui.ttf and seguisb.ttf
 * on other systems.
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
const fontFiles = ['georgiab.ttf', 'segoeui.ttf', 'seguisb.ttf'].map((f) => join(fontDir, f));
for (const file of fontFiles) {
  if (!existsSync(file)) {
    console.error(`✗ Font not found: ${file}. Set OG_FONT_DIR to a folder with Georgia Bold and Segoe UI.`);
    process.exit(1);
  }
}

const ACCENT = { arcane: '#cfa6ff', fire: '#ffa266', frost: '#86d3ff', default: '#a98bff' } as const;
const KICKER: Record<Locale, string> = { es: 'GUÍA DE MAGO · WOW: FOREVER', en: 'MAGE GUIDE · WOW: FOREVER' };
const FOOTER: Record<Locale, string> = { es: 'Información con fuentes y estado de verificación', en: 'Sourced information with verification status' };
const HOST = 'sheep-happens.pages.dev';

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
  <text x="156" y="100" font-family="Georgia" font-weight="700" font-size="36" fill="#ecebf4">Sheep Happens</text>
  <text x="80" y="200" font-family="Segoe UI" font-weight="600" font-size="24" letter-spacing="3" fill="${accent}">${escapeXml(KICKER[locale])}</text>
  ${titleSvg}
  <rect x="80" y="520" width="1040" height="1" fill="#2f2b45"/>
  <text x="80" y="570" font-family="Segoe UI" font-size="26" fill="#b6b1cb">${escapeXml(FOOTER[locale])}</text>
  <text x="1120" y="570" text-anchor="end" font-family="Segoe UI" font-weight="600" font-size="26" fill="#ecebf4">${HOST}</text>
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
    };
    writeFileSync(join(outDir, `${locale}-${frontmatter.pageId}.png`), render(card(locale, frontmatter.pageId, frontmatter.title), 1200));
    count++;
  }
}

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 40 40">
  <rect width="40" height="40" fill="#0e0d16"/><g transform="translate(2.5 3) scale(0.88)">${SHEEP}</g></svg>`;
writeFileSync(join(root, 'public', 'apple-touch-icon.png'), render(icon, 180));
console.log(`✓ ${count} social images in public/og/ and public/apple-touch-icon.png`);
