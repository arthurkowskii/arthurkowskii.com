import { getCollection, getEntryBySlug } from 'astro:content';
import atomConfig from '../atom.config.js';
import { localizeBio, localizeProject } from './content-i18n.js';
import { ensureAbsoluteUrl, toPlainText } from './structured-data.js';

function parseDomainFolder(folder = '') {
  const match = folder.match(/^(\d+)[-_ ]?(.*)$/);
  const order = match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
  const nameRaw = (match ? match[2] : folder) || '';
  const slug = nameRaw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const display = nameRaw.replace(/[-_]+/g, ' ').trim();
  return {
    order,
    slug,
    display
  };
}

function serializeResults(items = []) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (!item) return null;
      const text = item.text || item.description || '';
      return {
        title: item.title ? toPlainText(typeof item.title === 'string' ? item.title : item.title?.fr || item.title?.en) : undefined,
        text: toPlainText(
          typeof text === 'string'
            ? text
            : text?.fr || text?.en || ''
        )
      };
    })
    .filter((entry) => entry && (entry.title || entry.text));
}

export async function loadSiteProfile(locale = 'fr') {
  const [bioEntry, projects] = await Promise.all([
    getEntryBySlug('bio', 'about'),
    getCollection('projects')
  ]);

  const siteUrl = (import.meta.env?.SITE && typeof import.meta.env.SITE === 'string' && import.meta.env.SITE.length > 0)
    ? import.meta.env.SITE.replace(/\/+$/, '')
    : (atomConfig.socialMeta?.siteUrl || 'https://arthurkowskii.com');

  const localizedBio = bioEntry?.data ? localizeBio(bioEntry.data, locale) : {};
  const socialLinks = Array.isArray(bioEntry?.data?.social)
    ? bioEntry.data.social.map((item) => ({
        platform: item.platform,
        url: ensureAbsoluteUrl(item.url, siteUrl)
      }))
    : [];

  const skills = Array.isArray(bioEntry?.data?.skills)
    ? bioEntry.data.skills.map((skillGroup) => ({
        category: skillGroup.category,
        tools: Array.isArray(skillGroup.tools) ? skillGroup.tools : []
      }))
    : [];

  const localizedProjects = projects.map((project) => {
    const folder = (project.id.split('/')[0] || '').trim();
    const domain = parseDomainFolder(folder);
    const localized = localizeProject(project.data, locale);
    const slugParts = project.slug.split('/');
    const slug = slugParts[slugParts.length - 1];

    const bentoResults = localized.bento?.results?.items
      ? serializeResults(localized.bento.results.items)
      : serializeResults(project.data.bento?.results?.items);

    return {
      slug,
      fullSlug: project.slug,
      title: localized.title || project.data.title,
      altTitle: localized.altTitle || project.data.altTitle,
      description: toPlainText(localized.description || ''),
      domain: domain.display.toUpperCase(),
      domainSlug: domain.slug,
      status: localized.status || project.data.status,
      featured: !!project.data.featured,
      useBentoLayout: !!localized.useBentoLayout,
      tech: Array.isArray(localized.tech) ? localized.tech : [],
      date: project.data.date instanceof Date ? project.data.date.toISOString().split('T')[0] : undefined,
      link: localized.link || project.data.link,
      github: localized.github || project.data.github,
      heroImage: localized.bento?.hero?.backgroundImage || localized.image || project.data.image,
      results: bentoResults,
      summary: localized.bento?.process?.subtitle
        ? toPlainText(
            typeof localized.bento.process.subtitle === 'string'
              ? localized.bento.process.subtitle
              : localized.bento.process.subtitle?.fr || localized.bento.process.subtitle?.en || ''
          )
        : undefined
    };
  });

  localizedProjects.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  const featuredProjects = localizedProjects.filter((project) => project.featured).slice(0, 6);
  const primaryProjects = featuredProjects.length > 0 ? featuredProjects : localizedProjects.slice(0, 6);

  return {
    locale,
    siteUrl,
    generatedAt: new Date().toISOString(),
    person: {
      name: localizedBio.title || 'Arthur Kowskii',
      headline: localizedBio.subtitle || 'Composer, Sound Designer & Audio Programmer',
      summary: toPlainText(localizedBio.bio || ''),
      email: bioEntry?.data?.email || '',
      portrait: ensureAbsoluteUrl(bioEntry?.data?.portrait, siteUrl),
      social: socialLinks,
      skills
    },
    highlights: {
      focusAreas: Array.from(
        new Set(localizedProjects.map((project) => project.domain).filter(Boolean))
      ),
      keyResults: primaryProjects.flatMap((project) => project.results).filter(Boolean)
    },
    projects: localizedProjects
  };
}
