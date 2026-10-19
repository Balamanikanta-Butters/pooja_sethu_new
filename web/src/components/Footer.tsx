import React from 'react';
import type { PolicyModalTab } from './PolicySupportModal';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavClick: (tab: string, category?: string) => void;
  onOpenPanchangam: () => void;
  onOpenPolicy: (tab: PolicyModalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavClick, 
  onOpenPanchangam,
  onOpenPolicy
}) => {
  const { lang } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container footer-content">
        {/* Brand Description Column */}
        <div className="footer-col brand-col">
          <div className="footer-brand" onClick={() => onNavClick('Home')} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="PoojaSethu" className="footer-logo" />
          </div>
          <p className="footer-tagline">
            {lang === 'te' 
              ? 'మీ కుటుంబ సంప్రదాయానికి నమ్మకమైన వారధి. వేద పండితులు, శుభ ముహూర్తం, సమగ్ర పూజా నిర్వహణ.'
              : lang === 'hi'
              ? 'आपकी पारिवारिक परंपरा एवं संस्कारों का विश्वसनीय सेतु। प्रमाणित वैदिक पुरोहित, शुभ मुहूर्त और संपूर्ण पूजन व्यवस्था।'
              : 'The bridge between your family and tradition. Verified Purohits, the right muhurtham, everything arranged.'}
          </p>
        </div>

        {/* Column 2: Poojas */}
        <div className="footer-col">
          <h4 className="footer-col-title">{lang === 'te' ? 'పూజలు' : lang === 'hi' ? 'पूजाएँ' : 'Poojas'}</h4>
          <ul className="footer-links">
            <li><button onClick={() => onNavClick('Poojas', 'gruha')}>{lang === 'te' ? 'గృహ ప్రవేశం' : lang === 'hi' ? 'गृह प्रवेश' : 'Gruha'}</button></li>
            <li><button onClick={() => onNavClick('Poojas', 'samskaras')}>{lang === 'te' ? 'సంస్కారాలు' : lang === 'hi' ? 'संस्कार' : 'Samskaras'}</button></li>
            <li><button onClick={() => onNavClick('Homams', 'homams')}>{lang === 'te' ? 'హోమాలు' : lang === 'hi' ? 'हवन' : 'Homams'}</button></li>
            <li><button onClick={() => onNavClick('Poojas', 'festivals')}>{lang === 'te' ? 'పండుగ పూజలు' : lang === 'hi' ? 'त्योहार' : 'Festivals'}</button></li>
          </ul>
        </div>

        {/* Column 3: Pooja Sethu */}
        <div className="footer-col">
          <h4 className="footer-col-title">Pooja Sethu</h4>
          <ul className="footer-links">
            <li><button onClick={onOpenPanchangam}>{lang === 'te' ? 'పంచాంగం' : lang === 'hi' ? 'पंचांग' : 'Panchangam'}</button></li>
            <li><button onClick={() => onNavClick('My bookings')}>{lang === 'te' ? 'నా బుకింగ్స్' : lang === 'hi' ? 'मेरी बुकिंग' : 'My bookings'}</button></li>
            <li><button onClick={() => onOpenPolicy('purohit_join')}>{lang === 'te' ? 'పురోహితుల నమోదు' : lang === 'hi' ? 'पुरोहित पंजीकरण' : 'Purohits: join us'}</button></li>
            <li><button onClick={() => onOpenPolicy('support')}>{lang === 'te' ? 'సహాయం & మద్దతు' : lang === 'hi' ? 'सहायता एवं संपर्क' : 'Help and support'}</button></li>
          </ul>
        </div>

        {/* Column 4: Policies */}
        <div className="footer-col">
          <h4 className="footer-col-title">{lang === 'te' ? 'నియమాలు' : lang === 'hi' ? 'नीतियाँ एवं नियम' : 'Policies'}</h4>
          <ul className="footer-links">
            <li><button onClick={() => onOpenPolicy('terms')}>{lang === 'te' ? 'వినియోగ నిబంధనలు' : lang === 'hi' ? 'उपयोग के नियम' : 'Terms of use'}</button></li>
            <li><button onClick={() => onOpenPolicy('privacy')}>{lang === 'te' ? 'గోప్యతా విధానం' : lang === 'hi' ? 'गोपनीयता नीति' : 'Privacy policy'}</button></li>
            <li><button onClick={() => onOpenPolicy('cancellation')}>{lang === 'te' ? 'రద్దు విధానం' : lang === 'hi' ? 'रद्दीकरण नीति' : 'Cancellation policy'}</button></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="container">
        <div className="footer-bottom">
          <p>
            {lang === 'te'
              ? '© 2026 పూజా సేతు · సర్వ హక్కులు ప్రత్యేకించబడ్డాయి · ప్రామాణిక వేద పురోహిత సేవలు'
              : lang === 'hi'
              ? '© 2026 पूजा सेतु · सर्वाधिकार सुरक्षित · प्रामाणिक वैदिक पुरोहित सेवाएँ'
              : '© 2026 Pooja Sethu · All rights reserved · Traditional Vedic Purohit Services'}
          </p>
        </div>
      </div>

      <style>{`
        .site-footer {
          background-color: var(--deep-burgundy);
          color: #FFFFFF;
          padding-top: 60px;
          padding-bottom: 24px;
        }
        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .footer-brand {
          margin-bottom: 12px;
        }
        .footer-logo {
          height: 38px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }
        .footer-tagline {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          line-height: 1.5;
          max-width: 320px;
        }
        .footer-col-title {
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 16px;
          color: #FFFFFF;
        }
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-links li {
          margin-bottom: 10px;
        }
        .footer-links button, .footer-links a {
          color: rgba(255, 255, 255, 0.75);
          font-size: 0.88rem;
          text-decoration: none;
          transition: color 0.15s;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
        }
        .footer-links button:hover, .footer-links a:hover {
          color: #FFFFFF;
          text-decoration: underline;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          padding-top: 24px;
          text-align: center;
        }
        .footer-bottom p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
        }
        @media (max-width: 850px) {
          .footer-content {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 500px) {
          .footer-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
};
