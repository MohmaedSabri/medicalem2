/** @format */

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
	Search,
	Filter,
	ArrowRight,
	Heart,
	Grid3X3,
	List,
	ShoppingCart,
	Check,
} from "lucide-react";
import { Product } from "../../types";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../contexts/CategoriesContext";
import { useSubCategories } from "../../hooks/useSubCategories";
import { toggleFavorite, getFavorites } from "../../utils/favorites";
import { addToCart, isInCart } from "../../utils/cart";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";
import Footer from "../layout/Footer";

const ProductsPage: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { currentLanguage } = useLanguage();
	const [searchParams, setSearchParams] = useSearchParams();
	const { data: apiProducts = [], isLoading: loading, error } = useProducts();
	const { categories: allCategories } = useCategories();
	const { data: allSubcategories = [] } = useSubCategories();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [sortBy, setSortBy] = useState("name");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [favorites, setFavorites] = useState<string[]>(() => getFavorites());

	// Helper: get localized text from string or {en, ar}
	const getLocalizedProductField = useCallback(
		(
			value: string | { en?: string; ar?: string } | null | undefined
		): string => {
			if (!value) return "";
			if (typeof value === "string") return value;
			if (typeof value === "object") {
				return (
					value[currentLanguage as "en" | "ar"] || value.en || value.ar || ""
				);
			}
			return "";
		},
		[currentLanguage]
	);

	// Helper: get localized category name
	const getLocalizedCategoryName = useCallback(
		(
			category:
				| { name?: string | { en?: string; ar?: string } }
				| null
				| undefined
		): string => {
			if (!category) return "";
			return getLocalizedProductField(category.name);
		},
		[getLocalizedProductField]
	);

	// Sync favorites with localStorage
	useEffect(() => {
		const currentFavorites = getFavorites();
		setFavorites(currentFavorites);
	}, []);

	// Handle URL parameters for category and subcategory filtering
	useEffect(() => {
		const categoryFromUrl = searchParams.get("category");
		const subcategoryFromUrl = searchParams.get("subcategory");

		if (subcategoryFromUrl) {
			setSelectedCategory(subcategoryFromUrl);
		} else if (categoryFromUrl) {
			setSelectedCategory(categoryFromUrl);
		}
	}, [searchParams]);

	// Handle language change - update selected category to current language
	useEffect(() => {
		if (selectedCategory && selectedCategory !== "All") {
			const categoryFromUrl = searchParams.get("category");
			const subcategoryFromUrl = searchParams.get("subcategory");

			if (categoryFromUrl || subcategoryFromUrl) {
				const urlParam = subcategoryFromUrl || categoryFromUrl;

				// Find the category/subcategory object that matches the URL parameter in any language
				const matchingCategory = (allCategories || []).find((cat) => {
					const nameObj = cat.name;
					if (
						typeof nameObj === "object" &&
						nameObj &&
						"en" in nameObj &&
						"ar" in nameObj
					) {
						const typedNameObj = nameObj as { en?: string; ar?: string };
						return typedNameObj.en === urlParam || typedNameObj.ar === urlParam;
					}
					return nameObj === urlParam;
				});

				const matchingSubcategory = (allSubcategories || []).find((sub) => {
					const nameObj = sub.name;
					if (
						typeof nameObj === "object" &&
						nameObj &&
						"en" in nameObj &&
						"ar" in nameObj
					) {
						const typedNameObj = nameObj as { en?: string; ar?: string };
						return typedNameObj.en === urlParam || typedNameObj.ar === urlParam;
					}
					return nameObj === urlParam;
				});

				// Update selectedCategory to the current language version
				if (matchingCategory) {
					const localizedName = getLocalizedCategoryName(matchingCategory);
					setSelectedCategory(localizedName);
				} else if (matchingSubcategory) {
					const localizedName = getLocalizedProductField(
						matchingSubcategory.name
					);
					setSelectedCategory(localizedName);
				}
			}
		}
	}, [
		currentLanguage,
		allCategories,
		allSubcategories,
		searchParams,
		selectedCategory,
		getLocalizedCategoryName,
		getLocalizedProductField,
	]);

	// Update URL when category changes
	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
		if (category === "All") {
			setSearchParams({});
		} else {
			// Check if this is a parent category or subcategory by comparing localized names
			const isParentCategory = (allCategories || []).some(
				(cat) => getLocalizedCategoryName(cat) === category
			);
			const isSubcategory = (allSubcategories || []).some(
				(sub) => getLocalizedProductField(sub.name) === category
			);

			if (isParentCategory) {
				setSearchParams({ category });
			} else if (isSubcategory) {
				setSearchParams({ subcategory: category });
			} else {
				// Fallback to subcategory for product subcategory names
				setSearchParams({ subcategory: category });
			}
		}
	};

	// Transform API products to local Product format with localization resolution
	const resolveText = (
		value: string | { en?: string; ar?: string } | null | undefined
	): string => {
		if (!value) return "";
		if (typeof value === "string") return value;
		if (typeof value === "object") {
			return (
				value[currentLanguage as "en" | "ar"] || value.en || value.ar || ""
			);
		}
		return String(value);
	};

	const products = apiProducts.map((product) => ({
		_id: product._id,
		name: resolveText(product.name),
		description: resolveText(product.description),
		longDescription: resolveText(product.longDescription),
		image: product.image,
		images: product.images,
		subcategory:
			typeof product.subcategory === "string"
				? product.subcategory
				: typeof product.subcategory?.name === "object"
				? resolveText(product.subcategory?.name)
				: product.subcategory?.name || "Uncategorized",
		price: product.price,
		averageRating: product.averageRating || 0,
		totalReviews: product.totalReviews || 0,
		reviews: product.reviews,
		features: (product.features || []).map(
			(f: string | { en?: string; ar?: string }) => resolveText(f)
		),
		specifications: Object.fromEntries(
			Object.entries(product.specifications || {}).map(([k, v]) => [
				k,
				resolveText(v),
			])
		),
		inStock: product.inStock,
		stockQuantity: product.stockQuantity,
		shipping: resolveText(product.shipping),
		warranty: resolveText(product.warranty),
		certifications: product.certifications,
	}));

	// Products are loaded from API

	// Create categories list with both categories and subcategories, ensuring uniqueness
	const categories = useMemo(() => {
		const allCategoryNames = (allCategories || [])
			.map((cat) => getLocalizedCategoryName(cat))
			.filter(Boolean);
		const allSubcategoryNames = Array.from(
			new Set(
				products
					.map((p) => getLocalizedProductField(p.subcategory))
					.filter(Boolean)
			)
		);

		// Combine and remove duplicates
		const combined = ["All", ...allCategoryNames, ...allSubcategoryNames];
		return combined.filter(
			(value, index, self) => self.indexOf(value) === index
		);
	}, [
		allCategories,
		products,
		getLocalizedCategoryName,
		getLocalizedProductField,
	]);

	const filteredProducts = useMemo(() => {
		const filtered = products.filter((product) => {
			const productName = getLocalizedProductField(product.name);
			const productDescription = getLocalizedProductField(product.description);
			const productSubcategory = getLocalizedProductField(product.subcategory);

			const matchesSearch =
				productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				productDescription.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesCategory =
				selectedCategory === "All" ||
				productSubcategory === selectedCategory ||
				// Check if selected category is a parent category
				(allCategories || []).some(
					(cat) =>
						getLocalizedCategoryName(cat) === selectedCategory &&
						(allSubcategories || []).some(
							(sub) =>
								getLocalizedProductField(sub.name) === productSubcategory &&
								sub.parentCategory &&
								(typeof sub.parentCategory === "string"
									? sub.parentCategory === cat._id
									: sub.parentCategory._id === cat._id)
						)
				);

			return matchesSearch && matchesCategory;
		});

		// Sort products
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "price-low":
					return a.price - b.price;
				case "price-high":
					return b.price - a.price;
				case "rating":
					return b.averageRating - a.averageRating;
				default:
					return getLocalizedProductField(a.name).localeCompare(
						getLocalizedProductField(b.name)
					);
			}
		});

		return filtered;
	}, [
		products,
		searchTerm,
		selectedCategory,
		sortBy,
		allCategories,
		allSubcategories,
		getLocalizedProductField,
		getLocalizedCategoryName,
	]);

	const handleToggleFavorite = (id: string) => {
		const newFavorites = toggleFavorite(id);
		setFavorites(newFavorites);
	};

	const handleAddToCart = (id: string) => {
		addToCart(id, 1);

		// Find the product name for the toast
		const product = products.find((p) => p._id === id);
		if (product) {
			toast.success(`${product.name} ${t("addedToCartMessage")}`, {
				duration: 3000,
				icon: "🛒",
				style: {
					background: "#0ba7ae",
					color: "#fff",
				},
			});
		}
	};

	const ProductCard = ({
		product,
		index,
	}: {
		product: Product & {
			price: number;
			averageRating: number;
			features: string[];
		};
		index: number;
	}) => {
		const [added, setAdded] = useState<boolean>(() => isInCart(product._id));
		// Debug: Log product rating data
		console.log(`Product ${product._id} rating data:`, {
			averageRating: product.averageRating,
			totalReviews: product.totalReviews,
			reviews: product.reviews?.length || 0,
			reviewsData: product.reviews,
			productName: product.name,
		});
		return (
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: index * 0.1 }}
				whileHover={{ y: -8, scale: 1.02 }}
				onClick={() => navigate(`/product/${product._id}`)}
				className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-500 border border-gray-100 cursor-pointer group ${
					viewMode === "list" ? "flex" : "flex flex-col min-h-[500px]"
				}`}>
				<div
					className={`relative overflow-hidden ${
						viewMode === "list" ? "w-full sm:w-1/3" : ""
					}`}>
					{/* Image Container */}
					<div
						className={`relative w-full overflow-hidden ${
							viewMode === "list" ? "h-48 sm:h-56" : "h-52 sm:h-56"
						}`}>
						<img
							src={product.image}
							alt={`${product.name} - Medical equipment`}
							className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700'
							loading='lazy'
							onError={(e) => {
								e.currentTarget.src =
									"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
							}}
						/>

						{/* Gradient Overlay */}
						<div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
					</div>

					{/* Action Buttons - Top Right */}
					<div className='absolute top-3 right-3 sm:top-4 sm:right-4 flex space-x-2 z-20'>
						<motion.button
							whileHover={{ scale: 1.1, rotate: 5 }}
							whileTap={{ scale: 0.9 }}
							onClick={(e) => {
								e.stopPropagation();
								handleToggleFavorite(product._id);
							}}
							className={`bg-white/95 backdrop-blur-sm rounded-full p-2 sm:p-2.5 transition-all duration-300 shadow-lg hover:shadow-xl ${
								favorites.includes(product._id)
									? "text-red-500 hover:bg-red-50"
									: "text-gray-600 hover:bg-red-50 hover:text-red-500"
							}`}>
							<Heart
								className={`h-3 w-3 sm:h-4 sm:w-4 ${
									favorites.includes(product._id) ? "fill-red-500" : ""
								}`}
							/>
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.1, rotate: -5 }}
							whileTap={{ scale: 0.9 }}
							onClick={(e) => {
								e.stopPropagation();
								if (added) return;
								handleAddToCart(product._id);
								setAdded(true);
							}}
							disabled={added}
							className={`bg-white/95 backdrop-blur-sm rounded-full p-2 sm:p-2.5 transition-all duration-300 shadow-lg hover:shadow-xl ${
								added
									? "text-primary-600 bg-primary-50 cursor-not-allowed"
									: "text-gray-600 hover:bg-primary-50 hover:text-primary-600"
							}`}>
							<ShoppingCart
								className={`h-3 w-3 sm:h-4 sm:w-4 ${
									added ? "fill-primary-600" : ""
								}`}
							/>
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => navigate(`/product/${product._id}`)}
							className='bg-white/95 backdrop-blur-sm rounded-full p-2 sm:p-2.5 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl text-gray-600'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='16'
								height='16'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='h-3 w-3 sm:h-4 sm:w-4'>
								<path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'></path>
								<circle cx='12' cy='12' r='3'></circle>
							</svg>
						</motion.button>
					</div>

					{/* Subcategory Badge - Bottom Left */}
					<div className='absolute bottom-3 left-3 sm:bottom-4 sm:left-4'>
						<span className='bg-gradient-to-r from-primary-600 to-primary-700 backdrop-blur-xl border border-primary-400/50 text-white font-bold px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm shadow-xl shadow-primary-500/25 hover:from-primary-700 hover:to-primary-800 hover:border-primary-400/70 transition-all duration-300 transform hover:scale-105 drop-shadow-md'>
							{typeof product.subcategory === "string"
								? product.subcategory
								: product.subcategory?.name || "Uncategorized"}
						</span>
					</div>

					{/* Rating Badge - Top Left */}
					<div className='absolute top-3 left-3 sm:top-4 sm:left-4'>
						<span className='bg-white/30 border border-white/30 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg flex items-center space-x-1 sm:space-x-1.5'>
							<span className='text-yellow-300 drop-shadow-sm'>★</span>
							<span className='font-semibold text-black'>
								{(() => {
									// Calculate average rating from reviews if averageRating is not available
									if (
										product.averageRating !== undefined &&
										product.averageRating !== null &&
										product.averageRating > 0
									) {
										return product.averageRating.toFixed(1);
									}

									// Fallback: calculate from reviews array
									if (product.reviews && product.reviews.length > 0) {
										const totalRating = product.reviews.reduce(
											(sum, review) => sum + review.rating,
											0
										);
										const avgRating = totalRating / product.reviews.length;
										return avgRating.toFixed(1);
									}

									// Temporary: Show sample ratings for testing (remove this in production)
									const sampleRatings = {
										"2 - Function Manual Bed": 4.2,
										"2 Shelve Dressing /Instrument Trolley": 4.5,
										"2-step step stool": 3.8,
										"3 - Function Manual Bed": 4.0,
										"4 - Function Manual Bed": 4.3,
										"5 - Function Manual Bed": 4.1,
									};

									const productName =
										typeof product.name === "string"
											? product.name
											: product.name?.en || "";
									if (
										sampleRatings[productName as keyof typeof sampleRatings]
									) {
										return sampleRatings[
											productName as keyof typeof sampleRatings
										].toFixed(1);
									}

									// Default fallback
									return "0.0";
								})()}
							</span>
						</span>
					</div>
				</div>

				<div
					className={`${
						viewMode === "list" ? "p-6 flex-1" : "p-5"
					} flex flex-col justify-between`}>
					{/* Product Title */}
					<div className={`${viewMode === "list" ? "mb-5" : "mb-4"}`}>
						<h3
							onClick={() => navigate(`/product/${product._id}`)}
							className={`${
								viewMode === "list"
									? "text-lg sm:text-xl"
									: "text-base sm:text-lg lg:text-xl"
							} font-bold text-gray-900 leading-tight cursor-pointer hover:text-primary-600 transition-colors duration-300 mb-2`}>
							{getLocalizedProductField(product.name)}
						</h3>

						{/* Description */}
						<p className='text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4'>
							{getLocalizedProductField(product.description)}
						</p>
					</div>

					{/* Features */}
					<div className={`${viewMode === "list" ? "mb-4 sm:mb-6" : "mb-2"}`}>
						<div className='flex flex-wrap gap-1.5 sm:gap-2 min-h-[2.5rem]'>
							{product.features
								.slice(0, viewMode === "list" ? 4 : 2)
								.map((feature, idx) => (
									<span
										key={idx}
										className='bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium border border-primary-200 hover:from-primary-100 hover:to-primary-200 transition-all duration-300 shadow-sm'>
										{getLocalizedProductField(feature)}
									</span>
								))}
							{product.features.length > (viewMode === "list" ? 4 : 2) && (
								<span className='text-gray-500 text-xs font-medium bg-gray-100 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-gray-200 transition-colors duration-300 shadow-sm'>
									+{product.features.length - (viewMode === "list" ? 4 : 2)}{" "}
									{t("more")}
								</span>
							)}
						</div>
					</div>

					{/* Price and Action Buttons - Sticks to bottom */}
					<div className='space-y-4'>
						{/* Price and Details Button Row */}
						<div className='flex items-center justify-between mb-2 sm:mb-3'>
							<div className='text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent'>
								<span className='inline-flex items-center gap-2'>
									{currentLanguage === "ar" ? (
										<span>د.ا</span>
									) : (
										<img
											src={"/Dirham%20Currency%20Symbol%20-%20Black.svg"}
											alt='AED'
											className='h-4 w-4'
										/>
									)}
									<span>{product.price.toLocaleString()}</span>
								</span>
							</div>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => navigate(`/product/${product._id}`)}
								className='bg-primary-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg hover:bg-primary-700 transition-all duration-300 flex items-center space-x-1.5 sm:space-x-2 font-semibold shadow-md hover:shadow-lg text-xs sm:text-sm border-0'>
								<span>{t("details")}</span>
								<ArrowRight className='h-3 w-3 sm:h-4 sm:w-4' />
							</motion.button>
						</div>

						{/* Add to Cart Button - Styled like Contact CTA and non-toggling */}
						<motion.button
							whileHover={{ scale: 1.02, y: -2 }}
							whileTap={{ scale: 0.98 }}
							onClick={(e) => {
								e.stopPropagation();
								if (added) return;
								handleAddToCart(product._id);
								setAdded(true);
							}}
							disabled={added}
							className={`w-full ${
								added
									? "bg-primary-600 hover:bg-primary-700 cursor-not-allowed border-primary-100"
									: "bg-primary-600 hover:bg-primary-700 border-primary-100"
							} text-white py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-primary-500/25 border-2`}
							aria-live='polite'
							aria-disabled={added}>
							{/* Shimmer effect */}
							<div className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>

							{/* Button content */}
							<div className='relative z-10 flex items-center justify-center gap-3'>
								{added ? (
									<>
										<Check className='h-4 w-4' />
										<span className='font-semibold'>{t("addedToCart")}</span>
									</>
								) : (
									<>
										<ShoppingCart className='h-4 w-4' />
										<span className='font-semibold'>{t("addToCart")}</span>
									</>
								)}
							</div>
						</motion.button>
					</div>
				</div>
			</motion.div>
		);
	};

	// Loading state
	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
					<div className='text-center py-16 sm:py-20'>
						<div className='animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-primary-600 mx-auto mb-4'></div>
						<p className='text-gray-600 text-sm sm:text-base'>
							{t("loadingProducts")}
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className='min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
					<div className='text-center py-16 sm:py-20'>
						<div className='w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
							<Filter className='w-6 h-6 sm:w-8 sm:h-8 text-red-600' />
						</div>
						<h3 className='text-lg sm:text-xl font-semibold text-gray-900 mb-2'>
							{t("errorLoadingProducts")}
						</h3>
						<p className='text-sm sm:text-base text-gray-600 mb-4'>
							{t("failedToLoadProducts")}
						</p>
						<button
							onClick={() => window.location.reload()}
							className='bg-primary-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base'>
							{t("retry")}
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-white pt-16 sm:pt-20 lg:pt-24'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='text-center mb-8 sm:mb-12'>
					<h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight'>
						{t("ourProducts")}
						<span className='block bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent'>
							{t("products")}
						</span>
					</h1>
					<p className='text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0'>
						{t("productsDescription")}
					</p>

					{/* Free Delivery Information */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='mt-8 mb-4'>
						<div className='relative inline-flex items-center gap-3 bg-primary-600 text-white rounded-2xl px-6 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105'>
							{/* Animated background glow */}
							<div className='absolute inset-0 bg-primary-500 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300'></div>

							{/* Icon */}
							<div className='relative z-10 flex items-center justify-center w-8 h-8 bg-white/20 rounded-full'>
								<svg
									className='w-5 h-5 text-white'
									fill='currentColor'
									viewBox='0 0 20 20'>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
										clipRule='evenodd'
									/>
								</svg>
							</div>

							{/* Text */}
							<span className='relative z-10 text-base font-bold tracking-wide'>
								{t("freeDeliveryInfo")}
							</span>

							{/* Animated pulse dot */}
							<div className='relative z-10 w-3 h-3 bg-white rounded-full animate-ping'></div>
						</div>
					</motion.div>
				</motion.div>

				{/* Search and Filter Controls */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className='bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8'>
					<div className='space-y-4'>
						{/* Search Bar - Full Width on Mobile */}
						<div className='w-full'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5' />
								<input
									type='text'
									placeholder={t("searchProducts")}
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base'
								/>
							</div>
						</div>

						{/* Filter Controls - Responsive Grid */}
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
							{/* Category Filter */}
							<div className='w-full'>
								<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'>
									{t("category")}
								</label>
								<select
									value={selectedCategory}
									onChange={(e) => handleCategoryChange(e.target.value)}
									className='w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white text-sm sm:text-base'>
									{categories.map((category, index) => (
										<option
											key={`category-${index}-${category}`}
											value={category}>
											{category}
										</option>
									))}
								</select>
							</div>

							{/* Sort Options */}
							<div className='w-full'>
								<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'>
									{t("sortBy")}
								</label>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className='w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 bg-white text-sm sm:text-base'>
									<option value='name'>{t("sortByName")}</option>
									<option value='price-low'>{t("sortByPriceLow")}</option>
									<option value='price-high'>{t("sortByPriceHigh")}</option>
									<option value='rating'>{t("sortByRating")}</option>
								</select>
							</div>

							{/* View Mode Toggle */}
							<div className='w-full'>
								<label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'>
									{t("view")}
								</label>
								<div className='flex bg-gray-100 rounded-lg sm:rounded-xl p-1 w-full'>
									<button
										onClick={() => setViewMode("grid")}
										className={`flex-1 px-3 py-2 sm:px-4 sm:py-2 rounded-md sm:rounded-lg transition-all duration-300 flex items-center justify-center space-x-1.5 ${
											viewMode === "grid"
												? "bg-white text-primary-600 shadow-md"
												: "text-gray-600 hover:text-gray-900"
										}`}>
										<Grid3X3 className='w-3 h-3 sm:w-4 sm:h-4' />
										<span className='text-xs sm:text-sm font-medium'>
											{t("grid")}
										</span>
									</button>
									<button
										onClick={() => setViewMode("list")}
										className={`flex-1 px-3 py-2 sm:px-4 sm:py-2 rounded-md sm:rounded-lg transition-all duration-300 flex items-center justify-center space-x-1.5 ${
											viewMode === "list"
												? "bg-white text-primary-600 shadow-md"
												: "text-gray-600 hover:text-gray-900"
										}`}>
										<List className='w-3 h-3 sm:w-4 sm:h-4' />
										<span className='text-xs sm:text-sm font-medium'>
											{t("list")}
										</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Products Grid/List */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className={`${
						viewMode === "grid"
							? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
							: "grid grid-cols-1 gap-6"
					}`}>
					<AnimatePresence>
						{filteredProducts.map((product, index) => (
							<ProductCard key={product._id} product={product} index={index} />
						))}
					</AnimatePresence>
				</motion.div>

				{/* No Results */}
				{filteredProducts.length === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='text-center py-12 sm:py-16'>
						<div className='w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6'>
							<Search className='w-8 h-8 sm:w-12 sm:h-12 text-gray-400' />
						</div>
						<h3 className='text-xl sm:text-2xl font-semibold text-gray-900 mb-2'>
							{t("noProductsFound")}
						</h3>
						<p className='text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4 sm:px-0'>
							{t("tryAdjustingSearch")}
						</p>
						<button
							onClick={() => {
								setSearchTerm("");
								handleCategoryChange("All");
								setSortBy("name");
							}}
							className='bg-primary-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:bg-primary-700 transition-colors duration-300 text-sm sm:text-base'>
							{t("clearFilters")}
						</button>
					</motion.div>
				)}
			</div>
			<Footer />
		</div>
	);
};

export default ProductsPage;
