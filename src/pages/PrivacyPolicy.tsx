/** @format */

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import {
	Shield,
	Eye,
	Lock,
	Database,
	Users,
	Globe,
	FileText,
	Clock,
	Mail,
	Phone,
	ArrowRight,
} from "lucide-react";
import Footer from "../components/layout/Footer";

const PrivacyPolicy: React.FC = () => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0 },
	};

	const privacySections = [
		{
			icon: Eye,
			title: t("informationCollection"),
			content: t("informationCollectionContent"),
			color: "bg-teal-600",
			bgColor: "bg-teal-50",
		},
		{
			icon: Database,
			title: t("dataUsage"),
			content: t("dataUsageContent"),
			color: "bg-teal-600",
			bgColor: "bg-teal-50",
		},
		{
			icon: Lock,
			title: t("dataProtection"),
			content: t("dataProtectionContent"),
			color: "bg-teal-600",
			bgColor: "bg-teal-50",
		},
		{
			icon: Users,
			title: t("dataSharing"),
			content: t("dataSharingContent"),
			color: "bg-teal-600",
			bgColor: "bg-teal-50",
		},
		{
			icon: Globe,
			title: t("cookies"),
			content: t("cookiesContent"),
			color: "bg-teal-600",
			bgColor: "bg-teal-50",
		},
		{
			icon: FileText,
			title: t("yourRights"),
			content: t("yourRightsContent"),
			color: "bg-teal-600",
			bgColor: "bg-teal-50",
		},
		{
			icon: Clock,
			title: t("policyUpdates"),
			content: t("policyUpdatesContent"),
			color: "bg-teal-600",
			bgColor: "bg-teal-50",
		},
	];

	return (
		<div className='min-h-screen bg-white'>
			{/* Simple Background Pattern */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute top-10 left-10 w-8 h-8 border-2 border-teal-200 transform rotate-45'></div>
				<div className='absolute top-20 right-20 w-6 h-6 border-2 border-teal-200 transform rotate-45'></div>
				<div className='absolute bottom-20 left-16 w-10 h-10 border-2 border-teal-200 transform rotate-45'></div>
				<div className='absolute bottom-10 right-10 w-7 h-7 border-2 border-teal-200 transform rotate-45'></div>
			</div>

			{/* Hero Section */}
			<motion.section
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
				className='relative overflow-hidden'>
				{/* Hero Background */}
				<div className='absolute inset-0 bg-[#00796a]'>
					<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
				</div>

				<div className='relative z-10 container mx-auto px-6 py-24 md:py-32 lg:py-40'>
					<div className='max-w-5xl mx-auto text-center'>
						<motion.div
							initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
							animate={{ scale: 1, opacity: 1, rotate: 0 }}
							transition={{
								duration: 0.8,
								delay: 0.2,
								type: "spring",
								bounce: 0.3,
							}}
							className='mb-8'>
							<div className='inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-3xl shadow-2xl mb-8'>
								<Shield className='h-12 w-12 text-white' />
							</div>
						</motion.div>

						<motion.h1
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.3 }}
							className='text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-white leading-tight'>
							{t("privacyPolicy")}
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className='text-xl md:text-2xl text-teal-100 leading-relaxed max-w-4xl mx-auto font-light'>
							{t("privacyPolicySubtitle")}
						</motion.p>

						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.6 }}
							className='mt-12 inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-teal-100'>
							<Clock className='h-4 w-4 mr-2' />
							<span className='text-sm font-medium'>
								{t("lastUpdated")}: {t("lastUpdatedDate")}
							</span>
						</motion.div>
					</div>
				</div>

				{/* Wave Separator */}
				<div className='absolute bottom-0 left-0 w-full overflow-hidden leading-none'>
					<svg
						className='relative block w-full h-16'
						viewBox='0 0 1200 120'
						preserveAspectRatio='none'>
						<path
							d='M0,120V60c240,-60,480,60,720,0s480,-60,720,0V120Z'
							className='fill-white'></path>
					</svg>
				</div>
			</motion.section>

			{/* Main Content */}
			<section className='py-20 lg:py-28 relative z-10'>
				<div className='container mx-auto px-6'>
					<div className='max-w-6xl mx-auto'>
						{/* Introduction */}
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-100px" }}
							transition={{ duration: 0.8 }}
							className='mb-20'>
							<div className='bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 p-10 lg:p-16 relative overflow-hidden'>
								<div className='absolute top-0 left-0 w-full h-2 bg-teal-600'></div>

								<div className='relative z-10'>
									<h2 className='text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight'>
										{t("introduction")}
									</h2>
									<div className='prose prose-xl max-w-none text-slate-700 leading-relaxed space-y-6'>
										<p className='text-lg font-light'>
											{t("introductionContent")}
										</p>
										<p className='text-lg font-light'>
											{t("introductionContent2")}
										</p>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Privacy Sections Grid */}
						<motion.div
							variants={containerVariants}
							initial='hidden'
							whileInView='visible'
							viewport={{ once: true, margin: "-100px" }}
							className='grid gap-8 lg:gap-10'>
							{privacySections.map((section, index) => (
								<motion.div
									key={index}
									variants={itemVariants}
									transition={{ duration: 0.7, ease: "easeOut" }}
									whileHover={{
										scale: 1.02,
										transition: { duration: 0.3, ease: "easeOut" },
									}}
									className='group relative'>
									<div
										className={`bg-white/90 backdrop-blur-sm rounded-3xl border border-white/50 p-8 lg:p-12 relative overflow-hidden transition-all duration-500 ${section.bgColor}/20 hover:bg-opacity-100`}>
										{/* Background Pattern */}
										<div className='absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-500'>
											<section.icon className='w-full h-full text-slate-400' />
										</div>

										<div
											className={`flex ${
												isRTL ? "flex-row-reverse" : "flex-row"
											} items-start gap-8`}>
											<div className='flex-shrink-0'>
												<div
													className={`w-20 h-20 ${section.color} rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
													<section.icon className='h-10 w-10 text-white' />
												</div>
											</div>

											<div className='flex-1 min-w-0'>
												<h3 className='text-2xl md:text-3xl font-bold text-slate-900 mb-6 group-hover:text-slate-800 transition-colors duration-300'>
													{section.title}
												</h3>
												<div className='prose prose-lg max-w-none text-slate-700 leading-relaxed'>
													<p className='text-lg font-light group-hover:text-slate-800 transition-colors duration-300'>
														{section.content}
													</p>
												</div>
											</div>
										</div>

										{/* Hover Arrow */}
										<div className='absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0'>
											<ArrowRight className='h-6 w-6 text-slate-400' />
										</div>
									</div>
								</motion.div>
							))}
						</motion.div>

						{/* Contact Information */}
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-100px" }}
							transition={{ duration: 0.8 }}
							className='mt-20'>
							<div className='relative bg-[#00796a] rounded-3xl shadow-2xl overflow-hidden'>
								{/* Background Pattern */}
								<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

								<div className='relative z-10 p-10 lg:p-16'>
									<div className='max-w-4xl mx-auto text-center'>
										<motion.div
											initial={{ scale: 0.8, opacity: 0 }}
											whileInView={{ scale: 1, opacity: 1 }}
											viewport={{ once: true }}
											transition={{ duration: 0.6 }}
											className='mb-8'>
											<div className='inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6'>
												<Mail className='h-8 w-8 text-teal-300' />
											</div>
										</motion.div>

										<h2 className='text-4xl md:text-5xl font-bold text-white mb-6 leading-tight'>
											{t("contactUs")}
										</h2>
										<p className='text-xl text-teal-100 mb-12 leading-relaxed max-w-2xl mx-auto font-light'>
											{t("privacyContactDescription")}
										</p>

										<div className='grid md:grid-cols-2 gap-8 max-w-2xl mx-auto'>
											<motion.div
												whileHover={{ scale: 1.05 }}
												transition={{ duration: 0.3 }}
												className='bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300'>
												<div className='flex items-center justify-center w-12 h-12 bg-teal-500 rounded-xl mb-4 mx-auto'>
													<Mail className='h-6 w-6 text-white' />
												</div>
												<h3 className='text-xl font-semibold text-white mb-3'>
													{t("emailUs")}
												</h3>
												<p className='text-teal-100 font-medium'>
													privacy@dorarmed.com
												</p>
											</motion.div>

											<motion.div
												whileHover={{ scale: 1.05 }}
												transition={{ duration: 0.3 }}
												className='bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300'>
												<div className='flex items-center justify-center w-12 h-12 bg-teal-500 rounded-xl mb-4 mx-auto'>
													<Phone className='h-6 w-6 text-white' />
												</div>
												<h3 className='text-xl font-semibold text-white mb-3'>
													{t("callUs")}
												</h3>
												<p className='text-teal-100 font-medium' dir='ltr'>
													+971 55 670 7773
												</p>
											</motion.div>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
};

export default PrivacyPolicy;
