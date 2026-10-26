import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { PanchangamCard } from './components/PanchangamCard';
import { SampradayaBanner } from './components/SampradayaBanner';
import { BookPoojaSection } from './components/BookPoojaSection';
import { MuhurthamAndFestivals } from './components/MuhurthamAndFestivals';
import { PopularPoojas } from './components/PopularPoojas';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { FullPanchangamModal } from './components/FullPanchangamModal';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { PolicySupportModal, type PolicyModalTab } from './components/PolicySupportModal';
import { AllPoojasPage } from './pages/AllPoojasPage';
import { PoojaDetailPage } from './pages/PoojaDetailPage';
import { BookingPage } from './pages/BookingPage';
import { PanchangamPage } from './pages/PanchangamPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ToastContainer } from './components/ToastNotification';
import { apiRequest } from './utils/apiClient';
import { useLanguage } from './context/LanguageContext';
import type { PoojaItem, PanchangamData } from './types';

export const App: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedTradition, setSelectedTradition] = useState('all');
  const [catalogCategory, setCatalogCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Navigation / Page views: 'default' | 'pooja-detail' | 'booking'
  const [currentView, setCurrentView] = useState<'default' | 'pooja-detail' | 'booking'>('default');
  const [detailPooja, setDetailPooja] = useState<PoojaItem | null>(null);
  const [bookingDetails, setBookingDetails] = useState<{ pooja: PoojaItem; muhurtham: string; tradition: string } | null>(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPanchangamOpen, setIsPanchangamOpen] = useState(false);
  const [policyModalTab, setPolicyModalTab] = useState<PolicyModalTab | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    pooja: PoojaItem;
    date: string;
    bookingNo?: string;
    bookingId?: string;
    paymentId?: string;
    includeSamagri?: boolean;
    isPurohitOnly?: boolean;
  } | null>(null);

  // User state
  const [user, setUser] = useState<any>(null);
  const [homeBanners, setHomeBanners] = useState<any[]>([]);

  // Panchangam data
  const [panchangamData, setPanchangamData] = useState<PanchangamData>({
    dateStr: 'Saturday, 3 October 2026 · Hyderabad',
    city: 'Hyderabad',
    specialNote: 'Mahalaya Paksham: an auspicious fortnight for Pitru Tarpanam and Shraddha.',
    tithi: 'Bahula Saptami',
    nakshatram: 'Mrigasira',
    masam: 'Bhadrapada',
    rutuvu: 'Varsha Rutuvu',
    ayanam: 'Dakshinayanam',
    kalam: 'Subha Kalam',
    rahuKalam: '9:00 – 10:30',
    yamagandam: '1:30 – 3:00',
    durmuhurtham: '6:05 – 6:52 AM, 6:52 – 7:39 AM',
    varjyam: '2:15 – 3:45 PM'
  });

  // Check auth session & load live home data
  useEffect(() => {
    let isMounted = true;

    const initAppData = async () => {
      const token = localStorage.getItem('jwt_token') || localStorage.getItem('pooja_sethu_token');
      if (token) {
        try {
          const res = await apiRequest('/api/auth/me', { timeoutMs: 6000 });
          if (!isMounted) return;
          if (res.success && res.data) {
            const u = res.raw?.user || res.data?.user || res.data;
            if (u) setUser(u);
          } else if (res.statusCode === 401 || res.statusCode === 403) {
            // Invalid/expired token
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('pooja_sethu_token');
          }
        } catch {
          // Keep existing state on transient network failures
        }
      }

      // Fetch live panchangam from backend
      try {
        const homeRes = await apiRequest('/api/home', { timeoutMs: 8000 });
        if (!isMounted) return;
        const homeData = homeRes.raw || homeRes.data;
        if (homeRes.success) {
          if (Array.isArray(homeData?.banners) && homeData.banners.length > 0) {
            setHomeBanners(homeData.banners);
          }
          if (homeData?.todaysPanchangam) {
            const p = homeData.todaysPanchangam;
            setPanchangamData(prev => ({
              ...prev,
              tithi: p.tithi ? `${p.paksham || 'Shukla'} ${p.tithi}` : prev.tithi,
              nakshatram: p.nakshatram || prev.nakshatram,
              masam: p.masam || prev.masam,
              rutuvu: p.rutuvu || prev.rutuvu,
              ayanam: p.ayanam || prev.ayanam,
              rahuKalam: p.avoid_periods?.find((ap: any) => ap.name?.toLowerCase().includes('rahu')) 
                ? `${p.avoid_periods.find((ap: any) => ap.name?.toLowerCase().includes('rahu')).from} – ${p.avoid_periods.find((ap: any) => ap.name?.toLowerCase().includes('rahu')).to}`
                : prev.rahuKalam,
              yamagandam: p.avoid_periods?.find((ap: any) => ap.name?.toLowerCase().includes('yama')) 
                ? `${p.avoid_periods.find((ap: any) => ap.name?.toLowerCase().includes('yama')).from} – ${p.avoid_periods.find((ap: any) => ap.name?.toLowerCase().includes('yama')).to}`
                : prev.yamagandam
            }));
          }
        }
      } catch {
        // Silently preserve initial panchangam state
      }
    };

    initAppData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('pooja_sethu_token');
    setUser(null);
    if (activeTab === 'Profile') {
      setActiveTab('Home');
      setCurrentView('default');
    }
  };

  const handleOpenPoojaDetail = (pooja: PoojaItem) => {
    setDetailPooja(pooja);
    setCurrentView('pooja-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartBooking = (pooja: PoojaItem, muhurtham: string, tradition: string) => {
    setBookingDetails({ pooja, muhurtham, tradition });
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingComplete = (details: any) => {
    setCurrentView('default');

    // Save newly booked pooja to localStorage for My Bookings tab
    const hasSamagri = details.includeSamagri !== undefined
      ? Boolean(details.includeSamagri)
      : (details.isPurohitOnly ? false : details.mode !== 'Purohit only (Pay Later)' && !details.mode?.includes('Purohit only'));

    const newRecord = {
      id: details.bookingId || `bk-${Date.now()}`,
      bookingNo: details.bookingNo || `PS-BK-${Math.floor(10000 + Math.random() * 90000)}`,
      poojaTitle: details.pooja.title,
      poojaTeluguTitle: details.pooja.teluguTitle,
      status: 'confirmed' as const,
      statusLabel: 'Confirmed',
      slot: details.slot,
      dateStr: details.slot.split('·')[0].trim(),
      address: details.address || 'Home Venue, Hyderabad',
      purohitName: details.purohit?.name || 'Brahmasri Venkata Somayajulu',
      purohitVeda: details.purohit?.veda || 'Krishna Yajur Veda',
      purohitPhone: '+91 94401 23456',
      totalAmount: details.total,
      guestCount: details.guestCount,
      includeSamagri: hasSamagri,
      includeBhojanalu: details.guestCount > 0,
      kartaName: details.karta || 'Bala Manikanta',
      gotram: 'Kashyapa',
      bookedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const existingStr = localStorage.getItem('pooja_sethu_bookings');
    let existing = [];
    if (existingStr) {
      try { existing = JSON.parse(existingStr); } catch (e) {}
    }
    localStorage.setItem('pooja_sethu_bookings', JSON.stringify([newRecord, ...existing]));

    setCurrentView('default');
    setActiveTab('Home');
    setConfirmedBooking({
      pooja: details.pooja,
      date: details.slot,
      bookingNo: details.bookingNo,
      bookingId: details.bookingId,
      paymentId: details.paymentId,
      includeSamagri: hasSamagri,
      isPurohitOnly: !hasSamagri
    });
  };

  const scrollToPoojas = () => {
    setCurrentView('default');
    setActiveTab('Poojas');
  };

  const scrollToMuhurthams = () => {
    setCurrentView('default');
    const el = document.getElementById('muhurtham-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-root">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setCurrentView('default');
          setActiveTab(tab);
          if (tab === 'Homams') {
            setCatalogCategory('homams');
          } else if (tab === 'Poojas') {
            setCatalogCategory('all');
          }
        }}
        lang={lang}
        setLang={setLang}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenPanchangam={() => {
          setCurrentView('default');
          setActiveTab('Panchangam');
        }}
        user={user}
        onSignOut={handleSignOut}
        onSearch={(q) => {
          setSearchQuery(q);
          if (q.trim() && activeTab !== 'Poojas' && activeTab !== 'Home') {
            scrollToPoojas();
          }
        }}
      />

      {/* Main Content Area */}
      <main className="container page-main">
        {currentView === 'booking' && bookingDetails ? (
          <BookingPage
            pooja={bookingDetails.pooja}
            initialMuhurtham={bookingDetails.muhurtham}
            initialTradition={bookingDetails.tradition}
            onNavigateHome={() => {
              setCurrentView('default');
              setActiveTab('Home');
            }}
            onNavigatePoojaDetail={() => {
              setDetailPooja(bookingDetails.pooja);
              setCurrentView('pooja-detail');
            }}
            onBookingComplete={handleBookingComplete}
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        ) : currentView === 'pooja-detail' && detailPooja ? (
          <PoojaDetailPage
            pooja={detailPooja}
            onNavigateHome={() => {
              setCurrentView('default');
              setActiveTab('Home');
            }}
            onNavigatePoojas={() => {
              setCurrentView('default');
              setActiveTab('Poojas');
            }}
            onStartBooking={handleStartBooking}
          />
        ) : activeTab === 'Profile' ? (
          <ProfilePage
            user={user}
            onUserUpdate={(updated) => setUser(updated)}
            onNavigateHome={() => {
              setCurrentView('default');
              setActiveTab('Home');
            }}
            onNavigatePoojas={() => {
              setCurrentView('default');
              setActiveTab('Poojas');
            }}
            onSignOut={handleSignOut}
            onOpenPolicy={(tab) => setPolicyModalTab(tab)}
          />
        ) : activeTab === 'My bookings' ? (
          <MyBookingsPage
            onNavigateHome={() => {
              setCurrentView('default');
              setActiveTab('Home');
            }}
            onNavigatePoojas={() => {
              setCurrentView('default');
              setActiveTab('Poojas');
            }}
            userPhone={user?.phoneNumber || user?.mobileNumber}
          />
        ) : activeTab === 'Panchangam' ? (
          <PanchangamPage
            onNavigateHome={() => {
              setCurrentView('default');
              setActiveTab('Home');
            }}
            onNavigatePoojas={() => {
              setCurrentView('default');
              setActiveTab('Poojas');
            }}
          />
        ) : activeTab === 'Poojas' || activeTab === 'Homams' ? (
          <AllPoojasPage
            onSelectPooja={handleOpenPoojaDetail}
            onNavigateHome={() => {
              setCurrentView('default');
              setActiveTab('Home');
            }}
            initialCategory={activeTab === 'Homams' ? 'homams' : catalogCategory}
            initialTradition={selectedTradition}
            searchQuery={searchQuery}
          />
        ) : (
          <>
            {/* Hero Row: Dual Cards Grid */}
            <section className="hero-dual-row">
              <div className="hero-carousel-col">
                <HeroCarousel
                  banners={homeBanners}
                  onExplorePoojas={() => {
                    setCurrentView('default');
                    setActiveTab('Poojas');
                  }}
                  onSelectMuhurtham={scrollToMuhurthams}
                />
              </div>
              <div className="hero-panchangam-col">
                <PanchangamCard
                  onOpenFullPanchangam={() => {
                    setCurrentView('default');
                    setActiveTab('Panchangam');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            </section>

            {/* Sampradayanusaram Filter Bar */}
            <SampradayaBanner
              selectedTradition={selectedTradition}
              onSelectTradition={(traditionId) => {
                setSelectedTradition(traditionId);
                setCurrentView('default');
                setActiveTab('Poojas');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Book a Pooja Section */}
            <div id="book-pooja-section">
              <BookPoojaSection
                onSelectPooja={handleOpenPoojaDetail}
                selectedTradition={selectedTradition}
                searchQuery={searchQuery}
                onNavigatePoojas={() => {
                  setCurrentView('default');
                  setActiveTab('Poojas');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>

            {/* Muhurthams & Festivals Ahead */}
            <div id="muhurtham-section">
              <MuhurthamAndFestivals
                onNavigatePanchangam={() => {
                  setCurrentView('default');
                  setActiveTab('Panchangam');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectMuhurtham={(m) => {
                  handleOpenPoojaDetail({
                    id: m.id,
                    title: m.title,
                    teluguTitle: m.title === 'Gruhapravesam' ? 'గృహప్రవేశం' : m.title === 'Satyanarayana Vratham' ? 'సత్యనారాయణ వ్రతం' : 'ఉపనయనం',
                    category: m.iconType === 'gruha' ? 'gruha' : m.iconType === 'vratam' ? 'vratams' : 'samskaras',
                    description: `Auspicious ${m.title} ceremony scheduled during ${m.details}.`,
                    duration: '2.5 hrs',
                    price: 4300,
                    illustrationType: m.iconType === 'gruha' ? 'house' : m.iconType === 'vratam' ? 'satyanarayana' : 'upanyanam'
                  });
                }}
                onSelectFestival={() => {
                  setCatalogCategory('festivals');
                  scrollToPoojas();
                }}
              />
            </div>

            {/* Popular Poojas */}
            <PopularPoojas
              onSelectPooja={handleOpenPoojaDetail}
            />

            {/* How It Works */}
            <HowItWorks />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavClick={(tab, cat) => {
          setCurrentView('default');
          if (cat) {
            setCatalogCategory(cat);
            setActiveTab('Poojas');
          } else {
            setActiveTab(tab);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPanchangam={() => {
          setCurrentView('default');
          setActiveTab('Panchangam');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPolicy={(tab) => setPolicyModalTab(tab)}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedUser) => setUser(loggedUser)}
      />

      <FullPanchangamModal
        isOpen={isPanchangamOpen}
        onClose={() => setIsPanchangamOpen(false)}
        data={panchangamData}
      />

      {policyModalTab && (
        <PolicySupportModal
          initialTab={policyModalTab}
          onClose={() => setPolicyModalTab(null)}
        />
      )}

      <BookingConfirmationModal
        isOpen={!!confirmedBooking}
        onClose={() => {
          setConfirmedBooking(null);
          setCurrentView('default');
          setActiveTab('Home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateBookings={() => {
          setConfirmedBooking(null);
          setCurrentView('default');
          setActiveTab('Bookings');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pooja={confirmedBooking?.pooja || null}
        date={confirmedBooking?.date || ''}
        bookingNo={confirmedBooking?.bookingNo}
        bookingId={confirmedBooking?.bookingId}
        paymentId={confirmedBooking?.paymentId}
        includeSamagri={confirmedBooking?.includeSamagri}
        isPurohitOnly={confirmedBooking?.isPurohitOnly}
      />


      <ToastContainer />

      <style>{`
        .app-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-page);
        }
        .page-main {
          flex: 1;
          padding-top: 28px;
        }
        .hero-dual-row {
          display: grid;
          grid-template-columns: 1.8fr 1.15fr;
          gap: 24px;
          margin-bottom: 30px;
        }
        .hero-carousel-col {
          display: flex;
          flex-direction: column;
        }
        .hero-panchangam-col {
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 1024px) {
          .hero-dual-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
