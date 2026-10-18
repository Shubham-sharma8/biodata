/**
 * Cloudflare Worker Entrypoint (biodata.cogify.me)
 * ----------------------------------------------------------------------------
 * Handles:
 *  - POST /api/archive-download : Saves generated PDF + Candidate Photo + Full JSON
 *                                 into Cloudflare R2 (`biodata/` folder) and inserts
 *                                 sortable candidate rows into Cloudflare D1 (`biodata`).
 *  - GET  /api/downloads        : Queries and sorts saved candidates from Cloudflare D1.
 *  - GET  /api/r2/*             : Streams stored PDF, photo, or JSON files from R2 (`biodata`).
 *  - GET  /api/health           : Verifies R2 bucket and D1 database bindings.
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

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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

      // 2. Archive Downloaded PDF + Photo + Data into R2 (`biodata/`) and D1 (`biodata`)
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

      // 3. Query & Sort Saved D1 Table Records (`GET /api/downloads?sort=date|name|age&religion=...`)
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

      // 4. Stream Stored PDF / Photo / JSON from R2 Bucket (`GET /api/r2/biodata/...`)
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

    // Serve static assets & pre-rendered SEO landing routes
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
