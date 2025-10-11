

export const endpoints = {
	// User Authentication
	USERS_LOGIN: "/users/login",
	
	// Products
	PRODUCTS: "/products",
	PRODUCTS_BY_ID: "/products/:id",
	PRODUCTS_BY_CATEGORY: "/products/category/:category",
	PRODUCTS_BY_SUBCATEGORY: "/products/subcategory/:subcategory",
	PRODUCT_REVIEWS: "/products/:productId/reviews",
	
	// Categories
	CATEGORIES: "/categories",
	CATEGORIES_BY_ID: "/categories/:id",
	SUBCATEGORIES: "/subcategories",
	SUBCATEGORIES_BY_ID: "/subcategories/:id",
	SUBCATEGORIES_BY_PARENT: "/subcategories/parent/:parentId",
	
	// Reviews
	REVIEWS: "/reviews",
	REVIEWS_BY_ID: "/reviews/:id",
	REVIEWS_BY_USER: "/reviews/user/:user",
	REVIEWS_BY_RATING: "/reviews/rating/:rating",
	REVIEWS_BY_PRODUCT: "/reviews/product/:productId",
	
	// Posts
	POSTS: "/posts",
	POSTS_BY_ID: "/posts/:id",
	POSTS_FEATURED: "/posts/featured",
	POSTS_SEARCH: "/posts/search",
	POSTS_BY_AUTHOR: "/posts/author/:email",
	POSTS_BY_CATEGORY: "/posts/category/:category",
	POSTS_STATS: "/posts/stats",
	POSTS_LIKE: "/posts/:id/like",
	POSTS_COMMENTS: "/posts/:id/comments",
	POSTS_COMMENT_BY_ID: "/posts/:postId/comments/:commentId",
	
	// Doctors
	DOCTORS: "/doctors",
	DOCTORS_BY_ID: "/doctors/:id",
	DOCTORS_SEARCH: "/doctors/search",
	DOCTORS_BY_SPECIALIZATION: "/doctors/specialization/:specialization",
	DOCTORS_RATING: "/doctors/:id/rating",
	
	// Contact Info
	CONTACT_INFO: "/contact-info",
	CONTACT_INFO_PARTNERS: "/contact-info/partners",
	CONTACT_INFO_PARTNER_BY_ID: "/contact-info/partners/:id",
	
	// Shipping
	SHIPPING: "/shipping",
	SHIPPING_BY_ID: "/shipping/:id",
	SHIPPING_BULK: "/shipping/bulk",
};