import React from 'react';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';
import type { PoojaItem } from '../types';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  pooja: PoojaItem | null;
  date: string;
  bookingNo?: string;
  paymentId?: string;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  pooja,
  date,
  bookingNo,
  paymentId
}) => {
  if (!isOpen || !pooja) return null;

  const refNumber = bookingNo || ('PS-' + Math.floor(100000 + Math.random() * 900000));

  return (
    <div className="modal-overlay">
      <div className="modal-container confirmation-modal">
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="confirm-icon-circle">
          <CheckCircle size={44} className="confirm-icon" />
        </div>

        <h2 className="confirm-heading font-serif">Pooja Confirmed & Paid!</h2>
        <p className="confirm-sub">
          May the divine grace be upon your family. Your payment was processed securely via Razorpay.
        </p>

        <div className="summary-card">
          <div className="summary-row">
            <span className="s-label">Booking Reference</span>
            <span className="s-val bold">{refNumber}</span>
          </div>
          {paymentId && (
            <div className="summary-row">
              <span className="s-label">Razorpay Payment ID</span>
              <span className="s-val font-mono" style={{ fontSize: '0.82rem', color: '#15803D' }}>{paymentId}</span>
            </div>
          )}
          <div className="summary-row">
            <span className="s-label">Pooja</span>
            <span className="s-val">{pooja.title} ({pooja.teluguTitle})</span>
          </div>
          <div className="summary-row">
            <span className="s-label">Muhurtham Date</span>
            <span className="s-val">{date}</span>
          </div>
          <div className="summary-row">
            <span className="s-label">Dakshina & Fees</span>
            <span className="s-val price">₹{pooja.price.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="status-notice">
          <ShieldCheck size={18} className="shield-icon" />
          <span>Payment verified. Our Shastri will call you shortly with pre-pooja vidhi instructions.</span>
        </div>

        <button className="done-btn" onClick={onClose}>
          Return to Home
        </button>
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
        .confirmation-modal {
          background: #FFFFFF;
          border-radius: var(--radius-xl);
          padding: 36px 32px;
          max-width: 480px;
          width: 100%;
          text-align: center;
          position: relative;
        }
        .close-btn {
          position: absolute;
          top: 20px; right: 20px;
          color: var(--text-muted);
          padding: 6px;
          border-radius: 50%;
        }
        .confirm-icon-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #E8F5E9;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px auto;
        }
        .confirm-icon {
          color: #2E7D32;
        }
        .confirm-heading {
          font-size: 1.85rem;
          color: var(--primary-maroon);
          margin-bottom: 8px;
        }
        .confirm-sub {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.45;
          margin-bottom: 24px;
        }
        .summary-card {
          background: var(--bg-subtle);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 16px 20px;
          margin-bottom: 20px;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.88rem;
        }
        .s-label {
          color: var(--text-muted);
        }
        .s-val {
          color: var(--text-dark);
          font-weight: 600;
        }
        .s-val.bold {
          font-weight: 800;
          color: var(--primary-maroon);
        }
        .s-val.price {
          font-weight: 800;
          font-size: 1rem;
          color: var(--text-dark);
        }
        .status-notice {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--gold-banner-bg);
          border: 1px solid var(--gold-banner-border);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          font-size: 0.82rem;
          color: #795548;
          text-align: left;
          margin-bottom: 24px;
        }
        .shield-icon {
          color: var(--gold-warm);
          flex-shrink: 0;
        }
        .done-btn {
          background-color: var(--primary-maroon);
          color: #FFFFFF;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 12px 28px;
          border-radius: var(--radius-pill);
          width: 100%;
        }
      `}</style>
    </div>
  );
};
