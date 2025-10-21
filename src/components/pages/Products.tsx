/** @format */

import React from "react";
import { ArrowRight, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../contexts/ProductsContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";

const Products: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { isRTL, currentLanguage } = useLanguage();
	const { products, loading } = useProducts();

	// Function to detect if text is Arabic
	const isArabicText = (text: string): boolean => {
		const arabicRegex =
			/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
		return arabicRegex.test(text);
	};

	// Helper: get localized text from string or {en, ar}
	const getLocalizedText = (
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
	};

	// Get first 3 products for the grid layout
	const displayProducts = products.slice(0, 3);

	// Loading state
	if (loading) {
		return (
			<section
				id='products'
				className='py-6 sm:py-8 md:py-10 lg:py-12 bg-gradient-to-br relative overflow-hidden pb-16'>
				<div className='container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10 min-h-[40vh] flex items-center justify-center'>
					<div className='text-center'>
						<div className='animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4'></div>
						<p className='text-gray-600'>Loading products...</p>
					</div>
				</div>
			</section>
		);
	}

	// Don't render if no products
	if (displayProducts.length === 0) {
		return (
			<section
				id='products'
				className='relative py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 2xl:py-18 overflow-hidden'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center'>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							No Products Available
						</h2>
						<p className='text-gray-600'>
							No products available at the moment.
						</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section
			id='products'
			className='py-6 sm:py-8 md:py-10 lg:py-12 bg-gradient-to-br relative overflow-hidden pb-16'>
			<div className='container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10'>
				{/* Header */}
				<div className='text-center mb-6 sm:mb-8 md:mb-10'>
					<div className='inline-flex items-center space-x-1.5 sm:space-x-2 bg-primary-50 px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-full border border-primary-200 mb-3 sm:mb-4 md:mb-6'>
						<span className='text-primary-700 font-medium text-xs sm:text-sm md:text-base'>
							{t("premiumMedicalEquipment")}
						</span>
					</div>

					<h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-600 mb-3 sm:mb-4 md:mb-6 px-2'>
						{t("featured")}
					</h2>
					<p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4 sm:px-2 md:px-0'>
						{t("featuredProductsDescription")}
					</p>
				</div>

				{/* Products Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto'>
					{displayProducts.map((product) => (
						<div
							key={product._id}
							className='group relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100'>
							{/* Product Image */}
							<div className='relative overflow-hidden h-72 md:h-96'>
								<div className='relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200'>
									<img
										src={product?.image || ""}
										alt={getLocalizedText(product?.name) || ""}
										onError={(e) => {
											e.currentTarget.style.display = "none";
										}}
										onLoad={(e) => {
											e.currentTarget.style.opacity = "1";
										}}
										className='w-full h-full object-cover transition-all duration-500 group-hover:scale-105'
									/>

									{/* Gradient Overlay */}
									<div className='absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-primary-600/20'></div>

									{/* Subcategory Badge */}
									<div className='absolute top-4 left-4'>
										<span
											className={`inline-flex items-center space-x-1.5 bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-lg font-medium border border-white/20 shadow-lg text-sm ${
												isArabicText(
													getLocalizedText(
														typeof product?.subcategory === "string"
															? product?.subcategory
															: product?.subcategory?.name
													)
												)
													? "flex-row-reverse"
													: ""
											}`}>
											<Star className='w-3 h-3 text-primary-600' />
											<span>
												{getLocalizedText(
													typeof product?.subcategory === "string"
														? product?.subcategory
														: product?.subcategory?.name
												)}
											</span>
										</span>
									</div>

									{/* Hover Overlay */}
									<div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
										<div className='text-center'>
											<div className='w-16 h-16 mx-auto mb-3 bg-primary-100 rounded-full flex items-center justify-center'>
												<Zap className='w-8 h-8 text-primary-600' />
											</div>
											<p className='text-primary-700 font-medium text-sm'>
												Medical Equipment
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Product Info */}
							<div className='p-6 md:p-8'>
								<div className='h-full flex flex-col'>
									{/* Product Title */}
									<h3
										className={`text-2xl md:text-3xl font-semibold text-gray-900 mb-3 line-clamp-2 ${
											isArabicText(getLocalizedText(product?.name))
												? "text-right"
												: "text-left"
										}`}>
										{getLocalizedText(product?.name)}
									</h3>

									{/* Product Description */}
									<p
										className={`text-base md:text-lg text-gray-600 mb-6 leading-relaxed line-clamp-3 flex-1 ${
											isArabicText(getLocalizedText(product?.description))
												? "text-right"
												: "text-left"
										}`}>
										{getLocalizedText(product?.description)}
									</p>

									{/* CTA Buttons */}
									<div
										className={`flex flex-col sm:flex-row gap-3 mt-auto ${
											isRTL ? "sm:flex-row-reverse" : ""
										}`}>
										<button
											onClick={() => navigate(`/product/${product?._id}`)}
											className={`inline-flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm ${
												isRTL ? "flex-row-reverse" : ""
											}`}>
											<span>{t("learnMore")}</span>
											<ArrowRight
												className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
											/>
										</button>

										<button
											onClick={() =>
												navigate(`/contact?productId=${product?._id}`)
											}
											className='inline-flex items-center justify-center space-x-2 bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold border border-gray-200 hover:border-primary-300 hover:text-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm'>
											<span>{t("requestDemo")}</span>
										</button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* View All Button */}
				<div className='text-center mt-8 sm:mt-12 md:mt-16 lg:mt-20'>
					<button
						onClick={() => navigate("/products")}
						className='group relative inline-flex items-center space-x-2 sm:space-x-3 md:space-x-4 bg-white text-primary-600 border-2 border-primary-600 px-4 py-2.5 sm:px-6 sm:py-3 md:px-10 md:py-4 lg:px-12 lg:py-5 rounded-lg sm:rounded-xl md:rounded-2xl font-semibold shadow-lg sm:shadow-xl hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-400 hover:bg-primary-600 hover:text-white text-sm sm:text-base touch-manipulation w-full xs:w-auto max-w-xs xs:max-w-none mx-auto transition-all duration-500 ease-out overflow-hidden'>
						{/* Animated background glow */}
						<div className='absolute inset-0 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ease-out rounded-lg sm:rounded-xl md:rounded-2xl'></div>

						{/* Sparkle effects */}
						<div className='absolute inset-0 overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl'>
							<div className='absolute top-2 left-4 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-100'></div>
							<div className='absolute top-3 right-6 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 delay-200'></div>
							<div className='absolute bottom-3 left-8 w-1 h-1 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300 delay-300'></div>
							<div className='absolute bottom-2 right-4 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-400'></div>
						</div>

						{/* Button content */}
						<div
							className={`relative z-10 flex items-center justify-center ${
								isRTL ? "flex-row-reverse" : ""
							}`}>
							<span className='group-hover:drop-shadow-lg transition-all duration-300'>
								{t("viewAllProducts")}
							</span>
							<ArrowRight
								className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
									isRTL ? "ml-2 rotate-180" : "ml-2"
								} group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300 ease-out`}
							/>
						</div>
					</button>
				</div>
			</div>
		</section>
	);
};

export default Products;
