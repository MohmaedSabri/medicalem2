/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Package, Edit, Trash2, Search, Filter, Plus, Eye } from "lucide-react";
import { Product } from "../types";
import { useProducts } from "../contexts/ProductsContext";
import { useSubCategories } from "../hooks/useSubCategories";
import { useNavigate } from "react-router-dom";
import EditProductForm from "./EditProductForm";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import { toast } from "react-hot-toast";

const ManageProducts: React.FC = () => {
	const { products, deleteProduct } = useProducts();
	const { data: subcategories = [] } = useSubCategories();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { currentLanguage } = useLanguage();

	// Helper function to get localized text
	const getLocalizedText = (value: unknown): string => {
		if (typeof value === 'string') return value;
		if (typeof value === 'object' && value !== null) {
			return value[currentLanguage] || value.en || value.ar || '';
		}
		return '';
	};
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSubcategory, setSelectedSubcategory] = useState("");
	const subcategoriesList = [
		{ id: "all", name: "All Subcategories" },
		...subcategories.map((sub: { _id: string; name: string | { en: string; ar: string } }) => ({ 
			id: sub._id, 
			name: getLocalizedText(sub.name) 
		}))
	];
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [deletingProduct, setDeletingProduct] = useState<string | null>(null);

	const filteredProducts = products.filter((product) => {
		const productName = getLocalizedText(product.name);
		const productDescription = getLocalizedText(product.description);
		const matchesSearch =
			productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			productDescription.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesSubcategory =
			selectedSubcategory === "" ||
			selectedSubcategory === "all" ||
			(selectedSubcategory !== "all" && 
				(typeof product.subcategory === 'string' 
					? product.subcategory === selectedSubcategory 
					: product.subcategory?._id === selectedSubcategory));
		return matchesSearch && matchesSubcategory;
	});

	const handleEdit = (product: Product) => {
		setEditingProduct(product);
	};

	const handleDelete = async (productId: string) => {
		const product = products.find((p) => p._id === productId);
		if (!product) return;

		if (
			window.confirm(
				`Are you sure you want to delete "${getLocalizedText(product.name)}"? This action cannot be undone.`
			)
		) {
			setDeletingProduct(productId);
			try {
				// local state update only
				deleteProduct(productId);
			} catch (error) {
				// Error deleting product
				toast.error("Failed to delete product");
			} finally {
				setDeletingProduct(null);
			}
		}
	};

	const handleView = (productId: string) => {
		navigate(`/product/${productId}`);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='max-w-5xl mx-auto'>
			<div className='bg-white rounded-xl shadow-sm p-6'>
				{/* Header */}
				<div className='flex items-center justify-between mb-6'>
					<div className='flex items-center space-x-3'>
						<div className='w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center'>
							<Package className='h-6 w-6 text-white' />
						</div>
						<div>
							<h2 className='text-2xl font-bold text-gray-900'>
								Manage Products
							</h2>
							<p className='text-gray-600'>
								View, edit, and delete your product inventory
							</p>
						</div>
					</div>
					<button
						onClick={() => navigate("/dashboard?tab=add-product")}
						className='inline-flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors'>
						<Plus className='h-4 w-4' />
													<span>{t('addProduct')}</span>
					</button>
				</div>

				{/* Search and Filters */}
				<div className='flex flex-col sm:flex-row gap-4 mb-6'>
					<div className='flex-1 relative'>
						<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							placeholder='Search products by name or description...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all'
						/>
					</div>
					<div className='relative'>
						<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
							<Filter className='h-5 w-5 text-gray-400' />
						</div>
						<select
							value={selectedSubcategory}
							onChange={(e) => setSelectedSubcategory(e.target.value)}
							className='block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none'>
							{subcategoriesList.map((subcategory) => (
								<option key={subcategory.id} value={subcategory.id}>
									{getLocalizedText(subcategory.name)}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Products Table */}
				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Product
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Subcategory
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Price
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Stock
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Status
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className='bg-white divide-y divide-gray-200'>
							{filteredProducts.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className='px-6 py-12 text-center text-gray-500'>
										<div className='flex flex-col items-center space-y-2'>
											<Package className='h-12 w-12 text-gray-300' />
											<p className='text-lg font-medium'>No products found</p>
											<p className='text-sm'>
												{searchTerm || selectedSubcategory !== ""
													? "Try adjusting your search or filters"
													: "Get started by adding your first product"}
											</p>
										</div>
									</td>
								</tr>
							) : (
								filteredProducts.map((product) => (
									<tr key={product._id} className='hover:bg-gray-50'>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='flex-shrink-0 h-12 w-12'>
													<img
														className='h-12 w-12 rounded-lg object-cover'
														src={product.image}
														alt={getLocalizedText(product.name)}
														onError={(e) => {
															e.currentTarget.src =
																"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
														}}
													/>
												</div>
												<div className='ml-4'>
													<div className='text-sm font-medium text-gray-900'>
														{getLocalizedText(product.name)}
													</div>
												</div>
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800'>
												{typeof product.subcategory === 'string' 
													? product.subcategory 
													: getLocalizedText(product.subcategory?.name) || 'Uncategorized'}
											</span>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
											${product.price.toLocaleString()}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
											{product.stockQuantity}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
													product.inStock
														? "bg-green-100 text-green-800"
														: "bg-red-100 text-red-800"
												}`}>
												{product.inStock ? "In Stock" : "Out of Stock"}
											</span>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
											<div className='flex items-center space-x-2'>
												<button
													onClick={() => handleView(product._id)}
													className='text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors'>
													<Eye className='h-4 w-4' />
												</button>
												<button
													onClick={() => handleEdit(product)}
													className='text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors'>
													<Edit className='h-4 w-4' />
												</button>
												<button
																					onClick={() => handleDelete(product._id)}
								disabled={deletingProduct === product._id}
													className='text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
													<Trash2 className='h-4 w-4' />
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Summary */}
				{filteredProducts.length > 0 && (
					<div className='mt-6 pt-6 border-t border-gray-200'>
						<div className='flex items-center justify-between text-sm text-gray-600'>
							<span>
								Showing {filteredProducts.length} of {products.length} products
							</span>
							{searchTerm ||
								(selectedSubcategory !== "" && (
									<button
										onClick={() => {
											setSearchTerm("");
											setSelectedSubcategory("");
										}}
										className='text-teal-600 hover:text-teal-700 transition-colors'>
										Clear filters
									</button>
								))}
						</div>
					</div>
				)}
			</div>

			{/* Edit Product Modal */}
			{editingProduct && (
				<EditProductForm
					product={editingProduct}
					onClose={() => setEditingProduct(null)}
				/>
			)}
		</motion.div>
	);
};

export default ManageProducts;
