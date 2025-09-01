import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subcategoryApi } from '../services/subcategoryApi';
import { queryKeys } from '../config/queryKeys';
import { SubCategory, CreateSubCategoryData, UpdateSubCategoryData } from '../types';
import toast from 'react-hot-toast';

// Hook for fetching all subcategories
export const useSubCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.all, // We can extend queryKeys later for subcategories
    queryFn: () => subcategoryApi.getAllSubCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching a single subcategory
export const useSubCategory = (id: string) => {
  return useQuery({
    queryKey: ['subcategory', id],
    queryFn: () => subcategoryApi.getSubCategoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching subcategories by parent category
export const useSubCategoriesByParent = (parentCategoryId: string) => {
  return useQuery({
    queryKey: ['subcategories', 'parent', parentCategoryId],
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
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
      queryClient.invalidateQueries({ queryKey: ['subcategory', updatedSubCategory._id] });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      toast.success('SubCategory deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete subcategory');
    },
  });
};
