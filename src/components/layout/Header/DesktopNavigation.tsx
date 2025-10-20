import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Info,
  Zap,
  User,
} from 'lucide-react';
import ProductsDropdown from './ProductsDropdown';
import LanguageDropdown from './LanguageDropdown';

interface DesktopNavigationProps {
  isRTL: boolean;
  currentLanguage: string;
  showProductsMenu: boolean;
  hoveredCategory: string | null;
  showLanguageDropdown: boolean;
  onProductsMouseEnter: () => void;
  onProductsMouseLeave: () => void;
  onProductsClick: (e: React.MouseEvent) => void;
  onCategoryMouseEnter: (categoryId: string) => void;
  onCategoryMouseLeave: () => void;
  onCategoryClick: (categoryId: string, e: React.MouseEvent) => void;
  onProductsClose: () => void;
  onLanguageMouseEnter: () => void;
  onLanguageMouseLeave: () => void;
  onLanguageToggle: () => void;
  onChangeLanguage: (lang: string) => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  isRTL,
  currentLanguage,
  showProductsMenu,
  hoveredCategory,
  showLanguageDropdown,
  onProductsMouseEnter,
  onProductsMouseLeave,
  onProductsClick,
  onCategoryMouseEnter,
  onCategoryMouseLeave,
  onCategoryClick,
  onProductsClose,
  onLanguageMouseEnter,
  onLanguageMouseLeave,
  onLanguageToggle,
  onChangeLanguage,
}) => {
  const location = useLocation();

  const navigationItems = [
    {
      path: '/',
      label: currentLanguage === 'ar' ? 'درر' : 'Dorar',
      icon: Home,
    },
    {
      path: '/doctors',
      label: currentLanguage === 'ar' ? 'الفريق' : 'Team',
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
    }
  ];

  return (
    <nav className="hidden xl:flex items-center justify-end">
      <div
        className={`
          flex items-center space-x-1 sm:space-x-2 xl:space-x-2 rounded-full px-1 py-1 sm:px-2 sm:py-2 border transition-all duration-300
          bg-white/80 backdrop-blur-md border-white/20 shadow-xl
        `}
      >
        {/* Navigation Items */}
        {navigationItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;

          return (
            <React.Fragment key={item.path}>
              <Link
                to={item.path}
                className={`
                  relative flex items-center px-4 py-1 sm:py-2 xl:py-3 rounded-full transition-all duration-200
                  ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-white/50'
                  }
                `}
              >
                <IconComponent
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${isRTL ? 'ml-1 sm:ml-2' : 'mr-1 sm:mr-2'}`}
                />
                <span className="text-xs sm:text-sm xl:text-base font-medium whitespace-nowrap hidden sm:block">
                  {item.label}
                </span>
           
              </Link>

              {/* Products Dropdown - Show after Home */}
              {index === 0 && (
                <ProductsDropdown
                  showProductsMenu={showProductsMenu}
                  hoveredCategory={hoveredCategory}
                  isRTL={isRTL}
                  currentLanguage={currentLanguage}
                  onMouseEnter={onProductsMouseEnter}
                  onMouseLeave={onProductsMouseLeave}
                  onProductsClick={onProductsClick}
                  onCategoryMouseEnter={onCategoryMouseEnter}
                  onCategoryMouseLeave={onCategoryMouseLeave}
                  onCategoryClick={onCategoryClick}
                  onClose={onProductsClose}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Language Dropdown */}
        <LanguageDropdown
          showLanguageDropdown={showLanguageDropdown}
          isRTL={isRTL}
          currentLanguage={currentLanguage}
          onMouseEnter={onLanguageMouseEnter}
          onMouseLeave={onLanguageMouseLeave}
          onToggle={onLanguageToggle}
          onChangeLanguage={onChangeLanguage}
        />
      </div>
    </nav>
  );
};

export default DesktopNavigation;
