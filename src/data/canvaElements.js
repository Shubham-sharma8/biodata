/**
 * Canva-Style Interactive Studio Elements, Vector Stickers, Paper Textures,
 * Center Monogram Watermarks & Vedic Kundali Chart Renderer
 */

export function escapeSvgText(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const STICKER_CATEGORIES = [
  { id: 'all', name: 'All Elements (24)' },
  { id: 'sacred', name: 'Sacred & Auspicious' },
  { id: 'floral-royal', name: 'Floral & Royal Motifs' },
  { id: 'badges', name: 'Profile Callout Badges' }
];

export const CANVA_STICKERS = [
  // Sacred & Auspicious
  {
    id: 'sticker-ganesh-crest',
    name: 'Golden Ganesh Crest',
    category: 'sacred',
    defaultWidth: 78,
    defaultHeight: 78,
    svg: (primary = '#9B1C31', secondary = '#D4AF37') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="${secondary}" fill-opacity="0.14" stroke="${secondary}" stroke-width="2" stroke-dasharray="3 2"/>
        <circle cx="50" cy="50" r="38" stroke="${primary}" stroke-width="1.5"/>
        <path d="M50 18 L58 32 L42 32 Z" fill="${secondary}"/>
        <path d="M36 42 C36 32, 64 32, 64 42 C64 52, 54 56, 54 66 C54 72, 62 72, 64 68" stroke="${primary}" stroke-width="3.2" stroke-linecap="round"/>
        <circle cx="50" cy="27" r="2.5" fill="${primary}"/>
        <path d="M32 50 C25 46, 25 36, 34 36" stroke="${secondary}" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M68 50 C75 46, 75 36, 66 36" stroke="${secondary}" stroke-width="2.2" stroke-linecap="round"/>
        <text x="50" y="84" text-anchor="middle" fill="${primary}" font-size="8.5" font-weight="700" font-family="serif">॥ श्री गणेशाय नमः ॥</text>
      </svg>`
  },
  {
    id: 'sticker-om-medallion',
    name: 'Sacred Om Medallion',
    category: 'sacred',
    defaultWidth: 72,
    defaultHeight: 72,
    svg: (primary = '#9B1C31', secondary = '#D4AF37') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,5 61,22 81,15 78,36 95,50 78,64 81,85 61,78 50,95 39,78 19,85 22,64 5,50 22,36 19,15 39,22" fill="${secondary}" fill-opacity="0.15" stroke="${secondary}" stroke-width="1.8"/>
        <circle cx="50" cy="50" r="29" fill="#FFFDF9" stroke="${primary}" stroke-width="2"/>
        <text x="50" y="61" text-anchor="middle" fill="${primary}" font-size="34" font-weight="700" font-family="serif">ॐ</text>
      </svg>`
  },
  {
    id: 'sticker-shubh-labh',
    name: 'Shubh Labh Royal Seal',
    category: 'sacred',
    defaultWidth: 110,
    defaultHeight: 54,
    svg: (primary = '#9B1C31', secondary = '#D4AF37') => `
      <svg viewBox="0 0 160 76" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="152" height="60" rx="30" fill="${primary}" stroke="${secondary}" stroke-width="2.5"/>
        <rect x="9" y="13" width="142" height="50" rx="25" stroke="${secondary}" stroke-width="1" stroke-dasharray="3 2"/>
        <text x="45" y="45" text-anchor="middle" fill="#FFFDF9" font-size="18" font-weight="700" font-family="serif">शुभ</text>
        <circle cx="80" cy="38" r="6" fill="${secondary}"/>
        <text x="115" y="45" text-anchor="middle" fill="#FFFDF9" font-size="18" font-weight="700" font-family="serif">लाभ</text>
      </svg>`
  },
  {
    id: 'sticker-swastik-seal',
    name: 'Auspicious Swastik Seal',
    category: 'sacred',
    defaultWidth: 68,
    defaultHeight: 68,
    svg: (primary = '#9B1C31', secondary = '#D4AF37') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="44" stroke="${secondary}" stroke-width="2.2" fill="${secondary}" fill-opacity="0.1"/>
        <path d="M50 24 V76 M24 50 H76 M50 24 H74 M76 50 V74 M50 76 H26 M24 50 V26" stroke="${primary}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="37" cy="37" r="3.2" fill="${primary}"/>
        <circle cx="63" cy="37" r="3.2" fill="${primary}"/>
        <circle cx="37" cy="63" r="3.2" fill="${primary}"/>
        <circle cx="63" cy="63" r="3.2" fill="${primary}"/>
      </svg>`
  },
  {
    id: 'sticker-kalash-coconut',
    name: 'Mangal Kalash Motif',
    category: 'sacred',
    defaultWidth: 74,
    defaultHeight: 84,
    svg: (primary = '#9B1C31', secondary = '#D4AF37') => `
      <svg viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="24" rx="13" ry="16" fill="${primary}"/>
        <path d="M50 38 C32 22, 16 32, 22 48 C30 38, 42 40, 50 44 Z" fill="#15803D"/>
        <path d="M50 38 C68 22, 84 32, 78 48 C70 38, 58 40, 50 44 Z" fill="#15803D"/>
        <rect x="34" y="42" width="32" height="8" rx="4" fill="${secondary}" stroke="${primary}" stroke-width="1.5"/>
        <path d="M30 50 C20 66, 22 92, 38 100 H62 C78 92, 80 66, 70 50 Z" fill="${secondary}" fill-opacity="0.28" stroke="${primary}" stroke-width="2.5"/>
        <path d="M36 74 H64 M40 62 H60" stroke="${primary}" stroke-width="1.8" stroke-dasharray="3 2"/>
        <rect x="32" y="100" width="36" height="7" rx="3" fill="${primary}"/>
      </svg>`
  },
  {
    id: 'sticker-bismillah-tughra',
    name: 'Bismillah Arabesque Seal',
    category: 'sacred',
    defaultWidth: 118,
    defaultHeight: 62,
    svg: (primary = '#065F46', secondary = '#D4AF37') => `
      <svg viewBox="0 0 180 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 45 C16 20, 48 8, 90 8 C132 8, 164 20, 164 45 C164 70, 132 82, 90 82 C48 82, 16 70, 16 45 Z" fill="${secondary}" fill-opacity="0.14" stroke="${secondary}" stroke-width="2.2"/>
        <path d="M24 45 C24 25, 52 15, 90 15 C128 15, 156 25, 156 45 C156 65, 128 75, 90 75 C52 75, 24 65, 24 45 Z" stroke="${primary}" stroke-width="1.4" stroke-dasharray="4 2"/>
        <text x="90" y="51" text-anchor="middle" fill="${primary}" font-size="19" font-weight="700" font-family="serif">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</text>
      </svg>`
  },
  {
    id: 'sticker-crescent-lantern',
    name: 'Nikah Crescent & Lantern',
    category: 'sacred',
    defaultWidth: 74,
    defaultHeight: 84,
    svg: (primary = '#065F46', secondary = '#D4AF37') => `
      <svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M64 22 A28 28 0 1 0 64 78 A22 22 0 1 1 64 22 Z" fill="${secondary}" stroke="${primary}" stroke-width="2"/>
        <polygon points="72,38 75,45 83,45 77,50 79,57 72,53 65,57 67,50 61,45 69,45" fill="${primary}"/>
        <line x1="72" y1="8" x2="72" y2="32" stroke="${secondary}" stroke-width="1.5"/>
      </svg>`
  },
  {
    id: 'sticker-ik-onkar-seal',
    name: 'Ik Onkar Royal Medallion',
    category: 'sacred',
    defaultWidth: 74,
    defaultHeight: 74,
    svg: (primary = '#1E3A8A', secondary = '#D4AF37') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="44" fill="${secondary}" fill-opacity="0.16" stroke="${secondary}" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="36" stroke="${primary}" stroke-width="1.8" stroke-dasharray="4 2"/>
        <text x="50" y="62" text-anchor="middle" fill="${primary}" font-size="32" font-weight="700" font-family="serif">ੴ</text>
      </svg>`
  },
  {
    id: 'sticker-cross-dove',
    name: 'Sacred Cross & Olive Wreath',
    category: 'sacred',
    defaultWidth: 74,
    defaultHeight: 74,
    svg: (primary = '#1E3A8A', secondary = '#D4AF37') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="42" stroke="${secondary}" stroke-width="2" stroke-dasharray="5 3"/>
        <path d="M50 20 V80 M32 40 H68" stroke="${primary}" stroke-width="5.5" stroke-linecap="round"/>
        <path d="M50 24 V76 M36 40 H64" stroke="${secondary}" stroke-width="2" stroke-linecap="round"/>
      </svg>`
  },
  {
    id: 'sticker-jain-ahimsa',
    name: 'Jain Ahimsa Crest',
    category: 'sacred',
    defaultWidth: 74,
    defaultHeight: 84,
    svg: (primary = '#9B1C31', secondary = '#D4AF37') => `
      <svg viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 18 L70 18 L82 48 L70 92 L30 92 L18 48 Z" fill="${secondary}" fill-opacity="0.14" stroke="${primary}" stroke-width="2.2"/>
        <circle cx="50" cy="28" r="4" fill="${secondary}"/>
        <path d="M36 28 Q50 38 64 28" stroke="${primary}" stroke-width="2" fill="none"/>
        <circle cx="50" cy="62" r="16" stroke="${primary}" stroke-width="2"/>
        <text x="50" y="66" text-anchor="middle" fill="${primary}" font-size="11" font-weight="700" font-family="serif">अहिंसा</text>
      </svg>`
  },

  // Floral & Royal Motifs
  {
    id: 'sticker-lotus-mandala',
    name: 'Royal Lotus Rosette',
    category: 'floral-royal',
    defaultWidth: 86,
    defaultHeight: 86,
    svg: (primary = '#9B1C31', secondary = '#D4AF37') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="44" stroke="${secondary}" stroke-width="1.5" stroke-dasharray="3 3"/>
        <path d="M50 10 C60 28, 60 40, 50 50 C40 40, 40 28, 50 10 Z" fill="${primary}" fill-opacity="0.2" stroke="${primary}" stroke-width="1.5"/>
        <path d="M50 90 C60 72, 60 60, 50 50 C40 60, 40 72, 50 90 Z" fill="${primary}" fill-opacity="0.2" stroke="${primary}" stroke-width="1.5"/>
        <path d="M10 50 C28 40, 40 40, 50 50 C40 60, 28 60, 10 50 Z" fill="${primary}" fill-opacity="0.2" stroke="${primary}" stroke-width="1.5"/>
        <path d="M90 50 C72 40, 60 40, 50 50 C60 60, 72 60, 90 50 Z" fill="${primary}" fill-opacity="0.2" stroke="${primary}" stroke-width="1.5"/>
        <path d="M22 22 C38 28, 45 38, 50 50 C38 45, 28 38, 22 22 Z" fill="${secondary}" fill-opacity="0.28" stroke="${secondary}" stroke-width="1.5"/>
        <path d="M78 22 C62 28, 55 38, 50 50 C62 45, 72 38, 78 22 Z" fill="${secondary}" fill-opacity="0.28" stroke="${secondary}" stroke-width="1.5"/>
        <path d="M22 78 C38 72, 45 62, 50 50 C38 55, 28 62, 22 78 Z" fill="${secondary}" fill-opacity="0.28" stroke="${secondary}" stroke-width="1.5"/>
        <path d="M78 78 C62 72, 55 62, 50 50 C62 55, 72 62, 78 78 Z" fill="${secondary}" fill-opacity="0.28" stroke="${secondary}" stroke-width="1.5"/>
        <circle cx="50" cy="50" r="9" fill="${secondary}" stroke="${primary}" stroke-width="2"/>
      </svg>`
  },
  {
    id: 'sticker-marigold-garland',
    name: 'Marigold Toran Swag',
    category: 'floral-royal',
    defaultWidth: 150,
    defaultHeight: 54,
    svg: (primary = '#D97706', secondary = '#9B1C31') => `
      <svg viewBox="0 0 200 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 10 Q54 52 100 14 Q146 52 192 10" stroke="${secondary}" stroke-width="2.5" fill="none"/>
        <circle cx="25" cy="24" r="9" fill="${primary}"/>
        <circle cx="54" cy="34" r="10" fill="${secondary}"/>
        <circle cx="82" cy="24" r="9" fill="${primary}"/>
        <circle cx="100" cy="16" r="10" fill="${secondary}"/>
        <circle cx="118" cy="24" r="9" fill="${primary}"/>
        <circle cx="146" cy="34" r="10" fill="${secondary}"/>
        <circle cx="175" cy="24" r="9" fill="${primary}"/>
        <path d="M54 44 V62 M100 26 V54 M146 44 V62" stroke="${primary}" stroke-width="2.5" stroke-dasharray="3 3"/>
      </svg>`
  },
  {
    id: 'sticker-peacock-feather',
    name: 'Mayur Peacock Plume',
    category: 'floral-royal',
    defaultWidth: 76,
    defaultHeight: 92,
    svg: (primary = '#0F4C5C', secondary = '#D4AF37') => `
      <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 112 Q52 64 50 16" stroke="${secondary}" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="50" cy="42" rx="26" ry="32" fill="#0D9488" fill-opacity="0.22" stroke="${secondary}" stroke-width="2"/>
        <ellipse cx="50" cy="44" rx="17" ry="21" fill="${primary}" fill-opacity="0.85"/>
        <ellipse cx="50" cy="47" rx="9" ry="11" fill="${secondary}"/>
        <circle cx="50" cy="49" r="5" fill="#1E1B4B"/>
      </svg>`
  },
  {
    id: 'sticker-jharokha-arch',
    name: 'Rajasthani Jharokha Arch',
    category: 'floral-royal',
    defaultWidth: 88,
    defaultHeight: 100,
    svg: (primary = '#9B1C31', secondary = '#D4AF37') => `
      <svg viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 102 V46 C16 28, 34 22, 50 10 C66 22, 84 28, 84 46 V102 Z" fill="${secondary}" fill-opacity="0.14" stroke="${primary}" stroke-width="2.5"/>
        <path d="M24 96 V48 C24 34, 38 28, 50 18 C62 28, 76 34, 76 48 V96 Z" stroke="${secondary}" stroke-width="1.6" stroke-dasharray="3 2"/>
        <rect x="10" y="100" width="80" height="8" rx="3" fill="${primary}"/>
      </svg>`
  },
  {
    id: 'sticker-shehnai-dhol',
    name: 'Wedding Shehnai & Dhol',
    category: 'floral-royal',
    defaultWidth: 96,
    defaultHeight: 72,
    svg: (primary = '#9B1C31', secondary = '#D4AF37') => `
      <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 70 L85 22 L98 34 L26 76 Z" fill="${secondary}" stroke="${primary}" stroke-width="2"/>
        <path d="M100 70 L35 22 L22 34 L94 76 Z" fill="${primary}" fill-opacity="0.85" stroke="${secondary}" stroke-width="2"/>
        <circle cx="60" cy="48" r="14" fill="#FFFDF9" stroke="${primary}" stroke-width="2.5"/>
        <circle cx="60" cy="48" r="6" fill="${secondary}"/>
      </svg>`
  },
  {
    id: 'sticker-royal-doli',
    name: 'Royal Palanquin (Doli)',
    category: 'floral-royal',
    defaultWidth: 112,
    defaultHeight: 72,
    svg: (primary = '#9B1C31', secondary = '#D4AF37') => `
      <svg viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="6" y1="48" x2="134" y2="48" stroke="${secondary}" stroke-width="4" stroke-linecap="round"/>
        <path d="M36 48 C36 22, 52 14, 70 14 C88 14, 104 22, 104 48 V68 H36 Z" fill="${primary}" stroke="${secondary}" stroke-width="2.5"/>
        <path d="M48 48 C48 30, 58 24, 70 24 C82 24, 92 30, 92 48 V60 H48 Z" fill="#FFFDF9" stroke="${secondary}" stroke-width="1.5"/>
        <circle cx="70" cy="10" r="4" fill="${secondary}"/>
      </svg>`
  },
  {
    id: 'sticker-mughal-booti',
    name: 'Royal Paisley Zari Booti',
    category: 'floral-royal',
    defaultWidth: 74,
    defaultHeight: 88,
    svg: (primary = '#9B1C31', secondary = '#D4AF37') => `
      <svg viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M52 16 C78 16, 86 48, 76 76 C66 100, 32 104, 24 80 C16 56, 30 34, 52 34 C64 34, 66 22, 52 16 Z" fill="${secondary}" fill-opacity="0.2" stroke="${primary}" stroke-width="2.5"/>
        <circle cx="48" cy="66" r="12" stroke="${secondary}" stroke-width="2" fill="${primary}" fill-opacity="0.15"/>
        <circle cx="48" cy="66" r="5" fill="${primary}"/>
      </svg>`
  },
  {
    id: 'sticker-auspicious-diya',
    name: 'Auspicious Golden Diya',
    category: 'floral-royal',
    defaultWidth: 80,
    defaultHeight: 72,
    svg: (primary = '#9B1C31', secondary = '#D4AF37') => `
      <svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 12 C58 26, 60 36, 50 44 C40 36, 42 26, 50 12 Z" fill="#F59E0B" stroke="${primary}" stroke-width="1.5"/>
        <path d="M16 48 H84 C78 72, 64 80, 50 80 C36 80, 22 72, 16 48 Z" fill="${primary}" stroke="${secondary}" stroke-width="2.5"/>
        <path d="M24 56 H76" stroke="${secondary}" stroke-width="2" stroke-dasharray="4 2"/>
      </svg>`
  },
  {
    id: 'sticker-royal-crown',
    name: 'Maharaja Heritage Crown',
    category: 'floral-royal',
    defaultWidth: 92,
    defaultHeight: 66,
    svg: (primary = '#9B1C31', secondary = '#D4AF37') => `
      <svg viewBox="0 0 120 85" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 64 L24 26 L46 46 L60 16 L74 46 L96 26 L104 64 Z" fill="${secondary}" fill-opacity="0.28" stroke="${primary}" stroke-width="2.5" stroke-linejoin="round"/>
        <rect x="16" y="64" width="88" height="10" rx="4" fill="${primary}"/>
        <circle cx="24" cy="22" r="4" fill="${secondary}"/>
        <circle cx="60" cy="12" r="5" fill="${primary}"/>
        <circle cx="96" cy="22" r="4" fill="${secondary}"/>
      </svg>`
  },
  {
    id: 'sticker-gold-corner-flourish',
    name: 'Baroque Zari Flourish',
    category: 'floral-royal',
    defaultWidth: 90,
    defaultHeight: 90,
    svg: (primary = '#9B1C31', secondary = '#D4AF37') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 90 V25 C10 15, 15 10, 25 10 H90" stroke="${primary}" stroke-width="3" stroke-linecap="round"/>
        <path d="M18 82 V32 C18 22, 22 18, 32 18 H82" stroke="${secondary}" stroke-width="1.8" stroke-dasharray="4 2"/>
        <circle cx="24" cy="24" r="6" fill="${secondary}" stroke="${primary}" stroke-width="1.5"/>
        <path d="M24 38 C38 38, 38 24, 52 24" stroke="${primary}" stroke-width="2" fill="none"/>
      </svg>`
  },

  // Profile Callout Badges
  {
    id: 'sticker-badge-nri',
    name: 'Global / NRI Profile Badge',
    category: 'badges',
    defaultWidth: 132,
    defaultHeight: 44,
    svg: (primary = '#1E3A8A', secondary = '#D4AF37') => `
      <svg viewBox="0 0 180 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="174" height="46" rx="23" fill="${primary}" stroke="${secondary}" stroke-width="2.2"/>
        <circle cx="30" cy="28" r="12" stroke="${secondary}" stroke-width="1.6"/>
        <ellipse cx="30" cy="28" rx="6" ry="12" stroke="${secondary}" stroke-width="1.2"/>
        <line x1="18" y1="28" x2="42" y2="28" stroke="${secondary}" stroke-width="1.2"/>
        <text x="102" y="33" text-anchor="middle" fill="#FFFFFF" font-size="13.5" font-weight="700" font-family="sans-serif" letter-spacing="0.8">GLOBAL / NRI PROFILE</text>
      </svg>`
  },
  {
    id: 'sticker-badge-veg',
    name: 'Pure Vegetarian Seal',
    category: 'badges',
    defaultWidth: 128,
    defaultHeight: 44,
    svg: (primary = '#15803D', secondary = '#D4AF37') => `
      <svg viewBox="0 0 175 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="169" height="46" rx="23" fill="#F0FDF4" stroke="${primary}" stroke-width="2.2"/>
        <rect x="18" y="18" width="20" height="20" rx="3" stroke="${primary}" stroke-width="2"/>
        <circle cx="28" cy="28" r="6" fill="${primary}"/>
        <text x="102" y="33" text-anchor="middle" fill="${primary}" font-size="13.5" font-weight="700" font-family="sans-serif" letter-spacing="0.6">PURE VEGETARIAN</text>
      </svg>`
  },
  {
    id: 'sticker-badge-manglik-free',
    name: 'Non-Manglik Astro Seal',
    category: 'badges',
    defaultWidth: 128,
    defaultHeight: 44,
    svg: (primary = '#9B1C31', secondary = '#D4AF37') => `
      <svg viewBox="0 0 175 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="169" height="46" rx="23" fill="#FFFDF9" stroke="${primary}" stroke-width="2.2"/>
        <circle cx="28" cy="28" r="10" fill="${secondary}" fill-opacity="0.25" stroke="${primary}" stroke-width="1.8"/>
        <text x="28" y="32" text-anchor="middle" fill="${primary}" font-size="12" font-weight="700">✦</text>
        <text x="102" y="33" text-anchor="middle" fill="${primary}" font-size="13.5" font-weight="700" font-family="serif" letter-spacing="0.6">NON-MANGLIK</text>
      </svg>`
  },
  {
    id: 'sticker-badge-verified',
    name: 'Family Profile Crest Ribbon',
    category: 'badges',
    defaultWidth: 136,
    defaultHeight: 44,
    svg: (primary = '#9B1C31', secondary = '#D4AF37') => `
      <svg viewBox="0 0 185 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8 H173 L164 28 L173 48 H12 L21 28 Z" fill="${primary}" stroke="${secondary}" stroke-width="2"/>
        <text x="92" y="33" text-anchor="middle" fill="#FFFDF9" font-size="12.5" font-weight="700" font-family="serif" letter-spacing="1.2">✦ MATRIMONIAL FOLIO ✦</text>
      </svg>`
  }
];

export function renderCustomTextStickerSvg(text, badgeStyle = 'pill', primary = '#9B1C31', secondary = '#D4AF37') {
  const safeText = escapeSvgText(text || 'SPECIAL NOTE');
  if (badgeStyle === 'wax-seal' || badgeStyle === 'seal') {
    return `
      <svg viewBox="0 0 120 120" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="52" fill="${primary}" stroke="${secondary}" stroke-width="3" stroke-dasharray="5 3"/>
        <circle cx="60" cy="60" r="43" stroke="${secondary}" stroke-width="1.5"/>
        <text x="60" y="64" text-anchor="middle" fill="${secondary || '#FFFDF9'}" font-size="12.5" font-weight="700" font-family="serif">${safeText}</text>
      </svg>`;
  }
  if (badgeStyle === 'ribbon') {
    return `
      <svg viewBox="0 0 210 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 8 H200 L190 28 L200 48 H10 L20 28 Z" fill="${primary}" stroke="${secondary}" stroke-width="2"/>
        <text x="105" y="33" text-anchor="middle" fill="${secondary || '#FFFDF9'}" font-size="13" font-weight="700" font-family="serif" letter-spacing="0.8">${safeText}</text>
      </svg>`;
  }
  if (badgeStyle === 'outlined-tag') {
    return `
      <svg viewBox="0 0 210 54" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="202" height="42" rx="8" fill="#FFFDF9" stroke="${primary}" stroke-width="2.2"/>
        <rect x="9" y="11" width="192" height="32" rx="5" stroke="${secondary}" stroke-width="1.2" stroke-dasharray="3 2"/>
        <text x="105" y="32" text-anchor="middle" fill="${primary}" font-size="13" font-weight="700" font-family="serif">${safeText}</text>
      </svg>`;
  }
  // default 'pill'
  return `
    <svg viewBox="0 0 210 54" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="202" height="42" rx="21" fill="${primary}" stroke="${secondary}" stroke-width="2.2"/>
      <text x="105" y="32" text-anchor="middle" fill="${secondary || '#FFFDF9'}" font-size="13" font-weight="700" font-family="sans-serif" letter-spacing="0.6">${safeText}</text>
    </svg>`;
}

/**
 * Paper Texture & Pattern Overlays for the Canva Background Studio
 */
export const PAPER_TEXTURES = [
  { id: 'none', name: 'Solid Clean Paper' },
  { id: 'silk-weave', name: 'Banarasi Silk Weave' },
  { id: 'mandala-watermark', name: 'Lotus Mandala Filigree' },
  { id: 'jaali-lattice', name: 'Mughal Jaali Lattice' },
  { id: 'parchment-grain', name: 'Heirloom Parchment' },
  { id: 'botanical-wash', name: 'Botanical Leaf Pattern' },
  { id: 'royal-damask', name: 'Rajwada Royal Damask' },
  { id: 'zari-diagonal', name: 'Gold Zari Diagonal' },
  { id: 'swiss-grid', name: 'Architectural Micro-Grid' }
];

export function renderPaperTextureSvg(textureId, primary = '#9B1C31', secondary = '#D4AF37') {
  if (!textureId || textureId === 'none') return '';

  if (textureId === 'silk-weave') {
    return `
      <svg class="sheet-texture-svg" viewBox="0 0 794 1123" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="tex-silk" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M0 8 H16 M8 0 V16" stroke="${secondary}" stroke-width="0.6" stroke-opacity="0.16"/>
            <circle cx="8" cy="8" r="1" fill="${primary}" fill-opacity="0.12"/>
          </pattern>
        </defs>
        <rect width="794" height="1123" fill="url(#tex-silk)"/>
      </svg>`;
  }

  if (textureId === 'mandala-watermark') {
    return `
      <svg class="sheet-texture-svg" viewBox="0 0 794 1123" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="tex-mandala" width="120" height="120" patternUnits="userSpaceOnUse">
            <circle cx="60" cy="60" r="44" fill="none" stroke="${secondary}" stroke-width="0.8" stroke-opacity="0.14" stroke-dasharray="3 3"/>
            <circle cx="60" cy="60" r="24" fill="none" stroke="${primary}" stroke-width="0.7" stroke-opacity="0.1"/>
            <path d="M60 16 L68 44 L96 60 L68 76 L60 104 L52 76 L24 60 L52 44 Z" fill="none" stroke="${secondary}" stroke-width="0.7" stroke-opacity="0.12"/>
          </pattern>
        </defs>
        <rect width="794" height="1123" fill="url(#tex-mandala)"/>
      </svg>`;
  }

  if (textureId === 'jaali-lattice') {
    return `
      <svg class="sheet-texture-svg" viewBox="0 0 794 1123" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="tex-jaali" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M24 0 L48 24 L24 48 L0 24 Z" fill="none" stroke="${secondary}" stroke-width="0.8" stroke-opacity="0.16"/>
            <circle cx="24" cy="24" r="6" fill="none" stroke="${primary}" stroke-width="0.6" stroke-opacity="0.12"/>
          </pattern>
        </defs>
        <rect width="794" height="1123" fill="url(#tex-jaali)"/>
      </svg>`;
  }

  if (textureId === 'parchment-grain') {
    return `
      <svg class="sheet-texture-svg" viewBox="0 0 794 1123" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <radialGradient id="tex-parchment" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="${secondary}" stop-opacity="0.02"/>
          <stop offset="70%" stop-color="${secondary}" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="${primary}" stop-opacity="0.12"/>
        </radialGradient>
        <rect width="794" height="1123" fill="url(#tex-parchment)"/>
      </svg>`;
  }

  if (textureId === 'botanical-wash') {
    return `
      <svg class="sheet-texture-svg" viewBox="0 0 794 1123" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="tex-botanical" width="90" height="90" patternUnits="userSpaceOnUse">
            <path d="M20 70 Q45 20 70 20 Q70 45 20 70 Z" fill="none" stroke="${primary}" stroke-width="0.8" stroke-opacity="0.11"/>
            <path d="M20 70 L65 25" stroke="${secondary}" stroke-width="0.6" stroke-opacity="0.12"/>
          </pattern>
        </defs>
        <rect width="794" height="1123" fill="url(#tex-botanical)"/>
      </svg>`;
  }

  if (textureId === 'royal-damask') {
    return `
      <svg class="sheet-texture-svg" viewBox="0 0 794 1123" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="tex-damask" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M32 6 C42 20, 42 44, 32 58 C22 44, 22 20, 32 6 Z" fill="none" stroke="${secondary}" stroke-width="0.8" stroke-opacity="0.15"/>
            <path d="M6 32 C20 22, 44 22, 58 32 C44 42, 20 42, 6 32 Z" fill="none" stroke="${secondary}" stroke-width="0.8" stroke-opacity="0.15"/>
          </pattern>
        </defs>
        <rect width="794" height="1123" fill="url(#tex-damask)"/>
      </svg>`;
  }

  if (textureId === 'zari-diagonal') {
    return `
      <svg class="sheet-texture-svg" viewBox="0 0 794 1123" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="tex-zari" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M0 24 L24 0" stroke="${secondary}" stroke-width="0.7" stroke-opacity="0.16"/>
          </pattern>
        </defs>
        <rect width="794" height="1123" fill="url(#tex-zari)"/>
      </svg>`;
  }

  if (textureId === 'swiss-grid') {
    return `
      <svg class="sheet-texture-svg" viewBox="0 0 794 1123" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="tex-dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="${primary}" fill-opacity="0.14"/>
          </pattern>
        </defs>
        <rect width="794" height="1123" fill="url(#tex-dots)"/>
      </svg>`;
  }

  return '';
}

/**
 * Center Background Watermark / Monogram Layer
 */
export const WATERMARK_MODES = [
  { id: 'none', name: 'No Center Watermark' },
  { id: 'mandala', name: 'Sacred Surya Lotus Mandala' },
  { id: 'monogram', name: 'Candidate Initials Royal Crest' },
  { id: 'kalash', name: 'Auspicious Kalash & Toran Crest' },
  { id: 'custom-text', name: 'Custom Family Motto / Gotra Seal' }
];

export function renderCenterWatermarkSvg(mode, textOrInitials = 'AS', opacity = 0.07, primary = '#9B1C31', secondary = '#D4AF37') {
  if (!mode || mode === 'none') return '';
  const rawOp = Number(opacity) || 0.07;
  const normalizedOp = rawOp > 1 ? rawOp / 100 : rawOp;
  const safeOpacity = Math.max(0.02, Math.min(0.25, normalizedOp));
  const safeText = escapeSvgText(textOrInitials || 'MB');

  if (mode === 'monogram') {
    return `
      <div class="sheet-center-watermark" style="opacity:${safeOpacity}" aria-hidden="true">
        <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="134" stroke="${primary}" stroke-width="4" stroke-dasharray="8 6"/>
          <circle cx="150" cy="150" r="118" stroke="${secondary}" stroke-width="2.5"/>
          <polygon points="150,12 178,60 232,42 214,96 262,124 214,152 232,206 178,188 150,236 122,188 68,206 86,152 38,124 86,96 68,42 122,60" stroke="${secondary}" stroke-width="2" fill="none"/>
          <text x="150" y="172" text-anchor="middle" fill="${primary}" font-size="76" font-weight="700" font-family="serif" letter-spacing="4">${safeText}</text>
        </svg>
      </div>`;
  }

  if (mode === 'kalash') {
    return `
      <div class="sheet-center-watermark" style="opacity:${safeOpacity}" aria-hidden="true">
        <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="130" stroke="${secondary}" stroke-width="3" stroke-dasharray="6 4"/>
          <ellipse cx="150" cy="88" rx="28" ry="34" stroke="${primary}" stroke-width="4"/>
          <path d="M100 130 H200 C216 174, 210 222, 178 242 H122 C90 222, 84 174, 100 130 Z" stroke="${primary}" stroke-width="5"/>
          <path d="M105 175 H195" stroke="${secondary}" stroke-width="3" stroke-dasharray="6 4"/>
        </svg>
      </div>`;
  }

  if (mode === 'custom-text') {
    return `
      <div class="sheet-center-watermark" style="opacity:${safeOpacity}" aria-hidden="true">
        <svg viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="180" cy="180" r="150" stroke="${primary}" stroke-width="3.5" stroke-dasharray="8 5"/>
          <circle cx="180" cy="180" r="132" stroke="${secondary}" stroke-width="2"/>
          <text x="180" y="188" text-anchor="middle" fill="${primary}" font-size="30" font-weight="700" font-family="serif" letter-spacing="3">${safeText}</text>
        </svg>
      </div>`;
  }

  // Default 'mandala'
  return `
    <div class="sheet-center-watermark" style="opacity:${safeOpacity}" aria-hidden="true">
      <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="150" cy="150" r="136" stroke="${primary}" stroke-width="3" stroke-dasharray="6 4"/>
        <circle cx="150" cy="150" r="104" stroke="${secondary}" stroke-width="2.5"/>
        <circle cx="150" cy="150" r="68" stroke="${primary}" stroke-width="2"/>
        <path d="M150 14 L174 126 L286 150 L174 174 L150 286 L126 174 L14 150 L126 126 Z" stroke="${primary}" stroke-width="2.5"/>
        <path d="M54 54 L138 118 L246 54 L182 138 L246 246 L162 182 L54 246 L118 162 Z" stroke="${secondary}" stroke-width="2"/>
        <circle cx="150" cy="150" r="24" stroke="${primary}" stroke-width="3"/>
      </svg>
    </div>`;
}

/**
 * Interactive Vedic Kundali / Rashi Chart Generator
 * Supports North Indian Diamond Chart, South Indian Perimeter Grid, and East Indian Sunburst Chart
 */
export const KUNDALI_STYLES = [
  { id: 'north-indian', name: 'North Indian Diamond Kundali' },
  { id: 'south-indian', name: 'South Indian Rashi Grid' },
  { id: 'east-indian', name: 'East Indian (Bengali / Odia) Kundali' }
];

export const KUNDALI_PRESETS = [
  {
    id: 'simha_rajyoga',
    name: 'Simha (Leo) Lagna — Sun & Jupiter Yoga',
    houses: ['Lagna, Su', 'Me', 'Ve', 'Ma', 'Ju', '', 'Sa', '', 'Mo', 'Ra', '', 'Ke']
  },
  {
    id: 'vrishabha_shukra',
    name: 'Vrishabha (Taurus) — Shukra & Chandra',
    houses: ['Lagna, Ve', 'Mo', '', 'Ju', 'Su, Me', 'Ke', '', '', 'Sa', 'Ma', '', 'Ra']
  },
  {
    id: 'kanya_budhaditya',
    name: 'Kanya (Virgo) — Budhaditya Yoga',
    houses: ['Lagna, Me, Su', 'Ve', 'Ra', '', 'Ju', '', 'Mo', 'Sa', 'Ke', '', 'Ma', '']
  },
  {
    id: 'meena_hamsa',
    name: 'Meena (Pisces) — Hamsa Mahapurusha',
    houses: ['Lagna, Ju', '', 'Ma', 'Su, Me', 'Ve', 'Ra', '', '', 'Mo', '', 'Sa', 'Ke']
  }
];

export function createDefaultKundaliConfig() {
  return {
    show: false,
    style: 'north-indian',
    title: 'Lagna / Rashi Kundali Chakra',
    houses: ['Lagna, Su', 'Me', 'Ve', 'Ma', 'Ju', '', 'Sa', '', 'Mo', 'Ra', '', 'Ke']
  };
}

export function renderKundaliChartSvg(kundaliConfig, primary = '#9B1C31', secondary = '#D4AF37') {
  const cfg = kundaliConfig || createDefaultKundaliConfig();
  const houses = Array.isArray(cfg.houses) && cfg.houses.length === 12
    ? cfg.houses.map((h) => escapeSvgText(h || ''))
    : createDefaultKundaliConfig().houses.map((h) => escapeSvgText(h));
  const style = cfg.style || 'north-indian';
  const chartTitle = escapeSvgText(cfg.title || 'Lagna / Rashi Kundali');

  if (style === 'south-indian') {
    // 4x4 perimeter grid (12 boxes around the outside, 2x2 center title box)
    // South Indian fixed Rashi boxes clockwise from top-left-2 (Pisces, Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius)
    const cellCoords = [
      { x: 55, y: 0, num: '1' },   // Aries
      { x: 110, y: 0, num: '2' },  // Taurus
      { x: 165, y: 0, num: '3' },  // Gemini
      { x: 165, y: 45, num: '4' }, // Cancer
      { x: 165, y: 90, num: '5' }, // Leo
      { x: 165, y: 135, num: '6' },// Virgo
      { x: 110, y: 135, num: '7' },// Libra
      { x: 55, y: 135, num: '8' }, // Scorpio
      { x: 0, y: 135, num: '9' },  // Sagittarius
      { x: 0, y: 90, num: '10' },  // Capricorn
      { x: 0, y: 45, num: '11' },  // Aquarius
      { x: 0, y: 0, num: '12' }    // Pisces
    ];
    return `
      <svg class="kundali-chart-svg" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="218" height="178" rx="4" fill="#FFFDF9" stroke="${primary}" stroke-width="2"/>
        <!-- Grid lines -->
        <line x1="55" y1="0" x2="55" y2="180" stroke="${primary}" stroke-width="1.3"/>
        <line x1="165" y1="0" x2="165" y2="180" stroke="${primary}" stroke-width="1.3"/>
        <line x1="110" y1="0" x2="110" y2="45" stroke="${primary}" stroke-width="1.3"/>
        <line x1="110" y1="135" x2="110" y2="180" stroke="${primary}" stroke-width="1.3"/>
        <line x1="0" y1="45" x2="220" y2="45" stroke="${primary}" stroke-width="1.3"/>
        <line x1="0" y1="135" x2="220" y2="135" stroke="${primary}" stroke-width="1.3"/>
        <line x1="0" y1="90" x2="55" y2="90" stroke="${primary}" stroke-width="1.3"/>
        <line x1="165" y1="90" x2="220" y2="90" stroke="${primary}" stroke-width="1.3"/>
        <!-- Center emblem & title -->
        <rect x="59" y="49" width="102" height="82" fill="${secondary}" fill-opacity="0.1" stroke="${secondary}" stroke-width="0.9" stroke-dasharray="3 2"/>
        <text x="110" y="84" text-anchor="middle" fill="${primary}" font-size="13" font-weight="700" font-family="serif">॥ राशी चक्र ॥</text>
        <text x="110" y="102" text-anchor="middle" fill="${primary}" font-size="8.5" font-weight="600">${chartTitle}</text>
        ${cellCoords
          .map(
            (c, i) => `
          <text x="${c.x + 5}" y="${c.y + 11}" fill="${secondary}" font-size="7.5" font-weight="700">${c.num}</text>
          <text x="${c.x + 27.5}" y="${c.y + 28}" text-anchor="middle" fill="${primary}" font-size="8.5" font-weight="700">${houses[i] || ''}</text>
        `
          )
          .join('')}
      </svg>`;
  }

  if (style === 'east-indian') {
    // 3x3 grid with corner diagonals
    return `
      <svg class="kundali-chart-svg" viewBox="0 0 210 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="208" height="178" rx="4" fill="#FFFDF9" stroke="${primary}" stroke-width="2"/>
        <line x1="70" y1="0" x2="70" y2="180" stroke="${primary}" stroke-width="1.4"/>
        <line x1="140" y1="0" x2="140" y2="180" stroke="${primary}" stroke-width="1.4"/>
        <line x1="0" y1="60" x2="210" y2="60" stroke="${primary}" stroke-width="1.4"/>
        <line x1="0" y1="120" x2="210" y2="120" stroke="${primary}" stroke-width="1.4"/>
        <!-- Corner diagonals -->
        <line x1="0" y1="0" x2="70" y2="60" stroke="${secondary}" stroke-width="1.2"/>
        <line x1="210" y1="0" x2="140" y2="60" stroke="${secondary}" stroke-width="1.2"/>
        <line x1="0" y1="180" x2="70" y2="120" stroke="${secondary}" stroke-width="1.2"/>
        <line x1="210" y1="180" x2="140" y2="120" stroke="${secondary}" stroke-width="1.2"/>
        <text x="105" y="92" text-anchor="middle" fill="${primary}" font-size="10" font-weight="700" font-family="serif">शुभ कुंडली</text>
        <text x="105" y="34" text-anchor="middle" fill="${primary}" font-size="8.5" font-weight="700">${houses[0]}</text>
        <text x="48" y="20" text-anchor="middle" fill="${primary}" font-size="8" font-weight="700">${houses[1]}</text>
        <text x="20" y="44" text-anchor="middle" fill="${primary}" font-size="8" font-weight="700">${houses[2]}</text>
        <text x="35" y="94" text-anchor="middle" fill="${primary}" font-size="8.5" font-weight="700">${houses[3]}</text>
        <text x="20" y="142" text-anchor="middle" fill="${primary}" font-size="8" font-weight="700">${houses[4]}</text>
        <text x="48" y="168" text-anchor="middle" fill="${primary}" font-size="8" font-weight="700">${houses[5]}</text>
        <text x="105" y="154" text-anchor="middle" fill="${primary}" font-size="8.5" font-weight="700">${houses[6]}</text>
        <text x="162" y="168" text-anchor="middle" fill="${primary}" font-size="8" font-weight="700">${houses[7]}</text>
        <text x="190" y="142" text-anchor="middle" fill="${primary}" font-size="8" font-weight="700">${houses[8]}</text>
        <text x="175" y="94" text-anchor="middle" fill="${primary}" font-size="8.5" font-weight="700">${houses[9]}</text>
        <text x="190" y="44" text-anchor="middle" fill="${primary}" font-size="8" font-weight="700">${houses[10]}</text>
        <text x="162" y="20" text-anchor="middle" fill="${primary}" font-size="8" font-weight="700">${houses[11]}</text>
      </svg>`;
  }

  // Default: North Indian Diamond Kundali Chart
  const housePos = [
    { x: 110, y: 46, numX: 110, numY: 74, num: '1' },   // H1 Top Center Diamond
    { x: 55, y: 20, numX: 55, numY: 36, num: '2' },     // H2 Top-Left Upper
    { x: 24, y: 48, numX: 40, numY: 48, num: '3' },     // H3 Left-Top Triangle
    { x: 58, y: 92, numX: 88, numY: 92, num: '4' },     // H4 Left Center Diamond
    { x: 24, y: 138, numX: 40, numY: 138, num: '5' },   // H5 Left-Bottom Triangle
    { x: 55, y: 166, numX: 55, numY: 150, num: '6' },   // H6 Bottom-Left Lower
    { x: 110, y: 136, numX: 110, numY: 110, num: '7' }, // H7 Bottom Center Diamond
    { x: 165, y: 166, numX: 165, numY: 150, num: '8' }, // H8 Bottom-Right Lower
    { x: 196, y: 138, numX: 180, numY: 138, num: '9' }, // H9 Right-Bottom Triangle
    { x: 162, y: 92, numX: 132, numY: 92, num: '10' },  // H10 Right Center Diamond
    { x: 196, y: 48, numX: 180, numY: 48, num: '11' },  // H11 Right-Top Triangle
    { x: 165, y: 20, numX: 165, numY: 36, num: '12' }   // H12 Top-Right Upper
  ];

  return `
    <svg class="kundali-chart-svg" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="216" height="176" rx="4" fill="#FFFDF9" stroke="${primary}" stroke-width="2.2"/>
      <rect x="6" y="6" width="208" height="168" rx="2" stroke="${secondary}" stroke-width="0.9" stroke-dasharray="3 2"/>
      <!-- Outer Diagonals -->
      <line x1="2" y1="2" x2="218" y2="178" stroke="${primary}" stroke-width="1.5"/>
      <line x1="218" y1="2" x2="2" y2="178" stroke="${primary}" stroke-width="1.5"/>
      <!-- Inner Diamond -->
      <polygon points="110,2 218,90 110,178 2,90" stroke="${primary}" stroke-width="1.6" fill="${secondary}" fill-opacity="0.06"/>
      ${housePos
        .map(
          (hp, i) => `
        <text x="${hp.numX}" y="${hp.numY}" text-anchor="middle" fill="${secondary}" font-size="7.2" font-weight="700">${hp.num}</text>
        <text x="${hp.x}" y="${hp.y}" text-anchor="middle" fill="${primary}" font-size="8.5" font-weight="700">${houses[i] || ''}</text>
      `
        )
        .join('')}
    </svg>`;
}
