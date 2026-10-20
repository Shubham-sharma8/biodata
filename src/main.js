import './styles/main.css';
import { EMBLEMS } from './data/emblems.js';
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_LABELS,
  DATALIST_OPTIONS,
  OPTIONAL_FIELD_PILLS,
  COMMUNITY_PRESETS,
  DOB_MONTHS,
  parseDobParts,
  createInitialBiodataState,
  formatDobAndCalculateAge
} from './data/presets.js';
import {
  TEMPLATE_CATEGORIES,
  TEMPLATE_STYLE_FILTERS,
  TEMPLATE_COLOR_FILTERS,
  TEMPLATE_PAGE_FILTERS,
  TEMPLATE_PHOTO_FILTERS,
  TEMPLATES,
  getTemplateById
} from './data/templates.js';
import {
  CANVA_STICKERS,
  PAPER_TEXTURES,
  WATERMARK_MODES,
  KUNDALI_PRESETS
} from './data/canvaElements.js';
import {
  SUPPORTED_BORDER_STYLES,
  filterAndSearchTemplates,
  renderLiveTemplateMiniPreview
} from './templates/adapter.js';
import { renderSheetIntoElement } from './templates/renderer.js';
import { PhotoCropperModal } from './utils/cropper.js';
import {
  exportToPDF,
  exportToImage,
  exportToWordDocx,
  printBiodata,
  shareBiodata,
  exportBiodataJSON,
  importBiodataJSON
} from './utils/exporters.js';
import {
  saveBiodataToCookies,
  loadBiodataFromCookies,
  savePreviousSnapshotToCookies,
  loadPreviousSnapshotFromCookies,
  getSavedCookieSummary
} from './utils/cookies.js';
import { applySeoRouteContext } from './seo/seoRouter.js';

const STORAGE_KEY = 'biodatamaker_free_state_v1';
const FAVORITES_STORAGE_KEY = 'biodatamaker_favorite_templates_v1';

let appState = normalizeStateShape(loadSavedState());
let favoriteTemplateIds = loadFavorites();
let compareTemplateIds = [];
let previewModalTemplateId = null;
let activeStickerCategory = 'all';
let selectedStickerInstanceId = null;
let isInlineEditEnabled = true;
let canvasZoomMode = 'auto';
let cropperInstance = null;
let saveStateTimer = null;

// Undo / Redo History Stack
const MAX_HISTORY_STEPS = 45;
let undoStack = [];
let redoStack = [];

// Phase 6 Multi-Facet Gallery Filter State
const galleryFilters = {
  query: '',
  category: 'all',
  style: 'all',
  colorFamily: 'all',
  pageCount: 'all',
  photoSupport: 'all',
  language: 'all',
  sourcePath: 'all',
  recentlyAddedOnly: false,
  favoritesOnly: false
};
let galleryVisibleLimit = 24;

function normalizeStateShape(state) {
  if (!state || typeof state !== 'object') {
    return createInitialBiodataState('hindu_bride');
  }

  // Ensure presetId is always set and normalized
  if (!state.presetId || state.presetId === 'sample_bride') {
    state.presetId = 'hindu_bride';
  } else if (state.presetId === 'sample_groom') {
    state.presetId = 'hindu_groom';
  }

  const base = createInitialBiodataState(state.presetId);
  state.photo = { ...base.photo, ...(state.photo || {}) };
  state.formatting = { ...base.formatting, ...(state.formatting || {}) };
  state.kundali = {
    ...base.kundali,
    ...(state.kundali || {}),
    houses: Array.isArray(state.kundali?.houses) && state.kundali.houses.length === 12
      ? [...state.kundali.houses]
      : [...base.kundali.houses]
  };
  if (!Array.isArray(state.canvasStickers)) {
    state.canvasStickers = [];
  }
  if (!Array.isArray(state.sections) || state.sections.length === 0) {
    state.sections = JSON.parse(JSON.stringify(base.sections));
  } else {
    const deletedSecIds = new Set(Array.isArray(state._deletedSectionIds) ? state._deletedSectionIds : []);
    base.sections.forEach((baseSec, idx) => {
      const exists = state.sections.some((s) => s && s.id === baseSec.id);
      if (!exists && !deletedSecIds.has(baseSec.id)) {
        const insertAt = Math.min(idx, state.sections.length);
        state.sections.splice(insertAt, 0, JSON.parse(JSON.stringify(baseSec)));
      }
    });
  }

  // Sanitize Personal Details DOB and Age fields & restore classic Personal Details fields if missing from old preset
  const personalSec = (state.sections || []).find((s) => s.id === 'personal');
  const basePersonalSec = (base.sections || []).find((s) => s.id === 'personal');
  if (personalSec && Array.isArray(personalSec.fields)) {
    const deletedFieldKeys = new Set(Array.isArray(state._deletedFieldKeys) ? state._deletedFieldKeys : []);
    if (basePersonalSec && Array.isArray(basePersonalSec.fields)) {
      ['mother_tongue', 'hobbies'].forEach((classicKey) => {
        if (!personalSec.fields.some((f) => f.key === classicKey) && !deletedFieldKeys.has(classicKey)) {
          const tplField = basePersonalSec.fields.find((f) => f.key === classicKey);
          if (tplField) {
            personalSec.fields.push(JSON.parse(JSON.stringify(tplField)));
          }
        }
      });
    }

    const dobIdx = personalSec.fields.findIndex((f) => f.key === 'dob');
    let extractedAge = '';
    if (dobIdx !== -1) {
      const dobField = personalSec.fields[dobIdx];
      const match = String(dobField.value || '').match(/^(.+?)\s*\((\d+\s*Years)\)$/i);
      if (match) {
        dobField.value = match[1].trim();
        extractedAge = match[2].trim();
      }
    }
    const currentDobVal = dobIdx !== -1 ? personalSec.fields[dobIdx].value : '';
    const calc = formatDobAndCalculateAge(currentDobVal);

    let ageIdx = personalSec.fields.findIndex((f) => f.key === 'age');
    if (ageIdx === -1 && dobIdx !== -1 && !deletedFieldKeys.has('age')) {
      personalSec.fields.splice(dobIdx + 1, 0, {
        id: 'f_age',
        key: 'age',
        label: 'Age',
        value: calc.ageText || extractedAge || '28 Years',
        type: 'text',
        visible: true
      });
    } else if (ageIdx !== -1) {
      const ageField = personalSec.fields[ageIdx];
      if (calc.ageText) {
        ageField.value = calc.ageText;
      } else {
        const yearsMatch = String(ageField.value || '').match(/(\d+\s*Years)/i);
        if (yearsMatch) {
          ageField.value = yearsMatch[1];
        } else if (extractedAge) {
          ageField.value = extractedAge;
        }
      }
    }
  }

  return state;
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.sections) && parsed.sections.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not load saved biodata state from localStorage:', e);
  }

  // Fallback to browser cookies (`bd_cogify_v1_*`) if localStorage was cleared or unavailable
  try {
    const cookieState = loadBiodataFromCookies();
    if (cookieState && Array.isArray(cookieState.sections) && cookieState.sections.length > 0) {
      return cookieState;
    }
  } catch (e) {
    console.warn('Could not load saved biodata state from cookies:', e);
  }

  return createInitialBiodataState('hindu_bride');
}

function flushSaveState() {
  if (saveStateTimer) {
    clearTimeout(saveStateTimer);
    saveStateTimer = null;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.warn('LocalStorage quota warning:', e);
  }
  try {
    saveBiodataToCookies(appState);
  } catch (e) {
    console.warn('Cookie save warning:', e);
  }
}

function saveState(immediate = false) {
  if (immediate) {
    flushSaveState();
    return;
  }
  if (saveStateTimer) {
    clearTimeout(saveStateTimer);
  }
  saveStateTimer = setTimeout(flushSaveState, 160);
}

function pushUndoSnapshot() {
  try {
    const serialized = JSON.stringify(appState);
    if (undoStack.length > 0 && undoStack[undoStack.length - 1] === serialized) {
      return;
    }
    undoStack.push(serialized);
    if (undoStack.length > MAX_HISTORY_STEPS) {
      undoStack.shift();
    }
    redoStack = [];
    updateUndoRedoButtons();
  } catch (e) {
    console.warn('Undo snapshot warning:', e);
  }
}

function performUndo() {
  if (undoStack.length === 0) return;
  try {
    redoStack.push(JSON.stringify(appState));
    const prev = undoStack.pop();
    appState = normalizeStateShape(JSON.parse(prev));
    saveState(true);
    renderEditorForm();
    renderA4Sheet();
    updateUndoRedoButtons();
    showToast('↶ Undid last change');
  } catch (e) {
    console.warn('Undo error:', e);
  }
}

function performRedo() {
  if (redoStack.length === 0) return;
  try {
    undoStack.push(JSON.stringify(appState));
    const next = redoStack.pop();
    appState = normalizeStateShape(JSON.parse(next));
    saveState(true);
    renderEditorForm();
    renderA4Sheet();
    updateUndoRedoButtons();
    showToast('↷ Redid change');
  } catch (e) {
    console.warn('Redo error:', e);
  }
}

function updateUndoRedoButtons() {
  const undoBtn = document.getElementById('btn-canvas-undo');
  const redoBtn = document.getElementById('btn-canvas-redo');
  if (undoBtn) undoBtn.disabled = undoStack.length === 0;
  if (redoBtn) redoBtn.disabled = redoStack.length === 0;
}

const VALID_TEMPLATE_IDS = new Set(TEMPLATES.map((t) => t.id));
const DEFAULT_FAVORITE_TEMPLATE_IDS = ['royal-sindoor-gold', 'regional-marathi-paithani-peacock', 'emerald-gold-arabesque'];

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter((id) => VALID_TEMPLATE_IDS.has(id));
        if (valid.length > 0 || parsed.length === 0) {
          return new Set(valid);
        }
      }
    }
  } catch (e) {
    console.warn('Could not load favorite templates:', e);
  }
  return new Set(DEFAULT_FAVORITE_TEMPLATE_IDS);
}

function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...favoriteTemplateIds]));
  } catch (e) {
    console.warn('Could not save favorite templates:', e);
  }
}

function toggleFavoriteTemplate(tplId) {
  if (favoriteTemplateIds.has(tplId)) {
    favoriteTemplateIds.delete(tplId);
    showToast('Removed template from Favorites');
  } else {
    favoriteTemplateIds.add(tplId);
    showToast('Saved template to Favorites ♥');
  }
  saveFavorites();
  updateGalleryBadges();
  renderFullTemplateGallery();
}

function toggleCompareTemplate(tplId) {
  const idx = compareTemplateIds.indexOf(tplId);
  if (idx !== -1) {
    compareTemplateIds.splice(idx, 1);
    showToast('Removed template from comparison');
  } else {
    if (compareTemplateIds.length >= 3) {
      compareTemplateIds.shift();
    }
    compareTemplateIds.push(tplId);
    showToast(`Added "${getTemplateById(tplId).name}" to comparison (${compareTemplateIds.length}/3)`);
  }
  updateGalleryBadges();
  renderFullTemplateGallery();
}

function updateCompareFloatingDock() {
  const dock = document.getElementById('compare-floating-dock');
  const countEl = document.getElementById('compare-dock-count');
  const pillsEl = document.getElementById('compare-dock-pills');
  if (!dock) return;

  const isPreviewModalOpen = !document.getElementById('template-preview-modal')?.classList.contains('hidden');
  const isCompareModalOpen = !document.getElementById('template-compare-modal')?.classList.contains('hidden');

  if (compareTemplateIds.length === 0 || isPreviewModalOpen || isCompareModalOpen) {
    dock.classList.add('hidden');
    return;
  }

  dock.classList.remove('hidden');
  if (countEl) {
    countEl.textContent = String(compareTemplateIds.length);
  }
  if (pillsEl) {
    pillsEl.innerHTML = compareTemplateIds
      .map((id) => {
        const t = getTemplateById(id);
        return `
          <span class="compare-dock-pill">
            <span class="swatch-dot" style="background:${t.primary};border-color:${t.secondary};"></span>
            <span>${escapeHtml(t.name)}</span>
            <button type="button" class="compare-dock-pill-remove" data-dock-remove-tpl="${escapeHtml(t.id)}" title="Remove ${escapeHtml(t.name)}">&times;</button>
          </span>`;
      })
      .join('');

    pillsEl.querySelectorAll('[data-dock-remove-tpl]').forEach((btn) => {
      btn.addEventListener('click', () => {
        toggleCompareTemplate(btn.getAttribute('data-dock-remove-tpl'));
      });
    });
  }
}

function updateGalleryBadges() {
  const favBadge = document.getElementById('favorites-count-badge');
  if (favBadge) favBadge.textContent = String(favoriteTemplateIds.size);

  const cmpBadge = document.getElementById('compare-count-badge');
  if (cmpBadge) cmpBadge.textContent = String(compareTemplateIds.length);

  const stripCmpBadge = document.getElementById('strip-compare-count');
  if (stripCmpBadge) {
    stripCmpBadge.textContent = compareTemplateIds.length > 0 ? String(compareTemplateIds.length) : '2';
  }

  updateCompareFloatingDock();
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2800);
}

/**
 * Injects all 18 HTML5 <datalist> autocomplete lists into the document once
 */
function renderDatalists() {
  const container = document.getElementById('datalist-container');
  if (!container) return;
  let html = '';
  for (const [key, values] of Object.entries(DATALIST_OPTIONS)) {
    html += `<datalist id="dl-${key}">`;
    for (const val of values) {
      html += `<option value="${escapeHtml(val)}"></option>`;
    }
    html += `</datalist>`;
  }
  container.innerHTML = html;
}

/**
 * Renders the Live A4 Biodata Sheet (<16ms synchronous DOM update on every keystroke)
 * Uses the universal renderer (`src/templates/renderer.js`)
 */
