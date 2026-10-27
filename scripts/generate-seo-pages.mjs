/**
 * Full Build-Time SSR & Static SEO Pre-Renderer (biodata.cogify.me)
 * ----------------------------------------------------------------------------
 * Implements all Technical SEO & Indexing Checklist requirements:
 *  1. True Server-Side Rendering (SSR) of the A4 Marriage Biodata Sheet (#biodata-a4-sheet),
 *     Form Sections (#sections-editor-container), Template Cards (#templates-gallery-grid),
 *     Semantic Breadcrumbs (#seo-breadcrumb-nav), Cultural Format Guides (#route-cultural-guide),
 *     and Route-Specific FAQs (#faq) directly into `dist/index.html` and all 15 route HTML files.
 *  2. Strictly ONE <h1> per page, self-referencing <link rel="canonical">, unique 140-160 char
 *     <meta name="description">, WebP Open Graph images, and route-specific JSON-LD (@graph:
 *     Organization, Person [Author Bio E-E-A-T], WebSite, WebPage, WebApplication,
 *     BreadcrumbList, HowTo, and FAQPage).
 *  3. Generates both `dist/<slug>.html` AND `dist/<slug>/index.html` so Cloudflare Assets
 *     serves `200 OK` at `/<slug>` with zero redirect chains.
 *  4. Generates `public/404.html` and `dist/404.html` with `noindex, nofollow` and full
 *     directory navigation to eliminate Soft 404s and broken links.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEO_LANDING_ROUTES, SITE_ORIGIN, AUTHOR_PROFILE } from '../src/seo/seoRouter.js';
import {
  COMMUNITY_PRESETS,
  LANGUAGE_LABELS,
  createInitialBiodataState
} from '../src/data/presets.js';
import { TEMPLATES, getTemplateById } from '../src/data/templates.js';
import { buildBiodataSheetMarkup } from '../src/templates/renderer.js';
import { renderLiveTemplateMiniPreview } from '../src/templates/adapter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const publicDir = path.resolve(rootDir, 'public');
const baseIndexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(baseIndexPath)) {
  console.error('[SEO SSR Pre-Renderer] dist/index.html not found. Run `vite build` first.');
  process.exit(1);
}

let rawViteIndexHtml = fs.readFileSync(baseIndexPath, 'utf8');

// Inline compiled Vite stylesheet into <head> to eliminate render-blocking CSS requests
// and flatten the critical network dependency tree.
const cssLinkMatch = rawViteIndexHtml.match(
  /<link\s+rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/i
);
if (cssLinkMatch) {
  const cssFilePath = path.join(distDir, cssLinkMatch[1].replace(/^\//, ''));
  if (fs.existsSync(cssFilePath)) {
    const compiledCss = fs.readFileSync(cssFilePath, 'utf8');
    rawViteIndexHtml = rawViteIndexHtml.replace(
      cssLinkMatch[0],
      `<style id="studio-compiled-css">${compiledCss}</style>`
    );
    console.log(`[SEO SSR Pre-Renderer] Inlined ${cssLinkMatch[1]} (${compiledCss.length} bytes) to eliminate render-blocking CSS`);
  }
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Builds the state for a specific preset + language + templateId
 */
function buildRouteBiodataState({ presetId = 'hindu_bride', language = 'en', templateId = 'royal-sindoor-gold' } = {}) {
  const presetObj = COMMUNITY_PRESETS.find((p) => p.id === presetId);
  const state = presetObj && typeof presetObj.apply === 'function'
    ? presetObj.apply()
    : createInitialBiodataState(presetId);

  if (templateId && getTemplateById(templateId)) {
    state.templateId = templateId;
  }

  if (language && LANGUAGE_LABELS[language]) {
    const dict = LANGUAGE_LABELS[language];
    state.language = language;
    if (dict.docTitle) state.docTitle = dict.docTitle;
    for (const sec of state.sections || []) {
      if (dict.sections && dict.sections[sec.id]) {
        sec.title = dict.sections[sec.id];
      }
      for (const f of sec.fields || []) {
        if (dict.fields && dict.fields[f.key]) {
          f.label = dict.fields[f.key];
        }
      }
    }
  }

  return state;
}

