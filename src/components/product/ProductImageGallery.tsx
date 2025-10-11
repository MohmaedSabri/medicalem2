import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Product } from '../../types';
import { useLocalization } from '../../hooks/useLocalization';

interface ProductImageGalleryProps {
  product: Product;
  subcategoriesList: Array<{ id: string; name: string }>;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
  product, 
  subcategoriesList 
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedModalImage, setSelectedModalImage] = useState("");
  const { getLocalizedText, getLocalizedCategoryName } = useLocalization();

  const handleImageClick = (imageUrl: string) => {
    setSelectedModalImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedModalImage("");
  };

  const getSubcategoryName = (subcategory: string | { _id: string; name: string; description?: string } | undefined | null) => {
    if (!subcategory) return "Unknown Category";
    return typeof subcategory === "string" ? subcategory : subcategory.name;
  };

  const getSubcategoryDisplayText = (subcategory: string | { _id: string; name: string; description?: string } | undefined | null) => {
    const subcategoryName = getSubcategoryName(subcategory);
    const displayName = getLocalizedText(subcategoryName);
    return displayName.split(" ")[0];
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className='space-y-3 sm:space-y-4 lg:space-y-6'
      >
        {/* Main Image */}
        <div className='relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl cursor-pointer'>
          <img
            src={product.images && product.images.length > 0 ? product.images[selectedImage] : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K"}
            alt={`${getLocalizedText(product.name)} - Main product image`}
            className='w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover transition-transform duration-300 hover:scale-105'
            onClick={() => handleImageClick(product.images && product.images.length > 0 ? product.images[selectedImage] : "")}
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
            }}
            loading="lazy"
          />
          {/* Subcategory Badge */}
          <div className='absolute top-2 sm:top-4 left-2 sm:left-4'>
            <span className='inline-flex items-center space-x-1 sm:space-x-2 bg-white/95 backdrop-blur-sm -webkit-backdrop-blur-sm text-gray-800 px-2 sm:px-3 py-1.5 rounded-lg font-medium border border-white/20 shadow-lg text-xs sm:text-sm'>
              <Zap className='w-3 h-3 sm:w-4 sm:h-4 text-primary-600' />
              <span className='hidden sm:inline'>
                {(() => {
                  const productSubcategoryId = typeof product.subcategory === 'string' ? product.subcategory : product.subcategory?._id;
                  const matchedSubcategory = subcategoriesList.find(sub => sub.id === productSubcategoryId);
                  return matchedSubcategory ? getLocalizedText(getLocalizedCategoryName(matchedSubcategory)) : "Loading...";
                })()}
              </span>
              <span className='sm:hidden'>
                {(() => {
                  const productSubcategoryId = typeof product.subcategory === 'string' ? product.subcategory : product.subcategory?._id;
                  const matchedSubcategory = subcategoriesList.find(sub => sub.id === productSubcategoryId);
                  return matchedSubcategory ? getLocalizedText(getLocalizedCategoryName(matchedSubcategory)).split(" ")[0] : "Loading...";
                })()}
              </span>
            </span>
          </div>
        </div>

        {/* Thumbnail Images */}
        {product.images && product.images.length > 0 ? (
          <div className='grid grid-cols-4 gap-2 sm:gap-4'>
            {product.images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                  selectedImage === index
                    ? "border-primary-500 shadow-lg"
                    : "border-gray-200 hover:border-primary-300"
                }`}
                aria-label={`View image ${index + 1} of ${product.images.length}`}
                title={`View image ${index + 1} of ${product.images.length}`}
              >
                <img
                  src={image}
                  alt={`${getLocalizedText(product.name)} ${index + 1}`}
                  className='w-full h-16 sm:h-20 object-cover'
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
                  }}
                />
              </button>
            ))}
          </div>
        ) : (
          <div className='text-center py-4 text-gray-500 text-sm'>
            No images available
          </div>
        )}
      </motion.div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Arrows - Outside Image */}
            {product && product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = product.images.indexOf(selectedModalImage);
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : product.images.length - 1;
                    setSelectedModalImage(product.images[prevIndex]);
                  }}
                  className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-colors z-10"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = product.images.indexOf(selectedModalImage);
                    const nextIndex = currentIndex < product.images.length - 1 ? currentIndex + 1 : 0;
                    setSelectedModalImage(product.images[nextIndex]);
                  }}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-colors z-10"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Container */}
            <div className="flex-1 flex items-center justify-center px-20" style={{ width: 'calc(100% - 160px)' }}>
              <img
                src={selectedModalImage}
                alt={getLocalizedText(product?.name)}
                className="max-w-full max-h-full object-contain rounded-lg"
                style={{ 
                  maxWidth: '80%', 
                  maxHeight: '80%',
                  minWidth: '60%',
                  minHeight: '60%'
                }}
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
                }}
              />
            </div>

            {/* Bottom Navigation - Outside Image */}
            {product && product.images && product.images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-4 pointer-events-none">
                {/* Thumbnail Navigation */}
                <div className="flex space-x-3 pointer-events-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModalImage(image);
                      }}
                      className={`w-4 h-4 rounded-full transition-colors ${
                        selectedModalImage === image
                          ? "bg-white"
                          : "bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>

                {/* Image Counter */}
                <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm whitespace-nowrap pointer-events-auto w-16 text-center">
                  {product.images.indexOf(selectedModalImage) + 1} / {product.images.length}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default ProductImageGallery;
