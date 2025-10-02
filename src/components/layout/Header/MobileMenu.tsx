import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Package,
  BookOpen,
  Info,
  Heart,
  Phone,
  ShoppingCart,
  ChevronRight,
  X,
  Zap,
  User,
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import Contactinfo from '../../../constant/Contactinfo';

interface MobileMenuProps {
  isMenuOpen: boolean;
  isRTL: boolean;
  currentLanguage: string;
  onClose: () => void;
  onChangeLanguage: (lang: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isMenuOpen,
  isRTL,
  currentLanguage,
  onClose,
  onChangeLanguage,
}) => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      path: '/',
      label: currentLanguage === 'ar' ? 'درر' : 'Dorar',
      icon: Home,
    },
    {
      path: '/doctors',
      label: currentLanguage === 'ar' ? 'الشركاء' : 'Partners',
      icon: User,
    },
    {
      path: '/blog',
      label: currentLanguage === 'ar' ? 'المدونة' : 'Blog',
      icon: BookOpen,
    },
    {
      path: '/about',
      label: currentLanguage === 'ar' ? 'من نحن' : 'About',
      icon: Info,
    },
    {
      path: '/contact',
      label: currentLanguage === 'ar' ? 'اتصل بنا' : 'Contact',
      icon: Phone,
    },
  ];

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 overflow-y-auto hide-scrollbar"
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://i.postimg.cc/x1bkFGQh/logo.png"
                    alt="Dorar Logo"
                    className="h-10 w-10 object-cover rounded-lg"
                  />
                  <span className="text-xl font-bold text-gray-900">Dorar</span>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="p-6">
              {/* Main Navigation */}
              <div className="space-y-3 mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  {currentLanguage === 'ar' ? 'التنقل الرئيسي' : 'Main Navigation'}
                </h3>
                {navigationItems.map((item) => {
                  const isActive = window.location.pathname === item.path;
                  const IconComponent = item.icon;

                  return (
                    <motion.div
                      key={item.path}
                      whileHover={{ x: isRTL ? -5 : 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`
                          flex items-center w-full p-4 rounded-2xl transition-all duration-300 group
                          ${
                            isActive
                              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30'
                              : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600 hover:shadow-md'
                          }
                        `}
                      >
                        <div
                          className={`p-2 rounded-xl ${
                            isActive
                              ? 'bg-white/20'
                              : 'bg-teal-100 group-hover:bg-teal-200'
                          } transition-colors ${isRTL ? 'ml-3' : 'mr-3'}`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <span className="font-medium flex-1">{item.label}</span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="p-1 rounded-full bg-white/20"
                          >
                            <Zap className="h-4 w-4 text-yellow-300" />
                          </motion.div>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Products Section */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  {currentLanguage === 'ar' ? 'المنتجات' : 'Products'}
                </h3>

                {/* All Products Link */}
                <motion.div
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="mb-4"
                >
                  <Link
                    to="/products"
                    onClick={onClose}
                    className="flex items-center w-full p-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100 hover:text-teal-600 transition-all duration-300 group"
                  >
                    <div className="p-2 rounded-xl bg-teal-100 group-hover:bg-teal-200 transition-colors mr-3">
                      <Package className="h-5 w-5" />
                    </div>
                    <span className="font-medium flex-1">
                      {currentLanguage === 'ar' ? 'جميع المنتجات' : 'All Products'}
                    </span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </div>

              {/* Contact & Language Section */}
              <div className="border-t border-gray-200/50 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  {currentLanguage === 'ar' ? 'التواصل' : 'Contact'}
                </h3>

                {/* Contact Links */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <Link to="/cart" onClick={onClose}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl text-teal-600 hover:shadow-lg transition-all duration-300"
                    >
                      <ShoppingCart className="h-6 w-6 mb-2" />
                      <span className="text-xs font-medium">
                        {currentLanguage === 'ar' ? 'السلة' : 'Cart'}
                      </span>
                    </motion.div>
                  </Link>
                  <motion.a
                    href={`tel:${Contactinfo.phone}`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl text-emerald-600 hover:shadow-lg transition-all duration-300"
                  >
                    <Phone className="h-6 w-6 mb-2" />
                    <span className="text-xs font-medium">
                      {currentLanguage === 'ar' ? 'هاتف' : 'Phone'}
                    </span>
                  </motion.a>
                  <Link to="/favorites" onClick={onClose}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center p-4 bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl text-red-600 hover:shadow-lg transition-all duration-300"
                    >
                      <Heart className="h-6 w-6 mb-2" />
                      <span className="text-xs font-medium">
                        {currentLanguage === 'ar' ? 'المفضلة' : 'Favorites'}
                      </span>
                    </motion.div>
                  </Link>
                </div>

                {/* Language Switcher */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {currentLanguage === 'ar' ? 'اللغة' : 'Language'}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      onClick={() => onChangeLanguage('en')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        currentLanguage === 'en'
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      English
                    </motion.button>
                    <motion.button
                      onClick={() => onChangeLanguage('ar')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        currentLanguage === 'ar'
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      العربية
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
