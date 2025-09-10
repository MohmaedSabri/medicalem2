/** @format */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../utils/toast";
import {
	categoryApi,
} from "../services/categoryApi";
import { CreateCategoryData, UpdateCategoryData } from "../types";
import { queryKeys } from "../config/queryKeys";

const getErrorMessage = (error: unknown): string => {
	const err = error as { response?: { data?: { message?: string } } };
	return err?.response?.data?.message ?? "An unexpected error occurred";
};

// Hook to get all categories
export const useCategories = (filters?: Record<string, string | number | boolean | undefined>) => {
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
		mutationFn: (categoryData: CreateCategoryData) =>
			categoryApi.createCategory(categoryData),
		onSuccess: (newCategory) => {
			// Invalidate and refetch categories list
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });

			// Add the new category to the cache
			queryClient.setQueryData(
				queryKeys.categories.detail(newCategory._id),
				newCategory
			);

			showToast("success", "category-create", "Category created successfully!", {
				duration: 4000,
				position: "top-right",
			});
		},
		onError: (error: unknown) => {
			const errorMessage = getErrorMessage(error) || "Failed to create category";
			showToast("error", "category-create-error", errorMessage, {
				duration: 4000,
				position: "top-right",
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
			queryClient.removeQueries({
				queryKey: queryKeys.categories.detail(deletedId),
			});

			// Invalidate categories list to refresh any filtered views
			queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });

			showToast("success", "category-delete", "Category deleted successfully!", {
				duration: 4000,
				position: "top-right",
			});
		},
		onError: (error: unknown) => {
			const errorMessage = getErrorMessage(error) || "Failed to delete category";
			showToast("error", "category-delete-error", errorMessage, {
				duration: 4000,
				position: "top-right",
			});
		},
	});
};