/**
 * Server-renders the A4 sheet (<article id="biodata-a4-sheet">) with inline CSS variables
 */
function renderSsrA4SheetArticle(state) {
  const tpl = getTemplateById(state.templateId);
  const rendered = buildBiodataSheetMarkup(state, tpl);
  const styleStr = [
    ...Object.entries(rendered.cssVars).map(([k, v]) => `${k}:${v}`),
    'transform-origin:top left',
    'transform:scale(0.7343)'
  ].join(';');

  return `<article id="biodata-a4-sheet" class="${escapeHtml(rendered.className)} is-inline-edit-enabled" data-page-count="${rendered.pageCount}" data-template-id="${escapeHtml(rendered.tpl.id)}" style="${escapeHtml(styleStr)}" aria-label="Live A4 Marriage Biodata Preview">${rendered.innerHtml}</article>`;
}

/**
 * Server-renders the initial Editor Sections (#sections-editor-container) so Googlebot
 * indexes all default section headings, field labels, and sample values on first byte.
 */
function renderSsrEditorSections(state) {
  const sections = (state.sections || []).filter((s) => s && s.visible !== false);
  const cardsHtml = sections
    .map((sec) => {
      const visibleFields = (sec.fields || []).filter((f) => f && f.visible !== false);
      const rowsHtml = visibleFields
        .map(
          (f) => `
          <div class="field-editor-row" data-field-id="${escapeHtml(f.id)}">
            <div class="field-row-top">
              <label class="field-label-static">${escapeHtml(f.label)}</label>
            </div>
            <input type="text" class="text-input" value="${escapeHtml(f.value)}" aria-label="${escapeHtml(f.label)}" readonly />
          </div>`
        )
        .join('');

      return `
        <div class="editor-card section-editor-card" data-section-id="${escapeHtml(sec.id)}">
          <div class="editor-card-header">
            <h3 class="editor-card-title">${escapeHtml(sec.title)}</h3>
          </div>
          <div class="editor-card-body">
            <div class="fields-list">${rowsHtml}</div>
          </div>
        </div>`;
    })
    .join('');

  return `<div id="sections-editor-container" class="sections-editor-stack">${cardsHtml}</div>`;
}

function renderSsrQuickTemplateStrip(state) {
  const currentTpl = getTemplateById(state.templateId);
  const quickTemplates = TEMPLATES.slice(0, 24);
  if (currentTpl && !quickTemplates.some((t) => t.id === currentTpl.id)) {
    quickTemplates.unshift(currentTpl);
  }
  const pillsHtml = quickTemplates
    .map((t) => {
      const isActive = t.id === state.templateId;
      return `<button type="button" class="template-mini-pill ${isActive ? 'active' : ''}" data-select-tpl="${escapeHtml(t.id)}"><span class="swatch-dot" style="background:${t.primary};border-color:${t.secondary};"></span><span>${escapeHtml(t.name)}</span></button>`;
    })
    .join('');
  return `<div id="template-pills-scroll" class="template-pills-scroll">${pillsHtml}</div>`;
}

/**
 * Server-renders 8 category-relevant template cards into #templates-gallery-grid
 */
