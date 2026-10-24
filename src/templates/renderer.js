/**
 * Phase 4, Phase 7 & Canva Studio — Universal Biodata Sheet Renderer
 *
 * Renders any of the 242 normalized templates with real user biodata across:
 * - All 14 structural layouts (`classic`, `two-column`, `sidebar-left`, `sidebar-right`,
 *   `editorial-banner`, `header-split-card`, `boxed-sections-grid`, `timeline-spine`,
 *   `royal-centered-crest`, `two-page-comprehensive`, `magazine-cover-spread`,
 *   `arched-palace-darbar`, `kundali-horoscope-focus`, `modern-infographic-resume`)
 * - All 32 SVG border styles (`renderTemplateFrameSvg`)
 * - All 6 section header styles (`ribbon`, `ornate-line`, `pill`, `underline`, `boxed-tag`, `left-accent`)
 * - All 6 font pairings (`classic`, `royal`, `editorial`, `modern`, `devanagari`, `calligraphic`)
 * - Canva Studio layers:
 *   - 9 Procedural SVG Paper Textures (`renderPaperTextureSvg`)
 *   - 5 Center Watermark / Monogram Seals (`renderCenterWatermarkSvg`)
 *   - Vedic Kundali / Rashi Astrological Chart (`renderKundaliChartSvg`)
 *   - Photo Studio Filters (Brightness, Contrast, Saturation, Warmth, Frame Width, Shadow)
 *   - On-Canvas Draggable, Resizable, Rotatable Vector Stickers & Custom Badges
 *   - Direct On-Canvas Inline Text Editing (`data-inline-type` attributes)
 * - 1-page and 2-page A4 sheet structures (`794px × 1123px` per page)
 */

import { EMBLEMS } from '../data/emblems.js';
import { getTemplateById } from '../data/templates.js';
import { renderTemplateFrameSvg, renderSectionDividerSvg } from '../utils/svgBorders.js';
import {
  CANVA_STICKERS,
  renderCustomTextStickerSvg,
  renderPaperTextureSvg,
  renderCenterWatermarkSvg,
  renderKundaliChartSvg,
  createDefaultKundaliConfig
} from '../data/canvaElements.js';

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function getEmblemMarkup(state, color) {
  if (!state || state.showEmblem === false || state.emblemId === 'none') return '';
  if (state.customEmblemDataUrl) {
    return `<div class="sheet-emblem-icon" data-canvas-element="emblem"><img src="${escapeHtml(state.customEmblemDataUrl)}" alt="Sacred Auspicious Emblem" width="38" height="38" decoding="async" /></div>`;
  }
  const found = EMBLEMS.find((e) => e.id === state.emblemId) || EMBLEMS[0];
  if (!found || found.id === 'none') return '';
  return `<div class="sheet-emblem-icon" data-canvas-element="emblem">${found.svg(color)}</div>`;
}

export function extractCandidateHighlights(activeSections) {
  let candidateName = '';
  let candidateRole = '';
  let candidateDob = '';
  let candidateHeight = '';
  let candidateLocation = '';
  let candidateEducation = '';

  for (const sec of activeSections) {
    for (const f of sec.visibleFields || []) {
      const val = String(f.value).trim();
      if (!candidateName && (f.key === 'full_name' || f.id === 'f_full_name')) {
        candidateName = val;
      }
      if (!candidateRole && f.key === 'occupation') {
        candidateRole = val;
      }
      if (!candidateEducation && f.key === 'qualification') {
        candidateEducation = val;
        if (!candidateRole) candidateRole = val;
      }
      if (!candidateDob && (f.key === 'age' || f.key === 'dob')) {
        candidateDob = val;
      }
      if (!candidateHeight && f.key === 'height') {
        candidateHeight = val;
      }
      if (!candidateLocation && (f.key === 'work_location' || f.key === 'native_place')) {
        candidateLocation = val;
      }
    }
  }
  return {
    candidateName,
    candidateRole,
    candidateDob,
    candidateHeight,
    candidateLocation,
    candidateEducation
  };
}

/**
 * Filter active visible sections and non-empty fields from state
 */
export function getActiveSections(state) {
  const activeSections = [];
  if (!state || !Array.isArray(state.sections)) return activeSections;

  for (const sec of state.sections) {
    if (!sec || sec.visible === false) continue;
    const visibleFields = (sec.fields || []).filter(
      (f) => f && f.visible !== false && f.value !== null && f.value !== undefined && String(f.value).trim() !== ''
    );
    if (visibleFields.length > 0) {
      activeSections.push({
        ...sec,
        title: sec.title || 'Details',
        visibleFields
      });
    }
  }
  return activeSections;
}

/**
 * Build markup for draggable/resizable/rotatable Canva stickers placed on the sheet
 */
