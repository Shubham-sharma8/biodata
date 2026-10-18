// Vector SVG Ornamental Borders, Corner Flourishes, Cultural Arches & Section Dividers
// Renders crisp vector geometry inside the A4 sheet so exports at 3x DPI or Vector Print have zero blur.

export const SUPPORTED_BORDER_STYLES = [
  'mandala-corners',
  'temple-arch',
  'toran-festive',
  'zari-ornate',
  'arabesque-arch',
  'floral-vine',
  'filigree-corners',
  'double-rule',
  'minimal-line',
  'mughal-jharokha',
  'peacock-darbar',
  'lotus-padma',
  'marigold-bandhanwar',
  'south-indian-kolam',
  'bengali-alpana',
  'punjabi-phulkari',
  'rajasthani-leheriya',
  'islamic-mihrab',
  'sikh-khanda-arch',
  'christian-cathedral',
  'jain-torana',
  'art-deco-geometric',
  'swiss-editorial-grid',
  'kalamkari-peacock-vine',
  'madhubani-folk-border',
  'warli-heritage-frieze',
  'mughal-parchin-kari',
  'golden-kalash-toran',
  'gothic-cathedral-tracery',
  'art-deco-gatsby-chevron',
  'minimal-swiss-crosshair',
  'none'
];

