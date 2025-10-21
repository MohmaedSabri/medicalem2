/** @format */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCartItemCount } from "../../utils/cart";

interface CartCounterProps {
	className?: string;
	size?: "sm" | "md" | "lg";
}

const CartCounter: React.FC<CartCounterProps> = ({
	className = "",
	size = "md",
}) => {
	const [count, setCount] = useState<number>(0);

	// Update count when cart changes
	useEffect(() => {
		const updateCount = () => {
			const newCount = getCartItemCount();
			console.log("CartCounter: Updating count to:", newCount);
			setCount(newCount);
		};

		// Initial count
		updateCount();

		// Listen for storage changes (cart updates from other tabs/components)
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === "cart") {
				updateCount();
			}
		};

		// Listen for custom cart update events
		const handleCartUpdate = () => {
			updateCount();
		};

		window.addEventListener("storage", handleStorageChange);
		window.addEventListener("cartUpdated", handleCartUpdate);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("cartUpdated", handleCartUpdate);
		};
	}, []);

	// Don't show counter if count is 0
	if (count === 0) {
		console.log("CartCounter: Count is 0, not rendering");
		return null;
	}

	console.log(
		"CartCounter: Rendering with count:",
		count,
		"Type:",
		typeof count
	);

	const sizeClasses = {
		sm: "text-xs min-w-[18px] h-5 px-1.5",
		md: "text-xs min-w-[20px] h-6 px-2",
		lg: "text-sm min-w-[22px] h-7 px-2.5",
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0, opacity: 0 }}
				transition={{
					type: "spring",
					stiffness: 500,
					damping: 30,
					duration: 0.2,
				}}
				className={`
          absolute -top-2 -right-2 bg-red-500 text-white rounded-full 
          flex items-center justify-center font-bold shadow-lg
          text-center leading-none z-[9999] border-2 border-white
          ${sizeClasses[size]}
          ${className}
        `}>
				{count > 99 ? "99+" : count || 0}
			</motion.div>
		</AnimatePresence>
	);
};

export default CartCounter;
