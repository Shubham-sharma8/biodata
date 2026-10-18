// Complete multi-language dictionary, 18 datalist presets, 8 cultural/community schemas,
// 28 one-click optional field badges, and realistic sample profiles.
// Synthesized from REA reverse-engineering of biodatamaker.app, biodataformarriage.net,
// marriagebiodata.ai, freebiodatamaker.com, and myshadibiodata.in.

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' }
];

// Non-destructive label translations across all 9 languages.
// Switching languages translates section & field labels while preserving user-typed values!
export const LANGUAGE_LABELS = {
  en: {
    docTitle: 'MARRIAGE BIODATA',
    sections: {
      personal: 'Personal Details',
      horoscope: 'Horoscope / Astro Details',
      education: 'Education & Career',
      family: 'Family Details',
      expectations: 'Partner Expectations',
      contact: 'Contact Details'
    },
    fields: {
      full_name: 'Full Name',
      dob: 'Date of Birth',
      age: 'Age',
      height: 'Height',
      weight: 'Weight',
      complexion: 'Complexion',
      blood_group: 'Blood Group',
      marital_status: 'Marital Status',
      religion: 'Religion',
      caste: 'Caste / Community',
      sub_caste: 'Sub-Caste',
      mother_tongue: 'Mother Tongue',
      diet: 'Diet / Food Habits',
      hobbies: 'Hobbies & Interests',
      about_me: 'About Me',
      disability: 'Disability',
      tob: 'Time of Birth',
      pob: 'Place of Birth',
      rashi: 'Rashi (Moon Sign)',
      nakshatra: 'Nakshatra (Star)',
      gotra: 'Gotra',
      manglik: 'Manglik Status',
      gan: 'Gan',
      nadi: 'Nadi',
      charan: 'Charan',
      kuldaivat: 'Kuldaivat / Kuldevi',
      sect: 'Sect / Maslak',
      biradari: 'Biradari / Community',
      religious_practice: 'Religious Practice',
      qualification: 'Highest Qualification',
      college: 'College / University',
      occupation: 'Occupation / Designation',
      organization: 'Company / Organization',
      work_location: 'Work Location',
      income: 'Annual Income',
      father_name: "Father's Name",
      father_occupation: "Father's Occupation",
      mother_name: "Mother's Name",
      mother_occupation: "Mother's Occupation",
      brothers: 'Brothers',
      sisters: 'Sisters',
      family_type: 'Family Type',
      family_status: 'Family Status',
      family_values: 'Family Values',
      native_place: 'Native Place / Hometown',
      maternal_uncle: 'Maternal Uncle (Mama)',
      relatives: 'Relatives / Surnames',
      pref_age: 'Preferred Age & Height',
      pref_education: 'Preferred Education & Career',
      pref_location: 'Preferred Location & Values',
      contact_person: 'Contact Person',
      contact_number: 'Mobile Number',
      whatsapp_number: 'WhatsApp Number',
      alternate_number: 'Alternate Number',
      email: 'Email ID',
      address: 'Residential Address'
    }
  },
  hi: {
    docTitle: 'विवाह बायोडाटा',
    sections: {
      personal: 'व्यक्तिगत विवरण',
      horoscope: 'कुंडली / ज्योतिष विवरण',
      education: 'शिक्षा एवं व्यवसाय',
      family: 'पारिवारिक विवरण',
      expectations: 'जीवनसाथी की अपेक्षाएं',
      contact: 'संपर्क सूत्र'
    },
    fields: {
      full_name: 'पूरा नाम',
      dob: 'जन्म तिथि',
      age: 'आयु',
      height: 'लंबाई (Height)',
      weight: 'वज़न',
      complexion: 'रंग-रूप',
      blood_group: 'रक्त समूह (Blood Group)',
      marital_status: 'वैवाहिक स्थिति',
      religion: 'धर्म',
      caste: 'जाति',
      sub_caste: 'उप-जाति',
      mother_tongue: 'मातृभाषा',
      diet: 'खान-पान (आहार)',
      hobbies: 'शौक और रुचियां',
      about_me: 'मेरे बारे में',
      disability: 'दिव्यांगता',
      tob: 'जन्म समय',
      pob: 'जन्म स्थान',
      rashi: 'राशि',
      nakshatra: 'नक्षत्र',
      gotra: 'गोत्र',
      manglik: 'मांगलिक',
      gan: 'गण',
      nadi: 'नाड़ी',
      charan: 'चरण',
      kuldaivat: 'कुलदेवता / कुलदेवी',
      sect: 'पंथ / मसलक',
      biradari: 'बिरादरी',
      religious_practice: 'धार्मिक आचरण',
      qualification: 'उच्च शिक्षा',
      college: 'कॉलेज / विश्वविद्यालय',
      occupation: 'नौकरी / व्यवसाय',
      organization: 'कंपनी / संस्था',
      work_location: 'कार्यस्थल (शहर)',
      income: 'वार्षिक आय',
      father_name: 'पिता का नाम',
      father_occupation: 'पिता का व्यवसाय',
      mother_name: 'माता का नाम',
      mother_occupation: 'माता का व्यवसाय',
      brothers: 'भाई',
      sisters: 'बहन',
      family_type: 'परिवार का प्रकार',
      family_status: 'पारिवारिक स्तर',
      family_values: 'पारिवारिक मूल्य',
      native_place: 'पैतृक निवास',
      maternal_uncle: 'मामाजी का नाम / ननिहाल',
      relatives: 'प्रमुख रिश्तेदार',
      pref_age: 'अपेक्षित आयु एवं लंबाई',
      pref_education: 'अपेक्षित शिक्षा एवं व्यवसाय',
      pref_location: 'अपेक्षित शहर एवं विचार',
      contact_person: 'संपर्क व्यक्ति',
      contact_number: 'मोबाइल नंबर',
      whatsapp_number: 'व्हाट्सएप नंबर',
      alternate_number: 'अन्य संपर्क नंबर',
      email: 'ईमेल आईडी',
      address: 'निवास का पता'
    }
  },
  mr: {
    docTitle: 'विवाह परिचय पत्र (बायोडाटा)',
    sections: {
      personal: 'वैयक्तिक माहिती',
      horoscope: 'जन्मपत्रिका / कुंडली माहिती',
      education: 'शिक्षण आणि व्यवसाय',
      family: 'कौटुंबिक माहिती',
      expectations: 'जोडीदाराबद्दल अपेक्षा',
      contact: 'संपर्क माहिती'
    },
    fields: {
      full_name: 'संपूर्ण नाव',
      dob: 'जन्मतारीख',
      age: 'वय',
      height: 'उंची',
      weight: 'वजन',
      complexion: 'वर्ण (रंग)',
      blood_group: 'रक्तगट',
      marital_status: 'वैवाहिक स्थिती',
      religion: 'धर्म',
      caste: 'जात',
      sub_caste: 'पोटजात',
      mother_tongue: 'मातृभाषा',
      diet: 'आहार',
      hobbies: 'छंद आणि आवडी',
      about_me: 'माझ्याबद्दल',
      disability: 'अपंगत्व',
      tob: 'जन्मवेळ',
      pob: 'जन्मठिकाण',
      rashi: 'रास',
      nakshatra: 'नक्षत्र',
      gotra: 'गोत्र / देवक',
      manglik: 'मंगळ',
      gan: 'गण',
      nadi: 'नाडी',
      charan: 'चरण',
      kuldaivat: 'कुलदैवत',
      sect: 'पंथ',
      biradari: 'समाज',
      religious_practice: 'धार्मिक आचरण',
      qualification: 'शिक्षण',
      college: 'महाविद्यालय / विद्यापीठ',
      occupation: 'नोकरी / व्यवसाय',
      organization: 'कंपनीचे नाव',
      work_location: 'नोकरीचे ठिकाण',
      income: 'वार्षिक उत्पन्न',
      father_name: 'वडिलांचे नाव',
      father_occupation: 'वडिलांचा व्यवसाय',
      mother_name: 'आईचे नाव',
      mother_occupation: 'आईचा व्यवसाय',
      brothers: 'भाऊ',
      sisters: 'बहीण',
      family_type: 'कुटुंब पद्धती',
      family_status: 'कौटुंबिक स्थिती',
      family_values: 'कौटुंबिक मूल्ये',
      native_place: 'मूळ गाव',
      maternal_uncle: 'मामाचे नाव / आजोळ',
      relatives: 'नातेसंबंध (पाहुणे)',
      pref_age: 'अपेक्षित वय आणि उंची',
      pref_education: 'अपेक्षित शिक्षण आणि नोकरी',
      pref_location: 'अपेक्षित ठिकाण',
      contact_person: 'संपर्क व्यक्ती',
      contact_number: 'मोबाईल नंबर',
      whatsapp_number: 'व्हॉट्सॲप नंबर',
      alternate_number: 'पर्यायी नंबर',
      email: 'ईमेल आयडी',
      address: 'सध्याचा पत्ता'
    }
  },
  gu: {
    docTitle: 'લગ્ન બાયોડેટા',
    sections: {
      personal: 'વ્યક્તિગત વિગતો',
      horoscope: 'જન્માક્ષર / કુંડળી વિગતો',
      education: 'શિક્ષણ અને કારકિર્દી',
      family: 'કૌટુંબિક વિગતો',
      expectations: 'જીવનસાથી અંગે અપેક્ષા',
      contact: 'સંપર્ક વિગતો'
    },
    fields: {
      full_name: 'પૂરું નામ',
      dob: 'જન્મ તારીખ',
      age: 'ઉંમર',
      height: 'ઊંચાઈ',
      weight: 'વજન',
      complexion: 'વાન (રંગ)',
      blood_group: 'બ્લડ ગ્રુપ',
      marital_status: 'વૈવાહિક સ્થિતિ',
      religion: 'ધર્મ',
      caste: 'જ્ઞાતિ',
      sub_caste: 'પેટા જ્ઞાતિ',
      mother_tongue: 'માતૃભાષા',
      diet: 'ખોરાક',
      hobbies: 'શોખ અને રુચિ',
      tob: 'જન્મ સમય',
      pob: 'જન્મ સ્થળ',
      rashi: 'રાશિ',
      nakshatra: 'નક્ષત્ર',
      gotra: 'ગોત્ર',
      manglik: 'માંગલિક (મંગળ)',
      qualification: 'અભ્યાસ / શિક્ષણ',
      occupation: 'નોકરી / વ્યવસાય',
      organization: 'કંપની / સંસ્થા',
      work_location: 'નોકરીનું સ્થળ',
      income: 'વાર્ષિક આવક',
      father_name: 'પિતાનું નામ',
      father_occupation: 'પિતાનો વ્યવસાય',
      mother_name: 'માતાનું નામ',
      mother_occupation: 'માતાનો વ્યવસાય',
      brothers: 'ભાઈ',
      sisters: 'બહેન',
      native_place: 'મૂળ વતન',
      maternal_uncle: 'મોસાળ (મામાનું નામ)',
      contact_person: 'સંપર્ક વ્યક્તિ',
      contact_number: 'મોબાઇલ નંબર',
      email: 'ઈમેલ આઈડી',
      address: 'રહેઠાણનું સરનામું'
    }
  },
  ta: {
    docTitle: 'திருமண பயோடேட்டா',
    sections: {
      personal: 'தனிப்பட்ட விவரங்கள்',
      horoscope: 'ஜாதக விவரங்கள்',
      education: 'கல்வி மற்றும் தொழில்',
      family: 'குடும்ப விவரங்கள்',
      expectations: 'எதிர்பார்ப்புகள்',
      contact: 'தொடர்பு விவரங்கள்'
    },
    fields: {
      full_name: 'முழு பெயர்',
      dob: 'பிறந்த தேதி',
      age: 'வயது',
      height: 'உயரம்',
      complexion: 'நிறம்',
      blood_group: 'இரத்த வகை',
      marital_status: 'திருமண நிலை',
      religion: 'மதம்',
      caste: 'சாதி / சமூகம்',
      mother_tongue: 'தாய்மொழி',
      diet: 'உணவு முறை',
      tob: 'பிறந்த நேரம்',
      pob: 'பிறந்த இடம்',
      rashi: 'ராசி',
      nakshatra: 'நட்சத்திரம்',
      gotra: 'கோத்திரம்',
      qualification: 'கல்வித் தகுதி',
      occupation: 'பணி / தொழில்',
      organization: 'நிறுவனம்',
      income: 'ஆண்டு வருமானம்',
      father_name: 'தந்தை பெயர்',
      father_occupation: 'தந்தை தொழில்',
      mother_name: 'தாயார் பெயர்',
      mother_occupation: 'தாயார் தொழில்',
      brothers: 'சகோதரர்கள்',
      sisters: 'சகோதரிகள்',
      native_place: 'பூர்வீகம்',
      contact_number: 'தொலைபேசி எண்',
      email: 'மின்னஞ்சல்',
      address: 'முகவரி'
    }
  },
  te: {
    docTitle: 'వివాహ బయోడేటా',
    sections: {
      personal: 'వ్యక్తిగత వివరాలు',
      horoscope: 'జాతక వివరాలు',
      education: 'విద్య మరియు ఉద్యోగం',
      family: 'కుటుంబ వివరాలు',
      expectations: 'భాగస్వామి అంచనాలు',
      contact: 'సంప్రదింపు వివరాలు'
    },
    fields: {
      full_name: 'పూర్తి పేరు',
      dob: 'పుట్టిన తేదీ',
      age: 'వయస్సు',
      height: 'ఎత్తు',
      complexion: 'రంగు',
      blood_group: 'బ్లడ్ గ్రూప్',
      marital_status: 'వైవాహిక స్థితి',
      religion: 'మతం',
      caste: 'కులం',
      mother_tongue: 'మాతృభాష',
      tob: 'పుట్టిన సమయం',
      pob: 'పుట్టిన ప్రదేశం',
      rashi: 'రాశి',
      nakshatra: 'నక్షత్రం',
      gotra: 'గోత్రం',
      qualification: 'విద్యా అర్హత',
      occupation: 'ఉద్యోగం / వృత్తి',
      organization: 'కంపెనీ పేరు',
      income: 'వార్షిక ఆదాయం',
      father_name: 'తండ్రి పేరు',
      father_occupation: 'తండ్రి వృత్తి',
      mother_name: 'తల్లి పేరు',
      mother_occupation: 'తల్లి వృత్తి',
      brothers: 'సోదరులు',
      sisters: 'సోదరీమణులు',
      native_place: 'స్వస్థలం',
      contact_number: 'మొబైల్ నంబర్',
      email: 'ఇమెయిల్',
      address: 'చిరునామా'
    }
  },
  bn: {
    docTitle: 'বিবাহের বায়োডাটা',
    sections: {
      personal: 'ব্যক্তিগত বিবরণ',
      horoscope: 'জন্মপত্রিকা / রাশিচক্র',
      education: 'শিক্ষা ও পেশা',
      family: 'পারিবারিক বিবরণ',
      expectations: 'পাত্র/পাত্রীর প্রত্যাশা',
      contact: 'যোগাযোগের ঠিকানা'
    },
    fields: {
      full_name: 'পুরো নাম',
      dob: 'জন্ম তারিখ',
      age: 'বয়স',
      height: 'উচ্চতা',
      complexion: 'গাত্রবর্ণ',
      blood_group: 'রক্তের গ্রুপ',
      marital_status: 'বৈবাহিক অবস্থা',
      religion: 'ধর্ম',
      caste: 'জাতি / সম্প্রদায়',
      mother_tongue: 'মাতৃভাষা',
      tob: 'জন্ম সময়',
      pob: 'জন্মস্থান',
      rashi: 'রাশি',
      nakshatra: 'নক্ষত্র',
      gotra: 'গোত্র',
      qualification: 'শিক্ষাগত যোগ্যতা',
      occupation: 'পেশা / চাকরি',
      organization: 'প্রতিষ্ঠান',
      income: 'বার্ষিক আয়',
      father_name: 'পিতার নাম',
      father_occupation: 'পিতার পেশা',
      mother_name: 'মাতার নাম',
      mother_occupation: 'মাতার পেশা',
      brothers: 'ভাই',
      sisters: 'বোন',
      native_place: 'আদি নিবাস',
      contact_number: 'মোবাইল নম্বর',
      email: 'ইমেল আইডি',
      address: 'বর্তমান ঠিকানা'
    }
  },
  kn: {
    docTitle: 'ವಿವಾಹ ಬಯೋಡೇಟಾ',
    sections: {
      personal: 'ವೈಯಕ್ತಿಕ ವಿವರಗಳು',
      horoscope: 'ಜಾತಕ ವಿವರಗಳು',
      education: 'ಶಿಕ್ಷಣ ಮತ್ತು ವೃತ್ತಿ',
      family: 'ಕುಟುಂಬದ ವಿವರಗಳು',
      expectations: 'ನಿರೀಕ್ಷೆಗಳು',
      contact: 'ಸಂಪರ್ಕ ವಿವರಗಳು'
    },
    fields: {
      full_name: 'ಪೂರ್ಣ ಹೆಸರು',
      dob: 'ಜನ್ಮ ದಿನಾಂಕ',
      age: 'ವಯಸ್ಸು',
      height: 'ಎತ್ತರ',
      complexion: 'ಮೈಬಣ್ಣ',
      blood_group: 'ರಕ್ತದ ಗುಂಪು',
      marital_status: 'ವೈವಾಹಿಕ ಸ್ಥಿತಿ',
      religion: 'ಧರ್ಮ',
      caste: 'ಜಾತಿ',
      mother_tongue: 'ಮಾತೃಭಾಷೆ',
      tob: 'ಜನ್ಮ ಸಮಯ',
      pob: 'ಜನ್ಮ ಸ್ಥಳ',
      rashi: 'ರಾಶಿ',
      nakshatra: 'ನಕ್ಷತ್ರ',
      gotra: 'ಗೋತ್ರ',
      qualification: 'ವಿದ್ಯಾಭ್ಯಾಸ',
      occupation: 'ಉದ್ಯೋಗ / ವೃತ್ತಿ',
      income: 'ವಾರ್ಷಿಕ ಆದಾಯ',
      father_name: 'ತಂದೆಯ ಹೆಸರು',
      father_occupation: 'ತಂದೆಯ ವೃತ್ತಿ',
      mother_name: 'ತಾಯಿಯ ಹೆಸರು',
      mother_occupation: 'ತಾಯಿಯ ವೃತ್ತಿ',
      brothers: 'ಸಹೋದರರು',
      sisters: 'ಸಹೋದರಿಯರು',
      contact_number: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      email: 'ಇಮೇಲ್',
      address: 'ವಿಳಾಸ'
    }
  },
  ur: {
    docTitle: 'شادی کا بائیو ڈیٹا',
    sections: {
      personal: 'ذاتی تفصیلات',
      horoscope: 'مذہبی و مسلکی تفصیلات',
      education: 'تعلیم اور پیشہ',
      family: 'خاندانی تفصیلات',
      expectations: 'رشتے کی ترجیحات',
      contact: 'رابطہ کی تفصیلات'
    },
    fields: {
      full_name: 'پورا نام',
      dob: 'تاریخ پیدائش',
      age: 'عمر',
      height: 'قد',
      complexion: 'رنگت',
      blood_group: 'بلڈ گروپ',
      marital_status: 'ازدواجی حیثیت',
      religion: 'مذہب',
      caste: 'ذات / برادری',
      sect: 'مسلک / فرقہ',
      mother_tongue: 'مادری زبان',
      qualification: 'تعلیمی قابلیت',
      occupation: 'پیشہ / ملازمت',
      income: 'سالانہ آمدنی',
      father_name: 'والد کا نام',
      father_occupation: 'والد کا پیشہ',
      mother_name: 'والدہ کا نام',
      mother_occupation: 'والدہ کا پیشہ',
      brothers: 'بھائی',
      sisters: 'بہنیں',
      native_place: 'آبائی وطن',
      contact_number: 'موبائل نمبر',
      email: 'ای میل',
      address: 'موجودہ پتہ'
    }
  }
};

