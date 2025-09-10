/** @format */

import { Product } from "../types";
import { productApi } from "../services/productApi";
import { transformApiProduct } from "../hooks/useProducts";

// Helper to resolve localized values
const resolveText = (value: unknown): string => {
	if (typeof value === "string") return value;
	if (value && typeof value === "object") {
		const v = value as { en?: string; ar?: string };
		return v.en || v.ar || "";
	}
	return "";
};

// Function to get a single product by ID
export const getProductById = async (id: string): Promise<Product> => {
	try {
		const response = await productApi.getProductById(id);
		return transformApiProduct(response);
	} catch (error) {
		// Error getting product by ID
		throw error;
	}
};

// Function to get products by subcategory (category alias)
export const getProductsByCategory = async (subcategoryId: string): Promise<Product[]> => {
	try {
		const response = await productApi.getAllProducts();
		const products = response.map(transformApiProduct);
		return products.filter((product) => {
			if (typeof product.subcategory === "string") return product.subcategory === subcategoryId;
			return product.subcategory?._id === subcategoryId || resolveText((product.subcategory as any).name) === subcategoryId;
		});
	} catch (error) {
		// Error getting products by subcategory
		throw error;
	}
};

// Function to search products
export const searchProducts = async (query: string): Promise<Product[]> => {
	try {
		const response = await productApi.getAllProducts();
		const products = response.map(transformApiProduct);
		const searchTerm = query.toLowerCase();
		
		return products.filter((product) =>
			resolveText(product.name).toLowerCase().includes(searchTerm) ||
			resolveText(product.description).toLowerCase().includes(searchTerm) ||
			(typeof product.subcategory === "string"
				? product.subcategory
				: resolveText((product.subcategory as any)?.name)
			)
				.toLowerCase()
				.includes(searchTerm)
		);
	} catch (error) {
		// Error searching products
		throw error;
	}
};

// Function to get related products (same subcategory, excluding current product)
export const getRelatedProducts = async (productId: string, limit: number = 4): Promise<Product[]> => {
	try {
		const currentProduct = await getProductById(productId);
		const allProductsApi = await productApi.getAllProducts();
		const allProducts = allProductsApi.map(transformApiProduct);
		
		const currSub = typeof currentProduct.subcategory === "string" ? currentProduct.subcategory : currentProduct.subcategory?._id || resolveText((currentProduct.subcategory as any)?.name);
		// Filter out current product and get products from same subcategory
		const related = allProducts
			.filter((product) => {
				if (product._id === productId) return false;
				const sub = typeof product.subcategory === "string" ? product.subcategory : product.subcategory?._id || resolveText((product.subcategory as any)?.name);
				return sub === currSub;
			})
			.slice(0, limit);
		
		return related;
	} catch (error) {
		// Error getting related products
		throw error;
	}
};
