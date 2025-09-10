/** @format */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowRight, Zap } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { getFavorites, toggleFavorite } from "../utils/favorites";
import { useLanguage } from "../contexts/LanguageContext";
import Footer from "../components/layout/Footer";

const Favorites: React.FC = () => {
	const navigate = useNavigate();
	const { currentLanguage } = useLanguage();
	const [favoriteIds, setFavoriteIds] = useState<string[]>(getFavorites());

	// Use the same hook as ProductsPage for consistency
	const { data: apiProducts = [], isLoading: loading, error } = useProducts();

	// Helper: get localized text from string or {en, ar}
	const getLocalizedProductField = useCallback((value: string | { en?: string; ar?: string } | null | undefined): string => {
		if (!value) return "";
		if (typeof value === "string") return value;
		if (typeof value === "object") {
			return (
				value[currentLanguage as "en" | "ar"] || value.en || value.ar || ""
			);
		}
		return "";
	}, [currentLanguage]);

	// Transform API products to display format using useMemo for performance
	const products = useMemo(
		() =>
			apiProducts.map((product) => ({
				_id: product._id,
				name: getLocalizedProductField(product.name),
				description: getLocalizedProductField(product.description),
				longDescription: getLocalizedProductField(product.longDescription),
				image: product.image,
				images: product.images,
				category:
					typeof product.subcategory === "string"
						? product.subcategory
						: getLocalizedProductField(product.subcategory?.name),
				price: product.price,
				rating: product.averageRating || 0,
				reviews: product.reviews || [],
				features: (product.features || []).map((f) =>
					getLocalizedProductField(f)
				),
				specifications: product.specifications,
				inStock: product.inStock,
				stockQuantity: product.stockQuantity,
				shipping: getLocalizedProductField(product.shipping),
				warranty: getLocalizedProductField(product.warranty),
				certifications: product.certifications,
			})),
		[apiProducts, getLocalizedProductField]
	);

	// Update favorites when localStorage changes (e.g., from other pages)
	useEffect(() => {
		const handleStorageChange = () => {
			setFavoriteIds(getFavorites());
		};

		// Listen for storage events (changes from other tabs/windows)
		window.addEventListener("storage", handleStorageChange);

		// Also check for changes when the page gains focus
		window.addEventListener("focus", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("focus", handleStorageChange);
		};
	}, []);

	const handleToggleFavorite = (id: string) => {
		const next = toggleFavorite(id);
		setFavoriteIds(next);
	};

	// Filter products to show only favorites using useMemo for performance
	const favoriteProducts = useMemo(
		() => products.filter((product) => favoriteIds.includes(product._id)),
		[products, favoriteIds]
	);

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(price);
	};

	// Error state
	if (error) {
		return (
			<div className='min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
					<div className='text-center py-20'>
						<div className='text-red-500 mb-4'>
							<Heart className='w-16 h-16 mx-auto mb-4' />
						</div>
						<h3 className='text-2xl font-semibold text-gray-900 mb-2'>
							Error loading products
						</h3>
						<p className='text-gray-600 mb-6'>
							Failed to load your favorite products. Please try again.
						</p>
						<button
							onClick={() => window.location.reload()}
							className='bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors'>
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Loading state
	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
					<div className='text-center py-20'>
						<div className='animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4'></div>
						<p className='text-gray-600'>Loading favorites...</p>
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className='min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
					<div className='text-center py-20'>
						<div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
							<Zap className='w-8 h-8 text-red-600' />
						</div>
						<h3 className='text-xl font-semibold text-gray-900 mb-2'>
							Error Loading Products
						</h3>
						<p className='text-gray-600 mb-4'>{error}</p>
						<button
							onClick={() => window.location.reload()}
							className='bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors'>
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='text-center mb-12'>
					<div className='inline-flex items-center space-x-3 bg-red-50 px-6 py-3 rounded-full border border-red-200 mb-6'>
						<Heart className='w-8 h-8 text-red-500' />
						<h1 className='text-4xl sm:text-5xl font-bold text-gray-900'>
							My Favorites
						</h1>
					</div>
					<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
						Your saved medical equipment favorites for easy access and
						comparison.
					</p>
				</motion.div>

				{/* Favorites Content */}
				{favoriteProducts.length === 0 ? (
					<div className='text-center py-20'>
						<Heart className='w-12 h-12 text-teal-600 mx-auto mb-4' />
						<h3 className='text-2xl font-semibold text-gray-900 mb-2'>
							No favorites yet
						</h3>
						<p className='text-gray-600 mb-6'>
							Browse products and tap the heart to save them here.
						</p>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => navigate("/products")}
							className='inline-flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors'>
							<span>Browse Products</span>
							<ArrowRight className='w-5 h-5' />
						</motion.button>
					</div>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						<AnimatePresence>
							{favoriteProducts.map((p) => (
								<motion.div
									key={p._id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100'>
									<div className='relative'>
										<img
											src={p.image}
											alt={p.name}
											className='w-full h-48 object-cover'
										/>
										<button
											onClick={() => handleToggleFavorite(p._id)}
											className={`absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full p-2.5 transition-all duration-300 shadow-lg ${
												favoriteIds.includes(p._id)
													? "hover:bg-red-100 text-red-500"
													: "hover:bg-red-50 text-gray-600"
											}`}>
											<Heart
												className={`h-4 w-4 ${
													favoriteIds.includes(p._id)
														? "fill-red-500 text-red-500"
														: ""
												}`}
											/>
										</button>
									</div>
									<div className='p-4'>
										<h3 className='text-lg font-semibold text-gray-900 mb-1'>
											{p.name}
										</h3>
										<p className='text-gray-600 text-sm line-clamp-2 mb-3'>
											{p.description}
										</p>
										<div className='flex items-center justify-between'>
											<span className='text-teal-600 font-bold'>
												{formatPrice(p.price)}
											</span>
											<motion.button
												whileHover={{ scale: 1.03 }}
												whileTap={{ scale: 0.97 }}
												onClick={() => navigate(`/product/${p._id}`)}
												className='inline-flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors'>
												<span>Details</span>
												<ArrowRight className='w-4 h-4' />
											</motion.button>
										</div>
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
};

export default Favorites;
