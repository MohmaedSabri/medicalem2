/** @format */

import React from "react";
import { motion } from "framer-motion";
import {
	Activity,
	Facebook,
	Twitter,
	Linkedin,
	Instagram,
	Mail,
	Phone,
	MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import { useProducts } from "../hooks/useProducts";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
	const { t } = useTranslation();
	const { currentLanguage, isRTL } = useLanguage();
	const { data: apiProducts = [] } = useProducts();

	// Helper: get localized text from string or {en, ar}
	const getLocalizedProductField = (value: string | { en?: string; ar?: string } | null | undefined): string => {
		if (!value) return "";
		if (typeof value === "string") return value;
		if (typeof value === "object") {
			return value[currentLanguage as "en" | "ar"] || value.en || value.ar || "";
		}
		return "";
	};

	// Get featured products for footer (first 4 products)
	const footerProducts = apiProducts.slice(0, 4).map((product) => ({
		id: product._id,
		name: getLocalizedProductField(product.name),
		href: `/product/${product._id}`,
	}));

	const socialLinks = [
		{ icon: Facebook, href: "#", label: "Facebook" },
		{ icon: Twitter, href: "#", label: "Twitter" },
		{ icon: Linkedin, href: "#", label: "LinkedIn" },
		{ icon: Instagram, href: "#", label: "Instagram" },
	];

	return (
		<footer className='bg-gray-900 text-white'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<div className={`flex flex-col lg:flex-row lg:justify-between ${isRTL ? 'lg:space-x-reverse lg:space-x-28' : 'lg:space-x-28'} space-y-8 lg:space-y-0`}>
					{/* Logo Section */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='flex flex-col items-center lg:items-start justify-start space-y-6 lg:w-1/4'>
						<button
							type='button'
							aria-label='Scroll to top'
							className='group'
							onClick={() => {
								const home = document.querySelector('#home');
								if (home) {
									home.scrollIntoView({ behavior: 'smooth' });
								} else {
									window.scrollTo({ top: 0, behavior: 'smooth' });
								}
							}}>
							<img
								src='https://i.postimg.cc/x1bkFGQh/logo.png'
								alt='Dorar Logo'
								className='h-32 w-32 lg:h-40 lg:w-40 object-cover rounded-xl shadow-xl transition-transform duration-200 group-hover:scale-[1.02]'
							/>
						</button>
					</motion.div>

					{/* Company Info */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='space-y-6 lg:w-1/4'>
						<div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
							<Activity className='h-6 w-6 text-teal-400' />
							<span className='text-lg font-bold'>Dorar</span>
						</div>
						<p className='text-gray-400 leading-relaxed'>
							{t('leadingProvider')}
						</p>
						<div className='space-y-4'>
							<div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
								<Mail className='h-4 w-4 mx-2 text-teal-400' />
								<span className='text-sm text-gray-300'>info@dorarmed.com</span>
							</div>
							<div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
								<Phone className='h-4 w-4 mx-2 text-teal-400' />
								<span className='text-sm text-gray-300' dir="ltr">+971 55 670 7773</span>
							</div>
							<div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
								<MapPin className='h-4 mx-2 w-4 text-teal-400' />
								<span className='text-sm text-gray-300'>
									Dubai Healthcare City, Building 40, Office 503, P.O Box: 29968 RAK
								</span>
							</div>
						</div>
					</motion.div>

					{/* Products */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='space-y-6 lg:w-1/4'>
						<h3 className='text-lg font-semibold'>{t('products')}</h3>
						<ul className='space-y-4'>
							{footerProducts.map((product) => (
								<li key={product.id}>
									<Link
										to={product.href}
										className='text-gray-400 hover:text-teal-400 transition-colors block'>
										<motion.span
											whileHover={{ x: isRTL ? -5 : 5 }}
											className='inline-block'>
											{product.name}
										</motion.span>
									</Link>
								</li>
							))}
						</ul>
					</motion.div>

					{/* Newsletter & Social */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className='space-y-6 lg:w-1/4'>
						<h3 className='text-lg font-semibold'>{t('stayConnected')}</h3>
						<p className='text-gray-400'>
							{t('newsletterDescription')}
						</p>

						<div className={`flex ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
							{socialLinks.map((social) => (
								<motion.a
									key={social.label}
									href={social.href}
									whileHover={{ scale: 1.1, y: -2 }}
									className='w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal-400 hover:bg-gray-700 transition-colors'
									aria-label={social.label}>
									<social.icon className='h-5 w-5' />
								</motion.a>
							))}
						</div>
					</motion.div>
				</div>

				{/* Bottom Bar */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className={`border-t border-gray-800 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
					<p className='text-gray-400 text-sm'>
						{t('allRightsReserved')}
					</p>
					<div className={`flex ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'} text-sm`}>
						<motion.a
							href='#'
							whileHover={{ scale: 1.05 }}
							className='text-gray-400 hover:text-teal-400 transition-colors'>
							{t('privacyPolicy')}
						</motion.a>
						<motion.a
							href='#'
							whileHover={{ scale: 1.05 }}
							className='text-gray-400 hover:text-teal-400 transition-colors'>
							{t('termsOfService')}
						</motion.a>
						<motion.a
							href='#'
							whileHover={{ scale: 1.05 }}
							className='text-gray-400 hover:text-teal-400 transition-colors'>
							{t('cookiePolicy')}
						</motion.a>
					</div>
				</motion.div>
			</div>
		</footer>
	);
};

export default Footer;
