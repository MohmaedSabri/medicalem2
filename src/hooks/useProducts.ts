import { useQuery, useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { productApi, ApiProduct, CreateProductData, UpdateProductData, ReviewData } from '../services/productApi';
import { queryKeys } from '../config/queryKeys';
import { Product } from '../types';

// Error type for API responses
interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Localized helper types
type LocalizedObject = { en?: string; ar?: string };

// Type guard to check if value is a localized object
const isLocalizedObject = (value: unknown): value is LocalizedObject => {
  return !!value && typeof value === 'object' && ('en' in (value as object) || 'ar' in (value as object));
};

// Helper to resolve possibly-localized values to string
const resolveText = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (isLocalizedObject(value)) {
    return value.en || value.ar || '';
  }
  return '';
};

// Subcategory union type used in ApiProduct and Product
type SubcategoryUnion = string | { _id?: string; name?: string | LocalizedObject; description?: string | LocalizedObject };

// Safely extract subcategory id or name text
const getSubcategoryId = (subcategory: SubcategoryUnion | undefined): string => {
  if (!subcategory) return '';
  if (typeof subcategory === 'string') return subcategory;
  return subcategory._id || '';
};

const getSubcategoryNameText = (subcategory: SubcategoryUnion | undefined): string => {
  if (!subcategory) return '';
  if (typeof subcategory === 'string') return subcategory;
  return resolveText(subcategory.name);
};

// Enhanced types for better type safety
interface ProductFilters extends Record<string, string | number | boolean | undefined> {
  subcategory?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

interface UseProductsOptions {
  filters?: ProductFilters;
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
}

interface UseProductOptions {
  enabled?: boolean;
  staleTime?: number;
}

interface UseProductReviewsOptions {
  enabled?: boolean;
  staleTime?: number;
}

// Enhanced hook to get all products with better filtering and options
export const useProducts = (options: UseProductsOptions = {}) => {
  const { filters = {}, enabled = true, staleTime = 5 * 60 * 1000, refetchOnWindowFocus = false } = options;
  
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productApi.getAllProducts(),
    enabled,
    staleTime,
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once on failure
    retryDelay: 1000, // Wait 1 second before retry
    refetchOnWindowFocus,
    select: (data: ApiProduct[]) => {
      // Client-side filtering and sorting if needed
      let filteredData = [...data];
      
      if (filters.search) {
        const term = filters.search.toLowerCase();
        filteredData = filteredData.filter(product => 
          resolveText(product.name).toLowerCase().includes(term) ||
          resolveText(product.description).toLowerCase().includes(term)
        );
      }
      
      if (filters.minPrice !== undefined) {
        filteredData = filteredData.filter(product => product.price >= filters.minPrice!);
      }
      
      if (filters.maxPrice !== undefined) {
        filteredData = filteredData.filter(product => product.price <= filters.maxPrice!);
      }
      
      if (filters.inStock !== undefined) {
        filteredData = filteredData.filter(product => product.inStock === filters.inStock);
      }
      
      if (filters.subcategory) {
        filteredData = filteredData.filter(product => {
          const subId = getSubcategoryId(product.subcategory as SubcategoryUnion);
          const subName = getSubcategoryNameText(product.subcategory as SubcategoryUnion);
          return subId === filters.subcategory || subName === filters.subcategory;
        });
      }
      
      // Sorting
      if (filters.sortBy) {
        filteredData.sort((a, b) => {
          let aValue: string | number, bValue: string | number;
          
          switch (filters.sortBy) {
            case 'name':
              aValue = resolveText(a.name);
              bValue = resolveText(b.name);
              break;
            case 'price':
              aValue = a.price;
              bValue = b.price;
              break;
            case 'rating':
              aValue = a.averageRating || 0;
              bValue = b.averageRating || 0;
              break;
            case 'createdAt':
              aValue = new Date(a.createdAt).getTime();
              bValue = new Date(b.createdAt).getTime();
              break;
            default:
              return 0;
          }
          
          if (filters.sortOrder === 'desc') {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        });
      }
      
      return filteredData;
    }
  });
};

// Enhanced hook to get a single product by ID
export const useProduct = (id: string, options: UseProductOptions = {}) => {
  const { enabled = true, staleTime = 5 * 60 * 1000 } = options;
  
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productApi.getProductById(id),
    enabled: enabled && !!id,
    staleTime,
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    retryDelay: 1000,
  });
};

// Enhanced hook to get product reviews
export const useProductReviews = (productId: string, options: UseProductReviewsOptions = {}) => {
  const { enabled = true, staleTime = 2 * 60 * 1000 } = options;
  
  return useQuery({
    queryKey: queryKeys.products.reviews(productId),
    queryFn: () => productApi.getProductReviews(productId),
    enabled: enabled && !!productId,
    staleTime,
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });
};

