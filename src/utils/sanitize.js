/**
 * Content Sanitization Utilities
 * Provides secure HTML sanitization for user-generated content
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content for safe rendering
 * @param {string} html - Raw HTML content to sanitize
 * @param {object} options - Sanitization options
 * @returns {Promise<string>} Sanitized HTML content
 */
export async function sanitizeHtml(html, options = {}) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Default configuration for portfolio content
  const defaultConfig = {
    // Allow basic formatting tags commonly used in markdown
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'del', 'ins',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
      'a', 'img', 'hr'
    ],
    
    // Allow basic attributes
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'id'
    ],
    
    // Security restrictions
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input', 'button'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus'],
    
    // URL restrictions
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    
    // Prevent DOM clobbering
    SANITIZE_DOM: true,
    KEEP_CONTENT: false, // Remove forbidden tags entirely
    
    // Additional security
    USE_PROFILES: { html: true }
  };

  // Merge with user options
  const config = { ...defaultConfig, ...options };

  try {
    // For server-side rendering, we need to use jsdom
    if (typeof window === 'undefined') {
      const { JSDOM } = await import('jsdom');
      const { window } = new JSDOM('');
      const DOMPurifyServer = DOMPurify(window);
      
      return DOMPurifyServer.sanitize(html, config);
    } else {
      // Client-side sanitization
      return DOMPurify.sanitize(html, config);
    }
  } catch (error) {
    console.error('Content sanitization failed:', error);
    // Return empty string if sanitization fails
    return '';
  }
}

/**
 * Sanitize markdown-rendered HTML with portfolio-specific rules
 * @param {string} html - Markdown-rendered HTML
 * @returns {Promise<string>} Sanitized HTML
 */
export async function sanitizeMarkdown(html) {
  return await sanitizeHtml(html, {
    // More restrictive for markdown content
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'b', 'i',
      'h2', 'h3', 'h4', // Allow headings but not h1
      'ul', 'ol', 'li', 'blockquote', 'code',
      'a' // Allow links but will be validated
    ],
    
    // Stricter attributes for markdown
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    
    // Auto-add security attributes to links
    ADD_ATTR: {
      'a': {
        'target': '_blank',
        'rel': 'noopener noreferrer'
      }
    }
  });
}

/**
 * Sanitize plain text input
 * @param {string} text - Plain text to sanitize
 * @returns {string} Sanitized text
 */
export function sanitizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  // Simple text sanitization that works in both server and client environments
  // Remove HTML tags and dangerous characters
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}