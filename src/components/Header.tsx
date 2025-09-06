/** @format */

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
	Home,
	Package,
	BookOpen,
	Info,
	Heart,
	Phone,
	Mail,
	Globe,
	Menu,
	X,
	ChevronDown,
	ChevronRight,
	Zap,
	User,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useCategories } from "../hooks/useCategories";
import { useSubCategories } from "../hooks/useSubCategories";

interface HeaderProps {
	isLoginPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoginPage = false }) => {
	// State management
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showProductsMenu, setShowProductsMenu] = useState(false);
	const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
	const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

	// Hooks
	const location = useLocation();
	const navigate = useNavigate();
	const { currentLanguage, changeLanguage, isRTL } = useLanguage();
	const { data: categories = [] } = useCategories();
	const { data: subcategories = [] } = useSubCategories();

	// Mobile detection
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Scroll detection
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Navigation items
	const navigationItems = [
		{
			path: "/",
			label: currentLanguage === "ar" ? "درر" : "Dorar",
			icon: Home,
		},
		{
			path: "/doctors",
			label: currentLanguage === "ar" ? "الأطباء" : "Doctors",
			icon: User,
		},
		{
			path: "/blog",
			label: currentLanguage === "ar" ? "المدونة" : "Blog",
			icon: BookOpen,
		},
		{
			path: "/about",
			label: currentLanguage === "ar" ? "من نحن" : "About",
			icon: Info,
		},
		{
			path: "/contact",
			label: currentLanguage === "ar" ? "اتصل بنا" : "Contact",
			icon: Phone,
		},
	];

	// Cleanup timeouts on unmount
	useEffect(() => {
		return () => {
			if (closeTimeout) {
				clearTimeout(closeTimeout);
			}
		};
	}, [closeTimeout]);

	// Close menus when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			const target = event.target as HTMLElement;

			// Don't close if clicking inside the dropdown or on the products button
			if (
				!target.closest(".products-dropdown") &&
				!target.closest(".products-button") &&
				!target.closest(".language-dropdown") &&
				!target.closest(".language-button")
			) {
				setShowProductsMenu(false);
				setShowLanguageDropdown(false);
				setHoveredCategory(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, []);

	// Function to detect if text is Arabic
	const isArabicText = (text: string): boolean => {
		const arabicRegex =
			/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
		return arabicRegex.test(text);
	};

	// Improved dropdown handling with delay - supports both hover and touch
	const handleMouseEnter = () => {
		if (closeTimeout) {
			clearTimeout(closeTimeout);
			setCloseTimeout(null);
		}
		setShowProductsMenu(true);
	};

	const handleMouseLeave = () => {
		// Only close on mouse leave if not on touch device
		if (!("ontouchstart" in window)) {
			const timeout = setTimeout(() => {
				setShowProductsMenu(false);
				setHoveredCategory(null);
			}, 150); // 150ms delay before closing
			setCloseTimeout(timeout);
		}
	};

	const handleProductsClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setShowProductsMenu(!showProductsMenu);
		if (!showProductsMenu) {
			setHoveredCategory(null);
		}
	};

	const handleCategoryMouseEnter = (categoryId: string) => {
		if (closeTimeout) {
			clearTimeout(closeTimeout);
			setCloseTimeout(null);
		}
		setHoveredCategory(categoryId);
	};

	const handleCategoryMouseLeave = () => {
		// Only close on mouse leave if not on touch device
		if (!("ontouchstart" in window)) {
			const timeout = setTimeout(() => {
				setHoveredCategory(null);
			}, 100); // 100ms delay for subcategory hover
			setCloseTimeout(timeout);
		}
	};

	const handleCategoryClick = (categoryId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		// On touch devices, first click shows subcategories, second click navigates
		if ("ontouchstart" in window) {
			if (hoveredCategory === categoryId) {
				// Second click - navigate to category
				const category = categories.find((cat: any) => cat._id === categoryId);
				if (category) {
					const categoryName =
						typeof category.name === "object"
							? (category.name as { [key: string]: string })[currentLanguage] || (category.name as { en: string; ar: string }).en
							: category.name;
					navigate(`/products?category=${encodeURIComponent(categoryName)}`);
					setShowProductsMenu(false);
					setHoveredCategory(null);
				}
			} else {
				// First click - show subcategories
				setHoveredCategory(categoryId);
			}
		} else {
			// Desktop - direct navigation
			const category = categories.find((cat: any) => cat._id === categoryId);
			if (category) {
				const categoryName =
					typeof category.name === "object"
						? (category.name as { [key: string]: string })[currentLanguage] || (category.name as { en: string; ar: string }).en
						: category.name;
				navigate(`/products?category=${encodeURIComponent(categoryName)}`);
				setShowProductsMenu(false);
				setHoveredCategory(null);
			}
		}
	};

	// Helper function to get subcategories for a category
	const getSubcategoriesForCategory = (categoryId: string) => {
		const filtered = subcategories.filter((sub: any) => {
			// Handle both string and object parentCategory
			const parentId =
				typeof sub.parentCategory === "string"
					? sub.parentCategory
					: sub.parentCategory?._id;
			return parentId === categoryId;
		});
		return filtered;
	};

	// Animation variants

	const dropdownVariants = {
		hidden: { opacity: 0, y: 10, scale: 0.95 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: { duration: 0.15, ease: "easeOut" as const },
		},
		exit: {
			opacity: 0,
			y: 10,
			scale: 0.95,
			transition: { duration: 0.1, ease: "easeIn" as const },
		},
	};


	const contactFloatingVariants = {
		animate: {
			y: [0, -5, 0],
			transition: {
				duration: 2.5,
				repeat: Infinity,
				ease: "easeInOut" as const,
				delay: 0.5,
			},
		},
	};

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 mt-4 md:mt-12 transition-all duration-300 ${
				isLoginPage ? "hidden" : ""
			}`}>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16 sm:h-20 lg:h-24'>
					{/* Logo Section */}
					<Link
						to='/'
						className={`flex items-center z-50 group flex-shrink-0 ${
							isRTL ? "space-x-reverse space-x-2" : "space-x-2"
						}`}
						onClick={() => setIsMenuOpen(false)}>
						<motion.div
							className='relative flex-shrink-0'
							whileHover={{ scale: 1.3, rotate: 5 }}
							whileTap={{ scale: 0.95 }}>
							<div
								className={`
                p-2 sm:p-3 rounded-full transition-all duration-300 group-hover:shadow-xl 
                ${
									isScrolled || isMobile
										? "bg-white/95 backdrop-blur-lg border border-white/40 shadow-lg"
										: "bg-white/90 backdrop-blur-md border border-white/30 shadow-xl"
								}
              `}>
								{/* Glow effect */}
								<div className='absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full blur-sm'></div>

								{/* Logo Image */}
								<img
									src='https://i.postimg.cc/x1bkFGQh/logo.png'
									alt='Dorar Logo'
									className='relative w-6  h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 object-contain rounded-lg transition-transform duration-300 group-hover:rotate-12'
									onError={(e) => {
										const target = e.target as HTMLImageElement;
										// Fallback to letter M if image fails to load
										target.style.display = "none";
										const fallback = document.createElement("div");
										fallback.className =
											"relative w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-teal-600 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:rotate-12";
										fallback.innerHTML =
											'<span class="text-white font-bold text-xs sm:text-sm lg:text-base">M</span>';
										target.parentNode?.appendChild(fallback);
									}}
								/>
							</div>
						</motion.div>
					</Link>

					{/* Desktop Navigation */}
					<nav className='hidden lg:flex items-center  justify-end  max-w-4xl mx-2'>
						<div
							className={`
                flex items-center space-x-1 xl:space-x-2 rounded-full px-2 py-2 border transition-all duration-300
                bg-white/80 backdrop-blur-md border-white/20 shadow-xl
              `}>
							{/* Navigation Items */}
							{navigationItems.map((item, index) => {
								const isActive = location.pathname === item.path;
								const IconComponent = item.icon;

								return (
									<React.Fragment key={item.path}>
										<Link
											to={item.path}
											className={`
                        relative flex items-center px-3 xl:px-4 py-2 xl:py-3 rounded-full transition-all duration-200
                        ${
													isActive
														? "bg-teal-600 text-white shadow-md"
														: "text-gray-700 hover:text-teal-600 hover:bg-white/50"
												}
                      `}>
											<IconComponent
												className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
											/>
											<span className='text-sm xl:text-base font-medium whitespace-nowrap'>
												{item.label}
											</span>
											{isActive && (
												<Zap className='h-4 w-4 text-yellow-400 ml-1' />
											)}
										</Link>

										{/* Products Dropdown - Show after Home */}
										{index === 0 && (
											<div
												className='relative products-button'
												onMouseEnter={handleMouseEnter}
												onMouseLeave={handleMouseLeave}>
												<button
													onClick={handleProductsClick}
													className='flex items-center px-3 xl:px-4 py-2 xl:py-3 rounded-full text-gray-700 hover:text-teal-600 hover:bg-white/50 transition-all duration-200'>
													<Package
														className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
													/>
													<span className='text-sm xl:text-base font-medium whitespace-nowrap'>
														{currentLanguage === "ar" ? "المنتجات" : "Products"}
													</span>
													<ChevronDown
														className={`h-3 w-3 ml-1 transition-transform ${
															showProductsMenu ? "rotate-180" : "rotate-0"
														}`}
													/>
												</button>

												{/* Products dropdown menu */}
												<AnimatePresence>
													{showProductsMenu && (
														<div
															className={`products-dropdown absolute ${
																isRTL ? "right-0" : "left-0"
															} mt-1 w-96 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-2xl p-4 z-50`}
															style={{
																transform: "translateY(4px)",
																pointerEvents: "auto",
															}}
															onMouseEnter={handleMouseEnter}
															onMouseLeave={handleMouseLeave}>
															{/* Header with close button */}
															<div className='flex items-center justify-between mb-4'>
																<div className='px-2 py-1 text-sm font-semibold text-teal-700 uppercase tracking-wide'>
																	{currentLanguage === "ar"
																		? "اختر فئة"
																		: "Select Category"}
																</div>
																<button
																	onClick={() => setShowProductsMenu(false)}
																	className='close-products-menu p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors'>
																	<X className='h-4 w-4' />
																</button>
															</div>

															{/* Categories grid with hover subcategories */}
															<div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3'>
																{categories.length > 0 ? (
																	categories.map(
																		(category: {
																			_id: string;
																			name: string | { en: string; ar: string };
																		}) => {
																			const categorySubcategories =
																				getSubcategoriesForCategory(
																					category._id
																				);
																			const categoryName =
																				typeof category.name === "object"
																					? (category.name as { [key: string]: string })[currentLanguage] ||
																					  (category.name as { en: string; ar: string }).en
																					: category.name;

																			return (
																				<div
																					key={category._id}
																					className='relative group'
																					onMouseEnter={() =>
																						handleCategoryMouseEnter(
																							category._id
																						)
																					}
																					onMouseLeave={
																						handleCategoryMouseLeave
																					}>
																					<button
																						onClick={(e) =>
																							handleCategoryClick(
																								category._id,
																								e
																							)
																						}
																						className='w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-700 border border-gray-100 hover:border-teal-200 transition-all duration-200 hover:shadow-md'>
																						<div className='font-medium text-sm sm:text-base'>
																							<span
																								className={
																									isArabicText(categoryName)
																										? "text-right"
																										: "text-left"
																								}>
																								{categoryName}
																							</span>
																						</div>
																						<div className='text-xs sm:text-sm text-gray-500 mt-1 flex items-center justify-between'>
																							<span>
																								{currentLanguage === "ar"
																									? "عرض المنتجات"
																									: "View Products"}
																							</span>
																							{categorySubcategories.length >
																								0 && (
																								<span className='text-teal-600 font-medium text-xs sm:text-sm'>
																									{categorySubcategories.length}{" "}
																									{currentLanguage === "ar"
																										? "فرعية"
																										: "sub"}
																								</span>
																							)}
																						</div>
																					</button>

																					{/* Subcategories dropdown on hover - Hidden on mobile, shown on desktop */}
																					{hoveredCategory === category._id &&
																						categorySubcategories.length >
																							0 && (
																							<>
																								{/* Invisible bridge to prevent mouse leaving */}
																								<div
																									className={`absolute top-0 w-1 h-full ${
																										isRTL
																											? "right-full"
																											: "left-full"
																									} hidden lg:block`}
																									style={{
																										marginLeft: isRTL
																											? "0px"
																											: "-1px",
																										marginRight: isRTL
																											? "-1px"
																											: "0px",
																									}}
																									onMouseEnter={() =>
																										handleCategoryMouseEnter(
																											category._id
																										)
																									}
																								/>
																								<div
																									className={`absolute top-0 w-56 sm:w-64 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 shadow-2xl p-3 z-50 hidden lg:block ${
																										isRTL
																											? "right-full mr-1"
																											: "left-full ml-1"
																									}`}
																									style={{
																										marginLeft: isRTL
																											? "0px"
																											: "4px",
																										marginRight: isRTL
																											? "4px"
																											: "0px",
																									}}
																									onMouseEnter={() =>
																										handleCategoryMouseEnter(
																											category._id
																										)
																									}
																									onMouseLeave={
																										handleCategoryMouseLeave
																									}>
																									<div className='text-xs font-semibold text-teal-700 uppercase tracking-wide mb-2 px-2'>
																										{currentLanguage === "ar"
																											? "الفئات الفرعية"
																											: "Subcategories"}
																									</div>
																									<div className='space-y-1 max-h-48 overflow-y-auto'>
																										{categorySubcategories.map(
																											(subcategory: any) => {
																												const subcategoryName =
																													typeof subcategory.name ===
																													"object"
																														? subcategory.name[
																																currentLanguage
																														  ] ||
																														  subcategory.name
																																.en
																														: subcategory.name;

																												return (
																													<button
																														key={
																															subcategory._id
																														}
																														onClick={(e) => {
																															e.preventDefault();
																															navigate(
																																`/products?subcategory=${encodeURIComponent(
																																	subcategoryName
																																)}`
																															);
																															setShowProductsMenu(
																																false
																															);
																															setHoveredCategory(
																																null
																															);
																														}}
																														className={`w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-200 text-sm ${
																															isArabicText(
																																subcategoryName
																															)
																																? "text-right"
																																: "text-left"
																														}`}>
																														{subcategoryName}
																													</button>
																												);
																											}
																										)}
																									</div>
																								</div>
																							</>
																						)}
																				</div>
																			);
																		}
																	)
																) : (
																	<div className='px-4 py-8 text-center text-gray-500 text-sm sm:text-base'>
																		{currentLanguage === "ar"
																			? "لا توجد فئات متاحة"
																			: "No categories available"}
																	</div>
																)}
															</div>

															{/* All Products button */}
															<div className='mt-4 pt-3 border-t border-gray-100'>
																<button
																	onClick={() => {
																		navigate("/products");
																		setShowProductsMenu(false);
																	}}
																	className='w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-teal-600 text-white rounded-lg sm:rounded-xl hover:bg-teal-700 transition-colors font-medium text-sm sm:text-base'>
																	{currentLanguage === "ar"
																		? "عرض جميع المنتجات"
																		: "View All Products"}
																</button>
															</div>
														</div>
													)}
												</AnimatePresence>
											</div>
										)}
									</React.Fragment>
								);
							})}

							{/* Language Dropdown - Inside Navbar */}
							<div
								className='relative language-dropdown'
								onMouseEnter={() => setShowLanguageDropdown(true)}
								onMouseLeave={() => setShowLanguageDropdown(false)}>
								<motion.button
									onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
									className='language-button flex items-center px-3 xl:px-4 py-2 xl:py-3 rounded-full text-gray-700 hover:text-teal-600 hover:bg-white/50 transition-all duration-200'
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}>
									<Globe className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
									<span className='text-sm xl:text-base font-medium'>
										{currentLanguage.toUpperCase()}
									</span>
									<ChevronDown
										className={`h-3 w-3 ml-1 transition-transform ${
											showLanguageDropdown ? "rotate-180" : "rotate-0"
										}`}
									/>
								</motion.button>

								{/* Language Dropdown Menu */}
								<AnimatePresence>
									{showLanguageDropdown && (
										<motion.div
											variants={dropdownVariants}
											initial='hidden'
											animate='visible'
											exit='exit'
											className={`language-dropdown absolute ${
												isRTL ? "left-0" : "right-0"
											} mt-1 w-32 rounded-xl bg-white/95 backdrop-blur-lg border border-white/30 shadow-xl p-2 z-50`}
											onMouseEnter={() => setShowLanguageDropdown(true)}
											onMouseLeave={() => setShowLanguageDropdown(false)}>
											<button
												onClick={() => {
													changeLanguage("en");
													setShowLanguageDropdown(false);
												}}
												className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
													currentLanguage === "en"
														? "bg-teal-600 text-white"
														: "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
												}`}>
												En
											</button>
											<button
												onClick={() => {
													changeLanguage("ar");
													setShowLanguageDropdown(false);
												}}
												className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
													currentLanguage === "ar"
														? "bg-teal-600 text-white"
														: "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
												}`}>
												Ar
											</button>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>
					</nav>

					{/* Contact Icons & Mobile Menu */}
					<div
						className={`flex items-center flex-shrink-0 ${
							isRTL
								? "space-x-reverse space-x-2 sm:space-x-reverse sm:space-x-3"
								: "space-x-2 sm:space-x-3"
						}`}>
						{/* Contact Icons - Only visible on XL screens and bigger */}
						<div
							className={`hidden xl:flex items-center ${
								isRTL ? "space-x-reverse space-x-2" : "space-x-2"
							}`}>
							<motion.a
								href='mailto:info@dorarmed.com'
								className={`
                  relative flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full transition-all duration-300 group
                  ${
										isScrolled || isMobile
											? "bg-white/95 backdrop-blur-lg border border-white/40 shadow-lg"
											: "bg-white/90 backdrop-blur-md border border-white/30 shadow-xl"
									}
                  text-gray-600 hover:text-teal-600 overflow-hidden
                `}
								variants={contactFloatingVariants}
								animate='animate'
								whileHover={{ scale: 1.1, rotate: -5 }}
								whileTap={{ scale: 0.95 }}>
								{/* Glow effect */}
								<div className='absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full'></div>
								<Mail className='mx-2 relative h-4 w-4 lg:h-5 lg:w-5 group-hover:scale-110 transition-transform duration-300' />
							</motion.a>

							<motion.a
								href='tel:+971556707773'
								className={`
                  relative flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full transition-all duration-300 group
                  ${
										isScrolled || isMobile
											? "bg-white/95 backdrop-blur-lg border border-white/40 shadow-lg"
											: "bg-white/90 backdrop-blur-md border border-white/30 shadow-xl"
									}
                  text-gray-600 hover:text-emerald-600 overflow-hidden
                `}
								variants={contactFloatingVariants}
								animate='animate'
								whileHover={{ scale: 1.1, rotate: 5 }}
								whileTap={{ scale: 0.95 }}
								style={{ animationDelay: "0.3s" }}>
								{/* Glow effect */}
								<div className='absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full'></div>
								<Phone className='relative  h-4 w-4 lg:h-5 lg:w-5 group-hover:scale-110 transition-transform duration-300' />
							</motion.a>

							{/* Favorites Icon */}
							<motion.div
								variants={contactFloatingVariants}
								animate='animate'
								whileHover={{ scale: 1.1, rotate: -3 }}
								whileTap={{ scale: 0.95 }}
								style={{ animationDelay: "0.6s" }}>
								<Link
									to="/favorites"
									className={`
										relative flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full transition-all duration-300 group
										${
											isScrolled || isMobile
												? "bg-white/95 backdrop-blur-lg border border-white/40 shadow-lg"
												: "bg-white/90 backdrop-blur-md border border-white/30 shadow-xl"
										}
										text-gray-600 hover:text-red-500 overflow-hidden
									`}>
									{/* Glow effect */}
									<div className='absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full'></div>
									<Heart className='relative h-4 w-4 lg:h-5 lg:w-5 group-hover:scale-110 transition-transform duration-300' />
								</Link>
							</motion.div>

							{/* Contact Sales Button */}
							<motion.button
								onClick={() => navigate("/contact")}
								className='group relative inline-flex hidden 2xl:flex items-center px-3 xl:px-4 py-2 xl:py-3 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 transition-all duration-500 ease-out shadow-lg hover:shadow-2xl hover:shadow-teal-500/50 overflow-hidden'
								whileHover={{ scale: 1.05, y: -3 }}
								whileTap={{ scale: 0.95 }}>
								{/* Animated background glow */}
								<div className='absolute inset-0 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600 opacity-0 group-hover:opacity-30 transition-opacity duration-500 ease-out rounded-full'></div>
								
								{/* Sparkle effects */}
								<div className='absolute inset-0 overflow-hidden rounded-full'>
									<div className='absolute top-1 left-3 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-100'></div>
									<div className='absolute top-2 right-4 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 delay-200'></div>
									<div className='absolute bottom-2 left-5 w-1 h-1 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300 delay-300'></div>
									<div className='absolute bottom-1 right-3 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-400'></div>
								</div>

								{/* Button content */}
								<div className={`relative z-10 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
									<Phone className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"} group-hover:scale-110 transition-all duration-300`} />
									<span className='text-sm mx-2 xl:text-base font-medium whitespace-nowrap group-hover:drop-shadow-lg transition-all duration-300'>
										{currentLanguage === "ar" ? "اتصل بنا" : "Contact Sales"}
									</span>
								</div>
							</motion.button>
						</div>

						{/* Mobile Menu Button */}
						<motion.button
							className={`
                lg:hidden flex items-center justify-center w-10 h-10 rounded-full  transition-all duration-300
                ${
									isScrolled || isMobile
										? "bg-white/90 backdrop-blur-md border border-white/30 shadow-lg"
										: "bg-white/80 backdrop-blur-md border border-white/20 shadow-xl"
								}
                text-gray-700 hover:text-teal-600
              `}
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}>
							{isMenuOpen ? (
								<X className='h-5 w-5 transition-transform' />
							) : (
								<Menu className='h-5 w-5 transition-transform' />
							)}
						</motion.button>
					</div>
				</div>

				{/* Mobile Menu */}
				<AnimatePresence>
					{isMenuOpen && (
						<>
							{/* Backdrop */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className='lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40'
								onClick={() => setIsMenuOpen(false)}
							/>

							{/* Sidebar */}
							<motion.div
								initial={{ x: "100%", opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								exit={{ x: "100%", opacity: 0 }}
								transition={{ type: "spring", damping: 25, stiffness: 200 }}
								className='lg:hidden fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 overflow-y-auto hide-scrollbar'>
								{/* Sidebar Header */}
								<div className='p-6 border-b border-gray-200/50'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center space-x-3'>
											<img
												src='https://i.postimg.cc/x1bkFGQh/logo.png'
												alt='Dorar Logo'
												className='h-10 w-10 object-cover rounded-lg'
											/>
											<span className='text-xl font-bold text-gray-900'>
												Dorar
											</span>
										</div>
										<motion.button
											onClick={() => setIsMenuOpen(false)}
											whileHover={{ scale: 1.1, rotate: 90 }}
											whileTap={{ scale: 0.95 }}
											className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'>
											<X className='h-5 w-5 text-gray-600' />
										</motion.button>
									</div>
								</div>

								{/* Sidebar Content */}
								<div className='p-6'>
									{/* Main Navigation */}
									<div className='space-y-3 mb-8'>
										<h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>
											{currentLanguage === "ar"
												? "التنقل الرئيسي"
												: "Main Navigation"}
										</h3>
										{navigationItems.map((item) => {
											const isActive = location.pathname === item.path;
											const IconComponent = item.icon;

											return (
												<motion.div
													key={item.path}
													whileHover={{ x: isRTL ? -5 : 5 }}
													whileTap={{ scale: 0.98 }}>
													<Link
														to={item.path}
														onClick={() => setIsMenuOpen(false)}
														className={`
														flex items-center w-full p-4 rounded-2xl transition-all duration-300 group
														${
															isActive
																? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30"
																: "text-gray-700 hover:bg-teal-50 hover:text-teal-600 hover:shadow-md"
														}
													`}>
														<div
															className={`p-2 rounded-xl ${
																isActive
																	? "bg-white/20"
																	: "bg-teal-100 group-hover:bg-teal-200"
															} transition-colors ${isRTL ? "ml-3" : "mr-3"}`}>
															<IconComponent className='h-5 w-5' />
														</div>
														<span className='font-medium flex-1'>
															{item.label}
														</span>
														{isActive && (
															<motion.div
																initial={{ scale: 0, rotate: -180 }}
																animate={{ scale: 1, rotate: 0 }}
																className='p-1 rounded-full bg-white/20'>
																<Zap className='h-4 w-4 text-yellow-300' />
															</motion.div>
														)}
													</Link>
												</motion.div>
											);
										})}
									</div>

									{/* Products Section */}
									<div className='mb-8'>
										<h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>
											{currentLanguage === "ar" ? "المنتجات" : "Products"}
										</h3>

										{/* All Products Link */}
										<motion.div
											whileHover={{ x: -5 }}
											whileTap={{ scale: 0.98 }}
											className='mb-4'>
											<Link
												to='/products'
												onClick={() => setIsMenuOpen(false)}
												className='flex items-center w-full p-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100 hover:text-teal-600 transition-all duration-300 group'>
												<div className='p-2 rounded-xl bg-teal-100 group-hover:bg-teal-200 transition-colors mr-3'>
													<Package className='h-5 w-5' />
												</div>
												<span className='font-medium flex-1'>
													{currentLanguage === "ar"
														? "جميع المنتجات"
														: "All Products"}
												</span>
												<ChevronRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
											</Link>
										</motion.div>
									</div>

									{/* Contact & Language Section */}
									<div className='border-t border-gray-200/50 pt-6'>
										<h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4'>
											{currentLanguage === "ar" ? "التواصل" : "Contact"}
										</h3>

										{/* Contact Links */}
										<div className='grid grid-cols-3 gap-3 mb-6'>
											<motion.a
												href='mailto:info@dorarmed.com'
												whileHover={{ scale: 1.05, y: -2 }}
												whileTap={{ scale: 0.95 }}
												className='flex flex-col items-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl text-teal-600 hover:shadow-lg transition-all duration-300'>
												<Mail className='h-6 w-6 mb-2' />
												<span className='text-xs font-medium'>
													{currentLanguage === "ar" ? "إيميل" : "Email"}
												</span>
											</motion.a>
											<motion.a
												href='tel:+971556707773'
												whileHover={{ scale: 1.05, y: -2 }}
												whileTap={{ scale: 0.95 }}
												className='flex flex-col items-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl text-teal-600 hover:shadow-lg transition-all duration-300'>
												<Phone className='h-6 w-6 mb-2' />
												<span className='text-xs font-medium'>
													{currentLanguage === "ar" ? "هاتف" : "Phone"}
												</span>
											</motion.a>
											<Link
												to="/favorites"
												onClick={() => setIsMenuOpen(false)}>
												<motion.div
													whileHover={{ scale: 1.05, y: -2 }}
													whileTap={{ scale: 0.95 }}
													className='flex flex-col items-center p-4 bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl text-red-600 hover:shadow-lg transition-all duration-300'>
													<Heart className='h-6 w-6 mb-2' />
													<span className='text-xs font-medium'>
														{currentLanguage === "ar" ? "المفضلة" : "Favorites"}
													</span>
												</motion.div>
											</Link>
										</div>

										{/* Language Switcher */}
										<div className='space-y-3'>
											<h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
												{currentLanguage === "ar" ? "اللغة" : "Language"}
											</h4>
											<div className='grid grid-cols-2 gap-2'>
												<motion.button
													onClick={() => changeLanguage("en")}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
														currentLanguage === "en"
															? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30"
															: "bg-gray-100 text-gray-700 hover:bg-gray-200"
													}`}>
													English
												</motion.button>
												<motion.button
													onClick={() => changeLanguage("ar")}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
														currentLanguage === "ar"
															? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30"
															: "bg-gray-100 text-gray-700 hover:bg-gray-200"
													}`}>
													العربية
												</motion.button>
											</div>
										</div>
									</div>
								</div>
							</motion.div>
						</>
					)}
				</AnimatePresence>
			</div>
		</header>
	);
};

export default Header;
