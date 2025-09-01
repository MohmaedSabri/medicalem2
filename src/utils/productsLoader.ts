/** @format */

import { Product, ProductsData, productsData } from "../data/products";

// Function to load products data
export const loadProducts = async (): Promise<ProductsData> => {
	try {
		// Return data directly from the TypeScript file
		return productsData;
	} catch (error) {
		console.error("Error loading products:", error);
		// Return fallback data if loading fails
		return {
			products: [],
			categories: ["All"],
		};
	}
};

// Function to get a single product by ID
export const getProductById = async (id: number): Promise<Product | null> => {
	try {
		const data = await loadProducts();
		const product = data.products.find((p) => p.id === id);
		return product || null;
	} catch (error) {
		console.error("Error getting product by ID:", error);
		return null;
	}
};

// Function to get products by category
export const getProductsByCategory = async (
	category: string
): Promise<Product[]> => {
	try {
		const data = await loadProducts();
		if (category === "All") {
			return data.products;
		}
		return data.products.filter((p) => p.category === category);
	} catch (error) {
		console.error("Error getting products by category:", error);
		return [];
	}
};

// Function to search products
export const searchProducts = async (
	searchTerm: string
): Promise<Product[]> => {
	try {
		const data = await loadProducts();
		const term = searchTerm.toLowerCase();
		return data.products.filter(
			(p) =>
				p.name.toLowerCase().includes(term) ||
				p.description.toLowerCase().includes(term) ||
				p.category.toLowerCase().includes(term)
		);
	} catch (error) {
		console.error("Error searching products:", error);
		return [];
	}
};

// Function to get related products (same category, excluding current product)
export const getRelatedProducts = async (
	category: string,
	currentProductId: number,
	limit: number = 4
): Promise<Product[]> => {
	try {
		const data = await loadProducts();
		return data.products
			.filter((p) => p.category === category && p.id !== currentProductId)
			.slice(0, limit);
	} catch (error) {
		console.error("Error getting related products:", error);
		return [];
	}
};
