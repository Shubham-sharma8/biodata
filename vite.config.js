import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

function loadLocalAtlasCredentials() {
  const candidates = ['atlas-credentials.env', '.dev.vars', '.env'];
  for (const filename of candidates) {
    const fullPath = path.resolve(process.cwd(), filename);
    if (!fs.existsSync(fullPath)) continue;
    const raw = fs.readFileSync(fullPath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

function attachMongoApiMiddleware(middlewares) {
  loadLocalAtlasCredentials();

  middlewares.use(async (req, res, next) => {
    if (!req.url || !req.url.startsWith('/api/')) {
      return next();
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    if (req.url.startsWith('/api/health') && req.method === 'GET') {
      res.statusCode = 200;
      return res.end(
        JSON.stringify({
          ok: true,
          service: 'biodata-cogify-local',
          mongoConfigured: Boolean(process.env.MONGODB_URI),
          database: process.env.MONGODB_DB_NAME || 'biodata_cogify',
          collections: ['biodata_downloads', 'biodata_candidates']
        })
      );
    }

    if (req.url.startsWith('/api/archive-download') && req.method === 'POST') {
      try {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const rawBody = Buffer.concat(chunks).toString('utf8');
        const payload = JSON.parse(rawBody || '{}');

        const { saveBiodataDownloadToMongo } = await import('./src/server/mongoArchive.js');
        const result = await saveBiodataDownloadToMongo({
          mongoUri: process.env.MONGODB_URI,
          dbName: process.env.MONGODB_DB_NAME || 'biodata_cogify',
          payload,
          requestMeta: {
            userAgent: req.headers['user-agent'] || '',
            referer: req.headers['referer'] || '',
            ip: req.socket?.remoteAddress || '127.0.0.1'
          }
        });

        res.statusCode = 200;
        return res.end(JSON.stringify(result));
      } catch (err) {
        res.statusCode = 500;
        return res.end(
          JSON.stringify({
            ok: false,
            error: err?.message || 'Failed to archive biodata PDF to MongoDB'
          })
        );
      }
    }

    return next();
  });
}

export default defineConfig({
  base: '/',
  publicDir: 'public',
  plugins: [
    {
      name: 'mongo-atlas-archive-api',
      configureServer(server) {
        attachMongoApiMiddleware(server.middlewares);
      },
      configurePreviewServer(server) {
        attachMongoApiMiddleware(server.middlewares);
      }
    }
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'es2020',
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('jspdf')) return 'vendor-pdf';
            if (id.includes('docx')) return 'vendor-docx';
            if (id.includes('html2canvas')) return 'vendor-canvas';
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    host: '127.0.0.1',
    port: 4173
  }
});
