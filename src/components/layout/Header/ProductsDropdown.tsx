import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, X } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useCategories } from '../../../hooks/useCategories';
import { useSubCategories } from '../../../hooks/useSubCategories';

interface ProductsDropdownProps {
  showProductsMenu: boolean;
  hoveredCategory: string | null;
  isRTL: boolean;
  currentLanguage: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onProductsClick: (e: React.MouseEvent) => void;
  onCategoryMouseEnter: (categoryId: string) => void;
  onCategoryMouseLeave: () => void;
  onCategoryClick: (categoryId: string, e: React.MouseEvent) => void;
  onClose: () => void;
}

const ProductsDropdown: React.FC<ProductsDropdownProps> = ({
  showProductsMenu,
  hoveredCategory,
  isRTL,
  currentLanguage,
  onMouseEnter,
  onMouseLeave,
  onProductsClick,
  onCategoryMouseEnter,
  onCategoryMouseLeave,
  onCategoryClick,
  onClose,
}) => {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const { data: subcategories = [] } = useSubCategories();

  // Function to detect if text is Arabic
  const isArabicText = (text: string): boolean => {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicRegex.test(text);
  };

  // Helper function to get subcategories for a category
  const getSubcategoriesForCategory = (categoryId: string) => {
    const filtered = subcategories.filter((sub: any) => {
      const parentId = typeof sub.parentCategory === 'string'
        ? sub.parentCategory
        : sub.parentCategory?._id;
      return parentId === categoryId;
    });
    return filtered;
  };

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
      className="relative products-button"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        onClick={onProductsClick}
        className="flex items-center px-3 xl:px-4 py-2 xl:py-3 rounded-full text-gray-700 hover:text-teal-600 hover:bg-white/50 transition-all duration-200"
      >
        <Package className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
        <span className="text-sm xl:text-base font-medium whitespace-nowrap">
          {currentLanguage === 'ar' ? 'المنتجات' : 'Products'}
        </span>
        <ChevronDown
          className={`h-3 w-3 ml-1 transition-transform ${
            showProductsMenu ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {/* Products dropdown menu */}
      <AnimatePresence>
        {showProductsMenu && (
          <div
            className={`products-dropdown absolute ${
              isRTL ? 'right-0' : 'left-0'
            } mt-1 w-[28rem] lg:w-[32rem] rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-2xl p-4 z-50`}
            style={{
              transform: 'translateY(4px)',
              pointerEvents: 'auto',
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-4">
              <div className="px-2 py-1 text-sm font-semibold text-teal-700 uppercase tracking-wide">
                {currentLanguage === 'ar' ? 'اختر فئة' : 'Select Category'}
              </div>
              <button
                onClick={onClose}
                className="close-products-menu p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Categories grid with hover subcategories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {categories.length > 0 ? (
                categories.map((category: {
                  _id: string;
                  name: string | { en: string; ar: string };
                }) => {
                  const categorySubcategories = getSubcategoriesForCategory(category._id);
                  const categoryName = typeof category.name === 'object'
                    ? (category.name as { [key: string]: string })[currentLanguage] ||
                      (category.name as { en: string; ar: string }).en
                    : category.name;

                  return (
                    <div
                      key={category._id}
                      className="relative group"
                      onMouseEnter={() => onCategoryMouseEnter(category._id)}
                      onMouseLeave={onCategoryMouseLeave}
                    >
                      <button
                        onClick={(e) => onCategoryClick(category._id, e)}
                        className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-700 border border-gray-100 hover:border-teal-200 transition-all duration-200 hover:shadow-md"
                      >
                        <div className="font-medium text-sm sm:text-base">
                          <span
                            className={
                              isArabicText(categoryName) ? 'text-right' : 'text-left'
                            }
                          >
                            {categoryName}
                          </span>
                        </div>
                      </button>

                      {/* Subcategories dropdown on hover - Hidden on mobile, shown on desktop */}
                      {hoveredCategory === category._id && categorySubcategories.length > 0 && (
                        <>
                          {/* Invisible bridge to prevent mouse leaving */}
                          <div
                            className={`absolute top-0 w-1 h-full ${
                              isRTL ? 'right-full' : 'left-full'
                            } hidden lg:block`}
                            style={{
                              marginLeft: isRTL ? '0px' : '-1px',
                              marginRight: isRTL ? '-1px' : '0px',
                            }}
                            onMouseEnter={() => onCategoryMouseEnter(category._id)}
                          />
                          <div
                            className={`absolute top-0 w-56 sm:w-64 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 shadow-2xl p-3 z-50 hidden lg:block ${
                              isRTL ? 'right-full mr-1' : 'left-full ml-1'
                            }`}
                            style={{
                              marginLeft: isRTL ? '0px' : '4px',
                              marginRight: isRTL ? '4px' : '0px',
                            }}
                            onMouseEnter={() => onCategoryMouseEnter(category._id)}
                            onMouseLeave={onCategoryMouseLeave}
                          >
                            <div className="space-y-1 max-h-48 overflow-y-auto">
                              {categorySubcategories.map((subcategory: any) => {
                                const subcategoryName = typeof subcategory.name === 'object'
                                  ? subcategory.name[currentLanguage] || subcategory.name.en
                                  : subcategory.name;

                                return (
                                  <button
                                    key={subcategory._id}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      navigate(`/products?subcategory=${encodeURIComponent(subcategoryName)}`);
                                      onClose();
                                    }}
                                    className={`w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-200 text-sm ${
                                      isArabicText(subcategoryName) ? 'text-right' : 'text-left'
                                    }`}
                                  >
                                    {subcategoryName}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 text-sm sm:text-base">
                  {currentLanguage === 'ar' ? 'لا توجد فئات متاحة' : 'No categories available'}
                </div>
              )}
            </div>

            {/* All Products button */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  navigate('/products');
                  onClose();
                }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-teal-600 text-white rounded-lg sm:rounded-xl hover:bg-teal-700 transition-colors font-medium text-sm sm:text-base"
              >
                {currentLanguage === 'ar' ? 'عرض جميع المنتجات' : 'View All Products'}
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsDropdown;
