import React from 'react';
import heroLogo from '../../images/future/hero-bacground.jpg';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaAction?: () => void;
  ctaLink?: string;
}

const HeroSection = ({ title, subtitle, ctaText, ctaAction, ctaLink }: HeroSectionProps) => {
  return (
    <div className="relative h-96 bg-gradient-to-r from-amber-50 to-orange-50 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: heroLogo ? `url(${heroLogo})` : undefined,
        }}
      >
        {/* Debug: show image if background fails */}
        <img src={heroLogo} alt="Hero background debug" className="hidden" onError={(e) => { e.currentTarget.style.display = 'block'; }} />
      </div>
      
      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-md">
            {subtitle}
          </p>
          {ctaText && (
            <button
              onClick={ctaAction}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {ctaText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;