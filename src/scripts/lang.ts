/**
 * Remembers the reader's language choice: a cookie, read by the root redirect
 * (functions/index.ts) on the next visit to "/", and localStorage, read by the
 * root page itself when it is served without that function.
 */
import { LANG_COOKIE } from '../lib/lang-redirect';

export function saveLanguage(locale: string): void {
  if (locale !== 'es' && locale !== 'en') return;
  try {
    document.cookie = `${LANG_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  } catch {}
  try {
    localStorage.setItem(LANG_COOKIE, locale);
  } catch {}
}