// 18 Comprehensive Datalist Option Dictionaries
export const DATALIST_OPTIONS = {
  invocations: [
    '|| Shree Ganeshay Namah ||',
    '|| श्री गणेशाय नमः ||',
    '|| Om Namah Shivay ||',
    '|| ॐ नमः शिवाय ||',
    '|| Shree Kuldevata Prasanna ||',
    '|| श्री कुलदैवत प्रसन्न ||',
    '|| Shree Mahalaxmi Prasanna ||',
    '|| Shree Swami Samarth ||',
    '|| Shree Krishnaay Namah ||',
    '|| Shree Ram ||',
    '|| Shree Balaji Prasanna ||',
    '|| Shree Vitthal Rukmini Prasanna ||',
    '|| Shree Tuljabhavani Prasanna ||',
    'Bismillah-ir-Rahman-ir-Rahim',
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    '786 — Bismillah-ir-Rahman-ir-Rahim',
    '|| Ik Onkar Satnam Waheguru ||',
    '॥ ੴ सति नामु करता पुरखु ॥',
    'Praise the Lord',
    'In the Name of the Father, the Son, and the Holy Spirit',
    '|| Jai Jinendra ||',
    '॥ जय जिनेन्द्र ॥',
    '|| Namo Buddhaya ||',
    '॥ नमो बुद्धाय ॥'
  ],
  docTitles: [
    'MARRIAGE BIODATA',
    'BIODATA',
    'MATRIMONIAL PROFILE',
    'NIKAH BIODATA',
    'विवाह बायोडाटा',
    'विवाह परिचय पत्र'
  ],
  heights: [
    '4\' 8" (142 cm)', '4\' 9" (145 cm)', '4\' 10" (147 cm)', '4\' 11" (150 cm)',
    '5\' 0" (152 cm)', '5\' 1" (155 cm)', '5\' 2" (157 cm)', '5\' 3" (160 cm)',
    '5\' 4" (163 cm)', '5\' 5" (165 cm)', '5\' 6" (168 cm)', '5\' 7" (170 cm)',
    '5\' 8" (173 cm)', '5\' 9" (175 cm)', '5\' 10" (178 cm)', '5\' 11" (180 cm)',
    '6\' 0" (183 cm)', '6\' 1" (185 cm)', '6\' 2" (188 cm)', '6\' 3" (191 cm)',
    '6\' 4" (193 cm)'
  ],
  complexions: [
    'Very Fair', 'Fair', 'Wheatish', 'Wheatish Fair', 'Medium', 'Dusky'
  ],
  bloodGroups: [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ],
  maritalStatuses: [
    'Never Married', 'Unmarried', 'Divorced', 'Widowed', 'Awaiting Divorce', 'Annulled'
  ],
  religions: [
    'Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Parsi', 'Jewish', 'Secular / Interfaith'
  ],
  castes: [
    'Brahmin', 'Rajput', 'Maratha', 'Baniya', 'Agarwal', 'Kayastha', 'Khatri', 'Arora',
    'Patel / Patidar', 'Yadav', 'Jat', 'Reddy', 'Kamma', 'Nair', 'Lingayat', 'Vokkaliga',
    'Sindhi', 'Maheshwari', 'Jain - Digambar', 'Jain - Shwetambar',
    'Sunni', 'Shia', 'Syed', 'Sheikh', 'Pathan', 'Ansari',
    'Jat Sikh', 'Khatri Sikh', 'Ramgarhia',
    'Roman Catholic', 'Protestant', 'Syrian Christian', 'Marthoma',
    'Caste No Bar'
  ],
  motherTongues: [
    'Hindi', 'Marathi', 'Gujarati', 'Punjabi', 'Bengali', 'Tamil', 'Telugu',
    'Kannada', 'Malayalam', 'Urdu', 'Odia', 'Assamese', 'Sindhi', 'Marwari', 'Konkani', 'English'
  ],
  diets: [
    'Vegetarian', 'Pure Vegetarian', 'Eggetarian', 'Non-Vegetarian', 'Jain Vegetarian', 'Vegan'
  ],
  rashis: [
    'Mesh (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
    'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrischika (Scorpio)',
    'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
  ],
  nakshatras: [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Moola', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
    'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ],
  gotras: [
    'Kashyap', 'Bharadwaj', 'Vashishtha', 'Gautam', 'Atri', 'Jamadagni',
    'Vishwamitra', 'Agastya', 'Kaundinya', 'Shandilya', 'Garg', 'Mudgal', 'Parashar', 'Kaushik'
  ],
  manglikOptions: [
    'No (Non-Manglik)', 'Yes (Manglik)', 'Anshik (Partial Manglik)', "Don't Know / Not Applicable"
  ],
  gans: [
    'Dev Gan (देव गण)', 'Manushya Gan (मनुष्य गण)', 'Rakshas Gan (राक्षस गण)'
  ],
  nadis: [
    'Adi Nadi (आदि नाड़ी)', 'Madhya Nadi (मध्य नाड़ी)', 'Antya Nadi (अंत्य नाड़ी)'
  ],
  familyTypes: [
    'Nuclear Family', 'Joint Family', 'Extended Family'
  ],
  familyStatuses: [
    'Upper Middle Class', 'Middle Class', 'Affluent / Well-Settled'
  ],
  familyValues: [
    'Traditional', 'Moderate', 'Blend of Traditional & Modern', 'Liberal'
  ]
};

// One-Click "+ Tap to Add" Optional Field Pills per Section
export const OPTIONAL_FIELD_PILLS = {
  personal: [
    { key: 'age', label: 'Age', placeholder: 'e.g., 27 Years', datalist: null },
    { key: 'weight', label: 'Weight', placeholder: 'e.g., 64 kg', datalist: null },
    { key: 'blood_group', label: 'Blood Group', placeholder: 'e.g., O+', datalist: 'bloodGroups' },
    { key: 'marital_status', label: 'Marital Status', placeholder: 'e.g., Never Married', datalist: 'maritalStatuses' },
    { key: 'sub_caste', label: 'Sub-Caste', placeholder: 'e.g., Kanyakubj / Deshastha', datalist: null },
    { key: 'mother_tongue', label: 'Mother Tongue', placeholder: 'e.g., Hindi', datalist: 'motherTongues' },
    { key: 'diet', label: 'Diet / Food Habits', placeholder: 'e.g., Pure Vegetarian', datalist: 'diets' },
    { key: 'hobbies', label: 'Hobbies & Interests', placeholder: 'e.g., Classical Music, Reading, Travel', datalist: null },
    { key: 'about_me', label: 'About Me', placeholder: 'Brief introduction about personality & lifestyle', datalist: null },
    { key: 'disability', label: 'Disability', placeholder: 'None', datalist: null }
  ],
  horoscope: [
    { key: 'gan', label: 'Gan', placeholder: 'e.g., Dev Gan', datalist: 'gans' },
    { key: 'nadi', label: 'Nadi', placeholder: 'e.g., Madhya Nadi', datalist: 'nadis' },
    { key: 'charan', label: 'Charan', placeholder: 'e.g., 2', datalist: null },
    { key: 'kuldaivat', label: 'Kuldaivat / Kuldevi', placeholder: 'e.g., Shree Khandoba / Tuljabhavani', datalist: null },
    { key: 'sect', label: 'Sect / Maslak', placeholder: 'e.g., Sunni / Hanafi', datalist: null },
    { key: 'biradari', label: 'Biradari / Community', placeholder: 'e.g., Syed / Sheikh', datalist: null },
    { key: 'religious_practice', label: 'Religious Practice', placeholder: 'e.g., Regular in 5 daily prayers', datalist: null }
  ],
  education: [
    { key: 'college', label: 'College / University', placeholder: 'e.g., IIT Delhi / Mumbai University', datalist: null },
    { key: 'organization', label: 'Company / Organization', placeholder: 'e.g., Google India / TCS', datalist: null },
    { key: 'work_location', label: 'Work Location', placeholder: 'e.g., Bengaluru, Karnataka', datalist: null },
    { key: 'income', label: 'Annual Income', placeholder: 'e.g., ₹24 LPA', datalist: null }
  ],
  family: [
    { key: 'family_type', label: 'Family Type', placeholder: 'e.g., Nuclear Family', datalist: 'familyTypes' },
    { key: 'family_status', label: 'Family Status', placeholder: 'e.g., Upper Middle Class', datalist: 'familyStatuses' },
    { key: 'family_values', label: 'Family Values', placeholder: 'e.g., Blend of Traditional & Modern', datalist: 'familyValues' },
    { key: 'native_place', label: 'Native Place / Hometown', placeholder: 'e.g., Jaipur, Rajasthan', datalist: null },
    { key: 'maternal_uncle', label: 'Maternal Uncle (Mama)', placeholder: 'e.g., Shri Rajesh Verma (Indore)', datalist: null },
    { key: 'relatives', label: 'Relatives / Surnames', placeholder: 'e.g., Sharma, Tiwari, Joshi, Dubey', datalist: null }
  ],
  expectations: [
    { key: 'pref_age', label: 'Preferred Age & Height', placeholder: 'e.g., 26–30 yrs, 5\'7" & above', datalist: null },
    { key: 'pref_education', label: 'Preferred Education & Career', placeholder: 'e.g., Well-educated professional', datalist: null },
    { key: 'pref_location', label: 'Preferred Location & Values', placeholder: 'e.g., Metro cities, family-oriented', datalist: null }
  ],
  contact: [
    { key: 'whatsapp_number', label: 'WhatsApp Number', placeholder: 'e.g., +91 98765 43210', datalist: null },
    { key: 'alternate_number', label: 'Alternate Number', placeholder: 'e.g., +91 91234 56789', datalist: null },
    { key: 'email', label: 'Email ID', placeholder: 'e.g., family.contact@email.com', datalist: null }
  ]
};

// Default base structure builder
export function createInitialBiodataState(presetId = 'hindu_bride') {
  const normalizedPresetId =
    presetId === 'sample_bride' ? 'hindu_bride' : presetId === 'sample_groom' ? 'hindu_groom' : presetId;

  const baseSections = [
    {
      id: 'personal',
      title: 'Personal Details',
      visible: true,
      fields: [
        { id: 'f_full_name', key: 'full_name', label: 'Full Name', value: 'Ananya Sharma', type: 'text', visible: true },
        { id: 'f_dob', key: 'dob', label: 'Date of Birth', value: '18 Aug 1997', type: 'date', visible: true },
        { id: 'f_age', key: 'age', label: 'Age', value: '28 Years', type: 'text', visible: true },
        { id: 'f_height', key: 'height', label: 'Height', value: '5\' 5" (165 cm)', type: 'text', datalist: 'heights', visible: true },
        { id: 'f_complexion', key: 'complexion', label: 'Complexion', value: 'Fair', type: 'text', datalist: 'complexions', visible: true },
        { id: 'f_blood_group', key: 'blood_group', label: 'Blood Group', value: 'O+', type: 'text', datalist: 'bloodGroups', visible: true },
        { id: 'f_marital_status', key: 'marital_status', label: 'Marital Status', value: 'Never Married', type: 'text', datalist: 'maritalStatuses', visible: true },
        { id: 'f_religion', key: 'religion', label: 'Religion', value: 'Hindu', type: 'text', datalist: 'religions', visible: true },
        { id: 'f_caste', key: 'caste', label: 'Caste / Community', value: 'Gaur Brahmin', type: 'text', datalist: 'castes', visible: true },
        { id: 'f_mother_tongue', key: 'mother_tongue', label: 'Mother Tongue', value: 'Hindi', type: 'text', datalist: 'motherTongues', visible: true },
        { id: 'f_diet', key: 'diet', label: 'Diet / Food Habits', value: 'Pure Vegetarian', type: 'text', datalist: 'diets', visible: true },
        { id: 'f_hobbies', key: 'hobbies', label: 'Hobbies & Interests', value: 'Classical Dance, Painting, Travelling & Reading', type: 'text', visible: true }
      ]
    },
    {
      id: 'horoscope',
      title: 'Horoscope / Astro Details',
      visible: true,
      fields: [
        { id: 'f_tob', key: 'tob', label: 'Time of Birth', value: '09:35 AM', type: 'text', visible: true },
        { id: 'f_pob', key: 'pob', label: 'Place of Birth', value: 'Jaipur, Rajasthan', type: 'text', visible: true },
        { id: 'f_rashi', key: 'rashi', label: 'Rashi (Moon Sign)', value: 'Simha (Leo)', type: 'text', datalist: 'rashis', visible: true },
        { id: 'f_nakshatra', key: 'nakshatra', label: 'Nakshatra (Star)', value: 'Magha', type: 'text', datalist: 'nakshatras', visible: true },
        { id: 'f_gotra', key: 'gotra', label: 'Gotra', value: 'Bharadwaj (Self) / Kashyap (Mama)', type: 'text', datalist: 'gotras', visible: true },
        { id: 'f_manglik', key: 'manglik', label: 'Manglik Status', value: 'No (Non-Manglik)', type: 'text', datalist: 'manglikOptions', visible: true }
      ]
    },
    {
      id: 'education',
      title: 'Education & Career',
      visible: true,
      fields: [
        { id: 'f_qualification', key: 'qualification', label: 'Highest Qualification', value: 'M.Tech in Computer Science (IIT Roorkee)', type: 'text', visible: true },
        { id: 'f_occupation', key: 'occupation', label: 'Occupation / Designation', value: 'Senior Product Manager', type: 'text', visible: true },
        { id: 'f_organization', key: 'organization', label: 'Company / Organization', value: 'Microsoft India (Hyderabad / Hybrid)', type: 'text', visible: true },
        { id: 'f_income', key: 'income', label: 'Annual Income', value: '₹28 LPA', type: 'text', visible: true }
      ]
    },
    {
      id: 'family',
      title: 'Family Details',
      visible: true,
      fields: [
        { id: 'f_father_name', key: 'father_name', label: "Father's Name", value: 'Shri Rajendra Prasad Sharma', type: 'text', visible: true },
        { id: 'f_father_occ', key: 'father_occupation', label: "Father's Occupation", value: 'Chief Engineer (Retd.), PWD Rajasthan', type: 'text', visible: true },
        { id: 'f_mother_name', key: 'mother_name', label: "Mother's Name", value: 'Smt. Sunita Sharma', type: 'text', visible: true },
        { id: 'f_mother_occ', key: 'mother_occupation', label: "Mother's Occupation", value: 'Homemaker (M.A. Hindi Literature)', type: 'text', visible: true },
        { id: 'f_brothers', key: 'brothers', label: 'Brothers', value: '1 Younger Brother (Pursuing MBA at IIM Indore)', type: 'text', visible: true },
        { id: 'f_sisters', key: 'sisters', label: 'Sisters', value: 'None', type: 'text', visible: true },
        { id: 'f_native', key: 'native_place', label: 'Native Place / Hometown', value: 'Jaipur, Rajasthan', type: 'text', visible: true }
      ]
    },
    {
      id: 'expectations',
      title: 'Partner Expectations',
      visible: false,
      fields: [
        { id: 'f_pref_age', key: 'pref_age', label: 'Preferred Age & Height', value: '28 to 31 Years, 5\' 8" & above', type: 'text', visible: true },
        { id: 'f_pref_edu', key: 'pref_education', label: 'Preferred Education & Career', value: 'Well-educated professional (B.Tech / MBA / CA / Doctor / Civil Services)', type: 'text', visible: true },
        { id: 'f_pref_loc', key: 'pref_location', label: 'Preferred Location & Values', value: 'Metro city in India or abroad, vegetarian & family-oriented', type: 'text', visible: true }
      ]
    },
    {
      id: 'contact',
      title: 'Contact Details',
      visible: true,
      fields: [
        { id: 'f_contact_person', key: 'contact_person', label: 'Contact Person', value: 'Shri Rajendra Prasad Sharma (Father)', type: 'text', visible: true },
        { id: 'f_contact_number', key: 'contact_number', label: 'Mobile Number', value: '+91 98290 12345, +91 94140 67890', type: 'text', visible: true },
        { id: 'f_email', key: 'email', label: 'Email ID', value: 'sharma.family.jaipur@example.com', type: 'text', visible: true },
        { id: 'f_address', key: 'address', label: 'Residential Address', value: 'B-42, Vaishali Nagar, Jaipur, Rajasthan – 302021', type: 'text', visible: true }
      ]
    }
  ];

  return {
    presetId: normalizedPresetId,
    language: 'en',
    templateId: 'royal-sindoor-gold',
    emblemId: 'ganesh',
    customEmblemDataUrl: null,
    showEmblem: true,
    invocationLines: ['|| Shree Ganeshay Namah ||'],
    docTitle: 'MARRIAGE BIODATA',
    showDocTitle: true,
    photo: {
      dataUrl: createDefaultAvatarSvgDataUrl('bride'),
      show: true,
      shape: 'rounded-rect', // 'circle' | 'rounded-rect' | 'arch' | 'gold-ring' | 'octagon' | 'square'
      size: 100, // percentage scale 75..125
      brightness: 100, // 70..130
      contrast: 100, // 70..130
      saturation: 100, // 0..150
      warmth: 0, // 0..60 sepia/warmth
      borderWidth: 3, // 0..8 px
      shadow: true
    },
    formatting: {
      fontPair: 'classic', // 'classic' | 'royal' | 'editorial' | 'devanagari' | 'modern' | 'calligraphic'
      fontScale: 100, // 80..120
      lineSpacing: 100, // 80..130
      pagePadding: 100, // 75..125
      labelWidth: 38, // 30..48%
      autoFitSinglePage: true,
      customAccentColor: '', // empty means use template default
      customSecondaryColor: '',
      customBgColor: '',
      customTextColor: '',
      customBorderStyle: '',
      customHeaderStyle: '',
      customLayout: '',
      paperTexture: 'none',
      watermarkMode: 'none',
      watermarkText: '',
      watermarkOpacity: 8
    },
    kundali: {
      show: false,
      style: 'north-indian',
      title: 'Lagna / Rashi Kundali',
      lagnaSign: '1 (Mesha)',
      houses: ['Lg, Su', 'Me', 'Ve, Ra', 'Ju', '', 'Sa', 'Ma', '', 'Ke', 'Mo', '', '']
    },
    canvasStickers: [],
    sections: baseSections
  };
}

// Clean SVG portrait illustration placeholder so the preview looks great out-of-the-box
export function createDefaultAvatarSvgDataUrl(kind = 'bride') {
  const svg = kind === 'groom'
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="400" viewBox="0 0 320 400" fill="none">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="320" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#F6EFE6"/>
            <stop offset="100%" stop-color="#E7D8C5"/>
          </linearGradient>
          <linearGradient id="suit" x1="60" y1="250" x2="260" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#1E293B"/>
            <stop offset="100%" stop-color="#0F172A"/>
          </linearGradient>
        </defs>
        <rect width="320" height="400" fill="url(#bg)"/>
        <circle cx="160" cy="145" r="95" fill="#D4AF37" fill-opacity="0.12"/>
        <!-- Shoulders / Sherwani -->
        <path d="M42 400C46 305 94 268 160 268C226 268 274 305 278 400H42Z" fill="url(#suit)"/>
        <path d="M135 268L160 328L185 268" stroke="#D4AF37" stroke-width="4" fill="#FFFDF9"/>
        <circle cx="160" cy="350" r="4" fill="#D4AF37"/>
        <circle cx="160" cy="372" r="4" fill="#D4AF37"/>
        <!-- Neck & Face -->
        <rect x="138" y="218" width="44" height="58" rx="18" fill="#E6B89C"/>
        <ellipse cx="160" cy="158" rx="58" ry="68" fill="#F0C7AB"/>
        <!-- Hair -->
        <path d="M102 146C100 100 128 74 164 74C200 74 222 102 218 146C212 120 194 106 160 106C128 106 110 120 102 146Z" fill="#1F242D"/>
        <!-- Facial features -->
        <path d="M132 146Q142 140 150 146" stroke="#2D3139" stroke-width="3" stroke-linecap="round"/>
        <path d="M170 146Q178 140 188 146" stroke="#2D3139" stroke-width="3" stroke-linecap="round"/>
        <circle cx="141" cy="154" r="3.8" fill="#1F242D"/>
        <circle cx="179" cy="154" r="3.8" fill="#1F242D"/>
        <path d="M160 156V174" stroke="#C99678" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M144 190Q160 202 176 190" stroke="#9C5243" stroke-width="3.2" stroke-linecap="round"/>
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="400" viewBox="0 0 320 400" fill="none">
        <defs>
          <linearGradient id="bgB" x1="0" y1="0" x2="320" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FDF6F0"/>
            <stop offset="100%" stop-color="#F2DFCE"/>
          </linearGradient>
          <linearGradient id="saree" x1="50" y1="260" x2="270" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#9B1C31"/>
            <stop offset="100%" stop-color="#6D1020"/>
          </linearGradient>
        </defs>
        <rect width="320" height="400" fill="url(#bgB)"/>
        <circle cx="160" cy="150" r="102" fill="#D4AF37" fill-opacity="0.14"/>
        <!-- Long Hair Back -->
        <ellipse cx="160" cy="185" rx="72" ry="88" fill="#1E1B18"/>
        <!-- Shoulders / Attire -->
        <path d="M46 400C54 310 98 272 160 272C222 272 266 310 274 400H46Z" fill="url(#saree)"/>
        <path d="M105 282C125 322 195 322 215 282" stroke="#F3C663" stroke-width="6" stroke-linecap="round"/>
        <!-- Necklace -->
        <path d="M126 266C140 286 180 286 194 266" stroke="#F3C663" stroke-width="4" stroke-dasharray="4 3"/>
        <!-- Neck & Face -->
        <rect x="140" y="220" width="40" height="54" rx="18" fill="#F0C7AB"/>
        <ellipse cx="160" cy="160" rx="55" ry="66" fill="#F6D2B8"/>
        <!-- Hair Front -->
        <path d="M104 156C104 104 130 82 160 82C190 82 216 104 216 156C200 126 180 112 160 108C140 112 120 126 104 156Z" fill="#1E1B18"/>
        <!-- Earrings -->
        <circle cx="103" cy="182" r="6" fill="#D4AF37"/>
        <circle cx="217" cy="182" r="6" fill="#D4AF37"/>
        <!-- Bindi & Features -->
        <circle cx="160" cy="136" r="3.6" fill="#9B1C31"/>
        <path d="M130 146Q141 139 150 145" stroke="#2A2421" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M170 145Q179 139 190 146" stroke="#2A2421" stroke-width="2.8" stroke-linecap="round"/>
        <circle cx="140" cy="155" r="3.8" fill="#2A2421"/>
        <circle cx="180" cy="155" r="3.8" fill="#2A2421"/>
        <path d="M160 158V174" stroke="#CFA083" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M145 190Q160 202 175 190" stroke="#B24C4C" stroke-width="3.2" stroke-linecap="round"/>
      </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 8 Cultural / Community & Role Presets (One-Click Schema + Template + Emblem + Sample Values)
export const COMMUNITY_PRESETS = [
  {
    id: 'hindu_bride',
    name: 'Hindu Bride (Sample)',
    badge: 'Hindu',
    templateId: 'royal-sindoor-gold',
    emblemId: 'ganesh',
    invocationLines: ['|| Shree Ganeshay Namah ||'],
    docTitle: 'MARRIAGE BIODATA',
    avatarKind: 'bride',
    apply: () => createInitialBiodataState('hindu_bride')
  },
  {
    id: 'hindu_groom',
    name: 'Hindu Groom (Sample)',
    badge: 'Hindu',
    templateId: 'chandan-kesar-gold',
    emblemId: 'ganesh',
    invocationLines: ['|| Shree Ganeshay Namah ||', '|| Shree Kuldevata Prasanna ||'],
    docTitle: 'MARRIAGE BIODATA',
    avatarKind: 'groom',
    apply: () => {
      const state = createInitialBiodataState('hindu_groom');
      state.presetId = 'hindu_groom';
      state.templateId = 'chandan-kesar-gold';
      state.photo.dataUrl = createDefaultAvatarSvgDataUrl('groom');
      state.invocationLines = ['|| Shree Ganeshay Namah ||'];
      const p = state.sections.find((s) => s.id === 'personal');
      if (p) {
        p.fields = [
          { id: 'f_full_name', key: 'full_name', label: 'Full Name', value: 'Rohan Vikramaditya Verma', type: 'text', visible: true },
          { id: 'f_dob', key: 'dob', label: 'Date of Birth', value: '12 Nov 1995', type: 'date', visible: true },
          { id: 'f_age', key: 'age', label: 'Age', value: '30 Years', type: 'text', visible: true },
          { id: 'f_height', key: 'height', label: 'Height', value: '5\' 11" (180 cm)', type: 'text', datalist: 'heights', visible: true },
          { id: 'f_complexion', key: 'complexion', label: 'Complexion', value: 'Fair', type: 'text', datalist: 'complexions', visible: true },
          { id: 'f_blood_group', key: 'blood_group', label: 'Blood Group', value: 'B+', type: 'text', datalist: 'bloodGroups', visible: true },
          { id: 'f_marital_status', key: 'marital_status', label: 'Marital Status', value: 'Never Married', type: 'text', datalist: 'maritalStatuses', visible: true },
          { id: 'f_religion', key: 'religion', label: 'Religion', value: 'Hindu', type: 'text', datalist: 'religions', visible: true },
          { id: 'f_caste', key: 'caste', label: 'Caste / Community', value: 'Rajput (Rathore)', type: 'text', datalist: 'castes', visible: true },
          { id: 'f_mother_tongue', key: 'mother_tongue', label: 'Mother Tongue', value: 'Hindi', type: 'text', datalist: 'motherTongues', visible: true },
          { id: 'f_diet', key: 'diet', label: 'Diet / Food Habits', value: 'Pure Vegetarian', type: 'text', datalist: 'diets', visible: true },
          { id: 'f_hobbies', key: 'hobbies', label: 'Hobbies & Interests', value: 'Classical Music, Reading, Trekking & Chess', type: 'text', visible: true }
        ];
      }
      const edu = state.sections.find((s) => s.id === 'education');
      if (edu) {
        edu.fields = [
          { id: 'f_qualification', key: 'qualification', label: 'Highest Qualification', value: 'B.Tech (NIT Trichy) & MBA (ISB Hyderabad)', type: 'text', visible: true },
          { id: 'f_occupation', key: 'occupation', label: 'Occupation / Designation', value: 'Vice President – Strategy & Product', type: 'text', visible: true },
          { id: 'f_organization', key: 'organization', label: 'Company / Organization', value: 'JP Morgan Chase & Co., Mumbai', type: 'text', visible: true },
          { id: 'f_income', key: 'income', label: 'Annual Income', value: '₹42 LPA', type: 'text', visible: true }
        ];
      }
      return state;
    }
  },
  {
    id: 'muslim_nikah',
    name: 'Muslim / Nikah Format',
    badge: 'Islamic',
    templateId: 'emerald-gold-arabesque',
    emblemId: 'bismillah_786',
    invocationLines: ['Bismillah-ir-Rahman-ir-Rahim'],
    docTitle: 'MATRIMONIAL BIODATA',
    avatarKind: 'groom',
    apply: () => {
      const state = createInitialBiodataState('muslim_nikah');
      state.presetId = 'muslim_nikah';
      state.templateId = 'emerald-gold-arabesque';
      state.emblemId = 'bismillah_786';
      state.invocationLines = ['Bismillah-ir-Rahman-ir-Rahim'];
      state.docTitle = 'MATRIMONIAL BIODATA';
      state.photo.dataUrl = createDefaultAvatarSvgDataUrl('groom');
      state.photo.shape = 'arch';
      state.sections = [
        {
          id: 'personal',
          title: 'Personal Details',
          visible: true,
          fields: [
            { id: 'f_full_name', key: 'full_name', label: 'Full Name', value: 'Zayd Ahmad Siddiqui', type: 'text', visible: true },
            { id: 'f_dob', key: 'dob', label: 'Date of Birth', value: '22 Apr 1996', type: 'date', visible: true },
            { id: 'f_age', key: 'age', label: 'Age', value: '29 Years', type: 'text', visible: true },
            { id: 'f_height', key: 'height', label: 'Height', value: '5\' 10" (178 cm)', type: 'text', datalist: 'heights', visible: true },
            { id: 'f_complexion', key: 'complexion', label: 'Complexion', value: 'Fair', type: 'text', datalist: 'complexions', visible: true },
            { id: 'f_marital_status', key: 'marital_status', label: 'Marital Status', value: 'Never Married', type: 'text', datalist: 'maritalStatuses', visible: true },
            { id: 'f_religion', key: 'religion', label: 'Religion & Sect', value: 'Islam (Sunni – Hanafi)', type: 'text', visible: true },
            { id: 'f_biradari', key: 'biradari', label: 'Biradari / Community', value: 'Siddiqui (Sheikh)', type: 'text', visible: true },
            { id: 'f_mother_tongue', key: 'mother_tongue', label: 'Mother Tongue', value: 'Urdu / Hindi', type: 'text', datalist: 'motherTongues', visible: true },
            { id: 'f_practice', key: 'religious_practice', label: 'Religious Practice', value: 'Practicing Muslim, observes 5 daily prayers & Ramadan', type: 'text', visible: true }
          ]
        },
        {
          id: 'horoscope',
          title: 'Horoscope / Astro Details',
          visible: false,
          fields: state.sections[1].fields
        },
        {
          id: 'education',
          title: 'Education & Profession',
          visible: true,
          fields: [
            { id: 'f_qualification', key: 'qualification', label: 'Qualification', value: 'B.Tech in Computer Engineering (AMU) & M.S. (Data Science)', type: 'text', visible: true },
            { id: 'f_occupation', key: 'occupation', label: 'Profession', value: 'Lead Cloud Architect', type: 'text', visible: true },
            { id: 'f_organization', key: 'organization', label: 'Organization', value: 'Amazon Web Services (Bengaluru)', type: 'text', visible: true },
            { id: 'f_income', key: 'income', label: 'Annual Income', value: '₹34 LPA', type: 'text', visible: true }
          ]
        },
        {
          id: 'family',
          title: 'Family Background',
          visible: true,
          fields: [
            { id: 'f_father_name', key: 'father_name', label: "Father's Name", value: 'Janab Tariq Mahmood Siddiqui', type: 'text', visible: true },
            { id: 'f_father_occ', key: 'father_occupation', label: "Father's Profession", value: 'Senior Advocate, High Court', type: 'text', visible: true },
            { id: 'f_mother_name', key: 'mother_name', label: "Mother's Name", value: 'Mohtarma Farhana Siddiqui', type: 'text', visible: true },
            { id: 'f_mother_occ', key: 'mother_occupation', label: "Mother's Profession", value: 'Homemaker (M.A. Urdu)', type: 'text', visible: true },
            { id: 'f_brothers', key: 'brothers', label: 'Brothers', value: '1 Elder Brother (Doctor, Married)', type: 'text', visible: true },
            { id: 'f_sisters', key: 'sisters', label: 'Sisters', value: '1 Younger Sister (Architect)', type: 'text', visible: true },
            { id: 'f_native', key: 'native_place', label: 'Native Place', value: 'Lucknow, Uttar Pradesh', type: 'text', visible: true }
          ]
        },
        {
          id: 'expectations',
          title: 'Partner Expectations',
          visible: false,
          fields: state.sections[4].fields
        },
        {
          id: 'contact',
          title: 'Contact Details',
          visible: true,
          fields: [
            { id: 'f_contact_person', key: 'contact_person', label: 'Wali / Contact Person', value: 'Janab Tariq Mahmood Siddiqui (Father)', type: 'text', visible: true },
            { id: 'f_contact_number', key: 'contact_number', label: 'Contact Number', value: '+91 98390 11223', type: 'text', visible: true },
            { id: 'f_email', key: 'email', label: 'Email ID', value: 'siddiqui.family.lucknow@example.com', type: 'text', visible: true },
            { id: 'f_address', key: 'address', label: 'Residence', value: 'Gomti Nagar, Lucknow, Uttar Pradesh – 226010', type: 'text', visible: true }
          ]
        }
      ];
      return state;
    }
  },
  {
    id: 'sikh_anand_karaj',
    name: 'Sikh / Anand Karaj Format',
    badge: 'Sikh',
    templateId: 'anand-karaj-royal-blue',
    emblemId: 'ik_onkar',
    invocationLines: ['|| Ik Onkar Satnam Waheguru ||'],
    docTitle: 'MATRIMONIAL BIODATA',
    avatarKind: 'bride',
    apply: () => {
      const state = createInitialBiodataState('sikh_anand_karaj');
      state.presetId = 'sikh_anand_karaj';
      state.templateId = 'anand-karaj-royal-blue';
      state.emblemId = 'ik_onkar';
      state.invocationLines = ['|| Ik Onkar Satnam Waheguru ||'];
      state.sections[0].fields = [
        { id: 'f_full_name', key: 'full_name', label: 'Full Name', value: 'Simranjeet Kaur Gill', type: 'text', visible: true },
        { id: 'f_dob', key: 'dob', label: 'Date of Birth', value: '14 Feb 1998', type: 'date', visible: true },
        { id: 'f_age', key: 'age', label: 'Age', value: '28 Years', type: 'text', visible: true },
        { id: 'f_tob', key: 'tob', label: 'Time & Place of Birth', value: '07:45 AM — Chandigarh', type: 'text', visible: true },
        { id: 'f_height', key: 'height', label: 'Height', value: '5\' 6" (168 cm)', type: 'text', datalist: 'heights', visible: true },
        { id: 'f_religion', key: 'religion', label: 'Religion & Caste', value: 'Sikh — Jat Sikh (Gill)', type: 'text', visible: true },
        { id: 'f_marital_status', key: 'marital_status', label: 'Marital Status', value: 'Never Married', type: 'text', visible: true },
        { id: 'f_diet', key: 'diet', label: 'Diet', value: 'Vegetarian, Non-Drinker', type: 'text', visible: true }
      ];
      state.sections[1].visible = false; // Hide astrological section by default for Sikh preset
      return state;
    }
  },
  {
    id: 'christian_classic',
    name: 'Christian Format',
    badge: 'Christian',
    templateId: 'christian-ivory-gold',
    emblemId: 'cross',
    invocationLines: ['Praise the Lord'],
    docTitle: 'MATRIMONIAL PROFILE',
    avatarKind: 'bride',
    apply: () => {
      const state = createInitialBiodataState('christian_classic');
      state.presetId = 'christian_classic';
      state.templateId = 'christian-ivory-gold';
      state.emblemId = 'cross';
      state.invocationLines = ['Praise the Lord'];
      state.docTitle = 'MATRIMONIAL PROFILE';
      state.sections[0].fields = [
        { id: 'f_full_name', key: 'full_name', label: 'Full Name', value: 'Rachel Elizabeth Thomas', type: 'text', visible: true },
        { id: 'f_dob', key: 'dob', label: 'Date of Birth', value: '05 Oct 1997', type: 'date', visible: true },
        { id: 'f_age', key: 'age', label: 'Age', value: '28 Years', type: 'text', visible: true },
        { id: 'f_height', key: 'height', label: 'Height', value: '5\' 5" (165 cm)', type: 'text', datalist: 'heights', visible: true },
        { id: 'f_religion', key: 'religion', label: 'Denomination', value: 'Christian — Syrian Christian (Marthoma)', type: 'text', visible: true },
        { id: 'f_parish', key: 'custom_parish', label: 'Home Parish', value: 'St. Thomas Marthoma Church, Kochi', type: 'text', visible: true },
        { id: 'f_mother_tongue', key: 'mother_tongue', label: 'Mother Tongue', value: 'Malayalam / English', type: 'text', visible: true },
        { id: 'f_marital_status', key: 'marital_status', label: 'Marital Status', value: 'Never Married', type: 'text', visible: true }
      ];
      state.sections[1].visible = false;
      return state;
    }
  },
  {
    id: 'jain_format',
    name: 'Jain Format (Jai Jinendra)',
    badge: 'Jain',
    templateId: 'jain-saffron-ivory',
    emblemId: 'jain',
    invocationLines: ['|| Jai Jinendra ||'],
    docTitle: 'MARRIAGE BIODATA',
    avatarKind: 'bride',
    apply: () => {
      const state = createInitialBiodataState('jain_format');
      state.presetId = 'jain_format';
      state.templateId = 'jain-saffron-ivory';
      state.emblemId = 'jain';
      state.invocationLines = ['|| Jai Jinendra ||'];
      const p = state.sections.find((s) => s.id === 'personal');
      if (p) {
        const rel = p.fields.find((f) => f.key === 'religion');
        const cas = p.fields.find((f) => f.key === 'caste');
        const diet = p.fields.find((f) => f.key === 'diet');
        if (rel) rel.value = 'Jain';
        if (cas) cas.value = 'Shwetambar Murtipujak (Oswal)';
        if (diet) diet.value = 'Jain Vegetarian';
      }
      return state;
    }
  },
  {
    id: 'buddhist_format',
    name: 'Buddhist Format (Namo Buddhaya)',
    badge: 'Buddhist',
    templateId: 'buddhist-serene-blue',
    emblemId: 'buddha',
    invocationLines: ['|| Namo Buddhaya ||'],
    docTitle: 'MARRIAGE BIODATA',
    avatarKind: 'groom',
    apply: () => {
      const state = createInitialBiodataState('buddhist_format');
      state.presetId = 'buddhist_format';
      state.templateId = 'buddhist-serene-blue';
      state.emblemId = 'buddha';
      state.invocationLines = ['|| Namo Buddhaya ||'];
      state.photo.dataUrl = createDefaultAvatarSvgDataUrl('groom');
      state.sections[1].visible = false;
      return state;
    }
  },
  {
    id: 'modern_minimal',
    name: 'Modern Minimal (Executive)',
    badge: 'Modern',
    templateId: 'modern-executive-white',
    emblemId: 'lotus',
    invocationLines: [],
    docTitle: 'MATRIMONIAL PROFILE',
    avatarKind: 'bride',
    apply: () => {
      const state = createInitialBiodataState('modern_minimal');
      state.presetId = 'modern_minimal';
      state.templateId = 'modern-executive-white';
      state.emblemId = 'none';
      state.showEmblem = false;
      state.invocationLines = [];
      state.docTitle = 'MATRIMONIAL PROFILE';
      state.photo.shape = 'circle';
      state.formatting.fontPair = 'modern';
      return state;
    }
  }
];

export const DOB_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function parseDobParts(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') {
    return { day: '', month: '', year: '' };
  }
  const raw = dateStr.trim();
  if (!raw) return { day: '', month: '', year: '' };

  // 1. Check "DD MMM YYYY" or "D Month YYYY" (e.g. "12 Nov 1995", "18 August 1997")
  const dmyTextMatch = raw.match(/^(\d{1,2})[\s\-,/]+([A-Za-z]+)[\s\-,/]+(\d{4})$/);
  if (dmyTextMatch) {
    const dayNum = parseInt(dmyTextMatch[1], 10);
    const monPrefix = dmyTextMatch[2].slice(0, 3).toLowerCase();
    const monIdx = DOB_MONTHS.findIndex((m) => m.toLowerCase() === monPrefix);
    const yearNum = parseInt(dmyTextMatch[3], 10);
    if (dayNum >= 1 && dayNum <= 31 && monIdx !== -1 && yearNum >= 1940 && yearNum <= 2025) {
      return {
        day: String(dayNum).padStart(2, '0'),
        month: DOB_MONTHS[monIdx],
        year: String(yearNum)
      };
    }
  }

  // 2. Check ISO "YYYY-MM-DD"
  const isoMatch = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (isoMatch) {
    const yearNum = parseInt(isoMatch[1], 10);
    const monNum = parseInt(isoMatch[2], 10);
    const dayNum = parseInt(isoMatch[3], 10);
    if (monNum >= 1 && monNum <= 12 && dayNum >= 1 && dayNum <= 31) {
      return {
        day: String(dayNum).padStart(2, '0'),
        month: DOB_MONTHS[monNum - 1],
        year: String(yearNum)
      };
    }
  }

  // 3. Check Indian numeric "DD/MM/YYYY" or "DD-MM-YYYY" or "DD.MM.YYYY"
  const dmyNumMatch = raw.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  if (dmyNumMatch) {
    const dayNum = parseInt(dmyNumMatch[1], 10);
    const monNum = parseInt(dmyNumMatch[2], 10);
    const yearNum = parseInt(dmyNumMatch[3], 10);
    if (monNum >= 1 && monNum <= 12 && dayNum >= 1 && dayNum <= 31) {
      return {
        day: String(dayNum).padStart(2, '0'),
        month: DOB_MONTHS[monNum - 1],
        year: String(yearNum)
      };
    }
  }

  // 4. Fallback to native Date parser if valid and contains a 4-digit year
  const yearMatch = raw.match(/\b(19\d{2}|20\d{2})\b/);
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime()) && yearMatch) {
    return {
      day: String(parsed.getDate()).padStart(2, '0'),
      month: DOB_MONTHS[parsed.getMonth()],
      year: String(parsed.getFullYear())
    };
  }

  if (yearMatch) {
    return { day: '', month: '', year: yearMatch[1] };
  }

  return { day: '', month: '', year: '' };
}

