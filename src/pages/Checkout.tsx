/** @format */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
	ShoppingCart, 
	ArrowRight, 
	CreditCard, 
	Banknote, 
	Truck, 
	Shield, 
	MapPin,
	User,
	Mail,
	Phone,
	FileText,
	CheckCircle
} from "lucide-react";
import { getCart, getCartTotal, clearCart, CartItem } from "../utils/cart";
import { useProducts } from "../hooks/useProducts";
import { useLanguage } from "../contexts/LanguageContext";
import Footer from "../components/layout/Footer";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

interface CheckoutFormData {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	emirate: string;
	address: string;
	orderNotes: string;
	paymentMethod: string;
	createAccount: boolean;
	password: string;
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
	const { data: apiProducts = [], isLoading: loading, error } = useProducts();

	// Form state
	const [formData, setFormData] = useState<CheckoutFormData>({
		firstName: "",
		lastName: "",
		phone: "",
		email: "",
		emirate: "",
		address: "",
		orderNotes: "",
		paymentMethod: "bank_transfer",
		createAccount: false,
		password: "",
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
	const cartProducts = useMemo(() => {
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

	// Emirates with shipping costs
	const emirates = [
		{ name: "Dubai", cost: 10 },
		{ name: "Abu Dhabi", cost: 15 },
		{ name: "Sharjah", cost: 10 },
		{ name: "Al Ain", cost: 15 },
		{ name: "Ajman", cost: 10 },
		{ name: "Ras Al Khaimah", cost: 15 },
		{ name: "Fujairah", cost: 15 },
		{ name: "Umm Al Quwain", cost: 15 },
		{ name: "Khor Fakkan", cost: 15 },
		{ name: "Kalba", cost: 60 },
	];

	// Payment methods
	const paymentMethods = [
		{
			id: "bank_transfer",
			name: "Direct bank transfer",
			description: "Make your payment directly into our bank account. Please use your Order ID as the payment reference.",
			icon: <Banknote className="w-5 h-5" />,
		},
		{
			id: "credit_card",
			name: "Credit Card on Delivery",
			description: "Pay using your credit card on delivery.",
			icon: <CreditCard className="w-5 h-5" />,
		},
		{
			id: "paypal",
			name: "PayPal",
			description: "Pay via PayPal; you can pay with your credit card if you don't have a PayPal account.",
			icon: <CreditCard className="w-5 h-5" />,
		},
		{
			id: "cod",
			name: "Cash on delivery",
			description: "Pay with cash upon delivery.",
			icon: <Truck className="w-5 h-5" />,
		},
	];

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "AED",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(price);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
		}));
	};

