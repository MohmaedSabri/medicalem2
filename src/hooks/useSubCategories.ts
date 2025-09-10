import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subcategoryApi } from '../services/subcategoryApi';
import { queryKeys } from '../config/queryKeys';
import { CreateSubCategoryData, UpdateSubCategoryData } from '../types';
import toast from 'react-hot-toast';

// Hook for fetching all subcategories
export const useSubCategories = (filters: Record<string, string | number | boolean | undefined> = {}) => {
  return useQuery({
    queryKey: queryKeys.subcategories.list(filters),
    queryFn: () => subcategoryApi.getAllSubCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching a single subcategory
export const useSubCategory = (id: string) => {
  return useQuery({
    queryKey: queryKeys.subcategories.detail(id),
    queryFn: () => subcategoryApi.getSubCategoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching subcategories by parent category
export const useSubCategoriesByParent = (parentCategoryId: string) => {
  return useQuery({
    queryKey: queryKeys.subcategories.byParent(parentCategoryId),
    queryFn: () => subcategoryApi.getSubCategoriesByParent(parentCategoryId),
    enabled: !!parentCategoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for creating a subcategory
export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subcategoryData: CreateSubCategoryData) => subcategoryApi.createSubCategory(subcategoryData),
    onSuccess: (created) => {
      // Invalidate subcategory lists and related categories lists
      queryClient.invalidateQueries({ queryKey: queryKeys.subcategories.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
      // Prime detail cache
      if (created?._id) {
        queryClient.setQueryData(queryKeys.subcategories.detail(created._id), created);
      }
      toast.success('SubCategory created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create subcategory');
    },
  });
};

// Hook for updating a subcategory
export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, subcategoryData }: { id: string; subcategoryData: UpdateSubCategoryData }) =>
      subcategoryApi.updateSubCategory(id, subcategoryData),
    onSuccess: (updatedSubCategory) => {
      // Update detail cache and invalidate lists
      queryClient.setQueryData(queryKeys.subcategories.detail(updatedSubCategory._id), updatedSubCategory);
      queryClient.invalidateQueries({ queryKey: queryKeys.subcategories.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
      toast.success('SubCategory updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update subcategory');
    },
  });
};

// Hook for deleting a subcategory
export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subcategoryApi.deleteSubCategory(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: queryKeys.subcategories.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcategories.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
      toast.success('SubCategory deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete subcategory');
    },
  });
};
