/**
 * Zero-Paywall Multi-Format Client-Side Exporter Engine
 * Supports:
 * 1. High-DPI Print-Ready PDF (1-page and 2-page A4 support, 300 DPI equivalent)
 * 2. High-Resolution PNG & JPG Image (2.5x retina scale)
 * 3. Editable Microsoft Word (.docx) with side-by-side Personal Details + Photo & themed tables
 * 4. JSON Project Backup & Restore (.json)
 * 5. Direct WhatsApp & Clipboard Formatted Summary Share
 */

import { getTemplateById } from '../data/templates.js';
import { getActiveSections } from '../templates/renderer.js';

let _html2canvasPromise = null;
let _jsPdfPromise = null;
let _docxPromise = null;

async function loadHtml2Canvas() {
  if (!_html2canvasPromise) {
    _html2canvasPromise = import('html2canvas').then((m) => m.default || m);
  }
  return _html2canvasPromise;
}

async function loadJsPDF() {
  if (!_jsPdfPromise) {
    _jsPdfPromise = import('jspdf').then((m) => m.jsPDF || m.default);
  }
  return _jsPdfPromise;
}

async function loadDocx() {
  if (!_docxPromise) {
    _docxPromise = import('docx');
  }
  return _docxPromise;
}

export function slugifyFilename(name) {
  const clean = String(name || 'marriage-biodata')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return clean || 'marriage-biodata';
}

export function getCandidateName(state) {
  if (!state) return 'Candidate';
  const sections = state.sections || [];
  for (const sec of sections) {
    for (const f of sec.fields || []) {
      if (
        (f.key === 'full_name' || f.id === 'f_full_name' || String(f.label || '').toLowerCase().includes('name')) &&
        f.value &&
        String(f.value).trim()
      ) {
        return String(f.value).trim();
      }
    }
  }
  return 'Candidate';
}

/**
 * Computes deterministic PDF export metadata for QA verification and multi-page handling
 */
export function computePdfExportMetadata(state, template) {
  const tpl = template || getTemplateById(state?.templateId);
  const expectedPageCount = tpl?.pageCount === 2 || tpl?.layout === 'two-page-comprehensive' ? 2 : 1;
  return {
    format: 'a4',
    orientation: 'portrait',
    unit: 'mm',
    widthMm: 210,
    heightMm: 297,
    widthPx: 794,
    heightPx: 1123,
    scale: 2.5,
    expectedPageCount,
    filename: `${slugifyFilename(getCandidateName(state))}-biodata.pdf`
  };
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    if (a.parentNode) a.parentNode.removeChild(a);
    URL.revokeObjectURL(url);
  }, 350);
}

/**
 * Converts any SVG data URL (or image URL) into a raster PNG data URL so html2canvas and Word (.docx)
 * render SVG portrait avatars and custom emblems 100% reliably across all browsers.
 */
async function rasterizeImageUrlToPngDataUrl(src, width = 320, height = 400) {
  if (!src || typeof src !== 'string') return src;
  if (!src.startsWith('data:image/svg+xml')) return src;
  if (typeof document === 'undefined') return src;

  let normalizedSrc = src;
  try {
    const commaIdx = src.indexOf(',');
    if (commaIdx !== -1) {
      const header = src.slice(0, commaIdx);
      const body = src.slice(commaIdx + 1);
      let svgText = header.includes(';base64') ? atob(body) : decodeURIComponent(body);
      if (svgText.includes('<svg') && !/\bwidth\s*=/.test(svgText.slice(0, 220))) {
        svgText = svgText.replace('<svg', `<svg width="${width}" height="${height}"`);
      }
      normalizedSrc = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;
    }
  } catch {
    // keep original src
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width * 2;
        canvas.height = height * 2;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      } catch {
        resolve(normalizedSrc);
      }
    };
    img.onerror = () => resolve(normalizedSrc);
    img.src = normalizedSrc;
  });
}

/**
 * Renders an A4 sheet (or single A4 page inside a 2-page sheet) at true 1:1 unscaled A4 dimensions (794x1123 px),
 * completely isolated from viewport CSS `transform: scale(...)`, scroll offsets, or html2canvas letter-spacing bugs.
 */
