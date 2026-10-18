/**
 * Global SEO & Community Route Registry (biodata.cogify.me)
 * Powers both client-side route hydration and build-time static HTML pre-rendering
 * for Google, Bing, and AI Search crawlers.
 */

export const SITE_ORIGIN = 'https://biodata.cogify.me';

export const SEO_LANDING_ROUTES = [
  {
    slug: 'hindu-marriage-biodata',
    path: '/hindu-marriage-biodata',
    title: 'Free Hindu Marriage Biodata Maker Online — Kundali, Rashi & Gotra Templates | Cogify',
    description:
      'Create traditional Hindu Marriage Biodata online with Shree Ganeshaya Namah header, Horoscope/Kundali fields (Rashi, Nakshatra, Gotra, Manglik), and royal A4 gold borders. Instant PDF, PNG & Word download.',
    h1: 'Hindu Marriage Biodata Maker — Royal Kundali & Shadi Profile Studio',
    preset: 'hindu_bride',
    language: 'en',
    templateCategory: 'traditional'
  },
  {
    slug: 'muslim-nikah-biodata',
    path: '/muslim-nikah-biodata',
    title: 'Free Muslim Nikah Biodata Maker Online — Islamic Marriage Biodata PDF & Word | Cogify',
    description:
      'Design an elegant Muslim Nikah Biodata online with Bismillah calligraphy header, Sect/Maslak, Deen & Namaz practice, and Wali contact details. 100% private A4 PDF, PNG & Editable Word (.docx) export.',
    h1: 'Muslim Nikah Biodata Maker — Islamic Matrimonial Profile Studio',
    preset: 'muslim_nikah',
    language: 'en',
    templateCategory: 'community'
  },
  {
    slug: 'sikh-marriage-biodata',
    path: '/sikh-marriage-biodata',
    title: 'Free Sikh Marriage Biodata Maker Online — Anand Karaj & Punjabi Biodata Format | Cogify',
    description:
      'Create a royal Sikh & Punjabi Marriage Biodata with Ik Onkar header, Gursikh/Amritdhari status, ancestral Pind details, and Gurmukhi/English labels. Free high-DPI PDF, PNG & Word download.',
    h1: 'Sikh Anand Karaj Biodata Maker — Punjabi Matrimonial Studio',
    preset: 'sikh_anand_karaj',
    language: 'en',
    templateCategory: 'community'
  },
  {
    slug: 'christian-marriage-biodata',
    path: '/christian-marriage-biodata',
    title: 'Free Christian Marriage Biodata Maker Online — Church, Parish & Matrimony Format | Cogify',
    description:
      'Build a graceful Christian Marriage Biodata with Holy Cross header, Denomination, Home Parish & Diocese, Baptism/Confirmation, and family background. Free A4 PDF, PNG & Word (.docx) export.',
    h1: 'Christian Marriage Biodata Maker — Graceful Matrimony Profile Studio',
    preset: 'christian_classic',
    language: 'en',
    templateCategory: 'community'
  },
  {
    slug: 'jain-marriage-biodata',
    path: '/jain-marriage-biodata',
    title: 'Free Jain Marriage Biodata Maker Online — Jai Jinendra Shadi Biodata Format | Cogify',
    description:
      'Create a traditional Jain Marriage Biodata with Jai Jinendra header, Digambar/Shwetambar sect, Sampradaya/Gachchh, Gotra, and family details. Instant free A4 PDF, PNG & Word download.',
    h1: 'Jain Marriage Biodata Maker — Jai Jinendra Matrimonial Studio',
    preset: 'jain_format',
    language: 'en',
    templateCategory: 'community'
  },
  {
    slug: 'marathi-marriage-biodata',
    path: '/marathi-marriage-biodata',
    title: 'Marathi Marriage Biodata Maker (लग्नाचा बायोडाटा) — Free PDF & Word Format | Cogify',
    description:
      'Create authentic Marathi Lagnaacha Biodata (मराठी लग्नाचा बायोडाटा) with Shree Ganeshaya Namah, Kuldaivat, Devak, Mamakul, Nadi, Gan & Gotra in Marathi or English. Free PDF, PNG & Word download.',
    h1: 'Marathi Lagnaacha Biodata Maker (मराठी लग्नाचा बायोडाटा स्टुडिओ)',
    preset: 'hindu_bride',
    language: 'mr',
    templateCategory: 'traditional'
  },
  {
    slug: 'gujarati-marriage-biodata',
    path: '/gujarati-marriage-biodata',
    title: 'Gujarati Marriage Biodata Maker (ગુજરાતી લગ્ન બાયોડેટા) — Free PDF & Word | Cogify',
    description:
      'Design a traditional Gujarati Lagna Biodata (ગુજરાતી લગ્ન બાયોડેટા) with Native Place (Vatan), Mosal, Gnati/Sub-Caste, and Horoscope details in Gujarati or English. Free PDF & Word export.',
    h1: 'Gujarati Lagna Biodata Maker (ગુજરાતી લગ્ન બાયોડેટા સ્ટુડિયો)',
    preset: 'hindu_bride',
    language: 'gu',
    templateCategory: 'traditional'
  },
  {
    slug: 'hindi-shadi-biodata',
    path: '/hindi-shadi-biodata',
    title: 'Hindi Shadi Biodata Maker (हिंदी शादी बायोडाटा मेकर) — Free PDF & Word Download | Cogify',
    description:
      'हिंदी में आकर्षक शादी बायोडाटा बनाएं (Hindi Marriage Biodata Maker). श्री गणेशाय नमः, कुंडली, गोत्र, शिक्षा और पारिवारिक विवरण के साथ तुरंत फ्री PDF, PNG और Word डाउनलोड करें।',
    h1: 'Hindi Shadi Biodata Maker (हिंदी शादी बायोडाटा मेकर)',
    preset: 'hindu_bride',
    language: 'hi',
    templateCategory: 'traditional'
  },
  {
    slug: 'tamil-marriage-biodata',
    path: '/tamil-marriage-biodata',
    title: 'Tamil Marriage Biodata Maker (தமிழ் திருமண பயோடேட்டா) — Jathagam & Rasi Format | Cogify',
    description:
      'Create South Indian Tamil Marriage Biodata (திருமண பயோடேட்டா) with Kuladeivam, Gothram, Rasi, Natchathiram (Star) & Padam, and Dosham details in Tamil or English. Free A4 PDF & Word export.',
    h1: 'Tamil Thirumana Biodata Maker (தமிழ் திருமண பயோடேட்டா)',
    preset: 'hindu_bride',
    language: 'ta',
    templateCategory: 'traditional'
  },
  {
    slug: 'telugu-marriage-biodata',
    path: '/telugu-marriage-biodata',
    title: 'Telugu Marriage Biodata Maker (తెలుగు పెళ్లి బయోడేటా) — Free PDF & Word Format | Cogify',
    description:
      'Create authentic Telugu Pellichoopulu Marriage Biodata (తెలుగు పెళ్లి బయోడేటా) with Gothram, Raasi, Nakshatram, Padam, and family details in Telugu or English. Free PDF, PNG & Word download.',
    h1: 'Telugu Marriage Biodata Maker (తెలుగు పెళ్లి బయోడేటా)',
    preset: 'hindu_bride',
    language: 'te',
    templateCategory: 'traditional'
  },
  {
    slug: 'bengali-marriage-biodata',
    path: '/bengali-marriage-biodata',
    title: 'Bengali Marriage Biodata Maker (বাংলা বিয়ের বায়োডাটা) — Free PDF & Word | Cogify',
    description:
      'Create traditional Bengali Biyer Biodata (বাংলা বিয়ের বায়োডাটা) with Shree Shree Prajapataye Namah, Rashi, Gana, Gotra, and family heritage in Bengali or English. Free PDF & Word download.',
    h1: 'Bengali Biyer Biodata Maker (বাংলা বিয়ের বায়োডাটা)',
    preset: 'hindu_bride',
    language: 'bn',
    templateCategory: 'floral'
  },
  {
    slug: 'nri-executive-biodata',
    path: '/nri-executive-biodata',
    title: 'Modern NRI & Executive Marriage Biodata Maker — Global Matrimonial Profile | Cogify',
    description:
      'Design a sleek, contemporary NRI & Executive Marriage Biodata featuring Country/Visa Status, Global Relocation preferences, Ivy/Executive Education, and minimalist editorial A4 layouts.',
    h1: 'Modern Executive & Global NRI Marriage Biodata Studio',
    preset: 'modern_minimal',
    language: 'en',
    templateCategory: 'modern'
  },
  {
    slug: 'biodata-for-marriage-pdf',
    path: '/biodata-for-marriage-pdf',
    title: 'Marriage Biodata PDF Maker — Download High-DPI Print-Ready A4 Shadi Biodata | Cogify',
    description:
      'Generate and download crystal-clear 300-DPI A4 Marriage Biodata PDF files online for free. Choose from 42 royal, floral, and modern templates with zero watermarks and zero signup.',
    h1: 'High-DPI A4 Marriage Biodata PDF Generator (No Watermark)',
    preset: 'hindu_bride',
    language: 'en',
    templateCategory: 'all'
  },
  {
    slug: 'biodata-word-format',
    path: '/biodata-word-format',
    title: 'Marriage Biodata Format in Word (.docx) — Free Editable Shadi Biodata Download | Cogify',
    description:
      'Download editable Microsoft Word (.docx) Marriage Biodata formats with side-by-side portrait photo, themed borders, and structured tables for Personal, Horoscope, Education & Family details.',
    h1: 'Editable Microsoft Word (.docx) Marriage Biodata Format Builder',
    preset: 'hindu_bride',
    language: 'en',
    templateCategory: 'all'
  },
  {
    slug: 'whatsapp-biodata-maker',
    path: '/whatsapp-biodata-maker',
    title: 'WhatsApp Marriage Biodata Maker — Instant Shadi Profile Text & HD Image Share | Cogify',
    description:
      'Create a neatly formatted WhatsApp Marriage Biodata summary with bold headings and high-resolution A4 PNG image card for family matrimonial groups. 100% free and private.',
    h1: 'WhatsApp Marriage Biodata & HD Image Card Generator',
    preset: 'hindu_bride',
    language: 'en',
    templateCategory: 'all'
  }
];