function renderA4Sheet() {
  const sheetEl = document.getElementById('biodata-a4-sheet');
  if (!sheetEl) return;

  const rendered = renderSheetIntoElement(sheetEl, appState);
  const pageCount = rendered.pageCount || 1;

  sheetEl.classList.toggle('is-inline-edit-enabled', isInlineEditEnabled);
  sheetEl.querySelectorAll('[data-inline-type]').forEach((el) => {
    if (isInlineEditEnabled) {
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false');
    } else {
      el.removeAttribute('contenteditable');
    }
  });

  if (selectedStickerInstanceId) {
    const activeStickerEl = sheetEl.querySelector(
      `.canvas-sticker-item[data-sticker-instance-id="${selectedStickerInstanceId}"]`
    );
    activeStickerEl?.classList.add('is-selected');
  }

  const pageDimBadge = document.getElementById('active-page-dimension-badge');
  if (pageDimBadge) {
    pageDimBadge.textContent =
      pageCount === 2
        ? 'A4 Print Standard (210 × 297 mm • 2 Pages Comprehensive)'
        : 'A4 Print Standard (210 × 297 mm • 1 Page)';
  }

  const kundaliQuickBtn = document.getElementById('btn-quick-toggle-kundali');
  if (kundaliQuickBtn) {
    const isKundaliOn =
      Boolean(appState.kundali?.enabled) ||
      (appState.formatting?.layoutOverride || getTemplateById(appState.templateId).layout) === 'kundali-horoscope-focus';
    kundaliQuickBtn.classList.toggle('active', isKundaliOn);
  }

  const stickersCountBadge = document.getElementById('active-stickers-count');
  if (stickersCountBadge) {
    stickersCountBadge.textContent = String((appState.canvasStickers || []).length);
  }

  updatePreviewViewportScale();
}

/**
 * Computes current scale factor for the 794px A4 sheet stage across desktop, compact windows, and mobile
 */
function getCurrentCanvasScale() {
  const stage = document.getElementById('a4-preview-stage');
  if (canvasZoomMode !== 'auto') {
    const parsed = parseFloat(canvasZoomMode);
    if (!Number.isNaN(parsed) && parsed > 0.2) return parsed;
  }
  const viewportWidth = typeof window !== 'undefined' && window.innerWidth ? window.innerWidth : 1024;
  const stageRectWidth = stage?.getBoundingClientRect?.().width || stage?.clientWidth || viewportWidth;
  // Clamp stage width by viewportWidth so flex/grid overflow can never push scale off-screen
  const maxStageWidth = Math.max(260, viewportWidth - (viewportWidth <= 640 ? 16 : 32));
  const effectiveStageWidth = Math.min(stageRectWidth > 0 ? stageRectWidth : maxStageWidth, maxStageWidth);
  const stageHorizontalPadding = viewportWidth <= 480 ? 12 : viewportWidth <= 860 ? 16 : 24;
  const availableWidth = Math.max(248, effectiveStageWidth - stageHorizontalPadding);
  return Math.min(1, Math.max(0.31, availableWidth / 794));
}

/**
 * Dynamically scales any open Modal A4 Sheets (#modal-biodata-sheet and .compare-scaled-sheet)
 * so every A4 sheet remains strictly 794px x 1123px in layout geometry and scales proportionally as a whole unit.
 */
function scaleModalA4Sheets() {
  // 1. Single Template Full Preview Modal
  const previewModal = document.getElementById('template-preview-modal');
  const modalSheet = document.getElementById('modal-biodata-sheet');
  const modalHolder = document.getElementById('modal-a4-scale-holder');
  const modalStageWrap = modalHolder?.parentElement || modalSheet?.parentElement;

  if (modalSheet && modalStageWrap && previewModal && !previewModal.classList.contains('hidden')) {
    const wrapW = Math.max(240, (modalStageWrap.clientWidth || window.innerWidth || 800) - 24);
    const modalScale = Math.min(1, Math.max(0.28, wrapW / 794));
    const isTwoPage = modalSheet.classList.contains('biodata-sheet-two-page');
    const naturalH = isTwoPage ? Math.max(modalSheet.offsetHeight || 2274, 2274) : 1123;

    if (modalHolder) {
      modalHolder.style.width = `${Math.round(794 * modalScale)}px`;
      modalHolder.style.height = `${Math.round(naturalH * modalScale)}px`;
    }
    modalSheet.style.transformOrigin = 'top left';
    modalSheet.style.transform = `scale(${modalScale})`;
  }

  // 2. Side-by-Side Template Comparison Modal (Desktop & Mobile 2-Column Grid)
  const compareModal = document.getElementById('template-compare-modal');
  const compareGrid = document.getElementById('compare-modal-grid');
  if (compareModal && compareGrid && !compareModal.classList.contains('hidden')) {
    compareGrid.querySelectorAll('.compare-sheet-viewport').forEach((viewportEl) => {
      const holderEl = viewportEl.querySelector('.compare-scale-holder');
      const sheetEl = viewportEl.querySelector('.biodata-a4-sheet');
      if (!sheetEl) return;

      const rectW = viewportEl.getBoundingClientRect?.().width || viewportEl.clientWidth || 160;
      const availableW = Math.max(115, rectW - 12);
      const cmpScale = Math.min(0.55, Math.max(0.135, availableW / 794));
      const isTwoPage = sheetEl.classList.contains('biodata-sheet-two-page');
      const naturalH = isTwoPage ? Math.max(sheetEl.offsetHeight || 2274, 2274) : 1123;

      if (holderEl) {
        holderEl.style.width = `${Math.round(794 * cmpScale)}px`;
        holderEl.style.height = `${Math.round(naturalH * cmpScale)}px`;
      }
      sheetEl.style.margin = '0';
      sheetEl.style.transformOrigin = 'top left';
      sheetEl.style.transform = `scale(${cmpScale})`;
    });
  }
}

/**
 * Scales the 794x1123 (or 2-page) A4 preview smoothly inside the preview stage at any screen width
 */
function updatePreviewViewportScale() {
  const stage = document.getElementById('a4-preview-stage');
  const holder = document.getElementById('a4-scale-holder');
  const sheetEl = document.getElementById('biodata-a4-sheet');
  if (!stage || !holder) return;

  const tpl = getTemplateById(appState.templateId);
  const effectiveLayout = appState.formatting?.layoutOverride || tpl.layout;
  const pageCount = tpl.pageCount === 2 || effectiveLayout === 'two-page-comprehensive' ? 2 : 1;
  const rawHeight = pageCount === 2 ? Math.max(sheetEl?.offsetHeight || 2274, 2274) : 1123;

  const scale = getCurrentCanvasScale();
  const scaledWidth = Math.round(794 * scale);
  const scaledHeight = Math.round(rawHeight * scale);

  // Set holder to the exact scaled bounding box so flexbox centers it accurately on mobile & small screens
  holder.style.transform = 'none';
  holder.style.width = `${scaledWidth}px`;
  holder.style.height = `${scaledHeight}px`;

  if (sheetEl) {
    sheetEl.style.transformOrigin = 'top left';
    sheetEl.style.transform = `scale(${scale})`;
  }

  scaleModalA4Sheets();
}

/**
 * Renders the Left Editor Panel (Form Sections, Sacred Header, Photo Studio, Design Controls & Studio)
 */
function renderEditorForm() {
  renderTopQuickSelectors();
  renderHeaderAndPhotoEditor();
  renderSectionsEditor();
  renderDesignAndFormatEditor();
  renderCanvaStudioEditor();
  renderQuickTemplateStrip();
  renderGalleryFilterControls();
  renderFullTemplateGallery();
  updateGalleryBadges();
  updateUndoRedoButtons();
}

function renderTopQuickSelectors() {
  const activePresetId = appState.presetId || 'hindu_bride';
  const presetSelect = document.getElementById('community-preset-select');
  if (presetSelect) {
    presetSelect.innerHTML =
      `<option value="">— Select Cultural / Community Preset —</option>` +
      COMMUNITY_PRESETS.map(
        (p) =>
          `<option value="${escapeHtml(p.id)}" ${activePresetId === p.id ? 'selected' : ''}>${escapeHtml(p.name)} (${escapeHtml(p.badge)})</option>`
      ).join('');
    presetSelect.value = activePresetId;
  }

  const brideBtn = document.getElementById('btn-sample-bride');
  const groomBtn = document.getElementById('btn-sample-groom');
  if (brideBtn) brideBtn.classList.toggle('active', activePresetId === 'hindu_bride');
  if (groomBtn) groomBtn.classList.toggle('active', activePresetId === 'hindu_groom');

  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.innerHTML = SUPPORTED_LANGUAGES.map(
      (l) =>
        `<option value="${escapeHtml(l.code)}" ${appState.language === l.code ? 'selected' : ''}>
          ${escapeHtml(l.name)} (${escapeHtml(l.nativeName)})
        </option>`
    ).join('');
  }
}

function renderHeaderAndPhotoEditor() {
  const emblemGrid = document.getElementById('emblem-selector-grid');
  if (emblemGrid) {
    emblemGrid.innerHTML = EMBLEMS.map((emb) => {
      const isActive = appState.emblemId === emb.id && !appState.customEmblemDataUrl;
      return `
        <button type="button" class="emblem-option-btn ${isActive ? 'active' : ''}" data-emblem-id="${escapeHtml(emb.id)}">
          ${emb.svg('#8B1E2F')}
          <span>${escapeHtml(emb.name)}</span>
        </button>`;
    }).join('');

    emblemGrid.querySelectorAll('[data-emblem-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        pushUndoSnapshot();
        const id = btn.getAttribute('data-emblem-id');
        appState.emblemId = id;
        appState.customEmblemDataUrl = null;
        appState.showEmblem = id !== 'none';
        const embObj = EMBLEMS.find((e) => e.id === id);
        if (embObj && embObj.defaultInvocation && (!appState.invocationLines || !appState.invocationLines[0])) {
          appState.invocationLines = [embObj.defaultInvocation];
        }
        saveState();
        renderHeaderAndPhotoEditor();
        renderA4Sheet();
      });
    });
  }

  const invInput1 = document.getElementById('invocation-line-1');
  if (invInput1) {
    invInput1.value = (appState.invocationLines && appState.invocationLines[0]) || '';
  }
  const docTitleInput = document.getElementById('doc-title-input');
  if (docTitleInput) {
    docTitleInput.value = appState.docTitle || 'MARRIAGE BIODATA';
  }
  const showTitleCheck = document.getElementById('show-doc-title-check');
  if (showTitleCheck) {
    showTitleCheck.checked = appState.showDocTitle !== false;
  }

  const thumbImg = document.getElementById('editor-photo-thumb');
  if (thumbImg && appState.photo?.dataUrl) {
    thumbImg.src = appState.photo.dataUrl;
  }
  const showPhotoCheck = document.getElementById('show-photo-check');
  if (showPhotoCheck) {
    showPhotoCheck.checked = appState.photo?.show !== false;
  }

  const shapeContainer = document.getElementById('photo-shape-pills');
  if (shapeContainer) {
    const shapes = [
      { id: 'rounded-rect', label: 'Rounded Portrait' },
      { id: 'arch', label: 'Royal Arch' },
      { id: 'circle', label: 'Circle' },
      { id: 'gold-ring', label: 'Double Gold Ring' },
      { id: 'octagon', label: 'Octagon' },
      { id: 'square', label: 'Classic Square' }
    ];
    shapeContainer.innerHTML = shapes
      .map(
        (s) =>
          `<button type="button" class="btn-chip ${appState.photo?.shape === s.id ? 'active' : ''}" data-photo-shape="${s.id}">
            ${s.label}
          </button>`
      )
      .join('');

    shapeContainer.querySelectorAll('[data-photo-shape]').forEach((btn) => {
      btn.addEventListener('click', () => {
        pushUndoSnapshot();
        appState.photo.shape = btn.getAttribute('data-photo-shape');
        saveState();
        renderHeaderAndPhotoEditor();
        renderA4Sheet();
      });
    });
  }
}

/**
 * Renders all Biodata Sections, Fields, Inline Rename, Reorder, Visibility & 1-Click Add Pills
 */