export function renderTemplateFrameSvg(borderStyle, primary, secondary) {
  switch (borderStyle) {
    case 'none':
      return '';

    case 'mandala-corners':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="22" y="22" width="750" height="1079" stroke="${primary}" stroke-width="2.5"/>
          <rect x="30" y="30" width="734" height="1063" stroke="${secondary}" stroke-width="1.2"/>
          ${renderCornerMandala(22, 22, 0, primary, secondary)}
          ${renderCornerMandala(772, 22, 90, primary, secondary)}
          ${renderCornerMandala(772, 1101, 180, primary, secondary)}
          ${renderCornerMandala(22, 1101, 270, primary, secondary)}
          <circle cx="22" cy="561.5" r="7" fill="${primary}" stroke="${secondary}" stroke-width="2"/>
          <circle cx="772" cy="561.5" r="7" fill="${primary}" stroke="${secondary}" stroke-width="2"/>
          <circle cx="397" cy="22" r="7" fill="${primary}" stroke="${secondary}" stroke-width="2"/>
          <circle cx="397" cy="1101" r="7" fill="${primary}" stroke="${secondary}" stroke-width="2"/>
        </svg>`;

    case 'temple-arch':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="20" y="20" width="754" height="1083" stroke="${secondary}" stroke-width="1.5"/>
          <path d="M32 1088V105C32 62 72 44 125 44H320C355 44 380 28 397 14C414 28 439 44 474 44H669C722 44 762 62 762 105V1088H32Z" stroke="${primary}" stroke-width="2.6"/>
          <path d="M40 1080V110C40 72 76 52 128 52H666C718 52 754 72 754 110V1080H40Z" stroke="${secondary}" stroke-width="1.1" stroke-dasharray="4 3"/>
          ${renderCornerFiligree(32, 1088, 270, primary, secondary)}
          ${renderCornerFiligree(762, 1088, 180, primary, secondary)}
        </svg>`;

    case 'toran-festive':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="24" y="24" width="746" height="1075" stroke="${primary}" stroke-width="2.4"/>
          <rect x="31" y="31" width="732" height="1061" stroke="${secondary}" stroke-width="1.2"/>
          <path d="M31 31 Q77 62 122 31 Q168 62 214 31 Q260 62 305 31 Q351 62 397 31 Q443 62 489 31 Q534 62 580 31 Q626 62 671 31 Q717 62 763 31" stroke="${secondary}" stroke-width="2.2" fill="${primary}" fill-opacity="0.06"/>
          <circle cx="77" cy="52" r="3.5" fill="${primary}"/>
          <circle cx="168" cy="52" r="3.5" fill="${primary}"/>
          <circle cx="260" cy="52" r="3.5" fill="${primary}"/>
          <circle cx="351" cy="52" r="3.5" fill="${primary}"/>
          <circle cx="443" cy="52" r="3.5" fill="${primary}"/>
          <circle cx="534" cy="52" r="3.5" fill="${primary}"/>
          <circle cx="626" cy="52" r="3.5" fill="${primary}"/>
          <circle cx="717" cy="52" r="3.5" fill="${primary}"/>
          ${renderCornerFiligree(24, 1099, 270, primary, secondary)}
          ${renderCornerFiligree(770, 1099, 180, primary, secondary)}
        </svg>`;

    case 'zari-ornate':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="18" y="18" width="758" height="1087" stroke="${secondary}" stroke-width="1.4" opacity="0.7"/>
          <rect x="25" y="25" width="744" height="1073" stroke="${primary}" stroke-width="3"/>
          <rect x="33" y="33" width="728" height="1057" stroke="${primary}" stroke-width="1" stroke-dasharray="6 3"/>
          ${renderCornerMandala(25, 25, 0, primary, secondary)}
          ${renderCornerMandala(769, 25, 90, primary, secondary)}
          ${renderCornerMandala(769, 1098, 180, primary, secondary)}
          ${renderCornerMandala(25, 1098, 270, primary, secondary)}
        </svg>`;

    case 'arabesque-arch':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="20" y="20" width="754" height="1083" stroke="${secondary}" stroke-width="1.5"/>
          <rect x="27" y="27" width="740" height="1069" stroke="${primary}" stroke-width="2.4"/>
          <path d="M35 120C35 66 95 54 270 50C335 48 375 34 397 16C419 34 459 48 524 50C699 54 759 66 759 120" stroke="${secondary}" stroke-width="2"/>
          ${renderEightPointStar(52, 52, primary, secondary)}
          ${renderEightPointStar(742, 52, primary, secondary)}
          ${renderEightPointStar(742, 1071, primary, secondary)}
          ${renderEightPointStar(52, 1071, primary, secondary)}
        </svg>`;

    case 'floral-vine':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="24" y="24" width="746" height="1075" rx="8" stroke="${secondary}" stroke-width="1.6"/>
          <rect x="32" y="32" width="730" height="1059" rx="6" stroke="${primary}" stroke-width="1.2" opacity="0.65"/>
          ${renderCornerFloral(24, 24, 0, primary, secondary)}
          ${renderCornerFloral(770, 24, 90, primary, secondary)}
          ${renderCornerFloral(770, 1099, 180, primary, secondary)}
          ${renderCornerFloral(24, 1099, 270, primary, secondary)}
        </svg>`;

    case 'filigree-corners':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="24" y="24" width="746" height="1075" stroke="${primary}" stroke-width="2.2"/>
          <rect x="30" y="30" width="734" height="1063" stroke="${secondary}" stroke-width="1.1"/>
          ${renderCornerFiligree(24, 24, 0, primary, secondary)}
          ${renderCornerFiligree(770, 24, 90, primary, secondary)}
          ${renderCornerFiligree(770, 1099, 180, primary, secondary)}
          ${renderCornerFiligree(24, 1099, 270, primary, secondary)}
        </svg>`;

    case 'double-rule':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="24" y="24" width="746" height="1075" stroke="${primary}" stroke-width="2.4"/>
          <rect x="31" y="31" width="732" height="1061" stroke="${secondary}" stroke-width="1.1"/>
          <rect x="20" y="20" width="14" height="14" stroke="${primary}" stroke-width="2" fill="none"/>
          <rect x="760" y="20" width="14" height="14" stroke="${primary}" stroke-width="2" fill="none"/>
          <rect x="760" y="1089" width="14" height="14" stroke="${primary}" stroke-width="2" fill="none"/>
          <rect x="20" y="1089" width="14" height="14" stroke="${primary}" stroke-width="2" fill="none"/>
        </svg>`;

    case 'mughal-jharokha':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="20" y="20" width="754" height="1083" stroke="${primary}" stroke-width="2.5"/>
          <rect x="28" y="28" width="738" height="1067" stroke="${secondary}" stroke-width="1.1"/>
          <!-- Scalloped Cusped Palace Jharokha Arch -->
          <path d="M34 140 V92 Q68 88 92 64 Q130 64 162 46 Q210 48 252 34 Q310 38 352 24 Q380 26 397 12 Q414 26 442 24 Q484 38 542 34 Q584 48 632 46 Q664 64 702 64 Q726 88 760 92 V140" stroke="${primary}" stroke-width="2.2" fill="${secondary}" fill-opacity="0.07"/>
          <line x1="34" y1="140" x2="34" y2="1088" stroke="${primary}" stroke-width="1.8"/>
          <line x1="760" y1="140" x2="760" y2="1088" stroke="${primary}" stroke-width="1.8"/>
          ${renderCornerMandala(28, 1095, 270, primary, secondary)}
          ${renderCornerMandala(766, 1095, 180, primary, secondary)}
        </svg>`;

    case 'peacock-darbar':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="22" y="22" width="750" height="1079" stroke="${primary}" stroke-width="2.4"/>
          <rect x="30" y="30" width="734" height="1063" stroke="${secondary}" stroke-width="1.3"/>
          <!-- Peacock plume arches in top corners -->
          ${renderPeacockCorner(26, 26, 0, primary, secondary)}
          ${renderPeacockCorner(768, 26, 90, primary, secondary)}
          ${renderPeacockCorner(768, 1097, 180, primary, secondary)}
          ${renderPeacockCorner(26, 1097, 270, primary, secondary)}
          <!-- Crown jewel at top center -->
          <path d="M365 22 L397 8 L429 22 L397 34 Z" fill="${primary}" fill-opacity="0.16" stroke="${primary}" stroke-width="1.8"/>
          <circle cx="397" cy="21" r="4" fill="${secondary}"/>
        </svg>`;

    case 'lotus-padma':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="24" y="24" width="746" height="1075" rx="10" stroke="${primary}" stroke-width="2.2"/>
          <rect x="32" y="32" width="730" height="1059" rx="6" stroke="${secondary}" stroke-width="1.1"/>
          ${renderLotusCorner(28, 28, 0, primary, secondary)}
          ${renderLotusCorner(766, 28, 90, primary, secondary)}
          ${renderLotusCorner(766, 1095, 180, primary, secondary)}
          ${renderLotusCorner(28, 1095, 270, primary, secondary)}
        </svg>`;

    case 'marigold-bandhanwar':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="22" y="22" width="750" height="1079" stroke="${primary}" stroke-width="2.4"/>
          <rect x="30" y="30" width="734" height="1063" stroke="${secondary}" stroke-width="1.1"/>
          <!-- Double Garland Bandhanwar -->
          <path d="M30 30 Q91 74 152 30 Q213 74 274 30 Q335 74 397 30 Q459 74 520 30 Q581 74 642 30 Q703 74 764 30" stroke="${primary}" stroke-width="2.2" fill="${secondary}" fill-opacity="0.09"/>
          <path d="M30 38 Q91 88 152 38 Q213 88 274 38 Q335 88 397 38 Q459 88 520 38 Q581 88 642 38 Q703 88 764 38" stroke="${secondary}" stroke-width="1.3" stroke-dasharray="4 3"/>
          <!-- Hanging Marigold Bells -->
          <circle cx="152" cy="54" r="5" fill="${secondary}" stroke="${primary}" stroke-width="1.5"/>
          <circle cx="274" cy="54" r="5" fill="${secondary}" stroke="${primary}" stroke-width="1.5"/>
          <circle cx="397" cy="58" r="6" fill="${primary}" stroke="${secondary}" stroke-width="1.5"/>
          <circle cx="520" cy="54" r="5" fill="${secondary}" stroke="${primary}" stroke-width="1.5"/>
          <circle cx="642" cy="54" r="5" fill="${secondary}" stroke="${primary}" stroke-width="1.5"/>
          ${renderLotusCorner(22, 1101, 270, primary, secondary)}
          ${renderLotusCorner(772, 1101, 180, primary, secondary)}
        </svg>`;

    case 'south-indian-kolam':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="20" y="20" width="754" height="1083" stroke="${primary}" stroke-width="2.8"/>
          <rect x="28" y="28" width="738" height="1067" stroke="${secondary}" stroke-width="1.4"/>
          <rect x="34" y="34" width="726" height="1055" stroke="${primary}" stroke-width="0.9" stroke-dasharray="2 4"/>
          ${renderKolamCorner(28, 28, 0, primary, secondary)}
          ${renderKolamCorner(766, 28, 90, primary, secondary)}
          ${renderKolamCorner(766, 1095, 180, primary, secondary)}
          ${renderKolamCorner(28, 1095, 270, primary, secondary)}
        </svg>`;

    case 'bengali-alpana':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="22" y="22" width="750" height="1079" rx="12" stroke="${primary}" stroke-width="2.4"/>
          <rect x="30" y="30" width="734" height="1063" rx="8" stroke="${secondary}" stroke-width="1.2" stroke-dasharray="8 4"/>
          ${renderAlpanaCorner(26, 26, 0, primary, secondary)}
          ${renderAlpanaCorner(768, 26, 90, primary, secondary)}
          ${renderAlpanaCorner(768, 1097, 180, primary, secondary)}
          ${renderAlpanaCorner(26, 1097, 270, primary, secondary)}
        </svg>`;

    case 'punjabi-phulkari':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="20" y="20" width="754" height="1083" stroke="${primary}" stroke-width="2.6"/>
          <rect x="32" y="32" width="730" height="1059" stroke="${secondary}" stroke-width="1.4"/>
          <!-- Phulkari Geometric Diamond Band Top & Bottom -->
          <path d="M32 32 L52 20 L72 32 L92 20 L112 32 L132 20 L152 32 M642 32 L662 20 L682 32 L702 20 L722 32 L742 20 L762 32" stroke="${secondary}" stroke-width="1.8"/>
          <path d="M32 1091 L52 1103 L72 1091 L92 1103 L112 1091 L132 1103 L152 1091 M642 1091 L662 1103 L682 1091 L702 1103 L722 1091 L742 1103 L762 1091" stroke="${secondary}" stroke-width="1.8"/>
          ${renderEightPointStar(38, 38, primary, secondary)}
          ${renderEightPointStar(756, 38, primary, secondary)}
          ${renderEightPointStar(756, 1085, primary, secondary)}
          ${renderEightPointStar(38, 1085, primary, secondary)}
        </svg>`;

    case 'rajasthani-leheriya':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="22" y="22" width="750" height="1079" stroke="${primary}" stroke-width="2.5"/>
          <rect x="30" y="30" width="734" height="1063" stroke="${secondary}" stroke-width="1.2"/>
          <!-- Chhatri Dome Arch Center -->
          <path d="M290 30 C320 30 355 10 397 10 C439 10 474 30 504 30" stroke="${primary}" stroke-width="2.4" fill="${secondary}" fill-opacity="0.12"/>
          ${renderCornerMandala(22, 22, 0, primary, secondary)}
          ${renderCornerMandala(772, 22, 90, primary, secondary)}
          ${renderCornerFiligree(22, 1101, 270, primary, secondary)}
          ${renderCornerFiligree(772, 1101, 180, primary, secondary)}
        </svg>`;

    case 'islamic-mihrab':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="20" y="20" width="754" height="1083" stroke="${primary}" stroke-width="2.4"/>
          <rect x="28" y="28" width="738" height="1067" stroke="${secondary}" stroke-width="1.2"/>
          <!-- Classic Pointed Mihrab Arch -->
          <path d="M36 1086 V135 C36 74 120 56 290 48 C348 45 382 28 397 14 C412 28 446 45 504 48 C674 56 758 74 758 135 V1086 Z" stroke="${primary}" stroke-width="2" fill="none"/>
          ${renderEightPointStar(56, 56, primary, secondary)}
          ${renderEightPointStar(738, 56, primary, secondary)}
          ${renderEightPointStar(738, 1067, primary, secondary)}
          ${renderEightPointStar(56, 1067, primary, secondary)}
        </svg>`;

    case 'sikh-khanda-arch':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="20" y="20" width="754" height="1083" stroke="${primary}" stroke-width="2.6"/>
          <rect x="29" y="29" width="736" height="1065" stroke="${secondary}" stroke-width="1.3"/>
          <!-- Gurdwara Palki Cusped Dome Arch -->
          <path d="M35 118 C35 72 98 56 235 52 C310 50 365 32 397 12 C429 32 484 50 559 52 C696 56 759 72 759 118" stroke="${primary}" stroke-width="2.5"/>
          ${renderLotusCorner(29, 29, 0, primary, secondary)}
          ${renderLotusCorner(765, 29, 90, primary, secondary)}
          ${renderLotusCorner(765, 1094, 180, primary, secondary)}
          ${renderLotusCorner(29, 1094, 270, primary, secondary)}
        </svg>`;

    case 'christian-cathedral':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="24" y="24" width="746" height="1075" rx="6" stroke="${primary}" stroke-width="2"/>
          <rect x="32" y="32" width="730" height="1059" rx="4" stroke="${secondary}" stroke-width="1"/>
          <!-- Cathedral Lancet Arch Line -->
          <path d="M40 1080 V110 C40 60 180 42 397 20 C614 42 754 60 754 110 V1080" stroke="${secondary}" stroke-width="1.3" opacity="0.75"/>
          ${renderCornerFloral(24, 24, 0, primary, secondary)}
          ${renderCornerFloral(770, 24, 90, primary, secondary)}
          ${renderCornerFloral(770, 1099, 180, primary, secondary)}
          ${renderCornerFloral(24, 1099, 270, primary, secondary)}
        </svg>`;

    case 'jain-torana':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="22" y="22" width="750" height="1079" stroke="${primary}" stroke-width="2.2"/>
          <rect x="32" y="32" width="730" height="1059" stroke="${secondary}" stroke-width="1.2"/>
          <!-- Stepped Temple Torana Crown -->
          <path d="M44 82 H180 L210 46 H350 L397 18 L444 46 H584 L614 82 H750" stroke="${primary}" stroke-width="2" fill="none"/>
          ${renderLotusCorner(22, 22, 0, primary, secondary)}
          ${renderLotusCorner(772, 22, 90, primary, secondary)}
          ${renderLotusCorner(772, 1101, 180, primary, secondary)}
          ${renderLotusCorner(22, 1101, 270, primary, secondary)}
        </svg>`;

    case 'art-deco-geometric':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M46 22 H748 L772 46 V1077 L748 1101 H46 L22 1077 V46 Z" stroke="${primary}" stroke-width="2.4"/>
          <path d="M54 30 H740 L764 54 V1069 L740 1093 H54 L30 1069 V54 Z" stroke="${secondary}" stroke-width="1.2"/>
          <!-- Stepped Deco Corners -->
          <path d="M22 68 H46 V46 H68 V22" stroke="${primary}" stroke-width="1.8"/>
          <path d="M772 68 H748 V46 H726 V22" stroke="${primary}" stroke-width="1.8"/>
          <path d="M772 1055 H748 V1077 H726 V1101" stroke="${primary}" stroke-width="1.8"/>
          <path d="M22 1055 H46 V1077 H68 V1101" stroke="${primary}" stroke-width="1.8"/>
        </svg>`;

    case 'swiss-editorial-grid':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <line x1="28" y1="28" x2="766" y2="28" stroke="${primary}" stroke-width="2.5"/>
          <line x1="28" y1="34" x2="766" y2="34" stroke="${secondary}" stroke-width="0.9"/>
          <line x1="28" y1="1095" x2="766" y2="1095" stroke="${primary}" stroke-width="1.8"/>
          <line x1="28" y1="28" x2="28" y2="1095" stroke="${primary}" stroke-width="0.8" opacity="0.4"/>
          <line x1="766" y1="28" x2="766" y2="1095" stroke="${primary}" stroke-width="0.8" opacity="0.4"/>
        </svg>`;

    case 'kalamkari-peacock-vine':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="20" y="20" width="754" height="1083" stroke="${primary}" stroke-width="2.6"/>
          <rect x="28" y="28" width="738" height="1067" stroke="${secondary}" stroke-width="1.4" stroke-dasharray="6 3"/>
          <path d="M40 38 C160 18, 280 54, 397 26 C514 54, 634 18, 754 38" stroke="${primary}" stroke-width="1.8" fill="none"/>
          <path d="M40 1085 C160 1105, 280 1069, 397 1097 C514 1069, 634 1105, 754 1085" stroke="${primary}" stroke-width="1.8" fill="none"/>
          ${renderPeacockCorner(20, 20, 0, primary, secondary)}
          ${renderPeacockCorner(774, 20, 90, primary, secondary)}
          ${renderPeacockCorner(774, 1103, 180, primary, secondary)}
          ${renderPeacockCorner(20, 1103, 270, primary, secondary)}
        </svg>`;

    case 'madhubani-folk-border':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="18" y="18" width="758" height="1087" stroke="${primary}" stroke-width="2.8"/>
          <rect x="30" y="30" width="734" height="1063" stroke="${primary}" stroke-width="1.8"/>
          <path d="M30 24 L42 18 L54 24 L66 18 L78 24 L90 18 L102 24" stroke="${secondary}" stroke-width="1.6"/>
          <rect x="24" y="24" width="746" height="1075" stroke="${secondary}" stroke-width="4" stroke-dasharray="2 8"/>
          ${renderLotusCorner(24, 24, 0, primary, secondary)}
          ${renderLotusCorner(770, 24, 90, primary, secondary)}
          ${renderLotusCorner(770, 1099, 180, primary, secondary)}
          ${renderLotusCorner(24, 1099, 270, primary, secondary)}
        </svg>`;

    case 'warli-heritage-frieze':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="22" y="22" width="750" height="1079" stroke="${primary}" stroke-width="2.4"/>
          <rect x="34" y="34" width="726" height="1055" stroke="${secondary}" stroke-width="1.4"/>
          <path d="M34 28 L46 22 L58 28 L70 22 L82 28 L94 22 L106 28 L118 22 L130 28 L142 22 L154 28 L166 22 L178 28 L190 22 L202 28 L214 22 L226 28 L238 22 L250 28 L262 22 L274 28 L286 22 L298 28 L310 22 L322 28 L334 22 L346 28 L358 22 L370 28 L382 22 L397 28 L412 22 L424 28 L436 22 L448 28 L460 22 L472 28 L484 22 L496 28 L508 22 L520 28 L532 22 L544 28 L556 22 L568 28 L580 22 L592 28 L604 22 L616 28 L628 22 L640 28 L652 22 L664 28 L676 22 L688 28 L700 22 L712 28 L724 22 L736 28 L748 22 L760 28" stroke="${primary}" stroke-width="1.4" fill="none"/>
          ${renderKolamCorner(22, 22, 0, primary, secondary)}
          ${renderKolamCorner(772, 22, 90, primary, secondary)}
          ${renderKolamCorner(772, 1101, 180, primary, secondary)}
          ${renderKolamCorner(22, 1101, 270, primary, secondary)}
        </svg>`;

    case 'mughal-parchin-kari':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="20" y="20" width="754" height="1083" stroke="${secondary}" stroke-width="2"/>
          <rect x="28" y="28" width="738" height="1067" stroke="${primary}" stroke-width="2.2"/>
          <path d="M40 96 C40 52 104 42 290 40 C348 39 378 26 397 12 C416 26 446 39 504 40 C690 42 754 52 754 96" stroke="${primary}" stroke-width="2"/>
          ${renderCornerFloral(24, 24, 0, primary, secondary)}
          ${renderCornerFloral(770, 24, 90, primary, secondary)}
          ${renderCornerFloral(770, 1099, 180, primary, secondary)}
          ${renderCornerFloral(24, 1099, 270, primary, secondary)}
        </svg>`;

    case 'golden-kalash-toran':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="22" y="22" width="750" height="1079" stroke="${primary}" stroke-width="2.5"/>
          <rect x="30" y="30" width="734" height="1063" stroke="${secondary}" stroke-width="1.3"/>
          <path d="M30 30 Q66 58 103 30 Q140 58 176 30 Q213 58 250 30 Q286 58 323 30 Q360 58 397 30 Q434 58 470 30 Q507 58 544 30 Q580 58 617 30 Q654 58 690 30 Q727 58 764 30" stroke="${primary}" stroke-width="2" fill="${secondary}" fill-opacity="0.1"/>
          <circle cx="397" cy="22" r="8" fill="${secondary}" stroke="${primary}" stroke-width="2"/>
          ${renderCornerMandala(22, 1101, 270, primary, secondary)}
          ${renderCornerMandala(772, 1101, 180, primary, secondary)}
        </svg>`;

    case 'gothic-cathedral-tracery':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="22" y="22" width="750" height="1079" rx="4" stroke="${primary}" stroke-width="2.2"/>
          <rect x="30" y="30" width="734" height="1063" rx="2" stroke="${secondary}" stroke-width="1.1"/>
          <path d="M36 1085 V120 C36 58 210 36 397 16 C584 36 758 58 758 120 V1085" stroke="${primary}" stroke-width="1.6"/>
          <circle cx="397" cy="44" r="12" stroke="${secondary}" stroke-width="1.5" fill="none"/>
          ${renderCornerFiligree(22, 22, 0, primary, secondary)}
          ${renderCornerFiligree(772, 22, 90, primary, secondary)}
          ${renderCornerFiligree(772, 1101, 180, primary, secondary)}
          ${renderCornerFiligree(22, 1101, 270, primary, secondary)}
        </svg>`;

    case 'art-deco-gatsby-chevron':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="20" y="20" width="754" height="1083" stroke="${primary}" stroke-width="2.4"/>
          <rect x="28" y="28" width="738" height="1067" stroke="${secondary}" stroke-width="1.4"/>
          <path d="M20 56 L56 20 M20 76 L76 20 M774 56 L738 20 M774 76 L718 20 M20 1067 L56 1103 M20 1047 L76 1103 M774 1067 L738 1103 M774 1047 L718 1103" stroke="${secondary}" stroke-width="1.8"/>
          <polygon points="397,12 412,28 397,44 382,28" fill="${secondary}" fill-opacity="0.25" stroke="${primary}" stroke-width="1.6"/>
        </svg>`;

    case 'minimal-swiss-crosshair':
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="32" y="32" width="730" height="1059" stroke="${primary}" stroke-width="1.2" opacity="0.5"/>
          <path d="M16 32 H48 M32 16 V48 M746 32 H778 M762 16 V48 M16 1091 H48 M32 1075 V1107 M746 1091 H778 M762 1075 V1107" stroke="${primary}" stroke-width="1.8"/>
        </svg>`;

    case 'minimal-line':
    default:
      return `
        <svg class="sheet-frame-svg" width="794" height="1123" viewBox="0 0 794 1123" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="28" y="28" width="738" height="1067" stroke="${primary}" stroke-width="1.2" opacity="0.35"/>
        </svg>`;
  }
}

