import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import atomConfig from '../atom.config.js';

export const prerender = true;

function normalizeSiteUrl(url?: string) {
  if (!url) return 'https://arthurkowskii.com';
  return url.replace(/\/+$/, '');
}

function formatDate(input?: Date | string) {
  if (!input) return new Date().toISOString();
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

function buildUrlElement({
  loc,
  lastmod,
  changefreq = 'monthly',
  priority = '0.7',
  alternates = []
}: {
  loc: string;
  lastmod: string;
  changefreq?: string;
  priority?: string;
  alternates?: Array<{ hreflang: string; href: string }>;
}) {
  const links = alternates
    .map(
      (alt) =>
        `<xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`
    )
    .join('');
  return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority>${links}</url>`;
}

export const GET: APIRoute = async () => {
  const projects = await getCollection('projects');
  const rawSiteUrl = import.meta.env.SITE || atomConfig.socialMeta?.siteUrl;
  const siteUrl = normalizeSiteUrl(typeof rawSiteUrl === 'string' ? rawSiteUrl : undefined);

  const todayIso = new Date().toISOString();

  const staticEntries = [
    {
      loc: `${siteUrl}/`,
      lastmod: todayIso,
      priority: '1.0',
      alternates: [
        { hreflang: 'fr', href: `${siteUrl}/` },
        { hreflang: 'en', href: `${siteUrl}/en` },
        { hreflang: 'x-default', href: `${siteUrl}/` }
      ]
    },
    {
      loc: `${siteUrl}/en`,
      lastmod: todayIso,
      priority: '1.0',
      alternates: [
        { hreflang: 'fr', href: `${siteUrl}/` },
        { hreflang: 'en', href: `${siteUrl}/en` },
        { hreflang: 'x-default', href: `${siteUrl}/` }
      ]
    },
    {
      loc: `${siteUrl}/bio`,
      lastmod: todayIso,
      alternates: [
        { hreflang: 'fr', href: `${siteUrl}/bio` },
        { hreflang: 'en', href: `${siteUrl}/en/bio` }
      ]
    },
    {
      loc: `${siteUrl}/en/bio`,
      lastmod: todayIso,
      alternates: [
        { hreflang: 'fr', href: `${siteUrl}/bio` },
        { hreflang: 'en', href: `${siteUrl}/en/bio` }
      ]
    },
    {
      loc: `${siteUrl}/ai-summary`,
      lastmod: todayIso,
      alternates: [
        { hreflang: 'fr', href: `${siteUrl}/ai-summary` },
        { hreflang: 'en', href: `${siteUrl}/en/ai-summary` }
      ]
    },
    {
      loc: `${siteUrl}/en/ai-summary`,
      lastmod: todayIso,
      alternates: [
        { hreflang: 'fr', href: `${siteUrl}/ai-summary` },
        { hreflang: 'en', href: `${siteUrl}/en/ai-summary` }
      ]
    }
  ];

  const projectEntries = projects.flatMap((project) => {
    const slugParts = project.slug.split('/');
    const slug = slugParts[slugParts.length - 1];
    const lastmod = formatDate(project.data.date);

    const frenchEntry = {
      loc: `${siteUrl}/projects/${slug}`,
      lastmod,
      alternates: [
        { hreflang: 'fr', href: `${siteUrl}/projects/${slug}` },
        { hreflang: 'en', href: `${siteUrl}/en/projects/${slug}` }
      ]
    };

    const englishEntry = {
      loc: `${siteUrl}/en/projects/${slug}`,
      lastmod,
      alternates: [
        { hreflang: 'fr', href: `${siteUrl}/projects/${slug}` },
        { hreflang: 'en', href: `${siteUrl}/en/projects/${slug}` }
      ]
    };

    return [frenchEntry, englishEntry];
  });

  const allEntries = [...staticEntries, ...projectEntries];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
  ]
    .concat(allEntries.map((entry) => buildUrlElement(entry)))
    .concat(['</urlset>'])
    .join('');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
