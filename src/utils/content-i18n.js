/**
 * Content Internationalization Utilities
 * Handles extraction of localized content from bilingual frontmatter
 */

/**
 * Get localized content for a specific locale with fallback chain
 * @param {string|Object} content - Content that can be either string or localized object
 * @param {string} locale - Target locale ('fr' or 'en')
 * @returns {string} Localized content or fallback
 */
export function getLocalizedContent(content, locale = 'fr') {
  // Handle null/undefined content
  if (!content) return '';
  
  // If it's already a string, return as-is (backward compatibility)
  if (typeof content === 'string') {
    return content;
  }
  
  // If it's an object with locale properties
  if (typeof content === 'object' && content !== null) {
    // Try requested locale first
    if (content[locale]) {
      return content[locale];
    }
    
    // Fallback to French (default language)
    if (content.fr) {
      return content.fr;
    }
    
    // Fallback to English if French not available
    if (content.en) {
      return content.en;
    }
    
    // If object has no recognized language properties, try to extract a reasonable string
    // This handles edge cases where objects might have been passed incorrectly
    if (typeof content.toString === 'function' && content.toString() !== '[object Object]') {
      return content.toString();
    }
    
    // As a last resort, try to find any string value in the object
    const values = Object.values(content);
    const firstStringValue = values.find(v => typeof v === 'string');
    if (firstStringValue) {
      return firstStringValue;
    }
    
    // Final fallback - return empty string instead of [object Object]
    return '';
  }
  
  // Final fallback - convert to string
  return String(content);
}

/**
 * Process an entire project object to localize all bilingual content
 * @param {Object} project - Project data from content collection
 * @param {string} locale - Target locale ('fr' or 'en')
 * @returns {Object} Project with all content localized to target language
 */
export function localizeProject(project, locale = 'fr') {
  if (!project) return project;
  
  const localized = { ...project };
  
  // Localize main project fields
  localized.title = getLocalizedContent(project.title, locale);
  localized.altTitle = getLocalizedContent(project.altTitle, locale);
  localized.description = getLocalizedContent(project.description, locale);
  
  // Localize bento layout configuration if present
  if (project.bento) {
    localized.bento = { ...project.bento };
    
    // Hero section
    if (project.bento.hero) {
      localized.bento.hero = {
        ...project.bento.hero,
        subtitle: getLocalizedContent(project.bento.hero.subtitle, locale)
      };
    }
    
    // Stats section
    if (project.bento.stats && Array.isArray(project.bento.stats)) {
      localized.bento.stats = project.bento.stats.map(stat => ({
        ...stat,
        label: getLocalizedContent(stat.label, locale)
      }));
    }
    
    // Music links section
    if (project.bento.musicLinks) {
      localized.bento.musicLinks = {
        ...project.bento.musicLinks,
        title: getLocalizedContent(project.bento.musicLinks.title, locale)
      };
    }
    
    // Video section
    if (project.bento.video) {
      localized.bento.video = {
        ...project.bento.video,
        title: getLocalizedContent(project.bento.video.title, locale),
        description: getLocalizedContent(project.bento.video.description, locale)
      };
    }
    
    // Spotify section
    if (project.bento.spotify) {
      localized.bento.spotify = {
        ...project.bento.spotify,
        title: getLocalizedContent(project.bento.spotify.title, locale),
        description: getLocalizedContent(project.bento.spotify.description, locale)
      };
    }
    
    // SoundCloud section
    if (project.bento.soundcloud) {
      localized.bento.soundcloud = {
        ...project.bento.soundcloud,
        title: getLocalizedContent(project.bento.soundcloud.title, locale),
        description: getLocalizedContent(project.bento.soundcloud.description, locale)
      };
    }
    
    // Actions section
    if (project.bento.actions) {
      localized.bento.actions = {
        ...project.bento.actions,
        title: getLocalizedContent(project.bento.actions.title, locale)
      };
      
      if (project.bento.actions.primary) {
        localized.bento.actions.primary = {
          ...project.bento.actions.primary,
          text: getLocalizedContent(project.bento.actions.primary.text, locale)
        };
      }
      
      if (project.bento.actions.secondary) {
        localized.bento.actions.secondary = {
          ...project.bento.actions.secondary,
          text: getLocalizedContent(project.bento.actions.secondary.text, locale)
        };
      }
    }
    
    // Process section
    if (project.bento.process) {
      localized.bento.process = {
        ...project.bento.process,
        title: getLocalizedContent(project.bento.process.title, locale),
        subtitle: getLocalizedContent(project.bento.process.subtitle, locale)
      };
      
      if (project.bento.process.steps && Array.isArray(project.bento.process.steps)) {
        localized.bento.process.steps = project.bento.process.steps.map(step =>
          getLocalizedContent(step, locale)
        );
      }
    }
    
    // Gallery section
    if (project.bento.gallery) {
      localized.bento.gallery = {
        ...project.bento.gallery,
        title: getLocalizedContent(project.bento.gallery.title, locale)
      };
    }
    
    // Challenges section
    if (project.bento.challenges) {
      localized.bento.challenges = {
        ...project.bento.challenges,
        title: getLocalizedContent(project.bento.challenges.title, locale),
        subtitle: getLocalizedContent(project.bento.challenges.subtitle, locale)
      };
      
      if (project.bento.challenges.items && Array.isArray(project.bento.challenges.items)) {
        localized.bento.challenges.items = project.bento.challenges.items.map(item => ({
          ...item,
          title: getLocalizedContent(item.title, locale),
          description: getLocalizedContent(item.description, locale)
        }));
      }
    }
    
    // Results section
    if (project.bento.results) {
      localized.bento.results = {
        ...project.bento.results,
        title: getLocalizedContent(project.bento.results.title, locale),
        subtitle: getLocalizedContent(project.bento.results.subtitle, locale)
      };
      
      if (project.bento.results.items && Array.isArray(project.bento.results.items)) {
        localized.bento.results.items = project.bento.results.items.map(item => ({
          ...item,
          text: getLocalizedContent(item.text, locale)
        }));
      }
    }
  }
  
  return localized;
}

