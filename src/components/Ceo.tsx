/** @format */

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

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
						<motion.img
							src='https://i.postimg.cc/QNbcpqNq/ceo.jpg'
							alt='CEO Portrait'
							className='w-72 h-72 sm:w-80 sm:h-80 lg:w-[26rem] lg:h-[26rem] object-cover rounded-2xl shadow-2xl border-4 border-[#00796a]/20'
							whileHover={{ scale: 1.02 }}
							transition={{ type: "spring", stiffness: 200, damping: 18 }}
						/>
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
							<img
								src='https://i.postimg.cc/QNbcpqNq/ceo.jpg'
								alt='Deputy CEO'
								className='w-16 h-16 rounded-full object-cover border-2 border-[#00796a]/30'
							/>
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
