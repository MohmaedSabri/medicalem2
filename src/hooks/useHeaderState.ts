import { useState, useEffect, useCallback } from 'react';

export interface HeaderState {
  isMenuOpen: boolean;
  showProductsMenu: boolean;
  showLanguageDropdown: boolean;
  isScrolled: boolean;
  isMobile: boolean;
  hoveredCategory: string | null;
}

export const useHeaderState = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;

      if (
        !target.closest('.products-dropdown') &&
        !target.closest('.products-button') &&
        !target.closest('.language-dropdown') &&
        !target.closest('.language-button')
      ) {
        setShowProductsMenu(false);
        setShowLanguageDropdown(false);
        setHoveredCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  }, [closeTimeout]);

  const setCloseTimeoutWithCallback = useCallback((callback: () => void, delay: number) => {
    clearCloseTimeout();
    const timeout = setTimeout(callback, delay);
    setCloseTimeout(timeout);
  }, [clearCloseTimeout]);

  return {
    state: {
      isMenuOpen,
      showProductsMenu,
      showLanguageDropdown,
      isScrolled,
      isMobile,
      hoveredCategory,
    },
    actions: {
      setIsMenuOpen,
      setShowProductsMenu,
      setShowLanguageDropdown,
      setHoveredCategory,
      clearCloseTimeout,
      setCloseTimeoutWithCallback,
    },
  };
};