function renderSectionsEditor() {
  const container = document.getElementById('sections-editor-container');
  if (!container) return;

  container.innerHTML = (appState.sections || [])
    .map((sec, secIdx) => {
      const pills = OPTIONAL_FIELD_PILLS[sec.id] || [];
      const existingKeys = new Set((sec.fields || []).map((f) => f.key));
      const availablePills = pills.filter((p) => !existingKeys.has(p.key));

      const currentYear = new Date().getFullYear();
      const dobMinYear = 1950;
      const dobMaxYear = Math.max(2008, currentYear - 18);

      const fieldsHtml = (sec.fields || [])
        .map((field, fIdx) => {
          const isDob = field.key === 'dob';
          const dlAttr = field.datalist ? `list="dl-${escapeHtml(field.datalist)}"` : '';
          let dobSelectorsHtml = '';
          if (isDob) {
            const dobParts = parseDobParts(field.value);
            const dayOptions = ['<option value="">DD</option>']
              .concat(
                Array.from({ length: 31 }, (_, i) => {
                  const d = String(i + 1).padStart(2, '0');
                  return `<option value="${d}" ${dobParts.day === d ? 'selected' : ''}>${d}</option>`;
                })
              )
              .join('');
            const monthOptions = ['<option value="">MMM</option>']
              .concat(
                DOB_MONTHS.map(
                  (m) => `<option value="${m}" ${dobParts.month === m ? 'selected' : ''}>${m}</option>`
                )
              )
              .join('');
            const years = [];
            for (let y = dobMaxYear; y >= dobMinYear; y--) {
              const ys = String(y);
              years.push(`<option value="${ys}" ${dobParts.year === ys ? 'selected' : ''}>${ys}</option>`);
            }
            const yearOptions = ['<option value="">YYYY</option>'].concat(years).join('');

            dobSelectorsHtml = `
              <div class="dob-select-group" title="Select Day, Month & Year — Age calculates automatically">
                <select class="dob-part-select dob-day-select" aria-label="Birth Day" data-action="select-dob-part" data-dob-part="day" data-sec-idx="${secIdx}" data-field-idx="${fIdx}">${dayOptions}</select>
                <select class="dob-part-select dob-month-select" aria-label="Birth Month" data-action="select-dob-part" data-dob-part="month" data-sec-idx="${secIdx}" data-field-idx="${fIdx}">${monthOptions}</select>
                <select class="dob-part-select dob-year-select" aria-label="Birth Year" data-action="select-dob-part" data-dob-part="year" data-sec-idx="${secIdx}" data-field-idx="${fIdx}">${yearOptions}</select>
              </div>`;
          }
          return `
            <div class="field-row ${field.visible === false ? 'field-disabled' : ''} ${isDob ? 'field-row-dob' : ''}" data-sec-idx="${secIdx}" data-field-idx="${fIdx}">
              <input
                type="text"
                class="field-label-input"
                value="${escapeHtml(field.label)}"
                aria-label="Field Label"
                data-action="edit-field-label"
                data-sec-idx="${secIdx}"
                data-field-idx="${fIdx}"
              />
              <div class="field-value-wrapper ${isDob ? 'field-value-wrapper-dob' : ''}">
                ${dobSelectorsHtml}
                <input
                  type="text"
                  class="field-value-input"
                  value="${escapeHtml(field.value)}"
                  placeholder="Enter ${escapeHtml(field.label)}..."
                  aria-label="${escapeHtml(field.label)}"
                  ${dlAttr}
                  data-action="edit-field-value"
                  data-sec-idx="${secIdx}"
                  data-field-idx="${fIdx}"
                />
              </div>
              <div class="field-row-actions">
                <button type="button" class="btn-icon" title="Move Up" data-action="move-field-up" data-sec-idx="${secIdx}" data-field-idx="${fIdx}">↑</button>
                <button type="button" class="btn-icon" title="Move Down" data-action="move-field-down" data-sec-idx="${secIdx}" data-field-idx="${fIdx}">↓</button>
                <button type="button" class="btn-icon" title="${field.visible === false ? 'Show Field' : 'Hide Field'}" data-action="toggle-field-vis" data-sec-idx="${secIdx}" data-field-idx="${fIdx}">
                  ${field.visible === false ? '🚫' : '👁'}
                </button>
                <button type="button" class="btn-icon danger" title="Remove Field" data-action="delete-field" data-sec-idx="${secIdx}" data-field-idx="${fIdx}">&times;</button>
              </div>
            </div>`;
        })
        .join('');

      const pillsHtml =
        availablePills.length > 0
          ? `<div class="quick-pills-tray">
               <span class="quick-pills-label">+ Quick Add:</span>
               ${availablePills
                 .map(
                   (p) =>
                     `<button type="button" class="pill-add-btn" data-action="quick-add-pill" data-sec-idx="${secIdx}" data-pill-key="${escapeHtml(p.key)}">+ ${escapeHtml(p.label)}</button>`
                 )
                 .join('')}
               <button type="button" class="pill-add-btn" data-action="add-custom-field" data-sec-idx="${secIdx}">+ Custom Field</button>
             </div>`
          : `<div class="quick-pills-tray">
               <button type="button" class="pill-add-btn" data-action="add-custom-field" data-sec-idx="${secIdx}">+ Add Custom Field</button>
             </div>`;

      return `
        <div class="section-block ${sec.visible === false ? 'section-disabled' : ''}" data-sec-idx="${secIdx}">
          <div class="section-block-header">
            <input
              type="text"
              class="section-title-input"
              value="${escapeHtml(sec.title)}"
              aria-label="Section Title"
              data-action="edit-sec-title"
              data-sec-idx="${secIdx}"
            />
            <div class="section-actions">
              <button type="button" class="btn-chip" data-action="toggle-sec-vis" data-sec-idx="${secIdx}">
                ${sec.visible === false ? 'Hidden (Click to Show)' : 'Visible'}
              </button>
              <button type="button" class="btn-icon" title="Move Section Up" data-action="move-sec-up" data-sec-idx="${secIdx}">↑</button>
              <button type="button" class="btn-icon" title="Move Section Down" data-action="move-sec-down" data-sec-idx="${secIdx}">↓</button>
              <button type="button" class="btn-icon danger" title="Delete Section" data-action="delete-sec" data-sec-idx="${secIdx}">&times;</button>
            </div>
          </div>
          <div class="fields-list">${fieldsHtml}</div>
          ${pillsHtml}
        </div>`;
    })
    .join('');
}

/**
 * Renders Tab 3: Design, Typography, Structural Mix-and-Match & 4-Way Color Studio
 */
function renderDesignAndFormatEditor() {
  const fmt = appState.formatting || {};
  const tpl = getTemplateById(appState.templateId);

  const fontSelect = document.getElementById('font-pair-select');
  if (fontSelect) fontSelect.value = fmt.fontPair || tpl.fontPair || 'classic';

  const layoutOverrideSelect = document.getElementById('layout-override-select');
  if (layoutOverrideSelect) layoutOverrideSelect.value = fmt.layoutOverride || '';

  const borderOverrideSelect = document.getElementById('border-override-select');
  if (borderOverrideSelect) {
    if (borderOverrideSelect.options.length <= 1) {
      borderOverrideSelect.innerHTML =
        `<option value="">Default Template Border Frame</option>` +
        SUPPORTED_BORDER_STYLES.map(
          (b) => `<option value="${escapeHtml(b)}">${escapeHtml(b.replace(/-/g, ' '))}</option>`
        ).join('');
    }
    borderOverrideSelect.value = fmt.borderStyleOverride || '';
  }

  const headerOverrideSelect = document.getElementById('header-style-override-select');
  if (headerOverrideSelect) headerOverrideSelect.value = fmt.headerStyleOverride || '';

  const fontScaleRange = document.getElementById('font-scale-range');
  const fontScaleVal = document.getElementById('font-scale-val');
  if (fontScaleRange) fontScaleRange.value = String(fmt.fontScale || 100);
  if (fontScaleVal) fontScaleVal.textContent = `${fmt.fontScale || 100}%`;

  const lineSpaceRange = document.getElementById('line-spacing-range');
  const lineSpaceVal = document.getElementById('line-spacing-val');
  if (lineSpaceRange) lineSpaceRange.value = String(fmt.lineSpacing || 100);
  if (lineSpaceVal) lineSpaceVal.textContent = `${fmt.lineSpacing || 100}%`;

  const padRange = document.getElementById('page-padding-range');
  const padVal = document.getElementById('page-padding-val');
  if (padRange) padRange.value = String(fmt.pagePadding || 100);
  if (padVal) padVal.textContent = `${fmt.pagePadding || 100}%`;

  const photoSizeRange = document.getElementById('photo-size-range');
  const photoSizeVal = document.getElementById('photo-size-val');
  if (photoSizeRange) photoSizeRange.value = String(appState.photo?.size || 100);
  if (photoSizeVal) photoSizeVal.textContent = `${appState.photo?.size || 100}%`;

  const labelWidthRange = document.getElementById('label-width-range');
  const labelWidthVal = document.getElementById('label-width-val');
  if (labelWidthRange) labelWidthRange.value = String(fmt.labelWidthPercent || 36);
  if (labelWidthVal) labelWidthVal.textContent = `${fmt.labelWidthPercent || 36}%`;

  const autoFitCheck = document.getElementById('autofit-single-page-check');
  if (autoFitCheck) autoFitCheck.checked = fmt.autoFitSinglePage !== false;

  const customColorInput = document.getElementById('custom-accent-color');
  if (customColorInput) {
    customColorInput.value = fmt.customAccentColor || tpl.primary || '#9B1C31';
  }
  const customSecInput = document.getElementById('custom-secondary-color');
  if (customSecInput) {
    customSecInput.value = fmt.customSecondaryColor || tpl.secondary || '#C89D3C';
  }
  const customPaperInput = document.getElementById('custom-paper-color');
  if (customPaperInput) {
    customPaperInput.value = fmt.customPaperColor || tpl.paperBg || '#FFFDF9';
  }
  const customTextInput = document.getElementById('custom-text-color');
  if (customTextInput) {
    customTextInput.value = fmt.customTextColor || tpl.textMain || '#1F1614';
  }
}

/**
 * Renders Tab 4: ✨ Canva Studio (Stickers, Vedic Kundali Chart, Paper Texture, Watermark, Photo Filters)
 */
function renderCanvaStudioEditor() {
  const tpl = getTemplateById(appState.templateId);
  const fmt = appState.formatting || {};
  const primary = fmt.customAccentColor || tpl.primary || '#8B1D2C';
  const secondary = fmt.customSecondaryColor || tpl.secondary || '#C89D3C';

  // 1. Sticker Category Tabs & Picker Grid
  const catTabs = document.getElementById('sticker-category-tabs');
  if (catTabs) {
    catTabs.querySelectorAll('[data-sticker-cat]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-sticker-cat') === activeStickerCategory);
    });
  }

  const stickerGrid = document.getElementById('sticker-picker-grid');
  if (stickerGrid) {
    const visibleStickers =
      activeStickerCategory === 'all'
        ? CANVA_STICKERS
        : CANVA_STICKERS.filter((s) => s.category === activeStickerCategory);

    stickerGrid.innerHTML = visibleStickers
      .map(
        (s) => `
        <button type="button" class="sticker-card-btn" data-add-sticker-id="${escapeHtml(s.id)}" title="Click to add ${escapeHtml(s.name)} to A4 sheet">
          <div class="sticker-card-thumb">${s.svg(primary, secondary)}</div>
          <span class="sticker-card-label">${escapeHtml(s.name)}</span>
        </button>`
      )
      .join('');

    stickerGrid.querySelectorAll('[data-add-sticker-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const stickerId = btn.getAttribute('data-add-sticker-id');
        addStickerToCanvas(stickerId);
      });
    });
  }

  const stickersCountBadge = document.getElementById('active-stickers-count');
  if (stickersCountBadge) {
    stickersCountBadge.textContent = String((appState.canvasStickers || []).length);
  }

  // 2. Vedic Kundali / Rashi Chart Controls & 12 Houses Grid
  const kundali = appState.kundali || {};
  const kundaliCheck = document.getElementById('kundali-enabled-check');
  if (kundaliCheck) kundaliCheck.checked = Boolean(kundali.enabled);

  const kundaliStyleSelect = document.getElementById('kundali-style-select');
  if (kundaliStyleSelect) kundaliStyleSelect.value = kundali.style || 'north-indian';

  const kundaliTitleInput = document.getElementById('kundali-title-input');
  if (kundaliTitleInput) kundaliTitleInput.value = kundali.title || 'Janam Kundali / Rashi Chart';

  const kundaliSubInput = document.getElementById('kundali-subtitle-input');
  if (kundaliSubInput) kundaliSubInput.value = kundali.subtitle || 'Lagna / Ascendant Chart';

  const housesGrid = document.getElementById('kundali-houses-grid');
  if (housesGrid) {
    const houses = Array.isArray(kundali.houses) && kundali.houses.length === 12
      ? kundali.houses
      : KUNDALI_PRESETS[0].houses;

    housesGrid.innerHTML = houses
      .map(
        (val, idx) => `
        <div class="kundali-house-cell">
          <label for="kundali-house-${idx}">House ${idx + 1} (Bhava ${idx + 1})</label>
          <input
            type="text"
            id="kundali-house-${idx}"
            data-kundali-house-idx="${idx}"
            value="${escapeHtml(val)}"
            placeholder="e.g., Su, Me"
          />
        </div>`
      )
      .join('');
  }

  // 3. Paper Texture & Center Watermark Controls
  const texSelect = document.getElementById('paper-texture-select');
  if (texSelect) {
    if (texSelect.options.length === 0) {
      texSelect.innerHTML = PAPER_TEXTURES.map(
        (pt) => `<option value="${escapeHtml(pt.id)}">${escapeHtml(pt.name)} — ${escapeHtml(pt.description)}</option>`
      ).join('');
    }
    texSelect.value = fmt.paperTexture || 'none';
  }

  const wmSelect = document.getElementById('watermark-mode-select');
  if (wmSelect) {
    if (wmSelect.options.length === 0) {
      wmSelect.innerHTML = WATERMARK_MODES.map(
        (wm) => `<option value="${escapeHtml(wm.id)}">${escapeHtml(wm.name)}</option>`
      ).join('');
    }
    wmSelect.value = fmt.watermarkMode || 'none';
  }

  const wmTextInput = document.getElementById('watermark-text-input');
  if (wmTextInput) wmTextInput.value = fmt.watermarkText || '';

  const wmOpacityRange = document.getElementById('watermark-opacity-range');
  const wmOpacityVal = document.getElementById('watermark-opacity-val');
  if (wmOpacityRange) wmOpacityRange.value = String(fmt.watermarkOpacity || 7);
  if (wmOpacityVal) wmOpacityVal.textContent = `${fmt.watermarkOpacity || 7}%`;

  // 4. Photo Studio Filter Sliders
  const photo = appState.photo || {};
  const setRangeUI = (rangeId, valId, val, suffix = '%') => {
    const r = document.getElementById(rangeId);
    const v = document.getElementById(valId);
    if (r) r.value = String(val);
    if (v) v.textContent = `${val}${suffix}`;
  };
  setRangeUI('photo-brightness-range', 'photo-brightness-val', photo.brightness ?? 100, '%');
  setRangeUI('photo-contrast-range', 'photo-contrast-val', photo.contrast ?? 100, '%');
  setRangeUI('photo-saturation-range', 'photo-saturation-val', photo.saturation ?? 100, '%');
  setRangeUI('photo-warmth-range', 'photo-warmth-val', photo.warmth ?? 0, '%');
  setRangeUI('photo-border-width-range', 'photo-border-width-val', photo.borderWidth ?? 2.5, 'px');

  const photoShadowCheck = document.getElementById('photo-shadow-check');
  if (photoShadowCheck) photoShadowCheck.checked = photo.shadow !== false;
}

