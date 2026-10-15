import React, { useState, useEffect } from 'react';
import type { PanchangamData } from '../types';
import { apiRequest } from '../utils/apiClient';

interface PanchangamCardProps {
  onOpenFullPanchangam: () => void;
}

export const PanchangamCard: React.FC<PanchangamCardProps> = ({ onOpenFullPanchangam }) => {
  const [data, setData] = useState<PanchangamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbOffline, setDbOffline] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadPanchangam = async () => {
      try {
        const res = await apiRequest('/api/panchangam/today', { timeoutMs: 8000 });
        if (!isMounted) return;
        if (res.success && res.data && res.data.panchangam) {
          const p = res.data.panchangam;
          setData({
            dateStr: p.formatted_date ? `${p.formatted_date} · Hyderabad` : 'Today · Hyderabad',
            city: 'Hyderabad',
            specialNote: p.festivals ? `Festivals: ${p.festivals}` : 'Auspicious muhurtham day for sacred ceremonies and archana.',
            tithi: p.tithi || 'Shukla Paksha',
            nakshatram: p.nakshatra || 'Rohini',
            masam: p.masam || 'Ashwayuja',
            sunriseSunset: p.sunrise && p.sunset ? `${p.sunrise} · ${p.sunset}` : '6:08 AM · 5:55 PM',
            amritaKalam: p.amrita_kalam || '10:15 – 11:45 AM',
            abhijit: p.abhijit_muhurtham || '11:40 AM – 12:28 PM',
            rahuKalam: p.rahu_kalam || '1:30 – 3:00 PM',
            yamagandam: p.yamagandam || '6:00 – 7:30 AM',
            durmuhurtham: p.durmuhurtham || '10:00 – 10:48 AM',
            varjyam: p.varjyam || '3:30 – 5:00 PM'
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
  }, []);

  if (loading) {
    return (
      <div className="panchangam-card" style={{ padding: '32px 24px', textAlign: 'center', color: '#888' }}>
        <p>Connecting to database & loading today's Panchangam...</p>
      </div>
    );
  }

  if (dbOffline || !data) {
    return (
      <div className="panchangam-card" style={{ padding: '28px 24px', textAlign: 'center', border: '1px solid #E2D9C8' }}>
        <span className="today-pill" style={{ marginBottom: '10px' }}>TODAY</span>
        <h2 className="panchangam-title font-serif" style={{ margin: '8px 0' }}>Today's Panchangam</h2>
        <p style={{ color: '#666', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 12px auto' }}>
          Database service is currently offline. When PostgreSQL is started at <code>192.168.88.3:5432</code>, live Vedic Panchangam coordinates (Tithi, Nakshatram, Rahu Kalam) will automatically populate.
        </p>
      </div>
    );
  }

  return (
    <div className="panchangam-card">
      {/* Top Meta & Today Pill */}
      <div className="panchangam-header">
        <span className="panchangam-meta">{data.dateStr}</span>
        <span className="today-pill">TODAY</span>
      </div>

      {/* Card Title */}
      <h2 className="panchangam-title font-serif">Today's Panchangam</h2>

      {/* Special Auspicious Note */}
      <p className="panchangam-note">{data.specialNote}</p>

      {/* Grid of Core Details */}
      <div className="panchangam-grid">
        <div className="grid-item">
          <span className="label">Tithi</span>
          <span className="val">{data.tithi}</span>
        </div>
        <div className="grid-item">
          <span className="label">Nakshatram</span>
          <span className="val">{data.nakshatram}</span>
        </div>
        <div className="grid-item">
          <span className="label">Masam</span>
          <span className="val">{data.masam}</span>
        </div>
        <div className="grid-item">
          <span className="label">Sunrise · Sunset</span>
          <span className="val">{data.sunriseSunset}</span>
        </div>
      </div>

      {/* Auspicious & Inauspicious Timings Blocks */}
      <div className="timings-container">
        {/* Row 1: Good Times */}
        <div className="timing-row">
          <div className="timing-box">
            <span className="timing-tag green">Amrita Kalam</span>
            <span className="timing-time">{data.amritaKalam}</span>
          </div>
          <div className="timing-box">
            <span className="timing-tag green">Abhijit</span>
            <span className="timing-time">{data.abhijit}</span>
          </div>
        </div>

        {/* Row 2: Inauspicious Times */}
        <div className="timing-row">
          <div className="timing-box">
            <span className="timing-tag rose">Rahu Kalam</span>
            <span className="timing-time">{data.rahuKalam}</span>
          </div>
          <div className="timing-box">
            <span className="timing-tag rose">Yamagandam</span>
            <span className="timing-time">{data.yamagandam}</span>
          </div>
        </div>
      </div>

      {/* Full Panchangam Button */}
      <button className="full-panchangam-btn" onClick={onOpenFullPanchangam}>
        Full Panchangam
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
