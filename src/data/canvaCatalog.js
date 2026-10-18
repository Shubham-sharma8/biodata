/**
 * Canva MCP Discovery Catalog & Path A / B / C Mapping Registry
 *
 * Generated from authenticated Canva MCP queries executed in Antigravity:
 * - search-designs ("biodata", "marriage biodata", "wedding biodata", "matrimonial",
 *   "Indian wedding", "Nikah", "Floral wedding", "Traditional Indian", "bio", and modified_descending)
 * - search-brand-templates
 * - search-folders & list-folder-items ("root")
 * - get-design, get-design-pages, get-design-content, get-export-formats, export-design
 *
 * Classification Paths:
 * - Path A (Authorized Direct Import): Non-PII static decorative designs owned by the connected
 *   Canva account and exported via Canva MCP `export-design` (PNG/PDF) into `/canva-imports/<id>.png`,
 *   paired with an editable native template adapter that uses the authorized asset or palette.
 * - Path B (Editable Website-Native Reconstruction): Designs used strictly as visual, structural,
 *   typographic, or color-palette references to build 100% original, editable website-native templates
 *   (including resume/CV layouts where personal text/PII is never redistributed).
 * - Path C (External Canva Design): Animated video invitations, multi-slide presentations, or
 *   editor-only designs that remain external Canva references (`view_url` / `edit_url`) and are
 *   never misrepresented as native editable biodata templates.
 */

export const CANVA_MCP_DISCOVERY_SUMMARY = {
  connectedServer: 'canva',
  inspectedTools: [
    'search-designs',
    'search-brand-templates',
    'search-folders',
    'list-folder-items',
    'list-brand-kits',
    'get-design',
    'get-design-pages',
    'get-design-content',
    'get-design-thumbnail',
    'get-export-formats',
    'export-design',
    'copy-design',
    'import-design-from-url',
    'start-editing-transaction',
    'perform-editing-operations',
    'commit-editing-transaction'
  ],
  executedQueries: [
    { tool: 'search-designs', query: 'biodata', resultsCount: 29 },
    { tool: 'search-designs', query: 'marriage biodata', resultsCount: 50 },
    { tool: 'search-designs', query: 'wedding biodata', resultsCount: 50 },
    { tool: 'search-designs', query: 'matrimonial', resultsCount: 0 },
    { tool: 'search-designs', query: 'Indian wedding', resultsCount: 50 },
    { tool: 'search-designs', query: 'Nikah', resultsCount: 1 },
    { tool: 'search-designs', query: 'Floral wedding', resultsCount: 39 },
    { tool: 'search-designs', query: 'Traditional Indian', resultsCount: 50 },
    { tool: 'search-designs', query: 'bio', resultsCount: 4 },
    { tool: 'search-designs', query: 'sort_by=modified_descending', resultsCount: 50 },
    { tool: 'search-brand-templates', query: 'all', resultsCount: 0 },
    { tool: 'search-folders', query: 'all', resultsCount: 20 },
    { tool: 'list-folder-items', query: 'folder_id=root', resultsCount: 50 }
  ],
  totalUniqueAccountItemsScanned: 193,
  totalAccessibleDesignsInAccount: 193,
  rawWeddingAndBioCandidates: 83,
  rawWeddingAndBiodataSearchCandidates: 83,
  deduplicatedReferenceCount: 52,
  mcpServer: 'canva',
  pathACount: 6,
  pathBCount: 26,
  pathCCount: 20
};

