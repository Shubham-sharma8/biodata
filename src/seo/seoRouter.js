/**
 * Global SEO & Community Route Registry (biodata.cogify.me)
 * Powers both client-side route hydration and build-time static HTML pre-rendering (SSR)
 * for Googlebot, Bingbot, and AI Search crawlers.
 */

export const SITE_ORIGIN = 'https://biodata.cogify.me';

export const AUTHOR_PROFILE = {
  name: 'Shubham Sharma',
  role: 'Founder & Lead Product Architect at Cogify.me',
  url: 'https://cogify.me',
  github: 'https://github.com/Shubham-sharma8',
  credentials:
    'Full-Stack Systems Architect specializing in privacy-first client-side document engines, Indic typography, and cultural matrimonial formats across 9 languages.',
  reviewedBy: 'Cogify Cultural & Vedic Matrimonial Advisory Panel',
  datePublished: '2025-01-15',
  dateModified: '2026-10-30'
};

export const SEO_LANDING_ROUTES = [
  {
    slug: 'hindu-marriage-biodata',
    path: '/hindu-marriage-biodata',
    breadcrumbName: 'Hindu Marriage Biodata Format',
    categoryName: 'Community Formats',
    title: 'Hindu Marriage Biodata Format — Kundali & Gotra | COGIFY',
    description:
      'Create traditional Hindu marriage biodata online with Shree Ganeshay Namah header, Kundali, Rashi, Nakshatra, and Gotra fields. Free A4 PDF and Word download.',
    h1: 'Hindu Marriage Biodata Maker — Royal Kundali & Shadi Profile Studio',
    heroSubtitle:
      'Design an auspicious Hindu Vivah Biodata with || Shree Ganeshay Namah || invocation, North/South/East Indian Janam Kundali chart, Gotra & Ashtakoot Gun Milan details, and 242 royal A4 templates.',
    preset: 'hindu_bride',
    language: 'en',
    locale: 'en_IN',
    templateCategory: 'traditional',
    defaultTemplateId: 'royal-sindoor-gold',
    guideTitle: 'Complete Guide to Traditional Hindu Marriage Biodata Format & Kundali Matching',
    guideIntro:
      'A traditional Hindu marriage biodata (Vivah Parichay Patra) balances personal and professional accomplishments with Vedic astrological (Janam Patrika) and family lineage details so both families can verify Gun Milan and Gotra compatibility.',
    mustHaveRows: [
      {
        section: 'Auspicious Header & Emblem',
        fields: '|| Shree Ganeshay Namah ||, || Om Namah Shivaya ||, or Kuldevi invocation with Lord Ganesha / Kalash motif',
        purpose: 'Sets a sacred, respectful tone at the top of the A4 matrimonial sheet'
      },
      {
        section: 'Vedic Horoscope (Janam Kundali)',
        fields: 'Date, Exact Time & Place of Birth, Rashi (Moon Sign), Nakshatra & Charan, Gotra, Manglik / Kuja Dosha, Gan & Nadi',
        purpose: 'Essential for 36-point Ashtakoot Gun Milan and Gotra exogamy verification'
      },
      {
        section: 'Education, Career & Package',
        fields: 'Highest Degree, University, Designation, Organization, Work City, and Optional Annual Income (CTC)',
        purpose: 'Provides clarity on professional stability and preferred work location'
      },
      {
        section: 'Family & Lineage (Khandan)',
        fields: "Father's & Mother's Name/Profession, Siblings, Family Type (Joint/Nuclear), Native Place, and Maternal Uncle (Mama / Nanihal)",
        purpose: 'Highlights family values, ancestral roots, and extended kinship network'
      }
    ],
    faqs: [
      {
        q: 'What astrological details are mandatory in a Hindu marriage biodata?',
        a: 'A complete Hindu marriage biodata should include Date of Birth, exact Time of Birth (with AM/PM), Place of Birth, Rashi (Moon Sign), Nakshatra with Charan/Pada, Gotra, and Manglik status. You can also toggle a live 12-house Vedic Kundali chart directly on the A4 sheet.'
      },
      {
        q: 'Can I add both paternal and maternal Gotra in the Hindu biodata maker?',
        a: 'Yes. Every field label and value is 100% customizable. You can list Self/Paternal Gotra alongside Mama Gotra (Maternal Uncle lineage) and Kuldevi/Kuldevta details.'
      },
      {
        q: 'How do I include a North Indian or South Indian Kundali chart on my biodata?',
        a: 'Open Tab 4 (Studio & Kundali) and check "Show Kundali Chart on Biodata". Choose North Indian Diamond, South Indian Rashi Box, or East Indian Sunburst style and edit the 12 house planetary placements.'
      },
      {
        q: 'Is the Hindu marriage biodata PDF & Word download completely free?',
        a: 'Yes. All 242 templates, Ganesha/Kalash emblems, Kundali charts, and 300-DPI PDF, Editable Word (.docx), and HD PNG exports are 100% free with zero watermarks.'
      }
    ]
  },
  {
    slug: 'muslim-nikah-biodata',
    path: '/muslim-nikah-biodata',
    breadcrumbName: 'Muslim Nikah Biodata Format',
    categoryName: 'Community Formats',
    title: 'Muslim Nikah Biodata Format — Free Islamic PDF | COGIFY',
    description:
      'Design an elegant Muslim Nikah biodata online with Bismillah header, Sect, Maslak, Deen practice, and Wali contact fields. Instant free A4 PDF and Word export.',
    h1: 'Muslim Nikah Biodata Maker — Islamic Matrimonial Profile Studio',
    heroSubtitle:
      'Create a dignified Islamic marriage biodata featuring Bismillah-ir-Rahman-ir-Rahim header, Emerald & Gold Arabesque Mehrab borders, Sect/Maslak & Deen fields, and Wali contact section.',
    preset: 'muslim_nikah',
    language: 'en',
    locale: 'en_IN',
    templateCategory: 'islamic',
    defaultTemplateId: 'emerald-gold-arabesque',
    guideTitle: 'How to Structure an Authentic Muslim Nikah Matrimonial Biodata',
    guideIntro:
      'An Islamic Nikah biodata emphasizes modesty, Deen (religious observance), academic and professional integrity, Biradari/family background, and clear Wali (guardian) contact information without astrological/horoscope sections.',
    mustHaveRows: [
      {
        section: 'Sacred Islamic Opening',
        fields: 'Bismillah-ir-Rahman-ir-Rahim or Assalamu Alaikum header with Crescent / Arabesque emblem',
        purpose: 'Begins the Nikah proposal with traditional Islamic etiquette and grace'
      },
      {
        section: 'Personal & Deen Profile',
        fields: 'Full Name, Age & Height, Sect / Maslak (Sunni Hanafi, Shafii, Ahl-e-Hadith, Shia, etc.), Biradari, Prayer (Salah), Fasting & Hijab/Beard observance',
        purpose: 'Helps families align on religious practice and daily lifestyle values'
      },
      {
        section: 'Qualification & Career',
        fields: 'Academic Degrees, Islamic Education (Hifz/Alim if applicable), Profession, Employer, and City/Country',
        purpose: 'Presents worldly and religious education clearly on a single A4 page'
      },
      {
        section: 'Family & Wali Contact',
        fields: 'Father & Mother Details, Married/Unmarried Brothers & Sisters, Native Hometown, and Wali Phone/WhatsApp & Address',
        purpose: 'Facilitates respectful family-to-family communication through the Wali'
      }
    ],
    faqs: [
      {
        q: 'Does the Muslim Nikah preset automatically hide horoscope and Kundali fields?',
        a: 'Yes. Selecting the Muslim / Nikah preset automatically disables astrological fields and replaces them with Islam-appropriate fields including Religion & Sect (Maslak), Biradari, Religious Practice (Namaz/Roza), and Wali Contact Person.'
      },
      {
        q: 'Can I create a no-photo Muslim marriage biodata for privacy?',
        a: 'Absolutely. Uncheck "Include Photo on Biodata" in Tab 2 or filter by "No-Photo Formats" in the gallery to generate a clean, text-only Islamic matrimonial profile.'
      },
      {
        q: 'Are Urdu script labels supported for Nikah biodata?',
        a: 'Yes. You can switch the Label Language dropdown to Urdu (اردو) or English at any time without losing your typed details.'
      },
      {
        q: 'Can I share the Nikah biodata directly on family WhatsApp groups?',
        a: 'Yes. Click the WhatsApp button to share a formatted matrimonial text summary or download the 300-DPI PDF and HD PNG card for instant sharing.'
      }
    ]
  },
  {
    slug: 'sikh-marriage-biodata',
    path: '/sikh-marriage-biodata',
    breadcrumbName: 'Sikh Anand Karaj Biodata Format',
    categoryName: 'Community Formats',
    title: 'Sikh Marriage Biodata Format — Anand Karaj PDF | COGIFY',
    description:
      'Create a royal Sikh and Punjabi marriage biodata online with Ik Onkar header, Gursikh status, ancestral Pind, and family details. Free PDF and Word download.',
    h1: 'Sikh Anand Karaj Biodata Maker — Punjabi Matrimonial Studio',
    heroSubtitle:
      'Craft a royal Sikh & Punjabi marriage biodata with Ik Onkar (ੴ) Satnam Waheguru header, Royal Navy & Gold Phulkari/Darbar frames, Gursikh lifestyle details, and ancestral Pind heritage.',
    preset: 'sikh_anand_karaj',
    language: 'en',
    locale: 'en_IN',
    templateCategory: 'interfaith',
    defaultTemplateId: 'anand-karaj-royal-blue',
    guideTitle: 'Essential Elements of a Sikh (Anand Karaj) & Punjabi Marriage Biodata',
    guideIntro:
      'Punjabi and Sikh matrimonial profiles celebrate Gurmat values, family warmth, educational excellence, global diaspora connections (Canada, UK, USA, Australia), and ancestral village (Pind) roots.',
    mustHaveRows: [
      {
        section: 'Sacred Gurmukhi Invocation',
        fields: '|| Ik Onkar Satnam Waheguru || (ੴ) emblem and ceremonial header',
        purpose: 'Honors Sikh tradition at the crest of the matrimonial profile'
      },
      {
        section: 'Personal & Gursikh Lifestyle',
        fields: 'Full Name (Kaur/Singh), DOB & Age, Height, Community/Gotra (Jat Sikh, Khatri, Arora, Ramgarhia, etc.), Turban/Kesh/Amritdhari status, Diet',
        purpose: 'Communicates personal identity and Gurmat lifestyle clearly'
      },
      {
        section: 'Education, Career & Abroad Status',
        fields: 'Qualifications, Designation, Company, City/Country, and PR/Work Visa status (if settled abroad)',
        purpose: 'Crucial for both domestic Punjabi families and NRI Sikh alliances'
      },
      {
        section: 'Family & Ancestral Pind',
        fields: "Father's & Mother's Details, Siblings, Current Residence, Nanke (Maternal family), and Ancestral Pind / District in Punjab",
        purpose: 'Connects families through shared regional heritage and kinship'
      }
    ],
    faqs: [
      {
        q: 'Does the Sikh marriage biodata format include Ik Onkar (ੴ) and Khanda emblems?',
        a: 'Yes. The Sikh / Anand Karaj preset pre-selects the sacred Ik Onkar emblem and "|| Ik Onkar Satnam Waheguru ||" heading with Royal Blue & Gold borders.'
      },
      {
        q: 'Can I add ancestral Pind, Nanke surname, and PR/Visa status fields?',
        a: 'Yes. You can add custom fields or rename any row to highlight your ancestral Pind (e.g., Ludhiana, Jalandhar, Amritsar), Maternal family (Nanke), and overseas residency status.'
      },
      {
        q: 'Is Horoscope hidden by default in the Sikh Anand Karaj preset?',
        a: 'Yes, the astrological section is hidden by default in accordance with Gurmat practice, though families who wish to include Time/Place of Birth can toggle it on with one click.'
      },
      {
        q: 'Can I download both PDF and editable Word (.docx) formats for free?',
        a: 'Yes, both print-ready A4 PDF and editable Microsoft Word (.docx) downloads are 100% free with no signup or watermark.'
      }
    ]
  },
  {
    slug: 'christian-marriage-biodata',
    path: '/christian-marriage-biodata',
    breadcrumbName: 'Christian Marriage Biodata Format',
    categoryName: 'Community Formats',
    title: 'Christian Marriage Biodata Format — Free PDF | COGIFY',
    description:
      'Build a graceful Christian marriage biodata online with Holy Cross header, Denomination, Home Parish, Diocese, and family details. Free PDF and Word export.',
    h1: 'Christian Marriage Biodata Maker — Graceful Matrimony Profile Studio',
    heroSubtitle:
      'Design a warm, graceful Christian matrimonial biodata featuring the Holy Cross emblem, Denomination & Home Parish details, faith values, and ivory/floral A4 borders.',
    preset: 'christian_classic',
    language: 'en',
    locale: 'en_IN',
    templateCategory: 'interfaith',
    defaultTemplateId: 'christian-ivory-gold',
    guideTitle: 'How to Write a Christian Matrimonial Biodata (Parish, Denomination & Family)',
    guideIntro:
      'Whether for Syrian Christian (Marthoma, Jacobite, Orthodox, Syro-Malabar), Roman Catholic, CSI, CNI, or Born-Again/Evangelical families, a Christian marriage biodata highlights faith life, Church/Parish membership, education, and family heritage.',
    mustHaveRows: [
      {
        section: 'Christian Header & Scripture Motto',
        fields: 'Holy Cross emblem with "Praise the Lord", "God is Love", or a favorite biblical verse',
        purpose: 'Establishes a faith-centered introduction for the matrimonial profile'
      },
      {
        section: 'Denomination & Parish Details',
        fields: 'Denomination / Rite, Home Parish & Diocese, Present Attending Church, Baptism & Confirmation status, Ministry involvement',
        purpose: 'Essential for Church marriage banns and denominational compatibility'
      },
      {
        section: 'Academic & Professional Profile',
        fields: 'Degrees, University/College, Current Role, Employer, Work Location (India / Abroad)',
        purpose: 'Presents career progression and relocation openness'
      },
      {
        section: 'Family & Ancestral House Name',
        fields: 'Parents & Siblings Details, Family House Name (Tharavadu / Kudumbam), Native Place, and Contact Details',
        purpose: 'Particularly valued in Kerala, Mangalorean, Goan, and Tamil Christian matrimony'
      }
    ],
    faqs: [
      {
        q: 'What church details should be included in a Christian marriage biodata?',
        a: 'Include your Christian Denomination (e.g., Roman Catholic, Syro-Malabar, Marthoma, CSI, Orthodox, Protestant), Home Parish name, Diocese, and native family house name if applicable.'
      },
      {
        q: 'Can I customize the header text with a Bible verse?',
        a: 'Yes! In Tab 2 (Header & Photo), you can type any scripture verse or motto such as " Praise the Lord " or "Ecclesiastes 3:11 — He has made everything beautiful in its time."'
      },
      {
        q: 'Are floral and pastel A4 templates available for Christian matrimony?',
        a: 'Yes. Choose from Ivory & Gold, Pastel Rose Botanical, White Lily, and Editorial Minimalist templates with zero watermarks.'
      },
      {
        q: 'Can I edit the downloaded Christian biodata in Microsoft Word later?',
        a: 'Yes. Clicking "Word (.docx)" downloads a genuine editable Microsoft Word file with structured tables and your portrait photo.'
      }
    ]
  },
  {
    slug: 'jain-marriage-biodata',
    path: '/jain-marriage-biodata',
    breadcrumbName: 'Jain Marriage Biodata Format',
    categoryName: 'Community Formats',
    title: 'Jain Marriage Biodata Format — Jai Jinendra PDF | COGIFY',
    description:
      'Create a traditional Jain marriage biodata online with Jai Jinendra header, Shwetambar or Digambar sect, Gotra, and Mosal details. Free PDF and Word export.',
    h1: 'Jain Marriage Biodata Maker — Jai Jinendra Matrimonial Studio',
    heroSubtitle:
      'Create a serene, auspicious Jain marriage biodata with || Jai Jinendra || invocation, Ahimsa/Jain emblem, Shwetambar/Digambar Sampradaya & Gotra fields, and saffron-ivory A4 frames.',
    preset: 'jain_format',
    language: 'en',
    locale: 'en_IN',
    templateCategory: 'interfaith',
    defaultTemplateId: 'jain-saffron-ivory',
    guideTitle: 'Traditional Jain Marriage Biodata Format (Shwetambar & Digambar Guidelines)',
    guideIntro:
      'Jain matrimonial biodatas place special importance on Sect (Shwetambar Murtipujak, Sthanakvasi, Terapanthi, or Digambar Bispanthi/Terapanthi), Gachchh, Gotra, dietary observance (Jain Vegetarian / Chauvihar), and business or professional background.',
    mustHaveRows: [
      {
        section: 'Auspicious Jain Invocation',
        fields: '|| Jai Jinendra || or || Namo Arihantanam || header with Jain Prateek / Swastika emblem',
        purpose: 'Reflects Jain sanskar and auspicious beginnings'
      },
      {
        section: 'Sect, Sampradaya & Gotra',
        fields: 'Jain Sect (Shwetambar / Digambar), Sub-Sect (Oswal, Porwal, Khandelwal, Agarwal, Saitwal, Humad), Gotra, and Dietary Habits',
        purpose: 'Provides key community, lineage, and Ahimsa dietary compatibility details'
      },
      {
        section: 'Janam Kundali & Birth Details',
        fields: 'Date, Time & Place of Birth, Rashi, Nakshatra, and Manglik status',
        purpose: 'Used by families who match horoscopes prior to alliance discussions'
      },
      {
        section: 'Family, Business & Nanihal (Mosal)',
        fields: "Father's Business/Profession, Mother's Name, Brothers & Sisters, Native Vatan, and Maternal Family (Nanihal / Mosal)",
        purpose: 'Essential for traditional Marwari, Gujarati, and North/South Indian Jain families'
      }
    ],
    faqs: [
      {
        q: 'Does the Jain biodata format include Jai Jinendra and Jain emblems?',
        a: 'Yes. Selecting the Jain Format preset automatically sets the Jain emblem, "|| Jai Jinendra ||" invocation, and Saffron & Ivory ceremonial theme.'
      },
      {
        q: 'Can I specify Shwetambar/Digambar sect, Gotra, and Jain dietary preferences?',
        a: 'Yes. The Jain preset pre-populates Religion, Sect/Sub-Caste (e.g., Shwetambar Murtipujak Oswal / Digambar Khandelwal), Gotra, and Jain Vegetarian dietary fields.'
      },
      {
        q: 'Can I add Nanihal / Mosal (maternal family) details to a Jain biodata?',
        a: 'Yes. Maternal Uncle (Mama / Mosal) and Native Place (Vatan) fields are built right into the Family Details section.'
      },
      {
        q: 'Is there any charge or watermark when downloading the Jain biodata PDF?',
        a: 'No. Every download—PDF, Word (.docx), and HD PNG—is 100% free with zero watermarks.'
      }
    ]
  },
  {
    slug: 'marathi-marriage-biodata',
    path: '/marathi-marriage-biodata',
    breadcrumbName: 'Marathi Marriage Biodata (लग्नाचा बायोडाटा)',
    categoryName: 'Regional Languages',
    title: 'Marathi Marriage Biodata Format (लग्नाचा बायोडाटा) | COGIFY',
    description:
      'Create authentic Marathi Lagnaacha Biodata (मराठी लग्नाचा बायोडाटा) online with Kuldaivat, Devak, Mamakul, Nadi, Gan, and Gotra. Free A4 PDF and Word download.',
    h1: 'Marathi Lagnaacha Biodata Maker (मराठी लग्नाचा बायोडाटा स्टुडिओ)',
    heroSubtitle:
      'आकर्षक मराठी लग्नाचा बायोडाटा (Marathi Marriage Biodata) २ मिनिटांत बनवा — श्री गणेशाय नमः, कुलदैवत, देवक, मामाचे कुल (मामाकुल), रास, नक्षत्र, नाडी, गण आणि पैठणी बॉर्डरसह मोफत PDF व Word डाउनलोड.',
    preset: 'hindu_bride',
    language: 'en',
    locale: 'en_IN',
    templateCategory: 'regional',
    defaultTemplateId: 'royal-sindoor-gold',
    guideTitle: 'मराठी लग्नाचा बायोडाटा (Marathi Marriage Biodata Format) — संपूर्ण मार्गदर्शक',
    guideIntro:
      'महाराष्ट्रीयन विवाह परंपरेत लग्नाचा बायोडाटा (परिचय पत्र) अत्यंत महत्त्वाचा मानला जातो. यामध्ये वैयक्तिक व शैक्षणिक माहितीसोबतच कुलदैवत, देवक, गोत्र, नाडी, गण आणि मामाकुल (आजोळ) या बाबींचा स्पष्ट उल्लेख असणे आवश्यक असते.',
    mustHaveRows: [
      {
        section: 'मंगल शीर्षक (Sacred Header)',
        fields: '|| श्री गणेशाय नमः || किंवा कुलदेवतेचे नाव आणि गणपती बाप्पाचे चिन्ह',
        purpose: 'शुभ कार्याची पारंपारिक महाराष्ट्रीयन सुरुवात'
      },
      {
        section: 'पत्रिका व कुलदैवत माहिती (Horoscope & Kuldaivat)',
        fields: 'जन्म तारीख, जन्म वेळ, जन्म ठिकाण, रास, नक्षत्र, चरण, गण, नाडी, गोत्र, कुलदैवत आणि देवक',
        purpose: '३६ गुण मिलन, नाडी दोष तपासणी आणि देवक/गोत्र जुळवणीसाठी आवश्यक'
      },
      {
        section: 'शिक्षण व नोकरी/व्यवसाय (Education & Career)',
        fields: 'उच्च शिक्षण, पद, कंपनीचे नाव, कामाचे शहर (पुणे, मुंबई, बेंगळुरू, परदेश) आणि वार्षिक उत्पन्न',
        purpose: 'उमेदवाराची शैक्षणिक व व्यावसायिक प्रगती दर्शवण्यासाठी'
      },
      {
        section: 'कौटुंबिक व मामाकुल माहिती (Family & Mamakul)',
        fields: 'वडील व आईचे नाव/व्यवसाय, भाऊ-बहीण, मूळ गाव, मामाचे नाव/आजोळ (मामाकुल) आणि नातेवाईकांची आडनावे',
        purpose: 'पाहुणे-मंडळी व नातेसंबंधांची संपूर्ण ओळख देण्यासाठी'
      }
    ],
    faqs: [
      {
        q: 'मराठी लग्नाच्या बायोडाटामध्ये कुलदैवत, देवक आणि मामाकुल कसे जोडावे?',
        a: 'आमच्या स्टुडिओमध्ये "कुलदैवत / कुलदेवी", "मामा (Maternal Uncle)" आणि "नातेवाईक" हे रकाने आधीच दिलेले आहेत. तुम्ही एका क्लिकमध्ये देवक व आजोळची माहिती जोडू शकता.'
      },
      {
        q: 'काय मी एका क्लिकवर इंग्रजी बायोडाटा मराठीत (Marathi) बदलू शकतो?',
        a: 'होय! "Label Language" मधून "Marathi (मराठी)" निवडल्यास सर्व शीर्षके (जसे की वैयक्तिक माहिती, कौटुंबिक माहिती, संपर्क) आपोआप मराठीत बदलतात.'
      },
      {
        q: 'मराठी बायोडाटासाठी पैठणी आणि पेशवाई डिझाईन टेम्पलेट्स उपलब्ध आहेत का?',
        a: 'होय. २४२ टेम्पलेट्समध्ये पैठणी गोल्ड, सिंदूर मरून, मंदिर कमान (Temple Arch) आणि पारंपारिक महाराष्ट्रीयन बॉर्डर्स मोफत उपलब्ध आहेत.'
      },
      {
        q: 'डाउनलोड केलेल्या PDF किंवा Word फाईलवर कोणताही वॉटरमार्क येतो का?',
        a: 'अजिबात नाही. biodata.cogify.me वरून डाउनलोड केलेली PDF, Word (.docx) आणि HD PNG १००% मोफत आणि वॉटरमार्कशिवाय मिळते.'
      }
    ]
  },
  {
    slug: 'gujarati-marriage-biodata',
    path: '/gujarati-marriage-biodata',
    breadcrumbName: 'Gujarati Marriage Biodata (ગુજરાતી લગ્ન બાયોડેટા)',
    categoryName: 'Regional Languages',
    title: 'Gujarati Marriage Biodata Maker (લગ્ન બાયોડેટા) | COGIFY',
    description:
      'Design traditional Gujarati Lagna Biodata (ગુજરાતી લગ્ન બાયોડેટા) online with Native Vatan, Mosal, Gnati, Gotra, and Janmakshar. Free A4 PDF and Word download.',
    h1: 'Gujarati Lagna Biodata Maker (ગુજરાતી લગ્ન બાયોડેટા સ્ટુડિયો)',
    heroSubtitle:
      'પરંપરાગત ગુજરાતી લગ્ન બાયોડેટા (Gujarati Marriage Biodata) બનાવો — શ્રી ગણેશાય નમઃ, મૂળ વતન (Native Vatan), મોસાળ (Mosal), જ્ઞાતિ, ગોત્ર અને જન્માક્ષર સાથે મફત PDF અને Word ડાઉનલોડ.',
    preset: 'hindu_bride',
    language: 'en',
    locale: 'en_IN',
    templateCategory: 'regional',
    defaultTemplateId: 'chandan-kesar-gold',
    guideTitle: 'ગુજરાતી લગ્ન બાયોડેટા ફોર્મેટ (Gujarati Lagna Biodata Guide — Vatan, Mosal & Gnati)',
    guideIntro:
      'ગુજરાતી પરિવારોમાં લગ્ન માટેનો બાયોડેટા (Lagna Biodata) તૈયાર કરતી વખતે ઉમેદવારની જ્ઞાતિ/પેટા-જ્ઞાતિ (Gnati/Gol), મૂળ વતન (Native Village), મોસાળ પક્ષ (Maternal Family) અને કુળદેવીની વિગતો ખૂબ જ મહત્વની ગણાય છે.',
    mustHaveRows: [
      {
        section: 'માંગલિક શરૂઆત (Auspicious Header)',
        fields: '|| શ્રી ગણેશાય નમઃ ||, || જય શ્રી કૃષ્ણ || અથવા કુળદેવી માતાજીનું નામ',
        purpose: 'ગુજરાતી સંસ્કૃતિ મુજબ શુભ પ્રારંભ'
      },
      {
        section: 'વ્યક્તિગત અને જ્ઞાતિ વિગત (Personal & Gnati)',
        fields: 'પૂરું નામ, જન્મ તારીખ (આપોઆપ ઉંમર ગણતરી), ઊંચાઈ, વજન, જ્ઞાતિ / પેટા-જ્ઞાતિ (Patel, Lohana, Jain, Brahmin, Vaishnav, વગેરે) અને ખોરાક (Pure Veg / Swaminarayan / Jain)',
        purpose: 'સમાજ અને જીવનશૈલીની સ્પષ્ટતા માટે'
      },
      {
        section: 'જન્માક્ષર વિગત (Horoscope Details)',
        fields: 'જન્મ સમય, જન્મ સ્થળ, રાશિ, નક્ષત્ર, ગોત્ર અને મંગળ (Manglik) વિગત',
        purpose: 'કુંડળી મેળાપક માટે જરૂરી માહિતી'
      },
      {
        section: 'કૌટુંબિક, મૂળ વતન અને મોસાળ (Vatan & Mosal)',
        fields: 'પિતા અને માતાનું નામ/વ્યવસાય, ભાઈ-બહેન, મૂળ વતન (ગામ/તાલુકો) અને મોસાળ (મામાનું નામ અને ગામ)',
        purpose: 'ગુજરાતી સમાજમાં કૌટુંબિક ઓળખ માટે સૌથી અગત્યનો વિભાગ'
      }
    ],
    faqs: [
      {
        q: 'ગુજરાતી લગ્ન બાયોડેટામાં મૂળ વતન (Vatan) અને મોસાળ (Mosal) કેવી રીતે ઉમેરવું?',
        a: 'કૌટુંબિક વિગત (Family Details) વિભાગમાં "મૂળ વતન" અને "મામા (મોસાળ)" ના ખાના તૈયાર આપેલા છે, જેમાં તમે ગામ અને મામાના પરિવારની વિગત લખી શકો છો.'
      },
      {
        q: 'શું હું ગુજરાતી ભાષામાં (ગુજરાતી લિપિ) બાયોડેટા ડાઉનલોડ કરી શકું?',
        a: 'હા! ભાષા મેનુમાંથી "Gujarati (ગુજરાતી)" પસંદ કરવાથી બધા જ લેબલ ગુજરાતીમાં થઈ જશે અને તમે ગુજરાતી કે અંગ્રેજીમાં વિગતો છાપી શકશો.'
      },
      {
        q: 'શું NRI ગુજરાતી (USA, UK, Canada, Australia) માટે ખાસ ટેમ્પ્લેટ છે?',
        a: 'હા, વિદેશમાં વસતા ગુજરાતી પરિવારો માટે Visa Status, Citizenship અને આધુનિક એક્ઝિક્યુટિવ A4 ડિઝાઇન્સ ઉપલબ્ધ છે.'
      },
      {
        q: 'શું આ ગુજરાતી બાયોડેટા મેકર સંપૂર્ણ ફ્રી છે?',
        a: 'હા, ૧૦૦% ફ્રી. કોઈ પણ ચાર્જ કે વોટરમાર્ક વગર તમે PDF, Word (.docx) અને HD ઈમેજ ડાઉનલોડ કરી શકો છો.'
      }
    ]
  },
  {
    slug: 'hindi-shadi-biodata',
    path: '/hindi-shadi-biodata',
    breadcrumbName: 'Hindi Shadi Biodata (हिंदी शादी बायोडाटा)',
    categoryName: 'Regional Languages',
    title: 'Hindi Shadi Biodata Maker (हिंदी शादी बायोडाटा) | COGIFY',
    description:
      'Create traditional Hindi Shadi Biodata (हिंदी शादी बायोडाटा) online with Shree Ganeshay Namah, Janam Kundali, Gotra, and family details. Free PDF and Word.',
    h1: 'Hindi Shadi Biodata Maker (हिंदी शादी बायोडाटा मेकर)',
    heroSubtitle:
      'देवनागरी हिंदी में सुंदर विवाह बायोडाटा (विवाह परिचय पत्र) बनाएं — ॥ श्री गणेशाय नमः ॥, जन्म कुंडली चार्ट, गोत्र, शिक्षा और पारिवारिक विवरण के साथ 100% मुफ्त PDF व Word डाउनलोड।',
    preset: 'hindu_bride',
    language: 'en',
    locale: 'en_IN',
    templateCategory: 'traditional',
    defaultTemplateId: 'marigold-toran',
    guideTitle: 'हिंदी शादी बायोडाटा फॉर्मेट (Hindi Vivah Biodata Format) — सम्पूर्ण मार्गदर्शिका',
    guideIntro:
      'उत्तर और मध्य भारत (उत्तर प्रदेश, मध्य प्रदेश, राजस्थान, बिहार, दिल्ली, हरियाणा, उत्तराखंड और हिमाचल) में हिंदी विवाह बायोडाटा (विवाह परिचय पत्र) में स्पष्ट देवनागरी अक्षरों, गोत्र, जन्म कुंडली और पारिवारिक पृष्ठभूमि का विशेष महत्व होता है।',
    mustHaveRows: [
      {
        section: 'मंगल उद्घोष (Sacred Heading)',
        fields: '॥ श्री गणेशाय नमः ॥, ॥ ॐ नमः शिवाय ॥ या कुलदेवी/कुलदेवता का स्मरण',
        purpose: 'विवाह परिचय पत्र का शुभ एवं पारंपरिक प्रारंभ'
      },
      {
        section: 'व्यक्तिगत एवं कुंडली विवरण',
        fields: 'पूरा नाम, जन्म तिथि (आयु स्वतः गणना), लंबाई, रंग-रूप, जन्म समय, जन्म स्थान, राशि, नक्षत्र, गोत्र और मांगलिक स्थिति',
        purpose: 'वर-वधू की कुंडली मिलान और गोत्र मिलान के लिए'
      },
      {
        section: 'शिक्षा एवं व्यवसाय विवरण',
        fields: 'शैक्षणिक योग्यता, कॉलेज/विश्वविद्यालय, पद, संस्थान/कंपनी का नाम और वार्षिक आय',
        purpose: 'करियर और कार्यक्षेत्र की स्पष्ट जानकारी हेतु'
      },
      {
        section: 'पारिवारिक एवं ननिहाल विवरण',
        fields: 'पिता एवं माता का नाम व व्यवसाय, भाई-बहन का विवरण, मूल निवास (पैतृक गांव/शहर), मामाजी (ननिहाल) और संपर्क सूत्र',
        purpose: 'दोनों परिवारों के बीच विश्वास और पारिवारिक परिचय स्थापित करने हेतु'
      }
    ],
    faqs: [
      {
        q: 'हिंदी में शादी का बायोडाटा कैसे बनाएं?',
        a: 'पेज के ऊपर भाषा विकल्प में "Hindi (हिन्दी)" पहले से चयनित है। आप अपनी जानकारी हिंदी या अंग्रेजी में टाइप करें और तुरंत दाईं ओर लाइव A4 प्रीव्यू देखकर PDF या Word डाउनलोड करें।'
      },
      {
        q: 'क्या जन्म तिथि चुनने पर आयु (Age) अपने आप निकल आती है?',
        a: 'हाँ! जैसे ही आप जन्म का दिन, महीना और वर्ष चुनते हैं, आपकी सटीक आयु (केवल वर्षों में, जैसे 28 Years) स्वतः गणना होकर बायोडाटा में जुड़ जाती है।'
      },
      {
        q: 'क्या मैं बायोडाटा में लग्न कुंडली चार्ट भी जोड़ सकता हूँ?',
        a: 'जी हाँ। टैब 4 (Studio & Kundali) में जाकर आप उत्तर भारतीय डायमंड कुंडली चार्ट को बायोडाटा पर एक क्लिक में दिखा सकते हैं।'
      },
      {
        q: 'क्या हिंदी बायोडाटा डाउनलोड करने का कोई शुल्क है?',
        a: 'बिल्कुल नहीं। biodata.cogify.me पर सभी 242 टेम्पलेट्स और PDF, Word (.docx) व HD PNG डाउनलोड 100% निःशुल्क और बिना वॉटरमार्क के हैं।'
      }
    ]
  },
  {
    slug: 'tamil-marriage-biodata',
    path: '/tamil-marriage-biodata',
    breadcrumbName: 'Tamil Marriage Biodata (தமிழ் திருமண பயோடேட்டா)',
    categoryName: 'Regional Languages',
    title: 'Tamil Marriage Biodata Format — Jathagam & Rasi | COGIFY',
    description:
      'Create South Indian Tamil Thirumana Biodata online with Kuladeivam, Gothram, Rasi, Natchathiram, Padam, and South Indian Rasi chart. Free PDF and Word export.',
    h1: 'Tamil Thirumana Biodata Maker (தமிழ் திருமண பயோடேட்டா)',
    heroSubtitle:
      'Create an authentic South Indian Tamil Thirumana Biodata (ஜாதக குறிப்பு & திருமண தகவல்) featuring Pillaiyar Suzhi (உ), Kuladeivam, Gothram, Rasi, Natchathiram, Padam, and South Indian Rasi/Navamsam chart.',
    preset: 'hindu_bride',
    language: 'en',
    locale: 'en_IN',
    templateCategory: 'regional',
    defaultTemplateId: 'chandan-kesar-gold',
    guideTitle: 'South Indian Tamil Marriage Biodata & Jathagam Format Guide (திருமண பயோடேட்டா)',
    guideIntro:
      'In Tamil Nadu and global Tamil communities, a Thirumana Biodata combines personal and career credentials with essential Jathagam (horoscope) attributes—specifically Kuladeivam, Gothram, Rasi, Natchathiram (Birth Star) with Padam, Lagnam, and Chevvai/Rahu-Kethu Dosham.',
    mustHaveRows: [
      {
        section: 'Auspicious Tamil Invocation',
        fields: 'Pillaiyar Suzhi (உ) / ஸ்ரீ கணேசாய நமஹ / குலதெய்வம் துணை (Kuladeivam Thunai)',
        purpose: 'Traditional South Indian auspicious header'
      },
      {
        section: 'Jathagam / Astrological Profile',
        fields: 'Date & Exact Time of Birth, Place of Birth, Rasi (ராசி), Natchathiram (நட்சத்திரம்) & Padam, Gothram (கோத்திரம்), Kuladeivam (குலதெய்வம்), and Dosham status',
        purpose: 'Essential for 10 Porutham (Dasa Porutham) matching in Tamil matrimony'
      },
      {
        section: 'South Indian Rasi Chart Box',
        fields: '12-Box South Indian Rasi / Lagna Chart (selectable in Studio & Kundali tab)',
        purpose: 'Allows astrologers and families to inspect planetary houses directly on the biodata'
      },
      {
        section: 'Education, Career & Family',
        fields: 'Qualification, IT/Core/Medical/Business Role, Work Location, Parents, Siblings, and Native District (e.g., Chennai, Madurai, Coimbatore, Thanjavur)',
        purpose: 'Gives a complete picture of family heritage and professional standing'
      }
    ],
    faqs: [
      {
        q: 'Does this tool support South Indian Rasi Box charts for Tamil biodata?',
        a: 'Yes! In Tab 4 (Studio & Kundali), select "South Indian Rashi Box Grid" from the Kundali Chart Tradition dropdown to embed a traditional South Indian square Rasi chart on your biodata.'
      },
      {
        q: 'Can I include Kuladeivam, Natchathiram with Padam, and Chevvai Dosham?',
        a: 'Yes. The Horoscope section includes Rasi, Natchathiram, Charan/Padam, Gothram, Kuladeivam, and Dosham/Manglik fields in both Tamil (தமிழ்) and English.'
      },
      {
        q: 'Can I switch between Tamil script and English labels easily?',
        a: 'Yes. Use the Label Language selector to toggle between Tamil (தமிழ்) and English at any time without losing your typed answers.'
      },
      {
        q: 'Are Kanjeevaram Gold & Temple border templates included for free?',
        a: 'Yes, all 242 templates including Temple Arch, Lotus Mandala, and Kanjeevaram Gold designs are 100% free to download in PDF, Word (.docx), and PNG.'
      }
    ]
  },
  {
    slug: 'telugu-marriage-biodata',
    path: '/telugu-marriage-biodata',
    breadcrumbName: 'Telugu Marriage Biodata (తెలుగు పెళ్లి బయోడేటా)',
    categoryName: 'Regional Languages',
    title: 'Telugu Marriage Biodata Maker (పెళ్లి బయోడేటా) | COGIFY',
    description:
      'Create authentic Telugu Pellichoopulu marriage biodata online with Inti Peru, Gothram, Raasi, Nakshatram, Padam, and Jathakam chart. Free PDF and Word export.',
    h1: 'Telugu Marriage Biodata Maker (తెలుగు పెళ్లి బయోడేటా)',
    heroSubtitle:
      'Design a traditional Telugu Pellichoopulu Marriage Biodata (వివాహ బయోడేటా) with Sri Ganeshaya Namaha, Inti Peru (Surname), Gothram, Raasi, Nakshatram & Padam, and South Indian Jathakam chart.',
    preset: 'hindu_bride',
    language: 'en',
    locale: 'en_IN',
    templateCategory: 'regional',
    defaultTemplateId: 'royal-sindoor-gold',
    guideTitle: 'Telugu Marriage Biodata Format (పెళ్లి బయోడేటా) — Inti Peru, Gothram & Jathakam Guide',
    guideIntro:
      'For Telugu families across Andhra Pradesh, Telangana, and the global NRI community, a well-crafted Pellichoopulu biodata clearly presents Inti Peru (Family Surname), Gothram, Raasi, Nakshatram with Padam, academic/software/medical career details, and family roots.',
    mustHaveRows: [
      {
        section: 'Auspicious Opening',
        fields: '|| శ్రీ గణేశాయ నమః || or Sri Venkateswara Prasanna with sacred Ganesha/Kalash emblem',
        purpose: 'Traditional auspicious invocation for Telugu marriage proposals'
      },
      {
        section: 'Personal & Jathakam Details',
        fields: 'Full Name (with Inti Peru), Date & Time of Birth, Place of Birth, Raasi (రాశి), Nakshatram (నక్షత్రం) & Padam, Gothram (గోత్రం), Kuja Dosham',
        purpose: 'Required for Telugu Jathakam & Gothram compatibility checks'
      },
      {
        section: 'Education, Career & Visa Details',
        fields: 'B.Tech/M.S./MBA/MD Qualification, Designation, Employer, Location (Hyderabad, Bengaluru, USA/H1B/Green Card)',
        purpose: 'Highlights professional profile for domestic and NRI Telugu alliances'
      },
      {
        section: 'Family & Native Roots',
        fields: "Father's & Mother's Name/Occupation, Siblings, Native Place (e.g., Vijayawada, Guntur, Godavari, Vizag, Warangal), and Contact Details",
        purpose: 'Connects extended family networks and ancestral hometowns'
      }
    ],
    faqs: [
      {
        q: 'Can I create my marriage biodata in Telugu script (తెలుగు)?',
        a: 'Yes! On this page, Telugu (తెలుగు) label translation is pre-selected so section headings and field labels render in Telugu, or you can switch to English with one click.'
      },
      {
        q: 'How do I add Inti Peru (Surname) and Padam in the Telugu biodata?',
        a: 'You can include Inti Peru in the Full Name or add a dedicated "Inti Peru / Surname" row in Personal Details, and use the Charan/Padam field in Horoscope Details.'
      },
      {
        q: 'Does it support South Indian Rasi chart for Telugu Jathakam?',
        a: 'Yes. Enable the Kundali chart in Tab 4 and choose "South Indian Rashi Box Grid" to display a 12-house South Indian chart.'
      },
      {
        q: 'Is the Telugu biodata PDF download free without watermarks?',
        a: 'Yes, 100% free forever with zero watermarks on PDF, Word (.docx), and HD PNG exports.'
      }
    ]
  },
  {
    slug: 'bengali-marriage-biodata',
    path: '/bengali-marriage-biodata',
    breadcrumbName: 'Bengali Marriage Biodata (বাংলা বিয়ের বায়োডাটা)',
    categoryName: 'Regional Languages',
    title: 'Bengali Marriage Biodata Maker (বিয়ের বায়োডাটা) | COGIFY',
    description:
      'Create traditional Bengali Biyer Biodata online with Shree Shree Prajapataye Namah header, Rashi, Gana, Gotra, and family details. Free A4 PDF and Word export.',
    h1: 'Bengali Biyer Biodata Maker (বাংলা বিয়ের বায়োডাটা)',
    heroSubtitle:
      'Create an elegant Bengali Biyer Biodata (বিয়ের বায়োডাটা) featuring Shree Shree Prajapataye Namah invocation, Alpona & Lotus borders, Rashi, Gana (Deva/Manushya/Rakshasa), Gotra, and East Indian Kundali chart.',
    preset: 'hindu_bride',
    language: 'en',
    locale: 'en_IN',
    templateCategory: 'floral',
    defaultTemplateId: 'royal-sindoor-gold',
    guideTitle: 'Authentic Bengali Biyer Biodata Format (বাংলা বিয়ের বায়োডাটা गाइड)',
    guideIntro:
      'A classic Bengali matrimonial profile (Biyer Biodata) blends cultural refinement—opening with Shree Shree Prajapataye Namah—with essential astrological attributes (Rashi, Gana, Gotra, Mangalik), academic/cultural pursuits, and ancestral background (Ghoti / Bangal heritage).',
    mustHaveRows: [
      {
        section: 'Auspicious Prajapati Invocation',
        fields: '|| শ্রীশ্রী প্রজাপতয়ে নমঃ || (Shree Shree Prajapataye Namah) header & sacred motif',
        purpose: 'Classic auspicious opening invoking Lord Brahma/Prajapati in Bengali weddings'
      },
      {
        section: 'Personal & Astrological (ঠিকুজি-কোষ্ঠী)',
        fields: 'Date, Time & Place of Birth, Rashi (রাশি), Nakshatra (নক্ষত্র), Gana (গণ — দেব/মনুষ্য/রাক্ষস), Gotra (গোত্র), and Mangalik status',
        purpose: 'Key parameters for Bengali Kushthi / Patrika matching'
      },
      {
        section: 'Academic, Professional & Cultural Interests',
        fields: 'Qualifications, University, Designation, Organization, plus Hobbies (Rabindra Sangeet, Classical Music, Literature, Fine Arts)',
        purpose: 'Bengali matrimonial profiles place strong emphasis on education and cultural pursuits'
      },
      {
        section: 'Family Background (পারিবারিক পরিচয়)',
        fields: 'Parents & Siblings Details, Ancestral Roots, Current Residence (Kolkata, Salt Lake, Siliguri, or Abroad), and Contact Info',
        purpose: 'Provides complete family context for alliance conversations'
      }
    ],
    faqs: [
      {
        q: 'Does this studio include the East Indian / Bengali Sunburst Kundali chart?',
        a: 'Yes! In Tab 4 (Studio & Kundali), choose "East Indian / Bengali Sunburst Chart" from the Kundali Chart Tradition dropdown to add an authentic Bengali Kushthi diagram.'
      },
      {
        q: 'Can I use "Shree Shree Prajapataye Namah" as the top heading?',
        a: 'Yes. In Tab 2 (Header & Photo), type or select "|| Shree Shree Prajapataye Namah ||" or "|| শ্রীশ্রী প্রজাপতয়ে নমঃ ||" in the Auspicious Invocation field.'
      },
      {
        q: 'Can I generate the biodata in Bengali script (বাংলা) or English?',
        a: 'Both! Switch between Bengali (বাংলা) and English labels at any time with zero data loss.'
      },
      {
        q: 'Are all Bengali marriage biodata templates free to download?',
        a: 'Yes, all 242 templates and PDF, Editable Word (.docx), and HD PNG exports are 100% free with no watermark.'
      }
    ]
  },
  {
    slug: 'nri-executive-biodata',
    path: '/nri-executive-biodata',
    breadcrumbName: 'NRI & Executive Biodata Format',
    categoryName: 'Modern & Export Formats',
    title: 'Modern NRI & Executive Marriage Biodata Format | COGIFY',
    description:
      'Design a sleek NRI and Executive marriage biodata featuring Visa status, global relocation, Ivy or executive education, and clean A4 layouts. Free PDF export.',
    h1: 'Modern Executive & Global NRI Marriage Biodata Studio',
    heroSubtitle:
      'Designed for global NRIs, doctors, founders, and executives in the USA, UK, Canada, Australia, UAE, and Singapore—featuring clean editorial typography, Visa/Residency fields, and 1-page or 2-page portfolio layouts.',
    preset: 'modern_minimal',
    language: 'en',
    locale: 'en_IN',
    templateCategory: 'modern',
    defaultTemplateId: 'modern-executive-white',
    guideTitle: 'How to Craft a Modern NRI & Executive Matrimonial Profile',
    guideIntro:
      'Global professionals and NRI families often prefer a sleek, editorial Matrimonial Profile over heavily ornamented templates—highlighting academic pedigree, international career trajectory, Visa/Citizenship clarity, personal lifestyle, and partner relocation preferences.',
    mustHaveRows: [
      {
        section: 'Clean Editorial Masthead',
        fields: 'MATRIMONIAL PROFILE heading, circular or editorial portrait frame, and candidate summary headline',
        purpose: 'Creates a sophisticated, contemporary first impression'
      },
      {
        section: 'Global Residency & Lifestyle',
        fields: 'Current City & Country, Citizenship / Visa Status (US Green Card, H1B, Canadian PR, UK ILR, EU Blue Card), Height, Age, Diet & Lifestyle',
        purpose: 'Addresses practical international relocation and residency questions upfront'
      },
      {
        section: 'Executive Education & Career',
        fields: 'Undergraduate & Graduate Universities, Current Role, Company, Industry, and Career Vision',
        purpose: 'Showcases global educational and professional achievements'
      },
      {
        section: 'Family Heritage in India / Abroad',
        fields: 'Parents & Siblings Locations/Professions, Ancestral Hometown in India, and International WhatsApp / Email Contact',
        purpose: 'Bridges global professional life with family roots in India'
      }
    ],
    faqs: [
      {
        q: 'Which layout engines work best for a modern NRI or Executive biodata?',
        a: 'Try our "Ultra-Clean Editorial Banner", "Vogue / Magazine Cover Spread", "Executive Infographic & Quick Chips", or "Left Portrait & Profile Sidebar" layouts in Tab 3.'
      },
      {
        q: 'Can I add Visa Status, Citizenship, and LinkedIn Profile URL fields?',
        a: 'Yes! Click "+ Add Custom Field" in Education & Career or Personal Details to add Citizenship/Visa Status, LinkedIn URL, or Global Relocation Preferences.'
      },
      {
        q: 'Can I remove religious symbols for a minimalist secular matrimonial profile?',
        a: 'Yes. The Modern Minimal preset automatically sets the emblem to "None" and changes the heading to "MATRIMONIAL PROFILE" with clean sans-serif typography.'
      },
      {
        q: 'Are 2-page comprehensive portfolio templates available for detailed profiles?',
        a: 'Yes. Filter the template gallery by "2-Page Comprehensive" or choose Layout #10 in Tab 3 to generate a 2-page A4 matrimonial portfolio.'
      }
    ]
  },
  {
    slug: 'biodata-for-marriage-pdf',
    path: '/biodata-for-marriage-pdf',
    breadcrumbName: 'Marriage Biodata PDF Generator',
    categoryName: 'Modern & Export Formats',
    title: 'Marriage Biodata PDF Maker — Free A4 Download | COGIFY',
    description:
      'Generate and download crystal-clear 300-DPI A4 marriage biodata PDF files online in 2 minutes. Pick from 242 cultural templates with zero watermark or signup.',
    h1: 'High-DPI A4 Marriage Biodata PDF Generator (No Watermark)',
    heroSubtitle:
      'Export pixel-accurate, print-ready 300-DPI A4 Marriage Biodata PDFs (210mm × 297mm) with locked 1:1 preview geometry, smart single-page auto-fit, and zero watermarks.',
    preset: 'hindu_bride',
    language: 'en',
    locale: 'en_IN',
    templateCategory: 'all',
    defaultTemplateId: 'royal-sindoor-gold',
    guideTitle: 'Why 1:1 Print-Locked A4 PDF Geometry Matters for Your Marriage Biodata',
    guideIntro:
      'Many online biodata tools shift margins, clip borders, or produce blurry low-resolution files when exporting to PDF. Our studio renders on a locked 794×1123px A4 canvas with a 2-pass Smart Auto-Fit solver so your downloaded PDF matches the live preview down to the pixel.',
    mustHaveRows: [
      {
        section: 'True ISO A4 Proportions (210mm × 297mm)',
        fields: 'Locked 794×1123px canvas with 3x Retina rasterization and vector print CSS support',
        purpose: 'Guarantees zero text shifting or border clipping on desktop and mobile'
      },
      {
        section: '2-Pass Smart Single-Page Auto-Fit',
        fields: 'Automatic font-scale and row-gap calibration when you add extra fields',
        purpose: 'Prevents awkward 2nd-page spillover on 1-page templates'
      },
      {
        section: '32 Vector SVG Ceremonial Borders',
        fields: 'Resolution-independent gold mandalas, temple arches, floral vines, and geometric frames',
        purpose: 'Stays razor-sharp when zoomed on WhatsApp or printed on 300-GSM ivory card stock'
      },
      {
        section: 'Zero Watermark & Instant Download',
        fields: 'Direct browser-generated .pdf download with clean candidate filename',
        purpose: 'Ready to share immediately with families and matrimonial bureaus'
      }
    ],
    faqs: [
      {
        q: 'Why does my downloaded PDF match the live preview so accurately?',
        a: 'Unlike generic HTML-to-PDF converters that reflow text during export, our engine clones the exact 794×1123px A4 stage with all computed CSS variables, SVG frames, and fonts locked at 1:1 scale.'
      },
      {
        q: 'What if I have many fields and want everything to fit on a single A4 PDF page?',
        a: 'Keep "Smart Single-Page Auto-Fit" checked in Tab 3. It automatically calibrates text scale and line spacing so your entire biodata fits cleanly inside the A4 border.'
      },
      {
        q: 'Can I also print vector A4 PDFs directly from my browser?',
        a: 'Yes. Click the "Print" button in the top toolbar to invoke our dedicated @media print A4 stylesheet.'
      },
      {
        q: 'Is the high-resolution PDF download really ₹0 with no signup?',
        a: 'Yes. There are no paywalls, no login forms, and no watermarks—ever.'
      }
    ]
  },
  {
    slug: 'biodata-word-format',
    path: '/biodata-word-format',
    breadcrumbName: 'Marriage Biodata Format in Word (.docx)',
    categoryName: 'Modern & Export Formats',
    title: 'Marriage Biodata Format in Word (.docx) — Free | COGIFY',
    description:
      'Download editable Microsoft Word (.docx) marriage biodata formats with portrait photo, page borders, and structured tables for Personal and Family details.',
    h1: 'Editable Microsoft Word (.docx) Marriage Biodata Format Builder',
    heroSubtitle:
      'Generate a true, native editable Microsoft Word (.docx) marriage biodata document complete with double page borders, side-by-side portrait photo, themed section headers, and two-column field tables.',
    preset: 'hindu_bride',
    language: 'en',
    locale: 'en_IN',
    templateCategory: 'all',
    defaultTemplateId: 'royal-sindoor-gold',
    guideTitle: 'How Our Native Editable Microsoft Word (.docx) Marriage Biodata Export Works',
    guideIntro:
      'Many families and elders prefer receiving a marriage biodata in Microsoft Word (.docx) format so they can tweak a phone number, add a relative, or adjust wording in MS Word or Google Docs. Unlike sites that paste a flat, uneditable image into a Word file, our engine constructs genuine OpenXML Word tables and paragraphs.',
    mustHaveRows: [
      {
        section: 'Native OpenXML Word Tables (.docx)',
        fields: 'Editable two-column label/value rows for Personal, Horoscope, Education, Family & Contact sections',
        purpose: 'Open in Microsoft Word, LibreOffice, or Google Docs and edit any word directly'
      },
      {
        section: 'Side-by-Side Portrait & Personal Details',
        fields: 'Embedded high-resolution candidate portrait aligned beside the Personal Details table',
        purpose: 'Mirrors the classic A4 matrimonial layout inside MS Word'
      },
      {
        section: 'Template-Matched Colors & Page Borders',
        fields: 'Carries over your chosen template accent color, background paper tint, and double page border',
        purpose: 'Preserves your ceremonial aesthetic inside an editable Word file'
      },
      {
        section: 'Multi-Language Unicode Support',
        fields: 'Supports English, Hindi, Marathi, Gujarati, Tamil, Telugu, Bengali, Kannada & Urdu text',
        purpose: 'Works seamlessly for regional language Word biodata files'
      }
    ],
    faqs: [
      {
        q: 'Is the downloaded .docx file truly editable in Microsoft Word and Google Docs?',
        a: 'Yes! Every heading, section title, field label, and value is generated as native Word paragraphs and table cells—not a flattened image—so you can edit text freely.'
      },
      {
        q: 'Does the Word (.docx) export include my uploaded portrait photo and sacred emblem?',
        a: 'Yes. Your cropped portrait photo (with selected frame shape) and sacred header emblem are embedded directly into the Word document.'
      },
      {
        q: 'Can I download both the Word (.docx) file and the 300-DPI PDF?',
        a: 'Yes. You can download the PDF, Word (.docx), HD PNG, and `.json` backup from the same workspace at ₹0.'
      },
      {
        q: 'Do I need Microsoft Office installed to generate the Word biodata?',
        a: 'No. Our browser studio builds the `.docx` file locally in your browser on any phone, tablet, Mac, or Windows PC.'
      }
    ]
  },
  {
    slug: 'whatsapp-biodata-maker',
    path: '/whatsapp-biodata-maker',
    breadcrumbName: 'WhatsApp Marriage Biodata Maker',
    categoryName: 'Modern & Export Formats',
    title: 'WhatsApp Marriage Biodata Maker — Text & Image | COGIFY',
    description:
      'Create a formatted WhatsApp marriage biodata text summary with bold headings and high-resolution A4 PNG or PDF cards for family groups. 100% free and private.',
    h1: 'WhatsApp Marriage Biodata & HD Image Card Generator',
    heroSubtitle:
      'Create both a crisp 3x Retina A4 PNG/PDF card AND a neatly structured WhatsApp text summary (with bold section headings and clean spacing) ready to forward in family matrimonial groups.',
    preset: 'hindu_bride',
    language: 'en',
    locale: 'en_IN',
    templateCategory: 'all',
    defaultTemplateId: 'royal-sindoor-gold',
    guideTitle: 'Best Practices for Sharing a Marriage Biodata on WhatsApp Matrimonial Groups',
    guideIntro:
      'Over 85% of Indian matrimonial introductions today begin on WhatsApp between parents, relatives, and community marriage groups. Sending a structured text summary alongside a crystal-clear A4 PDF or HD PNG ensures elders can read key highlights immediately without zooming.',
    mustHaveRows: [
      {
        section: 'One-Click Formatted WhatsApp Summary',
        fields: 'Auto-formatted WhatsApp markdown with *Bold Section Headings*, bulleted fields, and sacred invocation',
        purpose: 'Lets family members scan Age, Height, Gotra, Education, and Location directly in chat'
      },
      {
        section: '3x Retina HD PNG Image Card',
        fields: 'High-contrast A4 image export that previews inline inside WhatsApp chat without opening a PDF viewer',
        purpose: 'Ideal for quick visual viewing on mobile phones'
      },
      {
        section: 'Print-Ready A4 PDF Attachment',
        fields: 'Full 300-DPI A4 PDF document for forwarding and home/studio printing',
        purpose: 'Standard attachment expected for formal matrimonial consideration'
      },
      {
        section: 'Privacy Control Before Sharing',
        fields: 'One-click eye toggle (👁) on any field (such as Income, Full Address, or Alternate Phone)',
        purpose: 'Hide sensitive details when posting in large community WhatsApp groups'
      }
    ],
    faqs: [
      {
        q: 'How does the "WhatsApp" share button format my biodata?',
        a: 'Clicking "WhatsApp" compiles all your visible sections and fields into a clean, readable WhatsApp message with bold headings (e.g., *Personal Details*, *Education & Career*) and opens WhatsApp so you can send it along with your downloaded PDF or PNG.'
      },
      {
        q: 'Can I hide my annual income or house address before sharing on a WhatsApp group?',
        a: 'Yes! Click the eye icon (👁) next to any field in the editor to hide it from the A4 sheet, PDF, PNG, and WhatsApp summary without deleting your typed text.'
      },
      {
        q: 'Should I send a PNG image or a PDF on WhatsApp?',
        a: 'We recommend downloading both: send the HD PNG so relatives see an instant visual preview in chat, and attach the A4 PDF for high-resolution zooming and printing.'
      },
      {
        q: 'Does the WhatsApp text summary include any promotional spam?',
        a: 'No. It generates a clean, respectful matrimonial profile summary formatted for family sharing.'
      }
    ]
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
export function applySeoRouteContext({ onSelectPreset, onSelectLanguage, onSelectCategory, onSelectTemplate } = {}) {
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

    const subtitleEl = document.getElementById('hero-subtitle-text') || document.querySelector('.compact-intro-copy p');
    if (subtitleEl && route.heroSubtitle) {
      subtitleEl.textContent = route.heroSubtitle;
    }

    if (route.preset && typeof onSelectPreset === 'function') {
      onSelectPreset(route.preset);
    }
    if (route.defaultTemplateId && typeof onSelectTemplate === 'function') {
      onSelectTemplate(route.defaultTemplateId);
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
