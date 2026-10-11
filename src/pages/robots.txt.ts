import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const sitemap = site ? new URL(`${base}sitemap-index.xml`, site).href : undefined;
  const body = ['User-agent: *', 'Allow: /', ...(sitemap ? [`Sitemap: ${sitemap}`] : [])].join('\n');
  return new Response(`${body}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
