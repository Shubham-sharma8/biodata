/**
 * Cloudflare R2 Bucket + Cloudflare D1 Database Archival Service (biodata.cogify.me)
 * ----------------------------------------------------------------------------------
 * Every time a user downloads their Marriage Biodata (PDF, PNG, JPG, Word .docx, or JSON):
 *   1. Saves into the Cloudflare R2 bucket (`biodata`) inside `biodata/<candidate_folder>/`:
 *      - The exact generated PDF file (`<slug>-biodata.pdf`)
 *      - The candidate's uploaded photo (`<slug>-photo.<jpg|png|webp|svg>`) if present
 *      - The complete candidate data JSON (`<slug>-data.json`, including sections & photo)
 *      Plus updates `biodata/latest/<slug>/` with the candidate's latest files.
 *   2. Saves all structured, sortable candidate details + R2 file keys into the
 *      Cloudflare D1 SQL database (`biodata`, ID `bb855f1e-d450-464d-b4da-f273c821288e`)
 *      across two indexed tables: `biodata_downloads` and `biodata_candidates`.
 */

import { Buffer } from 'node:buffer';

export const R2_BUCKET_NAME = 'biodata';
export const R2_FOLDER_PREFIX = 'biodata';
export const R2_DEFAULT_ENDPOINT =
  'https://34f55fffa618d8ec831f8926c79a3575.r2.cloudflarestorage.com/biodata';
export const D1_DATABASE_NAME = 'biodata';
export const D1_DATABASE_ID = 'bb855f1e-d450-464d-b4da-f273c821288e';
export const DOWNLOADS_TABLE = 'biodata_downloads';
export const CANDIDATES_TABLE = 'biodata_candidates';

let d1SchemaInitialized = false;

/**
 * Normalizes a string value for clean storage and SQL indexing.
 */
function cleanStr(val) {
  if (val === null || val === undefined) return '';
  return String(val).trim();
}

/**
 * Converts a candidate name into a clean URL/file-safe slug.
 */
export function slugifyCandidateName(name) {
  const cleaned = cleanStr(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || 'marriage-candidate';
}

/**
 * Parses numeric age in years from strings like "28 Years", "30", or from DOB year.
 */
function parseNumericAge(ageStr, dobStr) {
  const cleaned = cleanStr(ageStr);
  const match = cleaned.match(/(\d{1,2})/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num >= 18 && num <= 99) return num;
  }
  if (dobStr) {
    const yearMatch = cleanStr(dobStr).match(/\b(19\d{2}|20\d{2})\b/);
    if (yearMatch) {
      const birthYear = parseInt(yearMatch[1], 10);
      const currentYear = new Date().getFullYear();
      const diff = currentYear - birthYear;
      if (diff >= 18 && diff <= 99) return diff;
    }
  }
  return null;
}

/**
 * Extracts a flat, structured, sortable candidate record from a biodata state object.
 * Designed so the user can sort and filter by Name, Age, Religion, Caste, Education,
 * Profession, Income, City, Native Place, Phone, Email, Template, and Date in Cloudflare D1.
 */
