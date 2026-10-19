import React, { useState, useEffect } from 'react';
import type { PoojaItem } from '../types';
import { getPoojaIllustration } from '../components/Illustrations';
import { HowItWorks } from '../components/HowItWorks';
import { apiRequest } from '../utils/apiClient';
import { showToast } from '../components/ToastNotification';
import { useLanguage } from '../context/LanguageContext';

interface PoojaDetailPageProps {
  pooja: PoojaItem;
  onNavigateHome: () => void;
  onNavigatePoojas: () => void;
  onStartBooking: (pooja: PoojaItem, selectedMuhurtham: string, selectedTradition: string) => void;
}

interface MuhurthamOption {
  id: string;
  date: string;
  time: string;
  tag: string;
  tagColor: string;
}

export const PoojaDetailPage: React.FC<PoojaDetailPageProps> = ({
  pooja,
  onNavigateHome,
  onNavigatePoojas,
  onStartBooking
}) => {
  const { lang } = useLanguage();
  const [selectedTradition, setSelectedTradition] = useState('Smartha');
  const [selectedMuhurtham, setSelectedMuhurtham] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Live Database Details State
  const [livePooja, setLivePooja] = useState<any>({
    title: pooja.title,
    subtitle: pooja.teluguTitle,
    desc: pooja.description,
    priceText: pooja.price ? `₹${pooja.price.toLocaleString('en-IN')} – ₹${Math.round(pooja.price * 1.45).toLocaleString('en-IN')}` : '₹4,300 – ₹6,400',
    duration: pooja.duration || '2.5 hrs'
  });

  const [vidhiSteps, setVidhiSteps] = useState<string[]>([
    'Vighneshwara Pooja',
    'Sankalpam',
    'Punyahavachanam',
    'Kalasha Sthapana and Pooja',
    'Agni Pratishtapana',
    'Pradhana Pooja & Homam',
    'Purnahuti',
    'Mangala Harathi and Mantra Pushpam',
    'Ashirvachanam and Teertha Prasadam'
  ]);

  const [samagriItems, setSamagriItems] = useState<string[]>([
    'Turmeric',
    'Kumkum',
    'Akshatalu (rice with turmeric)',
    'Loose flowers & flower garlands',
    'Betel leaves and nuts',
    'Coconuts',
    'Five fruits',
    'Cow ghee',
    'Camphor and agarbatti',
    'Kalasham (copper)',
    'Homa Kundam & Samidhalu',
    'Navadhanyalu (nine sacred grains)'
  ]);

  const [familyArranges, setFamilyArranges] = useState<string[]>([
    'A clean space about 6 × 6 ft, facing east',
    'Gotram and names of family members for Sankalpam',
    'Traditional attire for the Karta and spouse',
    'Fresh cow milk and a new vessel for boiling, if applicable',
    'A safe spot for the Homa Kundam with adequate ventilation'
  ]);

  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([
    {
      q: 'Is dakshina fixed?',
      a: 'Each Purohit sets dakshina transparently according to Vedic Shakha and experience. You see the exact amount before you book.'
    },
    {
      q: 'Who confirms the muhurtham?',
      a: 'We suggest auspicious Panchangam alignments, and our verified Purohit confirms the final muhurtham according to your family Janma Nakshatram.'
    }
  ]);

  const [muhurthamOptions, setMuhurthamOptions] = useState<MuhurthamOption[]>([
    {
      id: 'm1',
      date: 'Sun, 11 Oct',
      time: '7:12 – 9:04 AM',
      tag: 'Best',
      tagColor: 'green'
    },
    {
      id: 'm2',
      date: 'Thu, 22 Oct',
      time: '7:10 – 8:52 AM',
      tag: 'Good',
      tagColor: 'blue'
    },
    {
      id: 'm3',
      date: 'Sun, 25 Oct',
      time: '6:40 – 8:15 AM',
      tag: 'Filling fast',
      tagColor: 'orange'
    }
  ]);

  const traditions = ['Smartha', 'Madhva', 'Sri Vaishnava', 'Vaikhanasa', 'Not sure'];
  const [showAllSamagri, setShowAllSamagri] = useState(false);

  // 1. Fetch live Pooja Details from PostgreSQL database (/api/services/poojas/:id/details)
  useEffect(() => {
    let isMounted = true;
    const poojaIdentifier = pooja.id || encodeURIComponent(pooja.title);

    const loadDetails = async () => {
      try {
        const res = await apiRequest(`/api/services/poojas/${poojaIdentifier}/details?sampradayam=${encodeURIComponent(selectedTradition)}`, {
          timeoutMs: 8000
        });

        if (!isMounted) return;

        if (res.success && res.data) {
          const d = res.data;
          setLivePooja({
            id: d.id,
            title: d.title || pooja.title,
            subtitle: d.subtitle || pooja.teluguTitle,
            desc: d.desc || pooja.description,
            priceText: d.price || (pooja.price ? `₹${pooja.price.toLocaleString('en-IN')}` : '₹4,300 – ₹6,400'),
            duration: d.duration || pooja.duration || '2.5 hrs'
          });

          if (Array.isArray(d.vidhiSteps) && d.vidhiSteps.length > 0) {
            setVidhiSteps(d.vidhiSteps);
          }
          if (Array.isArray(d.samagriItems) && d.samagriItems.length > 0) {
            setSamagriItems(d.samagriItems);
          }
          if (Array.isArray(d.familyArranges) && d.familyArranges.length > 0) {
            setFamilyArranges(d.familyArranges);
          }
          if (Array.isArray(d.faqs) && d.faqs.length > 0) {
            const seen = new Set();
            const uniqueFaqs: { q: string; a: string }[] = [];
            for (const item of d.faqs) {
              if (item.q && !seen.has(item.q)) {
                seen.add(item.q);
                uniqueFaqs.push({ q: item.q, a: item.a });
              }
            }
            if (uniqueFaqs.length > 0) setFaqs(uniqueFaqs);
          }
        } else if (res.isDbOffline) {
          showToast({
            type: 'warning',
            message: 'Live pooja details unavailable (database offline). Displaying standard catalog values.'
          });
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('Failed to load pooja details:', err);
        }
      }
    };

    loadDetails();
    return () => {
      isMounted = false;
    };
  }, [pooja.id, pooja.title, selectedTradition]);

  // 2. Fetch live Muhurthams from database (/api/services/muhurthams)
  useEffect(() => {
    let isMounted = true;
    const loadMuhurthams = async () => {
      try {
        const res = await apiRequest(`/api/services/muhurthams?poojaId=${pooja.id || ''}`, { timeoutMs: 8000 });
        if (!isMounted) return;

        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const seen = new Set<string>();
          const mapped: MuhurthamOption[] = [];
          for (const m of res.data) {
            const date = m.date || 'Sun, 25 Oct';
            const time = m.time || '7:12 AM – 9:04 AM';
            const key = `${date}_${time}`.trim().toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);
            mapped.push({
              id: m.id,
              date,
              time,
              tag: m.tag || 'Auspicious',
              tagColor: m.tag === 'Best' ? 'green' : m.tag === 'Good' ? 'blue' : 'orange'
            });
          }
          setMuhurthamOptions(mapped.slice(0, 4));
          if (!selectedMuhurtham && mapped.length > 0) {
            setSelectedMuhurtham(`${mapped[0].date} · ${mapped[0].time}`);
          }
        }
      } catch (err: any) {
        if (isMounted) console.warn('Muhurtham load notice:', err);
      }
    };

    loadMuhurthams();
    return () => {
      isMounted = false;
    };
  }, [pooja.id]);

  const renderArtwork = (title: string) => {
    return getPoojaIllustration(title, undefined, "w-full h-full");
  };

  const categoryNameMap: Record<string, string> = {
    gruha: 'Gruha',
    samskaras: 'Samskaras',
    vratams: 'Vratams',
    homams: 'Homams',
    pitru: 'Pitru Karyams',
    festivals: 'Festivals',
    business: 'Business and vehicle'
  };

  return (
    <div className="pooja-detail-page">
      {/* Top Header with Prominent Back Button */}
      <div className="detail-top-nav-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
        <button 
          type="button"
          onClick={onNavigatePoojas}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            background: '#FFFFFF',
            border: '1px solid #D9D2C9',
            borderRadius: '8px',
            color: '#7C1B2C',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer'
          }}
        >
          {lang === 'te' ? '← పూజల జాబితాకు' : lang === 'hi' ? '← पूजा सूची पर' : '← Back to Poojas'}
        </button>
        <nav className="detail-breadcrumb" style={{ margin: 0 }}>
          <button className="breadcrumb-link" onClick={onNavigateHome}>
            {lang === 'te' ? 'హోమ్' : lang === 'hi' ? 'होम' : 'Home'}
          </button>
          <span className="breadcrumb-sep">›</span>
          <button className="breadcrumb-link" onClick={onNavigatePoojas}>
            {categoryNameMap[pooja.category] || (lang === 'te' ? 'పూజలు' : lang === 'hi' ? 'पूजाएँ' : 'Poojas')}
          </button>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{livePooja.title}</span>
        </nav>
      </div>

      {/* Main 2-column layout */}
      <div className="detail-layout">
        {/* Left Column: Details & Steps */}
        <div className="detail-main-col">
          {/* Hero Banner Card */}
          <div className="detail-hero-card">
            <div className="detail-hero-artwork">
              {renderArtwork(pooja.title)}
            </div>

            <div className="detail-hero-content">
              <div className="detail-title-row">
                <h1 className="detail-title font-sans">{livePooja.title}</h1>
                <span className="detail-telugu-title font-telugu">{livePooja.subtitle}</span>
              </div>

              {/* Badges */}
              <div className="detail-badges-row">
                <span className="badge-pill duration-badge">{livePooja.duration}</span>
                <span className="badge-pill dakshina-badge">
                  Dakshina {livePooja.priceText}
                </span>
                <span className="badge-pill tradition-badge">{selectedTradition} Vidhi</span>
              </div>

              <p className="detail-description">{livePooja.desc}</p>
            </div>
          </div>

          {/* Section: Ritual Steps from Database */}
          <div className="detail-section-card">
            <h3 className="section-title">
              {lang === 'te'
                ? 'వైదిక పూజా విధానం'
                : lang === 'hi'
                ? 'वैदिक पूजा विधि चरण'
                : 'Ritual Vidhi Steps'} · {vidhiSteps.length} {lang === 'te' ? 'దశలు' : lang === 'hi' ? 'चरण' : 'Steps'}
            </h3>
            <div className="ritual-steps-list">
              {vidhiSteps.map((step, idx) => (
                <div key={idx} className="ritual-step-item">
                  <div className="step-num-circle">{idx + 1}</div>
                  <div className="step-text-box">
                    <h4 className="step-title">{step}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Pooja Samagri from Database */}
          <div className="detail-section-card">
            <div className="samagri-card-header">
              <h3 className="section-title">
                {lang === 'te' ? 'పూజా సామాగ్రి' : lang === 'hi' ? 'पूजा सामग्री' : 'Pooja Samagri'} · {samagriItems.length} {lang === 'te' ? 'వస్తువులు' : lang === 'hi' ? 'वस्तुएं' : 'items'}
              </h3>
              <span className="samagri-included-pill">
                {lang === 'te' ? 'కిట్‌లో చేర్చబడినవి' : lang === 'hi' ? 'किट में सम्मिलित' : 'Included in package kit'}
              </span>
            </div>

            <div className="samagri-tags-grid">
              {(showAllSamagri ? samagriItems : samagriItems.slice(0, 8)).map((item, idx) => (
                <div key={idx} className="samagri-tag-pill">
                  <span className="samagri-check">✔</span>
                  <span className="samagri-name">{item}</span>
                </div>
              ))}
            </div>

            {samagriItems.length > 8 && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  className="samagri-toggle-btn"
                  onClick={() => setShowAllSamagri(!showAllSamagri)}
                >
                  {showAllSamagri 
                    ? (lang === 'te' ? 'తక్కువ వస్తువులు చూడండి ▲' : lang === 'hi' ? 'कम देखें ▲' : 'See less ▲')
                    : (lang === 'te'
                        ? `మరిన్ని చూడండి (${samagriItems.length - 8} మరిన్ని వస్తువులు) ▼`
                        : lang === 'hi'
                        ? `अधिक देखें (${samagriItems.length - 8} अन्य वस्तुएं) ▼`
                        : `See more (${samagriItems.length - 8} more items) ▼`)}
                </button>
              </div>
            )}
          </div>

          {/* Section: What the family arranges from Database */}
          <div className="detail-section-card">
            <h3 className="section-title">
              {lang === 'te' ? 'ఇంటి వద్ద సిద్ధం చేసుకోవలసినవి' : lang === 'hi' ? 'घर पर की जाने वाली व्यवस्था' : 'What the family arranges'}
            </h3>
            <ul className="family-arranges-list">
              {familyArranges.map((task, idx) => (
                <li key={idx}>{task}</li>
              ))}
            </ul>
          </div>

          {/* Section: Questions families ask */}
          <div className="detail-section-card">
            <h3 className="section-title">
              {lang === 'te' ? 'తరచుగా అడిగే వైదిక ప్రశ్నలు' : lang === 'hi' ? 'अक्सर पूछे जाने वाले वैदिक प्रश्न' : 'Frequently Asked Questions'}
            </h3>
            <div className="faqs-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="faq-item">
                    <button 
                      type="button"
                      className="faq-question-btn"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                    >
                      <span className="faq-arrow">{isOpen ? '▼' : '▶'}</span>
                      <span className="faq-question-text">{faq.q}</span>
                    </button>
                    {isOpen && (
                      <div className="faq-answer-box">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar: Book this Pooja */}
        <div className="detail-sidebar-col">
          <div className="booking-card-sticky">
            <h2 className="booking-card-title">
              {lang === 'te' ? 'పూజను బుక్ చేయండి' : lang === 'hi' ? 'यह पूजा बुक करें' : 'Book this Pooja'}
            </h2>
            <p className="booking-card-subtitle">
              {lang === 'te'
                ? 'విధి మరియు సామాగ్రి సంప్రదాయం ప్రకారం మారుతాయి.'
                : lang === 'hi'
                ? 'विधि एवं सामग्री संप्रदाय अनुसार भिन्न होती है।'
                : 'Vidhi and Samagri differ by tradition.'}
            </p>

            {/* Sampradayam Selector */}
            <div className="booking-group">
              <label className="booking-group-label">
                {lang === 'te' ? 'మీ సంప్రదాయం' : lang === 'hi' ? 'आपका संप्रदाय' : 'YOUR SAMPRADAYAM'}
              </label>
              <div className="tradition-pills-wrap">
                {traditions.map((trad) => {
                  const isActive = selectedTradition === trad;
                  return (
                    <button
                      key={trad}
                      type="button"
                      className={`trad-pill-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedTradition(trad)}
                    >
                      {trad}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Suggested Muhurtham Options from Database */}
            <div className="booking-group">
              <div className="muhurtham-label-row">
                <label className="booking-group-label">
                  {lang === 'te' ? 'శుభ ముహూర్తాలు' : lang === 'hi' ? 'सुझाए गए शुभ मुहूर्त' : 'SUGGESTED MUHURTHAM'}
                </label>
                <span className="muhurtham-badge">
                  {lang === 'te' ? 'శుభ సమయం' : lang === 'hi' ? 'शुभ समय' : 'AUSPICIOUS'}
                </span>
              </div>

              <div className="muhurtham-options-list">
                {muhurthamOptions.map((opt) => {
                  const fullStr = `${opt.date} · ${opt.time}`;
                  const isSelected = selectedMuhurtham === fullStr;
                  return (
                    <label 
                      key={opt.id} 
                      className={`muhurtham-radio-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedMuhurtham(fullStr)}
                    >
                      <input 
                        type="radio" 
                        name="muhurtham" 
                        checked={isSelected}
                        onChange={() => setSelectedMuhurtham(fullStr)}
                        className="radio-input"
                      />
                      <div className="muhurtham-card-info">
                        <div className="muhurtham-card-datetime">
                          <strong>{opt.date}</strong>
                          <span className="datetime-sub">{opt.time}</span>
                        </div>
                      </div>
                      <span className={`status-pill pill-${opt.tagColor}`}>
                        {opt.tag}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Summary Details */}
            <div className="booking-details-rows">
              <div className="detail-row">
                <span className="detail-label">
                  {lang === 'te' ? 'అంచనా దక్షిణ' : lang === 'hi' ? 'अनुमानित दक्षिणा' : 'Dakshina estimate'}
                </span>
                <span className="detail-val">{livePooja.priceText}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">
                  {lang === 'te' ? 'సమయం' : lang === 'hi' ? 'अवधि' : 'Duration'}
                </span>
                <span className="detail-val">{livePooja.duration}</span>
              </div>
            </div>

            {/* Action CTA */}
            <button 
              type="button"
              className="btn-continue-booking"
              onClick={() => {
                const targetSlot = selectedMuhurtham || (muhurthamOptions.length > 0 ? `${muhurthamOptions[0].date} · ${muhurthamOptions[0].time}` : 'Sun, 25 Oct · 7:12 AM – 9:04 AM');
                onStartBooking(
                  {
                    ...pooja,
                    title: livePooja.title,
                    teluguTitle: livePooja.subtitle,
                    duration: livePooja.duration
                  },
                  targetSlot,
                  selectedTradition
                );
              }}
            >
              {lang === 'te' ? 'బుకింగ్‌కు వెళ్లండి' : lang === 'hi' ? 'बुकिंग के लिए आगे बढ़ें' : 'Continue to booking'}
            </button>

            <p className="sidebar-reassurance">
              {lang === 'te'
                ? 'ఇప్పుడే చెల్లింపు అవసరం లేదు · మీరు పురోహితులను, సామాగ్రిని మరియు భోజనాలను తదుపరి దశలో ఎంచుకోవచ్చు.'
                : lang === 'hi'
                ? 'अभी भुगतान की आवश्यकता नहीं · आप अगले चरण में पुरोहित, सामग्री और भोजन चुन सकते हैं।'
                : 'No payment now · You can review the complete Vidhi, select verified Purohits, and add Bhojanalu next.'}
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="detail-how-it-works-wrap">
        <HowItWorks />
      </div>

      <style>{`
        .pooja-detail-page {
          padding-top: 16px;
          padding-bottom: 60px;
        }

        .detail-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
        }

        .breadcrumb-link {
          color: var(--primary-maroon, #7C1B2C);
          font-weight: 600;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .breadcrumb-link:hover {
          text-decoration: underline;
        }

        .breadcrumb-sep {
          color: var(--text-light, #999);
        }

        .breadcrumb-current {
          color: var(--text-dark, #1a1a1a);
          font-weight: 600;
        }

        .detail-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 32px;
          align-items: start;
        }

        .detail-main-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .detail-hero-card {
          background: #FFFFFF;
          border: 1px solid #EFEAE2;
          border-radius: 16px;
          padding: 32px;
          display: flex;
          gap: 28px;
          align-items: flex-start;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
        }

        .detail-hero-artwork {
          width: 140px;
          height: 140px;
          border-radius: 14px;
          background: #FFF5E6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
          padding: 12px;
        }

        .detail-hero-content {
          flex: 1;
        }

        .detail-title-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .detail-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.2;
        }

        .detail-telugu-title {
          font-size: 1.4rem;
          color: #7C1B2C;
          font-weight: 600;
        }

        .detail-badges-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .badge-pill {
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .duration-badge {
          background: #F4EFE6;
          color: #4A4441;
        }

        .dakshina-badge {
          background: #FBEBE8;
          color: #7C1B2C;
          font-weight: 700;
        }

        .tradition-badge {
          background: #E8F5E9;
          color: #15803D;
        }

        .detail-description {
          font-size: 0.98rem;
          line-height: 1.6;
          color: #4A4441;
          margin: 0;
        }

        .detail-section-card {
          background: #FFFFFF;
          border: 1px solid #EFEAE2;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 18px;
        }

        .ritual-steps-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .ritual-step-item {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .step-num-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #8C2534;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .step-title {
          font-size: 0.98rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .samagri-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .samagri-included-pill {
          background: #DCFCE7;
          color: #15803D;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
        }

        .samagri-tags-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .samagri-tag-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #F9F7F4;
          border-radius: 8px;
          border: 1px solid #EAE5DE;
        }

        .samagri-check {
          color: #15803D;
          font-weight: 800;
        }

        .samagri-name {
          font-size: 0.92rem;
          color: #1a1a1a;
          font-weight: 500;
        }

        .samagri-toggle-btn {
          background-color: #FDF9F3;
          border: 1px solid #D9CEB2;
          color: #7C1B2C;
          font-weight: 600;
          font-size: 0.88rem;
          padding: 8px 24px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .samagri-toggle-btn:hover {
          background-color: #7C1B2C;
          border-color: #7C1B2C;
          color: #FFFFFF;
          transform: translateY(-1px);
        }

        .family-arranges-list {
          margin: 0;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          color: #4A4441;
          font-size: 0.96rem;
          line-height: 1.5;
        }

        .faqs-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .faq-item {
          border-bottom: 1px solid #F4EFE6;
          padding-bottom: 12px;
        }

        .faq-question-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          padding: 6px 0;
        }

        .faq-arrow {
          font-size: 0.8rem;
          color: #8C2534;
        }

        .faq-question-text {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .faq-answer-box {
          padding-left: 20px;
          padding-top: 8px;
          font-size: 0.92rem;
          line-height: 1.6;
          color: #4A4441;
        }

        .booking-card-sticky {
          position: sticky;
          top: 86px;
          background: #FFFFFF;
          border: 1px solid #EFEAE2;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .booking-card-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .booking-card-subtitle {
          font-size: 0.85rem;
          color: #666666;
          margin-bottom: 20px;
        }

        .booking-group {
          margin-bottom: 20px;
        }

        .booking-group-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 800;
          color: #716964;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
        }

        .tradition-pills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .trad-pill-btn {
          padding: 6px 12px;
          border-radius: 9999px;
          border: 1px solid #D9D2C9;
          background: #FFFFFF;
          color: #4A4441;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .trad-pill-btn.active {
          background: #8C2534;
          border-color: #8C2534;
          color: #FFFFFF;
        }

        .muhurtham-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .muhurtham-badge {
          font-size: 0.7rem;
          font-weight: 800;
          color: #15803D;
        }

        .muhurtham-options-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .muhurtham-radio-card {
          display: flex;
          align-items: center;
          padding: 12px 14px;
          border: 1px solid #EAE5DE;
          border-radius: 10px;
          background: #FFFFFF;
          cursor: pointer;
          transition: all 0.15s ease;
          gap: 12px;
        }

        .muhurtham-radio-card.selected {
          border-color: #8C2534;
          background: #FFFDFD;
        }

        .radio-input {
          accent-color: #8C2534;
          width: 16px;
          height: 16px;
        }

        .muhurtham-card-info {
          flex: 1;
        }

        .muhurtham-card-datetime strong {
          display: block;
          font-size: 0.92rem;
          color: #1a1a1a;
        }

        .datetime-sub {
          font-size: 0.8rem;
          color: #666666;
        }

        .status-pill {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .pill-green { background: #DCFCE7; color: #15803D; }
        .pill-blue { background: #E0F2FE; color: #0369A1; }
        .pill-orange { background: #FEF3C7; color: #B45309; }

        .booking-details-rows {
          border-top: 1px solid #F4EFE6;
          border-bottom: 1px solid #F4EFE6;
          padding: 14px 0;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
        }

        .detail-label {
          color: #666666;
        }

        .detail-val {
          font-weight: 700;
          color: #1a1a1a;
        }

        .btn-continue-booking {
          width: 100%;
          padding: 14px;
          border-radius: 8px;
          border: none;
          background: #8C2534;
          color: #FFFFFF;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-continue-booking:hover {
          background: #731B28;
        }

        .sidebar-reassurance {
          font-size: 0.75rem;
          color: #716964;
          text-align: center;
          margin-top: 12px;
          line-height: 1.4;
        }

        .detail-how-it-works-wrap {
          margin-top: 40px;
        }

        @media (max-width: 900px) {
          .detail-layout {
            grid-template-columns: 1fr;
          }
          .detail-hero-card {
            flex-direction: column;
          }
          .samagri-tags-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
