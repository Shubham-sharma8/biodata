#!/usr/bin/env node
/**
 * Phase 9: Repeatable Template Ingestion, Validation & Asset Verification Pipeline
 *
 * Usage:
 *   node scripts/ingest-templates.mjs
 *   node scripts/ingest-templates.mjs --input ./path-to-candidate-templates.json
 *
 * Note on Canva MCP:
 *   Canva MCP tools are interactive agent tools provided within an authenticated Antigravity session
 *   (not a background daemon or unauthenticated REST API). Interactive discovery results and authorized
 *   Path A exports (`export-design`) are recorded in `src/data/canvaCatalog.js` and `public/canva-imports/`.
 *   This pipeline normalizes, deduplicates, classifies, validates schemas, generates live renderer
 *   thumbnails, renders sample biodata across all templates, checks for missing assets/overflows,
 *   and produces `reports/template-ingestion-report.json`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  CANVA_MCP_DISCOVERY_SUMMARY,
  CANVA_DISCOVERED_CATALOG,
  getCanvaCatalogStats
} from '../src/data/canvaCatalog.js';
import { TEMPLATES } from '../src/data/templates.js';
import { createInitialBiodataState } from '../src/data/presets.js';
import {
  normalizeTemplate,
  validateTemplateSchema,
  validateTemplateCollection,
  renderLiveTemplateMiniPreview
} from '../src/templates/adapter.js';
import { buildBiodataSheetMarkup } from '../src/templates/renderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const REPORT_PATH = path.join(PROJECT_ROOT, 'reports', 'template-ingestion-report.json');

function runIngestionPipeline() {
  const startedAt = new Date().toISOString();
  const warnings = [];
  const failedImports = [];
  const successfulTemplates = [];

  // 1. Validate Canva MCP Reference Catalog & Deduplication
  const seenCanvaIds = new Set();
  const canvaPathCounts = {
    path_a_direct_import: 0,
    path_b_editable_reconstruction: 0,
    path_c_external_reference: 0
  };
  const verifiedCanvaAssets = [];

  for (const item of CANVA_DISCOVERED_CATALOG) {
    if (!item.canvaDesignId) {
      failedImports.push({ type: 'canva_reference', reason: 'Missing canvaDesignId', item });
      continue;
    }
    if (seenCanvaIds.has(item.canvaDesignId)) {
      warnings.push(`Duplicate Canva design ID detected and skipped: ${item.canvaDesignId}`);
      continue;
    }
    seenCanvaIds.add(item.canvaDesignId);

    if (canvaPathCounts[item.mappingPath] !== undefined) {
      canvaPathCounts[item.mappingPath]++;
    } else {
      failedImports.push({
        type: 'canva_reference',
        id: item.canvaDesignId,
        reason: `Unknown mappingPath: ${item.mappingPath}`
      });
    }

    if (item.mappingPath === 'path_a_direct_import') {
      if (!item.importedAssetPath) {
        failedImports.push({
          type: 'canva_path_a_asset',
          id: item.canvaDesignId,
          reason: 'Path A design missing importedAssetPath'
        });
      } else {
        const assetDiskPath = path.join(PUBLIC_DIR, item.importedAssetPath.replace(/^\//, ''));
        if (!fs.existsSync(assetDiskPath)) {
          failedImports.push({
            type: 'canva_path_a_asset',
            id: item.canvaDesignId,
            reason: `Authorized export file missing on disk: ${assetDiskPath}`
          });
        } else {
          const stat = fs.statSync(assetDiskPath);
          verifiedCanvaAssets.push({
            canvaDesignId: item.canvaDesignId,
            title: item.title,
            assetPath: item.importedAssetPath,
            sizeBytes: stat.size
          });
        }
      }
    }
  }

  // 2. Optional candidate batch ingestion file (--input <file.json>)
  const args = process.argv.slice(2);
  const inputIdx = args.indexOf('--input');
  let candidateTemplates = [...TEMPLATES];
  if (inputIdx !== -1 && args[inputIdx + 1]) {
    const candidatePath = path.resolve( process.cwd(), args[inputIdx + 1] );
    if (fs.existsSync(candidatePath)) {
      const rawCandidates = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
      if (Array.isArray(rawCandidates)) {
        for (let i = 0; i < rawCandidates.length; i++) {
          const norm = normalizeTemplate(rawCandidates[i], candidateTemplates.length + i);
          const check = validateTemplateSchema(norm);
          if (check.valid) {
            candidateTemplates.push(norm);
          } else {
            failedImports.push({
              type: 'candidate_template',
              id: norm.id,
              errors: check.errors
            });
          }
        }
      }
    }
  }

  // 3. Validate Full Native Template Collection
  const collectionValidation = validateTemplateCollection(candidateTemplates);
  if (!collectionValidation.valid) {
    for (const err of collectionValidation.errors) {
      failedImports.push({
        type: 'collection_validation',
        reason: err
      });
    }
  }

  // 4. Render Sample Biodata & Live Thumbnail Preview for Every Template
  const sampleBrideState = createInitialBiodataState('sample_bride');
  const categoryBreakdown = {};
  const layoutBreakdown = {};
  const styleBreakdown = {};
  const colorFamilyBreakdown = {};
  const sourceTypeBreakdown = {};
  const pageCountBreakdown = { '1_page': 0, '2_page': 0 };
  const photoSupportBreakdown = { with_photo: 0, no_photo: 0 };

  for (let i = 0; i < candidateTemplates.length; i++) {
    const tpl = normalizeTemplate(candidateTemplates[i], i);
    const schemaRes = validateTemplateSchema(tpl);
    if (!schemaRes.valid) {
      failedImports.push({
        type: 'template_schema',
        id: tpl.id,
        errors: schemaRes.errors
      });
      continue;
    }

    // Verify Path A backdrop asset if linked
    if (tpl.canvaAssetPath) {
      const assetFile = path.join(PUBLIC_DIR, tpl.canvaAssetPath.replace(/^\//, ''));
      if (!fs.existsSync(assetFile)) {
        failedImports.push({
          type: 'template_missing_asset',
          id: tpl.id,
          reason: `Missing canvaAssetPath on disk: ${tpl.canvaAssetPath}`
        });
        continue;
      }
    }

    // Generate live miniature preview thumbnail markup
    const miniThumbnailHtml = renderLiveTemplateMiniPreview(tpl, {
      candidateName: 'Ananya Sharma',
      docTitle: 'MARRIAGE BIODATA'
    });
    if (!miniThumbnailHtml || !miniThumbnailHtml.includes('tpl-live-mini-sheet')) {
      failedImports.push({
        type: 'template_thumbnail_render',
        id: tpl.id,
        reason: 'Live miniature preview renderer returned invalid markup'
      });
      continue;
    }

    // Render full A4 sample biodata sheet
    const renderedSheet = buildBiodataSheetMarkup(sampleBrideState, tpl);
    if (!renderedSheet || !renderedSheet.innerHTML || !renderedSheet.innerHTML.includes('sheet-frame-layer')) {
      failedImports.push({
        type: 'template_full_render',
        id: tpl.id,
        reason: 'Full A4 sheet renderer returned incomplete markup'
      });
      continue;
    }

    // Aggregate breakdowns
    categoryBreakdown[tpl.category] = (categoryBreakdown[tpl.category] || 0) + 1;
    layoutBreakdown[tpl.layout] = (layoutBreakdown[tpl.layout] || 0) + 1;
    colorFamilyBreakdown[tpl.colorFamily] = (colorFamilyBreakdown[tpl.colorFamily] || 0) + 1;
    sourceTypeBreakdown[tpl.sourceType] = (sourceTypeBreakdown[tpl.sourceType] || 0) + 1;
    if (tpl.pageCount === 2) {
      pageCountBreakdown['2_page']++;
    } else {
      pageCountBreakdown['1_page']++;
    }
    if (tpl.supportsPhoto === false) {
      photoSupportBreakdown.no_photo++;
    } else {
      photoSupportBreakdown.with_photo++;
    }
    for (const s of tpl.styleTags || []) {
      styleBreakdown[s] = (styleBreakdown[s] || 0) + 1;
    }

    successfulTemplates.push({
      id: tpl.id,
      name: tpl.name,
      category: tpl.category,
      layout: tpl.layout,
      borderStyle: tpl.borderStyle,
      headerStyle: tpl.headerStyle,
      fontPair: tpl.fontPair,
      colorFamily: tpl.colorFamily,
      pageCount: tpl.pageCount,
      supportsPhoto: tpl.supportsPhoto,
      sourceType: tpl.sourceType,
      canvaRefId: tpl.canvaRefId || null
    });
  }

  const report = {
    pipelineVersion: '1.0.0',
    generatedAt: startedAt,
    status: failedImports.length === 0 ? 'SUCCESS' : 'FAILED',
    canvaDiscoverySummary: {
      mcpServer: CANVA_MCP_DISCOVERY_SUMMARY.mcpServer,
      totalWorkspaceItemsScanned: CANVA_MCP_DISCOVERY_SUMMARY.totalAccessibleDesignsInAccount,
      rawCandidateHitsAcrossQueries: CANVA_MCP_DISCOVERY_SUMMARY.rawWeddingAndBiodataSearchCandidates,
      uniqueDeduplicatedCanvaReferences: seenCanvaIds.size,
      pathCounts: canvaPathCounts,
      verifiedPathADirectExports: verifiedCanvaAssets,
      catalogStats: getCanvaCatalogStats()
    },
    nativeTemplateCollectionSummary: {
      totalValidatedTemplates: successfulTemplates.length,
      uniqueIds: collectionValidation.uniqueIds,
      uniqueVisualSignatures: collectionValidation.uniqueSignatures,
      categoryBreakdown,
      layoutBreakdown,
      styleBreakdown,
      colorFamilyBreakdown,
      sourceTypeBreakdown,
      pageCountBreakdown,
      photoSupportBreakdown
    },
    warnings,
    failedImportsCount: failedImports.length,
    failedImports
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf8');

  console.log(`[Template Ingestion Pipeline] Status: ${report.status}`);
  console.log(`  • Canva References Deduplicated: ${seenCanvaIds.size} (Path A: ${canvaPathCounts.path_a_direct_import}, Path B: ${canvaPathCounts.path_b_editable_reconstruction}, Path C: ${canvaPathCounts.path_c_external_reference})`);
  console.log(`  • Verified Path A Export Assets on Disk: ${verifiedCanvaAssets.length}`);
  console.log(`  • Native Website Templates Validated & Rendered: ${successfulTemplates.length}`);
  console.log(`  • Unique Visual/Structural Signatures: ${collectionValidation.uniqueSignatures}`);
  console.log(`  • Failed Imports / Schema Errors: ${failedImports.length}`);
  console.log(`  • Report written to: ${REPORT_PATH}`);

  if (failedImports.length > 0) {
    console.error('Failed imports:', JSON.stringify(failedImports, null, 2));
    process.exit(1);
  }
}

runIngestionPipeline();
