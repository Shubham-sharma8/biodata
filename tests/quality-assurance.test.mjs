import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  TEMPLATES,
  TEMPLATE_CATEGORIES,
  getTemplateById
} from '../src/data/templates.js';
import {
  CANVA_DISCOVERED_CATALOG,
  getCanvaCatalogStats
} from '../src/data/canvaCatalog.js';
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_LABELS,
  COMMUNITY_PRESETS,
  DOB_MONTHS,
  parseDobParts,
  formatDobAndCalculateAge,
  createInitialBiodataState
} from '../src/data/presets.js';
import {
  SUPPORTED_LAYOUTS,
  SUPPORTED_HEADER_STYLES,
  SUPPORTED_FONT_PAIRS,
  SUPPORTED_BORDER_STYLES,
  validateTemplateSchema,
  validateTemplateCollection,
  filterAndSearchTemplates,
  renderLiveTemplateMiniPreview
} from '../src/templates/adapter.js';
import {
  CANVA_STICKERS,
  PAPER_TEXTURES,
  WATERMARK_MODES,
  KUNDALI_STYLES,
  KUNDALI_PRESETS
} from '../src/data/canvaElements.js';
import { buildBiodataSheetMarkup } from '../src/templates/renderer.js';
import { renderTemplateFrameSvg } from '../src/utils/svgBorders.js';
import { computePdfExportMetadata, generateFormattedTextSummary } from '../src/utils/exporters.js';
import {
  saveBiodataToCookies,
  loadBiodataFromCookies,
  savePreviousSnapshotToCookies,
  loadPreviousSnapshotFromCookies,
  getSavedCookieSummary,
  clearBiodataCookies
} from '../src/utils/cookies.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// 1. Unique Template IDs & 240+ Target
test('QA-01: Unique template IDs and 242 genuinely differentiated native templates', () => {
  assert.ok(TEMPLATES.length >= 240, `Expected >= 240 templates, found ${TEMPLATES.length}`);
  assert.equal(TEMPLATES.length, 242, 'Expected_exactly 242 templates in registry');

  const ids = TEMPLATES.map((t) => t.id);
  const uniqueIds = new Set(ids);
  assert.equal(uniqueIds.size, TEMPLATES.length, 'Every template must have a globally unique ID');

  const collectionCheck = validateTemplateCollection(TEMPLATES);
  assert.equal(collectionCheck.valid, true, `Collection validation errors: ${collectionCheck.errors.join('; ')}`);
  assert.equal(collectionCheck.uniqueSignatures, TEMPLATES.length, 'Every template must have a unique visual/structural signature');
});

// 2. Valid Template Metadata & Canva Catalog Provenance
test('QA-02: Valid template metadata, categories, styles, colors, and Canva provenance', () => {
  for (const tpl of TEMPLATES) {
    const res = validateTemplateSchema(tpl);
    assert.equal(res.valid, true, `Template ${tpl.id} failed schema check: ${res.errors.join(', ')}`);
    assert.ok(SUPPORTED_LAYOUTS.includes(tpl.layout), `Unsupported layout ${tpl.layout}`);
    assert.ok(SUPPORTED_HEADER_STYLES.includes(tpl.headerStyle), `Unsupported headerStyle ${tpl.headerStyle}`);
    assert.ok(SUPPORTED_FONT_PAIRS.includes(tpl.fontPair), `Unsupported fontPair ${tpl.fontPair}`);
    assert.ok(Array.isArray(tpl.styleTags) && tpl.styleTags.length > 0, `Missing styleTags on ${tpl.id}`);
    assert.ok(Array.isArray(tpl.keywords) && tpl.keywords.length >= 3, `Missing keywords on ${tpl.id}`);
  }

  const canvaStats = getCanvaCatalogStats();
  assert.equal(canvaStats.total, 52, 'Expected 52 deduplicated Canva reference designs');
  assert.equal(canvaStats.pathA, 6, 'Expected 6 Path A authorized direct exports');
  assert.equal(canvaStats.pathB, 26, 'Expected 26 Path B editable reconstructions');
  assert.equal(canvaStats.pathC, 20, 'Expected 20 Path C external Canva references');
});

