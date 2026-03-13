import type { APIRoute } from 'astro';
import { getPreviewDraft, setPreviewDraft, clearPreviewDraft } from '../../studio/server/preview-store.js';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const session = url.searchParams.get('session') || '';
  const draft = getPreviewDraft(session);
  if (!draft) {
    return new Response(JSON.stringify({ error: 'Preview draft not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  return new Response(JSON.stringify(draft), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const payload = await request.json();
  const session = String(payload?.session || '');
  if (!session) {
    return new Response(JSON.stringify({ error: 'Session is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  setPreviewDraft(session, payload?.draft || null);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
};

export const DELETE: APIRoute = async ({ url }) => {
  const session = url.searchParams.get('session') || '';
  clearPreviewDraft(session);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
};
