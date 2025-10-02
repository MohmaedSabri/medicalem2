/** @format */

export interface CartItem {
	id: string;
	quantity: number;
	addedAt: number; // timestamp for sorting
}

export const CART_KEY = "cart";

export const getCart = (): CartItem[] => {
	try {
		const raw = localStorage.getItem(CART_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
	} catch {
		return [];
	}
};

export const setCart = (items: CartItem[]) => {
	try {
		localStorage.setItem(CART_KEY, JSON.stringify(items));
	} catch {
		/* no-op */
	}
};

export const isInCart = (id: string): boolean => {
	return getCart().some(item => item.id === id);
};

export const getCartItem = (id: string): CartItem | undefined => {
	return getCart().find(item => item.id === id);
};

export const addToCart = (id: string, quantity: number = 1): CartItem[] => {
	const current = getCart();
	const existingItem = current.find(item => item.id === id);
	
	if (existingItem) {
		// Update quantity if item already exists
		const updated = current.map(item =>
			item.id === id
				? { ...item, quantity: item.quantity + quantity }
				: item
		);
		setCart(updated);
		return updated;
	} else {
		// Add new item
		const newItem: CartItem = {
			id,
			quantity,
			addedAt: Date.now()
		};
		const updated = [...current, newItem];
		setCart(updated);
		return updated;
	}
};

export const removeFromCart = (id: string): CartItem[] => {
	const current = getCart();
	const updated = current.filter(item => item.id !== id);
	setCart(updated);
	return updated;
};

export const updateCartItemQuantity = (id: string, quantity: number): CartItem[] => {
	if (quantity <= 0) {
		return removeFromCart(id);
	}
	
	const current = getCart();
	const updated = current.map(item =>
		item.id === id
			? { ...item, quantity }
			: item
	);
	setCart(updated);
	return updated;
};

export const clearCart = (): CartItem[] => {
	setCart([]);
	return [];
};

export const getCartItemCount = (): number => {
	return getCart().reduce((total, item) => total + item.quantity, 0);
};

export const getCartTotal = (products: { _id: string; price: number }[]): number => {
	const cart = getCart();
	return cart.reduce((total, cartItem) => {
		const product = products.find(p => p._id === cartItem.id);
		return total + (product ? product.price * cartItem.quantity : 0);
	}, 0);
};
