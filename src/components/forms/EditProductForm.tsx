import React from 'react';
import { motion } from 'framer-motion';
import { X, Edit } from 'lucide-react';
import { GenericForm } from './GenericFrom';
import { productCreateSchema, ProductCreateSchema } from '../../schamas/product';
import { Product } from '../../types';
import { useProducts } from '../../contexts/ProductsContext';
import { useSubCategories } from '../../hooks/useSubCategories';
import toast from 'react-hot-toast';
import { useLanguage } from '../../contexts/LanguageContext';

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product, onClose }) => {
  const { updateProduct } = useProducts();
  const { data: subcategories } = useSubCategories();
  const { currentLanguage } = useLanguage();

  const toText = (v: unknown): string => {
    if (typeof v === 'string') return v;
    if (v && typeof v === 'object') {
      const obj = v as { en?: string; ar?: string };
      return obj.en || obj.ar || '';
    }
    return '';
  };

  const getLocalizedText = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') {
      const obj = value as Record<string, string>;
      return obj[currentLanguage] || obj.en || obj.ar || '';
    }
    return '';
  };

  const defaultValues: Partial<ProductCreateSchema> = {
    nameEn: toText((product.name as unknown as { en?: string })?.en) || toText(product.name),
    nameAr: toText((product.name as unknown as { ar?: string })?.ar) || toText(product.name),
    descriptionEn: toText((product.description as unknown as { en?: string })?.en) || toText(product.description),
    descriptionAr: toText((product.description as unknown as { ar?: string })?.ar) || toText(product.description),
    longDescriptionEn: toText((product.longDescription as unknown as { en?: string })?.en) || toText(product.longDescription),
    longDescriptionAr: toText((product.longDescription as unknown as { ar?: string })?.ar) || toText(product.longDescription),
    price: product.price || 0,
    subcategory: typeof product.subcategory === 'string' ? product.subcategory : (product.subcategory?._id || ''),
    images: product.images || [],
    features: (product.features || []).map((f: unknown) => toText(f)),
    specifications: typeof product.specifications === 'string' ? product.specifications : Object.entries(product.specifications || {}).map(([k, v]) => `${k}: ${toText(v)}`).join(', '),
    inStock: product.inStock || false,
    stockQuantity: product.stockQuantity || 0,
    shippingEn: toText((product.shipping as unknown as { en?: string })?.en) || toText(product.shipping as unknown),
    shippingAr: toText((product.shipping as unknown as { ar?: string })?.ar) || toText(product.shipping as unknown),
    warrantyEn: toText((product.warranty as unknown as { en?: string })?.en) || toText(product.warranty as unknown),
    warrantyAr: toText((product.warranty as unknown as { ar?: string })?.ar) || toText(product.warranty as unknown),
    certifications: product.certifications || [],
  };

  const selectOptions = {
    subcategory: (subcategories?.map((s) => {
      const id = (s as unknown as { _id?: string })._id || '';
      const rawName = (s as unknown as { name?: unknown }).name ?? (s as unknown as { localized?: { name?: unknown } }).localized?.name;
      const label = getLocalizedText(rawName) || 'Subcategory';
      return { value: id, label };
    }) ?? []),
  } as const;

  const handleSubmit = async (data: ProductCreateSchema) => {
    const specificationsObj: Record<string, string> = {};
    if (data.specifications) {
      data.specifications.split(',').forEach((spec) => {
        const [key, value] = spec.split(':').map((s) => s.trim());
        if (key && value) specificationsObj[key] = value;
      });
    }

    const updatedProduct = {
      name: { en: data.nameEn, ar: data.nameAr },
      description: { en: data.descriptionEn, ar: data.descriptionAr },
      longDescription: { en: data.longDescriptionEn, ar: data.longDescriptionAr },
      price: data.price,
      subcategory: data.subcategory,
      image: (data.images && data.images[0]) || '',
      images: data.images || [],
      features: (data.features || []).map((f) => ({ en: f, ar: f })),
      specifications: Object.fromEntries(Object.entries(specificationsObj).map(([k, v]) => [k, { en: v, ar: v }])),
      inStock: data.inStock,
      stockQuantity: data.stockQuantity,
      shipping: { en: data.shippingEn || '', ar: data.shippingAr || '' },
      warranty: { en: data.warrantyEn || '', ar: data.warrantyAr || '' },
      certifications: data.certifications || [],
    };

    try {
      await updateProduct(product._id, updatedProduct as unknown as Omit<Product, '_id'>);
      toast.success('Product updated successfully!');
      onClose();
    } catch {
      toast.error('Failed to update product. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className='bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header with close button */}
        <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center'>
                <Edit className='h-6 w-6 text-white' />
              </div>
              <div>
                <h2 className='text-2xl font-bold text-gray-900'>
                  Edit Product
                </h2>
                <p className='text-gray-600'>Update product information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              aria-label='Close modal'>
              <X className='h-6 w-6 text-gray-500' />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className='p-6'>
          <GenericForm<ProductCreateSchema>
            schema={productCreateSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitButtonText={'Update Product'}
            className='w-full'
            selectOptions={selectOptions}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditProductForm;


