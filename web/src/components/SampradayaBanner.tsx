import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/apiClient';
import { useLanguage } from '../context/LanguageContext';

interface SampradayaBannerProps {
  selectedTradition: string;
  onSelectTradition: (tradition: string) => void;
}

export const SampradayaBanner: React.FC<SampradayaBannerProps> = ({
  selectedTradition,
  onSelectTradition
}) => {
  const { t, lang } = useLanguage();
  const [traditions, setTraditions] = useState([
    { id: 'smartha', label: 'Smartha' },
    { id: 'madhva', label: 'Madhva' },
    { id: 'srivaishnava', label: 'Sri Vaishnava' },
    { id: 'vaikhanasa', label: 'Vaikhanasa' },
    { id: 'raghavendra', label: 'Sri Raghavendra Matha' },
    { id: 'vyasaraja', label: 'Vyasaraja Matha' },
    { id: 'uttaradi', label: 'Uttaradi Matha' },
    { id: 'all', label: 'Not sure' }
  ]);

  useEffect(() => {
    let isMounted = true;
    const loadTraditions = async () => {
      try {
        const res = await apiRequest('/api/services/sampradayams', { timeoutMs: 6000 });
        if (isMounted && res.success) {
          const list = Array.isArray(res.data) ? res.data : (res.raw?.data || []);
          if (Array.isArray(list) && list.length > 0) {
            const mapped = list
              .filter((item: any) => item.code && item.name && item.code !== 'unknown')
              .map((item: any) => ({
                id: item.code.toLowerCase(),
                label: item.name
              }));
            setTraditions([...mapped, { id: 'all', label: t('sampradaya_not_sure', 'Not sure') }]);
          }
        }
      } catch {}
    };
    loadTraditions();
    return () => { isMounted = false; };
  }, [lang]);

  return (
    <section className="sampradaya-wrapper">
      <div className="sampradaya-banner">
        {/* Left Side: Emblem + Info */}
        <div className="sampradaya-info">
          <div className="emblem-container">
            <img src="/logo-icon.png" alt="Sampradaya Emblem" className="emblem-img" />
          </div>
          <div>
            <h3 className="sampradaya-title">
              {t('sampradaya_title', 'Sampradayanusaram')}{' '}
              <span className="telugu-inline font-telugu">· {t('sampradaya_telugu', 'సంప్రదాయానుసారం')}</span>
            </h3>
            <p className="sampradaya-desc">
              {t('sampradaya_desc', "Book by your family's tradition. We show only Poojas and Purohits that follow it.")}
            </p>
          </div>
        </div>

        {/* Right Side: Chips */}
        <div className="sampradaya-chips">
          {traditions.map((t) => {
            const isSelected = selectedTradition === t.id;
            return (
              <button
                key={t.id}
                className={`tradition-chip ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectTradition(t.id)}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .sampradaya-wrapper {
          margin-top: 36px;
          margin-bottom: 36px;
        }
        .sampradaya-banner {
          background-color: var(--gold-banner-bg);
          border: 1px solid var(--gold-banner-border);
          border-radius: var(--radius-lg);
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          box-shadow: 0 2px 8px rgba(197, 137, 37, 0.06);
        }
        .sampradaya-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .emblem-container {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid var(--gold-banner-border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        }
        .emblem-img {
          width: 28px;
          height: 28px;
        }
        .sampradaya-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 2px;
        }
        .telugu-inline {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-muted);
        }
        .sampradaya-desc {
          font-size: 0.85rem;
          color: var(--text-body);
        }
        .sampradaya-chips {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .tradition-chip {
          background-color: #FFFFFF;
          border: 1px solid var(--border-light);
          padding: 7px 18px;
          border-radius: var(--radius-pill);
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-dark);
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .tradition-chip:hover {
          border-color: var(--gold-warm);
          color: var(--gold-warm);
        }
        .tradition-chip.active {
          background-color: #27211E;
          border-color: #27211E;
          color: #FFFFFF;
        }
        @media (max-width: 900px) {
          .sampradaya-banner {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
};
