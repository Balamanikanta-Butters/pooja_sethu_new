import React, { useState, useEffect } from 'react';
import type { PoojaItem } from '../types';
import { getPoojaIllustration } from './Illustrations';
import { apiRequest } from '../utils/apiClient';
import { useLanguage } from '../context/LanguageContext';

interface PopularPoojasProps {
  onSelectPooja: (pooja: PoojaItem) => void;
}

export const PopularPoojas: React.FC<PopularPoojasProps> = ({ onSelectPooja }) => {
  const { lang } = useLanguage();
  const [popularList, setPopularList] = useState<PoojaItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadPopular = async () => {
      try {
        const res = await apiRequest('/api/home', { timeoutMs: 8000 });
        if (!isMounted) return;
        const data = res.data;
        if (data && Array.isArray(data.popularPoojas) && data.popularPoojas.length > 0) {
          const mapped: PoojaItem[] = data.popularPoojas.slice(0, 4).map((p: any) => {
            const priceStr = String(p.price || '');
            const parsedNums = priceStr.match(/\d[\d,]*/g)?.map(n => parseInt(n.replace(/,/g, ''), 10)).filter(n => !isNaN(n) && n > 0 && n < 500000) || [];
            const numPrice = typeof p.price === 'number'
              ? p.price
              : (parsedNums.length > 0 ? parsedNums[0] : 3000);
            
            const catLower = (p.category || '').toLowerCase();
            const normalizedCategory = catLower.includes('gruha') ? 'gruha'
              : catLower.includes('samskara') ? 'samskaras'
              : catLower.includes('vrata') ? 'vratams'
              : catLower.includes('homa') ? 'homams'
              : catLower.includes('pitru') ? 'pitru'
              : catLower.includes('festiv') ? 'festivals'
              : 'gruha';

            const titleLower = (p.title || '').toLowerCase();
            let illType = 'house';
            if (titleLower.includes('satyanarayana') || titleLower.includes('vratham')) illType = 'satyanarayana';
            else if (titleLower.includes('homam')) illType = 'homam';
            else if (titleLower.includes('abdikam') || titleLower.includes('shraddha') || titleLower.includes('pitru')) illType = 'abdikam';
            else if (titleLower.includes('vastu')) illType = 'vastu';
            else if (titleLower.includes('bhoomi')) illType = 'bhoomi';
            else if (titleLower.includes('ganapathi') || titleLower.includes('vinayaka')) illType = 'homam';

            return {
              id: p.id,
              title: p.title,
              teluguTitle: p.subtitle || '',
              category: normalizedCategory,
              description: p.desc || '',
              duration: p.duration || '2.5 hrs',
              price: numPrice,
              illustrationType: illType
            };
          });
          setPopularList(mapped);
        }
      } catch (err) {
        // Silently handled or graceful empty state
      }
    };
    loadPopular();
    return () => {
      isMounted = false;
    };
  }, []);

  const renderArt = (type: string, title?: string) => {
    return getPoojaIllustration(title, type);
  };

  return (
    <section className="popular-poojas-section">
      <h2 className="section-title">
        {lang === 'te' ? 'హైదరాబాద్‌లో అత్యధికంగా బుక్ అయ్యే పూజలు' : 'Popular Poojas'}
      </h2>

      <div className="popular-grid">
        {popularList.map((pooja) => (
          <div key={pooja.id} className="popular-card" onClick={() => onSelectPooja(pooja)}>
            <div className="art-box">
              {renderArt(pooja.illustrationType, pooja.title)}
            </div>
            <div className="popular-body">
              <h3 className="popular-name">{pooja.title}</h3>
              <span className="popular-telugu font-telugu">{pooja.teluguTitle}</span>
              <div className="popular-footer">
                <span className="popular-duration">{pooja.duration}</span>
                <span className="popular-price">
                  {lang === 'te' ? 'ప్రారంభం ' : 'from '}<strong>₹{pooja.price.toLocaleString('en-IN')}</strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .popular-poojas-section {
          margin-bottom: 54px;
        }
        .section-title {
          font-size: 1.65rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 24px;
        }
        .popular-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .popular-card {
          background-color: #FFFFFF;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          display: flex;
          flex-direction: column;
        }
        .popular-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--gold-warm);
        }
        .art-box {
          height: 160px;
          width: 100%;
          overflow: hidden;
        }
        .popular-body {
          padding: 16px 18px 18px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .popular-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 2px;
        }
        .popular-telugu {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 18px;
          display: block;
        }
        .popular-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border-light);
          padding-top: 12px;
          margin-top: auto;
        }
        .popular-duration {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .popular-price {
          font-size: 0.85rem;
          color: var(--text-dark);
        }
        .popular-price strong {
          font-size: 1rem;
          font-weight: 700;
        }
        @media (max-width: 1024px) {
          .popular-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 580px) {
          .popular-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