/**
 * Process a bio object to localize all bilingual content
 * @param {Object} bio - Bio data from content collection
 * @param {string} locale - Target locale ('fr' or 'en')
 * @returns {Object} Bio with all content localized to target language
 */
export function localizeBio(bio, locale = 'fr') {
  if (!bio) return bio;
  
  const localized = { ...bio };
  
  // Localize main bio fields
  localized.title = getLocalizedContent(bio.title, locale);
  localized.subtitle = getLocalizedContent(bio.subtitle, locale);
  localized.bio = getLocalizedContent(bio.bio, locale);
  
  // Localize press articles if present
  if (bio.press && Array.isArray(bio.press)) {
    localized.press = bio.press.map(article => ({
      ...article,
      title: getLocalizedContent(article.title, locale),
      description: getLocalizedContent(article.description, locale)
    }));
  }
  
  return localized;
}

/**
 * Get all projects and localize them for a specific locale
 * @param {Array} projects - Array of project data
 * @param {string} locale - Target locale ('fr' or 'en')
 * @returns {Array} Array of localized projects
 */
export function localizeProjects(projects, locale = 'fr') {
  if (!Array.isArray(projects)) return [];
  
  return projects.map(project => localizeProject(project, locale));
}

/**
 * Validate that bilingual content has all required translations
 * @param {Object} content - Content object to validate
 * @param {Array<string>} requiredLocales - Array of required locales (e.g., ['fr', 'en'])
 * @returns {Object} Validation result with missing translations
 */
export function validateBilingualContent(content, requiredLocales = ['fr', 'en']) {
  const missing = [];
  
  function checkField(fieldPath, value) {
    if (typeof value === 'object' && value !== null) {
      for (const locale of requiredLocales) {
        if (!value[locale]) {
          missing.push(`${fieldPath}.${locale}`);
        }
      }
    }
  }
  
  function walkObject(obj, path = '') {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            walkObject(item, `${currentPath}[${index}]`);
          } else {
            checkField(`${currentPath}[${index}]`, item);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        // Check if this looks like a bilingual object
        if (value.fr !== undefined || value.en !== undefined) {
          checkField(currentPath, value);
        } else {
          walkObject(value, currentPath);
        }
      }
    }
  }
  
  if (content) {
    walkObject(content);
  }
  
  return {
    isValid: missing.length === 0,
    missing: missing
  };
}

/**
 * Helper to determine if content is bilingual (has locale properties)
 * @param {any} content - Content to check
 * @returns {boolean} True if content has bilingual structure
 */
export function isBilingualContent(content) {
  return typeof content === 'object' && 
         content !== null && 
         (content.fr !== undefined || content.en !== undefined);
}

/**
 * Get available locales for a piece of content
 * @param {any} content - Content to analyze
 * @returns {Array<string>} Array of available locale codes
 */
export function getAvailableLocales(content) {
  if (!isBilingualContent(content)) {
    return []; // Not bilingual content
  }
  
  const locales = [];
  if (content.fr) locales.push('fr');
  if (content.en) locales.push('en');
  
  return locales;
}