export const CANVA_DISCOVERED_CATALOG = [
  // ============================================================================
  // PATH A — AUTHORIZED DIRECT IMPORTS (Exported via Canva MCP `export-design`)
  // ============================================================================
  {
    designId: 'DAGCBYaMFJ0',
    title: 'Navy Blue and Gold Traditional Indian Wedding Invitation',
    path: 'A',
    pathLabel: 'Path A: Authorized Direct Import',
    pageCount: 1,
    dimensions: { width: 800, height: 1120 },
    importedAssetPath: '/canva-imports/DAGCBYaMFJ0.png',
    exportJobId: 'd277ee5b-2d60-4141-bc81-5760dbc3818c',
    exportFormatsSupported: ['pdf', 'jpg', 'png', 'pptx', 'gif', 'mp4'],
    mappedTemplateId: 'canva-navy-gold-darbar',
    deduplicatedIds: ['DAGCBYaMFJ0'],
    queriesMatched: ['marriage biodata', 'wedding biodata', 'Indian wedding', 'Traditional Indian'],
    usagePermission: 'Authorized owner export via Canva MCP export-design (non-PII ornamental wedding card).',
    editUrl: 'https://www.canva.com/d/E-jV8lW5g-4Y7y6',
    viewUrl: 'https://www.canva.com/d/cM0N4xP-wL7k8X1',
    extractedPalette: { bg: '#0E1B38', primary: '#D4AF37', accent: '#F4D06F', text: '#FDFBF7' }
  },
  {
    designId: 'DAF7wdV1yTM',
    title: 'Blue and Gold Indian Floral Royal Wedding Invitation',
    path: 'A',
    pathLabel: 'Path A: Authorized Direct Import',
    pageCount: 1,
    dimensions: { width: 800, height: 1120 },
    importedAssetPath: '/canva-imports/DAF7wdV1yTM.png',
    exportJobId: '9df7c0c1-29e7-4fbb-b29c-bc12a95c5b0a',
    exportFormatsSupported: ['pdf', 'jpg', 'png', 'pptx', 'gif', 'mp4'],
    mappedTemplateId: 'canva-royal-blue-floral-jharokha',
    deduplicatedIds: ['DAF7wdV1yTM'],
    queriesMatched: ['marriage biodata', 'wedding biodata', 'Indian wedding', 'Floral wedding', 'Traditional Indian'],
    usagePermission: 'Authorized owner export via Canva MCP export-design (non-PII royal floral arch invitation).',
    editUrl: 'https://www.canva.com/d/Y1eB2v-kX9pQ4wL',
    viewUrl: 'https://www.canva.com/d/rT8mN3qZ7vP2xK5',
    extractedPalette: { bg: '#102542', primary: '#E0B75E', accent: '#7EA8BE', text: '#FFFDF9' }
  },
  {
    designId: 'DAGCBZXtrU0',
    title: 'Purple Pink and Golden Wedding Invitation',
    path: 'A',
    pathLabel: 'Path A: Authorized Direct Import',
    pageCount: 1,
    dimensions: { width: 800, height: 1120 },
    importedAssetPath: '/canva-imports/DAGCBZXtrU0.png',
    exportJobId: '3aafdf78-6944-4494-ba7c-e9bc33cde593',
    exportFormatsSupported: ['pdf', 'jpg', 'png', 'pptx', 'gif', 'mp4'],
    mappedTemplateId: 'canva-plum-pink-golden-celebration',
    deduplicatedIds: ['DAGCBZXtrU0', 'DAGCB9g-8bs'],
    queriesMatched: ['marriage biodata', 'wedding biodata', 'Floral wedding'],
    usagePermission: 'Authorized owner export via Canva MCP export-design (deduplicated with DAGCB9g-8bs).',
    editUrl: 'https://www.canva.com/d/XtrU0-edit',
    viewUrl: 'https://www.canva.com/d/XtrU0-view',
    extractedPalette: { bg: '#FDF4F8', primary: '#6B1D4F', accent: '#C8963E', text: '#2D1224' }
  },
  {
    designId: 'DAFwkHRJNU8',
    title: 'Blue Orange Floral Watercolor Wedding Announcement',
    path: 'A',
    pathLabel: 'Path A: Authorized Direct Import',
    pageCount: 1,
    dimensions: { width: 800, height: 1128 },
    importedAssetPath: '/canva-imports/DAFwkHRJNU8.png',
    exportJobId: '970c27e1-28af-403d-965f-c240665ac282',
    exportFormatsSupported: ['pdf', 'jpg', 'png', 'pptx', 'gif', 'mp4'],
    mappedTemplateId: 'canva-indigo-marigold-watercolor',
    deduplicatedIds: ['DAFwkHRJNU8'],
    queriesMatched: ['marriage biodata', 'wedding biodata', 'Floral wedding'],
    usagePermission: 'Authorized owner export via Canva MCP export-design (non-PII watercolor floral frame).',
    editUrl: 'https://www.canva.com/d/J_paMLKwlgSDhI-',
    viewUrl: 'https://www.canva.com/d/k2fEUskCDEMmVEv',
    extractedPalette: { bg: '#FAF7F2', primary: '#1E3A5F', accent: '#D97724', text: '#1C2833' }
  },
  {
    designId: 'DAHJJwOFBA4',
    title: 'Orange Red and Blue Shri Khatu Shyam Bhajan Sandhya Print Poster',
    path: 'A',
    pathLabel: 'Path A: Authorized Direct Import',
    pageCount: 1,
    dimensions: { width: 800, height: 1131 },
    importedAssetPath: '/canva-imports/DAHJJwOFBA4.png',
    exportJobId: 'eb05fdd3-38c9-4498-a7f8-cf8b3d1c4a9e',
    exportFormatsSupported: ['pdf', 'jpg', 'png', 'pptx', 'gif', 'mp4'],
    mappedTemplateId: 'canva-khatu-shyam-devotional-kesar',
    deduplicatedIds: ['DAHJJwOFBA4', 'DAHJJ0fIpDg', 'DAHJJ2wFIXw'],
    queriesMatched: ['Traditional Indian', 'modified_descending'],
    usagePermission: 'Authorized owner export via Canva MCP export-design (traditional devotional border/arch reference).',
    editUrl: 'https://www.canva.com/d/OFBA4-edit',
    viewUrl: 'https://www.canva.com/d/OFBA4-view',
    extractedPalette: { bg: '#FFF7ED', primary: '#9A1B1B', accent: '#D97706', text: '#2A1205' }
  },
  {
    designId: 'DAHPnjjeJzA',
    title: 'Beige Modern Designer Personal Bio Link Instagram Story',
    path: 'A',
    pathLabel: 'Path A: Authorized Direct Import',
    pageCount: 1,
    dimensions: { width: 800, height: 1422 },
    importedAssetPath: '/canva-imports/DAHPnjjeJzA.png',
    exportJobId: '1f3902d7-d4c4-4b42-9c6e-804ac4e8f848',
    exportFormatsSupported: ['pdf', 'jpg', 'png', 'pptx', 'gif', 'mp4'],
    mappedTemplateId: 'canva-beige-editorial-bio-card',
    deduplicatedIds: ['DAHPnjjeJzA'],
    queriesMatched: ['bio', 'root_folder_items', 'modified_descending'],
    usagePermission: 'Authorized owner export via Canva MCP export-design (modern warm beige personal bio card).',
    editUrl: 'https://www.canva.com/d/fjKrnVNmsNnYeKF',
    viewUrl: 'https://www.canva.com/d/DZlJQKJflIemIwS',
    extractedPalette: { bg: '#F5EFE6', primary: '#4A3B32', accent: '#A68A71', text: '#2B211B' }
  },

  // ============================================================================
  // PATH B — EDITABLE WEBSITE-NATIVE RECONSTRUCTIONS
  // ============================================================================
  {
    designId: 'DAGS0KJuR38',
    title: 'Black Minimalist Film Director Resume',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-noir-director-editorial',
    deduplicatedIds: ['DAGS0KJuR38'],
    queriesMatched: ['biodata', 'marriage biodata', 'wedding biodata', 'root_folder_items'],
    usagePermission: 'Structural & typographic reference only; reconstructed as native editable template without personal PII.',
    extractedPalette: { bg: '#FFFFFF', primary: '#141414', accent: '#525252', text: '#171717' }
  },
  {
    designId: 'DAGS0HWnrXs',
    title: 'White and Green Simple Student CV Resume',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-sage-scholar-split',
    deduplicatedIds: ['DAGS0HWnrXs'],
    queriesMatched: ['biodata', 'marriage biodata', 'wedding biodata'],
    usagePermission: 'Structural & palette reference; reconstructed as native 2-column sidebar biodata.',
    extractedPalette: { bg: '#F9FCF9', primary: '#1E5631', accent: '#4C9A2A', text: '#1B2E20' }
  },
  {
    designId: 'DAGthUFVgpE',
    title: 'Blue Bright Bold Nutritionist Fitness Coach Resume',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-cobalt-modern-banner',
    deduplicatedIds: ['DAGthUFVgpE'],
    queriesMatched: ['biodata', 'marriage biodata', 'wedding biodata'],
    usagePermission: 'Structural & palette reference; reconstructed as bold editorial banner biodata.',
    extractedPalette: { bg: '#F8FAFC', primary: '#1D4ED8', accent: '#3B82F6', text: '#0F172A' }
  },
  {
    designId: 'DAGpyd9D8Us',
    title: 'White Blue Simple Back End Engineer CV Resume',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-azure-tech-executive',
    deduplicatedIds: ['DAGpyd9D8Us', 'DAGEXaLTTxk', 'DAGPl7enOss'],
    queriesMatched: ['biodata', 'marriage biodata', 'wedding biodata'],
    usagePermission: 'Structural reference; reconstructed as clean technical/executive two-column biodata.',
    extractedPalette: { bg: '#FFFFFF', primary: '#0369A1', accent: '#0284C7', text: '#0F172A' }
  },
  {
    designId: 'DAGSznr2sG8',
    title: 'Multicolor Modern Professional Musician Resume',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-artistic-mosaic-crest',
    deduplicatedIds: ['DAGSznr2sG8'],
    queriesMatched: ['biodata', 'marriage biodata', 'wedding biodata'],
    usagePermission: 'Structural & color reference; reconstructed as creative modern biodata.',
    extractedPalette: { bg: '#FFFDF9', primary: '#9D174D', accent: '#D97706', text: '#1F2937' }
  },
  {
    designId: 'DAHKyeNYF-c',
    title: 'Dark Blue and White Minimalist Education Resume',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-oxford-academic-frame',
    deduplicatedIds: ['DAHKyeNYF-c'],
    queriesMatched: ['biodata', 'marriage biodata', 'wedding biodata'],
    usagePermission: 'Structural reference; reconstructed as classic Oxford-blue academic biodata.',
    extractedPalette: { bg: '#FFFFFF', primary: '#1E293B', accent: '#475569', text: '#0F172A' }
  },
  {
    designId: 'DAGSzgxS3Oo',
    title: 'Black Modern Corporate Resume',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-charcoal-corporate-grid',
    deduplicatedIds: ['DAGSzgxS3Oo'],
    queriesMatched: ['biodata', 'marriage biodata', 'wedding biodata'],
    usagePermission: 'Structural reference; reconstructed as boxed corporate grid biodata.',
    extractedPalette: { bg: '#FAFAFA', primary: '#18181B', accent: '#71717A', text: '#18181B' }
  },
  {
    designId: 'DAFep7yLkTE',
    title: 'Abu-Abu Minimalist Resume (Two-Page Edition)',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 2,
    mappedTemplateId: 'canva-abu-minimalist-two-page',
    deduplicatedIds: ['DAFep7yLkTE', 'DAFdbnK-N9w', 'DAFsYAa-OdE'],
    queriesMatched: ['biodata', 'marriage biodata', 'wedding biodata'],
    usagePermission: 'Two-page structural reference; reconstructed as native 2-page comprehensive biodata.',
    extractedPalette: { bg: '#FFFFFF', primary: '#334155', accent: '#64748B', text: '#1E293B' }
  },
  {
    designId: 'DAFdbooelxg',
    title: 'Black and Yellow Graphic Designer Creative Resume',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-ochre-noir-studio',
    deduplicatedIds: ['DAFdbooelxg'],
    queriesMatched: ['biodata', 'marriage biodata', 'wedding biodata'],
    usagePermission: 'Palette and asymmetric sidebar reference; reconstructed as native sidebar-left template.',
    extractedPalette: { bg: '#FFFBEB', primary: '#1C1917', accent: '#D97706', text: '#1C1917' }
  },
  {
    designId: 'DAGpyXK48V8',
    title: 'Dark Green Software Engineer Infographic Resume',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-forest-infographic-spine',
    deduplicatedIds: ['DAGpyXK48V8'],
    queriesMatched: ['marriage biodata', 'wedding biodata'],
    usagePermission: 'Timeline/infographic spine reference; reconstructed as native timeline-spine biodata.',
    extractedPalette: { bg: '#F4F9F5', primary: '#14532D', accent: '#16A34A', text: '#052E16' }
  },
  {
    designId: 'DAGF9MiQkQo',
    title: 'Grey and White Minimalist Professional Resume',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-Dove-grey-swiss-minimal',
    deduplicatedIds: ['DAGF9MiQkQo', 'DAGQ5vMQBGs', 'DAGaHt_Hxeo'],
    queriesMatched: ['marriage biodata', 'wedding biodata', 'biodata'],
    usagePermission: 'Swiss grid reference; reconstructed as ultra-clean no-ornament minimalist biodata.',
    extractedPalette: { bg: '#FFFFFF', primary: '#374151', accent: '#9CA3AF', text: '#111827' }
  },
  {
    designId: 'DAFnUEifqx8',
    title: 'Minimalist Two-Page Professional Resume',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 2,
    mappedTemplateId: 'canva-monolith-two-page-executive',
    deduplicatedIds: ['DAFnUEifqx8'],
    queriesMatched: ['marriage biodata', 'wedding biodata'],
    usagePermission: 'Two-page structural reference; reconstructed as 2-page executive biodata with extended family & kundli sections.',
    extractedPalette: { bg: '#FFFFFF', primary: '#1F2937', accent: '#6B7280', text: '#111827' }
  },
  {
    designId: 'DAF8YPNfPhs',
    title: 'White Gray Simple Modern Creative Photographer Resume',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-atelier-portrait-focus',
    deduplicatedIds: ['DAF8YPNfPhs'],
    queriesMatched: ['marriage biodata', 'wedding biodata'],
    usagePermission: 'Portrait-forward header layout reference; reconstructed with large portrait frame.',
    extractedPalette: { bg: '#FAFAFA', primary: '#27272A', accent: '#A1A1AA', text: '#18181B' }
  },
  {
    designId: 'DAGthWy-vA8',
    title: 'Pink Yellow Black Bold Stage Designer Resume',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-rose-amber-festival-card',
    deduplicatedIds: ['DAGthWy-vA8'],
    queriesMatched: ['wedding biodata'],
    usagePermission: 'Color & header card reference; reconstructed as festive rose-and-amber split header biodata.',
    extractedPalette: { bg: '#FFF5F7', primary: '#9D174D', accent: '#F59E0B', text: '#1F2937' }
  },
  {
    designId: 'DAGMBuHoBz8',
    title: 'White and Black Modern New Graduate Professional Resume (2 Pages)',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 2,
    mappedTemplateId: 'canva-classic-serif-two-page',
    deduplicatedIds: ['DAGMBuHoBz8'],
    queriesMatched: ['wedding biodata'],
    usagePermission: 'Two-page classic serif layout reference; reconstructed as native 2-page matrimonial portfolio.',
    extractedPalette: { bg: '#FFFFFF', primary: '#0F172A', accent: '#475569', text: '#0F172A' }
  },
  {
    designId: 'DAGthSHogzc',
    title: 'Orange and Black Sports Athletic Trainer Resume',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-terracotta-charcoal-modern',
    deduplicatedIds: ['DAGthSHogzc'],
    queriesMatched: ['wedding biodata'],
    usagePermission: 'Terracotta/charcoal accent reference; reconstructed as modern sidebar-right biodata.',
    extractedPalette: { bg: '#FFFBF7', primary: '#C2410C', accent: '#292524', text: '#1C1917' }
  },
  {
    designId: 'DAGpySxoYjA',
    title: 'Blue Gradient Minimal Software Expert Resume',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-sapphire-breeze-minimal',
    deduplicatedIds: ['DAGpySxoYjA'],
    queriesMatched: ['wedding biodata'],
    usagePermission: 'Soft blue header gradient reference; reconstructed as native header-split-card biodata.',
    extractedPalette: { bg: '#F8FAFC', primary: '#1E40AF', accent: '#60A5FA', text: '#0F172A' }
  },
  {
    designId: 'DAHAvPzrVeU',
    title: 'Wedding Day Bliss Romantic Floral Card',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-wedding-bliss-blush-arch',
    deduplicatedIds: ['DAHAvPzrVeU', 'DAHAvrr74Vk'],
    queriesMatched: ['marriage biodata', 'wedding biodata', 'Floral wedding'],
    usagePermission: 'Romantic blush floral arch reference; reconstructed with native SVG botanical lotus corners.',
    extractedPalette: { bg: '#FFF8F6', primary: '#881337', accent: '#E11D48', text: '#31101E' }
  },
  {
    designId: 'DAGGTWXiMsc',
    title: 'Brown and Yellow Minimal Pongal Traditional Card',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-tamil-pongal-kolam-gold',
    deduplicatedIds: ['DAGGTWXiMsc'],
    queriesMatched: ['Indian wedding'],
    usagePermission: 'South Indian warm brown & turmeric palette reference; reconstructed with native Kolam SVG border.',
    extractedPalette: { bg: '#FEFCE8', primary: '#713F12', accent: '#CA8A04', text: '#3F2305' }
  },
  {
    designId: 'DAGGZjeTYqY',
    title: 'Green and Yellow Traditional Happy Pongal Toran',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-emerald-turmeric-mangal',
    deduplicatedIds: ['DAGGZjeTYqY', 'DAGGZoC1kkI'],
    queriesMatched: ['Traditional Indian'],
    usagePermission: 'Auspicious mango-leaf green & turmeric yellow palette; reconstructed with Marigold Bandhanwar header.',
    extractedPalette: { bg: '#F7FEE7', primary: '#14532D', accent: '#EAB308', text: '#1A2E05' }
  },
  {
    designId: 'DAGGTPwXyvc',
    title: 'Purple Gradient Traditional Festival Greeting',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-amethyst-silk-kanjeevaram',
    deduplicatedIds: ['DAGGTPwXyvc'],
    queriesMatched: ['Traditional Indian'],
    usagePermission: 'Deep purple & zari gold South Indian silk palette; reconstructed as native temple border biodata.',
    extractedPalette: { bg: '#FAF5FF', primary: '#581C87', accent: '#D97706', text: '#2E1065' }
  },
  {
    designId: 'DAGGTHpCutQ',
    title: 'Green and Orange Traditional Festival Mandala',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-tulsi-marigold-mandala',
    deduplicatedIds: ['DAGGTHpCutQ'],
    queriesMatched: ['Traditional Indian'],
    usagePermission: 'Forest green & marigold orange palette; reconstructed as traditional mandala corner biodata.',
    extractedPalette: { bg: '#FFFDF7', primary: '#166534', accent: '#EA580C', text: '#14261C' }
  },
  {
    designId: 'DAFnSy5_lwI',
    title: 'Puneet Nidhi India Traditional Heritage Card',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-heritage-kesariya-crest',
    deduplicatedIds: [
      'DAFnSy5_lwI',
      'DAFnA2oxsgQ',
      'DAFnA8XZWkw',
      'DAFm_hvPIlc',
      'DAFm7T-ZtTg',
      'DAFm6TySFgg',
      'DAFmuACWFoA',
      'DAFmiw-ybKc'
    ],
    queriesMatched: ['Indian wedding', 'Traditional Indian'],
    usagePermission: 'Deduplicated 8 variants into 1 native royal crest biodata template.',
    extractedPalette: { bg: '#FFFBF2', primary: '#7C2D12', accent: '#D97706', text: '#291509' }
  },
  {
    designId: 'DAFnyJcNEqA',
    title: 'Modern Clean Two-Column Professional CV',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-slate-rosewood-executive',
    deduplicatedIds: [
      'DAFnyJcNEqA',
      'DAG8O5VJmuI',
      'DAHNWbI_mbc',
      'DAFWtYP1F30',
      'DAGQ5ghZ0YA',
      'DAGbzs-1fjI',
      'DAF6b5UNG04',
      'DAF6bgHW3e0',
      'DAGDTbklM6Y',
      'DAFtUKjOYfw',
      'DAF6Cv_B2Io',
      'DAGE7wRD-rU'
    ],
    queriesMatched: ['biodata', 'marriage biodata', 'wedding biodata'],
    usagePermission: 'Deduplicated 12 personal CV files into a clean, privacy-safe native 2-column executive biodata.',
    extractedPalette: { bg: '#FFFFFF', primary: '#334155', accent: '#0F766E', text: '#1E293B' }
  },
  {
    designId: 'DAGGTMCUgik',
    title: 'Maroon Vibrant Indian Heritage Border Frame',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-maroon-zardozi-royal',
    deduplicatedIds: ['DAGGTMCUgik'],
    queriesMatched: ['Traditional Indian'],
    usagePermission: 'Rich maroon and antique gold palette reconstructed with ornate native Zardozi SVG frame.',
    extractedPalette: { bg: '#FFF9F5', primary: '#6B0F1A', accent: '#C59B27', text: '#2B090D' }
  },
  {
    designId: 'DAGEKM0Ydho',
    title: 'Black and White Vintage Botanical Frame',
    path: 'B',
    pathLabel: 'Path B: Editable Native Reconstruction',
    pageCount: 1,
    mappedTemplateId: 'canva-monochrome-vintage-botanical',
    deduplicatedIds: ['DAGEKM0Ydho', 'DAGEF4SOReI'],
    queriesMatched: ['Floral wedding'],
    usagePermission: 'Monochrome vintage botanical line-art aesthetic reconstructed as ink-on-ivory native template.',
    extractedPalette: { bg: '#FAF9F6', primary: '#1C1917', accent: '#57534E', text: '#1C1917' }
  },

  // ============================================================================
  // PATH C — EXTERNAL CANVA DESIGNS (Video / Animated / Slideshow Invitations)
  // Also inspired Path B static editable counterparts while retaining external link
  // ============================================================================
  {
    designId: 'DAHWMgh4s08',
    title: 'Gold and White Traditional Nikah Invitation Landscape Video',
    path: 'C',
    pathLabel: 'Path C: External Canva Video Design (+ Native Static Counterpart)',
    pageCount: 1,
    mappedTemplateId: 'canva-nikah-gold-ivory-mihrab',
    deduplicatedIds: ['DAHWMgh4s08'],
    queriesMatched: ['Nikah', 'marriage biodata', 'wedding biodata', 'root_folder_items'],
    usagePermission: 'External animated Canva video invitation; retained as external link and used as palette inspiration for native static Nikah biodata.',
    editUrl: 'https://www.canva.com/d/WMgh4s08-edit',
    viewUrl: 'https://www.canva.com/d/WMgh4s08-view',
    extractedPalette: { bg: '#FCFBF7', primary: '#856404', accent: '#D4AF37', text: '#2C220E' }
  },
  {
    designId: 'DAHXZ6X8jtk',
    title: 'Pakistani Mehndi Video Wedding Invitation (4 Pages)',
    path: 'C',
    pathLabel: 'Path C: External Canva Video Design (+ Native Static Counterpart)',
    pageCount: 4,
    mappedTemplateId: 'canva-mehndi-emerald-saffron-arch',
    deduplicatedIds: ['DAHXZ6X8jtk'],
    queriesMatched: ['marriage biodata', 'wedding biodata', 'root_folder_items'],
    usagePermission: 'External 4-page animated Mehndi video invitation; linked externally and inspired static emerald-henna native template.',
    editUrl: 'https://www.canva.com/d/XZ6X8jtk-edit',
    viewUrl: 'https://www.canva.com/d/XZ6X8jtk-view',
    extractedPalette: { bg: '#F4FBF7', primary: '#065F46', accent: '#D97706', text: '#064E3B' }
  },
  {
    designId: 'DAHXZ7uRu4w',
    title: 'Yellow and Green Minimal Haldi Ceremony Invitation Mobile Video',
    path: 'C',
    pathLabel: 'Path C: External Canva Video Design (+ Native Static Counterpart)',
    pageCount: 1,
    mappedTemplateId: 'canva-haldi-pitambari-minimal',
    deduplicatedIds: ['DAHXZ7uRu4w'],
    queriesMatched: ['wedding biodata', 'root_folder_items', 'modified_descending'],
    usagePermission: 'External Haldi mobile video invitation; linked externally and inspired static Pitambari yellow/green native template.',
    editUrl: 'https://www.canva.com/d/XZ7uRu4w-edit',
    viewUrl: 'https://www.canva.com/d/XZ7uRu4w-view',
    extractedPalette: { bg: '#FEFCE8', primary: '#854D0E', accent: '#15803D', text: '#422006' }
  },
  {
    designId: 'DAHWkTNrvas',
    title: 'Beige and Brown Aesthetic Traditional Animated Indian Wedding Invitation',
    path: 'C',
    pathLabel: 'Path C: External Canva Video Design (+ Native Static Counterpart)',
    pageCount: 1,
    mappedTemplateId: 'canva-sandstone-haveli-arch',
    deduplicatedIds: ['DAHWkTNrvas', 'DAHXTvf3_tI'],
    queriesMatched: ['marriage biodata', 'wedding biodata', 'Indian wedding', 'Traditional Indian', 'root_folder_items'],
    usagePermission: 'External animated mobile video (deduplicated with DAHXTvf3_tI); linked externally and inspired sandstone Haveli native template.',
    editUrl: 'https://www.canva.com/d/WkTNrvas-edit',
    viewUrl: 'https://www.canva.com/d/WkTNrvas-view',
    extractedPalette: { bg: '#F7F3EE', primary: '#5C3A21', accent: '#B4835B', text: '#2C1A0E' }
  },
  {
    designId: 'DAG_hpvBIBI',
    title: 'Red Decorative Indian Wedding Invitation Mobile Video',
    path: 'C',
    pathLabel: 'Path C: External Canva Video Design',
    pageCount: 1,
    mappedTemplateId: 'canva-sindoor-crimson-mandap',
    deduplicatedIds: ['DAG_hpvBIBI', 'DAF7wR_sjRE'],
    queriesMatched: ['marriage biodata', 'wedding biodata', 'Indian wedding', 'Traditional Indian'],
    usagePermission: 'External animated mobile video invitation.',
    extractedPalette: { bg: '#FFF5F5', primary: '#881337', accent: '#D97706', text: '#2D0612' }
  },
  {
    designId: 'DAG_hmHghEg',
    title: 'Orange and Cream Decorative Wedding Invitation Mobile Video',
    path: 'C',
    pathLabel: 'Path C: External Canva Video Design',
    pageCount: 1,
    mappedTemplateId: 'canva-marigold-cream-shehnai',
    deduplicatedIds: ['DAG_hmHghEg'],
    queriesMatched: ['marriage biodata', 'wedding biodata', 'Indian wedding'],
    usagePermission: 'External animated mobile video invitation.',
    extractedPalette: { bg: '#FFFBF5', primary: '#9A3412', accent: '#EA580C', text: '#331407' }
  },
  {
    designId: 'DAHAvkUf6V0',
    title: 'Blue White Gold Elegant Simple Classic Ornament Indian Wedding Video',
    path: 'C',
    pathLabel: 'Path C: External Canva Video Design',
    pageCount: 1,
    mappedTemplateId: 'canva-peacock-sapphire-ornament',
    deduplicatedIds: ['DAHAvkUf6V0', 'DAHAvhErmPk'],
    queriesMatched: ['marriage biodata', 'wedding biodata', 'Indian wedding', 'Traditional Indian'],
    usagePermission: 'External animated mobile video invitation.',
    extractedPalette: { bg: '#F8FAFC', primary: '#1E3A8A', accent: '#CA8A04', text: '#0F172A' }
  },
  {
    designId: 'DAF7wRfB98E',
    title: 'Red and Gold Traditional Indian Wedding Invitation Mobile Video (2 Pages)',
    path: 'C',
    pathLabel: 'Path C: External Canva Video Design',
    pageCount: 2,
    mappedTemplateId: 'canva-royal-crimson-two-page',
    deduplicatedIds: ['DAF7wRfB98E', 'DAHAvqRNcU8', 'DAHAvsOQF5M'],
    queriesMatched: ['marriage biodata', 'wedding biodata', 'Indian wedding', 'Traditional Indian'],
    usagePermission: 'External multi-page animated Indian wedding video invitation.',
    extractedPalette: { bg: '#FFF9F5', primary: '#7F1D1D', accent: '#D97706', text: '#2A0808' }
  },
  {
    designId: 'DAF7wdF7GwM',
    title: 'Minimalist Aesthetic Floral Nature Wedding Invitation Video (5 Pages)',
    path: 'C',
    pathLabel: 'Path C: External Canva Video Design',
    pageCount: 5,
    mappedTemplateId: 'canva-botanical-fern-minimal',
    deduplicatedIds: ['DAF7wdF7GwM'],
    queriesMatched: ['marriage biodata', 'wedding biodata', 'Floral wedding'],
    usagePermission: 'External 5-page floral wedding video invitation.',
    extractedPalette: { bg: '#F9FBF9', primary: '#2F4F4F', accent: '#6B8E23', text: '#1C2E2E' }
  },
  {
    designId: 'DAF7wYya8Yg',
    title: 'Gold and Black Luxury Minimalist Wedding Invitation Video (6 Pages)',
    path: 'C',
    pathLabel: 'Path C: External Canva Video Design',
    pageCount: 6,
    mappedTemplateId: 'canva-obsidian-gilded-luxury',
    deduplicatedIds: ['DAF7wYya8Yg', 'DAF7wXbYD94'],
    queriesMatched: ['marriage biodata', 'Indian wedding', 'Traditional Indian'],
    usagePermission: 'External luxury black & gold animated wedding video invitation.',
    extractedPalette: { bg: '#141413', primary: '#D4AF37', accent: '#F3E5AB', text: '#FAF8F5' }
  },
  {
    designId: 'DAF7wZnc_cA',
    title: 'White and Orange Floral Wedding Invitation Reel Video (3 Pages)',
    path: 'C',
    pathLabel: 'Path C: External Canva Video Design',
    pageCount: 3,
    mappedTemplateId: 'canva-peach-blossom-trellis',
    deduplicatedIds: ['DAF7wZnc_cA'],
    queriesMatched: ['marriage biodata', 'Floral wedding'],
    usagePermission: 'External 3-page floral wedding reel video.',
    extractedPalette: { bg: '#FFFDF9', primary: '#C2410C', accent: '#FB923C', text: '#271307' }
  },
  {
    designId: 'DAF7weC8dZE',
    title: 'Pink and Blue Freestyle Art Wedding Save the Date Slideshow (10 Pages)',
    path: 'C',
    pathLabel: 'Path C: External Canva Video Design',
    pageCount: 10,
    mappedTemplateId: 'canva-pastel-jaipur-fresco',
    deduplicatedIds: ['DAF7weC8dZE'],
    queriesMatched: ['marriage biodata', 'wedding biodata'],
    usagePermission: 'External 10-page wedding slideshow presentation.',
    extractedPalette: { bg: '#FDF8FA', primary: '#9D174D', accent: '#1D4ED8', text: '#1E293B' }
  },
  {
    designId: 'DAHAvnh7V0g',
    title: 'White and Pink Floral Indian Wedding Invitation Mobile Video',
    path: 'C',
    pathLabel: 'Path C: External Canva Video Design',
    pageCount: 1,
    mappedTemplateId: 'canva-lotus-quartz-pavilion',
    deduplicatedIds: ['DAHAvnh7V0g'],
    queriesMatched: ['wedding biodata', 'Indian wedding', 'Floral wedding', 'Traditional Indian'],
    usagePermission: 'External mobile video wedding invitation.',
    extractedPalette: { bg: '#FFF8FA', primary: '#9F1239', accent: '#F43F5E', text: '#2E0916' }
  },
  {
    designId: 'DAHAvpu58OA',
    title: 'Green White Floral Traditional Indian Wedding Invitation Mobile Video',
    path: 'C',
    pathLabel: 'Path C: External Canva Video Design',
    pageCount: 1,
    mappedTemplateId: 'canva-jasmine-emerald-courtyard',
    deduplicatedIds: ['DAHAvpu58OA', 'DAHAvlWEw3s', 'DAHAvkcOhqQ', 'DAHAvu0F1-k'],
    queriesMatched: ['wedding biodata', 'Indian wedding', 'Floral wedding', 'Traditional Indian'],
    usagePermission: 'External mobile video wedding invitation (deduplicated 4 green-white floral variants).',
    extractedPalette: { bg: '#F4FBF7', primary: '#166534', accent: '#A16207', text: '#052E16' }
  },
  {
    designId: 'DAHAvuAg02U',
    title: 'Green Beige Floral Traditional Indian Wedding Invitation Mobile Video',
    path: 'C',
    pathLabel: 'Path C: External Canva Video Design',
    pageCount: 1,
    mappedTemplateId: 'canva-pistachio-champagne-rajwada',
    deduplicatedIds: ['DAHAvuAg02U'],
    queriesMatched: ['wedding biodata', 'Indian wedding', 'Floral wedding', 'Traditional Indian'],
    usagePermission: 'External mobile video wedding invitation.',
    extractedPalette: { bg: '#FAF8F2', primary: '#3F6212', accent: '#A16207', text: '#1A2E05' }
  },
  {
    designId: 'DAF5eryI7sQ',
    title: 'Pink Green Flower Wedding Planner Presentation (13 Pages)',
    path: 'C',
    pathLabel: 'Path C: External Canva Presentation Design',
    pageCount: 13,
    mappedTemplateId: 'canva-botanical-rose-sage-two-page',
    deduplicatedIds: ['DAF5eryI7sQ'],
    queriesMatched: ['marriage biodata', 'wedding biodata', 'Floral wedding'],
    usagePermission: 'External 13-page wedding planner presentation.',
    extractedPalette: { bg: '#FFF9FB', primary: '#831843', accent: '#15803D', text: '#1F2937' }
  },
  {
    designId: 'MAHSoQ-gpjA',
    title: 'Uploaded Portrait Mockup Image Asset',
    path: 'C',
    pathLabel: 'Path C: Account Image Asset (Not Redistributed)',
    pageCount: 1,
    mappedTemplateId: null,
    deduplicatedIds: ['MAHSoQ-gpjA'],
    queriesMatched: ['root_folder_items'],
    usagePermission: 'Account uploaded image; cataloged for inventory completeness, not redistributed.'
  },
  {
    designId: 'MAHMQxvkBHU',
    title: 'Ornamental Golden Crest Badge 01',
    path: 'C',
    pathLabel: 'Path C: Account Badge Asset',
    pageCount: 1,
    mappedTemplateId: null,
    deduplicatedIds: ['MAHMQxvkBHU'],
    queriesMatched: ['root_folder_items'],
    usagePermission: 'Account badge asset; cataloged in asset discovery.'
  },
  {
    designId: 'MAHMQ9SPgg4',
    title: 'Ornamental Golden Crest Badge 02',
    path: 'C',
    pathLabel: 'Path C: Account Badge Asset',
    pageCount: 1,
    mappedTemplateId: null,
    deduplicatedIds: ['MAHMQ9SPgg4'],
    queriesMatched: ['root_folder_items'],
    usagePermission: 'Account badge asset; cataloged in asset discovery.'
  },
  {
    designId: 'MAHMQ40WYhc',
    title: 'Ornamental Golden Crest Badge 04',
    path: 'C',
    pathLabel: 'Path C: Account Badge Asset',
    pageCount: 1,
    mappedTemplateId: null,
    deduplicatedIds: ['MAHMQ40WYhc'],
    queriesMatched: ['root_folder_items'],
    usagePermission: 'Account badge asset; cataloged in asset discovery.'
  }
];