async function renderUnscaledSheetCanvas(sourceEl, rootSheetEl = null, scale = 2.5) {
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore font readiness errors
    }
  }

  const hostSheet = rootSheetEl || sourceEl;
  const wrapper = document.createElement('div');
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '0px';
  wrapper.style.top = '0px';
  wrapper.style.width = '794px';
  wrapper.style.height = '1123px';
  wrapper.style.zIndex = '-9999';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.overflow = 'hidden';
  wrapper.style.margin = '0';
  wrapper.style.padding = '0';
  wrapper.style.background = 'transparent';

  const clone = sourceEl.cloneNode(true);
  clone.removeAttribute('id');

  // If sourceEl is a sub-page (.biodata-page-1 / .biodata-page-2), inherit root sheet classes & CSS variables
  if (hostSheet && hostSheet !== sourceEl) {
    const rootStyle = hostSheet.getAttribute('style') || '';
    const pageStyle = clone.getAttribute('style') || '';
    clone.setAttribute('style', `${rootStyle}; ${pageStyle}`);
    hostSheet.classList.forEach((cls) => {
      if (cls !== 'biodata-sheet-two-page') {
        clone.classList.add(cls);
      }
    });
  }

  clone.style.transform = 'none';
  clone.style.webkitTransform = 'none';
  clone.style.transformOrigin = 'top left';
  clone.style.width = '794px';
  clone.style.minWidth = '794px';
  clone.style.maxWidth = '794px';
  clone.style.height = '1123px';
  clone.style.minHeight = '1123px';
  clone.style.maxHeight = '1123px';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.position = 'relative';
  clone.style.left = '0px';
  clone.style.top = '0px';

  // Remove interactive-only UI overlays from exported output
  clone
    .querySelectorAll('.sheet-edit-hint-pill, .sticker-transform-toolbar')
    .forEach((el) => el.remove());
  clone.querySelectorAll('.sticker-selected').forEach((el) => el.classList.remove('sticker-selected'));
  clone.querySelectorAll('[contenteditable]').forEach((el) => {
    el.removeAttribute('contenteditable');
  });

  // Ensure all decorative frame/backdrop SVGs have explicit pixel dimensions so html2canvas renders 100% of the frame
  clone
    .querySelectorAll('.sheet-frame-layer svg, .sheet-paper-texture-layer svg, svg.sheet-frame-svg')
    .forEach((svg) => {
      svg.setAttribute('width', '794');
      svg.setAttribute('height', '1123');
      svg.style.width = '794px';
      svg.style.height = '1123px';
    });

  // Fix html2canvas bug where non-zero CSS letter-spacing creates multi-space gaps between words
  clone.querySelectorAll('*').forEach((el) => {
    if (el.style) {
      el.style.letterSpacing = '0px';
      el.style.fontKerning = 'normal';
    }
  });

  // Rasterize any SVG data URL images (e.g. default portrait avatars) to PNG so html2canvas draws them 100% reliably
  const imgNodes = Array.from(clone.querySelectorAll('img'));
  for (const imgEl of imgNodes) {
    const rawSrc = imgEl.getAttribute('src') || '';
    if (rawSrc.startsWith('data:image/svg+xml')) {
      const pngDataUrl = await rasterizeImageUrlToPngDataUrl(rawSrc, 320, 400);
      imgEl.setAttribute('src', pngDataUrl);
    }
  }

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  // Wait for all images inside clone to finish decoding
  for (const imgEl of imgNodes) {
    if (imgEl.decode) {
      try {
        await imgEl.decode();
      } catch {
        // ignore decode errors
      }
    }
  }

  try {
    const computedPaper =
      window.getComputedStyle(clone).getPropertyValue('--tpl-paper')?.trim() ||
      window.getComputedStyle(clone).backgroundColor ||
      '#ffffff';

    const html2canvas = await loadHtml2Canvas();
    const canvas = await html2canvas(clone, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: computedPaper || '#ffffff',
      width: 794,
      height: 1123,
      windowWidth: 794,
      windowHeight: 1123,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      logging: false
    });
    return canvas;
  } finally {
    if (wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
  }
}

