/**
 * Post-Build Static SEO Landing Page Pre-Renderer (biodata.cogify.me)
 * Generates dedicated crawlable HTML files (`dist/<slug>/index.html`) for all 15
 * high-intent cultural & format routes in `public/sitemap.xml` so Googlebot, Bingbot,
 * and AI crawlers receive unique <title>, <meta name="description">, <link rel="canonical">,
 * Open Graph tags, and <h1> headings without needing client-side JS execution.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEO_LANDING_ROUTES, SITE_ORIGIN } from '../src/seo/seoRouter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const baseIndexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(baseIndexPath)) {
  console.error('[SEO Pre-Renderer] dist/index.html not found. Run `vite build` first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseIndexPath, 'utf8');

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

let generatedCount = 0;

for (const route of SEO_LANDING_ROUTES) {
  const canonicalUrl = `${SITE_ORIGIN}${route.path}`;
  const safeTitle = escapeHtml(route.title);
  const safeDesc = escapeHtml(route.description);
  const safeH1 = escapeHtml(route.h1);

  let routeHtml = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(
      /<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="title" content="${safeTitle}" />`
    )
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${safeDesc}" />`
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${canonicalUrl}" />`
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${canonicalUrl}" />`
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${safeTitle}" />`
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${safeDesc}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${safeTitle}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${safeDesc}" />`
    );

  if (safeH1) {
    routeHtml = routeHtml.replace(
      /<h1 class="hero-title">[\s\S]*?<\/h1>/i,
      `<h1 class="hero-title">${safeH1}</h1>`
    );
  }

  const outDir = path.join(distDir, route.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), routeHtml, 'utf8');
  generatedCount++;
}

console.log(`[SEO Pre-Renderer] Generated ${generatedCount} static SEO landing routes in dist/`);