export function extractSortableCandidateRecord(state = {}) {
  const sections = Array.isArray(state?.sections) ? state.sections : [];
  const flatByKey = {};
  const flatByLabel = {};

  for (const sec of sections) {
    if (!sec || !Array.isArray(sec.fields)) continue;
    for (const f of sec.fields) {
      if (!f) continue;
      const val = cleanStr(f.value);
      if (!val) continue;
      if (f.key) flatByKey[String(f.key).toLowerCase()] = val;
      if (f.label) flatByLabel[String(f.label).toLowerCase()] = val;
    }
  }

  const pick = (keys = [], labelHints = []) => {
    for (const k of keys) {
      if (flatByKey[k]) return flatByKey[k];
    }
    for (const hint of labelHints) {
      for (const [lbl, val] of Object.entries(flatByLabel)) {
        if (lbl.includes(hint)) return val;
      }
    }
    return '';
  };

  const candidateName =
    pick(['full_name', 'name', 'candidate_name'], ['full name', 'name']) || 'Unnamed Candidate';
  const dateOfBirth = pick(['dob', 'date_of_birth', 'birth_date'], ['date of birth', 'dob', 'birth date']);
  const ageText = pick(['age'], ['age']);
  const ageYears = parseNumericAge(ageText, dateOfBirth);

  const height = pick(['height'], ['height']);
  const weight = pick(['weight'], ['weight']);
  const complexion = pick(['complexion'], ['complexion']);
  const bloodGroup = pick(['blood_group'], ['blood group']);
  const maritalStatus = pick(['marital_status'], ['marital status']);
  const motherTongue = pick(['mother_tongue'], ['mother tongue']);
  const diet = pick(['diet', 'lifestyle'], ['diet']);
  const religion = pick(['religion'], ['religion']);
  const caste = pick(['caste', 'sub_caste', 'sect', 'denomination'], ['caste', 'sect', 'denomination', 'sampradaya']);
  const hobbies = pick(['hobbies'], ['hobbies', 'interests']);

  // Horoscope / Astro
  const rashi = pick(['rashi', 'raasi', 'moon_sign'], ['rashi', 'raasi', 'moon sign']);
  const nakshatra = pick(['nakshatra', 'natchathiram', 'star'], ['nakshatra', 'star']);
  const gotra = pick(['gotra', 'gothram', 'devak'], ['gotra', 'gothram', 'devak']);
  const manglik = pick(['manglik', 'dosham', 'kuja_dosham'], ['manglik', 'dosham']);
  const timeOfBirth = pick(['tob', 'time_of_birth'], ['time of birth']);
  const placeOfBirth = pick(['pob', 'place_of_birth'], ['place of birth']);
  const kuldaivat = pick(['kuldaivat', 'kuladeivam'], ['kuldaivat', 'kuladeivam']);
  const nadi = pick(['nadi'], ['nadi']);
  const gan = pick(['gan', 'gana'], ['gan']);

  // Education & Career
  const education = pick(['qualification', 'education', 'degree'], ['qualification', 'education', 'degree']);
  const college = pick(['college', 'university', 'institution'], ['college', 'university', 'institution']);
  const occupation = pick(['occupation', 'profession', 'job_title', 'designation'], ['occupation', 'profession', 'job']);
  const company = pick(['company', 'organization', 'employer'], ['company', 'organization', 'employer']);
  const workLocation = pick(['work_location', 'location', 'city_country', 'current_city'], ['work location', 'city', 'country']);
  const income = pick(['income', 'annual_income', 'salary', 'package'], ['income', 'salary', 'ctc']);

  // Family Details
  const fatherName = pick(['father_name'], ["father's name", 'father name']);
  const fatherOccupation = pick(['father_occupation'], ["father's occupation", 'father occupation']);
  const motherName = pick(['mother_name'], ["mother's name", 'mother name']);
  const motherOccupation = pick(['mother_occupation'], ["mother's occupation", 'mother occupation']);
  const siblings = pick(['siblings', 'brothers', 'sisters'], ['siblings', 'brother', 'sister']);
  const familyType = pick(['family_type', 'family_values'], ['family type', 'family values']);
  const nativePlace = pick(['native_place', 'hometown', 'ancestral_origin', 'vatan'], ['native place', 'hometown', 'ancestral', 'vatan', 'pind']);
  const maternalUncle = pick(['maternal_uncle', 'mamakul', 'mosal'], ['maternal', 'mama', 'mosal']);

  // Partner Expectations
  const partnerExpectations = pick(
    ['partner_summary', 'preferred_age_height', 'preferred_education_career', 'expectations'],
    ['expectation', 'partner', 'looking for', 'preferred']
  );

  // Contact Details
  const contactPerson = pick(['contact_person', 'wali_name'], ['contact person', 'wali']);
  const contactPhone = pick(['phone', 'contact_number', 'mobile', 'whatsapp'], ['contact number', 'phone', 'mobile']);
  const contactEmail = pick(['email', 'contact_email'], ['email']);
  const residentialAddress = pick(['address', 'residential_address'], ['address']);

  // Build deterministic candidate fingerprint for deduplicating repeat downloads by the same person
  const fpSource = [
    candidateName.toLowerCase(),
    dateOfBirth.toLowerCase(),
    contactPhone.replace(/\D+/g, '') || contactEmail.toLowerCase() || fatherName.toLowerCase()
  ].join('|');

  return {
    candidateFingerprint: fpSource,
    candidateName,
    candidateNameLower: candidateName.toLowerCase(),
    dateOfBirth,
    ageText,
    ageYears,
    height,
    weight,
    complexion,
    bloodGroup,
    maritalStatus,
    motherTongue,
    diet,
    religion,
    caste,
    hobbies,
    rashi,
    nakshatra,
    gotra,
    manglik,
    timeOfBirth,
    placeOfBirth,
    kuldaivat,
    nadi,
    gan,
    education,
    college,
    occupation,
    company,
    workLocation,
    income,
    fatherName,
    fatherOccupation,
    motherName,
    motherOccupation,
    siblings,
    familyType,
    nativePlace,
    maternalUncle,
    partnerExpectations,
    contactPerson,
    contactPhone,
    contactEmail,
    residentialAddress,
    templateId: cleanStr(state?.templateId) || 'royal-sindoor-gold',
    language: cleanStr(state?.language) || 'en',
    docTitle: cleanStr(state?.header?.docTitle || state?.title),
    invocationText: cleanStr(state?.header?.invocation || state?.invocation),
    hasPhoto: Boolean(state?.photo?.enabled !== false && state?.photo?.dataUrl),
    sections,
    allFieldsMap: flatByKey
  };
}