export function renderSectionDividerSvg(motif = 'diamond', primary = '#7A1C24', secondary = '#C89B3C') {
  switch (motif) {
    case 'lotus':
      return `<svg class="sec-motif-svg" width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 1C9 5 7 8 11 12C15 8 13 5 11 1Z" fill="${primary}"/>
        <path d="M11 12C6 11 3 8 2 4C6 5 9 8 11 12Z" fill="${secondary}" fill-opacity="0.75"/>
        <path d="M11 12C16 11 19 8 20 4C16 5 13 8 11 12Z" fill="${secondary}" fill-opacity="0.75"/>
      </svg>`;
    case 'star':
      return `<svg class="sec-motif-svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="10" height="10" stroke="${primary}" stroke-width="1.4"/>
        <rect x="3" y="3" width="10" height="10" transform="rotate(45 8 8)" stroke="${secondary}" stroke-width="1.4"/>
      </svg>`;
    case 'paisley':
      return `<svg class="sec-motif-svg" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 11C1 7 4 2 10 2C14 2 16 5 14 9C12 12 7 13 4 11Z" stroke="${primary}" stroke-width="1.5" fill="${secondary}" fill-opacity="0.25"/>
        <circle cx="9" cy="7" r="2" fill="${primary}"/>
      </svg>`;
    case 'flourish':
      return `<svg class="sec-motif-svg" width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 6 Q6 1 12 6 T23 6" stroke="${primary}" stroke-width="1.6" fill="none"/>
        <circle cx="12" cy="6" r="2.2" fill="${secondary}"/>
      </svg>`;
    case 'minimal':
      return `<svg class="sec-motif-svg" width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="3" width="14" height="2" fill="${primary}"/>
      </svg>`;
    case 'diamond':
    default:
      return `<svg class="sec-motif-svg" width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1L14 6L8 11L2 6L8 1Z" fill="${secondary}" fill-opacity="0.3" stroke="${primary}" stroke-width="1.4"/>
      </svg>`;
  }
}