export async function buildPdfDocument(sheetEl, stateOrName) {
  if (!sheetEl) return null;
  const candidateName =
    typeof stateOrName === 'string' ? stateOrName : getCandidateName(stateOrName);
  const fileName = `${slugifyFilename(candidateName)}-biodata.pdf`;

  const pageNodes = sheetEl.querySelectorAll('.biodata-subpage');
  const JsPDFClass = await loadJsPDF();
  const pdf = new JsPDFClass({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
  const pageCount = pageNodes && pageNodes.length > 1 ? pageNodes.length : 1;

  if (pageNodes && pageNodes.length > 1) {
    for (let i = 0; i < pageNodes.length; i++) {
      if (i > 0) pdf.addPage('a4', 'portrait');
      const canvas = await renderUnscaledSheetCanvas(pageNodes[i], sheetEl, 2.5);
      const imgData = canvas.toDataURL('image/jpeg', 0.96);
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }
  } else {
    const canvas = await renderUnscaledSheetCanvas(sheetEl, sheetEl, 2.5);
    const imgData = canvas.toDataURL('image/jpeg', 0.96);
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  }

  const pdfBase64 = pdf.output('datauristring');
  return { pdf, fileName, pageCount, pdfBase64 };
}

/**
 * Sends the generated PDF binary (base64) and structured candidate state (including photo)
 * to `/api/archive-download` so every download is persisted in Cloudflare R2 (`biodata/` folder)
 * and Cloudflare D1 (`biodata_downloads` + `biodata_candidates` tables).
 */
export async function archiveBiodataToCloudflareR2AndD1({
  state,
  sheetEl,
  pdfBase64,
  fileName,
  pageCount = 1,
  downloadFormat = 'pdf'
} = {}) {
  try {
    if (typeof window === 'undefined' || typeof fetch === 'undefined') {
      return null;
    }

    let finalPdfBase64 = pdfBase64;
    let finalFileName = fileName;
    let finalPageCount = pageCount;

    if (!finalPdfBase64) {
      const targetSheet =
        sheetEl ||
        document.getElementById('biodata-sheet') ||
        document.querySelector('#biodata-preview-root .biodata-sheet') ||
        document.querySelector('.biodata-sheet');
      if (targetSheet) {
        const built = await buildPdfDocument(targetSheet, state);
        if (built) {
          finalPdfBase64 = built.pdfBase64;
          finalFileName = built.fileName;
          finalPageCount = built.pageCount;
        }
      }
    }

    const res = await fetch('/api/archive-download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        state: state && typeof state === 'object' ? state : {},
        pdfBase64: finalPdfBase64 || '',
        fileName: finalFileName || '',
        pageCount: finalPageCount || 1,
        downloadFormat,
        pageUrl: window.location.href
      })
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    // Non-blocking archival: never interrupt the user's local download
    return null;
  }
}

export const archiveBiodataPdfToMongo = archiveBiodataToCloudflareR2AndD1;

export async function exportToPDF(sheetEl, stateOrName) {
  if (!sheetEl) return;
  const built = await buildPdfDocument(sheetEl, stateOrName);
  if (!built) return;

  // 1. Trigger local PDF download immediately
  built.pdf.save(built.fileName);

  // 2. Save the exact same PDF file + photo + candidate record in Cloudflare R2 & D1
  await archiveBiodataToCloudflareR2AndD1({
    state: typeof stateOrName === 'object' ? stateOrName : null,
    sheetEl,
    pdfBase64: built.pdfBase64,
    fileName: built.fileName,
    pageCount: built.pageCount,
    downloadFormat: 'pdf'
  });
}

export const exportToPdf = exportToPDF;

export async function exportToImage(sheetEl, stateOrName, format = 'png') {
  if (!sheetEl) return;
  const candidateName =
    typeof stateOrName === 'string' ? stateOrName : getCandidateName(stateOrName);

  const pageNodes = sheetEl.querySelectorAll('.biodata-subpage');
  const targetNode = pageNodes && pageNodes.length > 1 ? pageNodes[0] : sheetEl;
  const canvas = await renderUnscaledSheetCanvas(targetNode, sheetEl, 2.5);

  const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
  const ext = format === 'jpg' ? 'jpg' : 'png';

  await new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          triggerDownload(blob, `${slugifyFilename(candidateName)}-biodata.${ext}`);
        }
        resolve();
      },
      mime,
      0.95
    );
  });

  // Also generate & archive the exact PDF file to MongoDB Atlas when downloading PNG/JPG
  archiveBiodataPdfToMongo({
    state: typeof stateOrName === 'object' ? stateOrName : null,
    sheetEl,
    downloadFormat: ext
  });
}

