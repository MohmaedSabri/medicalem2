/** @format */

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, User, AtSign, Package, ChevronDown, Layers } from "lucide-react";
import { ContactForm } from "../types";
import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG, initEmailJS } from "../config/emailjs";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../contexts/ProductsContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

const Contact: React.FC = () => {
	const { products } = useProducts();
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const productIdFromQuery = searchParams.get("productId");
	const preselectedProductId = productIdFromQuery || undefined;

	const [form, setForm] = useState<ContactForm>({
		name: "",
		email: "",
		phone: "",
		message: "",
	});

	const categories = useMemo(
		() => ["All", ...Array.from(new Set(products.map((p) => 
		typeof p.subcategory === 'string' ? p.subcategory : p.subcategory?.name
	)))],
		[products]
	);
	const [selectedCategory, setSelectedCategory] = useState<string>("All");
	const [selectedProductId, setSelectedProductId] = useState<string | undefined>(
		preselectedProductId
	);
	const [quantity, setQuantity] = useState<number>(1);
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

	useEffect(() => {
		if (preselectedProductId && products.length > 0) {
			const product = products.find((p) => p._id === preselectedProductId);
			if (product) {
				setSelectedProductId(product._id);
				setSelectedCategory(typeof product.subcategory === 'string' ? product.subcategory : product.subcategory?.name || "");
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preselectedProductId, products.length]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const selectedProduct =
				selectedProductId !== undefined
					? products.find((p) => p._id === selectedProductId)
					: undefined;
			const orderDetails = selectedProduct
				? `\n\nOrder Details:\n- Product: ${selectedProduct.name}\n- Category: ${typeof selectedProduct.subcategory === 'string' ? selectedProduct.subcategory : selectedProduct.subcategory?.name || ""}\n- Quantity: ${quantity}`
				: selectedCategory !== "All"
				? `\n\nOrder Details:\n- Category: ${selectedCategory}\n- Product: (not selected)\n- Quantity: ${quantity}`
				: "";
			// EmailJS service configuration
			const templateParams = {
				from_name: form.name,
				from_email: form.email,
				from_phone: form.phone,
				message: `${form.message}${orderDetails}`,
				to_name: "MedEquip Pro Team",
			};

			// Send email using EmailJS
			await emailjs.send(
				EMAILJS_CONFIG.SERVICE_ID,
				EMAILJS_CONFIG.TEMPLATE_ID,
				templateParams
			);

			setIsSubmitted(true);
			setForm({ name: "", email: "", phone: "", message: "" });
			setSelectedCategory("All");
			setSelectedProductId(undefined);
			setQuantity(1);

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
			value: "info@medequippro.com",
			description: t('sendUsQuestions'),
		},
		{
			icon: Phone,
			title: t('callUs'),
			value: t('phoneNumberValue'),
			description: t('supportHotline'),
		},
		{
			icon: MapPin,
			title: t('visitUs'),
			value: "123 Healthcare Blvd, Medical District",
			description: "New York, NY 10001",
		},
	];

	return (
		<section id='contact' className='py-20 bg-gray-50 relative pt-24 overflow-hidden'>
			{/* Background decorative elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-burgundy-100/30 rounded-full blur-3xl"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-50/50 rounded-full blur-3xl"></div>
			</div>
			
			<div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className='text-center mb-16'>
					<div className="inline-flex items-center justify-center w-20 h-20 bg-teal-600 rounded-full mb-6 shadow-xl border-4 border-teal-100">
						<Send className="h-10 w-10 text-white" />
					</div>
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
							className='group bg-white p-8 rounded-3xl shadow-xl border-2 border-gray-100 text-center relative overflow-hidden hover:shadow-2xl hover:border-teal-200 transition-all duration-500'>
							
							<motion.div
								whileHover={{ scale: 1.1, rotate: 5 }}
								className='relative inline-flex items-center justify-center w-20 h-20 bg-teal-600 text-white rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-teal-100'>
								<info.icon className='h-10 w-10' />
							</motion.div>
							<div className="relative">
								<h3 className='text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors duration-300'>
									{info.title}
								</h3>
								<p className={`text-lg text-teal-600 font-semibold mb-2 ${info.title === t('callUs') ? 'text-center' : 'text-center'}`}>
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
						<div className="absolute top-0 right-0 w-32 h-32 bg-teal-100/50 rounded-full -translate-y-16 translate-x-16"></div>
						<div className="absolute bottom-0 left-0 w-24 h-24 bg-burgundy-100/50 rounded-full translate-y-12 -translate-x-12"></div>
						
						<div className="relative">
							<div className="flex items-center space-x-3 mb-8">
								<div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-teal-100">
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
								<div className='w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-green-100'>
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
										<label className='block text-sm font-bold text-gray-800 mb-3 flex items-center space-x-2'>
											<User className='h-4 w-4 text-teal-600' />
											<span>{t('fullName')} *</span>
										</label>
										<div className='relative group'>
											<input
												type='text'
												name='name'
												value={form.name}
												onChange={handleChange}
												required
												className='w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white group-hover:border-teal-300 shadow-sm'
												placeholder='John Doe'
											/>
										</div>
									</motion.div>

									<motion.div whileFocus={{ scale: 1.02 }}>
										<label className='block text-sm font-bold text-gray-800 mb-3 flex items-center space-x-2'>
											<AtSign className='h-4 w-4 text-teal-600' />
											<span>{t('emailAddress')} *</span>
										</label>
										<div className='relative group'>
											<input
												type='email'
												name='email'
												value={form.email}
												onChange={handleChange}
												required
												className='w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white group-hover:border-teal-300 shadow-sm'
												placeholder='john@example.com'
											/>
										</div>
									</motion.div>
								</div>

								<motion.div whileFocus={{ scale: 1.02 }}>
																			<label className='block text-sm font-bold text-gray-800 mb-3 flex items-center space-x-2'>
											<Phone className='h-4 w-4 text-teal-600' />
											<span>{t('phoneNumber')}</span>
										</label>
										<div className='relative group'>
											<input
												type='tel'
												name='phone'
												value={form.phone}
												onChange={handleChange}
												className='w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white group-hover:border-teal-300 shadow-sm'
												placeholder={t('phoneNumberPlaceholder')}
												dir="ltr"
											/>
										</div>
								</motion.div>

					{/* Order Selection */}
					<div className='grid sm:grid-cols-2 gap-6'>
						<motion.div whileFocus={{ scale: 1.02 }}>
							<label className='block text-sm font-semibold text-gray-800 mb-2'>
								{t('category')}
							</label>
							<div className='relative'>
								<Layers className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />
								<select
									value={selectedCategory}
									onChange={(e) => {
										setSelectedCategory(e.target.value);
										setSelectedProductId(undefined);
									}}
									className='appearance-none w-full pl-10 pr-10 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white hover:border-teal-300'
								>
									{categories.map((cat, index) => (
										<option key={`${cat}-${index}`} value={cat}>
											{cat}
										</option>
									))}
								</select>
								<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />
							</div>
						</motion.div>

						<motion.div whileFocus={{ scale: 1.02 }}>
							<label className='block text-sm font-semibold text-gray-800 mb-2'>
								{t('product')}
							</label>
							<div className='relative'>
								<Package className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />
								<select
									value={selectedProductId ?? ""}
									onChange={(e) =>
										setSelectedProductId(
											e.target.value || undefined
										)
									}
									className='appearance-none w-full pl-10 pr-10 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-white hover:border-teal-300'
								>
									<option key="select-product" value=''>{t('selectProductOptional')}</option>
									{products
										.filter((p) =>
											selectedCategory === "All" ? true : 
											(typeof p.subcategory === 'string' ? p.subcategory === selectedCategory : p.subcategory?.name === selectedCategory)
										)
										.map((p) => (
											<option key={p._id} value={p._id}>
												{p.name}
											</option>
										))}
								</select>
								<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />
							</div>
						</motion.div>
					</div>

								<div className='grid sm:grid-cols-2 gap-6'>
									<motion.div whileFocus={{ scale: 1.02 }}>
																			<label className='block text-sm font-semibold text-gray-800 mb-2'>
										{t('quantity')}
									</label>
										<div className='flex items-center gap-2'>
											<button type='button' onClick={() => setQuantity(Math.max(1, quantity - 1))} className='px-4 py-4 rounded-xl border-2 border-gray-200 hover:bg-teal-50 hover:border-teal-300 transition-all'>-</button>
											<input
												type='number'
												min={1}
												value={quantity}
												onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
												className='w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-center bg-white'
											/>
											<button type='button' onClick={() => setQuantity(quantity + 1)} className='px-4 py-4 rounded-xl border-2 border-gray-200 hover:bg-teal-50 hover:border-teal-300 transition-all'>+</button>
										</div>
									</motion.div>
								</div>

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
										className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none bg-white'
										placeholder={t('tellUsAboutNeeds')}
									/>
									<p className='text-xs text-gray-500 mt-1'>{t('includeDeliveryInfo')}</p>
								</motion.div>

								<motion.button
									type='submit'
									disabled={isSubmitting}
									whileHover={{ scale: 1.02, y: -2 }}
									whileTap={{ scale: 0.98 }}
									className='w-full bg-teal-600 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 hover:bg-teal-700 disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group shadow-lg hover:shadow-xl hover:shadow-teal-500/25 border-2 border-teal-100'>
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
						<div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-teal-400/10 to-blue-400/10 rounded-full translate-y-12 translate-x-12"></div>
						
						<div className="relative">
							<div className="flex items-center space-x-3 mb-8">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
									<Package className="h-6 w-6 text-white" />
								</div>
								<h3 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent'>
									{t('orderSummary')}
								</h3>
							</div>
						<div className='space-y-4 mb-8'>
							<div className='flex items-center gap-3 text-gray-700'>
								<Package className='h-5 w-5 text-teal-600' />
								<span className='font-medium'>
									{selectedProductId ? products.find((p) => p._id === selectedProductId)?.name : t('noProductSelected')}
								</span>
							</div>
							<div className='flex items-center gap-3 text-gray-700'>
								<MapPin className='h-5 w-5 text-teal-600' />
								<span className='font-medium'>{t('category')}: {selectedCategory}</span>
							</div>
							<div className='flex items-center gap-3 text-gray-700'>
								<span className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-sm'>#</span>
								<span className='font-medium'>{t('quantity')}: {quantity}</span>
							</div>
						</div>

						<h3 className='text-2xl font-semibold text-gray-900 mb-6'>
							{t('ourLocation')}
						</h3>
						<div className='relative h-64 bg-gray-100 rounded-lg overflow-hidden'>
							<img
								src='https://images.pexels.com/photos/1692693/pexels-photo-1692693.jpeg?auto=compress&cs=tinysrgb&w=800'
								alt='Medical facility'
								className='w-full h-full object-cover'
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end'>
								<div className='p-4 text-white'>
									<p className='font-semibold'>{t('medEquipProHeadquarters')}</p>
									<p className='text-sm opacity-90'>
										{t('medicalDistrictNewYork')}
									</p>
								</div>
							</div>
						</div>

						<div className='mt-6 space-y-4'>
							<div className='flex items-center space-x-3'>
								<Clock className='h-5 w-5 text-teal-600' />
								<div>
									<p className='font-medium text-gray-900'>{t('businessHours')}</p>
									<p className='text-sm text-gray-600'>
										{t('mondayFriday')}
									</p>
								</div>
							</div>
							<div className='flex items-center space-x-3'>
								<Phone className='h-5 w-5 text-teal-600' />
								<div>
									<p className='font-medium text-gray-900'>{t('emergencySupport')}</p>
									<p className='text-sm text-gray-600'>
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
	);
};

export default Contact;
