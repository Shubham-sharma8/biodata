// High-precision vector SVG emblems & sacred symbols for Marriage Biodata headers.
// Rendered inline so they scale cleanly at any DPI and inherit or use ceremonial colors.

export const EMBLEMS = [
  {
    id: 'ganesh',
    name: 'Shree Ganesh',
    community: 'Hindu',
    defaultInvocation: '|| Shree Ganeshay Namah ||',
    svg: (color = '#B45309') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="biodata-emblem-svg">
        <circle cx="50" cy="50" r="46" stroke="${color}" stroke-width="2" stroke-dasharray="3 2" opacity="0.45"/>
        <circle cx="50" cy="50" r="41" stroke="${color}" stroke-width="1.4" opacity="0.75"/>
        <!-- Crown / Mukut -->
        <path d="M35 31L50 13L65 31H35Z" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="2.2" stroke-linejoin="round"/>
        <circle cx="50" cy="19" r="2.5" fill="${color}"/>
        <path d="M31 32H69" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Ears -->
        <path d="M34 36C21 34 17 47 24 56C28 60 33 58 35 54" stroke="${color}" stroke-width="2.5" stroke-linecap="round" fill="${color}" fill-opacity="0.1"/>
        <path d="M66 36C79 34 83 47 76 56C72 60 67 58 65 54" stroke="${color}" stroke-width="2.5" stroke-linecap="round" fill="${color}" fill-opacity="0.1"/>
        <!-- Tilak -->
        <path d="M43 39H57M45 43H55" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="50" cy="46.5" r="2" fill="${color}"/>
        <!-- Head & Trunk -->
        <path d="M36 35C36 52 43 58 46 66C48 72 45 79 39 79C35 79 34 75 37 73" stroke="${color}" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M64 35C64 50 56 58 53 68C51 76 56 83 63 80C67 78 67 73 63 72" stroke="${color}" stroke-width="2.8" stroke-linecap="round"/>
        <!-- Tusk -->
        <path d="M42 62L36 66" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>
        <!-- Lotus Base -->
        <path d="M28 85C36 89 64 89 72 85" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      </svg>`
  },
  {
    id: 'om',
    name: 'Sacred Om (ॐ)',
    community: 'Hindu',
    defaultInvocation: '|| Om Namah Shivay ||',
    svg: (color = '#B45309') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="biodata-emblem-svg">
        <circle cx="50" cy="50" r="45" stroke="${color}" stroke-width="2" opacity="0.35"/>
        <circle cx="50" cy="50" r="40" stroke="${color}" stroke-width="1.4" opacity="0.7"/>
        <text x="50" y="68" text-anchor="middle" fill="${color}" font-size="52" font-family="'Noto Sans Devanagari', 'Playfair Display', serif" font-weight="700">ॐ</text>
      </svg>`
  },
  {
    id: 'kalash',
    name: 'Mangal Kalash & Swastika',
    community: 'Hindu',
    defaultInvocation: '|| Shree Ganeshay Namah ||',
    svg: (color = '#B45309') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="biodata-emblem-svg">
        <circle cx="50" cy="50" r="45" stroke="${color}" stroke-width="1.8" opacity="0.4"/>
        <!-- Coconut -->
        <ellipse cx="50" cy="27" rx="9" ry="11" fill="${color}" fill-opacity="0.16" stroke="${color}" stroke-width="2.2"/>
        <!-- Mango Leaves -->
        <path d="M41 34C32 26 24 31 28 40C33 42 39 39 42 37" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"/>
        <path d="M59 34C68 26 76 31 72 40C67 42 61 39 58 37" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"/>
        <!-- Kalash Neck & Pot -->
        <path d="M38 39H62L58 45H42L38 39Z" stroke="${color}" stroke-width="2.2" fill="${color}" fill-opacity="0.12"/>
        <path d="M42 45C30 50 28 69 40 77H60C72 69 70 50 58 45" fill="${color}" fill-opacity="0.1" stroke="${color}" stroke-width="2.4"/>
        <!-- Swastika on Kalash -->
        <path d="M50 53V69M42 61H58M50 53H56M50 69H44M58 61V67M42 61V55" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M35 81H65" stroke="${color}" stroke-width="2.6" stroke-linecap="round"/>
      </svg>`
  },
  {
    id: 'krishna',
    name: 'Radha Krishna Flute & Peacock Feather',
    community: 'Hindu',
    defaultInvocation: '|| Shree Krishnaay Namah ||',
    svg: (color = '#B45309') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="biodata-emblem-svg">
        <circle cx="50" cy="50" r="44" stroke="${color}" stroke-width="1.8" opacity="0.45"/>
        <!-- Peacock Feather -->
        <path d="M50 20C64 20 70 35 60 48C53 56 42 54 38 45C34 35 40 20 50 20Z" fill="${color}" fill-opacity="0.14" stroke="${color}" stroke-width="2.2"/>
        <circle cx="51" cy="36" r="6" fill="${color}"/>
        <path d="M48 48L44 74" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>
        <!-- Bansuri Flute -->
        <path d="M20 66L80 52" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
        <circle cx="38" cy="61.8" r="1.5" fill="#fff"/>
        <circle cx="47" cy="59.7" r="1.5" fill="#fff"/>
        <circle cx="56" cy="57.6" r="1.5" fill="#fff"/>
        <circle cx="65" cy="55.5" r="1.5" fill="#fff"/>
        <!-- Hanging beads -->
        <path d="M75 54V67M79 53V63" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="75" cy="69" r="2" fill="${color}"/>
        <circle cx="79" cy="65" r="2" fill="${color}"/>
      </svg>`
  },
  {
    id: 'bismillah_786',
    name: 'Islamic 786 & Crescent Star',
    community: 'Muslim',
    defaultInvocation: 'Bismillah-ir-Rahman-ir-Rahim',
    svg: (color = '#124538') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="biodata-emblem-svg">
        <polygon points="50,6 63,19 81,19 81,37 94,50 81,63 81,81 63,81 50,94 37,81 19,81 19,63 6,50 19,37 19,19 37,19" stroke="${color}" stroke-width="1.8" fill="${color}" fill-opacity="0.08"/>
        <!-- Crescent -->
        <path d="M56 26C45 26 36 35 36 46C36 57 45 66 56 66C61 66 65 64 68 61C63 63 57 62 52 58C45 52 45 40 52 34C56 30 62 29 67 31C64 28 60 26 56 26Z" fill="${color}"/>
        <!-- Star -->
        <polygon points="66,38 68,43 73,43 69,46 70.5,51 66,48 61.5,51 63,46 59,43 64,43" fill="${color}"/>
        <text x="50" y="79" text-anchor="middle" fill="${color}" font-size="16" font-family="'Cinzel', 'Playfair Display', serif" font-weight="700" letter-spacing="2">786</text>
      </svg>`
  },
  {
    id: 'ik_onkar',
    name: 'Sikh Ik Onkar (ੴ) & Khanda',
    community: 'Sikh',
    defaultInvocation: '|| Ik Onkar Satnam Waheguru ||',
    svg: (color = '#1A365D') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="biodata-emblem-svg">
        <circle cx="50" cy="50" r="44" stroke="${color}" stroke-width="2" opacity="0.4"/>
        <circle cx="50" cy="50" r="39" stroke="${color}" stroke-width="1.3" opacity="0.75"/>
        <text x="50" y="66" text-anchor="middle" fill="${color}" font-size="46" font-family="serif" font-weight="700">ੴ</text>
      </svg>`
  },
  {
    id: 'cross',
    name: 'Christian Sacred Cross (✝)',
    community: 'Christian',
    defaultInvocation: 'Praise the Lord',
    svg: (color = '#8C6239') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="biodata-emblem-svg">
        <circle cx="50" cy="50" r="44" stroke="${color}" stroke-width="1.8" opacity="0.4"/>
        <circle cx="50" cy="50" r="39" stroke="${color}" stroke-width="1.2" opacity="0.7"/>
        <path d="M50 20V80M32 39H68" stroke="${color}" stroke-width="5.5" stroke-linecap="round"/>
        <path d="M50 20V80M32 39H68" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>
        <circle cx="50" cy="39" r="5" fill="${color}"/>
      </svg>`
  },
  {
    id: 'jain',
    name: 'Jain Jai Jinendra Emblem',
    community: 'Jain',
    defaultInvocation: '|| Jai Jinendra ||',
    svg: (color = '#C05621') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="biodata-emblem-svg">
        <circle cx="50" cy="50" r="44" stroke="${color}" stroke-width="1.8" opacity="0.4"/>
        <!-- Siddhashila crescent & 3 Lok dots -->
        <path d="M36 26C44 32 56 32 64 26" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="50" cy="21" r="2.8" fill="${color}"/>
        <circle cx="41" cy="36" r="2.2" fill="${color}"/>
        <circle cx="50" cy="36" r="2.2" fill="${color}"/>
        <circle cx="59" cy="36" r="2.2" fill="${color}"/>
        <!-- Swastika -->
        <path d="M50 44V66M39 55H61M50 44H58M50 66H42M61 55V63M39 55V47" stroke="${color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Ahimsa Base -->
        <text x="50" y="81" text-anchor="middle" fill="${color}" font-size="11" font-family="'Noto Sans Devanagari', sans-serif" font-weight="700">अहिंसा परमो धर्मः</text>
      </svg>`
  },
  {
    id: 'buddha',
    name: 'Buddhist Dharma Wheel (☸)',
    community: 'Buddhist',
    defaultInvocation: '|| Namo Buddhaya ||',
    svg: (color = '#2B4C7E') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="biodata-emblem-svg">
        <circle cx="50" cy="50" r="44" stroke="${color}" stroke-width="1.8" opacity="0.35"/>
        <circle cx="50" cy="50" r="30" stroke="${color}" stroke-width="4"/>
        <circle cx="50" cy="50" r="8" fill="${color}"/>
        <path d="M50 14V86M14 50H86M24.5 24.5L75.5 75.5M75.5 24.5L24.5 75.5" stroke="${color}" stroke-width="2.8" stroke-linecap="round"/>
      </svg>`
  },
  {
    id: 'lotus',
    name: 'Royal Lotus Motif (Universal)',
    community: 'Universal',
    defaultInvocation: '',
    svg: (color = '#9B1C31') => `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="biodata-emblem-svg">
        <circle cx="50" cy="50" r="44" stroke="${color}" stroke-width="1.6" opacity="0.4"/>
        <path d="M50 22C58 34 60 50 50 64C40 50 42 34 50 22Z" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2.2"/>
        <path d="M50 64C34 60 26 46 30 32C40 38 46 48 50 64Z" fill="${color}" fill-opacity="0.14" stroke="${color}" stroke-width="2"/>
        <path d="M50 64C66 60 74 46 70 32C60 38 54 48 50 64Z" fill="${color}" fill-opacity="0.14" stroke="${color}" stroke-width="2"/>
        <path d="M50 64C28 66 16 56 16 44C28 46 40 54 50 64Z" stroke="${color}" stroke-width="2"/>
        <path d="M50 64C72 66 84 56 84 44C72 46 60 54 50 64Z" stroke="${color}" stroke-width="2"/>
        <path d="M26 72C40 76 60 76 74 72" stroke="${color}" stroke-width="2.4" stroke-linecap="round"/>
      </svg>`
  },
  {
    id: 'none',
    name: 'No Emblem (Clean Minimal)',
    community: 'All',
    defaultInvocation: '',
    svg: () => ''
  }
];

export function getEmblemById(id) {
  return EMBLEMS.find((e) => e.id === id) || EMBLEMS[0];
}
