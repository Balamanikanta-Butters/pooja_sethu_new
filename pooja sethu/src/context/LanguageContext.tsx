import React, { createContext, useState, useContext } from 'react';

type Language = 'English' | 'Telugu';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  English: {
    appTitle: 'Pooja Sethu',
    appSubtitle: 'పూజా సేతు',
    appDesc: 'Book a Purohit of your Sampradayam, at the right muhurtham.',
    chooseLang: 'CHOOSE LANGUAGE',
    cityLabel: 'City',
    cityValue: 'Hyderabad and Secunderabad',
    useLocation: '⌖ Use my current location',
    mobileLabel: 'Mobile number',
    mobilePlaceholder: '10-digit number',
    helpText: 'Log in seamlessly. No spam, ever.',
    sendOtp: 'Login / Continue',
    exploreFirst: 'Explore first, sign in later',
    terms: 'By continuing you agree to the Terms and Privacy Policy.',
    // Profile
    profileTitle: 'Complete Your Profile',
    profileDesc: 'Please provide your details to personalize your experience.',
    fullName: 'Full Name',
    familyDetails: 'Family Details',
    sampradayam: 'Sampradayam',
    gotra: 'Gotra',
    savedAddress: 'Saved Address',
    saveProfile: 'Save Profile',
    // OTP
    enterOtp: 'Enter OTP',
    otpDesc: 'We have sent a 4-digit code to {mobile}. Please enter it below.',
    verifyAndContinue: 'Verify and Continue',
    resendOtp: 'Resend OTP',
    back: '← Back',
    // Sampradayam Modal
    sampTitle: 'Your Sampradayam',
    sampSubtitle: 'మీ సంప్రదాయం',
    sampDesc: 'We show only Poojas and Purohits that follow your family\'s tradition. You can change this anytime in Account.',
    remember: 'Remember for future bookings',
    // Home Tab
    namaskaram: 'Namaskaram',
    guest: 'Guest',
    todaysPanchangam: "Today's Panchangam",
    panchangamDesc: 'Mahalaya Paksham: an auspicious fortnight for Pitru Tarpanam and Shraddha.',
    tithi: 'Tithi',
    nakshatram: 'Nakshatram',
    masamSamvatsaram: 'Masam - Samvatsaram',
    sunriseSunset: 'Sunrise - Sunset',
    fullPanchangam: 'Full Panchangam and Durmuhurtham',
    howToBook: 'How would you like to book?',
    sampradayanusaram: 'Sampradayanusaram',
    sampradayaDesc: 'Pick your tradition first. See only Poojas and Purohits of Smartha, Madhva, Sri Vaishnava, Vaikhanasa and more.',
    samanyanusaram: 'Samanyanusaram',
    samanyaDesc: 'Browse every Pooja by occasion. Not sure of your Sampradayam? Start here.',
    upcomingMuhurthams: 'Upcoming good muhurthams',
    festivalsAhead: 'Festivals ahead',
    popularPoojas: 'Popular Poojas',
    // Account Tab
    account: 'Account',
    familyProfile: 'Family profile',
    language: 'Language',
    help: 'Help',
    chatWithUs: 'Chat with Pooja Sethu',
    chatDesc: 'Replies in about 5 minutes, 6 AM – 10 PM',
    requestCall: 'Request a call-back',
    callDesc: 'Telugu, English or Hindi',
    raiseConcern: 'Raise a concern about a booking',
    concernDesc: 'Late arrival, Vidhi, Samagri or payment',
    termsFooter: 'Terms',
    privacyFooter: 'Privacy',
    cancelFooter: 'Cancellation policy',
    signOut: 'Sign out',
  },
  Telugu: {
    appTitle: 'Pooja Sethu',
    appSubtitle: 'పూజా సేతు',
    appDesc: 'మీ సంప్రదాయానికి చెందిన పురోహితుడిని, సరైన ముహూర్తంలో బుక్ చేసుకోండి.',
    chooseLang: 'భాషను ఎంచుకోండి',
    cityLabel: 'నగరం',
    cityValue: 'హైదరాబాద్ మరియు సికింద్రాబాద్',
    useLocation: '⌖ నా ప్రస్తుత స్థానాన్ని ఉపయోగించండి',
    mobileLabel: 'మొబైల్ నంబర్',
    mobilePlaceholder: '10-అంకెల నంబర్',
    helpText: 'సులభంగా లాగిన్ అవ్వండి. ఎటువంటి స్పామ్ ఉండదు.',
    sendOtp: 'లాగిన్ / కొనసాగండి',
    exploreFirst: 'ముందుగా అన్వేషించండి, తర్వాత లాగిన్ అవ్వండి',
    terms: 'కొనసాగించడం ద్వారా మీరు నిబంధనలు మరియు గోప్యతా విధానానికి అంగీకరిస్తున్నారు.',
    // Profile
    profileTitle: 'మీ ప్రొఫైల్‌ను పూర్తి చేయండి',
    profileDesc: 'మీ అనుభవాన్ని వ్యక్తిగతీకరించడానికి దయచేసి మీ వివరాలను అందించండి.',
    fullName: 'పూర్తి పేరు',
    familyDetails: 'కుటుంబ వివరాలు',
    sampradayam: 'సంప్రదాయం',
    gotra: 'గోత్రం',
    savedAddress: 'సేవ్ చేసిన చిరునామా',
    saveProfile: 'ప్రొఫైల్ సేవ్ చేయండి',
    // OTP
    enterOtp: 'OTP నమోదు చేయండి',
    otpDesc: 'మేము {mobile} కు 4-అంకెల కోడ్‌ను పంపాము. దయచేసి దాన్ని క్రింద నమోదు చేయండి.',
    verifyAndContinue: 'ధృవీకరించి కొనసాగండి',
    resendOtp: 'మళ్లీ OTP పంపండి',
    back: '← వెనుకకు',
    // Sampradayam Modal
    sampTitle: 'మీ సంప్రదాయం',
    sampSubtitle: 'Your Sampradayam',
    sampDesc: 'మీ కుటుంబ సంప్రదాయాన్ని అనుసరించే పూజలు మరియు పురోహితులను మాత్రమే మేము చూపుతాము. మీరు దీన్ని ఎప్పుడైనా ఖాతాలో మార్చవచ్చు.',
    remember: 'భవిష్యత్తు బుకింగ్‌ల కోసం గుర్తుంచుకోండి',
    // Home Tab
    namaskaram: 'నమస్కారం',
    guest: 'అతిథి',
    todaysPanchangam: 'నేటి పంచాంగం',
    panchangamDesc: 'మహాలయ పక్షం: పితృ తర్పణం మరియు శ్రాద్ధం కోసం పవిత్రమైన పక్షం.',
    tithi: 'తిథి',
    nakshatram: 'నక్షత్రం',
    masamSamvatsaram: 'మాసం - సంవత్సరం',
    sunriseSunset: 'సూర్యోదయం - సూర్యాస్తమయం',
    fullPanchangam: 'పూర్తి పంచాంగం మరియు దుర్ముహూర్తం',
    howToBook: 'మీరు ఎలా బుక్ చేయాలనుకుంటున్నారు?',
    sampradayanusaram: 'సంప్రదాయానుసారం',
    sampradayaDesc: 'ముందుగా మీ సంప్రదాయాన్ని ఎంచుకోండి. స్మార్త, మాధ్వ, వైష్ణవ తదితర పూజలు మరియు పురోహితులను మాత్రమే చూడండి.',
    samanyanusaram: 'సామాన్యానుసారం',
    samanyaDesc: 'సందర్భాన్ని బట్టి ప్రతి పూజను బ్రౌజ్ చేయండి. మీ సంప్రదాయం గురించి ఖచ్చితంగా తెలియదా? ఇక్కడ ప్రారంభించండి.',
    upcomingMuhurthams: 'రాబోయే మంచి ముహూర్తాలు',
    festivalsAhead: 'రాబోయే పండుగలు',
    popularPoojas: 'ప్రముఖ పూజలు',
    // Account Tab
    account: 'ఖాతా',
    familyProfile: 'కుటుంబ ప్రొఫైల్',
    language: 'భాష',
    help: 'సహాయం',
    chatWithUs: 'పూజా సేతుతో చాట్ చేయండి',
    chatDesc: 'ఉదయం 6 నుండి రాత్రి 10 వరకు, సుమారు 5 నిమిషాల్లో ప్రత్యుత్తరాలు',
    requestCall: 'కాల్-బ్యాక్ అభ్యర్థించండి',
    callDesc: 'తెలుగు, హిందీ లేదా ఆంగ్లం',
    raiseConcern: 'బుకింగ్ గురించి సమస్యను లేవనెత్తండి',
    concernDesc: 'ఆలస్యంగా రాక, విధి, సామగ్రి లేదా చెల్లింపు',
    termsFooter: 'నిబంధనలు',
    privacyFooter: 'గోప్యత',
    cancelFooter: 'రద్దు విధానం',
    signOut: 'లాగ్ అవుట్',
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'English',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('English');

  const t = (key: string, params?: Record<string, string>) => {
    let text = translations[language][key] || key;
    if (params) {
      Object.keys(params).forEach(p => {
        text = text.replace(`{${p}}`, params[p]);
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
