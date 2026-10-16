import React, { useState, useEffect } from 'react';
import { Home, User, Clock, Flame, Sparkles, Building } from 'lucide-react';
import type { PoojaItem } from '../types';
import { getPoojaIllustration } from './Illustrations';
import { apiRequest } from '../utils/apiClient';
import { useLanguage } from '../context/LanguageContext';

interface BookPoojaSectionProps {
  onSelectPooja: (pooja: PoojaItem) => void;
  selectedTradition: string;
  searchQuery?: string;
  onNavigatePoojas?: () => void;
}

export const BookPoojaSection: React.FC<BookPoojaSectionProps> = ({ 
  onSelectPooja, 
  selectedTradition,
  searchQuery = '',
  onNavigatePoojas
}) => {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('gruha');

  const categories = [
    { id: 'gruha', label: t('cat_gruha', 'Gruha'), icon: <Home size={16} /> },
    { id: 'samskaras', label: t('cat_samskara', 'Samskaras'), icon: <User size={16} /> },
    { id: 'vratams', label: t('cat_vratam', 'Vratams'), icon: <Clock size={16} /> },
    { id: 'homams', label: t('cat_homam', 'Homams'), icon: <Flame size={16} /> },
    { id: 'pitru', label: t('cat_pitru', 'Pitru Karyams'), icon: <Sparkles size={16} /> },
    { id: 'festivals', label: t('cat_festivals', 'Festivals'), icon: <Sparkles size={16} /> },
    { id: 'business', label: t('cat_business', 'Business and vehicle'), icon: <Building size={16} /> },
  ];

  const [poojasList, setPoojasList] = useState<PoojaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbOffline, setDbOffline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPoojas = async () => {
    setLoading(true);
    setDbOffline(false);
    setErrorMessage(null);

    try {
      const res = await apiRequest('/api/services/poojas', { timeoutMs: 8000, retries: 1 });
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const liveMerged: PoojaItem[] = res.data.map((apiItem: any) => {
          const catLower = (apiItem.category || '').toLowerCase();
          const normalizedCategory = catLower.includes('gruha') ? 'gruha'
            : catLower.includes('samskara') ? 'samskaras'
            : catLower.includes('vrata') ? 'vratams'
            : catLower.includes('homa') ? 'homams'
            : catLower.includes('pitru') ? 'pitru'
            : catLower.includes('festiv') ? 'festivals'
            : catLower.includes('business') || catLower.includes('vehicle') ? 'business'
            : 'gruha';

          const priceStr = String(apiItem.price || '');
          const parsedNums = priceStr.match(/\d[\d,]*/g)?.map(n => parseInt(n.replace(/,/g, ''), 10)).filter(n => !isNaN(n) && n > 0 && n < 500000) || [];
          const numPrice = typeof apiItem.price === 'number'
            ? apiItem.price
            : (parsedNums.length > 0 ? parsedNums[0] : 2500);

          return {
            id: apiItem.id,
            title: apiItem.title,
            teluguTitle: apiItem.subtitle || apiItem.teluguTitle || '',
            category: normalizedCategory,
            description: apiItem.desc || apiItem.description || '',
            duration: apiItem.duration || '2 hrs',
            price: numPrice,
            illustrationType: normalizedCategory === 'homams' ? 'homam' : normalizedCategory === 'gruha' ? 'house' : 'satyanarayana'
          };
        });
        setPoojasList(liveMerged);
      } else {
        setDbOffline(res.isDbOffline || true);
        setErrorMessage(res.error || 'Database connection could not be established.');
      }
    } catch (err: any) {
      setDbOffline(true);
      setErrorMessage(err.message || 'Unable to fetch ceremonies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoojas();
  }, []);

  const filteredPoojas = (searchQuery.trim() ? poojasList : poojasList.filter(p => p.category === activeCategory)).filter(p => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchTelugu = p.teluguTitle ? p.teluguTitle.toLowerCase().includes(q) : false;
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchTitle && !matchTelugu && !matchDesc) return false;
    }
    if (selectedTradition === 'all') return true;
    return !!p;
  });

  const renderIllustration = (type: string, title?: string) => {
    return getPoojaIllustration(title, type);
  };

  return (
    <section className="book-pooja-section">
      {/* Header Row */}
      <div className="section-head">
        <div>
          <h2 className="section-title">{t('book_pooja_title', 'Book a Ceremony by Occasion')}</h2>
          <p className="section-subtitle">
            {t('book_pooja_desc', 'Authentic Vedic rituals performed strictly according to your family Shastras.')}
          </p>
        </div>
        <button 
          className="see-all-btn" 
          onClick={onNavigatePoojas}
          type="button"
        >
          {lang === 'te' 
            ? `అన్ని ${poojasList.length || 20} పూజలు చూడండి` 
            : `See all ${poojasList.length || 20} Poojas`}
        </button>
      </div>

      {/* Category Pills */}
      <div className="category-tabs">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-label">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Cards Grid or Offline Banner */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          <p>Connecting to database & loading ceremonies...</p>
        </div>
      ) : dbOffline && poojasList.length === 0 ? (
        <div style={{
          backgroundColor: '#FFF8F6',
          border: '1px solid #F3C4B9',
          borderRadius: '12px',
          padding: '24px 20px',
          textAlign: 'center',
          margin: '20px 0'
        }}>
          <p style={{ color: '#7C1B2C', margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 500 }}>
            Unable to load ceremonies right now.
          </p>
          <button 
            type="button" 
            onClick={fetchPoojas}
            style={{
              padding: '8px 22px',
              backgroundColor: '#7C1B2C',
              color: '#FFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="pooja-grid">
          {filteredPoojas.map((pooja) => (
          <div 
            key={pooja.id} 
            className="pooja-card" 
            onClick={() => onSelectPooja(pooja)}
          >
            {/* Top Artwork Banner */}
            <div className="pooja-art-wrapper">
              {renderIllustration(pooja.illustrationType, pooja.title)}
            </div>

            {/* Card Content */}
            <div className="pooja-card-body">
              <h3 className="pooja-name">{pooja.title}</h3>
              <span className="pooja-telugu-name font-telugu">{pooja.teluguTitle}</span>
              <p className="pooja-desc">{pooja.description}</p>
              
              {/* Footer row: duration + price */}
              <div className="pooja-card-footer">
                <span className="pooja-duration">{pooja.duration}</span>
                <span className="pooja-price">
                  from <strong>₹{pooja.price.toLocaleString('en-IN')}</strong>
                </span>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      <style>{`
        .book-pooja-section {
          margin-bottom: 54px;
        }
        .section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .section-title {
          font-family: var(--font-sans);
          font-size: 1.65rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 4px;
        }
        .section-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
        }
        .see-all-btn {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--primary-maroon);
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .category-tabs {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .category-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #FFFFFF;
          border: 1px solid var(--border-light);
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-dark);
          white-space: nowrap;
          transition: all 0.2s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
        }
        .category-pill:hover {
          border-color: var(--text-dark);
        }
        .category-pill.active {
          background-color: #27211E;
          border-color: #27211E;
          color: #FFFFFF;
        }
        .category-pill.active .cat-icon {
          color: #FFFFFF;
        }
        .pooja-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .pooja-card {
          background-color: #FFFFFF;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          display: flex;
          flex-direction: column;
        }
        .pooja-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--gold-warm);
        }
        .pooja-art-wrapper {
          height: 180px;
          width: 100%;
          overflow: hidden;
          background: #F7DC98;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pooja-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .pooja-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 2px;
        }
        .pooja-telugu-name {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 12px;
          display: block;
        }
        .pooja-desc {
          font-size: 0.88rem;
          color: var(--text-body);
          line-height: 1.45;
          margin-bottom: 22px;
          flex: 1;
        }
        .pooja-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border-light);
          padding-top: 14px;
        }
        .pooja-duration {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .pooja-price {
          font-size: 0.88rem;
          color: var(--text-dark);
        }
        .pooja-price strong {
          font-size: 1.05rem;
          font-weight: 700;
        }
        @media (max-width: 900px) {
          .pooja-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .pooja-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