function renderSsrTemplateGalleryGrid(state, preferredCategory = 'all') {
  let pool = TEMPLATES;
  if (preferredCategory && preferredCategory !== 'all') {
    const matching = TEMPLATES.filter((t) => t.category === preferredCategory);
    const others = TEMPLATES.filter((t) => t.category !== preferredCategory);
    pool = [...matching, ...others];
  }
  const initialTemplates = pool.slice(0, 8);

  const cardsHtml = initialTemplates
    .map((tpl) => {
      const isSelected = tpl.id === state.templateId;
      const miniHtml = renderLiveTemplateMiniPreview(tpl, state);
      return `
        <article class="template-gallery-card ${isSelected ? 'active' : ''}" data-template-card-id="${escapeHtml(tpl.id)}">
          <div class="template-card-thumb-wrap" data-action="apply-card" data-id="${escapeHtml(tpl.id)}">
            ${miniHtml}
          </div>
          <div class="template-card-meta">
            <div class="template-card-title-row">
              <h3 class="template-card-title">${escapeHtml(tpl.name)}</h3>
              <span class="template-card-badge">${escapeHtml(tpl.badge || tpl.category)}</span>
            </div>
            <p class="template-card-desc">${escapeHtml(tpl.description)}</p>
          </div>
        </article>`;
    })
    .join('');

  return `<div id="templates-gallery-grid" class="templates-gallery-grid">${cardsHtml}</div>`;
}

/**
 * Builds the JSON-LD @graph for either the Homepage or a dedicated Landing Route
 */
