/** @format */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Package, Info, Phone, Zap, Heart, BookOpen, Globe, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCategories } from "../contexts/CategoriesContext";
import { useSubCategories } from "../hooks/useSubCategories";
import { useLanguage } from "../contexts/LanguageContext";

interface HeaderProps {
	isLoginPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoginPage = false }) => {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const [showProductsMenu, setShowProductsMenu] = React.useState(false);
	const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null);
	const [closeTimeout, setCloseTimeout] = React.useState<NodeJS.Timeout | null>(null);
	const [showLanguageDropdown, setShowLanguageDropdown] = React.useState(false);

	const { categories } = useCategories();
	const { data: subcategories = [] } = useSubCategories();
	const location = useLocation();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { currentLanguage, changeLanguage, isRTL } = useLanguage();

	// Function to detect if text is Arabic
	const isArabicText = (text: string): boolean => {
		const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
		return arabicRegex.test(text);
	};

	// Cleanup timeouts on unmount
	React.useEffect(() => {
		return () => {
			if (closeTimeout) {
				clearTimeout(closeTimeout);
			}
		};
	}, [closeTimeout]);

	// Language dropdown hover handlers
	const handleLanguageMouseEnter = () => {
		if (closeTimeout) {
			clearTimeout(closeTimeout);
			setCloseTimeout(null);
		}
		setShowLanguageDropdown(true);
	};

	const handleLanguageMouseLeave = () => {
		const timeout = setTimeout(() => {
			setShowLanguageDropdown(false);
		}, 150); // 150ms delay before closing
		setCloseTimeout(timeout);
	};

	// Helper function to get subcategories for a category
	const getSubcategoriesForCategory = (categoryId: string) => {
		return subcategories.filter(sub => 
			typeof sub.parentCategory === 'string' 
				? sub.parentCategory === categoryId 
				: sub.parentCategory._id === categoryId
		);
	};

	const closeMenu = () => setIsMenuOpen(false);

	// Improved dropdown handling with delay
	const handleMouseEnter = () => {
		if (closeTimeout) {
			clearTimeout(closeTimeout);
			setCloseTimeout(null);
		}
		setShowProductsMenu(true);
	};

	const handleMouseLeave = () => {
		const timeout = setTimeout(() => {
			setShowProductsMenu(false);
			setHoveredCategory(null);
		}, 150); // 150ms delay before closing
		setCloseTimeout(timeout);
	};

	const handleCategoryMouseEnter = (categoryId: string) => {
		if (closeTimeout) {
			clearTimeout(closeTimeout);
			setCloseTimeout(null);
		}
		setHoveredCategory(categoryId);
	};

	const handleCategoryMouseLeave = () => {
		const timeout = setTimeout(() => {
			setHoveredCategory(null);
		}, 100); // 100ms delay for subcategory hover
		setCloseTimeout(timeout);
	};

	// Navigation items with icons
	const navItems = [
		{
			path: "/",
			label: t('home'),
			icon: Home,
			isActive: location.pathname === "/",
		},
		{
			path: "/products",
			label: t('products'),
			icon: Package,
			isActive: location.pathname === "/products",
		},
		{
			path: "/blog",
			label: t('blog'),
			icon: BookOpen,
			isActive: location.pathname === "/blog",
		},
		{
			path: "/about",
			label: t('about'),
			icon: Info,
			isActive: location.pathname === "/about",
		},
		{
			path: "/favorites",
			label: t('favorites'),
			icon: Heart,
			isActive: location.pathname === "/favorites",
		},
		{
			path: "/contact",
			label: t('contact'),
			icon: Phone,
			isActive: location.pathname === "/contact",
		},
	];

	return (
		<>
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.6 }}
				className='fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-white/95 md:bg-transparent'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-center h-16 md:h-20 md:mt-10 w-full relative px-16 md:px-0'>
						{/* Desktop Navigation - Glassy pill-shaped navbar with integrated logo */}
						<nav className='hidden md:flex items-center'>
							{!isLoginPage && (
								<div className='bg-white/60 rounded-full px-2 py-2 border border-white/30 shadow-xl'>
									<div className='flex items-center space-x-1'>
										{/* Logo integrated into navbar */}
										<motion.div
											className='flex items-center px-3 py-1'
											whileHover={{ scale: 1.05 }}>
											<Link to='/'>
												<img
													src='https://i.postimg.cc/x1bkFGQh/logo.png'
													alt='MedEquip Pro Logo'
													className='h-7 w-7 object-cover rounded mr-3'
												/>
											</Link>
										</motion.div>

										{navItems.map((item) => {
											const IconComponent = item.icon;
											const isActive = item.isActive;

											const isProducts = item.path === "/products";
											return (
												<React.Fragment key={item.label}>
													{item.path.startsWith("#") ? (
														// Anchor link with smooth scrolling
														<button
															onClick={() => {
																const element = document.querySelector(
																	item.path
																);
																if (element) {
																	element.scrollIntoView({
																		behavior: "smooth",
																	});
																}
															}}
															className={`relative flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 holographic-card ${
																isActive
																	? "bg-teal-600 text-white shadow-lg"
																	: "text-gray-700 hover:text-teal-600 hover:bg-white/40 backdrop-blur-sm"
															}`}>
															<IconComponent className='h-4 w-4' />
															<span className='text-sm font-medium'>
																{item.label}
															</span>
															{isActive && (
																<Zap className='h-4 w-4 text-yellow-400 ml-1' />
															)}
														</button>
													) : (
														// Router link with optional dropdown for Products
														<div
															className={`relative ${
																isProducts ? "products-dropdown-container" : ""
															}`}>
															{isProducts ? (
																<div
																	className="relative"
																	onMouseEnter={handleMouseEnter}
																	onMouseLeave={handleMouseLeave}
																>
																	<button
																		className={`relative flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 holographic-card ${
																			isActive
																				? "bg-teal-600 text-white shadow-lg"
																				: "text-gray-700 hover:text-teal-600 hover:bg-white/40 backdrop-blur-sm"
																		}`}>
																		<IconComponent className='h-4 w-4' />
																		<span className='text-sm font-medium'>
																			{item.label}
																		</span>
																		{isProducts && (
																			<svg
																				className={`h-4 w-4 transition-transform ${
																					showProductsMenu
																						? "rotate-180"
																						: "rotate-0"
																				}`}
																				viewBox='0 0 20 20'
																				fill='currentColor'
																				aria-hidden='true'>
																				<path
																					fillRule='evenodd'
																					d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z'
																					clipRule='evenodd'
																				/>
																			</svg>
																		)}
																		{isActive && (
																			<Zap className='h-4 w-4 text-yellow-400 ml-1' />
																		)}
																	</button>
																	
																	{/* Products dropdown menu */}
																	{showProductsMenu && (
																		<div 
																			className='absolute left-0 mt-1 w-80 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-2xl p-4 z-50'
																			style={{ 
																				transform: 'translateY(4px)',
																				pointerEvents: 'auto'
																			}}
																			onMouseEnter={handleMouseEnter}
																			onMouseLeave={handleMouseLeave}
																		>
																			{/* Header with close button */}
																			<div className='flex items-center justify-between mb-4'>
																																<div className='px-2 py-1 text-sm font-semibold text-teal-700 uppercase tracking-wide'>
													{t('selectCategory')}
												</div>
																				<button
																					onClick={() => setShowProductsMenu(false)}
																					className='close-products-menu p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors'>
																					<X className='h-4 w-4' />
																				</button>
																			</div>

																			{/* Categories grid with hover subcategories */}
																			<div className='grid grid-cols-1 gap-2'>
																				{categories.length > 0 ? (
																					categories.map((category) => {
																						const categorySubcategories = getSubcategoriesForCategory(category._id);
																						return (
																							<div
																								key={category._id}
																								className='relative group'
																								onMouseEnter={() => handleCategoryMouseEnter(category._id)}
																								onMouseLeave={handleCategoryMouseLeave}
																							>
																								<button
																									onClick={(e) => {
																										e.preventDefault();
																										navigate(
																											`/products?category=${encodeURIComponent(
																												category.name
																											)}`
																										);
																										setShowProductsMenu(false);
																									}}
																									className='w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-700 border border-gray-100 hover:border-teal-200 transition-all duration-200 hover:shadow-md'>
																									<div className='font-medium text-sm flex items-center justify-between'>
																										<span className={isArabicText(category.name) ? 'text-right' : 'text-left'}>
																											{category.name}
																										</span>
																										{categorySubcategories.length > 0 && (
																											<span className='text-xs text-gray-400'>
																												{categorySubcategories.length} {t('subcategories')}
																											</span>
																										)}
																									</div>
																																										<div className='text-xs text-gray-500 mt-1'>
																		{t('viewProducts')}
																	</div>
																								</button>
																								
																								{/* Subcategories dropdown on hover */}
																								{hoveredCategory === category._id && categorySubcategories.length > 0 && (
																									<>
																										{/* Invisible bridge to prevent mouse leaving */}
																										<div 
																											className={`absolute top-0 w-1 h-full ${isRTL ? 'right-full' : 'left-full'}`}
																											style={{ marginLeft: isRTL ? '0px' : '-1px', marginRight: isRTL ? '-1px' : '0px' }}
																											onMouseEnter={() => handleCategoryMouseEnter(category._id)}
																										/>
																										<div 
																											className={`absolute top-0 w-64 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 shadow-2xl p-3 z-50 ${isRTL ? 'right-full mr-1' : 'left-full ml-1'}`}
																											style={{ marginLeft: isRTL ? '0px' : '4px', marginRight: isRTL ? '4px' : '0px' }}
																											onMouseEnter={() => handleCategoryMouseEnter(category._id)}
																											onMouseLeave={handleCategoryMouseLeave}
																										>
																										<div className='text-xs font-semibold text-teal-700 uppercase tracking-wide mb-2 px-2'>
																											{t('subcategories')}
																										</div>
																										<div className='space-y-1'>
																											{categorySubcategories.map((subcategory) => (
																												<button
																													key={subcategory._id}
																													onClick={(e) => {
																														e.preventDefault();
																														navigate(
																															`/products?subcategory=${encodeURIComponent(
																																subcategory.name
																															)}`
																														);
																														setShowProductsMenu(false);
																														setHoveredCategory(null);
																													}}
																													className={`w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-200 text-sm ${isArabicText(subcategory.name) ? 'text-right' : 'text-left'}`}>
																													{subcategory.name}
																												</button>
																											))}
																										</div>
																									</div>
																								</>
																								)}
																							</div>
																						);
																					})
																				) : (
																					<div className='px-4 py-8 text-center text-gray-500'>
																						{t('noCategoriesAvailable')}
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
																						className='w-full px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium'>
																						{t('viewAllProducts')}
																					</button>
																			</div>
																		</div>
																	)}
																</div>
															) : (
																<Link
																	to={item.path}
																	className={`relative flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
																		isActive
																			? "bg-teal-600 text-white shadow-lg"
																			: "text-gray-700 hover:text-teal-600 hover:bg-white/40 backdrop-blur-sm"
																	}`}>
																	<IconComponent className='h-4 w-4' />
																	<span className='text-sm font-medium'>
																		{item.label}
																	</span>
																	{isActive && (
																		<Zap className='h-4 w-4 text-yellow-400 ml-1' />
																	)}
																</Link>
															)}

														</div>
													)}
												</React.Fragment>
											);
										})}
										
										{/* Language Dropdown */}
										<div 
											className="relative language-dropdown"
											onMouseEnter={handleLanguageMouseEnter}
											onMouseLeave={handleLanguageMouseLeave}
										>
											<button
												className="relative flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 text-gray-700 hover:text-teal-600 hover:bg-white/40 backdrop-blur-sm"
											>
												<Globe className="h-4 w-4" />
												<span className="text-sm font-medium">{currentLanguage.toUpperCase()}</span>
												<ChevronDown className={`h-4 w-4 transition-transform ${showLanguageDropdown ? "rotate-180" : "rotate-0"}`} />
											</button>
											
											{/* Language Dropdown Menu */}
											{showLanguageDropdown && (
												<div 
													className="absolute right-0 mt-1 w-32 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 shadow-2xl p-2 z-50"
													onMouseEnter={handleLanguageMouseEnter}
													onMouseLeave={handleLanguageMouseLeave}
												>
													<button
														onClick={() => {
															changeLanguage("en");
														}}
														className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
															currentLanguage === "en"
																? "bg-teal-50 text-teal-700 font-medium"
																: "text-gray-700 hover:bg-teal-50 hover:text-teal-700"
														}`}
													>
														EN
													</button>
													<button
														onClick={() => {
															changeLanguage("ar");
														}}
														className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
															currentLanguage === "ar"
																? "bg-teal-50 text-teal-700 font-medium"
																: "text-gray-700 hover:bg-teal-50 hover:text-teal-700"
														}`}
													>
														AR
													</button>
												</div>
											)}
										</div>
									</div>
								</div>
							)}
						</nav>
						{/* Mobile left logo */}
						<Link
							to='/'
							className='md:hidden absolute left-4 flex items-center group focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-xl'>
							<motion.div
								className='flex items-center space-x-2 p-2 rounded-xl bg-white/80 hover:bg-white/90 focus:bg-white/90 transition-all duration-200 backdrop-blur-sm border border-white/40 shadow-lg'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.2, duration: 0.5 }}>
								<motion.img
									src='https://i.postimg.cc/x1bkFGQh/logo.png'
									alt='MedEquip Pro Logo'
									className='h-9 w-9 object-cover rounded-lg shadow-md'
									whileHover={{ rotate: 5 }}
									transition={{ duration: 0.2 }}
								/>
								<span className='text-sm font-bold text-gray-800 hidden sm:block'>
									MedEquip Pro
								</span>
							</motion.div>
						</Link>
						{/* Mobile Menu Button - Positioned absolutely on the right */}
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className='md:hidden absolute right-4 p-2 text-gray-700 hover:text-teal-600 transition-colors'>
							{isMenuOpen ? (
								<X className='h-6 w-6' />
							) : (
								<Menu className='h-6 w-6' />
							)}
						</button>
					</div>
				</div>
			</motion.header>

			{/* Mobile Sidebar Overlay */}
			<AnimatePresence>
				{isMenuOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={closeMenu}
							className='fixed inset-0 bg-black/40 backdrop-blur-md z-40 md:hidden'
						/>

						{/* Sidebar */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
							className='fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl z-50 md:hidden border-l border-white/30'>
							{/* Sidebar Header */}
							<div className='bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 shadow-lg rounded-br-3xl'>
								<div className='flex items-center justify-between'>
									<Link
										to='/'
										onClick={closeMenu}
										className='flex items-center space-x-3 group'>
										<motion.div
											className='p-2 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-200'
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}>
											<img
												src='https://i.postimg.cc/x1bkFGQh/logo.png'
												alt='MedEquip Pro Logo'
												className='h-10 w-10 object-cover rounded-lg'
											/>
										</motion.div>
										<div>
											<h2 className='text-xl font-bold group-hover:text-teal-100 transition-colors'>
												{t('medEquipPro')}
											</h2>
											<p className='text-teal-100 text-sm font-medium'>
												{t('medicalEquipmentSolutions')}
											</p>
										</div>
									</Link>
									<button
										onClick={closeMenu}
										className='p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105'>
										<X className='h-5 w-5' />
									</button>
								</div>
							</div>

							{/* Sidebar Navigation */}
							<nav className='flex flex-col p-6 space-y-3'>
								{!isLoginPage && (
									<>
										{navItems.map((item) => {
											const IconComponent = item.icon;
											const isActive = item.isActive;

											return (
												<React.Fragment key={item.label}>
													{item.path.startsWith("#") ? (
														// Anchor link with smooth scrolling
														<button
															onClick={() => {
																closeMenu();
																const element = document.querySelector(
																	item.path
																);
																if (element) {
																	element.scrollIntoView({
																		behavior: "smooth",
																	});
																}
															}}
															className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 group ${
																isActive
																	? "bg-teal-600 text-white shadow-lg"
																	: "text-teal-700 hover:text-teal-800 hover:bg-teal-50/80 backdrop-blur-sm"
															}`}>
															<div
																className={`p-2 rounded-lg transition-colors ${
																	isActive
																		? "bg-white/20"
																		: "bg-teal-100 group-hover:bg-teal-200"
																}`}>
																<IconComponent
																	className={`h-5 w-5 ${
																		isActive
																			? "text-white"
																			: "text-teal-600 group-hover:text-teal-700"
																	}`}
																/>
															</div>
															<span className='font-medium'>{item.label}</span>
															{isActive && (
																<Zap className='h-5 w-5 text-yellow-400 ml-auto' />
															)}
														</button>
													) : (
														// Router link
														<Link
															to={item.path}
															onClick={closeMenu}
															className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 group ${
																isActive
																	? "bg-teal-600 text-white shadow-lg"
																	: "text-teal-700 hover:text-teal-800 hover:bg-teal-50/80 backdrop-blur-sm"
															}`}>
															<div
																className={`p-2 rounded-lg transition-colors ${
																	isActive
																		? "bg-white/20"
																		: "bg-teal-100 group-hover:bg-teal-200"
																}`}>
																<IconComponent
																	className={`h-5 w-5 ${
																		isActive
																			? "text-white"
																			: "text-teal-600 group-hover:text-teal-700"
																	}`}
																/>
															</div>
															<span className='font-medium'>{item.label}</span>
															{isActive && (
																<Zap className='h-5 w-5 text-yellow-400 ml-auto' />
															)}
														</Link>
													)}
												</React.Fragment>
											);
										})}
										
										{/* Mobile Language Dropdown */}
										<div className="mt-4 pt-4 border-t border-teal-200">
											<div className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-3 px-2">
												{t('language')}
											</div>
											<div className="space-y-2">
												<button
													onClick={() => {
														changeLanguage("en");
														closeMenu();
													}}
													className={`w-full flex items-center space-x-3 p-3 rounded-xl text-sm transition-all duration-200 ${
														currentLanguage === "en"
															? "bg-teal-600 text-white shadow-lg"
															: "text-teal-700 hover:text-teal-800 hover:bg-teal-50/80 backdrop-blur-sm"
													}`}
												>
													<div className={`p-2 rounded-lg transition-colors ${
														currentLanguage === "en"
															? "bg-white/20"
															: "bg-teal-100"
													}`}>
														<Globe className="h-4 w-4 text-teal-600" />
													</div>
													<span className="font-medium">EN</span>
													{currentLanguage === "en" && (
														<Zap className="h-4 w-4 text-yellow-400 ml-auto" />
													)}
												</button>
												<button
													onClick={() => {
														changeLanguage("ar");
														closeMenu();
													}}
													className={`w-full flex items-center space-x-3 p-3 rounded-xl text-sm transition-all duration-200 ${
														currentLanguage === "ar"
															? "bg-teal-600 text-white shadow-lg"
															: "text-teal-700 hover:text-teal-800 hover:bg-teal-50/80 backdrop-blur-sm"
													}`}
												>
													<div className={`p-2 rounded-lg transition-colors ${
														currentLanguage === "ar"
															? "bg-white/20"
															: "bg-teal-100"
													}`}>
														<Globe className="h-4 w-4 text-teal-600" />
													</div>
													<span className="font-medium">AR</span>
													{currentLanguage === "ar" && (
														<Zap className="h-4 w-4 text-yellow-400 ml-auto" />
													)}
												</button>
											</div>
										</div>
										
										{/* Footer */}
										<div className='mt-auto pt-6 text-center'>
											<div className='bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 border border-teal-100'>
												<p className='text-xs text-teal-700 font-medium'>
													{t('professionalMedicalEquipment')}
												</p>
											</div>
										</div>
									</>
								)}
							</nav>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

export default Header;
