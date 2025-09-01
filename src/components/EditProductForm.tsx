/** @format */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X, Plus, Star, Edit, Trash2, User, Calendar } from "lucide-react";
import { Product, ProductFormData, Review } from "../types";
import { useProducts } from "../contexts/ProductsContext";
import { useSubCategories } from "../hooks/useSubCategories";
import { reviewApi } from "../services/reviewApi";
import toast from "react-hot-toast";

interface EditProductFormProps {
	product: Product;
	onClose: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({
	product,
	onClose,
}) => {
	const modalRef = useRef<HTMLDivElement>(null);
	const { updateProduct } = useProducts();
	const { data: subcategories = [] } = useSubCategories();
	
	// Product form state
	const [form, setForm] = useState<ProductFormData>({
		name: product.name || "",
		description: product.description || "",
		longDescription: product.longDescription || "",
		price: product.price || 0,
		subcategory: typeof product.subcategory === 'string' ? product.subcategory : product.subcategory?._id || "",
		images: product.images || [],
		rating: product.averageRating || 0,
		reviews: product.totalReviews || 0,
		features: product.features || [],
		specifications: typeof product.specifications === 'string' 
			? product.specifications 
			: Object.entries(product.specifications || {}).map(([key, value]) => `${key}: ${value}`).join(", "),
		inStock: product.inStock || false,
		stockQuantity: product.stockQuantity || 0,
		shipping: product.shipping || "",
		warranty: product.warranty || "",
		certifications: product.certifications || [],
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
	const [featuresInput, setFeaturesInput] = useState("");
	const [certificationsInput, setCertificationsInput] = useState("");
	const [imageInput, setImageInput] = useState("");

	// Review management state
	const [reviews, setReviews] = useState<Review[]>([]);
	const [editingReview, setEditingReview] = useState<Review | null>(null);
	const [editForm, setEditForm] = useState({
		name: "",
		rating: 5,
		comment: "",
	});
	const [isUpdatingReview, setIsUpdatingReview] = useState(false);
	const [reviewError, setReviewError] = useState<string | null>(null);

	// Handle click outside modal
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		// Handle escape key
		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscapeKey);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscapeKey);
		};
	}, [onClose]);

	// Prevent body scroll when modal is open
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, []);

	// Load reviews when component mounts
	useEffect(() => {
		loadReviews();
	}, []);

	const loadReviews = async () => {
		try {
			const reviewsData = await reviewApi.getProductReviews(product._id);
			setReviews(reviewsData.reviews || []);
		} catch (error) {
			console.error("Error loading reviews:", error);
			setReviews([]);
		}
	};

	// Product form handlers
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value, type } = e.target;
		let parsedValue: string | number | boolean = value;

		if (type === "number") {
			parsedValue = value === "" ? 0 : parseFloat(value);
		} else if (type === "checkbox") {
			parsedValue = (e.target as HTMLInputElement).checked;
		}

		setForm((prev) => ({ ...prev, [name]: parsedValue }));

		// Clear error when user starts typing
		if (errors[name as keyof ProductFormData]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFeaturesInput(e.target.value);
	};

	const handleAddFeature = () => {
		if (featuresInput.trim() && !form.features.includes(featuresInput.trim())) {
			setForm((prev) => ({
				...prev,
				features: [...prev.features, featuresInput.trim()],
			}));
			setFeaturesInput("");
		}
	};

	const handleRemoveFeature = (index: number) => {
		setForm((prev) => ({
			...prev,
			features: prev.features.filter((_, i) => i !== index),
		}));
	};

	const handleCertificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCertificationsInput(e.target.value);
	};

	const handleAddCertification = () => {
		if (
			certificationsInput.trim() &&
			!form.certifications.includes(certificationsInput.trim())
		) {
			setForm((prev) => ({
				...prev,
				certifications: [...prev.certifications, certificationsInput.trim()],
			}));
			setCertificationsInput("");
		}
	};

	const handleRemoveCertification = (index: number) => {
		setForm((prev) => ({
			...prev,
			certifications: prev.certifications.filter((_, i) => i !== index),
		}));
	};

	const addImage = (imageUrl: string) => {
		if (imageUrl.trim() && !form.images.includes(imageUrl.trim())) {
			setForm((prev) => ({
				...prev,
				images: [...prev.images, imageUrl.trim()],
			}));
			setImageInput("");
		}
	};

	const removeImage = (index: number) => {
		setForm((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	const validateForm = (): boolean => {
		const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

		if (!form.name.trim()) {
			newErrors.name = "Product name is required";
		}

		if (!form.description.trim()) {
			newErrors.description = "Description is required";
		}

		if (!form.longDescription.trim()) {
			newErrors.longDescription = "Long description is required";
		}

		if (form.price <= 0) {
			newErrors.price = "Price must be greater than 0";
		}

		if (!form.subcategory) {
			newErrors.subcategory = "Category is required";
		}

		if (form.images.length === 0) {
			newErrors.images = "At least one product image is required";
		}

		if (form.stockQuantity < 0) {
			newErrors.stockQuantity = "Stock quantity cannot be negative";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			// Convert specifications string to object
			const specificationsObj: Record<string, string> = {};
			if (form.specifications) {
				form.specifications.split(",").forEach((spec) => {
					const [key, value] = spec.split(":").map((s) => s.trim());
					if (key && value) {
						specificationsObj[key] = value;
					}
				});
			}

			const updatedProduct = {
				name: form.name,
				description: form.description,
				longDescription: form.longDescription,
				price: form.price,
				subcategory: form.subcategory,
				image: form.images[0] || "",
				images: form.images,
				features: form.features,
				specifications: specificationsObj,
				inStock: form.inStock,
				stockQuantity: form.stockQuantity,
				shipping: form.shipping,
				warranty: form.warranty,
				certifications: form.certifications,
			};

			await updateProduct(product._id, updatedProduct);
			toast.success("Product updated successfully! 🎉");
			onClose();
		} catch (error) {
			console.error("Error updating product:", error);
			toast.error("Failed to update product. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Review handlers
	const handleEditReview = (review: Review) => {
		setEditingReview(review);
		setEditForm({
			name: review.user || "",
			rating: review.rating,
			comment: review.comment,
		});
		setReviewError(null);
	};

	const closeReviewModal = () => {
		setEditingReview(null);
		setEditForm({ name: "", rating: 5, comment: "" });
		setReviewError(null);
	};

	const handleUpdateReview = async () => {
		if (!editingReview) return;

		setIsUpdatingReview(true);
		setReviewError(null);
		try {
			await reviewApi.updateReview(editingReview._id, editForm);
			await loadReviews();
			closeReviewModal();
			toast.success("Review updated successfully! 🎉");
		} catch (error) {
			console.error("Error updating review:", error);
			setReviewError("Error updating review. Please try again.");
			toast.error("Failed to update review. Please try again.");
		} finally {
			setIsUpdatingReview(false);
		}
	};

	const handleDeleteReview = async (reviewId: string) => {
		if (!confirm("Are you sure you want to delete this review?")) return;

		try {
			await reviewApi.deleteReview(reviewId);
			await loadReviews();
			toast.success("Review deleted successfully! 🗑️");
		} catch (error) {
			console.error("Error deleting review:", error);
			toast.error("Failed to delete review. Please try again.");
		}
	};

	const subcategoriesList = subcategories.map((sub: { _id: string; name: string }) => ({
		id: sub._id,
		name: sub.name,
	}));

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
				<motion.div
					ref={modalRef}
					initial={{ opacity: 0, scale: 0.95, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: 20 }}
					transition={{ duration: 0.2 }}
					className='bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto'>
					{/* Header with close button */}
					<div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center space-x-3'>
								<div className='w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center'>
									<Edit className='h-6 w-6 text-white' />
								</div>
								<div>
									<h2 className='text-2xl font-bold text-gray-900'>
										Edit Product
									</h2>
									<p className='text-gray-600'>Update product information</p>
								</div>
							</div>
							<button
								onClick={onClose}
								className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
								aria-label='Close modal'>
								<X className='h-6 w-6 text-gray-500' />
							</button>
						</div>
					</div>

					{/* Form Content */}
					<div className='p-6'>
						<form onSubmit={handleSubmit} className='space-y-6'>
							{/* Basic Information */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Product Name *
									</label>
									<input
										type='text'
										name='name'
										value={form.name}
										onChange={handleChange}
										className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
											errors.name ? 'border-red-500' : 'border-gray-300'
										}`}
										placeholder='Enter product name'
									/>
									{errors.name && (
										<p className='mt-1 text-sm text-red-600'>{errors.name}</p>
									)}
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Price *
									</label>
									<input
										type='number'
										name='price'
										value={form.price}
										onChange={handleChange}
										step='0.01'
										min='0'
										className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
											errors.price ? 'border-red-500' : 'border-gray-300'
										}`}
										placeholder='0.00'
									/>
									{errors.price && (
										<p className='mt-1 text-sm text-red-600'>{errors.price}</p>
									)}
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Subcategory *
									</label>
									<select
										name='subcategory'
										value={form.subcategory}
										onChange={handleChange}
										className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
											errors.subcategory ? 'border-red-500' : 'border-gray-300'
										}`}>
										<option value=''>Select a subcategory</option>
										{subcategoriesList.map((subcategory) => (
											<option key={subcategory.id} value={subcategory.id}>
												{subcategory.name}
											</option>
										))}
									</select>
									{errors.subcategory && (
										<p className='mt-1 text-sm text-red-600'>{errors.subcategory}</p>
									)}
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Stock Quantity
									</label>
									<input
										type='number'
										name='stockQuantity'
										value={form.stockQuantity}
										onChange={handleChange}
										min='0'
										className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
											errors.stockQuantity ? 'border-red-500' : 'border-gray-300'
										}`}
										placeholder='0'
									/>
									{errors.stockQuantity && (
										<p className='mt-1 text-sm text-red-600'>{errors.stockQuantity}</p>
									)}
								</div>
							</div>

							{/* Descriptions */}
							<div className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Short Description *
									</label>
									<textarea
										name='description'
										value={form.description}
										onChange={handleChange}
										rows={3}
										className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
											errors.description ? 'border-red-500' : 'border-gray-300'
										}`}
										placeholder='Brief product description'
									/>
									{errors.description && (
										<p className='mt-1 text-sm text-red-600'>{errors.description}</p>
									)}
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Long Description *
									</label>
									<textarea
										name='longDescription'
										value={form.longDescription}
										onChange={handleChange}
										rows={4}
										className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
											errors.longDescription ? 'border-red-500' : 'border-gray-300'
										}`}
										placeholder='Detailed product description'
									/>
									{errors.longDescription && (
										<p className='mt-1 text-sm text-red-600'>{errors.longDescription}</p>
									)}
								</div>
							</div>

							{/* Images */}
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Product Images *
								</label>
								<div className='space-y-3'>
									<div className='flex gap-2'>
										<input
											type='url'
											value={imageInput}
											onChange={(e) => setImageInput(e.target.value)}
											className='flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
											placeholder='Enter image URL'
										/>
										<button
											type='button'
											onClick={() => addImage(imageInput)}
											className='px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'>
											Add
										</button>
									</div>
									{form.images.length > 0 && (
										<div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
											{form.images.map((image, index) => (
												<div key={index} className='relative group'>
													<img
														src={image}
														alt={`Product ${index + 1}`}
														className='w-full h-24 object-cover rounded-lg'
														onError={(e) => {
															e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
														}}
													/>
													<button
														type='button'
														onClick={() => removeImage(index)}
														className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
														<X className='w-4 h-4' />
													</button>
												</div>
											))}
										</div>
									)}
									{errors.images && (
										<p className='mt-1 text-sm text-red-600'>{errors.images}</p>
									)}
								</div>
							</div>

							{/* Features */}
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Features
								</label>
								<div className='space-y-3'>
									<div className='flex gap-2'>
										<input
											type='text'
											value={featuresInput}
											onChange={handleFeaturesChange}
											className='flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
											placeholder='Enter feature'
										/>
										<button
											type='button'
											onClick={handleAddFeature}
											className='px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'>
											Add
										</button>
									</div>
									{form.features.length > 0 && (
										<div className='flex flex-wrap gap-2'>
											{form.features.map((feature, index) => (
												<div
													key={index}
													className='flex items-center gap-2 bg-teal-100 text-teal-800 px-3 py-1 rounded-full'>
													<span className='text-sm'>{feature}</span>
													<button
														type='button'
														onClick={() => handleRemoveFeature(index)}
														className='text-teal-600 hover:text-teal-800'>
														<X className='w-4 h-4' />
													</button>
												</div>
											))}
										</div>
									)}
								</div>
							</div>

							{/* Specifications */}
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Specifications
								</label>
								<textarea
									name='specifications'
									value={form.specifications}
									onChange={handleChange}
									rows={3}
									className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
									placeholder='Enter specifications in format: key: value, key: value'
								/>
							</div>

							{/* Additional Information */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Shipping Information
									</label>
									<input
										type='text'
										name='shipping'
										value={form.shipping}
										onChange={handleChange}
										className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
										placeholder='Shipping details'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Warranty
									</label>
									<input
										type='text'
										name='warranty'
										value={form.warranty}
										onChange={handleChange}
										className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
										placeholder='Warranty information'
									/>
								</div>
							</div>

							{/* Certifications */}
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Certifications
								</label>
								<div className='space-y-3'>
									<div className='flex gap-2'>
										<input
											type='text'
											value={certificationsInput}
											onChange={handleCertificationsChange}
											className='flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
											placeholder='Enter certification'
										/>
										<button
											type='button'
											onClick={handleAddCertification}
											className='px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'>
											Add
										</button>
									</div>
									{form.certifications.length > 0 && (
										<div className='flex flex-wrap gap-2'>
											{form.certifications.map((cert, index) => (
												<div
													key={index}
													className='flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full'>
													<span className='text-sm'>{cert}</span>
													<button
														type='button'
														onClick={() => handleRemoveCertification(index)}
														className='text-blue-600 hover:text-blue-800'>
														<X className='w-4 h-4' />
													</button>
												</div>
											))}
										</div>
									)}
								</div>
							</div>

							{/* Stock Status */}
							<div className='flex items-center space-x-3'>
								<input
									type='checkbox'
									name='inStock'
									checked={form.inStock}
									onChange={handleChange}
									className='w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500'
								/>
								<label className='text-sm font-medium text-gray-700'>
									In Stock
								</label>
							</div>

							{/* Submit Button */}
							<div className='flex justify-end space-x-3 pt-6 border-t border-gray-200'>
								<button
									type='button'
									onClick={onClose}
									className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'>
									Cancel
								</button>
								<button
									type='submit'
									disabled={isSubmitting}
									className='px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'>
									<Save className='w-4 h-4' />
									<span>{isSubmitting ? 'Updating...' : 'Update Product'}</span>
								</button>
							</div>
						</form>

						{/* Reviews Management */}
						<div className='border-t border-gray-200 pt-6 mt-6'>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								Product Reviews ({reviews.length})
							</h3>
							
							{reviews.length === 0 ? (
								<p className='text-gray-500 text-sm'>No reviews for this product yet.</p>
							) : (
								<div className='space-y-3 max-h-64 overflow-y-auto'>
									{reviews.map((review) => (
										<div key={review._id} className='bg-gray-50 p-3 rounded-lg'>
											<div className='flex items-start justify-between'>
												<div className='flex-1'>
													<div className='flex items-center gap-3 mb-2'>
														<div className='flex items-center gap-1'>
															{[...Array(5)].map((_, i) => (
																<Star
																	key={i}
																	className={`w-4 h-4 ${
																		i < review.rating
																			? "text-yellow-400 fill-current"
																			: "text-gray-300"
																	}`}
																/>
															))}
															<span className='ml-2 text-sm font-medium text-gray-900'>
																{review.rating}/5
															</span>
														</div>
													</div>
														
													<div className='flex items-center gap-4 text-sm text-gray-500 mb-2'>
														<div className='flex items-center gap-1'>
															<User className='w-4 h-4' />
															<span className='font-medium text-gray-900'>{review.user}</span>
														</div>
														<div className='flex items-center gap-1'>
															<Calendar className='w-4 h-4' />
															<span>{new Date(review.createdAt).toLocaleDateString()}</span>
														</div>
													</div>
														
													<p className='text-gray-700 text-sm leading-relaxed'>{review.comment}</p>
												</div>
												
												<div className='flex items-center gap-2 ml-4'>
													<button
														type='button'
														onClick={() => handleEditReview(review)}
														className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
														title='Edit review'
													>
														<Edit className='w-4 h-4' />
													</button>
													<button
														type='button'
														onClick={() => handleDeleteReview(review._id)}
														className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
														title='Delete review'
													>
														<Trash2 className='w-4 h-4' />
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</motion.div>
			</motion.div>

			{/* Edit Review Modal */}
			{editingReview && (
				<div 
					className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]'
					onClick={closeReviewModal}
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						className='bg-white rounded-lg p-6 w-full max-w-md shadow-2xl'
						onClick={(e) => e.stopPropagation()}
					>
						<div className='mb-4'>
							<h3 id="edit-review-title" className='text-lg font-semibold text-gray-900'>Edit Review</h3>
						</div>
						
						<form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Name
								</label>
								<input
									type='text'
									value={editForm.name}
									onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
									onClick={(e) => e.stopPropagation()}
									onMouseDown={(e) => e.stopPropagation()}
									onMouseUp={(e) => e.stopPropagation()}
									className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
									placeholder='Enter your name'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Rating
								</label>
								<div className='flex items-center gap-2'>
									{[...Array(5)].map((_, i) => (
										<button
											key={i}
											type="button"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												setEditForm({ ...editForm, rating: i + 1 });
											}}
											onMouseDown={(e) => e.stopPropagation()}
											onMouseUp={(e) => e.stopPropagation()}
											className={`p-1 rounded transition-colors ${
												editForm.rating > i
													? "text-yellow-400"
													: "text-gray-300 hover:text-yellow-200"
											}`}
											aria-label={`${i + 1} star${i === 0 ? '' : 's'}`}
											aria-pressed={editForm.rating === i + 1}
										>
											<Star className={`w-6 h-6 ${
												editForm.rating > i ? "fill-current" : ""
											}`} />
										</button>
									))}
								</div>
							</div>
							
							<div>
								<label htmlFor="review-comment" className='block text-sm font-medium text-gray-700 mb-2'>
									Comment
								</label>
								<textarea
									id="review-comment"
									rows={4}
									value={editForm.comment}
									onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
									onClick={(e) => e.stopPropagation()}
									onMouseDown={(e) => e.stopPropagation()}
									onMouseUp={(e) => e.stopPropagation()}
									className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none'
									placeholder='Write your review here...'
									aria-describedby={reviewError ? "review-error" : undefined}
								/>
							</div>
							
							{reviewError && (
								<div id="review-error" className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg' role="alert">
									<p className='text-sm text-red-600'>{reviewError}</p>
								</div>
							)}
							
							<div className='mt-6'>
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										handleUpdateReview();
									}}
									onMouseDown={(e) => e.stopPropagation()}
									onMouseUp={(e) => e.stopPropagation()}
									disabled={!editForm.comment.trim() || !editForm.name.trim() || editForm.rating === 0 || isUpdatingReview}
									className='w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
								>
									{isUpdatingReview ? "Updating..." : "Update Review"}
								</button>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default EditProductForm;
