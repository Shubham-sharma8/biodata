/**
 * Browser Cookie Persistence & Recovery Manager for Marriage Biodata Maker
 *
 * Stores user biodata state across browser sessions using standard HTTP cookies
 * (`document.cookie`) with automatic multi-cookie chunking (to stay safely below
 * the 4,096-byte RFC 6265 per-cookie limit) alongside a secondary "Previous Saved
 * Snapshot" cookie bank so users can recover their previous data even after
 * switching sample presets or clearing fields.
 *
 * Note: High-volume base64 images (profile photo & custom emblem) are stored in
 * dedicated localStorage keys so cookie headers remain lightweight (~1.5–4 KB)
 * and compatible with Cloudflare Workers edge limits.
 */

const COOKIE_PREFIX = 'bd_cogify_v1';
const PREV_COOKIE_PREFIX = 'bd_cogify_prev';
const MAX_CHUNK_CHARS = 2800; // Safe margin under 4KB per cookie after URI encoding
const MAX_CHUNKS = 12;
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 365 days
const PHOTO_BACKUP_LS_KEY = 'biodatamaker_cookie_photo_backup_v1';
const PREV_PHOTO_BACKUP_LS_KEY = 'biodatamaker_cookie_prev_photo_backup_v1';

/**
 * Helper to set a single browser cookie safely
 */
