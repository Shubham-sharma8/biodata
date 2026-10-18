# Repeatable Template Ingestion & Scaling Guide (400+ Additional Templates)

## 1. Architecture Overview

The Marriage Biodata Maker template engine is built around a combinatorial, zero-bloat vector and DOM rendering architecture:

1. **Canva MCP Reference Catalog** ([`src/data/canvaCatalog.js`](../src/data/canvaCatalog.js))
   - Records every discovered Canva design, query provenance, ownership (`owned` vs `shared`), page count, and explicit licensing/permitted usage classification:
     - **Path A (`path_a_direct_import`)**: Authorized exports obtained via Canva MCP `export-design` (`get-export-formats` verified `png`/`pdf`/`jpg`) and saved under `public/canva-imports/`.
     - **Path B (`path_b_editable_reconstruction`)**: Accessible reference designs reconstructed as 100% editable, native HTML/CSS/SVG biodata templates.
     - **Path C (`path_c_external_reference`)**: External Canva editor links retained for user reference without claiming native import.

2. **Template Adapter & Schema Validator** ([`src/templates/adapter.js`](../src/templates/adapter.js))
   - Normalizes raw template definitions into a strict schema (`normalizeTemplate`).
   - Enforces unique IDs, valid hex colors, supported structural layouts, supported SVG border frames, valid A4 page dimensions (`794×1123 px`), and unique visual/structural signatures (`validateTemplateSchema` & `validateTemplateCollection`).
   - Generates live miniature DOM/SVG thumbnails (`renderLiveTemplateMiniPreview`) directly from the template engine so thumbnails never drift from the real template.

3. **Universal A4 Sheet Renderer** ([`src/templates/renderer.js`](../src/templates/renderer.js))
   - Renders any template (`buildBiodataSheetMarkup` and `renderSheetIntoElement`) across **10 structural layouts**, **24 vector SVG frames**, **6 section header styles**, **6 font pairings**, **1-page and 2-page formats**, and **photo / no-photo** modes.

4. **Automated Ingestion & Verification Pipeline** ([`scripts/ingest-templates.mjs`](../scripts/ingest-templates.mjs))
   - Deduplicates and validates Canva catalog references and physical Path A assets.
   - Validates all native templates in [`src/data/templates.js`](../src/data/templates.js) (or external JSON candidate batches via `--input`).
   - Renders sample biodata and live thumbnails across every template to catch missing assets or rendering errors.
   - Outputs [`reports/template-ingestion-report.json`](../reports/template-ingestion-report.json).

---

## 2. Running the Ingestion Pipeline

```bash
# Run full ingestion, schema validation, sample rendering & report generation
npm run ingest

# Validate and ingest an external batch of candidate templates
node scripts/ingest-templates.mjs --input ./candidates/new-batch.json

# Run the automated 15-point Quality Assurance suite
npm test
```

---

## 3. How to Add Another 400+ Templates in the Future

The current engine supports **10 layouts × 24 vector SVG frames × 6 header styles × 6 font pairings × 2 page counts × 2 photo modes × unlimited cultural color palettes**, providing over **34,560 structural permutations** before even adding new SVG borders.

To add **400+ additional genuinely differentiated templates** without hurting page load speed:

### Step 1: Interactive Canva MCP Discovery (When Connected in Antigravity)
1. Call `search-designs` with culturally specific or stylistic queries (e.g., `"Kashmiri wedding"`, `"Assamese Biya"`, `"Sindhi Lagan"`, `"Parsi wedding"`, `"Nepali Vivah"`, `"Art Deco border"`, `"Botanical gold frame"`, `"Minimalist executive bio"`).
2. For each candidate design ID:
   - Call `get-design` and `get-design-pages` to inspect metadata and page structure.
   - Call `get-export-formats` to check if direct export is authorized.
   - If authorized and appropriate for a backdrop/header asset, call `export-design` (`format: { type: "png", width: 800 }`), download to `public/canva-imports/<designId>.png`, and record as `path_a_direct_import` in `src/data/canvaCatalog.js`.
   - Otherwise, record as `path_b_editable_reconstruction` (and build a native template) or `path_c_external_reference` (external link only).

### Step 2: Expand Vector SVG Frames (`src/utils/svgBorders.js`)
- Add new parametric SVG frame generators to `SUPPORTED_BORDER_STYLES` in [`src/utils/svgBorders.js`](../src/utils/svgBorders.js) (for example: `kashmiri-kani-shawl`, `assamese-gamosa-weave`, `sindhi-ajrak-geometric`, `parsi-gara-embroidery`, `himachali-pahari-miniature`, `odisha-pattachitra-frieze`, `art-nouveau- botanical`, `modern-swiss-grid`).
- Because each SVG frame is a pure ~1 KB parametric function, adding 30 more SVG frames adds less than 30 KB gzipped while unlocking thousands of distinct visual combinations.

### Step 3: Register New Native Templates (`src/data/templates.js` or Sharded Category Modules)
- Add new template objects to `RAW_TEMPLATES` in [`src/data/templates.js`](../src/data/templates.js) (or split `src/data/templates/` into category shards such as `templates-regional-north.js`, `templates-regional-south.js`, `templates-floral.js`, `templates-modern.js` and re-export the merged array).
- Ensure every template has:
  - A unique kebab-case `id`
  - Distinct combination of `layout`, `borderStyle`, `headerStyle`, `fontPair`, `pageCount` (`1` or `2`), `supportsPhoto` (`true` or `false`), and curated hex palette (`bg`, `surface`, `primary`, `secondary`, `text`, `muted`)
  - Accurate `category`, `styleTags`, `colorFamily`, `recommendedLanguages`, and `keywords`.

### Step 4: Keep Gallery Performance Fast at 500+ Templates
- The gallery uses progressive batch pagination (`galleryVisibleLimit = 24`) and lightweight parametric SVG miniature previews (`renderLiveTemplateMiniPreview`), so only 24 DOM cards are mounted initially regardless of whether `TEMPLATES` has 112 or 1,000 entries.
- If adding Path A raster images (`public/canva-imports/*.png`), compress them to `<150 KB` WebP/PNG and rely on native `loading="lazy"` on `<img>` tags so off-screen assets are never fetched on initial load.

### Step 5: Verify with Automated Ingestion & QA
1. Run `npm run ingest` — verifies zero duplicate IDs, zero duplicate visual signatures, and 100% valid sample rendering.
2. Run `npm test` — runs all 15 automated QA checks (`tests/quality-assurance.test.mjs`).
3. Run `npm run build` — verifies clean production bundle compilation.
