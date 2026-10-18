/**
 * Phase 4 — Template Adapter Architecture & Rendering Engine Helpers
 *
 * Normalizes raw template definitions into a strict, validated schema,
 * computes multi-dimensional discovery facets (style, colorFamily, pageCount,
 * supportsPhoto, recommendedLanguages, sourceType, structuralSignature),
 * and generates live engine-driven miniature previews for the template gallery.
 */

import { SUPPORTED_BORDER_STYLES, renderTemplateFrameSvg, renderSectionDividerSvg } from '../utils/svgBorders.js';
import { getEmblemById } from '../data/emblems.js';
import { getCanvaReferenceById } from '../data/canvaCatalog.js';

export { SUPPORTED_BORDER_STYLES };

export const SUPPORTED_LAYOUTS = [
  'classic',
  'two-column',
  'sidebar-left',
  'sidebar-right',
  'editorial-banner',
  'header-split-card',
  'boxed-sections-grid',
  'timeline-spine',
  'royal-centered-crest',
  'two-page-comprehensive',
  'magazine-cover-spread',
  'arched-palace-darbar',
  'kundali-horoscope-focus',
  'modern-infographic-resume'
];

export const SUPPORTED_HEADER_STYLES = [
  'ribbon',
  'ornate-line',
  'pill',
  'underline',
  'boxed-tag',
  'left-accent'
];

export const SUPPORTED_FONT_PAIRS = [
  'classic',
  'royal',
  'editorial',
  'modern',
  'devanagari',
  'calligraphic'
];

export const SUPPORTED_STYLE_TAGS = [
  'traditional',
  'modern',
  'minimalist',
  'floral',
  'premium'
];

export const SUPPORTED_COLOR_FAMILIES = [
  { id: 'all', name: 'All Colors', hex: 'linear-gradient(135deg,#9B1C31,#D4AF37,#1E3A8A,#166534)' },
  { id: 'red', name: 'Crimson & Maroon', hex: '#9B1C31' },
  { id: 'gold', name: 'Gold & Saffron', hex: '#D97706' },
  { id: 'blue', name: 'Royal Blue & Teal', hex: '#1E3A8A' },
  { id: 'green', name: 'Emerald & Sage', hex: '#15803D' },
  { id: 'pink', name: 'Blush & Rose', hex: '#BE185D' },
  { id: 'purple', name: 'Plum & Amethyst', hex: '#6B21A8' },
  { id: 'ivory', name: 'Ivory & Sandalwood', hex: '#D6C5B3' },
  { id: 'dark', name: 'Velvet Dark & Noir', hex: '#1E293B' },
  { id: 'neutral', name: 'Slate & Monochrome', hex: '#475569' }
];

/**
 * Infer color family from template palette & metadata if not explicitly set
 */
export function inferColorFamily(tpl) {
  if (tpl.colorFamily) return tpl.colorFamily;
  if (tpl.isDark) return 'dark';
  const textBlob = `${tpl.id} ${tpl.name} ${tpl.subtitle}`.toLowerCase();
  if (/maroon|sindoor|crimson|kumkum|burgundy|red|terracotta|kanjeevaram-red|alta/.test(textBlob)) return 'red';
  if (/pink|rose|gulaab|blush|magenta|lotus|peach/.test(textBlob)) return 'pink';
  if (/plum|purple|amethyst|lavender|raat-rani|violet/.test(textBlob)) return 'purple';
  if (/emerald|green|sage|tulsi|mehndi|celadon|forest|olive|pistachio/.test(textBlob)) return 'green';
  if (/blue|navy|sapphire|teal|mayur|peacock|turquoise|azure|cobalt|indigo|oxford|steel/.test(textBlob)) return 'blue';
  if (/slate|charcoal|grey|gray|noir|monochrome|minimal-white|executive-white|abu/.test(textBlob)) return 'neutral';
  if (/ivory|mogra|christian-ivory|pearl|champagne|sandstone|beige/.test(textBlob)) return 'ivory';
  if (/gold|kesar|chandan|saffron|marigold|haldi|bronze|amber|ochre|turmeric|pitambari/.test(textBlob)) return 'gold';
  return 'gold';
}

/**
 * Infer style tags (`traditional`, `modern`, `minimalist`, `floral`, `premium`)
 */
