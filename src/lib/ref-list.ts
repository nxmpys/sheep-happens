/**
 * Clean-up of the "Affects" chips of a changelog entry. Kept free of data
 * imports so it stays testable.
 */
import { normalize } from './filters';

export interface ResolvedRef {
  label: string;
  href?: string;
  external?: boolean;
}

/**
 * Drops refs that could not be resolved and keeps one chip per visible name:
 * a change and the ability or milestone it belongs to («Cono de frío»,
 * «Cólera Arcana») are the same thing to a reader. The first one wins, so list
 * the most useful link (usually the change) first.
 */
export function dedupeRefs(refs: readonly (ResolvedRef | undefined)[]): ResolvedRef[] {
  const seen = new Set<string>();
  const out: ResolvedRef[] = [];
  for (const ref of refs) {
    if (!ref) continue;
    const key = normalize(ref.label);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(ref);
  }
  return out;
}
