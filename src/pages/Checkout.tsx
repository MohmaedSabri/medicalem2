/** @format */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { 
	ShoppingCart, 
	ArrowRight, 
	CreditCard, 
	Banknote, 
	Truck, 
	MapPin,
	User,
	FileText,
	CheckCircle
} from "lucide-react";
import { getCart, getCartTotal, clearCart, CartItem } from "../utils/cart";
import { useProducts } from "../hooks/useProducts";
import { useLanguage } from "../contexts/LanguageContext";
import Footer from "../components/layout/Footer";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { useShippingOptions } from "../hooks/useShipping";

// Dirham SVG Component using the provided SVG
const DirhamIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
	<svg
		className={className}
		viewBox="0 0 344.84 299.91"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M342.14,140.96l2.7,2.54v-7.72c0-17-11.92-30.84-26.56-30.84h-23.41C278.49,36.7,222.69,0,139.68,0c-52.86,0-59.65,0-109.71,0,0,0,15.03,12.63,15.03,52.4v52.58h-27.68c-5.38,0-10.43-2.08-14.61-6.01l-2.7-2.54v7.72c0,17.01,11.92,30.84,26.56,30.84h18.44s0,29.99,0,29.99h-27.68c-5.38,0-10.43-2.07-14.61-6.01l-2.7-2.54v7.71c0,17,11.92,30.82,26.56,30.82h18.44s0,54.89,0,54.89c0,38.65-15.03,50.06-15.03,50.06h109.71c85.62,0,139.64-36.96,155.38-104.98h32.46c5.38,0,10.43,2.07,14.61,6l2.7,2.54v-7.71c0-17-11.92-30.83-26.56-30.83h-18.9c.32-4.88.49-9.87.49-15s-.18-10.11-.51-14.99h28.17c5.37,0,10.43,2.07,14.61,6.01ZM89.96,15.01h45.86c61.7,0,97.44,27.33,108.1,89.94l-153.96.02V15.01ZM136.21,284.93h-46.26v-89.98l153.87-.02c-9.97,56.66-42.07,88.38-107.61,90ZM247.34,149.96c0,5.13-.11,10.13-.34,14.99l-157.04.02v-29.99l157.05-.02c.22,4.84.33,9.83.33,15Z"/>
	</svg>
);


interface CheckoutFormData {
	firstName: string;
	lastName: string;
	phone: string;
	phoneType: 'home' | 'clinic';
	email: string;
	country: string;
	shippingOption: string;
	address: string;
	orderNotes: string;
	paymentMethod: string;
	termsAccepted: boolean;
}

