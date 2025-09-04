/**
 * Internationalization utilities for Atom Portfolio
 * Provides translation functions and locale management
 */

import { userTweaks } from '../user-tweaks.js';

// Get i18n configuration from user tweaks
const i18nConfig = userTweaks.i18n || {
  defaultLocale: 'fr',
  locales: ['fr', 'en'],
  strings: { fr: {}, en: {} },
  meta: { fr: {}, en: {} }
};

/**
 * Get current locale from URL or localStorage
 * Falls back to default locale if not found
 */
export function getCurrentLocale() {
  // Check URL parameter first (?lang=en)
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && i18nConfig.locales.includes(urlLang)) {
      localStorage.setItem('portfolio-locale', urlLang);
      return urlLang;
    }
    
    // Check localStorage
    const savedLang = localStorage.getItem('portfolio-locale');
    if (savedLang && i18nConfig.locales.includes(savedLang)) {
      return savedLang;
    }
  }
  
  return i18nConfig.defaultLocale;
}

/**
 * Set current locale and persist to localStorage
 */
export function setLocale(locale) {
  if (!i18nConfig.locales.includes(locale)) {
    console.warn(`Locale "${locale}" not supported. Available locales:`, i18nConfig.locales);
    return;
  }
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('portfolio-locale', locale);
    
    // Update URL parameter without page reload
    const url = new URL(window.location);
    url.searchParams.set('lang', locale);
    window.history.replaceState({}, '', url);
    
    // Trigger locale change event
    window.dispatchEvent(new CustomEvent('locale-changed', { detail: { locale } }));
  }
}

/**
 * Get translated string for current locale
 * @param {string} key - Translation key (e.g., 'home', 'bio', 'projects')
 * @param {string} locale - Optional locale override
 * @returns {string} Translated string or key if not found
 */
export function t(key, locale) {
  const currentLocale = locale || getCurrentLocale();
  const strings = i18nConfig.strings[currentLocale] || i18nConfig.strings[i18nConfig.defaultLocale];
  
  return strings[key] || key;
}

/**
 * Get meta data for current locale
 * @param {string} key - Meta key (e.g., 'siteName', 'home.title')
 * @param {string} locale - Optional locale override
 * @returns {string|object} Meta data or empty string if not found
 */
export function getMeta(key, locale) {
  const currentLocale = locale || getCurrentLocale();
  const meta = i18nConfig.meta[currentLocale] || i18nConfig.meta[i18nConfig.defaultLocale];
  
  // Handle nested keys like 'home.title'
  if (key.includes('.')) {
    const [parent, child] = key.split('.');
    return meta[parent]?.[child] || '';
  }
  
  return meta[key] || '';
}

/**
 * Get all available locales
 */
export function getLocales() {
  return i18nConfig.locales;
}

/**
 * Check if a locale is supported
 */
export function isLocaleSupported(locale) {
  return i18nConfig.locales.includes(locale);
}

/**
 * Get locale direction (for future RTL support)
 */
export function getLocaleDirection(locale) {
  const currentLocale = locale || getCurrentLocale();
  // For now, all supported locales are LTR
  // Can be extended for RTL languages like Arabic, Hebrew
  return 'ltr';
}

/**
 * Format date according to locale
 */
export function formatDate(date, locale) {
  const currentLocale = locale || getCurrentLocale();
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  
  const formatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  try {
    return dateObject.toLocaleDateString(currentLocale === 'fr' ? 'fr-FR' : 'en-US', formatOptions);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return date.toString();
  }
}

/**
 * Get page title with site name
 */
export function getPageTitle(pageTitle, locale) {
  const currentLocale = locale || getCurrentLocale();
  const siteName = getMeta('siteName', currentLocale);
  
  if (!pageTitle) return siteName;
  return `${pageTitle} — ${siteName}`;
}

/**
 * Get preferred locale from browser language
 */
export function getBrowserLocale() {
  if (typeof window === 'undefined') return i18nConfig.defaultLocale;
  
  const browserLang = navigator.language || navigator.languages?.[0];
  if (!browserLang) return i18nConfig.defaultLocale;
  
  // Extract language code (e.g., 'fr-FR' -> 'fr')
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Return if supported, otherwise default
  return i18nConfig.locales.includes(langCode) ? langCode : i18nConfig.defaultLocale;
}

/**
 * Get welcome content for a specific locale
 * Used by the welcome overlay
 */
export function getWelcomeContent(locale) {
  const currentLocale = locale || getCurrentLocale();
  const userTweaks = typeof window !== 'undefined' ? window.userTweaks : null;
  
  if (userTweaks?.prePage?.content?.[currentLocale]) {
    return userTweaks.prePage.content[currentLocale];
  }
  
  // Fallback to default content
  const fallbackLocale = i18nConfig.defaultLocale;
  return userTweaks?.prePage?.content?.[fallbackLocale] || {
    title: 'Welcome',
    description: 'Welcome to the portfolio',
    buttonLabel: 'Enter',
    languageLabel: 'Choose Language'
  };
}

/**
 * Set locale without URL parameter (for welcome screen)
 * Used before the user enters the main portfolio
 */
export function setWelcomeLocale(locale) {
  if (!i18nConfig.locales.includes(locale)) {
    console.warn(`Locale "${locale}" not supported. Available locales:`, i18nConfig.locales);
    return;
  }
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('portfolio-locale', locale);
    
    // Update document language immediately
    document.documentElement.lang = locale;
    document.documentElement.dir = getLocaleDirection(locale);
    
    // Trigger locale change event for other components
    window.dispatchEvent(new CustomEvent('welcome-locale-changed', { detail: { locale } }));
  }
}

/**
 * Initialize i18n system
 * Should be called on page load
 */
export function initI18n() {
  if (typeof window === 'undefined') return;
  
  // Set initial locale
  const locale = getCurrentLocale();
  
  // Update document language
  document.documentElement.lang = locale;
  
  // Update document direction
  document.documentElement.dir = getLocaleDirection(locale);
  
  console.log(`🌐 i18n initialized with locale: ${locale}`);
}