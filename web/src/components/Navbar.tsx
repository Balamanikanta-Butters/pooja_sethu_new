import React, { useState } from 'react';
import { Search, User as UserIcon, LogOut } from 'lucide-react';
import type { Language } from '../context/LanguageContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenAuth: () => void;
  onOpenPanchangam: () => void;
  user: any;
  onSignOut: () => void;
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  onOpenAuth,
  onOpenPanchangam,
  user,
  onSignOut,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="navbar-wrapper">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <div className="brand" onClick={() => setActiveTab('Home')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="PoojaSethu" className="brand-logo" />
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <button 
            className={`nav-item ${activeTab === 'Home' ? 'active' : ''}`}
            onClick={() => setActiveTab('Home')}
          >
            {lang === 'te' ? 'హోమ్' : lang === 'hi' ? 'होम' : 'Home'}
          </button>
          <button 
            className={`nav-item ${activeTab === 'Poojas' ? 'active' : ''}`}
            onClick={() => setActiveTab('Poojas')}
          >
            {lang === 'te' ? 'పూజలు' : lang === 'hi' ? 'पूजाएँ' : 'Poojas'}
          </button>
          <button 
            className={`nav-item ${activeTab === 'Homams' ? 'active' : ''}`}
            onClick={() => setActiveTab('Homams')}
          >
            {lang === 'te' ? 'హోమాలు' : lang === 'hi' ? 'हवन' : 'Homams'}
          </button>
          <button 
            className={`nav-item ${activeTab === 'Panchangam' ? 'active' : ''}`}
            onClick={onOpenPanchangam}
          >
            {lang === 'te' ? 'పంచాంగం' : lang === 'hi' ? 'पंचांग' : 'Panchangam'}
          </button>
          <button 
            className={`nav-item ${activeTab === 'My bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('My bookings')}
          >
            {lang === 'te' ? 'నా బుకింగ్స్' : lang === 'hi' ? 'मेरी बुकिंग' : 'My bookings'}
          </button>
          <button 
            className={`nav-item ${activeTab === 'Profile' ? 'active' : ''}`}
            onClick={() => {
              if (user) {
                setActiveTab('Profile');
              } else {
                onOpenAuth();
              }
            }}
          >
            {lang === 'te' ? 'ప్రొఫైల్' : lang === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}
          </button>
        </nav>

        {/* Search Input */}
        <div className="search-bar">
          <Search size={17} className="search-icon" />
          <input
            type="text"
            placeholder={
              lang === 'te'
                ? "పూజ లేదా హోమం కోసం వెతకండి..."
                : lang === 'hi'
                ? "गृहप्रवेश, हवन, पूजा खोजें..."
                : "Search Gruhapravesam, Homam..."
            }
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Language Selector Segment */}
        <div className="lang-segment">
          <button 
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
            onClick={() => setLang('en')}
            title="English"
          >
            EN
          </button>
          <button 
            className={`lang-btn ${lang === 'te' ? 'active' : ''}`}
            onClick={() => setLang('te')}
            title="తెలుగు"
          >
            తె
          </button>
          <button
            className={`lang-btn ${lang === 'hi' ? 'active' : ''}`}
            onClick={() => setLang('hi')}
            title="हिन्दी"
          >
            हिं
          </button>
        </div>

        {/* Authentication Button */}
        {user ? (
          <div 
            className={`user-profile-badge ${activeTab === 'Profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('Profile')}
            style={{ cursor: 'pointer' }}
            title="View Profile and Addresses"
          >
            <div className="avatar-circle">
              <UserIcon size={16} />
            </div>
            <span className="user-name">{user.name || user.mobileNumber || 'Devotee'}</span>
            <button 
              className="signout-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onSignOut();
              }} 
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button className="sign-in-btn" onClick={onOpenAuth}>
            {lang === 'te' ? 'లాగిన్' : lang === 'hi' ? 'लॉग इन' : 'Sign in'}
          </button>
        )}
      </div>

      <style>{`
        .navbar-wrapper {
          background-color: var(--bg-page);
          border-bottom: 1px solid var(--border-light);
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(8px);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          padding-bottom: 14px;
          gap: 16px;
        }
        .brand {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          cursor: pointer;
        }
        .brand-logo {
          height: 38px;
          width: auto;
          object-fit: contain;
          display: block;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-item {
          padding: 8px 16px;
          border-radius: var(--radius-pill);
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-body);
          transition: all 0.2s;
        }
        .nav-item:hover {
          color: var(--primary-maroon);
          background-color: rgba(116, 27, 40, 0.05);
        }
        .nav-item.active {
          background-color: var(--primary-maroon-light);
          color: var(--primary-maroon);
          font-weight: 600;
        }
        .search-bar {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-pill);
          padding: 8px 16px;
          gap: 10px;
          flex: 1;
          max-width: 290px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-bar:focus-within {
          border-color: var(--primary-maroon);
          box-shadow: 0 0 0 3px rgba(116, 27, 40, 0.08);
        }
        .search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .search-bar input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: 0.9rem;
          color: var(--text-dark);
        }
        .search-bar input::placeholder {
          color: var(--text-light);
        }
        .lang-segment {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-pill);
          padding: 3px;
          gap: 2px;
        }
        .lang-btn {
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          transition: all 0.2s;
        }
        .lang-btn.active {
          background-color: var(--primary-maroon-light);
          color: var(--primary-maroon);
        }
        .sign-in-btn {
          background-color: var(--primary-maroon);
          color: #FFFFFF;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 9px 24px;
          border-radius: var(--radius-pill);
          transition: background-color 0.2s, transform 0.1s;
          box-shadow: 0 2px 8px rgba(116, 27, 40, 0.25);
        }
        .sign-in-btn:hover {
          background-color: var(--primary-maroon-hover);
          transform: translateY(-1px);
        }
        .user-profile-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-pill);
          padding: 4px 12px 4px 6px;
        }
        .avatar-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--primary-maroon-light);
          color: var(--primary-maroon);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-dark);
          max-width: 110px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .signout-btn {
          color: var(--text-muted);
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .signout-btn:hover {
          color: var(--primary-maroon);
        }
        @media (max-width: 992px) {
          .search-bar { display: none; }
          .nav-links { gap: 2px; }
          .nav-item { padding: 6px 12px; font-size: 0.85rem; }
        }
      `}</style>
    </header>
  );
};
