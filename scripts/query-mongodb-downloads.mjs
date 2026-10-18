/**
 * Query, Sort & Export Saved Biodata PDFs from MongoDB Atlas
 * --------------------------------------------------------------------------
 * Usage examples:
 *   npm run db:list
 *   node scripts/query-mongodb-downloads.mjs --sort=name
 *   node scripts/query-mongodb-downloads.mjs --sort=age
 *   node scripts/query-mongodb-downloads.mjs --religion=Hindu
 *   node scripts/query-mongodb-downloads.mjs --export-latest=./latest-biodata.pdf
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoClient } from 'mongodb';
import {
  DEFAULT_DB_NAME,
  DOWNLOADS_COLLECTION,
  CANDIDATES_COLLECTION,
  resolveMongoUri
} from '../src/server/mongoArchive.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function loadLocalEnv() {
  const candidates = [
    path.join(ROOT_DIR, 'atlas-credentials.env'),
    path.join(ROOT_DIR, '.env.local'),
    path.join(ROOT_DIR, '.env')
  ];
  const env = { ...process.env };
  for (const envPath of candidates) {
    if (!fs.existsSync(envPath)) continue;
    const raw = fs.readFileSync(envPath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!env[key]) env[key] = val;
    }
  }
  return env;
}

function parseCliArgs(argv) {
  const args = {
    sort: 'date',
    religion: null,
    limit: 25,
    exportLatest: null
  };
  for (const token of argv) {
    if (token.startsWith('--sort=')) args.sort = token.slice('--sort='.length);
    else if (token.startsWith('--religion=')) args.religion = token.slice('--religion='.length);
    else if (token.startsWith('--limit=')) args.limit = Number(token.slice('--limit='.length)) || 25;
    else if (token.startsWith('--export-latest=')) args.exportLatest = token.slice('--export-latest='.length);
  }
  return args;
}

async function main() {
  const env = loadLocalEnv();
  const uri = resolveMongoUri(env);
  if (!uri) {
    console.error('❌ Missing MONGODB_URI in atlas-credentials.env or environment.');
    process.exit(1);
  }

  const cli = parseCliArgs(process.argv.slice(2));
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const dbName = env.MONGODB_DB_NAME || DEFAULT_DB_NAME;
    const db = client.db(dbName);
    const downloadsCol = db.collection(DOWNLOADS_COLLECTION);
    const candidatesCol = db.collection(CANDIDATES_COLLECTION);

    const sortSpec =
      cli.sort === 'name'
        ? { candidateNameLower: 1, createdAt: -1 }
        : cli.sort === 'age'
          ? { ageYears: 1, createdAt: -1 }
          : { createdAt: -1 };

    const filter = {};
    if (cli.religion) {
      filter.religion = new RegExp(cli.religion, 'i');
    }

    const totalDownloads = await downloadsCol.countDocuments(filter);
    const totalCandidates = await candidatesCol.countDocuments(filter);

    console.log(`\n📊 MongoDB Atlas Database: ${dbName}`);
    console.log(`   • ${DOWNLOADS_COLLECTION}: ${totalDownloads} saved PDF downloads`);
    console.log(`   • ${CANDIDATES_COLLECTION}: ${totalCandidates} unique candidates\n`);

    const rows = await downloadsCol
      .find(filter, {
        projection: {
          'pdfFile.binaryData': 0 // Exclude binary payload in summary table view
        }
      })
      .sort(sortSpec)
      .limit(cli.limit)
      .toArray();

    if (rows.length === 0) {
      console.log('   (No biodata download records found matching filter)');
    } else {
      console.table(
        rows.map((r) => ({
          ID: String(r._id),
          Candidate: r.candidateName,
          DOB: r.dateOfBirth || '-',
          Age: r.ageYears ?? '-',
          Height: r.height || '-',
          Religion: r.religion || '-',
          Caste: r.caste || '-',
          Occupation: (r.occupation || '-').slice(0, 26),
          Phone: r.contactPhone || '-',
          Format: r.downloadFormat,
          PDF_File: r.pdfFileName,
          PDF_KB: Math.round((r.pdfSizeBytes || 0) / 1024),
          Saved_At: r.createdAt ? new Date(r.createdAt).toISOString().replace('T', ' ').slice(0, 19) : '-'
        }))
      );
    }

    if (cli.exportLatest) {
      const latestWithPdf = await downloadsCol.findOne(filter, { sort: { createdAt: -1 } });
      if (latestWithPdf && latestWithPdf.pdfFile?.binaryData) {
        const outPath = path.resolve(process.cwd(), cli.exportLatest);
        const rawBuf = latestWithPdf.pdfFile.binaryData.buffer
          ? Buffer.from(latestWithPdf.pdfFile.binaryData.buffer)
          : Buffer.from(latestWithPdf.pdfFile.binaryData);
        fs.writeFileSync(outPath, rawBuf);
        console.log(`\n✅ Exported latest PDF (${latestWithPdf.pdfFileName}, ${rawBuf.byteLength} bytes) to: ${outPath}`);
      } else {
        console.log('\n⚠️ No PDF binary found to export.');
      }
    }
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error('❌ MongoDB query failed:', err.message);
  process.exit(1);
});