function buildJsonLdGraph(route = null) {
  const canonicalUrl = route ? `${SITE_ORIGIN}${route.path}` : `${SITE_ORIGIN}/`;
  const pageTitle = route ? route.title : 'Free Marriage Biodata Maker — Live A4 Studio | COGIFY';
  const pageDesc = route
    ? route.description
    : 'Create your marriage biodata online in 2 minutes. Pick from 242 Indian and NRI templates, customize fields and photo in browser, and download print-ready PDF.';

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Cogify',
      item: 'https://cogify.me/'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Marriage Biodata Maker Studio',
      item: `${SITE_ORIGIN}/`
    }
  ];

  if (route) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: route.breadcrumbName || route.h1,
      item: canonicalUrl
    });
  }

  const faqEntities = route && Array.isArray(route.faqs) && route.faqs.length > 0
    ? route.faqs.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a
        }
      }))
    : [
        {
          '@type': 'Question',
          name: 'Is this Marriage Biodata Maker truly 100% free with no watermark?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Every template, sacred emblem, font, sticker, Kundali chart, and export format (300-DPI PDF, Retina PNG/JPG, and editable Microsoft Word .docx) is 100% free forever with zero watermarks and no signup.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can I download an editable Microsoft Word (.docx) marriage biodata?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Our Word (.docx) export generates genuine editable Word tables, headings, page borders, and side-by-side portrait photo so you can edit text directly in Microsoft Word or Google Docs.'
          }
        },
        {
          '@type': 'Question',
          name: 'Are my personal details and photo private?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '100% private. Everything runs locally inside your browser on biodata.cogify.me. Your phone number, horoscope, family details, and photos are never uploaded to any server.'
          }
        },
        {
          '@type': 'Question',
          name: 'Does selecting Date of Birth calculate my Age automatically?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Selecting your Day, Month, and Year of Birth automatically calculates your exact completed age in years (e.g., 28 Years) and updates the Age field in real time.'
          }
        }
      ];

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://cogify.me/#organization',
        name: 'Cogify',
        url: 'https://cogify.me/',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_ORIGIN}/icon-512.webp`,
          width: 512,
          height: 512
        },
        sameAs: [
          'https://cogify.me',
          SITE_ORIGIN,
          'https://ssb.cogify.me',
          'https://github.com/Shubham-sharma8/biodata'
        ]
      },
      {
        '@type': 'Person',
        '@id': 'https://cogify.me/#author-shubham-sharma',
        name: AUTHOR_PROFILE.name,
        jobTitle: AUTHOR_PROFILE.role,
        url: AUTHOR_PROFILE.url,
        worksFor: { '@id': 'https://cogify.me/#organization' },
        sameAs: ['https://cogify.me', 'https://ssb.cogify.me', AUTHOR_PROFILE.github],
        knowsAbout: [
          'Indian Matrimonial Traditions',
          'Vedic Kundali & Horoscope Typography',
          'A4 Document Geometry & Print Engineering',
          'Privacy-First Web Applications'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        url: `${SITE_ORIGIN}/`,
        name: 'Marriage Biodata Maker Studio by Cogify',
        publisher: { '@id': 'https://cogify.me/#organization' },
        inLanguage: ['en', 'hi', 'mr', 'gu', 'ta', 'te', 'bn', 'pa', 'ur']
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: pageTitle,
        description: pageDesc,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        author: { '@id': 'https://cogify.me/#author-shubham-sharma' },
        reviewedBy: {
          '@type': 'Organization',
          name: AUTHOR_PROFILE.reviewedBy,
          url: 'https://cogify.me'
        },
        datePublished: AUTHOR_PROFILE.datePublished,
        dateModified: AUTHOR_PROFILE.dateModified,
        breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${SITE_ORIGIN}/og-banner.webp`,
          width: 1200,
          height: 630
        }
      },
      {
        '@type': 'WebApplication',
        '@id': `${SITE_ORIGIN}/#webapp`,
        name: route ? route.h1 : 'Free Marriage Biodata Maker Studio',
        url: canonicalUrl,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript and HTML5 Canvas',
        isAccessibleForFree: true,
        image: `${SITE_ORIGIN}/og-banner.webp`,
        screenshot: `${SITE_ORIGIN}/screenshots/desktop-studio-live-preview.webp`,
        author: { '@id': 'https://cogify.me/#author-shubham-sharma' },
        creator: { '@id': 'https://cogify.me/#organization' },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock'
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: breadcrumbItems
      },
      {
        '@type': 'HowTo',
        name: route ? `How to Create ${route.breadcrumbName} Online for Free` : 'How to Create a Marriage Biodata Online for Free',
        description: pageDesc,
        totalTime: 'PT2M',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Select a Cultural Preset & Language',
            text: 'Choose from 8 community presets (Hindu, Muslim/Nikah, Sikh, Christian, Jain, Buddhist, or Modern Minimal) and 9 languages.'
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Enter Personal, Horoscope, Education & Family Details',
            text: 'Pick your Date of Birth (age in years calculates automatically) and edit any field or click directly on the A4 sheet.'
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Customize Layout, Sacred Emblem, Kundali & Portrait Photo',
            text: 'Upload and crop your photo, choose from 242 templates and 14 layout engines, or enable a Vedic Kundali chart.'
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Download Free PDF, Editable Word (.docx), or HD Image',
            text: 'Click Download PDF, Word (.docx), HD PNG, or WhatsApp Summary at ₹0 with zero watermark and no login.'
          }
        ]
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faqpage`,
        mainEntity: faqEntities
      }
    ]
  };

  return `<script type="application/ld+json" id="seo-jsonld-graph">\n      ${JSON.stringify(graph)}\n    </script>`;
}

/**
 * Renders the visible semantic Breadcrumb <nav> for a route
 */
function renderBreadcrumbNav(route = null) {
  if (!route) {
    return `<nav aria-label="Breadcrumb" class="seo-breadcrumb" id="seo-breadcrumb-nav">
          <ol class="seo-breadcrumb-list">
            <li class="seo-breadcrumb-item"><a href="https://cogify.me">Cogify</a><span class="seo-breadcrumb-sep" aria-hidden="true">/</span></li>
            <li class="seo-breadcrumb-item"><a href="/" aria-current="page">Marriage Biodata Maker Studio</a></li>
          </ol>
        </nav>`;
  }

  return `<nav aria-label="Breadcrumb" class="seo-breadcrumb" id="seo-breadcrumb-nav">
          <ol class="seo-breadcrumb-list">
            <li class="seo-breadcrumb-item"><a href="https://cogify.me">Cogify</a><span class="seo-breadcrumb-sep" aria-hidden="true">/</span></li>
            <li class="seo-breadcrumb-item"><a href="/">Marriage Biodata Maker Studio</a><span class="seo-breadcrumb-sep" aria-hidden="true">/</span></li>
            <li class="seo-breadcrumb-item"><span>${escapeHtml(route.categoryName || 'Formats')}</span><span class="seo-breadcrumb-sep" aria-hidden="true">/</span></li>
            <li class="seo-breadcrumb-item"><a href="${escapeHtml(route.path)}" aria-current="page">${escapeHtml(route.breadcrumbName || route.h1)}</a></li>
          </ol>
        </nav>`;
}

/**
 * Renders the route-specific cultural guide section (#route-cultural-guide)
 */
function renderRouteCulturalGuide(route) {
  if (!route || !Array.isArray(route.mustHaveRows)) return null;

  const rowsHtml = route.mustHaveRows
    .map(
      (r, idx) =>
        `<tr><td><strong>${idx + 1}. ${escapeHtml(r.section)}</strong></td><td>${escapeHtml(r.fields)}</td><td>${escapeHtml(r.purpose)}</td></tr>`
    )
    .join('\n            ');

  // Also include related internal links to other routes in the same or complementary categories
  const relatedRoutes = SEO_LANDING_ROUTES.filter((r) => r.slug !== route.slug).slice(0, 6);
  const relatedLinksHtml = relatedRoutes
    .map(
      (r) =>
        `<a href="${escapeHtml(r.path)}" class="btn-chip" style="text-decoration:none">${escapeHtml(r.breadcrumbName)}</a>`
    )
    .join(' ');

  return `<section class="section-container" id="route-cultural-guide">
      <div class="section-heading-block">
        <h2 id="route-guide-title">${escapeHtml(route.guideTitle)}</h2>
        <p id="route-guide-intro">${escapeHtml(route.guideIntro)}</p>
      </div>
      <div class="comparison-table-wrap">
        <table class="comparison-table" id="route-guide-table">
          <thead>
            <tr><th>Biodata Section</th><th>Essential Fields &amp; Cultural Attributes</th><th>Why Families Expect It</th></tr>
          </thead>
          <tbody id="route-guide-tbody">
            ${rowsHtml}
          </tbody>
        </table>
      </div>
      <div style="margin-top: 14px; display: flex; flex-wrap: wrap; align-items: center; gap: 8px">
        <strong style="font-size: 12.5px; color: var(--text-secondary)">Explore Related Formats:</strong>
        <a href="/" class="btn-chip" style="text-decoration:none">All 242 Templates Home</a>
        ${relatedLinksHtml}
      </div>
    </section>`;
}

/**
 * Renders the route-specific FAQ section (#faq)
 */
function renderRouteFaqSection(route) {
  if (!route || !Array.isArray(route.faqs) || route.faqs.length === 0) return null;

  const itemsHtml = route.faqs
    .map(
      (item, idx) => `
        <details class="faq-item" ${idx < 2 ? 'open' : ''}>
          <summary>${escapeHtml(item.q)}</summary>
          <p>${escapeHtml(item.a)}</p>
        </details>`
    )
    .join('');

  return `<section class="section-container" id="faq">
      <div class="section-heading-block">
        <h2 id="faq-section-heading">Frequently Asked Questions — ${escapeHtml(route.breadcrumbName)}</h2>
        <p id="faq-section-subtitle">Common questions about creating, customizing, and downloading your ${escapeHtml(route.breadcrumbName)} in PDF, Word (.docx), and HD PNG formats.</p>
      </div>
      <div class="faq-list" id="faq-list-container">${itemsHtml}
      </div>
    </section>`;
}

// ---------------------------------------------------------------------------
// 1. Pre-render SSR Homepage (`dist/index.html`)
// ---------------------------------------------------------------------------
const homeState = buildRouteBiodataState({
  presetId: 'hindu_bride',
  language: 'en',
  templateId: 'royal-sindoor-gold'
});

const homeSsrHtml = rawViteIndexHtml
  .replace(
    /<script type="application\/ld\+json" id="seo-jsonld-graph">[\s\S]*?<\/script>/i,
    buildJsonLdGraph(null)
  )
  .replace(
    /<div id="sections-editor-container" class="sections-editor-stack"><\/div>/i,
    renderSsrEditorSections(homeState)
  )
  .replace(
    /<div id="template-pills-scroll" class="template-pills-scroll"><\/div>/i,
    renderSsrQuickTemplateStrip(homeState)
  )
  .replace(
    /<article id="biodata-a4-sheet"[^>]*><\/article>/i,
    renderSsrA4SheetArticle(homeState)
  )
  .replace(
    /<div id="templates-gallery-grid" class="templates-gallery-grid"><\/div>/i,
    renderSsrTemplateGalleryGrid(homeState, 'all')
  );

fs.writeFileSync(baseIndexPath, homeSsrHtml, 'utf8');
console.log('[SEO SSR Pre-Renderer] Pre-rendered full SSR A4 sheet, form sections & gallery into dist/index.html');

// ---------------------------------------------------------------------------
// 2. Pre-render all 15 Dedicated Cultural & Format Landing Routes
//    Writes both `dist/<slug>.html` AND `dist/<slug>/index.html`
// ---------------------------------------------------------------------------
let generatedCount = 0;

for (const route of SEO_LANDING_ROUTES) {
  const canonicalUrl = `${SITE_ORIGIN}${route.path}`;
  const safeTitle = escapeHtml(route.title);
  const safeDesc = escapeHtml(route.description);
  const safeH1 = escapeHtml(route.h1);
  const safeSubtitle = escapeHtml(route.heroSubtitle || route.description);

  const routeState = buildRouteBiodataState({
    presetId: route.preset || 'hindu_bride',
    language: route.language || 'en',
    templateId: route.defaultTemplateId || 'royal-sindoor-gold'
  });
  const activeTpl = getTemplateById(routeState.templateId);

  let routeHtml = rawViteIndexHtml
    .replace(/<html lang="en">/i, `<html lang="${escapeHtml(route.language || 'en')}">`)
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
      /<meta\s+property="og:locale"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:locale" content="${escapeHtml(route.locale || 'en_IN')}" />`
    )
    .replace(
      /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:url" content="${canonicalUrl}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${safeTitle}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${safeDesc}" />`
    )
    .replace(
      /<script type="application\/ld\+json" id="seo-jsonld-graph">[\s\S]*?<\/script>/i,
      buildJsonLdGraph(route)
    )
    .replace(
      /<nav aria-label="Breadcrumb" class="seo-breadcrumb" id="seo-breadcrumb-nav">[\s\S]*?<\/nav>/i,
      renderBreadcrumbNav(route)
    )
    .replace(
      /<h1 class="hero-title">[\s\S]*?<\/h1>/i,
      `<h1 class="hero-title">${safeH1}</h1>`
    )
    .replace(
      /<p id="hero-subtitle-text">[\s\S]*?<\/p>/i,
      `<p id="hero-subtitle-text">${safeSubtitle}</p>`
    )
    .replace(
      /<strong id="active-template-name">[\s\S]*?<\/strong>/i,
      `<strong id="active-template-name">${escapeHtml(activeTpl.name)}</strong>`
    )
    .replace(
      /<div id="sections-editor-container" class="sections-editor-stack"><\/div>/i,
      renderSsrEditorSections(routeState)
    )
    .replace(
      /<div id="template-pills-scroll" class="template-pills-scroll"><\/div>/i,
      renderSsrQuickTemplateStrip(routeState)
    )
    .replace(
      /<article id="biodata-a4-sheet"[^>]*><\/article>/i,
      renderSsrA4SheetArticle(routeState)
    )
    .replace(
      /<div id="templates-gallery-grid" class="templates-gallery-grid"><\/div>/i,
      renderSsrTemplateGalleryGrid(routeState, route.templateCategory || 'all')
    );

  const customGuideHtml = renderRouteCulturalGuide(route);
  if (customGuideHtml) {
    routeHtml = routeHtml.replace(
      /<section class="section-container" id="route-cultural-guide">[\s\S]*?<\/section>/i,
      customGuideHtml
    );
  }

  const customFaqHtml = renderRouteFaqSection(route);
  if (customFaqHtml) {
    routeHtml = routeHtml.replace(
      /<section class="section-container" id="faq">[\s\S]*?<\/section>/i,
      customFaqHtml
    );
  }

  // Write both `dist/<slug>.html` (for drop-trailing-slash 200 OK) and `dist/<slug>/index.html`
  fs.writeFileSync(path.join(distDir, `${route.slug}.html`), routeHtml, 'utf8');
  const outDir = path.join(distDir, route.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), routeHtml, 'utf8');
  generatedCount++;
}

