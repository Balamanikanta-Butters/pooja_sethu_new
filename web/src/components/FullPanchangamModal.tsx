import React from 'react';
import { X, Sun, Moon, Sparkles } from 'lucide-react';
import type { PanchangamData } from '../types';

interface FullPanchangamModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PanchangamData;
}

export const FullPanchangamModal: React.FC<FullPanchangamModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container panchangam-modal">
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="modal-top">
          <div className="header-meta">
            <span className="calendar-badge">VEDIC CALENDAR</span>
            <span className="location-tag">{data.city} · GRCh</span>
          </div>
          <h2 className="modal-heading font-serif">Sampoorna Panchangam</h2>
          <p className="modal-date">{data.dateStr}</p>
        </div>

        {/* Note */}
        <div className="special-banner">
          <Sparkles size={16} className="sparkle-icon" />
          <span>{data.specialNote}</span>
        </div>

        {/* Core Panchangam Angas Grid */}
        <div className="anga-grid">
          <div className="anga-card">
            <span className="anga-name">Tithi</span>
            <span className="anga-value">{data.tithi}</span>
            <span className="anga-sub">Till 08:45 PM, then Ashtami</span>
          </div>
          <div className="anga-card">
            <span className="anga-name">Nakshatram</span>
            <span className="anga-value">{data.nakshatram}</span>
            <span className="anga-sub">Till 11:20 PM, then Arudra</span>
          </div>
          <div className="anga-card">
            <span className="anga-name">Masam & Paksham</span>
            <span className="anga-value">{data.masam}</span>
            <span className="anga-sub">Krishna Paksha (Bahula)</span>
          </div>
          <div className="anga-card">
            <span className="anga-name">Yoga & Karana</span>
            <span className="anga-value">Siddhi & Vishti</span>
            <span className="anga-sub">Bhadra Karana</span>
          </div>
        </div>

        {/* Timings Section */}
        <div className="timings-block">
          <h4 className="timing-title">Shubha Muhurthams (Auspicious)</h4>
          <div className="timing-pills-row">
            <div className="time-pill auspicious">
              <span className="name">Amrita Kalam</span>
              <span className="val">{data.amritaKalam}</span>
            </div>
            <div className="time-pill auspicious">
              <span className="name">Abhijit Muhurtham</span>
              <span className="val">{data.abhijit}</span>
            </div>
            <div className="time-pill auspicious">
              <span className="name">Brahma Muhurtham</span>
              <span className="val">4:25 – 5:12 AM</span>
            </div>
          </div>
        </div>

        <div className="timings-block">
          <h4 className="timing-title">Ashubha Kaalam (Inauspicious - Avoid)</h4>
          <div className="timing-pills-row">
            <div className="time-pill inauspicious">
              <span className="name">Rahu Kalam</span>
              <span className="val">{data.rahuKalam}</span>
            </div>
            <div className="time-pill inauspicious">
              <span className="name">Yamagandam</span>
              <span className="val">{data.yamagandam}</span>
            </div>
            <div className="time-pill inauspicious">
              <span className="name">Durmuhurtham</span>
              <span className="val">{data.durmuhurtham || '6:05 – 6:52 AM'}</span>
            </div>
          </div>
        </div>

        {/* Sun & Moon */}
        <div className="sun-moon-row">
          <div className="celestial-box">
            <Sun size={18} className="sun-icon" />
            <div>
              <span className="c-label">Sunrise & Sunset</span>
              <span className="c-val">{data.sunriseSunset}</span>
            </div>
          </div>
          <div className="celestial-box">
            <Moon size={18} className="moon-icon" />
            <div>
              <span className="c-label">Moonrise</span>
              <span className="c-val">10:48 PM</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(30, 20, 15, 0.65);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .panchangam-modal {
          background: #FFFFFF;
          border-radius: var(--radius-xl);
          padding: 32px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          color: var(--text-muted);
          padding: 6px;
          border-radius: 50%;
        }
        .header-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }
        .calendar-badge {
          background: var(--gold-warm);
          color: #FFFFFF;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .location-tag {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .modal-heading {
          font-size: 1.8rem;
          color: var(--primary-maroon);
          margin-bottom: 4px;
        }
        .modal-date {
          font-size: 0.92rem;
          color: var(--text-body);
          margin-bottom: 16px;
        }
        .special-banner {
          background: var(--gold-banner-bg);
          border: 1px solid var(--gold-banner-border);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          color: #795548;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .sparkle-icon {
          color: var(--gold-warm);
          flex-shrink: 0;
        }
        .anga-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }
        .anga-card {
          background: var(--bg-subtle);
          border: 1px solid var(--border-light);
          padding: 12px 14px;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
        }
        .anga-name {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .anga-value {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 2px;
        }
        .anga-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .timings-block {
          margin-bottom: 18px;
        }
        .timing-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 8px;
        }
        .timing-pills-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .time-pill {
          padding: 10px 12px;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .time-pill.auspicious {
          background: #E8F5E9;
          border: 1px solid #C8E6C9;
        }
        .time-pill.auspicious .name {
          font-size: 0.72rem;
          font-weight: 700;
          color: #2E7D32;
        }
        .time-pill.auspicious .val {
          font-size: 0.88rem;
          font-weight: 700;
          color: #1B5E20;
        }
        .time-pill.inauspicious {
          background: #FFEBEE;
          border: 1px solid #FFCDD2;
        }
        .time-pill.inauspicious .name {
          font-size: 0.72rem;
          font-weight: 700;
          color: #C62828;
        }
        .time-pill.inauspicious .val {
          font-size: 0.88rem;
          font-weight: 700;
          color: #B71C1C;
        }
        .sun-moon-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          border-top: 1px solid var(--border-light);
          padding-top: 16px;
          margin-top: 20px;
        }
        .celestial-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-subtle);
          padding: 10px 14px;
          border-radius: var(--radius-md);
        }
        .sun-icon { color: #F57C00; }
        .moon-icon { color: #5C6BC0; }
        .c-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: block;
        }
        .c-val {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-dark);
        }
        @media (max-width: 600px) {
          .timing-pills-row {
            grid-template-columns: 1fr;
          }
          .anga-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