function setRawCookie(name, value, maxAgeSeconds = COOKIE_MAX_AGE_SECONDS) {
  if (typeof document === 'undefined') return false;
  try {
    const secureFlag =
      typeof window !== 'undefined' && window.location && window.location.protocol === 'https:'
        ? '; Secure'
        : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secureFlag}`;
    return true;
  } catch (err) {
    console.warn('[CookieStorage] Failed to write cookie:', name, err);
    return false;
  }
}

/**
 * Helper to read a single browser cookie by name
 */
function getRawCookie(name) {
  if (typeof document === 'undefined' || !document.cookie) return null;
  const prefix = `${name}=`;
  const parts = document.cookie.split(';');
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i].trim();
    if (part.startsWith(prefix)) {
      try {
        return decodeURIComponent(part.slice(prefix.length));
      } catch {
        return part.slice(prefix.length);
      }
    }
  }
  return null;
}

/**
 * Helper to delete a single browser cookie by name
 */
function deleteRawCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

/**
 * Extracts candidate display name from a biodata state object for UI banners
 */
export function extractCandidateNameFromState(state) {
  if (!state || !Array.isArray(state.sections)) return '';
  const personalSec =
    state.sections.find((s) => s.id === 'personal') || state.sections[0];
  if (!personalSec || !Array.isArray(personalSec.fields)) return '';
  const nameField =
    personalSec.fields.find(
      (f) =>
        f.key === 'full_name' ||
        f.id === 'f_full_name' ||
        /name/i.test(f.label || '')
    ) || personalSec.fields[0];
  return nameField && nameField.value ? String(nameField.value).trim() : '';
}

/**
 * Creates a compact, cookie-safe clone of the application state.
 * Strips large base64 data URLs from the cookie chunks (backing them up in
 * localStorage so they are still restored seamlessly).
 */
function createCompactCookiePayload(state, photoStorageKey) {
  if (!state || typeof state !== 'object') return null;

  // Backup base64 photo & custom emblem separately so cookies stay under edge header limits
  if (typeof localStorage !== 'undefined') {
    try {
      const mediaPayload = {
        photoDataUrl: state.photo?.dataUrl || null,
        customEmblemDataUrl: state.customEmblemDataUrl || null
      };
      if (mediaPayload.photoDataUrl || mediaPayload.customEmblemDataUrl) {
        localStorage.setItem(photoStorageKey, JSON.stringify(mediaPayload));
      }
    } catch {
      // Ignore quota errors
    }
  }

  const clone = JSON.parse(JSON.stringify(state));
  clone.__cookieSavedAt = Date.now();
  clone.__candidateName = extractCandidateNameFromState(state);

  if (clone.photo && clone.photo.dataUrl) {
    clone.photo.dataUrl = '__STORED_MEDIA__';
  }
  if (clone.customEmblemDataUrl) {
    clone.customEmblemDataUrl = '__STORED_MEDIA__';
  }

  return clone;
}

/**
 * Rehydrates media fields (`photo.dataUrl` and `customEmblemDataUrl`) into a parsed cookie payload
 */
function rehydrateCookiePayload(parsed, photoStorageKey) {
  if (!parsed || typeof parsed !== 'object') return null;
  if (typeof localStorage !== 'undefined') {
    try {
      const rawMedia = localStorage.getItem(photoStorageKey);
      if (rawMedia) {
        const media = JSON.parse(rawMedia);
        if (parsed.photo && parsed.photo.dataUrl === '__STORED_MEDIA__') {
          parsed.photo.dataUrl = media.photoDataUrl || null;
        }
        if (parsed.customEmblemDataUrl === '__STORED_MEDIA__') {
          parsed.customEmblemDataUrl = media.customEmblemDataUrl || null;
        }
      } else {
        if (parsed.photo && parsed.photo.dataUrl === '__STORED_MEDIA__') {
          parsed.photo.dataUrl = null;
        }
        if (parsed.customEmblemDataUrl === '__STORED_MEDIA__') {
          parsed.customEmblemDataUrl = null;
        }
      }
    } catch {
      if (parsed.photo && parsed.photo.dataUrl === '__STORED_MEDIA__') {
        parsed.photo.dataUrl = null;
      }
      if (parsed.customEmblemDataUrl === '__STORED_MEDIA__') {
        parsed.customEmblemDataUrl = null;
      }
    }
  }
  return parsed;
}

/**
 * Writes a serialized payload across chunked cookies with a metadata header cookie
 */
function writeChunkedCookies(prefix, state, photoStorageKey) {
  const payload = createCompactCookiePayload(state, photoStorageKey);
  if (!payload) return false;

  const jsonStr = JSON.stringify(payload);
  const chunks = [];
  for (let i = 0; i < jsonStr.length; i += MAX_CHUNK_CHARS) {
    chunks.push(jsonStr.slice(i, i + MAX_CHUNK_CHARS));
  }

  if (chunks.length > MAX_CHUNKS) {
    console.warn('[CookieStorage] Payload exceeds max cookie chunks:', chunks.length);
    return false;
  }

  // Write each chunk
  for (let idx = 0; idx < chunks.length; idx += 1) {
    const ok = setRawCookie(`${prefix}_${idx}`, chunks[idx]);
    if (!ok) return false;
  }

  // Clean up any stale higher-indexed chunks from earlier larger saves
  for (let idx = chunks.length; idx < MAX_CHUNKS; idx += 1) {
    deleteRawCookie(`${prefix}_${idx}`);
  }

  // Write meta cookie last so readers know the chunk count & timestamp
  const meta = {
    v: 1,
    chunks: chunks.length,
    savedAt: payload.__cookieSavedAt || Date.now(),
    candidateName: payload.__candidateName || 'Saved Biodata Draft',
    templateId: payload.templateId || 'royal-sindoor-gold'
  };
  return setRawCookie(`${prefix}_meta`, JSON.stringify(meta));
}

/**
 * Reads and reassembles a chunked cookie payload
 */
function readChunkedCookies(prefix, photoStorageKey) {
  const metaRaw = getRawCookie(`${prefix}_meta`);
  if (!metaRaw) return null;

  try {
    const meta = JSON.parse(metaRaw);
    const count = Number(meta.chunks) || 0;
    if (count <= 0 || count > MAX_CHUNKS) return null;

    let combined = '';
    for (let idx = 0; idx < count; idx += 1) {
      const part = getRawCookie(`${prefix}_${idx}`);
      if (part === null) return null;
      combined += part;
    }

    const parsed = JSON.parse(combined);
    return rehydrateCookiePayload(parsed, photoStorageKey);
  } catch (err) {
    console.warn('[CookieStorage] Failed to parse chunked cookies for', prefix, err);
    return null;
  }
}

/**
 * Saves current biodata state into primary browser cookies (`bd_cogify_v1_*`)
 */
export function saveBiodataToCookies(state) {
  return writeChunkedCookies(COOKIE_PREFIX, state, PHOTO_BACKUP_LS_KEY);
}

/**
 * Loads saved biodata state from primary browser cookies (`bd_cogify_v1_*`)
 */
export function loadBiodataFromCookies() {
  return readChunkedCookies(COOKIE_PREFIX, PHOTO_BACKUP_LS_KEY);
}

/**
 * Saves a backup "Previous Saved Data" snapshot in `bd_cogify_prev_*` cookies
 * before destructive actions like switching presets or clearing fields.
 */
export function savePreviousSnapshotToCookies(state) {
  return writeChunkedCookies(PREV_COOKIE_PREFIX, state, PREV_PHOTO_BACKUP_LS_KEY);
}

/**
 * Loads the backup "Previous Saved Data" snapshot from `bd_cogify_prev_*` cookies
 */
export function loadPreviousSnapshotFromCookies() {
  return readChunkedCookies(PREV_COOKIE_PREFIX, PREV_PHOTO_BACKUP_LS_KEY);
}

/**
 * Returns metadata summary about currently stored cookies for the UI status bar
 */
export function getSavedCookieSummary() {
  const primaryMetaRaw = getRawCookie(`${COOKIE_PREFIX}_meta`);
  const prevMetaRaw = getRawCookie(`${PREV_COOKIE_PREFIX}_meta`);

  let primary = null;
  let previous = null;

  if (primaryMetaRaw) {
    try {
      primary = JSON.parse(primaryMetaRaw);
    } catch {
      primary = null;
    }
  }

  if (prevMetaRaw) {
    try {
      previous = JSON.parse(prevMetaRaw);
    } catch {
      previous = null;
    }
  }

  return {
    hasPrimaryCookie: Boolean(primary && primary.chunks > 0),
    hasPreviousCookie: Boolean(previous && previous.chunks > 0),
    primary,
    previous
  };
}

/**
 * Clears all biodata browser cookies (`bd_cogify_v1_*` and `bd_cogify_prev_*`)
 */
export function clearBiodataCookies() {
  deleteRawCookie(`${COOKIE_PREFIX}_meta`);
  deleteRawCookie(`${PREV_COOKIE_PREFIX}_meta`);
  for (let idx = 0; idx < MAX_CHUNKS; idx += 1) {
    deleteRawCookie(`${COOKIE_PREFIX}_${idx}`);
    deleteRawCookie(`${PREV_COOKIE_PREFIX}_${idx}`);
  }
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(PHOTO_BACKUP_LS_KEY);
      localStorage.removeItem(PREV_PHOTO_BACKUP_LS_KEY);
    } catch {
      // Ignore
    }
  }
}
