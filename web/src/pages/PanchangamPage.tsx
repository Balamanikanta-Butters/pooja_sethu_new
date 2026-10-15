import React, { useState } from 'react';

interface PanchangamPageProps {
  onNavigateHome?: () => void;
  onNavigatePoojas: () => void;
}

export const PanchangamPage: React.FC<PanchangamPageProps> = ({ onNavigateHome, onNavigatePoojas }) => {
  const [dateOffset, setDateOffset] = useState(0);

  // Panchangam days data
  const panchangamDays = [
    {
      dateStr: 'Friday, 2 October',
      special: 'Mahalaya Paksham: Sasthi Shraddham and Tarpanam.',
      elements: {
        masam: 'Bhadrapada · Parabhava',
        vaaram: 'Shukravaram',
        tithi: 'Bahula Sasthi',
        nakshatram: 'Rohini',
        yogam: 'Variyan',
        karanam: 'Taitila',
        sun: '6:05 AM · 5:59 PM'
      },
      timings: [
        { type: 'good', label: 'Amrita Kalam', time: '9:15 – 10:50 AM' },
        { type: 'good', label: 'Abhijit', time: '11:40 AM – 12:28 PM' },
        { type: 'avoid', label: 'Rahu Kalam', time: '10:30 AM – 12:00 PM' },
        { type: 'avoid', label: 'Yamagandam', time: '3:00 – 4:30 PM' },
        { type: 'avoid', label: 'Gulika', time: '7:30 – 9:00 AM' },
        { type: 'avoid', label: 'Durmuhurtham', time: '8:30 – 9:18 AM' }
      ]
    },
    {
      dateStr: 'Saturday, 3 October',
      special: 'Mahalaya Paksham: an auspicious fortnight for Pitru Tarpanam and Shraddha.',
      elements: {
        masam: 'Bhadrapada · Parabhava',
        vaaram: 'Shanivaram',
        tithi: 'Bahula Saptami',
        nakshatram: 'Mrigasira',
        yogam: 'Vyatipata',
        karanam: 'Bava',
        sun: '6:05 AM · 5:58 PM'
      },
      timings: [
        { type: 'good', label: 'Amrita Kalam', time: '10:42 – 12:18 PM' },
        { type: 'good', label: 'Abhijit', time: '11:38 AM – 12:25 PM' },
        { type: 'avoid', label: 'Rahu Kalam', time: '9:00 – 10:30 AM' },
        { type: 'avoid', label: 'Yamagandam', time: '1:30 – 3:00 PM' },
        { type: 'avoid', label: 'Gulika', time: '6:00 – 7:30 AM' },
        { type: 'avoid', label: 'Durmuhurtham', time: '6:05 – 7:41 AM' }
      ]
    },
    {
      dateStr: 'Sunday, 4 October',
      special: 'Mahalaya Paksham: Madhyashtami - especially auspicious for all Pitru devatas.',
      elements: {
        masam: 'Bhadrapada · Parabhava',
        vaaram: 'Aadivaram',
        tithi: 'Bahula Ashtami',
        nakshatram: 'Ardra',
        yogam: 'Variyan',
        karanam: 'Balava',
        sun: '6:06 AM · 5:57 PM'
      },
      timings: [
        { type: 'good', label: 'Amrita Kalam', time: '1:10 – 2:45 PM' },
        { type: 'good', label: 'Abhijit', time: '11:37 AM – 12:24 PM' },
        { type: 'avoid', label: 'Rahu Kalam', time: '4:30 – 6:00 PM' },
        { type: 'avoid', label: 'Yamagandam', time: '12:00 – 1:30 PM' },
        { type: 'avoid', label: 'Gulika', time: '3:00 – 4:30 PM' },
        { type: 'avoid', label: 'Durmuhurtham', time: '4:20 – 5:08 PM' }
      ]
    }
  ];

  // Base day index 1 = Saturday, 3 October
  const currentDayIndex = Math.min(Math.max(1 + dateOffset, 0), panchangamDays.length - 1);
  const currentDay = panchangamDays[currentDayIndex];

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
            ← Back to Home
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#666' }}>
            <button 
              type="button" 
              onClick={onNavigateHome}
              style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 0 }}
            >
              Home
            </button>
            <span>/</span>
            <span style={{ color: '#1B1510', fontWeight: 600 }}>Panchangam</span>
          </div>
        </div>
      )}

      {/* Header Row */}
      <div className="panchangam-header-row">
        <div>
          <h1 className="panchangam-title font-sans">Panchangam</h1>
          <p className="panchangam-subtitle">Hyderabad · Daily Vedic Calendar & Timings</p>
        </div>

        {/* Date Stepper Controls */}
        <div className="date-stepper-box">
          <button 
            className="stepper-arrow-btn"
            onClick={() => setDateOffset(prev => Math.max(prev - 1, -1))}
            disabled={currentDayIndex === 0}
            title="Previous Day"
          >
            ‹
          </button>
          <span className="stepper-date-text">{currentDay.dateStr}</span>
          <button 
            className="stepper-arrow-btn"
            onClick={() => setDateOffset(prev => Math.min(prev + 1, 1))}
            disabled={currentDayIndex === panchangamDays.length - 1}
            title="Next Day"
          >
            ›
          </button>
        </div>
      </div>

      {/* Special Auspicious Fortnight Banner */}
      <div className="special-banner-card">
        <p className="special-banner-text">{currentDay.special}</p>
      </div>

      {/* Main 2-column Grid */}
      <div className="panchangam-grid">
        {/* Left Column: Panchanga Elements */}
        <div className="panchanga-card">
          <h3 className="card-heading">Panchanga elements</h3>

          <div className="elements-table">
            <div className="element-row">
              <span className="element-key">Masam</span>
              <span className="element-val">{currentDay.elements.masam}</span>
            </div>
            <div className="element-row">
              <span className="element-key">Vaaram</span>
              <span className="element-val">{currentDay.elements.vaaram}</span>
            </div>
            <div className="element-row">
              <span className="element-key">Tithi</span>
              <span className="element-val">{currentDay.elements.tithi}</span>
            </div>
            <div className="element-row">
              <span className="element-key">Nakshatram</span>
              <span className="element-val">{currentDay.elements.nakshatram}</span>
            </div>
            <div className="element-row">
              <span className="element-key">Yogam</span>
              <span className="element-val">{currentDay.elements.yogam}</span>
            </div>
            <div className="element-row">
              <span className="element-key">Karanam</span>
              <span className="element-val">{currentDay.elements.karanam}</span>
            </div>
            <div className="element-row no-border">
              <span className="element-key">Sunrise · Sunset</span>
              <span className="element-val">{currentDay.elements.sun}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Good times and times to avoid */}
        <div className="panchanga-card">
          <h3 className="card-heading">Good times and times to avoid</h3>

          <div className="timings-table">
            {currentDay.timings.map((t, idx) => (
              <div key={idx} className="timing-row">
                <div className="timing-badge-wrap">
                  <span className={`timing-pill ${t.type === 'good' ? 'pill-good' : 'pill-avoid'}`}>
                    {t.type === 'good' ? 'Good' : 'Avoid'}
                  </span>
                  <span className="timing-label">{t.label}</span>
                </div>
                <span className="timing-val">{t.time}</span>
              </div>
            ))}
          </div>

          {/* Action CTA: Find a Pooja for this day */}
          <button className="btn-find-pooja" onClick={onNavigatePoojas}>
            Find a Pooja for this day
          </button>
        </div>
      </div>

      <style>{`
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