// Enhanced hook to create a new product with better error handling
export const useCreateProduct = (options?: UseMutationOptions<ApiProduct, Error, CreateProductData>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: CreateProductData) => productApi.createProduct(productData),
    onSuccess: (newProduct, variables, context) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      
      // Add the new product to the cache
      queryClient.setQueryData(
        queryKeys.products.detail(newProduct._id),
        newProduct
      );

      // Call custom onSuccess if provided
      options?.onSuccess?.(newProduct, variables, context);

      toast.success('Product created successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
    },
    onError: (error: ApiError, variables, context) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create product';
      
      // Call custom onError if provided
      options?.onError?.(error, variables, context);
      
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    },
    ...options,
  });
};

// Enhanced hook to update a product with better error handling
export const useUpdateProduct = (options?: UseMutationOptions<ApiProduct, Error, { id: string; data: UpdateProductData }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductData }) =>
      productApi.updateProduct(id, data),
    onSuccess: (updatedProduct, variables, context) => {
      // Update the product in the cache
      queryClient.setQueryData(
        queryKeys.products.detail(updatedProduct._id),
        updatedProduct
      );

      // Invalidate products list to refresh any filtered views
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });

      // Call custom onSuccess if provided
      options?.onSuccess?.(updatedProduct, variables, context);

    },
    onError: (error: ApiError, variables, context) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update product';
      
      // Call custom onError if provided
      options?.onError?.(error, variables, context);
      
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    },
    ...options,
  });
};

// Enhanced hook to delete a product with better error handling
export const useDeleteProduct = (options?: UseMutationOptions<{ message: string }, ApiError, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: (_, deletedId, context) => {
      // Remove the product from the cache
      queryClient.removeQueries({ queryKey: queryKeys.products.detail(deletedId) });

      // Invalidate products list to refresh any filtered views
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });

      // Call custom onSuccess if provided
      options?.onSuccess?.(_, deletedId, context);

      toast.success('Product deleted successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
    },
    onError: (error: ApiError, variables, context) => {
      const errorMessage = error?.response?.data?.message || 'Failed to delete product';
      
      // Call custom onError if provided
      options?.onError?.(error, variables, context);
      
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    },
    ...options,
  });
};

// Enhanced hook to add a review to a product with better error handling
export const useAddReview = (options?: UseMutationOptions<ApiProduct, ApiError, { productId: string; reviewData: ReviewData }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, reviewData }: { productId: string; reviewData: ReviewData }) =>
      productApi.addReview(productId, reviewData),
    onSuccess: (updatedProduct, variables, context) => {
      const { productId } = variables;
      // Update the product in the cache
      queryClient.setQueryData(
        queryKeys.products.detail(productId),
        updatedProduct
      );

      // Invalidate reviews to refresh the reviews list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.reviews(productId) });

      // Call custom onSuccess if provided
      options?.onSuccess?.(updatedProduct, variables, context);

      toast.success('Review added successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
    },
    onError: (error: ApiError, variables, context) => {
      const errorMessage = error?.response?.data?.message || 'Failed to add review';
      
      // Call custom onError if provided
      options?.onError?.(error, variables, context);
      
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    },
    ...options,
  });
};

// Utility function to transform API product to local product format (keeping API structure)
export const transformApiProduct = (apiProduct: ApiProduct) => {
  const normalizeSubcategory = (sub: unknown): string | { _id: string; name: string; description?: string } => {
    if (typeof sub === 'string') return sub;
    if (sub && typeof sub === 'object') {
      const obj = sub as { _id?: string; name?: unknown; description?: unknown };
      return {
        _id: obj._id || '',
        name: resolveText(obj.name),
        description: obj.description !== undefined ? resolveText(obj.description) : undefined,
      };
    }
    return '';
  };

  return {
    _id: apiProduct._id,
    name: apiProduct.name,
    description: apiProduct.description,
    longDescription: apiProduct.longDescription,
    image: apiProduct.image,
    images: apiProduct.images,
    subcategory: normalizeSubcategory(apiProduct.subcategory),
    price: apiProduct.price,
    averageRating: apiProduct.averageRating,
    totalReviews: apiProduct.totalReviews,
    reviews: apiProduct.reviews, // Keep as array of Review objects
    features: apiProduct.features,
    specifications: apiProduct.specifications,
    inStock: apiProduct.inStock,
    stockQuantity: apiProduct.stockQuantity,
    shipping: apiProduct.shipping,
    warranty: apiProduct.warranty,
    certifications: apiProduct.certifications,
    createdAt: apiProduct.createdAt,
    updatedAt: apiProduct.updatedAt,
  };
};

