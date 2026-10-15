import React, { useState, useEffect } from 'react';
import type { PoojaItem } from '../types';
import { getPoojaIllustration } from '../components/Illustrations';
import { apiRequest } from '../utils/apiClient';

interface AllPoojasPageProps {
  onSelectPooja: (pooja: PoojaItem) => void;
  onNavigateHome: () => void;
  initialCategory?: string;
  searchQuery?: string;
}

export const AllPoojasPage: React.FC<AllPoojasPageProps> = ({
  onSelectPooja,
  onNavigateHome,
  initialCategory = 'all',
  searchQuery = ''
}) => {
  const [selectedTradition, setSelectedTradition] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('most-booked');

  const traditions = [
    { id: 'all', label: 'All traditions' },
    { id: 'smartha', label: 'Smartha' },
    { id: 'madhva', label: 'Madhva' },
    { id: 'srivaishnava', label: 'Sri Vaishnava' },
    { id: 'vaikhanasa', label: 'Vaikhanasa' },
    { id: 'samanya', label: 'Samanya / Not sure' },
  ];

  const [categoriesList, setCategoriesList] = useState<{ id: string; label: string }[]>([
    { id: 'all', label: 'All' },
    { id: 'gruha', label: 'Gruha' },
    { id: 'samskara', label: 'Samskaras' },
    { id: 'vratam', label: 'Vratams' },
    { id: 'homam', label: 'Homams' },
    { id: 'pitru', label: 'Pitru Karyams' },
    { id: 'festival', label: 'Festivals' },
    { id: 'business', label: 'Business and vehicle' },
  ]);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const json = await apiRequest('/api/services/categories', { timeoutMs: 6000 });
        if (!isMounted) return;
        const list = Array.isArray(json.data) ? json.data : (json.raw?.data || []);
        if (json.success && Array.isArray(list) && list.length > 0) {
          const mappedCats = [
            { id: 'all', label: 'All' },
            ...list.map((c: any) => ({
              id: c.code || c.id,
              label: c.name || c.code
            }))
          ];
          setCategoriesList(mappedCats);
        }
      } catch (err) {
        // Fallback default list remains
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const [poojaItems, setPoojaItems] = useState<(PoojaItem & { minPrice: number; maxPrice: number; traditionLabel: string; popularity: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbOffline, setDbOffline] = useState(false);

  const fetchPoojas = async () => {
    setLoading(true);
    setDbOffline(false);
    try {
      const res = await apiRequest('/api/services/poojas', { timeoutMs: 8000, retries: 1 });
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const liveMerged = res.data.map((apiItem: any) => {
          const catLower = (apiItem.category || '').toLowerCase();
          const normalizedCategory: PoojaItem['category'] = catLower.includes('gruha') ? 'gruha'
            : catLower.includes('samskara') ? 'samskaras'
            : catLower.includes('vrata') ? 'vratams'
            : catLower.includes('homa') ? 'homams'
            : catLower.includes('pitru') ? 'pitru'
            : catLower.includes('festiv') ? 'festivals'
            : catLower.includes('business') || catLower.includes('vehicle') ? 'business'
            : 'gruha';

          const priceStr = String(apiItem.price || '');
          const parsedNums = priceStr.match(/\d[\d,]*/g)?.map(n => parseInt(n.replace(/,/g, ''), 10)).filter(n => !isNaN(n) && n > 0 && n < 500000) || [];
          const minP = parsedNums.length > 0 ? parsedNums[0] : 2500;
          const maxP = parsedNums.length > 1 ? parsedNums[1] : Math.round(minP * 1.4);
          const numPrice = typeof apiItem.price === 'number' ? apiItem.price : minP;

          const illType: PoojaItem['illustrationType'] = normalizedCategory === 'homams' ? 'homam' : normalizedCategory === 'gruha' ? 'house' : 'satyanarayana';

          return {
            id: apiItem.id,
            title: apiItem.title,
            teluguTitle: apiItem.subtitle || apiItem.teluguTitle || '',
            category: normalizedCategory,
            description: apiItem.desc || apiItem.description || '',
            duration: apiItem.duration || '2 hrs',
            price: numPrice,
            minPrice: minP,
            maxPrice: maxP,
            traditionLabel: apiItem.sampradayam || 'All Sampradayams',
            illustrationType: illType,
            popularity: 90
          };
        });
        setPoojaItems(liveMerged);
      } else {
        setDbOffline(res.isDbOffline || true);
      }
    } catch {
      setDbOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoojas();
  }, []);

  // Filter by tradition and category
  const filtered = poojaItems
    .filter(p => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchTelugu = p.teluguTitle ? p.teluguTitle.toLowerCase().includes(q) : false;
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchTitle && !matchTelugu && !matchDesc) return false;
      }
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedTradition === 'smartha' && !p.traditionLabel.includes('Smartha') && !p.traditionLabel.includes('All')) return false;
      if (selectedTradition === 'madhva' && !p.traditionLabel.includes('Madhva') && !p.traditionLabel.includes('All')) return false;
      if (selectedTradition === 'srivaishnava' && !p.traditionLabel.includes('Sri Vaishnava') && !p.traditionLabel.includes('All')) return false;
      if (selectedTradition === 'vaikhanasa' && !p.traditionLabel.includes('Vaikhanasa') && !p.traditionLabel.includes('All')) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.minPrice - b.minPrice;
      if (sortBy === 'price-high') return b.minPrice - a.minPrice;
      return 0;
    });

  const renderCardArt = (title: string) => {
    return getPoojaIllustration(title);
  };

  const categories = categoriesList.map(c => {
    let count = 0;
    if (c.id === 'all') {
      count = poojaItems.length;
    } else {
      count = poojaItems.filter(p => {
        const cat = (p.category || '').toLowerCase();
        const cid = c.id.toLowerCase();
        return cat.includes(cid) || cid.includes(cat);
      }).length;
    }
    return { ...c, count };
  });

  const currentCategoryObj = categories.find(c => c.id === selectedCategory);
  const pageTitle = selectedCategory === 'all' 
    ? 'All Poojas' 
    : currentCategoryObj 
      ? currentCategoryObj.label 
      : 'All Poojas';

  return (
    <div className="all-poojas-page">
      {/* Top Breadcrumb & Header */}
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
        <nav className="breadcrumb" style={{ margin: 0 }}>
          <button className="breadcrumb-home" onClick={onNavigateHome}>Home</button>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">Poojas</span>
        </nav>
      </div>

      <div className="page-header-row" style={{ marginTop: '4px' }}>
        <div>
          <h1 className="page-title font-sans">{pageTitle}</h1>
          <span className="poojas-count">{filtered.length} Poojas</span>
        </div>

        {/* Sort Dropdown */}
        <div className="sort-box">
          <label className="sort-label">Sort</label>
          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="most-booked">Most booked</option>
            <option value="price-low">Dakshina: low to high</option>
            <option value="shortest">Shortest first</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Sidebar Filter on Left + Cards Grid on Right */}
      <div className="all-poojas-layout">
        {/* Left Sidebar Filter */}
        <aside className="filters-sidebar">
          {/* Section 1: SAMPRADAYAM */}
          <div className="filter-group">
            <h3 className="filter-group-title">SAMPRADAYAM</h3>
            <div className="filter-options-list">
              {traditions.map((t) => {
                const isActive = selectedTradition === t.id;
                return (
                  <button
                    key={t.id}
                    className={`filter-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedTradition(t.id)}
                  >
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: CATEGORY */}
          <div className="filter-group">
            <h3 className="filter-group-title">CATEGORY</h3>
            <div className="filter-options-list">
              {categories.map((c) => {
                const isActive = selectedCategory === c.id;
                return (
                  <button
                    key={c.id}
                    className={`filter-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(c.id)}
                  >
                    <span>{c.label}</span>
                    <span className="filter-count-badge">{c.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clear Filters Button */}
          {(selectedTradition !== 'all' || selectedCategory !== 'all') && (
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setSelectedTradition('all');
                setSelectedCategory('all');
              }}
            >
              Clear filters
            </button>
          )}
        </aside>

        {/* Right Cards Grid */}
        <section className="poojas-catalog-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#888' }}>
              <p>Connecting to database & loading ceremonies...</p>
            </div>
          ) : dbOffline && poojaItems.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              backgroundColor: '#FFF8F6',
              border: '1px solid #F3C4B9',
              borderRadius: '12px',
              padding: '32px 24px',
              textAlign: 'center',
              margin: '20px 0'
            }}>
              <h3 style={{ color: '#900', margin: '0 0 8px 0', fontSize: '1.15rem', fontWeight: 600 }}>Database Connection Pending</h3>
              <p style={{ color: '#555', margin: '0 auto 16px auto', maxWidth: '560px', fontSize: '0.92rem', lineHeight: '1.5' }}>
                All static and mock data has been removed. Ceremonies are queried directly from PostgreSQL at <code>192.168.88.3:5432</code>. Please start your PostgreSQL server to view live ceremonies.
              </p>
              <button 
                type="button" 
                onClick={fetchPoojas}
                style={{
                  padding: '9px 24px',
                  backgroundColor: '#7C1B2C',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.88rem'
                }}
              >
                Retry Connection
              </button>
            </div>
          ) : (
            filtered.map((pooja) => (
              <div 
                key={pooja.id} 
                className="catalog-card"
                onClick={() => onSelectPooja(pooja)}
              >
                {/* Card Artwork Banner */}
                <div className="card-artwork-box">
                  {renderCardArt(pooja.title)}
                </div>

                {/* Card Body */}
                <div className="card-body">
                  <h3 className="card-title">{pooja.title}</h3>
                  <span className="card-telugu-title font-telugu">{pooja.teluguTitle}</span>
                  <p className="card-description">{pooja.description}</p>
                  
                  {/* Tradition Pill */}
                  <div className="card-tradition-wrapper">
                    <span className="card-tradition-pill">{pooja.traditionLabel}</span>
                  </div>

                  {/* Footer: duration + dakshina range */}
                  <div className="card-footer-row">
                    <span className="card-duration">{pooja.duration}</span>
                    <span className="card-dakshina">
                      Dakshina <strong>₹{pooja.minPrice.toLocaleString('en-IN')} – ₹{pooja.maxPrice.toLocaleString('en-IN')}</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      <style>{`
        .all-poojas-page {
          padding-top: 20px;
          padding-bottom: 60px;
        }
        .page-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          margin-bottom: 8px;
        }
        .breadcrumb-home {
          color: var(--primary-maroon);
          font-weight: 600;
        }
        .breadcrumb-home:hover {
          text-decoration: underline;
        }
        .breadcrumb-sep {
          color: var(--text-light);
        }
        .breadcrumb-current {
          color: var(--text-dark);
          font-weight: 600;
        }
        .page-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 2px;
          letter-spacing: -0.5px;
        }
        .poojas-count {
          font-size: 0.95rem;
          color: var(--text-muted);
        }
        .sort-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sort-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .sort-select {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 8px 16px;
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-dark);
          outline: none;
          cursor: pointer;
          min-width: 150px;
        }
        .all-poojas-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 36px;
          align-items: start;
        }
        .filters-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .filter-group {
          background: #FFFFFF;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-lg);
          padding: 20px 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.02);
        }
        .filter-group-title {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--text-muted);
          margin-bottom: 12px;
          padding-left: 8px;
        }
        .filter-options-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .filter-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-body);
          text-align: left;
          transition: all 0.15s ease;
        }
        .filter-btn:hover {
          background: var(--bg-subtle);
          color: var(--primary-maroon);
        }
        .filter-btn.active {
          background: var(--primary-maroon);
          color: #FFFFFF;
        }
        .filter-btn.active .filter-count-badge {
          color: #FFFFFF;
          opacity: 0.85;
        }
        .filter-count-badge {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
        }
        .clear-filters-btn {
          margin-top: 8px;
          background: transparent;
          border: none;
          color: var(--primary-maroon);
          font-weight: 700;
          font-size: 0.92rem;
          cursor: pointer;
          padding: 8px 12px;
          text-align: center;
          transition: opacity 0.2s ease;
        }
        .clear-filters-btn:hover {
          opacity: 0.8;
          text-decoration: underline;
        }
        .poojas-catalog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: start;
        }
        .catalog-card {
          background: #FFFFFF;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          display: flex;
          flex-direction: column;
          height: auto;
          box-shadow: 0 1px 4px rgba(0,0,0,0.02);
        }
        .catalog-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--gold-warm);
        }
        .card-artwork-box {
          height: 160px;
          width: 100%;
          overflow: hidden;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .card-artwork-box svg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .card-body {
          padding: 18px 20px 20px 20px;
          display: flex;
          flex-direction: column;
        }
        .card-title {
          font-size: 1.22rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 2px;
        }
        .card-telugu-title {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-bottom: 10px;
          display: block;
        }
        .card-description {
          font-size: 0.86rem;
          color: var(--text-body);
          line-height: 1.45;
          margin-bottom: 14px;
          min-height: 38px;
        }
        .card-tradition-wrapper {
          margin-bottom: 14px;
        }
        .card-tradition-pill {
          background: #F5EBE1;
          color: #795548;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          display: inline-block;
        }
        .card-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border-light);
          padding-top: 12px;
          margin-top: 4px;
        }
        .card-duration {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .card-dakshina {
          font-size: 0.82rem;
          color: var(--text-dark);
        }
        .card-dakshina strong {
          font-weight: 700;
        }
        @media (max-width: 1100px) {
          .poojas-catalog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 850px) {
          .all-poojas-layout {
            grid-template-columns: 1fr;
          }
          .filters-sidebar {
            flex-direction: row;
            flex-wrap: wrap;
          }
        }
        @media (max-width: 600px) {
          .poojas-catalog-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
