import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  AlertCircle,
  LogOut,
  ChevronRight,
  Shield,
  Sparkles
} from 'lucide-react';
import { apiRequest } from '../utils/apiClient';
import { showToast } from '../components/ToastNotification';

export interface SavedAddress {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  landmark?: string;
  pincode: string;
  is_default: boolean;
}

export interface FamilyMember {
  id?: string;
  name: string;
  relation: string;
  gotram?: string;
  janma_nakshatram?: string;
  date_of_birth?: string;
}

interface ProfilePageProps {
  onNavigateHome: () => void;
  onNavigatePoojas: () => void;
  onSignOut: () => void;
  user: any;
  onUserUpdate: (updatedUser: any) => void;
  onOpenPolicy: (tab: 'terms' | 'privacy' | 'cancellation' | 'support') => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigateHome,
  onNavigatePoojas,
  onSignOut,
  user,
  onUserUpdate,
  onOpenPolicy
}) => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Personal Info Form
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [sampradayam, setSampradayam] = useState(user?.sampradayam || 'smartha');
  const [gotra, setGotra] = useState(user?.gotra || 'Kashyapa');
  const [preferredLang, setPreferredLang] = useState<'English' | 'Telugu' | 'Hindi'>('English');

  // Addresses State
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrPincode, setAddrPincode] = useState('500081');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Raise concern modal state
  const [isConcernModalOpen, setIsConcernModalOpen] = useState(false);
  const [concernBookingId, setConcernBookingId] = useState('');
  const [concernTag, setConcernTag] = useState('General concern');
  const [concernText, setConcernText] = useState('');
  const [concernSubmitted, setConcernSubmitted] = useState(false);

  // Fetch full user profile & addresses from backend
  useEffect(() => {
    fetchProfileAndAddresses();
  }, []);

  const fetchProfileAndAddresses = async () => {
    setLoading(true);
    try {
      // 1. Fetch user profile from backend
      const res = await apiRequest('/api/auth/me', { timeoutMs: 8000 });
      if (res.success) {
        const u = res.raw?.user || res.data?.user || res.data;
        if (u) {
          setName(u.name || '');
          setEmail(u.email || '');
          setSampradayam(u.sampradayam || 'smartha');
          setGotra(u.gotra || u.gotram || 'Kashyapa');
          if (Array.isArray(u.addresses) && u.addresses.length > 0) {
            setAddresses(u.addresses);
          }
          onUserUpdate(u);
        }
      }

      // 2. Fetch addresses directly from /api/auth/addresses
      const addrRes = await apiRequest('/api/auth/addresses', { timeoutMs: 8000 });
      const rawAddrs = addrRes.raw?.addresses || addrRes.data?.addresses || (Array.isArray(addrRes.data) ? addrRes.data : []);
      if (addrRes.success && Array.isArray(rawAddrs)) {
        setAddresses(rawAddrs.map((a: any) => ({
          id: a.id,
          label: a.label || 'Home',
          line1: a.line1 || '',
          line2: a.line2 || '',
          landmark: a.landmark || '',
          pincode: a.pincode || '',
          is_default: !!a.is_default
        })));
      } else if (addrRes.isDbOffline) {
        showToast({
          type: 'warning',
          message: 'Saved addresses unavailable (database offline).'
        });
      }
    } catch (err: any) {
      console.error('Failed to load profile from backend:', err);
      showToast({ type: 'error', message: err.message || 'Unable to sync profile with database' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await apiRequest('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          sampradayam,
          gotram: gotra.trim(),
          mobileNumber: user?.phoneNumber || user?.mobileNumber
        })
      });

      if (res.success) {
        setSuccessMsg('Profile updated successfully in database.');
        showToast({ type: 'success', message: 'Profile updated in database.' });
        setIsEditingProfile(false);
        onUserUpdate({
          ...user,
          name: name.trim(),
          email: email.trim(),
          sampradayam,
          gotra: gotra.trim()
        });
      } else {
        const errText = res.error || 'Failed to update profile';
        setErrorMsg(errText);
        showToast({ type: 'error', message: errText });
      }
    } catch (err: any) {
      const errText = err.message || 'Network error updating profile';
      setErrorMsg(errText);
      showToast({ type: 'error', message: errText });
    } finally {
      setLoading(false);
    }
  };

  // Open Address Modal for New
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrLabel('Home');
    setAddrLine1('');
    setAddrLine2('');
    setAddrLandmark('');
    setAddrPincode('500081');
    setAddrIsDefault(addresses.length === 0);
    setIsAddressModalOpen(true);
  };

  // Open Address Modal for Edit
  const handleOpenEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setAddrLabel(addr.label);
    setAddrLine1(addr.line1);
    setAddrLine2(addr.line2 || '');
    setAddrLandmark(addr.landmark || '');
    setAddrPincode(addr.pincode);
    setAddrIsDefault(addr.is_default);
    setIsAddressModalOpen(true);
  };

  // Save Address (Create or Update) via Backend
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLine1.trim()) return;

    setLoading(true);
    try {
      const res = await apiRequest('/api/auth/addresses', {
        method: 'POST',
        body: JSON.stringify({
          id: editingAddressId,
          label: addrLabel,
          line1: addrLine1.trim(),
          line2: addrLine2.trim(),
          landmark: addrLandmark.trim(),
          pincode: addrPincode.trim() || '500081',
          is_default: addrIsDefault
        })
      });

      if (res.success) {
        await fetchProfileAndAddresses();
        setIsAddressModalOpen(false);
        setSuccessMsg('Address saved successfully.');
        showToast({ type: 'success', message: 'Address saved to database.' });
      } else {
        const errText = res.error || 'Database connection error';
        showToast({ type: 'error', message: errText });
        setErrorMsg(errText);
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Failed to save address' });
    } finally {
      setLoading(false);
    }
  };

  // Delete Address via Backend
  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await apiRequest(`/api/auth/addresses/${id}`, { method: 'DELETE' });
      if (res.success) {
        setAddresses(prev => prev.filter(a => a.id !== id));
        showToast({ type: 'success', message: 'Address removed from database.' });
      } else {
        showToast({ type: 'error', message: res.error || 'Failed to remove address' });
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Failed to remove address' });
    }
  };

  // Set Address Default via Backend
  const handleSetDefault = async (id: string) => {
    try {
      const res = await apiRequest(`/api/auth/addresses/${id}/default`, { method: 'PUT' });
      if (res.success) {
        setAddresses(prev => prev.map(a => ({
          ...a,
          is_default: a.id === id
        })));
        showToast({ type: 'success', message: 'Default address set.' });
      } else {
        showToast({ type: 'error', message: res.error || 'Failed to update default address' });
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Failed to update default address' });
    }
  };

  // Submit Concern
  const handleSubmitConcern = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiRequest('/api/bookings/concern', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: concernBookingId || null,
          tags: [concernTag],
          message: concernText,
          userId: user?.phoneNumber || user?.mobileNumber
        })
      });
      if (res.success) {
        showToast({ type: 'success', message: 'Concern submitted. Purohit support will contact you.' });
      }
    } catch (_) {}
    setConcernSubmitted(true);
  };

  const getInitials = (n: string) => {
    if (!n) return 'PS';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return n.substring(0, 2).toUpperCase();
  };

  return (
    <div className="profile-page-root">
      {/* Top Header with Back Button */}
      <div className="profile-header-bar" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
        <button 
          type="button"
          className="btn-back-nav" 
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
          <button className="crumb-btn" onClick={onNavigatePoojas}>Poojas</button>
          <span className="crumb-sep">/</span>
          <span className="crumb-active">Account & Profile</span>
        </div>
      </div>

      <div className="profile-layout">
        {/* Left Column: Account Card & Spiritual Identity */}
        <div className="profile-main-col">
          {/* Top User Card */}
          <div className="profile-user-card">
            <div className="user-avatar-circle">
              {getInitials(name || user?.phoneNumber || 'User')}
            </div>
            <div className="user-info-text">
              <h2 className="user-display-name">{name || 'Devotee / Yajamana'}</h2>
              <p className="user-phone">
                <Phone size={14} className="inline-icon" /> 
                {user?.phoneNumber || user?.mobileNumber ? `+91 ${user.phoneNumber || user.mobileNumber}` : '+91 87654 56789'}
              </p>
              {email && (
                <p className="user-email">
                  <Mail size={14} className="inline-icon" /> {email}
                </p>
              )}
            </div>
            <button 
              className="btn-edit-profile"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
            >
              <Edit2 size={15} /> {isEditingProfile ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Edit Profile Form */}
          {isEditingProfile && (
            <form className="edit-profile-form" onSubmit={handleSaveProfile}>
              <h3 className="section-head-title">Edit Personal Details</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name / Karta Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Enter your full name" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="name@example.com" 
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Family Sampradayam</label>
                  <select 
                    value={sampradayam} 
                    onChange={e => setSampradayam(e.target.value)}
                  >
                    <option value="smartha">Smartha (వైదిక స్మార్త సంప్రదాయం)</option>
                    <option value="madhva">Madhva (శ్రీ మధ్వ సంప్రదాయం)</option>
                    <option value="srivaishnava">Sri Vaishnava (శ్రీ వైష్ణవ సంప్రదాయం)</option>
                    <option value="vaikhanasa">Vaikhanasa (వైఖానస సంప్రదాయం)</option>
                    <option value="samanya">Samanya / Not sure (సామాన్య సంప్రదాయం)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Family Gotram</label>
                  <input 
                    type="text" 
                    value={gotra} 
                    onChange={e => setGotra(e.target.value)} 
                    placeholder="e.g. Kashyapa, Bharadwaja, Kaundinya" 
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save-primary" disabled={loading}>
                  {loading ? 'Saving to Database...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="btn-cancel-secondary"
                  onClick={() => setIsEditingProfile(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Alerts */}
          {successMsg && (
            <div className="alert-box success">
              <Check size={18} /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="alert-box error">
              <AlertCircle size={18} /> {errorMsg}
            </div>
          )}

          {/* Family & Spiritual Profile */}
          <div className="profile-section-card">
            <h3 className="section-head-title">
              <Sparkles size={18} className="sec-icon" /> Family & Vedic Identity
            </h3>

            <div className="spiritual-details-list">
              <div className="detail-row">
                <span className="row-label">Sampradayam</span>
                <span className="row-value-pill">{sampradayam.toUpperCase()}</span>
              </div>
              <div className="detail-row">
                <span className="row-label">Family Gotram</span>
                <span className="row-value-bold">{gotra || 'Kashyapa'}</span>
              </div>
              <div className="detail-row">
                <span className="row-label">App Language</span>
                <div className="lang-button-group">
                  {(['English', 'Telugu', 'Hindi'] as const).map(l => (
                    <button
                      key={l}
                      className={`lang-pill-btn ${preferredLang === l ? 'active' : ''}`}
                      onClick={() => setPreferredLang(l)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Saved Addresses Section (Matching Mobile & Uploaded Design) */}
          <div className="profile-section-card">
            <div className="section-head-between">
              <h3 className="section-head-title">
                <MapPin size={18} className="sec-icon" /> Saved Ceremony Addresses
              </h3>
              <button className="btn-add-address" onClick={handleOpenAddAddress}>
                <Plus size={16} /> Add New Address
              </button>
            </div>

            <p className="section-subtitle">
              Purohits and Samagri delivery partners arrive at your verified ceremony venue.
            </p>

            <div className="saved-addresses-grid">
              {addresses.map((addr) => (
                <div 
                  key={addr.id} 
                  className={`saved-address-card ${addr.is_default ? 'default-card' : ''}`}
                >
                  <div className="address-top-row">
                    <div className="address-label-wrap">
                      <span className="address-label-tag">{addr.label}</span>
                      {addr.is_default && <span className="default-badge">DEFAULT VENUE</span>}
                    </div>
                    <div className="address-actions-row">
                      <button 
                        className="btn-icon-action" 
                        title="Edit address"
                        onClick={() => handleOpenEditAddress(addr)}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button 
                        className="btn-icon-action delete" 
                        title="Delete address"
                        onClick={() => handleDeleteAddress(addr.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <p className="address-full-line">{addr.line1}</p>
                  {addr.line2 && <p className="address-sub-line">{addr.line2}</p>}
                  {addr.landmark && (
                    <p className="address-landmark">Landmark: {addr.landmark}</p>
                  )}
                  <p className="address-pincode">Pincode: {addr.pincode}</p>

                  {!addr.is_default && (
                    <button 
                      className="btn-set-default"
                      onClick={() => handleSetDefault(addr.id)}
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Policies */}
        <div className="profile-side-col">
          {/* Legal & Service Policies */}
          <div className="side-card">
            <h4 className="side-card-title">
              <Shield size={18} className="sec-icon" /> Trust & Policies
            </h4>
            <ul className="side-links-list">
              <li>
                <button onClick={() => onOpenPolicy('terms')}>
                  Terms of Service <ChevronRight size={14} />
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('privacy')}>
                  Privacy & Family Data Protection <ChevronRight size={14} />
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('cancellation')}>
                  Cancellation & Rescheduling <ChevronRight size={14} />
                </button>
              </li>
            </ul>
          </div>

          {/* Sign Out Card */}
          <div className="side-card signout-card">
            <button className="btn-signout" onClick={onSignOut}>
              <LogOut size={16} /> Sign Out of PoojaSethu
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Address Modal */}
      {isAddressModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddressModalOpen(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editingAddressId ? 'Edit Ceremony Address' : 'Add New Ceremony Address'}</h3>
              <button className="btn-close" onClick={() => setIsAddressModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveAddress}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Address Label</label>
                  <div className="label-presets">
                    {['Home', "Parents' home", 'Temple', 'Function hall', 'Office'].map(lbl => (
                      <button
                        key={lbl}
                        type="button"
                        className={`preset-pill ${addrLabel === lbl ? 'active' : ''}`}
                        onClick={() => setAddrLabel(lbl)}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Flat, House No., Building Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. 402, Sai Residency"
                    value={addrLine1}
                    onChange={e => setAddrLine1(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Street, Area, Locality</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Madhapur, Hitec City"
                    value={addrLine2}
                    onChange={e => setAddrLine2(e.target.value)}
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Landmark</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Near Metro Station"
                      value={addrLandmark}
                      onChange={e => setAddrLandmark(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input 
                      type="text" 
                      required 
                      maxLength={6}
                      placeholder="e.g. 500081"
                      value={addrPincode}
                      onChange={e => setAddrPincode(e.target.value)}
                    />
                  </div>
                </div>

                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={addrIsDefault} 
                    onChange={e => setAddrIsDefault(e.target.checked)}
                  />
                  <span>Set as primary default address for bookings</span>
                </label>
              </div>

              <div className="modal-foot">
                <button type="button" className="btn-cancel" onClick={() => setIsAddressModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Raise a Concern Modal */}
      {isConcernModalOpen && (
        <div className="modal-overlay" onClick={() => setIsConcernModalOpen(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Raise a Ceremony Concern</h3>
              <button className="btn-close" onClick={() => setIsConcernModalOpen(false)}>✕</button>
            </div>

            {concernSubmitted ? (
              <div className="modal-body text-center">
                <Check size={42} className="text-success" />
                <h4>Concern Received</h4>
                <p>Our Acharya Desk has received your concern. We will review and reach out to you within 2 hours.</p>
                <button 
                  className="btn-submit mt-4" 
                  onClick={() => {
                    setIsConcernModalOpen(false);
                    setConcernSubmitted(false);
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitConcern}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Concern Category</label>
                    <select value={concernTag} onChange={e => setConcernTag(e.target.value)}>
                      <option>Late arrival</option>
                      <option>Vidhi concern</option>
                      <option>Samagri missing</option>
                      <option>Bhojanam / Catering</option>
                      <option>Dakshina / Payment</option>
                      <option>General concern</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Booking ID / Reference (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. PS-BK-87102"
                      value={concernBookingId}
                      onChange={e => setConcernBookingId(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Describe your concern *</label>
                    <textarea 
                      rows={4}
                      required
                      placeholder="Please let us know how we can assist you..."
                      value={concernText}
                      onChange={e => setConcernText(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-foot">
                  <button type="button" className="btn-cancel" onClick={() => setIsConcernModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Submit Concern
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        .profile-page-root {
          padding-top: 20px;
          padding-bottom: 80px;
          max-width: 1140px;
          margin: 0 auto;
        }

        .breadcrumb-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          margin-bottom: 24px;
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

        .profile-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 28px;
          align-items: start;
        }

        .profile-main-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-user-card {
          background: #FFFFFF;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-lg);
          padding: 24px 28px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.02);
        }

        .user-avatar-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--primary-maroon);
          color: #FFFFFF;
          font-size: 1.45rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-info-text {
          flex: 1;
        }

        .user-display-name {
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 4px;
        }

        .user-phone, .user-email {
          font-size: 0.92rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
        }

        .inline-icon {
          color: var(--primary-maroon);
        }

        .btn-edit-profile {
          background: var(--primary-maroon-light);
          border: 1px solid var(--primary-maroon);
          color: var(--primary-maroon);
          padding: 8px 16px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .btn-edit-profile:hover {
          background: var(--primary-maroon);
          color: #FFFFFF;
        }

        .edit-profile-form {
          background: #FFFFFF;
          border: 1px solid var(--primary-maroon);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }

        .section-head-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-dark);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .sec-icon {
          color: var(--primary-maroon);
        }

        .section-subtitle {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-top: -10px;
          margin-bottom: 18px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .form-group input, .form-group select, .form-group textarea {
          padding: 10px 14px;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          color: var(--text-dark);
          background: #FFFFFF;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 18px;
        }

        .btn-save-primary {
          background: var(--primary-maroon);
          color: #FFFFFF;
          border: none;
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.92rem;
          cursor: pointer;
        }

        .btn-cancel-secondary {
          background: transparent;
          border: 1px solid var(--border-card);
          color: var(--text-muted);
          padding: 10px 18px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.92rem;
          cursor: pointer;
        }

        .alert-box {
          padding: 12px 18px;
          border-radius: var(--radius-md);
          font-size: 0.92rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .alert-box.success {
          background: #E6F4EA;
          color: #137333;
          border: 1px solid #CEEAD6;
        }
        .alert-box.error {
          background: #FCE8E6;
          color: #C5221F;
          border: 1px solid #FAD2CF;
        }

        .profile-section-card {
          background: #FFFFFF;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.02);
        }

        .section-head-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .btn-add-address {
          background: var(--primary-maroon-light);
          border: 1px solid var(--primary-maroon);
          color: var(--primary-maroon);
          padding: 6px 14px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .btn-add-address:hover {
          background: var(--primary-maroon);
          color: #FFFFFF;
        }

        .spiritual-details-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-light);
        }
        .detail-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .row-label {
          font-size: 0.92rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .row-value-pill {
          background: var(--primary-maroon-light);
          color: var(--primary-maroon);
          font-weight: 800;
          font-size: 0.82rem;
          padding: 4px 10px;
          border-radius: 4px;
        }

        .row-value-bold {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .lang-button-group {
          display: flex;
          gap: 6px;
        }

        .lang-pill-btn {
          background: var(--bg-subtle);
          border: 1px solid var(--border-card);
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          color: var(--text-muted);
        }
        .lang-pill-btn.active {
          background: var(--primary-maroon);
          color: #FFFFFF;
          border-color: var(--primary-maroon);
          font-weight: 700;
        }

        .saved-addresses-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .saved-address-card {
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          padding: 16px;
          background: #FDFBF8;
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .saved-address-card.default-card {
          border-color: var(--primary-maroon);
          background: #FFFFFF;
          box-shadow: 0 2px 8px rgba(124, 27, 44, 0.06);
        }

        .address-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .address-label-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .address-label-tag {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .default-badge {
          background: #E6F4EA;
          color: #137333;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }

        .address-actions-row {
          display: flex;
          gap: 6px;
        }

        .btn-icon-action {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
        .btn-icon-action:hover {
          color: var(--primary-maroon);
          background: var(--bg-subtle);
        }
        .btn-icon-action.delete:hover {
          color: #C5221F;
        }

        .address-full-line {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-dark);
          line-height: 1.4;
        }

        .address-sub-line, .address-landmark {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .address-pincode {
          font-size: 0.85rem;
          color: var(--text-dark);
          font-weight: 600;
          margin-top: 2px;
        }

        .btn-set-default {
          margin-top: 8px;
          align-self: flex-start;
          background: transparent;
          border: none;
          color: var(--primary-maroon);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }
        .btn-set-default:hover {
          text-decoration: underline;
        }

        .profile-side-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .side-card {
          background: #FFFFFF;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-lg);
          padding: 20px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.02);
        }

        .side-card-title {
          font-size: 1.02rem;
          font-weight: 700;
          color: var(--text-dark);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .side-card-desc {
          font-size: 0.86rem;
          color: var(--text-muted);
          line-height: 1.45;
          margin-bottom: 14px;
        }

        .support-actions-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .btn-support-link {
          background: #FDFBF8;
          border: 1px solid var(--border-card);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 0.86rem;
          font-weight: 700;
          color: var(--primary-maroon);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          text-align: left;
        }
        .btn-support-link:hover {
          background: var(--primary-maroon-light);
        }

        .side-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .side-links-list button {
          width: 100%;
          background: transparent;
          border: none;
          padding: 0;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-body);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          text-align: left;
        }
        .side-links-list button:hover {
          color: var(--primary-maroon);
        }

        .signout-card {
          padding: 12px;
        }

        .btn-signout {
          width: 100%;
          background: #FCE8E6;
          border: 1px solid #FAD2CF;
          color: #C5221F;
          padding: 10px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-signout:hover {
          background: #C5221F;
          color: #FFFFFF;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }

        .modal-dialog {
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          max-width: 520px;
          width: 100%;
          box-shadow: var(--shadow-modal);
        }

        .modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          border-bottom: 1px solid var(--border-light);
        }
        .modal-head h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-dark);
        }
        .btn-close {
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
          gap: 14px;
        }

        .label-presets {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .preset-pill {
          background: var(--bg-subtle);
          border: 1px solid var(--border-card);
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          color: var(--text-dark);
        }
        .preset-pill.active {
          background: var(--primary-maroon);
          color: #FFFFFF;
          border-color: var(--primary-maroon);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-dark);
          cursor: pointer;
          margin-top: 6px;
        }

        .modal-foot {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 16px 24px;
          border-top: 1px solid var(--border-light);
        }

        .btn-cancel {
          background: transparent;
          border: 1px solid var(--border-card);
          padding: 8px 16px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .btn-submit {
          background: var(--primary-maroon);
          color: #FFFFFF;
          border: none;
          padding: 8px 20px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .profile-layout {
            grid-template-columns: 1fr;
          }
          .saved-addresses-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