/**
 * Adds a vector sticker from `CANVA_STICKERS` onto `appState.canvasStickers`
 */
function addStickerToCanvas(stickerId) {
  const def = CANVA_STICKERS.find((s) => s.id === stickerId);
  if (!def) return;
  pushUndoSnapshot();
  if (!Array.isArray(appState.canvasStickers)) {
    appState.canvasStickers = [];
  }
  const offsetIndex = appState.canvasStickers.length % 6;
  const instance = {
    instanceId: `stk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    stickerId: def.id,
    x: Math.min(88, Math.max(12, 76 + (offsetIndex % 3) * 4 - 4)),
    y: Math.min(88, Math.max(10, 12 + Math.floor(offsetIndex / 3) * 10 + offsetIndex * 2)),
    scale: 1,
    rotation: 0,
    opacity: 0.96
  };
  appState.canvasStickers.push(instance);
  selectedStickerInstanceId = instance.instanceId;
  saveState();
  renderA4Sheet();
  showToast(`Added "${def.name}" to A4 sheet — drag to position`);
}

/**
 * Adds a custom text badge / ribbon / wax seal sticker onto `appState.canvasStickers`
 */
function addCustomBadgeToCanvas() {
  const textInput = document.getElementById('custom-badge-text');
  const shapeSelect = document.getElementById('custom-badge-shape');
  const bgInput = document.getElementById('custom-badge-bg');
  const fgInput = document.getElementById('custom-badge-fg');

  const text = (textInput?.value || 'Shubh Vivah').trim() || 'Shubh Vivah';
  const badgeShape = shapeSelect?.value || 'ribbon';
  const bg = bgInput?.value || '#8b1d2c';
  const fg = fgInput?.value || '#f6d88c';

  pushUndoSnapshot();
  if (!Array.isArray(appState.canvasStickers)) {
    appState.canvasStickers = [];
  }
  const instance = {
    instanceId: `stk_custom_${Date.now()}`,
    stickerId: 'custom-text-badge',
    customText: text,
    badgeShape,
    customColor: bg,
    customSecondary: fg,
    x: 50,
    y: 16,
    scale: 1,
    rotation: 0,
    opacity: 0.98
  };
  appState.canvasStickers.push(instance);
  selectedStickerInstanceId = instance.instanceId;
  saveState();
  renderA4Sheet();
  showToast(`Added "${text}" badge to A4 sheet — drag to move`);
}

/**
 * Renders the horizontal Quick Template Strip above the live preview
 */
function renderQuickTemplateStrip() {
  const strip = document.getElementById('template-pills-scroll');
  const activeNameEl = document.getElementById('active-template-name');
  const currentTpl = getTemplateById(appState.templateId);
  if (activeNameEl && currentTpl) {
    activeNameEl.textContent = `${currentTpl.name} (${currentTpl.subtitle})`;
  }
  if (!strip) return;

  if (strip.children.length === TEMPLATES.length) {
    strip.querySelectorAll('[data-select-tpl]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-select-tpl') === appState.templateId);
    });
    return;
  }

  strip.innerHTML = TEMPLATES.map((t) => {
    const isActive = t.id === appState.templateId;
    return `
      <button type="button" class="template-mini-pill ${isActive ? 'active' : ''}" data-select-tpl="${escapeHtml(t.id)}">
        <span class="swatch-dot" style="background:${t.primary};border-color:${t.secondary};"></span>
        <span>${escapeHtml(t.name)}</span>
      </button>`;
  }).join('');
}

/**
 * Updates the active card highlight in the gallery grid in-place without rebuilding all 24 SVG mini-previews
 */
function updateGalleryActiveSelectionUI() {
  const grid = document.getElementById('templates-gallery-grid');
  if (!grid) return;
  grid.querySelectorAll('[data-card-tpl]').forEach((card) => {
    const isSelected = card.getAttribute('data-card-tpl') === appState.templateId;
    card.classList.toggle('active', isSelected);
    const badgeEl = card.querySelector('.badge-free');
    if (badgeEl) badgeEl.textContent = isSelected ? 'Active' : 'Free';
    const applyBtn = card.querySelector('.btn-card-apply');
    if (applyBtn) {
      applyBtn.classList.toggle('active', isSelected);
      applyBtn.textContent = isSelected ? '✓ Applied' : 'Apply Template';
    }
  });
}

/**
 * Renders the Phase 6 Multi-Facet Filter Controls
 */
function renderGalleryFilterControls() {
  const catBar = document.getElementById('template-category-filters');
  if (catBar) {
    catBar.innerHTML = TEMPLATE_CATEGORIES.map(
      (cat) => `
        <button type="button" class="btn-chip ${galleryFilters.category === cat.id ? 'active' : ''}" data-filter-cat="${escapeHtml(cat.id)}">
          ${escapeHtml(cat.name)}
        </button>`
    ).join('');

    catBar.querySelectorAll('[data-filter-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        galleryFilters.category = btn.getAttribute('data-filter-cat');
        galleryVisibleLimit = 24;
        renderGalleryFilterControls();
        renderFullTemplateGallery();
      });
    });
  }

  const renderFacetRow = (containerId, options, stateKey, dataAttr) => {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = options
      .map(
        (opt) => `
        <button type="button" class="facet-pill ${String(galleryFilters[stateKey]) === String(opt.id) ? 'active' : ''}" ${dataAttr}="${escapeHtml(opt.id)}">
          ${opt.swatch ? `<span class="facet-color-dot" style="background:${opt.swatch}"></span>` : ''}
          <span>${escapeHtml(opt.name)}</span>
        </button>`
      )
      .join('');

    el.querySelectorAll(`[${dataAttr}]`).forEach((btn) => {
      btn.addEventListener('click', () => {
        galleryFilters[stateKey] = btn.getAttribute(dataAttr);
        galleryVisibleLimit = 24;
        renderGalleryFilterControls();
        renderFullTemplateGallery();
      });
    });
  };

  renderFacetRow('template-style-filters', TEMPLATE_STYLE_FILTERS, 'style', 'data-filter-style');
  renderFacetRow('template-color-filters', TEMPLATE_COLOR_FILTERS, 'colorFamily', 'data-filter-color');
  renderFacetRow('template-page-filters', TEMPLATE_PAGE_FILTERS, 'pageCount', 'data-filter-pages');
  renderFacetRow('template-photo-filters', TEMPLATE_PHOTO_FILTERS, 'photoSupport', 'data-filter-photo');

  const langFilter = document.getElementById('gallery-language-filter');
  if (langFilter) langFilter.value = galleryFilters.language;

  const sourceFilter = document.getElementById('gallery-source-filter');
  if (sourceFilter) sourceFilter.value = galleryFilters.sourcePath;

  const recentBtn = document.getElementById('btn-filter-recent');
  if (recentBtn) {
    recentBtn.classList.toggle('active', galleryFilters.recentlyAddedOnly);
    recentBtn.setAttribute('aria-pressed', String(galleryFilters.recentlyAddedOnly));
  }

  const favBtn = document.getElementById('btn-filter-favorites');
  if (favBtn) {
    favBtn.classList.toggle('active', galleryFilters.favoritesOnly);
    favBtn.setAttribute('aria-pressed', String(galleryFilters.favoritesOnly));
  }
}

/**
 * Renders the 242-Template Interactive Discovery Gallery with Live Engine Mini-Previews,
 * Progressive Batch Loading, Favorites, Preview Modal Trigger, and Compare Queue Trigger
 */
function renderFullTemplateGallery() {
  const grid = document.getElementById('templates-gallery-grid');
  const emptyState = document.getElementById('gallery-empty-state');
  const paginationBar = document.getElementById('gallery-pagination-bar');
  const summaryEl = document.getElementById('gallery-result-summary');
  if (!grid) return;

  const filtered = filterAndSearchTemplates(TEMPLATES, galleryFilters, favoriteTemplateIds);
  const visibleSlice = filtered.slice(0, galleryVisibleLimit);

  if (summaryEl) {
    summaryEl.textContent = `Showing ${visibleSlice.length} of ${filtered.length} matching templates (${TEMPLATES.length} total in library)`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    emptyState?.classList.remove('hidden');
    paginationBar?.classList.add('hidden');
    return;
  }

  emptyState?.classList.add('hidden');

  if (paginationBar) {
    if (visibleSlice.length < filtered.length) {
      paginationBar.classList.remove('hidden');
      const loadMoreBtn = document.getElementById('btn-load-more-templates');
      if (loadMoreBtn) {
        const remaining = filtered.length - visibleSlice.length;
        loadMoreBtn.textContent = `Load More Templates (+${Math.min(24, remaining)} of ${remaining} remaining)`;
      }
    } else {
      paginationBar.classList.add('hidden');
    }
  }

  let liveCandidateName = 'Aarav / Ananya';
  for (const sec of appState.sections || []) {
    for (const f of sec.fields || []) {
      if (f.key === 'full_name' && f.value) {
        liveCandidateName = f.value;
        break;
      }
    }
  }

  grid.innerHTML = visibleSlice
    .map((t) => {
      const isSelected = t.id === appState.templateId;
      const isFav = favoriteTemplateIds.has(t.id);
      const isCompared = compareTemplateIds.includes(t.id);

      const livePreviewMarkup = renderLiveTemplateMiniPreview(t, {
        candidateName: liveCandidateName,
        docTitle: appState.docTitle || 'MARRIAGE BIODATA',
        photoDataUrl: appState.photo?.show !== false ? appState.photo?.dataUrl : null
      });

      return `
        <article class="template-gallery-card ${isSelected ? 'active' : ''}" data-card-tpl="${escapeHtml(t.id)}">
          <div class="template-card-preview-wrap" data-apply-tpl="${escapeHtml(t.id)}" title="Click to apply ${escapeHtml(t.name)}">
            ${livePreviewMarkup}
            <div class="template-card-floating-badges">
              <span class="tpl-pill-badge">${t.pageCount === 2 ? '2 Pages' : '1 Page'}</span>
              <span class="tpl-pill-badge">${t.supportsPhoto === false ? 'No-Photo' : 'Photo'}</span>
              ${t.recentlyAdded ? '<span class="tpl-pill-badge badge-new">New</span>' : ''}
            </div>
          </div>

          <div class="template-card-meta">
            <div class="template-card-header-row">
              <div>
                <h3 class="template-card-title">${escapeHtml(t.name)}</h3>
                <p class="template-card-sub">${escapeHtml(t.subtitle)}</p>
              </div>
              <span class="badge-free">${isSelected ? 'Active' : 'Free'}</span>
            </div>

            <div class="template-card-specs">
              <span>Layout: <strong>${escapeHtml(t.layout)}</strong></span>
              <span>Frame: <strong>${escapeHtml(t.borderStyle)}</strong></span>
              <span>Font: <strong>${escapeHtml(t.fontPair || 'classic')}</strong></span>
            </div>

            <div class="template-card-actions">
              <button type="button" class="btn-chip btn-card-apply ${isSelected ? 'active' : ''}" data-apply-tpl="${escapeHtml(t.id)}">
                ${isSelected ? '✓ Applied' : 'Apply Template'}
              </button>
              <button type="button" class="btn-chip" data-preview-tpl="${escapeHtml(t.id)}" title="Full Live A4 Preview before applying">
                👁 Preview
              </button>
              <button type="button" class="btn-chip ${isCompared ? 'active' : ''}" data-compare-tpl="${escapeHtml(t.id)}" title="Add or remove from side-by-side comparison">
                ⚖ ${isCompared ? 'Selected' : 'Compare'}
              </button>
              ${
                isCompared
                  ? `<button type="button" class="btn-chip btn-compare-now" data-open-compare-now="${escapeHtml(t.id)}" title="Open real side-by-side preview comparison now">
                      Open Compare ↗
                    </button>`
                  : ''
              }
              <button type="button" class="btn-icon fav-toggle-btn ${isFav ? 'active' : ''}" data-fav-tpl="${escapeHtml(t.id)}" aria-label="Favorite ${escapeHtml(t.name)}" title="Save to Favorites">
                ${isFav ? '♥' : '♡'}
              </button>
            </div>
          </div>
        </article>`;
    })
    .join('');
}

/**
 * Opens the Full Template Preview Modal rendered with the user's real biodata
 */
function openTemplatePreviewModal(templateId) {
  const modal = document.getElementById('template-preview-modal');
  const sheetEl = document.getElementById('modal-biodata-sheet');
  const titleEl = document.getElementById('preview-modal-title');
  const subEl = document.getElementById('preview-modal-subtitle');
  const metaEl = document.getElementById('preview-modal-meta');
  if (!modal || !sheetEl) return;

  const tpl = getTemplateById(templateId);
  previewModalTemplateId = tpl.id;

  if (titleEl) titleEl.textContent = `${tpl.name} — Live Biodata Preview`;
  if (subEl) subEl.textContent = `${tpl.subtitle} • Layout: ${tpl.layout} • Frame: ${tpl.borderStyle} • ${tpl.pageCount} Page(s)`;

  if (metaEl) {
    metaEl.innerHTML = `
      <div class="preview-meta-pills">
        <span class="btn-chip">Category: <strong>${escapeHtml(tpl.category)}</strong></span>
        <span class="btn-chip">Style: <strong>${escapeHtml((tpl.styleTags || []).join(', '))}</strong></span>
        <span class="btn-chip">Color Family: <strong>${escapeHtml(tpl.colorFamily)}</strong></span>
        <span class="btn-chip">Font Pair: <strong>${escapeHtml(tpl.fontPair)}</strong></span>
        <span class="btn-chip">Header Style: <strong>${escapeHtml(tpl.headerStyle)}</strong></span>
      </div>
    `;
  }

  const favBtn = document.getElementById('btn-modal-toggle-favorite');
  if (favBtn) {
    const isFav = favoriteTemplateIds.has(tpl.id);
    favBtn.textContent = isFav ? '♥ Favorited' : '♡ Favorite';
    favBtn.classList.toggle('active', isFav);
  }

  const cmpBtn = document.getElementById('btn-modal-toggle-compare');
  if (cmpBtn) {
    const isCmp = compareTemplateIds.includes(tpl.id);
    cmpBtn.textContent = isCmp ? '⚖ In Comparison' : '⚖ Add to Compare';
    cmpBtn.classList.toggle('active', isCmp);
  }

  renderSheetIntoElement(sheetEl, appState, tpl);
  modal.classList.remove('hidden');
  updateCompareFloatingDock();
  scaleModalA4Sheets();
  requestAnimationFrame(scaleModalA4Sheets);
}

function closeTemplatePreviewModal() {
  document.getElementById('template-preview-modal')?.classList.add('hidden');
  previewModalTemplateId = null;
  updateCompareFloatingDock();
}

/**
 * Opens the Side-by-Side Template Comparison Modal (compares up to 3 templates with real user data)
 */
function openTemplateCompareModal() {
  const modal = document.getElementById('template-compare-modal');
  const grid = document.getElementById('compare-modal-grid');
  if (!modal || !grid) return;

  if (compareTemplateIds.length === 0) {
    const fallbackSecond =
      appState.templateId === 'regional-marathi-paithani-peacock'
        ? 'modern-executive-white'
        : 'regional-marathi-paithani-peacock';
    compareTemplateIds = [appState.templateId, fallbackSecond];
    updateGalleryBadges();
    renderFullTemplateGallery();
  } else if (compareTemplateIds.length === 1) {
    const singleId = compareTemplateIds[0];
    const partnerId =
      singleId !== appState.templateId
        ? appState.templateId
        : singleId === 'modern-executive-white'
        ? 'royal-sindoor-gold'
        : 'modern-executive-white';
    compareTemplateIds = [partnerId, singleId];
    updateGalleryBadges();
    renderFullTemplateGallery();
  }

  grid.innerHTML = compareTemplateIds
    .map((id, idx) => {
      const tpl = getTemplateById(id);
      const isCurrent = tpl.id === appState.templateId;
      return `
        <div class="compare-column-card">
          <div class="compare-column-header">
            <div>
              <h4>${escapeHtml(tpl.name)}</h4>
              <p>${escapeHtml(tpl.subtitle)} • ${escapeHtml(tpl.layout)} • ${tpl.pageCount}p</p>
            </div>
            <div class="compare-column-actions">
              <button type="button" class="export-btn primary-pdf" data-compare-apply="${escapeHtml(tpl.id)}">
                ${isCurrent ? '✓ Active' : 'Use This'}
              </button>
              <button type="button" class="btn-icon danger" data-compare-remove="${escapeHtml(tpl.id)}" title="Remove from comparison">✕</button>
            </div>
          </div>
          <div class="compare-sheet-viewport">
            <div class="compare-scale-holder" id="compare-holder-${idx}-${escapeHtml(tpl.id)}">
              <article class="biodata-a4-sheet compare-scaled-sheet" id="compare-sheet-${idx}-${escapeHtml(tpl.id)}"></article>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  compareTemplateIds.forEach((id, idx) => {
    const tpl = getTemplateById(id);
    const sheetEl = document.getElementById(`compare-sheet-${idx}-${tpl.id}`);
    if (sheetEl) {
      renderSheetIntoElement(sheetEl, appState, tpl);
      sheetEl.classList.add('compare-scaled-sheet');
    }
  });

  grid.querySelectorAll('[data-compare-apply]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tplId = btn.getAttribute('data-compare-apply');
      selectTemplate(tplId);
      closeTemplateCompareModal();
      document.getElementById('builder-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast(`Applied "${getTemplateById(tplId).name}" template`);
    });
  });

  grid.querySelectorAll('[data-compare-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tplId = btn.getAttribute('data-compare-remove');
      compareTemplateIds = compareTemplateIds.filter((x) => x !== tplId);
      updateGalleryBadges();
      renderFullTemplateGallery();
      if (compareTemplateIds.length === 0) {
        closeTemplateCompareModal();
      } else {
        openTemplateCompareModal();
      }
    });
  });

  modal.classList.remove('hidden');
  updateCompareFloatingDock();
  scaleModalA4Sheets();
  requestAnimationFrame(scaleModalA4Sheets);
}