/**
 * Decodes a base64 PDF string or `data:application/pdf;base64,...` URI into a Buffer.
 */
export function decodePdfBase64ToBuffer(pdfBase64OrDataUrl) {
  if (!pdfBase64OrDataUrl || typeof pdfBase64OrDataUrl !== 'string') {
    return null;
  }
  const commaIdx = pdfBase64OrDataUrl.indexOf(',');
  const rawBase64 = commaIdx !== -1 ? pdfBase64OrDataUrl.slice(commaIdx + 1) : pdfBase64OrDataUrl;
  const trimmed = rawBase64.trim();
  if (!trimmed) return null;
  return Buffer.from(trimmed, 'base64');
}

/**
 * Decodes a candidate photo data URL (`data:image/jpeg;base64,...`, `data:image/png;base64,...`,
 * or `data:image/svg+xml;utf8,...`) into binary bytes + MIME type + file extension for R2 storage.
 */
export function decodePhotoDataUrl(photoDataUrl) {
  if (!photoDataUrl || typeof photoDataUrl !== 'string') {
    return null;
  }
  const trimmed = photoDataUrl.trim();
  if (!trimmed.startsWith('data:image/')) {
    return null;
  }

  const commaIdx = trimmed.indexOf(',');
  if (commaIdx === -1) return null;

  const header = trimmed.slice(5, commaIdx); // e.g. "image/jpeg;base64"
  const body = trimmed.slice(commaIdx + 1);
  const mimeMatch = header.match(/^(image\/[a-zA-Z0-9.+-]+)/);
  const mimeType = mimeMatch ? mimeMatch[1].toLowerCase() : 'image/jpeg';

  let ext = 'jpg';
  if (mimeType.includes('png')) ext = 'png';
  else if (mimeType.includes('webp')) ext = 'webp';
  else if (mimeType.includes('svg')) ext = 'svg';
  else if (mimeType.includes('gif')) ext = 'gif';

  let buffer;
  if (header.includes(';base64')) {
    buffer = Buffer.from(body, 'base64');
  } else {
    buffer = Buffer.from(decodeURIComponent(body), 'utf8');
  }

  if (!buffer || buffer.byteLength === 0) return null;

  return {
    buffer,
    mimeType,
    ext,
    sizeBytes: buffer.byteLength
  };
}

/**
 * Generates deterministic R2 object paths inside the `biodata/` folder for a download event.
 */
export function buildBiodataR2Paths({ candidateName, isoTimestamp, downloadId, photoExt }) {
  const slug = slugifyCandidateName(candidateName);
  const compactTime = cleanStr(isoTimestamp)
    .replace(/[-:]/g, '')
    .replace(/\.\d+Z$/, 'Z')
    .replace('T', '-');
  const shortSuffix = cleanStr(downloadId).slice(-6) || '000001';

  const folderPath = `${R2_FOLDER_PREFIX}/${slug}_${compactTime}_${shortSuffix}`;
  const latestFolderPath = `${R2_FOLDER_PREFIX}/latest/${slug}`;

  return {
    slug,
    r2FolderPath: folderPath,
    r2PdfKey: `${folderPath}/${slug}-biodata.pdf`,
    r2PhotoKey: photoExt ? `${folderPath}/${slug}-photo.${photoExt}` : '',
    r2JsonKey: `${folderPath}/${slug}-data.json`,
    latestR2FolderPath: latestFolderPath,
    latestR2PdfKey: `${latestFolderPath}/${slug}-biodata.pdf`,
    latestR2PhotoKey: photoExt ? `${latestFolderPath}/${slug}-photo.${photoExt}` : '',
    latestR2JsonKey: `${latestFolderPath}/${slug}-data.json`
  };
}

