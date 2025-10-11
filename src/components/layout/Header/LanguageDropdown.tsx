import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface LanguageDropdownProps {
  showLanguageDropdown: boolean;
  isRTL: boolean;
  currentLanguage: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggle: () => void;
  onChangeLanguage: (lang: string) => void;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  showLanguageDropdown,
  isRTL,
  currentLanguage,
  onMouseEnter,
  onMouseLeave,
  onToggle,
  onChangeLanguage,
}) => {
  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.15, ease: 'easeOut' as const },
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: { duration: 0.1, ease: 'easeIn' as const },
    },
  };

  return (
    <div
      className="relative language-dropdown"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <motion.button
        onClick={onToggle}
        className="language-button flex items-center px-3 xl:px-4 py-2 xl:py-3 rounded-full text-gray-700 hover:text-primary-600 hover:bg-white/50 transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
        <span className="text-sm xl:text-base font-medium">
          {currentLanguage.toUpperCase()}
        </span>
        <ChevronDown
          className={`h-3 w-3 ml-1 transition-transform ${
            showLanguageDropdown ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </motion.button>

      {/* Language Dropdown Menu */}
      <AnimatePresence>
        {showLanguageDropdown && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`language-dropdown absolute ${
              isRTL ? 'left-0' : 'right-0'
            } mt-1 w-32 rounded-xl bg-white/95 backdrop-blur-lg border border-white/30 shadow-xl p-2 z-50`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <button
              onClick={() => onChangeLanguage('en')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                currentLanguage === 'en'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              En
            </button>
            <button
              onClick={() => onChangeLanguage('ar')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                currentLanguage === 'ar'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              Ar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageDropdown;
