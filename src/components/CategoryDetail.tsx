/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Tag, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategory } from "../hooks/useCategories";
import { useProducts } from "../contexts/ProductsContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "react-i18next";

const CategoryDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { data: category, isLoading, error } = useCategory(id || "");
	const { products } = useProducts();
	const { currentLanguage } = useLanguage();
	const { t } = useTranslation();

	// Helper function to get localized text
	const getLocalizedText = (value: string | { en?: string; ar?: string } | null | undefined): string => {
		if (!value) return "";
		if (typeof value === "string") return value;
		if (typeof value === "object") {
			return value[currentLanguage as "en" | "ar"] || value.en || value.ar || "";
		}
		return "";
	};

	// Filter products by this category
	const categoryProducts = products.filter(product => 
		(product as any).category === category?.name || 
		(product as any).category === category?._id ||
		(product as any).subcategory === category?.name || 
		(product as any).subcategory === category?._id
	);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
			</div>
		);
	}

	if (error || !category) {
		return (
			<div className="text-center py-8">
				<p className="text-red-600">Category not found or error loading category</p>
				<button
					onClick={() => navigate(-1)}
					className="mt-4 text-teal-600 hover:text-teal-700"
				>
					Go back
				</button>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="max-w-4xl mx-auto px-4 py-8"
		>
			{/* Header */}
			<div className="mb-8">
				<button
					onClick={() => navigate(-1)}
					className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
				>
					<ArrowLeft className="h-4 w-4" />
					<span>Back</span>
				</button>
				
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="w-16 h-16 bg-teal-500 rounded-xl flex items-center justify-center">
							<Tag className="h-8 w-8 text-white" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
							<p className="text-gray-600 mt-1">
								{category.description || "No description available"}
							</p>
						</div>
					</div>
					
					<div className="flex space-x-3">
						<button
							onClick={() => navigate(`/categories/${category._id}/edit`)}
							className="inline-flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
						>
							<Edit className="h-4 w-4" />
							<span>Edit</span>
						</button>
						<button
							onClick={() => {
								if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
									// Handle delete
									navigate(-1);
								}
							}}
							className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
						>
							<Trash2 className="h-4 w-4" />
							<span>Delete</span>
						</button>
					</div>
				</div>
			</div>

			{/* Category Information */}
			<div className="bg-white rounded-xl shadow-sm p-6 mb-8">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">Category Information</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
						<p className="text-gray-900">{category.name}</p>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
						<p className="text-gray-900">{category.description || "No description"}</p>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
						<p className="text-gray-900">
							{new Date(category.createdAt).toLocaleDateString()} at{" "}
							{new Date(category.createdAt).toLocaleTimeString()}
						</p>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
						<p className="text-gray-900">
							{new Date(category.updatedAt).toLocaleDateString()} at{" "}
							{new Date(category.updatedAt).toLocaleTimeString()}
						</p>
					</div>
				</div>
			</div>

			{/* Products in this Category */}
			<div className="bg-white rounded-xl shadow-sm p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold text-gray-900">Products in this Category</h2>
					<span className="text-sm text-gray-500">{categoryProducts.length} products</span>
				</div>

				{categoryProducts.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{categoryProducts.map((product) => (
							<div
								key={(product as any)._id}
								className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
								onClick={() => navigate(`/product/${(product as any)._id}`)}
							>
								<div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
									{product.image ? (
										<img
											src={product.image}
											alt={getLocalizedText(product.name)}
											className="w-full h-full object-cover rounded-lg"
										/>
									) : (
										<Tag className="h-8 w-8 text-gray-400" />
									)}
								</div>
								<h3 className="font-medium text-gray-900 mb-1 truncate">{getLocalizedText(product.name)}</h3>
								<p className="text-sm text-gray-600 mb-2 line-clamp-2">{getLocalizedText(product.description)}</p>
								<div className="flex items-center justify-between">
									<span className="font-semibold text-teal-600">{t('currencySymbol')} {product.price?.toLocaleString()}</span>
									<span className={`text-sm px-2 py-1 rounded-full ${
										product.inStock 
											? "bg-green-100 text-green-800" 
											: "bg-red-100 text-red-800"
									}`}>
										{product.inStock ? "In Stock" : "Out of Stock"}
									</span>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">No products in this category</h3>
						<p className="text-gray-500 mb-4">
							This category doesn't have any products yet.
						</p>
						<button
							onClick={() => navigate("/dashboard?tab=add-product")}
							className="inline-flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
						>
							<Tag className="h-4 w-4" />
							<span>Add Product</span>
						</button>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default CategoryDetail;
