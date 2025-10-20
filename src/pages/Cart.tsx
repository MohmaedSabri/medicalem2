/** @format */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowRight, Plus, Minus, Trash2 } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { getCart, removeFromCart, updateCartItemQuantity, clearCart, getCartTotal, CartItem } from "../utils/cart";
import { toast } from "react-hot-toast";
import { useLanguage } from "../contexts/LanguageContext";
import Footer from "../components/layout/Footer";
import { useTranslation } from "react-i18next";

const Cart: React.FC = () => {
	const navigate = useNavigate();
	const { currentLanguage } = useLanguage();
	const { t } = useTranslation();
	const [cartItems, setCartItems] = useState<CartItem[]>(getCart());

	// Use the same hook as ProductsPage for consistency
	const { data: apiProducts = [], isLoading: loading, error } = useProducts();

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

	// Transform API products to display format using useMemo for performance
	const products = useMemo(
		() =>
			apiProducts.map((product) => ({
				_id: product._id,
				name: getLocalizedProductField(product.name),
				description: getLocalizedProductField(product.description),
				longDescription: getLocalizedProductField(product.longDescription),
				image: product.image,
				images: product.images,
				category:
					typeof product.subcategory === "string"
						? product.subcategory
						: getLocalizedProductField(product.subcategory?.name),
				price: product.price,
				rating: product.averageRating || 0,
				reviews: product.reviews || [],
				features: (product.features || []).map((f) =>
					getLocalizedProductField(f)
				),
				specifications: product.specifications,
				inStock: product.inStock,
				stockQuantity: product.stockQuantity,
				shipping: getLocalizedProductField(product.shipping),
				warranty: getLocalizedProductField(product.warranty),
				certifications: product.certifications,
			})),
		[apiProducts, getLocalizedProductField]
	);

	// Update cart when localStorage changes (e.g., from other pages)
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			// Only update if the cart key changed
			if (e.key === 'cart') {
				setCartItems(getCart());
			}
		};

		// Listen for storage events (changes from other tabs/windows)
		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	const handleRemoveFromCart = useCallback((id: string) => {
		const product = products.find(p => p._id === id);
		const updated = removeFromCart(id);
		setCartItems(updated);
		
		if (product) {
			toast.success(
				`${product.name} ${t('removedFromCartMessage')}`,
				{
					duration: 2000,
					icon: '🗑️',
					style: {
						background: '#ef4444',
						color: '#fff',
					},
				}
			);
		}
	}, [products, t]);

	const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
		const updated = updateCartItemQuantity(id, quantity);
		setCartItems(updated);
	}, []);

	const handleClearCart = useCallback(() => {
		const updated = clearCart();
		setCartItems(updated);
		
		toast.success(
			t('cartClearedMessage'),
			{
				duration: 2000,
				icon: '🧹',
				style: {
					background: '#f59e0b',
					color: '#fff',
				},
			}
		);
	}, [t]);

	// Filter products to show only cart items using useMemo for performance
	const cartProducts = useMemo(
		() => {
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
		},
		[products, cartItems]
	);

    const renderPrice = (amount: number, size: 'sm' | 'md' = 'md') => {
        const numberText = amount.toLocaleString();
        const iconClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
        const valueClass = size === 'sm' ? 'text-sm' : 'text-base';
        return (
            <span className={`inline-flex items-center gap-2 ${valueClass}`}>
                <img src={'/Dirham%20Currency%20Symbol%20-%20Black.svg'} alt='AED' className={iconClass} />
                <span>{numberText}</span>
            </span>
        );
    };

	const cartTotal = useMemo(() => getCartTotal(products), [products]);
	const totalItems = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);

	// Error state
	if (error) {
		return (
			<div className='min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
					<div className='text-center py-20'>
						<div className='text-red-500 mb-4'>
							<ShoppingCart className='w-16 h-16 mx-auto mb-4' />
						</div>
						<h3 className='text-2xl font-semibold text-gray-900 mb-2'>
							{t('errorLoadingCartTitle')}
						</h3>
						<p className='text-gray-600 mb-6'>
							{t('errorLoadingCartDescription')}
						</p>
						<button
							onClick={() => window.location.reload()}
							className='bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors'>
							{t('retry')}
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Loading state
	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 pt-16 sm:pt-20 lg:pt-24'>
				<div className='flex items-center justify-center w-full h-[calc(100vh-6rem)] px-4 sm:px-6 lg:px-8'>
					<div className='text-center'>
						<div className='animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4'></div>
						<p className='text-gray-600'>{t('loadingCart')}</p>
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
						{t('cartSubtitle')}
					</p>
				</motion.div>

				{/* Cart Content */}
				{cartProducts.length === 0 ? (
					<div className='text-center py-20'>
						<ShoppingCart className='w-12 h-12 text-primary-600 mx-auto mb-4' />
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
				) : (
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
						{/* Cart Items */}
						<div className='lg:col-span-2'>
							<div className='flex items-center justify-between mb-6'>
								<h2 className='text-2xl font-semibold text-gray-900'>
									{t('cartItems')} ({totalItems})
								</h2>
								{totalItems > 0 && (
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={handleClearCart}
										className='text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1'>
										<Trash2 className='w-4 h-4' />
										<span>{t('clearCart')}</span>
									</motion.button>
								)}
							</div>

							<div className='space-y-4'>
								<AnimatePresence>
									{cartProducts.map((product) => (
										<motion.div
											key={product._id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100'>
											<div className='flex items-center p-4'>
												{/* Product Image */}
												<div className='flex-shrink-0 mx-4 w-20 h-20 sm:w-24 sm:h-24'>
													<img
														src={product.image}
														alt={product.name}
														className='w-full h-full object-cover rounded-lg'
													/>
												</div>

												{/* Product Details */}
												<div className='flex-1 ml-4 sm:ml-6'>
													<h3 className='text-lg font-semibold text-gray-900 mb-1'>
														{product.name}
													</h3>
													<p className='text-gray-600 text-sm line-clamp-2 mb-2'>
														{product.description}
													</p>
                                                    <div className='text-primary-600 font-bold text-lg'>
                                                        {renderPrice(product.price)}
                                                    </div>
												</div>

												{/* Quantity Controls */}
												<div className='flex items-center space-x-3'>
													<div className='flex items-center border border-gray-300 rounded-lg'>
														<motion.button
															whileHover={{ scale: 1.1 }}
															whileTap={{ scale: 0.9 }}
															onClick={() => handleUpdateQuantity(product._id, product.cartQuantity - 1)}
															className='p-2 hover:bg-gray-100 transition-colors'>
															<Minus className='w-4 h-4' />
														</motion.button>
														<span className='px-3 py-2 text-sm font-medium min-w-[3rem] text-center'>
															{product.cartQuantity}
														</span>
														<motion.button
															whileHover={{ scale: 1.1 }}
															whileTap={{ scale: 0.9 }}
															onClick={() => handleUpdateQuantity(product._id, product.cartQuantity + 1)}
															className='p-2 hover:bg-gray-100 transition-colors'>
															<Plus className='w-4 h-4' />
														</motion.button>
													</div>

													{/* Remove Button */}
													<motion.button
														whileHover={{ scale: 1.1 }}
														whileTap={{ scale: 0.9 }}
														onClick={() => handleRemoveFromCart(product._id)}
														className='p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'>
														<Trash2 className='w-4 h-4' />
													</motion.button>
												</div>
											</div>
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						</div>

						{/* Cart Summary */}
						<div className='lg:col-span-1'>
							<div className='bg-white rounded-2xl shadow-lg p-6 sticky top-24'>
								<h3 className='text-xl font-semibold text-gray-900 mb-4'>
									{t('orderSummary')}
								</h3>
								
								<div className='space-y-3 mb-6'>
                                    <div className='flex justify-between text-sm items-center'>
                                        <span className='text-gray-600'>{t('subtotal')}</span>
                                        <span className='font-medium'>{renderPrice(cartTotal, 'sm')}</span>
                                    </div>
									<div className='flex justify-between text-sm'>
										<span className='text-gray-600'>{t('shipping')}</span>
										<span className='font-medium text-green-600'>{t('free')}</span>
									</div>
									<div className='border-t border-gray-200 pt-3'>
                                        <div className='flex justify-between text-lg font-semibold items-center'>
                                            <span>{t('total')}</span>
                                            <span className='text-primary-600'>{renderPrice(cartTotal)}</span>
                                        </div>
									</div>
								</div>

								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => navigate('/checkout')}
									className='w-full bg-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors mb-4'>
									{t('proceedToCheckout')}
								</motion.button>

								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => navigate("/products")}
									className='w-full border border-primary-600 text-primary-600 py-3 px-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors'>
									{t('continueShopping')}
								</motion.button>
							</div>
						</div>
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
};

export default Cart;