/**
 * Ensures the `biodata_downloads` and `biodata_candidates` tables and sorting indexes exist in D1.
 */
export async function ensureD1Tables(d1Database) {
  if (!d1Database || d1SchemaInitialized) return;

  const statements = [
    `CREATE TABLE IF NOT EXISTS biodata_downloads (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      candidate_fingerprint TEXT NOT NULL,
      candidate_name TEXT NOT NULL,
      candidate_name_lower TEXT NOT NULL,
      date_of_birth TEXT DEFAULT '',
      age_years INTEGER,
      age_text TEXT DEFAULT '',
      height TEXT DEFAULT '',
      weight TEXT DEFAULT '',
      complexion TEXT DEFAULT '',
      blood_group TEXT DEFAULT '',
      marital_status TEXT DEFAULT '',
      mother_tongue TEXT DEFAULT '',
      diet TEXT DEFAULT '',
      religion TEXT DEFAULT '',
      caste TEXT DEFAULT '',
      gotra TEXT DEFAULT '',
      rashi TEXT DEFAULT '',
      nakshatra TEXT DEFAULT '',
      manglik TEXT DEFAULT '',
      time_of_birth TEXT DEFAULT '',
      place_of_birth TEXT DEFAULT '',
      kuldaivat TEXT DEFAULT '',
      education TEXT DEFAULT '',
      college TEXT DEFAULT '',
      occupation TEXT DEFAULT '',
      company TEXT DEFAULT '',
      work_location TEXT DEFAULT '',
      income TEXT DEFAULT '',
      father_name TEXT DEFAULT '',
      father_occupation TEXT DEFAULT '',
      mother_name TEXT DEFAULT '',
      mother_occupation TEXT DEFAULT '',
      siblings TEXT DEFAULT '',
      family_type TEXT DEFAULT '',
      native_place TEXT DEFAULT '',
      maternal_uncle TEXT DEFAULT '',
      partner_expectations TEXT DEFAULT '',
      contact_person TEXT DEFAULT '',
      contact_phone TEXT DEFAULT '',
      contact_email TEXT DEFAULT '',
      residential_address TEXT DEFAULT '',
      template_id TEXT DEFAULT 'royal-sindoor-gold',
      language TEXT DEFAULT 'en',
      download_format TEXT DEFAULT 'pdf',
      has_photo INTEGER DEFAULT 0,
      r2_folder_path TEXT NOT NULL,
      r2_pdf_key TEXT NOT NULL,
      r2_photo_key TEXT DEFAULT '',
      r2_json_key TEXT NOT NULL,
      pdf_file_name TEXT NOT NULL,
      pdf_size_bytes INTEGER DEFAULT 0,
      pdf_page_count INTEGER DEFAULT 1,
      photo_mime_type TEXT DEFAULT '',
      photo_size_bytes INTEGER DEFAULT 0,
      sections_json TEXT DEFAULT '[]',
      client_country TEXT DEFAULT '',
      client_city TEXT DEFAULT '',
      client_ip TEXT DEFAULT '',
      user_agent TEXT DEFAULT ''
    )`,
    `CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON biodata_downloads(created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_downloads_name ON biodata_downloads(candidate_name_lower ASC, created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_downloads_religion_caste ON biodata_downloads(religion ASC, caste ASC, created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_downloads_age ON biodata_downloads(age_years ASC, created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_downloads_phone ON biodata_downloads(contact_phone ASC)`,
    `CREATE INDEX IF NOT EXISTS idx_downloads_location ON biodata_downloads(work_location ASC, native_place ASC)`,
    `CREATE TABLE IF NOT EXISTS biodata_candidates (
      candidate_fingerprint TEXT PRIMARY KEY,
      first_created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      total_downloads INTEGER DEFAULT 1,
      latest_download_id TEXT NOT NULL,
      candidate_name TEXT NOT NULL,
      candidate_name_lower TEXT NOT NULL,
      date_of_birth TEXT DEFAULT '',
      age_years INTEGER,
      age_text TEXT DEFAULT '',
      height TEXT DEFAULT '',
      weight TEXT DEFAULT '',
      complexion TEXT DEFAULT '',
      blood_group TEXT DEFAULT '',
      marital_status TEXT DEFAULT '',
      mother_tongue TEXT DEFAULT '',
      diet TEXT DEFAULT '',
      religion TEXT DEFAULT '',
      caste TEXT DEFAULT '',
      gotra TEXT DEFAULT '',
      rashi TEXT DEFAULT '',
      nakshatra TEXT DEFAULT '',
      manglik TEXT DEFAULT '',
      time_of_birth TEXT DEFAULT '',
      place_of_birth TEXT DEFAULT '',
      kuldaivat TEXT DEFAULT '',
      education TEXT DEFAULT '',
      college TEXT DEFAULT '',
      occupation TEXT DEFAULT '',
      company TEXT DEFAULT '',
      work_location TEXT DEFAULT '',
      income TEXT DEFAULT '',
      father_name TEXT DEFAULT '',
      father_occupation TEXT DEFAULT '',
      mother_name TEXT DEFAULT '',
      mother_occupation TEXT DEFAULT '',
      siblings TEXT DEFAULT '',
      family_type TEXT DEFAULT '',
      native_place TEXT DEFAULT '',
      maternal_uncle TEXT DEFAULT '',
      partner_expectations TEXT DEFAULT '',
      contact_person TEXT DEFAULT '',
      contact_phone TEXT DEFAULT '',
      contact_email TEXT DEFAULT '',
      residential_address TEXT DEFAULT '',
      template_id TEXT DEFAULT 'royal-sindoor-gold',
      language TEXT DEFAULT 'en',
      last_download_format TEXT DEFAULT 'pdf',
      has_photo INTEGER DEFAULT 0,
      latest_r2_folder_path TEXT NOT NULL,
      latest_r2_pdf_key TEXT NOT NULL,
      latest_r2_photo_key TEXT DEFAULT '',
      latest_r2_json_key TEXT NOT NULL,
      pdf_file_name TEXT NOT NULL,
      pdf_size_bytes INTEGER DEFAULT 0,
      pdf_page_count INTEGER DEFAULT 1,
      sections_json TEXT DEFAULT '[]'
    )`,
    `CREATE INDEX IF NOT EXISTS idx_candidates_updated_at ON biodata_candidates(updated_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_candidates_name ON biodata_candidates(candidate_name_lower ASC)`,
    `CREATE INDEX IF NOT EXISTS idx_candidates_religion_caste_age ON biodata_candidates(religion ASC, caste ASC, age_years ASC)`,
    `CREATE INDEX IF NOT EXISTS idx_candidates_phone ON biodata_candidates(contact_phone ASC)`
  ];

  for (const sql of statements) {
    await d1Database.prepare(sql).run();
  }
  d1SchemaInitialized = true;
}

