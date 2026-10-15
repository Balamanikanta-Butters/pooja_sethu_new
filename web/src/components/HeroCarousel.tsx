import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ZeroFeeTicketArt, BhojanaluMealArt, HouseIllustration } from './Illustrations';

interface HeroCarouselProps {
  onExplorePoojas: () => void;
  onSelectMuhurtham: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onExplorePoojas, onSelectMuhurtham }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'slide-0',
      tag: 'LAUNCH OFFER',
      title: 'First booking with no booking fee',
      ctaText: 'Explore Poojas ›',
      bgColor: '#164E78',
      action: onExplorePoojas,
      art: <ZeroFeeTicketArt className="carousel-art" />
    },
    {
      id: 'slide-1',
      tag: 'COMPLETE PACKAGE',
      title: 'Purohit, Samagri and Bhojanalu, one booking',
      ctaText: 'See how ›',
      bgColor: '#26532B',
      action: onExplorePoojas,
      art: <BhojanaluMealArt className="carousel-art" />
    },
    {
      id: 'slide-2',
      tag: 'MUHURTHAMS OPEN',
      title: 'Gruhapravesam on 22 and 25 Oct',
      ctaText: 'Pick a date ›',
      bgColor: '#75550C',
      action: onSelectMuhurtham,
      art: (
        <div className="carousel-house-circle">
          <HouseIllustration className="carousel-art-house" />
        </div>
      )
    }
  ];

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
        .carousel-house-circle {
          width: 220px;
          height: 220px;
          border-radius: 50%;
          overflow: hidden;
          background: #C49129;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .carousel-art-house {
          width: 130%;
          height: 130%;
          object-fit: cover;
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