export function inferStyleTags(tpl, categories) {
  const set = new Set(Array.isArray(tpl.styles) ? tpl.styles : []);
  const blob = `${tpl.id} ${tpl.name} ${tpl.subtitle} ${tpl.borderStyle} ${tpl.layout}`.toLowerCase();

  if (categories.includes('traditional') || categories.includes('regional') || categories.includes('islamic') || categories.includes('interfaith') || ['arched-palace-darbar', 'kundali-horoscope-focus'].includes(tpl.layout)) {
    set.add('traditional');
  }
  if (categories.includes('floral') || /floral|rose|lotus|mogra|jasmine|blossom|botanical|vine|gulaab|padma/.test(blob)) {
    set.add('floral');
  }
  if (categories.includes('modern') || ['two-column', 'sidebar-left', 'sidebar-right', 'editorial-banner', 'header-split-card', 'boxed-sections-grid', 'timeline-spine', 'magazine-cover-spread', 'modern-infographic-resume'].includes(tpl.layout)) {
    set.add('modern');
  }
  if (/minimal|simple|clean|swiss|compact|no-photo|slate|monochrome|dove|abu/.test(blob) || ['minimal-line', 'swiss-editorial-grid', 'minimal-swiss-crosshair', 'none'].includes(tpl.borderStyle)) {
    set.add('minimalist');
  }
  if (tpl.isDark || categories.includes('dark') || /royal|zari|luxury|foil|darbar|jharokha|velvet|gold|kanjeevaram|paithani|pattachitra|two-page/.test(blob) || tpl.pageCount === 2) {
    set.add('premium');
  }
  if (set.size === 0) {
    set.add('traditional');
  }
  return Array.from(set);
}

/**
 * Infer recommended languages based on cultural/community template cues
 */
export function inferRecommendedLanguages(tpl, categories) {
  const langs = new Set(['en', 'hi', ...(Array.isArray(tpl.recommendedLanguages) ? tpl.recommendedLanguages : [])]);
  const blob = `${tpl.id} ${tpl.name} ${tpl.subtitle} ${tpl.sourceInspiration || ''}`.toLowerCase();

  if (/marathi|peshwai|paithani|lagna|abhang/.test(blob)) langs.add('mr');
  if (/gujarati|bandhani|panetar|garba|patola/.test(blob)) langs.add('gu');
  if (/punjabi|sikh|anand-karaj|phulkari|gurmukhi/.test(blob)) langs.add('pa');
  if (/bengali|alpana|shakha|jamdani|rabindra/.test(blob)) langs.add('bn');
  if (/tamil|kolam|kanjeevaram|pongal|madurai|chembai/.test(blob)) langs.add('ta');
  if (/telugu|andhra|kalamkari|muggu|tirupati|pochampally/.test(blob)) langs.add('te');
  if (/kannada|mysore|karnataka|sandalwood|chandan|south-indian/.test(blob)) langs.add('kn');
  if (/islamic|nikah|muslim|arabesque|mihrab|zellij|urdu/.test(blob) || categories.includes('islamic')) langs.add('ur');

  // Universal templates work across all 9 supported languages
  if (categories.includes('modern') || categories.includes('floral') || categories.includes('traditional')) {
    ['en', 'hi', 'mr', 'gu', 'ta', 'te', 'bn', 'kn', 'ur'].forEach((l) => langs.add(l));
  }
  return Array.from(langs);
}

/**
 * Normalize a single template object into the canonical adapter schema
 */
