import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';

interface HeaderLogoProps {
  isScrolled: boolean;
  isMobile: boolean;
  isRTL: boolean;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ isScrolled, isMobile, isRTL }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const fallback = document.createElement('div');
    fallback.className = 'relative w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-primary-600 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:rotate-12';
    fallback.innerHTML = '<span class="text-white font-bold text-xs sm:text-sm lg:text-base">M</span>';
    target.parentNode?.appendChild(fallback);
  };

  return (
    <Link
      to="/"
      className={`flex items-center z-50 group  flex-shrink-0 ${
        isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
      }`}
    >
      <motion.div
        className="relative flex-shrink-0"
        whileHover={{ scale: 1.3, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className={`
            p-1 sm:p-2 rounded-full transition-all duration-300 group-hover:shadow-xl 
            ${
              isScrolled || isMobile
                ? 'bg-white/95 backdrop-blur-lg border border-white/40 shadow-lg'
                : 'bg-white/90 backdrop-blur-md border border-white/30 shadow-xl'
            }
          `}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full blur-sm"></div>

          {/* Logo Image */}
          <img
            src="https://i.postimg.cc/x1bkFGQh/logo.png"
            alt="Dorar Logo"
            className="relative w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 object-contain rounded-lg transition-transform duration-300 group-hover:rotate-12"
            onError={handleImageError}
          />
        </div>
      </motion.div>
    </Link>
  );
};

export default HeaderLogo;
