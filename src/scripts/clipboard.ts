/**
 * Copies text to the clipboard. Resolves false instead of throwing, e.g. on
 * insecure origins where the Clipboard API is unavailable; callers then tell
 * the reader to copy the URL from the address bar.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
