/**
 * Cloudflare Worker Entrypoint (biodata.cogify.me)
 * Handles `/api/archive-download` to persist generated Marriage Biodata PDFs + sortable
 * candidate records into MongoDB Atlas, while serving static SPA & SEO routes via ASSETS.
 */

import { saveBiodataDownloadToMongo } from './server/mongoArchive.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function resolveMongoUri(env = {}) {
  if (env.MONGODB_URI && String(env.MONGODB_URI).trim()) {
    return String(env.MONGODB_URI).trim();
  }
  if (env.MONGODB_USERNAME && env.MONGODB_PASSWORD) {
    const user = encodeURIComponent(String(env.MONGODB_USERNAME).trim());
    const pass = encodeURIComponent(String(env.MONGODB_PASSWORD).trim());
    const host = env.MONGODB_CLUSTER_HOST || 'cluster0.7snrub8.mongodb.net';
    return `mongodb+srv://${user}:${pass}@${host}`;
  }
  return '';
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
      }

      if (url.pathname === '/api/health' && request.method === 'GET') {
        const mongoUri = resolveMongoUri(env);
        return Response.json(
          {
            ok: true,
            service: 'biodata-cogify-worker',
            mongoConfigured: Boolean(mongoUri),
            database: env.MONGODB_DB_NAME || 'biodata_cogify',
            collections: ['biodata_downloads', 'biodata_candidates']
          },
          { headers: CORS_HEADERS }
        );
      }

      if (url.pathname === '/api/archive-download' && request.method === 'POST') {
        const mongoUri = resolveMongoUri(env);
        if (!mongoUri) {
          return Response.json(
            {
              ok: false,
              error: 'MONGODB_URI is not configured in Cloudflare Worker environment variables.'
            },
            { status: 503, headers: CORS_HEADERS }
          );
        }

        try {
          const payload = await request.json();
          const requestMeta = {
            userAgent: request.headers.get('user-agent') || '',
            country: request.cf?.country || request.headers.get('cf-ipcountry') || '',
            city: request.cf?.city || '',
            ip: request.headers.get('cf-connecting-ip') || '',
            referer: request.headers.get('referer') || ''
          };

          const result = await saveBiodataDownloadToMongo({
            mongoUri,
            dbName: env.MONGODB_DB_NAME || 'biodata_cogify',
            payload,
            requestMeta
          });

          return Response.json(result, { status: 200, headers: CORS_HEADERS });
        } catch (err) {
          return Response.json(
            {
              ok: false,
              error: err?.message || 'Failed to archive biodata PDF to MongoDB.'
            },
            { status: 500, headers: CORS_HEADERS }
          );
        }
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
