import React, { useState, useEffect } from 'react';
import type { PanchangamData } from '../types';
import { apiRequest } from '../utils/apiClient';
import { useLanguage } from '../context/LanguageContext';

interface PanchangamCardProps {
  onOpenFullPanchangam: () => void;
}

export const PanchangamCard: React.FC<PanchangamCardProps> = ({ onOpenFullPanchangam }) => {
  const { t, lang } = useLanguage();
  const [data, setData] = useState<PanchangamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbOffline, setDbOffline] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadPanchangam = async () => {
      try {
        const res = await apiRequest('/api/panchangam/today', { timeoutMs: 8000 });
        if (!isMounted) return;
        if (res.success && res.data && (res.data.panchangam || res.data.today || res.data)) {
          const p = res.data.panchangam || res.data.today || res.data;
          const findPeriod = (list: any[], name: string) => {
            if (!Array.isArray(list)) return null;
            const match = list.find((item: any) => item?.name?.toLowerCase().includes(name.toLowerCase()));
            return match ? `${match.from} – ${match.to}` : null;
          };

          let formattedDate = lang === 'te' ? 'నేడు · హైదరాబాద్' : lang === 'hi' ? 'आज · हैदराबाद' : 'Today · Hyderabad';
          if (p.day) {
            const d = new Date(p.day);
            const locale = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
            const city = lang === 'te' ? 'హైదరాబాద్' : lang === 'hi' ? 'हैदराबाद' : 'Hyderabad';
            formattedDate = `${d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' })} · ${city}`;
          }

          const specialNote = (typeof p.significance === 'object' && p.significance?.en)
            ? (lang === 'te' && p.significance?.te ? p.significance.te : lang === 'hi' && p.significance?.hi ? p.significance.hi : p.significance.en)
            : (typeof p.significance === 'string' ? p.significance : (p.festivals || (lang === 'te' ? 'శుభ ముహూర్త దినం మరియు అర్చన.' : lang === 'hi' ? 'शुभ मुहूर्त दिवस एवं पवित्र अनुष्ठान।' : 'Auspicious muhurtham day for sacred ceremonies and archana.')));

          setData({
            dateStr: formattedDate,
            city: 'Hyderabad',
            specialNote: specialNote,
            tithi: p.tithi ? `${p.tithi}${p.paksham ? ' (' + p.paksham + ')' : ''}` : 'Shukla Paksha',
            nakshatram: p.nakshatram || p.nakshatra || 'Rohini',
            masam: p.masam ? `${p.masam}${p.samvatsaram ? ' · ' + p.samvatsaram : ''}` : 'Ashwayuja',
            sunriseSunset: p.sunrise && p.sunset ? `${p.sunrise.slice(0, 5)} · ${p.sunset.slice(0, 5)}` : '06:08 AM · 05:55 PM',
            amritaKalam: findPeriod(p.good_periods, 'amrita') || p.amrita_kalam || '10:15 – 11:45 AM',
            abhijit: findPeriod(p.good_periods, 'abhijit') || p.abhijit_muhurtham || '11:40 AM – 12:28 PM',
            rahuKalam: findPeriod(p.avoid_periods, 'rahu') || p.rahu_kalam || '01:30 – 03:00 PM',
            yamagandam: findPeriod(p.avoid_periods, 'yama') || p.yamagandam || '06:00 – 07:30 AM',
            durmuhurtham: findPeriod(p.avoid_periods, 'durmuhurtham') || p.durmuhurtham || '10:00 – 10:48 AM',
            varjyam: findPeriod(p.avoid_periods, 'varjyam') || p.varjyam || '03:30 – 05:00 PM',
            yogam: p.yogam || 'Variyan',
            karanam: p.karanam || 'Taitila',
            paksham: p.paksham || 'Shukla'
          });
        } else {
          setDbOffline(true);
        }
      } catch {
        if (isMounted) setDbOffline(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPanchangam();
    return () => { isMounted = false; };
  }, [lang]);

  if (loading) {
    return (
      <div className="panchangam-card" style={{ padding: '32px 24px', textAlign: 'center', color: '#888' }}>
        <p>{t('common_loading', "Connecting to database & loading today's Panchangam...")}</p>
      </div>
    );
  }

  if (dbOffline || !data) {
    return (
      <div className="panchangam-card" style={{ padding: '28px 24px', textAlign: 'center', border: '1px solid #E2D9C8' }}>
        <span className="today-pill" style={{ marginBottom: '10px' }}>{lang === 'te' ? 'నేడు' : lang === 'hi' ? 'आज' : 'TODAY'}</span>
        <h2 className="panchangam-title font-serif" style={{ margin: '8px 0' }}>{t('panchangam_title', "Today's Panchangam")}</h2>
        <p style={{ color: '#666', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 12px auto' }}>
          {lang === 'te'
            ? 'డేటాబేస్ సేవ ప్రస్తుతం ఆఫ్‌లైన్‌లో ఉంది. వేదిక పంచాంగ వివరాలు త్వరలో లోడ్ అవుతాయి.'
            : lang === 'hi'
            ? 'पंचांग डेटा शीघ्र ही उपलब्ध होगा।'
            : 'Database service is currently offline. Live Vedic Panchangam coordinates will automatically populate.'}
        </p>
      </div>
    );
  }

  return (
    <div className="panchangam-card">
      {/* Top Meta & Today Pill */}
      <div className="panchangam-header">
        <span className="panchangam-meta">{data.dateStr}</span>
        <span className="today-pill">{lang === 'te' ? 'నేడు' : lang === 'hi' ? 'आज' : 'TODAY'}</span>
      </div>

      {/* Card Title */}
      <h2 className="panchangam-title font-serif">{t('panchangam_title', "Today's Panchangam")}</h2>

      {/* Special Auspicious Note */}
      <p className="panchangam-note">{data.specialNote}</p>

      {/* Grid of Core Details */}
      <div className="panchangam-grid">
        <div className="grid-item">
          <span className="label">{t('panchangam_tithi', 'Tithi')}</span>
          <span className="val">{data.tithi}</span>
        </div>
        <div className="grid-item">
          <span className="label">{t('panchangam_nakshatram', 'Nakshatram')}</span>
          <span className="val">{data.nakshatram}</span>
        </div>
        <div className="grid-item">
          <span className="label">{t('panchangam_masam', 'Masam')}</span>
          <span className="val">{data.masam}</span>
        </div>
        <div className="grid-item">
          <span className="label">{lang === 'te' ? 'సూర్యోదయం · సూర్యాస్తమయం' : 'Sunrise · Sunset'}</span>
          <span className="val">{data.sunriseSunset}</span>
        </div>
      </div>

      {/* Auspicious & Inauspicious Timings Blocks */}
      <div className="timings-container">
        {/* Row 1: Good Times */}
        <div className="timing-row">
          <div className="timing-box">
            <span className="timing-tag green">{lang === 'te' ? 'అమృత కాలం' : 'Amrita Kalam'}</span>
            <span className="timing-time">{data.amritaKalam}</span>
          </div>
          <div className="timing-box">
            <span className="timing-tag green">{lang === 'te' ? 'అభిజిత్ ముహూర్తం' : 'Abhijit'}</span>
            <span className="timing-time">{data.abhijit}</span>
          </div>
        </div>

        {/* Row 2: Inauspicious Times */}
        <div className="timing-row">
          <div className="timing-box">
            <span className="timing-tag rose">{t('panchangam_rahu', 'Rahu Kalam')}</span>
            <span className="timing-time">{data.rahuKalam}</span>
          </div>
          <div className="timing-box">
            <span className="timing-tag rose">{t('panchangam_yama', 'Yamagandam')}</span>
            <span className="timing-time">{data.yamagandam}</span>
          </div>
        </div>
      </div>

      {/* Full Panchangam Button */}
      <button className="full-panchangam-btn" onClick={onOpenFullPanchangam}>
        {lang === 'te' ? 'పూర్తి పంచాంగం' : 'Full Panchangam'}
      </button>

      <style>{`
        .panchangam-card {
          background: var(--deep-burgundy-card);
          border-radius: var(--radius-xl);
          padding: 28px 24px 26px 24px;
          color: #FFFFFF;
          box-shadow: var(--shadow-panchangam);
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .panchangam-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .panchangam-meta {
          font-size: 0.82rem;
          color: rgba(255, 255, 255, 0.75);
          font-weight: 500;
        }
        .today-pill {
          background: #EED7A1;
          color: #5D3E08;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 4px;
          letter-spacing: 0.8px;
        }
        .panchangam-title {
          font-size: 1.85rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 8px;
        }
        .panchangam-note {
          font-size: 0.82rem;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.82);
          margin-bottom: 18px;
        }
        .panchangam-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 16px;
          margin-bottom: 16px;
        }
        .grid-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .grid-item .label {
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
        }
        .grid-item .val {
          font-size: 0.95rem;
          font-weight: 700;
          color: #FFFFFF;
        }
        .timings-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .timing-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .timing-box {
          background: rgba(0, 0, 0, 0.22);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .timing-tag {
          font-size: 0.7rem;
          font-weight: 700;
        }
        .timing-tag.green {
          color: #81C784;
        }
        .timing-tag.rose {
          color: #FFAB91;
        }
        .timing-time {
          font-size: 0.88rem;
          font-weight: 700;
          color: #FFFFFF;
        }
        .full-panchangam-btn {
          background-color: #FFFFFF;
          color: var(--primary-maroon);
          font-weight: 700;
          font-size: 0.95rem;
          padding: 12px;
          border-radius: var(--radius-pill);
          text-align: center;
          transition: background-color 0.2s, transform 0.1s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .full-panchangam-btn:hover {
          background-color: #FFF5F5;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};