export function normalizeTemplate(raw, index = 0) {
  const rawCats = Array.isArray(raw.category) ? raw.category : [raw.category || 'traditional'];
  const categories = [...new Set(rawCats)];
  if (categories.includes('canva') && !categories.includes('traditional')) {
    categories.push('traditional');
  }

  const pageCount = raw.pageCount === 2 || raw.layout === 'two-page-comprehensive' ? 2 : 1;
  const supportsPhoto = typeof raw.supportsPhoto === 'boolean'
    ? raw.supportsPhoto
    : !/no-photo/.test(raw.id);

  if (pageCount === 2 && !categories.includes('two-page')) {
    categories.push('two-page');
  }
  if (!supportsPhoto && !categories.includes('no-photo')) {
    categories.push('no-photo');
  }
  if (raw.canvaDesignId && !categories.includes('canva')) {
    categories.push('canva');
  }

  const canvaRef = raw.canvaDesignId ? getCanvaReferenceById(raw.canvaDesignId) : null;
  const sourceType = raw.sourceType || (canvaRef
    ? (canvaRef.path === 'A' ? 'canva-path-a' : 'canva-path-b')
    : 'native-original');

  const importedAssetPath = raw.importedAssetPath || (canvaRef && canvaRef.importedAssetPath) || null;
  const colorFamily = inferColorFamily({ ...raw, isDark: Boolean(raw.isDark) });
  const styles = inferStyleTags({ ...raw, pageCount }, categories);
  const recommendedLanguages = inferRecommendedLanguages(raw, categories);
  const sectionMotif = raw.sectionMotif || (
    categories.includes('islamic') ? 'star'
      : categories.includes('floral') ? 'lotus'
        : styles.includes('minimalist') ? 'minimal'
          : styles.includes('traditional') ? 'paisley'
            : 'diamond'
  );

  const layout = SUPPORTED_LAYOUTS.includes(raw.layout) ? raw.layout : 'classic';
  const borderStyle = SUPPORTED_BORDER_STYLES.includes(raw.borderStyle) ? raw.borderStyle : 'minimal-line';
  const headerStyle = SUPPORTED_HEADER_STYLES.includes(raw.headerStyle) ? raw.headerStyle : 'underline';
  const fontPair = SUPPORTED_FONT_PAIRS.includes(raw.fontPair) ? raw.fontPair : 'classic';
  const defaultPhotoShape = supportsPhoto ? (raw.defaultPhotoShape || 'rounded-rect') : 'none';

  const keywords = Array.from(new Set([
    raw.id,
    raw.name,
    raw.subtitle,
    raw.sourceInspiration || '',
    raw.canvaDesignId || '',
    layout,
    borderStyle,
    headerStyle,
    colorFamily,
    ...categories,
    ...styles,
    ...(raw.keywords || []),
    pageCount === 2 ? '2-page two page comprehensive' : '1-page one page single',
    supportsPhoto ? 'with photo portrait' : 'no photo text only'
  ].join(' ').toLowerCase().split(/[\s,/|-]+/).filter(Boolean)));

  const structuralSignature = [
    layout,
    borderStyle,
    headerStyle,
    sectionMotif,
    fontPair,
    defaultPhotoShape,
    `p${pageCount}`,
    `photo:${supportsPhoto ? 1 : 0}`,
    raw.primary.toUpperCase(),
    raw.bg.toUpperCase()
  ].join('|');

  const dimensions = {
    format: 'A4',
    widthPx: 794,
    heightPx: 1123,
    widthMm: 210,
    heightMm: 297
  };
  const isRecentlyAdded = typeof raw.isRecentlyAdded === 'boolean'
    ? raw.isRecentlyAdded
    : typeof raw.recentlyAdded === 'boolean'
      ? raw.recentlyAdded
      : index >= 36;
  const canvaDesignId = raw.canvaDesignId || raw.canvaRefId || null;

  return {
    ...raw,
    index,
    category: Array.isArray(raw.category) ? raw.category[0] : (raw.category || categories[0] || 'traditional'),
    categories,
    styles,
    styleTags: styles,
    colorFamily,
    pageCount,
    dimensions,
    pageDimensions: dimensions,
    supportsPhoto,
    recommendedLanguages,
    isRecentlyAdded,
    recentlyAdded: isRecentlyAdded,
    sourceType,
    canvaDesignId,
    canvaRefId: canvaDesignId,
    canvaPath: canvaRef ? canvaRef.path : (raw.canvaPath || null),
    importedAssetPath,
    canvaAssetPath: importedAssetPath,
    thumbnailPath: importedAssetPath || `#live-engine-preview:${raw.id}`,
    layout,
    borderStyle,
    headerStyle,
    sectionMotif,
    fontPair,
    defaultPhotoShape,
    keywords,
    structuralSignature
  };
}

/**
 * Validate a single normalized template against the Phase 10 QA Schema
 */
