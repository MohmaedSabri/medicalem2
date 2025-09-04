/** @format */

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// Add shimmer animation styles
const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
`;

// Inject the CSS
if (typeof document !== "undefined") {
	const style = document.createElement("style");
	style.textContent = shimmerKeyframes;
	document.head.appendChild(style);
}

const Ceo: React.FC = () => {
	const { t } = useTranslation();
	const containerVariants = {
		hidden: { opacity: 0, y: 24 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: "easeOut" as const },
		},
	};

	const staggerParent = {
		hidden: {},
		visible: {
			transition: { staggerChildren: 0.12 },
		},
	};

	const item = {
		hidden: { opacity: 0, y: 16 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: "easeOut" as const },
		},
	};

	return (
		<section id='ceo' className='bg-white py-16 sm:py-20'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center'
					variants={staggerParent}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true, amount: 0.2 }}>
					{/* CEO Photo */}
					<motion.div
						className='flex justify-center'
						variants={containerVariants}>
						<div className='relative flex justify-center items-center'>
							{/* Modern glow effect - outer */}
							<div
								className='absolute inset-0 rounded-full bg-gradient-radial from-teal-50/20 via-teal-100/10 to-transparent animate-pulse'
								style={{
									width: "120%",
									height: "120%",
									animationDuration: "4s",
								}}></div>

							{/* Modern glow effect - inner */}
							<div
								className='absolute inset-0 rounded-full bg-gradient-radial from-teal-100/15 via-teal-200/8 to-transparent animate-pulse'
								style={{
									width: "110%",
									height: "110%",
									animationDuration: "3s",
									animationDelay: "1s",
								}}></div>

							{/* Modern subtle rays */}
							<div className='absolute inset-0 pointer-events-none'>
								{/* Main cardinal rays */}
								<div
									className='absolute top-0 left-1/2 w-0.5 h-16 bg-gradient-to-b from-teal-200/30 to-transparent transform -translate-x-1/2 -translate-y-4 animate-pulse'
									style={{
										animationDelay: "0s",
										animationDuration: "3s",
									}}></div>
								<div
									className='absolute bottom-0 left-1/2 w-0.5 h-16 bg-gradient-to-t from-teal-200/30 to-transparent transform -translate-x-1/2 translate-y-4 animate-pulse'
									style={{
										animationDelay: "0.5s",
										animationDuration: "3s",
									}}></div>
								<div
									className='absolute left-0 top-1/2 w-16 h-0.5 bg-gradient-to-r from-teal-200/30 to-transparent transform -translate-y-1/2 -translate-x-4 animate-pulse'
									style={{
										animationDelay: "1s",
										animationDuration: "3s",
									}}></div>
								<div
									className='absolute right-0 top-1/2 w-16 h-0.5 bg-gradient-to-l from-teal-200/30 to-transparent transform -translate-y-1/2 translate-x-4 animate-pulse'
									style={{
										animationDelay: "1.5s",
										animationDuration: "3s",
									}}></div>

								{/* Diagonal rays */}
								<div
									className='absolute top-2 left-2 w-0.5 h-12 bg-gradient-to-br from-teal-200/25 to-transparent transform rotate-45 animate-pulse'
									style={{
										animationDelay: "2s",
										animationDuration: "3.5s",
									}}></div>
								<div
									className='absolute top-2 right-2 w-0.5 h-12 bg-gradient-to-bl from-teal-200/25 to-transparent transform -rotate-45 animate-pulse'
									style={{
										animationDelay: "2.5s",
										animationDuration: "3.5s",
									}}></div>
								<div
									className='absolute bottom-2 left-2 w-0.5 h-12 bg-gradient-to-tr from-teal-200/25 to-transparent transform -rotate-45 animate-pulse'
									style={{
										animationDelay: "3s",
										animationDuration: "3.5s",
									}}></div>
								<div
									className='absolute bottom-2 right-2 w-0.5 h-12 bg-gradient-to-tl from-teal-200/25 to-transparent transform rotate-45 animate-pulse'
									style={{
										animationDelay: "3.5s",
										animationDuration: "3.5s",
									}}></div>
							</div>

							{/* Photo with modern glow */}
							<motion.img
								src='https://i.postimg.cc/QNbcpqNq/ceo.jpg'
								alt='CEO Portrait'
								className='relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[26rem] lg:h-[26rem] object-cover rounded-2xl border-4 border-teal-100/60 z-10'
								whileHover={{ scale: 1.02 }}
								transition={{ type: "spring", stiffness: 200, damping: 18 }}
								style={{
									filter: "brightness(1.05) contrast(1.02) saturate(1.05)",
									boxShadow:
										"0 0 20px rgba(20, 184, 166, 0.15), 0 0 40px rgba(20, 184, 166, 0.08), 0 25px 50px -12px rgba(0, 0, 0, 0.15)",
								}}
							/>

							{/* Inner photo glow */}
							<div
								className='absolute inset-0 rounded-2xl bg-gradient-radial from-teal-50/15 via-transparent to-transparent pointer-events-none z-20 animate-pulse'
								style={{ animationDuration: "4s" }}></div>

							{/* Modern floating particles */}
							<div className='absolute inset-0 pointer-events-none'>
								<div
									className='absolute top-1/5 left-1/4 w-1 h-1 bg-teal-200/50 rounded-full animate-ping'
									style={{
										animationDelay: "0s",
										animationDuration: "3s",
									}}></div>
								<div
									className='absolute top-1/3 right-1/5 w-0.5 h-0.5 bg-teal-300/60 rounded-full animate-ping'
									style={{
										animationDelay: "1s",
										animationDuration: "3.5s",
									}}></div>
								<div
									className='absolute top-1/2 left-1/5 w-1 h-1 bg-teal-200/40 rounded-full animate-ping'
									style={{
										animationDelay: "2s",
										animationDuration: "2.8s",
									}}></div>
								<div
									className='absolute bottom-1/3 right-1/4 w-0.5 h-0.5 bg-teal-300/50 rounded-full animate-ping'
									style={{
										animationDelay: "3s",
										animationDuration: "3.2s",
									}}></div>
								<div
									className='absolute bottom-1/4 left-1/3 w-1 h-1 bg-teal-200/45 rounded-full animate-ping'
									style={{
										animationDelay: "4s",
										animationDuration: "2.7s",
									}}></div>
							</div>

							{/* Modern breathing effect */}
							<div
								className='absolute inset-0 rounded-2xl bg-gradient-radial from-transparent via-teal-100/8 to-transparent pointer-events-none animate-pulse'
								style={{ animationDuration: "4s", animationDelay: "1s" }}></div>
						</div>
					</motion.div>

					{/* CEO Info */}
					<motion.div variants={containerVariants}>
						<motion.h2
							className='text-[#00796a] font-semibold text-xl sm:text-2xl mb-2'
							variants={item}>
							{t("ceoName")}
						</motion.h2>
						<motion.p className='text-slate-600 mb-4' variants={item}>
							{t("ceoDescription1")}
						</motion.p>
						<motion.p
							className='text-slate-600 leading-relaxed'
							variants={item}>
							{t("ceoDescription2")}
						</motion.p>

						{/* Secondary profile */}
						<motion.div
							className='mt-8 flex items-center gap-4 p-4 rounded-xl bg-[#00796a]/5 border border-[#00796a]/10'
							variants={item}
							whileHover={{ scale: 1.01 }}
							transition={{ type: "spring", stiffness: 220, damping: 16 }}>
							<div className='relative'>
								{/* Small modern glow effect */}
								<div
									className='absolute inset-0 rounded-full bg-gradient-radial from-teal-50/20 via-teal-100/10 to-transparent animate-pulse'
									style={{
										width: "120%",
										height: "120%",
										animationDuration: "4s",
									}}></div>

								{/* Small modern rays */}
								<div className='absolute inset-0 pointer-events-none'>
									{/* Main cardinal rays */}
									<div
										className='absolute top-0 left-1/2 w-0.5 h-6 bg-gradient-to-b from-teal-200/30 to-transparent transform -translate-x-1/2 -translate-y-1 animate-pulse'
										style={{
											animationDelay: "0s",
											animationDuration: "3s",
										}}></div>
									<div
										className='absolute bottom-0 left-1/2 w-0.5 h-6 bg-gradient-to-t from-teal-200/30 to-transparent transform -translate-x-1/2 translate-y-1 animate-pulse'
										style={{
											animationDelay: "1s",
											animationDuration: "3s",
										}}></div>
									<div
										className='absolute left-0 top-1/2 w-6 h-0.5 bg-gradient-to-r from-teal-200/30 to-transparent transform -translate-y-1/2 -translate-x-1 animate-pulse'
										style={{
											animationDelay: "2s",
											animationDuration: "3s",
										}}></div>
									<div
										className='absolute right-0 top-1/2 w-6 h-0.5 bg-gradient-to-l from-teal-200/30 to-transparent transform -translate-y-1/2 translate-x-1 animate-pulse'
										style={{
											animationDelay: "3s",
											animationDuration: "3s",
										}}></div>
								</div>

								<img
									src='https://i.postimg.cc/QNbcpqNq/ceo.jpg'
									alt='Deputy CEO'
									className='relative w-16 h-16 rounded-full object-cover border-2 border-teal-100/60 z-10'
									style={{
										filter: "brightness(1.05) contrast(1.02) saturate(1.05)",
										boxShadow:
											"0 0 10px rgba(20, 184, 166, 0.15), 0 0 20px rgba(20, 184, 166, 0.08)",
									}}
								/>

								{/* Small modern particles */}
								<div className='absolute inset-0 pointer-events-none'>
									<div
										className='absolute top-1/4 left-1/3 w-0.5 h-0.5 bg-teal-200/50 rounded-full animate-ping'
										style={{
											animationDelay: "0s",
											animationDuration: "3s",
										}}></div>
									<div
										className='absolute bottom-1/4 right-1/3 w-0.5 h-0.5 bg-teal-300/60 rounded-full animate-ping'
										style={{
											animationDelay: "2s",
											animationDuration: "3.5s",
										}}></div>
								</div>

								{/* Small modern breathing effect */}
								<div
									className='absolute inset-0 rounded-full bg-gradient-radial from-transparent via-teal-100/8 to-transparent pointer-events-none animate-pulse'
									style={{
										animationDuration: "4s",
										animationDelay: "1s",
									}}></div>
							</div>
							<div>
								<p className='text-slate-800 font-semibold'>{t("deputyCEO")}</p>
								<p className='text-slate-500 text-sm'>
									{t("chiefOperationsOfficer")}
								</p>
							</div>
						</motion.div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default Ceo;
