/**
 * Performance Monitoring and Error Tracking
 * Lightweight client-side monitoring without external dependencies
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.errors = [];
    this.isEnabled = this.shouldEnable();
    
    if (this.isEnabled) {
      this.init();
    }
  }

  shouldEnable() {
    try {
      // Only enable in production or when explicitly requested
      const isDev = window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');
      const forceEnable = sessionStorage.getItem('monitor') === 'true';
      return !isDev || forceEnable;
    } catch {
      return false;
    }
  }

  init() {
    // Track page load performance
    this.trackPageLoad();
    
    // Track Core Web Vitals
    this.trackWebVitals();
    
    // Track errors
    this.trackErrors();
    
    // Track custom metrics
    this.setupCustomTracking();
    
    // Report periodically
    this.setupReporting();
  }

  trackPageLoad() {
    window.addEventListener('load', () => {
      try {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          this.recordMetric('page_load', {
            dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            load_complete: perfData.loadEventEnd - perfData.loadEventStart,
            dns_lookup: perfData.domainLookupEnd - perfData.domainLookupStart,
            tcp_connect: perfData.connectEnd - perfData.connectStart,
            response_time: perfData.responseEnd - perfData.responseStart,
            dom_processing: perfData.domComplete - perfData.domLoading
          });
        }
      } catch (error) {
        this.recordError('performance_tracking', error);
      }
    });
  }

  trackWebVitals() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric('lcp', { value: lastEntry.startTime, element: lastEntry.element?.tagName });
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // First Input Delay
        new PerformanceObserver((list) => {
          const firstInput = list.getEntries()[0];
          if (firstInput) {
            this.recordMetric('fid', { 
              value: firstInput.processingStart - firstInput.startTime,
              input_type: firstInput.name 
            });
          }
        }).observe({ type: 'first-input', buffered: true });

        // Cumulative Layout Shift
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          this.recordMetric('cls', { value: clsValue });
        }).observe({ type: 'layout-shift', buffered: true });

      } catch (error) {
        this.recordError('web_vitals_tracking', error);
      }
    }
  }

  trackErrors() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.recordError('javascript', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError('promise_rejection', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.recordError('resource', {
          element: event.target.tagName,
          source: event.target.src || event.target.href,
          message: 'Failed to load resource'
        });
      }
    }, true);
  }

  setupCustomTracking() {
    // Track GSAP animation performance
    window.addEventListener('gsap-animation-start', () => {
      this.recordMetric('animation_start', { timestamp: performance.now() });
    });

    window.addEventListener('gsap-animation-complete', () => {
      this.recordMetric('animation_complete', { timestamp: performance.now() });
    });

    // Track theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          this.recordMetric('theme_change', { 
            theme: mutation.target.getAttribute('data-theme'),
            timestamp: performance.now()
          });
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  recordMetric(name, data) {
    if (!this.isEnabled) return;
    
    const timestamp = Date.now();
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name).push({
      timestamp,
      data,
      url: window.location.pathname
    });

    // Limit stored metrics to prevent memory issues
    const metrics = this.metrics.get(name);
    if (metrics.length > 50) {
      metrics.shift();
    }
  }

  recordError(type, error) {
    if (!this.isEnabled) return;

    const errorData = {
      type,
      timestamp: Date.now(),
      url: window.location.pathname,
      userAgent: navigator.userAgent,
      error: typeof error === 'string' ? error : {
        message: error.message || 'Unknown error',
        stack: error.stack,
        ...error
      }
    };

    this.errors.push(errorData);

    // Limit stored errors
    if (this.errors.length > 20) {
      this.errors.shift();
    }

    // Log critical errors immediately
    if (type === 'javascript' || type === 'promise_rejection') {
      console.warn('Performance Monitor detected error:', errorData);
    }
  }

  setupReporting() {
    // Report data every 30 seconds
    setInterval(() => {
      this.reportData();
    }, 30000);

    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.reportData(true);
    });
  }

  reportData(isUnloading = false) {
    if (!this.isEnabled || (this.metrics.size === 0 && this.errors.length === 0)) return;

    const report = {
      timestamp: Date.now(),
      url: window.location.pathname,
      metrics: Object.fromEntries(this.metrics),
      errors: this.errors.slice(),
      session_id: this.getSessionId(),
      build_info: {
        version: document.querySelector('meta[name="build-version"]')?.content || 'unknown',
        commit: document.querySelector('meta[name="build-commit"]')?.content || 'unknown'
      }
    };

    // In production, you might want to send this to an endpoint
    if (window.location.hostname === 'arthurkowskii.com') {
      // For now, just store in localStorage for manual inspection
      try {
        const stored = JSON.parse(localStorage.getItem('perf_reports') || '[]');
        stored.push(report);
        
        // Keep only last 10 reports
        if (stored.length > 10) {
          stored.shift();
        }
        
        localStorage.setItem('perf_reports', JSON.stringify(stored));
      } catch (error) {
        console.warn('Failed to store performance report:', error);
      }
    } else {
      // Development: log to console
      console.log('Performance Report:', report);
    }

    // Clear metrics after reporting
    this.metrics.clear();
    this.errors.length = 0;
  }

  getSessionId() {
    try {
      let sessionId = sessionStorage.getItem('perf_session_id');
      if (!sessionId) {
        sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        sessionStorage.setItem('perf_session_id', sessionId);
      }
      return sessionId;
    } catch {
      return 'unknown';
    }
  }

  // Public API for manual tracking
  track(name, data) {
    this.recordMetric(name, data);
  }

  trackError(type, error) {
    this.recordError(type, error);
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  getErrors() {
    return this.errors.slice();
  }

  enable() {
    sessionStorage.setItem('monitor', 'true');
    this.isEnabled = true;
    this.init();
  }

  disable() {
    sessionStorage.removeItem('monitor');
    this.isEnabled = false;
  }
}

// Initialize monitoring
const monitor = new PerformanceMonitor();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.performanceMonitor = monitor;
}

export default monitor;