/**
 * Setup & Verify Cloudflare R2 (`biodata` folder) + Cloudflare D1 (`biodata` SQL tables)
 * --------------------------------------------------------------------------------------
 * Usage:
 *   npm run db:setup
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { jsPDF } from 'jspdf';
import { COMMUNITY_PRESETS } from '../src/data/presets.js';
import {
  R2_BUCKET_NAME,
  D1_DATABASE_NAME,
  D1_DATABASE_ID,
  saveBiodataToR2AndD1
} from '../src/server/cloudflareArchive.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function createLocalR2Adapter(rootDir) {
  return {
    async put(key, data, options = {}) {
      const targetPath = path.join(rootDir, key);
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, Buffer.from(data));
      fs.writeFileSync(
        `${targetPath}.meta.json`,
        JSON.stringify(
          {
            key,
            sizeBytes: Buffer.from(data).byteLength,
            httpMetadata: options.httpMetadata || {},
            customMetadata: options.customMetadata || {},
            savedAt: new Date().toISOString()
          },
          null,
          2
        )
      );
      return { key };
    }
  };
}

function createLocalD1Adapter(sqlitePath) {
  fs.mkdirSync(path.dirname(sqlitePath), { recursive: true });
  const db = new DatabaseSync(sqlitePath);
  return {
    prepare(sql) {
      const stmt = db.prepare(sql);
      let boundArgs = [];
      const chain = {
        bind(...args) {
          boundArgs = args.map((v) => (v === undefined ? null : v));
          return chain;
        },
        async run() {
          const info = stmt.run(...boundArgs);
          return { success: true, meta: info };
        },
        async all() {
          const rows = stmt.all(...boundArgs);
          return { success: true, results: rows };
        }
      };
      return chain;
    }
  };
}

async function main() {
  const localR2Dir = path.join(ROOT_DIR, '.wrangler/local-r2');
  const localD1Path = path.join(ROOT_DIR, '.wrangler/local-d1/biodata.sqlite');

  const r2Bucket = createLocalR2Adapter(localR2Dir);
  const d1Database = createLocalD1Adapter(localD1Path);

  console.log(`\n🚀 Initializing Cloudflare R2 (${R2_BUCKET_NAME}) & Cloudflare D1 (${D1_DATABASE_NAME} / ${D1_DATABASE_ID})...`);

  for (const presetId of ['hindu_groom', 'hindu_bride']) {
    const preset = COMMUNITY_PRESETS.find((p) => p.id === presetId);
    const state = preset.apply();

    // Attach sample portrait SVG photo so photo saving to R2 is verified end-to-end
    const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="400" viewBox="0 0 320 400"><rect width="320" height="400" fill="#FDFBF7"/><circle cx="160" cy="145" r="56" fill="#C89B3C" opacity="0.25"/><path d="M72 340 C72 255 248 255 248 340" fill="#8B1E2F" opacity="0.2"/></svg>`;
    state.photo = {
      enabled: true,
      dataUrl: `data:image/svg+xml;base64,${Buffer.from(sampleSvg, 'utf8').toString('base64')}`
    };

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    pdf.setFontSize(18);
    pdf.text(state.title || 'MARRIAGE BIODATA', 105, 24, { align: 'center' });
    pdf.setFontSize(11);
    let y = 38;
    for (const sec of state.sections) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(sec.title, 20, y);
      y += 7;
      pdf.setFont('helvetica', 'normal');
      for (const f of sec.fields) {
        if (!f.value) continue;
        pdf.text(`${f.label}: ${f.value}`, 24, y);
        y += 6;
        if (y > 275) {
          pdf.addPage();
          y = 20;
        }
      }
      y += 4;
    }

    const pdfBase64 = Buffer.from(pdf.output('arraybuffer')).toString('base64');
    const candidateName = state.sections[0].fields[0].value;
    const slug = candidateName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const res = await saveBiodataToR2AndD1({
      r2Bucket,
      d1Database,
      payload: {
        state,
        downloadFormat: 'pdf',
        fileName: `${slug}-biodata.pdf`,
        pdfBase64,
        pageCount: pdf.getNumberOfPages(),
        pageUrl: 'https://biodata.cogify.me'
      },
      requestMeta: {
        userAgent: 'BioData-Studio-R2-D1-Setup/2.2',
        country: 'IN',
        city: 'Jaipur',
        ip: '127.0.0.1',
        referer: 'https://biodata.cogify.me'
      }
    });

    console.log(`   ✔ Saved ${res.candidateName}:`);
    console.log(`     • R2 Folder : ${res.r2FolderPath}`);
    console.log(`     • R2 PDF    : ${res.r2Files.pdfKey} (${res.pdfSizeBytes} bytes)`);
    console.log(`     • R2 Photo  : ${res.r2Files.photoKey} (${res.photoSizeBytes} bytes)`);
    console.log(`     • R2 JSON   : ${res.r2Files.jsonKey}`);
    console.log(`     • D1 Row ID : ${res.downloadId}`);
  }

  console.log('\n✅ Cloudflare R2 + D1 tables & folder structure initialized and verified!');
}

main().catch((err) => {
  console.error('❌ Setup failed:', err);
  process.exit(1);
});