	const handleEmirateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedEmirate = emirates.find(e => e.name === e.target.value);
		setShippingCost(selectedEmirate?.cost || 0);
		setFormData(prev => ({
			...prev,
			emirate: e.target.value
		}));
	};

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
			// Simulate order processing
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			// Clear cart
			clearCart();
			setCartItems([]);
			
			// Show success message
			toast.success("Order placed successfully!", {
				duration: 5000,
				icon: '🎉',
			});
			
			// Redirect to success page or home
			navigate("/");
		} catch (error) {
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
						<ShoppingCart className='w-16 h-16 text-teal-600 mx-auto mb-4' />
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
							className='inline-flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors'>
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
						<div className='animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600 mx-auto mb-4'></div>
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
										className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
									/>
									<button
										type='submit'
										className='bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors'>
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
							<h3 className='text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2'>
								<User className='w-6 h-6 text-teal-600' />
								<span>{t('billingDetails')}</span>
							</h3>

							<div className='space-y-6'>
								{/* Contact Details Section */}
								<div>
									<h4 className='text-lg font-medium text-gray-900 mb-4'>{t('contactDetails')}</h4>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												{t('firstName')} <span className='text-red-500'>*</span>
											</label>
											<input
												type='text'
												name='firstName'
												value={formData.firstName}
												onChange={handleInputChange}
												required
												className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												{t('lastName')} <span className='text-red-500'>*</span>
											</label>
											<input
												type='text'
												name='lastName'
												value={formData.lastName}
												onChange={handleInputChange}
												required
												className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												{t('phone')} <span className='text-red-500'>*</span>
											</label>
											<input
												type='tel'
												name='phone'
												value={formData.phone}
												onChange={handleInputChange}
												required
												className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												{t('email')} <span className='text-red-500'>*</span>
											</label>
											<input
												type='email'
												name='email'
												value={formData.email}
												onChange={handleInputChange}
												required
												className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
											/>
										</div>
									</div>
								</div>

								{/* Address Section */}
								<div>
									<h4 className='text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2'>
										<MapPin className='w-5 h-5 text-teal-600' />
										<span>{t('address')}</span>
									</h4>
									<div className='space-y-4'>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												{t('emirate')} <span className='text-red-500'>*</span>
											</label>
											<select
												name='emirate'
												value={formData.emirate}
												onChange={handleEmirateChange}
												required
												className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'>
												<option value=''>{t('selectEmirate')}</option>
												{emirates.map((emirate) => (
													<option key={emirate.name} value={emirate.name}>
														{emirate.name} (+{emirate.cost} AED)
													</option>
												))}
											</select>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												{t('streetAddress')} <span className='text-red-500'>*</span>
											</label>
											<input
												type='text'
												name='address'
												value={formData.address}
												onChange={handleInputChange}
												required
												placeholder={t('streetAddressPlaceholder')}
												className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
											/>
										</div>
									</div>
								</div>

								{/* Create Account */}
								<div className='border-t border-gray-200 pt-6'>
									<label className='flex items-center space-x-3'>
										<input
											type='checkbox'
											name='createAccount'
											checked={formData.createAccount}
											onChange={handleInputChange}
											className='w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500'
										/>
										<span className='text-sm font-medium text-gray-700'>{t('createAccount')}</span>
									</label>
									{formData.createAccount && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: 'auto' }}
											className='mt-4'>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												{t('password')} <span className='text-red-500'>*</span>
											</label>
											<input
												type='password'
												name='password'
												value={formData.password}
												onChange={handleInputChange}
												required={formData.createAccount}
												className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
											/>
										</motion.div>
									)}
								</div>
							</div>
						</motion.div>

						{/* Additional Information */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className='bg-white rounded-2xl shadow-lg p-6'>
							<h3 className='text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2'>
								<FileText className='w-6 h-6 text-teal-600' />
								<span>{t('additionalInfo')}</span>
							</h3>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
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
							<h3 className='text-2xl font-semibold text-gray-900 mb-6 flex items-center space-x-2'>
								<ShoppingCart className='w-6 h-6 text-teal-600' />
								<span>{t('yourOrder')}</span>
							</h3>

							{/* Order Items */}
							<div className='space-y-4 mb-6'>
								{cartProducts.map((product) => (
									<div key={product._id} className='flex items-center space-x-3 py-3 border-b border-gray-100'>
										<img
											src={product.image}
											alt={product.name}
											className='w-12 h-12 object-cover rounded-lg'
										/>
										<div className='flex-1'>
											<h4 className='text-sm font-medium text-gray-900 line-clamp-2'>
												{product.name}
											</h4>
											<p className='text-xs text-gray-500'>× {product.cartQuantity}</p>
										</div>
										<span className='text-sm font-semibold text-teal-600'>
											{formatPrice(product.price * product.cartQuantity)}
										</span>
									</div>
								))}
							</div>

							{/* Order Totals */}
							<div className='space-y-3 mb-6'>
								<div className='flex justify-between text-sm'>
									<span className='text-gray-600'>{t('subtotal')}</span>
									<span className='font-medium'>{formatPrice(subtotal)}</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span className='text-gray-600'>{t('shipping')}</span>
									<span className='font-medium'>
										{shippingCost > 0 ? formatPrice(shippingCost) : t('free')}
									</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span className='text-gray-600'>{t('vat')} (5%)</span>
									<span className='font-medium'>{formatPrice(vat)}</span>
								</div>
								<div className='border-t border-gray-200 pt-3'>
									<div className='flex justify-between text-lg font-semibold'>
										<span>{t('total')}</span>
										<span className='text-teal-600'>{formatPrice(total)}</span>
									</div>
								</div>
							</div>

							{/* Payment Methods */}
							<div className='mb-6'>
								<h4 className='text-lg font-medium text-gray-900 mb-4'>{t('paymentMethods')}</h4>
								<div className='space-y-3'>
									{paymentMethods.map((method) => (
										<label
											key={method.id}
											className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
												formData.paymentMethod === method.id
													? 'border-teal-500 bg-teal-50'
													: 'border-gray-200 hover:border-gray-300'
											}`}>
											<input
												type='radio'
												name='paymentMethod'
												value={method.id}
												checked={formData.paymentMethod === method.id}
												onChange={handleInputChange}
												className='mt-1 w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500'
											/>
											<div className='flex-1'>
												<div className='flex items-center space-x-2'>
													{method.icon}
													<span className='font-medium text-gray-900'>{method.name}</span>
												</div>
												<p className='text-sm text-gray-600 mt-1'>{method.description}</p>
											</div>
										</label>
									))}
								</div>
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
										className='mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500'
									/>
									<span className='text-sm text-gray-700'>
										{t('termsAgreement')}{' '}
										<a href='/terms' className='text-teal-600 hover:underline' target='_blank' rel='noopener noreferrer'>
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
										: 'bg-teal-600 text-white hover:bg-teal-700'
								}`}>
								{isSubmitting ? (
									<>
										<div className='animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent'></div>
										<span>{t('processingOrder')}</span>
									</>
								) : (
									<>
										<CheckCircle className='w-5 h-5' />
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
