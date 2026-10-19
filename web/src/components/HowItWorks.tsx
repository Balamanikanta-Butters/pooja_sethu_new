import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { lang } = useLanguage();

  const steps = [
    {
      num: '1',
      title: lang === 'te' ? 'పూజను ఎంచుకోండి' : lang === 'hi' ? 'पूजा का चयन करें' : 'Choose your Pooja',
      desc: lang === 'te' ? 'మీ కుటుంబ సంప్రదాయానికి తగిన పూజను ఎంచుకోండి. విధి, సామాగ్రి మరియు దక్షిణ వివరాలు ముందే చూడండి.' : lang === 'hi' ? 'अपनी पारिवारिक परंपरा अनुसार पूजा चुनें। विधि, सामग्री और दक्षिणा का पूर्ण विवरण पहले से देखें।' : 'Pick an occasion and your Sampradayam. See the Vidhi, Samagri and dakshina upfront.'
    },
    {
      num: '2',
      title: lang === 'te' ? 'శుభ ముహూర్తం నిర్ణయించండి' : lang === 'hi' ? 'शुभ मुहूर्त चुनें' : 'Pick the muhurtham',
      desc: lang === 'te' ? 'పంచాంగం సూచించిన శుభ ముహూర్తాన్ని లేదా మీ కుటుంబ పురోహితులు నిర్ణయించిన సమయాన్ని ఎంచుకోండి.' : lang === 'hi' ? 'पंचांग द्वारा सुझाया गया शुभ समय अथवा अपने पारिवारिक पुरोहित द्वारा निश्चित समय चुनें।' : 'Choose a suggested good time for your city, or one your family already has.'
    },
    {
      num: '3',
      title: lang === 'te' ? 'వేద పండితులను ఎంపిక చేయండి' : lang === 'hi' ? 'वैदिक पुरोहित का चयन करें' : 'Select a Purohit',
      desc: lang === 'te' ? 'వేద శాఖ, అనుభవం మరియు భక్తుల సమీక్షలతో కూడిన ధ్రువీకరించబడిన పురోహితులను ఎంచుకోండి.' : lang === 'hi' ? 'वेद शाखा, अनुभव एवं भक्तों की समीक्षाओं से युक्त प्रमाणित पुरोहित चुनें।' : 'Verified Purohits of your tradition, with Veda Shakha, languages and reviews.'
    },
    {
      num: '4',
      title: lang === 'te' ? 'సంపూర్ణ నిర్వహణ మా బాధ్యత' : lang === 'hi' ? 'बाकी व्यवस्था हमारी' : 'We handle the rest',
      desc: lang === 'te' ? 'పూజా సామాగ్రి కిట్ మరియు సాత్విక భోజనాల పూర్తి ప్యాకేజీని సురక్షితంగా బుక్ చేసుకోండి.' : lang === 'hi' ? 'पूजन सामग्री किट एवं सात्विक भोजन का सम्पूर्ण पैकेज सुरक्षित रूप से बुक करें।' : 'Book the complete package: Samagri kit, Bhojanalu and decoration, paid safely.'
    }
  ];

  return (
    <section className="how-it-works-section">
      <h2 className="section-title">
        {lang === 'te' ? 'పూజా సేతు ఎలా పనిచేస్తుంది?' : lang === 'hi' ? 'पूजा सेतु कैसे कार्य करता है?' : 'How Pooja Sethu works'}
      </h2>

      <div className="steps-grid">
        {steps.map((step) => (
          <div key={step.num} className="step-card">
            <div className="step-badge">{step.num}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-desc">{step.desc}</p>
          </div>
        ))}
      </div>

      <style>{`
        .how-it-works-section {
          margin-bottom: 70px;
        }
        .section-title {
          font-size: 1.65rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 24px;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .step-card {
          background-color: #FFFFFF;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-lg);
          padding: 24px 20px 28px 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 4px rgba(0,0,0,0.02);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .step-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-sm);
        }
        .step-badge {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background-color: var(--primary-maroon-light);
          color: var(--primary-maroon);
          font-size: 0.95rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }
        .step-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 8px;
        }
        .step-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.45;
        }
        @media (max-width: 900px) {
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 500px) {
          .steps-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
