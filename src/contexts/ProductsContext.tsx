/** @format */

import React, { createContext, useContext, ReactNode } from "react";
import { Product } from "../types";
import {
	useProducts as useProductsQuery,
	useCreateProduct,
	useUpdateProduct,
	useDeleteProduct,
	transformApiProduct,
	transformToApiProduct,
} from "../hooks/useProducts";

interface ProductsContextType {
	products: Product[];
	addProduct: (product: Omit<Product, "_id">) => Promise<boolean>;
	updateProduct: (id: string, updates: Partial<Product>) => void;
	deleteProduct: (id: string) => void;
	getProductById: (id: string) => Product | undefined;
	resetToInitialProducts: () => void;
	loading: boolean;
	error: Error | null;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
	undefined
);

export const useProducts = () => {
	const context = useContext(ProductsContext);
	if (context === undefined) {
		throw new Error("useProducts must be used within a ProductsProvider");
	}
	return context;
};

interface ProductsProviderProps {
	children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({
	children,
}) => {
	// Use React Query hooks with error handling
	const {
		data: apiProducts = [],
		isLoading: loading,
		error,
	} = useProductsQuery();
	const createProductMutation = useCreateProduct();
	const updateProductMutation = useUpdateProduct();
	const deleteProductMutation = useDeleteProduct();

	// Transform API products to local Product format
	// Handle case where apiProducts might be undefined or empty
	let products: Product[] = [];
	try {
		products = Array.isArray(apiProducts) ? apiProducts.map(transformApiProduct) : [];
	} catch (transformError) {
		console.warn('Error transforming products:', transformError);
		products = [];
	}

	const addProduct = async (productData: Omit<Product, "_id">) => {
		try {
			const apiProductData = transformToApiProduct(productData);
			await createProductMutation.mutateAsync(apiProductData);
			return true;
		} catch (error) {
			console.warn('Error adding product:', error);
			return false;
		}
	};

	const updateProduct = async (id: string, productData: Partial<Product>) => {
		try {
			const response = await updateProductMutation.mutateAsync({ id, data: transformToApiProduct(productData) });
			return response;
		} catch (error) {
			console.warn('Error updating product:', error);
			return null;
		}
	};

	const deleteProduct = async (id: string) => {
		try {
			await deleteProductMutation.mutateAsync(id);
		} catch (error) {
			console.warn('Error deleting product:', error);
		}
	};

	const getProductById = (id: string) => {
		return products.find((product) => product._id === id);
	};

	const resetToInitialProducts = () => {
		// This function is now handled by React Query's cache invalidation
		// The products will automatically refresh from the API
	};

	const value: ProductsContextType = {
		products,
		addProduct,
		updateProduct,
		deleteProduct,
		getProductById,
		resetToInitialProducts,
		loading,
		error: error as Error | null,
	};

	return (
		<ProductsContext.Provider value={value}>
			{children}
		</ProductsContext.Provider>
	);
};
