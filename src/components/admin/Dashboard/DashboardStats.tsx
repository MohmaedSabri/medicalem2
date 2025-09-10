/** @format */

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface StatItem {
	label: string;
	value: string;
	color: string;
	icon: React.ComponentType<{ className?: string }>;
	loading: boolean;
}

interface DashboardStatsProps {
	stats: StatItem[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
	const { t } = useTranslation();

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
			{stats.map((stat, index) => (
				<motion.div
					key={stat.label}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
					className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-600 mb-1'>
								{stat.label}
							</p>
							{stat.loading ? (
								<div className='h-8 w-16 bg-gray-200 rounded animate-pulse'></div>
							) : (
								<p className='text-2xl font-bold text-gray-900'>
									{stat.value}
								</p>
							)}
						</div>
						<div
							className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
							<stat.icon className='h-6 w-6 text-white' />
						</div>
					</div>
				</motion.div>
			))}
		</div>
	);
};

export default DashboardStats;
