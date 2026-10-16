import React, { createContext, useState, useContext, type ReactNode } from 'react';

export type Language = 'en' | 'te';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    nav_home: 'Home',
    nav_poojas: 'Poojas',
    nav_homams: 'Homams',
    nav_panchangam: 'Panchangam',
    nav_bookings: 'My Bookings',
    nav_profile: 'Profile',
    nav_signin: 'Sign In',
    nav_search_placeholder: 'Search Gruhapravesam, Homam, Pooja...',
    nav_city: 'Hyderabad',

    // Hero
    hero_title: 'Vedic Ceremonies at Your Home',
    hero_subtitle: 'Book certified Vedic Purohits of your Sampradayam with authentic Samagri at the most auspicious Shubha Muhurtham.',
    hero_book_cta: 'Book a Ceremony',
    hero_explore_muhurthams: 'View Good Muhurthams',
    hero_verified_badge: '100% Certified Vedic Purohits',

    // Panchangam Card
    panchangam_title: "Today's Panchangam",
    panchangam_city_badge: 'Hyderabad',
    panchangam_full_view: 'View Full Panchangam ›',
    panchangam_tithi: 'Tithi',
    panchangam_nakshatram: 'Nakshatram',
    panchangam_masam: 'Masam',
    panchangam_rutuvu: 'Rutuvu',
    panchangam_ayanam: 'Ayanam',
    panchangam_kalam: 'Subha Kalam',
    panchangam_rahu: 'Rahu Kalam',
    panchangam_yama: 'Yamagandam',
    panchangam_durmuhurtham: 'Durmuhurtham',
    panchangam_varjyam: 'Varjyam',

    // Sampradayam Banner
    sampradaya_title: 'Sampradayanusaram',
    sampradaya_telugu: 'సంప్రదాయానుసారం',
    sampradaya_desc: "Book by your family's tradition. We show only Poojas and Purohits that follow it.",
    sampradaya_all: 'All Traditions',
    sampradaya_smartha: 'Smartha',
    sampradaya_madhva: 'Madhva',
    sampradaya_srivaishnava: 'Sri Vaishnava',
    sampradaya_vaikhanasa: 'Vaikhanasa',
    sampradaya_pancharatra: 'Pancharatra',
    sampradaya_raghavendra: 'Sri Raghavendra Matha',
    sampradaya_vyasaraja: 'Vyasaraja Matha',
    sampradaya_uttaradi: 'Uttaradi Matha',
    sampradaya_veerashaiva: 'Veerashaiva',
    sampradaya_not_sure: 'Not sure',

    // Book Pooja Section
    book_pooja_title: 'Book a Ceremony by Occasion',
    book_pooja_desc: 'Authentic Vedic rituals performed strictly according to your family Shastras.',
    cat_all: 'All Ceremonies',
    cat_gruha: 'Gruha (Home)',
    cat_samskara: 'Samskaras',
    cat_vratam: 'Vratams',
    cat_homam: 'Homams',
    cat_pitru: 'Pitru Karyams',
    cat_festivals: 'Festival Poojas',
    cat_business: 'Business & Vehicle',
    pooja_duration: 'Duration',
    pooja_starting_from: 'Starting from',
    pooja_book_now: 'Book Ceremony ›',
    pooja_explore_all: 'View All Ceremonies ›',

    // Muhurthams & Festivals
    muhurtham_title: 'Upcoming good muhurthams',
    muhurtham_calendar_link: 'Calendar',
    muhurtham_footnote: 'Auspicious dates for Hyderabad. Your Purohit confirms the final muhurtham.',
    muhurtham_book_btn: 'Book ›',
    festivals_title: 'Festivals ahead',
    festival_major_tag: 'Major Festival',
    festival_sacred_tag: 'Pavitra Dinam',

    // Popular Poojas
    popular_poojas_title: 'Most Performed Poojas in Hyderabad',
    popular_poojas_subtitle: 'Devotees recommend these ceremonies for family prosperity and health.',

    // How It Works
    how_works_title: 'How Pooja Sethu Works',
    how_step1_title: '1. Select Ceremony & Muhurtham',
    how_step1_desc: 'Choose your desired pooja and pick an auspicious date verified by local Vedic panchangam.',
    how_step2_title: '2. Match Verified Purohit',
    how_step2_desc: 'Select a qualified priest from your specific Sampradayam (Smartha, Madhva, Sri Vaishnava).',
    how_step3_title: '3. Complete Ceremony at Home',
    how_step3_desc: 'Purohit arrives with purified Samagri kit. Pay dakshina safely after completing the ritual.',

    // All Poojas Page
    all_poojas_header: 'All Vedic Ceremonies',
    all_poojas_filter_tradition: 'Filter by Tradition',
    all_poojas_filter_category: 'Ceremony Categories',
    all_poojas_sort_by: 'Sort By',
    all_poojas_sort_popular: 'Most Booked',
    all_poojas_sort_low_high: 'Price: Low to High',
    all_poojas_sort_high_low: 'Price: High to Low',
    all_poojas_showing: 'Showing {count} ceremonies',
    all_poojas_no_results: 'No ceremonies match your selected filters. Try choosing "All traditions".',

    // Pooja Details Page
    pooja_detail_back: 'Back to Poojas',
    pooja_detail_includes: 'What is Included',
    pooja_detail_samagri_included: 'Purified Samagri Kit Included',
    pooja_detail_purohit_dakshina: 'Vedic Purohit Dakshina',
    pooja_detail_family_arranges: 'What the Family Arranges at Home',
    pooja_detail_faqs: 'Frequently Asked Vedic Questions',
    pooja_detail_book_cta: 'Book Ceremony Now',

    // Booking Page
    booking_step1: '1. When & Where',
    booking_step2: '2. Purohit',
    booking_step3: '3. Package & Add-ons',
    booking_step4: '4. Review & Confirm',
    booking_select_muhurtham: 'Select Auspicious Muhurtham',
    booking_ceremony_address: 'Ceremony Venue Address',
    booking_continue_purohit: 'Continue to Purohit Selection',
    booking_continue_package: 'Continue to Venue & Add-ons',
    booking_continue_review: 'Continue to Review',
    booking_confirm_pay: 'Confirm & Pay',
    booking_catering_title: 'Sattvic Bhojanalu (Pure Vegetarian Catering)',
    booking_catering_desc: 'Prepared without onion & garlic strictly adhering to traditional rituals.',
    booking_delivery_window: 'Samagri Kit Delivery Window',
    booking_free_cancellation: 'Free cancellation up to 72 hours before muhurtham.',

    // Profile Page
    profile_title: 'My Devotee Profile',
    profile_family_members: 'Family Members for Sankalpam',
    profile_family_desc: 'Names, Gotrams, and Janma Nakshatrams invoked by the Vedic Purohit during the live Sankalpam ritual.',
    profile_add_member: 'Add Member',
    profile_saved_addresses: 'Saved Ceremony Addresses',
    profile_vedic_identity: 'Family & Vedic Identity',

    // Common
    common_loading: 'Loading...',
    common_cancel: 'Cancel',
    common_save: 'Save',
    common_delete: 'Delete',
    common_edit: 'Edit',
    common_success: 'Success',
    common_error: 'Error'
  },
  te: {
    // Nav
    nav_home: 'హోమ్',
    nav_poojas: 'పూజలు',
    nav_homams: 'హోమాలు',
    nav_panchangam: 'పంచాంగం',
    nav_bookings: 'నా బుకింగ్స్',
    nav_profile: 'ప్రొఫైల్',
    nav_signin: 'లాగిన్',
    nav_search_placeholder: 'గృహప్రవేశం, హోమం, పూజ కోసం వెతకండి...',
    nav_city: 'హైదరాబాద్',

    // Hero
    hero_title: 'మీ ఇంట సంప్రదాయ వైదిక పూజలు',
    hero_subtitle: 'మీ సంప్రదాయానికి అనుగుణంగా వేద పండితులు, శుద్ధమైన పూజా సామాగ్రితో శుభ ముహూర్తంలో పూజలు నిర్వహించుకోండి.',
    hero_book_cta: 'పూజ బుక్ చేసుకోండి',
    hero_explore_muhurthams: 'శుభ ముహూర్తాలు చూడండి',
    hero_verified_badge: '100% ధ్రువీకరించబడిన వేద పండితులు',

    // Panchangam Card
    panchangam_title: 'నేటి పంచాంగం',
    panchangam_city_badge: 'హైదరాబాద్',
    panchangam_full_view: 'పూర్తి పంచాంగం చూడండి ›',
    panchangam_tithi: 'తిథి',
    panchangam_nakshatram: 'నక్షత్రం',
    panchangam_masam: 'మాసం',
    panchangam_rutuvu: 'ఋతువు',
    panchangam_ayanam: 'అయనం',
    panchangam_kalam: 'శుభ కాలం',
    panchangam_rahu: 'రాహు కాలం',
    panchangam_yama: 'యమగండం',
    panchangam_durmuhurtham: 'దుర్ముహూర్తం',
    panchangam_varjyam: 'వర్జ్యం',

    // Sampradayam Banner
    sampradaya_title: 'సంప్రదాయానుసారం',
    sampradaya_telugu: 'సంప్రదాయానుసారం',
    sampradaya_desc: 'మీ కుటుంబ సంప్రదాయం ప్రకారం బుక్ చేసుకోండి. ఆ సంప్రదాయాన్ని అనుసరించే పూజలు, పురోహితులను మాత్రమే చూపిస్తాము.',
    sampradaya_all: 'అన్ని సంప్రదాయాలు',
    sampradaya_smartha: 'స్మార్త',
    sampradaya_madhva: 'మాధ్వ',
    sampradaya_srivaishnava: 'శ్రీ వైష్ణవ',
    sampradaya_vaikhanasa: 'వైఖానస',
    sampradaya_pancharatra: 'పాంచరాత్ర',
    sampradaya_raghavendra: 'శ్రీ రాఘవేంద్ర మఠం',
    sampradaya_vyasaraja: 'వ్యాసరాజ మఠం',
    sampradaya_uttaradi: 'ఉత్తరాది మఠం',
    sampradaya_veerashaiva: 'వీరశైవ',
    sampradaya_not_sure: 'తెలియదు / అందరికీ',

    // Book Pooja Section
    book_pooja_title: 'సందర్భానుసారం పూజలు',
    book_pooja_desc: 'మీ కుటుంబ శాస్త్రోక్త పద్ధతిలో నిర్వహించే ప్రామాణిక వైదిక పూజలు.',
    cat_all: 'అన్ని పూజలు',
    cat_gruha: 'గృహ ప్రవేశం',
    cat_samskara: 'సంస్కారాలు',
    cat_vratam: 'వ్రతాలు',
    cat_homam: 'హోమాలు',
    cat_pitru: 'పితృ కార్యాలు',
    cat_festivals: 'పండుగ పూజలు',
    cat_business: 'వ్యాపారం & వాహనం',
    pooja_duration: 'సమయం',
    pooja_starting_from: 'ప్రారంభ ధర',
    pooja_book_now: 'పూజ బుక్ చేసుకోండి ›',
    pooja_explore_all: 'అన్ని పూజలు చూడండి ›',

    // Muhurthams & Festivals
    muhurtham_title: 'రాబోయే శుభ ముహూర్తాలు',
    muhurtham_calendar_link: 'క్యాలెండర్',
    muhurtham_footnote: 'హైదరాబాద్ పంచాంగం ప్రకారం శుభ ముహూర్తాలు. మీ పురోహితులు తుది ముహూర్తాన్ని నిర్ధారిస్తారు.',
    muhurtham_book_btn: 'బుక్ చేసుకోండి ›',
    festivals_title: 'రాబోయే పండుగలు',
    festival_major_tag: 'ప్రధాన పండుగ',
    festival_sacred_tag: 'పవిత్ర దినం',

    // Popular Poojas
    popular_poojas_title: 'హైదరాబాద్‌లో అత్యధికంగా బుక్ అయ్యే పూజలు',
    popular_poojas_subtitle: 'కుటుంబ క్షేమం మరియు శ్రేయస్సు కోసం భక్తులు ఎంచుకున్న ప్రముఖ పూజలు.',

    // How It Works
    how_works_title: 'పూజా సేతు ఎలా పనిచేస్తుంది?',
    how_step1_title: '1. పూజ & ముహూర్తం ఎంచుకోండి',
    how_step1_desc: 'మీకు కావలసిన పూజను ఎంచుకుని, పంచాంగం ప్రకారం శుభ ముహూర్తాన్ని నిర్ణయించుకోండి.',
    how_step2_title: '2. వేద పండితుడిని ఎంపిక చేసుకోండి',
    how_step2_desc: 'మీ సంప్రదాయానికి చెందిన (స్మార్త, మాధ్వ, శ్రీ వైష్ణవ) నిపుణులైన పురోహితులను ఎంచుకోండి.',
    how_step3_title: '3. మీ ఇంట పూజా నిర్వహణ',
    how_step3_desc: 'పురోహితులు శుద్ధమైన పూజా సామాగ్రితో మీ ఇంటికి వస్తారు. పూజ పూర్తయ్యాక దక్షిణ చెల్లించండి.',

    // All Poojas Page
    all_poojas_header: 'అన్ని వైదిక పూజలు',
    all_poojas_filter_tradition: 'సంప్రదాయం ప్రకారం వడపోత',
    all_poojas_filter_category: 'పూజా విభాగాలు',
    all_poojas_sort_by: 'క్రమబద్ధీకరించండి',
    all_poojas_sort_popular: 'అత్యధిక బుకింగ్స్',
    all_poojas_sort_low_high: 'ధర: తక్కువ నుండి ఎక్కువ',
    all_poojas_sort_high_low: 'ధర: ఎక్కువ నుండి తక్కువ',
    all_poojas_showing: '{count} పూజలు అందుబాటులో ఉన్నాయి',
    all_poojas_no_results: 'ఎంచుకున్న సంప్రదాయానికి పూజలు లేవు. "అన్ని సంప్రదాయాలు" ఎంచుకోండి.',

    // Pooja Details Page
    pooja_detail_back: 'పూజల జాబితాకు తిరిగి వెళ్లండి',
    pooja_detail_includes: 'పూజలో చేర్చబడినవి',
    pooja_detail_samagri_included: 'శుద్ధమైన పూజా సామాగ్రి కిట్',
    pooja_detail_purohit_dakshina: 'వేద పండితుల దక్షిణ',
    pooja_detail_family_arranges: 'ఇంటి వద్ద కుటుంబ సభ్యులు సమకూర్చుకోవలసినవి',
    pooja_detail_faqs: 'తరచుగా అడిగే వైదిక ప్రశ్నలు',
    pooja_detail_book_cta: 'పూజ ఇప్పుడే బుక్ చేసుకోండి',

    // Booking Page
    booking_step1: '1. సమయం & వేదిక',
    booking_step2: '2. పురోహితులు',
    booking_step3: '3. ప్యాకేజీ & అదనపు సేవలు',
    booking_step4: '4. సమీక్ష & నిర్ధారణ',
    booking_select_muhurtham: 'శుభ ముహూర్తాన్ని ఎంచుకోండి',
    booking_ceremony_address: 'పూజా వేదిక చిరునామా',
    booking_continue_purohit: 'పురోహితుల ఎంపికకు వెళ్లండి',
    booking_continue_package: 'వేదిక & సామాగ్రి వివరాలకు వెళ్లండి',
    booking_continue_review: 'సమీక్షకు వెళ్లండి',
    booking_confirm_pay: 'నిర్ధారించి చెల్లించండి',
    booking_catering_title: 'సాత్విక భోజనాలు (ఉల్లి, వెల్లుల్లి లేని వంటకాలు)',
    booking_catering_desc: 'ఆచార సంప్రదాయాలకు కట్టుబడి తయారుచేయబడిన శుద్ధ శాకాహార విందు.',
    booking_delivery_window: 'పూజా సామాగ్రి డెలివరీ సమయం',
    booking_free_cancellation: 'ముహూర్తానికి 72 గంటల ముందు వరకు ఉచిత రద్దు సదుపాయం కలదు.',

    // Profile Page
    profile_title: 'నా భక్త ప్రొఫైల్',
    profile_family_members: 'సంకల్పం కోసం కుటుంబ సభ్యుల వివరాలు',
    profile_family_desc: 'లైవ్ పూజా సంకల్పంలో వేద పండితులు పఠించే పేర్లు, గోత్రాలు మరియు జన్మ నక్షత్రాలు.',
    profile_add_member: 'కుటుంబ సభ్యుడిని చేర్చండి',
    profile_saved_addresses: 'భద్రపరచబడిన చిరునామాలు',
    profile_vedic_identity: 'కుటుంబ & వైదిక గుర్తింపు',

    // Common
    common_loading: 'లోడ్ అవుతోంది...',
    common_cancel: 'రద్దు చేయండి',
    common_save: 'భద్రపరచండి',
    common_delete: 'తొలగించండి',
    common_edit: 'సవరించండి',
    common_success: 'విజయవంతమైంది',
    common_error: 'లోపం'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key, fallback) => fallback || key
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('pooja_sethu_lang');
    return saved === 'te' ? 'te' : 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('pooja_sethu_lang', newLang);
  };

  const t = (key: string, fallback?: string): string => {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
