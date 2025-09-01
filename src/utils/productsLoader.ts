/** @format */

import { Product, ProductsData, productsData } from "../data/products";

// Function to load products data
export const loadProducts = async (): Promise<ProductsData> => {
	try {
		// Return data directly from the TypeScript file
		return productsData;
	} catch (error) {
		// Error loading products
		throw error;
	}
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

// Function to get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
	try {
		const response = await productApi.getProducts();
		const products = response.map(transformApiProduct);
		return products.filter(product => product.subcategory === category);
	} catch (error) {
		// Error getting products by category
		throw error;
	}
};

// Function to search products
export const searchProducts = async (query: string): Promise<Product[]> => {
	try {
		const response = await productApi.getProducts();
		const products = response.map(transformApiProduct);
		const searchTerm = query.toLowerCase();
		
		return products.filter(product => 
			product.name.toLowerCase().includes(searchTerm) ||
			product.description.toLowerCase().includes(searchTerm) ||
			product.subcategory.toLowerCase().includes(searchTerm)
		);
	} catch (error) {
		// Error searching products
		throw error;
	}
};

// Function to get related products (same category, excluding current product)
export const getRelatedProducts = async (productId: string, limit: number = 4): Promise<Product[]> => {
	try {
		const currentProduct = await getProductById(productId);
		const allProducts = await getProducts();
		
		// Filter out current product and get products from same subcategory
		const related = allProducts
			.filter(product => 
				product._id !== productId && 
				product.subcategory === currentProduct.subcategory
			)
			.slice(0, limit);
		
		return related;
	} catch (error) {
		// Error getting related products
		throw error;
	}
};