// Helper to calculate age (in years only) and formatted DOB automatically when a date string changes
export function formatDobAndCalculateAge(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return { formattedDob: '', ageText: '' };
  const raw = dateStr.trim();
  if (!raw) return { formattedDob: '', ageText: '' };

  const parts = parseDobParts(raw);
  const today = new Date();
  const currentYear = today.getFullYear();

  if (parts.day && parts.month && parts.year) {
    const monIdx = DOB_MONTHS.indexOf(parts.month);
    const yearNum = parseInt(parts.year, 10);
    const dayNum = parseInt(parts.day, 10);
    let age = currentYear - yearNum;
    const m = today.getMonth() - monIdx;
    if (m < 0 || (m === 0 && today.getDate() < dayNum)) {
      age -= 1;
    }
    const formattedDob = `${String(dayNum).padStart(2, '0')} ${parts.month} ${yearNum}`;
    return {
      formattedDob,
      ageText: age > 0 && age <= 100 ? `${age} Years` : ''
    };
  }

  // If user only selected or typed a 4-digit birth year so far (e.g. "1995")
  if (parts.year) {
    const yearNum = parseInt(parts.year, 10);
    const age = currentYear - yearNum;
    return {
      formattedDob: raw,
      ageText: age > 0 && age <= 100 ? `${age} Years` : ''
    };
  }

  return { formattedDob: raw, ageText: '' };
}

