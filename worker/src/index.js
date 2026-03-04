/**
 * Cloudflare Worker: Tour Dates API
 * Fetches tour data from Google Sheets, validates, caches, and returns formatted JSON
 */

const CACHE_DURATION = 600; // 10 minutes in seconds

/**
 * Validates date format mm/dd/yyyy
 */
function isValidDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if (!regex.test(dateStr)) return false;
  
  const [month, day, year] = dateStr.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
}

/**
 * Validates URL format
 */
function isValidUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return false;
  try {
    new URL(urlStr);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parses mm/dd/yyyy to Date object
 */
function parseDate(dateStr) {
  const [month, day, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Formats Date to dd.mm.yyyy
 */
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Creates CORS headers
 */
function getCorsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

/**
 * Creates JSON response with proper headers
 */
function jsonResponse(data, status = 200, origin = '*') {
  return new Response(JSON.stringify(data), {
    status,
    headers: getCorsHeaders(origin),
  });
}

/**
 * Creates error response
 */
function errorResponse(message, status = 500, origin = '*') {
  return jsonResponse({ error: message }, status, origin);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(origin),
      });
    }

    // Only handle GET requests to /tour
    if (request.method !== 'GET' || url.pathname !== '/tour') {
      return errorResponse('Not Found', 404, origin);
    }

    // Check for SHEET_ID environment variable
    const sheetId = env.SHEET_ID;
    if (!sheetId) {
      return errorResponse('SHEET_ID not configured', 500, origin);
    }

    const cacheKey = new Request(`https://cache.internal/tour-dates-${sheetId}`, request);
    const cache = caches.default;

    // Check for cache bypass via query param
    const bypassCache = url.searchParams.has('nocache');

    // Try to get from cache (unless bypassing)
    if (!bypassCache) {
      let cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        // Clone and add CORS headers for the current origin
        const cachedData = await cachedResponse.json();
        return jsonResponse(cachedData, 200, origin);
      }
    }

    try {
      // Fetch from Google Sheets via opensheet.elk.sh
      const sheetUrl = `https://opensheet.elk.sh/${sheetId}/Sheet1`;
      const response = await fetch(sheetUrl);

      if (!response.ok) {
        return errorResponse(`Failed to fetch sheet data: ${response.status}`, 502, origin);
      }

      const rawData = await response.json();

      if (!Array.isArray(rawData)) {
        return errorResponse('Invalid sheet data format', 502, origin);
      }

      // Extract first non-empty banner
      let banner = null;
      for (const row of rawData) {
        const bannerValue = row['Banner (URL)'];
        if (bannerValue && typeof bannerValue === 'string' && bannerValue.trim()) {
          banner = bannerValue.trim();
          break;
        }
      }

      // Validate and transform tour dates
      const validDates = [];
      for (const row of rawData) {
        const fecha = row['Fecha (mm/dd/yyyy)'];
        const lugar = row.Lugar;
        const ticketLink = row['Link to tickets (URL)'];

        // Validate required fields
        if (!isValidDate(fecha)) continue;
        if (!lugar || typeof lugar !== 'string' || !lugar.trim()) continue;
        if (!isValidUrl(ticketLink)) continue;

        validDates.push({
          fecha,
          lugar: lugar.trim(),
          ticketLink: ticketLink.trim(),
          parsedDate: parseDate(fecha),
        });
      }

      // Sort by date ascending (earliest first)
      validDates.sort((a, b) => a.parsedDate - b.parsedDate);

      // Format dates and remove parsedDate helper
      const tourDates = validDates.map(({ fecha, lugar, ticketLink, parsedDate }) => ({
        fecha: formatDate(parsedDate),
        lugar,
        ticketLink,
      }));

      const responseData = {
        banner,
        tourDates,
      };

      // Create cacheable response
      const responseToCache = new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${CACHE_DURATION}`,
        },
      });

      // Store in cache (fire and forget)
      ctx.waitUntil(cache.put(cacheKey, responseToCache.clone()));

      return jsonResponse(responseData, 200, origin);
    } catch (err) {
      console.error('Worker error:', err);
      return errorResponse('Internal server error', 500, origin);
    }
  },
};
