/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useProductDetail } from "../../hooks/useProductDetail";
import { useLocalization } from "../../hooks/useLocalization";
import { useLanguage } from "../../contexts/LanguageContext";
import { useSubCategories } from "../../hooks/useSubCategories";
import { useTranslation } from "react-i18next";
import axiosClient from "../../config/axiosClient";
import { endpoints } from "../../config/endpoints";
import { reviewApi } from "../../services/reviewApi";
import { useAddReview } from "../../hooks/useProducts";
import { Product, Review } from "../../types";
import { Star, Plus, ShoppingCart, Truck, Shield, RotateCcw, Calendar, User, Zap } from "lucide-react";
import ProductImageGallery from "../product/ProductImageGallery";
import ProductHeader from "../product/ProductHeader";
import ProductSpecifications from "../product/ProductSpecifications";
import ProductReviews from "../product/ProductReviews";
import ProductActions from "../product/ProductActions";
import RelatedProducts from "../product/RelatedProducts";

const ProductDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { currentLanguage } = useLanguage();
	const { t } = useTranslation();
	const [product, setProduct] = useState<Product | null>(null);
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

	// Helper: get localized text from string or {en, ar}
	const getLocalizedProductField = (value: any): string => {
		if (!value) return "";
		if (typeof value === "string") return value;
		if (typeof value === "object") {
			return value[currentLanguage as "en" | "ar"] || value.en || value.ar || "";
		}
		return "";
	};

	// Helper: get localized category name
	const getLocalizedCategoryName = (category: any): string => {
		if (!category) return "";
		return getLocalizedProductField(category.name);
	};

	// Helper: get localized text (alias for getLocalizedProductField)
	const getLocalizedText = (value: any): string => {
		return getLocalizedProductField(value);
	};

	const [loading, setLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState(0);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [averageRating, setAverageRating] = useState(0);
	const [totalReviews, setTotalReviews] = useState(0);
	const [newReview, setNewReview] = useState({
		rating: 5,
		comment: "",
		user: "",
	});

	const { mutate: addReview, isPending: isAddingReview } = useAddReview({
		onSuccess: async () => {
			// Reload reviews after successful add
			if (!id) return;
			try {
				const reviewsData = await reviewApi.getProductReviews(id);
				if (reviewsData.reviews) setReviews(reviewsData.reviews);
				if (reviewsData.averageRating !== undefined) setAverageRating(reviewsData.averageRating);
				if (reviewsData.totalReviews !== undefined) setTotalReviews(reviewsData.totalReviews);
			} catch {
				// ignore
			}
			// Reset form
			setNewReview({ rating: 5, comment: "", user: "" });
		},
		// Errors toasts handled by hook
	});

	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const [selectedModalImage, setSelectedModalImage] = useState("");
	
	// Fetch all subcategories using the hook (same as edit form)
	const { data: subcategories = [] } = useSubCategories();
	
	// Map subcategories to match the edit form structure
	const subcategoriesList = subcategories.map((sub: { _id: string; name: string }) => ({
		id: sub._id,
		name: sub.name,
	}));

	const resolveText = (value: any, localized?: string): string => {
		if (localized && typeof localized === 'string') return localized;
		if (value == null) return '';
		if (typeof value === 'string') return value;
		if (typeof value === 'object') {
			return value[currentLanguage as 'en' | 'ar'] || value.en || value.ar || '';
		}
		return String(value);
	};

	// Load product data
	useEffect(() => {
		if (!id) return;

		const loadProduct = async () => {
			setLoading(true);
			try {
				// Fetch product by ID using axios client and endpoints
				const productResponse = await axiosClient.get(endpoints.PRODUCTS_BY_ID.replace(':id', id));
				const raw = productResponse.data;
				// Normalize localized fields into Product type
				const normalized: Product = {
					...raw,
					name: raw.localized?.name || resolveText(raw.name),
					description: raw.localized?.description || resolveText(raw.description),
					longDescription: raw.localized?.longDescription || resolveText(raw.longDescription),
					features: (raw.localized?.features || raw.features || []).map((f: any) => resolveText(f)),
					specifications: Object.fromEntries(Object.entries(raw.specifications || {}).map(([k, v]) => [k, resolveText(v)])),
					shipping: raw.localized?.shipping || resolveText(raw.shipping),
					warranty: raw.localized?.warranty || resolveText(raw.warranty),
				};
				setProduct(normalized);

				// Fetch reviews using reviewApi service
				try {
					const reviewsData = await reviewApi.getProductReviews(id);
					
					if (reviewsData.reviews) {
						setReviews(reviewsData.reviews);
					}
					if (reviewsData.averageRating !== undefined) {
						setAverageRating(reviewsData.averageRating);
					}
					if (reviewsData.totalReviews !== undefined) {
						setTotalReviews(reviewsData.totalReviews);
					}
				} catch {
					// Fallback to product data
					if (raw.reviews) setReviews(raw.reviews);
					if (raw.averageRating !== undefined) setAverageRating(raw.averageRating);
					if (raw.totalReviews !== undefined) setTotalReviews(raw.totalReviews);
				}

				// Reset selected image to 0 when product changes
				setSelectedImage(0);



				// Get related products from the same subcategory
				const allProductsResponse = await axiosClient.get(endpoints.PRODUCTS);
				const allProducts = allProductsResponse.data as Product[];
				const subcategoryName = typeof raw.subcategory === "string" ? raw.subcategory : (typeof raw.subcategory?.name === 'object' ? resolveText(raw.subcategory?.name) : (raw.subcategory?.name || "Unknown"));
				const related = allProducts
					.map((p: any) => ({
						...p,
						name: p.localized?.name || resolveText(p.name),
						description: p.localized?.description || resolveText(p.description),
					}))
					.filter((p: any) => {
						const pSubcategory = typeof p.subcategory === "string" ? p.subcategory : (typeof p.subcategory?.name === 'object' ? resolveText(p.subcategory?.name) : (p.subcategory?.name || "Unknown"));
						return pSubcategory === subcategoryName && p._id !== raw._id;
					})
					.slice(0, 4);
				setRelatedProducts(related as Product[]);
					} catch {
			// Error loading product
		} finally {
				setLoading(false);
			}
		};

		loadProduct();
	}, [id, currentLanguage]);

	// Loading state
	if (loading) {
		return (
			<div className='container mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='mb-4'>
					<div className='animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-teal-600 mx-auto mb-4'></div>
					<p className='text-gray-600 text-sm sm:text-base'>
						Loading product...
					</p>
				</motion.div>
			</div>
		);
	}

	// Product not found state
	if (!product) {
		return (
			<div className='container mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='mb-4'>
					<h2 className='text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-3 sm:mb-4'>
						Product Not Found
					</h2>
					<p className='text-sm sm:text-base text-gray-600 mb-4 sm:mb-6'>
						The product you're looking for doesn't exist.
					</p>
					<button
						onClick={() => navigate("/products")}
						className='inline-flex items-center space-x-2 bg-teal-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-sm sm:text-base'>
						<ArrowLeft className='w-4 h-4' />
						<span>Return to Products</span>
					</button>
				</motion.div>
			</div>
		);
	}

	const handleContactSales = () => {
		// TODO: Implement contact sales functionality
		alert("Contact sales functionality coming soon!");
	};

	const handleImageClick = (imageUrl: string) => {
		setSelectedModalImage(imageUrl);
		setIsImageModalOpen(true);
	};

	const closeImageModal = () => {
		setIsImageModalOpen(false);
		setSelectedModalImage("");
	};

	// Helper function to get subcategory name
	const getSubcategoryName = (
		subcategory: string | { _id: string; name: string; description?: string } | undefined | null
	) => {
		if (!subcategory) return "Unknown Category";
		return typeof subcategory === "string" ? subcategory : subcategory.name;
	};

	// Helper function to get subcategory display text
	const getSubcategoryDisplayText = (
		subcategory: string | { _id: string; name: string; description?: string } | undefined | null
	) => {
		const subcategoryName = getSubcategoryName(subcategory);
		// Handle localized content
		const displayName = getLocalizedText(subcategoryName);
		return displayName.split(" ")[0];
	};

	const handleAddReview = async () => {
		if (!newReview.comment.trim() || !newReview.user.trim()) {
			return;
		}
		addReview({ productId: id!, reviewData: { user: newReview.user, rating: newReview.rating, comment: newReview.comment } });
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-white'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pt-16 sm:pt-20 lg:pt-24'>
				{/* Back Button */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='mb-6 sm:mb-8'>
					<button
						onClick={() => navigate(-1)}
						className='inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors'>
						<ArrowLeft className='w-4 h-4' />
						<span>Back</span>
					</button>
				</motion.div>

				<div className='grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12'>
					{/* Product Images */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						className='space-y-3 sm:space-y-4 lg:space-y-6'>
						{/* Main Image */}
						<div className='relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl cursor-pointer'>

							<img
								src={product.images && product.images.length > 0 ? product.images[selectedImage] : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K"}
								alt={`${getLocalizedProductField(product.name)} - Main product image`}
								className='w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover transition-transform duration-300 hover:scale-105'
								onClick={() => handleImageClick(product.images && product.images.length > 0 ? product.images[selectedImage] : "")}
								onError={(e) => {
									e.currentTarget.src =
										"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
								}}
								loading="lazy"
							/>
							{/* Subcategory Badge */}
							<div className='absolute top-2 sm:top-4 left-2 sm:left-4'>
								<span className='inline-flex items-center space-x-1 sm:space-x-2 bg-white/95 backdrop-blur-sm -webkit-backdrop-blur-sm text-gray-800 px-2 sm:px-3 py-1.5 rounded-lg font-medium border border-white/20 shadow-lg text-xs sm:text-sm'>
									<Zap className='w-3 h-3 sm:w-4 sm:h-4 text-teal-600' />
									<span className='hidden sm:inline'>
										{(() => {
											const productSubcategoryId = typeof product.subcategory === 'string' ? product.subcategory : product.subcategory?._id;
											const matchedSubcategory = subcategoriesList.find(sub => sub.id === productSubcategoryId);
											return matchedSubcategory ? getLocalizedText(getLocalizedCategoryName(matchedSubcategory)) : "Loading...";
										})()}
									</span>
									<span className='sm:hidden'>
										{(() => {
											const productSubcategoryId = typeof product.subcategory === 'string' ? product.subcategory : product.subcategory?._id;
											const matchedSubcategory = subcategoriesList.find(sub => sub.id === productSubcategoryId);
											return matchedSubcategory ? getLocalizedText(getLocalizedCategoryName(matchedSubcategory)).split(" ")[0] : "Loading...";
										})()}
									</span>
								</span>
							</div>
						</div>

						{/* Thumbnail Images */}
						{product.images && product.images.length > 0 ? (
							<div className='grid grid-cols-4 gap-2 sm:gap-4'>
								{product.images.map((image, index) => (
									<button
										key={index}
										type="button"
										onClick={() => setSelectedImage(index)}
										className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
											selectedImage === index
												? "border-teal-500 shadow-lg"
												: "border-gray-200 hover:border-teal-300"
										}`}
										aria-label={`View image ${index + 1} of ${product.images.length}`}
										title={`View image ${index + 1} of ${product.images.length}`}
									>
										<img
											src={image}
											alt={`${getLocalizedProductField(product.name)} ${index + 1}`}
											className='w-full h-16 sm:h-20 object-cover'
											onError={(e) => {
												e.currentTarget.src =
													"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
											}}
										/>
									</button>
								))}
							</div>
						) : (
							<div className='text-center py-4 text-gray-500 text-sm'>
								No images available
							</div>
						)}
					</motion.div>

					{/* Product Info */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className='space-y-4 sm:space-y-6 lg:space-y-8'>
						{/* Product Header */}
						<div>
							<motion.div
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className='inline-flex items-center space-x-1 sm:space-x-2 bg-teal-50 px-2 sm:px-3 py-1.5 rounded-full border border-teal-200 mb-2 sm:mb-3 lg:mb-4'>
								<Zap className='w-3 h-3 sm:w-4 sm:h-4 text-teal-600' />
								<span className='text-teal-700 font-medium text-xs sm:text-sm'>
									Premium Medical Equipment
								</span>
							</motion.div>

							<motion.h1
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-2 sm:mb-3 lg:mb-4 leading-tight'>
								{getLocalizedProductField(product.name)}
							</motion.h1>

							{/* Rating and Views */}
							<motion.div
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 }}
								className='flex items-center justify-between mb-2 sm:mb-3 lg:mb-4'>
								<div className='flex items-center space-x-2'>
									<div className='flex items-center space-x-1'>
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`w-4 h-4 sm:w-5 sm:h-5 ${
													i < Math.floor(averageRating)
														? "text-yellow-400 fill-current"
														: "text-gray-300"
												}`}
											/>
										))}
									</div>
									<span className='text-gray-600 text-xs sm:text-sm'>
										{averageRating.toFixed(1)} ({totalReviews} reviews)
									</span>
								</div>

							</motion.div>

							{/* Price */}
							<motion.div
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6 }}
								className='mb-3 sm:mb-4 lg:mb-6'>
								<div className='text-3xl sm:text-4xl md:text-5xl font-bold text-teal-600'>
									{t('currencySymbol')} {product.price.toLocaleString()}
								</div>
								<div className='text-xs sm:text-sm text-gray-500 mt-1'>
									Financing available • Bulk pricing available
								</div>
							</motion.div>
						</div>

						{/* Description */}
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7 }}
							className='space-y-2 sm:space-y-3 lg:space-y-4'>
							<h3 className='text-base sm:text-lg font-semibold text-gray-900'>
								Description
							</h3>
							<p className='text-gray-600 leading-relaxed text-sm sm:text-base'>
								{getLocalizedProductField(product.longDescription)}
							</p>
						</motion.div>

						{/* Specifications */}
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8 }}
							className='space-y-2 sm:space-y-3 lg:space-y-4'>
							<h3 className='text-base sm:text-lg font-semibold text-gray-900'>
								Specifications
							</h3>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3'>
								{Object.entries(product.specifications).map(([key, value]) => (
									<div key={key} className='flex items-center space-x-3'>
										<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
										<span className='text-gray-700 capitalize'>
											{key.replace(/([A-Z])/g, " $1").trim()}: {getLocalizedProductField(value)}
										</span>
									</div>
								))}
							</div>
						</motion.div>

						{/* Reviews Section */}
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.9 }}
							className='space-y-2 sm:space-y-3 lg:space-y-4'>
							<h3 className='text-base sm:text-lg font-semibold text-gray-900'>
								Customer Reviews ({totalReviews})
							</h3>
							{reviews.length === 0 ? (
								<p className='text-gray-600 text-sm'>
									No reviews yet. Be the first to leave one!
								</p>
							) : (
								<div className='space-y-3'>
									{reviews.slice(0, 3).map((review, index) => (
										<div key={index} className='bg-gray-50 p-3 rounded-lg'>
											<div className='flex items-center space-x-2 mb-2'>
												<User className='w-4 h-4 text-gray-600' />
												<span className='font-semibold text-gray-800 text-sm'>
													{review.user}
												</span>
												<span className='text-gray-500 text-xs'>
													<Calendar className='w-3 h-3 inline-block mr-1' />
													{new Date(review.createdAt).toLocaleDateString()}
												</span>
											</div>
											<div className='flex items-center space-x-2 mb-2'>
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														className={`w-3 h-3 ${
															i < review.rating
																? "text-yellow-400 fill-current"
																: "text-gray-300"
														}`}
													/>
												))}
												<span className='text-gray-600 text-xs'>
													{review.rating}
												</span>
											</div>
											<p className='text-gray-700 text-sm leading-relaxed'>
												{review.comment}
											</p>
										</div>
									))}
									{reviews.length > 3 && (
										<p className='text-center text-sm text-gray-600'>
											Showing 3 of {reviews.length} reviews
										</p>
									)}
								</div>
							)}

							{/* Add Review Form */}
							<div className='pt-4 border-t border-gray-200'>
								<h4 className='text-base font-semibold text-gray-900 mb-3'>
									Leave a Review
								</h4>
								
								{/* User Name Input */}
								<div className='mb-3'>
									<label htmlFor="review-user" className="block text-sm font-medium text-gray-700 mb-1">
										Your Name *
									</label>
									<input
										id="review-user"
										name="review-user"
										type='text'
										placeholder='Your Name'
										value={newReview.user}
										onChange={(e) =>
											setNewReview({ ...newReview, user: e.target.value })
										}
										className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm'
										required
										aria-required="true"
									/>
								</div>
								
								{/* Rating Selection */}
								<div className='mb-3'>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Rating *
									</label>
									<div className='flex items-center space-x-2' role="radiogroup" aria-labelledby="rating-label">
										{[...Array(5)].map((_, i) => (
											<button
												key={i}
												type="button"
												onClick={() =>
													setNewReview({ ...newReview, rating: i + 1 })
												}
												className="focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
												aria-label={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
												title={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
												aria-pressed={newReview.rating === i + 1}
											>
												<Star
													className={`w-5 h-5 cursor-pointer ${
														newReview.rating > i
															? "text-yellow-400 fill-current"
															: "text-gray-300"
													}`}
												/>
											</button>
										))}
									</div>
								</div>
								
								{/* Comment Input */}
								<div className='mb-3'>
									<label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-1">
										Review Comment *
									</label>
									<textarea
										id="review-comment"
										name="review-comment"
										rows={3}
										className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm'
										placeholder='Write your review here...'
										value={newReview.comment}
										onChange={(e) =>
											setNewReview({ ...newReview, comment: e.target.value })
										}
										required
										aria-required="true"
									/>
								</div>
								
								<button
									type="button"
									onClick={handleAddReview}
									className='mt-3 inline-flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-sm holographic-card'
									aria-label="Submit review"
									title="Submit review"
								>
									<Plus className='w-4 h-4' />
									<span>Submit Review</span>
								</button>
							</div>
						</motion.div>

						{/* Action Buttons */}
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.0 }}
							className='space-y-3 sm:space-y-4'>
							<button
								type="button"
								onClick={handleContactSales}
								disabled={!product.inStock}
								className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
									product.inStock
										? "bg-teal-600 text-white hover:bg-teal-700"
										: "bg-gray-400 text-gray-200 cursor-not-allowed"
								}`}
								aria-label={product.inStock ? "Contact sales" : "Out of stock"}
								title={product.inStock ? "Contact sales" : "Out of stock"}
							>
								<ShoppingCart className='w-4 h-4 sm:w-5 sm:h-5' />
								<span>{product.inStock ? "Contact Sales" : "Out of Stock"}</span>
							</button>
						</motion.div>

						{/* Additional Info */}
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.1 }}
							className='pt-4 sm:pt-6 lg:pt-8 border-t border-gray-200 space-y-3 sm:space-y-4 lg:space-y-6'>
							<h3 className='text-base sm:text-lg font-semibold text-gray-900'>
								Additional Information
							</h3>

							<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
								<div className='text-center'>
									<div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3'>
										<Truck className='w-6 h-6 text-orange-600' />
									</div>
									<h4 className='font-semibold text-gray-900 mb-1'>Shipping</h4>
									<p className='text-sm text-gray-600'>{getLocalizedProductField(product.shipping)}</p>
								</div>

								<div className='text-center'>
									<div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3'>
										<Shield className='w-6 h-6 text-blue-600' />
									</div>
									<h4 className='font-semibold text-gray-900 mb-1'>Warranty</h4>
									<p className='text-sm text-gray-600'>{getLocalizedProductField(product.warranty)}</p>
								</div>

								<div className='text-center'>
									<div className='w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3'>
										<RotateCcw className='w-6 h-6 text-emerald-600' />
									</div>
									<h4 className='font-semibold text-gray-900 mb-1'>
										Certifications
									</h4>
									<p className='text-sm text-gray-600'>
										{product.certifications.join(", ")}
									</p>
								</div>
							</div>
						</motion.div>
					</motion.div>
				</div>

				{/* Related Products Section */}
				{relatedProducts.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 1.2 }}
						className='mt-8 sm:mt-12 lg:mt-16 xl:mt-20'>
						<div className='text-center mb-6 sm:mb-8 lg:mb-12'>
							<h2 className='text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-2 sm:mb-3 lg:mb-4'>
								Related
								<span className='block font-semibold text-teal-600 mt-1'>
									Products
								</span>
							</h2>
							<p className='text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4'>
								Explore more medical equipment from our comprehensive collection
							</p>
						</div>

						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6'>
							{relatedProducts.map((relatedProduct) => (
								<motion.div
									key={relatedProduct._id}
									whileHover={{ y: -5 }}
									className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer'
									onClick={() => navigate(`/product/${relatedProduct._id}`)}>
									<div className='relative overflow-hidden rounded-t-xl'>
										<img
											src={relatedProduct.image}
											alt={`${getLocalizedProductField(relatedProduct.name)} - Related medical equipment`}
											className='w-full h-32 sm:h-40 lg:h-48 object-cover transition-transform duration-300 hover:scale-105'
											loading="lazy"
											onError={(e) => {
												e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
											}}
										/>
										<div className='absolute top-2 left-2'>
											<span className='inline-flex items-center space-x-1 bg-white/95 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-lg text-xs font-medium'>
												<Zap className='w-3 h-3 text-teal-600' />
												<span className='hidden sm:inline'>
													{getLocalizedText(getSubcategoryName(relatedProduct.subcategory))}
												</span>
												<span className='sm:hidden'>
													{getSubcategoryDisplayText(relatedProduct.subcategory)}
												</span>
											</span>
										</div>
									</div>
									<div className='p-2.5 sm:p-3 lg:p-4'>
										<h3 className='font-semibold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 text-sm sm:text-base'>
											{getLocalizedProductField(relatedProduct.name)}
										</h3>
										<div className='flex items-center justify-between'>
											<span className='text-teal-600 font-bold text-sm sm:text-base'>
												${relatedProduct.price.toLocaleString()}
											</span>
											<div className='flex items-center space-x-1'>
												<Star className='w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current' />
												<span className='text-xs sm:text-sm text-gray-600'>
													{relatedProduct.averageRating?.toFixed(1) || '0.0'}
												</span>
											</div>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}

				{/* Image Modal */}
				{isImageModalOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
						onClick={closeImageModal}
					>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.8, opacity: 0 }}
							className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Close Button */}
							<button
								onClick={closeImageModal}
								className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>

							{/* Navigation Arrows - Outside Image */}
							{product && product.images && product.images.length > 1 && (
								<>
									<button
										onClick={(e) => {
											e.stopPropagation();
											const currentIndex = product.images.indexOf(selectedModalImage);
											const prevIndex = currentIndex > 0 ? currentIndex - 1 : product.images.length - 1;
											setSelectedModalImage(product.images[prevIndex]);
										}}
										className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-colors z-10"
									>
										<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
										</svg>
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											const currentIndex = product.images.indexOf(selectedModalImage);
											const nextIndex = currentIndex < product.images.length - 1 ? currentIndex + 1 : 0;
											setSelectedModalImage(product.images[nextIndex]);
										}}
										className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-colors z-10"
									>
										<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
										</svg>
									</button>
								</>
							)}

							{/* Image Container */}
							<div className="flex-1 flex items-center justify-center px-20" style={{ width: 'calc(100% - 160px)' }}>
								<img
									src={selectedModalImage}
									alt={getLocalizedProductField(product?.name)}
									className="max-w-full max-h-full object-contain rounded-lg"
									style={{ 
										maxWidth: '80%', 
										maxHeight: '80%',
										minWidth: '60%',
										minHeight: '60%'
									}}
									onError={(e) => {
										e.currentTarget.src =
											"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
									}}
								/>
							</div>

							{/* Bottom Navigation - Outside Image */}
							{product && product.images && product.images.length > 1 && (
								<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-4 pointer-events-none">
									{/* Thumbnail Navigation */}
									<div className="flex space-x-3 pointer-events-auto">
										{product.images.map((image, index) => (
											<button
												key={index}
												onClick={(e) => {
													e.stopPropagation();
													setSelectedModalImage(image);
												}}
												className={`w-4 h-4 rounded-full transition-colors ${
													selectedModalImage === image
														? "bg-white"
														: "bg-white/50 hover:bg-white/70"
												}`}
											/>
										))}
									</div>

									{/* Image Counter */}
									<div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm whitespace-nowrap pointer-events-auto w-16 text-center">
										{product.images.indexOf(selectedModalImage) + 1} / {product.images.length}
									</div>
								</div>
							)}
						</motion.div>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default ProductDetail;
