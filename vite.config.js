import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

function loadLocalEnv() {
  const candidates = ['.env', '.dev.vars'];
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

/**
 * Local R2 Bucket adapter for `vite dev` / `vite preview` that mirrors the Cloudflare R2 API
 * and writes files directly into `.wrangler/local-r2/biodata/...`.
 */
function createLocalR2BucketAdapter(rootDir) {
  return {
    async put(key, data, options = {}) {
      const targetPath = path.join(rootDir, key);
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, Buffer.from(data));
      const metaPath = `${targetPath}.meta.json`;
      fs.writeFileSync(
        metaPath,
        JSON.stringify(
          {
            key,
            sizeBytes: Buffer.from(data).byteLength,
            httpMetadata: options.httpMetadata || {},
            customMetadata: options.customMetadata || {},
            savedAt: new Date().toISOString()
          },
          null,
          2
        )
      );
      return { key };
    },
    async get(key) {
      const targetPath = path.join(rootDir, key);
      if (!fs.existsSync(targetPath)) return null;
      const body = fs.readFileSync(targetPath);
      const metaPath = `${targetPath}.meta.json`;
      const meta = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8')) : {};
      return {
        body,
        httpEtag: `"local-${body.byteLength}"`,
        writeHttpMetadata(headers) {
          if (meta.httpMetadata?.contentType) {
            headers.set('content-type', meta.httpMetadata.contentType);
          }
          if (meta.httpMetadata?.contentDisposition) {
            headers.set('content-disposition', meta.httpMetadata.contentDisposition);
          }
        }
      };
    }
  };
}

/**
 * Local D1 SQLite adapter for `vite dev` / `vite preview` using Node's built-in `node:sqlite`
 * that implements Cloudflare D1's `.prepare(sql).bind(...).run()` and `.all()` interface.
 */
async function createLocalD1Adapter(sqlitePath) {
  fs.mkdirSync(path.dirname(sqlitePath), { recursive: true });
  const { DatabaseSync } = await import('node:sqlite');
  const db = new DatabaseSync(sqlitePath);

  return {
    prepare(sql) {
      const stmt = db.prepare(sql);
      let boundArgs = [];
      const chain = {
        bind(...args) {
          boundArgs = args.map((v) => (v === undefined ? null : v));
          return chain;
        },
        async run() {
          const info = stmt.run(...boundArgs);
          return { success: true, meta: info };
        },
        async all() {
          const rows = stmt.all(...boundArgs);
          return { success: true, results: rows };
        }
      };
      return chain;
    }
  };
}

function attachCloudflareR2D1Middleware(middlewares) {
  loadLocalEnv();
  const localR2Dir = path.resolve(process.cwd(), '.wrangler/local-r2');
  const localD1Path = path.resolve(process.cwd(), '.wrangler/local-d1/biodata.sqlite');
  const r2Bucket = createLocalR2BucketAdapter(localR2Dir);
  let d1Promise = null;

  const getD1 = () => {
    if (!d1Promise) {
      d1Promise = createLocalD1Adapter(localD1Path);
    }
    return d1Promise;
  };

  middlewares.use(async (req, res, next) => {
    if (!req.url || !req.url.startsWith('/api/')) {
      return next();
    }

    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    if (req.url.startsWith('/api/health') && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      return res.end(
        JSON.stringify({
          ok: true,
          service: 'biodata-cogify-local',
          r2Bucket: {
            bound: true,
            bucketName: process.env.DATABASE || 'biodata',
            endpoint: process.env.R2_SECRET_ACCESS_KEY || 'https://34f55fffa618d8ec831f8926c79a3575.r2.cloudflarestorage.com/biodata',
            folderPrefix: 'biodata/'
          },
          d1Database: {
            bound: true,
            databaseName: process.env.DATABASE || 'biodata',
            databaseId: process.env.DATABASE_ID || 'bb855f1e-d450-464d-b4da-f273c821288e',
            tables: ['biodata_downloads', 'biodata_candidates']
          }
        })
      );
    }

    if (req.url.startsWith('/api/archive-download') && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      try {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const rawBody = Buffer.concat(chunks).toString('utf8');
        const payload = JSON.parse(rawBody || '{}');

        const d1Database = await getD1();
        const { saveBiodataToR2AndD1 } = await import('./src/server/cloudflareArchive.js');
        const result = await saveBiodataToR2AndD1({
          r2Bucket,
          d1Database,
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
            error: err?.message || 'Failed to archive biodata to R2 and D1'
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
      name: 'cloudflare-r2-d1-archive-api',
      configureServer(server) {
        attachCloudflareR2D1Middleware(server.middlewares);
      },
      configurePreviewServer(server) {
        attachCloudflareR2D1Middleware(server.middlewares);
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
