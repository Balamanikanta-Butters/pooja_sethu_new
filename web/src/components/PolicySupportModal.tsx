import React, { useState } from 'react';
import { X, Shield, FileText, Phone, Award } from 'lucide-react';

export type PolicyModalTab = 'terms' | 'privacy' | 'cancellation' | 'purohit_join' | 'support';

interface PolicySupportModalProps {
  initialTab: PolicyModalTab;
  onClose: () => void;
}

export const PolicySupportModal: React.FC<PolicySupportModalProps> = ({
  initialTab,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<PolicyModalTab>(initialTab);
  const [purohitSubmitted, setPurohitSubmitted] = useState(false);
  const [purohitForm, setPurohitForm] = useState({
    name: '',
    phone: '',
    city: 'Hyderabad',
    shakha: 'Yajur Veda',
    experience: '10+ years'
  });

  const handlePurohitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPurohitSubmitted(true);
  };

  return (
    <div className="policy-modal-overlay" onClick={onClose}>
      <div className="policy-modal-card" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="policy-modal-head">
          <div className="head-tabs">
            <button 
              className={`policy-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
              onClick={() => setActiveTab('terms')}
            >
              <FileText size={15} /> Terms of Use
            </button>
            <button 
              className={`policy-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <Shield size={15} /> Privacy Policy
            </button>
            <button 
              className={`policy-tab-btn ${activeTab === 'cancellation' ? 'active' : ''}`}
              onClick={() => setActiveTab('cancellation')}
            >
              Cancellation
            </button>
            <button 
              className={`policy-tab-btn ${activeTab === 'purohit_join' ? 'active' : ''}`}
              onClick={() => setActiveTab('purohit_join')}
            >
              <Award size={15} /> Purohits: Join Us
            </button>
            <button 
              className={`policy-tab-btn ${activeTab === 'support' ? 'active' : ''}`}
              onClick={() => setActiveTab('support')}
            >
              <Phone size={15} /> Support
            </button>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="policy-modal-body">
          {activeTab === 'terms' && (
            <div className="policy-content">
              <h2>Terms of Use</h2>
              <p className="effective-date">Last updated: October 2026</p>
              <p>Welcome to <strong>Pooja Sethu</strong>. By using our website and services, you agree to the following terms and Vedic service guidelines.</p>
              
              <h3>1. Authentic Vedic Services</h3>
              <p>Pooja Sethu acts as a revered bridge connecting verified Vedic Purohits with families. Every ritual is conducted in strict accordance with your family’s traditional Sampradayam (Smartha, Madhva, Sri Vaishnava, or Vaikhanasa).</p>
              
              <h3>2. Dakshina & Payments</h3>
              <p>All Dakshina and material pricing is disclosed transparently upfront before booking confirmation. No unsolicited demands or unexpected surcharges are permitted on the day of the ceremony.</p>
              
              <h3>3. Muhurtham Adherence</h3>
              <p>Purohits confirm auspicious muhurtham windows. Families are requested to keep preliminary arrangements and the venue ready at least 30 minutes before the scheduled sankalpam.</p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="policy-content">
              <h2>Privacy Policy</h2>
              <p className="effective-date">Last updated: October 2026</p>
              <p>Your privacy and sacred family details are treated with utmost reverence and confidentiality.</p>
              
              <h3>Information We Collect</h3>
              <p>We only collect the details essential to solemnize your ceremonies: Karta name, Gotram, Nakshatram, contact phone number, and venue address for the Purohit's arrival.</p>
              
              <h3>Data Protection</h3>
              <p>We do not sell, rent, or trade your personal or spiritual data to any third-party advertisers. Information is strictly used for service delivery and communication.</p>
            </div>
          )}

          {activeTab === 'cancellation' && (
            <div className="policy-content">
              <h2>Cancellation & Rescheduling Policy</h2>
              <p className="effective-date">Clear & Fair Vedic Service Guarantees</p>
              
              <div className="policy-highlight-card">
                <h4>Flexible Rescheduling</h4>
                <p>If your muhurtham date or time needs to change due to family circumstances, you can reschedule up to 24 hours prior to the ceremony at <strong>zero extra charge</strong>.</p>
              </div>

              <h3>Cancellation Timeline</h3>
              <ul>
                <li><strong>More than 24 hours before ceremony:</strong> 100% refund of Dakshina and package fees.</li>
                <li><strong>Within 12 to 24 hours:</strong> 90% refund (nominal processing & preparation fee reserved for perishable flower/samagri procurements).</li>
                <li><strong>Under 12 hours:</strong> Samagri kit is dispatched to your residence; Dakshina is refunded or adjusted towards a rescheduled date.</li>
              </ul>
            </div>
          )}

          {activeTab === 'purohit_join' && (
            <div className="policy-content">
              <h2>Purohits: Join Pooja Sethu</h2>
              <p>Are you a traditionally trained Purohit who has completed Veda Pathashala or hereditary Gurukula Adhyayanam? Partner with Pooja Sethu to serve pious families with dignity, transparent Dakshina, and scheduled muhurthams.</p>

              {purohitSubmitted ? (
                <div className="submitted-success">
                  <Award size={42} className="success-icon" />
                  <h3>Dhanyavadalu! Your application has been received.</h3>
                  <p>Our Vedic Acharya Parishad will review your details and contact you at {purohitForm.phone} within 24 hours for Veda Shakha verification.</p>
                </div>
              ) : (
                <form className="purohit-form" onSubmit={handlePurohitSubmit}>
                  <div className="form-group">
                    <label>Full Name (as per Veda Certificate)</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Brahmasri Venkata Somayajulu"
                      value={purohitForm.name}
                      onChange={e => setPurohitForm({ ...purohitForm, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone / WhatsApp Number</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="+91 94400 00000"
                      value={purohitForm.phone}
                      onChange={e => setPurohitForm({ ...purohitForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Veda Shakha</label>
                      <select 
                        value={purohitForm.shakha}
                        onChange={e => setPurohitForm({ ...purohitForm, shakha: e.target.value })}
                      >
                        <option>Rig Veda (Sakala Shakha)</option>
                        <option>Krishna Yajur Veda (Taittiriya)</option>
                        <option>Shukla Yajur Veda (Kanva / Madhyandina)</option>
                        <option>Sama Veda (Kouthuma)</option>
                        <option>Atharva Veda</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>City / Region</label>
                      <input 
                        type="text" 
                        value={purohitForm.city}
                        onChange={e => setPurohitForm({ ...purohitForm, city: e.target.value })}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-submit-purohit">
                    Register as Verified Purohit
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'support' && (
            <div className="policy-content">
              <h2>Help & Customer Support</h2>
              <p>We are here to assist you with every aspect of your family's religious ceremonies.</p>

              <div className="support-cards-grid">
                <div className="support-box">
                  <Phone size={24} className="support-icon" />
                  <h4>Helpline</h4>
                  <p>Call or WhatsApp our Acharya desk:</p>
                  <a href="tel:+919876543210" className="support-link">+91 98765 43210</a>
                  <span className="timing">Available 6:00 AM – 9:00 PM IST daily</span>
                </div>

                <div className="support-box">
                  <FileText size={24} className="support-icon" />
                  <h4>Email Assistance</h4>
                  <p>Send questions or customized Vidhi requests:</p>
                  <a href="mailto:support@poojasethu.com" className="support-link">support@poojasethu.com</a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="policy-modal-foot">
          <button className="btn-done" onClick={onClose}>Close</button>
        </div>
      </div>

      <style>{`
        .policy-modal-overlay {
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

        .policy-modal-card {
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          max-width: 680px;
          width: 100%;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-modal);
        }

        .policy-modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          border-bottom: 1px solid var(--border-light);
          background: #FDFBF8;
        }

        .head-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .policy-tab-btn {
          background: transparent;
          border: 1px solid transparent;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .policy-tab-btn.active {
          background: var(--primary-maroon-light);
          color: var(--primary-maroon);
          border-color: var(--primary-maroon);
          font-weight: 700;
        }

        .close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
        }

        .policy-modal-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }

        .policy-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 6px;
        }

        .effective-date {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 18px;
        }

        .policy-content h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary-maroon);
          margin-top: 18px;
          margin-bottom: 6px;
        }

        .policy-content p {
          font-size: 0.92rem;
          color: var(--text-body);
          line-height: 1.5;
          margin-bottom: 10px;
        }

        .policy-highlight-card {
          background: #F8F5EE;
          border-left: 4px solid var(--primary-maroon);
          padding: 14px 18px;
          border-radius: 4px;
          margin: 16px 0;
        }

        .policy-highlight-card h4 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--primary-maroon);
          margin-bottom: 4px;
        }

        .policy-content ul {
          padding-left: 20px;
          margin-bottom: 16px;
        }

        .policy-content li {
          font-size: 0.92rem;
          color: var(--text-body);
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .purohit-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 18px;
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

        .form-group input, .form-group select {
          padding: 10px 14px;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          font-size: 0.95rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .btn-submit-purohit {
          background: var(--primary-maroon);
          color: #FFFFFF;
          border: none;
          padding: 12px;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 6px;
        }

        .submitted-success {
          text-align: center;
          padding: 30px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .success-icon {
          color: #137333;
        }

        .support-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 18px;
        }

        .support-box {
          background: #FDFBF8;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .support-icon {
          color: var(--primary-maroon);
        }

        .support-box h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .support-link {
          font-size: 1rem;
          font-weight: 700;
          color: var(--primary-maroon);
          text-decoration: none;
        }

        .timing {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .policy-modal-foot {
          padding: 12px 20px;
          border-top: 1px solid var(--border-light);
          display: flex;
          justify-content: flex-end;
        }

        .btn-done {
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
