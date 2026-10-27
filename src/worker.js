/**
 * Cloudflare Worker Entrypoint (biodata.cogify.me)
 * ----------------------------------------------------------------------------
 * Handles:
 *  - POST /api/archive-download : Saves generated PDF + Candidate Photo + Full JSON
 *                                 into Cloudflare R2 (`biodata/` folder) and inserts
 *                                 sortable candidate rows into Cloudflare D1 (`biodata`).
 *  - GET  /api/downloads        : Queries and sorts saved candidates from Cloudflare D1.
 *  - GET  /api/r2/*             : Streams stored PDF, photo, or JSON files from R2 (`biodata`).
 *  - GET  /api/seo/status       : Exposes canonical sitemap URLs, IndexNow key, and SSR route inventory.
 *  - GET  /api/health           : Verifies R2 bucket and D1 database bindings.
 *  - Static / SSR Routing       : Enforces single-hop trailing-slash canonicalization,
 *                                 serves pre-rendered SSR HTML with `X-Robots-Tag: index, follow`,
 *                                 and returns true HTTP 404 (`noindex, nofollow`) for unknown routes.
 */

import {
  R2_BUCKET_NAME,
  D1_DATABASE_NAME,
  D1_DATABASE_ID,
  DOWNLOADS_TABLE,
  CANDIDATES_TABLE,
  ensureD1Tables,
  saveBiodataToR2AndD1
} from './server/cloudflareArchive.js';
import { SEO_LANDING_ROUTES, SITE_ORIGIN } from './seo/seoRouter.js';

