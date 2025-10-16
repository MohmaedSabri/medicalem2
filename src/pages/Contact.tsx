/** @format */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, User, AtSign } from "lucide-react";
import { ContactForm } from "../types";
import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG, initEmailJS } from "../config/emailjs";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import { toast } from "react-hot-toast";
import Contactinfo from "../constant/Contactinfo";
import Footer from "../components/layout/Footer";

const Contact: React.FC = () => {
	const { t } = useTranslation();
	const { currentLanguage, isRTL } = useLanguage();

	const [form, setForm] = useState<ContactForm>({
		name: "",
		email: "",
		phone: "",
		message: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Initialize EmailJS
	useEffect(() => {
		// Only initialize on client side
		if (typeof window !== "undefined") {
			initEmailJS();
		}
	}, []);


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			// EmailJS service configuration
			const templateParams = {
				from_name: form.name,
				from_email: form.email,
				from_phone: form.phone,
				message: form.message,
				to_name: "Dorar Team",
			};

			// Send email using EmailJS
			await emailjs.send(
				EMAILJS_CONFIG.SERVICE_ID,
				EMAILJS_CONFIG.TEMPLATE_ID,
				templateParams
			);

			setIsSubmitted(true);
			setForm({ name: "", email: "", phone: "", message: "" });

			// Reset success message after 5 seconds
			setTimeout(() => {
				setIsSubmitted(false);
			}, 5000);
		} catch {
			// EmailJS Error
			toast.error("Failed to send message. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const contactInfo = [
		{
			icon: Mail,
			title: t('emailUs'),
			value: Contactinfo.email,
			description: t('sendUsQuestions'),
		},
		{
			icon: Phone,
			title: t('callUs'),
			value: Contactinfo.phone,
			description: t('supportHotline'),
		},
		{
			icon: MapPin,
			title: t('visitUs'),
			value: Contactinfo.address,
			description: "Dubai, UAE",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<section id='contact' className='py-20 bg-gray-50 relative pt-24 overflow-hidden flex-1'>
				{/* Background decorative elements */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100/30 rounded-full blur-3xl"></div>
					<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-burgundy-100/30 rounded-full blur-3xl"></div>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-50/50 rounded-full blur-3xl"></div>
				</div>
				
				<div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-4'>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='text-center mb-16'>
						<h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4'>
							{t('getInTouch')}
						</h2>
						<p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
							{t('readyToUpgrade')}
						</p>
					</motion.div>

					<div className='grid lg:grid-cols-3 gap-8 mb-16'>
						{contactInfo.map((info, index) => (
							<motion.div
								key={info.title}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								whileHover={{ y: -8, scale: 1.02 }}
								className='group bg-white p-8 rounded-3xl shadow-xl border-2 border-gray-100 text-center relative overflow-hidden hover:shadow-2xl hover:border-primary-200 transition-all duration-500'>
								
								<motion.div
									whileHover={{ scale: 1.1, rotate: 5 }}
									className='relative inline-flex items-center justify-center w-20 h-20 bg-primary-600 text-white rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-primary-100'>
									<info.icon className='h-10 w-10' />
								</motion.div>
								<div className="relative">
									<h3 className='text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors duration-300'>
										{info.title}
									</h3>
									<p className={`text-lg text-primary-600 font-semibold mb-2 ${info.title === t('callUs') ? 'text-center' : 'text-center'}`}>
										<span dir="ltr" className="inline-block">
											{info.value}
										</span>
									</p>
									<p className='text-gray-600 leading-relaxed'>{info.description}</p>
								</div>
							</motion.div>
						))}
					</div>

					<div className='grid lg:grid-cols-2 gap-12'>
						{/* Contact Form */}
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
													className='bg-white p-8 rounded-3xl shadow-2xl border-2 border-gray-100 relative overflow-hidden'>
							{/* Decorative background */}
							<div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/50 rounded-full -translate-y-16 translate-x-16"></div>
							<div className="absolute bottom-0 left-0 w-24 h-24 bg-burgundy-100/50 rounded-full translate-y-12 -translate-x-12"></div>
							
							<div className="relative">
								<div className="flex items-center space-x-3 mb-8">
									<div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-primary-100">
										<Send className="h-6 w-6 text-white" />
									</div>
									<h3 className='text-2xl font-bold text-gray-900'>
										{t('sendUsMessage')}
									</h3>
								</div>

							{isSubmitted ? (
								<motion.div
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									className='text-center py-8'>
									<div className='w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-primary-100'>
										<Send className='h-10 w-10 text-white' />
									</div>
									<h4 className='text-2xl font-bold text-gray-900 mb-3'>
										{t('messageSentSuccessfully')}
									</h4>
									<p className='text-gray-600 leading-relaxed'>
										{t('thankYouContacting')}
									</p>
								</motion.div>
							) : (
								<form onSubmit={handleSubmit} className='space-y-6'>
									<div className='grid sm:grid-cols-2 gap-6'>
										<motion.div whileFocus={{ scale: 1.02 }}>
											<label className={`block text-sm font-bold text-gray-800 mb-3 flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-2' : 'space-x-2'}`}>
												<User className='h-4 w-4 text-primary-600' />
												<span>{t('fullName')} *</span>
											</label>
											<div className='relative group'>
												<input
													type='text'
													name='name'
													value={form.name}
													onChange={handleChange}
													required
													className='w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white group-hover:border-primary-300 shadow-sm'
													placeholder='John Doe'
												/>
											</div>
										</motion.div>

										<motion.div whileFocus={{ scale: 1.02 }}>
											<label className={`block text-sm font-bold text-gray-800 mb-3 flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-2' : 'space-x-2'}`}>
												<AtSign className='h-4 w-4 text-primary-600' />
												<span>{t('emailAddress')} *</span>
											</label>
											<div className='relative group'>
												<input
													type='email'
													name='email'
													value={form.email}
													onChange={handleChange}
													required
													className='w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white group-hover:border-primary-300 shadow-sm'
													placeholder='john@example.com'
												/>
											</div>
										</motion.div>
									</div>

									<motion.div whileFocus={{ scale: 1.02 }}>
																		<label className={`block text-sm font-bold text-gray-800 mb-3 flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-2' : 'space-x-2'}`}>
											<Phone className='h-4 w-4 text-primary-600' />
											<span>{t('phoneNumber')}</span>
										</label>
										<div className='relative group'>
											<input
												type='tel'
												name='phone'
												value={form.phone}
												onChange={handleChange}
												className='w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white group-hover:border-primary-300 shadow-sm'
												placeholder={t('phoneNumberPlaceholder')}
												dir="ltr"
											/>
										</div>
									</motion.div>


									<motion.div whileFocus={{ scale: 1.02 }}>
										<label className='block text-sm font-semibold text-gray-800 mb-2'>
											{t('message')} *
										</label>
										<textarea
											name='message'
											value={form.message}
											onChange={handleChange}
											required
											rows={5}
											className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none bg-white'
											placeholder={t('tellUsAboutNeeds')}
										/>
										<p className='text-xs text-gray-500 mt-1'>{t('includeDeliveryInfo')}</p>
									</motion.div>

									<motion.button
										type='submit'
										disabled={isSubmitting}
										whileHover={{ scale: 1.02, y: -2 }}
										whileTap={{ scale: 0.98 }}
										className='w-full bg-primary-600 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 hover:bg-primary-700 disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-primary-500/25 border-2 border-primary-100'>
										{/* Shimmer effect */}
										<div className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>

										{/* Button content */}
										<div className='relative z-10 flex items-center justify-center space-x-3'>
											{isSubmitting ? (
												<>
													<div className='animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent'></div>
													<span className='font-semibold'>{t('sending')}</span>
												</>
											) : (
												<>
													<Send className='h-6 w-6' />
													<span className='font-semibold'>{t('sendMessage')}</span>
												</>
											)}
										</div>
									</motion.button>

									{error && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className='text-red-500 text-center mt-4 p-3 bg-red-50 rounded-lg border border-red-200'>
											{t('failedToSendMessage')}
										</motion.div>
									)}
								</form>
							)}
							</div>
						</motion.div>

						{/* Map/Image */}
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className='bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden'>
							{/* Decorative background */}
							<div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 -translate-x-16"></div>
							<div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-primary-400/10 to-blue-400/10 rounded-full translate-y-12 translate-x-12"></div>
							
							<div className="relative">
								{/* Location Header */}
								<div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'} mb-6`}>
									<div className='w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center'>
										<MapPin className='h-5 w-5 text-white' />
									</div>
									<h3 className={`text-2xl font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
										{t('ourLocation')}
									</h3>
								</div>

								{/* Map Section */}
								<div className='relative h-80 bg-gray-100 rounded-xl overflow-hidden mb-6 shadow-lg'>
									<iframe
										src="https://maps.google.com/maps?q=25.233028,55.319222&hl=en&z=16&output=embed"
										width="100%"
										height="100%"
										style={{ border: 0 }}
										allowFullScreen
										loading="lazy"
										referrerPolicy="no-referrer-when-downgrade"
										title="Dorar Medical Equipment Location"
									/>
									<div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent'>
										<div className={`p-4 text-white ${isRTL ? 'text-right' : 'text-left'}`}>
											<p className='font-bold text-lg flex items-center'>
												<MapPin className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'} text-red-400`} />
												{t('medEquipProHeadquarters')}
											</p>
											<p className='text-sm opacity-90 mt-1'>
												{t('medicalDistrictNewYork')}
											</p>
										</div>
									</div>
								</div>

								{/* Contact Information Section */}
								<div className='space-y-4 mb-6'>
									{/* Sales Phone Number */}
									<a 
										href={`tel:${Contactinfo.phone}`} 
										className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all duration-200 cursor-pointer group`}
									>
										<div className='flex-shrink-0'>
											<div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors'>
												<Phone className='h-6 w-6 text-green-600' />
											</div>
										</div>
										<div className={`${isRTL ? 'mr-4 text-right' : 'ml-4 text-left'} flex-1`}>
											<p className='text-sm text-gray-500 font-medium group-hover:text-gray-600'>
												{currentLanguage === 'ar' ? 'رقم المبيعات' : 'Sales Number'}
											</p>
											<p className='text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors' dir="ltr">
												+971 55 670 7773
											</p>
										</div>
									</a>

									{/* Email Address */}
									<a 
										href={`mailto:${Contactinfo.email}`} 
										className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer group`}
									>
										<div className='flex-shrink-0'>
											<div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors'>
												<Mail className='h-6 w-6 text-blue-600' />
											</div>
										</div>
										<div className={`${isRTL ? 'mr-4 text-right' : 'ml-4 text-left'} flex-1`}>
											<p className='text-sm text-gray-500 font-medium group-hover:text-gray-600'>
												{currentLanguage === 'ar' ? 'الإيميل' : 'Email'}
											</p>
											<p className='text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors'>
												{Contactinfo.email}
											</p>
										</div>
									</a>

									{/* Written Address */}
									<a 
										href="https://maps.google.com/maps?q=25.233028,55.319222&hl=en&z=16" 
										target="_blank" 
										rel="noopener noreferrer"
										className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''} bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all duration-200 cursor-pointer group`}
									>
										<div className='flex-shrink-0'>
											<div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors'>
												<MapPin className='h-6 w-6 text-red-600' />
											</div>
										</div>
										<div className={`${isRTL ? 'mr-4 text-right' : 'ml-4 text-left'} flex-1`}>
											<p className='text-sm text-gray-500 font-medium group-hover:text-gray-600'>
												{currentLanguage === 'ar' ? 'العنوان 📍' : 'Address 📍'}
											</p>
											<p className='text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors leading-relaxed'>
												{t('medicalDistrictNewYork')}
											</p>
											<p className='text-xs text-gray-400 mt-1 group-hover:text-gray-500'>
												{currentLanguage === 'ar' ? 'انقر للحصول على الاتجاهات' : 'Click for directions'}
											</p>
										</div>
									</a>
								</div>

								{/* Info Cards */}
								<div className='space-y-4'>
									{/* Business Hours Card */}
									<div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer group`}>
										<div className='flex-shrink-0'>
											<div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors'>
												<Clock className='h-6 w-6 text-blue-600' />
											</div>
										</div>
										<div className={`${isRTL ? 'mr-4 text-right' : 'ml-4 text-left'} flex-1`}>
											<p className='text-sm text-gray-500 font-medium group-hover:text-gray-600'>
												{currentLanguage === 'ar' ? 'ساعات العمل 🕒' : 'Business Hours 🕒'}
											</p>
											<p className='text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-relaxed'>
												{t('mondayFriday')}
											</p>
										</div>
									</div>

									{/* Emergency Support Card */}
									<div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all duration-200 cursor-pointer group`}>
										<div className='flex-shrink-0'>
											<div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors'>
												<Phone className='h-6 w-6 text-red-600' />
											</div>
										</div>
										<div className={`${isRTL ? 'mr-4 text-right' : 'ml-4 text-left'} flex-1`}>
											<p className='text-sm text-gray-500 font-medium group-hover:text-gray-600'>
												{currentLanguage === 'ar' ? 'الدعم الطارئ 🚨' : 'Emergency Support 🚨'}
											</p>
											<p className='text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors leading-relaxed'>
												{t('available247')}
											</p>
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

export default Contact;
