/** @format */

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Shield, Award, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeroStatsProps {
	counters: number[];
	setCounters: React.Dispatch<React.SetStateAction<number[]>>;
	isPageVisible: boolean;
}

const HeroStats: React.FC<HeroStatsProps> = ({
	counters,
	setCounters,
	isPageVisible,
}) => {
	const { t } = useTranslation();
	const [hasAnimated, setHasAnimated] = useState(false);

	const stats = useMemo(
		() => [
			{ label: t("yearsExperience"), value: 15, suffix: "+", icon: Shield },
			{ label: t("medicalDevices"), value: 500, suffix: "+", icon: Award },
			{ label: t("healthcareClients"), value: 10000, suffix: "+", icon: Users },
		],
		[t]
	);

	const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

	const animateCounters = useCallback(() => {
		const durationMs = 1800;
		const start = performance.now();
		const frame = (now: number) => {
			const p = Math.min(1, (now - start) / durationMs);
			const eased = easeOutCubic(p);
			setCounters(
				stats.map((s) => Math.floor(s.value * eased)) as unknown as number[]
			);
			if (p < 1) requestAnimationFrame(frame);
		};
		requestAnimationFrame(frame);
	}, [setCounters, stats]);

	// Animate counters only when page becomes visible and hasn't animated yet
	useEffect(() => {
		if (isPageVisible && !hasAnimated) {
			animateCounters();
			setHasAnimated(true);
		}
	}, [isPageVisible, hasAnimated, animateCounters]);

	return (
		<div className='grid grid-cols-3 gap-4 sm:gap-6'>
			{stats.map((stat, index) => (
				<motion.div
					key={stat.label}
					className='text-center'
					whileHover={{ scale: 1.05 }}>
					<div className='mx-auto mb-2 w-fit'>
						<stat.icon className='h-6 w-6 sm:h-8 sm:w-8 text-amber-500 animate-color-shift' />
					</div>
					<div className='text-lg sm:text-xl lg:text-2xl font-bold'>
						{counters[index]}
						{stat.suffix}
					</div>
					<div className='text-xs sm:text-sm text-primary-100'>
						{stat.label}
					</div>
				</motion.div>
			))}
		</div>
	);
};

export default HeroStats;
