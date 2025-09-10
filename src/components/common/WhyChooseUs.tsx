/** @format */

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Award, Clock, Users, Zap, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";

const WhyChooseUs: React.FC = () => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();
	const [counters, setCounters] = useState([0, 0, 0, 0]);
	const statsRef = useRef<HTMLDivElement | null>(null);
	const statsInView = useInView(statsRef, { margin: "-100px", amount: 0.3 });

	const stats = useMemo(() => [
		{ label: t('yearsExperience'), value: 15, suffix: "+", icon: Shield },
		{ label: t('certifiedProducts'), value: 500, suffix: "+", icon: Award },
		{ label: t('countriesServed'), value: 25, suffix: "+", icon: Clock },
		{ label: t('happyClients'), value: 10000, suffix: "+", icon: Users },
	], [t]);

	const features = useMemo(() => [
		{
			icon: Zap,
			title: t('cuttingEdgeTechnology'),
			description: t('cuttingEdgeDescription'),
		},
		{
			icon: Shield,
			title: t('fdaCertified'),
			description: t('fdaDescription'),
		},
		{
			icon: Heart,
			title: t('support247'),
			description: t('supportDescription'),
		},
	], [t]);

	const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

	const animateCounters = useCallback(() => {
		const durationMs = 1800;
		const start = performance.now();
		const frame = (now: number) => {
			const p = Math.min(1, (now - start) / durationMs);
			const eased = easeOutCubic(p);
			setCounters(stats.map((s) => Math.floor(s.value * eased)) as unknown as number[]);
			if (p < 1) requestAnimationFrame(frame);
		};
		requestAnimationFrame(frame);
	}, [stats]);

	useEffect(() => {
		if (statsInView) {
			animateCounters();
		} else {
			setCounters([0, 0, 0, 0]);
		}
	}, [statsInView, animateCounters]);

	return (
		<section id='about' className='py-20 bg-white relative pt-24'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className='text-center mb-16'>
					<h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4'>
						{t('whyChooseMedEquipPro')}
					</h2>
					<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
						{t('whyChooseDescription')}
					</p>
				</motion.div>

				{/* Stats Counter */}
				<motion.div
					ref={statsRef}
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className='grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20'>
					{stats.map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							whileHover={{ y: -8, scale: 1.03 }}
							className='relative bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group overflow-hidden cursor-pointer'>
								<div className='text-center'>
									<div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-xl mb-4 shadow-lg'>
										<stat.icon className='h-8 w-8' />
									</div>
									<div className='text-3xl lg:text-4xl font-bold text-gray-900 mb-2 tabular-nums duration-300'>
										{new Intl.NumberFormat().format(counters[index])}
										{stat.suffix}
									</div>
									<div className='text-gray-600 font-medium text-sm  duration-300'>
										{stat.label}
									</div>
								</div>
							</motion.div>
					))}
				</motion.div>

				{/* Features Grid */}
				<div className='grid lg:grid-cols-3 gap-8'>
												{features.map((feature, index) => (
								<motion.div
									key={feature.title}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: index * 0.2 }}
									whileHover={{ y: -8, scale: 1.02 }}
									className='relative bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer group'>
									<div className='text-center'>
										<div className='inline-flex items-center justify-center w-20 h-20 bg-[#00B4C1] text-white rounded-xl mb-6 shadow-lg'>
											<feature.icon className='h-10 w-10' />
										</div>
										<h3 className='text-xl font-semibold text-gray-900 mb-4 group-hover:text-[#00B4C1] transition-colors duration-300'>
											{feature.title}
										</h3>
										<p className='text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300'>
											{feature.description}
										</p>
									</div>
								</motion.div>
							))}
				</div>

				{/* Modern CTA Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className='mt-20'>
					<div className='bg-gray-50 rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden'>
						{/* Background decoration */}
						<div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full opacity-20 transform translate-x-16 -translate-y-16'></div>
						<div className='absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-100 to-teal-200 rounded-full opacity-20 transform -translate-x-12 translate-y-12'></div>
						
						<div className='relative z-10 max-w-4xl mx-auto'>
							<div className='flex flex-col lg:flex-row items-center justify-between gap-8'>
								{/* Left Content */}
								<div className='flex-1 text-left'>
									<motion.div
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.6, delay: 0.2 }}
										className='mb-6'>
										<p className='text-sm text-gray-500 font-medium tracking-wide uppercase mb-4 leading-[]'>
											{t('since2008')}
										</p>
										<h3 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 ${isRTL ? 'text-right' : 'leading-tight'}`}>
											<div className={isRTL ? 'mb-4' : ''}>{t('weRiseInCare')}</div>
											<span className='text-gray-700'>{t('toMakeAnImpact')}</span>
										</h3>
										<p className={`text-lg text-gray-600 max-w-2xl ${isRTL ? 'text-right' : 'leading-relaxed'}`}>
											{t('drivenByOneGoal')}
										</p>
									</motion.div>
								</div>
								
								{/* Right Button */}
								<div className='flex-shrink-0'>
									<motion.button
										whileHover={{ scale: 1.05, y: -3 }}
										whileTap={{ scale: 0.98 }}
										className='group relative inline-flex items-center gap-3 bg-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl hover:shadow-teal-500/50 hover:bg-teal-700 transition-all duration-500 ease-out overflow-hidden'
										onClick={() =>
											document
												.getElementById("contact")
												?.scrollIntoView({ behavior: "smooth" })
										}>
										{/* Animated background glow */}
										<div className='absolute inset-0 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full'></div>
										
										{/* Sparkle effects */}
										<div className='absolute inset-0 overflow-hidden rounded-full'>
											<div className='absolute top-2 left-4 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-100'></div>
											<div className='absolute top-3 right-6 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 delay-200'></div>
											<div className='absolute bottom-3 left-8 w-1 h-1 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300 delay-300'></div>
											<div className='absolute bottom-2 right-4 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-400'></div>
										</div>

										{/* Button content */}
										<div className='relative z-10 flex items-center gap-3'>
											<span className='w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold group-hover:bg-opacity-30 transition-all duration-300'>
												+
											</span>
											<span className='group-hover:drop-shadow-lg transition-all duration-300'>{t('getFreeConsultation')}</span>
										</div>
									</motion.button>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default WhyChooseUs;
