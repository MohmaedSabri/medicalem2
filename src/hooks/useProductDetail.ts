import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product, Review } from '../types';
import { reviewApi } from '../services/reviewApi';
import axiosClient from '../config/axiosClient';
import { endpoints } from '../config/endpoints';
import { useSubCategories } from './useSubCategories';
import { useLanguage } from '../contexts/LanguageContext';

export const useProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentLanguage } = useLanguage();
  const { data: subcategories = [] } = useSubCategories();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const resolveText = (value: any, localized?: string): string => {
    if (localized && typeof localized === 'string') return localized;
    if (value == null) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value[currentLanguage as 'en' | 'ar'] || value.en || value.ar || '';
    }
    return String(value);
  };

  const loadProduct = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Fetch product by ID using axios client and endpoints
      const productResponse = await axiosClient.get(endpoints.PRODUCTS_BY_ID.replace(':id', id));
      const raw = productResponse.data;
      
      // Normalize localized fields into Product type
      const normalized: Product = {
        ...raw,
        name: raw.localized?.name || resolveText(raw.name),
        description: raw.localized?.description || resolveText(raw.description),
        longDescription: raw.localized?.longDescription || resolveText(raw.longDescription),
        features: (raw.localized?.features || raw.features || []).map((f: any) => resolveText(f)),
        specifications: Object.fromEntries(Object.entries(raw.specifications || {}).map(([k, v]) => [k, resolveText(v)])),
        shipping: raw.localized?.shipping || resolveText(raw.shipping),
        warranty: raw.localized?.warranty || resolveText(raw.warranty),
      };
      setProduct(normalized);

      // Fetch reviews using reviewApi service
      try {
        const reviewsData = await reviewApi.getProductReviews(id);
        
        if (reviewsData.reviews) {
          setReviews(reviewsData.reviews);
        }
        if (reviewsData.averageRating !== undefined) {
          setAverageRating(reviewsData.averageRating);
        }
        if (reviewsData.totalReviews !== undefined) {
          setTotalReviews(reviewsData.totalReviews);
        }
      } catch {
        // Fallback to product data
        if (raw.reviews) setReviews(raw.reviews);
        if (raw.averageRating !== undefined) setAverageRating(raw.averageRating);
        if (raw.totalReviews !== undefined) setTotalReviews(raw.totalReviews);
      }

      // Get related products from the same subcategory
      const allProductsResponse = await axiosClient.get(endpoints.PRODUCTS);
      const allProducts = allProductsResponse.data as Product[];
      const subcategoryName = typeof raw.subcategory === "string" ? raw.subcategory : (typeof raw.subcategory?.name === 'object' ? resolveText(raw.subcategory?.name) : (raw.subcategory?.name || "Unknown"));
      const related = allProducts
        .map((p: any) => ({
          ...p,
          name: p.localized?.name || resolveText(p.name),
          description: p.localized?.description || resolveText(p.description),
        }))
        .filter((p: any) => {
          const pSubcategory = typeof p.subcategory === "string" ? p.subcategory : (typeof p.subcategory?.name === 'object' ? resolveText(p.subcategory?.name) : (p.subcategory?.name || "Unknown"));
          return pSubcategory === subcategoryName && p._id !== raw._id;
        })
        .slice(0, 4);
      setRelatedProducts(related as Product[]);
    } catch {
      // Error loading product
    } finally {
      setLoading(false);
    }
  };

  const refreshReviews = async () => {
    if (!id) return;
    
    try {
      const reviewsData = await reviewApi.getProductReviews(id);
      
      if (reviewsData.reviews) {
        setReviews(reviewsData.reviews);
      }
      if (reviewsData.averageRating !== undefined) {
        setAverageRating(reviewsData.averageRating);
      }
      if (reviewsData.totalReviews !== undefined) {
        setTotalReviews(reviewsData.totalReviews);
      }
    } catch {
      // Fallback: reload the entire product
      const productResponse = await axiosClient.get(endpoints.PRODUCTS_BY_ID.replace(':id', id));
      const productData = productResponse.data;
      setProduct(productData);
      
      if (productData.reviews) {
        setReviews(productData.reviews);
      }
      if (productData.averageRating !== undefined) {
        setAverageRating(productData.averageRating);
      }
      if (productData.totalReviews !== undefined) {
        setTotalReviews(productData.totalReviews);
      }
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id, currentLanguage]);

  return {
    product,
    relatedProducts,
    loading,
    reviews,
    averageRating,
    totalReviews,
    subcategoriesList: subcategories.map((sub: { _id: string; name: string }) => ({
      id: sub._id,
      name: sub.name,
    })),
    refreshReviews
  };
};
