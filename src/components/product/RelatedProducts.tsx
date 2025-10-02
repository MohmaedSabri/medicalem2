import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Zap } from 'lucide-react';
import { Product } from '../../types';
import { useLocalization } from '../../hooks/useLocalization';

interface RelatedProductsProps {
  relatedProducts: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ relatedProducts }) => {
  const navigate = useNavigate();
  const { getLocalizedText } = useLocalization();

  const getSubcategoryName = (subcategory: string | { _id: string; name: string; description?: string } | undefined | null) => {
    if (!subcategory) return "Unknown Category";
    return typeof subcategory === "string" ? subcategory : subcategory.name;
  };

  const getSubcategoryDisplayText = (subcategory: string | { _id: string; name: string; description?: string } | undefined | null) => {
    const subcategoryName = getSubcategoryName(subcategory);
    const displayName = getLocalizedText(subcategoryName);
    return displayName.split(" ")[0];
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className='mt-8 sm:mt-12 lg:mt-16 xl:mt-20'
    >
      <div className='text-center mb-6 sm:mb-8 lg:mb-12'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-2 sm:mb-3 lg:mb-4'>
          Related
          <span className='block font-semibold text-teal-600 mt-1'>
            Products
          </span>
        </h2>
        <p className='text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4'>
          Explore more medical equipment from our comprehensive collection
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6'>
        {relatedProducts.map((relatedProduct) => (
          <motion.div
            key={relatedProduct._id}
            whileHover={{ y: -5 }}
            className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer'
            onClick={() => navigate(`/product/${relatedProduct._id}`)}
          >
            <div className='relative overflow-hidden rounded-t-xl'>
              <img
                src={relatedProduct.image}
                alt={`${getLocalizedText(relatedProduct.name)} - Related medical equipment`}
                className='w-full h-32 sm:h-40 lg:h-48 object-cover transition-transform duration-300 hover:scale-105'
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
                }}
              />
              <div className='absolute top-2 left-2'>
                <span className='inline-flex items-center space-x-1 bg-white/95 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-lg text-xs font-medium'>
                  <Zap className='w-3 h-3 text-teal-600' />
                  <span className='hidden sm:inline'>
                    {getLocalizedText(getSubcategoryName(relatedProduct.subcategory))}
                  </span>
                  <span className='sm:hidden'>
                    {getSubcategoryDisplayText(relatedProduct.subcategory)}
                  </span>
                </span>
              </div>
            </div>
            <div className='p-2.5 sm:p-3 lg:p-4'>
              <h3 className='font-semibold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 text-sm sm:text-base'>
                {getLocalizedText(relatedProduct.name)}
              </h3>
              <div className='flex items-center justify-between'>
                <span className='text-teal-600 font-bold text-sm sm:text-base inline-flex items-center gap-1.5'>
                  {document?.documentElement?.dir === 'rtl' ? (
                    <span>د.ا</span>
                  ) : (
                    <img src={'/Dirham%20Currency%20Symbol%20-%20Black.svg'} alt='AED' className='h-4 w-4' />
                  )}
                  <span>{relatedProduct.price.toLocaleString()}</span>
                </span>
                <div className='flex items-center space-x-1'>
                  <Star className='w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current' />
                  <span className='text-xs sm:text-sm text-gray-600'>
                    {relatedProduct.averageRating?.toFixed(1) || '0.0'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedProducts;