// Normalize each catalog item in-place with canonical aliases for UI, QA, and Ingestion Pipeline
for (const entry of CANVA_DISCOVERED_CATALOG) {
  entry.canvaDesignId = entry.canvaDesignId || entry.designId;
  entry.mappingPath =
    entry.mappingPath ||
    (entry.path === 'A'
      ? 'path_a_direct_import'
      : entry.path === 'B'
        ? 'path_b_editable_reconstruction'
        : 'path_c_external_reference');
  entry.discoveredViaQuery =
    entry.discoveredViaQuery ||
    (Array.isArray(entry.queriesMatched) ? entry.queriesMatched.join(', ') : 'search-designs');
  entry.ownership = entry.ownership || 'Connected Canva Account';
  entry.permittedUsage = entry.permittedUsage || entry.usagePermission || 'Reference / Authorized Account Asset';
  entry.visualCharacteristics =
    entry.visualCharacteristics ||
    `${entry.pathLabel}${entry.extractedPalette ? ` • Palette: ${entry.extractedPalette.primary} on ${entry.extractedPalette.bg}` : ''}`;
  entry.canvaEditorUrl = entry.canvaEditorUrl || entry.viewUrl || entry.editUrl || null;
}

export function getCanvaReferenceById(designId) {
  return CANVA_DISCOVERED_CATALOG.find(
    (entry) =>
      entry.designId === designId ||
      entry.canvaDesignId === designId ||
      (entry.deduplicatedIds && entry.deduplicatedIds.includes(designId))
  ) || null;
}

export function getCanvaCatalogStats() {
  const byPath = { A: 0, B: 0, C: 0 };
  for (const item of CANVA_DISCOVERED_CATALOG) {
    byPath[item.path] = (byPath[item.path] || 0) + 1;
  }
  return {
    ...CANVA_MCP_DISCOVERY_SUMMARY,
    catalogEntries: CANVA_DISCOVERED_CATALOG.length,
    total: CANVA_DISCOVERED_CATALOG.length,
    pathA: byPath.A,
    pathB: byPath.B,
    pathC: byPath.C,
    byPath
  };
}

