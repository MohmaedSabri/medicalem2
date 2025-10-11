/** @format */

import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useHeaderState } from "../../../hooks/useHeaderState";
import HeaderLogo from "./HeaderLogo";
import ContactIcons from "../ContactIcons";
import DesktopNavigation from "./DesktopNavigation";
import MobileMenu from "./MobileMenu";

interface HeaderProps {
	isLoginPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoginPage = false }) => {
	// Custom hooks
	const { currentLanguage, changeLanguage, isRTL } = useLanguage();
	const { state, actions } = useHeaderState();

	// Memoized event handlers
	const handleProductsMouseEnter = useCallback(() => {
		actions.clearCloseTimeout();
		actions.setShowProductsMenu(true);
	}, [actions]);

	const handleProductsMouseLeave = useCallback(() => {
		if (!("ontouchstart" in window)) {
			actions.setCloseTimeoutWithCallback(() => {
				actions.setShowProductsMenu(false);
				actions.setHoveredCategory(null);
			}, 150);
		}
	}, [actions]);

	const handleProductsClick = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		actions.setShowProductsMenu(!state.showProductsMenu);
		if (!state.showProductsMenu) {
			actions.setHoveredCategory(null);
		}
	}, [actions, state.showProductsMenu]);

	const handleCategoryMouseEnter = useCallback((categoryId: string) => {
		actions.clearCloseTimeout();
		actions.setHoveredCategory(categoryId);
	}, [actions]);

	const handleCategoryMouseLeave = useCallback(() => {
		if (!("ontouchstart" in window)) {
			actions.setCloseTimeoutWithCallback(() => {
				actions.setHoveredCategory(null);
			}, 100);
		}
	}, [actions]);

	const handleCategoryClick = useCallback((_categoryId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		// This will be handled by the ProductsDropdown component
	}, []);

	const handleLanguageMouseEnter = useCallback(() => {
		actions.setShowLanguageDropdown(true);
	}, [actions]);

	const handleLanguageMouseLeave = useCallback(() => {
		actions.setShowLanguageDropdown(false);
	}, [actions]);

	const handleLanguageToggle = useCallback(() => {
		actions.setShowLanguageDropdown(!state.showLanguageDropdown);
	}, [actions, state.showLanguageDropdown]);

	const handleChangeLanguage = useCallback((lang: string) => {
		changeLanguage(lang);
		actions.setShowLanguageDropdown(false);
	}, [changeLanguage, actions]);

	const handleProductsClose = useCallback(() => {
		actions.setShowProductsMenu(false);
		actions.setHoveredCategory(null);
	}, [actions]);

	return (
		<header
			className={`absolute  top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-10 lg:px-12 mt-4 md:mt-12 transition-all duration-300 ${
				isLoginPage ? 'hidden' : ''
			}`}
		>
			<div className="mx-auto max-w-6xl lg:max-w-7xl xl:max-w-[1200px]">
				<div className="flex items-center justify-between h-16 mx-auto sm:h-20 lg:h-24">
					{/* Logo Section */}
					<HeaderLogo
						isScrolled={state.isScrolled}
						isMobile={state.isMobile}
						isRTL={isRTL}
					/>

					{/* Desktop Navigation */}
					<DesktopNavigation
						isRTL={isRTL}
						currentLanguage={currentLanguage}
						showProductsMenu={state.showProductsMenu}
						hoveredCategory={state.hoveredCategory}
						showLanguageDropdown={state.showLanguageDropdown}
						onProductsMouseEnter={handleProductsMouseEnter}
						onProductsMouseLeave={handleProductsMouseLeave}
						onProductsClick={handleProductsClick}
						onCategoryMouseEnter={handleCategoryMouseEnter}
						onCategoryMouseLeave={handleCategoryMouseLeave}
						onCategoryClick={handleCategoryClick}
						onProductsClose={handleProductsClose}
						onLanguageMouseEnter={handleLanguageMouseEnter}
						onLanguageMouseLeave={handleLanguageMouseLeave}
						onLanguageToggle={handleLanguageToggle}
						onChangeLanguage={handleChangeLanguage}
					/>

					{/* Contact Icons & Mobile Menu */}
					<div
						className={`flex items-center flex-shrink-0 ${
							isRTL
								? 'space-x-reverse space-x-1 sm:space-x-reverse sm:space-x-2'
								: 'space-x-1 sm:space-x-2'
						}`}
					>
						{/* Contact Icons - Only visible on XL screens (1100px+) and bigger */}
						<ContactIcons
							isScrolled={state.isScrolled}
							isMobile={state.isMobile}
							isRTL={isRTL}
							currentLanguage={currentLanguage}
						/>

						{/* Mobile Menu Button - Show when screen smaller than 1100px */}
						<motion.button
							className={`
								xl:hidden flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
								${
									state.isScrolled || state.isMobile
										? 'bg-white/90 backdrop-blur-md border border-white/30 shadow-lg'
										: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-xl'
								}
								text-gray-700 hover:text-primary-600
							`}
							onClick={() => actions.setIsMenuOpen(!state.isMenuOpen)}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
						>
							{state.isMenuOpen ? (
								<X className="h-5 w-5 transition-transform" />
							) : (
								<Menu className="h-5 w-5 transition-transform" />
							)}
						</motion.button>
					</div>
				</div>

				{/* Mobile Menu */}
				<MobileMenu
					isMenuOpen={state.isMenuOpen}
					isRTL={isRTL}
					currentLanguage={currentLanguage}
					onClose={() => actions.setIsMenuOpen(false)}
					onChangeLanguage={handleChangeLanguage}
				/>
			</div>
		</header>
	);
};

export default Header;
