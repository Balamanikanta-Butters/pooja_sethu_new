import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, ChevronRight, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { apiRequest } from '../utils/apiClient';
import { showToast } from '../components/ToastNotification';

interface BookingRecord {
  id: string;
  bookingNo: string;
  poojaTitle: string;
  poojaTeluguTitle?: string;
  status: 'confirmed' | 'purohit_assigned' | 'in_progress' | 'completed' | 'cancelled';
  statusLabel: string;
  slot: string;
  dateStr: string;
  address: string;
  purohitName: string;
  purohitVeda: string;
  purohitPhone: string;
  totalAmount: number;
  guestCount?: number;
  includeSamagri: boolean;
  includeBhojanalu: boolean;
  kartaName: string;
  gotram: string;
  bookedAt: string;
}

interface MyBookingsPageProps {
  onNavigateHome: () => void;
  onNavigatePoojas: () => void;
  userPhone?: string;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  onNavigateHome,
  onNavigatePoojas,
  userPhone
}) => {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchLiveBookings = async (isMounted = true) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const query = userPhone ? `?mobileNumber=${encodeURIComponent(userPhone)}` : '';
      const res = await apiRequest(`/api/bookings/my-bookings${query}`, { timeoutMs: 8000 });
      if (!isMounted) return;

      const rawBookings = res.raw?.bookings || res.data?.bookings || (Array.isArray(res.data) ? res.data : null);
      if (res.success && Array.isArray(rawBookings)) {
        const apiBookings: BookingRecord[] = rawBookings.map((b: any) => ({
          id: b.id,
          bookingNo: b.booking_no || `PS-BK-${b.id.slice(0, 5).toUpperCase()}`,
          poojaTitle: b.service_name || b.pooja_name || 'Gruhapravesam',
          poojaTeluguTitle: b.service_telugu || b.pooja_telugu || '',
          status: (b.status === 'confirmed' || b.status === 'completed' || b.status === 'cancelled') ? b.status : 'confirmed',
          statusLabel: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : 'Confirmed',
          slot: b.starts_at ? new Date(b.starts_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'Sun, 25 Oct 2026',
          dateStr: b.starts_at ? new Date(b.starts_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '25 Oct 2026',
          address: [b.address_flat, b.address_area, b.pincode].filter(Boolean).join(', ') || 'Home Venue, Hyderabad',
          purohitName: b.purohit_name || 'Assigned Vedic Purohit',
          purohitVeda: b.purohit_veda || 'Krishna Yajur Veda',
          purohitPhone: b.purohit_phone || '+91 94401 23456',
          totalAmount: Number(b.total_payable) || 4300,
          guestCount: b.guests || 0,
          includeSamagri: b.mode !== 'purohit_only',
          includeBhojanalu: Number(b.food_amount) > 0,
          kartaName: b.booked_for_name || 'Bala Manikanta',
          gotram: 'Kashyapa',
          bookedAt: b.created_at ? new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '14 Oct 2026'
        }));
        setBookings(apiBookings);
      } else if (res.isDbOffline) {
        setErrorMsg('Database connection offline. Showing locally saved bookings.');
      } else if (res.error) {
        setErrorMsg(res.error);
      }
    } catch (err: any) {
      if (isMounted) setErrorMsg(err.message || 'Failed to fetch bookings');
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  // Load bookings from localStorage and backend
  useEffect(() => {
    let isMounted = true;
    const saved = localStorage.getItem('pooja_sethu_bookings');
    let loaded: BookingRecord[] = [];
    if (saved) {
      try {
        loaded = JSON.parse(saved);
      } catch (e) {
        loaded = [];
      }
    }
    setBookings(loaded);

    fetchLiveBookings(isMounted);
    return () => {
      isMounted = false;
    };
  }, [userPhone]);

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking? Our Purohit team will be notified.')) {
      try {
        const res = await apiRequest(`/api/bookings/${bookingId}/cancel`, {
          method: 'POST'
        });

        if (res.success) {
          showToast({ type: 'success', message: 'Booking cancelled successfully' });
        } else {
          showToast({ type: 'warning', message: res.error || 'Cancellation updated locally' });
        }
      } catch (err: any) {
        showToast({ type: 'warning', message: 'Could not notify server, cancelled locally' });
      }

      const updated = bookings.map(b => {
        if (b.id === bookingId) {
          return { ...b, status: 'cancelled' as const, statusLabel: 'Cancelled' };
        }
        return b;
      });
      setBookings(updated);
      localStorage.setItem('pooja_sethu_bookings', JSON.stringify(updated));
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(null);
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'Upcoming') {
      return b.status === 'confirmed' || b.status === 'purohit_assigned' || b.status === 'in_progress';
    }
    if (activeTab === 'Completed') return b.status === 'completed';
    if (activeTab === 'Cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="my-bookings-page">
      {/* Top Header with Back Button */}
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
        <div className="breadcrumb-bar" style={{ margin: 0 }}>
          <button className="crumb-btn" onClick={onNavigateHome}>Home</button>
          <span className="crumb-sep">/</span>
          <span className="crumb-active">My bookings</span>
        </div>
      </div>

      <div className="page-header">
        <h1 className="page-title font-sans">My Bookings</h1>
        <p className="page-desc">Track your sacred ceremonies, assigned Purohits, and muhurtham schedules.</p>
      </div>

      {/* Filter Tabs */}
      <div className="tabs-header">
        {(['Upcoming', 'Completed', 'Cancelled'] as const).map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            <span className="tab-count">
              {bookings.filter(b => {
                if (tab === 'Upcoming') return b.status === 'confirmed' || b.status === 'purohit_assigned' || b.status === 'in_progress';
                if (tab === 'Completed') return b.status === 'completed';
                if (tab === 'Cancelled') return b.status === 'cancelled';
                return false;
              }).length}
            </span>
          </button>
        ))}
      </div>

      {errorMsg && (
        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FCD34D',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#92400E',
          fontSize: '0.9rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => fetchLiveBookings(true)}
            disabled={loading}
            style={{
              background: '#92400E',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={13} />
            {loading ? 'Connecting...' : 'Retry'}
          </button>
        </div>
      )}

      {/* Bookings List or Empty State */}
      {filteredBookings.length === 0 ? (
        <div className="empty-box">
          <Calendar size={48} className="empty-icon" />
          <h3 className="empty-title">No {activeTab.toLowerCase()} bookings</h3>
          <p className="empty-text">You have no {activeTab.toLowerCase()} ceremonies scheduled at this moment.</p>
          <button className="btn-explore" onClick={onNavigatePoojas}>
            Explore & Book a Pooja
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map((b) => (
            <div key={b.id} className="booking-card">
              <div className="card-top">
                <div className="status-row">
                  <span className={`status-tag status-${b.status}`}>
                    {b.status === 'confirmed' && <CheckCircle2 size={13} />}
                    {b.status === 'cancelled' && <XCircle size={13} />}
                    {b.statusLabel}
                  </span>
                  <span className="ref-number">Ref: {b.bookingNo}</span>
                </div>
                <h3 className="booking-pooja-title">
                  {b.poojaTitle}
                  {b.poojaTeluguTitle && <span className="telugu-sub font-telugu"> · {b.poojaTeluguTitle}</span>}
                </h3>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <Calendar size={16} className="detail-icon" />
                  <div>
                    <span className="label">Muhurtham</span>
                    <span className="val">{b.slot}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <MapPin size={16} className="detail-icon" />
                  <div>
                    <span className="label">Location</span>
                    <span className="val">{b.address}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <User size={16} className="detail-icon" />
                  <div>
                    <span className="label">Assigned Purohit</span>
                    <span className="val">{b.purohitName} ({b.purohitVeda})</span>
                  </div>
                </div>
              </div>

              <div className="card-foot">
                <div className="price-col">
                  <span className="price-label">Total Dakshina</span>
                  <span className="price-val">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="card-actions">
                  {b.status !== 'cancelled' && b.status !== 'completed' && (
                    <button 
                      className="btn-cancel"
                      onClick={() => handleCancelBooking(b.id)}
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    className="btn-view"
                    onClick={() => setSelectedBooking(b)}
                  >
                    View Details <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="modal-ref">Booking Ref: {selectedBooking.bookingNo}</span>
                <h2 className="modal-title font-sans">{selectedBooking.poojaTitle}</h2>
              </div>
              <button className="close-btn" onClick={() => setSelectedBooking(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4 className="sec-heading">Muhurtham & Venue</h4>
                <p><strong>Timing:</strong> {selectedBooking.slot}</p>
                <p><strong>Address:</strong> {selectedBooking.address}</p>
              </div>

              <div className="modal-section">
                <h4 className="sec-heading">Sankalpam & Karta</h4>
                <p><strong>Karta:</strong> {selectedBooking.kartaName}</p>
                <p><strong>Gotram:</strong> {selectedBooking.gotram}</p>
              </div>

              <div className="modal-section">
                <h4 className="sec-heading">Assigned Purohit</h4>
                <p><strong>Name:</strong> {selectedBooking.purohitName}</p>
                <p><strong>Veda Shakha:</strong> {selectedBooking.purohitVeda}</p>
                <p><strong>Contact:</strong> {selectedBooking.purohitPhone}</p>
              </div>

              <div className="modal-section">
                <h4 className="sec-heading">Package Breakdown</h4>
                <p>• Vedic Vidhi & Archana Dakshina: Included</p>
                {selectedBooking.includeSamagri && <p>• Complete Samagri & Puja Kit: Included</p>}
                {selectedBooking.includeBhojanalu && selectedBooking.guestCount && (
                  <p>• Satvik Traditional Bhojanalu: {selectedBooking.guestCount} guests</p>
                )}
                <div className="modal-total-row">
                  <span>Total Payable:</span>
                  <span className="total-highlight">₹{selectedBooking.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                <button 
                  className="btn-cancel-modal"
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                >
                  Cancel this Booking
                </button>
              )}
              <button 
                className="btn-close-modal"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .my-bookings-page {
          padding-top: 16px;
          padding-bottom: 80px;
          max-width: 900px;
          margin: 0 auto;
        }

        .breadcrumb-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          margin-bottom: 20px;
        }

        .crumb-btn {
          background: transparent;
          border: none;
          color: var(--primary-maroon);
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        .crumb-btn:hover {
          text-decoration: underline;
        }
        .crumb-sep {
          color: var(--text-light);
        }
        .crumb-active {
          color: var(--text-dark);
          font-weight: 600;
        }

        .page-header {
          margin-bottom: 24px;
        }
        .page-title {
          font-size: 1.85rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 6px;
        }
        .page-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
        }

        .tabs-header {
          display: flex;
          gap: 12px;
          border-bottom: 2px solid var(--border-light);
          margin-bottom: 24px;
        }

        .tab-btn {
          padding: 10px 18px;
          background: transparent;
          border: none;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tab-btn.active {
          color: var(--primary-maroon);
          border-bottom-color: var(--primary-maroon);
          font-weight: 700;
        }

        .tab-count {
          font-size: 0.75rem;
          background: var(--bg-card);
          padding: 2px 8px;
          border-radius: 12px;
          color: var(--text-dark);
        }

        .tab-btn.active .tab-count {
          background: var(--primary-maroon-light);
          color: var(--primary-maroon);
        }

        .empty-box {
          background: #FFFFFF;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-lg);
          padding: 60px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .empty-icon {
          color: var(--border-card);
          margin-bottom: 16px;
        }

        .empty-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 8px;
        }

        .empty-text {
          font-size: 0.92rem;
          color: var(--text-muted);
          margin-bottom: 24px;
        }

        .btn-explore {
          background: var(--primary-maroon);
          color: #FFFFFF;
          border: none;
          padding: 12px 24px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-explore:hover {
          background: var(--primary-maroon-hover);
        }

        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .booking-card {
          background: #FFFFFF;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.02);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .booking-card:hover {
          box-shadow: var(--shadow-sm);
        }

        .card-top {
          margin-bottom: 16px;
        }

        .status-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .status-tag {
          font-size: 0.78rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          text-transform: capitalize;
        }

        .status-confirmed, .status-purohit_assigned, .status-in_progress {
          background: #E6F4EA;
          color: #137333;
        }

        .status-completed {
          background: #E8F0FE;
          color: #1A73E8;
        }

        .status-cancelled {
          background: #FCE8E6;
          color: #C5221F;
        }

        .ref-number {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .booking-pooja-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .telugu-sub {
          font-size: 1.15rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .details-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 18px;
          padding-top: 12px;
          border-top: 1px dashed var(--border-light);
        }

        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .detail-icon {
          color: var(--primary-maroon);
          margin-top: 2px;
          flex-shrink: 0;
        }

        .detail-item .label {
          display: block;
          font-size: 0.78rem;
          color: var(--text-light);
          font-weight: 600;
          text-transform: uppercase;
        }

        .detail-item .val {
          font-size: 0.92rem;
          color: var(--text-dark);
          font-weight: 600;
        }

        .card-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
        }

        .price-label {
          display: block;
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .price-val {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary-maroon);
        }

        .card-actions {
          display: flex;
          gap: 10px;
        }

        .btn-cancel {
          background: transparent;
          border: 1px solid var(--border-card);
          padding: 8px 14px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 600;
          color: #C5221F;
          cursor: pointer;
        }
        .btn-cancel:hover {
          background: #FCE8E6;
        }

        .btn-view {
          background: var(--primary-maroon-light);
          border: 1px solid var(--primary-maroon);
          color: var(--primary-maroon);
          padding: 8px 16px;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .btn-view:hover {
          background: var(--primary-maroon);
          color: #FFFFFF;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }

        .modal-content {
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          max-width: 550px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-modal);
        }

        .modal-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-light);
        }

        .modal-ref {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .modal-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-top: 4px;
        }

        .close-btn {
          background: transparent;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: var(--text-muted);
        }

        .modal-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .modal-section {
          background: #FBF9F5;
          padding: 14px 18px;
          border-radius: 8px;
          border: 1px solid var(--border-light);
        }

        .sec-heading {
          font-size: 0.88rem;
          color: var(--primary-maroon);
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .modal-section p {
          font-size: 0.9rem;
          color: var(--text-dark);
          margin-bottom: 4px;
        }

        .modal-total-row {
          display: flex;
          justify-content: space-between;
          font-size: 1.1rem;
          font-weight: 700;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid var(--border-light);
        }

        .total-highlight {
          color: var(--primary-maroon);
          font-size: 1.3rem;
          font-weight: 800;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 16px 24px;
          border-top: 1px solid var(--border-light);
        }

        .btn-cancel-modal {
          background: transparent;
          border: 1px solid #C5221F;
          color: #C5221F;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-close-modal {
          background: var(--primary-maroon);
          color: #FFFFFF;
          border: none;
          padding: 8px 20px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
