import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { categoryApi, Category, CreateCategoryData, UpdateCategoryData } from '../services/categoryApi';
import { queryKeys } from '../config/queryKeys';

// Hook to get all categories
export const useCategories = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.categories.list(filters || {}),
    queryFn: () => categoryApi.getAllCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

// Hook to get a single category by ID
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoryApi.getCategoryById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

// Hook to create a new category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: CreateCategoryData) => categoryApi.createCategory(categoryData),
    onSuccess: (newCategory) => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
      
      // Add the new category to the cache
      queryClient.setQueryData(
        queryKeys.categories.detail(newCategory._id),
        newCategory
      );

      toast.success('Category created successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create category';
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

// Hook to update a category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryData }) =>
      categoryApi.updateCategory(id, data),
    onSuccess: (updatedCategory) => {
      // Update the category in the cache
      queryClient.setQueryData(
        queryKeys.categories.detail(updatedCategory._id),
        updatedCategory
      );

      // Invalidate categories list to refresh any filtered views
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });

      toast.success('Category updated successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update category';
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

// Hook to delete a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: (_, deletedId) => {
      // Remove the category from the cache
      queryClient.removeQueries({ queryKey: queryKeys.categories.detail(deletedId) });

      // Invalidate categories list to refresh any filtered views
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });

      toast.success('Category deleted successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete category';
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
