/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	Plus,
	Edit,
	Trash2,
	FolderOpen,
	ChevronDown,
	ChevronRight,
	Tag,
	Save,
	X,
} from "lucide-react";
import { useCategories } from "../../contexts/CategoriesContext";
import {
	useSubCategories,
	useCreateSubCategory,
	useUpdateSubCategory,
	useDeleteSubCategory,
} from "../../hooks/useSubCategories";
import { SubCategory, UpdateSubCategoryData } from "../../types";

import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import DeletionModal from "../ui/DeletionModal";

const ManageSubCategories: React.FC = () => {
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

	// Helper function to build localized object
	const buildLocalized = (fallback: string, en?: string, ar?: string) => {
		return {
			en: (en ?? '').trim() || fallback,
			ar: (ar ?? '').trim() || fallback,
		};
	};

	// Helper function to set i18n field
	const setField = (key: keyof typeof i18nFields, value: string) => 
		setI18nFields(prev => ({ ...prev, [key]: value }));
	const [isCreating, setIsCreating] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
		new Set()
	);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [subcategoryToDelete, setSubcategoryToDelete] =
		useState<SubCategory | null>(null);

	// Form states
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		parentCategory: "",
	});

	// Bilingual fields
	const [i18nFields, setI18nFields] = useState({
		nameEn: "",
		nameAr: "",
		descEn: "",
		descAr: "",
	});

	const { categories } = useCategories();
	const { data: allSubCategories = [] } = useSubCategories();
	const createSubCategory = useCreateSubCategory();
	const updateSubCategory = useUpdateSubCategory();
	const deleteSubCategory = useDeleteSubCategory();

	// Toggle category expansion
	const toggleCategoryExpansion = (categoryId: string) => {
		const newExpanded = new Set(expandedCategories);
		if (newExpanded.has(categoryId)) {
			newExpanded.delete(categoryId);
		} else {
			newExpanded.add(categoryId);
		}
		setExpandedCategories(newExpanded);
	};

	// Get subcategories for a specific parent
	const getSubCategoriesForParent = (parentId: string) => {
		return (allSubCategories || []).filter(
			(sub) =>
				sub.parentCategory &&
				(typeof sub.parentCategory === "string"
					? sub.parentCategory === parentId
					: sub.parentCategory._id === parentId)
		);
	};

	// Handle form input changes
	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Start creating new subcategory
	const handleCreateStart = (parentCategoryId: string) => {
		setFormData({
			name: "",
			description: "",
			parentCategory: parentCategoryId,
		});
		setI18nFields({
			nameEn: "",
			nameAr: "",
			descEn: "",
			descAr: "",
		});
		setIsCreating(true);
		setEditingId(null);
	};

	// Start editing subcategory
	const handleEditStart = (subcategory: SubCategory) => {
		// Extract localized values
		const nameObj = typeof subcategory.name === 'object' ? subcategory.name : { en: subcategory.name, ar: subcategory.name };
		const descObj = typeof subcategory.description === 'object' ? subcategory.description : { en: subcategory.description, ar: subcategory.description };
		
		setFormData({
			name: getLocalizedText(subcategory.name as unknown),
			description: getLocalizedText(subcategory.description as unknown),
			parentCategory:
				(subcategory.parentCategory &&
					(typeof subcategory.parentCategory === "string"
						? subcategory.parentCategory
						: subcategory.parentCategory._id)) ||
				"",
		});
		
		// Populate bilingual fields
		setI18nFields({
			nameEn: nameObj.en || "",
			nameAr: nameObj.ar || "",
			descEn: descObj.en || "",
			descAr: descObj.ar || "",
		});
		
		setEditingId(subcategory._id);
		setIsCreating(false);
	};

	// Cancel form
	const handleCancel = () => {
		setIsCreating(false);
		setEditingId(null);
		setFormData({
			name: "",
			description: "",
			parentCategory: "",
		});
		setI18nFields({
			nameEn: "",
			nameAr: "",
			descEn: "",
			descAr: "",
		});
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			(!formData.name.trim() && !i18nFields.nameEn && !i18nFields.nameAr) ||
			(!formData.description.trim() && !i18nFields.descEn && !i18nFields.descAr) ||
			!formData.parentCategory
		) {
			return;
		}

		try {
			if (isCreating) {
				await createSubCategory.mutateAsync({
					name: buildLocalized(formData.name, i18nFields.nameEn, i18nFields.nameAr),
					description: buildLocalized(formData.description, i18nFields.descEn, i18nFields.descAr),
					parentCategory: formData.parentCategory,
				});
				toast.success(t("added", { defaultValue: "Added successfully" }));
			} else if (editingId) {
				await updateSubCategory.mutateAsync({
					id: editingId,
					subcategoryData: {
						name: buildLocalized(formData.name, i18nFields.nameEn, i18nFields.nameAr),
						description: buildLocalized(formData.description, i18nFields.descEn, i18nFields.descAr),
						parentCategory: formData.parentCategory,
					} as UpdateSubCategoryData,
				});
				toast.success(t("updated", { defaultValue: "Updated successfully" }));
			}
			handleCancel();
		} catch {
			// Error saving subcategory
			toast.error(
				t("failedToSave", { defaultValue: "Failed to save subcategory" })
			);
		}
	};

	// Handle delete
	const handleDelete = (subcategory: SubCategory) => {
		setSubcategoryToDelete(subcategory);
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		if (!subcategoryToDelete) return;

		try {
			await deleteSubCategory.mutateAsync(subcategoryToDelete._id);
			toast.success(
				t("subcategoryDeleted", {
					defaultValue: "Subcategory deleted successfully!",
				})
			);
			setShowDeleteModal(false);
			setSubcategoryToDelete(null);
		} catch {
			// Error deleting subcategory
			toast.error(
				t("failedToDeleteSubcategory", {
					defaultValue: "Failed to delete subcategory",
				})
			);
		}
	};

	const cancelDelete = () => {
		setShowDeleteModal(false);
		setSubcategoryToDelete(null);
	};

	return (
		<div className='space-y-4 sm:space-y-6'>
			{/* Header */}
			<div
				className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
					isRTL ? "sm:flex-row-reverse" : ""
				}`}>
				<div className={`${isRTL ? "text-right" : "text-left"}`}>
					<h2
						className={`text-xl sm:text-2xl font-bold text-gray-900 flex items-center ${
							isRTL ? "flex-row-reverse space-x-reverse space-x-2" : "space-x-2"
						}`}>
						<FolderOpen className='w-5 h-5 sm:w-6 sm:h-6 text-teal-600' />
						<span>{t("manageSubcategories")}</span>
					</h2>
					<p className='text-sm sm:text-base text-gray-600 mt-1'>
						{t("manageSubcategoriesDescription")}
					</p>
				</div>
			</div>

			{/* Categories Tree View */}
			<div className='bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200'>
				<div className='p-4 sm:p-6 border-b border-gray-200'>
					<h3
						className={`text-base sm:text-lg font-semibold text-gray-900 flex items-center ${
							isRTL ? "flex-row-reverse space-x-reverse space-x-2" : "space-x-2"
						}`}>
						<Tag className='w-4 h-4 sm:w-5 sm:h-5 text-teal-600' />
						<span>{t("categoriesAndSubcategories")}</span>
					</h3>
				</div>

				<div className='divide-y divide-gray-200'>
					{(categories || []).map((category) => {
						const subCategories = getSubCategoriesForParent(category._id);
						const isExpanded = expandedCategories.has(category._id);

						return (
							<div key={category._id} className='p-3 sm:p-4'>
								{/* Parent Category Row */}
								<div
									className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
										isRTL ? "sm:flex-row-reverse" : ""
									}`}>
									<div
										className={`flex items-center ${
											isRTL
												? "flex-row-reverse space-x-reverse space-x-2 sm:space-x-3"
												: "space-x-2 sm:space-x-3"
										}`}>
										<button
											onClick={() => toggleCategoryExpansion(category._id)}
											className='p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0'>
											{isExpanded ? (
												<ChevronDown className='w-4 h-4 text-gray-600' />
											) : (
												<ChevronRight className='w-4 h-4 text-gray-600' />
											)}
										</button>
										<div className='w-4 h-4 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0'>
											<Tag className='w-2.5 h-2.5 text-teal-600' />
										</div>
										<div
											className={`${
												isRTL ? "text-right" : "text-left"
											} min-w-0 flex-1`}>
											<h4 className='font-medium text-gray-900 text-sm sm:text-base'>
												{getLocalizedText(category.name)}
											</h4>
											<p className='text-xs sm:text-sm text-gray-500 truncate'>
												{getLocalizedText(category.description)}
											</p>
										</div>
									</div>

									<button
										onClick={() => handleCreateStart(category._id)}
										className='flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-xs sm:text-sm w-full sm:w-auto'>
										<Plus className='w-3 h-3 sm:w-4 sm:h-4' />
										<span>{t("addSubcategory")}</span>
									</button>
								</div>

								{/* SubCategories List */}
								{isExpanded && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.2 }}
										className={`mt-3 sm:mt-4 space-y-2 sm:space-y-3 ${
											isRTL ? "mr-4 sm:mr-8" : "ml-4 sm:ml-8"
										}`}>
										{subCategories.length === 0 ? (
											<div className='text-gray-500 text-xs sm:text-sm italic p-2'>
												{t("noSubcategoriesYet")}
											</div>
										) : (
											subCategories.map((subcategory) => (
												<div
													key={subcategory._id}
													className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 gap-2 sm:gap-0 ${
														isRTL ? "sm:flex-row-reverse" : ""
													}`}>
													<div
														className={`${
															isRTL ? "text-right" : "text-left"
														} min-w-0 flex-1`}>
														<h5 className='font-medium text-gray-900 text-sm sm:text-base'>
															{getLocalizedText(subcategory.name)}
														</h5>
														<p className='text-xs sm:text-sm text-gray-600 truncate'>
															{getLocalizedText(subcategory.description)}
														</p>
													</div>

													<div
														className={`flex items-center justify-end sm:justify-start ${
															isRTL
																? "flex-row-reverse space-x-reverse space-x-1 sm:space-x-2"
																: "space-x-1 sm:space-x-2"
														}`}>
														<button
															onClick={() => handleEditStart(subcategory)}
															className='p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'>
															<Edit className='w-3 h-3 sm:w-4 sm:h-4' />
														</button>
														<button
															onClick={() => handleDelete(subcategory)}
															className='p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'>
															<Trash2 className='w-3 h-3 sm:w-4 sm:h-4' />
														</button>
													</div>
												</div>
											))
										)}
									</motion.div>
								)}
							</div>
						);
					})}
				</div>
			</div>

			{/* Create/Edit Form */}
			{(isCreating || editingId) && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
					className='bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6'>
					<div
						className={`flex items-center justify-between mb-4 ${
							isRTL ? "flex-row-reverse" : ""
						}`}>
						<h3 className='text-base sm:text-lg font-semibold text-gray-900'>
							{isCreating ? t("createSubcategory") : t("editSubcategory")}
						</h3>
						<button
							onClick={handleCancel}
							className='p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'>
							<X className='w-4 h-4 sm:w-5 sm:h-5' />
						</button>
					</div>

					<form onSubmit={handleSubmit} className='space-y-3 sm:space-y-4'>
						<div>
							<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'>
								{t("parentCategory")}
							</label>
							<select
								name='parentCategory'
								value={formData.parentCategory}
								onChange={handleInputChange}
								className='w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
								required>
								<option value=''>{t("selectParentCategory")}</option>
								{(categories || []).map((category) => (
									<option key={category._id} value={category._id}>
										{getLocalizedText(category.name)}
									</option>
								))}
							</select>
						</div>

						{/* Subcategory Name - Bilingual */}
						<div>
							<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'>
								{t("subcategoryName")}
							</label>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
								<div>
									<label className='block text-xs font-medium text-gray-600 mb-1'>
										English (EN)
									</label>
									<input
										type='text'
										value={i18nFields.nameEn}
										onChange={(e) => setField('nameEn', e.target.value)}
										className='w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
										placeholder='Subcategory name in English'
									/>
								</div>
								<div>
									<label className='block text-xs font-medium text-gray-600 mb-1'>
										العربية (AR)
									</label>
									<input
										type='text'
										value={i18nFields.nameAr}
										onChange={(e) => setField('nameAr', e.target.value)}
										className='w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
										placeholder='اسم الفئة الفرعية بالعربية'
										dir='auto'
									/>
								</div>
							</div>
						</div>

						{/* Description - Bilingual */}
						<div>
							<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'>
								{t("description")}
							</label>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
								<div>
									<label className='block text-xs font-medium text-gray-600 mb-1'>
										English (EN)
									</label>
									<textarea
										value={i18nFields.descEn}
										onChange={(e) => setField('descEn', e.target.value)}
										rows={3}
										className='w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none'
										placeholder='Subcategory description in English'
									/>
								</div>
								<div>
									<label className='block text-xs font-medium text-gray-600 mb-1'>
										العربية (AR)
									</label>
									<textarea
										value={i18nFields.descAr}
										onChange={(e) => setField('descAr', e.target.value)}
										rows={3}
										className='w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none'
										placeholder='وصف الفئة الفرعية بالعربية'
										dir='auto'
									/>
								</div>
							</div>
						</div>

						<div
							className={`flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 ${
								isRTL ? "sm:space-x-reverse sm:space-x-3" : ""
							}`}>
							<button
								type='button'
								onClick={handleCancel}
								className='w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'>
								{t("cancel")}
							</button>
							<button
								type='submit'
								disabled={
									createSubCategory.isPending || updateSubCategory.isPending
								}
								className='w-full sm:w-auto flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-sm sm:text-base bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50'>
								<Save className='w-3 h-3 sm:w-4 sm:h-4' />
								<span>
									{createSubCategory.isPending || updateSubCategory.isPending
										? t("saving")
										: isCreating
										? t("createSubcategory")
										: t("editSubcategory")}
								</span>
							</button>
						</div>
					</form>
				</motion.div>
			)}

			{/* Delete Confirmation Modal */}
			{showDeleteModal && subcategoryToDelete && (
				<DeletionModal
					isOpen={showDeleteModal}
					onClose={cancelDelete}
					onConfirm={confirmDelete}
					title={t("confirmDelete", { defaultValue: "Confirm Delete" })}
					description={t("deleteSubcategoryWarning", {
						defaultValue:
							"Are you sure you want to delete this subcategory? This action cannot be undone.",
					})}
					itemName={getLocalizedText(subcategoryToDelete.name)}
					itemDescription={getLocalizedText(subcategoryToDelete.description)}
					isDeleting={deleteSubCategory.isPending}
					type='subcategory'
				/>
			)}
		</div>
	);
};

export default ManageSubCategories;
