/**
 * MongoDB Atlas Archival Service (Cloudflare Worker + Local Dev Server)
 * Saves every downloaded Marriage Biodata PDF + structured, sortable candidate columns
 * into MongoDB Atlas (`biodata_cogify.biodata_downloads` and `biodata_cogify.biodata_candidates`).
 */

import { MongoClient, Binary } from 'mongodb';
import { Buffer } from 'node:buffer';

export const DEFAULT_DB_NAME = 'biodata_cogify';
export const DOWNLOADS_COLLECTION = 'biodata_downloads';
export const CANDIDATES_COLLECTION = 'biodata_candidates';

export function resolveMongoUri(env = {}) {
  if (env.MONGODB_URI && String(env.MONGODB_URI).trim()) {
    return String(env.MONGODB_URI).trim();
  }
  if (env.MONGODB_USERNAME && env.MONGODB_PASSWORD) {
    const user = encodeURIComponent(String(env.MONGODB_USERNAME).trim());
    const pass = encodeURIComponent(String(env.MONGODB_PASSWORD).trim());
    const host = env.MONGODB_CLUSTER_HOST || 'cluster0.7snrub8.mongodb.net';
    return `mongodb+srv://${user}:${pass}@${host}`;
  }
  return '';
}

let cachedClient = null;
let cachedUri = null;
let indexesEnsured = false;

/**
 * Normalizes a string value for clean storage and indexing.
 */
function cleanStr(val) {
  if (val === null || val === undefined) return '';
  return String(val).trim();
}

/**
 * Parses numeric age in years from strings like "28 Years", "29", etc.
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
 * Profession, Income, City, Native Place, Phone, Email, Template, and Date in MongoDB Atlas.
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
    hasPhoto: Boolean(state?.photo?.enabled && state?.photo?.dataUrl),
    sections,
    allFieldsMap: flatByKey
  };
}

/**
 * Strips any `data:application/pdf;base64,` or `data:application/pdf;filename=...;base64,` prefix
 * and converts base64 string into a Node Buffer.
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
 * Connects to MongoDB Atlas (reusing client across requests when warm).
 */
async function getMongoDatabase(mongoUri, dbName = 'biodata_cogify') {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing in environment configuration.');
  }

  if (!cachedClient || cachedUri !== mongoUri) {
    cachedClient = new MongoClient(mongoUri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000
    });
    cachedUri = mongoUri;
    indexesEnsured = false;
    await cachedClient.connect();
  }

  const db = cachedClient.db(dbName);

  if (!indexesEnsured) {
    try {
      const downloadsCol = db.collection('biodata_downloads');
      const candidatesCol = db.collection('biodata_candidates');
      await Promise.all([
        downloadsCol.createIndexes([
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
        ]),
        candidatesCol.createIndexes([
          { key: { candidateFingerprint: 1 }, name: 'idx_unique_fingerprint', unique: true },
          { key: { updatedAt: -1 }, name: 'idx_updatedAt_desc' },
          { key: { candidateName: 1 }, name: 'idx_candidateName' },
          { key: { religion: 1, caste: 1, ageYears: 1 }, name: 'idx_religion_caste_age' },
          { key: { contactPhone: 1 }, name: 'idx_candidate_phone' },
          { key: { workLocation: 1 }, name: 'idx_candidate_location' }
        ])
      ]);
      indexesEnsured = true;
    } catch {
      // Non-fatal if indexes already exist
      indexesEnsured = true;
    }
  }

  return db;
}

/**
 * Saves a downloaded biodata PDF and its structured, sortable candidate fields into MongoDB Atlas.
 */
export async function saveBiodataDownloadToMongo({
  mongoUri,
  dbName = 'biodata_cogify',
  payload = {},
  requestMeta = {}
}) {
  const db = await getMongoDatabase(mongoUri, dbName);
  const now = new Date();

  const state = payload.state || {};
  const sortableRecord = extractSortableCandidateRecord(state);
  const pdfBuffer = decodePdfBase64ToBuffer(payload.pdfBase64);

  const fileName =
    cleanStr(payload.fileName) ||
    `${sortableRecord.candidateName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'marriage'}-biodata.pdf`;
  const pageCount = Number(payload.pageCount) || 1;
  const downloadFormat = cleanStr(payload.downloadFormat) || 'pdf';

  const pdfFileObject = pdfBuffer
    ? {
        fileName,
        mimeType: 'application/pdf',
        sizeBytes: pdfBuffer.byteLength,
        pageCount,
        binaryData: new Binary(pdfBuffer, 0)
      }
    : null;

  // Prepare sanitized state backup (without bloating twice if photo is huge, though keeping sections intact)
  const sectionsSnapshot = Array.isArray(state.sections) ? state.sections : [];

  const downloadDocument = {
    createdAt: now,
    createdAtIso: now.toISOString(),
    downloadFormat,
    ...sortableRecord,
    pdfFileName: fileName,
    pdfSizeBytes: pdfBuffer ? pdfBuffer.byteLength : 0,
    pdfPageCount: pageCount,
    pdfFile: pdfFileObject,
    sections: sectionsSnapshot,
    header: state.header || {},
    formatting: state.formatting || {},
    clientMeta: {
      userAgent: cleanStr(requestMeta.userAgent),
      country: cleanStr(requestMeta.country),
      city: cleanStr(requestMeta.city),
      ip: cleanStr(requestMeta.ip),
      referer: cleanStr(requestMeta.referer),
      pageUrl: cleanStr(payload.pageUrl)
    }
  };

  const downloadsCol = db.collection('biodata_downloads');
  const insertResult = await downloadsCol.insertOne(downloadDocument);

  // Also upsert into `biodata_candidates` so the user has a clean, deduplicated table of unique candidates
  const candidatesCol = db.collection('biodata_candidates');
  await candidatesCol.updateOne(
    { candidateFingerprint: sortableRecord.candidateFingerprint },
    {
      $set: {
        updatedAt: now,
        lastDownloadedAtIso: now.toISOString(),
        lastDownloadFormat: downloadFormat,
        latestDownloadId: insertResult.insertedId,
        ...sortableRecord,
        pdfFileName: fileName,
        pdfSizeBytes: pdfBuffer ? pdfBuffer.byteLength : 0,
        pdfPageCount: pageCount,
        latestPdfFile: pdfFileObject,
        sections: sectionsSnapshot
      },
      $setOnInsert: {
        firstCreatedAt: now
      },
      $inc: {
        totalDownloads: 1
      }
    },
    { upsert: true }
  );

  return {
    ok: true,
    downloadId: String(insertResult.insertedId),
    candidateName: sortableRecord.candidateName,
    fileName,
    pdfSizeBytes: pdfBuffer ? pdfBuffer.byteLength : 0,
    collection: 'biodata_downloads'
  };
}
