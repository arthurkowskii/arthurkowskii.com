/**
 * Image Optimization Utilities for Gallery Performance
 * Provides thumbnail generation and progressive loading support
 */

/**
 * Generate optimized image URLs with different sizes and quality settings
 * @param {string} originalSrc - Original image URL
 * @param {Object} options - Optimization options
 * @returns {Object} Optimized image URLs and metadata
 */
export function generateOptimizedImageUrls(originalSrc, options = {}) {
  const {
    thumbnailWidth = 300,
    heroWidth = 800,
    quality = 80,
    format = 'webp'
  } = options;

  // For immediate implementation without CDN, we use CSS-based optimization
  // The browser will still download the full image but display it optimized
  // Future enhancement: Replace with actual CDN or build-time resizing
  return {
    thumbnail: originalSrc, // Will be displayed at 300px via CSS
    hero: originalSrc, // Will be displayed at 800px via CSS  
    full: originalSrc,
    placeholder: generatePlaceholderDataUrl(originalSrc),
    sizes: {
      thumbnail: { width: thumbnailWidth, height: Math.round(thumbnailWidth * 0.67) },
      hero: { width: heroWidth, height: Math.round(heroWidth * 0.67) }
    },
    // CSS-based optimization hints
    cssHints: {
      thumbnail: `max-width: ${thumbnailWidth}px; height: auto;`,
      hero: `max-width: ${heroWidth}px; height: auto;`
    }
  };
}

/**
 * Generate a low-quality placeholder data URL for blur-up effect
 * @param {string} imageSrc - Source image URL
 * @returns {string} Base64 placeholder data URL
 */
export function generatePlaceholderDataUrl(imageSrc) {
  // Generate a minimal SVG placeholder with proper aspect ratio
  const svg = `
    <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f0f0f0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e0e0e0;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
      <rect x="50%" y="50%" width="20" height="20" rx="10" fill="#d0d0d0" transform="translate(-10,-10)" opacity="0.5"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Create intersection observer for advanced lazy loading
 * @param {Function} callback - Callback when element enters viewport
 * @param {Object} options - Intersection observer options
 * @returns {IntersectionObserver} Configured observer
 */
export function createImageLazyLoader(callback, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  const config = { ...defaultOptions, ...options };

  if (typeof IntersectionObserver === 'undefined') {
    // Fallback for older browsers - load immediately
    return {
      observe: (element) => callback([{ target: element, isIntersecting: true }]),
      unobserve: () => {},
      disconnect: () => {}
    };
  }

  return new IntersectionObserver(callback, config);
}

/**
 * Progressive image loading strategy
 * @param {HTMLImageElement} img - Image element
 * @param {Object} urls - Optimized image URLs
 */
export function loadImageProgressively(img, urls) {
  return new Promise((resolve, reject) => {
    const container = img.closest('.image-container');
    
    // Step 1: Set placeholder
    if (urls.placeholder) {
      img.src = urls.placeholder;
      img.style.filter = 'blur(5px)';
      img.style.opacity = '0.7';
    }
    
    // Step 2: Load thumbnail first for quick display
    const thumbnailImg = new Image();
    thumbnailImg.onload = () => {
      img.src = urls.thumbnail;
      img.style.filter = 'blur(2px)';
      img.style.opacity = '1';
      
      // Step 3: Load full quality image
      const fullImg = new Image();
      fullImg.onload = () => {
        img.src = urls.hero || urls.full;
        img.style.filter = 'none';
        
        if (container) {
          container.classList.add('loaded');
        }
        
        resolve(fullImg);
      };
      
      fullImg.onerror = () => {
        // Fall back to thumbnail if full image fails
        if (container) {
          container.classList.add('loaded');
        }
        resolve(thumbnailImg);
      };
      
      fullImg.src = urls.hero || urls.full;
    };
    
    thumbnailImg.onerror = () => {
      // Fall back to original if thumbnail fails
      img.src = urls.full;
      img.style.filter = 'none';
      
      if (container) {
        container.classList.add('error');
      }
      
      reject(new Error('Failed to load image'));
    };
    
    thumbnailImg.src = urls.thumbnail;
  });
}

/**
 * Batch process gallery images for optimal loading
 * @param {Array} images - Array of image objects with src and metadata
 * @param {Object} options - Processing options
 * @returns {Array} Processed images with optimization metadata
 */
export function optimizeGalleryImages(images, options = {}) {
  const {
    maxThumbnailSize = 300,
    maxHeroSize = 800,
    quality = 80
  } = options;

  return images.map((image, index) => {
    if (image.isVideo) {
      return image; // Videos handled separately
    }

    const optimizedUrls = generateOptimizedImageUrls(image.src, {
      thumbnailWidth: maxThumbnailSize,
      heroWidth: maxHeroSize,
      quality
    });

    return {
      ...image,
      optimized: optimizedUrls,
      loadPriority: index === 0 ? 'high' : 'low', // Hero image gets priority
      placeholder: optimizedUrls.placeholder
    };
  });
}

/**
 * Preload critical gallery images
 * @param {Array} images - Gallery images
 * @param {number} preloadCount - Number of images to preload
 */
export function preloadCriticalImages(images, preloadCount = 1) {
  const criticalImages = images.slice(0, preloadCount);
  
  criticalImages.forEach(image => {
    if (image.optimized && !image.isVideo) {
      // Preload both thumbnail and hero versions
      const thumbnailLink = document.createElement('link');
      thumbnailLink.rel = 'preload';
      thumbnailLink.as = 'image';
      thumbnailLink.href = image.optimized.thumbnail;
      document.head.appendChild(thumbnailLink);
      
      // Preload hero version with lower priority
      setTimeout(() => {
        const heroLink = document.createElement('link');
        heroLink.rel = 'preload';
        heroLink.as = 'image';
        heroLink.href = image.optimized.hero;
        document.head.appendChild(heroLink);
      }, 100);
    }
  });
}

/**
 * Monitor image loading performance
 * @param {string} imageUrl - Image URL
 * @param {number} startTime - Load start time
 */
export function trackImagePerformance(imageUrl, startTime) {
  const loadTime = performance.now() - startTime;
  
  if (typeof performance.mark !== 'undefined') {
    performance.mark(`image-loaded-${Date.now()}`);
  }
  
  
  // Track to analytics if available
  if (typeof gtag !== 'undefined') {
    gtag('event', 'image_load_time', {
      'event_category': 'performance',
      'event_label': 'gallery_image',
      'value': Math.round(loadTime)
    });
  }
}