function renderCornerMandala(x, y, rot, primary, secondary) {
  return `
    <g transform="translate(${x}, ${y}) rotate(${rot})">
      <path d="M0 0 H74 C52 14 38 28 26 48 C16 36 12 52 0 74 Z" fill="${primary}" fill-opacity="0.12"/>
      <path d="M0 58 C32 58 58 32 58 0" stroke="${primary}" stroke-width="2.2"/>
      <path d="M0 44 C24 44 44 24 44 0" stroke="${secondary}" stroke-width="1.5" stroke-dasharray="3 2"/>
      <path d="M0 28 C15 28 28 15 28 0" stroke="${primary}" stroke-width="1.8"/>
      <circle cx="14" cy="14" r="4" fill="${primary}"/>
      <circle cx="42" cy="16" r="2.5" fill="${secondary}"/>
      <circle cx="16" cy="42" r="2.5" fill="${secondary}"/>
      <circle cx="34" cy="34" r="3" fill="${primary}"/>
    </g>`;
}

function renderCornerFiligree(x, y, rot, primary, secondary) {
  return `
    <g transform="translate(${x}, ${y}) rotate(${rot})">
      <path d="M6 6 H64 M6 6 V64" stroke="${primary}" stroke-width="3" stroke-linecap="round"/>
      <path d="M14 14 H48 C34 22 22 34 14 48 Z" fill="${secondary}" fill-opacity="0.2" stroke="${secondary}" stroke-width="1.6"/>
      <circle cx="22" cy="22" r="3.5" fill="${primary}"/>
      <path d="M48 6 C48 24 24 48 6 48" stroke="${primary}" stroke-width="1.6"/>
    </g>`;
}

