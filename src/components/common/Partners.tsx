/** @format */

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LogoLoop from "./LogoLoop";
import { useContactInfo } from "../../hooks/useContactInfo";
import { ContactInfo } from "../../services/contactInfoApi";

const Partners: React.FC = () => {
	const { t } = useTranslation();
	const { data: contactInfo, isLoading, error } = useContactInfo();

	// Use API data if available, otherwise fallback to sample data
	const partnerLogos = (contactInfo as ContactInfo)?.partners?.length > 0 
		? (contactInfo as ContactInfo).partners.map((partner) => ({
			src: partner.src,
			alt: partner.alt,
			title: partner.title,
			href: partner.href
		}))
		: [
			{
				src: "https://picsum.photos/120/60?random=1",
				alt: "Medical Partner 1",
				title: "Medical Partner 1",
				href: "https://partner1.com"
			},
			{
				src: "https://picsum.photos/120/60?random=2",
				alt: "Medical Partner 2", 
				title: "Medical Partner 2",
				href: "https://partner2.com"
			},
			{
				src: "https://picsum.photos/120/60?random=3",
				alt: "Medical Partner 3",
				title: "Medical Partner 3", 
				href: "https://partner3.com"
			},
			{
				src: "https://picsum.photos/120/60?random=4",
				alt: "Medical Partner 4",
				title: "Medical Partner 4",
				href: "https://partner4.com"
			},
			{
				src: "https://picsum.photos/120/60?random=5",
				alt: "Medical Partner 5",
				title: "Medical Partner 5",
				href: "https://partner5.com"
			},
			{
				src: "https://picsum.photos/120/60?random=6",
				alt: "Medical Partner 6",
				title: "Medical Partner 6",
				href: "https://partner6.com"
			},
			{
				src: "https://picsum.photos/120/60?random=7",
				alt: "Medical Partner 7",
				title: "Medical Partner 7",
				href: "https://partner7.com"
			},
			{
				src: "https://picsum.photos/120/60?random=8",
				alt: "Medical Partner 8",
				title: "Medical Partner 8",
				href: "https://partner8.com"
			}
		];

	// Don't render if loading or no partners
	if (isLoading) {
		return (
			<section id='partners' className='py-16 sm:py-20 md:py-24 bg-gray-50 relative overflow-hidden'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
					<div className='text-center'>
						<div className='animate-pulse bg-gray-200 h-8 w-64 mx-auto mb-4 rounded'></div>
						<div className='animate-pulse bg-gray-200 h-4 w-96 mx-auto rounded'></div>
					</div>
				</div>
			</section>
		);
	}

	if (error || !partnerLogos.length) {
		return null; // Don't render partners section if there's an error or no partners
	}

	return (
		<section id='partners' className='py-16 sm:py-20 md:py-24 bg-gray-50 relative overflow-hidden'>
			{/* Background decoration */}
			<div className='absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-primary-100/20'></div>
			<div className='absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-200/20 to-transparent rounded-full transform translate-x-32 -translate-y-32'></div>
			<div className='absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary-200/20 to-transparent rounded-full transform -translate-x-24 translate-y-24'></div>

			<div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className='text-center mb-12 sm:mb-16'>
					<motion.div
						initial={{ opacity: 0, scale: 0.5 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2, duration: 0.8 }}
						className='inline-flex items-center space-x-1.5 sm:space-x-2 bg-primary-100 px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-full border border-primary-200 mb-3 sm:mb-4 md:mb-6'>
						<span className='text-primary-700 font-medium text-xs sm:text-sm md:text-base'>
							{t('trustedPartners')}
						</span>
					</motion.div>

					<h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-500 mb-3 sm:mb-4 md:mb-6 text-center`}>
						{t('ourPartners')}
					</h2>
					<p className={`text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed text-center`}>
						{t('partnersDescription')}
					</p>
				</motion.div>

				{/* Logo Loop Container */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.3 }}
					className='relative'>
					<div className='bg-white rounded-2xl sm:rounded-3xl w-full p-6 sm:p-8 md:p-10 border border-gray-100'>
						<div className="h-20 sm:h-24 flex items-center">
							<LogoLoop
								logos={partnerLogos}
								speed={60}
								direction="left"
								logoHeight={60}
								gap={80}
								pauseOnHover
								scaleOnHover
								fadeOut
								fadeOutColor="#f9fafb"
								ariaLabel="Trusted partners and clients"
								className="w-full h-full"
							/>
						</div>
					</div>
				</motion.div>

				{/* Additional Info */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.5 }}
					className='text-center mt-8 sm:mt-12'>
					<p className='text-sm text-gray-500 max-w-2xl mx-auto'>
						{t('partnersNote')}
					</p>
				</motion.div>
			</div>
		</section>
	);
};

export default Partners;
