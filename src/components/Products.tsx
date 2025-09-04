/** @format */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../contexts/ProductsContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

const Products: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { isRTL, currentLanguage } = useLanguage();
	const { products, loading } = useProducts();

	// Function to detect if text is Arabic
	const isArabicText = (text: string): boolean => {
		const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
		return arabicRegex.test(text);
	};

	// Helper: get localized text from string or {en, ar}
	const getLocalizedText = (value: any): string => {
		if (!value) return "";
		if (typeof value === "string") return value;
		if (typeof value === "object") {
			return value[currentLanguage as "en" | "ar"] || value.en || value.ar || "";
		}
		return "";
	};

	// All hooks must be called before any conditional returns
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [touchStart, setTouchStart] = useState<number | null>(null);
	const [touchEnd, setTouchEnd] = useState<number | null>(null);

	// Get first 4 products for the slider
	const displayProducts = products.slice(0, 4);

	// Minimum swipe distance (in px)
	const minSwipeDistance = 50;

	// Auto-advance slider
	useEffect(() => {
		if (!isAutoPlaying || displayProducts.length === 0) return;

		const timer = setInterval(() => {
			setDirection(1);
			setCurrentIndex((prev) => (prev + 1) % displayProducts.length);
		}, 6000);

		return () => clearInterval(timer);
	}, [displayProducts.length, isAutoPlaying]);

	const slideVariants = {
		enter: (direction: number) => ({
			x: direction > 0 ? "100%" : "-100%",
			opacity: 0,
			scale: 0.95,
		}),
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
			scale: 1,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			x: direction < 0 ? "100%" : "-100%",
			opacity: 0,
			scale: 0.95,
		}),
	};

	const paginate = useCallback(
		(newDirection: number) => {
			setDirection(newDirection);
			setCurrentIndex(
				(prev) =>
					(prev + newDirection + displayProducts.length) %
					displayProducts.length
			);
			setIsAutoPlaying(false);
			setTimeout(() => setIsAutoPlaying(true), 10000);
		},
		[displayProducts.length]
	);

	const goToSlide = useCallback(
		(index: number) => {
			setDirection(index > currentIndex ? 1 : -1);
			setCurrentIndex(index);
			setIsAutoPlaying(false);
			setTimeout(() => setIsAutoPlaying(true), 10000);
		},
		[currentIndex]
	);

	// Touch handlers for mobile swipe
	const onTouchStart = (e: React.TouchEvent) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientX);
	};

	const onTouchMove = (e: React.TouchEvent) => {
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;

		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		if (isLeftSwipe) {
			paginate(1);
		} else if (isRightSwipe) {
			paginate(-1);
		}
	};

	// Loading state
	if (loading) {
		return (
			<section
				id='products'
				className='py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br relative overflow-hidden pb-24'>
				<div className='container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10'>
					<div className='text-center py-20'>
						<div className='animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4'></div>
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
				className='relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32 overflow-hidden'>
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
			className='py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br relative overflow-hidden pb-24'>
			<div className='container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10'>
				{/* Enhanced Header - Mobile Optimized */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 1, ease: "easeOut" }}
					className='text-center mb-8 sm:mb-12 md:mb-16'>
					<motion.div
						initial={{ opacity: 0, scale: 0.5 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2, duration: 0.8 }}
						className='inline-flex items-center space-x-1.5 sm:space-x-2 bg-teal-50 px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-full border border-teal-200 mb-3 sm:mb-4 md:mb-6'>
						<Zap className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-teal-600' />
						<span className='text-teal-700 font-medium text-xs sm:text-sm md:text-base'>
							{t('premiumMedicalEquipment')}
						</span>
					</motion.div>

					<h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-teal-600 mb-3 sm:mb-4 md:mb-6 px-2'>
						{t('featured')}
					</h2>
					<p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4 sm:px-2 md:px-0'>
						{t('featuredProductsDescription')}
					</p>
				</motion.div>

				{/* Enhanced Slider Container - Mobile First */}
				<div className='relative max-w-7xl mx-auto'>
					{/* Enhanced Slider with Touch Support */}
					<div
						className='relative h-[420px] xs:h-[450px] sm:h-[500px] 
						md:h-[550px] lg:h-[600px] xl:h-[700px] overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl'
						onTouchStart={onTouchStart}
						onTouchMove={onTouchMove}
						onTouchEnd={onTouchEnd}>
						{/* Navigation Arrows - Hidden on Mobile, Visible on Larger Screens */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => paginate(-1)}
							className='hidden sm:flex absolute left-3 sm:left-4 md:left-5 lg:left-6 top-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-white/95 backdrop-blur-sm rounded-full items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 group touch-manipulation px-1 sm:px-2 md:px-3'>
							<ChevronLeft className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-gray-700 group-hover:text-teal-600 transition-colors' />
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => paginate(1)}
							className='hidden sm:flex absolute right-3 sm:right-4 md:right-5 lg:right-6 top-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-white/95 backdrop-blur-sm rounded-full items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 group touch-manipulation px-1 sm:px-2 md:px-3'>
							<ChevronRight className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-gray-700 group-hover:text-teal-600 transition-colors' />
						</motion.button>

						<AnimatePresence initial={false} custom={direction} mode='wait'>
							<motion.div
								key={currentIndex}
								custom={direction}
								variants={slideVariants}
								initial='enter'
								animate='center'
								exit='exit'
								transition={{
									x: { type: "spring", stiffness: 300, damping: 30 },
									opacity: { duration: 0.3 },
									scale: { duration: 0.4 },
								}}
								className='absolute inset-0 z-10'>
								<div className='relative h-full bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden'>
									{/* Mobile-First Grid Layout */}
									<div className={`flex flex-col lg:grid lg:grid-cols-2 h-full min-h-full ${isRTL ? 'lg:grid-flow-col-dense' : ''}`}>
										{/* Product Image - Mobile Priority */}
										<div className={`relative overflow-hidden h-[200px] xs:h-[220px] sm:h-[240px] md:h-[260px] lg:h-full order-1 ${isRTL ? 'lg:order-2' : 'lg:order-1'}`}>
											{/* Image Container with Better Loading */}
											<div className='relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 group'>
												<motion.img
													src={displayProducts[currentIndex]?.image || ""}
													alt={getLocalizedText(displayProducts[currentIndex]?.name) || ""}
													initial={{ scale: 1.05 }}
													animate={{ scale: 1 }}
													transition={{ duration: 0.8 }}
													onError={(e) => {
														// Image failed to load
														e.currentTarget.style.display = "none";
													}}
													onLoad={(e) => {
														e.currentTarget.style.opacity = "1";
													}}
													style={{ opacity: 0 }}
													className='w-full h-full object-cover transition-opacity duration-500'
												/>

												{/* Mobile-Optimized Fallback */}
												<div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
													<div className='text-center'>
														<div className='w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 bg-teal-100 rounded-full flex items-center justify-center'>
															<Zap className='w-6 h-6 sm:w-8 sm:h-8 text-teal-600' />
														</div>
														<p className='text-teal-700 font-medium text-xs sm:text-sm'>
															Medical Equipment
														</p>
													</div>
												</div>
											</div>

											{/* Responsive Gradient Overlay */}
											<div className='absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-teal-600/20 lg:from-black/20 lg:to-teal-600/30'></div>

											{/* Mobile-Optimized Subcategory Badge */}
											<motion.div
												initial={{ opacity: 0, y: 15 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.4 }}
												className='absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 lg:top-6 lg:left-6'>
												<span 												className={`inline-flex items-center space-x-1 sm:space-x-1.5 md:space-x-2 bg-white/95 backdrop-blur-sm text-gray-800 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-3 rounded-lg sm:rounded-xl md:rounded-2xl font-medium border border-white/20 shadow-lg text-xs sm:text-sm md:text-base ${isArabicText(getLocalizedText(typeof displayProducts[currentIndex]?.subcategory === "string" ? displayProducts[currentIndex]?.subcategory : displayProducts[currentIndex]?.subcategory?.name)) ? 'flex-row-reverse' : ''}`}>
													<Star className='w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-teal-600' />
													<span>
														{getLocalizedText(typeof displayProducts[currentIndex]?.subcategory ===
														"string"
															? displayProducts[currentIndex]?.subcategory
															: displayProducts[currentIndex]?.subcategory?.name)}
													</span>
												</span>
											</motion.div>
										</div>

										{/* Product Info - Simplified and Fixed Height */}
										<div className={`flex-1 flex items-start p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 xl:p-12 2xl:p-16 bg-gradient-to-br from-gray-50 to-white order-2 ${isRTL ? 'lg:order-1' : 'lg:order-2'}`}>
											<motion.div
												initial={{ opacity: 0, x: 20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: 0.3, duration: 0.8 }}
												className='w-full h-full flex flex-col justify-between'>
												{/* Content Section */}
												<div className='flex-1'>
													{/* Product Title */}
													<motion.h3
										initial={{ opacity: 0, y: 15 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.4 }}
										className={`text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-900 mb-2 sm:mb-3 md:mb-4 lg:mb-6 ${isArabicText(getLocalizedText(displayProducts[currentIndex]?.name)) ? 'text-right leading-[1.9] whitespace-normal break-words overflow-visible' : 'text-left leading-tight line-clamp-2'}`}>
										{getLocalizedText(displayProducts[currentIndex]?.name)}
									</motion.h3>

													{/* Product Description */}
													<motion.p
														initial={{ opacity: 0, y: 15 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: 0.5 }}
														className={`text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 md:mb-8 lg:mb-10 leading-relaxed line-clamp-3 ${isArabicText(getLocalizedText(displayProducts[currentIndex]?.description)) ? 'text-right' : 'text-left'}`}>
														{getLocalizedText(displayProducts[currentIndex]?.description)}
													</motion.p>
												</div>

												{/* CTA Buttons - Always at Bottom */}
												<motion.div
													initial={{ opacity: 0, y: 15 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: 0.7 }}
													className={`flex flex-col xs:flex-row gap-2 sm:gap-3 md:gap-4 mt-auto ${isRTL ? 'xs:flex-row-reverse' : ''}`}>
													<motion.button
														whileHover={{ scale: 1.02, y: -1 }}
														whileTap={{ scale: 0.98 }}
														onClick={() =>
															navigate(
																`/product/${displayProducts[currentIndex]?._id}`
															)
														}
														className={`inline-flex items-center justify-center space-x-1.5 sm:space-x-2 md:space-x-3 bg-teal-600 text-white px-3 py-2 xs:px-4 xs:py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl font-semibold hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl text-xs xs:text-sm sm:text-base touch-manipulation ${isRTL ? 'flex-row-reverse' : ''}`}>
														<span>{t('learnMore')}</span>
														<ArrowRight className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${isRTL ? 'rotate-180' : ''}`} />
													</motion.button>

													<motion.button
														whileHover={{ scale: 1.02, y: -1 }}
														whileTap={{ scale: 0.98 }}
														className='inline-flex items-center justify-center space-x-1.5 sm:space-x-2 md:space-x-3 bg-white text-gray-800 px-3 py-2 xs:px-4 xs:py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl font-semibold border border-gray-200 sm:border-2 hover:border-teal-300 hover:text-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl text-xs xs:text-sm sm:text-base touch-manipulation'>
														<span>{t('requestDemo')}</span>
													</motion.button>
												</motion.div>
											</motion.div>
										</div>
									</div>
								</div>
							</motion.div>
						</AnimatePresence>
					</div>

					{/* Mobile-Optimized Dots Indicator */}
					<div className='flex justify-center mt-4 sm:mt-6 md:mt-8 lg:mt-12 space-x-1.5 sm:space-x-2 md:space-x-3'>
						{displayProducts.map((_, index) => (
							<motion.button
								key={index}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={() => goToSlide(index)}
								className={`relative transition-all duration-300 touch-manipulation ${
									index === currentIndex
										? "w-6 h-2 sm:w-8 sm:h-2 md:w-12 md:h-3 lg:w-16 lg:h-3"
										: "w-2 h-2 sm:w-3 sm:h-3"
								}`}>
								<div
									className={`absolute inset-0 rounded-full transition-all duration-300 ${
										index === currentIndex
											? "bg-teal-600 shadow-md"
											: "bg-gray-300 hover:bg-gray-400"
									}`}
								/>
								{index === currentIndex && (
									<motion.div
										layoutId='activeIndicator'
										className='absolute inset-0 rounded-full bg-teal-600 shadow-md'
									/>
								)}
							</motion.button>
						))}
					</div>
				</div>

				{/* Mobile-Optimized View All Button */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className='text-center mt-8 sm:mt-12 md:mt-16 lg:mt-20'>
					<motion.button
						whileHover={{ scale: 1.05, y: -3 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => navigate("/products")}
						className='group relative inline-flex items-center space-x-2 sm:space-x-3 md:space-x-4 bg-white text-teal-600 border-2 border-teal-600 px-4 py-2.5 sm:px-6 sm:py-3 md:px-10 md:py-4 lg:px-12 lg:py-5 rounded-lg sm:rounded-xl md:rounded-2xl font-semibold shadow-lg sm:shadow-xl hover:shadow-2xl hover:shadow-teal-500/50 hover:border-teal-400 hover:bg-teal-600 hover:text-white text-sm sm:text-base touch-manipulation w-full xs:w-auto max-w-xs xs:max-w-none mx-auto transition-all duration-500 ease-out overflow-hidden'>
						{/* Animated background glow */}
						<div className='absolute inset-0 bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ease-out rounded-lg sm:rounded-xl md:rounded-2xl'></div>
						
						{/* Sparkle effects */}
						<div className='absolute inset-0 overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl'>
							<div className='absolute top-2 left-4 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-100'></div>
							<div className='absolute top-3 right-6 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 delay-200'></div>
							<div className='absolute bottom-3 left-8 w-1 h-1 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300 delay-300'></div>
							<div className='absolute bottom-2 right-4 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-400'></div>
						</div>

						{/* Button content */}
						<div className={`relative z-10 flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
							<span className='group-hover:drop-shadow-lg transition-all duration-300'>{t('viewAllProducts')}</span>
							<ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${isRTL ? 'ml-2 rotate-180' : 'ml-2'} group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300 ease-out`} />
						</div>
					</motion.button>
				</motion.div>
			</div>
		</section>
	);
};

export default Products;