// 3. Valid Thumbnail Paths & Live Renderer Thumbnails
test('QA-03: Valid Path A asset paths on disk and live miniature thumbnail rendering for all 242 templates', () => {
  for (const item of CANVA_DISCOVERED_CATALOG) {
    if (item.mappingPath === 'path_a_direct_import') {
      assert.ok(item.importedAssetPath, `Path A item ${item.canvaDesignId} must specify importedAssetPath`);
      const fullPath = path.join(PROJECT_ROOT, 'public', item.importedAssetPath.replace(/^\//, ''));
      assert.ok(fs.existsSync(fullPath), `Missing Path A exported file on disk: ${fullPath}`);
      const stat = fs.statSync(fullPath);
      assert.ok(stat.size > 10000, `Path A PNG asset ${fullPath} should be a non-empty PNG (>10KB)`);
    }
  }

  for (const tpl of TEMPLATES) {
    if (tpl.canvaAssetPath) {
      const fullPath = path.join(PROJECT_ROOT, 'public', tpl.canvaAssetPath.replace(/^\//, ''));
      assert.ok(fs.existsSync(fullPath), `Missing template canvaAssetPath on disk: ${fullPath}`);
    }
    const thumbHtml = renderLiveTemplateMiniPreview(tpl, {
      candidateName: 'Ananya Sharma',
      docTitle: 'MARRIAGE BIODATA'
    });
    assert.ok(thumbHtml.includes('tpl-live-mini-sheet'), `Mini preview missing root class for ${tpl.id}`);
    assert.ok(thumbHtml.includes('<svg'), `Mini preview missing vector SVG frame for ${tpl.id}`);
  }
});

// 4. Supported Page Dimensions
test('QA-04: Supported A4 page dimensions (210mm x 297mm / 794px x 1123px) across 1-page and 2-page templates', () => {
  for (const tpl of TEMPLATES) {
    assert.ok(tpl.pageDimensions, `Missing pageDimensions on ${tpl.id}`);
    assert.equal(tpl.pageDimensions.format, 'A4');
    assert.equal(tpl.pageDimensions.widthMm, 210);
    assert.equal(tpl.pageDimensions.heightMm, 297);
    assert.equal(tpl.pageDimensions.widthPx, 794);
    assert.equal(tpl.pageDimensions.heightPx, 1123);
    assert.ok(tpl.pageCount === 1 || tpl.pageCount === 2, `Invalid pageCount ${tpl.pageCount} on ${tpl.id}`);
  }
});

// 5. Correct Template Rendering Across All 242 Templates & All 14 Layouts
test('QA-05: Correct template rendering across all 242 templates and all 14 layout engines', () => {
  const state = createInitialBiodataState('sample_bride');
  const layoutsSeen = new Set();

  for (const tpl of TEMPLATES) {
    layoutsSeen.add(tpl.layout);
    const res = buildBiodataSheetMarkup(state, tpl);
    assert.ok(res.className.includes(`layout-${tpl.layout}`), `Missing layout class on ${tpl.id}`);
    assert.ok(res.className.includes(`font-${tpl.fontPair}`), `Missing font class on ${tpl.id}`);
    assert.ok(res.className.includes(`header-style-${tpl.headerStyle}`), `Missing header-style class on ${tpl.id}`);
    assert.ok(res.innerHTML.includes('Ananya Sharma'), `Candidate name missing in rendered output for ${tpl.id}`);
    assert.ok(res.innerHTML.includes('sheet-frame-layer'), `SVG frame layer missing for ${tpl.id}`);
    if (tpl.pageCount === 2) {
      assert.equal(res.pageCount, 2);
      assert.ok(res.innerHTML.includes('biodata-page-1') && res.innerHTML.includes('biodata-page-2'));
    } else {
      assert.equal(res.pageCount, 1);
    }
  }

  assert.equal(layoutsSeen.size, 14, `Expected all 14 layouts to be exercised, saw ${layoutsSeen.size}`);
});

// 6. Missing-Field Handling
test('QA-06: Graceful missing-field, empty-value, and hidden-section handling', () => {
  const state = createInitialBiodataState('sample_bride');
  // Hide horoscope section and clear several fields
  const horoSec = state.sections.find((s) => s.id === 'horoscope');
  if (horoSec) horoSec.visible = false;
  state.sections[0].fields[1].value = '   '; // blank whitespace value
  state.sections[0].fields[2].visible = false; // explicitly hidden field

  for (const layout of SUPPORTED_LAYOUTS) {
    const tpl = TEMPLATES.find((t) => t.layout === layout);
    const res = buildBiodataSheetMarkup(state, tpl);
    assert.ok(!res.innerHTML.includes('Horoscope / Kundli Details'), `Hidden section should not render in ${layout}`);
    assert.ok(!res.innerHTML.includes('undefined') && !res.innerHTML.includes('null'), `No undefined/null text in ${layout}`);
  }
});

// 7. Long Text and Overflow Handling
test('QA-07: Long text and high-field-density handling with Smart Single-Page Auto-Fit & word-break rules', () => {
  const state = createInitialBiodataState('sample_groom');
  const longParagraph =
    'Senior Staff Principal Distributed Systems Architect leading global cloud infrastructure across Mumbai, Bengaluru, London, and San Francisco with 14+ international patents and publications.';
  state.sections[0].fields[0].value = 'Dr. Siddharth Vishwanath Pratap Singhania-Chauhan';
  state.sections[1].fields[0].value = longParagraph;

  // Add 10 extra custom fields to test dense content
  for (let i = 1; i <= 10; i++) {
    state.sections[2].fields.push({
      id: `extra_${i}`,
      key: `extra_${i}`,
      label: `Extended Family Branch ${i}`,
      value: `Paternal & Maternal Uncle Family Branch ${i} residing in Pune, Maharashtra`,
      visible: true
    });
  }

  const singlePageTpl = getTemplateById('royal-sindoor-gold');
  const twoPageTpl = getTemplateById('twopage-royal-rajwada-portfolio');

  const res1 = buildBiodataSheetMarkup(state, singlePageTpl);
  assert.ok(res1.innerHTML.includes(longParagraph));

  const res2 = buildBiodataSheetMarkup(state, twoPageTpl);
  assert.equal(res2.pageCount, 2);
  assert.ok(res2.innerHTML.includes('Page 1 of 2') && res2.innerHTML.includes('Page 2 of 2'));

  const cssContent = fs.readFileSync(path.join(PROJECT_ROOT, 'src/styles/main.css'), 'utf8');
  assert.ok(cssContent.includes('word-break: break-word'), 'CSS must enforce word-break: break-word on field values');
});

// 8. Photo Absence and Photo Loading Failures
test('QA-08: Photo absence (no-photo templates & unchecked toggle) and photo loading failure fallback', () => {
  const stateNoPhoto = createInitialBiodataState('sample_bride');
  stateNoPhoto.photo.show = false;

  const resHidden = buildBiodataSheetMarkup(stateNoPhoto, getTemplateById('royal-sindoor-gold'));
  assert.ok(!resHidden.innerHTML.includes('sheet-photo-frame'), 'Photo frame must not render when photo.show is false');

  const stateWithPhoto = createInitialBiodataState('sample_bride');
  stateWithPhoto.photo.show = true;
  const noPhotoNativeTpl = getTemplateById('nophoto-swiss-architectural-grid');
  const resNoPhotoTpl = buildBiodataSheetMarkup(stateWithPhoto, noPhotoNativeTpl);
  assert.ok(
    !resNoPhotoTpl.innerHTML.includes('sheet-photo-frame'),
    'No-photo native template must not render photo frame even when state has photo'
  );

  const brokenPhotoState = createInitialBiodataState('sample_bride');
  brokenPhotoState.photo.show = true;
  brokenPhotoState.photo.dataUrl = 'https://invalid.example.test/non-existent-portrait.jpg';
  const resBroken = buildBiodataSheetMarkup(brokenPhotoState, getTemplateById('royal-sindoor-gold'));
  assert.ok(
    resBroken.innerHTML.includes('onerror='),
    'Rendered photo <img> must include an onerror fallback handler so broken image URLs never leave broken icons'
  );
});

// 9. Hindi and Unicode Content
test('QA-09: Hindi (Devanagari) and multi-script Unicode content rendering across templates', () => {
  const state = createInitialBiodataState('sample_bride');
  const hiDict = LANGUAGE_LABELS.hi;
  state.language = 'hi';
  state.docTitle = hiDict.docTitle; // विवाह बायोडाटा
  state.invocationLines = ['|| श्री गणेशाय नमः ||'];
  state.sections[0].title = hiDict.sections.personal;
  state.sections[0].fields[0].label = hiDict.fields.full_name;
  state.sections[0].fields[0].value = 'अनन्या राजेश शर्मा (पुणे, महाराष्ट्र)';

  const devanagariTpl = TEMPLATES.find((t) => t.fontPair === 'devanagari') || getTemplateById('nophoto-traditional-sanskriti-patrika');
  const res = buildBiodataSheetMarkup(state, devanagariTpl);

  assert.ok(res.innerHTML.includes('विवाह बायोडाटा'), 'Hindi document title must render intact');
  assert.ok(res.innerHTML.includes('|| श्री गणेशाय नमः ||'), 'Hindi invocation must render intact');
  assert.ok(res.innerHTML.includes('अनन्या राजेश शर्मा (पुणे, महाराष्ट्र)'), 'Hindi candidate value must render intact');
  assert.ok(res.className.includes('font-devanagari'), 'Devanagari font pairing class must be applied');
});

// 10. Responsive Gallery & Mobile Live Preview Layouts
test('QA-10: Responsive gallery CSS grid, mobile thumb-zone navigation & multi-device breakpoints exist and are valid', () => {
  const css = fs.readFileSync(path.join(PROJECT_ROOT, 'src/styles/main.css'), 'utf8');
  assert.ok(css.includes('.templates-gallery-grid'), 'Gallery grid class must exist');
  assert.ok(css.includes('repeat(auto-fill, minmax(240px, 1fr))'), 'Responsive auto-fill portrait A4 grid must be configured');
  assert.ok(css.includes('@media (max-width: 1180px)'), 'Compact desktop responsive breakpoint must exist');
  assert.ok(css.includes('@media (max-width: 920px)'), 'Tablet/mobile stack responsive breakpoint must exist');
  assert.ok(css.includes('@media (max-width: 680px)'), 'Mobile responsive breakpoint must exist');
  assert.ok(css.includes('@media (max-width: 480px)'), 'Small phone responsive breakpoint must exist');
  assert.ok(css.includes('.mobile-bottom-nav'), 'Sticky mobile bottom dock CSS must exist');
});

// 11. PDF Page Counts and Page Dimensions
test('QA-11: PDF export page count and exact A4 (210mm x 297mm) dimensions for 1-page and 2-page templates', () => {
  const state = createInitialBiodataState('sample_bride');
  const tpl1 = getTemplateById('royal-sindoor-gold');
  const tpl2 = getTemplateById('twopage-royal-rajwada-portfolio');

  const meta1 = computePdfExportMetadata(state, tpl1);
  assert.equal(meta1.format, 'a4');
  assert.equal(meta1.orientation, 'portrait');
  assert.equal(meta1.widthMm, 210);
  assert.equal(meta1.heightMm, 297);
  assert.equal(meta1.expectedPageCount, 1);

  const meta2 = computePdfExportMetadata(state, tpl2);
  assert.equal(meta2.format, 'a4');
  assert.equal(meta2.widthMm, 210);
  assert.equal(meta2.heightMm, 297);
  assert.equal(meta2.expectedPageCount, 2);
});

// 12. Existing Biodata Data Preservation on Template & Language Switching
test('QA-12: Preserves all user-entered field values across template switches and 9-language label translations', () => {
  const state = createInitialBiodataState('sample_bride');
  const customValue = 'Custom User Value Preserved 100% — +91 99999 88888';
  state.sections[0].fields[0].value = customValue;

  // Switch across all 9 languages
  for (const lang of SUPPORTED_LANGUAGES) {
    const dict = LANGUAGE_LABELS[lang.code];
    assert.ok(dict, `Missing dictionary for ${lang.code}`);
    for (const sec of state.sections) {
      if (dict.sections?.[sec.id]) sec.title = dict.sections[sec.id];
      for (const f of sec.fields) {
        if (dict.fields?.[f.key]) f.label = dict.fields[f.key];
      }
    }
    assert.equal(
      state.sections[0].fields[0].value,
      customValue,
      `User value was corrupted when switching to language ${lang.code}`
    );
  }

  // Render across 15 different templates and confirm custom value is preserved
  for (const tpl of TEMPLATES.slice(0, 15)) {
    const rendered = buildBiodataSheetMarkup(state, tpl);
    assert.ok(rendered.innerHTML.includes(customValue), `Custom value lost when rendering template ${tpl.id}`);
  }
});

// 13. Search and Multi-Facet Filter Behavior
test('QA-13: Gallery search and multi-facet filtering (category, style, color, pageCount, photo, language, recent, favorites)', () => {
  // Category filter
  const islamic = filterAndSearchTemplates(TEMPLATES, { category: 'islamic' });
  assert.equal(islamic.length, 22, 'Expected 22 Islamic/Nikah templates');

  // Two-page filter
  const twoPage = filterAndSearchTemplates(TEMPLATES, { pageCount: '2' });
  assert.equal(twoPage.length, 21, 'Expected 21 two-page templates');

  // No-photo filter
  const noPhoto = filterAndSearchTemplates(TEMPLATES, { photoSupport: 'no-photo' });
  assert.equal(noPhoto.length, 17, 'Expected 17 native no-photo templates');

  // Style filter
  const minimalist = filterAndSearchTemplates(TEMPLATES, { style: 'minimalist' });
  assert.ok(minimalist.length >= 20, 'Expected at least 20 minimalist templates');

  // Color family filter
  const darkLuxury = filterAndSearchTemplates(TEMPLATES, { colorFamily: 'dark-luxury' });
  assert.equal(darkLuxury.length, 26, 'Expected 26 dark-luxury templates');

  // Keyword search
  const paithani = filterAndSearchTemplates(TEMPLATES, { query: 'Paithani' });
  assert.ok(paithani.some((t) => t.id === 'regional-marathi-paithani-peacock'), 'Keyword search for Paithani must match regional-marathi-paithani-peacock');

  // Favorites filter
  const favSet = new Set(['royal-sindoor-gold', 'mayur-peacock-teal']);
  const favResults = filterAndSearchTemplates(TEMPLATES, { favoritesOnly: true }, favSet);
  assert.equal(favResults.length, 2, 'Favorites filter must return exact favorited templates');

  // Recently added filter
  const recentResults = filterAndSearchTemplates(TEMPLATES, { recentlyAddedOnly: true });
  assert.ok(recentResults.length >= 150, 'Recently added filter must return newly added templates');
});

// 14 & 15. HTML Structure, Module Integrity & Community Presets Integrity
test('QA-14 & QA-15: HTML DOM IDs, community presets, DOB/Age separation, and module exports integrity', () => {
  const indexHtml = fs.readFileSync(path.join(PROJECT_ROOT, 'index.html'), 'utf8');
  const requiredDomIds = [
    'biodata-a4-sheet',
    'gallery-search-input',
    'template-category-filters',
    'template-style-filters',
    'template-color-filters',
    'template-page-filters',
    'template-photo-filters',
    'gallery-language-filter',
    'templates-gallery-grid',
    'template-preview-modal',
    'template-compare-modal',
    'compare-floating-dock',
    'btn-dock-open-compare',
    'tab-canva-studio',
    'sticker-picker-grid',
    'kundali-houses-grid',
    'btn-canvas-undo',
    'btn-canvas-redo',
    'btn-toggle-inline-edit'
  ];

  for (const id of requiredDomIds) {
    assert.ok(indexHtml.includes(`id="${id}"`), `index.html missing required element id="${id}"`);
  }

  // Ensure bulky Canva catalog and latency status bar are removed from live website
  assert.ok(!indexHtml.includes('id="canva-catalog-section"'), 'index.html must not include Canva MCP catalog section');
  assert.ok(!indexHtml.includes('class="live-status-bar"'), 'index.html must not include bulky live-status-bar');

  // Verify DOB and Age fields are strictly separate in sample presets
  for (const mode of ['sample_bride', 'sample_groom']) {
    const sampleState = createInitialBiodataState(mode);
    const personalSec = sampleState.sections.find((s) => s.id === 'personal');
    const dobField = personalSec.fields.find((f) => f.key === 'dob');
    const ageField = personalSec.fields.find((f) => f.key === 'age');
    assert.ok(dobField && !dobField.value.includes('Years'), `${mode} dob field must only contain date`);
    assert.ok(ageField && /^\d+\s+Years$/i.test(ageField.value), `${mode} age field must strictly contain '<N> Years'`);
  }

  for (const preset of COMMUNITY_PRESETS) {
    const state = preset.apply();
    assert.ok(state && Array.isArray(state.sections) && state.sections.length >= 3, `Preset ${preset.id} returned invalid state`);
    const tpl = getTemplateById(state.templateId);
    assert.equal(tpl.id, state.templateId, `Preset ${preset.id} references unknown templateId ${state.templateId}`);
  }
});

// 16. Studio Interactive Features, 14 Layout Engines & Attribution Footer
test('QA-16: Studio features, 14 layout engines photo placement, and Made via biodata.cogify.me attribution footer', () => {
  assert.equal(CANVA_STICKERS.length, 24, 'Expected 24 vector stickers in CANVA_STICKERS');
  assert.equal(PAPER_TEXTURES.length, 9, 'Expected 9 paper textures');
  assert.equal(WATERMARK_MODES.length, 5, 'Expected 5 watermark modes');
  assert.equal(KUNDALI_STYLES.length, 3, 'Expected 3 Vedic Kundali styles');
  assert.equal(KUNDALI_PRESETS.length, 4, 'Expected 4 Kundali astrological presets');

  const state = createInitialBiodataState('sample_bride');
  state.canvasStickers = [
    {
      id: 'stk_test_1',
      stickerId: 'sticker-ganesha-gold',
      x: 82,
      y: 12,
      scale: 1.15,
      rotation: -10,
      opacity: 0.95
    },
    {
      id: 'stk_test_2',
      kind: 'custom-badge',
      customText: 'Shubh Vivah 2026',
      badgeStyle: 'ribbon',
      x: 50,
      y: 92,
      scale: 1,
      rotation: 0,
      opacity: 1
    }
  ];

  state.kundali.show = true;
  state.kundali.style = 'north-indian';
  state.kundali.title = 'Lagna Kundali (Vrishabha)';
  state.kundali.subtitle = 'Rohini Nakshatra • Charan 2';

  state.formatting.paperTexture = 'silk-weave';
  state.formatting.watermarkMode = 'monogram';
  state.formatting.watermarkText = 'AS';
  state.formatting.watermarkOpacity = 0.08;
  state.formatting.customLayout = 'arched-palace-darbar';
  state.formatting.customBorderStyle = 'arch-mughal-darbar';

  state.photo.brightness = 108;
  state.photo.contrast = 105;
  state.photo.warmth = 18;

  const rendered = buildBiodataSheetMarkup(state, getTemplateById('royal-sindoor-gold'));
  assert.ok(rendered.className.includes('layout-arched-palace-darbar'), 'Layout override must apply');
  assert.ok(rendered.innerHTML.includes('sheet-stickers-layer'), 'Stickers layer must render');
  assert.ok(rendered.innerHTML.includes('stk_test_1'), 'Vector sticker must render with id');
  assert.ok(rendered.innerHTML.includes('Shubh Vivah 2026'), 'Custom text badge must render text');
  assert.ok(rendered.innerHTML.includes('sheet-kundali-widget'), 'Vedic Kundali chart widget must render');
  assert.ok(rendered.innerHTML.includes('Lagna Kundali (Vrishabha)'), 'Kundali title must render');
  assert.ok(rendered.innerHTML.includes('sheet-paper-texture-layer'), 'Paper texture layer must render');
  assert.ok(rendered.innerHTML.includes('sheet-watermark-layer'), 'Center watermark layer must render');
  assert.ok(rendered.innerHTML.includes('Made via biodata.cogify.me'), 'Generated biodata must include Made via biodata.cogify.me footer');
  assert.ok(rendered.innerHTML.includes('data-inline-type="doc-title"'), 'Inline edit attribute for doc-title must exist');
  assert.ok(rendered.innerHTML.includes('data-inline-type="section-title"'), 'Inline edit attribute for section-title must exist');
  assert.ok(rendered.innerHTML.includes('data-inline-type="field-value"'), 'Inline edit attribute for field-value must exist');

  // Verify all 14 layout engines render photo container properly
  const all14Layouts = [
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
    'kundali-horoscope-focus',
    'arched-palace-darbar',
    'magazine-cover-spread',
    'modern-infographic-resume'
  ];
  for (const layoutKey of all14Layouts) {
    state.formatting.customLayout = layoutKey;
    const res = buildBiodataSheetMarkup(state, getTemplateById('royal-sindoor-gold'));
    assert.ok(res.className.includes(`layout-${layoutKey}`), `Layout ${layoutKey} class missing`);
    assert.ok(res.innerHTML.includes('sheet-photo-frame'), `Layout ${layoutKey} must render sheet-photo-frame`);
    assert.ok(res.innerHTML.includes('Made via biodata.cogify.me'), `Layout ${layoutKey} must include attribution footer`);
  }
});

// 17. Browser Cookie Persistence & Previous Saved Data Recovery
test('QA-17: Multi-cookie chunked storage saves, restores, backs up previous snapshots, and clears biodata accurately', () => {
  // Mock browser document.cookie and localStorage for Node test environment
  const cookieJar = new Map();
  globalThis.document = {
    get cookie() {
      return Array.from(cookieJar.entries())
        .map(([k, v]) => `${k}=${v}`)
        .join('; ');
    },
    set cookie(str) {
      const [pair, ...attrs] = String(str).split(';').map((s) => s.trim());
      const eqIdx = pair.indexOf('=');
      if (eqIdx === -1) return;
      const key = pair.slice(0, eqIdx);
      const val = pair.slice(eqIdx + 1);
      const isDelete = attrs.some((a) => a.toLowerCase().startsWith('max-age=0'));
      if (isDelete) {
        cookieJar.delete(key);
      } else {
        cookieJar.set(key, val);
      }
    }
  };
  const storageMap = new Map();
  globalThis.localStorage = {
    getItem: (k) => (storageMap.has(k) ? storageMap.get(k) : null),
    setItem: (k, v) => storageMap.set(k, String(v)),
    removeItem: (k) => storageMap.delete(k)
  };

  const state1 = createInitialBiodataState('sample_bride');
  state1.sections[0].fields[0].value = 'Dr. Kavya Iyer (Cookie Test 1)';
  state1.templateId = 'mayur-peacock-teal';

  const savedOk = saveBiodataToCookies(state1);
  assert.equal(savedOk, true, 'saveBiodataToCookies must succeed');

  const summary1 = getSavedCookieSummary();
  assert.equal(summary1.hasPrimaryCookie, true, 'Active cookie must be detected');
  assert.equal(summary1.primary.candidateName, 'Dr. Kavya Iyer (Cookie Test 1)');

  const restored1 = loadBiodataFromCookies();
  assert.ok(restored1, 'loadBiodataFromCookies must return restored state');
  assert.equal(restored1.sections[0].fields[0].value, 'Dr. Kavya Iyer (Cookie Test 1)');
  assert.equal(restored1.templateId, 'mayur-peacock-teal');

  // Save previous backup snapshot before switching to Groom preset
  const backupOk = savePreviousSnapshotToCookies(state1);
  assert.equal(backupOk, true, 'savePreviousSnapshotToCookies must succeed');

  const state2 = createInitialBiodataState('sample_groom');
  state2.sections[0].fields[0].value = 'Rohan Vikramaditya Deshmukh';
  saveBiodataToCookies(state2);

  const summary2 = getSavedCookieSummary();
  assert.equal(summary2.hasPrimaryCookie, true);
  assert.equal(summary2.hasPreviousCookie, true, 'Previous backup snapshot cookie must exist');
  assert.equal(summary2.previous.candidateName, 'Dr. Kavya Iyer (Cookie Test 1)');

  const restoredPrev = loadPreviousSnapshotFromCookies();
  assert.ok(restoredPrev, 'loadPreviousSnapshotFromCookies must return previous snapshot');
  assert.equal(restoredPrev.sections[0].fields[0].value, 'Dr. Kavya Iyer (Cookie Test 1)');

  clearBiodataCookies();
  const summaryAfterClear = getSavedCookieSummary();
  assert.equal(summaryAfterClear.hasPrimaryCookie, false, 'Cookies must be cleared after clearBiodataCookies');
  assert.equal(summaryAfterClear.hasPreviousCookie, false, 'Previous snapshot cookies must be cleared');
});

// 18. Cloudflare Worker Production Config, Strict A4 Geometry, Silent Auto-Cookies & Clean Footer
test('QA-18: Cloudflare Worker config, strict A4 portrait geometry, automatic background cookies (no manual cookie buttons), and clean cogify.me footer exist', () => {
  const indexHtml = fs.readFileSync(path.join(PROJECT_ROOT, 'index.html'), 'utf8');
  const mainCss = fs.readFileSync(path.join(PROJECT_ROOT, 'src/styles/main.css'), 'utf8');
  const mainJs = fs.readFileSync(path.join(PROJECT_ROOT, 'src/main.js'), 'utf8');

  // Clean cogify.me footer without 4-tab product cards
  assert.ok(indexHtml.includes('id="about-cogify"'), 'index.html must include #about-cogify footer');
  assert.ok(indexHtml.includes('https://cogify.me'), 'index.html must reference https://cogify.me');
  assert.ok(!indexHtml.includes('cogify-products-grid'), 'index.html must NOT include the 4-card cogify-products-grid');

  // Automatic background cookies without manual cookie UI buttons or mobile mode clutter
  assert.ok(!indexHtml.includes('id="cookie-status-bar"'), 'index.html must NOT include manual #cookie-status-bar');
  assert.ok(!indexHtml.includes('id="btn-restore-cookie-data"'), 'index.html must NOT include manual #btn-restore-cookie-data');
  assert.ok(!indexHtml.includes('id="btn-save-cookie-now"'), 'index.html must NOT include manual #btn-save-cookie-now');
  assert.ok(!indexHtml.includes('id="mobile-workspace-bar"'), 'index.html must NOT include #mobile-workspace-bar');
  assert.ok(indexHtml.includes('id="mobile-bottom-nav"'), 'index.html must include #mobile-bottom-nav');

  // Strict A4 portrait geometry & proportional scaling for preview and side-by-side compare
  assert.ok(mainCss.includes('width: 794px !important;'), 'main.css must lock A4 sheets to 794px width');
  assert.ok(mainCss.includes('aspect-ratio: 210 / 297 !important;'), 'main.css must lock mini A4 previews to 210/297 aspect ratio');
  assert.ok(mainJs.includes('compare-scale-holder'), 'main.js must wrap compared A4 sheets in .compare-scale-holder');
  assert.ok(mainJs.includes('scaleModalA4Sheets'), 'main.js must proportionally scale modal and compare A4 sheets');

  // Verify Cloudflare Worker & Vite build files exist
  assert.ok(fs.existsSync(path.join(PROJECT_ROOT, 'wrangler.jsonc')), 'wrangler.jsonc must exist for Cloudflare Worker');
  assert.ok(fs.existsSync(path.join(PROJECT_ROOT, 'vite.config.js')), 'vite.config.js must exist');
  assert.ok(fs.existsSync(path.join(PROJECT_ROOT, 'public/_headers')), 'public/_headers must exist');
});

// 19. DOB Day/Month/Year Picker + Years-Only Age, Restored Classic Sections, Zero Canva Raster Watermarks, 794x1123 SVG Borders & WhatsApp Summary
test('QA-19: DOB Day/Month/Year picker, years-only age calculation, restored classic sections, zero Canva background watermarks, 794x1123 SVG frames, and WhatsApp message', () => {
  assert.equal(DOB_MONTHS.length, 12, 'Expected 12 months in DOB_MONTHS');

  const parsed1 = parseDobParts('22 August 1996');
  assert.deepEqual(parsed1, { day: '22', month: 'Aug', year: '1996' });

  const parsed2 = parseDobParts('1998-03-14');
  assert.deepEqual(parsed2, { day: '14', month: 'Mar', year: '1998' });

  const calc = formatDobAndCalculateAge('22 August 1996');
  assert.ok(calc, 'formatDobAndCalculateAge must parse human-readable DOB');
  assert.equal(calc.formattedDob, '22 Aug 1996');
  assert.ok(/^\d+\s+Years$/.test(calc.ageText), `Age must be years only ('<N> Years'), got: ${calc.ageText}`);
  assert.ok(!calc.ageText.includes('Month'), 'Age must never include months');

  // Verify Rohan Vikramaditya Verma (hindu_groom preset) has all 6 classic sections and all 12 personal fields
  const groomPreset = COMMUNITY_PRESETS.find((p) => p.id === 'hindu_groom');
  const groomState = groomPreset.apply();
  const expectedSectionIds = ['personal', 'horoscope', 'education', 'family', 'expectations', 'contact'];
  assert.deepEqual(
    groomState.sections.map((s) => s.id),
    expectedSectionIds,
    'hindu_groom must have all 6 classic sections in order'
  );
  const personalKeys = groomState.sections[0].fields.map((f) => f.key);
  assert.ok(personalKeys.includes('mother_tongue'), 'hindu_groom Personal Details must include mother_tongue');
  assert.ok(personalKeys.includes('hobbies'), 'hindu_groom Personal Details must include hobbies');
  assert.equal(groomState.sections[0].fields.length, 12, 'hindu_groom Personal Details must have all 12 classic fields');

  // Verify all 8 community presets retain all 6 classic sections
  for (const preset of COMMUNITY_PRESETS) {
    const pState = preset.apply();
    assert.deepEqual(
      pState.sections.map((s) => s.id),
      expectedSectionIds,
      `Preset ${preset.id} must include all 6 classic sections`
    );
  }

  // Verify zero templates inject .sheet-canva-backdrop or .mini-canva-bg-watermark
  for (const tpl of TEMPLATES) {
    const rendered = buildBiodataSheetMarkup(groomState, tpl);
    assert.ok(!rendered.innerHTML.includes('sheet-canva-backdrop'), `Template ${tpl.id} must not inject raster Canva backdrop`);
    const miniHtml = renderLiveTemplateMiniPreview(tpl, { candidateName: 'Rohan Verma', docTitle: 'MARRIAGE BIODATA' });
    assert.ok(!miniHtml.includes('mini-canva-bg-watermark'), `Template ${tpl.id} mini card must not inject Canva raster watermark`);
  }

  // Verify all 31 active SVG border frames have explicit width="794" height="1123" for 1:1 html2canvas PDF/PNG rendering
  for (const style of SUPPORTED_BORDER_STYLES) {
    if (style === 'none') continue;
    const svg = renderTemplateFrameSvg(style, '#8B1E2F', '#C89B3C');
    assert.ok(svg.includes('width="794"') && svg.includes('height="1123"'), `SVG border style ${style} must specify width="794" height="1123"`);
  }

  // Verify WhatsApp formatted text summary
  const waSummary = generateFormattedTextSummary(groomState);
  assert.ok(waSummary.includes('Rohan Vikramaditya Verma'), 'WhatsApp summary must include candidate full name');
  assert.ok(waSummary.includes('*Personal Details*'), 'WhatsApp summary must include bold Personal Details heading');
  assert.ok(waSummary.includes('*Horoscope / Astro Details*'), 'WhatsApp summary must include Horoscope heading');
  assert.ok(waSummary.includes('*Education & Career*'), 'WhatsApp summary must include Education & Career heading');
  assert.ok(waSummary.includes('*Family Details*'), 'WhatsApp summary must include Family Details heading');
  assert.ok(waSummary.includes('*Contact Details*'), 'WhatsApp summary must include Contact Details heading');
  assert.ok(waSummary.includes('Made via https://biodata.cogify.me'), 'WhatsApp summary must include attribution link');
});