/**
 * Saves the PDF, candidate photo, and full biodata JSON directly into the R2 bucket `biodata/` folder,
 * and saves the sortable candidate row into Cloudflare D1 (`biodata_downloads` + `biodata_candidates`).
 */
export async function saveBiodataToR2AndD1({
  r2Bucket,
  d1Database,
  payload = {},
  requestMeta = {}
}) {
  const now = new Date();
  const isoTimestamp = now.toISOString();
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  const downloadId = `dl_${now.getTime()}_${randomSuffix}`;

  const state = payload.state || {};
  const sortableRecord = extractSortableCandidateRecord(state);
  const pdfBuffer = decodePdfBase64ToBuffer(payload.pdfBase64);
  if (!pdfBuffer || pdfBuffer.byteLength === 0) {
    throw new Error('Missing or empty PDF binary payload for R2 storage.');
  }

  // Extract candidate photo if present and enabled
  const photoEnabled = state?.photo?.enabled !== false;
  const decodedPhoto = photoEnabled ? decodePhotoDataUrl(state?.photo?.dataUrl) : null;

  const paths = buildBiodataR2Paths({
    candidateName: sortableRecord.candidateName,
    isoTimestamp,
    downloadId,
    photoExt: decodedPhoto ? decodedPhoto.ext : ''
  });

  const fileName =
    cleanStr(payload.fileName) || `${paths.slug}-biodata.pdf`;
  const pageCount = Number(payload.pageCount) || 1;
  const downloadFormat = cleanStr(payload.downloadFormat) || 'pdf';

  // Build complete JSON bundle saved alongside the PDF and photo inside the R2 `biodata/` folder
  const completeBiodataJson = JSON.stringify(
    {
      id: downloadId,
      createdAt: isoTimestamp,
      downloadFormat,
      r2Bucket: R2_BUCKET_NAME,
      r2FolderPath: paths.r2FolderPath,
      files: {
        pdfKey: paths.r2PdfKey,
        photoKey: paths.r2PhotoKey,
        jsonKey: paths.r2JsonKey
      },
      candidate: {
        ...sortableRecord,
        sections: undefined,
        allFieldsMap: undefined
      },
      sections: sortableRecord.sections,
      header: state.header || {},
      formatting: state.formatting || {},
      photo: {
        enabled: Boolean(photoEnabled && decodedPhoto),
        mimeType: decodedPhoto ? decodedPhoto.mimeType : '',
        sizeBytes: decodedPhoto ? decodedPhoto.sizeBytes : 0,
        r2PhotoKey: paths.r2PhotoKey,
        dataUrl: photoEnabled ? cleanStr(state?.photo?.dataUrl) : ''
      },
      clientMeta: {
        country: cleanStr(requestMeta.country),
        city: cleanStr(requestMeta.city),
        ip: cleanStr(requestMeta.ip),
        userAgent: cleanStr(requestMeta.userAgent),
        referer: cleanStr(requestMeta.referer),
        pageUrl: cleanStr(payload.pageUrl)
      }
    },
    null,
    2
  );
  const jsonBytes = Buffer.from(completeBiodataJson, 'utf8');

  const customMetadata = {
    downloadId,
    candidateName: sortableRecord.candidateName.slice(0, 120),
    dateOfBirth: sortableRecord.dateOfBirth.slice(0, 60),
    religion: sortableRecord.religion.slice(0, 60),
    caste: sortableRecord.caste.slice(0, 60),
    phone: sortableRecord.contactPhone.slice(0, 60),
    templateId: sortableRecord.templateId.slice(0, 80),
    createdAt: isoTimestamp
  };

  // 1. Save PDF, Photo, and JSON into Cloudflare R2 Bucket (`biodata` folder)
  let r2Saved = false;
  if (r2Bucket && typeof r2Bucket.put === 'function') {
    const r2Uploads = [
      // Timestamped download folder inside `biodata/`
      r2Bucket.put(paths.r2PdfKey, pdfBuffer, {
        httpMetadata: {
          contentType: 'application/pdf',
          contentDisposition: `inline; filename="${fileName}"`
        },
        customMetadata
      }),
      r2Bucket.put(paths.r2JsonKey, jsonBytes, {
        httpMetadata: {
          contentType: 'application/json; charset=utf-8'
        },
        customMetadata
      }),
      // Latest folder for this candidate inside `biodata/latest/<slug>/`
      r2Bucket.put(paths.latestR2PdfKey, pdfBuffer, {
        httpMetadata: {
          contentType: 'application/pdf',
          contentDisposition: `inline; filename="${fileName}"`
        },
        customMetadata
      }),
      r2Bucket.put(paths.latestR2JsonKey, jsonBytes, {
        httpMetadata: {
          contentType: 'application/json; charset=utf-8'
        },
        customMetadata
      })
    ];

    if (decodedPhoto && paths.r2PhotoKey) {
      r2Uploads.push(
        r2Bucket.put(paths.r2PhotoKey, decodedPhoto.buffer, {
          httpMetadata: {
            contentType: decodedPhoto.mimeType
          },
          customMetadata
        }),
        r2Bucket.put(paths.latestR2PhotoKey, decodedPhoto.buffer, {
          httpMetadata: {
            contentType: decodedPhoto.mimeType
          },
          customMetadata
        })
      );
    }

    await Promise.all(r2Uploads);
    r2Saved = true;
  }

  // 2. Save structured, sortable row into Cloudflare D1 Database (`biodata_downloads` + `biodata_candidates`)
  let d1Saved = false;
  if (d1Database && typeof d1Database.prepare === 'function') {
    await ensureD1Tables(d1Database);

    const sectionsJson = JSON.stringify(sortableRecord.sections || []);
    const hasPhotoInt = decodedPhoto ? 1 : 0;

    await d1Database
      .prepare(
        `INSERT INTO biodata_downloads (
          id, created_at, candidate_fingerprint, candidate_name, candidate_name_lower,
          date_of_birth, age_years, age_text, height, weight,
          complexion, blood_group, marital_status, mother_tongue, diet,
          religion, caste, gotra, rashi, nakshatra,
          manglik, time_of_birth, place_of_birth, kuldaivat, education,
          college, occupation, company, work_location, income,
          father_name, father_occupation, mother_name, mother_occupation, siblings,
          family_type, native_place, maternal_uncle, partner_expectations, contact_person,
          contact_phone, contact_email, residential_address, template_id, language,
          download_format, has_photo, r2_folder_path, r2_pdf_key, r2_photo_key,
          r2_json_key, pdf_file_name, pdf_size_bytes, pdf_page_count, photo_mime_type,
          photo_size_bytes, sections_json, client_country, client_city, client_ip, user_agent
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?
        )`
      )
      .bind(
        downloadId,
        isoTimestamp,
        sortableRecord.candidateFingerprint,
        sortableRecord.candidateName,
        sortableRecord.candidateNameLower,
        sortableRecord.dateOfBirth,
        sortableRecord.ageYears,
        sortableRecord.ageText,
        sortableRecord.height,
        sortableRecord.weight,
        sortableRecord.complexion,
        sortableRecord.bloodGroup,
        sortableRecord.maritalStatus,
        sortableRecord.motherTongue,
        sortableRecord.diet,
        sortableRecord.religion,
        sortableRecord.caste,
        sortableRecord.gotra,
        sortableRecord.rashi,
        sortableRecord.nakshatra,
        sortableRecord.manglik,
        sortableRecord.timeOfBirth,
        sortableRecord.placeOfBirth,
        sortableRecord.kuldaivat,
        sortableRecord.education,
        sortableRecord.college,
        sortableRecord.occupation,
        sortableRecord.company,
        sortableRecord.workLocation,
        sortableRecord.income,
        sortableRecord.fatherName,
        sortableRecord.fatherOccupation,
        sortableRecord.motherName,
        sortableRecord.motherOccupation,
        sortableRecord.siblings,
        sortableRecord.familyType,
        sortableRecord.nativePlace,
        sortableRecord.maternalUncle,
        sortableRecord.partnerExpectations,
        sortableRecord.contactPerson,
        sortableRecord.contactPhone,
        sortableRecord.contactEmail,
        sortableRecord.residentialAddress,
        sortableRecord.templateId,
        sortableRecord.language,
        downloadFormat,
        hasPhotoInt,
        paths.r2FolderPath,
        paths.r2PdfKey,
        paths.r2PhotoKey,
        paths.r2JsonKey,
        fileName,
        pdfBuffer.byteLength,
        pageCount,
        decodedPhoto ? decodedPhoto.mimeType : '',
        decodedPhoto ? decodedPhoto.sizeBytes : 0,
        sectionsJson,
        cleanStr(requestMeta.country),
        cleanStr(requestMeta.city),
        cleanStr(requestMeta.ip),
        cleanStr(requestMeta.userAgent)
      )
      .run();

    // Upsert deduplicated candidate row in `biodata_candidates`
    await d1Database
      .prepare(
        `INSERT INTO biodata_candidates (
          candidate_fingerprint, first_created_at, updated_at, total_downloads, latest_download_id,
          candidate_name, candidate_name_lower, date_of_birth, age_years, age_text,
          height, weight, complexion, blood_group, marital_status,
          mother_tongue, diet, religion, caste, gotra,
          rashi, nakshatra, manglik, time_of_birth, place_of_birth,
          kuldaivat, education, college, occupation, company,
          work_location, income, father_name, father_occupation, mother_name,
          mother_occupation, siblings, family_type, native_place, maternal_uncle,
          partner_expectations, contact_person, contact_phone, contact_email, residential_address,
          template_id, language, last_download_format, has_photo, latest_r2_folder_path,
          latest_r2_pdf_key, latest_r2_photo_key, latest_r2_json_key, pdf_file_name, pdf_size_bytes,
          pdf_page_count, sections_json
        ) VALUES (
          ?, ?, ?, 1, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?
        )
        ON CONFLICT(candidate_fingerprint) DO UPDATE SET
          updated_at = excluded.updated_at,
          total_downloads = biodata_candidates.total_downloads + 1,
          latest_download_id = excluded.latest_download_id,
          candidate_name = excluded.candidate_name,
          candidate_name_lower = excluded.candidate_name_lower,
          date_of_birth = excluded.date_of_birth,
          age_years = excluded.age_years,
          age_text = excluded.age_text,
          height = excluded.height,
          weight = excluded.weight,
          complexion = excluded.complexion,
          blood_group = excluded.blood_group,
          marital_status = excluded.marital_status,
          mother_tongue = excluded.mother_tongue,
          diet = excluded.diet,
          religion = excluded.religion,
          caste = excluded.caste,
          gotra = excluded.gotra,
          rashi = excluded.rashi,
          nakshatra = excluded.nakshatra,
          manglik = excluded.manglik,
          time_of_birth = excluded.time_of_birth,
          place_of_birth = excluded.place_of_birth,
          kuldaivat = excluded.kuldaivat,
          education = excluded.education,
          college = excluded.college,
          occupation = excluded.occupation,
          company = excluded.company,
          work_location = excluded.work_location,
          income = excluded.income,
          father_name = excluded.father_name,
          father_occupation = excluded.father_occupation,
          mother_name = excluded.mother_name,
          mother_occupation = excluded.mother_occupation,
          siblings = excluded.siblings,
          family_type = excluded.family_type,
          native_place = excluded.native_place,
          maternal_uncle = excluded.maternal_uncle,
          partner_expectations = excluded.partner_expectations,
          contact_person = excluded.contact_person,
          contact_phone = excluded.contact_phone,
          contact_email = excluded.contact_email,
          residential_address = excluded.residential_address,
          template_id = excluded.template_id,
          language = excluded.language,
          last_download_format = excluded.last_download_format,
          has_photo = excluded.has_photo,
          latest_r2_folder_path = excluded.latest_r2_folder_path,
          latest_r2_pdf_key = excluded.latest_r2_pdf_key,
          latest_r2_photo_key = excluded.latest_r2_photo_key,
          latest_r2_json_key = excluded.latest_r2_json_key,
          pdf_file_name = excluded.pdf_file_name,
          pdf_size_bytes = excluded.pdf_size_bytes,
          pdf_page_count = excluded.pdf_page_count,
          sections_json = excluded.sections_json`
      )
      .bind(
        sortableRecord.candidateFingerprint,
        isoTimestamp,
        isoTimestamp,
        downloadId,
        sortableRecord.candidateName,
        sortableRecord.candidateNameLower,
        sortableRecord.dateOfBirth,
        sortableRecord.ageYears,
        sortableRecord.ageText,
        sortableRecord.height,
        sortableRecord.weight,
        sortableRecord.complexion,
        sortableRecord.bloodGroup,
        sortableRecord.maritalStatus,
        sortableRecord.motherTongue,
        sortableRecord.diet,
        sortableRecord.religion,
        sortableRecord.caste,
        sortableRecord.gotra,
        sortableRecord.rashi,
        sortableRecord.nakshatra,
        sortableRecord.manglik,
        sortableRecord.timeOfBirth,
        sortableRecord.placeOfBirth,
        sortableRecord.kuldaivat,
        sortableRecord.education,
        sortableRecord.college,
        sortableRecord.occupation,
        sortableRecord.company,
        sortableRecord.workLocation,
        sortableRecord.income,
        sortableRecord.fatherName,
        sortableRecord.fatherOccupation,
        sortableRecord.motherName,
        sortableRecord.motherOccupation,
        sortableRecord.siblings,
        sortableRecord.familyType,
        sortableRecord.nativePlace,
        sortableRecord.maternalUncle,
        sortableRecord.partnerExpectations,
        sortableRecord.contactPerson,
        sortableRecord.contactPhone,
        sortableRecord.contactEmail,
        sortableRecord.residentialAddress,
        sortableRecord.templateId,
        sortableRecord.language,
        downloadFormat,
        hasPhotoInt,
        paths.r2FolderPath,
        paths.r2PdfKey,
        paths.r2PhotoKey,
        paths.r2JsonKey,
        fileName,
        pdfBuffer.byteLength,
        pageCount,
        sectionsJson
      )
      .run();

    d1Saved = true;
  }

  return {
    ok: true,
    downloadId,
    candidateName: sortableRecord.candidateName,
    r2Bucket: R2_BUCKET_NAME,
    r2FolderPath: paths.r2FolderPath,
    r2Files: {
      pdfKey: paths.r2PdfKey,
      photoKey: paths.r2PhotoKey,
      jsonKey: paths.r2JsonKey
    },
    pdfSizeBytes: pdfBuffer.byteLength,
    photoSaved: Boolean(decodedPhoto),
    photoSizeBytes: decodedPhoto ? decodedPhoto.sizeBytes : 0,
    d1Database: D1_DATABASE_NAME,
    d1DatabaseId: D1_DATABASE_ID,
    r2Saved,
    d1Saved
  };
}
