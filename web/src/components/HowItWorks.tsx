import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'Choose your Pooja',
      desc: 'Pick an occasion and your Sampradayam. See the Vidhi, Samagri and dakshina upfront.'
    },
    {
      num: '2',
      title: 'Pick the muhurtham',
      desc: 'Choose a suggested good time for your city, or one your family already has.'
    },
    {
      num: '3',
      title: 'Select a Purohit',
      desc: 'Verified Purohits of your tradition, with Veda Shakha, languages and reviews.'
    },
    {
      num: '4',
      title: 'We handle the rest',
      desc: 'Book the complete package: Samagri kit, Bhojanalu and decoration, paid safely.'
    }
  ];

  return (
    <section className="how-it-works-section">
      <h2 className="section-title">How Pooja Sethu works</h2>

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
