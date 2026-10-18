/**
 * Query & Sort Saved Biodata Records from Cloudflare D1 (`biodata` SQL tables)
 * ----------------------------------------------------------------------------
 * Usage examples:
 *   npm run db:list
 *   node scripts/query-d1-downloads.mjs --sort=name
 *   node scripts/query-d1-downloads.mjs --sort=age
 *   node scripts/query-d1-downloads.mjs --religion=Hindu
 *   node scripts/query-d1-downloads.mjs --table=candidates
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import {
  R2_BUCKET_NAME,
  D1_DATABASE_NAME,
  D1_DATABASE_ID,
  DOWNLOADS_TABLE,
  CANDIDATES_TABLE
} from '../src/server/cloudflareArchive.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function parseCliArgs(argv) {
  const args = {
    sort: 'date',
    religion: null,
    table: 'downloads',
    limit: 25
  };
  for (const token of argv) {
    if (token.startsWith('--sort=')) args.sort = token.slice('--sort='.length);
    else if (token.startsWith('--religion=')) args.religion = token.slice('--religion='.length);
    else if (token.startsWith('--table=')) args.table = token.slice('--table='.length);
    else if (token.startsWith('--limit=')) args.limit = Number(token.slice('--limit='.length)) || 25;
  }
  return args;
}

function main() {
  const sqlitePath = path.join(ROOT_DIR, '.wrangler/local-d1/biodata.sqlite');
  if (!fs.existsSync(sqlitePath)) {
    console.log('ℹ️ Local D1 database not initialized yet. Run `npm run db:setup` first.');
    process.exit(0);
  }

  const cli = parseCliArgs(process.argv.slice(2));
  const db = new DatabaseSync(sqlitePath);

  const tableName = cli.table === 'candidates' ? CANDIDATES_TABLE : DOWNLOADS_TABLE;
  const timeCol = cli.table === 'candidates' ? 'updated_at' : 'created_at';

  let orderBy = `${timeCol} DESC`;
  if (cli.sort === 'name') orderBy = `candidate_name_lower ASC, ${timeCol} DESC`;
  else if (cli.sort === 'age') orderBy = `age_years ASC, ${timeCol} DESC`;

  let sql = `SELECT * FROM ${tableName}`;
  const params = [];
  if (cli.religion) {
    sql += ` WHERE LOWER(religion) LIKE ?`;
    params.push(`%${cli.religion.toLowerCase()}%`);
  }
  sql += ` ORDER BY ${orderBy} LIMIT ?`;
  params.push(cli.limit);

  const rows = db.prepare(sql).all(...params);
  const totalDownloads = db.prepare(`SELECT COUNT(*) AS cnt FROM ${DOWNLOADS_TABLE}`).get()?.cnt || 0;
  const totalCandidates = db.prepare(`SELECT COUNT(*) AS cnt FROM ${CANDIDATES_TABLE}`).get()?.cnt || 0;

  console.log(`\n📊 Cloudflare D1 Database: ${D1_DATABASE_NAME} (${D1_DATABASE_ID})`);
  console.log(`🪣 Cloudflare R2 Bucket  : ${R2_BUCKET_NAME} (folder: biodata/)`);
  console.log(`   • ${DOWNLOADS_TABLE} : ${totalDownloads} saved download records`);
  console.log(`   • ${CANDIDATES_TABLE}: ${totalCandidates} unique candidates\n`);

  if (rows.length === 0) {
    console.log('   (No records found matching filter)');
    return;
  }

  console.table(
    rows.map((r) => ({
      Candidate: r.candidate_name,
      DOB: r.date_of_birth || '-',
      Age: r.age_years ?? '-',
      Height: r.height || '-',
      Religion: r.religion || '-',
      Caste: r.caste || '-',
      Occupation: (r.occupation || '-').slice(0, 24),
      Phone: r.contact_phone || '-',
      Photo: r.has_photo ? 'Yes' : 'No',
      R2_PDF_Key: r.r2_pdf_key || r.latest_r2_pdf_key,
      R2_Photo_Key: r.r2_photo_key || r.latest_r2_photo_key || '-',
      Saved_At: (r.created_at || r.updated_at || '').replace('T', ' ').slice(0, 19)
    }))
  );
}

main();
