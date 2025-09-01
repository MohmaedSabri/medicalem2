/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tag, Edit, Trash2, Search, Plus, Eye } from "lucide-react";
import { Category } from "../types";
import { useCategories } from "../contexts/CategoriesContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

const ManageCategories: React.FC = () => {
	const { categories, deleteCategory, loading, error } = useCategories();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { isRTL } = useLanguage();
	const [searchTerm, setSearchTerm] = useState("");
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
	const [showAddForm, setShowAddForm] = useState(false);
	const [newCategory, setNewCategory] = useState({ name: "", description: "" });
	const [editForm, setEditForm] = useState({ name: "", description: "" });

	const filteredCategories = categories.filter((category) => {
		const matchesSearch =
			category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			category.description.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesSearch;
	});

	const handleEdit = (category: Category) => {
		setEditingCategory(category);
		setEditForm({ name: category.name, description: category.description });
	};

	const handleDelete = async (categoryId: string) => {
		const category = categories.find((c) => c._id === categoryId);
		if (!category) return;

		if (
			window.confirm(
				`Are you sure you want to delete "${category.name}"? This action cannot be undone.`
			)
		) {
			setDeletingCategory(categoryId);
			try {
				deleteCategory(categoryId);
			} catch (error) {
				console.error("Error deleting category:", error);
				alert("Error deleting category. Please try again.");
			} finally {
				setDeletingCategory(null);
			}
		}
	};

	const handleView = (categoryId: string) => {
		navigate(`/category/${categoryId}`);
	};

	const { addCategory, updateCategory } = useCategories();

	const handleAddCategory = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newCategory.name) return;

		try {
			const success = await addCategory(newCategory);
			if (success) {
				setNewCategory({ name: "", description: "" });
				setShowAddForm(false);
			}
		} catch (error) {
			console.error("Error adding category:", error);
		}
	};

	const handleUpdateCategory = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingCategory || !editForm.name) return;

		try {
			updateCategory(editingCategory._id, editForm);
			setEditingCategory(null);
			setEditForm({ name: "", description: "" });
		} catch (error) {
			console.error("Error updating category:", error);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-red-600">Error loading categories: {error.message}</p>
			</div>
		);
	}

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
							<Tag className='h-6 w-6 text-white' />
						</div>
						<div>
							<h2 className='text-2xl font-bold text-gray-900'>
								Manage Categories
							</h2>
							<p className='text-gray-600'>
								View, edit, and delete your product categories
							</p>
						</div>
					</div>
					<button
						onClick={() => setShowAddForm(!showAddForm)}
						className='inline-flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors'>
						<Plus className='h-4 w-4' />
						<span>Add New Category</span>
					</button>
				</div>

				{/* Search */}
				<div className='flex flex-col sm:flex-row gap-4 mb-6'>
					<div className='flex-1 relative'>
						<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							placeholder='Search categories by name or description...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all'
						/>
					</div>
				</div>

				{/* Add Category Form */}
				{showAddForm && (
					<div className="mb-6 p-4 bg-gray-50 rounded-lg">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h3>
						<form onSubmit={handleAddCategory} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Category Name *
									</label>
									<input
										type="text"
										value={newCategory.name}
										onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Description
									</label>
									<input
										type="text"
										value={newCategory.description}
										onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									/>
								</div>
							</div>
							<div className="flex space-x-3">
								<button
									type="submit"
									className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
								>
									Add Category
								</button>
								<button
									type="button"
									onClick={() => setShowAddForm(false)}
									className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				)}

				{/* Categories List */}
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Category
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Description
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Created
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredCategories.map((category) => (
								<tr key={category._id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">
											{category.name}
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="text-sm text-gray-900 max-w-xs truncate">
											{category.description || "No description"}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-500">
											{new Date(category.createdAt).toLocaleDateString()}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div className="flex space-x-2">
											<button
												onClick={() => handleView(category._id)}
												className="text-blue-600 hover:text-blue-900 transition-colors"
												title="View Category"
											>
												<Eye className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleEdit(category)}
												className="text-indigo-600 hover:text-indigo-900 transition-colors"
												title="Edit Category"
											>
												<Edit className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleDelete(category._id)}
												disabled={deletingCategory === category._id}
												className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
												title="Delete Category"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Edit Category Modal */}
				{editingCategory && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Category</h3>
							<form onSubmit={handleUpdateCategory} className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Category Name *
									</label>
									<input
										type="text"
										value={editForm.name}
										onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Description
									</label>
									<input
										type="text"
										value={editForm.description}
										onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									/>
								</div>
								<div className="flex space-x-3">
									<button
										type="submit"
										className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
									>
										Update Category
									</button>
									<button
										type="button"
										onClick={() => {
											setEditingCategory(null);
											setEditForm({ name: "", description: "" });
										}}
										className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* Empty State */}
				{filteredCategories.length === 0 && (
					<div className="text-center py-12">
						<Tag className="mx-auto h-12 w-12 text-gray-400" />
						<h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
						<p className="mt-1 text-sm text-gray-500">
							{searchTerm ? "Try adjusting your search terms." : "Get started by creating your first category."}
						</p>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default ManageCategories;
