import React, { useState, useEffect } from 'react';
import { Home, Clock, Sparkles } from 'lucide-react';
import type { MuhurthamItem, FestivalItem } from '../types';
import { MahalayaArt, NavaratriArt, DeepavaliArt } from './Illustrations';
import { apiRequest } from '../utils/apiClient';
import { useLanguage } from '../context/LanguageContext';

interface MuhurthamAndFestivalsProps {
  onSelectMuhurtham: (item: MuhurthamItem) => void;
  onSelectFestival: (festival: FestivalItem) => void;
  onNavigatePanchangam?: () => void;
}

export const MuhurthamAndFestivals: React.FC<MuhurthamAndFestivalsProps> = ({
  onSelectMuhurtham,
  onSelectFestival,
  onNavigatePanchangam
}) => {
  const { t } = useLanguage();
  const [muhurthams, setMuhurthams] = useState<MuhurthamItem[]>([]);
  const [festivals, setFestivals] = useState<FestivalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async (isMounted = true) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await apiRequest('/api/home', { timeoutMs: 8000 });
      if (!isMounted) return;

      if (res.success && res.data) {
        const data = res.data;
        // 1. Upcoming Muhurthams from database
        if (Array.isArray(data.upcomingMuhurthams) && data.upcomingMuhurthams.length > 0) {
          const seen = new Set<string>();
          const mappedMuhurthams: MuhurthamItem[] = [];
          for (const m of data.upcomingMuhurthams) {
            const startDate = m.starts_at ? new Date(m.starts_at) : new Date();
            const endDate = m.ends_at ? new Date(m.ends_at) : new Date(startDate.getTime() + 2 * 3600000);
            
            const monthStr = m.month || startDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const dayStr = m.day || String(startDate.getDate()).padStart(2, '0');
            const weekdayStr = m.weekday || startDate.toLocaleDateString('en-US', { weekday: 'short' });
            
            const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            const timeRange = m.time || `${formatTime(startDate)} – ${formatTime(endDate)}`;

            const key = `${monthStr}_${dayStr}_${timeRange}`.toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);

            const titleLower = (m.title || m.pooja_name || '').toLowerCase();
            let iconType: 'gruha' | 'vratam' | 'samskara' = 'gruha';
            if (titleLower.includes('satyanarayana') || titleLower.includes('vratham')) iconType = 'vratam';
            else if (titleLower.includes('upanayanam') || titleLower.includes('samskara') || titleLower.includes('naming')) iconType = 'samskara';

            mappedMuhurthams.push({
              id: m.id,
              month: monthStr,
              day: dayStr,
              weekday: weekdayStr,
              title: m.title || m.pooja_name || 'Vedic Ceremony',
              iconType,
              timeRange,
              details: m.lagnam ? (m.lagnam.includes('·') ? m.lagnam : `${m.lagnam} lagnam · Shubha Muhurtham`) : (m.note || 'Shubha Muhurtham'),
              badge: m.badge || (m.quality === 'best' ? 'Best' : 'Good')
            });
          }
          setMuhurthams(mappedMuhurthams.slice(0, 4));
        }

        // 2. Festivals from database
        if (Array.isArray(data.festivals) && data.festivals.length > 0) {
          const mappedFestivals: FestivalItem[] = data.festivals.map((f: any) => {
            const startDate = f.starts_at ? new Date(f.starts_at) : new Date();
            const endDate = f.ends_at ? new Date(f.ends_at) : null;
            
            const sigText = typeof f.significance === 'object' && f.significance !== null
              ? (f.significance.en || f.significance.te || f.significance.description || 'Pooja')
              : (typeof f.significance === 'string' && f.significance ? f.significance : 'Pooja');

            const dateRangeStr = endDate && endDate.getTime() !== startDate.getTime()
              ? `${startDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} – ${endDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}`
              : `${startDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · ${sigText}`;

            const nameLower = (f.name || '').toLowerCase();
            let artType: 'mahalaya' | 'navaratri' | 'deepavali' = 'mahalaya';
            if (nameLower.includes('navaratri') || nameLower.includes('devi') || nameLower.includes('durga')) artType = 'navaratri';
            else if (nameLower.includes('deepavali') || nameLower.includes('lakshmi') || nameLower.includes('diwali')) artType = 'deepavali';

            return {
              id: f.id,
              title: f.name || 'Sacred Festival',
              teluguTitle: f.name_te || '',
              dateRange: dateRangeStr,
              tag: f.is_major ? t('festival_major_tag', 'Major Festival') : t('festival_sacred_tag', 'Pavitra Dinam'),
              artType
            };
          });
          setFestivals(mappedFestivals);
        }
      } else if (res.isDbOffline) {
        setErrorMsg('Panchangam & Muhurtham database offline');
      }
    } catch {
      if (isMounted) setErrorMsg('Unable to reach festival database');
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    loadData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const renderFestivalArt = (type: string, title?: string) => {
    const tLower = (title || '').toLowerCase();
    if (tLower.includes('navaratri') || tLower.includes('devi') || tLower.includes('durga')) return <NavaratriArt />;
    if (tLower.includes('deepavali') || tLower.includes('diwali') || tLower.includes('lakshmi')) return <DeepavaliArt />;
    if (tLower.includes('mahalaya') || tLower.includes('tarpanam') || tLower.includes('pitru')) return <MahalayaArt />;

    switch (type) {
      case 'navaratri': return <NavaratriArt />;
      case 'deepavali': return <DeepavaliArt />;
      default: return <MahalayaArt />;
    }
  };

  if (loading && muhurthams.length === 0 && festivals.length === 0) {
    return null;
  }

  if (errorMsg && muhurthams.length === 0 && festivals.length === 0) {
    return null;
  }

  return (
    <section className="muhurtham-festivals-row">
      {/* Left Column: Upcoming good muhurthams */}
      <div className="muhurtham-col">
        <div className="col-head">
          <h2 className="col-title">{t('muhurtham_title', 'Upcoming good muhurthams')}</h2>
          <button 
            className="calendar-link" 
            onClick={() => {
              if (onNavigatePanchangam) {
                onNavigatePanchangam();
              }
            }}
            title="Open Vedic Calendar & Panchangam"
          >
            {t('muhurtham_calendar_link', 'Calendar')}
          </button>
        </div>

        <div className="muhurtham-list">
          {muhurthams.map((m) => (
            <div key={m.id} className="muhurtham-card" onClick={() => onSelectMuhurtham(m)}>
              {/* Date Badge */}
              <div className="date-badge">
                <span className="badge-month">{m.month}</span>
                <span className="badge-day">{m.day}</span>
                <span className="badge-weekday">{m.weekday}</span>
              </div>

              {/* Middle Info */}
              <div className="muhurtham-info">
                <div className="event-name-row">
                  {m.iconType === 'gruha' && <Home size={15} className="event-icon" />}
                  {m.iconType === 'vratam' && <Clock size={15} className="event-icon" />}
                  {m.iconType === 'samskara' && <Sparkles size={15} className="event-icon" />}
                  <span className="event-name">{m.title}</span>
                </div>
                <div className="time-highlight">{m.timeRange}</div>
                <div className="lagnam-detail">{m.details}</div>
              </div>

              {/* Status Badge & Action */}
              <div className="action-col">
                <span className={`status-pill ${m.badge.toLowerCase().replace(/\s+/g, '-')}`}>
                  {m.badge}
                </span>
                <span className="book-link">{t('muhurtham_book_btn', 'Book ›')}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="footnote-text">
          {t('muhurtham_footnote', 'Auspicious dates for Hyderabad. Your Purohit confirms the final muhurtham.')}
        </p>
      </div>

      {/* Right Column: Festivals ahead */}
      <div className="festivals-col">
        <div className="col-head">
          <h2 className="col-title">{t('festivals_title', 'Festivals ahead')}</h2>
        </div>

        <div className="festivals-grid">
          {festivals.map((f) => (
            <div key={f.id} className="festival-card" onClick={() => onSelectFestival(f)}>
              <div className="festival-art-container">
                {renderFestivalArt(f.artType, f.title)}
              </div>
              <div className="festival-card-body">
                <div className="title-and-tag">
                  <h3 className="festival-title">{f.title}</h3>
                  <span className="festival-tag">{f.tag}</span>
                </div>
                <span className="festival-telugu font-telugu">{f.teluguTitle}</span>
                <span className="festival-dates">{f.dateRange}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .muhurtham-festivals-row {
          display: grid;
          grid-template-columns: 1.15fr 1.85fr;
          gap: 36px;
          margin-bottom: 54px;
        }
        .col-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .col-title {
          font-size: 1.55rem;
          font-weight: 700;
          color: var(--text-dark);
        }
        .calendar-link {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--primary-maroon);
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .muhurtham-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 12px;
        }
        .muhurtham-card {
          background-color: #FFFFFF;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-lg);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 18px;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
        }
        .muhurtham-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
          border-color: var(--gold-warm);
        }
        .date-badge {
          width: 58px;
          height: 64px;
          background-color: var(--gold-badge-bg);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--gold-badge-text);
          flex-shrink: 0;
        }
        .badge-month {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.8px;
        }
        .badge-day {
          font-size: 1.35rem;
          font-weight: 800;
          line-height: 1;
        }
        .badge-weekday {
          font-size: 0.68rem;
          font-weight: 600;
        }
        .muhurtham-info {
          flex: 1;
        }
        .event-name-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 2px;
        }
        .event-icon {
          color: var(--primary-maroon);
        }
        .event-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-dark);
        }
        .time-highlight {
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--primary-maroon);
          margin-bottom: 2px;
        }
        .lagnam-detail {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .action-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }
        .status-pill {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: var(--radius-pill);
        }
        .status-pill.best {
          background-color: var(--tag-green-bg);
          color: var(--tag-green-text);
        }
        .status-pill.filling-fast {
          background-color: #FFF3E0;
          color: #E65100;
        }
        .status-pill.good {
          background-color: #E0F2F1;
          color: #00796B;
        }
        .book-link {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--primary-maroon);
        }
        .footnote-text {
          font-size: 0.78rem;
          color: var(--text-light);
          margin-top: 8px;
        }
        .festivals-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .festival-card {
          background-color: #FFFFFF;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }
        .festival-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        .festival-art-container {
          height: 125px;
          width: 100%;
          overflow: hidden;
          background: #1E2738;
        }
        .festival-card-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
        }
        .title-and-tag {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
          gap: 6px;
        }
        .festival-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-dark);
        }
        .festival-tag {
          background-color: #F5EBE1;
          color: #795548;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: var(--radius-pill);
        }
        .festival-telugu {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .festival-dates {
          font-size: 0.78rem;
          color: var(--text-body);
          font-weight: 500;
        }
        @media (max-width: 1024px) {
          .muhurtham-festivals-row {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 650px) {
          .festivals-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
