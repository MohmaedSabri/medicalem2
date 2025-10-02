/** @format */

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Award, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeroStatsProps {
	counters: number[];
	setCounters: React.Dispatch<React.SetStateAction<number[]>>;
	isPageVisible: boolean;
}

const HeroStats: React.FC<HeroStatsProps> = ({ counters, setCounters, isPageVisible }) => {
	const { t } = useTranslation();
	const statsRef = useRef<HTMLDivElement | null>(null);
	const statsInView = useInView(statsRef, { margin: "-100px", amount: 0.3 });
	const [isScrolling, setIsScrolling] = useState(false);
	const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

	// Handle scroll detection
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolling(true);
			
			// Clear existing timeout
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
			
			// Set timeout to detect when scrolling stops
			scrollTimeoutRef.current = setTimeout(() => {
				setIsScrolling(false);
			}, 150); // 150ms delay after scroll stops
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		
		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (statsInView && isPageVisible && !isScrolling) {
			animateCounters();
		} else {
			setCounters([0, 0, 0]);
		}
	}, [statsInView, isPageVisible, isScrolling]);

	return (
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
	);
};

export default HeroStats;
