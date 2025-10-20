import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product } from '../../types';
import { useLocalization } from '../../hooks/useLocalization';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

interface ProductActionsProps {
  product: Product;
  onContactSales: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ 
  product, 
  onContactSales 
}) => {
  const { getLocalizedText } = useLocalization();
  const { isRTL } = useLanguage();
  const { t } = useTranslation();

  return (
    <>
      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className='space-y-3 sm:space-y-4'
      >
        <button
          type="button"
          onClick={onContactSales}
          disabled={!product.inStock}
          className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} ${
            product.inStock
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
          aria-label={product.inStock ? t('contactSales') : t('outOfStock')}
          title={product.inStock ? t('contactSales') : t('outOfStock')}
        >
          <ShoppingCart className='w-4 h-4 sm:w-5 sm:h-5' />
          <span>{product.inStock ? t('contactSales') : t('outOfStock')}</span>
        </button>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className='pt-4 sm:pt-6 lg:pt-8 border-t border-gray-200 space-y-3 sm:space-y-4 lg:space-y-6'
      >
        <h3 className={`text-base sm:text-lg font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('additionalInformation')}
        </h3>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
          <div className='text-center'>
            <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3'>
              <Truck className='w-6 h-6 text-orange-600' />
            </div>
            <h4 className='font-semibold text-gray-900 mb-1'>{t('shipping')}</h4>
            <p className='text-sm text-gray-600'>{getLocalizedText(product.shipping)}</p>
          </div>

          <div className='text-center'>
            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3'>
              <Shield className='w-6 h-6 text-blue-600' />
            </div>
            <h4 className='font-semibold text-gray-900 mb-1'>{t('warranty')}</h4>
            <p className='text-sm text-gray-600'>{getLocalizedText(product.warranty)}</p>
          </div>

          <div className='text-center'>
            <div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3'>
              <RotateCcw className='w-6 h-6 text-emerald-600' />
            </div>
            <h4 className='font-semibold text-gray-900 mb-1'>
              {t('certifications')}
            </h4>
            <p className='text-sm text-gray-600'>
              {product.certifications.join(", ")}
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProductActions;