// Utility function to transform local product to API format
export const transformToApiProduct = (localProduct: Partial<Product>): CreateProductData => {
  // Helper function to extract string or localized value from Product union
  const toLocalized = (value: string | { en: string; ar: string } | undefined): string | { en: string; ar: string } | undefined => {
    if (value === undefined) return undefined;
    if (typeof value === 'string') return value;
    return { en: value.en, ar: value.ar };
  };

  const toLocalizedArray = (value: Array<string | { en: string; ar: string }> | undefined): Array<string | { en: string; ar: string }> | undefined => {
    if (!Array.isArray(value)) return undefined;
    return value.map((item) => (typeof item === 'string' ? item : { en: item.en, ar: item.ar }));
  };

  const toLocalizedRecord = (value: Record<string, string | { en: string; ar: string }> | undefined): Record<string, string | { en: string; ar: string }> | undefined => {
    if (!value) return undefined;
    const result: Record<string, string | { en: string; ar: string }> = {};
    Object.entries(value).forEach(([key, val]) => {
      result[key] = typeof val === 'string' ? val : { en: val.en, ar: val.ar };
    });
    return result;
  };

  const subcategory = (() => {
    const sc = localProduct.subcategory as unknown;
    if (typeof sc === 'string') return sc;
    if (sc && typeof sc === 'object' && '_id' in sc) {
      const obj = sc as { _id?: string };
      return obj._id;
    }
    return undefined;
  })();

  return {
    name: toLocalized(localProduct.name as string | { en: string; ar: string }),
    description: toLocalized(localProduct.description as string | { en: string; ar: string }),
    longDescription: toLocalized(localProduct.longDescription as string | { en: string; ar: string }),
    image: localProduct.image,
    images: localProduct.images,
    subcategory,
    price: localProduct.price,
    features: toLocalizedArray(localProduct.features as Array<string | { en: string; ar: string }>),
    specifications: toLocalizedRecord(localProduct.specifications as Record<string, string | { en: string; ar: string }>),
    inStock: localProduct.inStock,
    stockQuantity: localProduct.stockQuantity,
    shipping: toLocalized(localProduct.shipping as string | { en: string; ar: string }),
    warranty: toLocalized(localProduct.warranty as string | { en: string; ar: string }),
    certifications: localProduct.certifications,
  };
};

// Additional utility hooks for common product operations

// Hook to get products by subcategory
export const useProductsBySubcategory = (subcategoryId: string, options: UseProductsOptions = {}) => {
  return useProducts({
    ...options,
    filters: {
      ...options.filters,
      subcategory: subcategoryId,
    },
  });
};

// Hook to get featured products (high-rated products)
export const useFeaturedProducts = (options: UseProductsOptions = {}) => {
  return useProducts({
    ...options,
    filters: {
      ...options.filters,
      sortBy: 'rating',
      sortOrder: 'desc',
    },
  });
};

// Hook to get in-stock products only
export const useInStockProducts = (options: UseProductsOptions = {}) => {
  return useProducts({
    ...options,
    filters: {
      ...options.filters,
      inStock: true,
    },
  });
};

// Hook to search products
export const useSearchProducts = (searchTerm: string, options: UseProductsOptions = {}) => {
  return useProducts({
    ...options,
    filters: {
      ...options.filters,
      search: searchTerm,
    },
    enabled: options.enabled !== false && searchTerm.length > 0,
  });
};

// Hook to get products with price range
export const useProductsByPriceRange = (minPrice: number, maxPrice: number, options: UseProductsOptions = {}) => {
  return useProducts({
    ...options,
    filters: {
      ...options.filters,
      minPrice,
      maxPrice,
    },
  });
};

// Hook to get product statistics
export const useProductStats = () => {
  const { data: products = [], isLoading, error } = useProducts();
  
  const stats = {
    totalProducts: products.length,
    inStockProducts: products.filter(p => p.inStock).length,
    outOfStockProducts: products.filter(p => !p.inStock).length,
    averagePrice: products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0,
    totalValue: products.reduce((sum, p) => sum + p.price, 0),
    averageRating: products.length > 0 ? products.reduce((sum, p) => sum + (p.averageRating || 0), 0) / products.length : 0,
    categories: [...new Set(products.map(p => {
      const subId = getSubcategoryId(p.subcategory as SubcategoryUnion);
      return subId || getSubcategoryNameText(p.subcategory as SubcategoryUnion);
    }))].length,
  };

  return {
    stats,
    isLoading,
    error,
  };
};

// Export types for external use
export type { ProductFilters, UseProductsOptions, UseProductOptions, UseProductReviewsOptions };
