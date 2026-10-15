import React, { useState } from 'react';
import { X, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { apiRequest } from '../utils/apiClient';
import { showToast } from './ToastNotification';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest('/api/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber: cleanPhone }),
        timeoutMs: 8000
      });

      if (res.success) {
        setStep('otp');
        setSuccessMsg('OTP sent! Enter 123456 to verify.');
        showToast({ type: 'success', message: 'OTP sent to ' + cleanPhone });
      } else {
        const msg = res.isDbOffline
          ? 'Database offline: Cannot dispatch authentication OTP.'
          : (res.error || 'Failed to send OTP');
        setError(msg);
        showToast({ type: 'error', message: msg });
      }
    } catch (err: any) {
      const msg = err.message || 'Connection error while requesting OTP.';
      setError(msg);
      showToast({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length < 4) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = mobileNumber.replace(/\D/g, '');
      const res = await apiRequest('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber: cleanPhone, otp }),
        timeoutMs: 8000
      });

      if (res.success) {
        const payload = res.raw || res.data;
        if (payload?.token) {
          localStorage.setItem('jwt_token', payload.token);
          localStorage.setItem('pooja_sethu_token', payload.token);
        }
        showToast({ type: 'success', message: 'Signed in successfully!' });
        onLoginSuccess(payload?.user || { mobileNumber: cleanPhone });
        onClose();
      } else {
        const msg = res.isDbOffline
          ? 'Database offline: Cannot verify credentials.'
          : (res.error || 'Invalid OTP');
        setError(msg);
        showToast({ type: 'error', message: msg });
      }
    } catch (err: any) {
      const msg = 'Connection error during verification. Please try again.';
      setError(msg);
      showToast({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="modal-header">
          <img src="/logo.png" alt="PoojaSethu" className="modal-logo" />
          <h2 className="modal-title font-serif">Sign in to PoojaSethu</h2>
          <p className="modal-subtitle">
            Book authentic Poojas, save family muhurthams, and track your bookings.
          </p>
        </div>

        {error && (
          <div className="alert error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert success">
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="modal-form">
            <label className="input-label">Mobile Number</label>
            <div className="input-field">
              <span className="country-code">+91</span>
              <input
                type="tel"
                placeholder="Enter 10-digit number"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="modal-form">
            <label className="input-label">Enter 6-Digit OTP</label>
            <div className="input-field">
              <Lock size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Enter 123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
            </div>
            <div className="otp-helper">
              <span>Use test OTP: <strong>123456</strong></span>
              <button type="button" className="text-btn" onClick={() => setStep('phone')}>
                Change number
              </button>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>
        )}
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(30, 20, 15, 0.65);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-container {
          background: #FFFFFF;
          border-radius: var(--radius-xl);
          padding: 36px 32px;
          max-width: 420px;
          width: 100%;
          position: relative;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-light);
        }
        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          color: var(--text-muted);
          padding: 6px;
          border-radius: 50%;
        }
        .close-btn:hover {
          background: var(--bg-subtle);
          color: var(--text-dark);
        }
        .modal-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .modal-logo {
          height: 42px;
          width: auto;
          margin: 0 auto 12px auto;
          display: block;
          object-fit: contain;
        }
        .modal-title {
          font-size: 1.6rem;
          color: var(--primary-maroon);
          margin-bottom: 6px;
        }
        .modal-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .input-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-dark);
        }
        .input-field {
          display: flex;
          align-items: center;
          background: var(--bg-subtle);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          gap: 8px;
        }
        .input-field:focus-within {
          border-color: var(--primary-maroon);
          background: #FFFFFF;
        }
        .country-code {
          font-weight: 700;
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        .input-icon {
          color: var(--text-muted);
        }
        .input-field input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-dark);
        }
        .submit-btn {
          background-color: var(--primary-maroon);
          color: #FFFFFF;
          font-weight: 700;
          padding: 12px;
          border-radius: var(--radius-pill);
          font-size: 1rem;
          margin-top: 6px;
          transition: background-color 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          background-color: var(--primary-maroon-hover);
        }
        .submit-btn:disabled {
          opacity: 0.6;
        }
        .otp-helper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .text-btn {
          color: var(--primary-maroon);
          font-weight: 700;
          text-decoration: underline;
        }
        .alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          margin-bottom: 16px;
        }
        .alert.error {
          background: #FFEBEE;
          color: #C62828;
        }
        .alert.success {
          background: #E8F5E9;
          color: #2E7D32;
        }
      `}</style>
    </div>
  );
};