function dataUrlToUint8Array(dataUrl) {
  try {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return null;
    }
    const parts = dataUrl.split(',');
    if (parts.length < 2) return null;
    const base64 = parts[1];
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

/**
 * Generates an editable Microsoft Word (.docx) document that mirrors the live A4 preview:
 * - Page border & colors matched to the active template
 * - Centered religious invocation lines, biodata title, and candidate name header
 * - First section (Personal Details) placed side-by-side with the candidate portrait photo
 * - Subsequent sections rendered in clean aligned 2-column tables
 */
export async function exportToWordDocx(state, template) {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    AlignmentType,
    BorderStyle,
    HeadingLevel,
    ImageRun,
    VerticalAlign
  } = await loadDocx();
  const tpl = template || getTemplateById(state?.templateId);
  const f = state?.formatting || {};

  const primaryHex = String(f.customAccentColor || tpl?.colors?.primary || '#7C1D26').replace('#', '');
  const secondaryHex = String(f.customSecondaryColor || tpl?.colors?.secondary || '#C69214').replace('#', '');
  const textHex = String(f.customTextColor || tpl?.colors?.text || '#231815').replace('#', '');
  const mutedHex = String(tpl?.colors?.muted || '#6E5A53').replace('#', '');

  const activeSections = getActiveSections(state);
  const children = [];

  // 1. Invocation Lines
  const invocationLines = (state?.invocationLines || [])
    .map((l) => String(l || '').trim())
    .filter(Boolean);

  for (const line of invocationLines) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: line,
            bold: true,
            size: 21,
            color: primaryHex,
            font: 'Georgia'
          })
        ]
      })
    );
  }

  // 2. Document Title
  const docTitle = String(state?.docTitle || 'MARRIAGE BIODATA').trim();
  if (docTitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: docTitle.toUpperCase(),
            bold: true,
            size: 22,
            color: secondaryHex,
            font: 'Georgia'
          })
        ]
      })
    );
  }

  // 3. Candidate Name Header
  const candidateName = getCandidateName(state);
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 180 },
      border: {
        bottom: {
          color: secondaryHex,
          space: 6,
          style: BorderStyle.SINGLE,
          size: 10
        }
      },
      children: [
        new TextRun({
          text: candidateName,
          bold: true,
          size: 34,
          color: primaryHex,
          font: 'Georgia'
        })
      ]
    })
  );

  const labelColWidth = Number(f.labelWidthPercent) || 36;
  const valColWidth = Math.max(30, 100 - labelColWidth);

  const buildFieldsTable = (fields) =>
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        insideHorizontal: { style: BorderStyle.DOTTED, size: 4, color: 'E2D5C4' },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
      },
      rows: fields.map(
        (field) =>
          new TableRow({
            children: [
              new TableCell({
                width: { size: labelColWidth, type: WidthType.PERCENTAGE },
                margins: { top: 50, bottom: 50, left: 40, right: 80 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: String(field.label || ''),
                        bold: true,
                        size: 20,
                        color: mutedHex,
                        font: 'Calibri'
                      })
                    ]
                  })
                ]
              }),
              new TableCell({
                width: { size: valColWidth, type: WidthType.PERCENTAGE },
                margins: { top: 50, bottom: 50, left: 40, right: 40 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `:  ${String(field.value || '').trim()}`,
                        size: 20,
                        color: textHex,
                        font: 'Calibri'
                      })
                    ]
                  })
                ]
              })
            ]
          })
      )
    });

  const buildSectionHeadingParagraph = (title) =>
    new Paragraph({
      spacing: { before: 150, after: 80 },
      border: {
        bottom: {
          color: secondaryHex,
          space: 3,
          style: BorderStyle.SINGLE,
          size: 6
        }
      },
      children: [
        new TextRun({
          text: `❖  ${String(title || 'Details').toUpperCase()}`,
          bold: true,
          size: 22,
          color: primaryHex,
          font: 'Georgia'
        })
      ]
    });

  // Check if photo should be rendered alongside Personal Details (matching the A4 preview!)
  const templateSupportsPhoto = tpl?.photoSupport !== 'no-photo' && tpl?.photoShape !== 'none';
  const hasPhoto = Boolean(templateSupportsPhoto && state?.photo?.show !== false && state?.photo?.dataUrl);
  const resolvedPhotoDataUrl = hasPhoto
    ? (String(state.photo.dataUrl).startsWith('data:image/svg+xml')
        ? await rasterizeImageUrlToPngDataUrl(state.photo.dataUrl, 320, 400)
        : state.photo.dataUrl)
    : null;
  const photoBytes = resolvedPhotoDataUrl ? dataUrlToUint8Array(resolvedPhotoDataUrl) : null;

  activeSections.forEach((sec, idx) => {
    const activeFields = sec.visibleFields || [];
    if (activeFields.length === 0) return;

    if (idx === 0 && photoBytes) {
      const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: noBorder,
            bottom: noBorder,
            left: noBorder,
            right: noBorder,
            insideHorizontal: noBorder,
            insideVertical: noBorder
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 72, type: WidthType.PERCENTAGE },
                  verticalAlign: VerticalAlign.TOP,
                  margins: { top: 0, bottom: 60, left: 0, right: 180 },
                  children: [
                    buildSectionHeadingParagraph(sec.title),
                    buildFieldsTable(activeFields)
                  ]
                }),
                new TableCell({
                  width: { size: 28, type: WidthType.PERCENTAGE },
                  verticalAlign: VerticalAlign.TOP,
                  margins: { top: 150, bottom: 60, left: 80, right: 0 },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      children: [
                        new ImageRun({
                          data: photoBytes,
                          transformation: {
                            width: 145,
                            height: 182
                          }
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      );
    } else {
      children.push(buildSectionHeadingParagraph(sec.title));
      children.push(buildFieldsTable(activeFields));
    }
  });

  // Subtle footer attribution matching A4 sheet
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 260 },
      children: [
        new TextRun({
          text: 'Made via biodata.cogify.me',
          italics: true,
          size: 16,
          color: mutedHex,
          font: 'Calibri'
        })
      ]
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 640,
              right: 680,
              bottom: 640,
              left: 680
            },
            borders: {
              pageBorderTop: { style: BorderStyle.DOUBLE, size: 12, color: secondaryHex, space: 14 },
              pageBorderBottom: { style: BorderStyle.DOUBLE, size: 12, color: secondaryHex, space: 14 },
              pageBorderLeft: { style: BorderStyle.DOUBLE, size: 12, color: secondaryHex, space: 14 },
              pageBorderRight: { style: BorderStyle.DOUBLE, size: 12, color: secondaryHex, space: 14 }
            }
          }
        },
        children
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, `${slugifyFilename(candidateName)}-biodata.docx`);

  // Also archive the corresponding PDF file + candidate record in MongoDB Atlas
  archiveBiodataPdfToMongo({
    state,
    downloadFormat: 'docx'
  });
}

