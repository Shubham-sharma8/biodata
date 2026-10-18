-- ============================================================================
-- Cloudflare D1 Schema for Marriage Biodata Maker (biodata.cogify.me)
-- Database Name: biodata
-- Database ID:   bb855f1e-d450-464d-b4da-f273c821288e
-- R2 Bucket:     biodata (https://34f55fffa618d8ec831f8926c79a3575.r2.cloudflarestorage.com/biodata)
-- ============================================================================

CREATE TABLE IF NOT EXISTS biodata_downloads (
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
);

CREATE INDEX IF NOT EXISTS idx_downloads_created_at
  ON biodata_downloads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_downloads_name
  ON biodata_downloads(candidate_name_lower ASC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_downloads_religion_caste
  ON biodata_downloads(religion ASC, caste ASC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_downloads_age
  ON biodata_downloads(age_years ASC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_downloads_phone
  ON biodata_downloads(contact_phone ASC);

CREATE INDEX IF NOT EXISTS idx_downloads_location
  ON biodata_downloads(work_location ASC, native_place ASC);

CREATE TABLE IF NOT EXISTS biodata_candidates (
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
);

CREATE INDEX IF NOT EXISTS idx_candidates_updated_at
  ON biodata_candidates(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_candidates_name
  ON biodata_candidates(candidate_name_lower ASC);

CREATE INDEX IF NOT EXISTS idx_candidates_religion_caste_age
  ON biodata_candidates(religion ASC, caste ASC, age_years ASC);

CREATE INDEX IF NOT EXISTS idx_candidates_phone
  ON biodata_candidates(contact_phone ASC);
