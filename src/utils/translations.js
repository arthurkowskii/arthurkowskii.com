/**
 * UI Translation Constants
 * Contains all translatable UI text for the bilingual system
 */

export const translations = {
  header: {
    filters: {
      all: {
        fr: 'Tout',
        en: 'All'
      },
      music: {
        fr: 'Musique',
        en: 'Music'
      },
      'game-audio': {
        fr: 'Game Audio',
        en: 'Game Audio'
      },
      tech: {
        fr: 'Tech',
        en: 'Tech'
      }
    }
  },
  domains: {
    music: {
      fr: 'MUSIQUE',
      en: 'MUSIC'
    },
    'game-audio': {
      fr: 'GAME AUDIO',
      en: 'GAME AUDIO'
    },
    tech: {
      fr: 'TECH',
      en: 'TECH'
    }
  },
  aria: {
    viewProject: {
      fr: 'Voir le projet',
      en: 'View project'
    },
    viewBio: {
      fr: 'Voir bio et informations de portfolio',
      en: 'View bio and portfolio information'
    }
  }
};

/**
 * Get translated text for a specific path and locale
 * @param {string} path - Dot notation path to the translation (e.g., 'header.filters.all')
 * @param {string} locale - Target locale ('fr' or 'en')
 * @returns {string} Translated text or fallback
 */
export function getTranslation(path, locale = 'fr') {
  const pathParts = path.split('.');
  let current = translations;
  
  // Navigate through the object path
  for (const part of pathParts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      console.warn(`Translation path not found: ${path}`);
      return path; // Fallback to the path itself
    }
  }
  
  // If we have a translation object with locale properties
  if (current && typeof current === 'object' && (current.fr || current.en)) {
    return current[locale] || current.fr || current.en || path;
  }
  
  // If we got a string directly
  if (typeof current === 'string') {
    return current;
  }
  
  console.warn(`Invalid translation structure at path: ${path}`);
  return path;
}

/**
 * Get all filter translations for a specific locale
 * @param {string} locale - Target locale ('fr' or 'en')
 * @returns {Object} Object with filter keys and translated values
 */
export function getFilterTranslations(locale = 'fr') {
  const filters = translations.header.filters;
  const result = {};
  
  for (const [key, value] of Object.entries(filters)) {
    result[key] = value[locale] || value.fr || value.en || key;
  }
  
  return result;
}

/**
 * Get domain display name for a specific locale
 * @param {string} domainSlug - Domain slug (e.g., 'music', 'game-audio')
 * @param {string} locale - Target locale ('fr' or 'en')
 * @returns {string} Localized domain name
 */
export function getDomainDisplayName(domainSlug, locale = 'fr') {
  return getTranslation(`domains.${domainSlug}`, locale);
}