export function getSeoRouteByPathname(pathname) {
  if (!pathname || pathname === '/') return null;
  const cleanPath = String(pathname).replace(/\/+$/, '');
  return SEO_LANDING_ROUTES.find((r) => r.path === cleanPath) || null;
}

/**
 * Hydrates SEO route metadata and optional preset/language selection when a user visits
 * a dedicated landing URL or query parameter (`?lang=hi`, `?preset=muslim_nikah`).
 */
export function applySeoRouteContext({ onSelectPreset, onSelectLanguage, onSelectCategory } = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;

  const route = getSeoRouteByPathname(window.location.pathname);
  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get('lang');
  const queryPreset = params.get('preset');

  if (route) {
    document.title = route.title;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', route.description);

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.setAttribute('href', `${SITE_ORIGIN}${route.path}`);

    const h1El = document.querySelector('.hero-title');
    if (h1El && route.h1) {
      h1El.textContent = route.h1;
    }

    if (route.preset && typeof onSelectPreset === 'function') {
      onSelectPreset(route.preset);
    }
    if (route.language && typeof onSelectLanguage === 'function') {
      onSelectLanguage(route.language);
    }
    if (route.templateCategory && route.templateCategory !== 'all' && typeof onSelectCategory === 'function') {
      onSelectCategory(route.templateCategory);
    }
  }

  if (queryPreset && typeof onSelectPreset === 'function') {
    onSelectPreset(queryPreset);
  }
  if (queryLang && typeof onSelectLanguage === 'function') {
    onSelectLanguage(queryLang);
  }

  return route;
}
