/**
 * MongoDB Atlas Database & Collection ("Table") Provisioning Script
 * Creates the `biodata_cogify` database, `biodata_downloads` and `biodata_candidates`
 * collections, and builds compound & single-field indexes for fast sorting and filtering.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

function loadEnvFromFile() {
  const envCandidates = [
    path.join(PROJECT_ROOT, 'atlas-credentials.env'),
    path.join(PROJECT_ROOT, '.dev.vars'),
    path.join(PROJECT_ROOT, '.env')
  ];

  for (const filePath of envCandidates) {
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eqIdx = line.indexOf('=');
      if (eqIdx === -1) continue;
      const key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

async function setupMongoDatabase() {
  loadEnvFromFile();

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'biodata_cogify';

  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment or atlas-credentials.env');
  }

  console.log(`[MongoDB Setup] Connecting to MongoDB Atlas cluster...`);
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000
  });

  try {
    await client.connect();
    const db = client.db(dbName);
    await db.command({ ping: 1 });
    console.log(`[MongoDB Setup] Connected successfully to database: "${dbName}"`);

    const existingCollections = (await db.listCollections().toArray()).map((c) => c.name);

    // 1. Create `biodata_downloads` collection (Stores every download event + exact PDF binary + sortable columns)
    if (!existingCollections.includes('biodata_downloads')) {
      await db.createCollection('biodata_downloads');
      console.log(`[MongoDB Setup] Created collection: "biodata_downloads"`);
    } else {
      console.log(`[MongoDB Setup] Collection "biodata_downloads" already exists.`);
    }

    const downloadsCol = db.collection('biodata_downloads');
    await downloadsCol.createIndexes([
      { key: { createdAt: -1 }, name: 'idx_createdAt_desc' },
      { key: { candidateName: 1, createdAt: -1 }, name: 'idx_candidateName_createdAt' },
      { key: { religion: 1, caste: 1, createdAt: -1 }, name: 'idx_religion_caste' },
      { key: { ageYears: 1, createdAt: -1 }, name: 'idx_ageYears' },
      { key: { contactPhone: 1 }, name: 'idx_contactPhone' },
      { key: { contactEmail: 1 }, name: 'idx_contactEmail' },
      { key: { workLocation: 1 }, name: 'idx_workLocation' },
      { key: { nativePlace: 1 }, name: 'idx_nativePlace' },
      { key: { templateId: 1, language: 1 }, name: 'idx_template_language' },
      { key: { downloadFormat: 1, createdAt: -1 }, name: 'idx_downloadFormat' }
    ]);
    console.log(`[MongoDB Setup] Verified 10 sorting/filtering indexes on "biodata_downloads".`);

    // 2. Create `biodata_candidates` collection (Deduplicated master table of unique candidates + latest PDF)
    if (!existingCollections.includes('biodata_candidates')) {
      await db.createCollection('biodata_candidates');
      console.log(`[MongoDB Setup] Created collection: "biodata_candidates"`);
    } else {
      console.log(`[MongoDB Setup] Collection "biodata_candidates" already exists.`);
    }

    const candidatesCol = db.collection('biodata_candidates');
    await candidatesCol.createIndexes([
      { key: { candidateFingerprint: 1 }, name: 'idx_unique_fingerprint', unique: true },
      { key: { updatedAt: -1 }, name: 'idx_updatedAt_desc' },
      { key: { candidateName: 1 }, name: 'idx_candidateName' },
      { key: { religion: 1, caste: 1, ageYears: 1 }, name: 'idx_religion_caste_age' },
      { key: { contactPhone: 1 }, name: 'idx_candidate_phone' },
      { key: { workLocation: 1 }, name: 'idx_candidate_location' }
    ]);
    console.log(`[MongoDB Setup] Verified 6 sorting/filtering indexes on "biodata_candidates".`);

    const downloadCount = await downloadsCol.countDocuments();
    const candidateCount = await candidatesCol.countDocuments();
    console.log(
      `[MongoDB Setup] Complete! Current documents -> biodata_downloads: ${downloadCount}, biodata_candidates: ${candidateCount}`
    );
  } finally {
    await client.close();
  }
}

setupMongoDatabase().catch((err) => {
  console.error('[MongoDB Setup] Error:', err.message);
  process.exit(1);
});