function closeTemplateCompareModal() {
  document.getElementById('template-compare-modal')?.classList.add('hidden');
  updateCompareFloatingDock();
}

function selectTemplate(templateId) {
  pushUndoSnapshot();
  const tpl = getTemplateById(templateId);
  appState.templateId = tpl.id;
  appState.formatting.customAccentColor = '';
  appState.formatting.customSecondaryColor = '';
  appState.formatting.customPaperColor = '';
  appState.formatting.customTextColor = '';
  appState.formatting.layoutOverride = '';
  appState.formatting.borderStyleOverride = '';
  appState.formatting.headerStyleOverride = '';
  if (tpl.defaultPhotoShape && appState.photo) {
    appState.photo.shape = tpl.defaultPhotoShape;
  }
  if (tpl.fontPair) {
    appState.formatting.fontPair = tpl.fontPair;
  }
  if (tpl.supportsPhoto === false && appState.photo) {
    appState.photo.show = false;
  } else if (tpl.supportsPhoto !== false && appState.photo) {
    appState.photo.show = true;
  }
  saveState();
  renderHeaderAndPhotoEditor();
  renderDesignAndFormatEditor();
  renderCanvaStudioEditor();
  renderQuickTemplateStrip();
  updateGalleryActiveSelectionUI();
  renderA4Sheet();
}

/**
 * Non-destructive Language Switcher:
 * Translates section titles, document title, and standard field labels into the chosen language
 * while keeping every single user-entered field value intact.
 */
function switchLanguageNonDestructive(langCode) {
  pushUndoSnapshot();
  const dict = LANGUAGE_LABELS[langCode] || LANGUAGE_LABELS.en;
  appState.language = langCode;

  if (dict.docTitle) {
    appState.docTitle = dict.docTitle;
  }

  for (const sec of appState.sections || []) {
    if (dict.sections && dict.sections[sec.id]) {
      sec.title = dict.sections[sec.id];
    }
    for (const f of sec.fields || []) {
      if (dict.fields && dict.fields[f.key]) {
        f.label = dict.fields[f.key];
      }
    }
  }

  saveState();
  renderEditorForm();
  renderA4Sheet();
  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
  showToast(`Translated labels to ${langObj ? langObj.name : langCode} (your data is preserved)`);
}

function resetGalleryFilters() {
  galleryFilters.query = '';
  galleryFilters.category = 'all';
  galleryFilters.style = 'all';
  galleryFilters.colorFamily = 'all';
  galleryFilters.pageCount = 'all';
  galleryFilters.photoSupport = 'all';
  galleryFilters.language = 'all';
  galleryFilters.sourcePath = 'all';
  galleryFilters.recentlyAddedOnly = false;
  galleryFilters.favoritesOnly = false;
  galleryVisibleLimit = 24;

  const searchInput = document.getElementById('gallery-search-input');
  if (searchInput) searchInput.value = '';

  renderGalleryFilterControls();
  renderFullTemplateGallery();
}

function switchEditorTab(targetTabId) {
  document.querySelectorAll('[data-editor-tab]').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-editor-tab') === targetTabId);
  });
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    if (panel.id === `tab-${targetTabId}` || (targetTabId === 'details' && panel.id === 'sections-editor-container')) {
      panel.classList.remove('hidden');
    } else if (panel.id.startsWith('tab-')) {
      panel.classList.add('hidden');
    }
  });
}

/**
 * Binds Direct On-Canvas Inline Editing (`contenteditable`) and Interactive Sticker Drag/Resize/Rotate
 * directly on `#biodata-a4-sheet`
 */