export function validateTemplateSchema(tpl) {
  const errors = [];
  if (!tpl || typeof tpl !== 'object') {
    return { valid: false, errors: ['Template must be an object'] };
  }
  if (!tpl.id || typeof tpl.id !== 'string' || !/^[a-z0-9-]+$/i.test(tpl.id)) {
    errors.push(`Invalid template id: ${tpl.id}`);
  }
  if (!tpl.name || typeof tpl.name !== 'string' || tpl.name.trim().length < 3) {
    errors.push(`Invalid template name for ${tpl.id}`);
  }
  if (!tpl.subtitle || typeof tpl.subtitle !== 'string' || tpl.subtitle.trim().length < 3) {
    errors.push(`Invalid template subtitle for ${tpl.id}`);
  }
  if (!SUPPORTED_LAYOUTS.includes(tpl.layout)) {
    errors.push(`Unsupported layout "${tpl.layout}" in ${tpl.id}`);
  }
  if (!SUPPORTED_BORDER_STYLES.includes(tpl.borderStyle)) {
    errors.push(`Unsupported borderStyle "${tpl.borderStyle}" in ${tpl.id}`);
  }
  if (!SUPPORTED_HEADER_STYLES.includes(tpl.headerStyle)) {
    errors.push(`Unsupported headerStyle "${tpl.headerStyle}" in ${tpl.id}`);
  }
  if (!SUPPORTED_FONT_PAIRS.includes(tpl.fontPair)) {
    errors.push(`Unsupported fontPair "${tpl.fontPair}" in ${tpl.id}`);
  }
  for (const colorKey of ['bg', 'surface', 'primary', 'secondary', 'text', 'muted']) {
    if (!tpl[colorKey] || !/^#[0-9A-Fa-f]{6}$/.test(tpl[colorKey])) {
      errors.push(`Invalid hex color ${colorKey}="${tpl[colorKey]}" in ${tpl.id}`);
    }
  }
  if (![1, 2].includes(tpl.pageCount)) {
    errors.push(`Unsupported pageCount "${tpl.pageCount}" in ${tpl.id}`);
  }
  if (!tpl.dimensions || tpl.dimensions.widthPx !== 794 || tpl.dimensions.heightPx !== 1123) {
    errors.push(`Invalid A4 page dimensions in ${tpl.id}`);
  }
  if (!tpl.thumbnailPath || typeof tpl.thumbnailPath !== 'string') {
    errors.push(`Missing thumbnailPath in ${tpl.id}`);
  }
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate the entire collection for uniqueness, schema compliance, and differentiation
 */
export function validateTemplateCollection(templates) {
  const seenIds = new Set();
  const seenSignatures = new Set();
  const errors = [];

  for (const tpl of templates) {
    if (seenIds.has(tpl.id)) {
      errors.push(`Duplicate template id: ${tpl.id}`);
    }
    seenIds.add(tpl.id);

    const res = validateTemplateSchema(tpl);
    if (!res.valid) {
      errors.push(...res.errors);
    }

    if (seenSignatures.has(tpl.structuralSignature)) {
      errors.push(`Duplicate structural signature for ${tpl.id}: ${tpl.structuralSignature}`);
    }
    seenSignatures.add(tpl.structuralSignature);
  }

  return {
    valid: errors.length === 0,
    totalTemplates: templates.length,
    uniqueIds: seenIds.size,
    uniqueSignatures: seenSignatures.size,
    errors
  };
}

/**
 * Filter and search normalized templates across all Phase 6 discovery dimensions
 */
export function filterAndSearchTemplates(templates, filters = {}, favoritesSet = new Set()) {
  const searchStr = filters.search !== undefined ? filters.search : (filters.query || '');
  const category = filters.category || 'all';
  const style = filters.style || 'all';
  const rawColor = filters.colorFamily || 'all';
  const colorFamily = rawColor === 'dark-luxury' ? 'dark' : rawColor;
  const pageCount = filters.pageCount !== undefined ? String(filters.pageCount) : 'all';
  const photoFilter =
    filters.photoFilter && filters.photoFilter !== 'all'
      ? filters.photoFilter
      : (filters.photoSupport || 'all');
  const language = filters.language || 'all';
  const onlyRecent = Boolean(filters.onlyRecent || filters.recentlyAddedOnly);
  const onlyFavorites = Boolean(filters.onlyFavorites || filters.favoritesOnly);
  const rawSource =
    filters.sourceFilter && filters.sourceFilter !== 'all'
      ? filters.sourceFilter
      : (filters.sourcePath || 'all');
  const sourceFilter =
    rawSource === 'path_a_direct_import'
      ? 'canva-path-a'
      : rawSource === 'path_b_editable_reconstruction'
        ? 'canva-path-b'
        : rawSource === 'native_original'
          ? 'native-original'
          : rawSource;

  const queryTokens = String(searchStr)
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  return templates.filter((tpl) => {
    if (category !== 'all' && !tpl.categories.includes(category)) {
      return false;
    }
    if (style !== 'all' && !tpl.styles.includes(style)) {
      return false;
    }
    if (colorFamily !== 'all' && tpl.colorFamily !== colorFamily) {
      return false;
    }
    if (pageCount === '1' && tpl.pageCount !== 1) {
      return false;
    }
    if (pageCount === '2' && tpl.pageCount !== 2) {
      return false;
    }
    if (photoFilter === 'with-photo' && !tpl.supportsPhoto) {
      return false;
    }
    if (photoFilter === 'no-photo' && tpl.supportsPhoto) {
      return false;
    }
    if (language !== 'all' && !tpl.recommendedLanguages.includes(language)) {
      return false;
    }
    if (onlyRecent && !tpl.isRecentlyAdded) {
      return false;
    }
    if (onlyFavorites && !favoritesSet.has(tpl.id)) {
      return false;
    }
    if (sourceFilter !== 'all' && tpl.sourceType !== sourceFilter) {
      return false;
    }
    if (queryTokens.length > 0) {
      const hay = tpl.keywords.join(' ');
      for (const tok of queryTokens) {
        if (!hay.includes(tok)) return false;
      }
    }
    return true;
  });
}

/**
 * Generate a live engine-rendered miniature preview of a template using real SVG border
 * geometry, real layout structure, real sacred emblem, and live user/sample data.
 */
export function renderLiveTemplateMiniPreview(tpl, previewData = {}) {
  const candidateName = previewData.candidateName || 'Ananya Sharma';
  const headline = previewData.headline || 'B.Tech, MBA • Product Manager';
  const invocation = previewData.invocation || '॥ श्री गणेशाय नमः ॥';
  const emblem = getEmblemById(tpl.defaultEmblem || 'ganesh');
  const frameSvg = renderTemplateFrameSvg(tpl.borderStyle, tpl.primary, tpl.secondary);
  const motifSvg = renderSectionDividerSvg(tpl.sectionMotif || 'diamond', tpl.primary, tpl.secondary);

  const hasPhoto = tpl.supportsPhoto;
  const photoShapeClass = `mini-photo-${tpl.defaultPhotoShape || 'rounded-rect'}`;
  const photoMarkup = hasPhoto
    ? `<div class="mini-photo-box ${photoShapeClass}" style="border-color:${tpl.secondary};background:${tpl.primary}18">
        ${previewData.photoDataUrl
          ? `<img src="${previewData.photoDataUrl}" alt="" loading="lazy" />`
          : `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="${tpl.primary}" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 14.5-4 16 0"/></svg>`}
      </div>`
    : '';

  const isBanner = tpl.layout === 'editorial-banner';
  const headerBg = isBanner ? tpl.primary : 'transparent';
  const headerColor = isBanner ? (tpl.isDark ? '#111827' : '#FFFFFF') : tpl.primary;
  const emblemSvgMarkup =
    emblem && typeof emblem.svg === 'function'
      ? emblem.svg(isBanner ? headerColor : tpl.primary)
      : (emblem?.svg || '');

  // Render layout-accurate body skeleton with live text snippet
  let bodyMarkup = '';
  if (tpl.layout === 'sidebar-left' || tpl.layout === 'sidebar-right') {
    const isRight = tpl.layout === 'sidebar-right';
    bodyMarkup = `
      <div class="mini-body-split ${isRight ? 'reverse' : ''}">
        <div class="mini-sidebar" style="background:${tpl.primary}14;border-color:${tpl.secondary}55">
          ${photoMarkup}
          <div class="mini-side-lines">
            <span style="background:${tpl.primary}"></span>
            <span style="background:${tpl.secondary}"></span>
            <span style="background:${tpl.muted}66"></span>
          </div>
        </div>
        <div class="mini-main-col">
          <div class="mini-sec-head" style="color:${tpl.primary};border-color:${tpl.secondary}">${motifSvg}<span>Personal</span></div>
          <div class="mini-kv"><i style="background:${tpl.muted}55"></i><b style="background:${tpl.text}88"></b></div>
          <div class="mini-kv"><i style="background:${tpl.muted}55"></i><b style="background:${tpl.text}77"></b></div>
          <div class="mini-sec-head" style="color:${tpl.primary};border-color:${tpl.secondary}">${motifSvg}<span>Family</span></div>
          <div class="mini-kv"><i style="background:${tpl.muted}55"></i><b style="background:${tpl.text}88"></b></div>
        </div>
      </div>`;
  } else if (tpl.layout === 'two-column' || tpl.layout === 'boxed-sections-grid' || tpl.layout === 'two-page-comprehensive') {
    const boxedStyle = tpl.layout === 'boxed-sections-grid'
      ? `background:${tpl.primary}0C;border:1px solid ${tpl.secondary}55;border-radius:3px;padding:3px;`
      : '';
    bodyMarkup = `
      <div class="mini-top-row">
        <div class="mini-title-block">
          <div class="mini-name" style="color:${tpl.primary}">${escapeMiniHtml(candidateName)}</div>
          <div class="mini-sub" style="color:${tpl.muted}">${escapeMiniHtml(headline)}</div>
        </div>
        ${photoMarkup}
      </div>
      <div class="mini-grid-2col">
        <div class="mini-col-card" style="${boxedStyle}">
          <div class="mini-sec-head" style="color:${tpl.primary};border-color:${tpl.secondary}">${motifSvg}<span>Personal</span></div>
          <div class="mini-kv"><i style="background:${tpl.muted}55"></i><b style="background:${tpl.text}88"></b></div>
          <div class="mini-kv"><i style="background:${tpl.muted}55"></i><b style="background:${tpl.text}77"></b></div>
        </div>
        <div class="mini-col-card" style="${boxedStyle}">
          <div class="mini-sec-head" style="color:${tpl.primary};border-color:${tpl.secondary}">${motifSvg}<span>Family</span></div>
          <div class="mini-kv"><i style="background:${tpl.muted}55"></i><b style="background:${tpl.text}88"></b></div>
          <div class="mini-kv"><i style="background:${tpl.muted}55"></i><b style="background:${tpl.text}77"></b></div>
        </div>
      </div>`;
  } else if (tpl.layout === 'royal-centered-crest' || tpl.layout === 'arched-palace-darbar') {
    const archWrapStyle =
      tpl.layout === 'arched-palace-darbar'
        ? `border:1px solid ${tpl.secondary}88;border-radius:16px 16px 3px 3px;padding:4px;background:${tpl.primary}0C;`
        : '';
    bodyMarkup = `
      <div class="mini-centered-crest" style="${archWrapStyle}">
        ${photoMarkup}
        <div class="mini-name" style="color:${tpl.primary};text-align:center">${escapeMiniHtml(candidateName)}</div>
        <div class="mini-sec-head" style="color:${tpl.primary};border-color:${tpl.secondary};justify-content:center">${motifSvg}<span>Profile & Family</span></div>
        <div class="mini-kv"><i style="background:${tpl.muted}55"></i><b style="background:${tpl.text}88"></b></div>
        <div class="mini-kv"><i style="background:${tpl.muted}55"></i><b style="background:${tpl.text}77"></b></div>
      </div>`;
  } else if (tpl.layout === 'kundali-horoscope-focus') {
    bodyMarkup = `
      <div class="mini-top-row">
        <div class="mini-title-block">
          <div class="mini-name" style="color:${tpl.primary}">${escapeMiniHtml(candidateName)}</div>
          <div class="mini-sub" style="color:${tpl.muted}">Vedic Kundali &amp; Astro Folio</div>
        </div>
        ${photoMarkup}
      </div>
      <div class="mini-grid-2col">
        <div class="mini-col-card" style="border:1px solid ${tpl.secondary}88;padding:2px;display:flex;align-items:center;justify-content:center;">
          <svg viewBox="0 0 40 32" width="38" height="28" fill="none" stroke="${tpl.primary}" stroke-width="1.2">
            <rect x="1" y="1" width="38" height="30"/>
            <line x1="1" y1="1" x2="39" y2="31"/><line x1="39" y1="1" x2="1" y2="31"/>
            <polygon points="20,1 39,16 20,31 1,16" stroke="${tpl.secondary}"/>
          </svg>
        </div>
        <div class="mini-col-card">
          <div class="mini-sec-head" style="color:${tpl.primary};border-color:${tpl.secondary}">${motifSvg}<span>Astro</span></div>
          <div class="mini-kv"><i style="background:${tpl.muted}55"></i><b style="background:${tpl.text}88"></b></div>
          <div class="mini-kv"><i style="background:${tpl.muted}55"></i><b style="background:${tpl.text}77"></b></div>
        </div>
      </div>`;
  } else if (tpl.layout === 'magazine-cover-spread' || tpl.layout === 'modern-infographic-resume') {
    bodyMarkup = `
      <div class="mini-top-row" style="background:${tpl.primary}15;border-left:3px solid ${tpl.primary};padding:3px 5px;border-radius:2px;">
        <div class="mini-title-block">
          <div class="mini-name" style="color:${tpl.primary};font-size:8.5px;">${escapeMiniHtml(candidateName)}</div>
          <div class="mini-sub" style="color:${tpl.muted}">${escapeMiniHtml(headline)}</div>
        </div>
        ${photoMarkup}
      </div>
      <div style="display:flex;gap:3px;margin:2px 0;">
        <span style="flex:1;height:6px;border-radius:3px;background:${tpl.primary}22;border:1px solid ${tpl.secondary}66;"></span>
        <span style="flex:1;height:6px;border-radius:3px;background:${tpl.primary}22;border:1px solid ${tpl.secondary}66;"></span>
        <span style="flex:1;height:6px;border-radius:3px;background:${tpl.primary}22;border:1px solid ${tpl.secondary}66;"></span>
      </div>
      <div class="mini-grid-2col">
        <div class="mini-col-card">
          <div class="mini-sec-head" style="color:${tpl.primary};border-color:${tpl.secondary}">${motifSvg}<span>Career</span></div>
          <div class="mini-kv"><i style="background:${tpl.muted}55"></i><b style="background:${tpl.text}88"></b></div>
        </div>
        <div class="mini-col-card">
          <div class="mini-sec-head" style="color:${tpl.primary};border-color:${tpl.secondary}">${motifSvg}<span>Family</span></div>
          <div class="mini-kv"><i style="background:${tpl.muted}55"></i><b style="background:${tpl.text}88"></b></div>
        </div>
      </div>`;
  } else {
    // classic, editorial-banner, header-split-card, timeline-spine
    const splitHeaderStyle = tpl.layout === 'header-split-card'
      ? `background:${tpl.primary}12;border:1px solid ${tpl.secondary}66;border-radius:4px;padding:4px;`
      : '';
    bodyMarkup = `
      <div class="mini-top-row" style="${splitHeaderStyle}">
        <div class="mini-title-block">
          <div class="mini-name" style="color:${isBanner ? headerColor : tpl.primary}">${escapeMiniHtml(candidateName)}</div>
          <div class="mini-sub" style="color:${isBanner ? headerColor : tpl.muted};opacity:0.85">${escapeMiniHtml(headline)}</div>
        </div>
        ${photoMarkup}
      </div>
      <div class="mini-classic-rows ${tpl.layout === 'timeline-spine' ? 'with-spine' : ''}" style="--spine-color:${tpl.secondary}">
        <div class="mini-sec-head" style="color:${tpl.primary};border-color:${tpl.secondary}">${motifSvg}<span>Personal Details</span></div>
        <div class="mini-kv"><i style="background:${tpl.muted}55"></i><b style="background:${tpl.text}88"></b></div>
        <div class="mini-kv"><i style="background:${tpl.muted}55"></i><b style="background:${tpl.text}77"></b></div>
        <div class="mini-sec-head" style="color:${tpl.primary};border-color:${tpl.secondary}">${motifSvg}<span>Family Background</span></div>
        <div class="mini-kv"><i style="background:${tpl.muted}55"></i><b style="background:${tpl.text}88"></b></div>
      </div>`;
  }

  return `
    <div class="mini-a4-canvas tpl-live-mini-sheet layout-${tpl.layout}" style="background:${tpl.bg};color:${tpl.text};--mini-primary:${tpl.primary};--mini-secondary:${tpl.secondary}">
      <div class="mini-frame-layer">${frameSvg}</div>
      <div class="mini-content-layer">
        <div class="mini-invocation-bar" style="background:${headerBg};color:${headerColor}">
          <span class="mini-emblem" style="color:${isBanner ? headerColor : tpl.primary}">${emblemSvgMarkup}</span>
          <span class="mini-inv-text">${escapeMiniHtml(invocation)}</span>
        </div>
        ${bodyMarkup}
      </div>
    </div>
  `;
}

function escapeMiniHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
