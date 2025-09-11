/** @format */

import React from "react";
import { motion } from "framer-motion";
import {
	Activity,
	Facebook,
	Linkedin,
	Instagram,
	Mail,
	Phone,
	MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";
import { useProducts } from "../../hooks/useProducts";
import { Link } from "react-router-dom";
import Contactinfo from "../../constant/Contactinfo";

const Footer: React.FC = () => {
	const { t } = useTranslation();
	const { currentLanguage, isRTL } = useLanguage();
	const { data: apiProducts = [] } = useProducts();

	// Helper: get localized text from string or {en, ar}
	const getLocalizedProductField = (
		value: string | { en?: string; ar?: string } | null | undefined
	): string => {
		if (!value) return "";
		if (typeof value === "string") return value;
		if (typeof value === "object") {
			return (
				value[currentLanguage as "en" | "ar"] || value.en || value.ar || ""
			);
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
		{ icon: Facebook, href: Contactinfo.facebook, label: "Facebook" },
		{ icon: Linkedin, href: Contactinfo.linkedin, label: "LinkedIn" },
		{ icon: Instagram, href: Contactinfo.instagram, label: "Instagram" },
	];

	return (
		<footer className='bg-gray-900 text-white w-full'>
			<div className='w-full py-16 px-4 sm:px-6 lg:px-8 2xl:px-12'>
				<div
					className={`flex flex-col lg:flex-row lg:justify-between ${
						isRTL ? "lg:space-x-reverse lg:space-x-8" : "lg:space-x-8"
					} space-y-8 lg:space-y-0`}>
					{/* Logo Section */}
					
					<div className='flex flex-col items-center justify-start space-y-6 lg:w-1/4 px-4 sm:px-6 lg:px-4 xl:px-6 2xl:px-8'>
						<button
							type='button'
							aria-label='Scroll to top'
							className='group'
							onClick={() => {
								const home = document.querySelector("#home");
								if (home) {
									home.scrollIntoView({ behavior: "smooth" });
								} else {
									window.scrollTo({ top: 0, behavior: "smooth" });
								}
							}}>
							<img
								src='https://i.postimg.cc/x1bkFGQh/logo.png'
								alt='Dorar Logo'
								className='h-32 w-32 lg:h-40 lg:w-40 object-cover rounded-xl transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-3'
								onError={(e) => {
									console.log('Logo image failed to load:', e);
									e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDA5OTk5Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RE9SQVI8L3RleHQ+Cjwvc3ZnPgo=';
								}}
							/>
						</button>
					</div>

					{/* Company Info */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='space-y-6 lg:w-1/4 px-4 sm:px-6 lg:px-4 xl:px-6 2xl:px-8'>
						<div className='flex items-center gap-2'>
							<Activity className='h-6 w-6 text-teal-400 flex-shrink-0' />
							<span className='text-lg font-bold'>{isRTL ? 'درر' : 'Dorar'}</span>
						</div>
						<p className={`text-gray-400 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
							{t("leadingProvider")}
						</p>
						<div className='space-y-4'>
							<div className='flex items-center gap-2'>
								<Mail className='h-4 w-4 text-teal-400 flex-shrink-0' />
								<span className='text-sm text-gray-300' dir="ltr">{Contactinfo.email}</span>
							</div>
							<div className='flex items-center gap-2'>
								<Phone className='h-4 w-4 text-teal-400 flex-shrink-0' />
								<span className='text-sm text-gray-300' dir='ltr'>
									{Contactinfo.phone}
								</span>
							</div>
							<div className='flex items-center gap-2'>
								<MapPin className='h-4 w-4 text-teal-400 flex-shrink-0' />
								<span className='text-sm text-gray-300'>
									{Contactinfo.address}
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
						className='space-y-6 lg:w-1/4 px-4 sm:px-6 lg:px-4 xl:px-6 2xl:px-8'>
						<h3 className='text-lg font-semibold'>{t("products")}</h3>
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
						className='space-y-6 lg:w-1/4 px-4 sm:px-6 lg:px-4 xl:px-6 2xl:px-8'>
						<h3 className='text-lg font-semibold'>{t("stayConnected")}</h3>
						<p className='text-gray-400'>{t("newsletterDescription")}</p>

						<div
							className={`flex ${
								isRTL ? "space-x-reverse space-x-4" : "space-x-4"
							}`}>
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
					className={`border-t border-gray-800 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 px-4 sm:px-6 lg:px-4 xl:px-6 2xl:px-8 ${
						isRTL ? "sm:flex-row-reverse" : ""
					}`}>
					<p className='text-gray-400 text-sm'>{t("allRightsReserved")}</p>
					<div
						className={`flex ${
							isRTL ? "space-x-reverse space-x-6" : "space-x-6"
						} text-sm`}>
						<Link to='/privacy-policy'>
							<motion.span
								whileHover={{ scale: 1.05 }}
								className='text-gray-400 hover:text-teal-400 transition-colors cursor-pointer'>
								{t("privacyPolicy")}
							</motion.span>
						</Link>
						<Link to='/privacy-policy'>
							<motion.span
								whileHover={{ scale: 1.05 }}
								className='text-gray-400 hover:text-teal-400 transition-colors cursor-pointer'>
								{t("termsOfService")}
							</motion.span>
						</Link>
						<Link to='/privacy-policy'>
							<motion.span
								whileHover={{ scale: 1.05 }}
								className='text-gray-400 hover:text-teal-400 transition-colors cursor-pointer'>
								{t("cookiePolicy")}
							</motion.span>
						</Link>
					</div>
				</motion.div>
			</div>
		</footer>
	);
};

export default Footer;
