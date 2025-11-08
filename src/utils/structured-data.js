/**
 * Structured data builders for SEO and AI crawlers.
 * Generates JSON-LD payloads with consistent locale handling.
 */

const localeToSchemaLang = {
  fr: 'fr-FR',
  en: 'en-US'
};

/**
 * Convert a locale code to a schema.org language code.
 * @param {string} locale
 * @returns {string}
 */
function mapLocale(locale = 'fr') {
  return localeToSchemaLang[locale] || locale || 'fr-FR';
}

/**
 * Ensure URL is absolute by prefixing with the site origin when needed.
 * @param {string|undefined} url
 * @param {string} siteUrl
 * @returns {string|undefined}
 */
export function ensureAbsoluteUrl(url, siteUrl) {
  if (!url) return undefined;
  try {
    const parsed = new URL(url, siteUrl);
    return parsed.toString();
  } catch {
    return undefined;
  }
}

/**
 * Convert HTML or markdown-ish content to a compact plain-text string.
 * @param {string|undefined} value
 * @returns {string}
 */
export function toPlainText(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }
  return value
    .replace(/<\/?[^>]+(>|$)/g, ' ') // Remove HTML tags
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Remove undefined / null / empty array values from an object.
 * @param {Record<string, any>} input
 * @returns {Record<string, any>}
 */
function compactObject(input) {
  return Object.fromEntries(
    Object.entries(input).filter(([_, value]) => {
      if (value === undefined || value === null) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === 'object' && !Array.isArray(value)) {
        return Object.keys(value).length > 0;
      }
      return true;
    })
  );
}

/**
 * Build Person schema.org JSON-LD payload.
 * @param {object} params
 * @param {object} params.bio - Localized bio data (title, subtitle, bio, email, social, skills, portrait)
 * @param {string} params.locale - Locale code ('fr' | 'en')
 * @param {string} params.siteUrl - Base site URL
 * @param {string} params.currentUrl - Canonical URL for the current page
 * @param {string} [params.image] - Preferred image URL
 * @returns {object}
 */
export function buildPersonStructuredData({ bio = {}, locale = 'fr', siteUrl, currentUrl, image }) {
  const schemaLocale = mapLocale(locale);
  const sameAs = Array.isArray(bio.social)
    ? bio.social
        .map((item) => item?.url)
        .filter((url) => {
          if (!url) return false;
          try {
            const parsed = new URL(url);
            return !!parsed.protocol?.startsWith('http');
          } catch {
            return false;
          }
        })
    : [];

  const knowsAbout = Array.isArray(bio.skills)
    ? bio.skills
        .flatMap((skillGroup) => {
          const items = [];
          if (skillGroup?.category) items.push(skillGroup.category);
          if (Array.isArray(skillGroup?.tools)) items.push(...skillGroup.tools);
          return items;
        })
        .filter(Boolean)
    : [];

  const payload = compactObject({
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: bio.title || 'Arthur Kowskii',
    alternateName: bio.altTitle || undefined,
    headline: bio.subtitle || undefined,
    jobTitle: bio.subtitle || undefined,
    description: toPlainText(bio.bio) || undefined,
    disambiguatingDescription: toPlainText(bio.tagline) || undefined,
    url: currentUrl || siteUrl,
    image: ensureAbsoluteUrl(image || bio.portrait, siteUrl),
    mainEntityOfPage: currentUrl || siteUrl,
    inLanguage: schemaLocale,
    email: bio.email ? `mailto:${bio.email}` : undefined,
    sameAs: sameAs.length ? Array.from(new Set(sameAs)) : undefined,
    knowsAbout: knowsAbout.length ? Array.from(new Set(knowsAbout)) : undefined,
    worksFor: bio.worksFor
      ? compactObject({
          '@type': 'Organization',
          name: bio.worksFor?.name,
          url: ensureAbsoluteUrl(bio.worksFor?.url, siteUrl)
        })
      : undefined
  });

  return payload;
}

