import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, ArrowRight, Bell, Sparkles } from 'lucide-react';
import type { PoojaItem } from '../types';
import { apiRequest } from '../utils/apiClient';
import { getPoojaIllustration } from './Illustrations';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateBookings?: () => void;
  pooja: PoojaItem | null;
  date: string;
  bookingNo?: string;
  bookingId?: string;
  paymentId?: string;
  includeSamagri?: boolean;
  isPurohitOnly?: boolean;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  onNavigateBookings,
  pooja,
  date,
  bookingNo,
  bookingId,
  paymentId,
  includeSamagri,
  isPurohitOnly
}) => {
  if (!isOpen || !pooja) return null;

  const isPurohitOnlyBooking = Boolean(isPurohitOnly || includeSamagri === false);
  const refNumber = bookingNo || ('PS-' + Math.floor(100000 + Math.random() * 900000));
  const activeId = bookingId || refNumber;

  const [currentStep, setCurrentStep] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const steps = [
    { key: 'confirmed', label: 'Booking Confirmed with Purohit', desc: 'Acharya assigned & muhurtham locked' },
    ...(!isPurohitOnlyBooking ? [{ key: 'kit_dispatched', label: 'Samagri Kit Delivered', desc: 'Sacred samagri box arrived at venue' }] : []),
    { key: 'purohit_assigned', label: 'Purohit Contact Unlocked', desc: 'Acharya phone unlocked & in transit' },
    { key: 'in_progress', label: 'Ceremony In Progress', desc: 'Vedic sankalpam & rituals commenced' },
    { key: 'completed', label: 'Ceremony Completed', desc: 'Maha Mangala Harati & Prasadam blessed' }
  ];

  const handleNextStatus = async () => {
    const nextIdx = currentStep < steps.length - 1 ? currentStep + 1 : 0;
    setCurrentStep(nextIdx);
    const targetStatus = steps[nextIdx].key;

    setIsUpdating(true);
    setStatusNotice(null);

    try {
      const res = await apiRequest(`/api/bookings/${encodeURIComponent(activeId)}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: targetStatus })
      });

      // Update localStorage booking record so My Bookings page is immediately up-to-date
      try {
        const saved = localStorage.getItem('pooja_sethu_bookings');
        if (saved) {
          const list = JSON.parse(saved);
          const updated = list.map((b: any) => {
            if (b.bookingNo === refNumber || b.id === activeId) {
              return {
                ...b,
                status: targetStatus === 'kit_dispatched' ? 'confirmed' : (targetStatus as any),
                statusLabel: steps[nextIdx].label
              };
            }
            return b;
          });
          localStorage.setItem('pooja_sethu_bookings', JSON.stringify(updated));
        }
      } catch (e) {}

      if (res.success) {
        setStatusNotice(`Status updated: ${steps[nextIdx].label} (SMS & WhatsApp Dispatched)`);
      } else {
        setStatusNotice(`Status advanced to: ${steps[nextIdx].label}`);
      }
    } catch (err: any) {
      setStatusNotice(`Status advanced to: ${steps[nextIdx].label}`);
    } finally {
      setIsUpdating(false);
      setTimeout(() => setStatusNotice(null), 5000);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container confirmation-modal">
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* ── DYNAMIC POOJA BANNER SPECIFIC TO THIS CEREMONY ── */}
        <div className="pooja-dynamic-banner">
          {pooja.image ? (
            <img
              src={pooja.image}
              alt={pooja.title}
              className="pooja-banner-image"
            />
          ) : (
            <div className="pooja-banner-art">
              {getPoojaIllustration(pooja.title, pooja.illustrationType)}
            </div>
          )}
          <div className="pooja-banner-gradient" />
          <div className="pooja-banner-content">
            <span className="pooja-badge-category">
              <Sparkles size={13} style={{ marginRight: 4 }} />
              {pooja.category ? `${pooja.category.toUpperCase()} CEREMONY` : 'VEDIC PUJA'}
            </span>
            <h3 className="pooja-banner-title font-serif">{pooja.title}</h3>
            {pooja.teluguTitle && <span className="pooja-banner-telugu font-telugu">{pooja.teluguTitle}</span>}
          </div>
        </div>


        <div className="confirm-header-strip">
          <div className="confirm-icon-circle">
            <CheckCircle size={32} className="confirm-icon" />
          </div>
          <div>
            <h2 className="confirm-heading font-serif">Pooja Confirmed!</h2>
            <p className="confirm-sub">
              May the divine grace be upon your family. Notification dispatched via SMS and WhatsApp.
            </p>
          </div>
        </div>

        {/* ── BOOKING REFERENCE SUMMARY ── */}
        <div className="summary-card">
          <div className="summary-row">
            <span className="s-label">Booking Reference</span>
            <span className="s-val bold">{refNumber}</span>
          </div>
          {paymentId && (
            <div className="summary-row">
              <span className="s-label">Payment ID</span>
              <span className="s-val font-mono" style={{ fontSize: '0.82rem', color: '#15803D' }}>{paymentId}</span>
            </div>
          )}
          <div className="summary-row">
            <span className="s-label">Muhurtham Date</span>
            <span className="s-val">{date}</span>
          </div>
          <div className="summary-row">
            <span className="s-label">Dakshina & Fees</span>
            <span className="s-val price">₹{pooja.price.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* ── CEREMONY LIFECYCLE TIMELINE WITH NEXT STATUS BUTTON ── */}
        <div className="lifecycle-card">
          <div className="lifecycle-header">
            <span className="lifecycle-title">Ceremony Status Log</span>
            <span className="step-counter">Step {currentStep + 1} of {steps.length}</span>
          </div>

          <div className="steps-container">
            {steps.map((st, i) => {
              const isPast = i < currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={st.key} className={`step-item ${isCurrent ? 'active' : ''} ${isPast ? 'done' : ''}`}>
                  <div className="step-marker">
                    {isPast ? (
                      <div className="step-dot done">✓</div>
                    ) : isCurrent ? (
                      <div className="step-dot current" />
                    ) : (
                      <div className="step-dot pending" />
                    )}
                    {i < steps.length - 1 && <div className={`step-trail ${isPast ? 'done' : ''}`} />}
                  </div>
                  <div className="step-text-col">
                    <span className="step-title-text">{st.label}</span>
                    <span className="step-desc-text">{st.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {statusNotice && (
            <div className="status-notice-toast">
              <Bell size={14} className="notice-icon" />
              <span>{statusNotice}</span>
            </div>
          )}

          <button
            className="next-status-btn"
            onClick={handleNextStatus}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating Status...' : (
              <>
                <span>{currentStep >= steps.length - 1 ? 'Restart Ceremony Status Loop' : `Next Status: ${steps[currentStep + 1].label}`}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        <div className="status-notice">
          <ShieldCheck size={18} className="shield-icon" />
          <div>
            <strong>Vedic Assurance Guarantee:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', lineHeight: '1.4' }}>
              {!isPurohitOnlyBooking ? (
                <>Your Samagri kit will be delivered by <strong>19:00 on the evening prior</strong>. Our Acharya desk unlocks Purohit direct contact 24 hours prior to ceremony.</>
              ) : (
                <>You have chosen <strong>Purohit Only</strong> (self-arranged samagri). Please keep the sacred pooja items ready as per the checklist before the ceremony. Our Acharya desk unlocks Purohit direct contact 24 hours prior to ceremony.</>
              )}
            </p>
          </div>
        </div>

        {/* ── DUAL ACTION BUTTONS (Return to Home & View My Bookings) ── */}
        <div className="modal-buttons-row">
          <button className="done-btn" onClick={onClose}>
            Return to Home
          </button>
          {onNavigateBookings && (
            <button className="view-bookings-btn" onClick={onNavigateBookings}>
              View in My Bookings
            </button>
          )}
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(30, 20, 15, 0.72);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .confirmation-modal {
          background: #FFFFFF;
          border-radius: var(--radius-xl);
          padding: 0 0 28px 0;
          max-width: 520px;
          width: 100%;
          text-align: left;
          position: relative;
          overflow: hidden;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.25);
        }
        .close-btn {
          position: absolute;
          top: 14px; right: 14px;
          background: rgba(255, 255, 255, 0.85);
          color: #1F1A18;
          border: none;
          padding: 7px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .close-btn:hover {
          background: #FFFFFF;
        }
        .pooja-dynamic-banner {
          position: relative;
          height: 145px;
          width: 100%;
          overflow: hidden;
          background: #7C1B2C;
        }
        .pooja-banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .pooja-banner-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(20,10,8,0.85) 100%);
        }
        .pooja-banner-content {
          position: absolute;
          bottom: 14px;
          left: 24px;
          right: 24px;
          color: #FFFFFF;
        }
        .pooja-badge-category {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 215, 0, 0.25);
          border: 1px solid rgba(255, 215, 0, 0.6);
          color: #FFDF80;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 2px 8px;
          border-radius: 12px;
          margin-bottom: 6px;
        }
        .pooja-banner-title {
          font-size: 1.45rem;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .pooja-banner-telugu {
          font-size: 0.95rem;
          color: #FFE6A5;
          margin-top: 2px;
          display: block;
        }
        .confirm-header-strip {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 24px 8px 24px;
        }
        .confirm-icon-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #E8F5E9;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .confirm-icon {
          color: #2E7D32;
        }
        .confirm-heading {
          font-size: 1.45rem;
          color: var(--primary-maroon);
          margin: 0 0 4px 0;
        }
        .confirm-sub {
          font-size: 0.84rem;
          color: var(--text-muted);
          line-height: 1.4;
          margin: 0;
        }
        .summary-card {
          background: #FDFBF7;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 14px 18px;
          margin: 12px 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.86rem;
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
          font-size: 0.95rem;
          color: var(--text-dark);
        }
        .lifecycle-card {
          background: #FFFFFF;
          border: 1px solid #E8E1D5;
          border-radius: var(--radius-lg);
          padding: 16px 18px;
          margin: 12px 24px;
        }
        .lifecycle-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .lifecycle-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: #1F1A18;
        }
        .step-counter {
          font-size: 0.78rem;
          font-weight: 700;
          background: #FDF2F4;
          color: #7C1B2C;
          border: 1px solid #F5D0D6;
          padding: 2px 8px;
          border-radius: 10px;
        }
        .steps-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 14px;
        }
        .step-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          position: relative;
        }
        .step-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 18px;
          flex-shrink: 0;
        }
        .step-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: bold;
          z-index: 2;
        }
        .step-dot.done {
          background: #15803D;
          color: #FFFFFF;
        }
        .step-dot.current {
          background: #FFFFFF;
          border: 3.5px solid #7C1B2C;
        }
        .step-dot.pending {
          background: #FFFFFF;
          border: 1.5px solid #C4B9AA;
        }
        .step-trail {
          width: 2px;
          height: 22px;
          background: #E8E1D5;
          margin-top: 2px;
        }
        .step-trail.done {
          background: #15803D;
        }
        .step-text-col {
          display: flex;
          flex-direction: column;
        }
        .step-title-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: #333333;
        }
        .step-item.active .step-title-text {
          color: #7C1B2C;
          font-weight: 700;
        }
        .step-desc-text {
          font-size: 0.76rem;
          color: #777777;
        }
        .status-notice-toast {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #E8F5E9;
          border: 1px solid #C8E6C9;
          color: #1B5E20;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 8px 12px;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        .notice-icon {
          color: #2E7D32;
          flex-shrink: 0;
        }
        .next-status-btn {
          width: 100%;
          background: #7C1B2C;
          color: #FFFFFF;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 0.86rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s;
        }
        .next-status-btn:hover {
          background: #631522;
        }
        .status-notice {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--gold-banner-bg);
          border: 1px solid var(--gold-banner-border);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          font-size: 0.8rem;
          color: #795548;
          text-align: left;
          margin: 0 24px 18px 24px;
        }
        .shield-icon {
          color: var(--gold-warm);
          flex-shrink: 0;
        }
        .modal-buttons-row {
          display: flex;
          gap: 12px;
          padding: 0 24px;
        }
        .done-btn {
          flex: 1;
          background-color: var(--primary-maroon);
          color: #FFFFFF;
          border: none;
          font-weight: 700;
          font-size: 0.92rem;
          padding: 12px 20px;
          border-radius: var(--radius-pill);
          cursor: pointer;
          transition: background 0.2s;
        }
        .done-btn:hover {
          background-color: #631522;
        }
        .view-bookings-btn {
          flex: 1;
          background-color: #FFFFFF;
          color: var(--primary-maroon);
          border: 1.5px solid var(--primary-maroon);
          font-weight: 700;
          font-size: 0.92rem;
          padding: 12px 20px;
          border-radius: var(--radius-pill);
          cursor: pointer;
          transition: background 0.2s;
        }
        .view-bookings-btn:hover {
          background-color: #FDF2F4;
        }
      `}</style>
    </div>
  );
};
