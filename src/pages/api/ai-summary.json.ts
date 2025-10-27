import type { APIRoute } from 'astro';
import { loadSiteProfile } from '../../utils/site-profile.js';

export const prerender = true;

export const GET: APIRoute = async ({ url }) => {
  const langParam = url.searchParams.get('lang');
  const locale = langParam === 'en' ? 'en' : 'fr';
  const profile = await loadSiteProfile(locale);

  return new Response(JSON.stringify(profile, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
