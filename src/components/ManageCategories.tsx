/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tag, Edit, Trash2, Search, Plus } from "lucide-react";
import { Category } from "../types";
import { useCategories } from "../contexts/CategoriesContext";

import { useClickOutside } from "../hooks/useClickOutside";
import DeletionModal from "./DeletionModal";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

const ManageCategories: React.FC = () => {
	const { categories, deleteCategory, loading, error } = useCategories();
	const { currentLanguage, isRTL } = useLanguage();
	const { t } = useTranslation();

	// Helper function to get localized text
	const getLocalizedText = (value: unknown): string => {
		if (typeof value === "string") return value;
		if (typeof value === "object" && value !== null) {
			const valueObj = value as Record<string, string>;
			return valueObj[currentLanguage] || valueObj.en || valueObj.ar || "";
		}
		return "";
	};
	const [searchTerm, setSearchTerm] = useState("");
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
	const [showAddForm, setShowAddForm] = useState(false);
	const [newCategory, setNewCategory] = useState({ name: "", description: "" });
	const [editForm, setEditForm] = useState({ name: "", description: "" });
	const [isUpdating, setIsUpdating] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
		null
	);

	// Click outside refs
	const addFormRef = useClickOutside<HTMLDivElement>(
		() => setShowAddForm(false),
		showAddForm
	);
	const editModalRef = useClickOutside<HTMLDivElement>(() => {
		setEditingCategory(null);
		setEditForm({ name: "", description: "" });
	}, !!editingCategory);

	// Build localized object for add; for update we only overwrite current language
	const toLocalized = (value: string): { en: string; ar: string } => ({
		en: value,
		ar: value,
	});
	const mergeLocalized = (
		value: string,
		original: unknown
	): { en: string; ar: string } => {
		const prev =
			original && typeof original === "object"
				? (original as { en?: string; ar?: string })
				: {};
		return {
			en: currentLanguage === "en" ? value : prev.en ?? value,
			ar: currentLanguage === "ar" ? value : prev.ar ?? value,
		};
	};
	const filteredCategories = categories.filter((category) => {
		const categoryName = getLocalizedText(category.name);
		const categoryDescription = getLocalizedText(category.description);
		const matchesSearch =
			categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			categoryDescription.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesSearch;
	});

	const handleEdit = (category: Category) => {
		setEditingCategory(category);
		setEditForm({
			name: getLocalizedText(category.name),
			description: getLocalizedText(category.description),
		});
	};

	const handleDelete = (category: Category) => {
		setCategoryToDelete(category);
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		if (!categoryToDelete) return;

		setDeletingCategory(categoryToDelete._id);
		try {
			await deleteCategory(categoryToDelete._id);
			setShowDeleteModal(false);
			setCategoryToDelete(null);
		} catch (error) {
			// Error deleting category - the mutation hook will handle the error toast
			console.error("Error deleting category:", error);
		} finally {
			setDeletingCategory(null);
		}
	};

	const cancelDelete = () => {
		setShowDeleteModal(false);
		setCategoryToDelete(null);
	};

	const { addCategory, updateCategory } = useCategories();

	const handleAddCategory = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newCategory.name) return;

		try {
			const payload = {
				name: toLocalized(newCategory.name),
				description: newCategory.description
					? toLocalized(newCategory.description)
					: undefined,
			};
			const success = await addCategory(payload as any);
			if (success) {
				setNewCategory({ name: "", description: "" });
				setShowAddForm(false);
			} else {
				toast.error("Failed to add category");
			}
		} catch (error) {
			// Error adding category
			toast.error("Failed to add category");
		}
	};

	const handleUpdateCategory = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingCategory || !editForm.name) return;

		try {
			setIsUpdating(true);
			const payload = {
				name: mergeLocalized(editForm.name, editingCategory.name),
				description: mergeLocalized(
					editForm.description,
					editingCategory.description
				),
			};
			const success = await updateCategory(editingCategory._id, payload as any);
			if (success) {
				setEditingCategory(null);
				setEditForm({ name: "", description: "" });
				toast.success(
					t("updateCategory", { defaultValue: "Update Category" }) + " ✓"
				);
			} else {
				toast.error(
					t("failedToUpdateCategory", {
						defaultValue: "Failed to update category",
					})
				);
			}
		} catch (error) {
			// Error updating category
			toast.error(
				t("failedToUpdateCategory", {
					defaultValue: "Failed to update category",
				})
			);
		} finally {
			setIsUpdating(false);
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-64'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600'></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='text-center py-8'>
				<p className='text-red-600'>
					Error loading categories: {error.message}
				</p>
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
				<div
					className={`flex items-center justify-between mb-6 ${
						isRTL ? "flex-row-reverse" : ""
					}`}>
					<div
						className={`flex items-center ${
							isRTL
								? "flex-row-reverse space-x-reverse space-x-2 sm:space-x-3"
								: "space-x-2 sm:space-x-3"
						}`}>
						<div className='w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center'>
							<Tag className='h-6 w-6 text-white' />
						</div>
						<div
							className={`${
								isRTL ? "text-right mr-2 sm:mr-3" : "text-left ml-2 sm:ml-3"
							}`}>
							<h2 className='text-2xl font-bold text-gray-900'>
								{t("manageCategories")}
							</h2>
							<p className='text-gray-600'>
								{t("manageCategoriesDescription", {
									defaultValue:
										"View, edit, and delete your product categories",
								})}
							</p>
						</div>
					</div>
					<button
						onClick={() => setShowAddForm(!showAddForm)}
						className={`inline-flex items-center ${
							isRTL ? "space-x-reverse space-x-2" : "space-x-2"
						} bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors`}>
						<Plus className='h-4 w-4' />
						<span>
							{t("addNewCategory", { defaultValue: "Add New Category" })}
						</span>
					</button>
				</div>

				{/* Search */}
				<div className='flex flex-col sm:flex-row gap-4 mb-6'>
					<div className='flex-1 relative'>
						<div
							className={`absolute inset-y-0 ${
								isRTL ? "right-0 pr-3" : "left-0 pl-3"
							} flex items-center pointer-events-none`}>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							placeholder={t("searchCategoriesPlaceholder", {
								defaultValue: "Search categories by name or description...",
							})}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className={`block w-full ${
								isRTL ? "pr-10 pl-3" : "pl-10 pr-3"
							} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
						/>
					</div>
				</div>

				{/* Add Category Form */}
				{showAddForm && (
					<div ref={addFormRef} className='mb-6 p-4 bg-gray-50 rounded-lg'>
						<h3 className='text-lg font-semibold text-gray-900 mb-4'>
							{t("addNewCategory", { defaultValue: "Add New Category" })}
						</h3>
						<form onSubmit={handleAddCategory} className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										{t("categoryName", { defaultValue: "Category Name" })} *
									</label>
									<input
										type='text'
										value={newCategory.name}
										onChange={(e) =>
											setNewCategory((prev) => ({
												...prev,
												name: e.target.value,
											}))
										}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
										required
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										{t("description", { defaultValue: "Description" })}
									</label>
									<input
										type='text'
										value={newCategory.description}
										onChange={(e) =>
											setNewCategory((prev) => ({
												...prev,
												description: e.target.value,
											}))
										}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
									/>
								</div>
							</div>
							<div
								className={`flex ${
									isRTL ? "space-x-reverse space-x-3" : "space-x-3"
								}`}>
								<button
									type='submit'
									className='bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors'>
									{t("addCategory", { defaultValue: "Add Category" })}
								</button>
								<button
									type='button'
									onClick={() => setShowAddForm(false)}
									className='bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors'>
									{t("cancel", { defaultValue: "Cancel" })}
								</button>
							</div>
						</form>
					</div>
				)}

				{/* Categories List */}
				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='bg-gray-50'>
							<tr>
								<th
									className={`px-6 py-3 ${
										isRTL ? "text-right" : "text-left"
									} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
									{t("category", { defaultValue: "Category" })}
								</th>
								<th
									className={`px-6 py-3 ${
										isRTL ? "text-right" : "text-left"
									} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
									{t("description", { defaultValue: "Description" })}
								</th>
								<th
									className={`px-6 py-3 ${
										isRTL ? "text-right" : "text-left"
									} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
									{t("created", { defaultValue: "Created" })}
								</th>
								<th
									className={`px-6 py-3 ${
										isRTL ? "text-right" : "text-left"
									} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
									{t("actions", { defaultValue: "Actions" })}
								</th>
							</tr>
						</thead>
						<tbody className='bg-white divide-y divide-gray-200'>
							{filteredCategories.map((category) => (
								<tr key={category._id} className='hover:bg-gray-50'>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div
											className={`text-sm font-medium text-gray-900 ${
												isRTL ? "text-right" : "text-left"
											}`}>
											{getLocalizedText(category.name)}
										</div>
									</td>
									<td className='px-6 py-4'>
										<div
											className={`text-sm text-gray-900 max-w-xs truncate ${
												isRTL ? "text-right" : "text-left"
											}`}>
											{getLocalizedText(category.description) ||
												t("noDescription", { defaultValue: "No description" })}
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-500'>
											{new Date(category.createdAt).toLocaleDateString()}
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
										<div
											className={`flex ${
												isRTL
													? "flex-row-reverse space-x-reverse space-x-4"
													: "space-x-4"
											}`}>
											<button
												onClick={() => handleEdit(category)}
												className='text-indigo-600 hover:text-indigo-900 transition-colors'
												title={t("editCategory", {
													defaultValue: "Edit Category",
												})}>
												<Edit className='h-4 w-4' />
											</button>
											<button
												onClick={() => handleDelete(category)}
												disabled={deletingCategory === category._id}
												className='text-red-600 hover:text-red-900 transition-colors disabled:opacity-50'
												title={t("deleteCategory", {
													defaultValue: "Delete Category",
												})}>
												<Trash2 className='h-4 w-4' />
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
					<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
						<div
							ref={editModalRef}
							className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								{t("editCategory", { defaultValue: "Edit Category" })}
							</h3>
							<form onSubmit={handleUpdateCategory} className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										{t("categoryName", { defaultValue: "Category Name" })} *
									</label>
									<input
										type='text'
										value={editForm.name}
										onChange={(e) =>
											setEditForm((prev) => ({ ...prev, name: e.target.value }))
										}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
										required
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										{t("description", { defaultValue: "Description" })}
									</label>
									<input
										type='text'
										value={editForm.description}
										onChange={(e) =>
											setEditForm((prev) => ({
												...prev,
												description: e.target.value,
											}))
										}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
									/>
								</div>
								<div
									className={`flex ${
										isRTL ? "space-x-reverse space-x-3" : "space-x-3"
									}`}>
									<button
										type='submit'
										disabled={isUpdating}
										className='bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
										{isUpdating
											? t("updating", { defaultValue: "Updating..." })
											: t("updateCategory", {
													defaultValue: "Update Category",
											  })}
									</button>
									<button
										type='button'
										onClick={() => {
											setEditingCategory(null);
											setEditForm({ name: "", description: "" });
										}}
										className='bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors'>
										{t("cancel", { defaultValue: "Cancel" })}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* Delete Confirmation Modal */}
				{showDeleteModal && categoryToDelete && (
					<DeletionModal
						isOpen={showDeleteModal}
						onClose={cancelDelete}
						onConfirm={confirmDelete}
						title={t("confirmDelete", { defaultValue: "Confirm Delete" })}
						description={t("deleteCategoryWarning", {
							defaultValue:
								"Are you sure you want to delete this category? This action cannot be undone.",
						})}
						itemName={getLocalizedText(categoryToDelete.name)}
						itemDescription={getLocalizedText(categoryToDelete.description)}
						isDeleting={deletingCategory === categoryToDelete._id}
						type='category'
					/>
				)}

				{/* Empty State */}
				{filteredCategories.length === 0 && (
					<div className='text-center py-12'>
						<Tag className='mx-auto h-12 w-12 text-gray-400' />
						<h3 className='mt-2 text-sm font-medium text-gray-900'>
							{t("noCategoriesFound", { defaultValue: "No categories found" })}
						</h3>
						<p className='mt-1 text-sm text-gray-500'>
							{searchTerm
								? t("tryAdjustingSearch", {
										defaultValue: "Try adjusting your search terms.",
								  })
								: t("createFirstCategory", {
										defaultValue:
											"Get started by creating your first category.",
								  })}
						</p>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default ManageCategories;