export function buildCanvasStickersLayerHtml(stickers, primaryColor, secondaryColor) {
  if (!Array.isArray(stickers) || stickers.length === 0) {
    return '<div class="sheet-stickers-layer" id="sheet-stickers-layer"></div>';
  }

  const itemsHtml = stickers
    .map((item) => {
      const instId = item?.instanceId || item?.id;
      if (!item || !instId) return '';
      const x = Number.isFinite(Number(item.x)) ? Math.max(2, Math.min(98, Number(item.x))) : 82;
      const y = Number.isFinite(Number(item.y)) ? Math.max(2, Math.min(98, Number(item.y))) : 16;
      const scale = Number.isFinite(Number(item.scale)) ? Math.max(0.4, Math.min(2.6, Number(item.scale))) : 1;
      const rotation = Number.isFinite(Number(item.rotation)) ? Number(item.rotation) : 0;
      const opacity = Number.isFinite(Number(item.opacity)) ? Math.max(0.15, Math.min(1, Number(item.opacity))) : 1;

      const cPrimary = item.customColor || primaryColor;
      const cSecondary = item.customSecondary || secondaryColor;
      const isCustomBadge =
        item.kind === 'custom-badge' || item.stickerId === 'custom-text-badge' || Boolean(item.isCustomText);

      let svgMarkup = '';
      let w = 78;
      let h = 78;
      if (isCustomBadge) {
        const badgeStyle = item.badgeStyle || item.badgeShape || 'pill';
        const isSeal = badgeStyle === 'wax-seal' || badgeStyle === 'seal';
        w = isSeal ? 88 : 164;
        h = isSeal ? 88 : 44;
        svgMarkup = renderCustomTextStickerSvg(
          item.customText || 'SHUBH VIVAH',
          badgeStyle,
          cPrimary,
          cSecondary
        );
      } else {
        const foundSticker = CANVA_STICKERS.find((s) => s.id === item.stickerId) || CANVA_STICKERS[0];
        if (foundSticker) {
          w = foundSticker.defaultWidth || 78;
          h = foundSticker.defaultHeight || 78;
          svgMarkup = foundSticker.svg(cPrimary, cSecondary);
        }
      }

      if (!svgMarkup) return '';

      return `
        <div
          class="canvas-sticker-item ${isCustomBadge ? 'is-custom-badge-sticker' : ''}"
          data-sticker-instance-id="${escapeHtml(instId)}"
          data-sticker-id="${escapeHtml(item.stickerId || 'custom-badge')}"
          style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%;width:${w}px;height:${h}px;transform:translate(-50%,-50%) scale(${scale.toFixed(2)}) rotate(${rotation.toFixed(0)}deg);opacity:${opacity.toFixed(2)};"
          title="Drag to move • Use handles to resize, rotate, or delete"
        >
          <div class="canvas-sticker-svg-wrap">${svgMarkup}</div>
          <div class="canvas-sticker-controls" data-export-ignore="true">
            <button type="button" class="sticker-ctrl-btn sticker-rotate-btn" data-sticker-action="rotate" data-sticker-instance-id="${escapeHtml(instId)}" title="Rotate +15°">↻</button>
            <button type="button" class="sticker-ctrl-btn sticker-scale-down-btn" data-sticker-action="scale-down" data-sticker-instance-id="${escapeHtml(instId)}" title="Smaller">−</button>
            <button type="button" class="sticker-ctrl-btn sticker-scale-up-btn" data-sticker-action="scale-up" data-sticker-instance-id="${escapeHtml(instId)}" title="Larger">+</button>
            <button type="button" class="sticker-ctrl-btn sticker-dup-btn" data-sticker-action="duplicate" data-sticker-instance-id="${escapeHtml(instId)}" title="Duplicate">⧉</button>
            <button type="button" class="sticker-ctrl-btn sticker-del-btn" data-sticker-action="delete" data-sticker-instance-id="${escapeHtml(instId)}" title="Remove">✕</button>
          </div>
        </div>`;
    })
    .join('');

  return `<div class="sheet-stickers-layer" id="sheet-stickers-layer">${itemsHtml}</div>`;
}

const LAYOUT_ALIAS_MAP = {
  'traditional-center': 'classic',
  'royal-split-header': 'header-split-card',
  'boxed-cards': 'boxed-sections-grid',
  'modern-minimal': 'editorial-banner',
  'editorial-two-column': 'two-column',
  'crest-medallion': 'royal-centered-crest'
};

const HEADER_STYLE_ALIAS_MAP = {
  'line-accent': 'underline',
  'pill-banner': 'pill',
  'centered-flank': 'ornate-line',
  'Minimal-caps': 'minimal',
  'ribbon-cut': 'ribbon',
  'boxed-tag': 'boxed'
};

export function normalizeLayoutKey(rawLayout) {
  const key = String(rawLayout || 'classic').trim();
  return LAYOUT_ALIAS_MAP[key] || key || 'classic';
}

export function normalizeHeaderStyleKey(rawHeaderStyle) {
  const key = String(rawHeaderStyle || 'ribbon').trim();
  return HEADER_STYLE_ALIAS_MAP[key] || key || 'ribbon';
}

/**
 * Build complete HTML and style metadata for a biodata sheet (1-page or 2-page)
 */