const INDEXNOW_KEY = 'c0g1fyb10d4t4m4k3r20261nd3xn0wk3y';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'X-Robots-Tag': 'noindex, nofollow'
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const forwardedProto = request.headers.get('x-forwarded-proto');
    const isLocalHost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

    // -------------------------------------------------------------------------
    // Enforce HTTP-to-HTTPS & Canonical Host (`www` -> apex) Redirects
    // -------------------------------------------------------------------------
    if (
      !isLocalHost &&
      (url.protocol === 'http:' || forwardedProto === 'http' || url.hostname === 'www.biodata.cogify.me')
    ) {
      return new Response(null, {
        status: 301,
        headers: {
          Location: `https://biodata.cogify.me${url.pathname}${url.search}`,
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
      });
    }

    // -------------------------------------------------------------------------
    // API Endpoints (`/api/*`) — Tagged `noindex, nofollow`
    // -------------------------------------------------------------------------
    if (url.pathname.startsWith('/api/')) {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
      }

      // 1. Health & Binding Check
      if (url.pathname === '/api/health' && request.method === 'GET') {
        return Response.json(
          {
            ok: true,
            service: 'biodata-cogify-worker',
            r2Bucket: {
              bound: Boolean(env.BIODATA_BUCKET),
              bucketName: env.R2_BUCKET_NAME || R2_BUCKET_NAME,
              folderPrefix: 'biodata/'
            },
            d1Database: {
              bound: Boolean(env.DB),
              databaseName: env.DATABASE || D1_DATABASE_NAME,
              databaseId: env.DATABASE_ID || D1_DATABASE_ID,
              tables: [DOWNLOADS_TABLE, CANDIDATES_TABLE]
            }
          },
          { headers: CORS_HEADERS }
        );
      }

      // 2. SEO Indexing & Search Console / IndexNow Readiness Endpoint
      if (url.pathname === '/api/seo/status' && request.method === 'GET') {
        const canonicalUrls = [
          `${SITE_ORIGIN}/`,
          ...SEO_LANDING_ROUTES.map((r) => `${SITE_ORIGIN}${r.path}`)
        ];
        return Response.json(
          {
            ok: true,
            siteOrigin: SITE_ORIGIN,
            sitemapUrl: `${SITE_ORIGIN}/sitemap.xml`,
            robotsUrl: `${SITE_ORIGIN}/robots.txt`,
            indexNowKey: INDEXNOW_KEY,
            indexNowKeyLocation: `${SITE_ORIGIN}/cogify-indexnow-key.txt`,
            totalCanonicalPages: canonicalUrls.length,
            canonicalUrls
          },
          { headers: CORS_HEADERS }
        );
      }

      // 3. Archive Downloaded PDF + Photo + Data into R2 (`biodata/`) and D1 (`biodata`)
      if (url.pathname === '/api/archive-download' && request.method === 'POST') {
        try {
          const payload = await request.json();
          const requestMeta = {
            userAgent: request.headers.get('user-agent') || '',
            country: request.cf?.country || request.headers.get('cf-ipcountry') || '',
            city: request.cf?.city || '',
            ip: request.headers.get('cf-connecting-ip') || '',
            referer: request.headers.get('referer') || ''
          };

          const result = await saveBiodataToR2AndD1({
            r2Bucket: env.BIODATA_BUCKET,
            d1Database: env.DB,
            payload,
            requestMeta
          });

          return Response.json(result, { status: 200, headers: CORS_HEADERS });
        } catch (err) {
          return Response.json(
            {
              ok: false,
              error: err?.message || 'Failed to archive biodata to Cloudflare R2 and D1.'
            },
            { status: 500, headers: CORS_HEADERS }
          );
        }
      }

      // 4. Query & Sort Saved D1 Table Records (`GET /api/downloads?sort=date|name|age&religion=...`)
      if (url.pathname === '/api/downloads' && request.method === 'GET') {
        if (!env.DB) {
          return Response.json(
            { ok: false, error: 'Cloudflare D1 binding (DB) is not available.' },
            { status: 503, headers: CORS_HEADERS }
          );
        }

        try {
          await ensureD1Tables(env.DB);
          const sortParam = (url.searchParams.get('sort') || 'date').toLowerCase();
          const religionFilter = (url.searchParams.get('religion') || '').trim();
          const tableType = (url.searchParams.get('table') || 'downloads').toLowerCase();
          const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 50, 1), 200);

          const tableName = tableType === 'candidates' ? CANDIDATES_TABLE : DOWNLOADS_TABLE;
          const timeCol = tableType === 'candidates' ? 'updated_at' : 'created_at';

          let orderBy = `${timeCol} DESC`;
          if (sortParam === 'name') orderBy = `candidate_name_lower ASC, ${timeCol} DESC`;
          else if (sortParam === 'age') orderBy = `age_years ASC, ${timeCol} DESC`;

          let query = `SELECT * FROM ${tableName}`;
          const params = [];
          if (religionFilter) {
            query += ` WHERE LOWER(religion) LIKE ?`;
            params.push(`%${religionFilter.toLowerCase()}%`);
          }
          query += ` ORDER BY ${orderBy} LIMIT ?`;
          params.push(limit);

          const { results } = await env.DB.prepare(query).bind(...params).all();
          return Response.json(
            {
              ok: true,
              database: D1_DATABASE_NAME,
              databaseId: D1_DATABASE_ID,
              table: tableName,
              count: results?.length || 0,
              rows: results || []
            },
            { headers: CORS_HEADERS }
          );
        } catch (err) {
          return Response.json(
            { ok: false, error: err?.message || 'Failed to query D1 table.' },
            { status: 500, headers: CORS_HEADERS }
          );
        }
      }

      // 5. Stream Stored PDF / Photo / JSON from R2 Bucket (`GET /api/r2/biodata/...`)
      if (url.pathname.startsWith('/api/r2/') && request.method === 'GET') {
        if (!env.BIODATA_BUCKET) {
          return Response.json(
            { ok: false, error: 'Cloudflare R2 binding (BIODATA_BUCKET) is not available.' },
            { status: 503, headers: CORS_HEADERS }
          );
        }

        const r2Key = decodeURIComponent(url.pathname.slice('/api/r2/'.length));
        if (!r2Key.startsWith('biodata/')) {
          return Response.json(
            { ok: false, error: 'Invalid R2 object path.' },
            { status: 400, headers: CORS_HEADERS }
          );
        }

        const obj = await env.BIODATA_BUCKET.get(r2Key);
        if (!obj) {
          return Response.json(
            { ok: false, error: `R2 object not found: ${r2Key}` },
            { status: 404, headers: CORS_HEADERS }
          );
        }

        const headers = new Headers(CORS_HEADERS);
        obj.writeHttpMetadata(headers);
        headers.set('etag', obj.httpEtag);
        return new Response(obj.body, { status: 200, headers });
      }

      return Response.json({ ok: false, error: 'API route not found' }, { status: 404, headers: CORS_HEADERS });
    }

    // -------------------------------------------------------------------------
    // Single-Hop Canonical Normalization (Eliminate Trailing-Slash Redirect Chains)
    // -------------------------------------------------------------------------
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      const cleanPath = url.pathname.replace(/\/+$/, '');
      return Response.redirect(`${url.origin}${cleanPath}${url.search}`, 301);
    }

    // -------------------------------------------------------------------------
    // Serve Pre-Rendered SSR Pages & Static Assets with Explicit Bot Headers
    // -------------------------------------------------------------------------
    if (env.ASSETS) {
      const assetRes = await env.ASSETS.fetch(request);
      const headers = new Headers(assetRes.headers);
      if (assetRes.status === 404) {
        headers.set('X-Robots-Tag', 'noindex, nofollow');
      } else {
        const contentType = headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
          headers.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
          const canonicalHref = url.pathname === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${url.pathname}`;
          headers.set('Link', `<${canonicalHref}>; rel="canonical"`);
        } else if (/\.(webp|png|svg|jpg|jpeg|gif|ico|woff2?|ttf|css|js)$/i.test(url.pathname)) {
          headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
      return new Response(assetRes.body, {
        status: assetRes.status,
        statusText: assetRes.statusText,
        headers
      });
    }

    return new Response('Not Found', {
      status: 404,
      headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
};
