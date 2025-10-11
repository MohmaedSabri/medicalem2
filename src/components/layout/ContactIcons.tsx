import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Phone, Heart } from 'lucide-react';
import { useContactInfo } from '../../hooks/useContactInfo';
import { useLanguage } from '../../contexts/LanguageContext';

interface ContactIconsProps {
  isScrolled: boolean;
  isMobile: boolean;
  isRTL: boolean;
  currentLanguage: string;
}

const ContactIcons: React.FC<ContactIconsProps> = ({ 
  isScrolled, 
  isMobile, 
  isRTL, 
  currentLanguage 
}) => {
  const navigate = useNavigate();
  const { data: contactInfo, isLoading } = useContactInfo();

  const contactFloatingVariants = {
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut' as const,
        delay: 0.5,
      },
    },
  };

  const iconBaseClasses = `
    relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full transition-all duration-300 group
    ${
      isScrolled || isMobile
        ? 'bg-white/95 backdrop-blur-lg border border-white/40 shadow-lg'
        : 'bg-white/90 backdrop-blur-md border border-white/30 shadow-xl'
    }
    text-gray-600 overflow-hidden
  `;

  return (
    <div className={`hidden xl:flex items-center ${
      isRTL ? 'space-x-reverse space-x-1 sm:space-x-2' : 'space-x-1 sm:space-x-2'
    }`}>
      {/* Cart Icon */}
      <motion.div
        variants={contactFloatingVariants}
        animate="animate"
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to="/cart"
          className={`${iconBaseClasses} hover:text-primary-600`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
          <ShoppingCart className="mx-2 relative h-4 w-4 lg:h-5 lg:w-5 group-hover:scale-110 transition-transform duration-300" />
        </Link>
      </motion.div>

      {/* Phone Icon - Only visible on XL screens */}
      <motion.a
        href={`tel:${contactInfo?.phone || ''}`}
        className={`${iconBaseClasses} hover:text-emerald-600 hidden xl:flex`}
        variants={contactFloatingVariants}
        animate="animate"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        style={{ animationDelay: '0.3s' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
        <Phone className="relative h-4 w-4 lg:h-5 lg:w-5 group-hover:scale-110 transition-transform duration-300" />
      </motion.a>

      {/* Favorites Icon */}
      <motion.div
        variants={contactFloatingVariants}
        animate="animate"
        whileHover={{ scale: 1.1, rotate: -3 }}
        whileTap={{ scale: 0.95 }}
        style={{ animationDelay: '0.6s' }}
      >
        <Link
          to="/favorites"
          className={`${iconBaseClasses} hover:text-red-500`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
          <Heart className="relative h-4 w-4 lg:h-5 lg:w-5 group-hover:scale-110 transition-transform duration-300" />
        </Link>
      </motion.div>

      {/* Contact Button - Only visible on XL screens */}
      <motion.button
        onClick={() => navigate('/contact')}
        className="group relative inline-flex items-center px-2 py-2 sm:px-3 sm:py-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 text-white 
        hover:from-primary-700 hover:to-primary-800 transition-all duration-500 ease-out
         shadow-lg hover:shadow-2xl hover:shadow-primary-500/50 overflow-hidden hidden xl:flex"
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 opacity-0 group-hover:opacity-30 transition-opacity duration-500 ease-out rounded-full"></div>
        
        {/* Sparkle effects */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute top-1 left-3 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-100"></div>
          <div className="absolute top-2 right-4 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 delay-200"></div>
          <div className="absolute bottom-2 left-5 w-1 h-1 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300 delay-300"></div>
          <div className="absolute bottom-1 right-3 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-400"></div>
        </div>

        {/* Button content */}
        <div className={`relative z-10 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Phone className={`h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2 group-hover:scale-110 transition-all duration-300`} />
          <span className="text-xs sm:text-sm font-medium whitespace-nowrap group-hover:drop-shadow-lg transition-all duration-300 hidden sm:block">
            {currentLanguage === 'ar' ? 'اتصل بنا' : 'Contact Us'}
          </span>
        </div>
      </motion.button>
    </div>
  );
};

export default ContactIcons;