// ---------------------------------------------------------------------------
// 3. Generate Semantic HTTP 404 Page (`public/404.html` & `dist/404.html`)
//    Prevents Soft 404s and Broken 404s by returning `noindex, nofollow` and
//    providing direct links to all 16 valid marriage biodata routes.
// ---------------------------------------------------------------------------
const routeDirectoryLinks = SEO_LANDING_ROUTES.map(
  (r) => `<li><a href="${escapeHtml(r.path)}"><strong>${escapeHtml(r.breadcrumbName)}</strong> — ${escapeHtml(r.h1)}</a></li>`
).join('\n          ');

const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Not Found (404) — Marriage Biodata Maker Studio | Cogify</title>
    <meta name="description" content="The requested page could not be found on biodata.cogify.me. Explore our 242 free A4 marriage biodata templates and cultural formats below." />
    <meta name="robots" content="noindex, nofollow" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; background: #FAF6F0; color: #1F1916; margin: 0; padding: 40px 20px; line-height: 1.6; }
      .card-404 { max-width: 820px; margin: 0 auto; background: #FFFDF9; border: 1px solid #E5DAC9; border-radius: 14px; padding: 32px; box-shadow: 0 8px 24px rgba(31,25,22,0.06); }
      h1 { color: #7B1E26; margin-top: 0; font-size: 28px; }
      .cta-btn { display: inline-block; background: #7B1E26; color: #FFFFFF; text-decoration: none; font-weight: 700; padding: 12px 22px; border-radius: 8px; margin: 12px 0 24px 0; }
      ul { columns: 2; gap: 24px; padding-left: 18px; }
      li { margin-bottom: 8px; break-inside: avoid; }
      a { color: #7B1E26; }
      @media (max-width: 640px) { ul { columns: 1; } }
    </style>
  </head>
  <body>
    <main class="card-404">
      <nav aria-label="Breadcrumb" style="font-size: 13px; margin-bottom: 10px">
        <a href="https://cogify.me">Cogify</a> / <a href="/">Marriage Biodata Maker Studio</a> / <span>404 Not Found</span>
      </nav>
      <h1>404 — Marriage Biodata Page Not Found</h1>
      <p>The URL you requested does not exist or may have moved. You can launch the free live A4 Marriage Biodata Studio or choose any of our 15 cultural &amp; regional formats below:</p>
      <a href="/" class="cta-btn">Launch Free Marriage Biodata Maker Studio (242 Templates) &rarr;</a>
      <h2>All Official Marriage Biodata Formats on biodata.cogify.me</h2>
      <ul>
        <li><a href="/"><strong>Global Studio Homepage</strong> — 242 Free A4 Templates (PDF, Word .docx &amp; HD PNG)</a></li>
        ${routeDirectoryLinks}
      </ul>
    </main>
  </body>
</html>
`;

fs.writeFileSync(path.join(publicDir, '404.html'), notFoundHtml, 'utf8');
fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8');

console.log(`[SEO SSR Pre-Renderer] Generated ${generatedCount} full-SSR landing routes + 404.html in dist/`);
