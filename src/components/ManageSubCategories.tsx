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
	X
} from "lucide-react";
import { useCategories } from "../contexts/CategoriesContext";
import { 
	useSubCategories, 
	useCreateSubCategory, 
	useUpdateSubCategory, 
	useDeleteSubCategory 
} from "../hooks/useSubCategories";
import { SubCategory, CreateSubCategoryData } from "../types";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

const ManageSubCategories: React.FC = () => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();
	const [isCreating, setIsCreating] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
	
	// Form states
	const [formData, setFormData] = useState<CreateSubCategoryData>({
		name: "",
		description: "",
		parentCategory: "",
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
		return (allSubCategories || []).filter(sub => 
			typeof sub.parentCategory === 'string' 
				? sub.parentCategory === parentId 
				: sub.parentCategory._id === parentId
		);
	};



	// Handle form input changes
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
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
		setIsCreating(true);
		setEditingId(null);
	};

	// Start editing subcategory
	const handleEditStart = (subcategory: SubCategory) => {
		setFormData({
			name: subcategory.name,
			description: subcategory.description,
			parentCategory: typeof subcategory.parentCategory === 'string' 
				? subcategory.parentCategory 
				: subcategory.parentCategory._id,
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
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!formData.name.trim() || !formData.description.trim() || !formData.parentCategory) {
			return;
		}

		try {
			if (isCreating) {
				await createSubCategory.mutateAsync(formData);
			} else if (editingId) {
				await updateSubCategory.mutateAsync({
					id: editingId,
					subcategoryData: {
						name: formData.name,
						description: formData.description,
						parentCategory: formData.parentCategory,
					},
				});
			}
			handleCancel();
		} catch (error) {
			console.error("Error saving subcategory:", error);
		}
	};

	// Handle delete
	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this subcategory?")) {
			try {
				await deleteSubCategory.mutateAsync(id);
			} catch (error) {
				console.error("Error deleting subcategory:", error);
			}
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
						<FolderOpen className="w-6 h-6 text-teal-600" />
						<span>Manage SubCategories</span>
					</h2>
					<p className="text-gray-600 mt-1">
						Organize subcategories under their parent categories
					</p>
				</div>
			</div>

			{/* Categories Tree View */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200">
				<div className="p-6 border-b border-gray-200">
					<h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
						<Tag className="w-5 h-5 text-teal-600" />
						<span>Categories & SubCategories</span>
					</h3>
				</div>

				<div className="divide-y divide-gray-200">
					{(categories || []).map((category) => {
						const subCategories = getSubCategoriesForParent(category._id);
						const isExpanded = expandedCategories.has(category._id);
						
						return (
							<div key={category._id} className="p-4">
								{/* Parent Category Row */}
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<button
											onClick={() => toggleCategoryExpansion(category._id)}
											className="p-1 hover:bg-gray-100 rounded transition-colors"
										>
											{isExpanded ? (
												<ChevronDown className="w-4 h-4 text-gray-600" />
											) : (
												<ChevronRight className="w-4 h-4 text-gray-600" />
											)}
										</button>
										<div className="w-4 h-4 bg-teal-100 rounded-full flex items-center justify-center">
											<Tag className="w-2.5 h-2.5 text-teal-600" />
										</div>
										<div>
											<h4 className="font-medium text-gray-900">{category.name}</h4>
											<p className="text-sm text-gray-500">{category.description}</p>
										</div>
									</div>
									
									<button
										onClick={() => handleCreateStart(category._id)}
										className="flex items-center space-x-2 px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
									>
										<Plus className="w-4 h-4" />
										<span>Add SubCategory</span>
									</button>
								</div>

								{/* SubCategories List */}
								{isExpanded && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.2 }}
										className="mt-4 ml-8 space-y-3"
									>
										{subCategories.length === 0 ? (
											<div className="text-gray-500 text-sm italic">
												No subcategories yet. Click "Add SubCategory" to create one.
											</div>
										) : (
											subCategories.map((subcategory) => (
												<div
													key={subcategory._id}
													className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
												>
													<div>
														<h5 className="font-medium text-gray-900">{subcategory.name}</h5>
														<p className="text-sm text-gray-600">{subcategory.description}</p>
													</div>
													
													<div className="flex items-center space-x-2">
														<button
															onClick={() => handleEditStart(subcategory)}
															className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
														>
															<Edit className="w-4 h-4" />
														</button>
														<button
															onClick={() => handleDelete(subcategory._id)}
															className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
														>
															<Trash2 className="w-4 h-4" />
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
					className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
				>
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900">
							{isCreating ? "Create New SubCategory" : "Edit SubCategory"}
						</h3>
						<button
							onClick={handleCancel}
							className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Parent Category
							</label>
							<select
								name="parentCategory"
								value={formData.parentCategory}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
								required
							>
								<option value="">Select a parent category</option>
								{(categories || []).map((category) => (
									<option key={category._id} value={category._id}>
										{category.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								SubCategory Name
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
								placeholder="Enter subcategory name"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Description
							</label>
							<textarea
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								rows={3}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
								placeholder="Enter subcategory description"
								required
							/>
						</div>

						<div className="flex items-center justify-end space-x-3 pt-4">
							<button
								type="button"
								onClick={handleCancel}
								className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={createSubCategory.isPending || updateSubCategory.isPending}
								className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
							>
								<Save className="w-4 h-4" />
								<span>
									{createSubCategory.isPending || updateSubCategory.isPending
										? "Saving..."
										: isCreating
										? "Create SubCategory"
										: "Update SubCategory"}
								</span>
							</button>
						</div>
					</form>
				</motion.div>
			)}
		</div>
	);
};

export default ManageSubCategories;