export function printBiodata() {
  if (typeof window !== 'undefined') {
    window.print();
  }
}

export function exportBiodataJSON(state) {
  const candidateName = getCandidateName(state);
  const payload = JSON.stringify(state, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  triggerDownload(blob, `${slugifyFilename(candidateName)}-biodata-backup.json`);

  // Also archive the corresponding PDF file + candidate record in MongoDB Atlas
  archiveBiodataPdfToMongo({
    state,
    downloadFormat: 'json'
  });
}

export const exportProjectJson = exportBiodataJSON;

export function importBiodataJSON(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(String(e.target?.result || ''));
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.sections)) {
          reject(new Error('Invalid biodata JSON structure'));
          return;
        }
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Generates a clean, well-structured WhatsApp & plain-text summary of all visible sections and fields
 */
export function generateFormattedTextSummary(state) {
  const invocationLines = (state?.invocationLines || [])
    .map((l) => String(l || '').trim())
    .filter(Boolean);
  const docTitle = String(state?.docTitle || 'MARRIAGE BIODATA').trim().toUpperCase();
  const candidateName = getCandidateName(state);
  const activeSections = getActiveSections(state);

  const lines = [];
  if (invocationLines.length > 0) {
    lines.push(`🙏 *${invocationLines[0]}*`);
  }
  lines.push(`✨ *${docTitle} — ${candidateName}* ✨`);
  lines.push('');

  for (const sec of activeSections) {
    lines.push(`📌 *${sec.title}*`);
    for (const f of sec.visibleFields || []) {
      lines.push(`• *${f.label}:* ${String(f.value).trim()}`);
    }
    lines.push('');
  }

  lines.push('Made via https://biodata.cogify.me');
  return lines.join('\n');
}

export async function shareBiodata(sheetEl, state, mode = 'whatsapp') {
  const summaryText = generateFormattedTextSummary(state);

  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(summaryText);
    } catch {
      // ignore clipboard errors
    }
  }

  if (mode === 'copy') {
    return 'copied';
  }

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(summaryText)}`;
  if (typeof window !== 'undefined') {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }
  return 'whatsapp';
}
