import React from 'react';
import { motion } from 'framer-motion';
import { useLocalization } from '../../hooks/useLocalization';

interface ProductSpecificationsProps {
  specifications: Record<string, any>;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ specifications }) => {
  const { getLocalizedText } = useLocalization();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className='space-y-2 sm:space-y-3 lg:space-y-4'
    >
      <h3 className='text-base sm:text-lg font-semibold text-gray-900'>
        Specifications
      </h3>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3'>
        {Object.entries(specifications).map(([key, value]) => (
          <div key={key} className='flex items-center space-x-3'>
            <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
            <span className='text-gray-700 capitalize'>
              {key.replace(/([A-Z])/g, " $1").trim()}: {getLocalizedText(value)}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductSpecifications;
