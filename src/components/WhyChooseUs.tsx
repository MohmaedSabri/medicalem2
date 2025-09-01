/** @format */

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Award, Clock, Users, Zap, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const WhyChooseUs: React.FC = () => {
	const { t } = useTranslation();
	const [counters, setCounters] = useState([0, 0, 0, 0]);
	const statsRef = useRef<HTMLDivElement | null>(null);
	const statsInView = useInView(statsRef, { margin: "-100px", amount: 0.3 });

	const stats = [
		{ label: t('yearsExperience'), value: 15, suffix: "+", icon: Shield },
		{ label: t('certifiedProducts'), value: 500, suffix: "+", icon: Award },
		{ label: t('countriesServed'), value: 25, suffix: "+", icon: Clock },
		{ label: t('happyClients'), value: 10000, suffix: "+", icon: Users },
	];

	const features = [
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
			setCounters([0, 0, 0, 0]);
		}
	}, [statsInView]);

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
							className='relative bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group overflow-hidden'>
								<div className='pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
									<div className='absolute -top-1/2 left-0 right-0 h-full bg-gradient-to-r from-transparent via-teal-100/60 to-transparent rotate-6 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700' />
								</div>
								<div className='text-center'>
									<div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-xl mb-4 shadow-lg ring-0 ring-teal-200/0 group-hover:ring-8 group-hover:ring-teal-50 transition-all duration-300'>
										<stat.icon className='h-8 w-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3' />
									</div>
									<div className='text-3xl lg:text-4xl font-bold text-gray-900 mb-2 tabular-nums'>
										{new Intl.NumberFormat().format(counters[index])}
										{stat.suffix}
									</div>
									<div className='text-gray-600 font-medium text-sm'>
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
							whileHover={{ y: -10, scale: 1.03 }}
							className='relative bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group overflow-hidden'>
								<div className='absolute inset-0 rounded-xl pointer-events-none ring-0 ring-transparent group-hover:ring-2 group-hover:ring-[#00B4C1]/20 transition-all duration-300' />
								<div className='pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 bg-[#00B4C1]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
								<div className='text-center'>
									<div className='inline-flex items-center justify-center w-20 h-20 bg-[#00B4C1] text-white rounded-xl mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105'>
										<feature.icon className='h-10 w-10 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110' />
									</div>
									<h3 className='text-xl font-semibold text-gray-900 mb-4'>
										{feature.title}
									</h3>
									<p className='text-gray-600 leading-relaxed'>
										{feature.description}
									</p>
								</div>
							</motion.div>
					))}
				</div>

				{/* CTA Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className='text-center mt-20'>
					<div className='bg-[#00B4C1] rounded-2xl p-12 text-white shadow-xl'>
						<h3 className='text-2xl lg:text-3xl font-bold mb-4'>
							{t('readyToTransform')}
						</h3>
						<p className='text-lg mb-8 opacity-90 max-w-2xl mx-auto'>
							{t('transformDescription')}
						</p>
						<motion.button
							whileHover={{ scale: 1.05, y: -2 }}
							whileTap={{ scale: 0.95 }}
							className='bg-white text-[#00B4C1] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl'
							onClick={() =>
								document
									.getElementById("contact")
									?.scrollIntoView({ behavior: "smooth" })
							}>
							{t('getFreeConsultation')}
						</motion.button>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default WhyChooseUs;
