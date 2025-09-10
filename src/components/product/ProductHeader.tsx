import React from 'react';
import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';
import { Product } from '../../types';
import { useLocalization } from '../../hooks/useLocalization';
import { useTranslation } from 'react-i18next';

interface ProductHeaderProps {
  product: Product;
  averageRating: number;
  totalReviews: number;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ 
  product, 
  averageRating, 
  totalReviews 
}) => {
  const { getLocalizedText } = useLocalization();
  const { t } = useTranslation();

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='inline-flex items-center space-x-1 sm:space-x-2 bg-teal-50 px-2 sm:px-3 py-1.5 rounded-full border border-teal-200 mb-2 sm:mb-3 lg:mb-4'
      >
        <Zap className='w-3 h-3 sm:w-4 sm:h-4 text-teal-600' />
        <span className='text-teal-700 font-medium text-xs sm:text-sm'>
          Premium Medical Equipment
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-2 sm:mb-3 lg:mb-4 leading-tight'
      >
        {getLocalizedText(product.name)}
      </motion.h1>

      {/* Rating and Views */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className='flex items-center justify-between mb-2 sm:mb-3 lg:mb-4'
      >
        <div className='flex items-center space-x-2'>
          <div className='flex items-center space-x-1'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  i < Math.floor(averageRating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className='text-gray-600 text-xs sm:text-sm'>
            {averageRating.toFixed(1)} ({totalReviews} reviews)
          </span>
        </div>
      </motion.div>

      {/* Price */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className='mb-3 sm:mb-4 lg:mb-6'
      >
        <div className='text-3xl sm:text-4xl md:text-5xl font-bold text-teal-600'>
          {t('currencySymbol')} {product.price.toLocaleString()}
        </div>
        <div className='text-xs sm:text-sm text-gray-500 mt-1'>
          Financing available • Bulk pricing available
        </div>
      </motion.div>
    </div>
  );
};

export default ProductHeader;
