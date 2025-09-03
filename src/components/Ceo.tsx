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
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
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
						<div className="relative flex justify-center items-center">
							{/* Sun rays effect - outer glow (much lighter) */}
							<div className="absolute inset-0 rounded-full bg-gradient-radial from-yellow-50/15 via-yellow-25/10 to-transparent animate-pulse" style={{ width: '130%', height: '130%', animationDuration: '6s' }}></div>
							
							{/* Sun rays effect - middle glow (much lighter) */}
							<div className="absolute inset-0 rounded-full bg-gradient-radial from-yellow-100/18 via-yellow-50/12 to-transparent animate-pulse" style={{ width: '115%', height: '115%', animationDuration: '5s', animationDelay: '1.5s' }}></div>
							
							{/* Sun rays effect - inner glow (much lighter) */}
							<div className="absolute inset-0 rounded-full bg-gradient-radial from-yellow-200/20 via-yellow-100/15 to-transparent animate-pulse" style={{ width: '108%', height: '108%', animationDuration: '4s', animationDelay: '3s' }}></div>
							
							{/* Light rays emanating from center (lighter and more alive) */}
							<div className="absolute inset-0 pointer-events-none">
								{/* Main cardinal rays */}
								<div className="absolute top-0 left-1/2 w-0.5 h-24 bg-gradient-to-b from-yellow-100/25 to-transparent transform -translate-x-1/2 -translate-y-8 animate-pulse" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
								<div className="absolute bottom-0 left-1/2 w-0.5 h-24 bg-gradient-to-t from-yellow-100/25 to-transparent transform -translate-x-1/2 translate-y-8 animate-pulse" style={{ animationDelay: '0.2s', animationDuration: '2s' }}></div>
								<div className="absolute left-0 top-1/2 w-24 h-0.5 bg-gradient-to-r from-yellow-100/25 to-transparent transform -translate-y-1/2 -translate-x-8 animate-pulse" style={{ animationDelay: '0.4s', animationDuration: '2s' }}></div>
								<div className="absolute right-0 top-1/2 w-24 h-0.5 bg-gradient-to-l from-yellow-100/25 to-transparent transform -translate-y-1/2 translate-x-8 animate-pulse" style={{ animationDelay: '0.6s', animationDuration: '2s' }}></div>
								
								{/* Diagonal rays */}
								<div className="absolute top-4 left-4 w-0.5 h-18 bg-gradient-to-br from-yellow-100/20 to-transparent transform rotate-45 animate-pulse" style={{ animationDelay: '0.8s', animationDuration: '2.2s' }}></div>
								<div className="absolute top-4 right-4 w-0.5 h-18 bg-gradient-to-bl from-yellow-100/20 to-transparent transform -rotate-45 animate-pulse" style={{ animationDelay: '1s', animationDuration: '2.2s' }}></div>
								<div className="absolute bottom-4 left-4 w-0.5 h-18 bg-gradient-to-tr from-yellow-100/20 to-transparent transform -rotate-45 animate-pulse" style={{ animationDelay: '1.2s', animationDuration: '2.2s' }}></div>
								<div className="absolute bottom-4 right-4 w-0.5 h-18 bg-gradient-to-tl from-yellow-100/20 to-transparent transform rotate-45 animate-pulse" style={{ animationDelay: '1.4s', animationDuration: '2.2s' }}></div>
								
								{/* Secondary rays */}
								<div className="absolute top-1/4 left-1/4 w-0.5 h-14 bg-gradient-to-br from-yellow-50/18 to-transparent transform rotate-22 animate-pulse" style={{ animationDelay: '1.6s', animationDuration: '2.5s' }}></div>
								<div className="absolute top-1/4 right-1/4 w-0.5 h-14 bg-gradient-to-bl from-yellow-50/18 to-transparent transform -rotate-22 animate-pulse" style={{ animationDelay: '1.8s', animationDuration: '2.5s' }}></div>
								<div className="absolute bottom-1/4 left-1/4 w-0.5 h-14 bg-gradient-to-tr from-yellow-50/18 to-transparent transform -rotate-22 animate-pulse" style={{ animationDelay: '2s', animationDuration: '2.5s' }}></div>
								<div className="absolute bottom-1/4 right-1/4 w-0.5 h-14 bg-gradient-to-tl from-yellow-50/18 to-transparent transform rotate-22 animate-pulse" style={{ animationDelay: '2.2s', animationDuration: '2.5s' }}></div>
								
								{/* Tertiary rays for more life */}
								<div className="absolute top-1/6 left-1/6 w-0.5 h-10 bg-gradient-to-br from-yellow-25/15 to-transparent transform rotate-12 animate-pulse" style={{ animationDelay: '2.4s', animationDuration: '3s' }}></div>
								<div className="absolute top-1/6 right-1/6 w-0.5 h-10 bg-gradient-to-bl from-yellow-25/15 to-transparent transform -rotate-12 animate-pulse" style={{ animationDelay: '2.6s', animationDuration: '3s' }}></div>
								<div className="absolute bottom-1/6 left-1/6 w-0.5 h-10 bg-gradient-to-tr from-yellow-25/15 to-transparent transform -rotate-12 animate-pulse" style={{ animationDelay: '2.8s', animationDuration: '3s' }}></div>
								<div className="absolute bottom-1/6 right-1/6 w-0.5 h-10 bg-gradient-to-tl from-yellow-25/15 to-transparent transform rotate-12 animate-pulse" style={{ animationDelay: '3s', animationDuration: '3s' }}></div>
							</div>
							
							{/* Photo with very light glow */}
							<motion.img
								src='https://i.postimg.cc/QNbcpqNq/ceo.jpg'
								alt='CEO Portrait'
								className='relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[26rem] lg:h-[26rem] object-cover rounded-2xl border-4 border-yellow-50/50 z-10'
								whileHover={{ scale: 1.02 }}
								transition={{ type: "spring", stiffness: 200, damping: 18 }}
								style={{
									filter: 'brightness(1.05) contrast(1.02) saturate(1.05)',
									boxShadow: '0 0 20px rgba(255, 215, 0, 0.15), 0 0 40px rgba(255, 215, 0, 0.08), 0 25px 50px -12px rgba(0, 0, 0, 0.15)'
								}}
							/>
							
							{/* Inner photo glow (very light and breathing) */}
							<div className="absolute inset-0 rounded-2xl bg-gradient-radial from-yellow-50/10 via-transparent to-transparent pointer-events-none z-20 animate-pulse" style={{ animationDuration: '5s' }}></div>
							
							{/* More floating light particles for life */}
							<div className="absolute inset-0 pointer-events-none">
								<div className="absolute top-1/5 left-1/4 w-0.5 h-0.5 bg-yellow-100/40 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '2.5s' }}></div>
								<div className="absolute top-1/3 right-1/5 w-1 h-1 bg-yellow-50/50 rounded-full animate-ping" style={{ animationDelay: '0.5s', animationDuration: '3s' }}></div>
								<div className="absolute top-1/2 left-1/5 w-0.5 h-0.5 bg-yellow-100/35 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '2.8s' }}></div>
								<div className="absolute bottom-1/3 right-1/4 w-0.5 h-0.5 bg-yellow-50/45 rounded-full animate-ping" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }}></div>
								<div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-yellow-100/30 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '2.7s' }}></div>
								<div className="absolute top-2/3 right-1/3 w-0.5 h-0.5 bg-yellow-50/40 rounded-full animate-ping" style={{ animationDelay: '2.5s', animationDuration: '3.5s' }}></div>
								<div className="absolute bottom-1/5 right-1/5 w-0.5 h-0.5 bg-yellow-100/35 rounded-full animate-ping" style={{ animationDelay: '3s', animationDuration: '2.9s' }}></div>
								<div className="absolute top-1/4 left-1/2 w-1 h-1 bg-yellow-50/45 rounded-full animate-ping" style={{ animationDelay: '3.5s', animationDuration: '3.1s' }}></div>
							</div>
							
							{/* Breathing effect overlay */}
							<div className="absolute inset-0 rounded-2xl bg-gradient-radial from-transparent via-yellow-25/5 to-transparent pointer-events-none animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
						</div>
					</motion.div>

					{/* CEO Info */}
					<motion.div variants={containerVariants}>
						<motion.h2
							className='text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4'
							variants={item}>
							{t('meetOurCEO')}
						</motion.h2>
						<motion.p
							className='text-[#00796a] font-semibold text-xl sm:text-2xl mb-2'
							variants={item}>
							{t('ceoName')}
						</motion.p>
						<motion.p className='text-slate-600 mb-4' variants={item}>
							{t('ceoDescription1')}
						</motion.p>
						<motion.p
							className='text-slate-600 leading-relaxed'
							variants={item}>
							{t('ceoDescription2')}
						</motion.p>

						{/* Secondary profile */}
						<motion.div
							className='mt-8 flex items-center gap-4 p-4 rounded-xl bg-[#00796a]/5 border border-[#00796a]/10'
							variants={item}
							whileHover={{ scale: 1.01 }}
							transition={{ type: "spring", stiffness: 220, damping: 16 }}>
							<div className="relative">
								{/* Small sun rays effect - outer glow */}
								<div className="absolute inset-0 rounded-full bg-gradient-radial from-yellow-50/15 via-yellow-25/10 to-transparent animate-pulse" style={{ width: '120%', height: '120%', animationDuration: '6s' }}></div>
								
								{/* Small sun rays effect - middle glow */}
								<div className="absolute inset-0 rounded-full bg-gradient-radial from-yellow-100/18 via-yellow-50/12 to-transparent animate-pulse" style={{ width: '110%', height: '110%', animationDuration: '5s', animationDelay: '1.5s' }}></div>
								
								{/* Small light rays emanating from center */}
								<div className="absolute inset-0 pointer-events-none">
									{/* Main cardinal rays */}
									<div className="absolute top-0 left-1/2 w-0.5 h-8 bg-gradient-to-b from-yellow-100/25 to-transparent transform -translate-x-1/2 -translate-y-2 animate-pulse" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
									<div className="absolute bottom-0 left-1/2 w-0.5 h-8 bg-gradient-to-t from-yellow-100/25 to-transparent transform -translate-x-1/2 translate-y-2 animate-pulse" style={{ animationDelay: '0.2s', animationDuration: '2s' }}></div>
									<div className="absolute left-0 top-1/2 w-8 h-0.5 bg-gradient-to-r from-yellow-100/25 to-transparent transform -translate-y-1/2 -translate-x-2 animate-pulse" style={{ animationDelay: '0.4s', animationDuration: '2s' }}></div>
									<div className="absolute right-0 top-1/2 w-8 h-0.5 bg-gradient-to-l from-yellow-100/25 to-transparent transform -translate-y-1/2 translate-x-2 animate-pulse" style={{ animationDelay: '0.6s', animationDuration: '2s' }}></div>
									
									{/* Diagonal rays */}
									<div className="absolute top-1 left-1 w-0.5 h-6 bg-gradient-to-br from-yellow-100/20 to-transparent transform rotate-45 animate-pulse" style={{ animationDelay: '0.8s', animationDuration: '2.2s' }}></div>
									<div className="absolute top-1 right-1 w-0.5 h-6 bg-gradient-to-bl from-yellow-100/20 to-transparent transform -rotate-45 animate-pulse" style={{ animationDelay: '1s', animationDuration: '2.2s' }}></div>
									<div className="absolute bottom-1 left-1 w-0.5 h-6 bg-gradient-to-tr from-yellow-100/20 to-transparent transform -rotate-45 animate-pulse" style={{ animationDelay: '1.2s', animationDuration: '2.2s' }}></div>
									<div className="absolute bottom-1 right-1 w-0.5 h-6 bg-gradient-to-tl from-yellow-100/20 to-transparent transform rotate-45 animate-pulse" style={{ animationDelay: '1.4s', animationDuration: '2.2s' }}></div>
								</div>
								
								<img
									src='https://i.postimg.cc/QNbcpqNq/ceo.jpg'
									alt='Deputy CEO'
									className='relative w-16 h-16 rounded-full object-cover border-2 border-yellow-50/50 z-10'
									style={{
										filter: 'brightness(1.05) contrast(1.02) saturate(1.05)',
										boxShadow: '0 0 10px rgba(255, 215, 0, 0.15), 0 0 20px rgba(255, 215, 0, 0.08)'
									}}
								/>
								
								{/* Small floating light particles */}
								<div className="absolute inset-0 pointer-events-none">
									<div className="absolute top-1/4 left-1/3 w-0.5 h-0.5 bg-yellow-100/40 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '2.5s' }}></div>
									<div className="absolute bottom-1/4 right-1/3 w-0.5 h-0.5 bg-yellow-50/50 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
									<div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-yellow-100/35 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '2.8s' }}></div>
									<div className="absolute bottom-1/3 left-1/4 w-0.5 h-0.5 bg-yellow-50/45 rounded-full animate-ping" style={{ animationDelay: '3s', animationDuration: '3.2s' }}></div>
								</div>
								
								{/* Small breathing effect overlay */}
								<div className="absolute inset-0 rounded-full bg-gradient-radial from-transparent via-yellow-25/5 to-transparent pointer-events-none animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
							</div>
							<div>
								<p className='text-slate-800 font-semibold'>{t('deputyCEO')}</p>
								<p className='text-slate-500 text-sm'>
									{t('chiefOperationsOfficer')}
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
