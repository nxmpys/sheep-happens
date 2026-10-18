/** Small text helpers shared by components. Pure, so they are unit tested. */

/**
 * The first sentence of a paragraph, for one-line teasers. Splits at the first
 * full stop or colon followed by a space; decimals ("0,5 s", "1.5 sec") and
 * abbreviations without a following space are left alone.
 */
export function firstSentence(text: string): string {
  const match = /^(.+?[.:])\s/.exec(text.trim());
  if (!match) return text.trim();
  const sentence = match[1]!;
  return sentence.endsWith(':') ? `${sentence.slice(0, -1)}.` : sentence;
}