function renderCornerFloral(x, y, rot, primary, secondary) {
  return `
    <g transform="translate(${x}, ${y}) rotate(${rot})">
      <path d="M8 62 C12 30 30 12 62 8" stroke="${secondary}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="24" cy="24" r="10" fill="${primary}" fill-opacity="0.18" stroke="${primary}" stroke-width="2"/>
      <circle cx="24" cy="24" r="4.5" fill="${primary}"/>
      <path d="M36 18 C46 10 56 14 48 24 C42 26 38 22 36 18 Z" fill="${secondary}" fill-opacity="0.3" stroke="${primary}" stroke-width="1.4"/>
      <path d="M18 36 C10 46 14 56 24 48 C26 42 22 38 18 36 Z" fill="${secondary}" fill-opacity="0.3" stroke="${primary}" stroke-width="1.4"/>
    </g>`;
}

function renderPeacockCorner(x, y, rot, primary, secondary) {
  return `
    <g transform="translate(${x}, ${y}) rotate(${rot})">
      <path d="M0 64 C16 32 32 16 64 0" stroke="${primary}" stroke-width="2.2"/>
      <ellipse cx="26" cy="26" rx="14" ry="9" transform="rotate(-45 26 26)" fill="${secondary}" fill-opacity="0.22" stroke="${primary}" stroke-width="1.6"/>
      <circle cx="26" cy="26" r="4.5" fill="${primary}"/>
      <circle cx="26" cy="26" r="2" fill="${secondary}"/>
    </g>`;
}

