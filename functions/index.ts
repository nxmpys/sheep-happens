/**
 * GET / (Cloudflare Pages Function): sends readers to their language.
 *
 * The saved choice (cookie `sh-lang`, set by the language switch) wins; then
 * the browser's Accept-Language. Requests without either (search engine
 * crawlers) get the static root page, which stays indexable, is the hreflang
 * x-default and links to /es/ and /en/, so it also works without this function.
 */
import { rootLocale } from '../src/lib/lang-redirect';

interface Context {
  request: Request;
  next: () => Promise<Response>;
}

export async function onRequestGet({ request, next }: Context): Promise<Response> {
  const locale = rootLocale(request.headers.get('Cookie'), request.headers.get('Accept-Language'));
  if (!locale) {
    const page = await next();
    const response = new Response(page.body, page);
    response.headers.append('Vary', 'Accept-Language, Cookie');
    return response;
  }
  const url = new URL(request.url);
  url.pathname = `/${locale}/`;
  return new Response(null, {
    status: 302,
    headers: { Location: url.href, Vary: 'Accept-Language, Cookie', 'Cache-Control': 'private, no-store' },
  });
}
