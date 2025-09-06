/** @format */

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Award, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

import LazyImage from "./LazyImage";

const Hero: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { isRTL } = useLanguage();
	const [counters, setCounters] = useState([0, 0, 0]);
	const statsRef = useRef<HTMLDivElement | null>(null);
	const statsInView = useInView(statsRef, { margin: "-100px", amount: 0.3 });

	const stats = [
		{ label: t('yearsExperience'), value: 15, suffix: "+", icon: Shield },
		{ label: t('medicalDevices'), value: 500, suffix: "+", icon: Award },
		{ label: t('healthcareClients'), value: 10000, suffix: "+", icon: Users },
	];

	const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

	const animateCounters = () => {
		const durationMs = 1800;
		const start = performance.now();
		const frame = (now: number) => {
			const p = Math.min(1, (now - start) / durationMs);
			const eased = easeOutCubic(p);
			setCounters(stats.map((s) => Math.floor(s.value * eased)) as unknown as number[]);
			if (p < 1) requestAnimationFrame(frame);
		};
		requestAnimationFrame(frame);
	};

	useEffect(() => {
		if (statsInView) {
			animateCounters();
		} else {
			setCounters([0, 0, 0]);
		}
	}, [statsInView]);

	// Hero tri-image rotating state with continuous smooth orbital motion
	const heroImages = React.useMemo(
		() => [
			"https://i.postimg.cc/5NhhnfVk/hero1.png",
			"https://i.postimg.cc/qvcbn3YV/hero2.png",
			"https://i.postimg.cc/qqfDyxkr/hero3.png",
		],
		[]
	);
	const [activeIndex, setActiveIndex] = React.useState(0);
	React.useEffect(() => {
		const t = setInterval(() => {
			setActiveIndex((i) => (i + 1) % heroImages.length);
		}, 3200); // Faster rotation to prevent stopping
		return () => clearInterval(t);
	}, [heroImages.length]);

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
		<>
			{/* Preload critical images */}
			<link rel="preload" as="image" href={heroImages[0]} />
			<link rel="preload" as="image" href={heroImages[1]} />
			<link rel="preload" as="image" href={heroImages[2]} />
			
			<section
				id='home'
				className='relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] pb-24 xl:min-h-screen pt-20 xl:px-[180px] xl:pt-28 sm:pt-8 md:pt-12 xl:pb-24 bg-[#00796a] overflow-hidden max-w-full'>
				{/* Enhanced Medical Equipment Background Textures */}
				<div className='absolute inset-0 -z-20 opacity-25'>
					{/* Medical Crosses Pattern */}
					<div className='absolute top-10 left-10 w-8 h-8 border-2 border-white/20 transform rotate-45'></div>
					<div className='absolute top-20 right-20 w-6 h-6 border-2 border-white/20 transform rotate-45'></div>
					<div className='absolute bottom-20 left-16 w-10 h-10 border-2 border-white/20 transform rotate-45'></div>
					<div className='absolute bottom-10 right-10 w-7 h-7 border-2 border-white/20 transform rotate-45'></div>
					<div className='absolute top-1/3 left-1/4 w-5 h-5 border-2 border-white/20 transform rotate-45'></div>
					<div className='absolute top-2/3 right-1/3 w-6 h-6 border-2 border-white/20 transform rotate-45'></div>

					{/* Heartbeat Line Pattern */}
					<div className='absolute top-1/4 left-1/3 w-16 h-1 bg-white/20 rounded-full'></div>
					<div className='absolute top-1/4 left-1/3 w-2 h-3 bg-white/20 rounded-full'></div>
					<div className='absolute top-1/4 left-1/3 w-2 h-3 bg-white/20 rounded-full translate-x-4'></div>
					<div className='absolute top-1/4 left-1/3 w-2 h-3 bg-white/20 rounded-full translate-x-8'></div>
					<div className='absolute top-1/4 left-1/3 w-2 h-3 bg-white/20 rounded-full translate-x-12'></div>

					{/* DNA Helix Pattern */}
					<div className='absolute top-1/2 right-1/4 w-12 h-20'>
						{Array.from({ length: 8 }).map((_, i) => (
							<div
								key={i}
								className='absolute w-1 h-1 bg-white/20 rounded-full'
								style={{
									top: `${i * 2.5}rem`,
									left: `${Math.sin(i * 0.5) * 1.5}rem`,
								}}></div>
						))}
					</div>

					{/* Medical Equipment Silhouettes */}
					<div className='absolute top-16 left-1/2 w-12 h-8 border border-white/20 rounded-lg opacity-30'></div>
					<div className='absolute top-20 left-1/2 w-2 h-6 bg-white/20 rounded-full translate-x-6'></div>
					<div className='absolute top-20 left-1/2 w-2 h-6 bg-white/20 rounded-full -translate-x-6'></div>

					{/* Syringe Pattern */}
					<div className='absolute bottom-1/3 right-1/4 w-8 h-1 bg-white/20 rounded-full'></div>
					<div className='absolute bottom-1/3 right-1/4 w-1 h-6 bg-white/20 rounded-full translate-x-7'></div>
					<div className='absolute bottom-1/3 right-1/4 w-2 h-2 bg-white/20 rounded-full translate-x-7 -translate-y-3'></div>

					{/* Stethoscope Pattern */}
					<div className='absolute top-1/3 left-1/6 w-16 h-8 border border-white/20 rounded-full opacity-30'></div>
					<div className='absolute top-1/3 left-1/6 w-1 h-4 bg-white/20 translate-x-8 translate-y-4'></div>
					<div className='absolute top-1/3 left-1/6 w-1 h-4 bg-white/20 translate-x-8 translate-y-8'></div>

					{/* Microscope Pattern */}
					<div className='absolute bottom-1/4 left-1/3 w-6 h-6 border border-white/20 rounded-full opacity-30'></div>
					<div className='absolute bottom-1/4 left-1/3 w-1 h-8 bg-white/20 translate-x-2.5 translate-y-6'></div>
					<div className='absolute bottom-1/4 left-1/3 w-8 h-1 bg-white/20 translate-x-3 translate-y-14'></div>

					{/* Geometric Medical Patterns */}
					<div className='absolute top-1/6 right-1/6 w-4 h-4 border border-white/20 transform rotate-45 opacity-40'></div>
					<div className='absolute top-1/6 right-1/6 w-2 h-2 bg-white/20 transform rotate-45 translate-x-1 translate-y-1'></div>

					<div className='absolute bottom-1/6 left-1/6 w-6 h-6 border border-white/20 rounded-full opacity-30'></div>
					<div className='absolute bottom-1/6 left-1/6 w-3 h-3 bg-white/20 rounded-full translate-x-1.5 translate-y-1.5'></div>

					{/* Pulse Wave Pattern */}
					<div className='absolute top-2/3 left-1/5 w-20 h-8'>
						{Array.from({ length: 6 }).map((_, i) => (
							<div
								key={i}
								className='absolute w-1 bg-white/20 rounded-full'
								style={{
									height: `${Math.sin(i * 0.8) * 6 + 8}px`,
									left: `${i * 3.5}rem`,
									top: `${8 - Math.sin(i * 0.8) * 3}px`,
								}}></div>
						))}
					</div>

					{/* Medical Bag Pattern */}
					<div className='absolute top-1/4 right-1/6 w-10 h-8 border border-white/20 rounded-lg opacity-30'></div>
					<div className='absolute top-1/4 right-1/6 w-8 h-1 bg-white/20 translate-x-1 translate-y-2'></div>
					<div className='absolute top-1/4 right-1/6 w-8 h-1 bg-white/20 translate-x-1 translate-y-5'></div>

					{/* Thermometer Pattern */}
					<div className='absolute bottom-1/3 left-1/4 w-2 h-8 border border-white/20 rounded-full opacity-30'></div>
					<div className='absolute bottom-1/3 left-1/4 w-3 h-3 bg-white/20 rounded-full translate-x-0.5 translate-y-5'></div>
					<div className='absolute bottom-1/3 left-1/4 w-1 h-4 bg-white/20 translate-x-0.5 translate-y-1'></div>
				</div>

				{/* New Enhanced Textures Layer */}
				<div className='absolute inset-0 top-20 -z-15 opacity-30'>
					{/* Animated Dots Grid */}
					{Array.from({ length: 12 }).map((_, i) => (
						<motion.div
							key={`dot-${i}`}
							className='absolute w-1 h-1 bg-white/50 rounded-full'
							style={{
								top: `${(i % 4) * 25}%`,
								left: `${Math.floor(i / 4) * 33.33}%`,
							}}
							animate={{
								opacity: [0.3, 0.8, 0.3],
								scale: [1, 1.5, 1],
							}}
							transition={{
								duration: 3,
								repeat: Infinity,
								delay: i * 0.2,
							}}
						/>
					))}

					{/* Wave Patterns */}
					<div className='absolute top-0 left-0 w-full h-32'>
						{Array.from({ length: 8 }).map((_, i) => (
							<motion.div
								key={`wave-${i}`}
								className='absolute w-full h-1 bg-white/20 rounded-full'
								style={{
									top: `${i * 4}rem`,
									opacity: 0.1 + i * 0.02,
								}}
								animate={{
									scaleX: [1, 1.1, 1],
									opacity: [0.1 + i * 0.02, 0.2 + i * 0.02, 0.1 + i * 0.02],
								}}
								transition={{
									duration: 4,
									repeat: Infinity,
									delay: i * 0.3,
								}}
							/>
						))}
					</div>

					{/* Geometric Shapes */}
					<motion.div
						className='absolute top-1/4 right-1/5 w-16 h-16 border border-white/20 transform rotate-45'
						animate={{
							rotate: [45, 225, 405],
							scale: [1, 1.2, 1],
						}}
						transition={{
							duration: 8,
							repeat: Infinity,
							ease: "linear",
						}}
					/>

					<motion.div
						className='absolute bottom-1/4 left-1/5 w-12 h-12 border border-white/20 rounded-full'
						animate={{
							scale: [1, 1.3, 1],
							opacity: [0.2, 0.4, 0.2],
						}}
						transition={{
							duration: 6,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>

					{/* Medical Plus Signs */}
					{Array.from({ length: 6 }).map((_, i) => (
						<motion.div
							key={`plus-${i}`}
							className='absolute w-6 h-6'
							style={{
								top: `${20 + i * 15}%`,
								left: `${10 + i * 20}%`,
							}}
							animate={{
								opacity: [0.1, 0.3, 0.1],
								rotate: [0, 90, 180],
							}}
							transition={{
								duration: 5,
								repeat: Infinity,
								delay: i * 0.5,
							}}>
							<div className='absolute top-1/2 left-0 w-full h-0.5 bg-white/20 transform -translate-y-1/2'></div>
							<div className='absolute top-0 left-1/2 w-0.5 h-full bg-white/20 transform -translate-x-1/2'></div>
						</motion.div>
					))}

					{/* Floating Circles */}
					{Array.from({ length: 8 }).map((_, i) => (
						<motion.div
							key={`circle-${i}`}
							className='absolute w-2 h-2 bg-white/40 rounded-full'
							style={{
								top: `${15 + i * 10}%`,
								right: `${20 + i * 8}%`,
							}}
							animate={{
								y: [0, -20, 0],
								x: [0, 10, 0],
								opacity: [0.25, 0.5, 0.25],
							}}
							transition={{
								duration: 4 + i,
								repeat: Infinity,
								delay: i * 0.4,
							}}
						/>
					))}

					{/* Hexagon Pattern */}
					<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
						<motion.div
							className='w-24 h-24 border border-white/15'
							style={{
								clipPath:
									"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
							}}
							animate={{
								rotate: [0, 360],
								scale: [1, 1.1, 1],
							}}
							transition={{
								duration: 12,
								repeat: Infinity,
								ease: "linear",
							}}
						/>
					</div>

					{/* Diagonal Lines */}
					{Array.from({ length: 5 }).map((_, i) => (
						<motion.div
							key={`diagonal-${i}`}
							className='absolute w-20 h-0.5 bg-white/15 transform rotate-45'
							style={{
								top: `${30 + i * 15}%`,
								left: `${20 + i * 20}%`,
							}}
							animate={{
								opacity: [0.15, 0.3, 0.15],
								scaleX: [1, 1.5, 1],
							}}
							transition={{
								duration: 3 + i,
								repeat: Infinity,
								delay: i * 0.6,
							}}
						/>
					))}

					{/* Medical Crosses Enhanced */}
					{Array.from({ length: 4 }).map((_, i) => (
						<motion.div
							key={`cross-${i}`}
							className='absolute w-8 h-8'
							style={{
								top: `${25 + i * 20}%`,
								right: `${15 + i * 25}%`,
							}}
							animate={{
								opacity: [0.2, 0.4, 0.2],
								scale: [1, 1.2, 1],
							}}
							transition={{
								duration: 4,
								repeat: Infinity,
								delay: i * 0.8,
							}}>
							<div className='absolute top-1/2 left-0 w-full h-1 bg-white/20 transform -translate-y-1/2'></div>

						</motion.div>
					))}

					{/* Animated Grid */}
					<div className='absolute inset-0  opacity-15'>
						{Array.from({ length: 20 }).map((_, i) => (
							<motion.div
								key={`grid-${i}`}
								className='absolute w-full h-px bg-white/30'
								style={{ top: `${i * 5}%` }}
								animate={{
									opacity: [0.15, 0.25, 0.15],
								}}
								transition={{
									duration: 5,
									repeat: Infinity,
									delay: i * 0.1,
								}}
							/>
						))}
						{Array.from({ length: 20 }).map((_, i) => (
							<motion.div
								key={`grid-v-${i}`}
								className='absolute h-full w-px bg-white/30'
								style={{ left: `${i * 5}%` }}
								animate={{
									opacity: [0.15, 0.25, 0.15],
								}}
								transition={{
									duration: 5,
									repeat: Infinity,
									delay: i * 0.1 + 2.5,
								}}
							/>
						))}
					</div>
				</div>

				{/* Curved Bottom - Hidden on mobile, visible on md+ */}
				<div className='absolute bottom-0 left-0 w-full hidden md:block '>
					<svg
						viewBox='0 0 1440 120'
						preserveAspectRatio='none'
						className='block translate-y-[1px]'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M0 120V0C240 40 480 60 720 40C960 20 1200 0 1440 20V120H0Z'
							fill='#ffffff'
							stroke='none'
						/>
					</svg>
				</div>

				<div className='container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pb-24 pt-8 sm:pt-4  xl:pt-16 max-w-full overflow-hidden'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 items-center min-h-[65vh] md:min-h-[65vh] xl:min-h-[75vh] max-w-full'>
						{/* Content Side - Responsive to RTL */}
						<div className={`text-white text-center mt-8 ${isRTL ? 'md:text-right lg:text-right' : 'md:text-left lg:text-left'} order-2 md:order-1 lg:order-1 md:col-span-1 lg:col-span-2 ${isRTL ? 'md:pr-4 lg:pr-4' : 'md:pl-4 lg:pl-4'} max-w-full overflow-hidden`}>
							<h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6'>
								{t('advancedMedicalEquipment')}
								<span className='block text-yellow-300 mb-2 sm:mb-3 md:mb-4'>{t('equipment')}</span>
								{t('forHealthcareExcellence')}
							</h1>

							<p className={`text-base sm:text-lg lg:text-xl text-teal-100 mb-6 sm:mb-8 max-w-xl mx-auto ${isRTL ? 'leading-[3.25] max-w-md sm:max-w-lg break-words lg:mr-0' : 'leading-relaxed lg:ml-0'}`}>
								{t('heroDescription')}
							</p>

							<div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 md:mb-8 lg:mb-12 justify-center ${isRTL ? 'md:justify-end lg:justify-end' : 'md:justify-start lg:justify-start'} ${isRTL ? 'md:flex-row-reverse lg:flex-row-reverse' : ''} max-w-full overflow-hidden`}>
								<motion.button
									whileHover={{ y: -1 }}
									whileTap={{ scale: 0.98 }}
									className='group relative bg-white text-[#00796a] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all duration-500 w-full sm:w-auto cursor-pointer select-none z-10 overflow-hidden shadow-lg hover:shadow-2xl'
									onClick={() => {
										navigate("/products");
									}}>
									{/* Animated background glow */}
									<div className='absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 opacity-0 group-hover:opacity-50 transition-opacity duration-500 ease-out rounded-full'></div>
									
									{/* Sparkle effects */}
									<div className='absolute inset-0 overflow-hidden rounded-full'>
										<div className='absolute top-2 left-6 w-1 h-1 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-100'></div>
										<div className='absolute top-3 right-8 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 delay-200'></div>
										<div className='absolute bottom-3 left-10 w-1 h-1 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300 delay-300'></div>
										<div className='absolute bottom-2 right-6 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-400'></div>
									</div>

									{/* Button content */}
									<span className='relative z-10 group-hover:drop-shadow-lg transition-all duration-300'>{t('exploreProducts')}</span>
								</motion.button>

								<motion.button
									whileHover={{ y: -1 }}
									whileTap={{ scale: 0.98 }}
									className='group relative border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-[#00796a] transition-all duration-500 w-full sm:w-auto cursor-pointer select-none z-10 overflow-hidden shadow-lg hover:shadow-2xl'
									onClick={() => {
										navigate("/contact");
									}}>
									{/* Animated background glow */}
									<div className='absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 group-hover:opacity-30 transition-opacity duration-500 ease-out rounded-full'></div>
									
									{/* Sparkle effects */}
									<div className='absolute inset-0 overflow-hidden rounded-full'>
										<div className='absolute top-2 left-6 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-100'></div>
										<div className='absolute top-3 right-8 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 delay-200'></div>
										<div className='absolute bottom-3 left-10 w-1 h-1 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300 delay-300'></div>
										<div className='absolute bottom-2 right-6 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-400'></div>
									</div>

									{/* Button content */}
									<span className='relative z-10 group-hover:drop-shadow-lg transition-all duration-300'>{t('contactUs')}</span>
								</motion.button>
							</div>

							{/* Stats */}
							<div ref={statsRef} className='grid grid-cols-3 gap-4 sm:gap-6'>
								{stats.map((stat, index) => (
									<motion.div
										key={stat.label}
										className='text-center'
										whileHover={{ scale: 1.05 }}>
										<stat.icon className='h-6 w-6 sm:h-8 sm:w-8 text-yellow-300 mx-auto mb-2' />
										<div className='text-lg sm:text-xl lg:text-2xl font-bold'>
											{counters[index]}
											{stat.suffix}
										</div>
										<div className='text-xs sm:text-sm text-teal-100'>
											{stat.label}
										</div>
									</motion.div>
								))}
							</div>
						</div>

						{/* Hero Images Section - Optimized */}
						<div className='relative w-full flex justify-center items-center self-center order-1 md:order-2 lg:order-2 mb-6 md:mb-8 lg:mb-0 md:col-span-1 lg:col-span-1 max-w-full overflow-hidden'>
							{/* Main Image Container */}
							<div className='relative w-full max-w-[18rem] h-[18rem] sm:max-w-[22rem] sm:h-[22rem] md:max-w-[24rem] md:h-[24rem] lg:max-w-[28rem] lg:h-[28rem] mx-auto'>
								{/* Rotating Hero Images */}
								{heroImages.map((src, i) => {
									const slot = getSlotFor(i);
									const isActive = slot === "center";
									
									return (
										<motion.div
											key={`hero-image-${i}`}
											className={`
												absolute rounded-full 
												backdrop-blur-md 
												flex items-center justify-center 
												overflow-hidden cursor-pointer
												transition-all duration-200
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
					</div>
				</div>
			</section>
		</>
	);
};

export default Hero;