const Checkout: React.FC = () => {
	const navigate = useNavigate();
	const { currentLanguage } = useLanguage();
	const { t } = useTranslation();
	const [cartItems, setCartItems] = useState<CartItem[]>(getCart());
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showCoupon, setShowCoupon] = useState(false);
	const [couponCode, setCouponCode] = useState("");
	const [shippingCost, setShippingCost] = useState(0);

	// Use the same hook as other pages for consistency
	const { data: apiProducts = [], isLoading: loading } = useProducts();

	// Form state
	const [formData, setFormData] = useState<CheckoutFormData>({
		firstName: "",
		lastName: "",
		phone: "",
		phoneType: "home",
		email: "",
		country: "UAE",
		shippingOption: "",
		address: "",
		orderNotes: "",
		paymentMethod: "bank_transfer",
		termsAccepted: false,
	});

	// Helper: get localized text from string or {en, ar}
	const getLocalizedProductField = useCallback((value: string | { en?: string; ar?: string } | null | undefined): string => {
		if (!value) return "";
		if (typeof value === "string") return value;
		if (typeof value === "object") {
			return (
				value[currentLanguage as "en" | "ar"] || value.en || value.ar || ""
			);
		}
		return "";
	}, [currentLanguage]);

	// Transform API products to display format
	const products = useMemo(
		() =>
			apiProducts.map((product) => ({
				_id: product._id,
				name: getLocalizedProductField(product.name),
				description: getLocalizedProductField(product.description),
				image: product.image,
				price: product.price,
				category: typeof product.subcategory === "string"
					? product.subcategory
					: getLocalizedProductField(product.subcategory?.name),
			})),
		[apiProducts, getLocalizedProductField]
	);

	// Local type for cart product with quantity
	type CartProductDisplay = {
		_id: string;
		name: string;
		description: string;
		image: string;
		price: number;
		category: string;
		cartQuantity: number;
		addedAt: number;
	};

	// Update cart when localStorage changes
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === 'cart') {
				setCartItems(getCart());
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	// Get cart products
	const cartProducts: CartProductDisplay[] = useMemo(() => {
		const cartProductMap = new Map();
		cartItems.forEach(cartItem => {
			const product = products.find(p => p._id === cartItem.id);
			if (product) {
				cartProductMap.set(cartItem.id, {
					...product,
					cartQuantity: cartItem.quantity,
					addedAt: cartItem.addedAt
				});
			}
		});
		return Array.from(cartProductMap.values()).sort((a, b) => b.addedAt - a.addedAt);
	}, [products, cartItems]);

	// Calculate totals
	const subtotal = useMemo(() => getCartTotal(products), [products]);
	const vat = useMemo(() => subtotal * 0.05, [subtotal]); // 5% VAT
	const total = useMemo(() => subtotal + vat + shippingCost, [subtotal, vat, shippingCost]);

	// Get shipping options from API
	const { data: shippingOptions = [], isLoading: shippingLoading } = useShippingOptions();

	// Payment methods
    const paymentMethods = [
        {
            id: "bank_transfer",
            name: t('paymentDirectBankTransfer'),
            description: t('paymentDirectBankTransferDesc'),
            icon: <Banknote className="w-5 h-5" />,
        },
        {
            id: "credit_card",
            name: t('paymentCreditCardOnDelivery'),
            description: t('paymentCreditCardOnDeliveryDesc'),
            icon: <CreditCard className="w-5 h-5" />,
        },
        {
            id: "cod",
            name: t('paymentCashOnDelivery'),
            description: t('paymentCashOnDeliveryDesc'),
            icon: <Truck className="w-5 h-5" />,
        },
    ];

	const formatPrice = (price: number) => {
		const formattedPrice = new Intl.NumberFormat("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(price);
		return formattedPrice;
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
		}));
	};

	const handleShippingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedShipping = shippingOptions.find(shipping => shipping._id === e.target.value);
		setShippingCost(selectedShipping?.price || 0);
		setFormData(prev => ({
			...prev,
			shippingOption: e.target.value
		}));
	};

	const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const country = e.target.value;
		setFormData(prev => ({
			...prev,
			country,
			shippingOption: "" // Reset shipping option when country changes
		}));
		setShippingCost(0); // Reset shipping cost
	};

	// Country options
	const countryOptions = [
		{ value: "UAE", label: t('UAE') },
		{ value: "SA", label: t('SA') },
		{ value: "KW", label: t('KW') },
		{ value: "QA", label: t('QA') },
		{ value: "BH", label: t('BH') },
		{ value: "OM", label: t('OM') },
		{ value: "OTHER", label: t('otherCountry') }
	].filter(country => country.value !== "")	;

	// Filter shipping options based on selected country
	const availableShippingOptions = useMemo(() => {
		if (formData.country === "UAE") {
			return shippingOptions; // Show all API shipping options for UAE
		}
		return []; // No options for non-UAE countries
	}, [formData.country, shippingOptions]);

	const handleCouponSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle coupon logic here
		toast.success("Coupon applied successfully!");
		setShowCoupon(false);
	};

	const handleCheckout = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Validate form
			if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.country || !formData.address) {
				toast.error("Please fill in all required fields.");
				return;
			}

			// Validate shipping option only for UAE
			if (formData.country === "UAE" && !formData.shippingOption) {
				toast.error("Please select a shipping method.");
				return;
			}

			// Simulate order processing
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			// Build invoice payload to pass to invoice page
			const now = new Date();
			const invoicePayload = {
				invoiceNumber: `${now.getFullYear().toString().slice(-2)}-${(now.getMonth()+1)
					.toString()
					.padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getTime().toString().slice(-4)}`,
				date: now.toLocaleDateString(),
				dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
				customerName: `${formData.firstName} ${formData.lastName}`.trim(),
				customerEmail: formData.email,
				customerPhone: formData.phone,
				customerPhoneType: formData.phoneType,
				customerAddress: `${formData.address}${formData.country ? `, ${formData.country}` : ''}`,
				items: cartProducts.map((p) => ({
					name: p.name,
					quantity: p.cartQuantity,
					price: p.price,
					total: p.price * p.cartQuantity,
				})),
				subtotal: subtotal,
				shipping: shippingCost,
				vat: vat,
				total: total,
				paymentMethod: formData.paymentMethod,
				notes: formData.orderNotes,
			};
			
			// Clear cart
			clearCart();
			setCartItems([]);
			
			// Show success message
			toast.success("Order placed successfully!", {
				duration: 5000,
				icon: '🎉',
			});
			
			// Redirect to invoice page with invoice payload
			navigate("/invoice", { state: invoicePayload });
		} catch {
			toast.error("Failed to place order. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Redirect if cart is empty
	if (cartItems.length === 0) {
		return (
			<div className='min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
					<div className='text-center py-20'>
						<ShoppingCart className='w-16 h-16 text-primary-600 mx-auto mb-4' />
						<h3 className='text-2xl font-semibold text-gray-900 mb-2'>
							{t('cartEmpty')}
						</h3>
						<p className='text-gray-600 mb-6'>
							{t('emptyCartHint')}
						</p>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => navigate("/products")}
							className='inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors'>
							<span>{t('browseProducts')}</span>
							<ArrowRight className='w-5 h-5' />
						</motion.button>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24'>
				<div className='flex items-center justify-center w-full h-[calc(100vh-6rem)] px-4 sm:px-6 lg:px-8'>
					<div className='text-center'>
						<div className='animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4'></div>
						<p className='text-gray-600'>{t('loading')}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='text-center mb-12'>
					<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
						{t('checkoutSubtitle')}
					</p>

					<AnimatePresence>
						{showCoupon && (
							<motion.form
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								onSubmit={handleCouponSubmit}
								className='mt-4 bg-white rounded-xl border border-gray-200 p-6'>
								<p className='text-gray-600 mb-4'>{t('couponDescription')}</p>
								<div className='flex space-x-4'>
									<input
										type='text'
										value={couponCode}
										onChange={(e) => setCouponCode(e.target.value)}
										placeholder={t('couponCode')}
										className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
									/>
									<button
										type='submit'
										className='bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors'>
										{t('applyCoupon')}
									</button>
								</div>
							</motion.form>
						)}
					</AnimatePresence>
				</motion.div>

				<form onSubmit={handleCheckout} className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Checkout Form */}
					<div className='lg:col-span-2 space-y-8'>
						{/* Billing Details */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className='bg-white rounded-2xl shadow-lg p-6'>
							<h3 className='text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-3'>
								<User className='w-6 h-6 text-primary-600' />
								<span>{t('billingDetails')}</span>
							</h3>

							<div className='space-y-8'>
								{/* Contact Details Section */}
								<div>
									<h4 className='text-lg font-medium text-gray-900 mb-6'>{t('contactDetails')}</h4>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-3'>
												{t('firstName')} <span className='text-red-500'>*</span>
											</label>
											<input
												type='text'
												name='firstName'
												value={formData.firstName}
												onChange={handleInputChange}
												required
												className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-3'>
												{t('lastName')} <span className='text-red-500'>*</span>
											</label>
											<input
												type='text'
												name='lastName'
												value={formData.lastName}
												onChange={handleInputChange}
												required
												className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-3'>
												{t('phone')} <span className='text-red-500'>*</span>
											</label>
											<div className='space-y-4'>
												{/* Phone Type Selection */}
												
												{/* Phone Number Input */}
												<input
													type='tel'
													name='phone'
													value={formData.phone}
													onChange={handleInputChange}
													required
													className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
												/>
											</div>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-3 '>
												{t('email')} <span className='text-red-500'>*</span>
											</label>
											<input
												type='email'
												name='email'
												value={formData.email}
												onChange={handleInputChange}
												required
												className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
											/>
										</div>
									</div>
								</div>

								{/* Address Section */}
								<div className='mt-8'>
									<h4 className='text-lg font-medium text-gray-900 mb-6 flex items-center space-x-3'>
										<MapPin className='w-5 h-5 text-primary-600' />
										<span>{t('address')}</span>
									</h4>
									<div className='space-y-6'>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-3'>
												{t('country')} <span className='text-red-500'>*</span>
											</label>
											<select
												name='country'
												value={formData.country}
												onChange={handleCountryChange}
												required
												className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'>
												{countryOptions.map((country) => (
													<option key={country.value} value={country.value}>
														{country.label}
													</option>
												))}
											</select>
										</div>
										{
											formData.country === "OTHER" && (
												<div>
													<label className='block text-sm font-medium text-gray-700 mb-3'>
														{t('enterCountry')} <span className='text-red-500'>*</span>
													</label>
													<input type='text' name='otherCountry' onChange={handleInputChange}
													 required className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent' />
												</div>
											)
										}
										{formData.country === "UAE" && (
											<div>
												<label className='block text-sm font-medium text-gray-700 mb-3'>
													{t('shippingMethod')} <span className='text-red-500'>*</span>
												</label>
												<select
													name='shippingOption'
													value={formData.shippingOption}
													onChange={handleShippingChange}
													required
													disabled={shippingLoading}
													className='w-full px-4 py-3 border
													 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50'>
													<option value=''>
														{shippingLoading ? t('loading') : t('selectShippingMethod')}
													</option>
													{availableShippingOptions.map((shipping) => (
														<option key={shipping._id} value={shipping._id}>
															{shipping.name} ({shipping.price === 0 ? t('free') : `+${shipping.price}`})
														</option>
													))}
												</select>
											</div>
										)}
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-3'>
												{t('streetAddress')} <span className='text-red-500'>*</span>
											</label>
											<input
												type='text'
												name='address'
												value={formData.address}
												onChange={handleInputChange}
												required
												className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
											/>
										</div>
										<div className='flex space-x-4'>
													<label className='flex items-center space-x-2 cursor-pointer'>
														<input
															type='radio'
															name='phoneType'
															value='home'
															checked={formData.phoneType === 'home'}
															onChange={handleInputChange}
															className='w-4 h-4 mx-2 text-primary-600 border-gray-300 focus:ring-primary-500'
														/>
														<span className='text-sm text-gray-700'>{t('homePhone')}</span>
													</label>
													<label className='flex items-center space-x-2 cursor-pointer'>
														<input
															type='radio'
															name='phoneType'
															value='clinic'
															checked={formData.phoneType === 'clinic'}
															onChange={handleInputChange}
															className='w-4 h-4 text-primary-600 mx-2 border-gray-300 focus:ring-primary-500'
														/>
														<span className='text-sm text-gray-700'>{t('clinicPhone')}</span>
													</label>
												</div>
									</div>
								</div>

							</div>
						</motion.div>

						{/* Additional Information */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className='bg-white rounded-2xl shadow-lg p-6'>
							<h3 className='text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-3'>
								<FileText className='w-6 h-6 text-primary-600' />
								<span>{t('additionalInfo')}</span>
							</h3>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-3'>
									{t('orderNotes')} <span className='text-gray-500'>({t('optional')})</span>
								</label>
								<textarea
									name='orderNotes'
									value={formData.orderNotes}
									onChange={handleInputChange}
									rows={3}
									placeholder={t('orderNotesPlaceholder')}
									className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
								/>
							</div>
							<p className='mt-4 text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg'>
								{t('deliveryNotice')}
							</p>
						</motion.div>
					</div>

					{/* Order Summary */}
					<div className='lg:col-span-1'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
							className='bg-white rounded-2xl shadow-lg p-6 sticky top-24'>
							<h3 className='text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-3'>
								<ShoppingCart className='w-6 h-6 text-primary-600' />
								<span>{t('yourOrder')}</span>
							</h3>

							{/* Order Items */}
							<div className='space-y-6 mb-8'>
								{cartProducts.map((product) => (
									<div key={product._id} className='flex items-center space-x-3 py-3 border-b border-gray-100'>
										<img
											src={product.image}
											alt={product.name}
											className='w-12 h-12 object-cover rounded-lg mx-2'
										/>
										<div className='flex-1'>
											<h4 className='text-sm font-medium text-gray-900 line-clamp-2'>
												{product.name}
											</h4>
											<p className='text-xs text-gray-500'>× {product.cartQuantity}</p>
										</div>
										<div className='flex items-center space-x-1'>
											<span className='text-sm font-semibold mx-2 text-primary-600'>
												{formatPrice(product.price * product.cartQuantity)}
											</span>
											<DirhamIcon className="w-3 h-3 text-primary-600" />
										</div>
									</div>
								))}
							</div>

							{/* Order Totals */}
							<div className='space-y-4 mb-8'>
								<div className='flex justify-between text-sm'>
									<span className='text-gray-600'>{t('subtotal')}</span>
									<div className='flex items-center space-x-1'>
										<span className='font-medium mx-2'>{formatPrice(subtotal)}</span>
										<DirhamIcon className="w-3 h-3 mx-2 text-gray-600" />
									</div>
								</div>
								<div className='flex justify-between text-sm'>
									<span className='text-gray-600'>{t('shipping')}</span>
									<div className='flex items-center space-x-1'>
										<span className='font-medium mx-2'>
											{shippingCost > 0 ? formatPrice(shippingCost) : t('free')}
										</span>
										{shippingCost > 0 && <DirhamIcon className="w-3 h-3 mx-2 text-gray-600" />}
									</div>
								</div>
								<div className='flex justify-between text-sm'>
									<span className='text-gray-600'>{t('vat')} (5%)</span>
									<div className='flex items-center space-x-1'>
										<span className='font-medium mx-2'>{formatPrice(vat)}</span>
										<DirhamIcon className="w-3 h-3 mx-2text-gray-600" />
									</div>
								</div>
								<div className='border-t border-gray-200 pt-3'>
									<div className='flex justify-between text-lg font-semibold'>
										<span>{t('total')}</span>
										<div className='flex items-center space-x-1'>
											<span className='text-primary-600 mx-2'>{formatPrice(total)}</span>
											<DirhamIcon className="w-4 h-4 text-primary-600" />
										</div>
									</div>
								</div>
							</div>

							{/* Payment Methods */}
							<div className='mb-8'>
								<h4 className='text-lg font-medium text-gray-900 mb-6'>{t('paymentMethods')}</h4>
								<div className='space-y-4'>
									{paymentMethods.map((method) => (
										<label
											key={method.id}
											className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
												formData.paymentMethod === method.id
													? 'border-primary-500 bg-primary-50'
													: 'border-gray-200 hover:border-gray-300'
											}`}>
											<input
												type='radio'
												name='paymentMethod'
												value={method.id}
												checked={formData.paymentMethod === method.id}
												onChange={handleInputChange}
												className='mt-1 w-4 mx-2 h-4 mx-2 text-primary-600 border-gray-300 focus:ring-primary-500'
											/>
											<div className='flex-1'>
												<div className='flex items-center space-x-3 gap-2'>
													{method.icon}
													<span className='font-medium mx-2 text-gray-900'>{method.name}</span>
												</div>
												<p className='text-sm text-gray-600 mt-1'>{method.description}</p>
											</div>
										</label>
									))}
								</div>
								
								{/* Bank Account Link - Show only when bank transfer is selected */}
								{formData.paymentMethod === 'bank_transfer' && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: 'auto' }}
										exit={{ opacity: 0, height: 0 }}
										className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'
									>
										<div className='flex items-center'>
											<Banknote  className='w-8 h-8 text-blue-600' />
												
										
											<Link
												to='/bank-account'
												target='_blank'
												rel='noopener noreferrer'
												className='inline-flex items-center mx-2
												text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors'
											>
												<span>{t('viewBankDetails')}</span>
												<ArrowRight className='w-4 h-4 mx-2' />
											</Link>
										</div>
									</motion.div>
								)}
							</div>

							{/* Terms and Conditions */}
							<div className='mb-6'>
								<label className='flex items-start space-x-3'>
									<input
										type='checkbox'
										name='termsAccepted'
										checked={formData.termsAccepted}
										onChange={handleInputChange}
										required
										className='mt-1 w-4 h-4 mx-2 text-primary-600 border-gray-300 rounded focus:ring-primary-500'
									/>
									<span className='text-sm text-gray-700'>
										{t('termsAgreement')}{' '}
										<a href='/terms' className='text-primary-600 hover:underline' target='_blank' rel='noopener noreferrer'>
											{t('termsAndConditions')}
										</a>
									</span>
								</label>
							</div>

							{/* Place Order Button */}
							<motion.button
								type='submit'
								disabled={isSubmitting || !formData.termsAccepted}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center space-x-2 ${
									isSubmitting || !formData.termsAccepted
										? 'bg-gray-400 text-gray-200 cursor-not-allowed'
										: 'bg-primary-600 text-white hover:bg-primary-700'
								}`}>
								{isSubmitting ? (
									<>
										<div className='animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent'></div>
										<span>{t('processingOrder')}</span>
									</>
								) : (
									<>
										<CheckCircle className='w-5 h-5 mx-2' />
										<span>{t('placeOrder')}</span>
									</>
								)}
							</motion.button>
						</motion.div>
					</div>
				</form>
			</div>
			<Footer />
		</div>
	);
};

export default Checkout;