function bindCanvaCanvasInteractions() {
  const sheetEl = document.getElementById('biodata-a4-sheet');
  const snapV = document.getElementById('snap-guide-v');
  const snapH = document.getElementById('snap-guide-h');
  if (!sheetEl) return;

  // 1. Direct On-Canvas Inline Text Editing (Syncs back to appState & Left Form without losing cursor!)
  sheetEl.addEventListener('focusin', (e) => {
    const inlineEl = e.target.closest('[data-inline-type]');
    if (inlineEl && isInlineEditEnabled) {
      pushUndoSnapshot();
    }
  });

  sheetEl.addEventListener('keydown', (e) => {
    const inlineEl = e.target.closest('[data-inline-type]');
    if (inlineEl && e.key === 'Enter') {
      e.preventDefault();
      inlineEl.blur();
    }
  });

  sheetEl.addEventListener('input', (e) => {
    const inlineEl = e.target.closest('[data-inline-type]');
    if (!inlineEl || !isInlineEditEnabled) return;

    const inlineType = inlineEl.getAttribute('data-inline-type');
    const newText = (inlineEl.textContent || '').replace(/\r?\n/g, ' ').trim();

    if (inlineType === 'invocation') {
      const idx = parseInt(inlineEl.getAttribute('data-inv-idx') || '0', 10);
      if (!Array.isArray(appState.invocationLines)) appState.invocationLines = [];
      appState.invocationLines[idx] = newText;
      const invInput = document.getElementById('invocation-line-1');
      if (invInput && idx === 0) invInput.value = newText;
    } else if (inlineType === 'doc-title') {
      appState.docTitle = newText;
      const docInput = document.getElementById('doc-title-input');
      if (docInput) docInput.value = newText;
    } else if (inlineType === 'section-title') {
      const secId = inlineEl.getAttribute('data-section-id');
      const secIdx = (appState.sections || []).findIndex((s) => s.id === secId);
      if (secIdx !== -1) {
        appState.sections[secIdx].title = newText;
        const leftInput = document.querySelector(
          `input[data-action="edit-sec-title"][data-sec-idx="${secIdx}"]`
        );
        if (leftInput) leftInput.value = newText;
      }
    } else if (inlineType === 'field-label' || inlineType === 'field-value') {
      const secId = inlineEl.getAttribute('data-section-id');
      const fieldKey = inlineEl.getAttribute('data-field-key');
      const secIdx = (appState.sections || []).findIndex((s) => s.id === secId);
      if (secIdx !== -1) {
        const fieldIdx = (appState.sections[secIdx].fields || []).findIndex((f) => f.key === fieldKey);
        if (fieldIdx !== -1) {
          if (inlineType === 'field-label') {
            appState.sections[secIdx].fields[fieldIdx].label = newText.replace(/:\s*$/, '');
            const leftLabelInput = document.querySelector(
              `input[data-action="edit-field-label"][data-sec-idx="${secIdx}"][data-field-idx="${fieldIdx}"]`
            );
            if (leftLabelInput) leftLabelInput.value = appState.sections[secIdx].fields[fieldIdx].label;
          } else {
            appState.sections[secIdx].fields[fieldIdx].value = newText;
            const leftValInput = document.querySelector(
              `input[data-action="edit-field-value"][data-sec-idx="${secIdx}"][data-field-idx="${fieldIdx}"]`
            );
            if (leftValInput) leftValInput.value = newText;
            if (fieldKey === 'dob') {
              const { ageText } = formatDobAndCalculateAge(newText);
              if (ageText) {
                const ageFieldIdx = (appState.sections[secIdx].fields || []).findIndex((f) => f.key === 'age');
                if (ageFieldIdx !== -1) {
                  appState.sections[secIdx].fields[ageFieldIdx].value = ageText;
                  const ageInputEl = document.querySelector(
                    `input[data-action="edit-field-value"][data-sec-idx="${secIdx}"][data-field-idx="${ageFieldIdx}"]`
                  );
                  if (ageInputEl) ageInputEl.value = ageText;
                }
              }
            }
          }
        }
      }
    }
    saveState();
  });

  sheetEl.addEventListener('focusout', (e) => {
    const inlineEl = e.target.closest('[data-inline-type]');
    if (inlineEl && isInlineEditEnabled) {
      saveState();
      renderA4Sheet();
    }
  });

  // 2. On-Canvas Sticker Action Buttons (Scale, Rotate, Duplicate, Delete)
  sheetEl.addEventListener('click', (e) => {
    const ctrlBtn = e.target.closest('[data-sticker-action]');
    if (ctrlBtn) {
      e.stopPropagation();
      const action = ctrlBtn.getAttribute('data-sticker-action');
      const stickerEl = ctrlBtn.closest('.canvas-sticker-item');
      const instanceId = stickerEl?.getAttribute('data-sticker-instance-id');
      if (!instanceId || !Array.isArray(appState.canvasStickers)) return;

      const idx = appState.canvasStickers.findIndex((s) => s.instanceId === instanceId);
      if (idx === -1) return;
      pushUndoSnapshot();
      const item = appState.canvasStickers[idx];
      selectedStickerInstanceId = instanceId;

      if (action === 'scale-up') {
        item.scale = Math.min(2.4, Number(((item.scale || 1) + 0.15).toFixed(2)));
      } else if (action === 'scale-down') {
        item.scale = Math.max(0.45, Number(((item.scale || 1) - 0.15).toFixed(2)));
      } else if (action === 'rotate-left') {
        item.rotation = ((item.rotation || 0) - 15) % 360;
      } else if (action === 'rotate-right') {
        item.rotation = ((item.rotation || 0) + 15) % 360;
      } else if (action === 'duplicate') {
        const clone = {
          ...item,
          instanceId: `stk_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
          x: Math.min(90, (item.x || 50) + 5),
          y: Math.min(90, (item.y || 50) + 5)
        };
        appState.canvasStickers.push(clone);
        selectedStickerInstanceId = clone.instanceId;
        showToast('Duplicated sticker on canvas');
      } else if (action === 'delete') {
        appState.canvasStickers.splice(idx, 1);
        selectedStickerInstanceId = null;
        showToast('Removed sticker from canvas');
      }

      saveState();
      renderA4Sheet();
      return;
    }

    const clickedSticker = e.target.closest('.canvas-sticker-item');
    if (clickedSticker) {
      selectedStickerInstanceId = clickedSticker.getAttribute('data-sticker-instance-id');
      sheetEl.querySelectorAll('.canvas-sticker-item').forEach((el) => {
        el.classList.toggle('is-selected', el === clickedSticker);
      });
    } else if (selectedStickerInstanceId) {
      selectedStickerInstanceId = null;
      sheetEl.querySelectorAll('.canvas-sticker-item.is-selected').forEach((el) => {
        el.classList.remove('is-selected');
      });
    }
  });

  // 3. Pointer Dragging of Stickers with Smart Center Alignment Snap Guides
  let dragState = null;

  sheetEl.addEventListener('pointerdown', (e) => {
    if (e.target.closest('[data-sticker-action]')) return;
    const stickerEl = e.target.closest('.canvas-sticker-item');
    if (!stickerEl) return;

    const instanceId = stickerEl.getAttribute('data-sticker-instance-id');
    const item = (appState.canvasStickers || []).find((s) => s.instanceId === instanceId);
    if (!item) return;

    e.preventDefault();
    pushUndoSnapshot();
    selectedStickerInstanceId = instanceId;
    sheetEl.querySelectorAll('.canvas-sticker-item').forEach((el) => {
      el.classList.toggle('is-selected', el === stickerEl);
    });

    const rect = sheetEl.getBoundingClientRect();
    dragState = {
      stickerEl,
      item,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startXPercent: Number(item.x ?? 80),
      startYPercent: Number(item.y ?? 15),
      sheetWidth: Math.max(100, rect.width),
      sheetHeight: Math.max(100, rect.height)
    };
    try {
      stickerEl.setPointerCapture(e.pointerId);
    } catch (_) {
      // Ignore synthetic pointer events
    }
  });

  sheetEl.addEventListener('pointermove', (e) => {
    if (!dragState) return;
    e.preventDefault();
    const dx = e.clientX - dragState.startClientX;
    const dy = e.clientY - dragState.startClientY;

    let nextX = dragState.startXPercent + (dx / dragState.sheetWidth) * 100;
    let nextY = dragState.startYPercent + (dy / dragState.sheetHeight) * 100;

    nextX = Math.max(4, Math.min(96, nextX));
    nextY = Math.max(3, Math.min(96, nextY));

    // Smart Snap to Center (50%) within ±1.4%
    if (Math.abs(nextX - 50) < 1.4) {
      nextX = 50;
      snapV?.classList.remove('hidden');
    } else {
      snapV?.classList.add('hidden');
    }

    if (Math.abs(nextY - 50) < 1.4) {
      nextY = 50;
      snapH?.classList.remove('hidden');
    } else {
      snapH?.classList.add('hidden');
    }

    dragState.item.x = Number(nextX.toFixed(2));
    dragState.item.y = Number(nextY.toFixed(2));
    dragState.stickerEl.style.left = `${dragState.item.x}%`;
    dragState.stickerEl.style.top = `${dragState.item.y}%`;
  });

  const endStickerDrag = () => {
    if (!dragState) return;
    dragState = null;
    snapV?.classList.add('hidden');
    snapH?.classList.add('hidden');
    saveState();
  };

  sheetEl.addEventListener('pointerup', endStickerDrag);
  sheetEl.addEventListener('pointercancel', endStickerDrag);
}

/**
 * Event Delegation for Instant Keystroke Live Updates, Gallery Discovery, Canva Studio & Section/Field Management
 */
function bindWorkspaceEvents() {
  // 1. Editor Tabs Switching (4 Tabs)
  document.querySelectorAll('[data-editor-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchEditorTab(btn.getAttribute('data-editor-tab'));
    });
  });

  // 2. Floating Canva Canvas Toolbar (Undo, Redo, Inline Edit Toggle, Quick Sticker, Quick Kundali, Zoom)
  document.getElementById('btn-canvas-undo')?.addEventListener('click', performUndo);
  document.getElementById('btn-canvas-redo')?.addEventListener('click', performRedo);

  window.addEventListener('keydown', (e) => {
    const isMod = e.metaKey || e.ctrlKey;
    if (!isMod) return;
    const activeTag = document.activeElement?.tagName;
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') return;

    if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
      e.preventDefault();
      performUndo();
    } else if ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y') {
      e.preventDefault();
      performRedo();
    }
  });

  const inlineToggleBtn = document.getElementById('btn-toggle-inline-edit');
  if (inlineToggleBtn) {
    inlineToggleBtn.addEventListener('click', () => {
      isInlineEditEnabled = !isInlineEditEnabled;
      inlineToggleBtn.classList.toggle('active', isInlineEditEnabled);
      inlineToggleBtn.setAttribute('aria-pressed', String(isInlineEditEnabled));
      inlineToggleBtn.textContent = isInlineEditEnabled ? '✎ Direct Canvas Edit: ON' : '👁 Direct Canvas Edit: OFF';
      renderA4Sheet();
      showToast(
        isInlineEditEnabled
          ? 'Direct Canvas Edit enabled — click any text on the A4 sheet to edit inline'
          : 'Direct Canvas Edit locked'
      );
    });
  }

  document.getElementById('btn-quick-add-sticker')?.addEventListener('click', () => {
    switchEditorTab('canva-studio');
    addStickerToCanvas('shubh-vivah-seal');
  });

  document.getElementById('btn-quick-toggle-kundali')?.addEventListener('click', () => {
    pushUndoSnapshot();
    appState.kundali.enabled = !appState.kundali.enabled;
    saveState();
    renderCanvaStudioEditor();
    renderA4Sheet();
    showToast(
      appState.kundali.enabled
        ? '☸ Added Vedic Kundali / Rashi Chart to Biodata'
        : 'Hid Vedic Kundali Chart from Biodata'
    );
  });

  const zoomSelect = document.getElementById('canvas-zoom-select');
  const zoomSteps = ['0.6', '0.75', '0.9', '1', '1.15'];
  if (zoomSelect) {
    zoomSelect.addEventListener('change', (e) => {
      canvasZoomMode = e.target.value;
      updatePreviewViewportScale();
    });
  }

  document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
    const cur = getCurrentCanvasScale();
    let next = '0.6';
    for (let i = zoomSteps.length - 1; i >= 0; i--) {
      if (parseFloat(zoomSteps[i]) < cur - 0.04) {
        next = zoomSteps[i];
        break;
      }
    }
    canvasZoomMode = next;
    if (zoomSelect) zoomSelect.value = next;
    updatePreviewViewportScale();
  });

  document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
    const cur = getCurrentCanvasScale();
    let next = '1.15';
    for (let i = 0; i < zoomSteps.length; i++) {
      if (parseFloat(zoomSteps[i]) > cur + 0.04) {
        next = zoomSteps[i];
        break;
      }
    }
    canvasZoomMode = next;
    if (zoomSelect) zoomSelect.value = next;
    updatePreviewViewportScale();
  });

  // 3. Community Preset Selector
  const presetSelect = document.getElementById('community-preset-select');
  if (presetSelect) {
    presetSelect.addEventListener('change', (e) => {
      const presetId = e.target.value;
      if (!presetId) return;
      const preset = COMMUNITY_PRESETS.find((p) => p.id === presetId);
      if (preset && typeof preset.apply === 'function') {
        pushUndoSnapshot();
        savePreviousSnapshotToCookies(appState);
        appState = normalizeStateShape(preset.apply());
        saveState(true);
        renderEditorForm();
        renderA4Sheet();
        showToast(`Loaded "${preset.name}" preset (previous data backed up in cookies)`);
      }
    });
  }

  // 4. Language Selector
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      switchLanguageNonDestructive(e.target.value);
    });
  }

  // 5. Quick Sample Bride / Groom / Clear / JSON Backup Buttons
  document.getElementById('btn-sample-bride')?.addEventListener('click', () => {
    const p = COMMUNITY_PRESETS.find((x) => x.id === 'hindu_bride');
    if (p) {
      pushUndoSnapshot();
      savePreviousSnapshotToCookies(appState);
      appState = normalizeStateShape(p.apply());
      saveState(true);
      renderEditorForm();
      renderA4Sheet();
      showToast('Loaded Sample Bride Biodata (press Undo anytime to revert)');
    }
  });

  document.getElementById('btn-sample-groom')?.addEventListener('click', () => {
    const p = COMMUNITY_PRESETS.find((x) => x.id === 'hindu_groom');
    if (p) {
      pushUndoSnapshot();
      savePreviousSnapshotToCookies(appState);
      appState = normalizeStateShape(p.apply());
      saveState(true);
      renderEditorForm();
      renderA4Sheet();
      showToast('Loaded Sample Groom Biodata (press Undo anytime to revert)');
    }
  });

  document.getElementById('btn-clear-values')?.addEventListener('click', () => {
    pushUndoSnapshot();
    savePreviousSnapshotToCookies(appState);
    for (const sec of appState.sections || []) {
      for (const f of sec.fields || []) {
        f.value = '';
      }
    }
    if (appState.sections?.[0]?.fields?.[0]) {
      appState.sections[0].fields[0].value = 'Your Full Name';
    }
    saveState(true);
    renderSectionsEditor();
    renderA4Sheet();
    showToast('Cleared sample values (press Undo anytime to revert)');
  });

  // 6. Sacred Header Inputs (Instant Keystroke Updates)
  document.getElementById('invocation-line-1')?.addEventListener('input', (e) => {
    appState.invocationLines = [e.target.value];
    saveState();
    renderA4Sheet();
  });

  document.getElementById('doc-title-input')?.addEventListener('input', (e) => {
    appState.docTitle = e.target.value;
    saveState();
    renderA4Sheet();
  });

  document.getElementById('show-doc-title-check')?.addEventListener('change', (e) => {
    pushUndoSnapshot();
    appState.showDocTitle = e.target.checked;
    saveState();
    renderA4Sheet();
  });

  // Custom Emblem Upload
  document.getElementById('custom-emblem-upload')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      pushUndoSnapshot();
      appState.customEmblemDataUrl = ev.target.result;
      appState.showEmblem = true;
      saveState();
      renderHeaderAndPhotoEditor();
      renderA4Sheet();
      showToast('Uploaded custom sacred emblem');
    };
    reader.readAsDataURL(file);
  });

  // 7. Photo Upload & Cropper Studio
  cropperInstance = new PhotoCropperModal((croppedDataUrl) => {
    pushUndoSnapshot();
    appState.photo.dataUrl = croppedDataUrl;
    appState.photo.show = true;
    saveState();
    renderHeaderAndPhotoEditor();
    renderA4Sheet();
    showToast('Photo cropped and updated on biodata');
  });

  document.getElementById('photo-upload-input')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      cropperInstance.openWithFile(file);
      e.target.value = '';
    }
  });

  document.getElementById('btn-recrop-photo')?.addEventListener('click', () => {
    if (appState.photo?.dataUrl) {
      cropperInstance.openWithDataUrl(appState.photo.dataUrl);
    }
  });

  document.getElementById('show-photo-check')?.addEventListener('change', (e) => {
    pushUndoSnapshot();
    appState.photo.show = e.target.checked;
    saveState();
    renderA4Sheet();
  });

  // 8. Instant Keystroke Delegation for All Dynamic Sections & Fields
  const sectionsContainer = document.getElementById('sections-editor-container');
  if (sectionsContainer) {
    sectionsContainer.addEventListener('focusin', (e) => {
      if (e.target.matches('input[type="text"]')) {
        pushUndoSnapshot();
      }
    });

    sectionsContainer.addEventListener('input', (e) => {
      const target = e.target;
      const action = target.getAttribute('data-action');
      const secIdx = parseInt(target.getAttribute('data-sec-idx'), 10);
      const fieldIdx = parseInt(target.getAttribute('data-field-idx'), 10);

      if (action === 'edit-sec-title' && appState.sections[secIdx]) {
        appState.sections[secIdx].title = target.value;
        saveState();
        renderA4Sheet();
      } else if (action === 'edit-field-label' && appState.sections[secIdx]?.fields?.[fieldIdx]) {
        appState.sections[secIdx].fields[fieldIdx].label = target.value;
        saveState();
        renderA4Sheet();
      } else if (action === 'edit-field-value' && appState.sections[secIdx]?.fields?.[fieldIdx]) {
        const field = appState.sections[secIdx].fields[fieldIdx];
        field.value = target.value;

        if (field.key === 'dob') {
          const { ageText } = formatDobAndCalculateAge(target.value);
          const parsedParts = parseDobParts(target.value);
          const rowEl = target.closest('.field-row');
          if (rowEl) {
            const daySel = rowEl.querySelector('select[data-dob-part="day"]');
            const monthSel = rowEl.querySelector('select[data-dob-part="month"]');
            const yearSel = rowEl.querySelector('select[data-dob-part="year"]');
            if (daySel && parsedParts.day) daySel.value = parsedParts.day;
            if (monthSel && parsedParts.month) monthSel.value = parsedParts.month;
            if (yearSel && parsedParts.year) yearSel.value = parsedParts.year;
          }
          if (ageText) {
            const ageFieldIdx = appState.sections[secIdx].fields.findIndex((f) => f.key === 'age');
            if (ageFieldIdx !== -1) {
              appState.sections[secIdx].fields[ageFieldIdx].value = ageText;
              const ageInputEl = sectionsContainer.querySelector(
                `input[data-action="edit-field-value"][data-sec-idx="${secIdx}"][data-field-idx="${ageFieldIdx}"]`
              );
              if (ageInputEl) ageInputEl.value = ageText;
            }
          }
        }

        saveState();
        renderA4Sheet();
      }
    });

    sectionsContainer.addEventListener('change', (e) => {
      const target = e.target;
      const action = target.getAttribute('data-action');
      if (action === 'select-dob-part') {
        pushUndoSnapshot();
        const secIdx = parseInt(target.getAttribute('data-sec-idx'), 10);
        const fieldIdx = parseInt(target.getAttribute('data-field-idx'), 10);
        const rowEl = target.closest('.field-row');
        if (!rowEl || !appState.sections[secIdx]?.fields?.[fieldIdx]) return;

        const daySel = rowEl.querySelector('select[data-dob-part="day"]');
        const monthSel = rowEl.querySelector('select[data-dob-part="month"]');
        const yearSel = rowEl.querySelector('select[data-dob-part="year"]');
        const currentParts = parseDobParts(appState.sections[secIdx].fields[fieldIdx].value);

        const dayVal = (daySel?.value || currentParts.day || '01').padStart(2, '0');
        const monthVal = monthSel?.value || currentParts.month || 'Jan';
        const yearVal = yearSel?.value || currentParts.year || '1997';

        if (daySel && !daySel.value) daySel.value = dayVal;
        if (monthSel && !monthSel.value) monthSel.value = monthVal;
        if (yearSel && !yearSel.value) yearSel.value = yearVal;

        const assembledDob = `${dayVal} ${monthVal} ${yearVal}`;
        const { formattedDob, ageText } = formatDobAndCalculateAge(assembledDob);
        const finalDob = formattedDob || assembledDob;

        appState.sections[secIdx].fields[fieldIdx].value = finalDob;
        const dobInputEl = rowEl.querySelector('input[data-action="edit-field-value"]');
        if (dobInputEl) dobInputEl.value = finalDob;

        if (ageText) {
          const ageFieldIdx = appState.sections[secIdx].fields.findIndex((f) => f.key === 'age');
          if (ageFieldIdx !== -1) {
            appState.sections[secIdx].fields[ageFieldIdx].value = ageText;
            const ageInputEl = sectionsContainer.querySelector(
              `input[data-action="edit-field-value"][data-sec-idx="${secIdx}"][data-field-idx="${ageFieldIdx}"]`
            );
            if (ageInputEl) ageInputEl.value = ageText;
          }
        }

        saveState();
        renderA4Sheet();
        showToast(`Date of Birth set to ${finalDob} (${ageText || 'Age updated'})`);
      } else if (action === 'pick-dob-date') {
        pushUndoSnapshot();
        const secIdx = parseInt(target.getAttribute('data-sec-idx'), 10);
        const fieldIdx = parseInt(target.getAttribute('data-field-idx'), 10);
        const { formattedDob, ageText } = formatDobAndCalculateAge(target.value);
        if (formattedDob && appState.sections[secIdx]?.fields?.[fieldIdx]) {
          appState.sections[secIdx].fields[fieldIdx].value = formattedDob;
          const ageField = appState.sections[secIdx].fields.find((f) => f.key === 'age');
          if (ageField && ageText) {
            ageField.value = ageText;
          }
          saveState();
          renderSectionsEditor();
          renderA4Sheet();
          showToast('Updated Date of Birth & calculated Age');
        }
      }
    });

    sectionsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      if (
        action === 'edit-sec-title' ||
        action === 'edit-field-label' ||
        action === 'edit-field-value' ||
        action === 'pick-dob-date' ||
        action === 'select-dob-part'
      ) {
        return;
      }

      pushUndoSnapshot();
      const secIdx = parseInt(btn.getAttribute('data-sec-idx'), 10);
      const fieldIdx = parseInt(btn.getAttribute('data-field-idx'), 10);
      const sec = appState.sections[secIdx];

      if (action === 'toggle-sec-vis' && sec) {
        sec.visible = sec.visible === false ? true : false;
      } else if (action === 'move-sec-up' && secIdx > 0) {
        const tmp = appState.sections[secIdx - 1];
        appState.sections[secIdx - 1] = appState.sections[secIdx];
        appState.sections[secIdx] = tmp;
      } else if (action === 'move-sec-down' && secIdx < appState.sections.length - 1) {
        const tmp = appState.sections[secIdx + 1];
        appState.sections[secIdx + 1] = appState.sections[secIdx];
        appState.sections[secIdx] = tmp;
      } else if (action === 'delete-sec' && sec) {
        if (!Array.isArray(appState._deletedSectionIds)) appState._deletedSectionIds = [];
        if (sec.id && !appState._deletedSectionIds.includes(sec.id)) {
          appState._deletedSectionIds.push(sec.id);
        }
        appState.sections.splice(secIdx, 1);
      } else if (action === 'move-field-up' && sec && fieldIdx > 0) {
        const tmp = sec.fields[fieldIdx - 1];
        sec.fields[fieldIdx - 1] = sec.fields[fieldIdx];
        sec.fields[fieldIdx] = tmp;
      } else if (action === 'move-field-down' && sec && fieldIdx < sec.fields.length - 1) {
        const tmp = sec.fields[fieldIdx + 1];
        sec.fields[fieldIdx + 1] = sec.fields[fieldIdx];
        sec.fields[fieldIdx] = tmp;
      } else if (action === 'toggle-field-vis' && sec?.fields?.[fieldIdx]) {
        sec.fields[fieldIdx].visible = sec.fields[fieldIdx].visible === false ? true : false;
      } else if (action === 'delete-field' && sec?.fields?.[fieldIdx]) {
        const delKey = sec.fields[fieldIdx].key;
        if (!Array.isArray(appState._deletedFieldKeys)) appState._deletedFieldKeys = [];
        if (delKey && !appState._deletedFieldKeys.includes(delKey)) {
          appState._deletedFieldKeys.push(delKey);
        }
        sec.fields.splice(fieldIdx, 1);
      } else if (action === 'quick-add-pill' && sec) {
        const pillKey = btn.getAttribute('data-pill-key');
        const pillDef = (OPTIONAL_FIELD_PILLS[sec.id] || []).find((p) => p.key === pillKey);
        if (pillDef) {
          const langDict = LANGUAGE_LABELS[appState.language] || LANGUAGE_LABELS.en;
          const localizedLabel = langDict.fields?.[pillDef.key] || pillDef.label;
          sec.fields.push({
            id: `f_${pillDef.key}_${Date.now()}`,
            key: pillDef.key,
            label: localizedLabel,
            value: pillDef.placeholder.replace(/^e\.g\.,\s*/i, ''),
            type: 'text',
            datalist: pillDef.datalist,
            visible: true
          });
          sec.visible = true;
        }
      } else if (action === 'add-custom-field' && sec) {
        sec.fields.push({
          id: `f_custom_${Date.now()}`,
          key: `custom_${Date.now()}`,
          label: 'Custom Detail',
          value: 'Enter value',
          type: 'text',
          visible: true
        });
        sec.visible = true;
      }

      saveState();
      renderSectionsEditor();
      renderA4Sheet();
    });
  }

  document.getElementById('btn-add-section')?.addEventListener('click', () => {
    pushUndoSnapshot();
    appState.sections.push({
      id: `custom_sec_${Date.now()}`,
      title: 'Additional Information',
      visible: true,
      fields: [
        {
          id: `f_custom_${Date.now()}`,
          key: 'custom_info',
          label: 'Achievement / Note',
          value: 'Gold Medalist in University',
          type: 'text',
          visible: true
        }
      ]
    });
    saveState();
    renderSectionsEditor();
    renderA4Sheet();
    showToast('Added new custom section');
  });

  // 9. Tab 3: Design, Typography, Structural Mix-and-Match & Colors
  document.getElementById('font-pair-select')?.addEventListener('change', (e) => {
    pushUndoSnapshot();
    appState.formatting.fontPair = e.target.value;
    saveState();
    renderA4Sheet();
  });

  document.getElementById('layout-override-select')?.addEventListener('change', (e) => {
    pushUndoSnapshot();
    appState.formatting.layoutOverride = e.target.value;
    saveState();
    renderA4Sheet();
    showToast(e.target.value ? `Applied "${e.target.value}" layout engine` : 'Restored template default layout');
  });

  document.getElementById('border-override-select')?.addEventListener('change', (e) => {
    pushUndoSnapshot();
    appState.formatting.borderStyleOverride = e.target.value;
    saveState();
    renderA4Sheet();
    showToast(e.target.value ? `Applied "${e.target.value}" border frame` : 'Restored template default border');
  });

  document.getElementById('header-style-override-select')?.addEventListener('change', (e) => {
    pushUndoSnapshot();
    appState.formatting.headerStyleOverride = e.target.value;
    saveState();
    renderA4Sheet();
  });

  const bindRange = (id, valId, applyFn, suffix = '%') => {
    const el = document.getElementById(id);
    const valEl = document.getElementById(valId);
    if (!el) return;
    el.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      if (valEl) valEl.textContent = `${v}${suffix}`;
      applyFn(v);
      saveState();
      renderA4Sheet();
    });
  };

  bindRange('font-scale-range', 'font-scale-val', (v) => {
    appState.formatting.fontScale = v;
  });
  bindRange('line-spacing-range', 'line-spacing-val', (v) => {
    appState.formatting.lineSpacing = v;
  });
  bindRange('page-padding-range', 'page-padding-val', (v) => {
    appState.formatting.pagePadding = v;
  });
  bindRange('photo-size-range', 'photo-size-val', (v) => {
    appState.photo.size = v;
  });
  bindRange('label-width-range', 'label-width-val', (v) => {
    appState.formatting.labelWidthPercent = v;
  });

  document.getElementById('autofit-single-page-check')?.addEventListener('change', (e) => {
    appState.formatting.autoFitSinglePage = e.target.checked;
    saveState();
    renderA4Sheet();
  });

  document.getElementById('custom-accent-color')?.addEventListener('input', (e) => {
    appState.formatting.customAccentColor = e.target.value;
    saveState();
    renderCanvaStudioEditor();
    renderA4Sheet();
  });

  document.getElementById('custom-secondary-color')?.addEventListener('input', (e) => {
    appState.formatting.customSecondaryColor = e.target.value;
    saveState();
    renderCanvaStudioEditor();
    renderA4Sheet();
  });

  document.getElementById('custom-paper-color')?.addEventListener('input', (e) => {
    appState.formatting.customPaperColor = e.target.value;
    saveState();
    renderA4Sheet();
  });

  document.getElementById('custom-text-color')?.addEventListener('input', (e) => {
    appState.formatting.customTextColor = e.target.value;
    saveState();
    renderA4Sheet();
  });

  document.getElementById('btn-reset-accent-color')?.addEventListener('click', () => {
    pushUndoSnapshot();
    appState.formatting.customAccentColor = '';
    appState.formatting.customSecondaryColor = '';
    appState.formatting.customPaperColor = '';
    appState.formatting.customTextColor = '';
    appState.formatting.layoutOverride = '';
    appState.formatting.borderStyleOverride = '';
    appState.formatting.headerStyleOverride = '';
    appState.formatting.labelWidthPercent = 36;
    saveState();
    renderDesignAndFormatEditor();
    renderCanvaStudioEditor();
    renderA4Sheet();
    showToast('Reset colors & layout overrides to template default');
  });

  // 10. Tab 4: ✨ Canva Studio Event Listeners
  document.getElementById('sticker-category-tabs')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-sticker-cat]');
    if (!btn) return;
    activeStickerCategory = btn.getAttribute('data-sticker-cat');
    renderCanvaStudioEditor();
  });

  document.getElementById('btn-add-custom-badge')?.addEventListener('click', addCustomBadgeToCanvas);

  document.getElementById('btn-clear-all-stickers')?.addEventListener('click', () => {
    if (!appState.canvasStickers || appState.canvasStickers.length === 0) return;
    pushUndoSnapshot();
    appState.canvasStickers = [];
    selectedStickerInstanceId = null;
    saveState();
    renderCanvaStudioEditor();
    renderA4Sheet();
    showToast('Cleared all stickers from A4 sheet');
  });

  document.getElementById('kundali-enabled-check')?.addEventListener('change', (e) => {
    pushUndoSnapshot();
    appState.kundali.enabled = e.target.checked;
    saveState();
    renderA4Sheet();
  });

  document.getElementById('kundali-style-select')?.addEventListener('change', (e) => {
    pushUndoSnapshot();
    appState.kundali.style = e.target.value;
    appState.kundali.enabled = true;
    const chk = document.getElementById('kundali-enabled-check');
    if (chk) chk.checked = true;
    saveState();
    renderA4Sheet();
  });

  document.getElementById('kundali-preset-select')?.addEventListener('change', (e) => {
    const preset = KUNDALI_PRESETS.find((p) => p.id === e.target.value);
    if (!preset) return;
    pushUndoSnapshot();
    appState.kundali.houses = [...preset.houses];
    appState.kundali.enabled = true;
    saveState();
    renderCanvaStudioEditor();
    renderA4Sheet();
    showToast(`Applied "${preset.name}" to Kundali chart`);
  });

  document.getElementById('kundali-title-input')?.addEventListener('input', (e) => {
    appState.kundali.title = e.target.value;
    saveState();
    renderA4Sheet();
  });

  document.getElementById('kundali-subtitle-input')?.addEventListener('input', (e) => {
    appState.kundali.subtitle = e.target.value;
    saveState();
    renderA4Sheet();
  });

  document.getElementById('kundali-houses-grid')?.addEventListener('input', (e) => {
    const input = e.target.closest('[data-kundali-house-idx]');
    if (!input) return;
    const idx = parseInt(input.getAttribute('data-kundali-house-idx'), 10);
    if (!Number.isNaN(idx) && idx >= 0 && idx < 12) {
      appState.kundali.houses[idx] = input.value;
      appState.kundali.enabled = true;
      const chk = document.getElementById('kundali-enabled-check');
      if (chk) chk.checked = true;
      saveState();
      renderA4Sheet();
    }
  });

  document.getElementById('paper-texture-select')?.addEventListener('change', (e) => {
    pushUndoSnapshot();
    appState.formatting.paperTexture = e.target.value;
    saveState();
    renderA4Sheet();
  });

  document.getElementById('watermark-mode-select')?.addEventListener('change', (e) => {
    pushUndoSnapshot();
    appState.formatting.watermarkMode = e.target.value;
    saveState();
    renderA4Sheet();
  });

  document.getElementById('watermark-text-input')?.addEventListener('input', (e) => {
    appState.formatting.watermarkText = e.target.value;
    if (appState.formatting.watermarkMode === 'none' && e.target.value.trim()) {
      appState.formatting.watermarkMode = 'monogram';
      const wmSelect = document.getElementById('watermark-mode-select');
      if (wmSelect) wmSelect.value = 'monogram';
    }
    saveState();
    renderA4Sheet();
  });

  bindRange('watermark-opacity-range', 'watermark-opacity-val', (v) => {
    appState.formatting.watermarkOpacity = v;
  });

  bindRange('photo-brightness-range', 'photo-brightness-val', (v) => {
    appState.photo.brightness = v;
  });
  bindRange('photo-contrast-range', 'photo-contrast-val', (v) => {
    appState.photo.contrast = v;
  });
  bindRange('photo-saturation-range', 'photo-saturation-val', (v) => {
    appState.photo.saturation = v;
  });
  bindRange('photo-warmth-range', 'photo-warmth-val', (v) => {
    appState.photo.warmth = v;
  });
  bindRange(
    'photo-border-width-range',
    'photo-border-width-val',
    (v) => {
      appState.photo.borderWidth = v;
    },
    'px'
  );

  document.getElementById('photo-shadow-check')?.addEventListener('change', (e) => {
    appState.photo.shadow = e.target.checked;
    saveState();
    renderA4Sheet();
  });

  document.getElementById('btn-reset-photo-filters')?.addEventListener('click', () => {
    pushUndoSnapshot();
    appState.photo.brightness = 100;
    appState.photo.contrast = 100;
    appState.photo.saturation = 100;
    appState.photo.warmth = 0;
    appState.photo.borderWidth = 2.5;
    appState.photo.shadow = true;
    saveState();
    renderCanvaStudioEditor();
    renderA4Sheet();
    showToast('Reset photo filters to studio default');
  });

  // 11. Phase 6 Gallery Discovery Search, Filter, Pagination, Delegated Template Clicks & Modals
  document.getElementById('template-pills-scroll')?.addEventListener('click', (e) => {
    const pill = e.target.closest('[data-select-tpl]');
    if (!pill) return;
    const id = pill.getAttribute('data-select-tpl');
    if (!id) return;
    selectTemplate(id);
    showToast(`Applied "${getTemplateById(id).name}" template`);
  });

  document.getElementById('templates-gallery-grid')?.addEventListener('click', (e) => {
    const applyBtn = e.target.closest('[data-apply-tpl]');
    if (applyBtn) {
      const id = applyBtn.getAttribute('data-apply-tpl');
      if (id) {
        selectTemplate(id);
        document.getElementById('builder-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast(`Applied "${getTemplateById(id).name}" template`);
      }
      return;
    }

    const previewBtn = e.target.closest('[data-preview-tpl]');
    if (previewBtn) {
      const id = previewBtn.getAttribute('data-preview-tpl');
      if (id) openTemplatePreviewModal(id);
      return;
    }

    const compareBtn = e.target.closest('[data-compare-tpl]');
    if (compareBtn) {
      e.stopPropagation();
      const id = compareBtn.getAttribute('data-compare-tpl');
      if (id) toggleCompareTemplate(id);
      return;
    }

    const openCompareBtn = e.target.closest('[data-open-compare-now]');
    if (openCompareBtn) {
      e.stopPropagation();
      openTemplateCompareModal();
      return;
    }

    const favBtn = e.target.closest('[data-fav-tpl]');
    if (favBtn) {
      e.stopPropagation();
      const id = favBtn.getAttribute('data-fav-tpl');
      if (id) toggleFavoriteTemplate(id);
    }
  });

  document.getElementById('gallery-search-input')?.addEventListener('input', (e) => {
    galleryFilters.query = e.target.value;
    galleryVisibleLimit = 24;
    renderFullTemplateGallery();
  });

  document.getElementById('gallery-language-filter')?.addEventListener('change', (e) => {
    galleryFilters.language = e.target.value;
    galleryVisibleLimit = 24;
    renderFullTemplateGallery();
  });

  document.getElementById('gallery-source-filter')?.addEventListener('change', (e) => {
    galleryFilters.sourcePath = e.target.value;
    galleryVisibleLimit = 24;
    renderFullTemplateGallery();
  });

  document.getElementById('btn-filter-recent')?.addEventListener('click', () => {
    galleryFilters.recentlyAddedOnly = !galleryFilters.recentlyAddedOnly;
    galleryVisibleLimit = 24;
    renderGalleryFilterControls();
    renderFullTemplateGallery();
  });

  document.getElementById('btn-filter-favorites')?.addEventListener('click', () => {
    galleryFilters.favoritesOnly = !galleryFilters.favoritesOnly;
    galleryVisibleLimit = 24;
    renderGalleryFilterControls();
    renderFullTemplateGallery();
  });

  document.getElementById('btn-reset-gallery-filters')?.addEventListener('click', resetGalleryFilters);
  document.getElementById('btn-empty-reset-filters')?.addEventListener('click', resetGalleryFilters);

  document.getElementById('btn-load-more-templates')?.addEventListener('click', () => {
    galleryVisibleLimit += 24;
    renderFullTemplateGallery();
  });

  document.getElementById('btn-show-all-templates')?.addEventListener('click', () => {
    galleryVisibleLimit = TEMPLATES.length;
    renderFullTemplateGallery();
  });

  // Preview Modal Actions
  document.getElementById('btn-close-preview-modal')?.addEventListener('click', closeTemplatePreviewModal);
  document.getElementById('template-preview-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'template-preview-modal') closeTemplatePreviewModal();
  });

  document.getElementById('btn-modal-apply-template')?.addEventListener('click', () => {
    if (previewModalTemplateId) {
      const id = previewModalTemplateId;
      selectTemplate(id);
      closeTemplatePreviewModal();
      document.getElementById('builder-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast(`Applied "${getTemplateById(id).name}" template`);
    }
  });

  document.getElementById('btn-modal-toggle-favorite')?.addEventListener('click', () => {
    if (previewModalTemplateId) {
      toggleFavoriteTemplate(previewModalTemplateId);
      openTemplatePreviewModal(previewModalTemplateId);
    }
  });

  document.getElementById('btn-modal-toggle-compare')?.addEventListener('click', () => {
    if (previewModalTemplateId) {
      toggleCompareTemplate(previewModalTemplateId);
      openTemplatePreviewModal(previewModalTemplateId);
    }
  });

  // Compare Modal & Floating Compare Dock Actions
  document.getElementById('btn-open-compare-modal')?.addEventListener('click', openTemplateCompareModal);
  document.getElementById('btn-strip-compare')?.addEventListener('click', openTemplateCompareModal);
  document.getElementById('btn-dock-open-compare')?.addEventListener('click', openTemplateCompareModal);
  document.getElementById('btn-close-compare-modal')?.addEventListener('click', closeTemplateCompareModal);
  document.getElementById('template-compare-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'template-compare-modal') closeTemplateCompareModal();
  });
  const clearComparisonSelection = () => {
    compareTemplateIds = [];
    updateGalleryBadges();
    renderFullTemplateGallery();
    closeTemplateCompareModal();
    showToast('Cleared comparison list');
  };
  document.getElementById('btn-clear-compare-list')?.addEventListener('click', clearComparisonSelection);
  document.getElementById('btn-dock-clear-compare')?.addEventListener('click', clearComparisonSelection);

  // 12. Multi-Format Export & Share Buttons
  const sheetEl = document.getElementById('biodata-a4-sheet');

  const withLoadingState = async (btnId, labelWhileBusy, taskFn) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const origHtml = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = labelWhileBusy;
    try {
      await taskFn();
    } catch (err) {
      console.error(err);
      showToast('Export error — please try again');
    } finally {
      btn.disabled = false;
      btn.innerHTML = origHtml;
    }
  };

  document.getElementById('btn-export-pdf')?.addEventListener('click', () => {
    withLoadingState('btn-export-pdf', 'Generating HD PDF...', async () => {
      await exportToPDF(sheetEl, appState);
      showToast('Downloaded High-DPI A4 PDF (Zero Watermark)');
    });
  });

  document.getElementById('btn-export-png')?.addEventListener('click', () => {
    withLoadingState('btn-export-png', 'Rendering PNG...', async () => {
      await exportToImage(sheetEl, appState, 'png');
      showToast('Downloaded 3x Retina PNG Image');
    });
  });

  document.getElementById('btn-export-jpg')?.addEventListener('click', () => {
    withLoadingState('btn-export-jpg', 'Rendering JPG...', async () => {
      await exportToImage(sheetEl, appState, 'jpg');
      showToast('Downloaded High-Resolution JPG Image');
    });
  });

  document.getElementById('btn-export-docx')?.addEventListener('click', () => {
    withLoadingState('btn-export-docx', 'Building Word .docx...', async () => {
      const tpl = getTemplateById(appState.templateId);
      await exportToWordDocx(appState, tpl);
      showToast('Downloaded Editable Microsoft Word (.docx)');
    });
  });

  document.getElementById('btn-print-sheet')?.addEventListener('click', () => {
    printBiodata();
  });

  document.getElementById('btn-share-whatsapp')?.addEventListener('click', async () => {
    await shareBiodata(sheetEl, appState, 'whatsapp');
  });

  document.getElementById('btn-copy-summary')?.addEventListener('click', async () => {
    await shareBiodata(sheetEl, appState, 'copy');
    showToast('Copied formatted Biodata summary to clipboard');
  });

  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    exportBiodataJSON(appState);
    showToast('Saved Biodata JSON backup file');
  });

  document.getElementById('json-restore-input')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const loaded = await importBiodataJSON(file);
      pushUndoSnapshot();
      savePreviousSnapshotToCookies(appState);
      appState = normalizeStateShape(loaded);
      saveState(true);
      renderEditorForm();
      renderA4Sheet();
      showToast('Restored Biodata from JSON backup');
    } catch (err) {
      showToast('Invalid JSON backup file');
    } finally {
      e.target.value = '';
    }
  });

  // 13. Mobile & Compact Screen Quick Jump + Sticky Bottom Thumb-Zone Navigation
  document.getElementById('btn-jump-to-preview')?.addEventListener('click', () => {
    document.getElementById('preview-column')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // 14. Unified COGIFY.ME Theme Toggle (Header + Footer) synced with localStorage('cogify-theme')
  const syncThemeUiLabel = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const footerLabel = document.getElementById('footer-theme-label');
    if (footerLabel) {
      footerLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }
  };
  const toggleCogifyTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const nextTheme = isDark ? 'light' : 'dark';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('cogify-theme', nextTheme);
    } catch {
      // ignore storage error
    }
    syncThemeUiLabel();
  };
  document.getElementById('btn-theme-toggle')?.addEventListener('click', toggleCogifyTheme);
  document.getElementById('btn-footer-theme-toggle')?.addEventListener('click', toggleCogifyTheme);
  syncThemeUiLabel();

  document.getElementById('mobile-bottom-nav')?.addEventListener('click', (e) => {
    const navBtn = e.target.closest('[data-mobile-bottom]');
    if (!navBtn) return;
    const action = navBtn.getAttribute('data-mobile-bottom');
    document.querySelectorAll('#mobile-bottom-nav .mobile-bottom-btn').forEach((btn) => {
      btn.classList.toggle('active', btn === navBtn);
    });
    if (action === 'form') {
      document.getElementById('editor-column')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (action === 'preview') {
      document.getElementById('preview-column')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (action === 'templates') {
      document.getElementById('templates-gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (action === 'pdf') {
      document.getElementById('btn-export-pdf')?.click();
    }
  });

  let resizeRafId = null;
  const schedulePreviewViewportScale = () => {
    if (resizeRafId) return;
    resizeRafId = requestAnimationFrame(() => {
      resizeRafId = null;
      updatePreviewViewportScale();
    });
  };

  window.addEventListener('resize', schedulePreviewViewportScale, { passive: true });
  window.addEventListener('orientationchange', () => {
    setTimeout(schedulePreviewViewportScale, 120);
  });

  if (typeof ResizeObserver !== 'undefined') {
    const stageEl = document.getElementById('a4-preview-stage');
    const wsEl = document.getElementById('workspace-container');
    const ro = new ResizeObserver(schedulePreviewViewportScale);
    if (stageEl) ro.observe(stageEl);
    if (wsEl) ro.observe(wsEl);
  }
}

/**
 * Initialize Application on DOMContentLoaded
 */
function initApp() {
  applySeoRouteContext({
    onSelectPreset: (presetId) => {
      const preset = COMMUNITY_PRESETS.find((p) => p.id === presetId);
      if (preset && typeof preset.apply === 'function') {
        appState = normalizeStateShape(preset.apply());
      }
    },
    onSelectTemplate: (templateId) => {
      if (templateId && getTemplateById(templateId)) {
        appState.templateId = templateId;
      }
    },
    onSelectLanguage: (langCode) => {
      if (langCode && LANGUAGE_LABELS[langCode]) {
        const dict = LANGUAGE_LABELS[langCode];
        appState.language = langCode;
        if (dict.docTitle) appState.docTitle = dict.docTitle;
        for (const sec of appState.sections || []) {
          if (dict.sections && dict.sections[sec.id]) sec.title = dict.sections[sec.id];
          for (const f of sec.fields || []) {
            if (dict.fields && dict.fields[f.key]) f.label = dict.fields[f.key];
          }
        }
      }
    },
    onSelectCategory: (cat) => {
      galleryFilters.category = cat;
    }
  });
  renderDatalists();
  renderEditorForm();
  renderA4Sheet();
  // Silently ensure initial state is backed up in browser cookies
  try {
    const summary = getSavedCookieSummary();
    if (!summary.hasPrimaryCookie) {
      saveBiodataToCookies(appState);
    }
  } catch {
    // Ignore
  }
  updatePreviewViewportScale();
  requestAnimationFrame(updatePreviewViewportScale);
  bindWorkspaceEvents();
  bindCanvaCanvasInteractions();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
