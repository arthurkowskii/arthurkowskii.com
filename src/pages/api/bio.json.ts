import type { APIRoute } from 'astro';
import { getEntryBySlug } from 'astro:content';

export const GET: APIRoute = async () => {
  try {
    const entry = await getEntryBySlug('bio', 'about');
    const d: any = entry?.data ?? {};
    const payload = {
      title: d.title || '',
      subtitle: d.subtitle || '',
      bio: d.bio || '',
      portrait: d.portrait || '/images/bio/arthur-portfolio.jpg',
      email: d.email || '',
      social: d.social || [],
      skills: d.skills || [],
    };
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to load bio' }), {
      status: 500,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
};

