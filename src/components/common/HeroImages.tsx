/** @format */

import React from "react";
import { motion } from "framer-motion";
import LazyImage from "../ui/LazyImage";

interface HeroImagesProps {
	heroImages: string[];
	activeIndex: number;
	setActiveIndex: (index: number) => void;
}

const HeroImages: React.FC<HeroImagesProps> = ({
	heroImages,
	activeIndex,
	setActiveIndex,
}) => {
	const getSlotFor = (imgIdx: number): "left" | "right" | "center" => {
		const diff = (imgIdx - activeIndex + heroImages.length) % heroImages.length;
		if (diff === 0) return "center";
		if (diff === 1) return "right";
		return "left";
	};

	type SlotKey = "left" | "right" | "center";
	const slotStyles: Record<
		SlotKey,
		{ x: number; y: number; scale: number; zIndex: number; filter: string; opacity: number; rotate: number }
	> = {
		left: { x: -100, y: 0, scale: 0.72, zIndex: 5, filter: "blur(0px)", opacity: 0.8, rotate: -5 },
		right: { x: 100, y: 0, scale: 0.72, zIndex: 5, filter: "blur(0px)", opacity: 0.8, rotate: 5 },
		center: { x: 0, y: 0, scale: 1, zIndex: 10, filter: "none", opacity: 1, rotate: 0 },
	};

	return (
		<div className='relative w-full flex justify-center items-center self-center order-1 md:order-2 lg:order-2 mb-6 md:mb-8 lg:mb-0 md:col-span-1 lg:col-span-1 max-w-full overflow-hidden'>
			{/* Main Image Container */}
			<div className='relative w-full max-w-[22rem] h-[22rem] sm:max-w-[26rem] sm:h-[26rem] md:max-w-[28rem] md:h-[28rem] lg:max-w-[32rem] lg:h-[32rem] mx-auto'>
				{/* Rotating Hero Images */}
				{heroImages.map((src, i) => {
					const slot = getSlotFor(i);
					const isActive = slot === "center";
					
					return (
						<motion.div
							key={`hero-image-${i}`}
							className={`
								absolute  rounded-full 
								backdrop-blur-md 
								flex items-center justify-center
								overflow-hidden cursor-pointer
								transition-all duration-200
								ml-4
								${isActive ? 'z-20' : 'z-10'}
							`}
							style={{
								width: slot === "center" ? "90%" : "64%",
								height: slot === "center" ? "90%" : "64%",
							}}
							animate={slotStyles[slot]}
							transition={{ 
								type: "tween", 
								ease: "linear",
								duration: 0.4
							}}
							onClick={() => setActiveIndex(i)}
							whileHover={{ 
								scale: isActive ? 1.02 : 0.82,
								transition: { duration: 0.2, ease: "linear" }
							}}
							whileTap={{ scale: 0.98 }}
						>
							{/* LazyImage Component */}
							<LazyImage
								src={src}
								alt={`Hero medical equipment ${i + 1}`}
								className='w-full h-full object-cover rounded-full'
								threshold={0.1}
								rootMargin="100px"
							/>
							
							{/* Active Image Indicator */}
							{isActive && (
								<motion.div
									className="absolute inset-0 rounded-full border-2 border-white/20"
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.3 }}
								/>
							)}
						</motion.div>
					);
				})}
			</div>

			{/* Decorative Background Elements */}
			<div className='absolute inset-0 -z-10 pointer-events-none'>
				{/* Outer Ring */}
				<motion.div
					className='absolute top-16 right-16 sm:top-20 sm:right-20 w-24 h-24 sm:w-32 sm:h-32 border border-white/10 rounded-full'
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.1, 0.2, 0.1],
						rotate: [0, 90, 180, 270, 360],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "linear",
					}}
				/>
				
				{/* Inner Ring */}
				<motion.div
					className='absolute bottom-16 left-16 sm:bottom-20 sm:left-20 w-20 h-20 sm:w-24 sm:h-24 border border-white/10 rounded-full'
					animate={{
						scale: [1, 1.15, 1],
						opacity: [0.1, 0.25, 0.1],
						rotate: [0, -90, -180, -270, -360],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "linear",
						delay: 2,
					}}
				/>
				
				{/* Center Ring */}
				<motion.div
					className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 border border-white/5 rounded-full'
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.05, 0.15, 0.05],
						rotate: [0, 180, 360],
					}}
					transition={{
						duration: 12,
						repeat: Infinity,
						ease: "linear",
						delay: 4,
					}}
				/>
			</div>
		</div>
	);
};

export default HeroImages;
