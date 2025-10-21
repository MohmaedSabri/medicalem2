/** @format */

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";

interface HeroButtonsProps {
	onDownloadProfile?: () => void;
	onPlaceOrder: () => void;
}

const HeroButtons: React.FC<HeroButtonsProps> = ({
	onDownloadProfile,
	onPlaceOrder,
}) => {
	const { isRTL } = useLanguage();

	const handleDownloadProfile = () => {
		// Create a link element to trigger download
		const link = document.createElement("a");
		link.href = "/company-profile.pdf"; // Path to your company profile PDF
		link.download = "Dorar-Medical-Equipment-Company-Profile.pdf";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		// Call the optional callback if provided
		if (onDownloadProfile) {
			onDownloadProfile();
		}
	};

	const handlePlaceOrder = () => {
		// First try to scroll to the order message field specifically
		const orderMessage = document.getElementById("order-message");
		if (orderMessage) {
			orderMessage.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
			// Focus the textarea after scrolling
			setTimeout(() => {
				orderMessage.focus();
			}, 500);
			return;
		}

		// Fallback: scroll to order summary section
		const orderSummary = document.getElementById("order-summary");
		if (orderSummary) {
			orderSummary.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
			return;
		}

		// Final fallback: scroll to contact section
		const contactSection = document.getElementById("contact");
		if (contactSection) {
			contactSection.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		} else {
			// Last resort: navigate to contact page if section not found
			if (onPlaceOrder) {
				onPlaceOrder();
			}
		}
	};

	return (
		<div
			className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 md:mb-8 lg:mb-12 justify-center ${
				isRTL
					? "md:justify-end lg:justify-end"
					: "md:justify-start lg:justify-start"
			} ${
				isRTL ? "md:flex-row-reverse lg:flex-row-reverse" : ""
			} max-w-full overflow-hidden`}>
			<motion.button
				whileHover={{ y: -1 }}
				whileTap={{ scale: 0.98 }}
				className='group relative bg-white text-primary-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all duration-500 w-full sm:w-auto cursor-pointer select-none z-10 overflow-hidden shadow-lg hover:shadow-2xl'
				onClick={handleDownloadProfile}>
				{/* Animated background glow */}
				<div className='absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 opacity-0 group-hover:opacity-50 transition-opacity duration-500 ease-out rounded-full'></div>

				{/* Sparkle effects */}
				<div className='absolute inset-0 overflow-hidden rounded-full'>
					<div className='absolute top-2 left-6 w-1 h-1 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-100'></div>
					<div className='absolute top-3 right-8 w-1.5 h-1.5 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 delay-200'></div>
					<div className='absolute bottom-3 left-10 w-1 h-1 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300 delay-300'></div>
					<div className='absolute bottom-2 right-6 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-400'></div>
				</div>

				{/* Button content */}
				<span className='relative z-10 group-hover:drop-shadow-lg transition-all duration-300'>
					Download Company Profile
				</span>
			</motion.button>

			<motion.button
				whileHover={{ y: -1 }}
				whileTap={{ scale: 0.98 }}
				className='group relative border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-primary-500 transition-all duration-500 w-full sm:w-auto cursor-pointer select-none z-10 overflow-hidden shadow-lg hover:shadow-2xl'
				onClick={handlePlaceOrder}>
				{/* Animated background glow */}
				<div className='absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 group-hover:opacity-30 transition-opacity duration-500 ease-out rounded-full'></div>

				{/* Sparkle effects */}
				<div className='absolute inset-0 overflow-hidden rounded-full'>
					<div className='absolute top-2 left-6 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-100'></div>
					<div className='absolute top-3 right-8 w-1.5 h-1.5 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 delay-200'></div>
					<div className='absolute bottom-3 left-10 w-1 h-1 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300 delay-300'></div>
					<div className='absolute bottom-2 right-6 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-400'></div>
				</div>

				{/* Button content */}
				<span className='relative z-10 group-hover:drop-shadow-lg transition-all duration-300'>
					Place an Order
				</span>
			</motion.button>
		</div>
	);
};

export default HeroButtons;
