import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  ZeroFeeTicketArt, 
  BhojanaluMealArt, 
  HouseIllustration, 
  MahalayaArt, 
  NavaratriArt, 
  DeepavaliArt,
  SatyanarayanaIllustration,
  HomamIllustration
} from './Illustrations';
import { useLanguage } from '../context/LanguageContext';

interface HeroCarouselProps {
  onExplorePoojas: () => void;
  onSelectMuhurtham: () => void;
  banners?: Array<{
    id: string;
    slot?: string;
    title?: string;
    type?: string;
    target_pooja_name?: string;
  }>;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onExplorePoojas, onSelectMuhurtham, banners = [] }) => {
  const { lang } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Helper to determine specific illustration and theme per banner
  const getBannerVisual = (title: string = '') => {
    const t = title.toLowerCase();
    if (t.includes('mahalaya') || t.includes('amavasya') || t.includes('pitru') || t.includes('tarpanam')) {
      return {
        art: (
          <div className="carousel-circle-frame mahalaya-frame">
            <MahalayaArt className="carousel-art-cover" />
          </div>
        ),
        bgColor: '#261C2C',
        tag: lang === 'te' ? 'వైదిక పర్వదినం' : lang === 'hi' ? 'वैदिक पर्व एवं उत्सव' : 'VEDIC FESTIVAL & PARVAM',
        title: lang === 'te' ? 'మహాలయ అమావాస్య · పితృ తర్పణం' : lang === 'hi' ? 'महालय अमावस्या • पितृ तर्पण' : 'Mahalaya Amavasya • Pitru Tarpanam'
      };
    }
    if (t.includes('navaratri') || t.includes('devi') || t.includes('durga') || t.includes('dasara')) {
      return {
        art: (
          <div className="carousel-circle-frame navaratri-frame">
            <NavaratriArt className="carousel-art-cover" />
          </div>
        ),
        bgColor: '#5A1924',
        tag: lang === 'te' ? 'నవరాత్రి విశేషం' : lang === 'hi' ? 'शारदीय नवरात्रि महोत्सव' : 'DEVI NAVARATRI MAHOTSAVAM',
        title: lang === 'te' ? 'శరన్నవరాత్రి దేవి పూజలు' : lang === 'hi' ? 'शारदीय नवरात्रि देवी पूजा' : 'Devi Navaratri Poojas'
      };
    }
    if (t.includes('deepavali') || t.includes('diwali') || t.includes('lakshmi')) {
      return {
        art: (
          <div className="carousel-circle-frame deepavali-frame">
            <DeepavaliArt className="carousel-art-cover" />
          </div>
        ),
        bgColor: '#341542',
        tag: lang === 'te' ? 'దీపావళి పర్వదినం' : lang === 'hi' ? 'दीपावली महोत्सव' : 'DEEPAVALI UTSAVAM',
        title: lang === 'te' ? 'దీపావళి లక్ష్మీ కుబేర పూజ' : lang === 'hi' ? 'दीपावली लक्ष्मी कुबेर पूजा' : 'Deepavali Lakshmi Pooja'
      };
    }
    if (t.includes('satyanarayana') || t.includes('vratham')) {
      return {
        art: (
          <div className="carousel-circle-frame satya-frame">
            <SatyanarayanaIllustration className="carousel-art-cover" />
          </div>
        ),
        bgColor: '#754B0B',
        tag: lang === 'te' ? 'వ్రత విధానం' : lang === 'hi' ? 'शुभ व्रत अनुष्ठान' : 'AUSPICIOUS VRATHAM',
        title: lang === 'te' ? 'శ్రీ సత్యనారాయణ స్వామి వ్రతం' : lang === 'hi' ? 'श्री सत्यनारायण स्वामी व्रत' : 'Sri Satyanarayana Swamy Vratham'
      };
    }
    if (t.includes('homam') || t.includes('ganapathi') || t.includes('chandi') || t.includes('sudarshana')) {
      return {
        art: (
          <div className="carousel-circle-frame homam-frame">
            <HomamIllustration className="carousel-art-cover" />
          </div>
        ),
        bgColor: '#6B1B15',
        tag: lang === 'te' ? 'హోమ కార్యం' : lang === 'hi' ? 'वैदिक हवन विधि' : 'VEDIC HOMA VIDHI',
        title: title
      };
    }
    if (t.includes('fee') || t.includes('offer')) {
      return {
        art: <ZeroFeeTicketArt className="carousel-art" />,
        bgColor: '#164E78',
        tag: lang === 'te' ? 'ప్రారంభ ఆఫర్' : lang === 'hi' ? 'लॉन्च ऑफर' : 'LAUNCH OFFER',
        title: lang === 'te' ? 'మొదటి బుకింగ్‌కు ఎటువంటి బుకింగ్ రుసుము లేదు' : lang === 'hi' ? 'प्रथम बुकिंग पर शून्य सुविधा शुल्क' : 'First booking with no booking fee'
      };
    }
    return {
      art: (
        <div className="carousel-circle-frame house-frame">
          <HouseIllustration className="carousel-art-cover" />
        </div>
      ),
      bgColor: '#4C1D24',
      tag: lang === 'te' ? 'వైదిక పూజ' : lang === 'hi' ? 'वैदिक अनुष्ठान' : 'VEDIC CEREMONY',
      title: title || (lang === 'te' ? 'శుభ వైదిక పూజ' : lang === 'hi' ? 'शुभ वैदिक पूजा' : 'Auspicious Vedic Ceremony')
    };
  };

  // Base curated slides
  const baseSlides = [
    {
      id: 'slide-offer',
      tag: lang === 'te' ? 'ప్రారంభ ఆఫర్' : lang === 'hi' ? 'लॉन्च ऑफर' : 'LAUNCH OFFER',
      title: lang === 'te' ? 'మొదటి బుకింగ్‌కు ఎటువంటి బుకింగ్ రుసుము లేదు' : lang === 'hi' ? 'प्रथम बुकिंग पर शून्य सुविधा शुल्क' : 'First booking with no booking fee',
      ctaText: lang === 'te' ? 'పూజలను చూడండి ›' : lang === 'hi' ? 'पूजाएँ देखें ›' : 'Explore Poojas ›',
      bgColor: '#164E78',
      action: onExplorePoojas,
      art: <ZeroFeeTicketArt className="carousel-art" />
    },
    {
      id: 'slide-package',
      tag: lang === 'te' ? 'సంపూర్ణ ప్యాకేజీ' : lang === 'hi' ? 'सम्पूर्ण पैकेज' : 'COMPLETE PACKAGE',
      title: lang === 'te' ? 'పురోహితులు, సామాగ్రి & భోజనాలు ఒక్క బుకింగ్‌లోనే' : lang === 'hi' ? 'पुरोहित, पूजन सामग्री एवं सात्विक भोजन, एक ही बुकिंग में' : 'Purohit, Samagri and Bhojanalu, one booking',
      ctaText: lang === 'te' ? 'వివరాలు చూడండి ›' : lang === 'hi' ? 'विवरण देखें ›' : 'See how ›',
      bgColor: '#26532B',
      action: onExplorePoojas,
      art: <BhojanaluMealArt className="carousel-art" />
    },
    {
      id: 'slide-gruha',
      tag: lang === 'te' ? 'ముహూర్తాలు సిద్ధం' : lang === 'hi' ? 'शुभ मुहूर्त उपलब्ध' : 'MUHURTHAMS OPEN',
      title: lang === 'te' ? 'అక్టోబర్ 22 మరియు 25న గృహప్రవేశం ముహూర్తాలు' : lang === 'hi' ? '22 एवं 25 अक्टूबर को गृहप्रवेश के शुभ मुहूर्त' : 'Gruhapravesam on 22 and 25 Oct',
      ctaText: lang === 'te' ? 'తేదీని ఎంచుకోండి ›' : lang === 'hi' ? 'तिथि चुनें ›' : 'Pick a date ›',
      bgColor: '#75550C',
      action: onSelectMuhurtham,
      art: (
        <div className="carousel-circle-frame house-frame">
          <HouseIllustration className="carousel-art-cover" />
        </div>
      )
    }
  ];

  // Dynamic slides from database ps.home_banner with distinct, matching artwork & palettes
  const dynamicSlides = banners
    .filter(b => b.title && b.type !== 'panchangam_auto' && !b.title.toLowerCase().includes('no booking fee'))
    .map((b, idx) => {
      const visual = getBannerVisual(b.title);
      return {
        id: b.id || `db-banner-${idx}`,
        tag: visual.tag,
        title: visual.title,
        ctaText: lang === 'te' ? 'పూజ బుక్ చేసుకోండి ›' : lang === 'hi' ? 'पूजा बुक करें ›' : 'Book Pooja ›',
        bgColor: visual.bgColor,
        action: onExplorePoojas,
        art: visual.art
      };
    });

  const slides = dynamicSlides.length > 0 ? [...dynamicSlides, ...baseSlides] : baseSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[currentSlide];

  return (
    <div className="carousel-container" style={{ backgroundColor: activeSlide.bgColor }}>
      <div className="carousel-content">
        <span className="carousel-tag">{activeSlide.tag}</span>
        <h1 className="carousel-title font-serif">{activeSlide.title}</h1>
        <button className="carousel-cta" onClick={activeSlide.action}>
          {activeSlide.ctaText}
        </button>
      </div>

      <div className="carousel-visual">
        {activeSlide.art}
      </div>

      {/* Navigation Arrows */}
      <button className="carousel-arrow prev" onClick={prevSlide} aria-label="Previous Slide">
        <ChevronLeft size={20} />
      </button>
      <button className="carousel-arrow next" onClick={nextSlide} aria-label="Next Slide">
        <ChevronRight size={20} />
      </button>

      {/* Pagination Dots */}
      <div className="carousel-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${currentSlide === idx ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <style>{`
        .carousel-container {
          position: relative;
          border-radius: var(--radius-xl);
          min-height: 380px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 48px 48px 60px 52px;
          color: #FFFFFF;
          overflow: hidden;
          transition: background-color 0.5s ease;
          box-shadow: var(--shadow-md);
        }
        .carousel-content {
          max-width: 55%;
          z-index: 2;
        }
        .carousel-tag {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          opacity: 0.85;
          margin-bottom: 12px;
          display: inline-block;
        }
        .carousel-title {
          font-size: 2.6rem;
          line-height: 1.15;
          font-weight: 700;
          margin-bottom: 24px;
          color: #FFFFFF;
          text-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .carousel-cta {
          background-color: #FFFFFF;
          color: var(--text-dark);
          font-weight: 700;
          font-size: 0.95rem;
          padding: 12px 26px;
          border-radius: var(--radius-pill);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .carousel-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.22);
        }
        .carousel-visual {
          width: 42%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .carousel-art {
          width: 100%;
          max-width: 280px;
          height: auto;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.18));
        }
        .carousel-house-circle,
        .carousel-circle-frame {
          width: 230px;
          height: 230px;
          border-radius: 50%;
          overflow: hidden;
          background: #C49129;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 28px rgba(0,0,0,0.28);
          border: 4px solid rgba(255, 255, 255, 0.22);
          transition: transform 0.3s ease;
        }
        .carousel-circle-frame:hover {
          transform: scale(1.03);
        }
        .carousel-art-house,
        .carousel-art-cover {
          width: 140%;
          height: 140%;
          object-fit: cover;
        }
        .mahalaya-frame {
          background: #151D2A;
          border-color: rgba(147, 197, 253, 0.35);
        }
        .navaratri-frame {
          background: #3B0D13;
          border-color: rgba(252, 211, 77, 0.4);
        }
        .deepavali-frame {
          background: #200E2C;
          border-color: rgba(251, 191, 36, 0.45);
        }
        .satya-frame {
          background: #8C5311;
          border-color: rgba(254, 240, 138, 0.4);
        }
        .homam-frame {
          background: #5C1D06;
          border-color: rgba(249, 115, 22, 0.45);
        }
        .house-frame {
          background: #C49129;
          border-color: rgba(254, 240, 138, 0.35);
        }
        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          color: #27211E;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          backdrop-filter: blur(4px);
          transition: background 0.2s, transform 0.2s;
        }
        .carousel-arrow:hover {
          background: #FFFFFF;
          transform: translateY(-50%) scale(1.08);
        }
        .carousel-arrow.prev { left: 16px; }
        .carousel-arrow.next { right: 16px; }
        .carousel-dots {
          position: absolute;
          bottom: 20px;
          left: 52px;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 5;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-pill);
          background: rgba(255, 255, 255, 0.4);
          transition: all 0.3s ease;
        }
        .dot.active {
          width: 26px;
          background: #FFFFFF;
        }
        @media (max-width: 768px) {
          .carousel-container {
            flex-direction: column;
            padding: 32px 24px 50px 24px;
            min-height: auto;
          }
          .carousel-content {
            max-width: 100%;
            margin-bottom: 24px;
          }
          .carousel-visual {
            width: 100%;
          }
          .carousel-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};