export function buildBiodataSheetMarkup(state, templateOverride = null) {
  const safeState = state || {};
  const tpl = templateOverride || getTemplateById(safeState.templateId);
  const isPreviewOverride = Boolean(templateOverride && templateOverride.id !== safeState.templateId);
  const fmt = safeState.formatting || {};

  const primaryColor = (!isPreviewOverride && fmt.customAccentColor) || tpl.primary;
  const secondaryColor = (!isPreviewOverride && fmt.customSecondaryColor) || tpl.secondary;
  const bgColor = (!isPreviewOverride && (fmt.customBgColor || fmt.customPaperColor)) || tpl.bg;
  const textColor = (!isPreviewOverride && fmt.customTextColor) || tpl.text;

  const fontPair = isPreviewOverride
    ? templateOverride.fontPair || 'classic'
    : fmt.fontPair || tpl.fontPair || 'classic';
  const rawHeaderStyle =
    (!isPreviewOverride && (fmt.customHeaderStyle || fmt.headerStyleOverride)) || tpl.headerStyle || 'ribbon';
  const headerStyle = normalizeHeaderStyleKey(rawHeaderStyle);
  const borderStyle =
    (!isPreviewOverride && (fmt.customBorderStyle || fmt.borderStyleOverride)) || tpl.borderStyle || 'ornate-corners';
  const rawLayout =
    (!isPreviewOverride && (fmt.customLayout || fmt.layoutOverride)) || tpl.layout || 'classic';
  const layout = normalizeLayoutKey(rawLayout);
  const pageCount = tpl.pageCount === 2 || layout === 'two-page-comprehensive' ? 2 : 1;

  const userFontScale = (fmt.fontScale || 100) / 100;
  const userLineSpacing = (fmt.lineSpacing || 100) / 100;
  const userPaddingScale = (fmt.pagePadding || 100) / 100;
  const labelWidthPct = Math.max(26, Math.min(52, Number(fmt.labelWidth || fmt.labelWidthPercent) || 38));
  const padV = Math.round(46 * userPaddingScale);
  const padH = Math.round(52 * userPaddingScale);

  const frameSvg = renderTemplateFrameSvg(borderStyle, primaryColor, secondaryColor);
  const motifSvg = renderSectionDividerSvg(tpl.sectionMotif || 'diamond', primaryColor, secondaryColor);

  // Paper texture & center watermark layers
  const paperTextureSvg = !isPreviewOverride
    ? renderPaperTextureSvg(fmt.paperTexture || 'none', primaryColor, secondaryColor)
    : '';
  const paperTextureHtml = paperTextureSvg
    ? `<div class="sheet-paper-texture-layer" aria-hidden="true">${paperTextureSvg}</div>`
    : '';

  // Native SVG borders & paper textures replace raster Canva invitation backdrops
  const canvaBackdropHtml = '';

  // Sacred Header with Direct Inline Edit hooks
  const rawInvocations = Array.isArray(safeState.invocationLines) ? safeState.invocationLines : [];
  const emblemHtml = getEmblemMarkup(safeState, primaryColor);
  const invocationHtml = rawInvocations
    .map((line, idx) => {
      if (!line || !String(line).trim()) return '';
      return `<div class="sheet-invocation-text" data-inline-type="invocation" data-inline-index="${idx}" title="Click to edit invocation line">${escapeHtml(line)}</div>`;
    })
    .filter(Boolean)
    .join('');

  const titleHtml =
    safeState.showDocTitle !== false && safeState.docTitle
      ? `<h2 class="sheet-main-title" data-inline-type="doc-title" title="Click to edit document title">${escapeHtml(safeState.docTitle)}</h2><div class="sheet-title-divider"></div>`
      : '';

  const sacredHeaderBlock =
    emblemHtml || invocationHtml || titleHtml
      ? `<div class="sheet-sacred-header">${emblemHtml}${invocationHtml}${titleHtml}</div>`
      : '';

  // Photo Markup (respects template supportsPhoto, user toggle, and Photo Studio filters)
  const showPhoto =
    tpl.supportsPhoto !== false &&
    safeState.photo &&
    safeState.photo.show !== false &&
    Boolean(safeState.photo.dataUrl);

  const photoShape =
    safeState.photo?.shape && safeState.photo.shape !== 'none'
      ? safeState.photo.shape
      : tpl.defaultPhotoShape && tpl.defaultPhotoShape !== 'none'
        ? tpl.defaultPhotoShape
        : 'rounded-rect';
  const photoScale = (safeState.photo?.size || 100) / 100;
  const isSquareShape = photoShape === 'circle' || photoShape === 'gold-ring' || photoShape === 'square' || photoShape === 'octagon';
  const pw = Math.round((isSquareShape ? 148 : 140) * photoScale);
  const ph = Math.round((isSquareShape ? 148 : 174) * photoScale);

  const pBright = Number.isFinite(Number(safeState.photo?.brightness)) ? Number(safeState.photo.brightness) : 100;
  const pContrast = Number.isFinite(Number(safeState.photo?.contrast)) ? Number(safeState.photo.contrast) : 100;
  const pSat = Number.isFinite(Number(safeState.photo?.saturation)) ? Number(safeState.photo.saturation) : 100;
  const pWarmth = Number.isFinite(Number(safeState.photo?.warmth)) ? Number(safeState.photo.warmth) : 0;
  const pBorderWidth = Number.isFinite(Number(safeState.photo?.borderWidth)) ? Number(safeState.photo.borderWidth) : 3;
  const pShadow = safeState.photo?.shadow !== false;

  const photoFilterCss =
    pBright !== 100 || pContrast !== 100 || pSat !== 100 || pWarmth !== 0
      ? `filter:brightness(${pBright}%) contrast(${pContrast}%) saturate(${pSat}%) sepia(${pWarmth}%);`
      : '';
  const photoBorderStyleCss = `border-width:${pBorderWidth}px;${!pShadow ? 'box-shadow:none;' : ''}`;

  const activeSections = getActiveSections(safeState);
  const {
    candidateName,
    candidateRole,
    candidateDob,
    candidateHeight,
    candidateLocation,
    candidateEducation
  } = extractCandidateHighlights(activeSections);

  const initials = (candidateName || 'MB')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');

  // Center Watermark / Monogram Layer
  const watermarkSvg = !isPreviewOverride
    ? renderCenterWatermarkSvg(
        fmt.watermarkMode || 'none',
        fmt.watermarkText || initials || 'SV',
        fmt.watermarkOpacity || 8,
        primaryColor,
        secondaryColor
      )
    : '';
  const watermarkHtml = watermarkSvg
    ? `<div class="sheet-watermark-layer" aria-hidden="true">${watermarkSvg}</div>`
    : '';

  const photoHtml = showPhoto
    ? `<div class="sheet-photo-frame shape-${escapeHtml(photoShape)}" data-canvas-element="photo" style="width:${pw}px;height:${ph}px;${photoBorderStyleCss}">
         <img
           src="${escapeHtml(safeState.photo.dataUrl)}"
           alt="${escapeHtml(candidateName ? `${candidateName} Marriage Biodata Portrait` : 'Candidate Marriage Biodata Portrait')}"
           width="${pw}"
           height="${ph}"
           decoding="async"
           style="${photoFilterCss}"
           onerror="this.style.display='none';this.parentElement.classList.add('photo-load-fallback');"
         />
         <span class="photo-fallback-initials" aria-hidden="true">${escapeHtml(initials)}</span>
       </div>`
    : '';

  // Vedic Kundali / Rashi Chart Markup
  const kundaliCfg = safeState.kundali || createDefaultKundaliConfig();
  const shouldRenderKundali =
    layout === 'kundali-horoscope-focus' ||
    Boolean(safeState.kundali && (safeState.kundali.show || safeState.kundali.enabled));
  const kundaliChartSvg = shouldRenderKundali
    ? renderKundaliChartSvg(
        { ...kundaliCfg, show: true },
        primaryColor,
        secondaryColor
      )
    : '';
  const kundaliTitleText = kundaliCfg.title || 'Janam Kundali / Rashi Chart';
  const kundaliSubtitleText = kundaliCfg.subtitle || '';
  const kundaliWidgetHtml = kundaliChartSvg
    ? `<div class="sheet-kundali-widget" data-canvas-element="kundali">
         <div class="kundali-widget-title" data-inline-type="kundali-title">${escapeHtml(kundaliTitleText)}</div>
         ${kundaliChartSvg}
         ${kundaliSubtitleText ? `<div class="kundali-widget-subtitle">${escapeHtml(kundaliSubtitleText)}</div>` : ''}
       </div>`
    : '';

  const renderSectionHtml = (sec, embedKundaliInHoroscope = false) => {
    const rowsHtml = (sec.visibleFields || [])
      .map(
        (f) => `
        <div class="sheet-field-item" data-field-id="${escapeHtml(f.id)}">
          <div class="sheet-field-label" data-inline-type="field-label" data-sec-id="${escapeHtml(sec.id)}" data-field-id="${escapeHtml(f.id)}" title="Click to edit label">${escapeHtml(f.label)}</div>
          <div class="sheet-field-colon">:</div>
          <div class="sheet-field-value" data-inline-type="field-value" data-sec-id="${escapeHtml(sec.id)}" data-field-id="${escapeHtml(f.id)}" title="Click to edit value">${escapeHtml(f.value)}</div>
        </div>`
      )
      .join('');

    const attachKundaliHere =
      embedKundaliInHoroscope && sec.id === 'horoscope' && kundaliWidgetHtml;

    return `
      <div class="sheet-section" data-sec-id="${escapeHtml(sec.id)}">
        <div class="sheet-section-header">
          <span class="sheet-section-motif" aria-hidden="true">${motifSvg}</span>
          <h3 class="sheet-section-title" data-inline-type="section-title" data-sec-id="${escapeHtml(sec.id)}" title="Click to edit section heading">${escapeHtml(sec.title)}</h3>
        </div>
        ${
          attachKundaliHere
            ? `<div class="sheet-horoscope-with-kundali">
                 <div class="sheet-fields-table" style="flex:1">${rowsHtml}</div>
                 ${kundaliWidgetHtml}
               </div>`
            : `<div class="sheet-fields-table">${rowsHtml}</div>`
        }
      </div>`;
  };

  const emptySheetPlaceholder =
    activeSections.length === 0
      ? `<div class="sheet-empty-placeholder">
           <p>Add or enable at least one field in the editor to preview your biodata details.</p>
         </div>`
      : '';

  const buildSinglePageLayout = (sectionsForPage, includeHeroPhoto = true, pageHeaderOverride = null) => {
    const headerBlock = pageHeaderOverride !== null ? pageHeaderOverride : sacredHeaderBlock;
    const pagePhoto = includeHeroPhoto ? photoHtml : '';
    const hasHoroscopeSec = sectionsForPage.some((s) => s.id === 'horoscope');
    const embedKundaliInSec = shouldRenderKundali && layout !== 'kundali-horoscope-focus';

    if (sectionsForPage.length === 0) {
      return `${headerBlock}${pagePhoto}${emptySheetPlaceholder}`;
    }

    // NEW LAYOUT 11: `kundali-horoscope-focus`
    if (layout === 'kundali-horoscope-focus') {
      const firstSec = sectionsForPage[0];
      const horoscopeSec = sectionsForPage.find((s) => s.id === 'horoscope' && s !== firstSec);
      const otherSecs = sectionsForPage.filter((s) => s !== firstSec && s !== horoscopeSec);

      return `
        ${headerBlock}
        <div class="kundali-focus-hero-grid">
          <div class="kundali-focus-main-col">
            ${firstSec ? renderSectionHtml(firstSec, false) : ''}
          </div>
          <div class="kundali-focus-side-col">
            ${pagePhoto}
            ${kundaliWidgetHtml}
          </div>
        </div>
        ${
          horoscopeSec
            ? `<div class="kundali-horoscope-banner-sec">${renderSectionHtml(horoscopeSec, false)}</div>`
            : ''
        }
        <div class="kundali-focus-rest-flow">
          ${otherSecs.map((s) => renderSectionHtml(s, false)).join('')}
        </div>`;
    }

    // NEW LAYOUT 12: `arched-palace-darbar`
    if (layout === 'arched-palace-darbar') {
      const firstSec = sectionsForPage[0];
      const restSecs = sectionsForPage.slice(1);
      return `
        <div class="arched-darbar-dome-header">
          <div class="arched-darbar-arch-inner">
            ${emblemHtml}
            ${invocationHtml}
            ${
              safeState.showDocTitle !== false && safeState.docTitle
                ? `<div class="arched-darbar-doctitle" data-inline-type="doc-title">${escapeHtml(safeState.docTitle)}</div>`
                : ''
            }
            <div class="arched-darbar-hero-row">
              ${pagePhoto}
              <div class="arched-darbar-hero-meta">
                ${candidateName ? `<div class="arched-darbar-name">${escapeHtml(candidateName)}</div>` : ''}
                ${candidateRole ? `<div class="arched-darbar-role">${escapeHtml(candidateRole)}</div>` : ''}
                ${candidateDob ? `<div class="arched-darbar-sub">${escapeHtml(candidateDob)}${candidateHeight ? ` • ${escapeHtml(candidateHeight)}` : ''}</div>` : ''}
              </div>
            </div>
          </div>
        </div>
        <div class="arched-darbar-body-flow">
          ${firstSec ? renderSectionHtml(firstSec, embedKundaliInSec) : ''}
          <div class="arched-darbar-two-col">
            ${restSecs.map((s) => renderSectionHtml(s, embedKundaliInSec)).join('')}
          </div>
          ${embedKundaliInSec && !hasHoroscopeSec ? kundaliWidgetHtml : ''}
        </div>`;
    }

    // NEW LAYOUT 13: `magazine-cover-spread`
    if (layout === 'magazine-cover-spread') {
      const firstSec = sectionsForPage[0];
      const restSecs = sectionsForPage.slice(1);
      return `
        <div class="magazine-spread-masthead">
          <div class="magazine-spread-left">
            <div class="magazine-spread-kicker">
              ${emblemHtml}
              <div class="magazine-spread-kicker-text">
                ${invocationHtml}
                ${
                  safeState.showDocTitle !== false && safeState.docTitle
                    ? `<span class="magazine-doctitle-tag" data-inline-type="doc-title">${escapeHtml(safeState.docTitle)}</span>`
                    : ''
                }
              </div>
            </div>
            ${candidateName ? `<h2 class="magazine-cover-name">${escapeHtml(candidateName)}</h2>` : ''}
            ${candidateRole ? `<div class="magazine-cover-role">${escapeHtml(candidateRole)}</div>` : ''}
            <div class="magazine-cover-Divider"></div>
            ${firstSec ? renderSectionHtml(firstSec, embedKundaliInSec) : ''}
          </div>
          ${
            pagePhoto
              ? `<div class="magazine-spread-portrait-col">
                   ${pagePhoto}
                   ${candidateLocation ? `<div class="magazine-portrait-caption">📍 ${escapeHtml(candidateLocation)}</div>` : ''}
                 </div>`
              : ''
          }
        </div>
        <div class="magazine-spread-columns">
          ${restSecs.map((s) => renderSectionHtml(s, embedKundaliInSec)).join('')}
          ${embedKundaliInSec && !hasHoroscopeSec ? kundaliWidgetHtml : ''}
        </div>`;
    }

    // NEW LAYOUT 14: `modern-infographic-resume`
    if (layout === 'modern-infographic-resume') {
      const chips = [
        candidateDob ? { icon: '🗓', label: 'Age / DOB', val: candidateDob } : null,
        candidateHeight ? { icon: '📏', label: 'Height', val: candidateHeight } : null,
        candidateEducation ? { icon: '🎓', label: 'Education', val: candidateEducation } : null,
        candidateLocation ? { icon: '📍', label: 'Location', val: candidateLocation } : null
      ].filter(Boolean);

      const chipsHtml =
        chips.length > 0
          ? `<div class="infographic-kpi-strip">
               ${chips
                 .map(
                   (c) => `
                 <div class="infographic-kpi-chip">
                   <span class="kpi-chip-label">${escapeHtml(c.label)}</span>
                   <span class="kpi-chip-val">${escapeHtml(c.val)}</span>
                 </div>`
                 )
                 .join('')}
             </div>`
          : '';

      return `
        <div class="infographic-top-header">
          <div class="infographic-top-identity">
            <div class="infographic-sacred-mini">${emblemHtml}${invocationHtml}</div>
            ${
              safeState.showDocTitle !== false && safeState.docTitle
                ? `<div class="infographic-doctitle" data-inline-type="doc-title">${escapeHtml(safeState.docTitle)}</div>`
                : ''
            }
            ${candidateName ? `<div class="infographic-candidate-name">${escapeHtml(candidateName)}</div>` : ''}
            ${candidateRole ? `<div class="infographic-candidate-role">${escapeHtml(candidateRole)}</div>` : ''}
          </div>
          ${pagePhoto}
        </div>
        ${chipsHtml}
        <div class="infographic-cards-grid">
          ${sectionsForPage.map((sec) => `<div class="infographic-sec-card">${renderSectionHtml(sec, embedKundaliInSec)}</div>`).join('')}
          ${embedKundaliInSec && !hasHoroscopeSec ? `<div class="infographic-sec-card">${kundaliWidgetHtml}</div>` : ''}
        </div>`;
    }

    if (layout === 'sidebar-left' || layout === 'sidebar-right') {
      const sidebarSecs = sectionsForPage.filter((s) => s.id === 'contact' || s.id === 'horoscope');
      const mainSecs = sectionsForPage.filter((s) => s.id !== 'contact' && s.id !== 'horoscope');
      const effectiveSidebarSecs = sidebarSecs.length > 0 ? sidebarSecs : sectionsForPage.slice(-1);
      const effectiveMainSecs =
        mainSecs.length > 0
          ? mainSecs
          : sectionsForPage.length > 1
            ? sectionsForPage.slice(0, -1)
            : sectionsForPage;

      const sidebarPaneHtml = `
        <div class="sidebar-pane ${layout === 'sidebar-right' ? 'sidebar-pane-right' : ''}">
          ${pagePhoto}
          ${effectiveSidebarSecs.map((s) => renderSectionHtml(s, embedKundaliInSec)).join('')}
          ${embedKundaliInSec && !hasHoroscopeSec ? kundaliWidgetHtml : ''}
        </div>`;
      const mainPaneHtml = `
        <div class="main-pane">
          ${effectiveMainSecs.map((s) => renderSectionHtml(s, embedKundaliInSec)).join('')}
        </div>`;

      return `
        ${headerBlock}
        <div class="sidebar-layout-grid ${layout === 'sidebar-right' ? 'sidebar-right-grid' : ''}">
          ${layout === 'sidebar-right' ? `${mainPaneHtml}${sidebarPaneHtml}` : `${sidebarPaneHtml}${mainPaneHtml}`}
        </div>`;
    }

    if (layout === 'two-column') {
      const firstSec = sectionsForPage[0];
      const restSecs = sectionsForPage.slice(1);
      return `
        ${headerBlock}
        ${
          firstSec
            ? `<div class="two-col-hero">
                 <div class="two-col-hero-main">${renderSectionHtml(firstSec, embedKundaliInSec)}</div>
                 ${pagePhoto}
               </div>`
            : pagePhoto
        }
        <div class="two-col-grid">
          ${restSecs.map((s) => renderSectionHtml(s, embedKundaliInSec)).join('')}
          ${embedKundaliInSec && !hasHoroscopeSec ? kundaliWidgetHtml : ''}
        </div>`;
    }

    if (layout === 'editorial-banner') {
      const firstSec = sectionsForPage[0];
      const restSecs = sectionsForPage.slice(1);
      return `
        <div class="editorial-banner-box">
          <div class="editorial-banner-text">
            ${emblemHtml}
            ${invocationHtml}
            ${
              safeState.showDocTitle !== false && safeState.docTitle
                ? `<div class="editorial-banner-doctitle" data-inline-type="doc-title">${escapeHtml(safeState.docTitle)}</div>`
                : ''
            }
            ${candidateName ? `<div class="editorial-banner-name">${escapeHtml(candidateName)}</div>` : ''}
            ${candidateRole ? `<div class="editorial-banner-sub">${escapeHtml(candidateRole)}</div>` : ''}
          </div>
          ${pagePhoto}
        </div>
        <div class="editorial-sections-flow">
          ${firstSec ? renderSectionHtml(firstSec, embedKundaliInSec) : ''}
          ${restSecs.map((s) => renderSectionHtml(s, embedKundaliInSec)).join('')}
          ${embedKundaliInSec && !hasHoroscopeSec ? kundaliWidgetHtml : ''}
        </div>`;
    }

    if (layout === 'header-split-card') {
      const firstSec = sectionsForPage[0];
      const restSecs = sectionsForPage.slice(1);
      return `
        ${headerBlock}
        <div class="header-split-card-box">
          <div class="header-split-card-main">
            ${candidateName ? `<div class="split-card-candidate-name">${escapeHtml(candidateName)}</div>` : ''}
            ${candidateRole ? `<div class="split-card-candidate-role">${escapeHtml(candidateRole)}</div>` : ''}
            ${firstSec ? renderSectionHtml(firstSec, embedKundaliInSec) : ''}
          </div>
          ${pagePhoto}
        </div>
        <div class="split-card-sections-flow">
          ${restSecs.map((s) => renderSectionHtml(s, embedKundaliInSec)).join('')}
          ${embedKundaliInSec && !hasHoroscopeSec ? kundaliWidgetHtml : ''}
        </div>`;
    }

    if (layout === 'boxed-sections-grid') {
      const firstSec = sectionsForPage[0];
      const restSecs = sectionsForPage.slice(1);
      return `
        ${headerBlock}
        ${
          firstSec
            ? `<div class="boxed-hero-card">
                 <div class="boxed-top-hero-sec">${renderSectionHtml(firstSec, embedKundaliInSec)}</div>
                 ${pagePhoto}
               </div>`
            : pagePhoto
        }
        <div class="boxed-sections-grid-container">
          ${restSecs.map((sec) => `<div class="boxed-section-card">${renderSectionHtml(sec, embedKundaliInSec)}</div>`).join('')}
          ${embedKundaliInSec && !hasHoroscopeSec ? `<div class="boxed-section-card">${kundaliWidgetHtml}</div>` : ''}
        </div>`;
    }

    if (layout === 'timeline-spine') {
      const firstSec = sectionsForPage[0];
      const restSecs = sectionsForPage.slice(1);
      return `
        ${headerBlock}
        ${
          firstSec
            ? `<div class="classic-top-split">
                 ${renderSectionHtml(firstSec, embedKundaliInSec)}
                 ${pagePhoto}
               </div>`
            : pagePhoto
        }
        <div class="timeline-spine-stack">
          ${restSecs.map((s) => renderSectionHtml(s, embedKundaliInSec)).join('')}
          ${embedKundaliInSec && !hasHoroscopeSec ? kundaliWidgetHtml : ''}
        </div>`;
    }

    if (layout === 'royal-centered-crest') {
      return `
        ${headerBlock}
        <div class="royal-centered-crest-hero">
          ${pagePhoto}
          ${candidateName ? `<div class="crest-candidate-name">${escapeHtml(candidateName)}</div>` : ''}
          ${candidateRole ? `<div class="crest-candidate-role">${escapeHtml(candidateRole)}</div>` : ''}
        </div>
        <div class="crest-sections-flow">
          ${sectionsForPage.map((s) => renderSectionHtml(s, embedKundaliInSec)).join('')}
          ${embedKundaliInSec && !hasHoroscopeSec ? kundaliWidgetHtml : ''}
        </div>`;
    }

    // Default `classic` or `two-page-comprehensive` per-page layout
    const firstSec = sectionsForPage[0];
    const restSecs = sectionsForPage.slice(1);
    return `
      ${headerBlock}
      ${
        firstSec
          ? `<div class="classic-top-split">
               ${renderSectionHtml(firstSec, embedKundaliInSec)}
               ${pagePhoto}
             </div>`
          : pagePhoto
      }
      ${restSecs.map((s) => renderSectionHtml(s, embedKundaliInSec)).join('')}
      ${embedKundaliInSec && !hasHoroscopeSec ? kundaliWidgetHtml : ''}
    `;
  };

  const stickersLayerHtml = !isPreviewOverride
    ? buildCanvasStickersLayerHtml(safeState.canvasStickers || safeState.stickers || [], primaryColor, secondaryColor)
    : '';

  const attributionFooterHtml = `<div class="sheet-footer-attribution">Made via biodata.cogify.me</div>`;

  let innerHtml = '';
  if (pageCount === 2) {
    const splitIndex = Math.max(1, Math.ceil(activeSections.length / 2));
    const page1Sections = activeSections.slice(0, splitIndex);
    const page2Sections = activeSections.slice(splitIndex);

    const page1Body = buildSinglePageLayout(page1Sections, true, sacredHeaderBlock);
    const page2Header = `
      <div class="sheet-sacred-header sheet-page2-header">
        ${invocationHtml}
        <h2 class="sheet-main-title" style="font-size:calc(18px * var(--sheet-font-scale));" data-inline-type="doc-title">
          ${escapeHtml(safeState.docTitle || 'MARRIAGE BIODATA')} — II
        </h2>
        <div class="sheet-title-divider"></div>
      </div>`;
    const page2Body =
      page2Sections.length > 0
        ? buildSinglePageLayout(page2Sections, false, page2Header)
        : `${page2Header}
           <div class="sheet-section">
             <div class="sheet-section-header">
               <span class="sheet-section-motif" aria-hidden="true">${motifSvg}</span>
               <h3 class="sheet-section-title">Family &amp; Horoscope Portfolio Notes</h3>
             </div>
             <div class="sheet-fields-table">
               <div class="sheet-field-item">
                 <div class="sheet-field-label">Candidate</div>
                 <div class="sheet-field-colon">:</div>
                 <div class="sheet-field-value">${escapeHtml(candidateName || 'Candidate Profile')}</div>
               </div>
             </div>
           </div>`;

    innerHtml = `
      <div class="biodata-page-unit biodata-page-1" data-page-number="1">
        ${canvaBackdropHtml}
        ${paperTextureHtml}
        ${watermarkHtml}
        <div class="sheet-frame-layer">${frameSvg}</div>
        <div class="sheet-content-layer" id="sheet-content-layer">
          ${page1Body}
          <div class="sheet-page-footer">
            <span>${escapeHtml(candidateName || safeState.docTitle || 'Marriage Biodata')}</span>
            <span>Made via biodata.cogify.me • Page 1 of 2</span>
          </div>
        </div>
        ${stickersLayerHtml}
      </div>
      <div class="biodata-page-unit biodata-page-2" data-page-number="2">
        ${canvaBackdropHtml}
        ${paperTextureHtml}
        ${watermarkHtml}
        <div class="sheet-frame-layer">${frameSvg}</div>
        <div class="sheet-content-layer" id="sheet-content-layer-p2">
          ${page2Body}
          <div class="sheet-page-footer">
            <span>${escapeHtml(candidateName || safeState.docTitle || 'Marriage Biodata')}</span>
            <span>Made via biodata.cogify.me • Page 2 of 2</span>
          </div>
        </div>
      </div>
    `;
  } else {
    const page1Body = buildSinglePageLayout(activeSections, true, sacredHeaderBlock);
    innerHtml = `
      ${canvaBackdropHtml}
      ${paperTextureHtml}
      ${watermarkHtml}
      <div class="sheet-frame-layer">${frameSvg}</div>
      <div class="sheet-content-layer" id="sheet-content-layer">
        ${page1Body}
        ${attributionFooterHtml}
      </div>
      ${stickersLayerHtml}
    `;
  }

  const className = [
    'biodata-a4-sheet',
    `font-${fontPair}`,
    `header-style-${headerStyle}`,
    rawHeaderStyle !== headerStyle ? `header-style-${rawHeaderStyle}` : '',
    `layout-${layout}`,
    rawLayout !== layout ? `layout-${rawLayout}` : '',
    pageCount === 2 ? 'is-two-page-sheet' : 'is-single-page-sheet',
    !showPhoto ? 'is-no-photo-sheet' : ''
  ]
    .filter(Boolean)
    .join(' ');

  // Deterministic Single-Page Auto-Fit Solver (zero forced reflow; identical on SSR & client)
  let effectiveFontScale = userFontScale;
  let effectiveRowGap = 6.5 * userLineSpacing;
  let effectiveSecGap = 14.5 * userLineSpacing;

  if (pageCount === 1 && fmt.autoFitSinglePage !== false) {
    const visibleSectionCount = activeSections.length;
    const totalVisibleFields = activeSections.reduce(
      (acc, s) => acc + (s.fields ? s.fields.length : 0),
      0
    );
    const longFieldLines = activeSections.reduce(
      (acc, s) =>
        acc +
        (s.fields || []).reduce(
          (fAcc, f) => fAcc + (String(f?.value || '').length > 52 ? 1 : 0),
          0
        ),
      0
    );
    const hasKundaliBlock =
      Boolean(safeState.kundali?.enabled) || layout === 'kundali-horoscope-focus';
    const isSingleColumnLayout =
      layout === 'classic' ||
      layout === 'minimal-editorial' ||
      layout === 'horizontal-bands' ||
      layout === 'boxed-cards' ||
      layout === 'royal-darbar-arch' ||
      layout === 'heritage-scroll-parchment' ||
      layout === 'centered-imperial-crest';

    const estimatedContentHeight =
      150 +
      visibleSectionCount * (34 + effectiveSecGap) +
      (isSingleColumnLayout ? totalVisibleFields : Math.ceil(totalVisibleFields * 0.68)) *
        (22 * userFontScale + effectiveRowGap) +
      longFieldLines * 16 +
      (hasKundaliBlock ? 175 : 0);

    const maxInnerHeight = 1123 - padV * 2;
    if (estimatedContentHeight > maxInnerHeight) {
      const ratio = Math.max(
        0.72,
        Math.min(0.97, (maxInnerHeight / estimatedContentHeight) * 0.98)
      );
      effectiveFontScale = Number(Math.max(0.72, userFontScale * ratio).toFixed(2));
      effectiveRowGap = Number(Math.max(3, effectiveRowGap * ratio).toFixed(1));
      effectiveSecGap = Number(Math.max(7, effectiveSecGap * ratio).toFixed(1));
    }
  }

  return {
    tpl,
    className,
    pageCount,
    dimensions: {
      widthPx: 794,
      heightPx: pageCount === 2 ? 2266 : 1123,
      perPageHeightPx: 1123
    },
    cssVars: {
      '--sheet-bg': bgColor,
      '--sheet-surface': tpl.surface || '#FFFFFF',
      '--sheet-primary': primaryColor,
      '--sheet-secondary': secondaryColor,
      '--sheet-text': textColor,
      '--sheet-muted': tpl.muted,
      '--sheet-padding': `${padV}px ${padH}px`,
      '--sheet-font-scale': String(effectiveFontScale),
      '--sheet-row-gap': `${effectiveRowGap.toFixed(1)}px`,
      '--sheet-sec-gap': `${effectiveSecGap.toFixed(1)}px`,
      '--sheet-label-width': `${labelWidthPct}%`
    },
    padV,
    padH,
    userFontScale: effectiveFontScale,
    userLineSpacing,
    innerHtml,
    innerHTML: innerHtml
  };
}

/**
 * Renders the Biodata Sheet into a DOM element without synchronous layout reads (zero forced reflow)
 */
export function renderSheetIntoElement(sheetEl, state, templateOverride = null) {
  if (!sheetEl) return null;
  const rendered = buildBiodataSheetMarkup(state, templateOverride);

  const preserveInlineMode = sheetEl.classList.contains('is-inline-edit-enabled');
  sheetEl.className = preserveInlineMode
    ? `${rendered.className} is-inline-edit-enabled`
    : rendered.className;
  sheetEl.setAttribute('data-page-count', String(rendered.pageCount));
  sheetEl.setAttribute('data-template-id', rendered.tpl.id);
  for (const [k, v] of Object.entries(rendered.cssVars)) {
    sheetEl.style.setProperty(k, v);
  }
  sheetEl.innerHTML = rendered.innerHtml;

  return rendered;
}
