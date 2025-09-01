/** @format */

import React, { useState, useEffect } from "react";
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
import { loadProducts } from "../utils/productsLoader";

const Footer: React.FC = () => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();
	const [products, setProducts] = useState<
		Array<{ name: string; href: string }>
	>([]);

	// Load products data for footer
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const data = await loadProducts();
				// Get unique categories and create footer links
				const uniqueCategories = [
					...new Set(data.products.map((p) => p.category)),
				];
				const footerProducts = uniqueCategories.slice(0, 4).map((category) => ({
					name: category,
					href: `/products?category=${category}`,
				}));
				setProducts(footerProducts);
			} catch (error) {
				console.error("Error loading products for footer:", error);
				// Fallback to default products
				setProducts([
					{ name: "Imaging Equipment", href: "/products" },
					{ name: "Diagnostic Tools", href: "/products" },
					{ name: "Monitoring Systems", href: "/products" },
					{ name: "Surgical Equipment", href: "/products" },
				]);
			}
		};
		fetchProducts();
	}, []);

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
								alt='MedEquip Pro Logo'
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
						<div className='flex items-center space-x-2'>
							<Activity className='h-8 w-8 text-teal-400' />
							<span className='text-xl font-bold'>MedEquip Pro</span>
						</div>
						<p className='text-gray-400 leading-relaxed'>
							{t('leadingProvider')}
						</p>
						<div className='space-y-4'>
							<div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
								<Mail className='h-5 w-5 text-teal-400' />
								<span className='text-gray-300'>info@medequippro.com</span>
							</div>
							<div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
								<Phone className='h-5 w-5 text-teal-400' />
								<span className='text-gray-300' dir="ltr">+1 (555) 123-4567</span>
							</div>
							<div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
								<MapPin className='h-5 w-5 text-teal-400' />
								<span className='text-gray-300'>
									123 Healthcare Blvd, NY 10001
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
						<h3 className='text-lg font-semibold'>Products</h3>
						<ul className='space-y-4'>
							{products.map((product) => (
								<li key={product.name}>
									<motion.a
										href={product.href}
										whileHover={{ x: 5 }}
										className='text-gray-400 hover:text-teal-400 transition-colors'>
										{product.name}
									</motion.a>
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

						<div className='flex space-x-4'>
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
					className='border-t border-gray-800 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0'>
					<p className='text-gray-400 text-sm'>
						{t('allRightsReserved')}
					</p>
					<div className='flex space-x-6 text-sm'>
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
