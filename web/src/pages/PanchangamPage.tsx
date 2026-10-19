import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/apiClient';
import { useLanguage } from '../context/LanguageContext';

interface PanchangamPageProps {
  onNavigateHome?: () => void;
  onNavigatePoojas: () => void;
}

interface RawPanchangamDay {
  day: string;
  samvatsaram?: string;
  masam?: string;
  paksham?: string;
  vaaram?: string;
  tithi?: string;
  nakshatram?: string;
  yogam?: string;
  karanam?: string;
  sunrise?: string;
  sunset?: string;
  good_periods?: Array<{ name: string; from: string; to: string }>;
  avoid_periods?: Array<{ name: string; from: string; to: string }>;
  significance?: { en?: string; te?: string; hi?: string } | string;
}

export const PanchangamPage: React.FC<PanchangamPageProps> = ({ onNavigateHome, onNavigatePoojas }) => {
  const { lang } = useLanguage();
  const [days, setDays] = useState<RawPanchangamDay[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPanchangam = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest('/api/panchangam', { timeoutMs: 8000 });
        if (!isMounted) return;

        if (res.success && res.data) {
          const rawDays: RawPanchangamDay[] = Array.isArray(res.data.panchangam) 
            ? res.data.panchangam 
            : (Array.isArray(res.data) ? res.data : []);

          if (rawDays.length > 0) {
            // Sort by day ascending
            const sorted = [...rawDays].sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
            setDays(sorted);

            // Find today's index
            const todayStr = new Date().toDateString();
            const todayIdx = sorted.findIndex(d => new Date(d.day).toDateString() === todayStr);
            if (todayIdx >= 0) {
              setSelectedIndex(todayIdx);
            } else {
              setSelectedIndex(0);
            }
          } else {
            setError('No panchangam data found in database.');
          }
        } else {
          setError(res.error || 'Failed to connect to database for panchangam.');
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Error loading panchangam.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPanchangam();
    return () => { isMounted = false; };
  }, []);

  const currentDay = days[selectedIndex];

  // Helper formatting
  const formatDateStr = (dateVal?: string) => {
    if (!dateVal) return lang === 'te' ? 'నేడు' : lang === 'hi' ? 'आज' : 'Today';
    const d = new Date(dateVal);
    const locale = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
    return d.toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: 'Asia/Kolkata'
    });
  };

  const getSpecialNote = (day?: RawPanchangamDay) => {
    if (!day) return '';
    if (typeof day.significance === 'object') {
      if (lang === 'te' && day.significance?.te) return day.significance.te;
      if (lang === 'hi' && day.significance?.hi) return day.significance.hi;
      if (day.significance?.en) return day.significance.en;
    }
    if (typeof day.significance === 'string' && day.significance.trim()) {
      return day.significance;
    }
    return lang === 'te' 
      ? `${day.tithi || 'శుభ దినం'} · పూజలు, హోమాలకు అనుకూలమైన పవిత్ర సమయం.`
      : lang === 'hi'
      ? `${day.tithi || 'शुभ दिवस'} · पूजा, हवन एवं मंगल कार्यों के लिए अत्यंत शुभ समय।`
      : `${day.tithi || 'Sacred'} · Auspicious period for pujas, havans, and divine blessings.`;
  };

  const timings: Array<{ type: 'good' | 'avoid'; label: string; time: string }> = [];
  if (currentDay) {
    if (Array.isArray(currentDay.good_periods)) {
      currentDay.good_periods.forEach(p => {
        if (p && p.name) {
          timings.push({ type: 'good', label: p.name, time: `${p.from} – ${p.to}` });
        }
      });
    }
    if (Array.isArray(currentDay.avoid_periods)) {
      currentDay.avoid_periods.forEach(p => {
        if (p && p.name) {
          timings.push({ type: 'avoid', label: p.name, time: `${p.from} – ${p.to}` });
        }
      });
    }
  }

  return (
    <div className="panchangam-page-root">
      {/* Top Navigation Row with Back Button */}
      {onNavigateHome && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
          <button 
            type="button"
            onClick={onNavigateHome}
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
            {lang === 'te' ? '← హోమ్‌కు తిరిగి వెళ్లండి' : lang === 'hi' ? '← होम पर वापस जाएँ' : '← Back to Home'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#666' }}>
            <button 
              type="button" 
              onClick={onNavigateHome}
              style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 0 }}
            >
              {lang === 'te' ? 'హోమ్' : lang === 'hi' ? 'होम' : 'Home'}
            </button>
            <span>/</span>
            <span style={{ color: '#1B1510', fontWeight: 600 }}>{lang === 'te' ? 'పంచాంగం' : lang === 'hi' ? 'पंचांग' : 'Panchangam'}</span>
          </div>
        </div>
      )}

      {/* Header Row */}
      <div className="panchangam-header-row">
        <div>
          <h1 className="panchangam-title font-sans">
            {lang === 'te' ? 'దైనందిన పంచాంగం' : lang === 'hi' ? 'दैनिक वैदिक पंचांग' : 'Panchangam'}
          </h1>
          <p className="panchangam-subtitle">
            {lang === 'te'
              ? 'హైదరాబాద్ · వైదిక పంచాంగం మరియు శుభ ముహూర్త సమయాలు'
              : lang === 'hi'
              ? 'हैदराबाद · दैनिक वैदिक पंचांग एवं शुभ मुहूर्त समय'
              : 'Hyderabad · Daily Vedic Calendar & Timings from Database'}
          </p>
        </div>

        {/* Date Stepper Controls */}
        {days.length > 0 && (
          <div className="date-stepper-box">
            <button 
              className="stepper-arrow-btn"
              onClick={() => setSelectedIndex(prev => Math.max(prev - 1, 0))}
              disabled={selectedIndex === 0}
              title="Previous Day"
            >
              ‹
            </button>
            <span className="stepper-date-text">{formatDateStr(currentDay?.day)}</span>
            <button 
              className="stepper-arrow-btn"
              onClick={() => setSelectedIndex(prev => Math.min(prev + 1, days.length - 1))}
              disabled={selectedIndex === days.length - 1}
              title="Next Day"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#888' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 16px', width: '36px', height: '36px', border: '3px solid #EFEAE2', borderTopColor: '#7C1B2C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p>{lang === 'te' ? 'పంచాంగ వివరాలు లోడ్ అవుతున్నాయి...' : lang === 'hi' ? 'पंचांग विवरण लोड हो रहे हैं...' : 'Connecting to database & loading Vedic Panchangam...'}</p>
        </div>
      )}

      {error && !loading && (
        <div style={{ padding: '24px', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '12px', color: '#991B1B', margin: '20px 0' }}>
          <strong>Panchangam Offline:</strong> {error}
        </div>
      )}

      {!loading && currentDay && (
        <>
          {/* Special Auspicious Banner */}
          <div className="special-banner-card">
            <p className="special-banner-text">{getSpecialNote(currentDay)}</p>
          </div>

          {/* Main 2-column Grid */}
          <div className="panchangam-grid">
            {/* Left Column: Panchanga Elements */}
            <div className="panchanga-card">
              <h3 className="card-heading">{lang === 'te' ? 'పంచాంగ అంశాలు' : lang === 'hi' ? 'पंचांग तत्व' : 'Panchanga elements'}</h3>

              <div className="elements-table">
                <div className="element-row">
                  <span className="element-key">{lang === 'te' ? 'మాసం & సంవత్సరం' : lang === 'hi' ? 'मास एवं संवत्सर' : 'Masam & Samvatsaram'}</span>
                  <span className="element-val">{currentDay.masam || '—'}{currentDay.samvatsaram ? ` · ${currentDay.samvatsaram}` : ''}</span>
                </div>
                <div className="element-row">
                  <span className="element-key">{lang === 'te' ? 'వారం' : lang === 'hi' ? 'वार' : 'Vaaram'}</span>
                  <span className="element-val">{currentDay.vaaram || '—'}</span>
                </div>
                <div className="element-row">
                  <span className="element-key">{lang === 'te' ? 'తిథి' : lang === 'hi' ? 'तिथि' : 'Tithi'}</span>
                  <span className="element-val">{currentDay.tithi || '—'}{currentDay.paksham ? ` (${currentDay.paksham} Paksham)` : ''}</span>
                </div>
                <div className="element-row">
                  <span className="element-key">{lang === 'te' ? 'నక్షత్రం' : lang === 'hi' ? 'नक्षत्र' : 'Nakshatram'}</span>
                  <span className="element-val">{currentDay.nakshatram || '—'}</span>
                </div>
                <div className="element-row">
                  <span className="element-key">{lang === 'te' ? 'యోగం' : lang === 'hi' ? 'योग' : 'Yogam'}</span>
                  <span className="element-val">{currentDay.yogam || 'Variyan'}</span>
                </div>
                <div className="element-row">
                  <span className="element-key">{lang === 'te' ? 'కరణం' : lang === 'hi' ? 'करण' : 'Karanam'}</span>
                  <span className="element-val">{currentDay.karanam || 'Taitila'}</span>
                </div>
                <div className="element-row no-border">
                  <span className="element-key">{lang === 'te' ? 'సూర్యోదయం · సూర్యాస్తమయం' : lang === 'hi' ? 'सूर्योदय · सूर्यास्त' : 'Sunrise · Sunset'}</span>
                  <span className="element-val">
                    {currentDay.sunrise ? currentDay.sunrise.slice(0, 5) : '06:06 AM'} · {currentDay.sunset ? currentDay.sunset.slice(0, 5) : '05:55 PM'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Good times and times to avoid */}
            <div className="panchanga-card">
              <h3 className="card-heading">{lang === 'te' ? 'శుభ & వర్జ్య సమయాలు' : lang === 'hi' ? 'शुभ एवं वर्ज्य समय' : 'Good times and times to avoid'}</h3>

              <div className="timings-table">
                {timings.length > 0 ? (
                  timings.map((t, idx) => (
                    <div key={idx} className="timing-row">
                      <div className="timing-badge-wrap">
                        <span className={`timing-pill ${t.type === 'good' ? 'pill-good' : 'pill-avoid'}`}>
                          {t.type === 'good'
                            ? (lang === 'te' ? 'శుభం' : lang === 'hi' ? 'शुभ' : 'Good')
                            : (lang === 'te' ? 'వర్జ్యం' : lang === 'hi' ? 'वर्ज्य' : 'Avoid')}
                        </span>
                        <span className="timing-label">{t.label}</span>
                      </div>
                      <span className="timing-val">{t.time}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#888', padding: '12px 0' }}>
                    {lang === 'te'
                      ? 'ఎటువంటి వర్జ్య సమయాలు లేవు.'
                      : lang === 'hi'
                      ? 'इस दिन के लिए कोई विशेष वर्ज्य समय नहीं है।'
                      : 'No restrictive timings specified for this day.'}
                  </p>
                )}
              </div>

              {/* Action CTA: Find a Pooja for this day */}
              <button className="btn-find-pooja" onClick={onNavigatePoojas}>
                {lang === 'te' ? 'ఈ రోజుకు తగిన పూజను కనుగొనండి' : lang === 'hi' ? 'इस दिन के लिए पूजा चुनें' : 'Find a Pooja for this day'}
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        .panchangam-page-root {
          padding-top: 16px;
          padding-bottom: 80px;
        }

        .panchangam-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .panchangam-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-dark);
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }

        .panchangam-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
        }

        .date-stepper-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          padding: 6px 14px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .stepper-arrow-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border-light);
          background: #FFFFFF;
          color: var(--text-dark);
          font-size: 1.2rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          line-height: 1;
        }

        .stepper-arrow-btn:hover:not(:disabled) {
          border-color: var(--primary-maroon);
          color: var(--primary-maroon);
          background: #FFF8F8;
        }

        .stepper-arrow-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .stepper-date-text {
          font-size: 0.96rem;
          font-weight: 700;
          color: var(--text-dark);
          min-width: 150px;
          text-align: center;
        }

        /* Auspicious Banner */
        .special-banner-card {
          background: #FDF4E5;
          border: 1px solid #F3DFB7;
          border-radius: var(--radius-lg);
          padding: 18px 24px;
          margin-bottom: 28px;
        }

        .special-banner-text {
          font-size: 0.98rem;
          color: #78350F;
          font-weight: 600;
          line-height: 1.5;
        }

        /* 2-Column Grid */
        .panchangam-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          align-items: start;
        }

        .panchanga-card {
          background: #FFFFFF;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-lg);
          padding: 28px 32px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
        }

        .card-heading {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 20px;
        }

        .elements-table, .timings-table {
          display: flex;
          flex-direction: column;
        }

        .element-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid #F4EFE6;
          font-size: 0.94rem;
        }

        .element-row.no-border {
          border-bottom: none;
        }

        .element-key {
          color: var(--text-muted);
          font-weight: 500;
        }

        .element-val {
          color: var(--text-dark);
          font-weight: 700;
        }

        .timing-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 13px 0;
          border-bottom: 1px solid #F4EFE6;
          font-size: 0.94rem;
        }

        .timing-row:last-child {
          border-bottom: none;
        }

        .timing-badge-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .timing-pill {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 4px;
          letter-spacing: 0.3px;
        }

        .pill-good {
          background: #E8F5E9;
          color: #2E7D32;
        }

        .pill-avoid {
          background: #FFEBEE;
          color: #C62828;
        }

        .timing-label {
          color: var(--text-dark);
          font-weight: 600;
        }

        .timing-val {
          color: var(--text-dark);
          font-weight: 700;
        }

        /* Action Button */
        .btn-find-pooja {
          margin-top: 24px;
          width: 100%;
          background: #741B28;
          color: #FFFFFF;
          border: none;
          padding: 14px 24px;
          border-radius: var(--radius-full);
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
          box-shadow: 0 4px 12px rgba(116, 27, 40, 0.2);
        }

        .btn-find-pooja:hover {
          background: #5A141F;
        }

        @media (max-width: 850px) {
          .panchangam-grid {
            grid-template-columns: 1fr;
          }
          .panchangam-header-row {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};
