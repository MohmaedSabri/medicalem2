/** @format */

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Filter, ArrowRight, Heart, Grid3X3, List } from "lucide-react";
import { Product } from "../types";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../contexts/CategoriesContext";
import { useSubCategories } from "../hooks/useSubCategories";
import { toggleFavorite, getFavorites } from "../utils/favorites";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

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

	// Update URL when category changes
	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
		if (category === "All") {
			setSearchParams({});
		} else {
			// Check if this is a parent category or subcategory
			const isParentCategory = (allCategories || []).some(cat => cat?.name === category);
			const isSubcategory = (allSubcategories || []).some(sub => sub?.name === category);
			
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
	const resolveText = (value: any): string => {
		if (!value) return '';
		if (typeof value === 'string') return value;
		if (typeof value === 'object') {
			return value[currentLanguage as 'en' | 'ar'] || value.en || value.ar || '';
		}
		return String(value);
	};

	const products = apiProducts.map((product) => ({
		_id: product._id,
		name: product.localized?.name || resolveText(product.name),
		description: product.localized?.description || resolveText(product.description),
		longDescription: product.localized?.longDescription || resolveText(product.longDescription),
		image: product.image,
		images: product.images,
		subcategory:
			typeof product.subcategory === "string"
				? product.subcategory
				: (typeof product.subcategory?.name === 'object' ? resolveText(product.subcategory?.name) : (product.subcategory?.name || "Uncategorized")),
		price: product.price,
		averageRating: product.averageRating || 0,
		totalReviews: product.totalReviews || 0,
		reviews: product.reviews,
		features: (product.localized?.features || product.features || []).map((f: any) => resolveText(f)),
		specifications: Object.fromEntries(Object.entries(product.specifications || {}).map(([k, v]) => [k, resolveText(v)])),
		inStock: product.inStock,
		stockQuantity: product.stockQuantity,
		shipping: product.localized?.shipping || resolveText(product.shipping),
		warranty: product.localized?.warranty || resolveText(product.warranty),
		certifications: product.certifications,
	}));

	// Products are loaded from API

	// Create categories list with both categories and subcategories, ensuring uniqueness
	const categories = useMemo(() => {
		const allCategoryNames = (allCategories || []).map(cat => getLocalizedCategoryName(cat)).filter(Boolean);
		const allSubcategoryNames = Array.from(new Set(products.map((p) => getLocalizedProductField(p.subcategory)).filter(Boolean)));
		
		// Combine and remove duplicates
		const combined = ["All", ...allCategoryNames, ...allSubcategoryNames];
		return combined.filter((value, index, self) => self.indexOf(value) === index);
	}, [allCategories, products, getLocalizedCategoryName, getLocalizedProductField]);

	const filteredProducts = useMemo(() => {
		const filtered = products.filter((product) => {
			const productName = getLocalizedProductField(product.name);
			const productDescription = getLocalizedProductField(product.description);
			const productSubcategory = getLocalizedProductField(product.subcategory);
			
			const matchesSearch =
				productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				productDescription.toLowerCase().includes(searchTerm.toLowerCase());
			
			const matchesCategory = selectedCategory === "All" || 
				productSubcategory === selectedCategory ||
				// Check if selected category is a parent category
				(allCategories || []).some(cat => 
					getLocalizedCategoryName(cat) === selectedCategory && 
					(allSubcategories || []).some(sub => 
						getLocalizedProductField(sub.name) === productSubcategory && 
						(typeof sub.parentCategory === 'string' 
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
					return getLocalizedProductField(a.name).localeCompare(getLocalizedProductField(b.name));
			}
		});

		return filtered;
	}, [products, searchTerm, selectedCategory, sortBy, allCategories, allSubcategories]);

	const handleToggleFavorite = (id: string) => {
		const newFavorites = toggleFavorite(id);
		setFavorites(newFavorites);
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(price);
	};

	const ProductCard = ({
		product,
		index,
	}: {
		product: Product & { price: number; averageRating: number; features: string[] };
		index: number;
	}) => {


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
							loading="lazy"
							onError={(e) => {
								e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1VjY1SDY1VjM1SDM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K";
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
						<span className='bg-gradient-to-r from-teal-600 to-emerald-600 backdrop-blur-xl border border-teal-400/50 text-white font-bold px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm shadow-xl shadow-teal-500/25 hover:from-teal-700 hover:to-emerald-700 hover:border-teal-400/70 transition-all duration-300 transform hover:scale-105 drop-shadow-md'>
							{typeof product.subcategory === 'string' ? product.subcategory : product.subcategory?.name || 'Uncategorized'}
						</span>
					</div>

					{/* Rating Badge - Top Left */}
					<div className='absolute top-3 left-3 sm:top-4 sm:left-4'>
						<span className='bg-white/30 border border-white/30 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg flex items-center space-x-1 sm:space-x-1.5'>
							<span className='text-yellow-300 drop-shadow-sm'>⭐</span>
							<span className='font-semibold text-black'>{(product.averageRating || 0).toFixed(1)}</span>
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
							} font-bold text-gray-900 leading-tight cursor-pointer hover:text-teal-600 transition-colors duration-300 mb-2`}>
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
										className='bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium border border-teal-200 hover:from-teal-100 hover:to-emerald-100 transition-all duration-300 shadow-sm'>
										{getLocalizedProductField(feature)}
									</span>
								))}
							{product.features.length > (viewMode === "list" ? 4 : 2) && (
								<span className='text-gray-500 text-xs font-medium bg-gray-100 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-gray-200 transition-colors duration-300 shadow-sm'>
									+{product.features.length - (viewMode === "list" ? 4 : 2)}{" "}
									{t('more')}
								</span>
							)}
						</div>
					</div>

					{/* Price and Action Buttons - Sticks to bottom */}
					<div className='space-y-4'>
						{/* Price and Details Button Row */}
						<div className='flex items-center justify-between mb-2 sm:mb-3'>
							<div className='text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent'>
								{formatPrice(product.price)}
							</div>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => navigate(`/product/${product._id}`)}
								className='bg-teal-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg hover:bg-teal-700 transition-all duration-300 flex items-center space-x-1.5 sm:space-x-2 font-semibold shadow-md hover:shadow-lg text-xs sm:text-sm border-0'>
								<span>{t('details')}</span>
								<ArrowRight className='h-3 w-3 sm:h-4 sm:w-4' />
							</motion.button>
						</div>

						{/* Add Order Button - Full Width with Enhanced Hover Effect */}
						<motion.button
							whileHover={{ scale: 1.05, y: -2 }}
							whileTap={{ scale: 0.98 }}
							onClick={(e) => {
								e.stopPropagation();
								navigate(`/contact?productId=${product._id}`);
							}}
							className='group relative w-full bg-gray-100 text-gray-700 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg hover:bg-teal-600 hover:text-white transition-all duration-500 flex items-center justify-center space-x-2 sm:space-x-3 font-semibold border border-gray-200 hover:border-teal-600 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-teal-500/25 holographic-card'>
							{/* Button content */}
							<div className='relative z-10 flex items-center justify-center space-x-2 sm:space-x-3 w-full'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='18'
									height='18'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='h-3 w-3 sm:h-4 sm:w-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 flex-shrink-0'>
									<circle cx='8' cy='21' r='1'></circle>
									<circle cx='19' cy='21' r='1'></circle>
									<path d='M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12'></path>
								</svg>
								<span className='font-semibold text-xs sm:text-sm transition-all duration-500 group-hover:tracking-wide flex-shrink-0'>
									{t('contactSales')}
								</span>
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
			<div className='min-h-screen bg-gray-50 pt-16 sm:pt-20'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
					<div className='text-center py-16 sm:py-20'>
						<div className='animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-teal-600 mx-auto mb-4'></div>
						<p className='text-gray-600 text-sm sm:text-base'>
							{t('loadingProducts')}
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className='min-h-screen bg-gray-50 pt-16 sm:pt-20'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
					<div className='text-center py-16 sm:py-20'>
						<div className='w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
							<Filter className='w-6 h-6 sm:w-8 sm:h-8 text-red-600' />
						</div>
						<h3 className='text-lg sm:text-xl font-semibold text-gray-900 mb-2'>
							{t('errorLoadingProducts')}
						</h3>
						<p className='text-sm sm:text-base text-gray-600 mb-4'>
							{t('failedToLoadProducts')}
						</p>
						<button
							onClick={() => window.location.reload()}
							className='bg-teal-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-teal-700 transition-colors text-sm sm:text-base'>
							{t('retry')}
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-white pt-16 sm:pt-20'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='text-center mb-8 sm:mb-12'>
					<h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight'>
						{t('ourProducts')}
						<span className='block bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent'>
							{t('products')}
						</span>
					</h1>
					<p className='text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0'>
						{t('productsDescription')}
					</p>
				</motion.div>

				{/* Search and Filter Controls */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className='bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8'>
					<div className='flex flex-col lg:flex-row gap-4 items-center justify-between'>
						{/* Search Bar */}
						<div className='flex-1 w-full lg:w-auto'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5' />
								<input
									type='text'
									placeholder={t('searchProducts')}
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base'
								/>
							</div>
						</div>

						{/* Category Filter and Controls */}
						<div className='flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full lg:w-auto'>
							{/* Category Filter */}
							<select
								value={selectedCategory}
								onChange={(e) => handleCategoryChange(e.target.value)}
								className='w-full sm:w-auto px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white text-sm sm:text-base'>
								{categories.map((category, index) => (
									<option key={`category-${index}-${category}`} value={category}>
										{category}
									</option>
								))}
							</select>

							{/* Sort Options */}
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className='w-full sm:w-auto px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white text-sm sm:text-base'>
								<option value='name'>{t('sortByName')}</option>
								<option value='price-low'>{t('sortByPriceLow')}</option>
								<option value='price-high'>{t('sortByPriceHigh')}</option>
								<option value='rating'>{t('sortByRating')}</option>
							</select>

							{/* View Mode Toggle */}
							<div className='flex bg-gray-100 rounded-lg sm:rounded-xl p-1'>
								<button
									onClick={() => setViewMode("grid")}
									className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md sm:rounded-lg transition-all duration-300 flex items-center space-x-1.5 ${
										viewMode === "grid"
											? "bg-white text-teal-600 shadow-md"
											: "text-gray-600 hover:text-gray-900"
									}`}>
									<Grid3X3 className='w-3 h-3 sm:w-4 sm:h-4' />
									<span className='text-xs sm:text-sm font-medium'>{t('grid')}</span>
								</button>
								<button
									onClick={() => setViewMode("list")}
									className={`px-3 py-2 hidden md:flex sm:px-4 sm:py-2 rounded-md sm:rounded-lg transition-all duration-300 flex items-center space-x-1.5 ${
										viewMode === "list"
											? "bg-white text-teal-600 shadow-md"
											: "text-gray-600 hover:text-gray-900"
									}`}>
									<List className='w-3 h-3 sm:w-4 sm:h-4' />
									<span className='text-xs sm:text-sm font-medium'>{t('list')}</span>
								</button>
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
							{t('noProductsFound')}
						</h3>
						<p className='text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4 sm:px-0'>
							{t('tryAdjustingSearch')}
						</p>
						<button
							onClick={() => {
								setSearchTerm("");
								handleCategoryChange("All");
								setSortBy("name");
							}}
							className='bg-teal-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:bg-teal-700 transition-colors duration-300 text-sm sm:text-base'>
							{t('clearFilters')}
						</button>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default ProductsPage;
