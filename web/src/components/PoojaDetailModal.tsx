import React, { useState } from 'react';
import { X, Check, Clock, ShieldCheck, Calendar } from 'lucide-react';
import type { PoojaItem } from '../types';

interface PoojaDetailModalProps {
  pooja: PoojaItem | null;
  onClose: () => void;
  onBook: (pooja: PoojaItem, date: string) => void;
}

export const PoojaDetailModal: React.FC<PoojaDetailModalProps> = ({ pooja, onClose, onBook }) => {
  const [selectedDate, setSelectedDate] = useState('2026-10-22');

  if (!pooja) return null;

  const inclusions = [
    'Experienced Vedic Purohit following your family Sampradayam',
    'Complete Samagri Kit delivered upfront to your doorstep',
    'Auspicious Muhurtham determination and Lagnam matching',
    'Step-by-step guidance for family sankalpam and mantras'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-container pooja-detail-modal">
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="detail-header">
          <span className="detail-category">{pooja.category.toUpperCase()}</span>
          <h2 className="detail-title font-serif">{pooja.title}</h2>
          <span className="detail-telugu font-telugu">{pooja.teluguTitle}</span>
        </div>

        <p className="detail-description">{pooja.description}</p>

        {/* Pricing & Duration Bar */}
        <div className="specs-bar">
          <div className="spec-item">
            <Clock size={18} className="spec-icon" />
            <div>
              <span className="spec-label">Duration</span>
              <span className="spec-value">{pooja.duration}</span>
            </div>
          </div>
          <div className="spec-item">
            <ShieldCheck size={18} className="spec-icon" />
            <div>
              <span className="spec-label">Purohit Dakshina</span>
              <span className="spec-value price">₹{pooja.price.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* What is Included */}
        <div className="inclusions-section">
          <h4 className="inclusions-heading">What is included</h4>
          <ul className="inclusions-list">
            {inclusions.map((item, idx) => (
              <li key={idx} className="inclusion-item">
                <Check size={16} className="check-icon" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Booking Form Date Selection */}
        <div className="booking-action-block">
          <label className="date-picker-label">
            <Calendar size={16} />
            <span>Select Preferred Muhurtham Date</span>
          </label>
          <input
            type="date"
            className="date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <button 
            className="book-now-btn"
            onClick={() => onBook(pooja, selectedDate)}
          >
            Proceed to Book · ₹{pooja.price.toLocaleString('en-IN')}
          </button>
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
        .pooja-detail-modal {
          background: #FFFFFF;
          border-radius: var(--radius-xl);
          padding: 34px;
          max-width: 540px;
          width: 100%;
          position: relative;
          box-shadow: var(--shadow-lg);
          max-height: 90vh;
          overflow-y: auto;
        }
        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          color: var(--text-muted);
          padding: 6px;
          border-radius: 50%;
        }
        .detail-category {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--gold-warm);
        }
        .detail-title {
          font-size: 1.85rem;
          color: var(--text-dark);
          margin-top: 2px;
          margin-bottom: 2px;
        }
        .detail-telugu {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 14px;
          display: block;
        }
        .detail-description {
          font-size: 0.9rem;
          color: var(--text-body);
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .specs-bar {
          display: flex;
          align-items: center;
          background: var(--bg-subtle);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 12px 18px;
          gap: 28px;
          margin-bottom: 22px;
        }
        .spec-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .spec-icon {
          color: var(--primary-maroon);
        }
        .spec-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          display: block;
        }
        .spec-value {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-dark);
        }
        .spec-value.price {
          color: var(--primary-maroon);
          font-size: 1.1rem;
        }
        .inclusions-section {
          margin-bottom: 24px;
        }
        .inclusions-heading {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 12px;
        }
        .inclusions-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .inclusion-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.86rem;
          color: var(--text-body);
        }
        .check-icon {
          color: var(--tag-green-text);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .booking-action-block {
          border-top: 1px solid var(--border-light);
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .date-picker-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-dark);
        }
        .date-input {
          padding: 10px 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          background: var(--bg-subtle);
          font-size: 0.95rem;
          color: var(--text-dark);
          outline: none;
        }
        .date-input:focus {
          border-color: var(--primary-maroon);
          background: #FFFFFF;
        }
        .book-now-btn {
          background-color: var(--primary-maroon);
          color: #FFFFFF;
          font-weight: 700;
          font-size: 1rem;
          padding: 14px;
          border-radius: var(--radius-pill);
          transition: background-color 0.2s, transform 0.1s;
          box-shadow: 0 4px 14px rgba(116, 27, 40, 0.28);
          margin-top: 4px;
        }
        .book-now-btn:hover {
          background-color: var(--primary-maroon-hover);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};