/**
 * Build WebSite schema.org payload.
 * @param {object} params
 * @returns {object}
 */
export function buildWebsiteStructuredData({ siteUrl, locale = 'fr', name, description }) {
  const schemaLocale = mapLocale(locale);
  return compactObject({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    inLanguage: schemaLocale,
    name,
    description: toPlainText(description) || undefined,
    publisher: {
      '@id': `${siteUrl}/#person`
    }
  });
}

/**
 * Build CreativeWork schema.org payload for a project page.
 * @param {object} params
 * @param {object} params.project - Localized project data
 * @param {string} params.locale - Locale code ('fr' | 'en')
 * @param {string} params.siteUrl - Base site URL
 * @param {string} params.currentUrl - Canonical URL for the project page
 * @param {string} [params.image] - Preferred image URL
 * @param {string} [params.thumbnail] - Optional thumbnail URL
 * @returns {object}
 */
export function buildProjectStructuredData({ project, locale = 'fr', siteUrl, currentUrl, image, thumbnail }) {
  const schemaLocale = mapLocale(locale);
  if (!project) return {};

  const keywords = Array.isArray(project.tech) ? project.tech.filter(Boolean) : [];
  const externalLinks = [project.link, project.github].filter(Boolean);

  const statusMap = {
    completed: 'https://schema.org/Completed',
    'in-progress': 'https://schema.org/Active',
    planned: 'https://schema.org/Proposed'
  };

  const creativeWork = compactObject({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${currentUrl}#project`,
    url: currentUrl,
    name: project.title || project.altTitle,
    alternateName: project.altTitle || undefined,
    headline: project.title || undefined,
    description: toPlainText(project.description) || undefined,
    abstract: toPlainText(project.summary || project.description) || undefined,
    inLanguage: schemaLocale,
    identifier: project.slug || project.id || undefined,
    keywords: keywords.length ? keywords : undefined,
    genre: project.domain || undefined,
    creativeWorkStatus: project.status ? statusMap[project.status] || project.status : undefined,
    datePublished: project.date instanceof Date ? project.date.toISOString().split('T')[0] : undefined,
    dateModified: project.updatedAt instanceof Date ? project.updatedAt.toISOString().split('T')[0] : undefined,
    author: {
      '@id': `${siteUrl}/#person`
    },
    creator: {
      '@id': `${siteUrl}/#person`
    },
    producer: project.client
      ? compactObject({
          '@type': 'Organization',
          name: project.client.name,
          url: ensureAbsoluteUrl(project.client.url, siteUrl)
        })
      : undefined,
    isAccessibleForFree: true,
    mainEntityOfPage: currentUrl,
    image: ensureAbsoluteUrl(image || project.image, siteUrl),
    thumbnailUrl: ensureAbsoluteUrl(thumbnail || project.thumbnail, siteUrl),
    sameAs: externalLinks.length ? externalLinks.map((url) => ensureAbsoluteUrl(url, siteUrl)).filter(Boolean) : undefined
  });

  return creativeWork;
}

/**
 * Build an ItemList structured data node to highlight key projects.
 * @param {Array<object>} projects - Array of localized projects with slug/title/description.
 * @param {string} locale
 * @param {string} siteUrl
 * @returns {object}
 */
export function buildProjectItemListStructuredData(projects = [], locale = 'fr', siteUrl) {
  if (!Array.isArray(projects) || projects.length === 0) return {};
  const schemaLocale = mapLocale(locale);

  const itemListElement = projects.map((project, index) =>
    compactObject({
      '@type': 'ListItem',
      position: index + 1,
      url: ensureAbsoluteUrl(project.url || `${siteUrl}/projects/${project.slug || ''}`, siteUrl),
      name: project.title,
      description: toPlainText(project.description || project.summary) || undefined
    })
  );

  return compactObject({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${siteUrl}/#featured-projects`,
    name: 'Featured Projects',
    inLanguage: schemaLocale,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: itemListElement.length,
    itemListElement
  });
}
