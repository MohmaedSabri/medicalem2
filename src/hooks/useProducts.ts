import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { productApi, ApiProduct, CreateProductData, UpdateProductData, ReviewData } from '../services/productApi';
import { queryKeys } from '../config/queryKeys';

// Hook to get all products
export const useProducts = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.products.list(filters || {}),
    queryFn: () => productApi.getAllProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get a single product by ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productApi.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get product reviews
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: queryKeys.products.reviews(productId),
    queryFn: () => productApi.getProductReviews(productId),
    enabled: !!productId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create a new product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: CreateProductData) => productApi.createProduct(productData),
    onSuccess: (newProduct) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      
      // Add the new product to the cache
      queryClient.setQueryData(
        queryKeys.products.detail(newProduct._id),
        newProduct
      );

      toast.success('Product created successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create product';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    },
  });
};

// Hook to update a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductData }) =>
      productApi.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      // Update the product in the cache
      queryClient.setQueryData(
        queryKeys.products.detail(updatedProduct._id),
        updatedProduct
      );

      // Invalidate products list to refresh any filtered views
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });

      toast.success('Product updated successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update product';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    },
  });
};

// Hook to delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      // Remove the product from the cache
      queryClient.removeQueries({ queryKey: queryKeys.products.detail(deletedId) });

      // Invalidate products list to refresh any filtered views
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });

      toast.success('Product deleted successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    },
  });
};

// Hook to add a review to a product
export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, reviewData }: { productId: string; reviewData: ReviewData }) =>
      productApi.addReview(productId, reviewData),
    onSuccess: (updatedProduct, { productId }) => {
      // Update the product in the cache
      queryClient.setQueryData(
        queryKeys.products.detail(productId),
        updatedProduct
      );

      // Invalidate reviews to refresh the reviews list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.reviews(productId) });

      toast.success('Review added successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to add review';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    },
  });
};

// Utility function to transform API product to local product format (keeping API structure)
export const transformApiProduct = (apiProduct: ApiProduct) => {
  return {
    _id: apiProduct._id,
    name: apiProduct.name,
    description: apiProduct.description,
    longDescription: apiProduct.longDescription,
    image: apiProduct.image,
    images: apiProduct.images,
    subcategory: apiProduct.subcategory,
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
export const transformToApiProduct = (localProduct: any): CreateProductData => {
  return {
    name: localProduct.name,
    description: localProduct.description,
    longDescription: localProduct.longDescription,
    image: localProduct.image,
    images: localProduct.images,
    subcategory: localProduct.subcategory,
    price: localProduct.price,
    features: localProduct.features,
    specifications: localProduct.specifications,
    inStock: localProduct.inStock,
    stockQuantity: localProduct.stockQuantity,
    shipping: localProduct.shipping,
    warranty: localProduct.warranty,
    certifications: localProduct.certifications,
  };
};