function renderLotusCorner(x, y, rot, primary, secondary) {
  return `
    <g transform="translate(${x}, ${y}) rotate(${rot})">
      <path d="M4 4 C24 4 38 18 42 42 C18 38 4 24 4 4 Z" fill="${primary}" fill-opacity="0.14" stroke="${primary}" stroke-width="1.8"/>
      <path d="M4 4 C32 12 46 28 52 52" stroke="${secondary}" stroke-width="1.5"/>
      <circle cx="18" cy="18" r="3.5" fill="${secondary}"/>
    </g>`;
}

function renderKolamCorner(x, y, rot, primary, secondary) {
  return `
    <g transform="translate(${x}, ${y}) rotate(${rot})">
      <rect x="6" y="6" width="36" height="36" stroke="${primary}" stroke-width="1.6" fill="none"/>
      <rect x="14" y="14" width="20" height="20" transform="rotate(45 24 24)" stroke="${secondary}" stroke-width="1.5" fill="${primary}" fill-opacity="0.1"/>
      <circle cx="24" cy="24" r="3" fill="${primary}"/>
      <circle cx="12" cy="12" r="2" fill="${secondary}"/>
      <circle cx="36" cy="12" r="2" fill="${secondary}"/>
      <circle cx="12" cy="36" r="2" fill="${secondary}"/>
    </g>`;
}

function renderAlpanaCorner(x, y, rot, primary, secondary) {
  return `
    <g transform="translate(${x}, ${y}) rotate(${rot})">
      <path d="M6 54 C6 24 24 6 54 6" stroke="${primary}" stroke-width="2.2"/>
      <path d="M14 42 C14 24 24 14 42 14" stroke="${secondary}" stroke-width="1.5" stroke-dasharray="3 3"/>
      <circle cx="20" cy="20" r="5" fill="${primary}" fill-opacity="0.2" stroke="${primary}" stroke-width="1.5"/>
    </g>`;
}

function renderEightPointStar(x, y, primary, secondary) {
  return `
    <g transform="translate(${x}, ${y})">
      <rect x="-12" y="-12" width="24" height="24" stroke="${secondary}" stroke-width="1.6" fill="${primary}" fill-opacity="0.12"/>
      <rect x="-12" y="-12" width="24" height="24" transform="rotate(45)" stroke="${primary}" stroke-width="1.6" fill="${secondary}" fill-opacity="0.15"/>
      <circle cx="0" cy="0" r="4" fill="${primary}"/>
    </g>`;
}
