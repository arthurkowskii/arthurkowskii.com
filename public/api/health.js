/**
 * Edge function for health checks and basic diagnostics
 * Provides endpoint for monitoring and uptime services
 */

export default async function handler(request) {
  const url = new URL(request.url);
  
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Date.now(),
      version: '1.0.0',
      environment: 'production',
      checks: {
        memory: process.memoryUsage ? 'available' : 'unavailable',
        platform: typeof navigator !== 'undefined' ? 'browser' : 'server'
      }
    };

    // Add performance timing if available
    if (typeof performance !== 'undefined') {
      health.performance = {
        memory: performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        } : null,
        timing: performance.now()
      };
    }

    // Simple diagnostics based on query params
    if (url.searchParams.get('detailed') === 'true') {
      health.detailed = {
        userAgent: request.headers.get('user-agent'),
        acceptLanguage: request.headers.get('accept-language'),
        referer: request.headers.get('referer'),
        country: request.headers.get('cf-ipcountry') || 'unknown'
      };
    }

    return new Response(JSON.stringify(health, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    }, null, 2), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}