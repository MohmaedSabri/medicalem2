/** @format */

import React, { createContext, useContext, ReactNode } from "react";
import { Category } from "../types";
import {
	useCategories as useCategoriesQuery,
	useCreateCategory,
	useUpdateCategory,
	useDeleteCategory,
} from "../hooks/useCategories";

interface CategoriesContextType {
	categories: Category[];
	addCategory: (
		category: Omit<Category, "_id" | "createdAt" | "updatedAt">
	) => Promise<boolean>;
	updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
	deleteCategory: (id: string) => Promise<void>;
	getCategoryById: (id: string) => Category | undefined;
	getCategoryByName: (name: string) => Category | undefined;
	loading: boolean;
	error: Error | null;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(
	undefined
);

export const useCategories = () => {
	const context = useContext(CategoriesContext);
	if (context === undefined) {
		throw new Error("useCategories must be used within a CategoriesProvider");
	}
	return context;
};

interface CategoriesProviderProps {
	children: ReactNode;
}

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({
	children,
}) => {
	// Use React Query hooks
	const {
		data: categories = [],
		isLoading: loading,
		error,
	} = useCategoriesQuery();
	const createCategoryMutation = useCreateCategory();
	const updateCategoryMutation = useUpdateCategory();
	const deleteCategoryMutation = useDeleteCategory();

	const addCategory = async (
		categoryData: Omit<Category, "_id" | "createdAt" | "updatedAt">
	) => {
		try {
			await createCategoryMutation.mutateAsync(categoryData);
			return true;
		} catch {
			// Error adding category
			return false;
		}
	};

	const updateCategory = async (id: string, updates: Partial<Category>) => {
		await updateCategoryMutation.mutateAsync({ id, data: updates });
	};

	const deleteCategory = async (id: string) => {
		await deleteCategoryMutation.mutateAsync(id);
	};

	const getCategoryById = (id: string) => {
		return categories.find((category) => category._id === id);
	};

	const getCategoryByName = (name: string) => {
		return categories.find(
			(category) => category.name.toLowerCase() === name.toLowerCase()
		);
	};

	const value: CategoriesContextType = {
		categories,
		addCategory,
		updateCategory,
		deleteCategory,
		getCategoryById,
		getCategoryByName,
		loading,
		error: error as Error | null,
	};

	return (
		<CategoriesContext.Provider value={value}>
			{children}
		</CategoriesContext.Provider>
	);
};
