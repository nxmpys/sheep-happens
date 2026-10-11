/**
 * WCAG 2.2 contrast checks for the design tokens, in both themes.
 * Reads src/styles/tokens.css so a palette change cannot silently break legibility.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
const tokens = new Map<string, { light: string; dark: string }>();
for (const match of css.matchAll(/--([\w-]+):\s*light-dark\((#[0-9a-f]{6}),\s*(#[0-9a-f]{6})\)/gi)) {
  tokens.set(match[1]!, { light: match[2]!, dark: match[3]! });
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

function token(name: string) {
  const value = tokens.get(name);
  if (!value) throw new Error(`token --${name} not found`);
  return value;
}

/** [foreground, background, minimum ratio] */
const PAIRS: [string, string, number][] = [
  ['text', 'bg', 4.5],
  ['text', 'surface-1', 4.5],
  ['text', 'surface-2', 4.5],
  ['text-muted', 'surface-1', 4.5],
  ['text-muted', 'surface-2', 4.5],
  ['text-subtle', 'surface-1', 4.5],
  ['text-subtle', 'bg', 4.5],
  ['link', 'surface-1', 4.5],
  ['link', 'bg', 4.5],
  ['accent-contrast', 'accent', 4.5],
  ['arcane', 'surface-1', 4.5],
  ['fire', 'surface-1', 4.5],
  ['frost', 'surface-1', 4.5],
  ['baseline', 'surface-1', 4.5],
  ['arcane', 'arcane-soft', 4.5],
  ['fire', 'fire-soft', 4.5],
  ['frost', 'frost-soft', 4.5],
  ['status-verified', 'surface-1', 4.5],
  ['status-reported', 'surface-1', 4.5],
  ['status-classic', 'surface-1', 4.5],
  ['status-analysis', 'surface-1', 4.5],
  ['status-tested', 'surface-1', 4.5],
  ['status-pending', 'surface-1', 4.5],
  ['text', 'warning-soft', 4.5],
  // Non-text UI: focus ring and control borders need 3:1.
  ['focus', 'bg', 3],
  ['focus', 'surface-1', 3],
  ['border-strong', 'surface-1', 3],
  ['border-strong', 'surface-2', 3],
  ['border-strong', 'bg', 3],
];

describe('design token contrast', () => {
  it('parses the palette', () => {
    expect(tokens.size).toBeGreaterThan(20);
  });

  for (const theme of ['light', 'dark'] as const) {
    for (const [fg, bg, min] of PAIRS) {
      it(`${theme}: --${fg} on --${bg} ≥ ${min}:1`, () => {
        const ratio = contrast(token(fg)[theme], token(bg)[theme]);
        expect(ratio, `${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min);
      });
    }
  }
});
