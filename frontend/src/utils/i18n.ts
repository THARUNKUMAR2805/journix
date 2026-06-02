export type Language = 'en' | 'hi' | 'kn' | 'ta' | 'ml' | 'te';

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
];

type Translations = Record<string, Record<Language, string>>;

export const t: Translations = {
  // Nav
  home: { en: 'Home', hi: 'होम', kn: 'ಮನೆ', ta: 'முகப்பு', ml: 'ഹോം', te: 'హోమ్' },
  explore: { en: 'Explore', hi: 'अन्वेषण', kn: 'ಅನ್ವೇಷಿಸಿ', ta: 'ஆராயுங்கள்', ml: 'പര്യവേക്ഷണം', te: 'అన్వేషించు' },
  hotels: { en: 'Hotels', hi: 'होटल', kn: 'ಹೋಟೆಲ್‌ಗಳು', ta: 'ஹோட்டல்கள்', ml: 'ഹോട്ടലുകൾ', te: 'హోటళ్ళు' },
  cuisine: { en: 'Cuisine', hi: 'व्यंजन', kn: 'ಅಡುಗೆ', ta: 'உணவு', ml: 'ഭക്ഷണം', te: 'వంట' },
  transport: { en: 'Transport', hi: 'परिवहन', kn: 'ಸಾರಿಗೆ', ta: 'போக்குவரத்து', ml: 'ഗതാഗതം', te: 'రవాణా' },
  packages: { en: 'Packages', hi: 'पैकेज', kn: 'ಪ್ಯಾಕೇಜ್‌ಗಳು', ta: 'தொகுப்புகள்', ml: 'പാക്കേജുകൾ', te: 'ప్యాకేజీలు' },
  virtualTour: { en: 'Virtual Tour', hi: 'वर्चुअल टूर', kn: 'ವರ್ಚ್ಯುಯಲ್ ಟೂರ್', ta: 'மெய்நிகர் சுற்றுலா', ml: 'വർچ്വൽ ടൂർ', te: 'వర్చువల్ టూర్' },
  login: { en: 'Login', hi: 'लॉगिन', kn: 'ಲಾಗಿನ್', ta: 'உள்நுழை', ml: 'ലോഗിൻ', te: 'లాగిన్' },
  register: { en: 'Register', hi: 'रजिस्टर', kn: 'ನೋಂದಣಿ', ta: 'பதிவு', ml: 'രജിസ്റ്റർ', te: 'నమోదు' },
  // Hero
  heroTitle: { en: 'Explore India Like a Local', hi: 'स्थानीय की तरह भारत का अन्वेषण करें', kn: 'ಸ್ಥಳೀಯನಂತೆ ಭಾರತವನ್ನು ಅನ್ವೇಷಿಸಿ', ta: 'உள்ளூர்வாசியைப் போல் இந்தியாவை ஆராயுங்கள்', ml: 'ഒരു ലോക്കൽ ആയി ഇന്ത്യ പര്യവേക്ഷണം ചെയ്യൂ', te: 'స్థానికుడిలా భారతదేశాన్ని అన్వేషించు' },
  heroSub: { en: 'Budget-friendly packages · Local cuisines · Authentic experiences', hi: 'बजट-फ्रेंडली पैकेज · स्थानीय व्यंजन · प्रामाणिक अनुभव', kn: 'ಬಜೆಟ್-ಸ್ನೇಹಿ ಪ್ಯಾಕೇಜ್ · ಸ್ಥಳೀಯ ವ್ಯಂಜನ · ಅಧಿಕೃತ ಅನುಭವ', ta: 'பட்ஜெட் தொகுப்புகள் · உள்ளூர் உணவுகள் · நேரடி அனுபவங்கள்', ml: 'ബഡ്ജറ്റ് പ്യാക്കേജ് · ലോക്കൽ ഭക്ഷണം · ആധികാരിക അനുഭവം', te: 'బడ్జెట్ ప్యాకేజీలు · స్థానిక వంటలు · నిజమైన అనుభవాలు' },
  searchPlaceholder: { en: 'Where do you want to go?', hi: 'आप कहाँ जाना चाहते हैं?', kn: 'ನೀವು ಎಲ್ಲಿ ಹೋಗಲು ಬಯಸುತ್ತೀರಿ?', ta: 'நீங்கள் எங்கு செல்ல விரும்புகிறீர்கள்?', ml: 'നിങ്ങൾ എവിടെ പോകണം?', te: 'మీరు ఎక్కడికి వెళ్ళాలనుకుంటున్నారు?' },
  bookNow: { en: 'Book Now', hi: 'अभी बुक करें', kn: 'ಈಗ ಬುಕ್ ಮಾಡಿ', ta: 'இப்போது முன்பதிவு', ml: 'ഇപ്പോൾ ബുക്ക് ചെയ്യൂ', te: 'ఇప్పుడు బుక్ చేయండి' },
  viewMore: { en: 'View More', hi: 'और देखें', kn: 'ಇನ್ನಷ್ಟು ನೋಡಿ', ta: 'மேலும் காண்க', ml: 'കൂടുതൽ കാണൂ', te: 'మరింత చూడు' },
  learnMore: { en: 'Learn More', hi: 'और जानें', kn: 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ', ta: 'மேலும் அறிக', ml: 'കൂടുതൽ അറിയൂ', te: 'మరింత తెలుసుకో' },
  reviews: { en: 'reviews', hi: 'समीक्षाएं', kn: 'ವಿಮರ್ಶೆಗಳು', ta: 'மதிப்பீடுகள்', ml: 'അഭിപ്രായങ്ങൾ', te: 'సమీక్షలు' },
  perNight: { en: '/night', hi: '/रात', kn: '/ರಾತ್ರಿ', ta: '/இரவு', ml: '/രാത്രി', te: '/రాత్రి' },
  perDay: { en: '/day', hi: '/दिन', kn: '/ದಿನ', ta: '/நாள்', ml: '/ദിവസം', te: '/రోజు' },
  days: { en: 'days', hi: 'दिन', kn: 'ದಿನಗಳು', ta: 'நாட்கள்', ml: 'ദിവസങ്ങൾ', te: 'రోజులు' },
  logout: { en: 'Logout', hi: 'लॉगआउट', kn: 'ಲಾಗ್ ಔಟ್', ta: 'வெளியேறு', ml: 'ലോഗൗട്ട്', te: 'లాగ్అవుట్' },
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', ta: 'டாஷ்போர்ட்', ml: 'ഡാഷ്‌ബോർഡ്', te: 'డాష్‌బోర్డ్' },
};

export function translate(key: string, lang: Language): string {
  return t[key]?.[lang] ?? t[key]?.en ?? key;
}
