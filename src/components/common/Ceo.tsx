/** @format */

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useContactInfo } from "../../hooks/useContactInfo";
import { ShineBorder } from "../ui/shine-border";


const Ceo: React.FC = () => {
	const { t } = useTranslation();
	const { data: contactInfo } = useContactInfo();
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
							{/* Photo with shine border */}
							<div className='relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[26rem] lg:h-[26rem] rounded-2xl overflow-hidden'>
								<motion.img
									src={contactInfo?.ceophoto || ''}
									alt={`${t("ceoName")} - CEO Portrait`}
									className='w-full h-full object-cover rounded-2xl'
									whileHover={{ scale: 1.02 }}
									transition={{ type: "spring", stiffness: 200, damping: 18 }}
								/>
								<ShineBorder
								borderWidth={3}
								duration={24}
								shineColor={["#b89a14", "#ebee24", "#d6b80a"]}
								className="rounded-2xl"
								/>

							</div>
						</div>
					</motion.div>

					{/* CEO Info */}
					<motion.div variants={containerVariants}>
						<motion.h2
							className='text-primary-500 font-semibold text-xl sm:text-2xl mb-2'
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
							className='mt-8 flex items-center gap-4 p-4 rounded-xl bg-primary-500/5 border border-primary-500/10'
							variants={item}
							whileHover={{ scale: 1.01 }}
							transition={{ type: "spring", stiffness: 220, damping: 16 }}>
							<div className='relative'>
								<img
									src={contactInfo?.ceosmallphoto || ''}
									alt={`${t("ceoName")} - Deputy CEO`}
									className='w-16 h-16 rounded-full object-cover border-2 border-teal-100/60'
								/>
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
